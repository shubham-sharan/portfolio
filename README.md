# Shubham Sharan - Portfolio (Astro 6)

A fast, statically-generated portfolio for a Senior Product Manager - with **four switchable design systems** built in. The design itself is part of the argument: a PM who can reason about design trade-offs.

## The four designs

Switch live with the **Design** picker (bottom-right of every page), or set the default in `src/data/theme.json` → `"active"`.

| Theme | Personality | Type | Palette | Layout signature |
| --- | --- | --- | --- | --- |
| `saas` *(default)* | Modern professional | Sora + Inter | White / deep navy / indigo | Centered hero, soft elevated cards, subtle indigo glow |
| `editorial` | Calm, literary, senior | Fraunces + Inter | Warm paper / amber | Left-aligned, airy, hairline rules |
| `noir` | Bold founder energy | Space Grotesk + Inter | Near-black / vivid orange | Oversized headlines, accent-charged stats, ember glow |
| `swiss` | Rational, systematic | Archivo | Stark white / black / red | Uppercase headings, 2px grid lines, zero radius, hard shadows |

A visitor's choice persists via `localStorage`. To ship a single design: set `"active"` and delete the `theme-dock` block in `src/layouts/Base.astro`.

## Customising a design

Everything lives in `src/data/theme.json` - fonts, all 12 colors, corner radii. No CSS edits needed for color/font changes. Layout differences per theme are small override blocks at the bottom of `src/styles/global.css` (`[data-theme="…"]`), so you can adjust composition per design or add a new theme by copying a block of each.

## Run it (pnpm)

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # static site → dist/
pnpm preview
```

Built with **Astro 6.4.4**. A pre-built `dist/` is included - deployable as-is to Netlify, Vercel, Cloudflare Pages, or GitHub Pages. (If a stale `package-lock.json` exists, you can delete it - pnpm uses `pnpm-lock.yaml`.)

## All content lives in JSON

Edit `src/data/` - no component changes needed:

| File | Drives |
| --- | --- |
| `theme.json` | Design system: active theme + all theme definitions |
| `profile.json` | Hero, stats, about, CTA, contact, socials, nav, resume URL |
| `work.json` | The Work section (Huzzle, Zistre, Go Digital Lab) |
| `case-studies.json` | Case study cards + both detail pages |
| `skills.json` | Skills & tools section |
| `testimonials.json` | Quotes |
| `lifecycle.json` | Product Lifecycle page (7 stages) |
| `frameworks-index.json` | Frameworks library (searchable index) |
| `frameworks/*.json` | Framework deep-dives (markdown body as array of lines) |
| `interview-rounds/*.json` | Interview-round guides (markdown body as array of lines) |

To add a new framework page or interview round: drop a new JSON file in the folder with `slug`, `title`, and `body` - the page is generated automatically.

## Placeholders to fill in

- `profile.json` → `contact.email` (currently `your@email.com`), social URLs (currently `#`)
- `testimonials.json` → bracketed names (as on the original site)
- Resume + GetYourGuide PDF currently point at the original shubhamsharan.co URLs

## Pages

`/` · `/contact/` · `/product-lifecycle/` · `/frameworks/` + 3 deep-dives · `/interview-rounds/` × 5 rounds · `/case-study/edtech-platform/` · `/case-studies/get-your-guide/` · `404`
