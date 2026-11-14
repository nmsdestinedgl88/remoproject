#!/usr/bin/env python3
"""Map timestamps from a reference narration (same text) onto a recorded narration.
usage: align.py REF.wav USER.wav marks.json OUT.json
marks.json = {"name": ["start"|"end", ref_seconds], ...}   OUT.json = {"name": user_seconds}
Uses DTW on MFCCs, then snaps each mark to the nearest speech onset (start) or offset (end)."""
import sys, json
import numpy as np, librosa

ref, usr, mk, out = sys.argv[1:5]
SR, HOP = 16000, 320  # 20 ms frames

def load(p):
    y, _ = librosa.load(p, sr=SR)
    m = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=20, n_fft=512, hop_length=HOP)[1:]
    m = (m - m.mean(1, keepdims=True)) / (m.std(1, keepdims=True) + 1e-6)
    env = librosa.feature.rms(y=y, frame_length=512, hop_length=HOP)[0]
    return m, env

Xr, er = load(ref)
Xu, eu = load(usr)
_, wp = librosa.sequence.dtw(X=Xr, Y=Xu, metric='euclidean')
wp = wp[::-1]
mapj = {}
for i, j in wp:
    mapj.setdefault(int(i), []).append(int(j))
fr = HOP / SR
thr = 0.12 * np.percentile(eu, 95)
voiced = eu > thr

# speech segments of the recording, from a -38 dB silence scan
import subprocess, re
sil = []
txt = subprocess.run(['ffmpeg', '-v', 'info', '-i', usr, '-af', 'silencedetect=n=-38dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True).stderr
st = None
for m in re.finditer(r'silence_(start|end): ([0-9.]+)', txt):
    if m.group(1) == 'start': st = float(m.group(2))
    elif st is not None: sil.append((st, float(m.group(2)))); st = None
ends = [b for a, b in sil]  # where speech resumes

def snap_start(t):
    near = [e for e in ends if abs(e - t) <= 0.7]
    if near:
        e = min(near, key=lambda e: abs(e - t))
        prev = [x for x in ends if 0 < e - x <= 0.35]  # a breath right before the word: start at the breath
        return min(prev) if prev else e
    c = int(round(t / fr))
    for k in sorted(range(max(1, c - 25), min(len(eu) - 8, c + 25)), key=lambda k: abs(k - c)):
        if voiced[k] and not voiced[k - 6:k].any(): return k * fr
    return t

def last_voiced_before(t):
    k = min(int(t / fr), len(eu) - 1)
    while k > 0 and not voiced[k]: k -= 1
    return (k + 1) * fr

marks = json.load(open(mk))  # {"name": ref_start_seconds} in speaking order
names = list(marks)
starts = []
for n in names:
    i = min(int(round(marks[n] / fr)), max(mapj))
    while i not in mapj: i -= 1
    starts.append(snap_start(float(np.median(mapj[i])) * fr))
res = {}
for k, n in enumerate(names):
    e = last_voiced_before(starts[k + 1] - 0.01) if k + 1 < len(names) else last_voiced_before(len(eu) * fr)
    res[n] = {'s': round(starts[k], 3), 'e': round(e, 3)}
json.dump(res, open(out, 'w'), indent=1)
print(json.dumps(res))
