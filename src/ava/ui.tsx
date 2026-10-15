import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {A} from './theme';
import {ICON_SPRITE} from './sprite';
import {PHRASES, WIPES, WIPE_HALF} from './cues';

// ---------------------------------------------------------------- time
const FromCtx = createContext(0);

/** A scene: a Sequence that also exposes absolute film time to its children (see useT). */
export const Scene: React.FC<{range: readonly [number, number]; children: React.ReactNode}> = ({range, children}) => {
  const {fps} = useVideoConfig();
  const from = Math.round(range[0] * fps);
  const to = Math.round(range[1] * fps);
  return (
    <Sequence from={from} durationInFrames={to - from}>
      <FromCtx.Provider value={from}>{children}</FromCtx.Provider>
    </Sequence>
  );
};

/** Absolute film time in seconds, whatever Sequence we are inside. */
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (f + useContext(FromCtx)) / fps;
};

/** 0..1 progress of an eased move that starts at `a` seconds and lasts `d` seconds. */
export const prog = (t: number, a: number, d: number, easing: (x: number) => number = A.ease.out) =>
  interpolate(t, [a, a + d], [0, 1], {easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ---------------------------------------------------------------- background and grain
export const IconSprite: React.FC = () => (
  <div
    style={{position: 'absolute', width: 0, height: 0, overflow: 'hidden'}}
    dangerouslySetInnerHTML={{
      __html: ICON_SPRITE.replace(
        '</style>',
        '.mark{opacity:var(--mark,1);stroke-dasharray:none;stroke-dashoffset:0}</style>',
      ),
    }}
  />
);

export const Bg: React.FC = () => (
  <AbsoluteFill style={{background: A.c.bone}}>
    <svg width={A.W} height={A.H} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 13}, (_, i) => (
        <line key={i} x1={A.M + i * 78} x2={A.M + i * 78} y1={0} y2={A.H} stroke={A.c.ink} strokeOpacity={0.07} strokeWidth={1.5} />
      ))}
    </svg>
  </AbsoluteFill>
);

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.1 -0.1'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Fine, static, matte grain over everything (paper and film). */
export const Grain: React.FC = () => (
  <AbsoluteFill style={{backgroundImage: NOISE, backgroundSize: '320px 320px', mixBlendMode: 'multiply', opacity: 0.1, pointerEvents: 'none'}} />
);

// ---------------------------------------------------------------- motion primitives
export const Rise: React.FC<{
  at: number;
  out?: number;
  dy?: number;
  dx?: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, out, dy = 24, dx = 0, dur = 0.5, style, children}) => {
  const t = useT();
  const p = prog(t, at, dur);
  const q = out === undefined ? 0 : prog(t, out, 0.2, A.ease.exit);
  if (p <= 0 || q >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        opacity: p * (1 - q),
        transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy - q * 12}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Line icon that draws on, then drops its yellow mark. */
export const Icon: React.FC<{name: string; size: number; at: number; dur?: number; style?: React.CSSProperties}> = ({
  name,
  size,
  at,
  dur = 0.6,
  style,
}) => {
  const t = useT();
  const p = prog(t, at, dur);
  const m = prog(t, at + dur, 0.2);
  if (p <= 0) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" style={{position: 'absolute', overflow: 'visible', ...style}}>
      <use
        href={`#ic-${name}`}
        style={{strokeDasharray: '1 2', strokeDashoffset: 1 - p, ['--mark' as string]: m}}
      />
    </svg>
  );
};

export const Headline: React.FC<{
  at: number;
  out?: number;
  x?: number;
  y: number;
  size: number;
  color?: string;
  w?: number;
  children: React.ReactNode;
}> = ({at, out, x = A.M, y, size, color = A.c.teal, w = A.W - 2 * A.M, children}) => (
  <Rise at={at} out={out} style={{left: x, top: y, width: w}}>
    <div style={{fontFamily: A.f.display, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: '-0.015em', color, textTransform: 'uppercase'}}>
      {children}
    </div>
  </Rise>
);

