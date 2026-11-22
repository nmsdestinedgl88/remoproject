// S3 (film 49.5-75.2 s): the guarantee. Remotion. Film-absolute frames, cues from the supplied voiceover.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {A, Chip, E, FONT_D, FONT_M, ICONS, Icon, P, Root, SPR, ramp, sp} from './kit';

const T0 = 49.5;
const Bag: React.FC<{cx: number; cy: number; s: number}> = ({cx, cy, s}) => (
  <g transform={`translate(${cx - 60 * s} ${cy - 64 * s}) scale(${s})`} dangerouslySetInnerHTML={{__html: ICONS.bag()}} />
);

const CoinStack: React.FC<{F: number; x: number; base: number; at: number; step: number}> = ({F, x, base, at, step}) => (
  <g stroke={P.ink} strokeWidth={4.5} strokeLinejoin="round">
    {Array.from({length: 12}).map((_, i) => {
      const p = sp(F, at + i * step, SPR.playful);
      if (p <= 0.01) return null;
      const yb = base - i * 22 - (1 - Math.min(1, p)) * 180;
      return (
        <g key={i} opacity={Math.min(1, p * 3)}>
          <path d={`M${x - 70},${yb - 22} V${yb} A70,24 0 0 0 ${x + 70},${yb} V${yb - 22}`} fill={i % 2 ? P.deep : P.purple} />
          <ellipse cx={x} cy={yb - 22} rx={70} ry={24} fill={P.glow} />
          <ellipse cx={x} cy={yb - 22} rx={44} ry={14} fill="none" stroke={P.paper} strokeWidth={3} />
        </g>
      );
    })}
  </g>
);

const Calendar: React.FC<{F: number; x: number; y: number; at: number; start: number; end: number}> = ({F, x, y, at, start, end}) => {
  const cur = F < start ? 1 : Math.min(24, 1 + Math.floor(((F - start) / (end - start)) * 23.99));
  const frac = F < start || F >= end ? 1 : (((F - start) / (end - start)) * 23.99) % 1;
  const rot = (1 - ramp(frac, 0, 0.42, 0, 1, E.out)) * -78;
  const p = sp(F, at, SPR.stamp);
  const done = F >= end;
  return (
    <div style={{position: 'absolute', left: x - 200, top: y - 150, width: 400, height: 300, opacity: Math.min(1, p * 3), transform: `scale(${interpolate(p, [0, 1], [1.12, 1])})`, perspective: 800}}>
      <div style={{position: 'absolute', inset: 0, background: P.top, border: `5px solid ${P.ink}`, boxShadow: `9px 9px 0 ${P.ink}`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 70, background: P.ink, color: P.paper, fontFamily: FONT_M, fontWeight: 600, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '0.12em'}}>MONTH</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_D, fontWeight: 900, fontSize: 190, color: done ? P.purple : P.ink, transform: `rotateX(${rot}deg)`, transformOrigin: '50% 0%'}}>{cur}</div>
      {[110, 290].map((l) => <div key={l} style={{position: 'absolute', top: -18, left: l - 10, width: 20, height: 40, borderRadius: 6, background: P.pale, border: `4px solid ${P.ink}`}} />)}
    </div>
  );
};

export const GUARANTEE_FRAMES = Math.round(25.7 * 30);

