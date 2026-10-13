// Single source of truth for colours, fonts, easings and spring presets.
import {Easing, continueRender, delayRender, staticFile} from 'remotion';

// Fonts are bundled in public/fonts (the render sandbox can't reach Google Fonts).
const FONTS: [string, string, string][] = [
  ['Poppins', '600', 'fonts/poppins-600.woff2'],
  ['Poppins', '800', 'fonts/poppins-800.woff2'],
  ['Inter', '400', 'fonts/inter-400.woff2'],
  ['Inter', '500', 'fonts/inter-500.woff2'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('fonts');
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

export const theme = {
  colors: {
    bg: '#04140D',
    bgAlt: '#082B1C',
    primary: '#F5C542', // hero: gold, max one element per frame
    accent: '#19B36B', // surfaces and bars
    text: '#F4F7F5',
    textDim: '#9DBBAB',
    glow: 'rgba(245, 197, 66, 0.4)',
    surface: 'rgba(255, 255, 255, 0.07)',
    surfaceLine: 'rgba(255, 255, 255, 0.14)',
  },
  fonts: {
    display: 'Poppins, Helvetica, Arial, sans-serif',
    body: 'Inter, Helvetica, Arial, sans-serif',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: {damping: 14, stiffness: 160, mass: 0.6},
    smooth: {damping: 20, stiffness: 90, mass: 1},
    bouncy: {damping: 11, stiffness: 170, mass: 0.7},
  },
} as const;
