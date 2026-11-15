"""Mix for a Sketchnote film: the recorded voiceover (audio/vo.wav) + the user's BGM (audio/bgm.wav, kept low) + pen foley from events.json.
usage: .venv/bin/python mix.py <film dir>   -> <film dir>/out/mix.wav"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB') or '/root/lemo-opuscar'
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, click, whoosh

HERE = os.path.abspath(sys.argv[1])
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = float(EVJ['dur']); N = int(DUR * SR); EV = EVJ['ev']
CUE = {e['name']: e['t'] for e in EV if e['type'] == 'cue'}
rng = np.random.default_rng(31)
tt = np.arange(N) / SR
rms = lambda x: float(np.sqrt(np.mean(np.square(x)) + 1e-12))
db = lambda x: 20 * np.log10(x + 1e-12)
smooth = lambda x, sec: np.convolve(x, np.ones(max(1, int(sec * SR))) / max(1, int(sec * SR)), 'same')

v, sr = sf.read(os.path.join(HERE, 'audio', 'vo.wav'), dtype='float32')
if v.ndim > 1: v = v.mean(1)
assert sr == SR
vo = np.zeros(N); vo[:min(N, len(v))] = v[:N]
vo = hp(vo, 80)
vo = compress(vo / (np.abs(vo).max() + 1e-9) * 0.9, thr=0.22, ratio=3.0, att=0.003, rel=0.12)
vmask = (smooth(np.abs(vo), 0.06) > 0.012).astype(float)
duck = smooth(np.maximum(vmask, np.roll(vmask, int(0.12 * SR))), 0.18)

def activity(kind):
    a = np.zeros(N); pw = np.zeros(N)
    for e in EV:
        if e['type'] != kind: continue
        i0 = int(e['t'] * SR); i1 = min(N, int((e['t'] + max(e['d'], 0.03)) * SR))
        if i1 <= i0: continue
        n = i1 - i0; env = np.ones(n); r = min(n // 3, int(0.012 * SR))
        if r > 0: env[:r] = np.linspace(0, 1, r); env[-r:] = np.linspace(1, 0, r)
        a[i0:i1] += env; pw[i0:i1] += env * e.get('pan', 0)
    pan = np.where(a > 1e-6, pw / np.maximum(a, 1e-6), 0)
    return smooth(1 - np.exp(-a * 0.9), 0.02), smooth(pan, 0.02)
def scratch_noise(lo, hi, grain_hz, depth, seed):
    r = np.random.default_rng(seed); x = bp(r.standard_normal(N), lo, hi, 2)
    g = lp(np.abs(r.standard_normal(N)), grain_hz, 1); g = g / (np.percentile(g, 95) + 1e-9)
    return x * ((1 - depth) + depth * g)
def wobble(rate, seed):
    r = np.random.default_rng(seed)
    ph = np.cumsum(rate * (1 + 0.35 * lp(r.standard_normal(N), 3, 1) * 8) / SR) * 2 * np.pi
    return 0.55 + 0.45 * np.abs(np.sin(ph))
def pan_st(x, pan):
    th = (pan + 1) * np.pi / 4; return np.stack([x * np.cos(th), x * np.sin(th)], 1)

foley = np.zeros((N, 2))
for kind, (lo, hi, gh, dep, rate, pw, g, sd) in {'pen': (2400, 6500, 900, 0.85, 6, 1.0, 0.14, 1), 'write': (2000, 6000, 700, 0.9, 11, 1.5, 0.17, 3), 'marker': (700, 3200, 300, 0.6, 14, 2.0, 0.14, 5)}.items():
    lv, pn = activity(kind)
    foley += pan_st(scratch_noise(lo, hi, gh, dep, sd) * wobble(rate, sd + 1) ** pw * lv, pn * 0.6) * g
for e in EV:
    if e['type'] in ('pen', 'write') and e['d'] >= 0.12:
        add(foley, hp(click(pitch=0.55 + rng.random() * 0.2, v=1.0), 1500) * 0.04, e['t'], 1.0, e.get('pan', 0) * 0.6)
foley *= (1 - 0.5 * duck)[:, None]
room = lp(rng.standard_normal(N), 500, 2) * 0.004
foley += np.stack([room, np.roll(room, 997)], 1)
for k, t0 in CUE.items():              # cue names starting "wh" are camera moves, "plip" are coin landings
    if k.startswith('wh'): add(foley, lp(whoosh(0.8, 1.0), 2800) * 0.07, t0, 1.0, 0.0)
    if k.startswith('plip'):
        d = 0.16; t_ = np.arange(int(d * SR)) / SR
        add(foley, np.sin(2 * np.pi * (1500 - 2600 * t_) * t_) * np.exp(-t_ / 0.035) * 0.14, t0, 1.0, 0.1)

m, sr2 = sf.read(os.path.join(HERE, 'audio', 'bgm.wav'), dtype='float32'); assert sr2 == SR
music = np.zeros((N, 2)); music[:min(N, len(m))] = m[:N]
music = music - 0.35 * np.stack([bp(music[:, 0], 300, 4000), bp(music[:, 1], 300, 4000)], 1)
music *= (1 - 0.40 * duck)[:, None]
music *= np.clip(tt / 1.6, 0, 1)[:, None] * np.clip((DUR - tt) / 2.0, 0, 1)[:, None]
spk = vmask > 0
mg = rms(vo[spk]) / (rms(music[spk].mean(1)) * 10 ** (13 / 20)); music *= mg
mix = foley + music + np.stack([vo, vo], 1)
print(f'voice vs music: {db(rms(vo[spk])) - db(rms(music[spk].mean(1))):.1f} dB; voice vs pens: {db(rms(vo[spk])) - db(rms(foley[spk].mean(1))):.1f} dB')
mix = np.stack([limit(compress(mix[:, c], thr=0.35, ratio=2.0)) for c in (0, 1)], 1)
mix *= np.clip((DUR - tt) / 0.25, 0, 1)[:, None]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
print('mix', mix.shape, 'peak', round(float(np.abs(mix).max()), 3))
