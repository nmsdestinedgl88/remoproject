// S1 (film 0-27 s): the problem. Remotion. Film-absolute frames, cues from the supplied voiceover.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {A, Chip, Cuboid, Display, E, FONT_D, FONT_M, Gauge, Icon, IC, IS, P, Root, SPR, Shot, mkIso, ramp, sp, typed} from './kit';

const BAG = {top: P.top, left: P.purple, right: P.deep};
const drop = (F: number, at: number) => {
  const p = sp(F, A(at), SPR.smooth);
  return {opacity: Math.min(1, p * 2.2), transform: `translateY(${(1 - p) * -170}px)`};
};

// ---------------------------------------------------------------- shot 1 (0-5.6): factory + trembling gauge
const Factory: React.FC<{F: number}> = ({F}) => {
  const u = 64, I = mkIso(u), ox = 346, oy = 700;
  const rise = ramp(F, A(0.6), A(1.2), 0, 100, E.out);
  const fall = ramp(F, A(1.2), A(1.95), 100, 50, E.inOut);
  const value = (F < A(1.2) ? rise : fall) + (F > A(1.95) ? Math.sin(F * 1.9) * 1.6 + Math.sin(F * 0.7) * 0.8 : 0);
  const gP = I(1.6, 2.6, 2.0);
  const t = ramp(F, A(2.9), A(4.5), 0, 1, E.inOut);
  const k = 1.75 + (1 - 1.75) * t;
  const fx = ox + gP[0] + (540 - (ox + gP[0])) * t, fy = oy + gP[1] + (770 - (oy + gP[1])) * t;
  const cam = `translate(540 ${860 - 90 * t}) scale(${k}) translate(${-fx} ${-fy})`;
  const slots: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) slots.push([7.2 + c * 1.0, 0.25 + r * 0.7]);
  const bags = Array.from({length: 6}).map((_, i) => {
    const ts = A(1.0 + i * 0.75), tb = ts + A(0.9), th = tb + A(0.3);
    const [sx, sy] = slots[i];
    if (F < ts) return null;
    let x: number, y = 0.95, z = 0.7;
    if (F < tb) x = 3.3 + ((F - ts) / (tb - ts)) * 3.4;
    else {
      const h = ramp(F, tb, th, 0, 1, E.out);
      x = 6.7 + (sx - 6.7) * h; y = 0.95 + (sy - 0.95) * h; z = 0.7 + Math.sin(h * Math.PI) * 0.8 - 0.25 * h;
      if (F >= th) { x = sx; y = sy; z = 0.45; }
    }
    return {x, y, z, key: i, placed: F >= th};
  }).filter(Boolean) as any[];
  const wall = (a: number) => ({opacity: Math.min(1, sp(F, A(a)) * 2.2), transform: `translateY(${(1 - sp(F, A(a))) * -170}px)`});
  return (
    <g transform={cam}>
      <g transform={`translate(${ox} ${oy})`}>
        <g style={drop(F, -0.5)}><Cuboid u={u} x={-1} y={-1} z={0} w={11.6} d={4.6} h={0.35} top={P.left} /></g>
        <g style={drop(F, -0.35)}><Cuboid u={u} x={0} y={0} z={0.35} w={3.2} d={2.6} h={3.2} /></g>
        <g style={drop(F, -0.2)}><Cuboid u={u} x={0.4} y={0.4} z={3.55} w={0.7} d={0.7} h={2.2} top={P.top} /></g>
        <g style={drop(F, 0)}><Cuboid u={u} x={3.2} y={0.8} z={0.35} w={3.8} d={0.8} h={0.35} top={P.right} left={P.ink} right={P.ink} /></g>
        <g style={wall(0.5)}>
          <Cuboid u={u} x={7} y={0} z={0.35} w={3.2} d={0.12} h={1.9} />
          <Cuboid u={u} x={7} y={0} z={0.35} w={0.12} d={3} h={1.9} />
          <Cuboid u={u} x={7} y={0} z={0.35} w={3.2} d={3} h={0.08} top={P.right} />
        </g>
        {slots.map(([sx, sy], i) => (i >= 6 || !bags.find((b) => b.key === i && b.placed)) ? (
          <Cuboid key={'s' + i} u={u} x={sx} y={sy} z={0.43} w={0.86} d={0.56} h={0.32} dash stroke={2.5} opacity={Math.min(0.6, sp(F, A(0.6 + i * 0.05)) * 0.6)} />
        ) : null)}
        {bags.map((b) => <Cuboid key={'b' + b.key} u={u} x={b.x} y={b.y} z={b.z} w={b.placed ? 0.86 : 0.8} d={b.placed ? 0.56 : 0.6} h={0.32} {...BAG} />)}
        <g transform={`translate(${gP[0]} ${gP[1]}) matrix(${IC} ${IS} 0 1 0 0)`} opacity={Math.min(1, sp(F, A(0.3)) * 2)}>
          <Gauge r={1.3 * u * 0.95} value={Math.max(0, value)} />
        </g>
      </g>
    </g>
  );
};
const Shot1: React.FC<{F: number}> = ({F}) => (
  <>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}><Factory F={F} /></svg>
    <Chip text="UTILIZATION: 50%" x={540} y={1300} size={58} bg={P.ink} fg="#FFFFFF" f={F} at={A(2.0)} />
  </>
);

