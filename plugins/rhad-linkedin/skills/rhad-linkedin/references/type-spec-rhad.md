# RHAD EDGE page: type spec

Two families, both free under the SIL Open Font License (OFL.txt in each folder).

| Role | Family | Weights used |
|---|---|---|
| Display: headlines, numbers, card titles | **Unbounded** | 600 SemiBold, 700 Bold, 800 ExtraBold |
| Text: body, buttons, labels, forms | **Plus Jakarta Sans** | 400 Regular, 500 Medium, 600 SemiBold, 700 Bold |

Files:
- `static/` has one file per weight. Use these in Canva, Figma, Word and similar apps.
- The `[wght]` files are variable fonts covering every weight, for web and dev use.
- The italic file is included for completeness; the page never uses italics.

## Colours used on type

| Name | Hex | Used for |
|---|---|---|
| Ink | `#1F2124` | Main text on white and light grey |
| Ink soft | `#5B6169` | Notes, meta lines, table headers, quote credits |
| White | `#FFFFFF` | All text on red and on dark sections |
| RHAD red | `#D90A2C` | Footer wordmark, step numbers, text of the white button |
| Red (pressed) | `#B00822` | "You, with our support" step owner, button hover |
| On-dark soft | `#D6D7D9` | Body copy and legal text on dark sections |

## Sizes

Sizes marked *fluid* scale with screen width (CSS `clamp(min, preferred, max)`). The "@1440" column is what a 1440px-wide desktop shows.

Tracking is given in em, as a share of the font size: −0.035em is −3.5%, which is −35 in Figma or Canva letter spacing.

### Unbounded (display)

| Where | Weight | Size (mobile → desktop) | @1440 | Line height | Tracking | Case | Colour |
|---|---|---|---|---|---|---|---|
| Hero monument: "PSG" / "EDGE" | 800 | fluid 84 → 196px; 21vw on phones | 153px | 0.82 | −0.055em | As typed | PSG white, EDGE ink |
| Hero "IS / NOW" (stacked beside PSG) | 800 | 27% of the monument | 41px | 0.86 | −0.02em | **ALL CAPS** | Ink |
| Hero H1: "Get up to 50% back on your…" | 600 | fluid 24 → 36px; 25px on phones | 32px | 1.08 | −0.02em | Sentence | White |
| Section H2s: What changed, Cost, Packages, Eligibility, How it works | 700 | fluid 36 → 68px; 30px on phones | 63px | 0.98 | −0.035em | Sentence | Ink (white in How it works) |
| Contact H2: "Find out in 30 minutes…" | 700 | fluid 28 → 36px | 36px | 0.98 | −0.035em | Sentence | White |
| Secondary H2s: Why RHAD, Quotes, PSG band, FAQ, Audit, "Four rules…" | 600 | fluid 24 → 40px | 37px | 1.1 | −0.02em | Sentence | Ink (rules title white) |
| Lead testimonial quote | 600 | fluid 24 → 40px; 20px on phones | 37px | 1.2 | −0.02em | Sentence | Ink |
| Card titles: "What changed" items, package names, FAQ questions | 600 | fluid 19 → 24px (FAQ 18px on phones) | 23px | 1.2–1.25 | −0.015em | Sentence | Ink (white on the selected package) |
| Payback step titles: "1 · Apply" | 700 | fluid 18 → 22px | 22px | 1.2 | −0.015em | Sentence | Ink |
| Big payback numbers: "S$4,875" | 700 | fluid 24 → 36px (total row 20 → 26px) | 35 / 26px | 1.0 | −0.02em | — | White / Ink |
| Small display heads: rule titles, Why-RHAD terms | 600 | 19px | 19px | 1.3 | −0.01em | Sentence | White / Ink |
| Cost table package names | 600 | 17px | 17px | 1.25 | −0.01em | Sentence | Ink |
| Cost table "net cost" column | 700 | 18px | 18px | 1.3 | — | — | White on ink |
| "Worth knowing" box title | 700 | 18px | 18px | 1.2 | — | Sentence | White |
| Process step numbers 1, 2, 3… | 700 | 17px | 17px | 1.4 | — | — | RHAD red |
| Footer line: "We reply within 1 working day." | 700 | fluid 32 → 64px; 30px on phones | 60px | 1.0 | −0.035em | Sentence | White |
| Footer wordmark "RHAD" (giant, cropped) | 800 | 26.4% of screen width (36% on phones) | 380px | 0.8 | −0.06em | As typed | RHAD red |

