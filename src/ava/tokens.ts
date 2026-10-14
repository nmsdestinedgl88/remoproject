import {Easing, interpolate} from 'remotion';
import {measureText} from '@remotion/layout-utils';

export const C = {bone: '#EFE7D8', green: '#234A40', iodine: '#E4701E', ink: '#16201C', paper: '#FBF8F1'} as const;
export const FONT = {head: 'Merriweather', body: '"Atkinson Hyperlegible"'} as const;

export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  io: Easing.bezier(0.37, 0, 0.63, 1),
  draw: Easing.bezier(0.65, 0, 0.35, 1),
};

/** eased 0..1 progress starting at `start` and lasting `dur` frames */
export const prog = (f: number, start: number, dur: number, ease: (t: number) => number = E.out) =>
  interpolate(f, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const textW = (text: string, size: number, weight: number, family: string = FONT.body) =>
  measureText({text, fontFamily: family.replace(/"/g, ''), fontSize: size, fontWeight: String(weight)}).width;

export type Orient = 'landscape' | 'portrait';

export const getLayout = (o: Orient) => {
  const L = o === 'landscape';
  const W = L ? 1920 : 1080;
  const H = L ? 1080 : 1920;
  const mx = L ? 156 : 72;
  const cols = L ? 12 : 6;
  const col = L ? 112 : 136;
  const gut = 24;
  const colX = (i: number) => mx + (i - 1) * (col + gut); // left edge of column i (1-based)
  const colR = (i: number) => colX(i) + col; // right edge of column i
  const safe = L ? 96 : 72;
  return {
    o, L, W, H, mx, cols, col, gut, colX, colR, safe,
    zone: L ? {top: 96, bottom: 860} : {top: 160, bottom: 1440},
    cap: L ? {y: 888, h: 120} : {y: 1500, h: 240},
    sz: {title: L ? 112 : 88, statement: L ? 72 : 60, label: L ? 36 : 32, small: 32, caption: 44, phone: 128, row: L ? 56 : 52, s6title: L ? 96 : 80},
    plate: L
      ? {x0: 290, x1: 1764, labelX: 156, cx: 1032, incX0: 582, incX1: 1482, skinY: 468, skinH: 24, fatEnd: 590, musEnd: 680,
         organ: {cx: 1032, cy: 788, a: 210, b: 62}, clipTop: 96, clipBot: 860, headY: 210, tickLen: 64, labelOff: 40, ghostOff: 90}
      : {x0: 216, x1: 1008, labelX: 72, cx: 612, incX0: 352, incX1: 872, skinY: 700, skinH: 22, fatEnd: 840, musEnd: 950,
         organ: {cx: 612, cy: 1240, a: 170, b: 88}, clipTop: 160, clipBot: 1440, headY: 250, tickLen: 64, labelOff: 40, ghostOff: 90},
  };
};
export type Layout = ReturnType<typeof getLayout>;
