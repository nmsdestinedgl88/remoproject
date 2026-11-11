import React from 'react';
import {Easing, continueRender, delayRender, interpolate, random, spring, staticFile} from 'remotion';

// ---------- tokens (fixed by client + one derived tone) ----------
export const BG = '#B3B3B3';
export const HOT = '#37C871';
export const WHITE = '#FFFFFF';
export const INK = '#0F4526';
export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const DISPLAY = "'Plus Jakarta Sans', sans-serif";
export const MONO = "'Space Mono', monospace";
export const HAND = "'Caveat', cursive";

const FONTS: [string, string, string][] = [
  ['Plus Jakarta Sans', '500', 'fonts/plus-jakarta-sans-latin-500-normal.woff2'],
  ['Plus Jakarta Sans', '600', 'fonts/plus-jakarta-sans-latin-600-normal.woff2'],
  ['Plus Jakarta Sans', '800', 'fonts/plus-jakarta-sans-latin-800-normal.woff2'],
  ['Space Mono', '700', 'fonts/space-mono-latin-700-normal.woff2'],
  ['Caveat', '600', 'fonts/caveat-latin-600-normal.woff2'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('qr-fonts');
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

export const img = {
  markColor: staticFile('qr/quickreach-color-mark.png'),
  markWhite: staticFile('qr/quickreach-white-mark.png'),
  fullColor: staticFile('qr/quickreach-color-full.png'),
  cimpleColor: staticFile('qr/cimple-color-keyed.png'),
  cimpleWhite: staticFile('qr/cimple-white.png'),
};

// ---------- motion helpers (all pure functions of global time T in seconds) ----------
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const prog = (T: number, t0: number, dur: number) => clamp01((T - t0) / dur);
export const ease = (x: number) => Easing.bezier(0.22, 1, 0.36, 1)(clamp01(x));
export const easeIO = (x: number) => Easing.bezier(0.65, 0, 0.35, 1)(clamp01(x));

export const POP = {damping: 13, stiffness: 210, mass: 0.6};
export const SOFT = {damping: 22, stiffness: 150, mass: 0.8};
export const sp = (T: number, t0: number, config = POP) =>
  spring({frame: (T - t0) * FPS, fps: FPS, config});

/** piecewise-linear keyframes with ease between points */
export const kf = (T: number, pts: [number, number][]) => {
  if (T <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (T <= pts[i][0]) {
      const [a, va] = pts[i - 1];
      const [b, vb] = pts[i];
      return va + (vb - va) * easeIO((T - a) / (b - a));
    }
  }
  return pts[pts.length - 1][1];
};

export type Mode = 'ink' | 'grey';
export const textOn = (m: Mode) => (m === 'ink' ? WHITE : INK);

// ---------- primitives ----------
export const abs = (x: number, y: number, w?: number, h?: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: 'absolute',
  left: x,
  top: y,
  width: w,
  height: h,
  ...extra,
});

export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({x, y, w, h, radius = 32, style, children}) => (
  <div
    style={abs(x, y, w, h, {
      background: WHITE,
      borderRadius: radius,
      boxShadow: '0 20px 48px rgba(15,69,38,0.18)',
      ...style,
    })}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  text: string;
  fill?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({text, fill = 'rgba(55,200,113,0.22)', color = INK, size = 22, style}) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color,
      background: fill,
      padding: `${Math.round(size * 0.38)}px ${Math.round(size * 0.7)}px`,
      borderRadius: 999,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {text}
  </span>
);

export const Avatar: React.FC<{
  text: string;
  size: number;
  fill?: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({text, size, fill = INK, color = WHITE, style}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: fill,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: DISPLAY,
      fontWeight: 800,
      fontSize: Math.round(size * 0.38),
      letterSpacing: '-0.02em',
      ...style,
    }}
  >
    {text}
  </div>
);

export const Cursor: React.FC<{x: number; y: number; down?: boolean}> = ({x, y, down}) => (
  <svg
    width={70}
    height={86}
    viewBox="0 0 28 34"
    style={{position: 'absolute', left: x, top: y, transform: `scale(${down ? 0.88 : 1})`, transformOrigin: '4px 3px', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.25))'}}
  >
    <path d="M4 3 L4 27 L10 21.5 L14.5 31 L19 29 L14.7 19.8 L23 19.5 Z" fill={WHITE} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
  </svg>
);

export const Ring: React.FC<{cx: number; cy: number; r: number; stroke?: number; color?: string; opacity?: number}> = ({
  cx,
  cy,
  r,
  stroke = 8,
  color = HOT,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: cx - r,
      top: cy - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      border: `${stroke}px solid ${color}`,
      opacity,
      boxSizing: 'border-box',
    }}
  />
);

