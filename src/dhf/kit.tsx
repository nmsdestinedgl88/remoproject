// DHF "Poured Ledger" kit for Remotion. Pure functions of the clip-relative frame `g` (frame - HANDLE).
import React from 'react';
import {AbsoluteFill, Img, Easing, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
// @ts-ignore shared classic-script icon library
import ICONS from '../../video/dhf/shared/icons.js';

export const HANDLE = 0; // all cuts sit in VO pauses; no transition handles
export const FPS = 30;
export const P = ICONS.P as Record<string, string>;
export const FONT_D = "'Archivo', Impact, sans-serif";
export const FONT_M = "'IBM Plex Mono', monospace";

const FACES: [string, string, string, string?][] = [
  ['Archivo', '900', 'dhf/fonts/archivo-900.woff2'],
  ['Archivo', '900', 'dhf/fonts/archivo-ext-900.woff2', 'U+20A0-20AB'],
  ['IBM Plex Mono', '600', 'dhf/fonts/plexmono-600.woff2'],
  ['IBM Plex Mono', '600', 'dhf/fonts/plexmono-ext-600.woff2', 'U+20A0-20AB'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('dhf-fonts');
  Promise.all(
    FACES.map(([fam, w, file, ur]) =>
      new FontFace(fam, `url(${staticFile(file)}) format('woff2')`, {weight: w, ...(ur ? {unicodeRange: ur} : {})})
        .load()
        .then((f) => (document.fonts as any).add(f)),
    ),
  )
    .catch((e) => console.error('font load failed', e))
    .finally(() => continueRender(h));
}

export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};
export const SPR = {
  stamp: {damping: 16, stiffness: 260, mass: 0.5},
  playful: {damping: 11, stiffness: 170, mass: 0.7},
  smooth: {damping: 20, stiffness: 90, mass: 1},
};
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const A = (sec: number) => sec * FPS; // seconds -> film frames
/** Clamped eased ramp between frames a..b, value v0..v1. */
export const ramp = (f: number, a: number, b: number, v0 = 0, v1 = 1, easing: (t: number) => number = E.out) =>
  interpolate(f, [a, b], [v0, v1], {easing, ...CL});
/** Spring 0..1 that starts at frame `at` (0 before). */
export const sp = (f: number, at: number, config = SPR.smooth) => (f < at ? 0 : spring({frame: f - at, fps: FPS, config}));

/** Mount a shot only inside its window (+ roll frames), pass shot-relative frame. */
export const Shot: React.FC<{g: number; from: number; to: number; pre?: number; post?: number; children: (f: number) => React.ReactNode}> = ({
  g, from, to, pre = 0, post = 0, children,
}) => (g < from - pre || g >= to + post ? null : <AbsoluteFill>{children(g - from)}</AbsoluteFill>);

export const useG = () => useCurrentFrame() - HANDLE;

/** Crumpled-paper ground tinted to the Manetrust lilac (#E9E2E9). */
export const Ground: React.FC<{dark?: number}> = ({dark = 0}) => (
  <AbsoluteFill style={{background: P.paper}}>
    <Img src={staticFile('dhf/paper.jpg')} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, mixBlendMode: 'multiply', opacity: 0.72}} />
    <AbsoluteFill style={{background: P.ink, opacity: dark}} />
  </AbsoluteFill>
);

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;
export const Finish: React.FC<{g: number}> = ({g}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill
      style={{backgroundImage: NOISE, backgroundSize: '220px', backgroundPosition: `${(g * 7) % 220}px ${(g * 13) % 220}px`, opacity: 0.06, mixBlendMode: 'multiply'}}
    />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 62%, rgba(51,51,51,0.12) 100%)'}} />
  </AbsoluteFill>
);

/** Icon centred on (x,y) with box `size`. */
export const Icon: React.FC<{name: string; x: number; y: number; size?: number; a?: string; b?: string; rot?: number; scale?: number; opacity?: number; flip?: boolean; style?: React.CSSProperties}> = ({
  name, x, y, size = 160, a, b, rot = 0, scale = 1, opacity = 1, flip, style,
}) => (
  <div
    style={{
      position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, opacity,
      transform: `rotate(${rot}deg) scale(${flip ? -scale : scale}, ${scale})`, ...style,
    }}
    dangerouslySetInnerHTML={{__html: ICONS.svg(name, size, a, b)}}
  />
);

/** Stamped mono chip with a hard offset shadow. */
export const Chip: React.FC<{text: string; x: number; y: number; bg?: string; fg?: string; size?: number; f?: number; at?: number; rot?: number; align?: 'center' | 'left'; font?: string}> = ({
  text, x, y, bg = P.ink, fg = P.paper, size = 48, f = 999, at = 0, rot = 0, align = 'center', font = FONT_M,
}) => {
  const p = sp(f, at, SPR.stamp);
  const sc = interpolate(p, [0, 1], [1.18, 1]);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, transform: `translate(${align === 'center' ? '-50%' : '0'}, -50%) rotate(${rot}deg) scale(${sc})`,
        opacity: Math.min(1, p * 3), background: bg, color: fg, fontFamily: font, fontWeight: 600, fontSize: size,
        letterSpacing: '0.02em', padding: `${size * 0.22}px ${size * 0.42}px`, border: `4px solid ${P.ink}`, boxShadow: `7px 7px 0 ${P.ink}`,
        whiteSpace: 'pre', textAlign: 'center', lineHeight: 1.05,
      }}
    >
      {text}
    </div>
  );
};

