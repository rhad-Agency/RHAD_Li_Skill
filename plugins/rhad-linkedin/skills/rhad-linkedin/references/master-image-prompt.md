# RHAD master image prompt

Image generation for RHAD posts runs through **ChatGPT**.

- If you are not in ChatGPT: write the finished prompt into `image-prompts.md` and tell the user, in one line, to paste it into ChatGPT (with the reference image attached). Do not call another image provider.
- If you are already in ChatGPT or Codex with built-in ImageGen: use it directly. Attach `assets/imagery/rhad-master-imagery-reference.png` as the style reference.

Every prompt must be **built for the post**, not pasted blind. Fill every `{{slot}}`. If a slot cannot be filled from the brief and the Media Read, ask or mark `[NEEDS]`. No generic fillers.

## Before you write the prompt

0. Write the **concept brief** (`concept-first.md`): message, visible metaphor, element map, read-test. A prompt without a brief is not allowed.

1. Re-read the Media Read (if media was supplied). Reuse real subjects, setting, light and palette from it. If real footage exists, a generated image should extend it, not contradict it.
2. Decide the image's one job in the post: stop the scroll, prove a point, set a mood, hold a headline.
3. Plan the type lockup now: does this frame need a headline at all? If yes, where does it sit? That decides negative space. If the image carries the message, use no headline.
4. Decide treatment: master monochrome, case-study palette, or flat graphic.

## NO-TEXT block (mandatory in every prompt, every variant)

Paste this block verbatim at the end of every prompt, then add the variant's own constraints:

```
ABSOLUTELY NO TEXT OF ANY KIND IN THE IMAGE. No headlines, titles, subtitles, captions, taglines, labels, category names, topic names, section names, eyebrows, tags, badges, stickers, slogans, quotes, watermarks, logos, signage, UI text, brand names, handles or URLs. No numbers, digits, dates, prices, percentages, page counters or step markers. No letters or letter-like marks, including on clothing, screens, books, packaging and walls. Any surface that would carry writing stays blank or blurred beyond legibility. Leave clean empty space instead. All words and numbers are added later in layout, and only where needed.
```

If the model returns any text, digits or label-like marks, the image fails: change the prompt (strengthen the block, remove the subject that invites text, such as screens, signs or packaging) and regenerate. Do not keep an image and cover the text.

## The master prompt (monochrome portrait, default)

```
Create a {{aspect ratio, e.g. 4:5 portrait, 1080x1350}} editorial image for a LinkedIn post by a creative and growth agency.

PURPOSE
{{one sentence: the job this image does in the post and what the post is about}}

STYLE REFERENCE
Match the attached reference image exactly in look: high-contrast black-and-white photography on a pure white background, deep true blacks in clothing and hair, almost no grey haze, clean cutout silhouette edges. One subject is tack sharp. {{Any secondary figures or elements}} are smeared sideways with fine horizontal scanline displacement, like a glitched scan, streaks running left to right, soft ghosted edges.

SUBJECT
{{who: age range, role, clothing, expression, pose, relationship to the post topic. Be specific. Real working people, regionally accurate for {{market, e.g. Singapore}}. Not stock-smiling.}}
{{what they are doing, and the object or setting that tells the story}}

COMPOSITION
{{camera: framing, angle, lens feel}}. The sharp subject sits {{left / right / centre}}. Leave a clean white area of about {{30-45}}% on the {{top / left / bottom}} for a headline added later in layout.

COLOUR
Black and white only. One optional flat accent of red #D90A2C limited to {{a single small element, e.g. a jacket lining, a pen, a thin rule}}, or no colour accent at all.

HARD CONSTRAINTS
[Paste the NO-TEXT block here.] No gradients, glow, glass, 3D render look, drop shadows, stock-robot or AI-orb imagery, no futuristic UI, no fake screenshots. No recognisable real person or celebrity. Natural hands and anatomy. No beige or warm tint.

OUTPUT
{{aspect ratio and pixel size}}, sharp, high resolution, clean edges suitable for adding type on top.
```

## Variants

### Poster hero scene (object metaphor, text-free plate)

Write the concept brief first (`concept-first.md`). Attach 2 to 3 references from `assets/imagery/poster-style/`. Every object named below must have a row in the Element map.

