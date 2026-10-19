// Animated line icons: charcoal strokes, one purple moving part each. `t` = seconds since the icon appeared.
import React from 'react';
import {interpolate} from 'remotion';
import {clamp, mt} from './theme';

const I = mt.c.ink;
const H = mt.c.hot;
const sw = {stroke: I, strokeWidth: 4, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
const e = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {...clamp, easing: mt.ease.out});

type P = {t: number};

const Doc: React.FC<P> = ({t}) => {
  const lines = [0, 1, 2, 3];
  const stamp = e(t, 1.2, 1.5);
  return (
    <g>
      <path d="M24 8 H64 L80 24 V92 H24 Z" {...sw} fill={mt.c.white} />
      <path d="M64 8 V24 H80" {...sw} />
      {lines.map((i) => (
        <line key={i} x1={33} y1={36 + i * 12} x2={33 + 38 * e(t, 0.15 + i * 0.22, 0.45 + i * 0.22)} y2={36 + i * 12} {...sw} strokeWidth={3.5} />
      ))}
      <g opacity={stamp} transform={`translate(66 76) scale(${interpolate(stamp, [0, 1], [1.6, 1])})`}>
        <circle r={15} fill={H} />
        <path d="M-7 0 L-2 5 L7 -5" stroke={mt.c.white} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

const Phone: React.FC<P> = ({t}) => {
  const buzz = Math.sin(t * 40) * (Math.sin(t * 3) > 0.6 ? 2 : 0);
  return (
    <g transform={`translate(${buzz} 0)`}>
      <rect x={30} y={8} width={40} height={84} rx={8} {...sw} fill={mt.c.white} />
      <line x1={45} y1={83} x2={55} y2={83} {...sw} />
      {[0, 1].map((i) => (
        <rect key={i} x={i ? 42 : 36} y={24 + i * 18} width={22} height={12} rx={5} fill={i ? H : I} opacity={e(t, 0.3 + i * 0.4, 0.6 + i * 0.4)} />
      ))}
      <circle cx={70} cy={12} r={8 * e(t, 1.1, 1.4)} fill={H} />
    </g>
  );
};

const Truck: React.FC<P> = ({t}) => {
  const rot = t * 360;
  const dash = (t * 40) % 20;
  return (
    <g>
      <rect x={6} y={30} width={56} height={38} rx={3} {...sw} fill={mt.c.white} />
      <path d="M62 42 H80 L92 56 V68 H62 Z" {...sw} fill={mt.c.white} />
      <path d="M22 42 l6 6 m0 -6 l-6 6" stroke={H} strokeWidth={3} />
      {[24, 78].map((x) => (
        <g key={x} transform={`translate(${x} 72) rotate(${rot})`}>
          <circle r={8} {...sw} fill={mt.c.white} />
          <line x1={0} y1={-8} x2={0} y2={8} stroke={I} strokeWidth={3} />
        </g>
      ))}
      <line x1={0} y1={86} x2={100} y2={86} stroke={I} strokeWidth={3} strokeDasharray="10 10" strokeDashoffset={dash} />
    </g>
  );
};

const Bank: React.FC<P> = ({t}) => {
  const drop = interpolate((t % 2) / 2, [0, 0.5, 1], [-10, 18, 18], clamp);
  return (
    <g>
      <path d="M10 36 L50 12 L90 36 Z" {...sw} fill={mt.c.white} />
      {[22, 40, 58, 76].map((x) => (
        <line key={x} x1={x} y1={42} x2={x} y2={78} {...sw} />
      ))}
      <line x1={10} y1={84} x2={90} y2={84} {...sw} />
      <circle cx={50} cy={drop} r={6} fill={H} opacity={(t % 2) < 1 ? 1 : 0} />
    </g>
  );
};

const Calendar: React.FC<P> = ({t}) => {
  const flip = Math.floor(t / 0.8) % 10;
  return (
    <g>
      <rect x={14} y={18} width={72} height={70} rx={6} {...sw} fill={mt.c.white} />
      <rect x={14} y={18} width={72} height={18} rx={6} fill={H} />
      <line x1={32} y1={10} x2={32} y2={24} {...sw} />
      <line x1={68} y1={10} x2={68} y2={24} {...sw} />
      {Array.from({length: 10}).map((_, i) => (
        <rect key={i} x={22 + (i % 5) * 12} y={46 + Math.floor(i / 5) * 16} width={8} height={8} rx={2} fill={i <= flip ? I : mt.c.line} />
      ))}
    </g>
  );
};

const Bars: React.FC<P> = ({t}) => (
  <g>
    <line x1={10} y1={88} x2={92} y2={88} {...sw} />
    {[0, 1, 2, 3].map((i) => {
      const h = (18 + i * 18) * e(t, 0.1 + i * 0.12, 0.7 + i * 0.12);
      return <rect key={i} x={16 + i * 19} y={86 - h} width={13} height={h} rx={2} fill={i === 3 ? H : I} />;
    })}
    <path d={`M14 60 L40 46 L60 50 L88 20`} {...sw} stroke={H} strokeDasharray={120} strokeDashoffset={120 * (1 - e(t, 0.6, 1.4))} />
  </g>
);

const Coin: React.FC<P> = ({t}) => {
  const c = Math.cos(t * 2.2);
  const sx = Math.sign(c || 1) * Math.max(0.25, Math.abs(c));
  return (
    <g transform={`translate(50 50) scale(${sx} 1)`}>
      <circle r={34} {...sw} fill={mt.c.white} />
      <circle r={26} stroke={H} strokeWidth={3} fill="none" />
      <text x={0} y={12} textAnchor="middle" fontFamily={mt.f.head} fontSize={34} fill={I}>
        ₦
      </text>
    </g>
  );
};

const Shop: React.FC<P> = ({t}) => {
  const swing = Math.sin(t * 2.4) * 8;
  return (
    <g>
      <rect x={16} y={40} width={68} height={48} {...sw} fill={mt.c.white} />
      <path d="M10 40 L18 20 H82 L90 40 Z" {...sw} fill={H} stroke={I} />
      <rect x={42} y={60} width={16} height={28} {...sw} />
      <g transform={`translate(50 40) rotate(${swing})`}>
        <line x1={0} y1={0} x2={0} y2={6} stroke={I} strokeWidth={2} />
        <rect x={-10} y={6} width={20} height={9} rx={2} fill={I} />
      </g>
    </g>
  );
};

const Pin: React.FC<P> = ({t}) => {
  const y = interpolate(t, [0, 0.35, 0.5, 0.6], [-30, 0, -6, 0], clamp);
  const r = ((t % 1.6) / 1.6) * 30;
  return (
    <g>
      <ellipse cx={50} cy={86} rx={r} ry={r * 0.3} stroke={H} strokeWidth={2.5} fill="none" opacity={1 - r / 30} />
      <g transform={`translate(0 ${y})`}>
        <path d="M50 84 C30 58 24 46 24 36 A26 26 0 0 1 76 36 C76 46 70 58 50 84 Z" {...sw} fill={mt.c.white} />
        <circle cx={50} cy={36} r={9} fill={H} />
      </g>
    </g>
  );
};

const Gear: React.FC<P> = ({t}) => {
  const tooth = (cx: number, cy: number, r: number, n: number, rot: number, fill: string) => (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      {Array.from({length: n}).map((_, i) => (
        <rect key={i} x={-4} y={-r - 7} width={8} height={10} fill={fill} transform={`rotate(${(360 / n) * i})`} />
      ))}
      <circle r={r} {...sw} fill={mt.c.white} stroke={fill} />
      <circle r={r * 0.35} {...sw} stroke={fill} />
    </g>
  );
  return (
    <g>
      {tooth(38, 56, 22, 8, t * 60, I)}
      {tooth(74, 30, 14, 6, -t * 60 * 1.5 + 15, H)}
    </g>
  );
};

const Plate: React.FC<P> = ({t}) => {
  const w = Math.sin(t * 3) * 4;
  return (
    <g transform={`rotate(${w} 50 60)`}>
      <ellipse cx={50} cy={62} rx={40} ry={14} {...sw} fill={mt.c.white} />
      <ellipse cx={50} cy={60} rx={24} ry={7} stroke={I} strokeWidth={2.5} fill="none" />
      <line x1={14} y1={24} x2={14} y2={44} {...sw} />
      <line x1={86} y1={24} x2={86} y2={44} {...sw} />
      <path d="M40 30 L60 46 M60 30 L40 46" stroke={H} strokeWidth={4} strokeLinecap="round" opacity={e(t, 0.5, 0.8)} />
    </g>
  );
};

const Cold: React.FC<P> = ({t}) => (
  <g>
    <rect x={14} y={20} width={72} height={70} rx={4} {...sw} fill={mt.c.white} />
    <line x1={50} y1={20} x2={50} y2={90} {...sw} />
    <g transform={`translate(50 52) rotate(${t * 40})`}>
      {[0, 60, 120].map((a) => (
        <line key={a} x1={0} y1={-16} x2={0} y2={16} stroke={H} strokeWidth={4} strokeLinecap="round" transform={`rotate(${a})`} />
      ))}
    </g>
  </g>
);

const Bulb: React.FC<P> = ({t}) => {
  const g = 0.5 + 0.5 * Math.sin(t * 3);
  return (
    <g>
      {[0, 45, 90, 135, 180].map((a) => (
        <line key={a} x1={50} y1={10} x2={50} y2={2} stroke={H} strokeWidth={4} strokeLinecap="round" transform={`rotate(${a - 90} 50 40)`} opacity={g} />
      ))}
      <circle cx={50} cy={40} r={20} fill={H} opacity={0.15 + g * 0.25} />
      <path d="M38 58 C30 50 28 44 28 38 A22 22 0 0 1 72 38 C72 44 70 50 62 58 V68 H38 Z" {...sw} />
      <line x1={40} y1={76} x2={60} y2={76} {...sw} />
    </g>
  );
};

const People: React.FC<P> = ({t}) => (
  <g>
    {[0, 1, 2].map((i) => {
      const p = e(t, i * 0.25, i * 0.25 + 0.4);
      const x = 22 + i * 28;
      return (
        <g key={i} opacity={p} transform={`translate(0 ${(1 - p) * 10})`}>
          <circle cx={x} cy={40} r={10} {...sw} fill={i === 2 ? H : mt.c.white} stroke={i === 2 ? H : I} />
          <path d={`M${x - 15} 80 C${x - 15} 62 ${x + 15} 62 ${x + 15} 80`} {...sw} />
        </g>
      );
    })}
  </g>
);

const Door: React.FC<P> = ({t}) => {
  const open = e(t, 0.6, 1.4);
  return (
    <g>
      <rect x={22} y={8} width={56} height={84} {...sw} />
      <rect x={26} y={12} width={48 * (1 - open * 0.7)} height={76} fill={mt.c.white} stroke={I} strokeWidth={3} />
      <circle cx={26 + 48 * (1 - open * 0.7) - 8} cy={52} r={3.5} fill={H} />
    </g>
  );
};

const Magnifier: React.FC<P> = ({t}) => {
  const x = Math.sin(t * 1.6) * 12;
  const y = Math.cos(t * 1.2) * 8;
  return (
    <g>
      <rect x={14} y={14} width={60} height={74} rx={4} {...sw} fill={mt.c.white} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={24} y1={30 + i * 14} x2={62} y2={30 + i * 14} stroke={mt.c.line} strokeWidth={4} />
      ))}
      <g transform={`translate(${56 + x} ${52 + y})`}>
        <circle r={16} stroke={H} strokeWidth={5} fill="rgba(255,255,255,0.6)" />
        <line x1={11} y1={11} x2={26} y2={26} stroke={H} strokeWidth={6} strokeLinecap="round" />
      </g>
    </g>
  );
};

