# Poster style: bold typography over a hand-made object scene

The default look for single-image LinkedIn posts, ads and carousel covers that carry one idea. Reference images: `assets/imagery/poster-style/` (nine finished RHAD45 posters, carousel covers, ads and an email banner from the shared Creatives folder). Template: `assets/templates/poster.html`.

Read `concept-first.md` first. A poster is an idea in words plus the same idea as objects.

## Anatomy (1080 x 1350, top to bottom)

| Zone | Content | Rule |
|---|---|---|
| Top-left | Logo, full lockup on single images and carousel covers and closing slides. Icon only on carousel inner slides | At y=72. Brand variant for the background. No category label, no page number |
| Headline | Two to three lines, enormous. Situation in ink, the turn in red | Plus Jakarta Sans ExtraBold 800 (Sora Bold is the site headline font in the visual guide; use it if installed), 112 to 132px, line-height 0.95, tracking -0.045em, sentence case, ends with a full stop or question mark. Max about 9 words. Last line red |
| Support line | One short sentence in plain words | Plus Jakarta Sans 500, 34 to 38px, ink. Says what to do or what the product does. Never repeats the headline |
| Scene | The hero object scene, about 40% of the frame (y about 560 to 1200) | Text-free plate from the master prompt. Labels are added in layout |
| Footer | CTA line with a red arrow, then URL or handle | Plus Jakarta Sans 600, 30 to 34px. Arrow in red. Safe margin 72px |

Headline is the loudest thing on the page. If the picture competes with it, simplify the picture.

## Palette

Paper off-white `#F4F1EC` ground, ink `#111418` (use brand ink `#191919` for RHAD45, `#1F2124` for RHAD), red `#D21131` for the red headline line, thread, ribbon, arrow and cube. Greys come from the photographic objects and halftone patches only. Red is about 5% of the frame.

The shared visual guide also defines a dark variant (canvas `#12161C`, off-white cards). The finished posters in the folder are the light paper version. Use light by default. Use dark only when the user asks for it, with the same objects and threads.

## Material language

- **Torn paper layers** with fibrous edges, stacked behind the objects, soft shadow lower right
- **Halftone dot patches** in black on the paper pieces
- **Monochrome objects** photographed or rendered in black and white with real texture: metal, wood, paper, glass
- **Red**: tactile twisted thread with a small red pin-node, folded red paper (bridge, accordion ribbon, arrow), and the **red faceted cube** as the signature. One cube per image
- **Paper tags** (blank in the plate) for labels
- Hands appear as black-and-white cutouts offering, holding or opening. Never a full smiling face in scenes that are not about a person

## Typography rules

- Bold, tight, heavy. The headline should look printed, not typed
- Two colours in the headline: ink and red. Never three
- Sentence case. No all-caps headlines on posters
- One headline per frame. No subtitles stacked on subtitles. No category names, eyebrows or tags above the headline
- Carousels: **no numbers on slides**, so "45-Minute Business Review" appears as "Arrange a business review" on the slide and the full wording goes in the caption. RHAD45 as a name is fine
- All type is set in layout. The image model never draws letters or numerals

## Carousel use

- **Cover**: full poster with the swipe arrow in the footer
- **Inner slides**: same ground and headline style, smaller scene, icon-only logo, one idea each, headline placement identical on every slide
- **Closing slide**: the review invitation, full logo, a generous clean scene
- Slide order is shown by the swipe arrow only

## Ads and banners

Same system at other ratios: 1:1 (1080 x 1080) puts the headline top and the scene bottom. 16:9 banners put the headline and the call-to-action button left and the scene right (see `email-banner-four-ways-light-16x9.jpg`). The CTA button on banners is a solid red rectangle with white text and a white arrow, square corners.

## How to build one

1. Write the concept brief.
2. Generate a **text-free** scene plate in ChatGPT with the poster prompt in `master-image-prompt.md`, attaching 2 to 3 references from `assets/imagery/poster-style/`.
3. Copy `assets/templates/poster.html`, drop the plate into `.art`, set the headline, support line, CTA and the labels. Tags go on the objects they name.
4. Render with `scripts/render-post.mjs`, open the PNG, run the read-test, run `brand-lint.mjs`.
5. If words overlap objects or the image looks busy, remove an object. Do not shrink the headline.

## Do not

- Gradients, glow, glass, chrome, neon, 3D-render sheen, floating particles
- Stock robots, circuit brains, handshakes, lightbulbs, rockets, globes
- Generated lettering, numerals, logos or fake product screens inside the plate
- Invented ratings, results, customers or quotes
- Slide numbers, page counters, asset IDs or production labels anywhere
- A busy scene with more than 4 or 5 named objects