// ---------------------------------------------------------------- shot 2 (5.6-14.6): 140 KG vs 500-700 KG
const Bar: React.FC<{x: number; w: number; h: number; base: number; front: string; side: string; top: string}> = ({x, w, h, base, front, side, top}) => {
  const dx = 44, dy = -26;
  return (
    <g stroke={P.ink} strokeWidth={5} strokeLinejoin="round">
      <rect x={x} y={base - h} width={w} height={Math.max(0, h)} fill={front} />
      <polygon points={`${x + w},${base - h} ${x + w + dx},${base - h + dy} ${x + w + dx},${base + dy} ${x + w},${base}`} fill={side} />
      <polygon points={`${x},${base - h} ${x + dx},${base - h + dy} ${x + w + dx},${base - h + dy} ${x + w},${base - h}`} fill={top} />
    </g>
  );
};
const Shot2: React.FC<{F: number}> = ({F}) => {
  const base = 1300, s0 = A(5.6);
  const hA = ramp(F, A(5.9), A(8.4), 0, 150, E.out);
  const dv = Math.min(1, Math.max(0, (F - A(11.9)) / A(1.4)));
  const hD = ramp(F, A(11.9), A(13.3), 0, 750, E.out) * (1 + Math.sin(Math.min(1, Math.max(0, (F - A(13.3)) / A(0.5))) * Math.PI) * 0.03);
  const cnt = Math.round(ramp(F, A(6.0), A(8.4), 0, 140, E.out));
  const idle = Math.sin(F * 0.12) * 3;
  const pulseA = F > A(8.6) && F < A(11.8) ? 1 + Math.sin((F - A(8.6)) * 0.22) * 0.012 : 1;
  return (
    <>
      <Display lines={['CEMENT PER PERSON,', 'PER YEAR']} x={540} y={200} size={64} f={F} at={s0 + A(0.1)} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <rect x={72} y={base} width={936} height={10} fill={P.ink} />
        <g transform={`translate(0 ${base}) scale(1 ${pulseA}) translate(0 ${-base})`}>
          <Bar x={96} w={340} h={hA} base={base} front={P.ink} side="#1F1F1F" top="#5A5A5A" />
        </g>
        <rect x={612} y={base - 750} width={340} height={750} fill="none" stroke={P.purple} strokeWidth={5} strokeDasharray="16 12" opacity={ramp(F, A(9.9), A(10.6), 0, 0.55) * (1 - dv)} />
        <Bar x={612} w={340} h={hD} base={base} front={P.purple} side={P.deep} top={P.glow} />
      </svg>
      <Chip text={`AFRICA:\n${cnt} KG`} x={96 + 170 + 22} y={1405} size={44} bg={P.paper} fg={P.ink} f={F} at={A(6.0)} />
      <Chip text={'DEVELOPED:\n500–700 KG'} x={612 + 170 + 22} y={1405} size={44} bg={P.paper} fg={P.ink} f={F} at={A(12.4)} />
      <Chip text="5×" x={540} y={740 + idle} size={96} bg={P.pale} fg={P.ink} f={F} at={A(13.4)} rot={-4} font={FONT_D} />
    </>
  );
};