const Clock: React.FC<P> = ({t}) => (
  <g>
    <circle cx={50} cy={52} r={36} {...sw} fill={mt.c.white} />
    <line x1={50} y1={52} x2={50} y2={30} {...sw} transform={`rotate(${t * 30} 50 52)`} />
    <line x1={50} y1={52} x2={50} y2={24} stroke={H} strokeWidth={3.5} strokeLinecap="round" transform={`rotate(${t * 180} 50 52)`} />
    <circle cx={50} cy={52} r={4} fill={I} />
  </g>
);

const Sewing: React.FC<P> = ({t}) => {
  const n = Math.abs(Math.sin(t * 8)) * 10;
  return (
    <g>
      <path d="M12 80 H88 M20 80 V40 Q20 28 32 28 H80 V48 H40 V80" {...sw} fill={mt.c.white} />
      <rect x={66} y={48} width={10} height={10} fill={I} />
      <line x1={71} y1={58} x2={71} y2={66 + n} stroke={H} strokeWidth={3} strokeLinecap="round" />
      <line x1={50} y1={80} x2={96} y2={80} stroke={H} strokeWidth={3} strokeDasharray="6 5" strokeDashoffset={-t * 30} />
    </g>
  );
};

const Shield: React.FC<P> = ({t}) => (
  <g>
    <path d="M50 8 L84 20 V46 C84 68 70 82 50 92 C30 82 16 68 16 46 V20 Z" {...sw} fill={mt.c.white} />
    <path d="M34 50 L46 62 L68 38" stroke={H} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={60} strokeDashoffset={60 * (1 - e(t, 0.4, 1))} />
  </g>
);

