#!/usr/bin/env python3
"""Sevun mechanics promo (9:16) — designed sound on the onetake palette (one room, few events, each with a cause on screen).
Times are root seconds in index.html. Run:  python3 sound/score.py  → assets/sfx/sfx.wav"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "../../../.claude/skills/onetake/scripts"))
from sfx_palette import Score, air, wood, sub, bubble  # noqa: E402

s = Score(dur=40, T60=1.2)
whoosh = lambda t, d, f0, f1, g, shape=0.5, pan=0.0, pan_to=None, send=0.45: s.place(air(d, f0, f1, 1.3, shape), t, g, pan, send, pan_to)

# m1 (0.00)
whoosh(0.0, 0.7, 200, 2800, 0.55, 0.5, -0.6, 0.6)           # the orange stroke wipes the film open
whoosh(1.16, 0.66, 900, 220, 0.34, 0.4)                       # shot steps back into depth
whoosh(2.84, 0.55, 220, 1800, 0.34, 0.6)                      # back to full frame
s.place(sub(56, 0.8), 5.02, 0.8, 0.0, 0.35)                   # "TROUBLE."
s.place(wood(150, 0.14), 5.02, 0.38, 0.0, 0.2)
whoosh(5.88, 0.66, 900, 220, 0.34, 0.4, 0.3, -0.3)           # card swings left

# m2 (9.35)
whoosh(9.33, 0.55, 220, 1800, 0.32, 0.6)                      # to full frame
s.place(bubble(520), 9.97, 0.26, -0.4, 0.3)                    # name tag
whoosh(11.70, 0.6, 1600, 400, 0.18, 0.4)                      # name tag out
whoosh(11.73, 0.66, 900, 220, 0.32, 0.4)                      # card steps back…
whoosh(11.85, 1.2, 120, 900, 0.30, 0.3, 0.0, 0.0, 0.6)       # …the orbit flies in
whoosh(15.77, 0.6, 900, 180, 0.28, 0.3)                       # orbit recedes
whoosh(15.83, 0.55, 220, 1800, 0.30, 0.6)                     # to full frame
s.place(sub(70, 0.5), 18.42, 0.45, 0.0, 0.3)                   # "trust you first."

# m3 (18.95)
whoosh(18.95, 0.55, 900, 220, 0.30, 0.4)                      # card steps back
whoosh(19.07, 0.35, 300, 3500, 0.36, 0.7)                     # "1st video" flies in
s.place(sub(72, 0.55), 19.35, 0.55, 0.0, 0.3)
s.place(sub(60, 0.6), 22.70, 0.62, -0.3, 0.3)                  # "$0"
s.place(wood(220, 0.1), 22.97, 0.26, 0.3, 0.2)                 # "pay."
whoosh(23.45, 0.5, 220, 1800, 0.32, 0.6)                      # to full frame
s.place(bubble(450), 23.90, 0.34, -0.4, 0.3)                   # message bubble
s.place(bubble(640, 0.18), 25.18, 0.24, 0.4, 0.3)              # TODAY
whoosh(27.12, 0.32, 2500, 300, 0.36, 0.8)                     # film flies back

# Burst (27.40)
for t, f, g in ((27.40, 66, 0.6), (27.95, 60, 0.62), (28.45, 52, 0.66)):
    s.place(sub(f, 0.45), t, g, 0.0, 0.3)
s.place(wood(190, 0.12), 28.45, 0.3, 0.0, 0.2)
whoosh(29.25, 0.75, 200, 5000, 0.62, 0.95, -0.6, 0.5)        # riser into the logo

# Outro (30.00) — same beats as the landscape outro
s.place(sub(46, 1.4), 30.42, 0.95, 0.0, 0.5)
whoosh(30.40, 0.8, 300, 1500, 0.28, 0.4)
s.place(wood(130, 0.18), 31.26, 0.48, -0.1, 0.3)
s.place(sub(82, 0.3), 31.26, 0.32, 0.0, 0.3)
for i in range(5):
    s.place(wood(300 + 25 * i, 0.06), 31.48 + i * 0.133, 0.11, -0.3 + 0.15 * i, 0.25)
whoosh(33.30, 1.0, 200, 900, 0.24, 0.5)
s.place(wood(220, 0.08), 34.02, 0.16, 0.0, 0.25)
whoosh(35.58, 0.35, 800, 3000, 0.14, 0.5)
s.place(bubble(420), 36.32, 0.38, 0.0, 0.35)

s.write(os.path.join(HERE, "../assets/sfx/sfx.wav"), peak_db=-9.0)
