#!/usr/bin/env python3
"""Soft SFX kit for the Manetrust weekly videos: python3 scripts/gen-mc-sfx.py -> public/sfx/mc_*.wav"""
import wave
import numpy as np

SR = 44100


def env(n, a=0.004, r=0.12):
    e = np.ones(n); na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] = np.minimum(e[-nr:], np.linspace(1, 0, nr)); return e


def tone(f0, f1, dur, vol=1.0, kind="sine"):
    n = int(dur * SR); f = np.linspace(f0, f1, n); ph = 2 * np.pi * np.cumsum(f) / SR
    w = np.sin(ph) if kind == "sine" else np.sign(np.sin(ph)) * 0.3
    return w * env(n, 0.003, dur * 0.7) * vol


def noise(dur, lo, hi, vol=1.0, seed=1):
    n = int(dur * SR); x = np.random.default_rng(seed).standard_normal(n)
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR); X[(fr < lo) | (fr > hi)] = 0
    y = np.fft.irfft(X, n); return y / (np.max(np.abs(y)) + 1e-9) * vol


CUES = {
    "pop": lambda: tone(520, 880, 0.12, 0.8),
    "swap": lambda: np.concatenate([tone(300, 700, 0.07, 0.6), tone(700, 420, 0.09, 0.5)]),
    "tick": lambda: tone(1800, 1800, 0.025, 0.5, "sq"),
    "whoosh": lambda: noise(0.35, 300, 3500, 0.6) * np.sin(np.linspace(0, np.pi, int(0.35 * SR))),
    "stamp": lambda: tone(140, 50, 0.25, 1.0) + np.pad(noise(0.08, 200, 2500, 0.4, 3), (0, int(0.17 * SR))),
    "chime": lambda: tone(880, 880, 0.6, 0.5) + tone(1320, 1320, 0.6, 0.3),
}

for name, fn in CUES.items():
    s = fn(); s = s / max(1e-9, np.max(np.abs(s))) * 0.7
    with wave.open(f"public/sfx/mc_{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((s * 32767).astype("<i2").tobytes())
    print("wrote", name)
