// Manetrust brand theme for the "Pitched, rejected, funded" series.
import {Easing, continueRender, delayRender, staticFile} from 'remotion';

const FONTS: [string, string, string][] = [
  ['Anton', '400', 'fonts/anton-400.woff2'],
  ['Inter', '400', 'fonts/inter-400.woff2'],
  ['Inter', '500', 'fonts/inter-500.woff2'],
  ['JetBrains Mono', '500', 'fonts/jbmono-500.woff2'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('pitch-fonts');
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

export const brand = {
  ink: '#333333',
  hot: '#800080',
  bg: '#E9E2E9',
  white: '#FFFFFF',
};

/** Card shades: the paper photo sits under a tint layer. `dark` flips text to white. */
export type Shade = {tint: string; opacity: number; blend: 'multiply' | 'normal'; dark: boolean; paper: number};
export const SHADES: Shade[] = [
  {tint: brand.bg, opacity: 0.55, blend: 'multiply', dark: false, paper: 1},
  {tint: brand.ink, opacity: 1, blend: 'multiply', dark: true, paper: 1},
  {tint: '#F6F2F6', opacity: 0.35, blend: 'normal', dark: false, paper: 1},
  {tint: brand.hot, opacity: 1, blend: 'multiply', dark: true, paper: 1},
  {tint: '#D9C8D9', opacity: 0.7, blend: 'multiply', dark: false, paper: 1},
];

export const theme = {
  fonts: {
    display: 'Anton, Impact, sans-serif',
    body: 'Inter, Helvetica, Arial, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: {damping: 14, stiffness: 160, mass: 0.6},
    smooth: {damping: 20, stiffness: 90, mass: 1},
    bouncy: {damping: 11, stiffness: 170, mass: 0.7},
  },
  /** Seconds each card stays fully readable is its `hold`; this overlaps the next card's entrance. */
  exitSec: 0.35,
} as const;
