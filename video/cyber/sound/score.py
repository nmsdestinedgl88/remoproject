#!/usr/bin/env python3
"""Sevun cybersecurity promo (9:16) — designed sound on the onetake palette (one room, each event has a cause on screen).
Times are root seconds in index.html (c1 0 · c2 10 · c3 19.75 · c4 27.05 · burst 36.65 · outro 39). Run: python3 sound/score.py"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "../../../.claude/skills/onetake/scripts"))
from sfx_palette import Score, air, wood, sub, bubble, glass  # noqa: E402

s = Score(dur=49, T60=1.2)
whoosh = lambda t, d, f0, f1, g, shape=0.5, pan=0.0, pan_to=None, send=0.45: s.place(air(d, f0, f1, 1.3, shape), t, g, pan, send, pan_to)
glassin = lambda t, g=0.26, pan=0.0: whoosh(t, 0.5, 400, 2600, g, 0.35, pan)           # a glass panel sliding in
tap = lambda t, f=320, g=0.2, pan=0.0: s.place(wood(f, 0.06), t, g, pan, 0.15)           # a soft UI tap

# c1 (0.00)
whoosh(0.0, 0.7, 200, 2800, 0.55, 0.5, -0.6, 0.6)                 # orange stroke wipe
for t in (0.72, 1.47):                                             # two alerts drop in
    s.place(glass(1175, 0.5, 0.6), t + 0.12, 0.14, 0.0, 0.5); glassin(t, 0.22)
whoosh(2.58, 0.4, 2200, 500, 0.24, 0.6)                            # alerts flick away
glassin(3.0, 0.32)                                                 # threat monitor
for i in range(8):
    s.place(bubble(480 + 30 * i, 0.12), 3.48 + i * 0.18, 0.08, -0.4 + 0.1 * i, 0.3)  # radar blips
s.place(sub(54, 0.7), 4.99, 0.7, 0.0, 0.35); s.place(wood(140, 0.14), 4.99, 0.4)       # UNDER SIEGE
whoosh(6.86, 0.35, 1800, 400, 0.2, 0.6)
glassin(7.25, 0.3); tap(7.56, 280, 0.24)                           # competitor's player, play
whoosh(9.16, 0.3, 1800, 400, 0.2, 0.6)
s.place(sub(58, 0.7), 9.42, 0.7, 0.0, 0.35)                        # "You're not."

# c2 (10.00)
glassin(10.45, 0.28)                                               # week widget
for i in range(7):
    tap(11.97 + i * 0.09, 300 + 18 * i, 0.16, -0.5 + i / 6)        # each day ticked
whoosh(13.98, 0.35, 1800, 400, 0.18, 0.6)
glassin(14.2, 0.3)
whoosh(14.22, 0.5, 300, 4200, 0.4, 0.95, 0.0, 0.0)                 # feed flicks…
s.place(sub(60, 0.6), 14.72, 0.6, 0.0, 0.35); s.place(wood(160, 0.12), 14.72, 0.36)    # …stops
whoosh(16.18, 0.35, 1800, 400, 0.2, 0.6)
glassin(17.45, 0.3)                                                # incoming call
for k in range(3):
    s.place(glass(988, 0.35, 0.5), 17.7 + k * 0.7, 0.1, 0.3, 0.4) # ring
s.place(bubble(420), 19.33, 0.3, 0.4, 0.3)                         # "not after."
s.place(wood(220, 0.08), 19.5, 0.2, 0.4)

# c3 (19.75)
glassin(21.1, 0.34)                                                # wallet card flips in
for k in range(7):
    tap(21.24 + k * 0.08, 360 + 20 * k, 0.1, -0.2)                 # $0 → $7 ticks
whoosh(22.15, 0.9, 900, 3000, 0.14, 0.5, -0.4, 0.4)                # sheen
glassin(23.45, 0.24, -0.3); s.place(bubble(600, 0.2), 24.23, 0.3, 0.3, 0.3)   # Big Mac ✓
glassin(25.5, 0.24, 0.3); s.place(bubble(680, 0.2), 26.3, 0.3, 0.3, 0.3)      # coffee ✓
whoosh(26.7, 0.35, 1800, 400, 0.22, 0.6)

# c4 (27.05)
glassin(27.6, 0.28)
s.place(wood(260, 0.07), 29.45, 0.3, 0.2, 0.15); s.place(bubble(560, 0.18), 29.5, 0.2, 0.2)   # switch flips on
whoosh(30.4, 0.35, 1800, 400, 0.2, 0.6)
glassin(30.6, 0.3)
whoosh(30.75, 0.9, 250, 900, 0.16, 0.5)                            # shield draws
s.place(glass(784, 0.9, 0.7), 32.12, 0.18, 0.0, 0.5)               # check locks
whoosh(33.55, 0.35, 1800, 400, 0.2, 0.6)
glassin(33.65, 0.28); tap(34.73, 280, 0.26)                        # story card, play
whoosh(35.15, 0.35, 1800, 400, 0.2, 0.6)
for k in range(3):
    tap(35.1 + k * 0.06, 520, 0.08, -0.4)                         # typing dots
s.place(bubble(450), 35.38, 0.36, -0.4, 0.3)                       # DM bubble lands

# burst (36.65)
for t, f, g in ((36.65, 66, 0.6), (37.15, 60, 0.62), (37.6, 52, 0.66)):
    s.place(sub(f, 0.45), t, g, 0.0, 0.3)
s.place(wood(190, 0.12), 37.6, 0.3, 0.0, 0.2)
whoosh(38.28, 0.72, 200, 5000, 0.62, 0.95, -0.6, 0.5)            # riser into the logo

# outro (39.00) — same beats as the other cuts
s.place(sub(46, 1.4), 39.42, 0.95, 0.0, 0.5)
whoosh(39.40, 0.8, 300, 1500, 0.28, 0.4)
s.place(wood(130, 0.18), 40.26, 0.48, -0.1, 0.3); s.place(sub(82, 0.3), 40.26, 0.32, 0.0, 0.3)
for i in range(5):
    s.place(wood(300 + 25 * i, 0.06), 40.48 + i * 0.133, 0.11, -0.3 + 0.15 * i, 0.25)
whoosh(42.30, 1.0, 200, 900, 0.24, 0.5)
s.place(wood(220, 0.08), 43.02, 0.16, 0.0, 0.25)
whoosh(44.58, 0.35, 800, 3000, 0.14, 0.5)
s.place(bubble(420), 45.32, 0.38, 0.0, 0.35)

s.write(os.path.join(HERE, "../assets/sfx/sfx.wav"), peak_db=-9.0)
