# Style Reference Note: Kinetic-Type Concept Explainer

Source: 26.7 s, 720x1280 (9:16), 30 fps, H.264 + AAC stereo 44.1 kHz.
Purpose: a template to rebuild with new colors, fonts and assets.
Items marked (measured) come from the file. Items marked (visual) come from frames. Items marked (inferred) are judgment calls.

## 1. Concept in one line
A white-canvas, one-idea-per-scene explainer about storytelling. Each scene is 1-3 s. Each scene carries one short phrase, one hero visual and one accent color. The phrases form one spoken-style sentence chain.

## 2. Structure (beat sheet)
Times are approximate, from 1 s samples. Hard cuts (measured): 2.07, 5.40, 14.87, 19.90, 20.93 s.

| t (s) | Beat | On-screen text | Hero visual |
|---|---|---|---|
| 0-1 | Hook | "If you keep.." | Concentric rings (grey + gold) pulse out from center |
| 1-2 | Setup | "Serving the *same thing*" | Gold service cards (icons + labels) stack in a staircase |
| 2-4 | Escalation | "PEOPLE" > "STOP" > "CARING." | Floating circular avatars with mute/muted badges; gold corner brackets |
| 4-5.4 | Problem | "Familiarity doesn't create excitement." | Bored person on a conveyor of boxes marked SAME |
| 5.4-6 | Glitch | (tiny "It" on black) | 1-3 frame black flash with barcode |
| 6-7 | Consequence | "It creates *indifference*" | Barcode + toggle icons, caption paragraph in tiny serif |
| 7-8 | Pivot | "Same Narrative / New Narrative. But the Moment *you change*" | 3D signposts |
| 8-9 | Breath | "The narrative..." + arrow | Cream circle, soft |
| 9-11 | Solution 1 | "Hype *then the* leads the *hike*" | UI pill with avatars, gold line draws through |
| 11-13 | Solution 2 | "Don't reveal everything *at once...*" | "Build curiosity" glass card on gold bar |
| 13-15 | Solution 3 | "Let people wonder. Let them speculate." | Gold highlighter bars behind text, bullet dots |
| 15-16 | Solution 4 | "Let them connect *the dots*" | Portrait with node-and-line network |
| 16-17 | Turn | "Before you do." | Green glow bar (only off-palette color) |
| 17-19 | Payoff | "Because once the audience starts." | Top-down table scene, social-post card, sparkles |
| 19-21 | Climax | "Building the story *in their* OWN MINDS" | Condensed-caps stamp + hands holding a brain |
| 21-23 | Close 1 | "Your reveal doesn't just land" | Plain two-line type |
| 23-25 | Close 2 | "It roars." | Gold pill + ring burst |
| 25-26.7 | Logo | brand mark | Logo fades in, hold, fade to black |

Average scene length: 1.5 s (measured from cuts and samples). Fastest scene: 3 frames (the glitch). Longest: about 3 s (logo hold).

