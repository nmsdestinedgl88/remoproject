# Bizif — WhatsApp Coin (9:16, 108.7 s)

Build: `npm i && node scripts/sfx.mjs && node scripts/render.mjs` → `out/bizif-whatsapp-coin.mp4` (720×1280, 30 fps).
Preview: `npx remotion studio src/index.ts`.

## Direction (artistbrain)
- **Point of view — "Blue Ledger on Crumpled Paper":** a tactile paper world where Bizif blue (#004BE0) is the only hero colour; gold (#F2B33D) appears only where it means gold-backed value.
- **Palette:** blue 60% · ink #0B1535 / paper #E9EBF0 · gold 10% accent. Three paper modes: light (paper), blue (paper multiplied over brand blue), ink (paper soft-lit on navy).
- **Motion:** spring entrances (rise + scale + fade), staggered; blue slab wipe between ideas; one dominant move per scene; holds before each transition.
- **Isometric diagrams** (isometric-motion style: solids, 3-tone shading, painter's order): bill stack, gold vault + coin, borderless islands, clearinghouse conveyor, user plate → transactions, fee bars, analytics engine, client buildings, regions, services, e-commerce line.
- **Sync:** every caption chunk, counter and SFX cue is timed to the voiceover words (`src/timing.ts`, `scripts/sfx.mjs`).

## Assumed (voiceover transcript was machine-recognised — please verify)
"Meta bought it for $19.3 billion in 2014", "released" (the word before "its own cryptocurrency"), "$382 million in 2023", "five transactions each per day at ten cents". Edit `CAPTIONS` in `src/timing.ts` if any word differs.

## Optional assets to lift quality (not required)
1. **Hero coin, 1:1, transparent background** — "Isometric gold coin, matte brushed gold with a deep-blue (#004BE0) embossed chat-bubble phone glyph at the centre, crisp edge ridges, soft top light, clean flat vector-render look, no text".
2. **Gold bar stack, isometric, transparent** — "Isometric stack of 12 polished gold bars on a navy plinth, soft rim light, flat illustrative style matching deep blue and gold, no text".
3. **Video clip, 9:16, 4 s** — "Slow macro push-in on a gold coin spinning on crumpled white paper, soft blue rim light, shallow depth of field, no text".
4. **Sound:** replace the synthesized bed with a calm 100 BPM electronic track (Pixabay/Mixkit) at -24 dB under the voiceover.
