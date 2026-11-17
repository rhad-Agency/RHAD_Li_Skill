# Companion skills and tools

`scripts/preflight.mjs` checks all of these for Claude Code and Codex. `<agent>` is `claude-code` or `codex`. `scripts/install-skills.ps1` / `.sh` installs what is missing (with `-DryRun` to preview). Ask the user before installing.

## Installed by the script

| Name | Source | Install command (run by script) | Used for |
|---|---|---|---|
| **ffmpeg / ffprobe** | gyan.dev / ffmpeg.org | `winget install Gyan.FFmpeg` (Windows), `brew install ffmpeg` (macOS), apt (Linux) | Media analysis, edits, export |
| **playwright-cli** | github.com/microsoft/playwright-cli | `npm install -g @playwright/cli@latest` then `playwright-cli install --skills` | Render checks, screenshots, page inspection |
| **impeccable** | github.com/pbakaus/impeccable | `npx impeccable install` (interactive: say yes to the design hook) | Critique, audit, polish, slop detection for HTML visuals |
| **taste-skill** | github.com/Leonxlnx/taste-skill | `npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend -g -a <agent>` | Anti-slop art direction and look-and-fix loop (brand overrides its direction) |
| **hyperframes** | github.com/heygen-com/hyperframes | `npx hyperframes skills update` (core set) | HTML to video |
| **remotion** | github.com/remotion-dev/skills | `npx skills add remotion-dev/skills -g -a <agent>` | React to video |
| **ui-ux-pro-max (uiuxpro)** | github.com/nextlevelbuilder/ui-ux-pro-max-skill | `npm install -g ui-ux-pro-max-cli` then `uipro init --ai claude` or `--ai codex` | UX and accessibility checks |
| **gsap-skills ("GASP")** | github.com/greensock/gsap-skills | `npx skills add https://github.com/greensock/gsap-skills -g -a <agent>` | Correct GSAP timelines for motion |
| **linkedin-skills** | github.com/sergebulaev/linkedin-skills (MIT) | Claude Code: `claude plugin marketplace add sergebulaev/linkedin-skills` then `claude plugin install linkedin-skills@linkedin-skills`. Codex: `npx skills add sergebulaev/linkedin-skills -g -a codex` | 12 LinkedIn skills: post-writer, humanizer, hook-extractor, content-planner, repurposer, profile-optimizer, comment-drafter and more |

"Impecable", "Playwrite CLI", "Taste", "uiuxpro" and "GASP" in the original brief were mapped to the repositories above. If the user meant a different tool, change the list in `scripts/skills-manifest.json`.

## Bundled in this skill (`bundled-skills/`, copied by the installer)

| Skill | What | Source |
|---|---|---|
| **motion-designer** | Motion-kit: hand-shaped curves, duration from distance, text treatments, `motion-kit.js` | github.com/hughminhphan/motion-kit (MIT, licence kept inside) |
| **ad-creative** | Ad headlines, descriptions, primary text, creative testing | RHAD attached skill |
| **content-pattern-analyzer-sms** | What topics, formats and times work, from the user's own data | RHAD attached skill |
| **platform-strategy-sms** | LinkedIn, X, Threads, Bluesky tactics | RHAD attached skill |
| **social-seo-researcher** | Hashtags, keywords, search-friendly captions and alt text | RHAD attached skill |

The method of Maggie Stara's skills pack (https://maggiestara.com/claude-skills-pack/) is built into `hooks-and-carousel.md`. It is a set of prompts for building personal skills, not an installable package, so its logic is encoded here rather than installed.

## Already common in RHAD setups (use if present)

`humanizer`, `caption-writer-sms`, `hook-writer-sms`, `carousel-writer-sms`, `content-calendar-sms`, `content-repurposer-sms`, `performance-analyzer-sms`, `campaign-strategist`, `trend-analyst`, `story-reel-scriptwriter`, `media-use`, `playwright-cli`, `meme-monday` (RHAD account memes only).

## Which skill at which step

| Step | Skills |
|---|---|
| Strategy | platform-strategy-sms, content-pattern-analyzer-sms, social-seo-researcher |
| Hooks and copy | linkedin-post-writer, linkedin-hook-extractor, hook-writer-sms, caption-writer-sms, linkedin-humanizer |
| Carousel | carousel-writer-sms (structure only), this skill's templates |
| Visual craft | impeccable (critique, polish), taste-skill (look-and-fix), ui-ux-pro-max (a11y) |
| Motion | hyperframes or remotion, motion-designer, gsap-skills |
| Media | ffmpeg via `scripts/analyze-media.mjs`, media-use |
| QA | `scripts/brand-lint.mjs`, impeccable detect, playwright-cli screenshots |
| Paid variant | ad-creative |
| After posting | performance-analyzer-sms, content-pattern-analyzer-sms |

## Safety

Everything the installer pulls is third-party code run on the user's machine. The script prints each command first. Never add a source the user has not named. LinkedIn read and publish helpers inside linkedin-skills need their own API keys; this skill never stores or prints keys.