/** Highlighter swipe behind ink text. */
export const Swipe: React.FC<{at: number; dur?: number; children: React.ReactNode}> = ({at, dur = 0.55, children}) => {
  const t = useT();
  const p = prog(t, at, dur, A.ease.inOut);
  return (
    <span
      style={{
        color: p > 0 ? A.c.ink : 'inherit',
        background: `linear-gradient(${A.c.hot}, ${A.c.hot}) no-repeat left center / ${p * 100}% 100%`,
        padding: '0 0.06em',
        margin: '0 -0.06em',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      }}
    >
      {children}
    </span>
  );
};

export const Chip: React.FC<{at: number; out?: number; x: number; y: number; text: string; icon?: string}> = ({at, out, x, y, text, icon}) => (
  <Rise at={at} out={out} dx={-40} dy={0} dur={0.45} style={{left: x, top: y}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, background: A.c.mist, padding: icon ? '12px 26px 12px 16px' : '14px 26px', fontFamily: A.f.mono, fontWeight: 500, fontSize: 28, letterSpacing: '0.08em', color: A.c.ink, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
      {icon && <div style={{width: 48, height: 48, position: 'relative'}}><Icon name={icon} size={48} at={at + 0.15} dur={0.4} /></div>}
      {text}
    </div>
  </Rise>
);

/** Spec-sheet label strip, y 190-250. */
export const Strip: React.FC<{n: string; label: string; at: number; overlay?: boolean}> = ({n, label, at, overlay}) => {
  const t = useT();
  const p = prog(t, at, 0.5);
  return (
    <div style={{position: 'absolute', left: A.M, top: 190, width: A.W - 2 * A.M, height: 60, opacity: p}}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 16,
          height: 60,
          padding: overlay ? '0 22px 0 18px' : 0,
          background: overlay ? A.c.paper : 'transparent',
          fontFamily: A.f.mono,
          fontWeight: 500,
          fontSize: 28,
          letterSpacing: '0.1em',
          color: A.c.ink,
          transform: `translateX(${(1 - p) * -24}px)`,
        }}
      >
        <span style={{width: 20, height: 20, background: A.c.teal}} />
        {n}
        <span style={{opacity: 0.35}}>/</span>
        {label}
      </div>
      {!overlay && (
        <>
          <div style={{position: 'absolute', right: 0, top: 0, height: 60, display: 'flex', alignItems: 'center', fontFamily: A.f.mono, fontSize: 24, letterSpacing: '0.1em', color: A.c.ink, opacity: 0.55}}>
            AVA · MAS
          </div>
          <div style={{position: 'absolute', left: 0, bottom: 0, height: 2, width: `${p * 100}%`, background: A.c.ink, opacity: 0.35}} />
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- photo plate
export const Plate: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  src: string;
  at: number;
  kb: [number, number, number, number]; // [t0, t1, scaleFrom, scaleTo]
  pos?: string;
  children?: React.ReactNode;
}> = ({x, y, w, h, src, at, kb, pos = '50% 50%', children}) => {
  const t = useT();
  const p = prog(t, at, 0.55, A.ease.inOut);
  const k = interpolate(t, [kb[0], kb[1]], [kb[2], kb[3]], {easing: A.ease.inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const mark = (s: React.CSSProperties): React.CSSProperties => ({position: 'absolute', width: 30, height: 30, borderColor: A.c.ink, borderStyle: 'solid', borderWidth: 0, opacity: p, ...s});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <div style={{position: 'absolute', inset: 0, border: `3px solid ${A.c.ink}`, boxSizing: 'border-box', overflow: 'hidden', background: A.c.mist, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${k})`, transformOrigin: '50% 50%'}} />
      </div>
      <div style={mark({left: -16, top: -16, borderTopWidth: 3, borderLeftWidth: 3})} />
      <div style={mark({right: -16, top: -16, borderTopWidth: 3, borderRightWidth: 3})} />
      <div style={mark({left: -16, bottom: -16, borderBottomWidth: 3, borderLeftWidth: 3})} />
      <div style={mark({right: -16, bottom: -16, borderBottomWidth: 3, borderRightWidth: 3})} />
      {children}
    </div>
  );
};

/** Hairline callout with a dot terminal. Coordinates are canvas pixels. */
export const Callout: React.FC<{at: number; dot: [number, number]; to: [number, number]}> = ({at, dot, to}) => {
  const t = useT();
  const p = prog(t, at, 0.5, A.ease.inOut);
  const d = prog(t, at, 0.25);
  const len = Math.hypot(to[0] - dot[0], to[1] - dot[1]);
  return (
    <svg width={A.W} height={A.H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <line x1={dot[0]} y1={dot[1]} x2={to[0]} y2={to[1]} stroke={A.c.ink} strokeWidth={3} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      <circle cx={dot[0]} cy={dot[1]} r={14 * (0.6 + 0.4 * d)} fill={A.c.hot} stroke={A.c.ink} strokeWidth={3.5} opacity={d} />
    </svg>
  );
};

// ---------------------------------------------------------------- wipes
/** Teal foreground block sweeping left to right, with the dot riding its leading edge. */
export const Wipes: React.FC = () => {
  const t = useT();
  const w = WIPES.find((c) => t >= c - WIPE_HALF && t <= c + WIPE_HALF);
  if (w === undefined) return null;
  const inP = prog(t, w - WIPE_HALF, WIPE_HALF, A.ease.inOut);
  const outP = prog(t, w, WIPE_HALF, A.ease.inOut);
  const covering = t < w;
  const edge = covering ? inP * A.W : outP * A.W;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: A.c.teal, clipPath: covering ? `inset(0 ${(1 - inP) * 100}% 0 0)` : `inset(0 0 0 ${outP * 100}%)`}} />
      <div style={{position: 'absolute', left: edge - 22, top: 960 - 22, width: 44, height: 44, borderRadius: '50%', background: A.c.hot}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- captions (highlight style)
const syl = (w: string) => Math.max(1, (w.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiouy]+/g) || []).length - (/[^aeiou]e$/.test(w.toLowerCase().replace(/[^a-z]/g, '')) ? 1 : 0));

type Word = {w: string; a: number; b: number};
const CHUNKS: {words: Word[]; a: number; b: number}[] = (() => {
  const out: {words: Word[]; a: number; b: number}[] = [];
  for (const [text, s, e] of PHRASES) {
    const toks = text.split(' ');
    const total = toks.reduce((n, w) => n + syl(w), 0);
    let cur = s;
    const words: Word[] = toks.map((w) => {
      const d = ((e - s) * syl(w)) / total;
      const o = {w, a: cur, b: cur + d};
      cur += d;
      return o;
    });
    let line: Word[] = [];
    let chars = 0;
    const flush = () => {
      if (line.length) out.push({words: line, a: line[0].a, b: line[line.length - 1].b});
      line = [];
      chars = 0;
    };
    for (const wd of words) {
      if (chars + wd.w.length > 40 && line.length) flush();
      line.push(wd);
      chars += wd.w.length + 1;
    }
    flush();
  }
  return out;
})();

export const Captions: React.FC = () => {
  const t = useT();
  const ch = CHUNKS.find((c) => t >= c.a - 0.04 && t <= c.b + 0.25);
  if (!ch) return null;
  return (
    <div style={{position: 'absolute', left: A.M, top: 1600, width: A.W - 2 * A.M, fontFamily: A.f.text, fontWeight: 600, fontSize: 46, lineHeight: 1.32, color: A.c.ink}}>
      {ch.words.map((wd, i) => {
        const active = t >= wd.a && t < wd.b + 0.02;
        const past = t >= wd.b;
        return (
          <span key={i} style={{background: active ? A.c.hot : 'transparent', opacity: active || past ? 1 : 0.5, padding: '0 8px', margin: '0 -4px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>
            {wd.w}{' '}
          </span>
        );
      })}
    </div>
  );
};
