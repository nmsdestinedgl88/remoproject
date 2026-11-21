// Manetrust theme: parchment + ink + one forest-green hero, matching the reference look.
// Fonts, easings and springs are shared with the project theme (which also loads the fonts).
import {theme as base} from '../theme';

export const mt = {
  colors: {
    paper: '#EFE8D4',
    paperAlt: '#E4DCC1',
    ink: '#2F3B2D',
    inkDim: '#6B7865',
    sage: '#9DB394',
    hero: '#0F5A1F', // THE hero: caption pill (+ the 13 counter on the hook)
    heroGlow: 'rgba(15, 90, 31, 0.35)',
    grid: 'rgba(47, 59, 45, 0.07)',
    card: 'rgba(255, 255, 255, 0.38)',
    cardLine: 'rgba(47, 59, 45, 0.28)',
    white: '#FFFFFF',
  },
  fonts: base.fonts,
  ease: base.ease,
  spring: base.spring,
} as const;
