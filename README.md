# rhad-linkedin-skill

RHAD-branded LinkedIn post production for Claude Code. From a raw brief to a signed-off pack: intake, ffmpeg analysis of any supplied media, hooks and copy in RHAD voice, on-brand visuals (poster, carousel, video), ChatGPT image prompts built from a concept brief, brand lint, and an approval step. It never publishes without an explicit yes.

Covers two brands that are never mixed: **RHAD** (agency, @rhad.agency) and **RHAD45** (product line).

> **Keep this repository private.** It ships internal brand guidance, the RHAD45 strategy documents, client names and reference creative. See [Privacy](#privacy).

## What is in the box

| Path | What |
|---|---|
| `skills/rhad-linkedin/` | The skill: workflow, brand guides, voice, imagery and poster style, concept-first rule, master image prompt, templates, logos, fonts, reference images, scripts |
| `skills/motion-designer/` | motion-kit by Hugh Minh Phan (MIT): hand-shaped curves and timing for video |
| `skills/ad-creative/` | Ad headlines, descriptions, creative testing |
| `skills/content-pattern-analyzer-sms/` | What topics, formats and times work, from your own data |
| `skills/platform-strategy-sms/` | LinkedIn, X, Threads and Bluesky tactics |
| `skills/social-seo-researcher/` | Hashtags, keywords, search-friendly captions and alt text |
| `install.ps1`, `install.sh` | One-step install: copies the skills and installs third-party dependencies |
| `tools/validate.mjs` | Repo checks (also run in CI) |
| `tools/build-skill.mjs` | Builds a single self-contained `dist/rhad-linkedin.skill` |
| `.claude-plugin/` | Plugin manifest and marketplace entry |

## Install

Pick one.

### A. Plugin marketplace (Claude Code)

```bash
claude plugin marketplace add <your-org>/rhad-linkedin-skill
claude plugin install rhad-linkedin@rhad-linkedin-skill
```

This installs the six skills. Run the dependency step below for the third-party tools.

### B. Installer script (skills and dependencies in one go)

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1 -DryRun   # preview, changes nothing
powershell -ExecutionPolicy Bypass -File install.ps1           # install
```

macOS and Linux:

```bash
bash install.sh --dry-run
bash install.sh
```

Options: `-Force` / `--force` overwrites skills already in `~/.claude/skills`. `-SkillsDir <path>` / `SKILLS_DIR=<path>` installs somewhere else. `-Only a,b` and `-Skip a,b` (PowerShell) limit the third-party installs.

### C. Single `.skill` file

```bash
node tools/build-skill.mjs        # writes dist/rhad-linkedin.skill
```

Unzip it into `~/.claude/skills/`. It contains the skill and the five bundled skills. Third-party dependencies still come from the installer inside it (`scripts/install-skills.ps1` or `.sh`).

After any install, restart Claude Code and run:

```bash
node ~/.claude/skills/rhad-linkedin/scripts/preflight.mjs
```

## Third-party dependencies

Installed by `install.*` after you confirm. Every command is printed before it runs. Full list and reasons: `skills/rhad-linkedin/references/skills-registry.md`. Edit `skills/rhad-linkedin/scripts/skills-manifest.json` to change them.

| Dependency | Source | Used for |
|---|---|---|
| ffmpeg, ffprobe | ffmpeg.org, `winget install Gyan.FFmpeg` | Media analysis, edits, export |
| playwright-cli | github.com/microsoft/playwright-cli | Render checks |
| impeccable | github.com/pbakaus/impeccable | Design critique and polish |
| taste-skill | github.com/Leonxlnx/taste-skill | Anti-slop art direction loop |
| hyperframes | github.com/heygen-com/hyperframes | HTML to video |
| remotion | github.com/remotion-dev/skills | React to video |
| ui-ux-pro-max | github.com/nextlevelbuilder/ui-ux-pro-max-skill | UX and accessibility checks |
| gsap-skills | github.com/greensock/gsap-skills | GSAP timelines |
| linkedin-skills | github.com/sergebulaev/linkedin-skills (MIT) | Post writer, humanizer, hook extractor and more |
| Node 22+, Chrome or Edge | | Scripts and rendering |

Image generation is not a dependency. The skill writes prompts for **ChatGPT** and uses ChatGPT's built-in image generation if it is already running there.

## Use

Ask Claude:

- "Make a RHAD LinkedIn carousel about ..."
- "RHAD45 poster post about missed enquiries"
- "Turn this video into a LinkedIn post" (give the file path. It is analysed with ffmpeg first)

Hard rules it enforces: brand first, analyse media before deciding, never invent facts, concept brief before every image, no numbers on carousel slides, no unnecessary headlines or category names, ChatGPT for image generation, no publishing without a yes.

## Scripts (inside `skills/rhad-linkedin/scripts/`)

| Script | Purpose |
|---|---|
| `analyze-media.mjs` | ffprobe and ffmpeg analysis: contact sheet, keyframes, scene changes, loudness, silence, flags |
| `brand-lint.mjs` | Fails copy, HTML and prompt files that break the brand rules |
| `render-post.mjs` | HTML to PNG per slide and carousel PDF via headless Chrome or Edge |
| `preflight.mjs` | Reports which tools and companion skills are present |
| `install-skills.ps1`, `.sh` | Third-party installer used by the root `install.*` |

## Develop

```bash
node tools/validate.mjs          # repo checks, same as CI
node tools/build-skill.mjs       # build dist/rhad-linkedin.skill
```

Change brand guidance in `skills/rhad-linkedin/references/` and `assets/`. Bump the version in `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` and `skills/rhad-linkedin/SKILL.md` together (validate checks they match), and add a line to `CHANGELOG.md`.

## Privacy

This repo contains: internal RHAD45 strategy and pricing notes (`references/rhad45-*-source.md`), client names (YHM, Swaraj, Beato), logos and fonts, and reference creative from RHAD and RHAD45 sites and the shared Creatives folder. No credentials, API keys or personal contact details are included, and `validate.mjs` fails the build if it finds key-like strings. Publish it as a **private** repository. If you ever make it public, remove the `*-source.md` strategy files, the client names and the reference images first.

## Licence

See `LICENSE` (all rights reserved by default) and `THIRD_PARTY_NOTICES.md`. Bundled third-party material keeps its own licence.
