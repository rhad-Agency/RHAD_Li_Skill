#!/usr/bin/env node
// Repo validation for the Claude Code and Codex plugin. Run locally and in CI. Exit 1 on any failure.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plug = join(repo, 'plugins', 'rhad-linkedin');
const skillsDir = join(plug, 'skills');
const base = join(skillsDir, 'rhad-linkedin');
let fails = 0;
const fail = (m) => { fails++; console.log(`FAIL  ${m}`); };
const ok = (m) => console.log(`ok    ${m}`);
const rd = (p) => readFileSync(p, 'utf8');
const walk = (d, acc = []) => { for (const e of readdirSync(d, { withFileTypes: true })) { if (['.git', 'node_modules', 'dist'].includes(e.name)) continue; const p = join(d, e.name); e.isDirectory() ? walk(p, acc) : acc.push(p); } return acc; };
const files = walk(repo);
const J = (p) => { try { return JSON.parse(rd(p)); } catch (e) { fail(`invalid JSON ${relative(repo, p)}: ${e.message}`); return null; } };

// 1. Skills: frontmatter (shared by Claude Code and Codex)
for (const d of readdirSync(skillsDir, { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  const f = join(skillsDir, d.name, 'SKILL.md');
  if (!existsSync(f)) { fail(`skills/${d.name} has no SKILL.md`); continue; }
  const fm = rd(f).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) { fail(`${d.name}: no frontmatter`); continue; }
  const name = (fm[1].match(/^name:\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
  const desc = (fm[1].match(/^description:\s*([\s\S]*?)(?:\r?\n[a-z]+:|$)/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
  if (name !== d.name) fail(`${d.name}: frontmatter name "${name}" does not match folder`);
  else if (!desc) fail(`${d.name}: missing description`);
  else if (desc.length > 1024) fail(`${d.name}: description is ${desc.length} chars (max 1024)`);
  else ok(`skill ${d.name}`);
}

// 2. All JSON parses
for (const f of files.filter((p) => p.endsWith('.json'))) J(f);

// 3. Claude Code manifests
const cPlug = J(join(plug, '.claude-plugin/plugin.json'));
const cMkt = J(join(repo, '.claude-plugin/marketplace.json'));
if (cMkt) {
  for (const p of cMkt.plugins || []) {
    const src = typeof p.source === 'string' ? p.source : null;
    if (!src || !src.startsWith('./')) fail(`claude marketplace: plugin "${p.name}" source must be a ./ path`);
    else if (!existsSync(join(repo, src, '.claude-plugin/plugin.json'))) fail(`claude marketplace: ${src}/.claude-plugin/plugin.json missing`);
    else ok(`claude marketplace -> ${src}`);
  }
}

// 4. Codex manifests (compatibility format) and limits
const xPlug = J(join(plug, '.codex-plugin/plugin.json'));
const xMkt = J(join(repo, '.agents/plugins/marketplace.json'));
if (xPlug) {
  const i = xPlug.interface || {};
  const need = (cond, msg) => { if (!cond) fail(`codex plugin.json: ${msg}`); };
  need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(xPlug.name || '') && xPlug.name.length <= 64, 'name must be lowercase letters, digits, single hyphens, max 64');
  need(xPlug.version, 'version required'); need(xPlug.description && xPlug.description.length <= 4000, 'description required, max 4000');
  need(xPlug.author?.name, 'author.name required'); need(xPlug.skills === './skills/', 'skills must be "./skills/"');
  need(i.displayName && i.displayName.length <= 30, `interface.displayName required, max 30 (is ${i.displayName?.length})`);
  need(i.shortDescription && i.shortDescription.length <= 30, `interface.shortDescription required, max 30 (is ${i.shortDescription?.length})`);
  need(i.longDescription && i.longDescription.length <= 4000, 'interface.longDescription required, max 4000');
  need(i.developerName && i.developerName.length <= 80, 'interface.developerName required, max 80');
  need(i.category, 'interface.category required'); need(Array.isArray(i.capabilities) && i.capabilities.length <= 20, 'interface.capabilities array, max 20');
  const dp = Array.isArray(i.defaultPrompt) ? i.defaultPrompt : [i.defaultPrompt].filter(Boolean);
  need(dp.length <= 3 && dp.every((s) => s.length <= 128), 'defaultPrompt: max 3 prompts, 128 chars each');
  need(/^#[0-9A-Fa-f]{6}$/.test(i.brandColor || '#000000'), 'brandColor must be #RRGGBB');
  for (const k of ['composerIcon', 'logo']) {
    const p = i[k];
    if (!p || !p.startsWith('./assets/')) fail(`codex plugin.json: interface.${k} must be a ./assets/ path`);
    else if (!existsSync(join(plug, p))) fail(`codex plugin.json: ${p} does not exist`);
    else { const b = readFileSync(join(plug, p)); const w = b.readUInt32BE(16), h = b.readUInt32BE(20); (w === h && w >= 48 && b.length < 5 * 1048576) ? ok(`codex ${k} ${w}x${h}`) : fail(`codex ${k} must be square, at least 48px and under 5 MiB (is ${w}x${h})`); }
  }
  if (!existsSync(join(plug, 'skills'))) fail('codex plugin: skills/ folder missing');
}
if (xMkt) {
  for (const p of xMkt.plugins || []) {
    const path = p.source?.path;
    if (p.source?.source !== 'local' || !path?.startsWith('./') || path.includes('..')) fail(`codex marketplace: "${p.name}" needs source {"source":"local","path":"./..."} inside the repo`);
    else if (!existsSync(join(repo, path, '.codex-plugin/plugin.json'))) fail(`codex marketplace: ${path}/.codex-plugin/plugin.json missing`);
    else if (!['AVAILABLE', 'INSTALLED_BY_DEFAULT', 'NOT_AVAILABLE'].includes(p.policy?.installation)) fail('codex marketplace: policy.installation invalid');
    else if (!p.category) fail('codex marketplace: category required');
    else ok(`codex marketplace -> ${path}`);
  }
}

// 5. Versions match everywhere
try {
  const v = {
    claudePlugin: cPlug?.version, claudeMarketplace: cMkt?.plugins?.[0]?.version, codexPlugin: xPlug?.version,
    skill: (rd(join(base, 'SKILL.md')).match(/version:\s*([\d.]+)/) || [])[1], changelog: (rd(join(repo, 'CHANGELOG.md')).match(/^## ([\d.]+)/m) || [])[1],
  };
  new Set(Object.values(v)).size === 1 ? ok(`versions match (${v.skill})`) : fail(`version mismatch: ${JSON.stringify(v)}`);
  if (cPlug?.name !== xPlug?.name) fail('plugin name differs between Claude and Codex manifests');
} catch (e) { fail(`version check: ${e.message}`); }

// 6. Optional Codex skill metadata
const yml = join(base, 'agents/openai.yaml');
if (existsSync(yml)) {
  const t = rd(yml);
  /display_name:/.test(t) && /short_description:/.test(t) && /allow_implicit_invocation:/.test(t) ? ok('agents/openai.yaml present') : fail('agents/openai.yaml missing display_name, short_description or policy');
  for (const m of t.matchAll(/icon_(?:small|large):\s*"(\.\/[^"]+)"/g)) if (!existsSync(join(base, m[1]))) fail(`openai.yaml icon missing: ${m[1]}`);
} else fail('skills/rhad-linkedin/agents/openai.yaml missing');

// 7. Reference map in SKILL.md
const sk = rd(join(base, 'SKILL.md'));
const refs = [...new Set([...sk.matchAll(/`((?:references|assets|scripts)\/[A-Za-z0-9_./*-]+)`/g)].map((m) => m[1]))];
for (const r of refs) { if (r.includes('*') || r.endsWith('/')) continue; if (!existsSync(join(base, r))) fail(`SKILL.md references missing file ${r}`); }
ok(`${refs.length} paths referenced in SKILL.md checked`);

// 7b. Verification gate, critique checkpoints and installer failure handling must stay in place
{
  const need = [['SKILL.md', /Verify, never assume/], ['SKILL.md', /Step 1: Intake and verification gate/], ['SKILL.md', /## Checkpoints: the user critiques before anything is final/], ['SKILL.md', /Be a critic, not a yes-machine/], ['SKILL.md', /## Critic stance/], ['SKILL.md', /## How to talk to the user/], ['references/qa-checklist.md', /Verification and critique/]];
  for (const [f, re] of need) re.test(rd(join(base, f))) ? ok(`${f}: ${re.source.slice(0, 40)}`) : fail(`${f} is missing: ${re}`);
  const ps = rd(join(base, 'scripts/install-skills.ps1')), sh = rd(join(base, 'scripts/install-skills.sh'));
  /Show-Failures/.test(ps) && /Retry the failed items/.test(ps) && /show_failures/.test(sh) && /Retry the failed items/.test(sh) ? ok('installers verify, explain and offer retry') : fail('installers lost failure handling');
  const mm = JSON.parse(rd(join(base, 'scripts/skills-manifest.json')));
  for (const s of [...mm.tools, ...mm.skills]) if (!s.fix) fail(`manifest: ${s.id} has no "fix" hint`);
}

// 8. Skills manifest covers both agents
const man = J(join(base, 'scripts/skills-manifest.json'));
if (man) {
  for (const s of man.skills) { const cl = s.claude || s.all, cx = s.codex || s.all; if (!cl?.length || !cx?.length) fail(`manifest: ${s.id} has no command for ${!cl?.length ? 'claude' : 'codex'}`); }
  for (const ag of ['claude', 'codex']) { if (!man.placeholders?.[ag]?.skillsAgent || !man.skillsDir?.[ag]) fail(`manifest: placeholders/skillsDir missing for ${ag}`); }
  ok('manifest has commands for claude and codex');
}

// 9. Script syntax
for (const f of files.filter((p) => p.endsWith('.mjs'))) { const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' }); if (r.status !== 0) fail(`syntax error ${relative(repo, f)}\n${r.stderr}`); }
ok('mjs scripts parse');

// 10. Brand lint on templates
const lint = join(base, 'scripts/brand-lint.mjs');
for (const [brand, list] of [['rhad', ['carousel.html', 'single-image.html']], ['rhad45', ['poster.html']]]) {
  const r = spawnSync(process.execPath, [lint, ...list.map((f) => join(base, 'assets/templates', f)), '--brand', brand], { encoding: 'utf8' });
  r.status === 0 ? ok(`brand-lint templates (${brand})`) : fail(`brand-lint ${brand}\n${r.stdout}`);
}

// 11. Assets present
for (const a of ['assets/rhad/logos/rhad-logo-red.png', 'assets/rhad45/logos/RHAD45-logo-primary.svg', 'assets/fonts/Unbounded-Variable.ttf', 'assets/fonts/PlusJakartaSans-Variable.ttf', 'assets/imagery/rhad-master-imagery-reference.png', 'assets/tokens/rhad-tokens.css'])
  if (!existsSync(join(base, a))) fail(`missing asset ${a}`);
ok('core assets present');

// 12. Hygiene: size, secrets, junk
const secret = /(sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|ghp_[A-Za-z0-9]{30,}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
const textExt = new Set(['.md', '.mjs', '.json', '.html', '.css', '.js', '.ps1', '.sh', '.yml', '.yaml', '.txt', '.svg']);
for (const f of files) {
  const rel = relative(repo, f); const s = statSync(f).size;
  if (s > 8 * 1048576) fail(`${rel} is ${(s / 1048576).toFixed(1)} MB (limit 8 MB)`);
  if (/\.(env|pem|key)$/.test(f) || /\.chrome-profile|\.tmp$/.test(f)) fail(`junk or secret file ${rel}`);
  if (textExt.has(extname(f)) && s < 2 * 1048576 && secret.test(rd(f))) fail(`secret-like string in ${rel}`);
}
ok('size and secret scan');

console.log(fails ? `\n${fails} failure(s)` : '\nAll checks passed.');
process.exit(fails ? 1 : 0);
