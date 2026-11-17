#!/usr/bin/env node
// RHAD brand lint for post copy (.md/.txt) and visual sources (.html/.css/.svg).
// Usage: node brand-lint.mjs <file...> [--brand rhad|rhad45]
// Exit code 1 if any FAIL. WARN does not fail.
import { readFileSync, existsSync } from 'node:fs';
import { extname } from 'node:path';

const args = process.argv.slice(2);
let brand = 'rhad'; const files = [];
for (let i = 0; i < args.length; i++) { if (args[i] === '--brand') brand = args[++i]; else files.push(args[i]); }
if (!files.length) { console.error('Usage: brand-lint.mjs <file...> [--brand rhad|rhad45]'); process.exit(2); }

const PALETTE = {
  rhad: ['#1F2124', '#5B6169', '#FFFFFF', '#D90A2C', '#B00822', '#D6D7D9', '#000000', '#F4F1EC', '#111418', '#D21131'],
  rhad45: ['#F03131', '#B62424', '#951D1D', '#191919', '#FFFFFF', '#F5F3EF', '#5B5B5B', '#D8D3CC', '#76716B', '#176348', '#A21D24', '#000000', '#F4F1EC', '#111418', '#D21131', '#12161C', '#343434'],
}[brand];
if (!PALETTE) { console.error('--brand must be rhad or rhad45'); process.exit(2); }

const HYPE = ['unlock', 'elevate', 'game-changer', 'game changer', 'revolutionary', 'leverage', 'supercharge', 'delve', 'tapestry', 'seamless', 'cutting-edge', 'next-level', 'synergy', 'robust', 'holistic', "in today's fast-paced", 'let me be honest', "here's the thing", 'plot twist', 'what nobody tells you', 'what most people miss', 'the result?', 'comment below to get', 'agree?'];
const RHAD45_BANNED = ['never miss a lead', 'guaranteed revenue', 'unlimited', 'fully autonomous', 'instant booking', 'five-star', '5-star', 'no hidden fees', 'free setup', 'cancel anytime', '24/7', 'guaranteed'];
const ALLOWED_FONTS = ['unbounded', 'plus jakarta sans', 'arial', 'sans-serif', 'system-ui', 'inherit', 'var(--font-display)', 'var(--font-text)'];

let fails = 0, warns = 0;
const out = (lvl, file, loc, msg) => { if (lvl === 'FAIL') fails++; else warns++; console.log(`${lvl}  ${file}${loc ? ':' + loc : ''}  ${msg}`); };
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

