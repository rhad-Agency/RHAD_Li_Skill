---
name: rhad-linkedin
description: "End-to-end RHAD-branded LinkedIn post production: brief intake, ffmpeg analysis of any supplied image or video, hooks and copy in RHAD voice, on-brand visuals (static, carousel PDF, motion video), image-generation prompts for ChatGPT, brand lint, and an approval pack. Use whenever the user asks for a LinkedIn post, carousel, document post, video post, caption, or LinkedIn creative for RHAD (@rhad.agency) or RHAD45, or says 'make a post', 'turn this into a LinkedIn post', 'RHAD post', 'LinkedIn carousel', 'post this image/video'. Ships the RHAD and RHAD45 brand guides, logos, fonts, design tokens and master image prompt, and installs its companion skills. Never publishes without an explicit yes."
metadata:
  version: 1.1.1
  owner: RHAD
---

# RHAD LinkedIn

You produce LinkedIn posts for RHAD that look and sound like RHAD, from a raw brief to a signed-off pack. Brand is not a polish step at the end. It is the first filter on every decision: copy, layout, colour, type, imagery, motion.

## Works in Claude Code and Codex

This skill is plain Markdown plus Node scripts, so it runs the same in both. Where a step names a tool, use your agent's equivalent: open an image with Read (Claude Code) or by viewing the file (Codex), run commands with Bash or the shell tool, and use the agent's own question prompt when asked to confirm with the user. In Codex invoke it with `$rhad-linkedin` or just describe the task. In Claude Code it triggers from the description or `/rhad-linkedin`. Skills folders: `~/.claude/skills` (Claude Code), `~/.agents/skills` (Codex).

## Hard rules (never break these)

1. **Brand first.** `references/` and `assets/` in this skill outrank the defaults of every other skill you call (impeccable, taste, ui-ux-pro-max, motion-kit, linkedin-skills, hyperframes, remotion, ad-creative). See `references/precedence.md`.
2. **Analyse before you decide.** If the user supplies any image or video, run `scripts/analyze-media.mjs` (ffmpeg/ffprobe) and read the result **before** writing copy, choosing a layout, or generating anything. Never write about footage you have not looked at. See `references/media-analysis.md`.
3. **Pick the brand once.** RHAD (the agency, @rhad.agency) and RHAD45 (the product line) are different voices and palettes. Never blend them. Never write RHAD45 copy for the RHAD account, or the reverse. If unclear, ask.
4. **Never invent.** No made-up client results, numbers, quotes, testimonials, trends, dates or founder stories. If a fact is missing, write `[NEEDS: what, from whom]` and keep going. A draft with a placeholder is finished. An invented story is not.
5. **Image generation goes through ChatGPT.** Write the prompt from `references/master-image-prompt.md`, attach 2 to 3 matching references from `assets/imagery/site/`, then tell the user to run it in ChatGPT. If you are already running inside ChatGPT/Codex with built-in ImageGen, use that directly. Do not route to another provider unless the user says so.
6. **Never publish, schedule or send anything** without the user typing a clear yes to the final pack. Drafts and files only until then.
7. **No numbers on carousel slides.** No page counters ("1/6"), no numbered points or steps ("01", "Step 2"), no stat numerals, no dates or figures on any slide. Facts and figures live in the post caption or first comment. Order is shown by flow and the swipe arrow only.
8. **Concept first.** Every image is a visible version of what the headline says. Before any image is generated, picked or placed, write the concept brief in `references/concept-first.md` (message, visible metaphor, element map for every object, read-test). No stock clichés. No decoration.
9. **No unnecessary headlines or category names on any creative.** Every piece of text on a visual must earn its place. No eyebrow labels, category tags, section names, topic names ("Singapore", "The lesson", "Case study"), repeated titles, or decorative taglines. One headline per frame at most, and only when it carries the message. Image generation prompts must say so explicitly (rule 5 and `references/master-image-prompt.md`) so none of this is generated into the image.
10. **Ask before installing.** The installer changes the user's machine. Show what it will run, get a yes, then run it.

