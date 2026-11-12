# Reference style kit: "app feature tour" promo

Source: one 34.1 s, 720×1280, 30 fps, H.264 + AAC video. It is a fast-food mobile-app promo.
Measured with `hyperframes measure probe|cuts|events|look` and `hyperframes audio`, plus frame sheets read by eye.
Use this kit for your own brand. Do not reuse the reference's logo, photos or UI copy.

## 1. Format and look

| Item | Value |
|---|---|
| Canvas | 720×1280 (9:16), 30 fps, 34 s (1021 frames) |
| Main background | Flat brand red `#D90006`, sampled at 3.0 s, 5.6 s and 26.5 s |
| Alternate backgrounds | Cream `#F7F3EA` (counter and detail scenes), white (icon scene), full-bleed warm photo (mood scenes) |
| Accent | Yellow `#FFC20E` (stars, highlights, pill buttons, swoosh arcs) |
| Text | Bold grotesque sans. Headline pairs a dark small line with a red or yellow big line, e.g. "Make it / **yours.**" |
| Cards | White, 24–32 px radius, soft drop shadow, about 80 % of canvas width |
| Photo grade | Warm, high contrast. Mean luma 133, contrast 60, saturation 0.57, warmth 103 |
| Cursor | White hand pointer with black outline. Taps with a small press-scale |

Rule: one idea per scene, one card per idea, one accent colour moving the eye.

## 2. Structure (shot list)

22 shots in 34 s. The median shot lasts 1.1 s. The fastest run is 4 cuts in 0.4 s, and the longest hold is 5.1 s (end card).

| # | Time (s) | Background | Content | Motion |
|---|---|---|---|---|
| 1 | 0.0–2.2 | Photo (diner table, phone on table) | Slow push-in. A glass UI card fades up above the phone at 1.4 s | Push-in 100→108 %. Card fades and rises 24 px |
| 2 | 2.2–4.3 | Red | "Good afternoon." menu grid. Tiles stagger in, yellow flash on each as it lands. Cursor taps "+" on item 1 | Stagger 80–100 ms. Grid scrolls up. Tap turns "+" into a check |
| 3 | 4.3–6.9 | Cream | "Your usual." card with one item and a quantity stepper | Card scales in 0.9→1 |
| 4 | 6.9–9.0 | Red | "extra fries." Product duplicates 1→2 as the cursor taps "+" | Product pops with overshoot. Counter ticks |
| 5 | 9.0–9.9 | Red→white | Brand-mark arches sweep across the screen and reveal a white app-icon tile | Wipe 0.5 s. Icon settles to 40 % scale |
| 6 | 9.9–11.0 | White→pink | Cursor taps the icon. Ripple. Icon morphs into a blank card | Press 0.95 scale. Ripple 400 ms. Morph 0.5 s |
| 7 | 11.0–13.8 | Red / photo | "Make it yours." customise list, cursor taps Save. Then "Your order" card on photo | Rows slide in. Cut on the tap |
| 8 | 12.2–13.8 | Light map | Map card, blue route draws, pin drops | Route stroke-draws 0.8 s. Pin bounces |
| 9 | 13.8–18.0 | Red | Three photo cards fan in, then one tilts in 3D ("Drive thru"). Selection pill flips to "selected" | Fan stagger 120 ms. 3D tilt ±8°, 0.6 s |
| 10 | 18.0–20.2 | Photo | "App-only deals." tilted card, then Meal Deal card with yellow swoosh arcs and a star | Card rotates in from −6°. Arcs sweep 0.4 s |
| 11 | 20.2–21.9 | Photo, cream, gray | Points card, then a ring that counts 2,512 → 3,500 in about 1.4 s. Ring glows, then the card expands into a reward list | Count-up ease-out. Glow pulse. Shared-element expand |
| 12 | 21.9–23.0 | Photo | Reward list, cursor taps. Red check badge pops. Cut to a hand holding the bag with an "Order received" card | Check pops 0→1.15→1 |
| 13 | 23.0–25.0 | Red | Collage of 5–6 cards (photo, schedule, receipt, people). Cards overlap and slide. Big yellow stars burst | Fast stagger, 5 cuts in 0.4 s at 23.0–23.3 s |
| 14 | 25.0–26.4 | Red | "Little **Brighter**" headline with a yellow star | Word-by-word. Star spins in |
| 15 | 26.4–29.0 | Red | Review card tilts to flat. Stars fill 1→5, text types, "Post review" tap, toast "Review posted" | Stars fill in 80 ms steps. Typewriter 30 cps |
| 16 | 29.0–31.8 | Photo | "A little **happier.**" on a food photo. Floating heart reactions | Headline types in. Hearts rise 60 px, fade |
| 17 | 31.8–34.1 | Red | Logo alone, then tagline and store badges. Last 0.4 s black | Logo scales in. Tagline fades 12 frames |

