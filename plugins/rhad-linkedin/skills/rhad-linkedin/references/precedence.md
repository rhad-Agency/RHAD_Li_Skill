# Precedence: when skills disagree

Order, highest first:

1. The user's explicit instruction in this conversation
2. This skill's brand files (`brand-rhad.md`, `rhad45-brand.md`, `voice-and-tone.md`, `design-system.md`, `imagery.md`, `motion.md`)
3. This skill's hard rules in `SKILL.md`
4. Companion skills' structure and craft advice
5. Companion skills' defaults

A companion skill supplies **method**. This skill supplies **identity**. Take structure, checklists and technique from them. Never take palette, font, tone, motion numbers or imagery style.

## Known conflicts

| Companion | Its default | RHAD answer |
|---|---|---|
| impeccable / taste-skill | Pick an art direction, a font pairing, a palette from a library | The direction is fixed: RHAD. Use them for critique, polish, hierarchy, spacing, accessibility, slop detection. Pass them the tokens |
| ui-ux-pro-max | Suggests style, palette, fonts per product type | Ignore its palette and font suggestions. Keep its UX and accessibility checks |
| motion-designer | "Cut on, type on, no presets" | Compatible, and preferred. Its curves and timing win over HyperFrames' `power3.out` default |
| hyperframes | `gsap.defaults({ duration: 0.6, ease: "power3.out" })` house default | Override. Motion rules in `motion.md` |
| linkedin-post-writer | Hook formulas, humanizer, Publora scheduling | Use formulas. Humanizer on. Scheduling only after the user's yes. Em dashes: RHAD bans them even though the humanizer tolerates them |
| linkedin-humanizer | Allows em dashes up to about 1 per 100 words | RHAD allows none. Replace with a comma, colon or full stop |
| ad-creative | Platform ad specs and copy volume | Use only for paid LinkedIn ad variants. Same brand rules apply to the creative |
| Any skill | Suggests gradients, glass, glow, shadows, pills, rounded tags | Not allowed on RHAD or RHAD45 |
| Any skill | Suggests stock imagery or AI illustration | Use `imagery.md` and the master prompt |
| Any skill | Wants to post or schedule automatically | Not without an explicit yes in chat |

If a conflict is not listed, choose the brand and tell the user in one line what you overrode.
