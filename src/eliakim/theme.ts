// Eliakim oil palm video: single source of truth for colours, fonts, easing and springs.
import {Easing, continueRender, delayRender, staticFile} from 'remotion';

// Fonts are bundled in public/fonts (the render sandbox can't reach Google Fonts).
// The "-ext" files carry the naira sign and are used as fallbacks.
const FONTS: [string, string, string, string][] = [
  ['Archivo', '800', 'normal', 'fonts/archivo-latin-800-normal.woff2'],
  ['ArchivoExt', '800', 'normal', 'fonts/archivo-latin-ext-800-normal.woff2'],
  ['Anton', '400', 'normal', 'fonts/anton-latin-400-normal.woff2'],
  ['Playfair', '400', 'italic', 'fonts/playfair-display-latin-400-italic.woff2'],
  ['Playfair', '600', 'italic', 'fonts/playfair-display-latin-600-italic.woff2'],
  ['Inter', '500', 'normal', 'fonts/inter-latin-500-normal.woff2'],
  ['Inter', '600', 'normal', 'fonts/inter-latin-600-normal.woff2'],
  ['InterExt', '500', 'normal', 'fonts/inter-latin-ext-500-normal.woff2'],
  ['InterExt', '600', 'normal', 'fonts/inter-latin-ext-600-normal.woff2'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('eliakim-fonts');
  Promise.all(
    FONTS.map(([family, weight, style, file]) =>
      new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight, style}).load().then((f) => {
        (document.fonts as unknown as {add(f: FontFace): void}).add(f);
      }),
    ),
  )
    .catch((e) => console.error('font load failed', e))
    .finally(() => continueRender(handle));
}

export type Bg = 'white' | 'navy' | 'grey' | 'gold';

export const colors = {
  navy: '#1B1465',
  gold: '#E1B029',
  white: '#FAFAF8',
  pureWhite: '#FFFFFF',
  grey: '#8A8F98',
  navyDeep: '#0E0A3A',
} as const;

/** Per-background colour roles. Rules come from the contrast check:
 *  gold text only on navy; on white and grey gold is a bar or fill, never text. */
export const tone = (bg: Bg) => {
  switch (bg) {
    case 'white':
      return {bg: colors.white, ink: colors.navy, accent: colors.navy, bar: colors.gold, barInk: colors.navy, dim: '#4B4784'};
    case 'navy':
      return {bg: colors.navy, ink: colors.pureWhite, accent: colors.gold, bar: colors.gold, barInk: colors.navy, dim: '#C9C7EE'};
    case 'grey':
      return {bg: colors.grey, ink: colors.navy, accent: colors.pureWhite, bar: colors.pureWhite, barInk: colors.navy, dim: colors.navy};
    case 'gold':
      return {bg: colors.gold, ink: colors.navy, accent: colors.navy, bar: colors.pureWhite, barInk: colors.navy, dim: colors.navy};
  }
};

export const fonts = {
  display: 'Archivo, ArchivoExt, Inter, InterExt, Helvetica, Arial, sans-serif',
  caps: 'Anton, Archivo, Impact, sans-serif',
  serif: 'Playfair, Georgia, serif',
  body: 'Inter, InterExt, Helvetica, Arial, sans-serif',
};

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

// Corporate personality: critically damped, no overshoot.
export const spring = {
  smooth: {damping: 30, stiffness: 120, mass: 0.9},
  snappy: {damping: 28, stiffness: 210, mass: 0.7},
  slow: {damping: 34, stiffness: 70, mass: 1},
};
