# Repository guide for coding agents (Codex, Claude Code, others)

This repo packages the **rhad-linkedin** skill and five bundled companion skills as one plugin that works in both Claude Code and Codex.

## Layout

```
.claude-plugin/marketplace.json     Claude Code marketplace (source ./plugins/rhad-linkedin)
.agents/plugins/marketplace.json    Codex marketplace (local source ./plugins/rhad-linkedin)
plugins/rhad-linkedin/
  .claude-plugin/plugin.json        Claude plugin manifest
  .codex-plugin/plugin.json         Codex plugin manifest (skills: ./skills/)
  assets/icon.png, logo.png         Plugin icons (square, 512 px)
  skills/<name>/SKILL.md            One copy of every skill, shared by both agents
install.ps1, install.sh             Copy skills to ~/.claude/skills and/or ~/.agents/skills, then install dependencies
tools/validate.mjs                  Repo checks (run before every commit)
tools/build-skill.mjs               Builds dist/rhad-linkedin.skill
```

## Rules for changes

1. Run `node tools/validate.mjs` before committing. It must pass.
2. Keep skills agent-neutral: plain Markdown, Node scripts, no Claude-only or Codex-only tool names without naming the equivalent.
3. Bump the version in **all** of: `plugins/rhad-linkedin/.claude-plugin/plugin.json`, `plugins/rhad-linkedin/.codex-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `plugins/rhad-linkedin/skills/rhad-linkedin/SKILL.md` (`metadata.version`) and `CHANGELOG.md`. Validate checks they match.
4. Codex limits: `interface.displayName` and `shortDescription` at most 30 characters, up to 3 default prompts of at most 128 characters. Validate enforces them.
5. Brand rules live in `plugins/rhad-linkedin/skills/rhad-linkedin/references/`. Do not mix RHAD (agency) and RHAD45 (product) voice, colour or logos. Never add credentials, personal contact details or client results. Keep the repo private.
6. New dependencies go in `plugins/rhad-linkedin/skills/rhad-linkedin/scripts/skills-manifest.json` with a command for both agents, and in `references/skills-registry.md` and `THIRD_PARTY_NOTICES.md`.

## Test an install without touching your machine

```bash
SKILLS_DIR=/tmp/skills-test bash install.sh --agent codex --skip-deps --yes
node /tmp/skills-test/rhad-linkedin/scripts/preflight.mjs
```
