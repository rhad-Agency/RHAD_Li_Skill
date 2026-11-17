# QA checklist (run before every delivery)

Mark each line pass, fail (fixed), or n/a in `qa.md`. Do not deliver with an open fail.

## Verification and critique

- [ ] The first message was read for brand, information, goal, platform and audience. Every gap was asked about, none guessed
- [ ] The brief was read back and the user confirmed it (checkpoint 1)
- [ ] Concept and hook, copy, visual and final pack each went through a critique round (checkpoints 2 to 5). Own critique given first, user critique asked, changes shown
- [ ] Any assumption the user explicitly accepted is listed in `copy.md`
- [ ] "Decisions and changes" recorded
- [ ] Weak points in the brief and in the user's requests were challenged once, with a reason and an alternative. Nothing was accepted or praised by default, and no objection was invented
- [ ] Requests that broke a hard rule were declined with the closest workable option
- [ ] Messages to the user were short, in plain words, with at most three questions each and a recommended answer. No internal terms, file paths or tool output

## Brand

- [ ] One brand only (RHAD or RHAD45). No cross-contamination of palette, logo, voice
- [ ] Logo from `assets/` only, correct variant for the background, clear space respected
- [ ] Fonts: Unbounded (display) and Plus Jakarta Sans (text) only. No italics
- [ ] Colours from the token file. One red accent per frame. No gradients, glow, glass, shadows
- [ ] No pills, tags or boxes behind text
- [ ] **Carousel slides carry no numbers** (counters, numbered points, stats, dates)
- [ ] **No unnecessary headlines or category names** (eyebrows, tags, topic labels, repeated titles) on any creative
- [ ] **Concept brief written for every image.** Every object has an Element map row. Read-test passed (a stranger can guess the topic with the headline covered)
- [ ] Image shows the situation, headline states the claim: they do not repeat each other
- [ ] No stock clichés (robots, brains, handshakes, rockets, lightbulbs, globes)
- [ ] Poster posts: two-tone headline (ink then red), one support line, text-free plate, CTA footer, one red cube at most
- [ ] Imagery matches `imagery.md`. Compared against `rhad-master-imagery-reference.png`
- [ ] Sentence case. No all-caps except one allowed label or monument word
- [ ] Mocha absent (unless a meme or reel with the user)

## Copy

- [ ] Hook is a complete thought in about 12 to 15 words (written) or two-slide hook (carousel)
- [ ] Four hooks written, one picked with a reason
- [ ] No em dashes. No banned words (`voice-and-tone.md`, RHAD45 list if applicable)
- [ ] Humanizer pass done. One contrast and one triple at most
- [ ] First person or "we" kept consistent
- [ ] One CTA. Link in first comment
- [ ] 3 to 5 hashtags, last line
- [ ] Market-safety read for SG, ID, IN, UK, AU
- [ ] `scripts/brand-lint.mjs` returns no failures on copy and HTML

## Truth

- [ ] Every number, name, quote and result traces to the brief or the media
- [ ] Only YHM, Swaraj, Beato named, unless cleared by the user
- [ ] No invented story, testimonial, trend or date. `[NEEDS]` placeholders listed
- [ ] RHAD45: no banned claims, no undefined terms, agency work labelled as agency work
- [ ] Third-party brands: "Independent commentary. Not affiliated with X." and an "as of" date where facts change
- [ ] Generated people labelled illustrative where they could mislead
- [ ] Consent confirmed for identifiable people and any client footage

## Media

- [ ] Analysis run before decisions. Media Read in `media-read.md`
- [ ] Output format matches `linkedin-formats.md` (size, length, codec, loudness)
- [ ] Original media untouched
- [ ] Captions burned into video. Transcript in `copy.md`

## Visual

- [ ] Rendered PNGs opened and inspected by eye
- [ ] Legible at 375px wide. Body text at least 28px on a 1080 canvas
- [ ] Safe margins 72px. Nothing clipped, overlapping, or off-grid
- [ ] Contrast 4.5:1 normal, 3:1 large
- [ ] Alt text written for each image
- [ ] Carousel: slide 2 earns the swipe. Last slide is a CTA, not a recap. PDF page order verified
- [ ] Image prompts contain the full NO-TEXT block and were logged with date and source media
- [ ] Generated images checked: no stray text, numbers, labels or category names

## Delivery

- [ ] Files saved in the post folder. Names clear
- [ ] Summary reply is short and lists open placeholders
- [ ] **Asked for approval. Nothing published or scheduled yet**
