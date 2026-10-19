// Manetrust weekly series: colours, fonts, easings, springs. Single source of truth.
import {Easing, continueRender, delayRender, staticFile} from 'remotion';

const FONTS: [string, string, string][] = [
  ['Anton', '400', 'fonts/anton-400.woff2'],
  ['Inter', '400', 'fonts/inter-400.woff2'],
  ['Inter', '500', 'fonts/inter-500.woff2'],
  ['JBMono', '700', 'fonts/jbmono-700.woff2'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('mane-fonts');
  Promise.all(
    FONTS.map(([family, weight, file]) =>
      new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight}).load().then((f) => {
        (document.fonts as unknown as {add(f: FontFace): void}).add(f);
      }),
    ),
  )
    .catch((e) => console.error('font load failed', e))
    .finally(() => continueRender(handle));
}

export const mt = {
  c: {
    ink: '#333333', // facts, costs, line art
    hot: '#800080', // the money, the key number, the offer
    bg: '#E9E2E9',
    white: '#FFFFFF',
    mute: 'rgba(51,51,51,0.62)',
    card: 'rgba(255,255,255,0.78)',
    line: 'rgba(51,51,51,0.16)',
  },
  f: {
    head: 'Anton, Impact, sans-serif',
    body: 'Inter, Helvetica, Arial, sans-serif',
    mono: 'JBMono, monospace',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    smooth: {damping: 20, stiffness: 90, mass: 1},
    snappy: {damping: 15, stiffness: 170, mass: 0.6},
    pop: {damping: 11, stiffness: 190, mass: 0.6},
  },
} as const;

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
