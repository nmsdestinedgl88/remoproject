import React, {useId} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {mt} from './theme';
import type {Line} from './data';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Ink line that DRAWS ON (stroke-dashoffset), with a soft sage marker wash underneath
 * and a slow "line boil" wobble filter for the hand-drawn feel. Delay/dur in seconds.
 */
export const Draw: React.FC<{
  paths: string[];
  size: number;
  viewBox?: string;
  delay?: number;
  dur?: number;
  width?: number;
  wash?: boolean;
  wobble?: number;
  style?: React.CSSProperties;
}> = ({paths, size, viewBox = '0 0 100 100', delay = 0, dur = 1.2, width = 2.6, wash = true, wobble = 1.6, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const n = paths.length;
  const seed = Math.floor(frame / 4) % 5;
  return (
    <svg width={size} height={size} viewBox={viewBox} style={{overflow: 'visible', ...style}}>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={wobble} />
        </filter>
      </defs>
      <g filter={`url(#${id})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {paths.map((d, i) => {
          const start = delay + (i / Math.max(1, n)) * dur * 0.55;
          const p = interpolate(frame / fps, [start, start + dur * 0.55], [0, 1], {easing: mt.ease.inOut, ...clamp});
          const washP = interpolate(frame / fps, [start + dur * 0.25, start + dur * 0.8], [0, 1], {easing: mt.ease.out, ...clamp});
          return (
            <g key={i} opacity={p > 0.001 ? 1 : 0}>
              {wash && <path d={d} pathLength={1} stroke={mt.colors.sage} strokeOpacity={0.4 * washP} strokeWidth={width * 5} strokeDasharray="1 1" strokeDashoffset={1 - p} />}
              <path d={d} pathLength={1} stroke={mt.colors.ink} strokeWidth={width} strokeDasharray="1 1" strokeDashoffset={1 - p} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/**
 * Word-synced caption: bold white outlined caps, a hero-green pill hops to the active word.
 * Word timing is evenly weighted by character count inside each line: replace with real
 * Whisper timestamps once the voiceover exists.
 */
export const Captions: React.FC<{lines: Line[]}> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const line = lines.find((l) => t >= l.from && t < l.to + 0.2);
  if (!line) return null;
  const words = line.text.toUpperCase().split(' ');
  const weights = words.map((w) => w.length + 1);
  const total = weights.reduce((a, b) => a + b, 0);
  const prog = interpolate(t, [line.from, line.to], [0, 1], clamp) * total;
  let acc = 0;
  let active = words.length - 1;
  const starts: number[] = [];
  for (let i = 0; i < words.length; i++) {
    starts.push(acc);
    acc += weights[i];
  }
  for (let i = 0; i < words.length; i++) if (prog < starts[i] + weights[i]) { active = i; break; }
  const lineStartF = Math.round(line.from * fps);
  const inP = spring({frame: frame - lineStartF, fps, config: mt.spring.snappy});
  const out = interpolate(t, [line.to, line.to + 0.2], [1, 0], {easing: mt.ease.in, ...clamp});
  const activeStartF = Math.round((line.from + (starts[active] / total) * (line.to - line.from)) * fps);
  const pill = spring({frame: frame - activeStartF, fps, config: mt.spring.bouncy});
  return (
    <div
      style={{
        position: 'absolute', left: 84, right: 84, top: 1490, minHeight: 170, display: 'flex', flexWrap: 'wrap',
        justifyContent: 'center', alignContent: 'flex-start', columnGap: 18, rowGap: 6,
        opacity: Math.min(1, inP) * out, transform: `translateY(${interpolate(inP, [0, 1], [24, 0])}px)`,
      }}
    >
      {words.map((w, i) => {
        const isActive = i === active;
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', padding: '0 4px'}}>
            {isActive && (
              <span
                style={{
                  position: 'absolute', inset: '2px -8px -2px -8px', borderRadius: 16, background: mt.colors.hero,
                  boxShadow: `0 0 36px ${mt.colors.heroGlow}`, opacity: Math.min(1, pill),
                  transform: `scale(${interpolate(pill, [0, 1], [0.6, 1])})`,
                }}
              />
            )}
            <span
              style={{
                position: 'relative', fontFamily: mt.fonts.display, fontWeight: 800, fontSize: 60, lineHeight: 1.18,
                letterSpacing: '0.01em', color: mt.colors.white,
                WebkitTextStroke: isActive ? '0px' : `9px ${mt.colors.ink}`, paintOrder: 'stroke fill',
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

const NODES = ['INPUTS', 'CULTIVATION', 'FFB', 'CPO', 'PKO'];

/** The value chain strip pinned at the top; fills to the active stage. active=4 & done=true -> all complete. */
export const ChainTracker: React.FC<{active: number; count: number; total?: number}> = ({active, count, total = 13}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const W = 912;
  const step = W / 4;
  const grow = interpolate(frame / fps, [0.1, 1.1], [0, 1], {easing: mt.ease.out, ...clamp});
  const fillTo = Math.max(0, active - 1 + grow) * step;
  return (
    <div style={{position: 'absolute', left: 84, top: 236, width: W, height: 150}}>
      <div style={{position: 'absolute', left: 0, top: 22, width: W, height: 4, background: mt.colors.cardLine, borderRadius: 4}} />
      <div style={{position: 'absolute', left: 0, top: 22, width: Math.min(W, fillTo), height: 4, background: mt.colors.ink, borderRadius: 4}} />
      {NODES.map((label, i) => {
        const isActive = i === active;
        const done = i < active || (i === active && false);
        const pop = spring({frame: frame - (i <= active ? Math.round(i * 0.12 * fps) : 0), fps, config: mt.spring.snappy});
        return (
          <div key={label} style={{position: 'absolute', left: i * step - 60, top: 0, width: 120, textAlign: 'center'}}>
            <div
              style={{
                margin: '0 auto', width: 48, height: 48, borderRadius: '50%', boxSizing: 'border-box',
                border: `3px solid ${i <= active ? mt.colors.ink : mt.colors.cardLine}`,
                background: isActive ? mt.colors.ink : done ? mt.colors.sage : mt.colors.paper,
                color: isActive ? mt.colors.paper : mt.colors.ink, fontFamily: mt.fonts.display, fontWeight: 800, fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `scale(${isActive ? interpolate(pop, [0, 1], [0.7, 1.15]) : 1})`,
              }}
            >
              {i + 1}
            </div>
            <div style={{marginTop: 12, fontFamily: mt.fonts.body, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: i <= active ? mt.colors.ink : mt.colors.inkDim}}>{label}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, top: 108, width: W, textAlign: 'center', fontFamily: mt.fonts.body, fontWeight: 500, fontSize: 26, letterSpacing: 6, color: mt.colors.inkDim, fontVariantNumeric: 'tabular-nums'}}>
        VENTURES {String(count).padStart(2, '0')} / {total}
      </div>
    </div>
  );
};

/** Scene wrapper = the transition: blur-dissolve in (zoom-ish), fast blur-fade "clear the page" out. */
export const SceneShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const enter = interpolate(frame, [0, 11], [1, 0], {easing: mt.ease.out, ...clamp});
  const exit = interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [0, 1], {easing: mt.ease.in, ...clamp});
  return (
    <div
      style={{
        position: 'absolute', inset: 0, opacity: (1 - enter * 0.7) * (1 - exit),
        filter: `blur(${enter * 22 + exit * 14}px)`, transform: `scale(${1 + enter * 0.05 + exit * 0.02})`,
      }}
    >
      {children}
    </div>
  );
};
