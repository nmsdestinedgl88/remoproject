// The persistent object of each episode. It never leaves the frame; scenes only move it and change its state.
// `t` = seconds since the video started, `l` = seconds since the current scene started.
import React from 'react';
import {interpolate} from 'remotion';
import {clamp, mt} from './theme';

const I = mt.c.ink;
const H = mt.c.hot;
const W = mt.c.white;
const sw = {stroke: I, strokeWidth: 9, strokeLinejoin: 'round', strokeLinecap: 'round'} as const;
const e = (x: number, a: number, b: number) => interpolate(x, [a, b], [0, 1], {...clamp, easing: mt.ease.out});

type P = {t: number; l: number; state: string; level: number};

// Mon: produce crate. States: drop, tilt, cold, full, ride, shake, rest
const Crate: React.FC<P> = ({t, l, state, level}) => {
  const tilt = state === 'tilt' ? Math.sin(Math.min(l, 1.2) * 1.3) * 10 : 0;
  const shake = state === 'shake' ? Math.sin(l * 30) * 3 * (1 - e(l, 0.2, 1.4)) : 0;
  const fill = level;
  const roll = state === 'tilt' ? e(l, 0.4, 1.8) * 60 : 0;
  return (
    <g transform={`rotate(${tilt + shake} 150 220)`}>
      {[80, 130, 180, 220].map((x, i) => (
        <circle key={x} cx={x + (i === 3 ? roll : 0)} cy={118 - (i % 2) * 14} r={30} fill={i === 1 ? H : W} {...sw} opacity={i === 3 ? 1 - e(roll, 40, 60) : 1} />
      ))}
      <rect x={40} y={128} width={220} height={130} rx={10} fill={W} {...sw} />
      <rect x={49} y={258 - 112 * fill} width={202} height={112 * fill} rx={4} fill={H} opacity={0.85} />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={40} y1={162 + i * 34} x2={260} y2={162 + i * 34} stroke={I} strokeWidth={7} />
      ))}
      <line x1={92} y1={128} x2={92} y2={258} stroke={I} strokeWidth={7} />
      <line x1={208} y1={128} x2={208} y2={258} stroke={I} strokeWidth={7} />
      {state === 'cold' &&
        [0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${70 + i * 80} ${60 + Math.sin(t * 2 + i) * 8}) rotate(${t * 50 + i * 20})`} opacity={e(l, 0.3 + i * 0.2, 0.7 + i * 0.2)}>
            {[0, 60, 120].map((a) => (
              <line key={a} x1={0} y1={-14} x2={0} y2={14} stroke={H} strokeWidth={5} strokeLinecap="round" transform={`rotate(${a})`} />
            ))}
          </g>
        ))}
    </g>
  );
};

// Tue: membership card. States: flip, spin, glide, stack, renew, grow, rest
const Card: React.FC<P> = ({t, l, state}) => {
  const flip = state === 'flip' || state === 'spin' ? Math.cos(e(l, 0.1, 1.1) * Math.PI * 2) : 1;
  const stack = state === 'stack' ? e(l, 5.2, 6.4) : 0;
  const face = (dx: number, dy: number, o: number, k: number) => (
    <g key={k} transform={`translate(${dx} ${dy})`} opacity={o}>
      <rect x={30} y={70} width={240} height={160} rx={20} fill={W} {...sw} />
      <rect x={30} y={100} width={240} height={34} fill={H} />
      <rect x={56} y={154} width={44} height={32} rx={6} fill="none" stroke={I} strokeWidth={6} />
      <text x={250} y={212} textAnchor="end" fontFamily={mt.f.mono} fontSize={26} fill={I}>
        MEMBER
      </text>
    </g>
  );
  const ring = state === 'renew' ? (
    <g transform={`rotate(${t * 90} 150 150)`}>
      <path d="M150 12 A138 138 0 1 1 30 84" fill="none" stroke={H} strokeWidth={8} strokeLinecap="round" />
      <path d="M30 84 l-6 -26 M30 84 l24 -10" stroke={H} strokeWidth={8} strokeLinecap="round" />
    </g>
  ) : null;
  return (
    <g>
      {ring}
      {stack > 0 && [face(-26 * stack, 26 * stack, 0.5 * stack, 1), face(-13 * stack, 13 * stack, 0.75 * stack, 2)]}
      <g transform={`translate(150 150) scale(${flip} 1) translate(-150 -150)`}>{face(0, 0, 1, 0)}</g>
    </g>
  );
};

// Wed: key. States: spin, wait, shake, turn, rest
const Key: React.FC<P> = ({l, state}) => {
  const spin = state === 'spin' ? e(l, 0, 1.2) * 360 : 0;
  const turn = state === 'turn' ? e(l, 0.7, 1.5) * 90 : 0;
  const shake = state === 'shake' ? Math.sin(l * 26) * 6 * (1 - e(l, 0.3, 1.6)) : 0;
  return (
    <g transform={`rotate(${spin + turn + shake} 150 150)`}>
      <circle cx={88} cy={150} r={56} fill={W} {...sw} />
      <circle cx={88} cy={150} r={26} fill={H} />
      <path d="M144 150 H270 V188 M234 150 V182 M204 150 V174" fill="none" {...sw} />
    </g>
  );
};

// Fri: loaf. States: drop, wobble, copy, pulse, rest
const Loaf: React.FC<P> = ({l, state}) => {
  const wob = state === 'wobble' ? Math.sin(l * 9) * 5 * (1 - e(l, 0.2, 1.5)) : 0;
  const copy = state === 'copy' ? e(l, 5.4, 6.4) : 0;
  const pulse = state === 'pulse' ? 1 + Math.sin(e(l, 0.2, 1) * Math.PI) * 0.08 : 1;
  const loaf = (o: number, dx: number, k: number) => (
    <g key={k} opacity={o} transform={`translate(${dx} 0)`}>
      <path d="M40 220 C30 150 70 96 150 96 C230 96 270 150 260 220 Z" fill={W} {...sw} />
      <rect x={40} y={210} width={220} height={20} rx={10} fill={H} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${96 + i * 46} 130 q14 26 0 52`} fill="none" stroke={I} strokeWidth={7} strokeLinecap="round" />
      ))}
    </g>
  );
  return (
    <g transform={`rotate(${wob} 150 220) translate(150 160) scale(${pulse}) translate(-150 -160)`}>
      {copy > 0 && loaf(0.45 * copy, 70 * copy, 1)}
      {loaf(1, 0, 0)}
    </g>
  );
};