```
Create a {{aspect ratio, e.g. 4:5 portrait, 1080 x 1350}} text-free scene plate for a LinkedIn poster.

MESSAGE
{{the one-sentence message from the concept brief}}

SCENE
{{the visible metaphor in one sentence}}. Objects, and only these: {{object 1 (what it stands for)}}, {{object 2 (what it stands for)}}, {{object 3 (what it stands for)}}. {{Where the tension sits}} on the {{left/right}}; {{the resolution}} on the other side.

MATERIAL AND STYLE
Match the attached references exactly. Hand-made mixed-media collage on warm off-white paper (#F4F1EC): torn paper layers with fibrous edges, black halftone dot patches, soft shadow to the lower right. The objects are monochrome, photographic, with real texture (metal, paper, wood, glass). One colour only: red #D21131, used for a tactile twisted red thread with a small red pin-node, folded red paper (bridge, ribbon or arrow) where the concept needs it, and one small faceted red cube as the signature, placed where the loose ends resolve. Calm, honest, tactile.

COMPOSITION
Hero scene occupies the middle band of the frame only. Keep the top 40% and the bottom 12% completely clean off-white paper, empty, for headline and footer. Leave blank paper tags (no writing) on the objects that will be labelled later.

[Paste the NO-TEXT block here.] Also: no gradients, glow, glass sheen, chrome, neon, 3D-render look, no robots, circuit brains, handshakes, lightbulbs, rockets or globes, no full smiling portrait, no fake screens, charts with readable data, ratings, stars or results.
```


Attach 2 to 3 references from `assets/imagery/site/` (for example `portraits/rhad-intro.webp`, `collage/rhad-finder.webp`).

```
Create a {{aspect ratio}} editorial collage image for a LinkedIn post by a creative and growth agency.

PURPOSE
{{the one job this image does and the idea it carries}}

STYLE REFERENCE
Match the attached references exactly in look. Black-and-white photography on a pale grey paper-textured ground. The main subject is {{who or what, specific}}, rendered sharp and photographic. Around and inside the subject, fragments of {{city / workspace / interface / texture relevant to the post}} appear as stacked square and rectangular grey image tiles, as if the subject is assembled from the work around them. One thin red line (#D90A2C), pencil-thin, with three or four small dark round nodes, curls through the frame and {{connects the subject to a small red cube / ends in a small red cube}}. The small red cube is the only colour in the image. Calm, editorial, generous clean space.

COMPOSITION
{{framing}}. Keep about {{35-45}}% of the frame calm and empty on the {{side}} for layout.

[Paste the NO-TEXT block here.] Also: no extra colours beyond the single red line and red cube, no glow or gradient, no 3D render look, no fake interface screens with readable content, no recognisable real person.
```

### EDGE / Singapore ecosystem (light isometric)

```
Create a {{aspect ratio}} light isometric illustration of a small Singapore business district block on a pale grey ground, matching the attached reference: soft pastel buildings, rounded green trees, tiny roads and a few shophouse roofs, gentle shadows, matte surfaces, one red accent building or marker. Clean margins. [Paste the NO-TEXT block here.]
```

### Case-study palette (another brand is the subject)

Replace STYLE REFERENCE and COLOUR with:

```
Bold flat editorial look in the subject brand's own colours: {{palette hex list taken from the brand's public identity}}. Clean studio product photography, soft even light, strong single focal object {{object}}. Plenty of negative space for a headline. [Paste the NO-TEXT block here.] Leave logo and trademark areas blank. Mark the image as independent commentary in layout, not in the image.
```

Add the disclosure line in layout: "Independent commentary. Not affiliated with {{brand}}."

### Flat graphic background (type-led slide)

```
[Paste the NO-TEXT block here.] Pure white background, flat. One thin ink #1F2124 rule and one small red #D90A2C square, placed {{position}}. Nothing else. Perfectly clean, no texture, no noise, no gradient.
```
(Usually build this in HTML instead. Only generate when a texture is truly needed.)

### RHAD45 scene

```
High-contrast black-and-white photograph on pure white, one sharp subject, others softly smeared with horizontal scanline displacement, as in the attached reference. Subject: {{owner or manager of a Singapore service business, e.g. cafe, clinic, salon, tuition centre, repairs}} {{doing the specific customer-follow-through task from the post}}. Real working environment, honest scale. Leave {{35}}% clean white for headline. [Paste the NO-TEXT block here.] No screens showing readable UI, or messaging-app marks. No fake dashboards or charts.
```

### Edit an existing photo

```
Keep the people, pose, clothing, expression, background and every detail of the attached photo unchanged. Only: convert to high-contrast black and white with deep blacks and a clean white or near-white background, cut out the main subject cleanly, and apply fine horizontal scanline displacement to {{the secondary figures / the edges}} while keeping {{the main subject}} sharp. Do not add, remove or restyle anything else. [Paste the NO-TEXT block here.] Also remove any existing text, numbers or labels visible in the photo only if the user asks.
```

## After generation

1. Open the result and compare it to the reference. Check: sharp subject, scanline treatment, white, no text, no artefacts, hands and faces.
2. If wrong, change **one** thing in the prompt and re-run. State what you changed.
3. Add type, the logo and the footer in layout (HTML), never in the model, and only the text the frame needs.
4. Log the final prompt, the date, and the source media used in `image-prompts.md` so the image can be reproduced and its provenance disclosed.
5. A generated person is illustrative. Never present them as a client, employee or customer.