Pacing rule: open calm (a 2 s photo), run fast through the middle (0.5–1.5 s shots), and slow down for a 2–5 s logo hold.

## 3. Animation language

- **Cards.** Enter by scaling 0.92→1 with a 12-frame ease-out, or by sliding 24 px up. They exit by fading.
- **Staggers.** List rows, tiles and cards enter 80–120 ms apart (3 frames).
- **Cursor.** Glides to target in 0.3–0.4 s, presses to 0.9 scale for 4 frames, then the UI reacts within 2 frames.
- **Tap feedback.** Every tap gives a visible result: "+" to check, stepper tick, ripple, or pill colour flip.
- **Overshoot.** Pops (check badge, product duplicate, star) use 10–15 % overshoot, about `back.out(1.7)` in GSAP.
- **3D.** Selected cards tilt ±6–10° with perspective and settle flat in 0.5 s.
- **Count-ups.** Numbers ease-out over 1.0–1.5 s. Ring progress draws at the same rate.
- **Text.** Headlines either type on or reveal word by word. Highlight words use a different colour.
- **Camera.** Photos get a slow 8 % push-in. UI scenes stay locked.

## 4. Transitions

Measured: 7 hard cuts, 2 appears, 2 disappears, about 18 changes. No flashes, so no white-flash cuts.

1. **Hard cut on action.** The cut lands on the cursor tap or the result frame.
2. **Brand-mark wipe.** Large arches sweep across the screen to reveal the next scene. Use once.
3. **Shared-element morph.** An icon becomes a card, and a ring becomes a tile and then a list.
4. **Colour swap.** Red, cream, photo and white backgrounds alternate to reset attention.
5. **Dim-out.** A card dims to 40 % opacity before the next scene replaces it.

## 5. Audio and SFX

Measured: 34.1 s, loudness −14.2 LUFS, true peak −1.8 dBTP, music-dominant, no steady beat (no BPM lock), 257 onsets.
Sections by signal: A 0–9 s, B 9–30 s, C 30–34 s. Silence only in the last 0.4 s.
Stems were not separated, so the SFX list below is inferred from onsets and the picture.

- **Bed.** Light upbeat music, free tempo. Level moves between −11 and −16 dBFS RMS. Dips to −26 dBFS happen at 5.5–6.0 s, 13.5 s, 16.0 s and 19.5 s, where scenes change.
- **Onsets.** Most land within 3 frames of a visual event.
- **SFX palette** (place 1–2 frames before the visual):
  - soft pop at each card entrance, −18 dBFS
  - click at each cursor tap
  - light "ding" on check badges
  - whoosh on the wipe and 3D tilts
  - sparkle on stars
  - rising tick during count-ups, with a chime at 3,500
  - soft thump on the logo
- **End.** Music tails out by 33.6 s. 0.4 s of silence follows.

## 6. Build plan for your own video

1. Pick your accent trio: one flat background colour, one highlight colour, cream plus white.
2. Write 8–10 one-line UI scenes with a single tap each. Keep every headline under 4 words.
3. Build UI cards in HTML or React with real components. Use your own product photos for the mood scenes.
4. Time scenes to the table in section 2. Scale all times by (your length ÷ 34 s).
5. Layer SFX from section 5 on a free-tempo music bed at −14 LUFS.
6. Render at 720×1280 or 1080×1920, 30 fps. Compare with `hyperframes diff` or `hyperframes measure cuts`.

Tooling already installed here: Remotion 4.0.250 and the Hyperframes CLI 0.9.35.
