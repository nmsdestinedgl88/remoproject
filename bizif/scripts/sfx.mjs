// Deterministic SFX + music-bed synth → public/sfx/mix.wav (mono 16-bit 44.1k). No downloads.
import fs from "node:fs";
const SR = 44100, TOTAL = 108.7;
const out = new Float32Array(Math.ceil(TOTAL * SR));
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const add = (t, buf, g = 1) => { const o = Math.round(t * SR); for (let i = 0; i < buf.length && o + i < out.length; i++) out[o + i] += buf[i] * g; };
const mk = (d) => new Float32Array(Math.round(d * SR));
const env = (i, n, a = 0.005, curve = 3) => Math.min(1, i / (a * SR)) * Math.pow(1 - i / n, curve);

const whoosh = (d = 0.5, up = false) => { const b = mk(d); let lp = 0; for (let i = 0; i < b.length; i++) { const x = i / b.length; const f = up ? 0.02 + 0.5 * x * x : 0.5 * (1 - x) ** 2 + 0.02; lp += (rnd() - lp) * f; b[i] = lp * 3.2 * Math.sin(Math.PI * x) ** 1.5; } return b; };
const pop = (f0 = 700, f1 = 260, d = 0.14) => { const b = mk(d); let ph = 0; for (let i = 0; i < b.length; i++) { const x = i / b.length; ph += (2 * Math.PI * (f1 + (f0 - f1) * Math.exp(-x * 7))) / SR; b[i] = Math.sin(ph) * env(i, b.length, 0.002, 2.2); } return b; };
const thump = (d = 0.5) => { const b = mk(d); let ph = 0; for (let i = 0; i < b.length; i++) { const x = i / b.length; ph += (2 * Math.PI * (42 + 90 * Math.exp(-x * 14))) / SR; b[i] = (Math.sin(ph) * 1.1 + (i < 600 ? rnd() * 0.5 : 0)) * env(i, b.length, 0.002, 2.5); } return b; };
const tick = (f = 2200) => { const b = mk(0.03); for (let i = 0; i < b.length; i++) b[i] = (Math.sin((2 * Math.PI * f * i) / SR) * 0.7 + rnd() * 0.3) * env(i, b.length, 0.001, 4); return b; };
const bell = (fs, d = 0.5, g = [1, 0.6, 0.35]) => { const b = mk(d); for (let i = 0; i < b.length; i++) { let v = 0; fs.forEach((f, k) => (v += Math.sin((2 * Math.PI * f * i) / SR) * (g[k] ?? 0.2))); b[i] = v * env(i, b.length, 0.001, 3.2) * 0.5; } return b; };
const clink = (j = 0) => bell([2400 + j * 180, 3700 + j * 260, 5300 + j * 300], 0.4);
const chime = () => bell([880, 1318, 1760], 0.6);
const cash = () => { const b = mk(0.9); const a = bell([1568, 2093, 3136], 0.9), c = bell([2093, 3135, 4186], 0.7); a.forEach((v, i) => (b[i] += v)); c.forEach((v, i) => (b[i + 3000] += v)); return b; };
const riser = (d, f0 = 200, f1 = 1800) => { const b = mk(d); let ph = 0, lp = 0; for (let i = 0; i < b.length; i++) { const x = i / b.length; ph += (2 * Math.PI * (f0 + (f1 - f0) * x * x)) / SR; lp += (rnd() - lp) * (0.03 + 0.4 * x * x); b[i] = (Math.sin(ph) * 0.3 + lp * 1.2) * x ** 1.6 * (x > 0.97 ? (1 - x) / 0.03 : 1); } return b; };
const shimmer = (n = 6, base = 1046) => { const b = mk(0.9); for (let k = 0; k < n; k++) { const o = Math.round(k * 0.05 * SR), f = base * [1, 1.25, 1.5, 1.875, 2, 2.5][k % 6]; for (let i = 0; i < SR * 0.5; i++) if (o + i < b.length) b[o + i] += Math.sin((2 * Math.PI * f * i) / SR) * env(i, SR * 0.5, 0.002, 3) * 0.35; } return b; };
const click = () => tick(1400);

