#!/usr/bin/env bash
# Installs the companion tools and skills for rhad-linkedin (macOS/Linux), for Claude Code, Codex, or both.
# Usage: bash install-skills.sh [--agent claude|codex|both] [--dry-run] [--yes]
#        SKILLS_DIR=/path overrides the skills folder (single agent only)
# Always run with --dry-run first. Every third-party command is printed before it runs.
set -u
DRY=0; YES=0; AGENT=claude
while [ $# -gt 0 ]; do case "$1" in --dry-run) DRY=1;; --yes) YES=1;; --agent) shift; AGENT="${1:-claude}";; esac; shift; done
case "$AGENT" in claude|codex|both) ;; *) echo "--agent must be claude, codex or both"; exit 2;; esac
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; ROOT="$(dirname "$HERE")"
AGENTS="$AGENT"; [ "$AGENT" = both ] && AGENTS="claude codex"
if [ -n "${SKILLS_DIR:-}" ] && [ "$AGENT" = both ]; then echo "SKILLS_DIR needs a single --agent."; exit 2; fi
FAILED=()
TMP="${TMPDIR:-/tmp}"

run() { echo "  > $1"; [ "$DRY" = 1 ] && return 0; bash -c "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }
for c in node npm git; do have "$c" || { echo "MISSING prerequisite: $c"; [ "$DRY" = 1 ] || exit 2; }; done
echo "rhad-linkedin installer  agent: $AGENT $([ "$DRY" = 1 ] && echo '(DRY RUN)')"
if [ "$DRY" = 0 ] && [ "$YES" = 0 ]; then read -r -p "Install third-party tools and skills? (y/N) " a; [[ "$a" =~ ^[Yy] ]] || exit 1; fi

# Build a per-agent plan with node (no jq dependency). Placeholders are filled here.
plan() {
node - "$HERE/skills-manifest.json" "$(uname -s)" "$1" <<'JS'
const m = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8')); const os = process.argv[3] === 'Darwin' ? 'mac' : 'linux'; const ag = process.argv[4];
const q = (s) => `'${s.replace(/'/g, `'\\''`)}'`;
const fill = (c) => Object.entries(m.placeholders[ag]).reduce((a, [k, v]) => a.split(`{${k}}`).join(v), c);
if (ag === 'claude') for (const t of m.tools) { const cmds = [t[os], ...(t.all || [])].filter(Boolean); if (cmds.length) console.log(`tool ${q(t.id)} ${q(t.check.join(' '))} ${q(cmds.join(' && '))}`); }
for (const s of m.skills) { const cmds = (s[ag] || s.all).map(fill); console.log(`skill ${q(s.id)} ${q(s.dirs.join(' '))} ${q(cmds.join(' && '))}`); }
for (const b of m.bundled) console.log(`bundled ${q(b)}`);
JS
}

for AG in $AGENTS; do
  echo; echo "== $AG =="
  if [ -n "${SKILLS_DIR:-}" ]; then SK="$SKILLS_DIR"; elif [ "$AG" = codex ]; then SK="$HOME/.agents/skills"; else SK="$HOME/.claude/skills"; fi
  have "$AG" || echo "note: $AG CLI not on PATH. Skills are still copied to $SK."
  tool()  { if bash -c "$2" >/dev/null 2>&1; then echo "OK       $1"; else echo "INSTALL  $1"; run "$3" || FAILED+=("$1"); fi; }
  skill() { for d in $2; do { [ -d "$SK/$d" ] || [ -d "$HOME/.agents/skills/$d" ] || [ -d "$HOME/.claude/skills/$d" ]; } && { echo "OK       $1"; return; }; done; echo "INSTALL  $1"; run "$3" || FAILED+=("$1 ($AG)"); }
  bundled() { local src="$ROOT/bundled-skills/$1"; [ -d "$src" ] || src="$(dirname "$ROOT")/$1"; if [ -d "$SK/$1" ]; then echo "OK       $1 (already present)"; else echo "COPY     $1 -> $SK/$1"; [ "$DRY" = 1 ] || { mkdir -p "$SK" && cp -r "$src" "$SK/$1"; }; fi; }
  plan "$AG" > "$TMP/rhad-linkedin-plan.sh"
  # shellcheck disable=SC1090
  source "$TMP/rhad-linkedin-plan.sh"
done

echo; [ ${#FAILED[@]} -gt 0 ] && echo "Needs attention: ${FAILED[*]}" || echo "Done."
echo "Restart Claude Code or Codex, then run: node scripts/preflight.mjs"
