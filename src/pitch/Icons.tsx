// Animated line icons. Each is a pure function of the card's local frame.
// ink = line colour, hot = the one moving accent part.
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from './theme';
import type {IconName} from './data';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type P = {ink: string; hot: string; size?: number};

const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {frame, fps, t: frame / fps};
};
const draw = (frame: number, fps: number, start: number, dur: number, len: number) =>
  interpolate(frame, [start * fps, (start + dur) * fps], [len, 0], {easing: theme.ease.out, ...clamp});
const pop = (frame: number, fps: number, start: number) =>
  spring({frame: frame - Math.round(start * fps), fps, config: theme.spring.bouncy});

// colour for marks drawn on top of an accent fill
const onHot = (hot: string) => (hot.toUpperCase() === '#FFFFFF' ? '#800080' : '#fff');

const Svg: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const Doc: React.FC<P> = ({ink, hot, size = 240}) => {
  const {frame, fps} = useT();
  const s = pop(frame, fps, 1.0);
  return (
    <Svg size={size}>
      <path d="M50 20 h70 l30 30 v130 h-100 z M120 20 v30 h30" stroke={ink} strokeWidth={7} strokeDasharray={520} strokeDashoffset={draw(frame, fps, 0.1, 0.6, 520)} />
      {[70, 95, 120].map((y, i) => (
        <line key={y} x1={70} y1={y} x2={130} y2={y} stroke={ink} strokeWidth={6} strokeDasharray={60} strokeDashoffset={draw(frame, fps, 0.4 + i * 0.12, 0.35, 60)} />
      ))}
      <g transform={`translate(128 150) scale(${interpolate(s, [0, 1], [0.6, 1])})`} opacity={Math.min(1, s)}>
        <circle r={26} fill={hot} />
        <path d="M-11 0 l7 8 l15 -16" stroke={onHot(hot)} strokeWidth={6} />
      </g>
    </Svg>
  );
};

const Bars: React.FC<P> = ({ink, hot, size = 240}) => {
  const {frame, fps, t} = useT();
  const hs = [50, 80, 115, 150];
  return (
    <Svg size={size}>
      <line x1={25} y1={180} x2={180} y2={180} stroke={ink} strokeWidth={6} />
      {hs.map((h, i) => {
        const p = spring({frame: frame - Math.round((0.15 + i * 0.1) * fps), fps, config: theme.spring.smooth});
        const hh = h * p * (1 + (i === 3 ? Math.sin(t * 2.4) * 0.03 : 0));
        return <rect key={i} x={35 + i * 38} y={175 - hh} width={26} height={hh} rx={4} fill={i === 3 ? hot : 'none'} stroke={i === 3 ? hot : ink} strokeWidth={6} />;
      })}
    </Svg>
  );
};

const Coin: React.FC<P> = ({ink, hot, size = 240}) => {
  const {frame, fps, t} = useT();
  const p = pop(frame, fps, 0.1);
  const c = Math.cos(t * 1.4);
  const flip = Math.sign(c || 1) * (0.35 + 0.65 * Math.abs(c));
  return (
    <Svg size={size}>
      <g transform={`translate(100 100) scale(${flip} 1) scale(${interpolate(p, [0, 1], [0.6, 1])})`} opacity={Math.min(1, p)}>
        <circle r={70} fill={hot} />
        <circle r={54} stroke={onHot(hot)} strokeWidth={5} opacity={0.6} />
        <text y={24} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={72} fill={onHot(hot)}>$</text>
      </g>
      <ellipse cx={100} cy={188} rx={50 * Math.abs(flip) + 10} ry={5} fill={ink} opacity={0.2} />
    </Svg>
  );
};

