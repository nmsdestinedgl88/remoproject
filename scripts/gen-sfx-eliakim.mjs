// Dull SFX kit for the Eliakim video. No pops: every sound is low-passed (~2.5 kHz),
// attack >= 20 ms, quiet. Writes 16-bit mono WAVs to public/sfx/eliakim-*.wav.
import {mkdirSync, writeFileSync} from 'node:fs';

const out = 'public/sfx';
mkdirSync(out, {recursive: true});
const rate = 44100;

const wav = (samples) => {
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

// deterministic noise so renders are repeatable
let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const gen = (secs, fn) => Array.from({length: Math.floor(secs * rate)}, (_, i) => fn(i / rate, i));
const smooth = (x) => x * x * (3 - 2 * x); // smoothstep
const attack = (t, a) => smooth(Math.min(1, t / a));

// two cascaded one-pole low-pass filters at fc Hz, then peak-normalise to `peak`
const finish = (samples, fc, peak) => {
  const k = 1 - Math.exp((-2 * Math.PI * fc) / rate);
  let a = 0;
  let b = 0;
  const y = samples.map((v) => {
    a += k * (v - a);
    b += k * (a - b);
    return b;
  });
  const m = Math.max(...y.map(Math.abs)) || 1;
  const fadeTail = Math.floor(rate * 0.02);
  return y.map((v, i) => {
    const tail = Math.min(1, (y.length - i) / fadeTail);
    return (v / m) * peak * tail;
  });
};

// whoosh: soft low noise, slow rise and fall
writeFileSync(
  `${out}/eliakim-whoosh.wav`,
  wav(finish(gen(0.55, (t) => rnd() * Math.sin(Math.PI * (t / 0.55)) ** 2 * attack(t, 0.12)), 1800, 0.5)),
);

// tick: mellow wooden tock, 300 Hz with a short decay
writeFileSync(
  `${out}/eliakim-tick.wav`,
  wav(finish(gen(0.12, (t) => Math.sin(2 * Math.PI * 300 * t) * attack(t, 0.02) * Math.exp(-t * 38)), 1200, 0.45)),
);

// thud: low sine, 80 Hz sliding to 48 Hz, slow attack
writeFileSync(
  `${out}/eliakim-thud.wav`,
  wav(
    finish(
      gen(0.7, (t) => Math.sin(2 * Math.PI * (48 + 32 * Math.exp(-t * 9)) * t) * attack(t, 0.025) * Math.exp(-t * 6.5)),
      700,
      0.7,
    ),
  ),
);

// riser: low-passed noise whose brightness and level climb, ends before the cut
{
  let lp = 0;
  writeFileSync(
    `${out}/eliakim-riser.wav`,
    wav(
      finish(
        gen(1.0, (t) => {
          const p = t / 1.0;
          lp += (0.02 + 0.3 * p * p) * (rnd() - lp);
          return lp * smooth(p) * (0.3 + p);
        }),
        2200,
        0.45,
      ),
    ),
  );
}

// chime: soft sine pair (C5 + G5), slow attack, long decay
writeFileSync(
  `${out}/eliakim-chime.wav`,
  wav(
    finish(
      gen(1.6, (t) => {
        const e = attack(t, 0.04) * Math.exp(-t * 2.6);
        return (Math.sin(2 * Math.PI * 523.25 * t) + 0.45 * Math.sin(2 * Math.PI * 783.99 * t)) * e;
      }),
      2000,
      0.45,
    ),
  ),
);

// swell: low pad-like swell for ring bursts
{
  let lp = 0;
  writeFileSync(
    `${out}/eliakim-swell.wav`,
    wav(
      finish(
        gen(1.1, (t) => {
          lp += 0.01 * (rnd() - lp);
          const e = Math.sin(Math.PI * Math.min(1, t / 1.1)) ** 2;
          return (lp * 6 + Math.sin(2 * Math.PI * 110 * t) * 0.6) * e;
        }),
        900,
        0.5,
      ),
    ),
  );
}

console.log('wrote eliakim-*.wav to', out);