// ---------------------------------------------------------------- shot 3 (14.6-27): locked behind financing
const Shot3: React.FC<{F: number}> = ({F}) => {
  const base = 960, s0 = A(14.6);
  const walk = ramp(F, A(14.7), A(16.5), 0, 1, E.out);
  const famX = -220 + 420 * walk;
  const hop = F > A(21.94) && F < A(22.6) ? -Math.abs(Math.sin((F - A(21.94)) * 0.28)) * 26 : 0;
  const bob = F < A(16.5) ? Math.abs(Math.sin(F * 0.55)) * -14 : Math.sin(F * 0.12) * -2 + hop;
  const jig = (a: number, b: number) => (F > A(a) && F < A(b) ? Math.sin((F - A(a)) * 1.5) * 12 * Math.max(0, 1 - (F - A(a)) / A(b - a)) : 0);
  const jiggle = jig(20.15, 21.6) + jig(23.45, 24.9);
  const door = ramp(F, A(14.8), A(15.6), 0, 1, E.out);
  const heights = [120, 210, 310, 430, 570];
  const pulse = F > A(20.4) ? 1 + Math.sin(F * 0.28) * 0.018 : 1;
  const full = 'THE DEMAND IS LOCKED BEHIND FINANCING.';
  const shown = typed(full, F, A(16.7), 20);
  const lines = [['THE', 'DEMAND', 'IS'], ['LOCKED', 'BEHIND'], ['FINANCING.']];
  let consumed = 0;
  const caret = F % 18 < 10 && F < A(23);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g opacity={door} transform={`translate(0 ${(1 - door) * 60})`} stroke={P.ink} strokeWidth={6} strokeLinejoin="round">
          <rect x={330} y={320} width={370} height={640} fill={P.right} />
          <rect x={350} y={340} width={330} height={620} fill={P.left} />
          <line x1={350} y1={520} x2={680} y2={520} strokeWidth={3} /><line x1={350} y1={760} x2={680} y2={760} strokeWidth={3} />
          <line x1={515} y1={340} x2={515} y2={960} strokeWidth={3} />
        </g>
        {heights.map((h, i) => {
          const hh = ramp(F, A(18.9 + i * 0.22), A(19.9 + i * 0.22), 0, h, E.out) * (i === 4 ? pulse : 1);
          return (
            <g key={i} stroke={P.ink} strokeWidth={5} strokeLinejoin="round">
              <rect x={744 + i * 52} y={base - hh} width={40} height={Math.max(0, hh)} fill={P.ink} />
              <polygon points={`${784 + i * 52},${base - hh} ${796 + i * 52},${base - hh - 8} ${796 + i * 52},${base - 8} ${784 + i * 52},${base}`} fill="#1F1F1F" />
            </g>
          );
        })}
        <rect x={72} y={base} width={936} height={8} fill={P.ink} />
      </svg>
      <Icon name="lock" x={640} y={800} size={110} rot={jiggle} opacity={door} style={{transformOrigin: '50% 12%'}} />
      <Chip text="MORTGAGE" x={515} y={470} size={46} f={F} at={A(15.7)} bg={P.ink} fg={P.paper} />
      <Icon name="family" x={famX} y={base - 112 + bob} size={290} />
      <Chip text={'25%\nINTEREST'} x={870} y={240} size={46} bg={P.ink} fg="#FFFFFF" f={F} at={A(19.2)} />
      <div style={{position: 'absolute', left: 72, top: 1090, fontFamily: FONT_D, fontWeight: 900, fontSize: 92, lineHeight: 1.0, letterSpacing: '-0.01em', color: P.ink, whiteSpace: 'pre'}}>
        {lines.map((ln, li) => {
          const text = ln.join(' ') + (li < lines.length - 1 ? ' ' : '');
          const vis = shown.slice(consumed, consumed + text.length);
          consumed += text.length;
          return (
            <div key={li} style={{minHeight: 92}}>
              {vis.split(/(FINANCING\.)/).map((s, i) => <span key={i} style={{color: s === 'FINANCING.' ? P.purple : P.ink}}>{s}</span>)}
              {caret && vis.length > 0 && vis.length < text.length + (li === lines.length - 1 ? 1 : 0) && <span style={{background: P.purple, display: 'inline-block', width: 22, height: 70, marginLeft: 8, verticalAlign: -4}} />}
            </div>
          );
        })}
      </div>
    </>
  );
};

export const PROBLEM_FRAMES = Math.round(27.0 * 30);
export const Problem: React.FC = () => {
  const F = useCurrentFrame();
  return (
    <Root g={F}>
      <Shot g={F} from={0} to={A(5.6)}>{() => <Shot1 F={F} />}</Shot>
      <Shot g={F} from={A(5.6)} to={A(14.6)}>{() => <Shot2 F={F} />}</Shot>
      <Shot g={F} from={A(14.6)} to={A(27)}>{() => <Shot3 F={F} />}</Shot>
    </Root>
  );
};
