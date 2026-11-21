import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {mt} from './theme';

/** Layer 1: parchment + blueprint grid + drifting sage washes. Never flat. */
export const BgPaper: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const d1 = Math.sin(t * 0.5) * 80;
  const d2 = Math.cos(t * 0.4) * 60;
  return (
    <AbsoluteFill style={{background: `linear-gradient(170deg, ${mt.colors.paper}, ${mt.colors.paperAlt})`}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${mt.colors.grid} 1px, transparent 1px), linear-gradient(90deg, ${mt.colors.grid} 1px, transparent 1px)`,
          backgroundSize: '90px 90px',
        }}
      />
      <div style={{position: 'absolute', width: 1400, height: 1400, borderRadius: '50%', top: -600 + d2, left: -500 + d1, filter: 'blur(70px)', background: `radial-gradient(circle, ${mt.colors.sage}55, transparent 62%)`}} />
      <div style={{position: 'absolute', width: 1200, height: 1200, borderRadius: '50%', bottom: -550 - d1, right: -450 + d2, filter: 'blur(80px)', background: `radial-gradient(circle, ${mt.colors.sage}40, transparent 65%)`}} />
    </AbsoluteFill>
  );
};

/** Layer 4: unifies everything into one sage-tinted ink look. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{backgroundColor: mt.colors.sage, mixBlendMode: 'soft-light', opacity: 0.14}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(47,59,45,0.08), transparent 26%, transparent 74%, rgba(47,59,45,0.12))'}} />
  </AbsoluteFill>
);

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{pointerEvents: 'none', backgroundImage: NOISE, backgroundSize: '220px', backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.08, mixBlendMode: 'multiply'}}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 58%, rgba(47,59,45,0.2) 100%)'}} />
);

/** Circular brand watermark, bottom-right. PLACEHOLDER mark until the real logo is supplied. */
export const Watermark: React.FC = () => (
  <div
    style={{
      position: 'absolute', right: 64, top: 1660, width: 84, height: 84, borderRadius: '50%',
      background: mt.colors.hero, color: mt.colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: mt.fonts.display, fontWeight: 800, fontSize: 30, letterSpacing: '-0.02em',
    }}
  >
    mt
  </div>
);