/** Big display text block. */
export const Display: React.FC<{lines: string[]; x: number; y: number; size?: number; color?: string; f?: number; at?: number; align?: 'center' | 'left'; stagger?: number}> = ({
  lines, x, y, size = 96, color = P.ink, f = 999, at = 0, align = 'center', stagger = 4,
}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: align === 'center' ? 'translateX(-50%)' : undefined, textAlign: align, fontFamily: FONT_D, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: '-0.01em', color, whiteSpace: 'nowrap'}}>
    {lines.map((l, i) => {
      const p = ramp(f, at + i * stagger, at + i * stagger + 20);
      return <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>{l}</div>;
    })}
  </div>
);

/** Typewriter: returns the visible slice. */
export const typed = (text: string, f: number, at: number, cps = 22) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((f - at) / FPS) * cps))));

// ---- isometric helpers -------------------------------------------------
export const IC = 0.8660254;
export const IS = 0.5;
export type V3 = [number, number, number];
export const mkIso = (u: number) => (x: number, y: number, z: number): [number, number] => [(x - y) * IC * u, (x + y) * IS * u - z * u];

export const Cuboid: React.FC<{u: number; x: number; y: number; z: number; w: number; d: number; h: number; top?: string; left?: string; right?: string; stroke?: number; opacity?: number; dash?: boolean; extra?: React.ReactNode}> = ({
  u, x, y, z, w, d, h, top = P.top, left = P.left, right = P.right, stroke = 4, opacity = 1, dash, extra,
}) => {
  const I = mkIso(u);
  const pts = (a: V3[]) => a.map((p) => I(...p).join(',')).join(' ');
  const props = {stroke: P.ink, strokeWidth: stroke, strokeLinejoin: 'round' as const, strokeDasharray: dash ? '10 8' : undefined};
  return (
    <g opacity={opacity}>
      <polygon points={pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={dash ? 'none' : left} {...props} />
      <polygon points={pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} fill={dash ? 'none' : right} {...props} />
      <polygon points={pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={dash ? 'none' : top} {...props} />
      {extra}
    </g>
  );
};

/** Gauge in local px, y down. value 0..100, needle sweeps 240deg. */
export const Gauge: React.FC<{r: number; value: number; label?: string; ticks?: boolean}> = ({r, value, ticks = true}) => {
  const a0 = -210, sweep = 240;
  const ang = a0 + (value / 100) * sweep;
  const pt = (deg: number, rad: number): [number, number] => [Math.cos((deg * Math.PI) / 180) * rad, Math.sin((deg * Math.PI) / 180) * rad];
  const arc = (v0: number, v1: number, rad: number) => {
    const [x0, y0] = pt(a0 + (v0 / 100) * sweep, rad), [x1, y1] = pt(a0 + (v1 / 100) * sweep, rad);
    return `M${x0},${y0} A${rad},${rad} 0 ${(v1 - v0) / 100 * sweep > 180 ? 1 : 0} 1 ${x1},${y1}`;
  };
  return (
    <g>
      <circle r={r} fill={P.paper} stroke={P.ink} strokeWidth={r * 0.07} />
      <path d={arc(0, 50, r * 0.78)} stroke={P.red} strokeWidth={r * 0.13} fill="none" />
      <path d={arc(50, 80, r * 0.78)} stroke="#8C808C" strokeWidth={r * 0.13} fill="none" />
      <path d={arc(80, 100, r * 0.78)} stroke={P.green} strokeWidth={r * 0.13} fill="none" />
      {ticks && Array.from({length: 11}).map((_, i) => {
        const [x0, y0] = pt(a0 + (i / 10) * sweep, r * 0.88), [x1, y1] = pt(a0 + (i / 10) * sweep, r * 0.96);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={P.ink} strokeWidth={r * 0.035} />;
      })}
      <g transform={`rotate(${ang})`}>
        <polygon points={`${r * 0.74},0 0,${-r * 0.06} ${-r * 0.14},0 0,${r * 0.06}`} fill={P.ink} />
      </g>
      <circle r={r * 0.1} fill={P.ink} />
    </g>
  );
};

export const Root: React.FC<{children: React.ReactNode; g: number; dark?: number}> = ({children, g, dark}) => (
  <AbsoluteFill>
    <Ground dark={dark} />
    {children}
    <Finish g={g} />
  </AbsoluteFill>
);
export {ICONS};
