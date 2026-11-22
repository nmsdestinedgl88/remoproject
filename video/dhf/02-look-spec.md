# 02 LOOK SPEC

**LOOK FAMILY:** code-built isometric ledger (Remotion/SVG, HyperFrames/GSAP, OneTake/HTML). CUT mode=none; STYLEKEY: not used; ISOLATION: not applicable (built in code).

## Colour roles (hex, share)
| Role | Hex | Share |
|---|---|---|
| Paper (ground) | #E6E1D6 | 60% S1-S5 |
| Concrete top / left / right | #D8D3C8 / #B5AFA2 / #948E81 | 30% |
| Ink (text, outline, finale ground) | #17121F | text + finale |
| DHF purple (accent/engine) | #6A2BD9, glow #8B5CF6 | 10% |
| Friction red | #D93A3A (labels: white text on red chip) | accent |
| Solved green | #12794A | accent |
| Kraft (bags band) | #C9A66B | bag stencil band |
Contrast: ink/paper 14.0:1; purple/paper 5.7:1; white/red 4.8:1; white/green 5.5:1; paper/ink 14.0:1. Greyscale check: purple and red separate from paper by value (both much darker).

## Type
Display: **Archivo 900** uppercase, tracking -0.01em, line-height 0.95. Data/labels: **IBM Plex Mono 600** uppercase. Sizes at 1080 wide: headline 96-120, sub-headline 64, labels >= 40, micro-labels never below 36. Naira sign via latin-ext files.

## Motion personality: "settle once, stamp hard"
Structures ease out, settle with at most one 3% overshoot. Impacts (stamps) scale 1.18 -> 1 in 6 f with a dust ring. Playful bounce reserved for: question mark, map pins, coins. Idle breathing +/-1.5% on anything held > 2 s. Grain 6%, vignette 12%.

## Motion tokens (UNREVIEWED: animation-principles skill missing, set by me)
| Action | Easing | Duration band |
|---|---|---|
| Enter | cubic-bezier(0.16,1,0.3,1) | 18-24 f (0.6-0.8 s) |
| Exit | cubic-bezier(0.7,0,0.84,0) | 8-12 f |
| Reposition | cubic-bezier(0.83,0,0.17,1) | 20-30 f |
| Stamp | spring damping 16 stiffness 260 mass 0.5 | ~6-8 f to settle |
| Playful | spring damping 11 stiffness 170 mass 0.7 | free |
| Default spring | damping 20 stiffness 90 mass 1 | free |
Stagger offset: 4 f (list items), 6 f (map pins/cards). Text hold: >= 0.35 s per 4 words after fully typed, minimum 1.2 s for any label.

## Type and colour checks (UNREVIEWED: ui-ux-pro-max skill missing)
Platform safe zone: top 160 px, bottom 400 px, sides 72 px; all text inside. Min 36 px; body labels 40-52. No coloured text below 4.5:1 on its ground (red/green used as chip fills with white text). One accent hue hero per frame. Pairing: condensed-heavy grotesque + mono = distinct roles, no third family.
