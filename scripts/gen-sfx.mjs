// Synthesises a small SFX kit + music bed as 16-bit mono WAVs. No downloads.
import {mkdirSync, writeFileSync} from 'node:fs';

const out = 'public/sfx';
mkdirSync(out, {recursive: true});

const wav = (samples, rate) => {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((v, i) => buf.writeInt16LE(Math.max(-1, Math.min(1, v)) * 32767, 44 + i * 2));
  return buf;
};

const gen = (secs, rate, fn) => Array.from({length: Math.floor(secs * rate)}, (_, i) => fn(i / rate, i));
const rate = 44100;

// whoosh: low-passed noise burst with a rising then falling envelope
let lp = 0;
writeFileSync(
  `${out}/whoosh.wav`,
  wav(
    gen(0.7, rate, (t) => {
      const env = Math.sin(Math.PI * Math.min(1, t / 0.7)) ** 2;
      const k = 0.05 + 0.35 * (t / 0.7);
      lp += k * (Math.random() * 2 - 1 - lp);
      return lp * env * 1.6;
    }),
    rate,
  ),
);

// pop: pitch-dropping sine
writeFileSync(
  `${out}/pop.wav`,
  wav(
    gen(0.18, rate, (t) => {
      const f = 520 - 380 * (t / 0.18);
      return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 22) * 0.9;
    }),
    rate,
  ),
);

// thump: sub kick
writeFileSync(
  `${out}/thump.wav`,
  wav(
    gen(0.6, rate, (t) => {
      const f = 90 * Math.exp(-t * 7) + 38;
      return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 6) * 1.0;
    }),
    rate,
  ),
);

// tick: short click
writeFileSync(
  `${out}/tick.wav`,
  wav(gen(0.05, rate, (t) => Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 90) * 0.8), rate),
);

// pad: 60s detuned-sine chord (A minor 9-ish) with slow tremolo, 22.05kHz to keep it small
const prate = 22050;
const notes = [110, 164.81, 220, 261.63, 329.63];
writeFileSync(
  `${out}/pad.wav`,
  wav(
    gen(60, prate, (t) => {
      let v = 0;
      notes.forEach((f, i) => {
        v += Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * 1.004 * t + i);
      });
      const trem = 0.75 + 0.25 * Math.sin(2 * Math.PI * 0.12 * t);
      const fade = Math.min(1, t / 2, (60 - t) / 3);
      return (v / (notes.length * 2)) * trem * fade * 0.8;
    }),
    prate,
  ),
);
console.log('sfx written');
