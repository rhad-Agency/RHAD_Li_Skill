# Motion for RHAD video and animated posts

Tools: **HyperFrames** (HTML to video) or **Remotion** (React to video), **GSAP** for timelines, **motion-designer** (motion-kit) for curves and timing, **ffmpeg** for finishing. Brand rules below override the defaults of all of them.

## Brand motion character

Confident, quick, exact. Things arrive with intent and then hold still where stillness is the point. Nothing floats, wobbles or glows.

| Rule | Detail |
|---|---|
| Curves | Hand-shaped per move via motion-designer. No named preset as a default (`power3.out` everywhere is the AI tell). Decelerating curves, springs at damping 1. Overshoot rare |
| Duration | From distance and weight (`dur(px, weight)`). Exits about 0.65x of entrances |
| Reactions | One element leads, the rest follow at uneven offsets. No even staggers |
| Text | Headlines **cut on** or type on. Written text types out. Do not fade everything up. No blur-in type, no masked rise as a default |
| Holds | Keep alive with a slow drift or a tiny wiggle, unless stillness is the point |
| Signature move | One per piece: the **scanline displacement** wipe (horizontal streak resolving into a sharp subject). Earns its place by carrying the story |
| Background | White or ink. Flat. No drifting glow orbs, no particles, no shimmer text |
| Logo | Appears at the end or as a small corner mark. Never animated apart or distorted. RHAD45's Join must not separate or loop |
| Pace | Hook inside the first 2 seconds. A visual change every 2 to 4 seconds. Total 15 to 60 s for feed |
| Captions | Burned in, Plus Jakarta Sans 600, white on ink or ink on white. Never a box behind them |
| Sound | Real room audio or a light bed. No stock "corporate" music. Duck music under speech. Real SFX only where it clarifies a move |
| Loudness | About -14 LUFS, true peak -1.5 dB |

## Workflow

1. Media Read first (see `media-analysis.md`).
2. Storyboard: one line per beat with timestamps. Show it before building.
3. Build with HyperFrames or Remotion. Tokens from `assets/tokens`, fonts from `assets/fonts`.
4. Check every beat by scrubbing frames, then render.
5. Finish with ffmpeg export in `linkedin-formats.md`.
6. Look at the contact sheet of the final render using `scripts/analyze-media.mjs` on your own output.

Mocha (the dog) may appear in reels and memes only, with the user. Never on standard LinkedIn posts.
