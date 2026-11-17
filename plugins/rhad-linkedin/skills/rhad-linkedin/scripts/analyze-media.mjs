#!/usr/bin/env node
// Analyse images/videos with ffprobe + ffmpeg before any copy or generation decision.
// Usage: node analyze-media.mjs <file...> [--out dir] [--max-frames 24] [--scene 0.30] [--no-audio]
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const files = [];
const opt = { out: 'analysis', maxFrames: 24, scene: 0.30, audio: true };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--out') opt.out = args[++i];
  else if (a === '--max-frames') opt.maxFrames = +args[++i];
  else if (a === '--scene') opt.scene = +args[++i];
  else if (a === '--no-audio') opt.audio = false;
  else files.push(a);
}
if (!files.length) { console.error('Usage: analyze-media.mjs <file...> [--out dir]'); process.exit(2); }

const run = (cmd, a, o = {}) => spawnSync(cmd, a, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, ...o });
for (const t of ['ffmpeg', 'ffprobe']) {
  if (run(t, ['-version']).status !== 0) {
    console.error(`${t} not found on PATH. Install ffmpeg (Windows: winget install Gyan.FFmpeg) or run scripts/install-skills.ps1.`);
    process.exit(3);
  }
}

const IMG = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tif', '.tiff', '.avif', '.heic']);
const fmt = (n, d = 2) => (n == null || Number.isNaN(n) ? null : +(+n).toFixed(d));
const ts = (s) => { const m = Math.floor(s / 60); return `${String(m).padStart(2, '0')}:${(s - m * 60).toFixed(1).padStart(4, '0')}`; };
const FONT = process.platform === 'win32' ? 'C\\:/Windows/Fonts/arial.ttf' : '/System/Library/Fonts/Supplemental/Arial.ttf';

