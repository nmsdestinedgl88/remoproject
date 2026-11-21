import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, interpolateColors, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../theme';

export const MV3_SECONDS = 86.7;
const INK = '#333333', HOT = '#800080', BG = '#E9E2E9', LIL = '#D0C5D3', PALE = '#ECE7EC', PLUM = '#7F2D7B', DARK = '#443F47', GREY = '#645B66';
const H = 'Poppins, Helvetica, Arial, sans-serif', MONO = 'JetBrains Mono, Menlo, monospace';
const OUT = Easing.bezier(0.16, 1, 0.3, 1), IO = Easing.bezier(0.65, 0, 0.35, 1), POP = Easing.bezier(0.34, 1.5, 0.64, 1);
const A = (t: number, a: number, b: number, f = 0, to = 1, e = OUT) => interpolate(t, [a, b], [f, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

// ---------------- geometry ----------------
const PX = 60, PY = 560, PWID = 960, PHT = 972; // dashboard panel on the 1080x1920 stage
const CARD = (i: number) => ({x: 42 + (i % 2) * 466, y: 48 + Math.floor(i / 2) * 311, w: 410, h: 254});
const cardCenter = (i: number) => ({x: PX + CARD(i).x + 205, y: PY + CARD(i).y + 127});
const SECV = {s: 1.08, x: 540, y: PY + PHT / 2};
const HOME_CARDS = [
  {label: 'PALM ESTATE', bg: PLUM, fg: '#fff', sec: PLUM},
  {label: 'OILS', bg: LIL, fg: HOT, sec: LIL},
  {label: 'BYPRODUCTS', bg: DARK, fg: '#fff', sec: DARK},
  {label: 'COSTS', bg: GREY, fg: '#fff', sec: PALE},
  {label: 'INVESTMENT', bg: HOT, fg: '#fff', sec: PALE},
  {label: 'YOUR PLAN', bg: PALE, fg: HOT, sec: PALE},
];

// ---------------- timeline (seconds on the final video; VO starts at 5.0) ----------------
const VO_AT = 5;
// section windows: [morphIn0, morphIn1, morphOut0, morphOut1]
const WIN: Record<number, [number, number, number, number]> = {
  0: [8.2, 9.4, 15.1, 15.9],
  1: [17.0, 18.1, 40.8, 41.5],
  2: [42.5, 43.4, 54.7, 55.4],
  3: [56.2, 57.1, 69.9, 70.6],
  4: [71.4, 72.3, 79.2, 79.9],
};
type KF = [number, number, number, number];
const OV: [number, number] = [540, 960];
const cc = (i: number): [number, number] => [cardCenter(i).x, cardCenter(i).y];
const KFS: KF[] = [
  [0, 1, ...OV], [7.0, 1, ...OV], [8.3, 2.15, ...cc(0)], [9.5, SECV.s, SECV.x, SECV.y], [15.1, SECV.s, SECV.x, SECV.y], [16.0, 1, ...OV],
  [17.0, 2.15, ...cc(1)], [18.2, SECV.s, SECV.x, SECV.y], [40.8, SECV.s, SECV.x, SECV.y], [41.6, 1, ...OV],
  [42.5, 2.15, ...cc(2)], [43.6, SECV.s, SECV.x, SECV.y], [54.7, SECV.s, SECV.x, SECV.y], [55.4, 1, ...OV],
  [56.2, 2.15, ...cc(3)], [57.2, SECV.s, SECV.x, SECV.y], [69.9, SECV.s, SECV.x, SECV.y], [70.6, 1, ...OV],
  [71.4, 2.15, ...cc(4)], [72.4, SECV.s, SECV.x, SECV.y], [79.2, SECV.s, SECV.x, SECV.y], [79.9, 1, ...OV], [90, 1, ...OV],
];
const camAt = (t: number) => {
  let i = 0;
  while (i < KFS.length - 2 && t > KFS[i + 1][0]) i++;
  const a = KFS[i], b = KFS[i + 1];
  const p = A(t, a[0], b[0], 0, 1, IO);
  const moving = Math.abs(a[1] - b[1]) > 0.2;
  const s = a[1] + (b[1] - a[1]) * p, x = a[2] + (b[2] - a[2]) * p, y = a[3] + (b[3] - a[3]) * p;
  const hold = !moving ? 1 + 0.025 * A(t, a[0], b[0], 0, 1, Easing.linear) : 1;
  return {s: s * hold, x, y, blur: moving ? 5 * Math.sin(Math.PI * p) : 0};
};
const morph = (i: number, t: number) => { const [a, b, c, d] = WIN[i]; return A(t, a, b, 0, 1, IO) * (1 - A(t, c, d, 0, 1, IO)); };

// ---------------- primitives ----------------
const ICON_AR: Record<string, number> = {drops2: 293 / 378, drop: 218 / 378, ffb: 306 / 378, groundnut: 262 / 278, sack: 254 / 278, efb: 252 / 278, shell: 373 / 350, frond: 285 / 350, sludge: 250 / 350, flag: 286 / 362, dozer: 330 / 362, seedling: 271 / 362};
// An icon cut from the user's sheet, recoloured with a mask and given its own idle motion.
const Ico: React.FC<{n: string; h: number; c: string; u: number; d?: number}> = ({n, h, c, u, d = 0}) => {
  const k = Math.max(0, u - d);
  const w = h * ICON_AR[n];
  const wipe = A(k, 0, 0.7, 100, 0);
  const pop = A(k, 0, 0.5, 0.82, 1, POP);
  const s = Math.sin;
  let tf = '', origin = '50% 50%', extra: React.ReactNode = null;
  switch (n) {
    case 'drops2': tf = `translateY(${s(k * 3) * 5}px) rotate(${s(k * 2) * 3}deg)`; break;
    case 'drop': tf = `translateY(${s(k * 3.2) * 6}px) scale(${1 + 0.03 * s(k * 6)})`; break;
    case 'ffb': tf = `rotate(${s(k * 2.2) * 4}deg) scale(${1 + 0.025 * s(k * 4)})`; origin = '80% 5%'; break;
    case 'groundnut': tf = `rotate(${s(k * 3) * 9}deg)`; break;
    case 'sack': tf = `scale(${1 + 0.03 * s(k * 4)}, ${1 - 0.04 * s(k * 4)})`; origin = '50% 100%'; break;
    case 'efb': tf = `rotate(${s(k * 9) * 2.5}deg) scale(${1 + 0.02 * s(k * 5)})`; break;
    case 'shell': tf = `scale(${1 + 0.03 * s(k * 3.5)}) translateY(${s(k * 2) * 3}px)`; break;
    case 'frond': tf = `rotate(${s(k * 2) * 7}deg)`; origin = '25% 100%'; break;
    case 'sludge': tf = `translateY(${s(k * 2.6) * 4}px)`;
      extra = [0, 1, 2].map((q) => { const ph = (k * 0.7 + q / 3) % 1; return <div key={q} style={{position: 'absolute', left: w * (0.3 + q * 0.2), top: h * (0.45 - ph * 0.5), width: 9, height: 9, borderRadius: 5, background: c, opacity: 1 - ph}} />; }); break;
    case 'flag': tf = `rotate(${s(k * 3) * 5}deg) scale(${1 + 0.02 * s(k * 5)})`; origin = '40% 100%'; break;
    case 'dozer': tf = `translate(${s(k * 2.2) * 9}px, ${s(k * 18) * 1.4}px)`;
      extra = [0, 1, 2].map((q) => { const ph = (k * 0.9 + q / 3) % 1; return <div key={q} style={{position: 'absolute', left: w * (0.95 + ph * 0.12), top: h * (0.85 - ph * 0.3), width: 12 + ph * 12, height: 12 + ph * 12, borderRadius: 20, background: c, opacity: 0.5 * (1 - ph)}} />; }); break;
    case 'seedling': { const g = A(k, 0.3, 1.5, 0.35, 1, POP); tf = `scaleY(${g}) rotate(${s(k * 2) * 4}deg)`; origin = '50% 100%'; break; }
  }
  return (<div style={{position: 'relative', width: w, height: h, opacity: A(k, 0, 0.25), clipPath: `inset(0 ${wipe}% 0 0)`}}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${pop}) ${tf}`, transformOrigin: origin, backgroundColor: c, WebkitMaskImage: `url(${staticFile(`mv/ic/${n}.png`)})`, WebkitMaskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat'}} />{extra}</div>);
};
// Naira sign drawn as a vector so no font has to carry it.
const Nr: React.FC<{c?: string}> = ({c = 'currentColor'}) => (<svg viewBox="-20 -20 40 40" style={{height: '0.78em', width: '0.78em', verticalAlign: '-0.06em', marginRight: '0.04em'}} fill="none" stroke={c} strokeWidth={5.4} strokeLinecap="round" strokeLinejoin="round"><path d="M-12 15 V-15 L12 15 V-15" /><path d="M-18 -4 H18 M-18 6 H18" strokeWidth={4.4} /></svg>);
const cnt = (t: number, a: number, b: number, to: number, d = 0) => A(t, a, b, 0, to).toFixed(d);

// ---------------- sections (each is laid out on the 960x972 panel) ----------------
const bigStat: React.CSSProperties = {fontFamily: H, fontWeight: 800, lineHeight: 1};

const YieldCard: React.FC<{x: number; y: number; w: number; h: number; bg: string; fg: string; t: number; at: number; icon: string; title: string; n1: number; n2: number; dec?: number; wide?: boolean}> = ({x, y, w, h, bg, fg, t, at, icon, title, n1, n2, dec = 0, wide}) => {
  const u = Math.max(0, t - at); const pop = A(t, at, at + 0.55, 0, 1, POP);
  const fs = wide ? 112 : 56;
  return (<div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 28, background: bg, color: fg, opacity: A(t, at, at + 0.2), transform: `scale(${0.86 + 0.14 * pop}) translateY(${(1 - pop) * 30}px)`, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 30, top: 18}}>{u > 0 && <Ico n={icon} h={wide ? 118 : 84} c={fg} u={u} d={0.1} />}</div>
    {wide ? <div style={{position: 'absolute', left: 30, bottom: 16, fontFamily: H, fontSize: 38, fontWeight: 500, letterSpacing: 1}}>{title}</div>
      : <div style={{position: 'absolute', left: 124, top: 20, fontFamily: H, fontSize: 26, fontWeight: 800, lineHeight: 1.18, width: 262}}>{title}</div>}
    <div style={{position: 'absolute', left: wide ? 320 : 36, bottom: wide ? 30 : 24, textAlign: 'center'}}><div style={{...bigStat, fontSize: fs}}>{cnt(t, at + 0.3, at + 1.5, n1, n1 % 1 ? 1 : 0)}</div><div style={{fontFamily: H, fontSize: wide ? 21 : 16, marginTop: 3}}>TONS</div><div style={{fontFamily: H, fontSize: wide ? 31 : 22, fontWeight: 500}}>YEARLY</div></div>
    <div style={{position: 'absolute', left: wide ? 560 : 226, bottom: wide ? 30 : 24, textAlign: 'center'}}><div style={{...bigStat, fontSize: fs}}><Nr />{cnt(t, at + 0.3, at + 1.5, n2, n2 % 1 ? 1 : 0)}</div><div style={{fontFamily: H, fontSize: wide ? 21 : 16, marginTop: 3}}>MILLION</div><div style={{fontFamily: H, fontSize: wide ? 31 : 22, fontWeight: 500}}>VALUE</div></div>
  </div>);
};

const EstateSec: React.FC<{t: number}> = ({t}) => {
  const T0 = 9.2;
  const quad = [
    {x: 31, y: 37, tile: PALE, lb: LIL, lf: HOT, name: 'BATCH 1', at: T0 + 0.2, r: '60px 0 0 0'},
    {x: 511, y: 37, tile: DARK, lb: GREY, lf: '#fff', name: 'BATCH 2', at: T0 + 1.9, r: '0 60px 0 0'},
    {x: 511, y: 445, tile: LIL, lb: HOT, lf: '#fff', name: 'BATCH 3', at: T0 + 3.6, r: '0 0 60px 0'},
    {x: 31, y: 445, tile: GREY, lb: PLUM, lf: '#fff', name: 'BATCH 4', at: T0 + 5.3, r: '0 0 0 60px'},
  ];
  const cw = 420, ch = 357, g = 7, tw = (cw - 7 * g) / 8, th = (ch - 7 * g) / 8;
  return (<div style={{position: 'absolute', inset: 0, background: PLUM}}>
    {quad.map((q) => { const lp = A(t, q.at + 0.5, q.at + 1.1, 0, 1, POP); return (<div key={q.name} style={{position: 'absolute', left: q.x, top: q.y, width: cw, height: ch}}>
      {Array.from({length: 64}).map((_, k) => { const c = k % 8, r = Math.floor(k / 8); const e = A(t, q.at + (r + c) * 0.04, q.at + 0.4 + (r + c) * 0.04, 0, 1, POP);
        const rad = (k === 0 && q.r.startsWith('60')) ? '48px 3px 3px 3px' : (k === 7 && q.r.split(' ')[1] === '60px') ? '3px 48px 3px 3px' : (k === 63 && q.r.split(' ')[2] === '60px') ? '3px 3px 48px 3px' : (k === 56 && q.r.split(' ')[3] === '60px') ? '3px 3px 3px 48px' : 3;
        return <div key={k} style={{position: 'absolute', left: c * (tw + g), top: r * (th + g), width: tw, height: th, background: q.tile, borderRadius: rad, transform: `scale(${e})`, opacity: e}} />; })}
      <div style={{position: 'absolute', left: 52, top: 129, width: 316, height: 100, background: q.lb, color: q.lf, fontFamily: H, fontWeight: 800, textAlign: 'center', transform: `scale(${0.7 + 0.3 * lp})`, opacity: lp, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: 4}}><div style={{fontSize: 44, lineHeight: 1.05}}>{q.name}</div><div style={{fontSize: 38, lineHeight: 1.05}}>15ha</div></div>
    </div>); })}
    <div style={{position: 'absolute', left: 80, right: 80, top: 858, textAlign: 'center', color: LIL, fontFamily: H, fontWeight: 700, fontSize: 31, lineHeight: 1.3, opacity: A(t, T0 + 6.4, T0 + 7.2), transform: `translateY(${A(t, T0 + 6.4, T0 + 7.2, 16, 0)}px)`}}>1,450 trees planted in batches to ensure continuous production and cross cropped with groundnut for natural nitrogen fixing</div>
  </div>);
};

const OilsSec: React.FC<{t: number}> = ({t}) => {
  const pulse = (a: number) => 1 + 0.025 * Math.sin(Math.PI * A(t, a, a + 0.8, 0, 1, Easing.linear));
  const row = (i: number) => 47 + i * 311;
  return (<div style={{position: 'absolute', inset: 0, background: LIL}}>
    <div style={{transform: `scale(${pulse(37.6)})`}}><YieldCard x={42} y={row(0)} w={875} h={254} bg={PLUM} fg={LIL} t={t} at={18.4} icon="ffb" title="FFB YIELD" n1={250} n2={21} wide /></div>
    <div style={{transform: `scale(${pulse(38.4)})`}}><YieldCard x={42} y={row(1)} w={875} h={254} bg={DARK} fg={LIL} t={t} at={20.4} icon="drop" title="CPO YIELD" n1={55} n2={82} wide /></div>
    <div style={{transform: `scale(${pulse(40.0)})`}}><YieldCard x={42} y={row(2)} w={875} h={254} bg={HOT} fg={LIL} t={t} at={22.4} icon="drops2" title="PKO YIELD" n1={10} n2={22} wide /></div>
  </div>);
};

const BypSec: React.FC<{t: number}> = ({t}) => {
  const cards = [
    {i: 0, icon: 'groundnut', title: 'GROUNDNUT YIELD', n1: 9, n2: 14, bg: HOT, fg: LIL, at: 46.1},
    {i: 1, icon: 'sack', title: 'PALM KERNEL CAKE YIELD', n1: 10, n2: 22, bg: LIL, fg: HOT, at: 43.5},
    {i: 2, icon: 'frond', title: 'PALM FROND YIELD', n1: 100, n2: 1, bg: LIL, fg: HOT, at: 50.4},
    {i: 3, icon: 'efb', title: 'EFB YIELD', n1: 52, n2: 0.5, bg: HOT, fg: LIL, at: 51.9},
    {i: 4, icon: 'shell', title: 'SHELL YIELD', n1: 10, n2: 2, bg: HOT, fg: LIL, at: 53.2},
    {i: 5, icon: 'sludge', title: 'EFFLUENT YIELD', n1: 6, n2: 3, bg: LIL, fg: HOT, at: 44.9},
  ];
  const chip = A(t, 48.3, 48.9, 0, 1, POP);
  return (<div style={{position: 'absolute', inset: 0, background: DARK}}>
    {cards.map((c) => { const g = CARD(c.i); return <YieldCard key={c.i} x={g.x} y={g.y} w={g.w} h={g.h} bg={c.bg} fg={c.fg} t={t} at={c.at} icon={c.icon} title={c.title} n1={c.n1} n2={c.n2} dec={0} />; })}
    <div style={{position: 'absolute', left: 42 + 205 - 150, top: CARD(0).y + 238, width: 300, textAlign: 'center', padding: '8px 0', borderRadius: 20, background: PALE, color: HOT, fontFamily: H, fontWeight: 800, fontSize: 22, opacity: chip, transform: `scale(${0.8 + 0.2 * chip})`, boxShadow: '0 8px 20px rgba(0,0,0,0.3)'}}><Nr />400k – <Nr />700k / ha net</div>
  </div>);
};

const CostsSec: React.FC<{t: number}> = ({t}) => {
  const segs = [{w: 0.38, c: HOT, at: 60.3, icon: 'flag', lbl: 'LAND RENT', ih: 112}, {w: 0.27, c: DARK, at: 61.5, icon: 'dozer', lbl: 'CLEARING', ih: 104}, {w: 0.35, c: GREY, at: 62.5, icon: 'seedling', lbl: 'SEEDLINGS + PLANTING', ih: 118}];
  const TW = 876; let acc = 0;
  const heights = [330, 56, 52, 50, 48, 46];
  const base = 905, bw = 112, gap = 30, x0 = 60;
  const pts = heights.map((h, i) => [x0 + i * (bw + gap) + bw / 2, base - h - 18] as const);
  const curve = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const cg = A(t, 64.9, 66.6, 0, 1, IO);
  return (<div style={{position: 'absolute', inset: 0, background: PALE}}>
    <div style={{position: 'absolute', left: 42, top: 44, width: TW, height: 118, borderRadius: 30, border: `3px dashed ${GREY}`, opacity: A(t, 57.3, 58) * 0.5}} />
    {segs.map((s, k) => { const l = acc * TW; acc += s.w; const g = A(t, s.at, s.at + 0.9, 0, 1, OUT); const wpx = s.w * TW; const ip = Math.max(0, t - s.at - 0.4);
      return (<React.Fragment key={k}>
        <div style={{position: 'absolute', left: 42 + l, top: 44, width: wpx, height: 118, background: s.c, borderRadius: k === 0 ? '30px 0 0 30px' : k === 2 ? '0 30px 30px 0' : 0, clipPath: `inset(0 ${(1 - g) * 100}% 0 0)`}} />
        <div style={{position: 'absolute', left: 42 + l, top: 178, width: wpx, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}><div style={{height: s.ih, display: 'flex', alignItems: 'flex-end'}}>{t >= s.at + 0.4 && <Ico n={s.icon} h={s.ih} c={HOT} u={ip} />}</div><div style={{fontFamily: H, fontWeight: 800, fontSize: 21, color: HOT, opacity: A(t, s.at + 0.5, s.at + 1), textAlign: 'center'}}>{s.lbl}</div></div>
      </React.Fragment>); })}
    <svg width={960} height={972} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={`M${x0 - 14} ${base} H${x0 + 6 * (bw + gap)}`} stroke={GREY} strokeWidth={4} opacity={A(t, 57.2, 57.8)} />
      {heights.map((h, i) => { const at = i === 0 ? 57.5 : 64.9 + i * 0.18; const g = A(t, at, at + (i ? 0.7 : 1.3), 0, 1, i ? POP : OUT); return <rect key={i} x={x0 + i * (bw + gap)} y={base - h * g} width={bw} height={h * g} rx={14} fill={i === 0 ? HOT : GREY} />; })}
      <path d={curve} fill="none" stroke={DARK} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cg} opacity={cg > 0 ? 1 : 0} />
      <text x={x0 + bw / 2} y={base - 330 + 52} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={42} fill="#fff" opacity={A(t, 58.4, 59)}>₦64M</text>
      <text x={x0 + bw / 2} y={base + 36} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={24} fill={HOT}>YEAR 1</text>
      <text x={x0 + 3.5 * (bw + gap) + bw / 2 + 12} y={base + 36} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={24} fill={HOT} opacity={A(t, 67.5, 68.2)}>THE NEXT 25 YEARS</text>
    </svg>
    <div style={{position: 'absolute', left: 560, top: 420, opacity: A(t, 67.4, 68)}}>{t > 67.4 && <Ico n="seedling" h={150} c={HOT} u={t - 67.4} />}</div>
  </div>);
};

const InvestSec: React.FC<{t: number}> = ({t}) => {
  const bars = [{w: 648, y: 99, c: HOT, lbl: 'OILS', at: 72.5, icon: 'drops2', ih: 100, inside: true}, {w: 256, y: 241, c: DARK, lbl: 'BYPRODUCTS', at: 73.6, icon: 'sack', ih: 90}, {w: 124, y: 383, c: GREY, lbl: 'BIOMASS', at: 74.6, icon: 'efb', ih: 82}];
  const cols = [{r: 119, i: 50}, {r: 142, i: 52}, {r: 160, i: 54}, {r: 190, i: 56}, {r: 232, i: 60}];
  const base = 880, cw = 150, cg = 36, cx0 = 66;
  const line = A(t, 77.0, 79.0, 0, 1, IO);
  const P = (u: number): [number, number] => [70 + u * 840, 826 - 460 * Math.pow(u, 2.1)];
  const d = Array.from({length: 41}, (_, k) => { const [x, y] = P(k / 40); return `${k ? 'L' : 'M'}${x} ${y}`; }).join(' ');
  const [dx, dy] = P(line);
  return (<div style={{position: 'absolute', inset: 0, background: PALE}}>
    {bars.map((b) => { const g = A(t, b.at, b.at + 0.9, 0, 1, OUT); const ip = Math.max(0, t - b.at - 0.3);
      return (<React.Fragment key={b.lbl}>
        <div style={{position: 'absolute', left: 66, top: b.y, width: b.w, height: 125, background: b.c, borderRadius: 18, clipPath: `inset(0 ${(1 - g) * 100}% 0 0)`}} />
        <div style={{position: 'absolute', left: 90, top: b.y + (125 - b.ih) / 2}}>{t > b.at + 0.3 && <Ico n={b.icon} h={b.ih} c={LIL} u={ip} />}</div>
        <div style={{position: 'absolute', top: b.y, height: 125, display: 'flex', alignItems: 'center', fontFamily: H, fontWeight: 800, fontSize: b.inside ? 64 : 52, color: b.inside ? LIL : HOT, ...(b.inside ? {left: 66, width: b.w - 40, justifyContent: 'flex-end'} : {left: 66 + b.w + 24}), opacity: A(t, b.at + 0.5, b.at + 1.1)}}>{b.lbl}</div>
      </React.Fragment>); })}
    <svg width={960} height={972} style={{position: 'absolute', left: 0, top: 0}}>
      {cols.map((c, i) => { const at = 75.6 + i * 0.35; const g = A(t, at, at + 0.8, 0, 1, POP); const x = cx0 + i * (cw + cg);
        return (<g key={i}><rect x={x} y={base - (c.i + c.r) * g} width={cw} height={(c.i + c.r) * g} rx={22} fill={GREY} /><rect x={x} y={base - c.i * g} width={cw} height={c.i * g} rx={14} fill={LIL} /></g>); })}
      <path d={d} fill="none" stroke={HOT} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} opacity={line > 0 ? 1 : 0} />
      <circle cx={dx} cy={dy} r={20} fill="#fff" stroke={HOT} strokeWidth={8} opacity={line > 0 && line < 1 ? 1 : 0} />
      <g opacity={A(t, 75.6, 76.2)} fontFamily={H} fontWeight={800} fontSize={22}><rect x={66} y={905} width={26} height={26} rx={6} fill={LIL} /><text x={100} y={926} fill={HOT}>INVESTMENT</text><rect x={300} y={905} width={26} height={26} rx={6} fill={GREY} /><text x={334} y={926} fill={HOT}>RETURNS</text><rect x={500} y={910} width={34} height={10} rx={5} fill={HOT} /><text x={544} y={926} fill={HOT}>ROI</text></g>
    </svg>
    <div style={{position: 'absolute', left: 810, top: 290, opacity: A(t, 78.3, 78.8)}}><Coin t={t - 78.3} /></div>
  </div>);
};
const Coin: React.FC<{t: number}> = ({t}) => (<svg width={110} height={110} viewBox="-60 -60 120 120"><g transform={`translate(0 ${-5 * Math.sin(t * 2.6)})`}><g transform={`scale(${Math.max(0.06, Math.abs(Math.cos(t * 3.2)))} 1)`}><circle r={52} fill={HOT} /><circle r={40} fill="none" stroke={LIL} strokeWidth={3} strokeDasharray="3 8" /><g stroke={LIL} strokeWidth={6} strokeLinecap="round" fill="none" transform="scale(1.35)"><path d="M-12 14 V-14 L12 14 V-14" /><path d="M-18 -4 H18 M-18 6 H18" strokeWidth={5} /></g></g></g></svg>);

const Truck: React.FC<{u: number; c: string}> = ({u, c}) => {
  const wheel = (cx: number) => (<g transform={`rotate(${u * 520} ${cx} 132)`}><circle cx={cx} cy={132} r={19} fill="none" stroke={c} strokeWidth={6} /><path d={`M${cx} 118 V146 M${cx - 14} 132 H${cx + 14}`} stroke={c} strokeWidth={4} /></g>);
  return (<svg viewBox="0 0 200 200" width={220} height={220}><g transform={`translate(0 ${Math.sin(u * 22) * 1.2})`} fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 160 H190" /><path d="M10 176 H190" strokeDasharray="22 20" strokeDashoffset={-u * 180} strokeWidth={4} />
    <rect x="30" y="52" width="92" height="76" rx="6" /><path d="M30 84 H122" stroke={LIL} strokeWidth={12} /><path d="M122 76 H152 L176 104 V128 H122 Z" /><path d="M30 128 H176" />{wheel(64)}{wheel(148)}</g></svg>);
};

const DemandSec: React.FC<{t: number}> = ({t}) => {
  const dg = A(t, 25.6, 27.0, 0, 1, OUT), sg = A(t, 32.0, 33.4, 0, 1, OUT);
  const base = 640, DH = 440, SH = 230;
  const tr = A(t, 26.4, 29.4, -260, 190, IO) ;
  const gap = A(t, 33.5, 34.2, 0, 1, POP);
  return (<div style={{position: 'absolute', inset: 0, background: DARK}}>
    <svg width={960} height={972} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={`M60 ${base} H900`} stroke={GREY} strokeWidth={5} />
      <rect x={110} y={base - DH * dg} width={250} height={DH * dg} rx={20} fill={HOT} />
      <rect x={470} y={base - SH * sg} width={250} height={SH * sg} rx={20} fill={GREY} />
      <rect x={470} y={base - DH} width={250} height={DH - SH} rx={20} fill="none" stroke={LIL} strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-t * 30} opacity={gap} />
      <text x={235} y={base + 52} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={30} fill={LIL}>LOCAL DEMAND</text>
      <text x={595} y={base + 52} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={30} fill={LIL}>LOCAL SUPPLY</text>
      <text x={595} y={base - SH - (DH - SH) / 2 + 12} textAnchor="middle" fontFamily={H} fontWeight={800} fontSize={44} fill={LIL} opacity={gap} transform={`scale(${0.85 + 0.15 * gap})`} style={{transformOrigin: '595px 330px'}}>DEFICIT</text>
    </svg>
    <div style={{position: 'absolute', left: 770, top: 150, width: 160, textAlign: 'center', opacity: A(t, 34.6, 35.2)}}><div style={{fontFamily: H, fontWeight: 800, fontSize: 24, color: LIL, lineHeight: 1.2, background: HOT, padding: '10px 8px', borderRadius: 14}}>IMPORTS FILL THE GAP</div></div>
    <div style={{position: 'absolute', left: 590, top: base - SH - 168, opacity: A(t, 32.2, 32.8)}}>{t > 32.2 && <Ico n="seedling" h={168} c={LIL} u={t - 32.2} />}</div>
    <div style={{position: 'absolute', left: 618, top: base - SH - 196, fontFamily: H, fontWeight: 800, fontSize: 22, color: LIL, opacity: A(t, 33, 33.6)}}>TENERA</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 740, height: 190, overflow: 'hidden', opacity: A(t, 26.1, 26.6)}}>
      <div style={{position: 'absolute', left: tr, top: 0}}><Truck u={Math.max(0, t - 26.4)} c={LIL} /></div>
      <div style={{position: 'absolute', right: 56, top: 30, width: 270, padding: '16px 14px', borderRadius: 22, background: LIL, color: HOT, fontFamily: H, fontWeight: 800, fontSize: 24, textAlign: 'center', lineHeight: 1.15, transform: `scale(${A(t, 28.4, 29.1, 0.7, 1, POP)})`, opacity: A(t, 28.4, 28.8)}}>DOMESTIC BUYER<br />AT THE FARM GATE</div>
    </div>
  </div>);
};

// ---------------- home (dashboard boot) ----------------
const Home: React.FC<{t: number}> = ({t}) => {
  const l1 = 'INVEST IN YOUR OWN', l2 = 'OIL PALM ESTATE';
  const tp = A(t, 0.3, 1.9, 0, 1, Easing.linear);
  const n1 = Math.floor(tp * (l1.length + l2.length));
  const panelIn = A(t, 0.3, 1.1);
  const scan = A(t, 0.7, 2.6, 0, 1, IO);
  const boot = A(t, 0.8, 4.0, 0, 100, Easing.linear);
  const spin = A(t, 0.5, 0.9) * (1 - A(t, 1.8, 2.3));
  const inv = A(t, 5.2, 5.8, 0, 1, OUT);
  return (<>
    <div style={{position: 'absolute', left: 0, right: 0, top: 205, textAlign: 'center', color: '#1b1b1b', fontFamily: H}}>
      <div style={{fontSize: 70, fontWeight: 400, letterSpacing: 1.5, height: 100}}>{l1.slice(0, n1)}</div>
      <div style={{fontSize: 90, fontWeight: 800, height: 110, marginTop: -6}}>{l2.slice(0, Math.max(0, n1 - l1.length))}<span style={{opacity: t < 2.2 && Math.floor(t * 4) % 2 ? 0 : 1, display: t < 2.2 ? 'inline' : 'none', color: HOT}}>|</span></div>
    </div>
    <div style={{position: 'absolute', left: PX, top: PY, width: PWID, height: PHT, borderRadius: 36, background: INK, opacity: panelIn, transform: `scale(${0.94 + 0.06 * panelIn})`, overflow: 'hidden', boxShadow: '0 40px 80px rgba(51,40,51,0.35)'}}>
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 ${(1 - scan) * 100}% 0)`}}>
        {HOME_CARDS.map((c, i) => { const g = CARD(i); const at = 1.1 + i * 0.35; const e = A(t, at, at + 0.6, 0, 1, POP); const bar = A(t, at, at + 0.7); const lab = A(t, at + 0.7, at + 1.1);
          const live = A(t, 4.0, 4.4);
          const isInv = i === 4;
          return (<div key={i} style={{position: 'absolute', left: g.x, top: g.y, width: g.w, height: g.h, borderRadius: 28, background: c.bg, color: c.fg, transform: `scale(${0.9 + 0.1 * e})`, opacity: e, overflow: 'hidden', boxShadow: isInv && t > 4.2 ? `0 0 ${30 + 14 * Math.sin(t * 4)}px rgba(176,77,176,0.8)` : 'none'}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: 'rgba(255,255,255,0.18)', opacity: 1 - lab}}><div style={{width: `${bar * 100}%`, height: 8, background: c.fg}} /></div>
            <div style={{position: 'absolute', right: 18, top: 16, width: 12, height: 12, borderRadius: 6, background: c.fg, opacity: (0.35 + 0.65 * live) * (0.6 + 0.4 * Math.sin(t * 5 + i))}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: isInv && t > 5.2 ? 62 + (1 - inv) * 40 : 100, textAlign: 'center', fontFamily: H, fontWeight: 800, fontSize: 36, opacity: lab, letterSpacing: 0.5}}>{c.label.slice(0, Math.ceil(lab * c.label.length))}</div>
            {isInv && <div style={{position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', fontFamily: H, fontWeight: 800, fontSize: 84, lineHeight: 1, opacity: inv, transform: `scale(${0.8 + 0.2 * inv})`}}><Nr />{cnt(t, 5.2, 6.8, 64)}<span style={{fontSize: 44}}>M</span></div>}
            {t > 4.3 && !isInv && <div style={{position: 'absolute', top: 0, bottom: 0, width: 70, left: -90 + ((t * 120 + i * 90) % 700), background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.14), rgba(255,255,255,0))', transform: 'skewX(-12deg)'}} />}
          </div>); })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: scan * PHT - 3, height: 6, background: '#B04DB0', boxShadow: '0 0 30px 10px rgba(176,77,176,0.65)', opacity: scan > 0 && scan < 1 ? 1 : 0}} />
      <svg width={120} height={120} viewBox="-60 -60 120 120" style={{position: 'absolute', left: 420, top: 420, opacity: spin}}><circle r={44} fill="none" stroke="#B04DB0" strokeWidth={8} strokeDasharray="30 22" transform={`rotate(${t * 400})`} strokeLinecap="round" /></svg>
      <div style={{position: 'absolute', left: 42, bottom: 10, fontFamily: MONO, fontSize: 19, color: LIL, opacity: A(t, 0.9, 1.3)}}>{boot < 100 ? `BOOTING DASHBOARD  ${String(Math.floor(boot)).padStart(3, '0')}%` : 'DASHBOARD READY'}</div>
    </div>
  </>);
};

