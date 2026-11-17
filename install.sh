#!/usr/bin/env bash
# One-step install for rhad-linkedin (macOS and Linux).
#   bash install.sh --dry-run     preview, changes nothing
#   bash install.sh               install
# Options: --force (overwrite installed skills), --yes (no prompt), --skip-deps (copy skills only)
#          SKILLS_DIR=/path overrides ~/.claude/skills
set -eu
DRY=0; FORCE=0; YES=0; DEPS=1
for a in "$@"; do case "$a" in --dry-run) DRY=1;; --force) FORCE=1;; --yes) YES=1;; --skip-deps) DEPS=0;; esac; done
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DST="${SKILLS_DIR:-$HOME/.claude/skills}"
echo "rhad-linkedin -> $DST $([ "$DRY" = 1 ] && echo '(DRY RUN)')"
if [ "$DRY" = 0 ] && [ "$YES" = 0 ]; then read -r -p "Copy skills and install dependencies? (y/N) " a; [[ "$a" =~ ^[Yy] ]] || { echo Cancelled.; exit 1; }; fi
[ "$DRY" = 1 ] || mkdir -p "$DST"
for d in "$REPO"/skills/*/; do
  n="$(basename "$d")"
  if [ -d "$DST/$n" ] && [ "$FORCE" = 0 ]; then echo "SKIP     $n (exists, use --force to overwrite)"; continue; fi
  echo "COPY     $n"
  [ "$DRY" = 1 ] || { rm -rf "$DST/$n"; cp -r "$d" "$DST/$n"; }
done
[ "$DEPS" = 1 ] || { echo "Dependencies skipped."; exit 0; }
FLAGS="--yes"; [ "$DRY" = 1 ] && FLAGS="--dry-run"
SKILLS_DIR="$DST" bash "$REPO/skills/rhad-linkedin/scripts/install-skills.sh" $FLAGS