const Phone: React.FC<P> = ({ink, hot, size = 240}) => {
  const {frame, fps, t} = useT();
  const buzz = Math.sin(t * 40) * (Math.sin(t * 3) > 0.6 ? 2.5 : 0);
  return (
    <Svg size={size}>
      <g transform={`rotate(${buzz} 100 100)`}>
        <rect x={60} y={20} width={80} height={160} rx={16} stroke={ink} strokeWidth={7} strokeDasharray={480} strokeDashoffset={draw(frame, fps, 0.05, 0.5, 480)} />
        {[0, 1].map((i) => {
          const p = spring({frame: frame - Math.round((0.5 + i * 0.35) * fps), fps, config: theme.spring.snappy});
          return <rect key={i} x={i ? 72 : 88} y={60 + i * 36} width={40} height={22} rx={10} fill={i ? hot : 'none'} stroke={i ? hot : ink} strokeWidth={5} opacity={Math.min(1, p)} transform={`translate(${(1 - p) * (i ? -20 : 20)} 0)`} />;
        })}
        <circle cx={100} cy={160} r={6} fill={ink} />
      </g>
      {[0, 1].map((i) => {
        const ph = ((t * 0.8 + i * 0.5) % 1);
        return <circle key={i} cx={140} cy={30} r={10 + ph * 30} stroke={hot} strokeWidth={4} opacity={(1 - ph) * 0.8} />;
      })}
    </Svg>
  );
};

const XStamp: React.FC<P> = ({ink, hot, size = 240}) => {
  const {frame, fps} = useT();
  const s = spring({frame: frame - Math.round(0.35 * fps), fps, config: {damping: 9, stiffness: 220, mass: 0.6}});
  return (
    <Svg size={size}>
      <rect x={40} y={40} width={120} height={120} rx={18} stroke={ink} strokeWidth={6} strokeDasharray="14 12" opacity={0.5} transform={`rotate(${frame * 0.6} 100 100)`} style={{transformOrigin: '100px 100px'}} />
      <g transform={`translate(100 100) rotate(-12) scale(${interpolate(s, [0, 1], [1.6, 1])})`} opacity={Math.min(1, s)}>
        <circle r={56} stroke={hot} strokeWidth={8} />
        <path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke={hot} strokeWidth={11} />
      </g>
    </Svg>
  );
};

const Check: React.FC<P> = ({ink, hot, size = 240}) => {
  const {frame, fps, t} = useT();
  const p = pop(frame, fps, 0.15);
  return (
    <Svg size={size}>
      <circle cx={100} cy={100} r={74} stroke={ink} strokeWidth={5} strokeDasharray="10 12" transform={`rotate(${t * 30} 100 100)`} />
      <g transform={`translate(100 100) scale(${interpolate(p, [0, 1], [0.6, 1])})`} opacity={Math.min(1, p)}>
        <circle r={56} fill={hot} />
        <path d="M-24 0 l16 17 l32 -34" stroke={onHot(hot)} strokeWidth={11} strokeDasharray={90} strokeDashoffset={draw(frame, fps, 0.45, 0.4, 90)} />
      </g>
    </Svg>
  );
};

const Pin: React.FC<P> = ({ink, hot, size = 240}) => {
  const {frame, fps, t} = useT();
  const d = spring({frame: frame - Math.round(0.1 * fps), fps, config: theme.spring.bouncy});
  return (
    <Svg size={size}>
      {[0, 1].map((i) => {
        const ph = (t * 0.7 + i * 0.5) % 1;
        return <ellipse key={i} cx={100} cy={172} rx={20 + ph * 60} ry={(20 + ph * 60) * 0.25} stroke={ink} strokeWidth={4} opacity={(1 - ph) * 0.6 * Math.min(1, d)} />;
      })}
      <g transform={`translate(0 ${interpolate(d, [0, 1], [-60, 0])})`} opacity={Math.min(1, d * 2)}>
        <path d="M100 172 C70 130 55 108 55 82 a45 45 0 0 1 90 0 c0 26 -15 48 -45 90 z" fill={hot} />
        <circle cx={100} cy={82} r={17} fill={onHot(hot)} />
      </g>
    </Svg>
  );
};

const Clock: React.FC<P> = ({ink, hot, size = 240}) => {
  const {frame, fps, t} = useT();
  return (
    <Svg size={size}>
      <circle cx={100} cy={105} r={72} stroke={ink} strokeWidth={7} strokeDasharray={460} strokeDashoffset={draw(frame, fps, 0, 0.6, 460)} />
      <line x1={100} y1={105} x2={100} y2={62} stroke={ink} strokeWidth={8} transform={`rotate(${t * 40} 100 105)`} />
      <line x1={100} y1={105} x2={100} y2={50} stroke={hot} strokeWidth={6} transform={`rotate(${t * 240} 100 105)`} />
      <circle cx={100} cy={105} r={8} fill={hot} />
      <g transform={`rotate(${Math.sin(t * 18) * 6} 100 30)`}>
        <path d="M58 40 a18 18 0 0 1 26 -18 M142 40 a18 18 0 0 0 -26 -18" stroke={ink} strokeWidth={7} />
      </g>
    </Svg>
  );
};