## 3. Visual style
- **Canvas:** off-white (~#FAFAF8), nearly empty. Whitespace carries the pace.
- **Palette (swap-able):** 1 background + 1 accent (mustard gold) + 1 ink (near-black) + 1 neutral grey + 1 cream tint. One off-palette spike (green glow) once, for emphasis.
- **Accent rule:** gold marks the key word in each phrase. Black or grey carries everything else.
- **Type system (swap fonts, keep roles):**
  1. Bold grotesk sans, tight tracking, for the main phrase.
  2. Italic high-contrast serif, for the emotional word, placed beside or under the sans word.
  3. Condensed all-caps display, for one-word stamps (PEOPLE, STOP, OWN MINDS).
  4. Tiny serif body text, as texture only (not meant to be read).
- **Type pairing pattern:** sans line + serif-italic accent word, often overlapped by 10-20% of line height.
- **Hero assets:** cut-out photos with soft drop shadows (person, hands, portrait), 3D-rendered props (boxes, signposts, brain), flat UI cards (glass/white, rounded, soft shadow).
- **Shadows:** large, soft, low-opacity, offset down-right. They give depth on a white field.
- **Decor:** gold corner brackets, thin gold bars, dot-grid clusters, 4-point sparkles, hand-drawn dashed curves, arrows.
- **Safe area:** text sits in the center 70% of the frame. Brand mark sits near center, small.

## 4. Animation vocabulary
Reuse these as named motions. Durations are (visual, inferred) at 30 fps.

| Name | What it does | Use for | Duration |
|---|---|---|---|
| Typewriter | Letters appear left to right, cursor-like | Opening and mid phrases ("Fami|", "Don't reveal everyt") | 8-15 frames per phrase |
| Word swap | Old word slides or fades out, new word in same slot ("doesn't create" > "doesn't just land") | Idea changes | 6-10 frames |
| Staircase stack | Cards pop in diagonally, each 3-4 frames after the last | Lists of services | 12-18 frames |
| Float-in | Avatars drift in with slight scale (0.8 > 1.0) and ease-out | Crowd scenes | 10-14 frames |
| Stamp | Condensed caps scale from 1.15 to 1.0 with a hard stop | One-word punches | 4-6 frames |
| Line draw | Gold curve strokes on across the scene | Connect UI elements | 15-20 frames |
| Highlighter wipe | Gold bar grows left to right behind text | Emphasis | 6-8 frames |
| Ring burst | Circle scales up and thins out while fading | Open and close | 12-18 frames |
| Glass card | White rounded card with blur and drop shadow slides in | Concept cards | 10-12 frames |
| Glitch cut | 1-3 black frames with a tiny element | Tension before a pivot | 3 frames |
| Fade to logo | Opacity 0 > 100% then hold | Ending | 12 frames in, 25+ hold |

Easing: ease-out for entrances (fast start, soft land). Hard stops for stamps. Linear only for the line draws and typewriter. Exits are mostly cuts, not fades (inferred from cut count).

## 5. Timing rules
1. One idea per scene, one phrase per scene (2 lines maximum).
2. Phrase reads in 1-2 s. Hold the finished phrase for at least 0.4 s before the cut.
3. Cut on a phrase end, not mid-word.
4. Hard cut between ideas. Animation inside a scene links the words.
5. Pace speeds up in the problem section (cuts about every 1 s) and slows for the payoff and logo (2-3 s).
6. Put one 3-frame glitch at the main pivot (about 20% into the video).
7. Last 1.5 s are quiet: logo only.

## 6. Sound (what I could verify)
Measured: integrated loudness -14.2 LUFS, loudness range 2.9 LU, true peak -0.9 dBFS, RMS steady at about -16 dB with no silence longer than 0.3 s.
Spectrogram: a continuous broadband bed plus vertical transient lines. The lines land at roughly the same moments as the cuts and word swaps.
(inferred) The track is a music bed or voiceover with a sound-effect hit on each scene change: whoosh for slides, tick or pop for stamps, riser into the glitch, soft chime on the logo.
I cannot separate voice, music and effects from this analysis, and I did not transcribe speech. Treat the sound plan below as a recommendation.

Recommended sound plan for our videos:
- Music bed at about -22 LUFS under voiceover, or -16 LUFS alone.
- Master to -14 LUFS, true peak at or below -1 dBFS.
- One short hit on every cut (30-120 ms), 3 types: whoosh, pop, tick.
- Duck the music 6 dB under the voiceover.
- Keep 0.3 s of near-silence before the final logo.

## 7. Template parameters (what to change)
| Parameter | Original | Our version |
|---|---|---|
| Background | off-white | set per brand |
| Accent | mustard gold | set per brand |
| Ink | near-black | set per brand |
| Sans font | bold grotesk | set per brand |
| Serif-italic font | high-contrast serif | set per brand |
| Condensed caps font | tall condensed | set per brand |
| Hero assets | cut-out photos, 3D props, UI cards | new assets, same roles |
| Logo | brand mark, bottom-center end card | ours |
| Aspect / fps | 9:16, 30 | keep |
| Length | 26.7 s | 20-30 s |

## 8. Build checklist for a new video
1. Write 14-18 phrases, 2-7 words each, one idea per scene.
2. Mark one accent word per phrase.
3. Pick one hero visual per scene (photo, 3D prop, UI card, or type only). Use type only for at least 4 scenes.
4. Assign a motion from section 4 to each scene. Do not repeat the same motion on 2 scenes in a row.
5. Place hard cuts on phrase ends. Include one glitch.
6. Add one hit sound per cut. Master to -14 LUFS.
7. End with a 1.5 s logo hold and a fade to black.
8. Check: 9:16, 30 fps, text inside the center 70%, average scene 1.2-1.8 s, 5 or fewer colors.