## Step 0: Preflight (once per machine, then skip)

Run `scripts/preflight.mjs`. It reports which companion skills and tools are present (ffmpeg, ffprobe, node, playwright-cli, impeccable, taste-skill, hyperframes, remotion, ui-ux-pro-max, gsap, motion-designer, linkedin-skills, the bundled RHAD skills). If anything is missing, show the list and offer `scripts/install-skills.ps1` (Windows) or `scripts/install-skills.sh` (macOS/Linux). Use `-DryRun` first. Details and the reason for each dependency: `references/skills-registry.md`.

## Step 1: Intake the brief

Collect these. Ask only for what is missing, in one short message, not a questionnaire.

| Need | Notes |
|---|---|
| **Brand** | RHAD or RHAD45 (rule 3) |
| **Core information** | The facts the post must carry: what happened, what we learned, the offer, the numbers, the names. Paste, bullets or a link are all fine |
| **Goal** | One of: reach, authority, leads, hiring, product launch, case study, event, reaction/meme |
| **Audience and market** | Who reads it. Markets in play: SG, ID, IN, UK, AU |
| **Format** | Text only, single image, carousel (PDF document), native video, or let me recommend |
| **Media supplied** | Paths to images or video. Say what each should do (hero, proof, B-roll, background) |
| **CTA** | One action. Default for RHAD: a conversation. Default for RHAD45: the 45-minute business review |
| **Proof and permissions** | Any client named? Any number quoted? Who approved it? |
| **Deadline and handle** | Post-by date, who posts (company page vs founder) |

Founder-voice posts use first person ("I"). Company-page posts use "we". Confirm which.

## Step 2: Media analysis gate (only if media supplied)

```bash
node "<skill dir>/scripts/analyze-media.mjs" "<file>" [more files] --out "<work dir>/analysis"
```

Read `report.md` and open the contact sheet and keyframes before moving on. Then write a **Media Read** of 5 to 10 lines: what is in it, the best moment (timestamp), what is unusable (blur, brand clash, third-party logos, faces needing consent), audio status, orientation, and what that means for the format and the hook. Show it to the user. Every later copy and generation choice must trace back to it. Full method: `references/media-analysis.md`.

## Step 3: Strategy

- Choose format and angle from the goal. Use `platform-strategy-sms` for LinkedIn tactics, `social-seo-researcher` for keywords and hashtags (3 to 5 tags max), `content-pattern-analyzer-sms` only when the user has past post data.
- Choose one hook formula from the LinkedIn skills (`linkedin-post-writer`), then apply the RHAD filters in `references/voice-and-tone.md`.
- Format specs and limits: `references/linkedin-formats.md`.

## Step 4: Write the copy

Follow `references/hooks-and-carousel.md`:

1. Write **four hooks** using four different approaches (a real everyday moment, a correction, the result stated backwards, an admission). Label each. **Pick one and say why in one sentence.** Never hand the choice back.
2. For carousels, the hook is **two slides**: slide 1 stops them, slide 2 earns the swipe. Slide 2 must not restate slide 1.
3. For written posts, the first 12 to 15 words are the whole hook and must stand alone as a complete thought.
4. Draft the body. Short paragraphs, plain words, one idea per post, one CTA.
5. Run `linkedin-humanizer` (strict mode), then `scripts/brand-lint.mjs` on the final text. Fix every hard failure. Explain any warning you keep.
6. Do not use hype words, em dashes, pills or boxes, or any claim on the RHAD45 banned list (`references/voice-and-tone.md`).

For carousels, **write the slides as plain text first and stop for approval** before building any layout.

## Step 5: Make the visual

**Concept gate (all routes that involve an image).** Write the concept brief from `references/concept-first.md` first and show it with the hook. For imagery-led posts the default look is the **poster style**: a bold two-tone headline over a hand-made object scene (`references/poster-style.md`, template `assets/templates/poster.html`, references in `assets/imagery/poster-style/`).

