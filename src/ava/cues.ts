// Timings (seconds) measured from the client's recorded take (voiceover.wav, 55.37 s).
// Scene cuts sit in the pauses between sentences; the end card holds silent to 60 s.
export const TOTAL_SECONDS = 60;

export const SCENES = {
  s1: [0, 9.5],
  s2: [9.5, 17.5],
  s3: [17.5, 22.0],
  s4: [22.0, 27.1],
  s5: [27.1, 38.4],
  s6: [38.4, 42.35],
  s7: [42.35, 46.5],
  s8: [46.5, 60],
} as const;

// Foreground wipes (teal block) centred on these cuts.
export const WIPES = [SCENES.s2[0], SCENES.s5[0], SCENES.s8[0]];
export const WIPE_HALF = 0.36;

// Spoken phrases of the real take: [text, start, end]. Silence-detected boundaries.
export const PHRASES: [string, number, number][] = [
  ['Diabetes can slow healing.', 0.22, 2.41],
  ['If you have diabetes and need prostate surgery,', 3.17, 6.48],
  ['ask how big the cut will be.', 6.97, 8.8],
  ['Open surgery needs one long incision.', 9.83, 12.78],
  ['Minimal access surgery needs a few small ones.', 13.6, 17.24],
  ['A camera and fine instruments pass through those openings.', 17.82, 21.62],
  ['For diabetics, smaller incisions mean less wound to heal.', 22.35, 26.6],
  ['Dr. Oto Peters has completed over fifty consecutive successful operations', 27.58, 34.99],
  ['with this procedure and equipment.', 35.71, 38.04],
  ['It is the only one of its kind in Uyo.', 38.74, 42.28],
  ['Book a free consultation,', 42.42, 43.69],
  ['and ask about diabetic pre-surgical screening.', 44.42, 46.24],
  ['Call 0808 888 2788.', 46.72, 49.67],
  ['Ava Consultants and Urology Centre, off 4-Lane, Uyo.', 50.67, 55.37],
];

export const SFX_WHOOSH = WIPES;
