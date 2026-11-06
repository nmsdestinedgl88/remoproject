import React from 'react';
import {AbsoluteFill, Img, interpolate, spring as rspring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bg, colors, ease, fonts, spring, tone} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Seconds to frames, derived from the composition fps. */
export const useSec = () => {
  const {fps} = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};

/** Spring progress 0..1 starting `delay` seconds into the scene. */
export const useProgress = (delay = 0, config: typeof spring.smooth = spring.smooth) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return rspring({frame: frame - Math.round(delay * fps), fps, config});
};

/** Slow sine micro-motion for anything idle on screen. */
export const useBreath = (amp = 6, period = 3.2, phase = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return Math.sin((frame / fps / period) * Math.PI * 2 + phase) * amp;
};

/* ------------------------------------------------------------------ stage */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/** Layer stack: flat colour field + soft drifting light, content, grain, vignette. */
export const Stage: React.FC<{bg: Bg; children: React.ReactNode}> = ({bg, children}) => {
  const frame = useCurrentFrame();
  const t = tone(bg);
  const dark = bg === 'navy';
  const dx = Math.sin(frame / 70) * 60;
  return (
    <AbsoluteFill style={{backgroundColor: t.bg, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          width: 1500,
          height: 1500,
          borderRadius: '50%',
          top: -620,
          left: -420 + dx,
          background: `radial-gradient(circle, ${dark ? 'rgba(120,110,255,0.18)' : 'rgba(255,255,255,0.32)'}, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 1300,
          borderRadius: '50%',
          bottom: -700,
          right: -400 - dx,
          background: `radial-gradient(circle, ${dark ? 'rgba(225,176,41,0.10)' : 'rgba(27,20,101,0.08)'}, transparent 64%)`,
        }}
      />
      {children}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          backgroundImage: GRAIN,
          backgroundSize: '220px',
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: dark ? 0.06 : 0.045,
          mixBlendMode: dark ? 'overlay' : 'multiply',
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,0.16) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- entrances */

/** Fade + rise + scale, springy but never overshooting. */
export const Pop: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  rise?: number;
  fromX?: number;
}> = ({delay = 0, children, style, rise = 44, fromX = 0}) => {
  const p = useProgress(delay);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.4),
        transform: `translate(${interpolate(p, [0, 1], [fromX, 0])}px, ${interpolate(p, [0, 1], [rise, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

type TextProps = {
  text: string;
  bg: Bg;
  delay?: number;
  size?: number;
  align?: 'left' | 'center';
  weight?: number;
  style?: React.CSSProperties;
  per?: number;
};

/** Staggered word reveal. Tokens: `_word_` = serif italic accent, `[word]` = highlighter bar,
 *  `|` = line break. Words are separated by spaces; use `~` for a space inside a token. */
export const Words: React.FC<TextProps> = ({text, bg, delay = 0, size = 96, align = 'left', style, per = 0.1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = tone(bg);
  const tokens = text.split(' ');
  let n = 0;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: Math.round(size * 0.24),
        rowGap: Math.round(size * 0.02),
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.06,
        letterSpacing: '-0.025em',
        color: t.ink,
        ...style,
      }}
    >
      {tokens.map((raw, i) => {
        if (raw === '|') return <div key={i} style={{flexBasis: '100%', height: 0}} />;
        const accent = raw.startsWith('_') && raw.endsWith('_');
        const hl = raw.startsWith('[') && raw.endsWith(']');
        const word = raw.replace(/^[_[]|[_\]]$/g, '').replace(/~/g, ' ');
        const k = n++;
        const start = delay + k * per;
        const p = rspring({frame: frame - Math.round(start * fps), fps, config: spring.snappy});
        const bar = interpolate(frame - Math.round((start + 0.25) * fps), [0, Math.round(0.3 * fps)], [0, 1], {
          ...clamp,
          easing: ease.out,
        });
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              isolation: 'isolate',
              opacity: Math.min(1, p * 1.5),
              transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`,
              ...(accent
                ? {fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 600, color: t.accent, letterSpacing: '-0.01em'}
                : {}),
              ...(hl ? {color: t.barInk, padding: '0 0.12em'} : {}),
            }}
          >
            {hl && (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '14%',
                  bottom: '2%',
                  background: t.bar,
                  transformOrigin: 'left center',
                  transform: `scaleX(${bar})`,
                  zIndex: -1,
                }}
              />
            )}
            {word}
          </span>
        );
      })}
    </div>
  );
};

/** Typewriter with a blinking caret. `_x_` segments render as serif italic accent. */
export const Typed: React.FC<TextProps & {cps?: number; family?: 'display' | 'body' | 'caps'}> = ({
  text,
  bg,
  delay = 0,
  size = 96,
  cps = 22,
  align = 'left',
  family = 'display',
  weight = 800,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = tone(bg);
  const shown = Math.max(0, Math.floor(((frame - delay * fps) / fps) * cps));
  const segs = text.split('_').map((s, i) => ({s, accent: i % 2 === 1}));
  let used = 0;
  const done = shown >= text.replace(/_/g, '').length;
  const blink = done ? Math.floor(frame / (fps * 0.4)) % 2 === 0 && frame - delay * fps < fps * 2.4 : true;
  return (
    <div
      style={{
        fontFamily: family === 'caps' ? fonts.caps : family === 'body' ? fonts.body : fonts.display,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: family === 'caps' ? '0.01em' : '-0.02em',
        color: t.ink,
        textAlign: align,
        whiteSpace: 'pre-wrap',
        ...style,
      }}
    >
      {segs.map((seg, i) => {
        const take = Math.max(0, Math.min(seg.s.length, shown - used));
        used += seg.s.length;
        return (
          <span
            key={i}
            style={seg.accent ? {fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 600, color: t.accent} : undefined}
          >
            {seg.s.slice(0, take)}
          </span>
        );
      })}
      <span
        style={{
          display: 'inline-block',
          width: Math.max(4, size * 0.05),
          height: size * 0.8,
          marginLeft: size * 0.06,
          verticalAlign: 'baseline',
          background: t.accent === colors.pureWhite ? colors.navy : t.accent,
          opacity: blink && shown > 0 ? 0.9 : 0,
          transform: 'translateY(6px)',
        }}
      />
    </div>
  );
};

/** Highlighter bar behind children; wipes in left to right. */
export const Marker: React.FC<{bg: Bg; delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  bg,
  delay = 0,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = tone(bg);
  const w = interpolate(frame - Math.round(delay * fps), [0, Math.round(0.4 * fps)], [0, 1], {...clamp, easing: ease.out});
  return (
    <span style={{position: 'relative', display: 'inline-block', isolation: 'isolate', padding: '0 0.1em', ...style}}>
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '16%',
          bottom: '0%',
          background: t.bar,
          transformOrigin: 'left center',
          transform: `scaleX(${w})`,
          zIndex: -1,
        }}
      />
      {children}
    </span>
  );
};

/* --------------------------------------------------------------- graphics */

/** Concentric rings that burst outward and thin. */
export const Rings: React.FC<{
  delay?: number;
  cx?: number;
  cy?: number;
  colorA: string;
  colorB: string;
  max?: number;
}> = ({delay = 0, cx = 540, cy = 960, colorA, colorB, max = 1300}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      {[0, 1, 2].map((i) => {
        const p = interpolate(frame - Math.round((delay + i * 0.12) * fps), [0, Math.round(1.6 * fps)], [0, 1], {
          ...clamp,
          easing: ease.out,
        });
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={80 + p * max * (0.55 + i * 0.22)}
            fill="none"
            stroke={i % 2 === 0 ? colorA : colorB}
            strokeWidth={Math.max(2, 34 * (1 - p) * (1 - i * 0.2))}
            opacity={Math.min(1, p * 6) * (1 - p * 0.55)}
          />
        );
      })}
    </svg>
  );
};

/** Path that draws itself. `d` is any SVG path. */
export const Draw: React.FC<{
  d: string;
  delay?: number;
  dur?: number;
  stroke: string;
  width?: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  arrow?: boolean;
}> = ({d, delay = 0, dur = 0.8, stroke, width = 10, w = 1080, h = 1920, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame - Math.round(delay * fps), [0, Math.round(dur * fps)], [0, 1], {...clamp, easing: ease.inOut});
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, ...style}}>
      <path
        d={d}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/** Cut-out image with soft shadow and gentle idle drift. */
export const Cutout: React.FC<{
  file: string;
  sticker?: boolean;
  width?: number;
  height?: number;
  delay?: number;
  style?: React.CSSProperties;
  fromX?: number;
  rise?: number;
  phase?: number;
}> = ({file, sticker = false, width, height, delay = 0, style, fromX = 0, rise = 60, phase = 0}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const bob = useBreath(7, 3.6, phase);
  const kb = interpolate(frame, [0, durationInFrames], [1, 1.06], {easing: ease.inOut});
  return (
    <Pop delay={delay} fromX={fromX} rise={rise} style={{position: 'absolute', ...style}}>
      <div style={{transform: `translateY(${bob}px) scale(${kb})`}}>
        <Img
          src={staticFile(`assets/${sticker ? 'sticker/' : ''}${file}.png`)}
          style={{
            width,
            height,
            display: 'block',
            filter: 'drop-shadow(0 26px 30px rgba(10,6,50,0.28))',
          }}
        />
      </div>
    </Pop>
  );
};

/** Navy L-shaped corner brackets (reference device). */
export const Brackets: React.FC<{color: string; delay?: number}> = ({color, delay = 0}) => {
  const p = useProgress(delay, spring.slow);
  const len = 170 * p;
  const s = {position: 'absolute', opacity: p} as const;
  return (
    <>
      <div style={{...s, left: 70, top: 220, width: len, height: len, borderLeft: `18px solid ${color}`, borderTop: `18px solid ${color}`}} />
      <div style={{...s, right: 70, bottom: 220, width: len, height: len, borderRight: `18px solid ${color}`, borderBottom: `18px solid ${color}`}} />
    </>
  );
};

/** White rounded card with shadow. */
export const Card: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div
    style={{
      background: colors.pureWhite,
      borderRadius: 36,
      boxShadow: '0 30px 60px -18px rgba(10,6,50,0.35)',
      ...style,
    }}
  >
    {children}
  </div>
);
