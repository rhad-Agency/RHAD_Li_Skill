# LinkedIn formats and limits

LinkedIn changes these. Treat the numbers as working defaults and confirm against the current LinkedIn help centre before anything unusual. Last reviewed with this skill: November 2026.

| Format | Spec | Use for |
|---|---|---|
| Text post | Up to 3,000 characters. About the first 140 to 210 characters show before "see more" on mobile. Keep the hook inside about 12 to 15 words | Opinions, lessons, stories |
| Single image | 1080x1350 (4:5) best on mobile. 1080x1080 ok. JPG or PNG, keep under 5 MB | One strong visual, one stat |
| Multi-image | Up to 20 images | Event recaps, before/after |
| Document (carousel) | PDF, 1080x1350 pages recommended, 6 to 10 pages usual. Large file limit exists (check). Title field shows on top | Frameworks, case studies, step lists |
| Native video | MP4, H.264, AAC. 1080x1350 or 1080x1080 feed, 1080x1920 vertical. Under 200 MB is safe. 15 to 90 s performs well in feed. Captions burned in | Stories, reactions, product moments |
| Poll | Short question, up to 4 options | Only with a real question |
| Article / newsletter | Long form | Rarely |

## Practical rules

- Native documents, images and video outperform external links. Put links in the first comment.
- Post the carousel PDF as a **document**, not as images, to keep swipe behaviour. Name the document with the title you want shown.
- Mobile first. Read every visual at about 375px wide.
- Post timing: use the user's own analytics if they have it (`content-pattern-analyzer-sms`). Otherwise Tuesday to Thursday, 8 to 10am in the target market's time zone is a sensible starting guess, labelled as a guess.
- One post per idea. Do not cross-post identical copy to X or Instagram. Use `content-repurposer-sms` to adapt.
- Company page vs founder profile: founder-voice posts usually travel further. Confirm who posts.
- Never fabricate performance data. If the user wants a prediction, say it is a guess.

## Video export

```
ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -r 30 -movflags +faststart -c:a aac -b:a 192k -ar 48000 out.mp4
```
Loudness about -14 LUFS integrated, true peak -1.5 dB.

## Per-market notes

SG, ID, IN, UK, AU: time zones differ by up to 10 hours. If the audience is split, pick the market that matters for the goal and say so. See `voice-and-tone.md` for market safety.
