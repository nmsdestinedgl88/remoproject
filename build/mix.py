"""Bed (low bowed tone) + dry foley ticks + scratch VO -> audio/mix.wav (48k mono), then loudnorm in ffmpeg."""
import json, math, random, struct, wave, subprocess
SR = 48000; N = 60 * SR
A = json.load(open("src/ava/anchors.json"))
random.seed(7)
def buf(): return [0.0] * N
bed, fx = buf(), buf()
# bed: D2 bowed tone, slow swell, quiet; fades out before the final hold
for i in range(N):
    t = i / SR
    amp = 0.5 + 0.5 * math.sin(2 * math.pi * t / 9.0 - 1.2)
    env = min(1, t / 2.0) * (1 - min(1, max(0, (t - 56.5) / 2.0)))
    v = 0
    for k, g in ((1, 1.0), (2, 0.5), (3, 0.28), (4, 0.12)):
        v += g * math.sin(2 * math.pi * 73.42 * k * t + 0.4 * math.sin(2 * math.pi * 5.1 * t) * 0.02)
    v += 0.4 * math.sin(2 * math.pi * 73.9 * t)  # slight detune beat = bow
    bed[i] = v * (0.35 + 0.65 * amp) * env * 0.05
def add(arr, start_s, samples, gain):
    s0 = int(start_s * SR)
    for j, v in enumerate(samples):
        if s0 + j < N: arr[s0 + j] += v * gain
def tick():  # dry wood-block: damped 1.1 kHz + 1.7 kHz
    return [(math.sin(2*math.pi*1100*j/SR)*0.7 + math.sin(2*math.pi*1730*j/SR)*0.3) * math.exp(-j/SR*95) for j in range(int(0.12*SR))]
def pencil():  # soft paper/pencil scratch: band-limited noise burst
    out, lp = [], 0.0
    for j in range(int(0.16*SR)):
        n = random.uniform(-1, 1); lp += 0.35 * (n - lp)
        out.append((n - lp) * math.sin(math.pi * j / (0.16*SR)) ** 2 * 0.8)
    return out
for fr, kind in A["sfx"]:
    add(fx, fr / 30 - (0.0 if kind == "tick" else 0.02), tick() if kind == "tick" else pencil(), 0.5 if kind == "tick" else 0.22)
# voice
w = wave.open("audio/vo_raw.wav"); raw = struct.unpack("<%dh" % w.getnframes(), w.readframes(w.getnframes())); sr_in = w.getframerate()
vo = buf()
for i in range(N):
    x = i * sr_in / SR; k = int(x)
    if k + 1 < len(raw): vo[i] = (raw[k] * (1 - (x - k)) + raw[k + 1] * (x - k)) / 32768
mix = [vo[i] * 1.0 + bed[i] + fx[i] for i in range(N)]
pk = max(abs(m) for m in mix); mix = [m / max(pk, 1e-9) * 0.9 for m in mix]
with wave.open("audio/mix_pre.wav", "wb") as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR)
    o.writeframes(struct.pack("<%dh" % N, *[int(max(-1, min(1, m)) * 32767) for m in mix]))