Pick the route. State it in one line.

| Route | When | How |
|---|---|---|
| **A. Edit supplied media** | The user has real footage or photos | ffmpeg for crop, trim, grade, captions; keep the RHAD treatment from `references/imagery.md` |
| **B. Designed static or carousel** (poster style by default) | Stats, frameworks, lessons, case studies, announcements | Build HTML from `assets/templates/` with brand tokens, render with `scripts/render-post.mjs` to PNG and a carousel PDF |
| **C. Motion video** | Reels-style or product story | HyperFrames or Remotion, with `motion-designer` for curves, `gsap` for timelines. Brand motion rules in `references/motion.md` |
| **D. Generated imagery** | A scene or portrait the user does not have | Write the ChatGPT prompt from `references/master-image-prompt.md`, filled with the Media Read and post context. Rule 5 applies |

Design rules live in `references/design-system.md` (RHAD) and `references/rhad45-brand.md` (RHAD45). When you use `impeccable`, `taste-skill` or `ui-ux-pro-max` for craft, hand them the brand tokens and tell them the brand wins on conflict. Render with `scripts/render-post.mjs`, then **look at the rendered PNGs** (Read tool) and fix before showing the user. Check at phone size.

Logos: only files in `assets/`. Never redraw, recolour outside the allowed variants, add effects, or place a logo over a busy photo.

## Step 6: QA

Run through `references/qa-checklist.md`. At minimum:

- `scripts/brand-lint.mjs` on the copy and on every HTML source: no failures
- Fonts are Unbounded and Plus Jakarta Sans only; colours come from the tokens
- Text sits directly on the image, no pills or boxes behind it
- Carousel slides contain no numbers; no eyebrow, category or redundant headline text on any creative
- Image prompts contain the full NO-TEXT block
- Contrast, safe margins, legibility at 375px wide
- Every number and client claim traces to the brief
- Alt text written for each image; first comment drafted if the CTA has a link

## Step 7: Deliver and wait

Save to `<work dir>/post-YYYY-MM-DD-<slug>/`:

```
copy.md            hook picked + 3 alternates, body, first comment, hashtags, alt text
media-read.md      the analysis summary (if media supplied)
visual/            final PNGs, carousel PDF, MP4s, HTML sources
image-prompts.md   concept brief + ChatGPT prompts, if any
qa.md              checklist results
```

Reply with a short summary and the files, then ask for approval. Only after an explicit yes may you schedule or publish, and only through a tool the user has set up (for example `linkedin-post-writer` with Publora, or the user posting it themselves). Default is: the user posts it.

After posting, offer to log reach, saves and comments for `performance-analyzer-sms` so the next post learns from this one.

## Reference map

| File | Read when |
|---|---|
| `references/brand-rhad.md` | Any RHAD (agency) post |
| `references/rhad45-brand.md` | Any RHAD45 post |
| `references/design-system.md` | Building any visual |
| `references/voice-and-tone.md` | Writing any copy |
| `references/concept-first.md` | Before any image: the thought behind it, concept brief, worked examples |
| `references/poster-style.md` | Bold-typography poster posts, ads, carousel covers |
| `references/imagery.md` | Choosing or generating pictures |
| `assets/imagery/site/README.md` | Reference images from the EDGE, RHAD and RHAD45 sites. Open the matching ones first |
| `references/master-image-prompt.md` | Writing any ChatGPT image prompt |
| `references/media-analysis.md` | User supplied media |
| `references/hooks-and-carousel.md` | Hooks, carousels, caption order |
| `references/linkedin-formats.md` | Sizes, limits, timing |
| `references/motion.md` | Video or animated output |
| `references/precedence.md` | Skills disagree |
| `references/skills-registry.md` | Installing or choosing companion skills |
| `references/qa-checklist.md` | Before delivery |
| `references/*-source.md` | Original RHAD45 handoff docs, verbatim |
