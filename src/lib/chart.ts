// Inline SVG chart builder (line or bar) from data points - used by case-study pages.
export function chartSvg(c: any): string {
  const W = 720, H = 240, pl = 8, pr = 8, pt = 24, pb = 28;
  const xs = c.points.map((p: any) => p.label);
  const ys = c.points.map((p: any) => p.y);
  const maxY = c.max ?? Math.max(...ys) * 1.1;
  const minY = c.min ?? 0;
  const ix = (i: number) => pl + (i * (W - pl - pr)) / (xs.length - 1);
  const iy = (v: number) => pt + (H - pt - pb) * (1 - (v - minY) / (maxY - minY));
  let out = `<svg viewBox="0 0 ${W} ${H}" class="cs-chart-svg" role="img" aria-label="${c.label}">`;
  out += `<line x1="${pl}" y1="${H - pb}" x2="${W - pr}" y2="${H - pb}" class="cs-axis"/>`;
  if (c.type === 'bar') {
    const bw = ((W - pl - pr) / xs.length) * 0.5;
    c.points.forEach((p: any, i: number) => {
      const cx = pl + ((i + 0.5) * (W - pl - pr)) / xs.length;
      const y = iy(p.y);
      out += `<rect x="${cx - bw / 2}" y="${y}" width="${bw}" height="${H - pb - y}" class="cs-bar" rx="3"/>`;
      out += `<text x="${cx}" y="${y - 7}" class="cs-bar-val">${p.v ?? p.y}</text>`;
      out += `<text x="${cx}" y="${H - pb + 16}" class="cs-axis-x">${p.label}</text>`;
    });
  } else {
    const d = c.points.map((p: any, i: number) => `${i ? 'L' : 'M'}${ix(i)},${iy(p.y)}`).join(' ');
    const area = `${d} L${ix(xs.length - 1)},${H - pb} L${ix(0)},${H - pb} Z`;
    out += `<path d="${area}" class="cs-area"/>`;
    out += `<path d="${d}" class="cs-line"/>`;
    c.points.forEach((p: any, i: number) => {
      out += `<circle cx="${ix(i)}" cy="${iy(p.y)}" r="4" class="cs-dot"/>`;
      out += `<text x="${ix(i)}" y="${H - pb + 16}" class="cs-axis-x">${p.label}</text>`;
      if (p.v) out += `<text x="${ix(i)}" y="${iy(p.y) - 10}" class="cs-bar-val">${p.v}</text>`;
    });
    if (c.annotationIndex != null) {
      const i = c.annotationIndex;
      out += `<line x1="${ix(i)}" y1="${pt}" x2="${ix(i)}" y2="${H - pb}" class="cs-annot-line"/>`;
      out += `<text x="${ix(i)}" y="${pt - 8}" class="cs-annot-text">${c.annotation}</text>`;
    }
  }
  out += `</svg>`;
  return out;
}
