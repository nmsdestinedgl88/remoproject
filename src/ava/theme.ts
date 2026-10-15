// Single source of truth for the Ava film: colours, fonts, easings, type scale.
import {Easing, continueRender, delayRender, staticFile} from 'remotion';

const FONTS: [string, string, string][] = [
  ['Bricolage Grotesque', '700', 'fonts/bricolage-grotesque-latin-700-normal.woff2'],
  ['Bricolage Grotesque', '800', 'fonts/bricolage-grotesque-latin-800-normal.woff2'],
  ['IBM Plex Sans', '400', 'fonts/ibm-plex-sans-latin-400-normal.woff2'],
  ['IBM Plex Sans', '500', 'fonts/ibm-plex-sans-latin-500-normal.woff2'],
  ['IBM Plex Sans', '600', 'fonts/ibm-plex-sans-latin-600-normal.woff2'],
  ['IBM Plex Mono', '400', 'fonts/ibm-plex-mono-latin-400-normal.woff2'],
  ['IBM Plex Mono', '500', 'fonts/ibm-plex-mono-latin-500-normal.woff2'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('ava-fonts');
  Promise.all(
    FONTS.map(([family, weight, file]) =>
      new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight}).load().then((f) => {
        (document.fonts as unknown as {add(f: FontFace): void}).add(f);
      }),
    ),
  )
    .catch((e) => console.error('ava font load failed', e))
    .finally(() => continueRender(handle));
}

export const A = {
  c: {
    bone: '#F3EFE6',
    teal: '#006680',
    ink: '#04222C',
    hot: '#FFD23F', // highlighter: only as a ringed dot/object or a swipe behind ink text
    paper: '#FBFAF6',
    mist: '#D3E4E6',
  },
  f: {
    display: "'Bricolage Grotesque', 'IBM Plex Sans', sans-serif",
    text: "'IBM Plex Sans', Helvetica, Arial, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // expo-out: entrances
    inOut: Easing.bezier(0.65, 0, 0.35, 1), // moves, wipes
    exit: Easing.bezier(0.5, 0, 0.75, 0), // exits
  },
  W: 1080,
  H: 1920,
  M: 72,
  line: 6,
} as const;