/** expanding ripple ring (ring shape taken from the mark) */
export const Ripple: React.FC<{T: number; t0: number; cx: number; cy: number; maxR: number; dur?: number; color?: string}> = ({
  T,
  t0,
  cx,
  cy,
  maxR,
  dur = 1.0,
  color = HOT,
}) => {
  const p = prog(T, t0, dur);
  if (p <= 0 || p >= 1) return null;
  return <Ring cx={cx} cy={cy} r={maxR * ease(p)} stroke={Math.max(2, 14 * (1 - p))} color={color} opacity={1 - p * p} />;
};

export const Headline: React.FC<{
  T: number;
  start: number;
  mode: Mode;
  words: {w: string; t: number; key?: boolean}[];
  top?: number;
  size?: number;
}> = ({T, start, mode, words, top = 236, size = 92}) => {
  const base = textOn(mode);
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        top,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: Math.round(size * 0.26),
        rowGap: 0,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '-0.035em',
        lineHeight: 1.02,
        textAlign: 'center',
      }}
    >
      {words.map((wd, i) => {
        const t = Math.max(wd.t, start + 0.1 + 0.17 * i);
        const p = sp(T, t, SOFT);
        const u = prog(T, t + 0.12, 0.3);
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              opacity: clamp01(p * 1.4),
              transform: `translateY(${(1 - p) * 34}px)`,
              color: wd.key && mode === 'ink' ? HOT : base,
              paddingBottom: 14,
            }}
          >
            {wd.w}
            {wd.key && mode === 'grey' ? (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: 10,
                  width: `${ease(u) * 100}%`,
                  background: HOT,
                  borderRadius: 6,
                }}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

/** seeded pixel grid texture, 22x40 squares */
const COLS = 22;
const ROWS = 40;
export const PixelGrid: React.FC<{T: number; mode: Mode; seed: string}> = ({T, mode, seed}) => {
  const cw = W / COLS;
  const ch = H / ROWS;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const rnd = random(`${seed}-${r}-${c}`);
      const ph = random(`ph-${seed}-${r}-${c}`) * Math.PI * 2;
      const period = 3 + random(`pe-${seed}-${r}-${c}`) * 3;
      const shimmer = 0.5 + 0.5 * Math.sin((T / period) * Math.PI * 2 + ph);
      const dense = r >= 30 ? 1.5 : 1;
      if (rnd < (r >= 30 ? 0.3 : 0.52)) continue;
      const a =
        mode === 'grey'
          ? (0.06 + 0.08 * shimmer * rnd) * dense * 0.95
          : 0.08 * shimmer * rnd * dense * 0.9;
      cells.push(
        <rect key={`${r}-${c}`} x={c * cw + 2} y={r * ch + 2} width={cw - 4} height={ch - 4} fill={mode === 'grey' ? WHITE : HOT} opacity={Math.min(a, mode === 'grey' ? 0.14 : 0.08)} />,
      );
    }
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
      {cells}
    </svg>
  );
};

export const Background: React.FC<{T: number; mode: Mode; seed: string; spotlight?: boolean}> = ({T, mode, seed, spotlight = true}) => (
  <div style={{position: 'absolute', inset: 0, background: mode === 'ink' ? INK : BG}}>
    {mode === 'ink' ? (
      <>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(700px 700px at 50% 38%, rgba(55,200,113,0.22), rgba(55,200,113,0) 100%)`,
          }}
        />
        {spotlight ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: W,
              height: 1300,
              background: 'rgba(255,255,255,0.10)',
              clipPath: `polygon(${W / 2 - 120 + Math.sin(T * 0.6) * 60}px 0, ${W / 2 + 120 + Math.sin(T * 0.6) * 60}px 0, ${W / 2 + 560}px 1300px, ${W / 2 - 560}px 1300px)`,
              maskImage: 'linear-gradient(to bottom, #000, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent)',
            }}
          />
        ) : null}
      </>
    ) : null}
    <PixelGrid T={T} mode={mode} seed={seed} />
  </div>
);

/** persistent corner mark; hidden by caller in scenes 8, 14, 15 */
export const CornerMark: React.FC<{mode: Mode}> = ({mode}) => (
  <>
    {mode === 'grey' ? (
      <div style={{position: 'absolute', left: 1080 - 56 - 72 + 36 - 56, top: 100 - 56, width: 112, height: 112, borderRadius: '50%', background: WHITE}} />
    ) : null}
    <img
      src={mode === 'ink' ? img.markWhite : img.markColor}
      style={{position: 'absolute', left: 1080 - 56 - 72, top: 64, width: 72, height: 72}}
    />
  </>
);

export const lerp = interpolate;
