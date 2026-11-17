# Changelog

## 1.3.0

- New hard rule: **be a critic, not a yes-machine.** The skill challenges weak briefs, ideas and change requests once, with a reason and a better option, then lets the user decide. It agrees plainly when an idea is better, never praises by default, never invents objections, and does not give way on hard rules. New "Critic stance" section
- New "How to talk to the user" section: plain words, short messages, at most three questions at a time with options and a recommendation, propose-and-confirm for format, CTA, voice and timing, progress in one line, no internal terms or tool output
- Step 1 now asks in short rounds and challenges the brief before confirming it. Simple text posts review the hook and copy together
- QA checklist and repo validation cover both

## 1.2.0

- New hard rule: **verify, never assume.** The skill checks the first message for brand, information, goal, target platform and audience, asks about every gap, reads the brief back and waits for a yes before any work. Step 1 is now a mandatory verification gate
- New hard rule: **the user critiques before anything is final.** Five checkpoints (brief, concept and hook, copy, visual, final pack). At each, the skill gives its own critique first, asks for the user's, revises, and only continues on approval. Decisions are recorded in `copy.md`
- Installers verify every third-party install, explain each failure with a specific next step, offer to retry in an interactive terminal (up to 5 rounds), print an exact retry command otherwise, and exit with code 3 when something failed. New `-Manifest` / `MANIFEST`, `-NoRetry` / `--no-retry` options and a `fix` hint per dependency in `skills-manifest.json`
- Kept from 1.1.x: shared plugin for Claude Code and Codex, per-agent dependency commands, PATH-independent tool locator, packaged fonts and local render server

## 1.1.1

- Fixed: ffmpeg, ffprobe and playwright-cli were reported missing inside Codex because agent shells have a shorter PATH than your terminal. `scripts/lib/tools.mjs` now finds them in the usual install folders (WinGet Links, npm global, Homebrew, scoop, chocolatey) and honours `FFMPEG_PATH`, `FFPROBE_PATH`, `PLAYWRIGHT_CLI_PATH`. Used by `analyze-media.mjs` and `preflight.mjs`

## 1.1.0

- Works in Claude Code and Codex from one copy of the skills: shared plugin directory `plugins/rhad-linkedin` with `.claude-plugin` and `.codex-plugin` manifests, a Codex marketplace at `.agents/plugins/marketplace.json`, `agents/openai.yaml`, plugin icons
- Installers take an agent target (`claude`, `codex`, `both`, `auto`) and write to `~/.claude/skills` and/or `~/.agents/skills`. Dependency commands are defined per agent in `skills-manifest.json`
- `preflight.mjs` checks both agents. `AGENTS.md` and `CLAUDE.md` added for contributors
- Fixed: variable font files were missing from the package. `render-post.mjs` now serves files over a temporary local server so fonts load
- Validation covers Codex manifest limits and both marketplaces

## 1.0.0

First release.

- End-to-end workflow: brief intake, ffmpeg media analysis gate, strategy, hooks (four approaches, one pick), copy, visual, QA, approval pack. No publishing without an explicit yes
- RHAD (agency) and RHAD45 (product line) brand guides, voice, design system, logos, fonts (Unbounded, Plus Jakarta Sans), tokens
- Concept-first rule: concept brief before any image (message, visible metaphor, element map, read-test) with worked examples
- Poster style: bold two-tone headline over an object scene, template and nine reference posters from the shared Creatives folder
- Wider imagery reference set from the EDGE, RHAD and RHAD45 sites. Master image prompt for ChatGPT with a mandatory NO-TEXT block and variants
- Rules: no numbers on carousel slides, no unnecessary headlines or category names on any creative
- Scripts: `analyze-media`, `brand-lint`, `render-post`, `preflight`, installers
- Bundled skills: motion-designer (motion-kit, MIT), ad-creative, content-pattern-analyzer-sms, platform-strategy-sms, social-seo-researcher
- Third-party installer for ffmpeg, playwright-cli, impeccable, taste-skill, hyperframes, remotion, ui-ux-pro-max, gsap-skills, linkedin-skills
- Plugin manifest, marketplace entry, repo validation and CI
