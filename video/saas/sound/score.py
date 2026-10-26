#!/usr/bin/env python3
"""Sevun SaaS promo (9:16) — designed sound on the onetake palette (one room, each event has a cause on screen).
Times are root seconds (p1 0 · p2 9.6 · p3 19.35 · p4 27.45 · burst 37.05 · outro 39.4). Run: python3 sound/score.py"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "../../../.claude/skills/onetake/scripts"))
from sfx_palette import Score, air, wood, sub, bubble, glass  # noqa: E402

s = Score(dur=49.4, T60=1.2)
whoosh = lambda t, d, f0, f1, g, shape=0.5, pan=0.0, pan_to=None, send=0.45: s.place(air(d, f0, f1, 1.3, shape), t, g, pan, send, pan_to)
glassin = lambda t, g=0.26, pan=0.0: whoosh(t, 0.5, 400, 2600, g, 0.35, pan)
glassout = lambda t, g=0.18: whoosh(t, 0.35, 1800, 400, g, 0.6)
tap = lambda t, f=320, g=0.2, pan=0.0: s.place(wood(f, 0.06), t, g, pan, 0.15)

# p1 (0.00)
whoosh(0.0, 0.7, 200, 2800, 0.55, 0.5, -0.6, 0.6)                # orange stroke wipe
glassin(0.45, 0.24)
for k in range(10):                                               # typing the search
    tap(0.68 + k * 0.12, 340 + (k % 3) * 30, 0.1, -0.2)
s.place(bubble(380, 0.2), 2.12, 0.26, 0.3, 0.3)                   # 0 RESULTS
glassout(2.76)
glassin(3.3, 0.28)                                                # chat
s.place(bubble(560, 0.16), 4.22, 0.2, -0.3, 0.3); s.place(bubble(600, 0.16), 5.52, 0.2, -0.3, 0.3)
for k in range(3):
    tap(6.05 + k * 0.07, 520, 0.08, -0.4)
s.place(sub(66, 0.45), 6.7, 0.42, 0.3, 0.3)                       # NO WORDS FOR IT
glassout(7.28)
glassin(7.45, 0.3); tap(7.6, 280, 0.22)                           # competitor's demo

# p2 (9.60)
glassin(9.7, 0.28)
s.place(wood(150, 0.12), 10.26, 0.34, -0.2, 0.2)                  # "sales" struck
whoosh(11.18, 0.36, 600, 3000, 0.24, 0.6); s.place(bubble(640, 0.18), 11.62, 0.26, 0.0, 0.3)  # rolls to "story"
glassout(13.2)
glassin(13.45, 0.28)
whoosh(13.6, 0.62, 300, 4200, 0.42, 0.95)                          # feed flicks…
s.place(sub(60, 0.6), 14.23, 0.6, 0.0, 0.35); s.place(wood(160, 0.12), 14.23, 0.36)   # …stops
glassout(16.2)
glassin(17.65, 0.28)                                               # demo booked
s.place(glass(880, 0.7, 0.6), 18.86, 0.18, 0.3, 0.5)               # ✓

# p3 (19.35)
glassin(20.7, 0.34, 0.4)                                           # wallet card flips in
for k in range(7):
    tap(20.84 + k * 0.08, 360 + 20 * k, 0.1, 0.4)
whoosh(21.75, 0.9, 900, 3000, 0.14, 0.5, 0.0, 0.6)
glassin(23.55, 0.22, 0.4); s.place(bubble(600, 0.2), 24.41, 0.3, 0.4, 0.3)   # Big Mac ✓
glassin(26.1, 0.22, 0.4); s.place(bubble(680, 0.2), 27.01, 0.3, 0.4, 0.3)    # coffee ✓
glassout(27.2)

# p4 (27.45)
glassin(27.95, 0.28)
s.place(wood(260, 0.07), 30.2, 0.3, 0.2, 0.15); s.place(bubble(560, 0.18), 30.25, 0.2, 0.2)  # switch on
glassout(30.87)
glassin(31.0, 0.3)
for start, n in ((31.55, 9), (32.75, 8), (33.95, 9)):              # the story writes itself
    for k in range(n):
        tap(start + k * 0.1, 360 + (k % 3) * 25, 0.08, 0.1)
s.place(bubble(520), 34.45, 0.26, 0.4, 0.3)                       # TOLD FIRST
glassout(35.45)
for k in range(3):
    tap(35.55 + k * 0.05, 520, 0.08, -0.4)
s.place(bubble(450), 35.75, 0.36, -0.4, 0.3)                      # DM bubble

# burst (37.05)
for t, f, g in ((37.05, 66, 0.6), (37.55, 60, 0.62), (38.0, 52, 0.66)):
    s.place(sub(f, 0.45), t, g, 0.0, 0.3)
s.place(wood(190, 0.12), 38.0, 0.3, 0.0, 0.2)
whoosh(38.68, 0.72, 200, 5000, 0.62, 0.95, -0.6, 0.5)

# outro (39.40) — same beats as the other cuts
o = 39.4
s.place(sub(46, 1.4), o + 0.42, 0.95, 0.0, 0.5)
whoosh(o + 0.40, 0.8, 300, 1500, 0.28, 0.4)
s.place(wood(130, 0.18), o + 1.26, 0.48, -0.1, 0.3); s.place(sub(82, 0.3), o + 1.26, 0.32, 0.0, 0.3)
for i in range(5):
    s.place(wood(300 + 25 * i, 0.06), o + 1.48 + i * 0.133, 0.11, -0.3 + 0.15 * i, 0.25)
whoosh(o + 3.30, 1.0, 200, 900, 0.24, 0.5)
s.place(wood(220, 0.08), o + 4.02, 0.16, 0.0, 0.25)
whoosh(o + 5.58, 0.35, 800, 3000, 0.14, 0.5)
s.place(bubble(420), o + 6.32, 0.38, 0.0, 0.35)

s.write(os.path.join(HERE, "../assets/sfx/sfx.wav"), peak_db=-9.0)
