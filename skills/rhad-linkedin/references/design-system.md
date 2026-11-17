# RHAD design system for LinkedIn visuals

Tokens: `assets/tokens/rhad-tokens.css` (RHAD) and `assets/tokens/rhad45-design-system.css` + `rhad45-design-tokens.json` (RHAD45, from the owner handoff). Templates that use them: `assets/templates/`.

## Canvases

| Format | Size | Notes |
|---|---|---|
| Single image, portrait (default) | 1080 x 1350 (4:5) | Takes most feed space on mobile |
| Single image, square | 1080 x 1080 | |
| Single image, landscape | 1200 x 627 | Link-card look. Use rarely |
| Carousel / document | 1080 x 1350 per page, exported as one PDF | 5 to 10 pages usually. See `hooks-and-carousel.md` |
| Video | 1080 x 1350 or 1080 x 1080 feed, 1080 x 1920 vertical | Burn in captions |

Safe margin: 72px on all sides. Page number and footer sit inside it.

## Layout rules

- White foundation. Ink type. One red accent per frame.
- Strong **left alignment**. Large headline top-left. Footer line bottom.
- One idea per frame. If a slide needs two, split it.
- **Text sits directly on the image or background. No pills, tags, boxes or rounded chips behind text.** Use ink-on-white or white-on-ink contrast, or a clean area of the image.
- Radius: 0 for blocks and rules. Rectangular CTAs only.
- Flat colour. No shadows, glow, glass, gradients, noise.
- Spacing steps: 8, 16, 24, 32, 48, 72, 96.
- **No numbers on carousel slides** (no page counters, numbered points, stat numerals, dates). Figures go in the caption or first comment. Single-image posts may carry a figure only if the user asks for it.
- **No unnecessary headlines or category names.** No eyebrows, tags, kicker labels, section names, topic labels or repeated titles. One headline per frame at most, only when it carries the message. If removing a line of text loses nothing, remove it.
- One red element at most draws the eye: a key word, a rule, a square.

## Type scale (1080-wide canvas)

| Role | Font | Size | Line | Tracking |
|---|---|---|---|---|
| Cover headline | Unbounded 800 | 104 to 136px | 0.95 | -0.04em |
| Slide headline | Unbounded 700 | 72 to 96px | 1.0 | -0.035em |
| Sub-head | Unbounded 600 | 40 to 52px | 1.1 | -0.02em |
| Body | Plus Jakarta Sans 400 | 34 to 40px | 1.45 | 0 |
| Handle / footer | Plus Jakarta Sans 600 | 24 to 28px | 1.3 | 0.01em |

Minimum 28px for anything that must be read on a phone. Max about 14 words in a headline, about 40 words of body on a slide.

## Slide types (carousel kit)

| Type | Purpose | Contents |
|---|---|---|
| Cover | Stop the scroll | Headline (max 8 words, or none if the image carries it), one image, handle |
| Swipe slide | Earn slide 2 | A fact or tension the cover did not give away. Never a restatement |
| Point | One idea | One short head and 1 to 2 sentences. No number, no label |
| Key line | One line to keep | One short statement on flat colour or image. No numerals |
| Proof | Real work | Client work image, one line, client name (only YHM, Swaraj, Beato unless cleared). Figures go in the caption |
| Quote | Real quote only | Verbatim, named, permission confirmed |
| Close | One CTA | The ask, handle, logo. Not a recap |

## RHAD vs RHAD45 switch

| | RHAD | RHAD45 |
|---|---|---|
| Ink | `#1F2124` | `#191919` |
| Red | `#D90A2C` (small text `#B00822`) | `#F03131` large, `#B62424` small/action |
| Paper | none | `#F5F3EF` allowed |
| Logo | `assets/rhad/logos/` | `assets/rhad45/logos/` |
| Voice | first-person, dry, direct | calm, precise, concrete |

Pick one token file per post. Do not load both.

## Accessibility

Contrast 4.5:1 for normal text, 3:1 for large. Never rely on colour alone. Alt text on every image. Captions burned into video and a transcript in `copy.md`. Do not set body text below 28px on a 1080 canvas.

## How to build

1. Copy a template from `assets/templates/` into the work folder. Keep `../fonts` and `../tokens` paths working, or copy those folders alongside.
2. Replace content. Do not add new colours or fonts.
3. Render: `node scripts/render-post.mjs <html> --size 1080x1350 --out <dir> [--pdf]`.
4. Read the PNGs. Fix. Re-render. Then run `scripts/brand-lint.mjs` on the HTML.
