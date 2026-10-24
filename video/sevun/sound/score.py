#!/usr/bin/env python3
"""Sevun promo — designed sound on the onetake palette (one room, few events, each with a cause on screen).
Times are root seconds in index.html. Run:  python3 sound/score.py  → assets/sfx/sfx.wav"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "../../../.claude/skills/onetake/scripts"))
from sfx_palette import Score, air, wood, sub, bubble  # noqa: E402

s = Score(dur=50, T60=1.2)
whoosh = lambda t, d, f0, f1, g, shape=0.5, pan=0.0, pan_to=None, send=0.45: s.place(air(d, f0, f1, 1.3, shape), t, g, pan, send, pan_to)

# S1 · hook (0.00)
whoosh(0.0, 0.7, 200, 2800, 0.55, 0.5, -0.6, 0.6)          # the orange stroke wipes the film open
whoosh(2.66, 0.66, 180, 1800, 0.40, 0.5, 0.0, 0.4)          # card swings right
s.place(bubble(560), 4.62, 0.26, -0.3, 0.3)                  # REC dot
whoosh(5.02, 0.2, 600, 4200, 0.32, 0.8)                      # punch-in
s.place(sub(58, 0.8), 5.15, 0.75, 0.0, 0.35)                 # "You're not."
whoosh(6.12, 0.7, 220, 1600, 0.36, 0.5, 0.3, -0.3)          # pull back left
s.place(wood(170, 0.14), 9.04, 0.42, 0.25, 0.25)             # strike through "credentials"

# S2 · the feed (9.75)
whoosh(9.77, 0.75, 200, 2200, 0.38, 0.5, -0.4, 0.0)        # card becomes the phone
whoosh(10.0, 1.3, 120, 900, 0.32, 0.3, 0.0, 0.0, 0.6)       # the orbit flies in from depth
for i, (t, f) in enumerate([(11.62, 520), (11.80, 600), (11.98, 560), (12.16, 640)]):
    s.place(bubble(f, 0.18), t, 0.15, [-0.5, 0.5, -0.3, 0.3][i], 0.3)  # day chips (four, not ten)
whoosh(13.45, 1.05, 150, 4200, 0.55, 0.95, 0.5, -0.5)       # the feed spins up…
s.place(sub(55, 0.9), 14.47, 0.85, 0.0, 0.4)                # …and stops dead
s.place(wood(150, 0.16), 14.47, 0.45, 0.0, 0.2)
s.place(bubble(500), 16.17, 0.30, -0.35, 0.3)                # DAILY
whoosh(16.62, 0.65, 900, 180, 0.32, 0.3)                     # the orbit recedes
whoosh(19.02, 0.5, 250, 4500, 0.50, 0.9)                     # zoom through the phone

# S3 · the price (19.45)
whoosh(19.53, 0.6, 200, 1600, 0.30, 0.5, 0.0, 0.4)
whoosh(19.70, 0.35, 300, 3500, 0.38, 0.7, -0.5, -0.4)       # $7 flies in
s.place(sub(70, 0.6), 19.96, 0.6, -0.4, 0.3)                 # …lands
s.place(wood(240, 0.08), 20.53, 0.22, -0.2, 0.2)             # /day
for t in (23.90, 26.37):                                      # comparison cards flip down
    s.place(wood(205, 0.12), t + 0.12, 0.34, -0.4, 0.25); whoosh(t, 0.3, 500, 2600, 0.16, 0.6)
whoosh(27.40, 0.3, 1500, 500, 0.14, 0.4)

# S4 · the offer (27.85)
whoosh(27.84, 0.5, 300, 1400, 0.18, 0.5)
s.place(bubble(620), 28.48, 0.28, -0.5, 0.3)                 # "1"
for k in range(7):                                           # $7 rolls down to $0
    s.place(wood(260 - k * 12, 0.06), 30.76 + k * 0.062, 0.18 + 0.02 * k, -0.45, 0.15)
s.place(bubble(380, 0.26), 31.24, 0.34, -0.45, 0.35)         # $0
whoosh(32.15, 0.66, 220, 1500, 0.34, 0.5, -0.3, 0.2)        # back to full frame (then a quiet hold)
s.place(bubble(450), 36.03, 0.34, -0.5, 0.3)                 # DM bubble
whoosh(37.22, 0.4, 2500, 300, 0.40, 0.8)                     # film flies back into depth

# Burst (37.55)
for t, f, g in ((37.55, 66, 0.6), (38.05, 60, 0.62), (38.50, 52, 0.66)):
    s.place(sub(f, 0.45), t, g, 0.0, 0.3)
s.place(wood(190, 0.12), 38.50, 0.3, 0.0, 0.2)
whoosh(39.25, 0.78, 200, 5000, 0.62, 0.95, -0.6, 0.5)      # riser into the logo

# Outro (40.00)
s.place(sub(46, 1.4), 40.42, 0.95, 0.0, 0.5)                 # the stroke becomes the mark
whoosh(40.40, 0.8, 300, 1500, 0.28, 0.4)                     # mark grows / camera orbits
s.place(wood(130, 0.18), 41.26, 0.48, -0.1, 0.3)             # purple shard lands
s.place(sub(82, 0.3), 41.26, 0.32, 0.0, 0.3)
for i in range(5):                                           # SEVUN letters
    s.place(wood(300 + 25 * i, 0.06), 41.48 + i * 0.133, 0.11, -0.3 + 0.15 * i, 0.25)
whoosh(43.30, 1.0, 200, 900, 0.24, 0.5, 0.0, -0.4)          # lockup moves left
s.place(wood(220, 0.08), 44.02, 0.16, 0.2, 0.25)              # "Try 1 video."
whoosh(45.58, 0.35, 800, 3000, 0.14, 0.5, 0.1, 0.4)         # underline
s.place(bubble(420), 46.32, 0.38, 0.1, 0.35)                  # CTA

s.write(os.path.join(HERE, "../assets/sfx/sfx.wav"), peak_db=-9.0)
