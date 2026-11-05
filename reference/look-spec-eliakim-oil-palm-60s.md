# LOOK SPEC: Eliakim Oil Palm Investment, 60 s, 9:16, 30 fps

```
LOOK name="Harvest Ledger" family=13 Type-led (with family 2 sticker cut-outs as heroes)
WHY: Investment content needs calm authority; the reference's type-first, one-idea-per-scene grammar carries claims in words, and navy-and-gold matches the Eliakim logo.
MOOD: trusted, grounded, rewarding / not flashy
COLOUR ink=#1B1465 hot=#E1B029 bg=#FAFAF8 second=#8A8F98 bgmode=light (cycles light / dark / mid / bright)
BACKGROUND: flat colour cycling pale white #FAFAF8, navy #1B1465, grey #8A8F98, golden yellow #E1B029; no two neighbouring scenes share a background; soft paper grain 3% on all four
TYPE display="Archivo ExtraBold (stamps: Anton)" text="Inter" accent="Playfair Display Italic" captions=highlight
ART STYLE: flat colour fields, bold grotesk headlines with one italic serif accent word, cut-out photographs with a 6 px white border and soft down-right shadow, no outlines, no gradients
ISOLATION: photo heroes shot or cut on a plain white or plain green surround, nothing touching the frame edge, closed silhouette
CUT mode=sticker border=white 6px shadow=soft
DEVICES: gold corner brackets, gold highlighter bars, thin gold bar rules, 4-point sparkles (reference devices, recoloured)
MOTION personality=Corporate base=0.3 big_moment="0:41-0:46 ring burst on navy reveals the condensed-caps stamp OWN THE HARVEST in gold, no overshoot, with the palm-fruit hands cut-out rising beneath"
MOVES: typewriter = opening and mid phrases; word swap = change of idea (sans word out, serif italic word in); highlighter wipe = key word emphasis; staircase stack = value-chain cards; line draw = connect field to mill to market; ring burst = open, big moment and close
STILL: logo, disclaimer line, all body text once settled
EFFECTS: not used (no real face footage supplied)
STYLEKEY: not used
THUMBNAIL: navy field, giant condensed caps "OWN THE HARVEST" in gold, palm-fruit cut-out bottom right, Eliakim key mark top left
NEEDS: BUILD route: Remotion (frame-driven; project already has remotion.config.ts). Reference moves are code-built. Sticker cut-outs need supplied photos; with none, scenes fall back to type-only. Condensed caps font is Anton (Google Fonts); check the naira sign in Archivo and fall back to Inter.
```

## Contrast check (computed)
| Pair | Ratio | Rule |
|---|---|---|
| Navy on pale white | 15.1 | Body and headlines |
| White on navy | 15.1 | Body and headlines |
| Gold on navy | 7.7 | Accent text allowed |
| Navy on gold | 7.7 | Body and headlines |
| Navy on grey #8A8F98 | 4.9 | Body text passes |
| White on grey | 3.1 | Large type only (36 px+) |
| Gold on pale white | 2.0 | Fails: never gold text on white; use gold as a highlighter bar behind navy text |
| Gold on grey | 1.6 | Fails: gold only as fills on grey |

Logo colours sampled: navy #1B1465, gold #E1B029 (used above).

## Background map (no repeats in a row)
White, Navy, Gold, Grey, White, (black glitch), Navy, Gold, White, Grey, Navy, White, Navy, Gold, White, Navy.

## Sound (reference effects kept, all made dull)
- Kept from reference: whoosh (slides), tick (typewriter, word swap), riser (into the glitch), soft chime (logo).
- Pop and stamp snaps are replaced by a low, soft thud. No pops anywhere.
- All effects: low-pass at about 2.5 kHz, attack 20 ms or slower, 30-120 ms long (whoosh up to 250 ms), level 12-15 dB below the music.
- One effect per cut. The ring burst gets a low swell instead of a hit.
- Note: the reference's effect types were inferred from its spectrogram, not heard separately.

## BGM
- File: Bubinga, Quincas Moreira, 3:09, -10.8 LUFS (loud, very steady).
- Use a 60 s edit with a 1 s fade in and a 3 s fade out; lower to about -22 LUFS under voiceover, or -16 LUFS without.
- Snap cuts to the beat once the builder measures tempo.
- Check the licence and add attribution if required.

## Beats (no script yet; these are beats, not copy)
Claims marked [confirm] must come from Eliakim before they go on screen.

| Time | Bg | Beat and on-screen idea | Hero | Move | Out |
|---|---|---|---|---|---|
| 0:00-0:03 | White | Hook: "What if your land paid you back?" | Gold and grey rings | ring burst, typewriter | cut |
| 0:03-0:06 | Navy | "Oil palm. The crop that keeps giving." [confirm lifespan] | Palm tree cut-out | word swap | cut |
| 0:06-0:09 | Gold | Value-chain cards: Land, Seedlings, Care, Harvest, Mill | Navy cards | staircase stack | cut |
| 0:09-0:12 | Grey | "Most people watch from the sidelines." | Type | typewriter | cut |
| 0:12-0:15 | White | "Because ownership feels out of reach." | Type, bar rule | highlighter wipe | glitch |
| 0:15-0:16 | Black | 3-frame glitch with small "But" | Type | none | cut |
| 0:16-0:20 | Navy | "Idle land > Working land" | Type | word swap | cut |
| 0:20-0:24 | Gold | "Not just the tree. The whole chain." | Cards | line draw | cut |
| 0:24-0:28 | White | Field > truck > mill > market | 4 icon cut-outs | line draw | cut |
| 0:28-0:32 | Grey | "Real land. Real mill." [confirm mill] | Mill cut-out | typewriter | cut |
| 0:32-0:36 | Navy | Clear terms, clear reporting, clear exit [confirm] | Type | highlighter wipe | cut |
| 0:36-0:41 | White | "Walk the farm. Meet the team." | Farmer cut-out | float-in | ring burst |
| 0:41-0:46 | Navy | BIG MOMENT: OWN THE HARVEST | Palm-fruit hands | ring burst, stamp | cut |
| 0:46-0:50 | Gold | "Start with a conversation." | Type | typewriter | cut |
| 0:50-0:54 | White | CTA: "Book a site visit" + contact [supply] | QR / phone | highlighter wipe | cut |
| 0:54-0:59 | Navy | Logo reveal, tagline [supply] | Eliakim logo | fade in, ring burst | fade |
| 0:59-1:00 | Navy | Hold, disclaimer line from 0:50 | Logo | none | end |

Pace: scenes about 3.3 s, with a text change every 1.5 s inside each scene.
