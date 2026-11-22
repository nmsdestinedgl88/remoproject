# Run log
- Skills missing and handled: `animation-principles`, `ui-ux-pro-max` not installed -> motion tokens and type/colour checks set by me, marked UNREVIEWED. HyperFrames standalone skills not installed (CLI says installing is the person's step) -> used `npx hyperframes docs` + `check` + `snapshot` instead.
- artistbrain and designbrain: read and applied by hand in this run (single-agent). Collision rule applied: artistbrain meaning/emotion wins, designbrain spec adjusts.
- Network: proxy blocks jsdelivr -> GSAP vendored (npm gsap@3.12.5) in shared/. Fonts from npm @fontsource (OFL): Archivo 800/900 + IBM Plex Mono 500/600, plus latin-ext files for the U+20A6 naira sign.
- Handle = 8 frames each end; crossfade = 6 frames (0.2 s, under the 0.25 s limit) because 0.25 s is 7.5 frames.
- Gating: default is gated; switched to autonomous per "execute", storyboard is the user's own visual guide.
