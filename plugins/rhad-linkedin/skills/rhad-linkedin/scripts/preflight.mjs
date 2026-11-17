#!/usr/bin/env node
// Report which tools and companion skills are present, for Claude Code and Codex. Changes nothing.
// Usage: node preflight.mjs [--json]
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const man = JSON.parse(readFileSync(join(here, 'skills-manifest.json'), 'utf8'));
const home = homedir();
const roots = [
  join(home, '.claude', 'skills'), join(home, '.agents', 'skills'),
  join(process.cwd(), '.claude', 'skills'), join(process.cwd(), '.agents', 'skills'),
];
const pluginRoots = [join(home, '.claude', 'plugins'), join(home, '.codex', 'plugins')];

function listSkills() {
  const names = new Set();
  for (const r of roots) if (existsSync(r)) for (const d of readdirSync(r)) names.add(d.toLowerCase());
  const walk = (p, depth) => {
    if (depth > 7 || !existsSync(p)) return;
    let ents; try { ents = readdirSync(p, { withFileTypes: true }); } catch { return; }
    if (ents.some((e) => e.isFile() && e.name === 'SKILL.md')) names.add(p.split(/[\\/]/).pop().toLowerCase());
    for (const e of ents) if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') walk(join(p, e.name), depth + 1);
  };
  for (const r of pluginRoots) walk(r, 0);
  return names;
}
const has = (cmd, args = ['--version']) => spawnSync(cmd, args, { encoding: 'utf8', shell: process.platform === 'win32', stdio: 'pipe' }).status === 0;

const have = listSkills();
const res = { agents: [], tools: [], skills: [], bundled: [] };
res.agents.push({ id: 'claude', ok: has('claude') || existsSync(join(home, '.claude')) });
res.agents.push({ id: 'codex', ok: has('codex') || existsSync(join(home, '.codex')) });
for (const t of man.tools) res.tools.push({ id: t.id, ok: has(t.check[0], t.check.slice(1)) });
for (const s of man.skills) res.skills.push({ id: s.id, ok: s.dirs.some((d) => have.has(d.toLowerCase())) });
for (const b of man.bundled) res.bundled.push({ id: b, ok: have.has(b.toLowerCase()) });
res.self = { id: 'rhad-linkedin', ok: have.has('rhad-linkedin') };

if (process.argv.includes('--json')) { console.log(JSON.stringify(res, null, 2)); process.exit(0); }
const row = (g, name) => { console.log(`\n${name}`); for (const x of res[g]) console.log(`  ${x.ok ? 'OK     ' : 'MISSING'}  ${x.id}`); };
row('agents', 'Agents detected (at least one needed)'); row('tools', 'Tools'); row('skills', 'Companion skills'); row('bundled', 'Bundled skills');
console.log(`\nrhad-linkedin skill itself: ${res.self.ok ? 'found' : 'NOT FOUND in a skills folder'}`);
const missing = [...res.tools, ...res.skills, ...res.bundled].filter((x) => !x.ok);
console.log(missing.length ? `\n${missing.length} missing. Preview: install.ps1 -DryRun (Windows) or install.sh --dry-run, add -Agent claude|codex|both` : '\nAll present.');
