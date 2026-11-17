# RHAD_Li_Skill

RHAD-branded LinkedIn post production for **Claude Code and Codex**. From a raw brief to a signed-off pack: intake, ffmpeg analysis of any supplied media, hooks and copy in RHAD voice, on-brand visuals (poster, carousel, video), ChatGPT image prompts built from a concept brief, brand lint, and an approval step. It never publishes without an explicit yes.

Covers two brands that are never mixed: **RHAD** (agency, @rhad.agency) and **RHAD45** (product line).

> **Keep this repository private.** It ships internal brand guidance, the RHAD45 strategy documents, client names and reference creative. See [Privacy](#privacy).

## One skill, two agents

Both agents read the same `SKILL.md` folders, so there is one copy of every skill. Only the packaging differs.

| | Claude Code | Codex |
|---|---|---|
| Skills folder | `~/.claude/skills` | `~/.agents/skills` (repo: `.agents/skills`) |
| Plugin manifest | `plugins/rhad-linkedin/.claude-plugin/plugin.json` | `plugins/rhad-linkedin/.codex-plugin/plugin.json` |
| Marketplace | `.claude-plugin/marketplace.json` | `.agents/plugins/marketplace.json` |
| Optional skill metadata | not used | `skills/rhad-linkedin/agents/openai.yaml` |
| Invoke | describe the task, or `/rhad-linkedin` | describe the task, or `$rhad-linkedin` |

## What is in the box

| Path | What |
|---|---|
| `plugins/rhad-linkedin/skills/rhad-linkedin/` | The skill: workflow, brand guides, voice, imagery and poster style, concept-first rule, master image prompt, templates, logos, fonts, reference images, scripts |
| `plugins/rhad-linkedin/skills/motion-designer/` | motion-kit by Hugh Minh Phan (MIT): hand-shaped curves and timing for video |
| `plugins/rhad-linkedin/skills/ad-creative/` | Ad headlines, descriptions, creative testing |
| `plugins/rhad-linkedin/skills/content-pattern-analyzer-sms/` | What topics, formats and times work, from your own data |
| `plugins/rhad-linkedin/skills/platform-strategy-sms/` | LinkedIn, X, Threads and Bluesky tactics |
| `plugins/rhad-linkedin/skills/social-seo-researcher/` | Hashtags, keywords, search-friendly captions and alt text |
| `install.ps1`, `install.sh` | One-step install for Claude Code, Codex or both |
| `tools/validate.mjs`, `tools/build-skill.mjs` | Repo checks (also in CI) and single-file build |
| `AGENTS.md`, `CLAUDE.md` | Guide for agents working on this repo |

## Install

### 1. Installer script (recommended): skills plus dependencies

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1 -DryRun            # preview, changes nothing
powershell -ExecutionPolicy Bypass -File install.ps1                    # auto-detect Claude Code and Codex
powershell -ExecutionPolicy Bypass -File install.ps1 -Agent codex       # claude | codex | both | auto
```

macOS and Linux:

```bash
bash install.sh --dry-run
bash install.sh                    # auto-detect
bash install.sh --agent codex      # claude | codex | both | auto
```

Options: `-Force` / `--force` overwrites skills already installed. `-SkillsDir <path>` / `SKILLS_DIR=<path>` installs to another folder (single agent). `-SkipDeps` / `--skip-deps` copies the skills only. `-Only a,b` / `-Skip a,b` limit the third-party installs (PowerShell).

### 2. Plugin marketplace

Claude Code:

```bash
claude plugin marketplace add rhad-Agency/RHAD_Li_Skill
claude plugin install rhad-linkedin@rhad-linkedin-skill
```

Codex:

```bash
codex plugin marketplace add rhad-Agency/RHAD_Li_Skill
```

Then enable `rhad-linkedin` from the plugin list in the Codex app. Or in a project's `.codex/config.toml`:

```toml
[plugins."rhad-linkedin@rhad-linkedin-skill"]
enabled = true
```

Private repo: sign in first (`gh auth login` or your git credential helper) so the clone works.

Plugins deliver the skills only. Run the installer (with `-SkipDeps` omitted) or its dependency step for the third-party tools.

### 3. Single `.skill` file

```bash
node tools/build-skill.mjs        # writes dist/rhad-linkedin.skill
```

Unzip it into `~/.claude/skills/` (Claude Code) or `~/.agents/skills/` (Codex). It contains the skill and the five bundled skills. Dependencies come from the installer inside it: `scripts/install-skills.ps1 -Agent codex` or `bash scripts/install-skills.sh --agent codex`.

After any install, restart the agent and run:

```bash
node <skills folder>/rhad-linkedin/scripts/preflight.mjs
```

## Troubleshooting

- **Preflight says ffmpeg, ffprobe or playwright-cli are missing, but they work in your terminal.** Agent shells (Codex especially) can start with a shorter PATH. The scripts also search the usual install folders. If a tool is somewhere unusual, set `FFMPEG_PATH`, `FFPROBE_PATH` or `PLAYWRIGHT_CLI_PATH` to the full file path in the environment the agent starts from.
- **Skill not listed after install.** Restart the agent. Codex also supports project skills in `<project>/.agents/skills`, so a skill installed into a project is visible only in that project.
- **Codex cannot read your media or write results.** Codex sandboxes limit file access to the project. Copy the media into the project folder, or allow access, and pass `--out` inside the project.

## Third-party dependencies

Installed by the installer after you confirm. Every command is printed before it runs. The commands for each agent live in `plugins/rhad-linkedin/skills/rhad-linkedin/scripts/skills-manifest.json`. Reasons and details: `references/skills-registry.md`.

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

Image generation is not a dependency. The skill writes prompts for **ChatGPT** and uses ChatGPT's built-in image generation if it is already running there (for example in Codex with ImageGen).

## Use

Ask Claude Code or Codex:

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
| `preflight.mjs` | Reports which tools and companion skills are present for both agents |
| `install-skills.ps1`, `.sh` | Third-party installer used by the root `install.*` |

## Develop

```bash
node tools/validate.mjs          # repo checks, same as CI
node tools/build-skill.mjs       # build dist/rhad-linkedin.skill
```

Read `AGENTS.md` first. Change brand guidance in `skills/rhad-linkedin/references/` and `assets/`. Bump the version in every manifest at once (validate checks they match) and add a line to `CHANGELOG.md`.

## Privacy

This repo contains: internal RHAD45 strategy and pricing notes (`references/rhad45-*-source.md`), client names (YHM, Swaraj, Beato), logos and fonts, and reference creative from RHAD and RHAD45 sites and the shared Creatives folder. No credentials, API keys or personal contact details are included, and `validate.mjs` fails the build if it finds key-like strings. Keep it a **private** repository. If you ever make it public, remove the `*-source.md` strategy files, the client names and the reference images first.

## Licence

See `LICENSE` (all rights reserved by default) and `THIRD_PARTY_NOTICES.md`. Bundled third-party material keeps its own licence.
