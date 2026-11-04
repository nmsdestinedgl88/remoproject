#!/usr/bin/env python3
"""Sound for v3 (comp3.html): palette events from __events(), the user's BGM ducked under them. → mix3.wav (−16 LUFS)"""
import asyncio, os, subprocess, sys
sys.path.insert(0, "/root/.claude/skills/onetake/scripts")
from sfx_palette import Score, air, glass, wood, sub, bubble
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
async def load():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": 1080, "height": 1920})
        await pg.goto("file://" + os.path.join(HERE, "comp3.html")); await pg.evaluate("window.__ready")
        r = await pg.evaluate("[window.__events(), window.DUR]"); await b.close(); return r
EV, DUR = asyncio.run(load())
s = Score(dur=DUR, T60=1.0); P = s.place
for e in EV:
    t, k = e[0], e[1]
    if k == 'travel': P(air(0.9, 220, 2200, 1.2, 0.5), t, 0.3, 0.0, 0.5)
    elif k == 'title': P(wood(160, 0.12), t, 0.3, 0.0, 0.25); P(sub(64, 0.4), t, 0.18, 0.0, 0.2)
    elif k == 'bullet': P(glass([784, 880, 1046][e[3]], 0.7, 0.6), t, 0.12, 0.0, 0.45)
    elif k == 'page': P(air(0.22, 2400, 900, 1.6, 0.3), t + 0.1, 0.22, 0.2, 0.3)
    elif k == 'close': P(wood(140, 0.14), t, 0.45, 0.0, 0.3); P(sub(58, 0.6), t, 0.35, 0.0, 0.25)
    elif k == 'slide-out': P(air(0.7, 1400, 500, 1.4, 0.4), t, 0.25, 0.0, 0.35)
    elif k == 'launch': P(air(0.55, 260, 2600, 1.3, 0.3), t, 0.3, 0.0, 0.45)
    elif k == 'land-paper': P(wood(220, 0.09), t, 0.32, 0.1, 0.25)
    elif k == 'card': P(wood(200, 0.08), t, 0.3, 0.0, 0.25)
    elif k == 'spread': P(wood(210 + 20 * e[3], 0.06), t, 0.2, 0.0, 0.2)
    elif k == 'wake': P(bubble(440, 0.2), t, 0.25, 0.0, 0.3)
    elif k == 'scroll': P(air(1.4, 900, 300, 1.2, 0.15), t, 0.12, 0.0, 0.4)
    elif k == 'play': P(bubble(520, 0.22), t, 0.35, 0.0, 0.3)
    elif k == 'done': P(glass(1318, 1.0, 0.6), t, 0.14, 0.0, 0.5)
    elif k == 'end': P(sub(52, 1.0), t, 0.5, 0.0, 0.3); P(glass(784, 1.4, 0.5), t + 0.05, 0.12, 0.0, 0.6)
    elif k == 'dm': P(bubble(660, 0.24), t, 0.32, 0.0, 0.3)
s.write(os.path.join(HERE, "sfx3.wav"))
bgm = os.path.join(HERE, "../../public/pitch/bgm.mp3")
fc = (f"[0:a]atrim=0:{DUR},asetpts=N/SR/TB,volume=0.32,afade=t=in:d=0.8,afade=t=out:st={DUR-1.8}:d=1.8,aformat=channel_layouts=stereo[m];"
      f"[1:a]aformat=channel_layouts=stereo,asplit[s1][s2];[m][s1]sidechaincompress=threshold=0.05:ratio=4:attack=8:release=250[d];"
      f"[d][s2]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-3.5:LRA=11[o]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", bgm, "-i", os.path.join(HERE, "sfx3.wav"), "-filter_complex", fc, "-map", "[o]", "-ar", "48000", os.path.join(HERE, "mix3.wav")], check=True)
print("wrote mix3.wav,", len(EV), "events, dur", DUR)
