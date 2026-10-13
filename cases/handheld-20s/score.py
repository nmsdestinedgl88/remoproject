#!/usr/bin/env python3
"""Sound for the handheld film: synthesised effects in one room + an original synthesised music bed
(no samples, no third-party music: nothing to license). Timings follow the comp's own beat table."""
import sys, os
sys.path.insert(0, os.path.expanduser("~/.claude/skills/onetake/scripts"))
import numpy as np
from sfx_palette import *

SRr = SR
rng = np.random.default_rng(11)
s = Score(dur=20, T60=1.0)

def nf(m): return 440.0 * 2 ** ((m - 69) / 12)            # midi -> Hz
def env(n, a=0.005, d=0.12, sus=0.0, r=0.05):
    t = np.arange(n) / SR; e = np.exp(-t / max(d, 1e-3)) * (1 - sus) + sus
    e *= np.minimum(1, t / a); e *= np.minimum(1, (n / SR - t) / max(r, 1e-3)); return e
def square(f, dur, duty=0.5, a=0.004, d=0.14, sus=0.0):
    n = int(SR * dur); t = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * f * t) - np.cos(np.pi * duty)) * 0.6
    return lp(x, 5200) * env(n, a, d, sus, 0.02)
def tri(f, dur, a=0.01, d=0.5, sus=0.0):
    n = int(SR * dur); t = np.arange(n) / SR
    x = 2 / np.pi * np.arcsin(np.sin(2 * np.pi * f * t)); return x * env(n, a, d, sus, 0.05)
def pad(freqs, dur, fc=1400, swell=0.8):
    n = int(SR * dur); t = np.arange(n) / SR; x = np.zeros(n)
    for f in freqs:
        for det in (-0.004, 0.0, 0.004):
            ph = 2 * np.pi * f * (1 + det) * t
            x += (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.18 * np.sin(3 * ph))
    x = lp(x / (3 * len(freqs)), fc)
    e = np.minimum(1, t / swell) * np.minimum(1, (dur - t) / swell)
    return x * e

# ───────── sound effects (from the comp's events) ─────────
# 0.0 – 1.2 s: nothing but air. The room is the rest.
s.place(sub(88, 0.5), 1.2, 0.30, 0.0, 0.3); s.place(glass(1175, 0.5, 0.6), 1.2, 0.07, 0.0, 0.5)         # the TV comes on
for k, t in enumerate([1.75 + 0.4, 1.97 + 0.4, 2.19 + 0.4, 2.41 + 0.4]):                              # four things land on the floor
    s.place(wood(150 + 22 * k, 0.14), t, 0.34, -0.4 + 0.25 * k, 0.28)
    s.place(bubble(300 + 70 * k), t, 0.10, -0.4 + 0.25 * k, 0.3)
s.place(air(0.35, 300, 2400, 1.2, 0.35), 1.75, 0.20, 0.2, 0.3, pan_to=-0.3)                           # the first one drops in
txt = "MEMORY CARD\nFULL.\nDELETE A SAVE?"; n_ch = len(txt.replace("\n", ""))
for i in range(n_ch):                                                                                  # dialog text typing, quiet ticks
    s.place(wood(2100 + 40 * (i % 5), 0.03), 3.22 + i / 30.0, 0.045, -0.2, 0.15)
s.place(glass(311, 0.6, 0.4), 3.62, 0.09, -0.2, 0.5)                                                   # "FULL." — a low, dull note
s.place(air(0.95, 160, 3800, 1.3, 0.5), 3.95, 0.50, 0.7, 0.45, pan_to=-0.5)                            # the line sweeps in
s.place(sub(58, 0.9), 4.85, 0.40, 0.3, 0.4); s.place(glass(523, 0.9), 4.9, 0.10, 0.4, 0.55)             # the console lands
# hops and boots: each era gets its own little 8-bit ping (original notes, not any console's jingle)
BOOT = [[72, 76, 79, 84], [69, 74, 78, 81], [67, 71, 74, 79], [64, 68, 71, 76]]
for i, (l, notes) in enumerate(zip([7.0, 8.0, 8.75, 9.35], BOOT)):
    s.place(air(0.5, 300, 2800, 1.4, 0.55), l - 0.55, 0.26, -0.3, 0.35, pan_to=0.6)
    s.place(wood(170, 0.12), l, 0.30, 0.5, 0.3); s.place(sub(66 - 3 * i, 0.4), l, 0.20, 0.5, 0.3)
    for j, m in enumerate(notes):
        s.place(square(nf(m), 0.22, 0.25 + 0.1 * j, d=0.12), l + 0.04 + 0.06 * j, 0.09, 0.5, 0.4)