// Sat: seed that grows. `level` = growth stage 0..4 (eased between scenes by the episode)
const Seed: React.FC<P> = ({t, level}) => {
  const g = level;
  const stem = interpolate(g, [0, 1, 2, 3, 4], [0, 50, 95, 130, 160], clamp);
  const sway = Math.sin(t * 1.6) * 3;
  const leaf = (y: number, side: number, s: number, k: number) => (
    <path key={k} d={`M150 ${y} q${side * 40} -34 ${side * 70} -8 q${-side * 34} 24 ${-side * 70} 8 Z`} fill={W} {...sw} strokeWidth={7} transform={`translate(150 ${y}) scale(${s}) translate(-150 ${-y})`} />
  );
  const flowers = Math.max(0, Math.min(5, Math.round((g - 2.6) * 4)));
  return (
    <g>
      <path d="M40 256 Q150 236 260 256" fill="none" {...sw} />
      <g transform={`rotate(${sway} 150 250)`}>
        <line x1={150} y1={250} x2={150} y2={250 - stem} {...sw} strokeWidth={8} />
        {leaf(222, -1, interpolate(g, [0.5, 1], [0, 1], clamp), 0)}
        {leaf(200, 1, interpolate(g, [1.2, 1.8], [0, 1], clamp), 1)}
        {leaf(170, -1, interpolate(g, [1.8, 2.4], [0, 0.85], clamp), 2)}
        {leaf(146, 1, interpolate(g, [2.2, 2.8], [0, 0.8], clamp), 3)}
        {Array.from({length: flowers}).map((_, i) => {
          const a = (i - 2) * 0.55;
          return <circle key={i} cx={150 + Math.sin(a) * 46} cy={250 - stem - Math.cos(a) * 26 + 12} r={15} fill={H} stroke={I} strokeWidth={5} />;
        })}
      </g>
      <ellipse cx={150} cy={244 - Math.min(stem, 6)} rx={36} ry={24} fill={H} stroke={I} strokeWidth={7} opacity={interpolate(g, [0, 1.2], [1, 0], clamp)} />
    </g>
  );
};

// Sun: leaking bucket. `level` = water 0..1. States: drain, leak, patch, wobble, rest
const Bucket: React.FC<P> = ({t, l, state, level}) => {
  const wob = state === 'wobble' ? Math.sin(l * 8) * 4 * (1 - e(l, 0.2, 1.5)) : 0;
  const leaking = state === 'leak' || state === 'drain' || state === 'wobble';
  const patched = state === 'patch' ? e(l, 1.1, 1.4) : state === 'fixed' ? 1 : 0;
  const top = 96;
  const bot = 250;
  const y = bot - (bot - top - 10) * level;
  const xAt = (yy: number) => 60 + ((yy - top) / (bot - top)) * 30;
  return (
    <g transform={`rotate(${wob} 150 250)`}>
      <path d={`M${xAt(y) + 6} ${y} H${300 - xAt(y) - 6} L${300 - 90 - 6} ${bot - 6} H${90 + 6} Z`} fill={H} opacity={0.85} />
      <path d={`M60 ${top} L90 ${bot} H210 L240 ${top}`} fill="none" {...sw} />
      <path d="M60 96 Q150 30 240 96" fill="none" stroke={I} strokeWidth={6} />
      {leaking &&
        patched < 1 &&
        [0, 1, 2].map((i) => {
          const p = ((t + i * 0.4) % 1.2) / 1.2;
          return <ellipse key={i} cx={176} cy={bot + 6 + p * 46} rx={6} ry={9} fill={H} opacity={(1 - p) * (1 - patched)} />;
        })}
      {patched > 0 && <rect x={160} y={226} width={34} height={22} rx={4} fill={I} transform={`rotate(-8 177 237) scale(1)`} opacity={patched} />}
    </g>
  );
};

// Thu: thermometer (kept for the Thursday episode once its voiceover arrives)
const Thermo: React.FC<P> = ({level}) => (
  <g>
    <rect x={128} y={30} width={44} height={190} rx={22} fill={W} {...sw} />
    <rect x={140} y={200 - 160 * level} width={20} height={160 * level + 20} fill={H} />
    <circle cx={150} cy={240} r={36} fill={H} {...sw} />
  </g>
);

const MAP: Record<string, React.FC<P>> = {crate: Crate, card: Card, key: Key, loaf: Loaf, seed: Seed, bucket: Bucket, thermo: Thermo};

export const PersistentObject: React.FC<{kind: string; size: number} & P> = ({kind, size, ...p}) => {
  const C = MAP[kind];
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{overflow: 'visible', display: 'block'}}>
      <C {...p} />
    </svg>
  );
};
