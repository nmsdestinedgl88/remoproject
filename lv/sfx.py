#!/usr/bin/env python3
"""maneclaud sound effects: synthesise short cues in code and mix them under the voiceover.
  python3 sfx.py make cues.json sfx.wav TOTAL_SECONDS        write the effects track
  python3 sfx.py mix VO.wav sfx.wav OUT.wav                   voiceover + effects (effects about 20 dB under the voice)
cues.json: [[seconds, "pop" | "whoosh" | "stamp" | "tick" | "chime" | "swap" | "type"], ...]
"""
import json, subprocess, sys, wave
import numpy as np

SR = 44100


def env(n, a=0.004, r=0.12):
    e = np.ones(n); na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] = np.minimum(e[-nr:], np.linspace(1, 0, nr)); return e


def tone(f0, f1, dur, vol=1.0, kind="sine"):
    n = int(dur * SR); f = np.linspace(f0, f1, n); ph = 2 * np.pi * np.cumsum(f) / SR
    w = np.sin(ph) if kind == "sine" else np.sign(np.sin(ph)) * 0.5
    return w * env(n, 0.003, dur * 0.7) * vol


def noise(dur, lo, hi, vol=1.0, seed=1):
    n = int(dur * SR); x = np.random.default_rng(seed).standard_normal(n)
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR); X[(fr < lo) | (fr > hi)] = 0
    y = np.fft.irfft(X, n); return y / (np.max(np.abs(y)) + 1e-9) * vol


CUES = {
    "pop": lambda: tone(520, 880, 0.12, 0.8),
    "swap": lambda: np.concatenate([tone(300, 700, 0.07, 0.6), tone(700, 420, 0.09, 0.5)]),
    "tick": lambda: tone(1800, 1800, 0.025, 0.5, "sq"),
    "type": lambda: np.concatenate([tone(1500 + 60 * i, 1500 + 60 * i, 0.02, 0.35, "sq") for i in range(6)]),
    "chime": lambda: tone(880, 880, 0.5, 0.5) + tone(1320, 1320, 0.5, 0.35),
    "whoosh": lambda: noise(0.35, 300, 4000, 0.7) * np.sin(np.linspace(0, np.pi, int(0.35 * SR))),
    "stamp": lambda: tone(140, 50, 0.25, 1.0) + np.pad(noise(0.08, 200, 3000, 0.5, 3), (0, int(0.17 * SR))),
}


def make(cues, out, total):
    buf = np.zeros(int((total + 1) * SR))
    for t, name in cues:
        s = CUES[name](); i = int(t * SR); j = min(len(buf), i + len(s))
        if i < len(buf): buf[i:j] += s[: j - i]
    buf = buf / max(1.0, np.max(np.abs(buf))) * 0.6
    with wave.open(out, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((buf * 32767).astype("<i2").tobytes())


def mix(vo, sfx, out):
    r = subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", vo, "-i", sfx, "-filter_complex",
                        "[1:a]volume=0.11[s];[0:a][s]amix=inputs=2:duration=first:normalize=0[o]", "-map", "[o]", out], text=True, capture_output=True)
    if r.returncode: sys.exit(r.stderr)


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["make"]: make(json.load(open(a[1])), a[2], float(a[3]))
    elif a[:1] == ["mix"]: mix(a[1], a[2], a[3])
    else: sys.exit(__doc__)
