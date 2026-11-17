#!/usr/bin/env node
// Repo validation. Run locally and in CI. Exit 1 on any failure.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let fails = 0;
const fail = (m) => { fails++; console.log(`FAIL  ${m}`); };
const ok = (m) => console.log(`ok    ${m}`);
const walk = (d, acc = []) => { for (const e of readdirSync(d, { withFileTypes: true })) { if (['.git', 'node_modules', 'dist'].includes(e.name)) continue; const p = join(d, e.name); e.isDirectory() ? walk(p, acc) : acc.push(p); } return acc; };
const files = walk(repo);

// 1. Skill frontmatter
for (const d of readdirSync(join(repo, 'skills'), { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  const f = join(repo, 'skills', d.name, 'SKILL.md');
  if (!existsSync(f)) { fail(`skills/${d.name} has no SKILL.md`); continue; }
  const t = readFileSync(f, 'utf8');
  const fm = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) { fail(`${d.name}: no frontmatter`); continue; }
  const name = (fm[1].match(/^name:\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
  const desc = (fm[1].match(/^description:\s*([\s\S]*?)(?:\r?\n[a-z]+:|$)/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
  if (name !== d.name) fail(`${d.name}: frontmatter name "${name}" does not match folder`);
  else if (!desc) fail(`${d.name}: missing description`);
  else if (desc.length > 1024) fail(`${d.name}: description is ${desc.length} chars (max 1024)`);
  else ok(`skill ${d.name}`);
}

// 2. JSON parses and versions match
const json = (p) => JSON.parse(readFileSync(join(repo, p), 'utf8'));
for (const f of files.filter((p) => p.endsWith('.json'))) { try { JSON.parse(readFileSync(f, 'utf8')); } catch (e) { fail(`invalid JSON ${relative(repo, f)}`); } }
try {
  const v1 = json('.claude-plugin/plugin.json').version;
  const v2 = json('.claude-plugin/marketplace.json').plugins[0].version;
  const v3 = (readFileSync(join(repo, 'skills/rhad-linkedin/SKILL.md'), 'utf8').match(/version:\s*([\d.]+)/) || [])[1];
  const v4 = (readFileSync(join(repo, 'CHANGELOG.md'), 'utf8').match(/^## ([\d.]+)/m) || [])[1];
  v1 === v2 && v2 === v3 && v3 === v4 ? ok(`versions match (${v1})`) : fail(`version mismatch: plugin ${v1}, marketplace ${v2}, SKILL.md ${v3}, CHANGELOG ${v4}`);
} catch (e) { fail(`version check: ${e.message}`); }

// 3. Reference map: every path named in SKILL.md exists
const sk = readFileSync(join(repo, 'skills/rhad-linkedin/SKILL.md'), 'utf8');
const base = join(repo, 'skills/rhad-linkedin');
const refs = [...new Set([...sk.matchAll(/`((?:references|assets|scripts)\/[A-Za-z0-9_./*-]+)`/g)].map((m) => m[1]))];
for (const r of refs) { if (r.includes('*') || r.endsWith('/')) continue; if (!existsSync(join(base, r))) fail(`SKILL.md references missing file ${r}`); }
ok(`${refs.length} paths referenced in SKILL.md checked`);

// 4. Script syntax
for (const f of files.filter((p) => p.endsWith('.mjs'))) { const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' }); if (r.status !== 0) fail(`syntax error ${relative(repo, f)}\n${r.stderr}`); }
ok('mjs scripts parse');

// 5. Brand lint on templates
const lint = join(base, 'scripts/brand-lint.mjs');
for (const [brand, list] of [['rhad', ['carousel.html', 'single-image.html']], ['rhad45', ['poster.html']]]) {
  const r = spawnSync(process.execPath, [lint, ...list.map((f) => join(base, 'assets/templates', f)), '--brand', brand], { encoding: 'utf8' });
  r.status === 0 ? ok(`brand-lint templates (${brand})`) : fail(`brand-lint ${brand}\n${r.stdout}`);
}

// 6. Assets present
for (const a of ['assets/rhad/logos/rhad-logo-red.png', 'assets/rhad45/logos/RHAD45-logo-primary.svg', 'assets/fonts/Unbounded-Variable.ttf', 'assets/fonts/PlusJakartaSans-Variable.ttf', 'assets/imagery/rhad-master-imagery-reference.png', 'assets/tokens/rhad-tokens.css'])
  if (!existsSync(join(base, a))) fail(`missing asset ${a}`);
ok('core assets present');

// 7. Hygiene: size, secrets, junk
const secret = /(sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|ghp_[A-Za-z0-9]{30,}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
const textExt = new Set(['.md', '.mjs', '.json', '.html', '.css', '.js', '.ps1', '.sh', '.yml', '.yaml', '.txt', '.svg']);
for (const f of files) {
  const rel = relative(repo, f);
  const s = statSync(f).size;
  if (s > 8 * 1048576) fail(`${rel} is ${(s / 1048576).toFixed(1)} MB (limit 8 MB)`);
  if (/\.(env|pem|key)$/.test(f) || /\.chrome-profile|\.tmp$/.test(f)) fail(`junk or secret file ${rel}`);
  if (textExt.has(extname(f)) && s < 2 * 1048576 && secret.test(readFileSync(f, 'utf8'))) fail(`secret-like string in ${rel}`);
}
ok('size and secret scan');

console.log(fails ? `\n${fails} failure(s)` : '\nAll checks passed.');
process.exit(fails ? 1 : 0);