const Factory: React.FC<P> = ({t}) => (
  <g>
    <path d="M10 88 V48 L32 60 V48 L54 60 V48 L76 60 V22 H90 V88 Z" {...sw} fill={mt.c.white} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={20 + i * 22} y={70} width={10} height={9} fill={Math.floor(t * 2) % 3 >= i ? H : mt.c.line} />
    ))}
    <circle cx={83} cy={14 - ((t * 10) % 12)} r={4} fill={I} opacity={0.5} />
  </g>
);

const MAP: Record<string, React.FC<P>> = {
  doc: Doc,
  phone: Phone,
  truck: Truck,
  bank: Bank,
  calendar: Calendar,
  bars: Bars,
  coin: Coin,
  shop: Shop,
  pin: Pin,
  gear: Gear,
  plate: Plate,
  cold: Cold,
  bulb: Bulb,
  people: People,
  door: Door,
  magnifier: Magnifier,
  clock: Clock,
  sewing: Sewing,
  shield: Shield,
  factory: Factory,
};

export const Icon: React.FC<{k: string; t: number; size?: number}> = ({k, t, size = 200}) => {
  const C = MAP[k];
  if (!C) throw new Error(`unknown icon ${k}`);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', display: 'block'}}>
      <C t={Math.max(0, t)} />
    </svg>
  );
};
