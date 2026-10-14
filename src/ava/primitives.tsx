import React from 'react';
import {C, FONT, Layout} from './tokens';

/** Left-to-right mask reveal with a small slide: entrance = mask + translate (no lone fade). */
export const Reveal: React.FC<{p: number; dx?: number; fromLeft?: number; children: React.ReactNode}> = ({p, dx = 18, fromLeft = 0, children}) => {
  if (p <= 0.001) return null;
  return (
    <g style={{clipPath: `inset(-14px ${(1 - p) * 100}% -14px ${fromLeft * 100 - 0}%)`, transform: `translateX(${-dx * (1 - p)}px)`}}>
      {children}
    </g>
  );
};

/** Mask-out that wipes content away from the left edge (exit). */
export const WipeOut: React.FC<{p: number; toLeft?: boolean; children: React.ReactNode}> = ({p, toLeft, children}) => {
  if (p >= 0.999) return null;
  const clip = toLeft ? `inset(-14px ${p * 100}% -14px -14px)` : `inset(-14px -14px -14px ${p * 100}%)`;
  return <g style={{clipPath: clip}}>{children}</g>;
};

/** Path that draws on via dashoffset; pathLength normalised to 1. */
export const DrawPath: React.FC<{d: string; p: number; w?: number; c?: string; opacity?: number}> = ({d, p, w = 3, c = C.ink, opacity = 1}) => {
  if (p <= 0.001) return null;
  return (
    <path d={d} pathLength={1} fill="none" stroke={c} strokeWidth={w} strokeDasharray="1 1" strokeDashoffset={1 - p}
      strokeLinecap="butt" strokeLinejoin="miter" opacity={opacity} />
  );
};

export const Seg: React.FC<{x1: number; y1: number; x2: number; y2: number; p?: number; w?: number; c?: string; opacity?: number}> = ({x1, y1, x2, y2, p = 1, w = 3, c = C.ink, opacity = 1}) => {
  if (p <= 0.001) return null;
  return <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={c} strokeWidth={w} opacity={opacity} />;
};

export const T: React.FC<{x: number; y: number; size: number; weight?: number; c?: string; family?: string; anchor?: 'start' | 'middle' | 'end'; children: React.ReactNode}> = ({x, y, size, weight = 700, c = C.ink, family = FONT.body, anchor = 'start', children}) => (
  <text x={x} y={y} fontSize={size} fontWeight={weight} fill={c} textAnchor={anchor} style={{fontFamily: family, fontKerning: 'normal'}}>
    {children}
  </text>
);

/** 1 px registration grid: ticks at column edges, 20% ink. Static. */
export const RegGrid: React.FC<{L: Layout}> = ({L}) => {
  const y0 = L.L ? 56 : 112;
  const xs: number[] = [];
  for (let i = 1; i <= L.cols; i++) xs.push(L.colX(i), L.colR(i));
  return (
    <g stroke={C.ink} strokeWidth={1} opacity={0.2}>
      {xs.map((x, i) => <line key={i} x1={x + 0.5} y1={y0} x2={x + 0.5} y2={y0 + 14} />)}
    </g>
  );
};
