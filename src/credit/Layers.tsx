import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const d1 = Math.sin(t * 0.55) * 90;
  const d2 = Math.cos(t * 0.42) * 70;
  return (
    <AbsoluteFill style={{background: `linear-gradient(170deg, ${theme.colors.bg}, ${theme.colors.bgAlt})`}}>
      <div
        style={{
          position: 'absolute',
          width: 1500,
          height: 1500,
          borderRadius: '50%',
          top: -600 + d2,
          left: -500 + d1,
          filter: 'blur(60px)',
          background: `radial-gradient(circle, ${theme.colors.accent}44, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 1300,
          borderRadius: '50%',
          bottom: -600 - d1,
          right: -500 + d2,
          filter: 'blur(80px)',
          background: `radial-gradient(circle, ${theme.colors.primary}22, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{backgroundColor: theme.colors.accent, mixBlendMode: 'soft-light', opacity: 0.2}} />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.12), transparent 28%, transparent 72%, rgba(0,0,0,0.22))',
      }}
    />
  </AbsoluteFill>
);

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: NOISE,
        backgroundSize: '220px',
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.06,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,0.35) 100%)',
    }}
  />
);
