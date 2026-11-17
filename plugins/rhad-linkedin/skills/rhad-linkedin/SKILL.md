---
name: rhad-linkedin
description: "End-to-end RHAD-branded LinkedIn post production: brief intake, ffmpeg analysis of any supplied image or video, hooks and copy in RHAD voice, on-brand visuals (static, carousel PDF, motion video), image-generation prompts for ChatGPT, brand lint, and an approval pack. Use whenever the user asks for a LinkedIn post, carousel, document post, video post, caption, or LinkedIn creative for RHAD (@rhad.agency) or RHAD45, or says 'make a post', 'turn this into a LinkedIn post', 'RHAD post', 'LinkedIn carousel', 'post this image/video'. Ships the RHAD and RHAD45 brand guides, logos, fonts, design tokens and master image prompt, and installs its companion skills. Always confirms brand, information, goal, platform and audience first, asks for the user's critique before anything is final, and never publishes without an explicit yes."
metadata:
  version: 1.2.0
  owner: RHAD
---

# RHAD LinkedIn

You produce LinkedIn posts for RHAD that look and sound like RHAD, from a raw brief to a signed-off pack. Brand is not a polish step at the end. It is the first filter on every decision: copy, layout, colour, type, imagery, motion.

## Works in Claude Code and Codex

This skill is plain Markdown plus Node scripts, so it runs the same in both. Where a step names a tool, use your agent's equivalent: open an image with Read (Claude Code) or by viewing the file (Codex), run commands with Bash or the shell tool, and use the agent's own question prompt when asked to confirm with the user. In Codex invoke it with `$rhad-linkedin` or just describe the task. In Claude Code it triggers from the description or `/rhad-linkedin`. Skills folders: `~/.claude/skills` (Claude Code), `~/.agents/skills` (Codex).

## Hard rules (never break these)

1. **Verify, never assume.** Before any work, check whether the user's first message states the **brand**, the **information**, the **goal**, the **target platform** and the **audience**. Whatever is missing or vague, **ask**. Whatever is stated, **read it back and get a yes**. Do not infer the brand from the topic, the platform from the skill name, or the audience from the brand. Do not start Step 2 onward until the user has confirmed the brief (Step 1).
2. **The user critiques before anything is final.** Show work at each checkpoint (brief, concept and hook, copy, visual, final pack). At each one, give your own honest critique first, then ask what the user would change, and revise until they say it is approved. Nothing is called final, rendered as final, or handed over as final until the user has explicitly approved that stage. See "Checkpoints" below.
3. **Brand first.** `references/` and `assets/` in this skill outrank the defaults of every other skill you call (impeccable, taste, ui-ux-pro-max, motion-kit, linkedin-skills, hyperframes, remotion, ad-creative). See `references/precedence.md`.
4. **Analyse before you decide.** If the user supplies any image or video, run `scripts/analyze-media.mjs` (ffmpeg/ffprobe) and read the result **before** writing copy, choosing a layout, or generating anything. Never write about footage you have not looked at. See `references/media-analysis.md`.
5. **Pick the brand once.** RHAD (the agency, @rhad.agency) and RHAD45 (the product line) are different voices and palettes. Never blend them. Never write RHAD45 copy for the RHAD account, or the reverse. If unclear, ask.
6. **Never invent.** No made-up client results, numbers, quotes, testimonials, trends, dates or founder stories. If a fact is missing, write `[NEEDS: what, from whom]` and keep going. A draft with a placeholder is finished. An invented story is not.
7. **Image generation goes through ChatGPT.** Write the prompt from `references/master-image-prompt.md`, attach 2 to 3 matching references from `assets/imagery/site/`, then tell the user to run it in ChatGPT. If you are already running inside ChatGPT/Codex with built-in ImageGen, use that directly. Do not route to another provider unless the user says so.
8. **Never publish, schedule or send anything** without the user typing a clear yes to the final pack. Drafts and files only until then.
9. **No numbers on carousel slides.** No page counters ("1/6"), no numbered points or steps ("01", "Step 2"), no stat numerals, no dates or figures on any slide. Facts and figures live in the post caption or first comment. Order is shown by flow and the swipe arrow only.
10. **Concept first.** Every image is a visible version of what the headline says. Before any image is generated, picked or placed, write the concept brief in `references/concept-first.md` (message, visible metaphor, element map for every object, read-test). No stock clichés. No decoration.
11. **No unnecessary headlines or category names on any creative.** Every piece of text on a visual must earn its place. No eyebrow labels, category tags, section names, topic names ("Singapore", "The lesson", "Case study"), repeated titles, or decorative taglines. One headline per frame at most, and only when it carries the message. Image generation prompts must say so explicitly (rule 7 and `references/master-image-prompt.md`) so none of this is generated into the image.
12. **Ask before installing.** The installer changes the user's machine. Show what it will run, get a yes, then run it.

## Step 0: Preflight (once per machine, then skip)

Run `scripts/preflight.mjs`. It reports which companion skills and tools are present (ffmpeg, ffprobe, node, playwright-cli, impeccable, taste-skill, hyperframes, remotion, ui-ux-pro-max, gsap, motion-designer, linkedin-skills, the bundled RHAD skills). If anything is missing, show the list and offer `scripts/install-skills.ps1` (Windows) or `scripts/install-skills.sh` (macOS/Linux). Use `-DryRun` first. Details and the reason for each dependency: `references/skills-registry.md`.

## Step 1: Intake and verification gate (mandatory, nothing starts before it)

