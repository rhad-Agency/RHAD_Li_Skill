#!/usr/bin/env node
// Report which tools and companion skills are present. Changes nothing.
// Usage: node preflight.mjs [--json]
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const man = JSON.parse(readFileSync(join(here, 'skills-manifest.json'), 'utf8'));
const home = homedir();
const roots = [join(home, '.claude', 'skills'), join(home, '.agents', 'skills'), join(process.cwd(), '.claude', 'skills'), join(process.cwd(), '.agents', 'skills')];
const pluginRoot = join(home, '.claude', 'plugins');

function listSkills() {
  const names = new Set();
  for (const r of roots) if (existsSync(r)) for (const d of readdirSync(r)) names.add(d.toLowerCase());
  // plugin caches: look two to five levels deep for SKILL.md parents
  const walk = (p, depth) => {
    if (depth > 6 || !existsSync(p)) return;
    let ents; try { ents = readdirSync(p, { withFileTypes: true }); } catch { return; }
    if (ents.some((e) => e.isFile() && e.name === 'SKILL.md')) names.add(p.split(/[\\/]/).pop().toLowerCase());
    for (const e of ents) if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') walk(join(p, e.name), depth + 1);
  };
  walk(pluginRoot, 0);
  return names;
}

const have = listSkills();
const res = { tools: [], skills: [], bundled: [] };
for (const t of man.tools) {
  const r = spawnSync(t.check[0], t.check.slice(1), { encoding: 'utf8', shell: process.platform === 'win32' });
  res.tools.push({ id: t.id, ok: r.status === 0 });
}
for (const s of man.skills) res.skills.push({ id: s.id, ok: s.dirs.some((d) => have.has(d.toLowerCase())) });
for (const b of man.bundled) res.bundled.push({ id: b, ok: have.has(b.toLowerCase()) });

if (process.argv.includes('--json')) { console.log(JSON.stringify(res, null, 2)); process.exit(0); }
const row = (g, name) => { console.log(`\n${name}`); for (const x of res[g]) console.log(`  ${x.ok ? 'OK     ' : 'MISSING'}  ${x.id}`); };
row('tools', 'Tools'); row('skills', 'Companion skills'); row('bundled', 'Bundled skills (installed to ~/.claude/skills)');
const missing = [...res.tools, ...res.skills, ...res.bundled].filter((x) => !x.ok);
console.log(missing.length ? `\n${missing.length} missing. Preview: scripts/install-skills.ps1 -DryRun (Windows) or scripts/install-skills.sh --dry-run` : '\nAll present.');