function lintText(file, text) {
  // em dash
  for (const m of text.matchAll(/—/g)) out('FAIL', file, lineOf(text, m.index), 'Em dash. Use a comma, colon or full stop.');
  // en dash used as dash between words (space-en-dash-space)
  for (const m of text.matchAll(/ – /g)) out('WARN', file, lineOf(text, m.index), 'Spaced en dash reads as an em dash. Prefer a comma or colon.');
  const low = text.toLowerCase();
  for (const w of HYPE) { let i = -1; while ((i = low.indexOf(w, i + 1)) !== -1) out('FAIL', file, lineOf(text, i), `Banned phrase: "${w}"`); }
  if (brand === 'rhad45') for (const w of RHAD45_BANNED) { let i = -1; while ((i = low.indexOf(w, i + 1)) !== -1) out('FAIL', file, lineOf(text, i), `RHAD45 banned claim: "${w}"`); }
  if (brand === 'rhad45') {
    for (const m of text.matchAll(/RHAD\s?45|Rhad45|rhad 45/g)) if (m[0] !== 'RHAD45') out('FAIL', file, lineOf(text, m.index), `Write "RHAD45" exactly (found "${m[0]}").`);
    for (const m of text.matchAll(/S\$\s?100\s?(?:per month|\/mo\b|a month|pm)/gi)) out('FAIL', file, lineOf(text, m.index), 'Write "S$100/month" exactly.');
  }
  if (brand === 'rhad' && /RHAD45/.test(text)) out('WARN', file, null, 'RHAD45 mentioned in an RHAD post. Confirm this is intended. Do not borrow the RHAD45 voice.');
  if (/\bMocha\b/.test(text)) out('WARN', file, null, 'Mocha appears only in memes and reels with the user, never in standard LinkedIn posts.');
  if (/[\u{1F300}-\u{1FAFF}]/u.test(text)) { const n = (text.match(/[\u{1F300}-\u{1FAFF}]/gu) || []).length; if (n > 2) out('WARN', file, null, `${n} emoji. Keep to 0 to 2.`); }
  const tags = text.match(/(^|\s)#[A-Za-z0-9_]+/g) || [];
  if (tags.length > 5) out('WARN', file, null, `${tags.length} hashtags. Use 3 to 5.`);
  // only enforce post-body rules on copy files
  if (/\.(md|txt)$/.test(file)) {
    const body = text.replace(/^---[\s\S]*?---/, '').trim();
    if (body.length > 3000) out('FAIL', file, null, `Post longer than 3,000 characters (${body.length}). Check you linted the post only, not the whole copy.md.`);
    const first = body.split(/\n/).find((l) => l.trim() && !l.startsWith('#')) || '';
    if (/\?\s*$/.test(first.trim())) out('WARN', file, 1, 'First line is a question. A question opener lowers reach. Move it to the close.');
    if (/\[NEEDS:/i.test(text)) out('WARN', file, null, `${(text.match(/\[NEEDS:/gi) || []).length} unresolved [NEEDS] placeholder(s). List them for the user.`);
    if (/\[YOUR STORY HERE/i.test(text)) out('WARN', file, null, 'Story placeholder still present. User must supply the real moment.');
    const sentences = body.split(/(?<=[.!?])\s+/).filter(Boolean);
    const frag = sentences.filter((s) => s.split(/\s+/).length <= 3).length;
    if (sentences.length >= 6 && frag / sentences.length > 0.35) out('WARN', file, null, 'Many 1 to 3 word sentences. Staccato rhythm reads as an AI tell.');
  }
}

function lintCarousel(file, raw) {
  // Applies to HTML with .slide sections (carousels). No numbers, no category/eyebrow labels.
  if (!/class="[^"]*\bslide\b/.test(raw)) return;
  const vis = raw.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ').replace(/RHAD45/g, 'RHAD');
  for (const m of vis.matchAll(/\d+\s*\/\s*\d+/g)) out('FAIL', file, null, `Page counter "${m[0].trim()}" on a carousel slide. No numbers on carousel slides.`);
  const nums = [...new Set((vis.match(/[$S]?\$?\d[\d,.%]*/g) || []))];
  if (nums.length) out('FAIL', file, null, `Numbers on carousel slides: ${nums.slice(0, 8).join(', ')}. Move figures to the caption.`);
  for (const m of raw.matchAll(/class="[^"]*\b(eyebrow|kicker|category|tag|chip|badge|pill|label)\b[^"]*"/gi)) out('FAIL', file, lineOf(raw, m.index), `Element class "${m[1]}": no eyebrow, category or label text on creatives.`);
  const handles = (vis.match(/@rhad\.agency/gi) || []).length;
  if (handles > 2) out('WARN', file, null, `Handle appears ${handles} times. First and last slide only.`);
}

function lintCss(file, text) {
  for (const m of text.matchAll(/font-style\s*:\s*italic/gi)) out('FAIL', file, lineOf(text, m.index), 'Italics are not used in RHAD design.');
  for (const m of text.matchAll(/(linear|radial|conic)-gradient\s*\(/gi)) out('FAIL', file, lineOf(text, m.index), 'No gradients.');
  for (const m of text.matchAll(/(box-shadow|text-shadow|drop-shadow|backdrop-filter)\s*:?\s*\(?/gi)) out('FAIL', file, lineOf(text, m.index), `No ${m[1]} (flat design).`);
  for (const m of text.matchAll(/border-radius\s*:\s*([^;}]+)/gi)) { const v = m[1].trim(); if (!/^0(px)?$/.test(v)) out('WARN', file, lineOf(text, m.index), `border-radius: ${v}. Pills and rounded chips behind text are not allowed. Blocks and CTAs are square (inputs 4px, RHAD45 chat bubbles 8px).`); }
  for (const m of text.matchAll(/text-transform\s*:\s*uppercase/gi)) out('WARN', file, lineOf(text, m.index), 'All caps: allowed only for one short label or one monument word.');
  for (const m of text.matchAll(/font-family\s*:\s*([^;}]+)/gi)) {
    for (const raw of m[1].split(',')) {
      const f = raw.replace(/["']/g, '').trim().toLowerCase();
      if (f && !ALLOWED_FONTS.includes(f)) out('FAIL', file, lineOf(text, m.index), `Font "${f}" is not a brand font. Use Unbounded and Plus Jakarta Sans.`);
    }
  }
  const allowed = new Set(PALETTE.map((c) => c.toUpperCase()));
  const seen = new Set();
  for (const m of text.matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi)) {
    let hex = '#' + m[1].toUpperCase(); if (hex.length === 4) hex = '#' + [...m[1]].map((c) => c + c).join('').toUpperCase();
    if (!allowed.has(hex) && !seen.has(hex)) { seen.add(hex); out('WARN', file, lineOf(text, m.index), `Colour ${hex} is not in the ${brand} palette. Allowed only for a case-study artwork palette chosen in the brief.`); }
  }
  for (const m of text.matchAll(/\brgba?\([^)]*\)/gi)) out('WARN', file, lineOf(text, m.index), `${m[0]}: translucent or off-token colour. Use palette hex.`);
}

for (const f of files) {
  if (!existsSync(f)) { console.error(`Not found: ${f}`); fails++; continue; }
  const text = readFileSync(f, 'utf8');
  const ext = extname(f).toLowerCase();
  if (['.html', '.htm', '.css', '.svg'].includes(ext)) {
    lintCss(f, text);
    if (ext === '.html' || ext === '.htm') lintCarousel(f, text);
    const plain = ext === '.css' ? '' : text.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ');
    lintText(f, plain);
  } else {
    lintText(f, text);
    if (/prompt/i.test(f)) {
      // Image prompt files must carry the NO-TEXT block.
      const need = [[/no headlines?/i, 'headlines'], [/category names?/i, 'category names'], [/no numbers?|no digits?/i, 'numbers'], [/labels?/i, 'labels']];
      // Concept brief is mandatory: every image needs the thought behind it.
      const brief = [[/concept brief/i, 'a CONCEPT BRIEF heading'], [/message\s*:/i, 'a "Message:" line'], [/element map/i, 'an "Element map"'], [/read-?test/i, 'a "Read-test" line']];
      for (const [re, what] of brief) if (!re.test(text)) out('FAIL', f, null, `Image prompt file has no ${what}. Write the concept brief first (references/concept-first.md).`);
      for (const bad of ['robot', 'lightbulb', 'light bulb', 'handshake', 'rocket', 'globe', 'brain', 'puzzle piece']) { const re = new RegExp(`\\b${bad}s?\\b`, 'i'); const ctx = text.split(/\r?\n/).filter((l) => re.test(l) && !/\b(no|not|never|without|avoid)\b/i.test(l)); if (ctx.length) out('WARN', f, null, `Prompt mentions "${bad}", a banned stock cliché. Choose a specific object from the audience's day.`); }
      for (const [re, what] of need) if (!re.test(text)) out('FAIL', f, null, `Image prompt file is missing the NO-TEXT block: nothing about ${what}. Paste the block from references/master-image-prompt.md.`);
    }
  }
}
console.log(`\n${fails} fail, ${warns} warn  (brand: ${brand})`);
process.exit(fails ? 1 : 0);