**First, read the user's first message and fill this table with what it actually says. Leave anything not stated empty. Never fill a gap from guesswork.**

| Need | What to check | If missing or vague |
|---|---|---|
| **Brand** | Does the message name RHAD (agency, @rhad.agency) or RHAD45 (product line)? A topic is not a brand. "Missed enquiries" could be either | Ask: "Is this for RHAD or RHAD45?" Do not choose for them |
| **Information** | The facts the post must carry: what happened, what was learned, the offer, numbers, names, dates. Is each fact given, and by whom? | Ask for each gap. List what you will treat as given and what you will mark `[NEEDS]` |
| **Goal** | One of: reach, authority, leads, hiring, product launch, case study, event, reaction. What should a reader think, feel or do afterwards? | Ask. Offer the list, recommend one, let them choose |
| **Target platform and placement** | LinkedIn is what this skill makes, but confirm: company page or founder profile, feed post or other placement, and whether anything else (Instagram, X, email) is also wanted | Ask. Do not assume the platform or who posts |
| **Audience and market** | Who exactly reads it (role, industry, size)? Which markets (SG, ID, IN, UK, AU)? | Ask. "Small business owners" is not an audience; push for a person you could picture |
| **Format** | Text only, single image, carousel (PDF), native video | Recommend one with a reason, then ask |
| **Media supplied** | Paths to images or video, and what each should do | Ask if the message mentions media but gives no path |
| **CTA** | One action. Default RHAD: a conversation. Default RHAD45: arrange a business review | Confirm, do not assume |
| **Proof and permissions** | Any client named, any number quoted, who approved it | Ask. Only YHM, Swaraj and Beato may be named without clearance |
| **Voice and timing** | "I" (founder) or "we" (company page); post-by date | Ask |

**Then read the brief back as a short numbered summary and ask: "Is this right? What would you change?"** Wait for an explicit confirmation. If they correct anything, update it and read it back again. Ask in one compact message, not a long questionnaire, and ask only what is unresolved. Use your agent's question prompt where it has one.

Do not run Step 2 or later until the brief is confirmed. If the user says "just do it" without answering, restate which items you would be guessing and ask again in one line; proceed only if they explicitly accept those items as assumptions, and list them in `copy.md` under "Assumptions accepted by the user".

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

For carousels, **write the slides as plain text first**, then run checkpoint 3 and wait for approval before building any layout.

## Step 5: Make the visual

**Concept gate (all routes that involve an image).** Write the concept brief from `references/concept-first.md` first and show it with the hook. For imagery-led posts the default look is the **poster style**: a bold two-tone headline over a hand-made object scene (`references/poster-style.md`, template `assets/templates/poster.html`, references in `assets/imagery/poster-style/`).

Pick the route. State it in one line.

| Route | When | How |
|---|---|---|
| **A. Edit supplied media** | The user has real footage or photos | ffmpeg for crop, trim, grade, captions; keep the RHAD treatment from `references/imagery.md` |
| **B. Designed static or carousel** (poster style by default) | Stats, frameworks, lessons, case studies, announcements | Build HTML from `assets/templates/` with brand tokens, render with `scripts/render-post.mjs` to PNG and a carousel PDF |
| **C. Motion video** | Reels-style or product story | HyperFrames or Remotion, with `motion-designer` for curves, `gsap` for timelines. Brand motion rules in `references/motion.md` |
| **D. Generated imagery** | A scene or portrait the user does not have | Write the ChatGPT prompt from `references/master-image-prompt.md`, filled with the Media Read and post context. Rule 7 applies |

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

Run checkpoint 5: reply with a short summary and the files, give your critique, ask for theirs, and wait for approval. Only after an explicit yes may you schedule or publish, and only through a tool the user has set up (for example `linkedin-post-writer` with Publora, or the user posting it themselves). Default is: the user posts it.

After posting, offer to log reach, saves and comments for `performance-analyzer-sms` so the next post learns from this one.

## Checkpoints: the user critiques before anything is final

Five checkpoints. At each one: **present the work, give your own critique, ask for theirs, revise, repeat until they approve.** Do not move to the next stage on silence. A "looks good" counts as approval; a question or a change request does not.

| # | Checkpoint | Show | Your own critique covers |
|---|---|---|---|
| 1 | Brief | The confirmed summary (Step 1) | What you are unsure of, what you chose not to assume |
| 2 | Concept and hook | Concept brief, four hooks, your pick and why | Strongest and weakest hook, any cliché risk, any claim that needs proof |
| 3 | Copy | Full post text or carousel slide text (as plain text), first comment, hashtags | Where it sounds like a marketer, any vague line, anything unverifiable, market-safety doubts |
| 4 | Visual | Rendered PNGs or video stills, read-test result | What looks busy, weak or off-brand, what you would cut, legibility on a phone |
| 5 | Final pack | Everything in the delivery folder, QA results, open placeholders | Residual risks, what you could not verify |

**How to ask for critique.** After your own critique, ask: "What is off? What would you change or cut?" Make it easy to answer: offer two or three specific options when relevant. If they say something does not sound like RHAD or does not look right, fix the **cause** (the rule, the prompt, the template), tell them what you changed, and show it again. Do not only reword the output.

**Record decisions.** Keep a short "Decisions and changes" list in `copy.md` (what was changed after critique and why). It becomes the next post's starting point.

**Approval wording.** Mark a stage approved only when the user says so. Name the stage in your question ("Approve the copy so I can build the visual?"). The final yes in checkpoint 5 is also the only thing that allows scheduling or publishing (hard rule 8).

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
