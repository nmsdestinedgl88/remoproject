# Frame gate report: Ava MAS 60 s

Checked by eye on 41 extracted frames per ratio (every 2 s, plus first and last frame of each scene). Contact sheet: `contact-sheet.png` (16:9). Frame numbers are at 30 fps.
Scene frames: S1 0-138 · S2 139-425 · S3 426-731 · S4 732-1149 · S5 1150-1504 · S6 1505-1799. Boundaries are the first word minus 0.2 s (§8.3).

| # | Item | Result | Notes |
|---|------|--------|-------|
| 1 | One accent, no gradient/glow/shadow/glass; iodine only on incision, dot, tick | PASS | Orange appears only on the incision, the registration tick, the S4 "smaller wound" tick (spec'd), and the final dot (f1799). The dimmed S4 rows (f1020-1140) show that tick at 35%. |
| 2 | Text ≥ 32 px, allowed colour pairs | PARTIAL | All text ≥ 32 px except the S6 footer at 28 px (f1740, per §6). S4 rows drop to 35% ink on bone (f1020-1140) as §6 specifies, which falls below the 13.59 ink/bone contrast. |
| 3 | Clear primary read; no two consecutive scenes with the same composition | PARTIAL | Compositions differ scene to scene. **f0 is blank bone plus the orange tick**, because the plate draws in from frame 1. f732 (S4 rules only) and f1150 (S5 outlines only) are sparse first frames. |
| 4 | Nothing in the caption zone or outside the safe area (both ratios) | PASS | Lowest content is the S4 footnote, S5 closing line and S6 footer, all above y 860 (16:9). 9:16 content ends at y 1440 or above. |
| 5 | No repeated entrance ×3, bounce, scale-from-0 or loop | PASS | Entrances are mask-reveal, path-draw and wipe. All easing is expo-out or in-out bezier. No springs, no `infinite`. |
| 6 | No words, numbers, faces or photos outside the prompt | PARTIAL | All on-screen words come from the prompt. The only digit on screen is the "4" in "4-Lane" (f1620+), which the prompt itself requires, so it conflicts with this gate's "no number" clause. |
| 7 | Every scene holds ≥ 1.0 s at its end | PASS | Static holds: S1 ~34 f (f105-138), S2 31 f (f395-425), S3 ~76 f, S4 ~109 f, S5 ~58 f, S6 ~90 f. |
| 8 | Specificity test | PASS | The incision-to-dot arc and the plate system are tied to the Ava brief. Swapping in another hospital name leaves the "ask Ava's surgeons" argument and the final dot (the centre's location) broken. |

Other checks:
- Duration is 60.000 s / 1800 f for both ratios. Both files carry h264 video and AAC audio.
- Loudness is −16.7 LUFS integrated, −1.4 dBFS peak.
- Cuts fall in the gaps between voiceover lines (0.9 s apart).
- The 9:16 cutdown was re-checked on the contact sheet, and its layout fits the 72 px margins.

## Unmet items / blockers
1. **Voiceover is a scratch espeak-ng track**, not Gemini TTS. The sandbox has no TTS engine, Whisper or Gemini key. Word times come from the synth events, not forced alignment. The manevoice profile is in `build/voice-profile.md`. Re-run `build/gen_vo.py` (or drop in real audio plus alignment), then `build/timing.py`, `build/mix.py` and the renders.
2. `01-library-index.json` was not in the zip (only 7 files), so library ids were taken from the prompt.
3. OneTake was not used. The mux and loudnorm were done with ffmpeg.
4. No separate 960×540 / 24 fps draft pass. I checked stills, then rendered finals directly.
5. The S3 "view cone" uses two diagonal lines (spec'd), which conflicts with the "no diagonals" shape rule.
6. Bed is a synthesised low tone with synthetic wood-block and paper ticks, not recorded foley.
7. Client-supplied placeholders remain: `[CLIENT PHONE]`, exact address/landmark, brand colours, procedure list.
8. Medical sign-off by a named Ava surgeon, and the Nigerian medical-advertising compliance check (§10), are still required before release.
