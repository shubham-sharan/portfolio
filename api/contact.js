// Vercel Serverless Function: receives the contact form and sends an email via Resend.
// The Resend API key never reaches the browser — it lives only in this server env.
//
// Required Vercel environment variable:
//   RESEND_API_KEY   → your Resend API key
// Optional (have sensible defaults):
//   CONTACT_TO       → inbox that receives submissions (default hello@shubhamsharan.co)
//   CONTACT_FROM     → verified Resend sender (default "Portfolio <contact@shubhamsharan.co>")

function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const { name, email, subject, message, _honey } = body;

  // Honeypot: real users leave this empty; bots fill it. Pretend success.
  if (_honey) return res.status(200).json({ ok: true });

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in your name, email, and message.' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email is not configured yet.' });
  }

  const to = process.env.CONTACT_TO || 'hello@shubhamsharan.co';
  const from = process.env.CONTACT_FROM || 'Portfolio <contact@shubhamsharan.co>';

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: subject ? `Portfolio — ${subject}` : 'New message from shubhamsharan.co',
        html:
          `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
          `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
          `<p><strong>Topic:</strong> ${escapeHtml(subject || '—')}</p>` +
          `<p><strong>Message:</strong></p>` +
          `<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error('Resend error:', resp.status, detail);
      return res.status(502).json({ error: 'Could not send your message. Please email me directly.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact function error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please email me directly.' });
  }
}
