#!/usr/bin/env bash
# Installs the companion tools and skills for rhad-linkedin (macOS/Linux).
# Usage: bash install-skills.sh [--dry-run] [--yes]   (SKILLS_DIR=/path to override ~/.claude/skills)
# Always run with --dry-run first. Every third-party command is printed before it runs.
set -u
DRY=0; YES=0
for a in "$@"; do case "$a" in --dry-run) DRY=1;; --yes) YES=1;; esac; done
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; ROOT="$(dirname "$HERE")"
SK="${SKILLS_DIR:-$HOME/.claude/skills}"; FAILED=()

run() { echo "  > $1"; [ "$DRY" = 1 ] && return 0; bash -c "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }
for c in node npm git; do have "$c" || { echo "MISSING prerequisite: $c"; [ "$DRY" = 1 ] || exit 2; }; done
if [ "$DRY" = 0 ] && [ "$YES" = 0 ]; then read -r -p "Install third-party tools and skills? (y/N) " a; [[ "$a" =~ ^[Yy] ]] || exit 1; fi

# Read the manifest with node (no jq dependency)
node - "$HERE/skills-manifest.json" "$(uname -s)" <<'JS' > "${TMPDIR:-/tmp}/rhad-linkedin-plan.sh"
const m = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8')); const os = process.argv[3] === 'Darwin' ? 'mac' : 'linux';
const q = (s) => `'${s.replace(/'/g, `'\\''`)}'`;
for (const t of m.tools) { const cmds = [t[os], ...(t.all || [])].filter(Boolean); if (!cmds.length) continue; console.log(`tool ${q(t.id)} ${q(t.check.join(' '))} ${q(cmds.join(' && '))}`); }
for (const s of m.skills) console.log(`skill ${q(s.id)} ${q(s.dirs.join(' '))} ${q(s.all.join(' && '))}`);
for (const b of m.bundled) console.log(`bundled ${q(b)}`);
JS

tool()  { if bash -c "$2" >/dev/null 2>&1; then echo "OK       $1"; else echo "INSTALL  $1"; run "$3" || FAILED+=("$1"); fi; }
skill() { for d in $2; do [ -d "$SK/$d" ] || [ -d "$HOME/.agents/skills/$d" ] && { echo "OK       $1"; return; }; done; echo "INSTALL  $1"; run "$3" || FAILED+=("$1"); }
bundled() { local src="$ROOT/bundled-skills/$1"; [ -d "$src" ] || src="$(dirname "$ROOT")/$1"; if [ -d "$SK/$1" ]; then echo "OK       $1 (already present)"; else echo "COPY     $1 -> $SK/$1"; [ "$DRY" = 1 ] || { mkdir -p "$SK" && cp -r "$src" "$SK/$1"; }; fi; }
source "${TMPDIR:-/tmp}/rhad-linkedin-plan.sh"

echo; [ ${#FAILED[@]} -gt 0 ] && echo "Needs attention: ${FAILED[*]}" || echo "Done."
echo "Restart Claude Code, then run: node scripts/preflight.mjs"