function probe(file) {
  const r = run('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file]);
  if (r.status !== 0) throw new Error(`ffprobe failed: ${r.stderr.trim()}`);
  return JSON.parse(r.stdout);
}

function spans(text, startRe, endRe) {
  const out = []; let cur = null;
  for (const line of text.split(/\r?\n/)) {
    let m;
    if ((m = line.match(startRe))) cur = { start: +m[1] };
    if ((m = line.match(endRe)) && cur) { cur.end = +m[1]; if (m[2]) cur.duration = +m[2]; out.push(cur); cur = null; }
  }
  return out;
}

function analyseOne(file) {
  const abs = resolve(file);
  const name = basename(abs, extname(abs));
  const dir = join(resolve(opt.out), name.replace(/[^\w.-]+/g, '_'));
  mkdirSync(join(dir, 'frames'), { recursive: true });
  const p = probe(abs);
  const v = p.streams.find((s) => s.codec_type === 'video');
  const au = p.streams.filter((s) => s.codec_type === 'audio');
  const isImage = IMG.has(extname(abs).toLowerCase()) || (v && (!p.format.duration || +p.format.duration === 0) && au.length === 0);
  const rot = v?.side_data_list?.find((d) => d.rotation != null)?.rotation ?? (v?.tags?.rotate ? +v.tags.rotate : 0);
  let w = v?.width, h = v?.height;
  if (Math.abs(rot) === 90) [w, h] = [h, w];
  const dur = +(p.format.duration || 0);
  const [fn, fd] = (v?.avg_frame_rate || '0/1').split('/').map(Number);
  const fps = fd ? fn / fd : 0;

  const rep = {
    file: abs, kind: isImage ? 'image' : 'video',
    container: p.format.format_name, sizeMB: fmt(+p.format.size / 1048576),
    durationSec: fmt(dur), bitrateKbps: fmt((+p.format.bit_rate || 0) / 1000, 0),
    video: v ? { codec: v.codec_name, width: w, height: h, rotation: rot, fps: fmt(fps), pixFmt: v.pix_fmt, aspect: fmt(w / h, 3), orientation: w === h ? 'square' : w > h ? 'landscape' : 'portrait' } : null,
    audio: au.map((a) => ({ codec: a.codec_name, channels: a.channels, sampleRate: +a.sample_rate })),
    flags: [], sceneChanges: [], silence: [], blackSpans: [], freezeSpans: [], loudness: null, cropDetect: null,
  };

  const outFrames = join(dir, 'frames');

  if (isImage) {
    run('ffmpeg', ['-y', '-v', 'error', '-i', abs, '-vf', 'scale=1080:-2:force_original_aspect_ratio=decrease', '-frames:v', '1', join(dir, 'contact-sheet.jpg')]);
    run('ffmpeg', ['-y', '-v', 'error', '-i', abs, '-frames:v', '1', join(outFrames, 'preview.png')]);
    const sig = run('ffmpeg', ['-v', 'error', '-i', abs, '-vf', 'signalstats,metadata=print:file=-', '-frames:v', '1', '-f', 'null', '-']);
    const grab = (k) => +(sig.stdout.match(new RegExp(`lavfi\\.signalstats\\.${k}=([\\d.]+)`)) || [])[1];
    rep.stats = { brightnessAvg: grab('YAVG'), brightnessMin: grab('YMIN'), brightnessMax: grab('YMAX'), saturationAvg: grab('SATAVG') };
    if (rep.stats.saturationAvg < 8) rep.flags.push('Near monochrome already');
    if (rep.stats.brightnessAvg < 60) rep.flags.push('Dark image: check legibility of any type on it');
    if (rep.stats.brightnessAvg > 200) rep.flags.push('Very bright image: good for ink type, check white type');
    if (w < 1080 && h < 1080) rep.flags.push(`Low resolution (${w}x${h}) for a 1080 canvas`);
  } else {
    // keyframes: scene changes + adaptive uniform sampling
    const sc = run('ffmpeg', ['-v', 'info', '-i', abs, '-an', '-vf', `select='gt(scene,${opt.scene})',showinfo`, '-f', 'null', '-']);
    rep.sceneChanges = [...sc.stderr.matchAll(/pts_time:([\d.]+)/g)].map((m) => fmt(+m[1]));
    const n = Math.max(6, Math.min(opt.maxFrames, Math.ceil(dur / 2)));
    const step = dur / n;
    const cols = n <= 8 ? 4 : n <= 15 ? 5 : 6;
    const rows = Math.ceil(n / cols);
    const tileW = 360;
    const vf = `fps=1/${step.toFixed(3)},scale=${tileW}:-2,drawtext=fontfile='${FONT}':text='%{pts\\:hms}':x=6:y=6:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6,tile=${cols}x${rows}`;
    const cs = run('ffmpeg', ['-y', '-v', 'error', '-i', abs, '-an', '-vf', vf, '-frames:v', '1', '-q:v', '3', join(dir, 'contact-sheet.jpg')]);
    if (cs.status !== 0) {
      // fallback without drawtext (font path issues)
      run('ffmpeg', ['-y', '-v', 'error', '-i', abs, '-an', '-vf', `fps=1/${step.toFixed(3)},scale=${tileW}:-2,tile=${cols}x${rows}`, '-frames:v', '1', '-q:v', '3', join(dir, 'contact-sheet.jpg')]);
    }
    const picks = [...new Set([0.2, ...rep.sceneChanges.slice(0, 8), dur / 2, Math.max(dur - 0.5, 0)].map((t) => +t.toFixed(2)))].filter((t) => t >= 0 && t < dur).slice(0, 12);
    for (const t of picks) run('ffmpeg', ['-y', '-v', 'error', '-ss', String(t), '-i', abs, '-frames:v', '1', '-q:v', '2', join(outFrames, `t${String(t).replace('.', '_')}.jpg`)]);

    const bl = run('ffmpeg', ['-v', 'info', '-i', abs, '-an', '-vf', 'blackdetect=d=0.2:pix_th=0.10', '-f', 'null', '-']);
    rep.blackSpans = [...bl.stderr.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => ({ start: +m[1], end: +m[2] }));
    const fz = run('ffmpeg', ['-v', 'info', '-i', abs, '-an', '-vf', 'freezedetect=n=0.003:d=1.0', '-f', 'null', '-']);
    rep.freezeSpans = spans(fz.stderr, /freeze_start: ([\d.]+)/, /freeze_end: ([\d.]+)/);
    const cd = run('ffmpeg', ['-v', 'info', '-ss', String(Math.min(2, dur / 2)), '-i', abs, '-t', '3', '-an', '-vf', 'cropdetect=24:2:0', '-f', 'null', '-']);
    const last = [...cd.stderr.matchAll(/crop=(\d+:\d+:\d+:\d+)/g)].pop();
    rep.cropDetect = last ? last[1] : null;
    if (rep.cropDetect) { const [cw, ch] = rep.cropDetect.split(':').map(Number); if (cw < w * 0.95 || ch < h * 0.95) rep.flags.push(`Letterbox or pillarbox detected (content ${cw}x${ch} inside ${w}x${h})`); }

    if (opt.audio && au.length) {
      const ld = run('ffmpeg', ['-v', 'info', '-i', abs, '-vn', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
      const jm = ld.stderr.match(/\{[\s\S]*?"target_offset"[\s\S]*?\}/);
      if (jm) { try { const j = JSON.parse(jm[0]); rep.loudness = { integratedLUFS: +j.input_i, truePeakdB: +j.input_tp, lra: +j.input_lra }; } catch {} }
      const sl = run('ffmpeg', ['-v', 'info', '-i', abs, '-vn', '-af', 'silencedetect=noise=-40dB:d=0.7', '-f', 'null', '-']);
      rep.silence = spans(sl.stderr, /silence_start: ([\d.]+)/, /silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/);
      if (rep.loudness) {
        if (rep.loudness.truePeakdB > -1) rep.flags.push(`Audio clipping risk (true peak ${rep.loudness.truePeakdB} dB)`);
        if (rep.loudness.integratedLUFS < -24) rep.flags.push(`Quiet audio (${rep.loudness.integratedLUFS} LUFS): normalise toward -14`);
        if (rep.loudness.integratedLUFS > -9) rep.flags.push(`Loud audio (${rep.loudness.integratedLUFS} LUFS)`);
      }
    } else if (!au.length) rep.flags.push('No audio stream: captions and on-screen text must carry the message');

    if (dur > 600) rep.flags.push('Longer than 10 minutes: over LinkedIn native video limit');
    if (dur > 90) rep.flags.push('Over 90 s: cut for feed unless the story needs it');
    if (rep.blackSpans.length) rep.flags.push(`${rep.blackSpans.length} black span(s): trim`);
    if (rep.freezeSpans.length) rep.flags.push(`${rep.freezeSpans.length} frozen span(s)`);
    if (fps && fps < 24) rep.flags.push(`Low frame rate (${fmt(fps)} fps)`);
    if (rot) rep.flags.push(`Rotation metadata ${rot}: effective size ${w}x${h}`);
    if (h < 1080 && w < 1080) rep.flags.push(`Low resolution (${w}x${h}) for a 1080 canvas`);
  }

  if (w && h) {
    const r = w / h;
    rep.formatFit = {
      '4:5 feed (1080x1350)': r >= 0.78 && r <= 0.82 ? 'native' : r > 0.82 ? 'crop sides' : 'crop top/bottom',
      '1:1 feed (1080x1080)': Math.abs(r - 1) < 0.03 ? 'native' : 'crop',
      '9:16 vertical (1080x1920)': Math.abs(r - 0.5625) < 0.03 ? 'native' : r > 0.5625 ? 'crop sides, or pad' : 'native-ish',
      '16:9 landscape': Math.abs(r - 1.7778) < 0.05 ? 'native' : 'pad or crop',
    };
  }

  writeFileSync(join(dir, 'report.json'), JSON.stringify(rep, null, 2));
  const md = [];
  md.push(`# Media report: ${basename(abs)}`, '');
  md.push(`- Kind: ${rep.kind}`, `- Container: ${rep.container}, ${rep.sizeMB} MB`);
  if (rep.video) md.push(`- Video: ${rep.video.codec} ${rep.video.width}x${rep.video.height} (${rep.video.orientation}), ${rep.video.fps} fps, rotation ${rep.video.rotation}`);
  if (!isImage) md.push(`- Duration: ${ts(dur)} (${rep.durationSec} s), bitrate ${rep.bitrateKbps} kbps`);
  md.push(`- Audio: ${rep.audio.length ? rep.audio.map((a) => `${a.codec} ${a.channels}ch ${a.sampleRate}Hz`).join('; ') : 'none'}`);
  if (rep.loudness) md.push(`- Loudness: ${rep.loudness.integratedLUFS} LUFS, true peak ${rep.loudness.truePeakdB} dB, LRA ${rep.loudness.lra}`);
  if (rep.stats) md.push(`- Image stats: brightness avg ${rep.stats.brightnessAvg}, saturation avg ${rep.stats.saturationAvg}`);
  if (rep.sceneChanges.length) md.push(`- Scene changes (s): ${rep.sceneChanges.join(', ')}`);
  if (rep.silence.length) md.push(`- Silence spans: ${rep.silence.map((s) => `${ts(s.start)}-${ts(s.end)}`).join(', ')}`);
  if (rep.blackSpans.length) md.push(`- Black spans: ${rep.blackSpans.map((s) => `${ts(s.start)}-${ts(s.end)}`).join(', ')}`);
  if (rep.freezeSpans.length) md.push(`- Frozen spans: ${rep.freezeSpans.map((s) => `${ts(s.start)}-${ts(s.end)}`).join(', ')}`);
  if (rep.formatFit) { md.push('', '## Format fit'); for (const [k, val] of Object.entries(rep.formatFit)) md.push(`- ${k}: ${val}`); }
  md.push('', '## Flags', ...(rep.flags.length ? rep.flags.map((f) => `- ${f}`) : ['- none']));
  md.push('', '## Next', '- Open `contact-sheet.jpg` and the images in `frames/`. Look at them.', '- Write the Media Read (see references/media-analysis.md) before any copy or generation decision.');
  writeFileSync(join(dir, 'report.md'), md.join('\n'));
  console.log(`\n${basename(abs)} -> ${dir}`);
  console.log(`  ${rep.kind}${rep.video ? ` ${rep.video.width}x${rep.video.height} ${rep.video.orientation}` : ''}${!isImage ? `, ${rep.durationSec}s` : ''}; flags: ${rep.flags.length ? rep.flags.join(' | ') : 'none'}`);
  console.log(`  contact sheet: ${join(dir, 'contact-sheet.jpg')}`);
  return { file: abs, dir, report: rep };
}

mkdirSync(resolve(opt.out), { recursive: true });
const results = [];
for (const f of files) {
  if (!existsSync(f)) { console.error(`Not found: ${f}`); continue; }
  try { results.push(analyseOne(f)); } catch (e) { console.error(`Failed on ${f}: ${e.message}`); }
}
writeFileSync(join(resolve(opt.out), 'index.json'), JSON.stringify(results.map((r) => ({ file: r.file, dir: r.dir, kind: r.report.kind, flags: r.report.flags })), null, 2));
console.log(`\nDone. ${results.length}/${files.length} analysed. Read the contact sheets, then write the Media Read.`);