const Bulb: React.FC<P> = ({ink, hot, size = 240}) => {
  const {frame, fps, t} = useT();
  const glow = 0.55 + Math.sin(t * 2.6) * 0.25;
  return (
    <Svg size={size}>
      <circle cx={100} cy={85} r={44} fill={hot} opacity={glow * Math.min(1, frame / (0.4 * fps))} />
      <path d="M70 120 C55 105 52 92 52 80 a48 48 0 0 1 96 0 c0 12 -3 25 -18 40 v20 h-60 z" stroke={ink} strokeWidth={7} strokeDasharray={420} strokeDashoffset={draw(frame, fps, 0, 0.6, 420)} />
      <line x1={76} y1={160} x2={124} y2={160} stroke={ink} strokeWidth={7} />
      <line x1={84} y1={178} x2={116} y2={178} stroke={ink} strokeWidth={7} />
      {[-60, -30, 0, 30, 60].map((a, i) => {
        const r = 64 + (Math.sin(t * 3 + i) + 1) * 4;
        return <line key={a} x1={0} y1={-r} x2={0} y2={-r - 14} stroke={hot} strokeWidth={6} transform={`translate(100 82) rotate(${a})`} opacity={Math.min(1, pop(frame, fps, 0.4 + i * 0.06))} />;
      })}
    </Svg>
  );
};

const Magnifier: React.FC<P> = ({ink, hot, size = 240}) => {
  const {frame, fps, t} = useT();
  const x = Math.sin(t * 1.4) * 22;
  const y = Math.cos(t * 1.1) * 12;
  return (
    <Svg size={size}>
      <rect x={35} y={30} width={130} height={150} rx={10} stroke={ink} strokeWidth={5} opacity={0.45} />
      {[60, 85, 110, 135].map((yy) => (
        <line key={yy} x1={55} y1={yy} x2={145} y2={yy} stroke={ink} strokeWidth={5} opacity={0.35} />
      ))}
      <g transform={`translate(${x} ${y})`} opacity={Math.min(1, pop(frame, fps, 0.1))}>
        <circle cx={92} cy={92} r={36} stroke={hot} strokeWidth={9} fill="#ffffff55" />
        <line x1={118} y1={118} x2={150} y2={150} stroke={hot} strokeWidth={12} />
      </g>
    </Svg>
  );
};

const Handshake: React.FC<P> = ({ink, hot, size = 240}) => {
  // a row of people: the investors being pitched; the middle one is the accent
  const {frame, fps, t} = useT();
  return (
    <Svg size={size}>
      {[0, 1, 2].map((i) => {
        const p = pop(frame, fps, 0.1 + i * 0.12);
        const x = 45 + i * 55;
        const c = i === 1 ? hot : ink;
        const bob = Math.sin(t * 2.2 + i * 1.3) * 3;
        return (
          <g key={i} opacity={Math.min(1, p)} transform={`translate(0 ${interpolate(p, [0, 1], [30, 0]) + bob})`}>
            <circle cx={x} cy={i === 1 ? 70 : 85} r={i === 1 ? 24 : 19} stroke={c} strokeWidth={7} fill={i === 1 ? hot : 'none'} />
            <path d={i === 1 ? `M${x - 40} 165 a40 44 0 0 1 80 0` : `M${x - 32} 165 a32 36 0 0 1 64 0`} stroke={c} strokeWidth={7} />
          </g>
        );
      })}
      <line x1={20} y1={178} x2={180} y2={178} stroke={ink} strokeWidth={5} opacity={0.4} />
    </Svg>
  );
};

const MAP: Record<IconName, React.FC<P>> = {
  doc: Doc,
  bars: Bars,
  coin: Coin,
  phone: Phone,
  xstamp: XStamp,
  check: Check,
  pin: Pin,
  clock: Clock,
  bulb: Bulb,
  magnifier: Magnifier,
  handshake: Handshake,
};

export const Icon: React.FC<P & {name: IconName}> = ({name, ...p}) => {
  const C = MAP[name];
  return <C {...p} />;
};