const Scene: React.FC<{F: number}> = ({F}) => {
  const dimA = ramp(F, A(68.6), A(68.95), 1, 0.14, E.inOut);
  const gShift = ramp(F, A(68.6), A(69.2), 0, 1, E.inOut);
  const groundY = 1090 + gShift * 310;
  const pulse = 1 + Math.sin(F * 0.24) * (F > A(64.9) && F < A(68.4) ? 0.05 : 0.028);
  const ring = (k: number) => ((F * 0.011 + k) % 1);
  const bankBob = Math.sin(F * 0.1) * 7;
  const greenAt = A(61.6);
  const isGreen = F >= greenAt;
  const flash = F >= greenAt ? ramp(F, greenAt, greenAt + 10, 1, 0, E.out) : 0;
  const walk1 = ramp(F, A(50.4), A(55.5), 0, 1, E.inOut);
  const walk2 = ramp(F, A(70.5), A(72.5), 0, 1, E.inOut);
  const famX = 140 + 280 * walk1 + 240 * walk2;
  const walking = (F > A(50.4) && F < A(55.5)) || (F > A(70.5) && F < A(72.5));
  const bob = walking ? Math.abs(Math.sin(F * 0.5)) * -14 : Math.sin(F * 0.1) * -2;
  const enter = ramp(F, A(72.5), A(72.85), 1, 0, E.in);
  const keyP = ramp(F, A(68.8), A(69.8), 0, 1, E.out);
  const keyShown = F >= A(68.8) && F < A(70.4);
  const doorOpen = ramp(F, A(72.2), A(72.7), 0, 1, E.out);
  const cells: {c: number; r: number; at: number}[] = [];
  let n = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { if (c === 2 && r < 2) continue; cells.push({c, r, at: A(69.0 + n * 0.17)}); n++; }
  [[1, 4], [2, 4], [3, 4], [2, 5]].forEach(([c, r]) => { cells.push({c, r, at: A(69.0 + n * 0.17)}); n++; });
  const HX = 660, rowY = (r: number) => groundY - 50 - r * 97, colX = (c: number) => HX + (c - 2) * 118;
  const mand = A(73.3);
  const mandP = sp(F, mand, SPR.playful);
  const calFade = 1 - ramp(F, A(68.6), A(68.9), 0, 1);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g opacity={dimA}>
          <line x1={310} y1={560} x2={380} y2={560} stroke={P.purple} strokeWidth={6} strokeDasharray="12 10" strokeDashoffset={-F * 1.2} opacity={ramp(F, A(50.6), A(51.0))} />
          <line x1={700} y1={560} x2={800} y2={560} stroke={P.purple} strokeWidth={6} strokeDasharray="12 10" strokeDashoffset={-F * 1.2} opacity={ramp(F, A(57.8), A(58.2))} />
          <circle cx={540} cy={560} r={210 * pulse} fill={P.glow} opacity={0.2 * sp(F, A(49.8))} />
          {[0, 0.5].map((k) => <circle key={k} cx={540} cy={560} r={150 + ring(k) * 150} fill="none" stroke={P.glow} strokeWidth={5} opacity={(1 - ring(k)) * 0.5 * sp(F, A(49.8))} />)}
          <CoinStack F={F} x={900} base={640} at={A(57.9)} step={A(0.28)} />
        </g>
        <rect x={72} y={groundY} width={936} height={8} fill={P.ink} opacity={ramp(F, A(50.2), A(50.7))} />
        <rect x={HX - 295} y={groundY - 120} width={590} height={120} fill="none" stroke={P.ink} strokeWidth={4} strokeDasharray="14 12" opacity={0.4 * (F < A(69.0) ? ramp(F, A(50.4), A(51)) : 0)} />
        <g opacity={F >= A(69.0) ? 1 : 0}>
          <rect x={colX(2) - 52} y={groundY - 194} width={104} height={194} fill={P.purple} stroke={P.ink} strokeWidth={5} />
          <rect x={colX(2) - 52} y={groundY - 194} width={104 * (1 - doorOpen * 0.65)} height={194} fill={P.deep} stroke={P.ink} strokeWidth={5} />
        </g>
        {cells.map((c, i) => {
          const p = sp(F, c.at, SPR.stamp);
          if (p <= 0.02) return null;
          return <g key={i} opacity={Math.min(1, p * 3)} transform={`translate(0 ${(1 - Math.min(1, p)) * -120})`}><Bag cx={colX(c.c)} cy={rowY(c.r)} s={1.28} /></g>;
        })}
      </svg>
      <div style={{opacity: dimA}}>
        <Icon name="bank" x={200} y={560 + bankBob} size={230} a={isGreen ? P.pale : undefined} />
        <Icon name="shield" x={540} y={560} size={330} scale={pulse} opacity={sp(F, A(49.8))} />
        <Chip text="DHF GUARANTEE" x={540} y={776} size={46} bg={P.purple} fg="#FFFFFF" f={F} at={A(50.3)} />
        <Chip text={'EURO-AREA\nBANK'} x={200} y={720} size={34} bg={P.paper} fg={P.ink} f={F} at={A(50.9)} />
        <Chip text="3.54% APR" x={215} y={392} size={46} bg={P.purple} fg="#FFFFFF" f={F} at={greenAt} />
        <Chip text="₦1.2M" x={900} y={706} size={58} bg={P.pale} fg={P.ink} f={F} at={A(59.8)} font={FONT_D} />
        {F >= A(63.0) && <div style={{position: 'absolute', left: 215, top: 318, transform: 'translate(-50%,-50%)', opacity: ramp(F, A(63.0), A(63.3))}}>
          <Chip text="25%" x={0} y={0} size={42} bg={P.paper} fg={P.ink} f={F} at={A(63.0)} />
          <div style={{position: 'absolute', left: -62, top: -3, width: 124, height: 6, background: P.ink, transform: 'rotate(-8deg)'}} />
        </div>}
        {flash > 0 && <div style={{position: 'absolute', left: 90, top: 450, width: 220, height: 220, borderRadius: '50%', background: P.purple, opacity: flash * 0.4, transform: `scale(${1 + (1 - flash) * 0.7})`}} />}
      </div>
      <Icon name="family" x={famX} y={groundY - 122 - gShift * 40 + bob} size={250 + gShift * 100} opacity={enter * ramp(F, A(50.3), A(50.7))} />
      {keyShown && <Icon name="key" x={famX} y={groundY - 420 + keyP * 250} size={120} rot={F * 22} scale={1 - Math.max(0, F - A(69.9)) / A(0.5) * 0.9} />}
      <div style={{opacity: calFade}}>
        <Calendar F={F} x={540} y={1330} at={A(53.7)} start={A(54.2)} end={A(56.9)} />
        <Chip text="REPAYMENTS HELD AS COLLATERAL" x={540} y={1512} size={36} bg={P.paper} fg={P.ink} f={F} at={A(56.95)} />
      </div>
      {F >= mand && (
        <div style={{position: 'absolute', left: 0, top: 0}}>
          <div style={{position: 'absolute', left: 120, top: 190, transform: `scale(${Math.min(1.1, mandP)})`, transformOrigin: '50% 50%'}}><Icon name="bag" x={100} y={100} size={230} /><Icon name="check" x={196} y={170} size={96} /></div>
          <Chip text="MANDATORY SUPPLY" x={650} y={310} size={50} bg={P.ink} fg={P.paper} f={F} at={mand + A(0.15)} />
        </div>
      )}
    </>
  );
};

export const Guarantee: React.FC = () => {
  const F = useCurrentFrame() + A(T0);
  return <Root g={F}><Scene F={F} /></Root>;
};
