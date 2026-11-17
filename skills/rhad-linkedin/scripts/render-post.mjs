#!/usr/bin/env node
// Render an HTML post to PNG (per slide) and optionally a carousel PDF using headless Chrome/Edge.
// Usage: node render-post.mjs <file.html> [--size 1080x1350] [--out dir] [--slides N] [--pdf]
// Files are served from a temporary local web server (127.0.0.1, random port, closed on exit) because
// browsers block @font-face loads from file:// URLs. Carousel templates show one slide when loaded with ?slide=N.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync, createReadStream } from 'node:fs';
import { resolve, join, basename, extname, dirname, relative, sep } from 'node:path';

const args = process.argv.slice(2);
const o = { size: '1080x1350', out: 'render', slides: 0, pdf: false }; let file;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--size') o.size = args[++i];
  else if (args[i] === '--out') o.out = args[++i];
  else if (args[i] === '--slides') o.slides = +args[++i];
  else if (args[i] === '--pdf') o.pdf = true;
  else file = args[i];
}
if (!file || !existsSync(file)) { console.error('Usage: render-post.mjs <file.html> [--size WxH] [--out dir] [--slides N] [--pdf]'); process.exit(2); }

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) { console.error('No Chrome, Edge or Chromium found. Set CHROME_PATH.'); process.exit(3); }

const [W, H] = o.size.split('x').map(Number);
const abs = resolve(file);
const out = resolve(o.out); mkdirSync(out, { recursive: true });
const html = readFileSync(abs, 'utf8');
const slideCount = o.slides || (html.match(/<section[^>]*class="[^"]*\bslide\b/g) || []).length || 0;
const name = basename(abs, extname(abs));

// Server root: nearest ancestor that holds the skill's assets and references, else two levels above the file.
let root = dirname(abs);
for (let d = dirname(abs), i = 0; i < 6 && d !== dirname(d); d = dirname(d), i++) { if (existsSync(join(d, 'assets')) && existsSync(join(d, 'references'))) { root = d; break; } }
if (root === dirname(abs)) root = dirname(dirname(abs));
if (!abs.startsWith(root)) root = dirname(abs);

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const server = createServer((req, res) => {
  const p = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(root) || !existsSync(p) || !statSync(p).isFile()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(p).toLowerCase()] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const rel = relative(root, abs).split(sep).map(encodeURIComponent).join('/');
const url = `http://127.0.0.1:${port}/${rel}`;

const base = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=6000', '--no-first-run', `--user-data-dir=${join(out, '.chrome-profile')}`];
const run = (a, timeout = 90000) => new Promise((res) => {
  const p = spawn(chrome, a, { stdio: ['ignore', 'pipe', 'pipe'] }); let so = '', se = '';
  p.stdout.on('data', (d) => (so += d)); p.stderr.on('data', (d) => (se += d));
  const t = setTimeout(() => p.kill(), timeout);
  p.on('close', (code) => { clearTimeout(t); res({ code, so, se }); });
});

async function shot(target, png) {
  const r = await run([...base, `--window-size=${W},${H}`, `--screenshot=${png}`, target], 60000);
  if (!existsSync(png)) { console.error(r.se); await finish(4); }
  console.log('PNG ', png);
}
async function finish(code) { server.close(); process.exit(code); }

if (slideCount > 0) for (let n = 1; n <= slideCount; n++) await shot(`${url}?slide=${n}`, join(out, `${name}-${String(n).padStart(2, '0')}.png`));
else await shot(url, join(out, `${name}.png`));

if (o.pdf) {
  const pdf = join(out, `${name}.pdf`);
  await run([...base, `--window-size=${W},${H}`, '--no-pdf-header-footer', `--print-to-pdf=${pdf}`, url], 90000);
  if (!existsSync(pdf)) { console.error('PDF failed'); await finish(5); }
  console.log('PDF ', pdf);
}
console.log('Now open the PNGs and inspect them by eye before delivering.');
await finish(0);