// ---------------- end card ----------------
const EndCard: React.FC<{t: number}> = ({t}) => {
  const lp = A(t, 81.0, 81.9, 0, 1, POP);
  const c1 = A(t, 81.6, 82.5, 0, 1, POP), c2 = A(t, 82.8, 83.7, 0, 1, POP);
  const dm = A(t, 84.4, 84.9, 0, 1, OUT);
  const tx = A(t, 84.6, 85.4);
  return (<>
    <Img src={staticFile('mv/logo.png')} style={{position: 'absolute', left: 290, top: 150, width: 500, transform: `scale(${0.88 + 0.12 * lp})`, opacity: lp, filter: 'drop-shadow(0 16px 22px rgba(51,40,51,0.22))'}} />
    <div style={{position: 'absolute', left: 140, top: 900, width: 420, height: 560, borderRadius: 44, background: HOT, transform: `translateY(${(1 - c1) * 700}px) rotate(${-14 + (1 - c1) * 12}deg)`, opacity: c1, boxShadow: '0 24px 40px rgba(51,40,51,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{color: PALE, fontFamily: H, fontSize: 62, lineHeight: 1.12, textAlign: 'center', fontWeight: 400, transform: 'rotate(-0deg)'}}>BUSINESS<br />PLAN</div></div>
    <div style={{position: 'absolute', left: 500, top: 1000, width: 440, height: 560, borderRadius: 44, background: '#666', transform: `translateY(${(1 - c2) * 700}px) rotate(${14 - (1 - c2) * 12}deg)`, opacity: c2, boxShadow: '0 24px 40px rgba(51,40,51,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{color: PALE, fontFamily: H, fontSize: 62, lineHeight: 1.12, textAlign: 'center', fontWeight: 400}}>SETUP<br />GUIDE</div></div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1580, textAlign: 'center', fontFamily: H, fontWeight: 800, fontSize: 74, lineHeight: 1.12, color: '#111', opacity: tx}}>
      <div><span style={{display: 'inline-block', position: 'relative', padding: '0 24px', marginRight: 16, color: '#fff'}}><span style={{position: 'absolute', inset: '4px 0 0 0', background: HOT, transformOrigin: '0 50%', transform: `scaleX(${dm})`, borderRadius: 4}} /><span style={{position: 'relative'}}>DM</span></span>US FOR YOUR</div>
      <div>CUSTOM PLAN AND</div><div>GUIDE</div>
    </div>
  </>);
};

// ---------------- composition ----------------
export const MvVideo3: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cam = camAt(t);
  const scroll = A(t, 79.9, 81.1, 0, 1920, IO);
  const swipe = A(t, 24.3, 25.1, 0, 1, IO) - A(t, 36.3, 37.1, 0, 1, IO);
  const pageOp = 1 - A(t, 81.0, 81.1);
  const mk = (i: number) => morph(i, t);
  const cornerOp = A(t, 1.2, 1.8) * (1 - A(t, 79.9, 80.6));
  const secNode = (i: number) => {
    const m = mk(i);
    if (m < 0.01) return null;
    const c = CARD(i);
    const x = c.x * (1 - m), y = c.y * (1 - m), w = c.w + (PWID - c.w) * m, h = c.h + (PHT - c.h) * m;
    const bg = interpolateColors(m, [0, 1], [HOME_CARDS[i].bg, HOME_CARDS[i].sec]);
    const op = A(m, 0.5, 0.95);
    const shift = i === 1 ? -PWID * swipe : 0;
    const inner = i === 0 ? <EstateSec t={t} /> : i === 1 ? <OilsSec t={t} /> : i === 2 ? <BypSec t={t} /> : i === 3 ? <CostsSec t={t} /> : <InvestSec t={t} />;
    return (<div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 28 + 8 * m, background: bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -x + shift, top: -y, width: PWID, height: PHT, opacity: op}}>{inner}</div>
      {m < 0.99 && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: H, fontWeight: 800, fontSize: 36, color: HOME_CARDS[i].fg, opacity: 1 - A(m, 0, 0.4)}}>{HOME_CARDS[i].label}</div>}
    </div>);
  };
  const demandVisible = swipe > 0.001 && mk(1) > 0.9;
  const vo = 1.0;
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{transform: `scale(${1.12 + 0.04 * A(t, 0, 87, 0, 1, Easing.linear)}) translate(${(540 - cam.x) * 0.02}px, ${(960 - cam.y) * 0.02}px)`}}><Img src={staticFile('mv/paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill>
      <AbsoluteFill style={{opacity: pageOp, transform: `translateY(${-scroll}px)`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${540 - cam.x * cam.s}px, ${960 - cam.y * cam.s}px) scale(${cam.s})`, filter: cam.blur > 0.3 ? `blur(${cam.blur}px)` : undefined}}>
          <div style={{opacity: 1 - Math.max(mk(0), mk(1), mk(2), mk(3), mk(4)) * 1.4 < 0 ? 0 : 1 - Math.min(1, Math.max(mk(0), mk(1), mk(2), mk(3), mk(4)) * 1.4)}}><Home t={t} /></div>
          <div style={{position: 'absolute', left: PX, top: PY, width: PWID, height: PHT, borderRadius: 36, overflow: 'hidden', pointerEvents: 'none'}}>
            {[0, 1, 2, 3, 4].map((i) => secNode(i))}
            {demandVisible && <div style={{position: 'absolute', left: PWID - PWID * swipe, top: 0, width: PWID, height: PHT}}><DemandSec t={t} /></div>}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{transform: `translateY(${1920 - scroll}px)`, opacity: t > 79.8 ? 1 : 0}}><EndCard t={t} /></AbsoluteFill>
      <Img src={staticFile('mv/mark.png')} style={{position: 'absolute', right: 56, top: 64, width: 96, height: 96, opacity: cornerOp}} />
      <Audio src={staticFile('mv/bgm88.mp3')} volume={0.2} />
      <Sequence from={Math.round(VO_AT * fps)}><Audio src={staticFile('mv/vo.wav')} volume={vo} /></Sequence>
      {[6.9, 15.0, 16.9, 24.3, 36.3, 40.7, 41.5, 54.7, 55.3, 69.8, 70.5, 79.2, 79.9].map((s) => (<Sequence key={s} from={Math.round(s * fps)}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.1} /></Sequence>))}
      {[1.2, 1.55, 1.9, 2.25, 2.6, 2.95, 81.6, 82.8, 84.4].map((s) => (<Sequence key={s} from={Math.round(s * fps)}><Audio src={staticFile('sfx/pop.wav')} volume={0.14} /></Sequence>))}
    </AbsoluteFill>
  );
};