### Plus Jakarta Sans (text)

| Where | Weight | Size | Line height | Tracking | Colour |
|---|---|---|---|---|---|
| Default body copy, lists, table cells | 400 | 17px | 1.55 | 0 | Ink (#D6D7D9 on dark) |
| Lead paragraphs: section intros, cost copy, eligibility intro, contact intro, quotes | 400 | 19px | 1.5–1.55 | 0 | Ink / White |
| Longer reading copy: packages "Still not sure?", FAQ answers, PSG band, audit, Why-RHAD descriptions | 400 | 18px (FAQ 17px on phones) | 1.5–1.55 | 0 | Ink |
| Hero paragraph | 400 | 17px (16px on phones) | 1.55 | 0 | White |
| Inline bold, FAQ-style summaries, "What you'll get:" | 700 | 17–18px | 1.55 | 0 | Ink |
| Buttons (all variants) | 600 | 16px; form submits 17px; floating dock 15px | 1.0 | 0 | White on red/ink; red on white |
| Header nav links | 500 | 14px | 1.55 | 0 | White |
| Header CTA "Book my free EDGE consultation" (underlined link) | 700 | 14px | 1.55 | 0 | White, 2px underline |
| Inline text links | 600 | inherits | — | 0 | Inherits, 2px underline, 5px offset |
| Small labels: form labels, "Your net cost", step owner, table headers | 600 | 14px | 1.55 | 0 | Ink soft / Ink / White |
| Eligibility checklist rows | 600 | 17px | 1.4 | 0 | Ink |
| Hero trust strip: "IMDA SMEs Go Digital pre-approved vendor…" | 600 | 15px | 1.35 | 0 | White |
| Payback package switcher buttons | 600 | 15px (14px on phones) | 1.0 | 0 | Ink / White when selected |
| Package meta: "3 months \| S$6,000" | 500 | 15px | 1.3 | see note | Ink soft |
| Package goal line: "If your goal is…" | 500 | 16px | 1.4 | see note | Ink / White |
| "Recommended" tag | 600 | 13px | 1.2 | 0 | Sits in a small solid block |
| Quote credits | 600 | 15px (17px under the lead quote) | 1.55 | 0 | Ink soft |
| Notes and fine print: "Examples only. Prices exclude GST…" | 400 | 14px | 1.5 | 0 | Ink soft |
| Hero small print, 3D city hint | 400 | 14px | 1.5 | 0 | White |
| Contact phone and WhatsApp lines | 600 | 18px | 1.4 | 0 | White |
| Form consent text | 500 | 14px | 1.45 | 0 | White / Ink |
| Footer address and contact | 400 | 17px (links 16px) | 1.6 | 0 | #D6D7D9 / White |
| Footer legal and Privacy link | 400 | 13px | 1.55 | 0 | #D6D7D9 / White |

**Note on tracking:** the package meta and goal lines sit inside the package title, so they pick up its −0.015em tracking (about −0.35px). It's barely visible. For a clean rebuild elsewhere, use 0 tracking on these lines.

## Rules of thumb

- **Unbounded** is only for headlines, numbers and short titles. It is never used for paragraphs.
- **Plus Jakarta Sans** is used for everything people read in sentences, and for every button.
- **Tracking:** display type is always tightened. Bigger type is tighter, from −0.01em on small heads to −0.06em on the wordmark. Text type always has 0 tracking.
- **All caps** appears in exactly one place: the hero "IS / NOW". Everything else is sentence case.
- **Italics** are not used anywhere.
- **Line height:** tight on display (0.8–1.2), relaxed on body (1.5–1.6).