const cues = [];
const q = (t, kind, g = 0.5, arg) => cues.push({ t, kind, g, arg });
const BOUNDS = [4.0, 8.4, 16.5, 22.8, 27.9, 33.9, 40.7, 49.6, 55.9, 68.4, 76.3, 80.7, 86.2, 91.0, 95.5, 104.2];
BOUNDS.forEach((b) => { q(b - 0.27, "whoosh", 0.55); q(b - 0.05, "thump", 0.22); });
// hook
q(0.1, "pop", 0.5); q(0.2, "chime", 0.25); q(1.35, "whoosh", 0.35, true); q(1.9, "clink", 0.4); q(2.35, "thump", 0.6); q(2.4, "shimmer", 0.3); q(2.9, "tick", 0.3);
// buy
q(4.28, "pop"); q(4.7, "tick", 0.4); q(5.0, "pop", 0.55, 1); for (let t = 5.3; t < 6.9; t += 0.085) q(t, "tick", 0.28); q(6.95, "cash", 0.35); q(7.25, "thump", 0.75); q(7.3, "click", 0.5);
// rev
q(8.5, "pop"); q(10.4, "whoosh", 0.3); q(10.92, "thump", 0.5); for (let t = 10.95; t < 12.1; t += 0.07) q(t, "tick", 0.25); q(12.15, "cash", 0.3);
q(14.4, "riser", 0.35, 0.9); q(14.9, "pop", 0.5, 1); q(15.0, "shimmer", 0.3);
// gold
q(16.7, "pop", 0.5); q(17.8, "whoosh", 0.4, true); q(18.5, "clink", 0.5); q(19.1, "pop", 0.5); for (let i = 0; i < 12; i++) q(19.9 + i * 0.15, "clink", 0.38, i % 5); q(21.0, "pop", 0.4); q(21.55, "shimmer", 0.55); q(21.55, "thump", 0.5);
// borders
[22.95, 23.2, 23.45].forEach((t, i) => q(t, "pop", 0.4, i)); q(23.2, "whoosh", 0.3, true); [24.4, 25.1, 25.8].forEach((t, i) => q(t, "clink", 0.4, i)); q(26.3, "pop", 0.5); q(26.5, "chime", 0.35); q(27.1, "chime", 0.35);
// clearing
q(28.0, "pop", 0.5); q(28.5, "pop", 0.4); for (let t = 28.6; t < 31.2; t += 0.32) q(t, "tick", 0.2); [29.5, 30.3].forEach((t) => q(t, "click", 0.5)); q(31.7, "pop", 0.5); q(32.2, "thump", 0.5); q(32.3, "chime", 0.3);
// users
q(34.1, "pop", 0.5); q(34.2, "riser", 0.4, 2.2); for (let t = 34.3; t < 36.3; t += 0.06) q(t, "tick", 0.18); q(37.55, "thump", 0.85); q(37.6, "shimmer", 0.4); for (let t = 37.7; t < 40; t += 0.07) q(t, "tick", 0.22);
// fees
q(40.75, "thump", 0.8); q(40.8, "shimmer", 0.35); for (let t = 40.8; t < 42.3; t += 0.07) q(t, "tick", 0.22); q(42.35, "cash", 0.5); q(43.0, "pop", 0.5); [43.65, 44.1, 44.55, 45.0, 45.5].forEach((t) => q(t, "click", 0.55)); q(46.1, "pop", 0.5); q(46.95, "clink", 0.55); q(47.3, "whoosh", 0.25); q(48.0, "pop", 0.4);
// dwarf
q(49.8, "riser", 0.4, 3.8); q(50.0, "pop", 0.4); q(50.1, "pop", 0.4); q(51.0, "pop", 0.4); q(54.0, "thump", 0.9); q(54.05, "clink", 0.3);
// data
q(58.4, "pop", 0.5); for (let t = 57.8; t < 66; t += 0.28) q(t, "tick", 0.16); q(59.9, "shimmer", 0.35); q(59.9, "pop", 0.4); q(63.1, "pop", 0.45); [63.2, 63.45, 63.7, 63.95, 64.2, 64.45].forEach((t, i) => q(t, "chime", 0.14 + i * 0.01)); q(65.8, "pop", 0.45); [65.9, 66.02, 66.14, 66.26, 66.38].forEach((t) => q(t, "tick", 0.5));
// clients
[70.4, 71.3, 72.7].forEach((t) => { q(t, "pop", 0.5); q(t + 0.1, "chime", 0.35); }); q(73.5, "thump", 0.8); q(73.6, "cash", 0.45);
// adopt
for (let t = 76.5; t < 78.8; t += 0.14) q(t, "tick", 0.15); q(77.0, "pop", 0.45); q(78.4, "thump", 0.7); for (let t = 78.5; t < 80.4; t += 0.07) q(t, "tick", 0.2);
// regions
[81.0, 81.55, 82.1, 82.65].forEach((t, i) => { q(t, "pop", 0.5, i); q(t + 0.12, "chime", 0.25); }); [83.1, 83.35, 83.6].forEach((t) => q(t, "pop", 0.45));
// services
q(86.5, "pop", 0.5); q(86.6, "click", 0.4); q(87.95, "pop", 0.5); [88.05, 88.15, 88.25, 88.35, 88.45].forEach((t, i) => q(t, "clink", 0.3, i)); q(88.85, "pop", 0.5); q(89.0, "click", 0.5); q(89.5, "pop", 0.55); q(89.6, "chime", 0.35);
// shop
q(91.3, "pop", 0.5); for (let t = 91.4; t < 93.5; t += 0.35) q(t, "tick", 0.2); q(93.6, "thump", 0.8); q(93.7, "cash", 0.5);
// ask
q(95.6, "pop", 0.55, 1); q(95.7, "chime", 0.4); [96.7, 97.76, 99.5, 101.94].forEach((t) => { q(t - 0.05, "whoosh", 0.3); q(t, "pop", 0.55); }); q(103.2, "thump", 0.8); q(103.25, "shimmer", 0.5);
// outro
q(104.4, "pop", 0.6, 1); q(104.45, "shimmer", 0.4); q(105.2, "whoosh", 0.35, true); q(105.9, "thump", 0.8); q(106.0, "cash", 0.45); q(106.5, "shimmer", 0.35);

