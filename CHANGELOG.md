# Changelog

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
