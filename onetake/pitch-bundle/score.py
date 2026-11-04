#!/usr/bin/env python3
"""Sound for the pitch-bundle film: palette events from the comp's __events(), the user's BGM ducked under the hits.
python3 score.py → sfx.wav, mix.wav (−16 LUFS)"""
import asyncio, json, os, subprocess, sys
sys.path.insert(0, "/root/.claude/skills/onetake/scripts")
from sfx_palette import Score, air, glass, wood, sub, bubble, pan_of
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); DUR = 15.0

async def events():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": 1080, "height": 1920})
        await pg.goto("file://" + os.path.join(HERE, "comp.html")); await pg.evaluate("window.__ready")
        ev = await pg.evaluate("window.__events()"); await b.close(); return ev
EV = asyncio.run(events())
s = Score(dur=DUR, T60=1.0); P = s.place
F = [523, 587, 659, 784, 880]                        # the deck climbs a pentatonic
for e in EV:
    t, kind, x = e[0], e[1], e[2]; pan = pan_of(x, 1080)
    if kind == 'land-heavy': P(sub(58, 0.8), t, 0.55, pan, 0.25); P(wood(150, 0.14), t, 0.5, pan, 0.3)
    elif kind == 'launch': P(air(0.55, 260, 2600, 1.3, 0.3), t, 0.35, pan, 0.45)
    elif kind == 'hang': P(glass(1046, 1.2, 0.5), t, 0.12, pan, 0.6)
    elif kind == 'land-paper': P(air(0.18, 1800, 600, 1.4, 0.2), t - 0.04, 0.3, pan, 0.3); P(wood(220, 0.09), t, 0.32, pan, 0.25)
    elif kind == 'slide': i = e[3]; P(wood(200 + 25 * i, 0.08), t, 0.34, pan, 0.25); P(glass(F[i], 0.55, 0.7), t, 0.12, pan, 0.4)
    elif kind == 'phone-knock': P(wood(260, 0.1), t, 0.4, pan, 0.25); P(sub(70, 0.4), t, 0.25, pan, 0.2)
    elif kind == 'play': P(bubble(520, 0.22), t, 0.35, pan, 0.3)
    elif kind == 'done': P(glass(1318, 1.0, 0.6), t, 0.16, pan, 0.5); P(glass(1760, 1.0, 0.4), t + 0.03, 0.1, pan, 0.5)
    elif kind == 'gather': P(air(0.9, 200, 1800, 1.2, 0.5), t, 0.4, 0.0, 0.5)
    elif kind == 'stamp-fall': P(air(0.5, 300, 1200, 1.3, 0.8), t, 0.3, pan, 0.4)
    elif kind == 'stamp': P(sub(52, 1.0), t, 0.75, pan, 0.3); P(wood(120, 0.18), t, 0.6, pan, 0.35)
    elif kind == 'lock': P(glass(784, 1.4, 0.5), t, 0.12, 0.0, 0.6)
    elif kind == 'dm': P(bubble(660, 0.24), t, 0.32, 0.0, 0.3)
s.write(os.path.join(HERE, "sfx.wav"))
stamp = next(e[0] for e in EV if e[1] == 'stamp')
bgm = os.path.join(HERE, "../../public/pitch/bgm.mp3")
# BGM: faded in and out, ducked a little under the effects (sidechain), mastered to −16 LUFS with −3.5 dBTP
fc = (f"[0:a]atrim=0:{DUR},asetpts=N/SR/TB,volume=0.32,afade=t=in:d=0.8,afade=t=out:st={DUR-1.6}:d=1.6,aformat=channel_layouts=stereo[m];"
      f"[1:a]aformat=channel_layouts=stereo,asplit[s1][s2];"
      f"[m][s1]sidechaincompress=threshold=0.05:ratio=4:attack=8:release=250[d];"
      f"[d][s2]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-3.5:LRA=11[o]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", bgm, "-i", os.path.join(HERE, "sfx.wav"), "-filter_complex", fc, "-map", "[o]", "-ar", "48000", os.path.join(HERE, "mix.wav")], check=True)
print("wrote sfx.wav, mix.wav;", len(EV), "events")
