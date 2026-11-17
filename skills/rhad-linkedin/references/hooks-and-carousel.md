# Hooks, carousels and captions

Method adapted from Maggie Stara's Claude Skills pack (https://maggiestara.com/claude-skills-pack/): know the business first, four genuinely different hooks and a forced choice, carousels written as text before anything is built, never invent a story. Combined with the formulas in the `linkedin-post-writer` skill (sergebulaev/linkedin-skills). The RHAD brand files are the "my-brand" skill in her method: read them first.

## 1. Hooks: write four, pick one

Ask the user for the idea in one line if the brief does not already hold it. Work to **one format only** (written, carousel, short video, long video).

Write **four hooks using four different approaches**. Not four rewordings.

1. **A specific everyday moment**: a real moment from real work
2. **A correction**: name what people believe and say plainly it is wrong
3. **The result, stated backwards**: lead with the outcome, then the cause
4. **An admission**: something RHAD or the founder got wrong

Label each. Then **pick one and say why in one sentence.** Never say "they all work". If the user disagrees, they will say.

**Never make up a story.** The moment and the admission only work if they happened. If the brief lacks the real detail, write `[YOUR STORY HERE: the real moment, in one line]` and carry on.

### By format

| Format | Hook job |
|---|---|
| Written post | The first 12 to 15 words are all most people see. One complete thought that stands alone. Not half a sentence that needs "see more". The line after rewards the expand and does not restate |
| Carousel | **Two slides.** Slide 1 stops them. Slide 2 earns the swipe. Check: could someone read slides 1 and 2 and have the whole idea? If yes, rewrite slide 2 |
| Short video | 8 to 12 words, sayable in one breath, no run-up. Plus a separate on-screen text card that says something different from the spoken line (many watch muted) |
| Long video | 30 to 60 seconds: name the feeling, complicate it, then stack what they get. Written as spoken |

### LinkedIn formula hints (from `linkedin-post-writer`)

Number-first opener lifts reach. Never open with a question. Avoid comment-gate CTAs and teaser phrases. One contrast and one triple per post. Prefer a flat, dated, specific fact over performed vulnerability. Reference: the skill's `references/hook-formulas.md`.

## 2. Carousel flow

1. **Look first.** Pick the layout from `assets/templates/carousel.html` or the user's own template. Work out how many words fit each slide from the font size and the layout (see `design-system.md` type scale, about 40 words max body per slide, 14 words max headline).
2. **Write the slides as plain text.** Slide position (in your notes only, never on the slide), headline if needed, body, visual note. Show it.
3. **Stop and wait.** The user approves or edits the text before you build anything. Changing a line now takes seconds. Changing it after the layout is built means a rebuild.
4. Build in HTML, render, read the PNGs, fix, run lint, export PDF.

Slide count: 6 to 10 is usual. One idea per slide. **No numbers on any slide**: no page counters, numbered points or steps, stat numerals or dates. Show order by flow and the swipe arrow. Put figures in the post caption. Skip eyebrows, category names and repeated titles. The last slide is one CTA, not a recap. First and last slides carry the handle.

## 3. Post body order (written or accompanying a visual)

1. Hook (complete thought)
2. Context in one or two short lines
3. The substance: 3 to 6 short paragraphs, or a short list of up to 5 items
4. What it means for the reader
5. One CTA
6. Optional P.S. (one line)

Short paragraphs, blank lines between. 1,000 to 1,800 characters is a healthy range for a standalone text post. A visual post can be shorter. Hard limit 3,000 characters.

## 4. First comment, hashtags, alt text

- **First comment**: the link (LinkedIn can down-rank links in the body), plus one human line. Write it in `copy.md`.
- **Hashtags**: 3 to 5, last line. `social-seo-researcher` finds them. `#100DaysOfRHAD` only for series posts.
- **Alt text**: each image, 1 to 2 sentences.
- **Tagging**: only people and companies the user has cleared. Never tag-farm.

## 5. Pick-and-explain block for `copy.md`

```
Format: <written / carousel / short video / long video>
Hook picked: <the hook>  (approach: <label>) — why: <one sentence>
Alternates: <3 hooks, labelled>
Placeholders to fill: <list or "none">
```