const kinds = {
  whoosh: (a) => whoosh(0.55, !!a),
  pop: (a) => pop(a ? 900 : 700, a ? 340 : 260),
  thump: () => thump(),
  tick: () => tick(),
  clink: (a) => clink(a || 0),
  chime: () => chime(),
  cash: () => cash(),
  riser: (a) => riser(a || 2),
  shimmer: () => shimmer(),
  click: () => click(),
};
cues.forEach((c) => add(c.t, kinds[c.kind](c.arg), c.g * 0.55));

// music bed: slow pad in A minor + soft pulse, faded at both ends, kept low under the voice
const chord = [110, 164.81, 220, 261.63, 329.63];
for (let i = 0; i < out.length; i++) {
  const t = i / SR;
  let v = 0;
  chord.forEach((f, k) => { v += Math.sin(2 * Math.PI * f * t + k) * 0.5 + Math.sin(2 * Math.PI * f * 1.003 * t) * 0.5; });
  const swell = 0.6 + 0.4 * Math.sin(2 * Math.PI * t / 8);
  const fade = Math.min(1, t / 2) * Math.min(1, (TOTAL - t) / 3);
  const beat = (t % 0.6) / 0.6;
  const pulse = Math.sin(2 * Math.PI * 55 * t) * Math.exp(-beat * 9) * 0.5;
  out[i] += (v * 0.012 * swell + pulse * 0.05) * fade;
}
let peak = 0; for (const v of out) peak = Math.max(peak, Math.abs(v));
const norm = peak > 0.9 ? 0.9 / peak : 1;
const pcm = Buffer.alloc(out.length * 2 + 44);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + out.length * 2, 4); pcm.write("WAVEfmt ", 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(out.length * 2, 40);
for (let i = 0; i < out.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, out[i] * norm)) * 32767), 44 + i * 2);
fs.writeFileSync("public/sfx/mix.wav", pcm);
console.log("cues:", cues.length, "peak:", peak.toFixed(2), "norm:", norm.toFixed(2));
