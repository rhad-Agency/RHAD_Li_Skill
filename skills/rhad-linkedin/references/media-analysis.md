# Media analysis with ffmpeg (mandatory when media is supplied)

Rule: **no copy, layout or generation decision is made on supplied media until it has been analysed.** Metadata is not enough. Look at the frames.

## Run

```bash
node "<skill dir>/scripts/analyze-media.mjs" "<file1>" "<file2>" --out "<work dir>/analysis"
```

Options: `--fps 1` (frames per second for the contact sheet, default adaptive), `--max-frames 24`, `--scene 0.30` (scene-change threshold), `--no-audio`.

Requires `ffmpeg` and `ffprobe` on PATH. If missing, run the installer or tell the user how to install (`winget install Gyan.FFmpeg` on Windows).

## What it produces (per file, in `analysis/<name>/`)

| File | Content |
|---|---|
| `report.json` | Container, duration, fps, resolution, rotation, codecs, bitrate, audio streams, loudness (LUFS and peak), silence spans, scene-change timestamps, black-frame spans, freeze spans, crop-detect |
| `report.md` | Human summary with flags |
| `contact-sheet.jpg` | Tiled keyframes with timestamps burned in (video) or a preview (image) |
| `frames/` | Individual keyframes at scene changes and the midpoint |

Open `contact-sheet.jpg` and 3 to 6 frames with the Read tool. **Look.** The numbers tell you what is technically there. Your eyes tell you what is in it.

## Media Read (write this before anything else)

5 to 10 lines. Cover:

1. **What it is**: subject, setting, action, people (count, not names), any visible text, logos, screens.
2. **Best moment**: timestamp or frame that carries the idea. The hook candidate.
3. **Problems**: blur, shake, low light, clipped audio, silence, black frames, watermarks, third-party logos or trademarks, minors, faces or private data needing consent, copyrighted music.
4. **Technical fit**: orientation vs target format, resolution vs target, fps, duration vs platform limits, audio loudness vs about -14 LUFS.
5. **Brand fit**: does it need the RHAD monochrome treatment, a crop for type space, a cutout, or is it fine as shot?
6. **Decision**: what the post does with it (use as hero, cut to N seconds, crop to 4:5, generate a companion image, do not use).

Show the Media Read to the user and get a nod when the decision changes the brief.

## Rules that follow from the read

- **Copy** quotes, numbers and claims only from what the media and brief actually show or say. If the video says it, transcribe it. Do not paraphrase a number.
- **Hook** comes from the best moment, not from a generic angle.
- **Layout** leaves space where the frame is empty. Never put a headline over a face or the action.
- **Generation** (ChatGPT): reuse the real subject, setting, light and palette. State them in the prompt. If real footage exists, do not generate a contradicting scene.
- **Audio**: if speech is present, transcribe it (the user's transcription tool, or the `transcription` skill) before writing on-screen text. Captions are burned in.
- **Consent and rights**: flag people who are identifiable, any client work not in the allowed list, music, and any third-party brand.

## Common ffmpeg operations for the visual step

| Job | Command sketch |
|---|---|
| Crop to 4:5 centred | `ffmpeg -i in.mp4 -vf "crop=ih*4/5:ih,scale=1080:1350" -c:a copy out.mp4` |
| Trim | `ffmpeg -ss 00:00:03 -to 00:00:15 -i in.mp4 -c copy out.mp4` (re-encode if cuts are not on keyframes) |
| B&W high contrast | `-vf "format=gray,eq=contrast=1.6:brightness=-0.03"` |
| Scanline smear (side bands) | slice with `crop`, offset with `pad`/`overlay` by a sine of the row, or `-vf "scale=iw/6:ih,scale=iw*6:ih:flags=neighbor"` for a coarse horizontal smear on a masked layer |
| Burn captions | `-vf "subtitles=cap.srt:force_style='FontName=Plus Jakarta Sans,FontSize=28,PrimaryColour=&HFFFFFF&'"` |
| Loudness normalise | `-af loudnorm=I=-14:TP=-1.5:LRA=11` |
| LinkedIn-safe export | `-c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k` |
| Frame grab | `ffmpeg -ss 00:00:07.5 -i in.mp4 -frames:v 1 frame.png` |

Always render to a new file. Never overwrite the user's original.
