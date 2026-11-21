import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../theme';

export const MV2_SECONDS = 81.7;
const INK = '#333333', HOT = '#800080', BG = '#E9E2E9';
const HOT2 = '#B04DB0', TXT = '#F6F1F6', DIM = '#B9AFB9', PANEL = '#3C3A3C', PANEL2 = '#4A474A', EDGE = 'rgba(246,241,246,0.13)';
const H = 'Poppins, Helvetica, Arial, sans-serif', B = 'Inter, Helvetica, Arial, sans-serif';
const OUT = Easing.bezier(0.16, 1, 0.3, 1), IO = Easing.bezier(0.65, 0, 0.35, 1), POP = Easing.bezier(0.34, 1.5, 0.64, 1);
const A = (t: number, a: number, b: number, f = 0, to = 1, e = OUT) => interpolate(t, [a, b], [f, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

const PW = 330, PH = 310, GAP = 40, BW = 1520, BH = 1150;
const pc = (i: number) => ({x: 40 + (i % 4) * (PW + GAP), y: 100 + Math.floor(i / 4) * (PH + GAP)});
const ctr = (i: number) => ({x: pc(i).x + PW / 2, y: pc(i).y + PH / 2});

// Shots follow the voiceover's sentence starts (from silence detection).
type Shot = {t: number; fx: number; fy: number; s: number};
const mid = (a: number, b: number) => ({x: (ctr(a).x + ctr(b).x) / 2, y: (ctr(a).y + ctr(b).y) / 2});
const ov = {x: BW / 2, y: BH / 2};
const sp = (t: number, i: number, s = 2.7): Shot => ({t, fx: ctr(i).x, fy: ctr(i).y, s});
const SHOTS: Shot[] = [
  {t: 0, fx: ov.x, fy: ov.y, s: 0.66},
  sp(3.5, 1), sp(6.34, 0), sp(10.92, 2), sp(13.37, 3), sp(19.87, 4), sp(27.05, 5), sp(32.21, 6), sp(34.99, 7),
  sp(41.09, 8), sp(43.24, 9), sp(51.31, 10), sp(55.31, 11),
  {t: 59.83, fx: mid(8, 9).x, fy: mid(8, 9).y, s: 1.42},
  {t: 62.6, fx: mid(10, 11).x, fy: mid(10, 11).y, s: 1.42},
  {t: 66.5, fx: ov.x, fy: ov.y, s: 0.66},
];
const PANEL_T = [6.34, 3.5, 10.92, 13.37, 19.87, 27.05, 32.21, 34.99, 41.09, 43.24, 51.31, 55.31]; // when each panel is first spoken about

const cam = (t: number) => {
  let i = 0;
  while (i < SHOTS.length - 1 && t >= SHOTS[i + 1].t - 0.55) i++;
  const cur = SHOTS[i];
  const prev = SHOTS[Math.max(0, i - 1)];
  const p = i === 0 ? 1 : A(t, cur.t - 0.55, cur.t + 0.45, 0, 1, IO);
  const drift = A(t, cur.t, (SHOTS[i + 1]?.t ?? cur.t + 8), 0, 0.07, Easing.linear) * (cur.s > 1 ? 1 : 0.4);
  const L = (a: number, b: number) => a + (b - a) * p;
  const jump = i === 0 ? 0 : Math.sin(Math.PI * p);
  const intro = A(t, 0, 1.6, 1, 0, OUT);
  return {
    fx: L(prev.fx, cur.fx), fy: L(prev.fy, cur.fy),
    s: L(prev.s, cur.s) * (1 + drift) * (0.9 + 0.1 * (1 - intro)),
    rz: -6 * intro + Math.sin(t * 0.5) * 0.35 * (cur.s > 1 ? 1 : 0),
    blur: 16 * intro + 6 * jump,
    tx: 12 * intro,
  };
};

// ---------- animated icons (pure functions of local time u, seconds) ----------
const sw = {fill: 'none', stroke: TXT, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
const sf = {stroke: TXT, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
const Naira: React.FC<{c?: string; w?: number}> = ({c = TXT, w = 7}) => (<g stroke={c} strokeWidth={w} strokeLinecap="round" fill="none"><path d="M-13 15 V-15 L13 15 V-15" /><path d="M-19 -4 H19 M-19 6 H19" strokeWidth={w - 2} /></g>);

const PalmTree: React.FC<{u: number}> = ({u}) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <path d="M92 190 Q104 140 98 80" {...sw} strokeWidth={9} />
    {[-160, -125, -90, -55, -20, 15].map((ang, k) => (
      <g key={k} transform={`translate(98 78) rotate(${ang + 4 * Math.sin(u * 2.2 + k)})`} opacity={A(u, 0.2 + k * 0.08, 0.7 + k * 0.08)}>
        <path d="M0 0 Q36 -34 78 -6" {...sw} fill={PANEL2} strokeWidth={5} />
      </g>
    ))}
    {[[90, 90], [105, 92], [98, 104]].map(([x, y], k) => (<circle key={k} cx={x} cy={y} r={9 * A(u, 0.9 + k * 0.18, 1.3 + k * 0.18, 0, 1, POP)} fill={HOT2} stroke={TXT} strokeWidth={3} />))}
    {[0, 1, 2].map((k) => { const ph = ((u * 0.6 + k / 3) % 1); return <circle key={k} cx={96 + k * 8} cy={104 + ph * 80} r={5} fill={HOT2} opacity={u > 1.6 ? 1 - ph : 0} />; })}
  </svg>
);
const OilDrop: React.FC<{u: number}> = ({u}) => {
  const lvl = 188 - 150 * A(u, 0.4, 2.6, 0, 0.85, IO);
  const pts = Array.from({length: 21}, (_, i) => `${i * 10},${lvl + 5 * Math.sin(i * 0.55 + u * 4.5)}`).join(' ');
  const d = 'M100 18 C100 18 38 92 38 132 A62 62 0 0 0 162 132 C162 92 100 18 100 18 Z';
  return (<svg viewBox="0 0 200 200" width="100%" height="100%"><defs><clipPath id="od"><path d={d} /></clipPath></defs>
    <path d={d} fill={PANEL2} /><g clipPath="url(#od)"><polygon points={`0,200 ${pts} 200,200`} fill={HOT2} /><polygon points={`0,200 ${pts} 200,200`} fill="#fff" opacity={0.08} transform="translate(8 -6)" /></g>
    <path d={d} {...sw} /><path d="M70 120 Q72 100 86 90" stroke={TXT} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} /></svg>);
};
const Barrel: React.FC<{u: number}> = ({u}) => {
  const lvl = 170 - 112 * A(u, 0.3, 2.4, 0, 0.9, IO);
  return (<svg viewBox="0 0 200 200" width="100%" height="100%"><defs><clipPath id="br"><rect x="52" y="36" width="96" height="140" rx="14" /></clipPath></defs>
    <rect x="52" y="36" width="96" height="140" rx="14" fill={PANEL2} /><g clipPath="url(#br)"><rect x="52" y={lvl} width="96" height="140" fill={HOT2} /></g>
    <rect x="52" y="36" width="96" height="140" rx="14" {...sw} /><path d="M52 66 H148 M52 146 H148" {...sw} strokeWidth={5} /><path d="M80 24 H120" {...sw} />
    <g transform={`translate(100 ${106 + 2 * Math.sin(u * 3)})`} opacity={A(u, 1.8, 2.3)}><Naira c={TXT} w={6} /></g></svg>);
};
const Factory: React.FC<{u: number}> = ({u}) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    {[0, 1, 2].map((k) => { const ph = (u * 0.5 + k / 3) % 1; return <circle key={k} cx={52 + 18 * ph} cy={44 - 44 * ph} r={7 + 11 * ph} fill={TXT} opacity={0.75 * (1 - ph) * A(u, 0.5, 0.9)} />; })}
    <path d="M26 172 V92 L72 68 V92 L118 68 V92 L164 68 V172 Z" fill={PANEL2} {...sf} /><rect x="44" y="54" width="16" height="48" fill={PANEL2} stroke={TXT} strokeWidth={5} />
    {[42, 82, 122].map((x, k) => (<rect key={k} x={x} y={112} width={24} height={18} fill={HOT2} opacity={A(u, 0.6 + k * 0.25, 0.85 + k * 0.25) * (0.75 + 0.25 * Math.sin(u * 3 + k))} />))}
    <rect x="84" y="142" width="26" height="30" fill={INK} stroke={TXT} strokeWidth={4} /><path d="M26 172 H164" {...sw} />
    <g transform={`translate(${(u * 40) % 60 - 10} 0)`} opacity={A(u, 1.2, 1.6)}><rect x="-4" y="178" width="14" height="10" rx="3" fill={HOT2} /></g>
  </svg>);
const Truck: React.FC<{u: number}> = ({u}) => {
  const wheel = (cx: number) => (<g transform={`rotate(${u * 520} ${cx} 132)`}><circle cx={cx} cy={132} r={19} fill={PANEL2} stroke={TXT} strokeWidth={5} /><path d={`M${cx} 118 V146 M${cx - 14} 132 H${cx + 14}`} stroke={TXT} strokeWidth={4} /></g>);
  const x = A(u, 0, 0.9, -240, 0);
  return (<svg viewBox="0 0 200 200" width="100%" height="100%"><g transform={`translate(${x} ${Math.sin(u * 22) * 1.2})`}>
    <path d={`M10 160 H190`} {...sw} /><path d="M10 176 H190" stroke={DIM} strokeWidth={4} strokeDasharray="22 20" strokeDashoffset={-u * 180} />
    {[84, 104, 124].map((y, k) => (<path key={k} d={`M${6 - ((u * 60 + k * 12) % 26)} ${y} h24`} stroke={HOT2} strokeWidth={5} strokeLinecap="round" opacity={0.8} />))}
    <rect x="30" y="52" width="92" height="76" rx="6" fill={PANEL2} {...sf} /><path d="M30 84 H122" stroke={HOT2} strokeWidth={12} />
    <path d="M122 76 H152 L176 104 V128 H122 Z" fill={PANEL2} {...sf} /><path d="M130 84 H148 L162 102 H130 Z" fill={INK} /><path d="M30 128 H176" {...sw} />
    {wheel(64)}{wheel(148)}</g></svg>);
};
const Coin: React.FC<{u: number}> = ({u}) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%"><g transform={`translate(100 ${100 - 6 * Math.sin(u * 2.6)})`}>
    <g transform={`scale(${Math.max(0.05, Math.abs(Math.cos(u * 3.2)))} 1)`}><circle r={66} fill={PANEL2} stroke={TXT} strokeWidth={6} /><circle r={52} fill="none" stroke={DIM} strokeWidth={3} strokeDasharray="3 9" /><circle r={36} fill={HOT} /><g transform="scale(1.5)"><Naira w={6} /></g></g></g>
    {[[164, 36, 0], [30, 156, 0.7]].map(([x, y, d], k) => (<path key={k} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * Math.sin(u * 4 + d * 3)}) rotate(${u * 60})`} d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill={HOT2} />))}</svg>);
const Note: React.FC<{u: number}> = ({u}) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%"><defs><clipPath id="nt"><rect x="24" y="58" width="152" height="88" rx="8" /></clipPath></defs>
    <g transform={`translate(0 ${-6 * Math.sin(u * 2.2)}) rotate(${3 * Math.sin(u * 1.6)} 100 100)`}>
      <rect x="38" y="52" width="140" height="84" rx="8" fill={PANEL} stroke={TXT} strokeWidth={4} /><rect x="24" y="58" width="152" height="88" rx="8" fill={PANEL2} stroke={TXT} strokeWidth={6} />
      <rect x="36" y="70" width="128" height="64" rx="4" fill="none" stroke={DIM} strokeWidth={3} strokeDasharray="8 8" /><circle cx="100" cy="102" r="26" fill={HOT} /><g transform="translate(100 102) scale(0.8)"><Naira w={6} /></g>
      <circle cx="52" cy="102" r="6" fill={TXT} /><circle cx="148" cy="102" r="6" fill={TXT} />
      <g clipPath="url(#nt)"><path d={`M${-20 + ((u * 80) % 260)} 50 l20 0 l-20 110 l-20 0 z`} fill={TXT} opacity={0.18} /></g></g></svg>);
const Doc: React.FC<{u: number}> = ({u}) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%"><path d="M46 18 H122 L160 56 V182 H46 Z" fill={PANEL2} {...sf} /><path d="M122 18 V56 H160" {...sw} />
    {[82, 104, 126].map((y, k) => (<path key={k} d={`M64 ${y} H${64 + (k === 2 ? 48 : 76) * A(u, 0.3 + k * 0.4, 0.9 + k * 0.4)}`} stroke={TXT} strokeWidth={5} strokeLinecap="round" />))}
    <g transform={`translate(138 150) rotate(${-6 + 6 * (1 - A(u, 1.6, 1.9))}) scale(${A(u, 1.6, 1.9, 2.2, 1, Easing.bezier(0.7, 0, 0.84, 0))})`} opacity={A(u, 1.6, 1.75)}>
      <circle r={26} fill={HOT2} /><path d="M-12 0 L-3 9 L13 -10" stroke={TXT} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g></svg>);
const Pin: React.FC<{u: number}> = ({u}) => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    {[0, 1].map((k) => { const ph = ((u - 0.9) * 0.65 + k * 0.5); const p = ph % 1; return u > 0.9 ? <ellipse key={k} cx={100} cy={170} rx={30 + 50 * p} ry={8 + 12 * p} fill="none" stroke={HOT2} strokeWidth={4} opacity={1 - p} /> : null; })}
    <g transform={`translate(0 ${-150 * (1 - A(u, 0.1, 0.9, 0, 1, Easing.bounce))})`}><path d="M100 20 C70 20 52 42 52 68 C52 100 100 152 100 152 C100 152 148 100 148 68 C148 42 130 20 100 20 Z" fill={PANEL2} {...sf} /><circle cx={100} cy={68} r={17} fill={HOT2} /></g></svg>);

// ---------- charts ----------
const Bars: React.FC<{u: number; w: number; h: number; n?: number}> = ({u, w, h, n = 10}) => {
  const vals = Array.from({length: n}, (_, i) => 0.28 + 0.07 * i + 0.05 * Math.sin(i * 2.1));
  const bw = w / n;
  return (<svg width={w} height={h} style={{overflow: 'visible'}}><path d={`M0 0 V${h} H${w}`} fill="none" stroke={DIM} strokeWidth={2} opacity={A(u, 0, 0.4)} />
    {vals.map((v, i) => { const g = A(u, 0.3 + i * 0.1, 1.0 + i * 0.1, 0, 1, POP); const ht = (h - 8) * v * g; return <rect key={i} x={i * bw + 4} y={h - ht} width={bw - 8} height={ht} rx={4} fill={i >= n - 3 ? HOT2 : '#7B6F7B'} />; })}
    <polyline fill="none" stroke={TXT} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" points={vals.map((v, i) => `${i * bw + bw / 2},${h - (h - 8) * v - 14}`).join(' ')} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - A(u, 1.1, 2.4, 0, 1, IO)} /></svg>);
};
const LineG: React.FC<{u: number; w: number; h: number}> = ({u, w, h}) => {
  const ys = [0.12, 0.22, 0.18, 0.4, 0.34, 0.55, 0.62, 0.8, 0.9];
  const P = ys.map((y, i) => [i * (w / (ys.length - 1)), h - y * h] as const);
  const d = P.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const g = A(u, 0.4, 2.8, 0, 1, IO);
  const seg = g * (P.length - 1), i0 = Math.min(Math.floor(seg), P.length - 2), f = seg - i0;
  const rx = P[i0][0] + (P[i0 + 1][0] - P[i0][0]) * f, ry = P[i0][1] + (P[i0 + 1][1] - P[i0][1]) * f;
  return (<svg width={w} height={h} style={{overflow: 'visible'}}><path d={`M0 0 V${h} H${w}`} fill="none" stroke={DIM} strokeWidth={2} />
    <path d={`${d} V${h} H0 Z`} fill={HOT2} opacity={0.22 * A(u, 2.0, 3.0)} /><path d={d} fill="none" stroke={HOT2} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - g} />
    <circle cx={rx} cy={ry} r={9} fill={TXT} stroke={HOT} strokeWidth={4} opacity={g > 0 ? 1 : 0} />
    {u > 2.8 && <circle cx={P[8][0]} cy={P[8][1]} r={9 + 14 * ((u * 0.8) % 1)} fill="none" stroke={HOT2} strokeWidth={3} opacity={1 - ((u * 0.8) % 1)} />}</svg>);
};
const Pie: React.FC<{u: number}> = ({u}) => {
  const parts = [{v: 0.48, c: HOT2}, {v: 0.32, c: '#8C7E8C'}, {v: 0.2, c: '#5E555E'}];
  const R = 40, C = 2 * Math.PI * R; let acc = 0;
  return (<svg viewBox="0 0 200 200" width="100%" height="100%"><g transform="rotate(-90 100 100)">
    {parts.map((p, i) => { const st = acc; acc += p.v; const g = A(u, 0.3 + i * 0.5, 1.1 + i * 0.5, 0, 1, IO); const pop = i === 0 ? A(u, 2.0, 2.4, 0, 8, POP) : 0; const mid = (st + p.v / 2) * Math.PI * 2;
      return <circle key={i} cx={100} cy={100} r={R} fill="none" stroke={p.c} strokeWidth={80} strokeDasharray={`${Math.max(0.01, C * p.v * g - 2)} ${C}`} strokeDashoffset={-C * st} transform={`translate(${Math.cos(mid) * pop} ${Math.sin(mid) * pop})`} />; })}</g>
    <circle cx={100} cy={100} r={80} fill="none" stroke={TXT} strokeWidth={5} opacity={0.9} /></svg>);
};
const Check: React.FC<{u: number; items: string[]}> = ({u, items}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 7}}>{items.map((it, i) => { const g = A(u, 0.6 + i * 0.45, 1.0 + i * 0.45); return (
    <div key={it} style={{display: 'flex', alignItems: 'center', gap: 8, opacity: A(u, 0.3 + i * 0.15, 0.6 + i * 0.15)}}>
      <div style={{width: 20, height: 20, borderRadius: 10, background: g > 0.5 ? HOT2 : PANEL2, border: `1px solid ${EDGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.25 * Math.sin(Math.PI * g)})`}}>
        <svg width={12} height={12} viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" stroke={TXT} strokeWidth={2} fill="none" strokeLinecap="round" strokeDasharray={1} pathLength={1} strokeDashoffset={1 - g} /></svg></div>
      <div style={{fontFamily: B, fontSize: 13, color: TXT, fontWeight: 500}}>{it}</div></div>); })}</div>);

const Lbl: React.FC<{children: React.ReactNode; s?: number; c?: string; w?: number}> = ({children, s = 12, c = DIM, w = 500}) => <div style={{fontFamily: B, fontSize: s, color: c, fontWeight: w}}>{children}</div>;
const Big: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{fontFamily: H, fontSize: 40, color: TXT, fontWeight: 600, lineHeight: 1}}>{children}</div>;

const Panel: React.FC<{i: number; t: number; title: string; sub: string; children: (u: number) => React.ReactNode}> = ({i, t, title, sub, children}) => {
  const {x, y} = pc(i);
  const u = Math.max(0, t - PANEL_T[i] - 0.1);
  const on = t >= PANEL_T[i] - 0.4;
  const appear = A(t, 0.9 + i * 0.1, 1.6 + i * 0.1);
  const act = A(t, PANEL_T[i] - 0.5, PANEL_T[i] + 0.1) - A(t, PANEL_T[i] + 6, PANEL_T[i] + 8) * 0.0;
  return (<div style={{position: 'absolute', left: x, top: y, width: PW, height: PH, borderRadius: 20, background: PANEL, border: `1.5px solid ${act > 0.01 ? 'rgba(176,77,176,0.55)' : EDGE}`, boxSizing: 'border-box', padding: 18, opacity: appear, transform: `translateY(${(1 - appear) * 18}px)`, overflow: 'hidden', boxShadow: act > 0.01 ? '0 0 30px rgba(128,0,128,0.25)' : 'none'}}>
    <div style={{fontFamily: H, fontSize: 21, color: TXT, fontWeight: 600}}>{title}</div><Lbl s={12}>{sub}</Lbl>
    <div style={{position: 'absolute', left: 18, right: 18, top: 70, bottom: 14}}>{on ? children(u) : null}</div></div>);
};
const pad = (v: number, d = 0) => v.toFixed(d);

const Board: React.FC<{t: number}> = ({t}) => {
  const cu = (i: number, to: number, a = 0.5, b = 2.2, d = 0) => A(t, PANEL_T[i] + a, PANEL_T[i] + b, 0, to).toFixed(d);
  return (
    <div style={{position: 'relative', width: BW, height: BH, borderRadius: 48, background: '#2C2A2C', border: '4px solid #1E1C1E', boxShadow: '0 50px 100px rgba(51,40,51,0.45), 0 10px 24px rgba(51,40,51,0.35)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 74, borderBottom: `1px solid ${EDGE}`, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 16}}>
        <Img src={staticFile('mv/mark.png')} style={{width: 40, height: 40}} /><div style={{fontFamily: H, fontWeight: 600, fontSize: 24, color: TXT}}>Manetrust</div>
        <div style={{marginLeft: 30, width: 460, height: 38, borderRadius: 19, background: PANEL, border: `1px solid ${EDGE}`, display: 'flex', alignItems: 'center', padding: '0 18px'}}><Lbl s={14}>Search plans, outputs, financials</Lbl></div>
        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12}}><div style={{width: 40, height: 40, borderRadius: 20, background: HOT, color: TXT, fontFamily: B, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>PE</div><div><Lbl s={15} c={TXT} w={600}>Palm Estate</Lbl><Lbl s={11}>Plan workspace · sample data</Lbl></div></div>
      </div>
      <Panel i={0} t={t} title="Palm oil" sub="Crude oil extracted (sample)">{(u) => (<div style={{display: 'flex', gap: 10, height: '100%'}}><div style={{width: 130, height: 150}}><OilDrop u={u} /></div><div style={{paddingTop: 14}}><Big>{cu(0, 18.4, 0.5, 3, 1)}</Big><Lbl s={13}>thousand litres</Lbl><div style={{marginTop: 14, display: 'inline-block', padding: '4px 12px', borderRadius: 14, background: HOT, color: TXT, fontFamily: B, fontSize: 12, fontWeight: 600, opacity: A(u, 2.4, 2.8)}}>Grade A</div></div></div>)}</Panel>
      <Panel i={1} t={t} title="Harvest" sub="Fresh fruit bunches (sample)">{(u) => (<div style={{display: 'flex', gap: 10}}><div style={{width: 150, height: 170}}><PalmTree u={u} /></div><div style={{paddingTop: 20}}><Big>{cu(1, 240, 0.8, 3)}</Big><Lbl s={13}>bunches / week</Lbl></div></div>)}</Panel>
      <Panel i={2} t={t} title="Mill output" sub="Processing line (sample)">{(u) => (<div style={{display: 'flex', gap: 8}}><div style={{width: 140, height: 160}}><Factory u={u} /></div><div style={{paddingTop: 16}}><Big>{cu(2, 62, 0.6, 2.6)}<span style={{fontSize: 18, color: DIM}}>%</span></Big><Lbl s={13}>capacity used</Lbl><div style={{width: 110, height: 8, borderRadius: 4, background: PANEL2, marginTop: 12}}><div style={{width: 110 * A(u, 0.6, 2.6, 0, 0.62), height: 8, borderRadius: 4, background: HOT2}} /></div></div></div>)}</Panel>
      <Panel i={3} t={t} title="Delivery" sub="Oil to buyers (sample)">{(u) => (<div style={{position: 'relative', height: '100%'}}><div style={{width: 250, height: 150, marginLeft: 10}}><Truck u={u} /></div><div style={{position: 'absolute', right: 0, top: 6, width: 78, height: 78}}><Barrel u={u} /></div></div>)}</Panel>
      <Panel i={4} t={t} title="Output trend" sub="Monthly output (sample)">{(u) => (<div><div style={{marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: 8}}><Big>{cu(4, 124, 0.4, 2.6)}</Big><Lbl s={13} c={HOT2}>index, up</Lbl></div><Bars u={u} w={290} h={130} /></div>)}</Panel>
      <Panel i={5} t={t} title="Yield curve" sub="Yield per hectare (sample)">{(u) => (<div style={{paddingTop: 10}}><LineG u={u} w={282} h={150} /></div>)}</Panel>
      <Panel i={6} t={t} title="Cost split" sub="Where the money goes (sample)">{(u) => (<div style={{display: 'flex', gap: 10}}><div style={{width: 150, height: 150}}><Pie u={u} /></div><div style={{paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10}}>{[['Land', '48%', HOT2], ['Mill', '32%', '#8C7E8C'], ['Labour', '20%', '#5E555E']].map(([a, b, c], k) => (<div key={a} style={{opacity: A(u, 0.5 + k * 0.5, 1 + k * 0.5)}}><div style={{display: 'flex', alignItems: 'center', gap: 6}}><div style={{width: 10, height: 10, borderRadius: 5, background: c}} /><Lbl s={12}>{a}</Lbl></div><div style={{fontFamily: H, color: TXT, fontSize: 18, fontWeight: 600}}>{b}</div></div>))}</div></div>)}</Panel>
      <Panel i={7} t={t} title="Site" sub="Estate location (sample)">{(u) => (<div style={{position: 'relative', height: '100%'}}><div style={{position: 'absolute', inset: '0 0 0 0', display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gridTemplateRows: 'repeat(5,1fr)'}}>{Array.from({length: 50}).map((_, k) => { const c = k % 10, r = Math.floor(k / 10); return <div key={k} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{width: 10, height: 10, borderRadius: 5, background: Math.abs(c - 5) + Math.abs(r - 2) < 3 && u > 1.2 ? HOT2 : '#6A606A', transform: `scale(${A(u, 0.1 + (c + r) * 0.04, 0.5 + (c + r) * 0.04, 0.2, 1)})`}} /></div>; })}</div><div style={{position: 'absolute', left: 105, top: -14, width: 110, height: 110}}><Pin u={u} /></div></div>)}</Panel>
      <Panel i={8} t={t} title="Revenue" sub="Sales income (sample)">{(u) => (<div style={{display: 'flex', gap: 8}}><div style={{width: 140, height: 140}}><Note u={u} /></div><div style={{paddingTop: 16}}><Big><svg width={26} height={30} viewBox="-20 -20 40 40" style={{verticalAlign: 'middle', marginRight: 4}}><Naira w={5} /></svg>{cu(8, 48.2, 0.5, 3, 1)}<span style={{fontSize: 20}}>m</span></Big><Lbl s={13} c={HOT2}>per year, up</Lbl></div></div>)}</Panel>
      <Panel i={9} t={t} title="Profit" sub="After costs (sample)">{(u) => (<div style={{display: 'flex', gap: 8}}><div style={{width: 140, height: 140}}><Coin u={u} /></div><div style={{paddingTop: 16}}><Big><svg width={26} height={30} viewBox="-20 -20 40 40" style={{verticalAlign: 'middle', marginRight: 4}}><Naira w={5} /></svg>{cu(9, 17.6, 0.5, 3, 1)}<span style={{fontSize: 20}}>m</span></Big><Lbl s={13} c={HOT2}>36% margin</Lbl></div></div>)}</Panel>
      <Panel i={10} t={t} title="Projection" sub="Five-year outlook (sample)">{(u) => (<div style={{position: 'relative', paddingTop: 6}}><Bars u={u} w={290} h={140} n={8} /><div style={{position: 'absolute', right: 0, top: -6}}><Lbl s={12} c={HOT2}>5-year plan</Lbl></div></div>)}</Panel>
      <Panel i={11} t={t} title="Plan pack" sub="Documents ready">{(u) => (<div style={{display: 'flex', gap: 10}}><div style={{width: 96, height: 120}}><Doc u={u} /></div><Check u={u} items={['Business plan', 'Projections', 'Research', 'Proposal', 'Pitch deck']} /></div>)}</Panel>
    </div>
  );
};

export const MvVideo2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const c = cam(t);
  const boardOp = 1 - A(t, 74.4, 75.2, 0, 1, IO);
  const px = -(c.fx - BW / 2) * 0.03, py = -(c.fy - BH / 2) * 0.03;
  const paperScale = 1.14 + A(t, 0, 82, 0, 0.08, Easing.linear);
  const endA = A(t, 74.6, 75.3);
  const corner = A(t, 1.2, 1.8) * (1 - A(t, 74.6, 75.0));
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{transform: `translate(${px}px,${py}px) scale(${paperScale})`}}><Img src={staticFile('mv/paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill>
      <AbsoluteFill style={{opacity: boardOp, filter: `blur(${c.blur}px)`, perspective: 2200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: BW, height: BH, flex: 'none', transformOrigin: '50% 50%', transform: `translate(${(BW / 2 - c.fx) * c.s}px, ${(BH / 2 - c.fy) * c.s}px) rotateX(${c.tx}deg) rotateZ(${c.rz}deg) scale(${c.s})`}}><Board t={t} /></div>
      </AbsoluteFill>
      <Img src={staticFile('mv/mark.png')} style={{position: 'absolute', right: 56, top: 64, width: 96, height: 96, opacity: corner}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', opacity: endA}}>
        <Img src={staticFile('mv/logo.png')} style={{width: 560, transform: `scale(${A(t, 74.7, 75.8, 0.9, 1)})`, filter: 'drop-shadow(0 18px 24px rgba(51,40,51,0.25))'}} />
        <div style={{marginTop: 70, background: HOT, color: TXT, fontFamily: H, fontWeight: 800, fontSize: 70, lineHeight: 1.12, textAlign: 'center', padding: '34px 48px', borderRadius: 34, width: 860, boxSizing: 'border-box', transform: `translateY(${A(t, 75.1, 75.9, 40, 0)}px) scale(${A(t, 75.1, 75.9, 0.94, 1, POP)})`, opacity: A(t, 75.1, 75.6), boxShadow: '0 20px 40px rgba(128,0,128,0.28)'}}>DM us for your unique palm estate plan</div>
      </AbsoluteFill>
      <Audio src={staticFile('mv/bgm82.mp3')} volume={0.2} />
      <Audio src={staticFile('mv/vo.wav')} volume={1} />
      {SHOTS.slice(1).map((s) => (<Sequence key={s.t} from={Math.round((s.t - 0.5) * fps)}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.1} /></Sequence>))}
      <Sequence from={Math.round(75.1 * fps)}><Audio src={staticFile('sfx/pop.wav')} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};
