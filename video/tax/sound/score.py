#!/usr/bin/env python3
"""Sevun tax-accountant promo (9:16) — designed sound on the onetake palette (one room, each event has a cause on screen).
Times are root seconds in index.html. Run:  python3 sound/score.py  → assets/sfx/sfx.wav"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "../../../.claude/skills/onetake/scripts"))
from sfx_palette import Score, air, wood, sub, bubble  # noqa: E402

s = Score(dur=49, T60=1.2)
whoosh = lambda t, d, f0, f1, g, shape=0.5, pan=0.0, pan_to=None, send=0.45: s.place(air(d, f0, f1, 1.3, shape), t, g, pan, send, pan_to)

# t1 (0.00)
whoosh(0.0, 0.7, 200, 2800, 0.55, 0.5, -0.6, 0.6)            # orange stroke wipe
s.place(wood(170, 0.1), 1.55, 0.22, 0.2, 0.2)                  # "money."
whoosh(1.6, 0.8, 1800, 400, 0.14, 0.4, -0.3, 0.3)             # falling line draws
whoosh(2.82, 0.7, 900, 220, 0.34, 0.4)                         # pull back into the office
s.place(sub(66, 0.5), 5.1, 0.4, 0.0, 0.3)                      # "the IRS."
whoosh(5.56, 0.5, 600, 2400, 0.2, 0.5)                         # form flips down
s.place(sub(54, 0.6), 6.42, 0.6, 0.2, 0.3)                     # OVERPAID stamp
s.place(wood(120, 0.16), 6.42, 0.45, 0.2, 0.2)
whoosh(6.92, 0.62, 220, 1600, 0.28, 0.5, -0.3, 0.3)           # card swings
s.place(bubble(560), 8.68, 0.24, -0.2, 0.3)                    # REC dot
whoosh(9.12, 0.2, 600, 4200, 0.3, 0.8)                         # snap to the face
s.place(sub(58, 0.7), 9.33, 0.7, 0.0, 0.35)                    # "You're not."

# t2 (10.00)
s.place(sub(70, 0.45), 11.34, 0.4, 0.0, 0.3)                   # "first."
whoosh(11.66, 0.66, 900, 220, 0.32, 0.4)                       # pull back
whoosh(11.75, 1.2, 120, 900, 0.30, 0.3, 0.0, 0.0, 0.6)        # orbit flies in
for i, (t, f) in enumerate([(12.02, 520), (12.16, 600), (12.30, 560), (12.44, 640)]):
    s.place(bubble(f, 0.18), t, 0.14, [-0.5, 0.5, -0.3, 0.3][i], 0.3)  # day chips
whoosh(13.80, 0.9, 150, 4200, 0.52, 0.95, 0.5, -0.5)          # spin up…
s.place(sub(55, 0.9), 14.66, 0.8, 0.0, 0.4)                   # …stop dead
s.place(wood(150, 0.16), 14.66, 0.42, 0.0, 0.2)
s.place(bubble(500), 16.1, 0.3, 0.0, 0.3)                      # DAILY
whoosh(16.28, 0.55, 900, 200, 0.3, 0.4)                        # close-up band
s.place(wood(220, 0.1), 16.9, 0.22, 0.0, 0.2)                  # "numbers."
s.place(sub(72, 0.4), 18.4, 0.36, 0.0, 0.3)                    # "Trust,"
for k in range(4):                                             # phone rings
    s.place(wood(900 + 60 * (k % 2), 0.05), 19.1 + k * 0.1, 0.12, 0.5, 0.2)

# t3 (19.60) — the calculator
whoosh(19.58, 0.62, 220, 1600, 0.3, 0.5)                       # to the whole frame
whoosh(20.33, 0.7, 120, 1100, 0.34, 0.4, -0.3, 0.3)          # calculator + statement fly in
keys = [1.9, 2.95, 3.08, 3.2, 3.32, 3.62, 3.74, 4.0, 4.3, 4.42, 4.52, 4.62, 4.98, 5.6, 5.72, 6.3]
for i, t in enumerate(keys):                                   # every key press, a soft click
    s.place(wood(300 + (i % 3) * 25, 0.05), 19.6 + t, 0.2, -0.35, 0.12)
for t in (3.36, 4.04, 4.66, 5.08, 5.8):                         # each statement row lands
    s.place(wood(200, 0.08), 19.6 + t + 0.05, 0.14, 0.35, 0.2)
s.place(bubble(560, 0.2), 24.58, 0.22, -0.5, 0.3)              # "< a Big Mac"
s.place(sub(64, 0.6), 25.92, 0.6, 0.2, 0.35)                   # NET PROFIT
s.place(bubble(660), 26.55, 0.32, 0.4, 0.3)                    # 56× return
s.place(bubble(600, 0.2), 26.81, 0.2, 0.3, 0.3)                # "< coffee"
whoosh(27.12, 0.4, 2400, 300, 0.36, 0.7)                       # maths drops away

# t4 (27.50)
s.place(bubble(620), 28.12, 0.3, 0.0, 0.3)                     # "1" badge flips
s.place(sub(60, 0.6), 29.58, 0.6, 0.0, 0.3)                    # "$0"
whoosh(30.48, 0.62, 900, 220, 0.32, 0.4)                       # pull back
whoosh(32.58, 0.62, 220, 1600, 0.28, 0.5, 0.3, -0.3)          # card swings
whoosh(34.68, 0.52, 220, 1800, 0.3, 0.6)                       # to full frame
s.place(bubble(450), 35.07, 0.34, -0.4, 0.3)                   # DM bubble
whoosh(36.18, 0.32, 2500, 300, 0.36, 0.8)                      # film flies back

# Burst (36.50)
for t, f, g in ((36.5, 66, 0.6), (37.05, 60, 0.62), (37.55, 52, 0.66)):
    s.place(sub(f, 0.45), t, g, 0.0, 0.3)
s.place(wood(190, 0.12), 37.55, 0.3, 0.0, 0.2)
whoosh(38.25, 0.75, 200, 5000, 0.62, 0.95, -0.6, 0.5)        # riser into the logo

# Outro (39.00) — same beats as the other cuts
s.place(sub(46, 1.4), 39.42, 0.95, 0.0, 0.5)
whoosh(39.40, 0.8, 300, 1500, 0.28, 0.4)
s.place(wood(130, 0.18), 40.26, 0.48, -0.1, 0.3)
s.place(sub(82, 0.3), 40.26, 0.32, 0.0, 0.3)
for i in range(5):
    s.place(wood(300 + 25 * i, 0.06), 40.48 + i * 0.133, 0.11, -0.3 + 0.15 * i, 0.25)
whoosh(42.30, 1.0, 200, 900, 0.24, 0.5)
s.place(wood(220, 0.08), 43.02, 0.16, 0.0, 0.25)
whoosh(44.58, 0.35, 800, 3000, 0.14, 0.5)
s.place(bubble(420), 45.32, 0.38, 0.0, 0.35)

s.write(os.path.join(HERE, "../assets/sfx/sfx.wav"), peak_db=-9.0)