s.place(air(0.9, 140, 2200, 1.2, 0.5), 10.0, 0.40, 0.4, 0.4, pan_to=-0.6)                              # the line pushes the TV out
s.place(sub(52, 0.6), 10.0, 0.28, 0.0, 0.3)
s.place(air(1.8, 120, 5200, 1.0, 0.8), 10.95, 0.55, 0.0, 0.5)                                          # the dive: a long rise
s.place(sub(44, 1.4), 12.75, 0.60, 0.0, 0.45)                                                          # arrival at the bottom of the screen
for k in range(1, 30):                                                                                 # odometer ticks, slowing as it settles
    x = -np.log2(1 - k / 30.0) / 10.0
    s.place(wood(260 + 7 * k, 0.04), 12.4 + 1.05 * x, 0.06, 0.0, 0.2)
s.place(glass(1047, 1.0), 13.45, 0.16, 0.0, 0.55); s.place(sub(62, 0.7), 13.45, 0.30, 0.0, 0.35)       # the "+" lands
s.place(air(1.4, 5000, 160, 1.0, 0.25), 14.0, 0.45, 0.0, 0.5)                                          # pull back (falling sweep)
s.place(sub(48, 0.9), 15.4, 0.40, 0.0, 0.4)                                                            # settled
# 15.4 – 16.15: held breath
for i, t in enumerate([16.15, 16.65, 16.95, 17.25]):                                                   # the burst: low hits, hard cuts
    s.place(sub(70 - 4 * i, 0.5), t, 0.55, 0.0, 0.25); s.place(wood(190 + 30 * i, 0.1), t, 0.30, 0.0, 0.25)
for j, m in enumerate([60, 64, 67, 72]):                                                               # the end card: one warm chord and its tail
    s.place(glass(nf(m + 12), 2.4, 0.5), 18.2 + 0.05 * j, 0.10, -0.2 + 0.2 * j, 0.6)
s.place(sub(55, 1.6), 18.2, 0.40, 0.0, 0.35)

# ───────── the music bed: original, synthesised, soft (A minor → F → C → G) ─────────
CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]      # Am F C G, as pad voicing
def chord_at(t0, i, dur, fc, gain, swell=0.6):
    s.place(pad([nf(m) for m in CH[i % 4]], dur, fc, swell), t0, gain, 0.0, 0.5)
chord_at(3.8, 1, 2.2, 900, 0.10)
for k in range(5):                                                  # 4.0 – 10.0: pad + a soft pulse arpeggio
    chord_at(4.0 + 2.0 * k, k, 2.3, 1200, 0.09)
for k in range(24):
    t0 = 4.6 + 0.25 * k
    if t0 > 9.9: break
    ch = CH[((k // 8)) % 4]; m = ch[k % 3] + 24 + (12 if k % 6 == 5 else 0)
    s.place(square(nf(m), 0.2, 0.25, d=0.1), t0, 0.030, 0.3 * (1 if k % 2 else -1), 0.35)
for k in range(8):                                                  # 10.9 – 12.7: climbing pad (one note per beat)
    s.place(tri(nf(57 + k * 2), 0.4, d=0.3), 10.9 + 0.25 * k, 0.07, 0.0, 0.4)
chord_at(12.75, 0, 1.6, 2400, 0.12, 0.3)                            # at the bottom of the dive
chord_at(18.2, 2, 1.8, 1800, 0.12, 0.2)                             # resolve under "press start"
for m in (60, 64, 67, 72, 76):                                      # tail: one slow arpeggio, then nothing
    pass

s.write("sfx.wav", peak_db=-8.0)
