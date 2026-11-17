# RHAD imagery

Reference image: `assets/imagery/rhad-master-imagery-reference.png`. **Open it before any imagery decision.** It is the look.

## The look, observed on rhad.agency (26 October 2026)

- White foundation
- High-contrast **black-and-white photographic people**, cutout silhouettes
- **Horizontal scanline displacement**: the side figures smear sideways in fine horizontal streaks, while the centre figure stays sharp. Focus lives in one subject
- Deep blacks in clothing, clean white background, almost no mid-grey haze
- Bold Unbounded headings, red accents, restrained rectangular CTAs

The scanline smear is a **treatment**, not a filter on everything. Never over copy, data, a logo or a face that must be recognised.

## Poster-style scenes

For single-image posts, ads and carousel covers that carry one idea, use the poster style in `poster-style.md`, and write the concept brief in `concept-first.md` before any image. References: `assets/imagery/poster-style/`.

## The wider RHAD system (from the EDGE, RHAD and RHAD45 sites)

Reference set: `assets/imagery/site/` (index and usage in its README). Open the matching images first. Beyond the monochrome portrait, the family shares:

- **Fragmented image tiles**: square and rectangular grey tiles of city, texture and interface stacked over a figure, as if the person is assembled from pieces of the work around them
- **The red thread**: one thin red line, no thicker than a pencil, with a few small dark nodes, curling through the frame. It connects the subject to the idea
- **The red cube**: one small red cube as the only colour accent. In a hand, at the end of the thread, or on a surface. One per image
- **Calm ground**: pale grey or white paper texture, never busy
- **Light isometric city** (EDGE posts): soft pastel Singapore block on a pale ground, only for EDGE and ecosystem topics

Keep them restrained. Thread and cube are accents, not a pattern. The master portrait with scanline smear and the tile-and-thread collage are two moods of the same brand: use the smear for people at work, the collage for ideas, systems and journeys.

## Treatments

| Treatment | When | How |
|---|---|---|
| **Master monochrome portrait** | Hero of agency posts, people, culture, hiring | Generate with the master prompt, or convert supplied photo to B&W with a hard curve |
| **Scanline displacement** | Adds motion to a static portrait or team shot | ffmpeg: `split` + `displace` or `tmix` with `scale`/`crop` slicing; or Photoshop/Express displacement. Keep one sharp subject |
| **Tile-and-thread collage** | Strategy, systems, journeys, regional reach | Pick 2 to 3 references from `assets/imagery/site/collage` and `portraits`. Prompt variant in `master-image-prompt.md`. Thread and cube are drawn in the image, no text |
| **Cutout silhouette on white** | Clean product or person on a text slide | Remove background (Adobe, remove.bg-style tool) then place on white |
| **Real client work** | Case studies | Show real output at true colour, framed by RHAD white and type. Do not recolour a client's work |
| **Case-study palette** | Posts dissecting another brand | Borrow that brand's palette for the art, keep RHAD type and footer (see `carousel-example-five-borders.jpg`) |
| **Flat graphic** | Frameworks, key lines | Built in HTML: ink, white, one red accent. No numerals on carousel slides |

## Do

- Real people in real work settings, honest scale, relevant context
- One subject in focus. One red accent
- Leave breathing room for headline type; plan the type lockup when you plan the image
- Match Singapore and regional reality: diverse, local, working, not stock-smiling

## Do not

- Stock robots, AI orbs, glowing brains, fake dashboards or fake screenshots
- Illustrated miniature worlds, dioramas, glossy 3D icon sets, gradients or glass
- Generated text inside images (add all type in layout, never in the image model)
- Recognisable real people, celebrities, third-party logos or trademarks in generated art
- A generated "client", "customer" or "team member" presented as real. If a generated person appears, say "illustrative" where it could mislead
- Faces from supplied media used without confirming consent

## RHAD45 imagery

Same monochrome inheritance, plus flat red module icons from the 96-unit set and HTML-built workflow graphics. See `rhad45-brand.md`.

## Alt text

Write alt text for every image: what is shown, any text in it, who, where. 1 to 2 sentences. No keyword stuffing.
