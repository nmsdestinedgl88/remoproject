import React from 'react';
import {useCurrentFrame} from 'remotion';
import A from './anchors.json';
import {C, E, FONT, Layout, lerp, prog, textW} from './tokens';
import {DrawPath, Reveal, Seg, T, WipeOut} from './primitives';

const SCALE_MAX = 1.45;

/** Seeded stipple so every frame renders identically. */
const stipple = (x0: number, x1: number, y0: number, y1: number) => {
  let s = 1337;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const out: [number, number][] = [];
  for (let y = y0; y < y1; y += 24) for (let x = x0; x < x1; x += 24) out.push([x + rnd() * 18, y + rnd() * 18]);
  return out;
};

/** S1 → S3 as one continuous plate: the incision persists (S1→S2) and the S2/S3 cut is a true match cut. */
export const PlateFilm: React.FC<{L: Layout}> = ({L}) => {
  const f = useCurrentFrame();
  const pl = L.plate;
  const {s1, s2, s3} = A;
  const Lw = pl.incX1 - pl.incX0;
  const skinTop = pl.skinY - pl.skinH / 2;
  const skinBot = pl.skinY + pl.skinH / 2;

  // camera: only the plate scales (macro push S2, pull-back S3)
  const push = prog(f, s2.pushStart, s2.pushEnd - s2.pushStart, E.io);
  const pull = prog(f, s3.pullStart, 36, E.io);
  const sc = lerp(1, SCALE_MAX, push) * 1 - (SCALE_MAX - 1) * pull;
  const P = (x: number, y: number): [number, number] => [pl.cx + (x - pl.cx) * sc, pl.skinY + (y - pl.skinY) * sc];
  const Px = (x: number) => P(x, 0)[0];
  const Py = (y: number) => P(0, y)[1];

  const intro = (i: number) => prog(f, i * 3, 14, E.draw);
  const wipeX = (p: number) => pl.x0 + (pl.x1 - pl.x0) * p;
  const dots = React.useMemo(() => stipple(pl.x0, pl.x1, skinBot + 6, pl.fatEnd - 8), [pl.x0, pl.x1, skinBot, pl.fatEnd]);
  const musLines: number[] = [];
  for (let y = pl.fatEnd + 16; y < pl.musEnd - 6; y += 14) musLines.push(y);

  // ---- incision
  const draw = prog(f, s1.incStart, 42, E.draw);
  const split = f >= s3.split;
  const q = prog(f, s3.split, 27, E.io);
  const third = (Lw * SCALE_MAX) / 3;
  const half = lerp(third / 2 - 8, pl.tickLen / 2, q);
  const centers = [1, 3, 5].map((k) => pl.incX0 + (Lw * k) / 6);

  // ---- S2 ticks (perpendicular, accelerating)
  const nT = 14;
  const tStart: number[] = [];
  let t = s2.ticksStart;
  for (let i = 0; i < nT; i++) { tStart.push(t); t += Math.round(lerp(12, 4, i / (nT - 2))); }
  const tickX = (i: number) => pl.incX0 + 30 + (i * (Lw - 60)) / (nT - 1);

  // ---- callout
  const cIn = prog(f, s2.callout, 10, E.draw);
  const cTxt = prog(f, s2.callout + 8, 10, E.out);
  const cOut = prog(f, s3.split, 10, E.out);
  const [ex, ey] = P(pl.incX1, pl.skinY);
  const calloutBaseline = ey - 18 - 96 - 12;

  // ---- ghost
  const gP = prog(f, s3.ghost, 18, E.draw);
  const ghost: [number, number][] = [];
  for (let s = 0; s < Lw; s += 22) {
    const e2 = Math.min(s + 12, Lw, gP * Lw);
    if (s < gP * Lw && e2 > s) ghost.push([s, e2]);
  }

  // ---- organ + instruments
  const o = pl.organ;
  const oP = prog(f, s3.pullStart + 6, 28, E.draw);
  const [ocx, ocy] = P(o.cx, o.cy);
  const ya = (x: number) => o.cy - o.b * Math.sqrt(Math.max(0, 1 - ((x - o.cx) / o.a) ** 2));
  const elbowY = pl.musEnd + 36;
  const endX = [o.cx - o.a * 0.55, o.cx, o.cx + o.a * 0.55];
  const pathD = (i: number) => {
    const pts: [number, number][] = i === 1
      ? [[centers[1], pl.skinY], [o.cx, ya(o.cx)]]
      : [[centers[i], pl.skinY], [centers[i], elbowY], [endX[i], elbowY], [endX[i], ya(endX[i])]];
    return pts.map((p, k) => { const [x, y] = P(p[0], p[1]); return `${k ? 'L' : 'M'}${x} ${y}`; }).join(' ');
  };
  const pCam = prog(f, s3.camera, 22, E.draw);
  const pIns = prog(f, s3.instruments, 22, E.draw);
  const pPath = [pIns, pCam, pIns];
  const coneY = o.cy - o.b + (L.L ? 62 : 66);
  const [cx0, cy0] = P(o.cx, ya(o.cx));
  const cone = (dir: number) => { const [x, y] = P(o.cx + dir * (L.L ? 44 : 38), coneY); return `M${cx0} ${cy0} L${x} ${y}`; };
  const names = ['Instrument', 'Camera', 'Instrument'];
  const nameP = [prog(f, s3.instruments, 10), prog(f, s3.camera, 10), prog(f, s3.instruments, 10)];
  const lblP = prog(f, s3.pullStart + 26, 12);

  // ---- S1 headline
  const headP = prog(f, s1.head, 16, E.out);
  const headOut = prog(f, s2.pushStart, 10, E.out);
  const l2 = pl.headY + L.sz.title * 1.1;
  const ulW = textW('healing', L.sz.title, 900, FONT.head);
  const ulP = prog(f, s1.underline, 12, E.draw);

  // ---- S3 chip
  const chipP = prog(f, s3.chip, 12, E.out);
  const akaP = prog(f, s3.aka, 12, E.out);
  const chipH = L.L ? 72 : 64;
  const chipY = L.L ? 110 : 160;
  const chipSz = L.L ? 40 : 36;
  const chipW = textW('Minimal access surgery', chipSz, 700) + 48;

  const clipId = `plateclip-${L.o}`;
  return (
    <g>
      <defs>
        <clipPath id={clipId}><rect x={pl.x0} y={pl.clipTop} width={pl.x1 - pl.x0} height={pl.clipBot - pl.clipTop} /></clipPath>
      </defs>

      {/* S1 headline */}
      <WipeOut p={headOut}>
        <Reveal p={headP} dx={28}>
          <T x={L.mx} y={pl.headY} size={L.sz.title} weight={900} family={FONT.head}>Diabetes slows</T>
          <T x={L.mx} y={l2} size={L.sz.title} weight={900} family={FONT.head}>healing.</T>
        </Reveal>
        <rect x={L.mx} y={l2 + 16} width={ulW * ulP} height={6} fill={C.ink} />
      </WipeOut>

      {/* S3 title chip */}
      <Reveal p={chipP} dx={20}>
        <rect x={L.mx} y={chipY} width={chipW} height={chipH} fill={C.green} />
        <T x={L.mx + 24} y={chipY + chipH / 2 + chipSz * 0.35} size={chipSz} c={C.paper}>Minimal access surgery</T>
      </Reveal>
      <Reveal p={akaP} dx={14}>
        <T x={L.mx} y={chipY + chipH + 44} size={L.sz.small} weight={400}>also called keyhole surgery</T>
      </Reveal>

      {/* plate: skin / fat / muscle */}
      <g clipPath={`url(#${clipId})`}>
        {[skinTop, skinBot, pl.fatEnd, pl.musEnd].map((y, i) => (
          <Seg key={i} x1={pl.x0} x2={wipeX(intro(i))} y1={Py(y)} y2={Py(y)} w={3} />
        ))}
        {dots.map(([x, y], i) => {
          const sx = Px(x);
          return sx < wipeX(intro(2)) ? <circle key={i} cx={sx} cy={Py(y)} r={1.8} fill={C.ink} /> : null;
        })}
        {musLines.map((y, i) => <Seg key={i} x1={pl.x0} x2={wipeX(intro(3))} y1={Py(y)} y2={Py(y)} w={2} opacity={0.75} />)}

        {/* organ + instrument paths (revealed by the pull-back) */}
        {oP > 0 && (
          <DrawPath p={oP} w={3} d={`M${ocx - o.a * sc} ${ocy} A${o.a * sc} ${o.b * sc} 0 0 1 ${ocx + o.a * sc} ${ocy} A${o.a * sc} ${o.b * sc} 0 0 1 ${ocx - o.a * sc} ${ocy}`} />
        )}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <DrawPath d={pathD(i)} p={pPath[i]} w={11} c={C.bone} />
            <DrawPath d={pathD(i)} p={pPath[i]} w={3} />
          </g>
        ))}
        <DrawPath d={cone(-1)} p={prog(f, s3.camera + 18, 10, E.draw)} w={3} />
        <DrawPath d={cone(1)} p={prog(f, s3.camera + 18, 10, E.draw)} w={3} />
        <Reveal p={lblP} dx={14}>
          {L.L ? (
            <>
              <Seg x1={ocx + o.a * sc} y1={ocy} x2={ocx + o.a * sc + 36} y2={ocy} w={2} />
              <T x={ocx + o.a * sc + 48} y={ocy + 12} size={L.sz.label}>Area being treated</T>
            </>
          ) : (
            <T x={ocx} y={ocy + o.b * sc + 52} size={L.sz.label} anchor="middle">Area being treated</T>
          )}
        </Reveal>
      </g>

      {/* ghost of the original cut */}
      {ghost.map(([s, e2], i) => {
        const [xa, ya2] = P(pl.incX0 + s, pl.skinY); const [xb] = P(pl.incX0 + e2, pl.skinY);
        return <line key={i} x1={xa} y1={ya2} x2={xb} y2={ya2} stroke={C.ink} strokeWidth={3} opacity={0.45} />;
      })}
      <Reveal p={prog(f, s3.ghost + 6, 10)} dx={12}>
        <Seg x1={Px(pl.incX0)} x2={Px(pl.incX0)} y1={Py(pl.skinY) - pl.ghostOff + 12} y2={Py(pl.skinY) - 14} w={2} />
        <T x={Px(pl.incX0)} y={Py(pl.skinY) - pl.ghostOff} size={L.sz.label}>One long cut</T>
      </Reveal>

      {/* band labels live in screen space, only their y follows the bands */}
      <Reveal p={prog(f, 4, 12)} dx={10}>
        <T x={pl.labelX} y={Py(pl.skinY) + 11} size={L.sz.small}>Skin</T>
        <T x={pl.labelX} y={Py((skinBot + pl.fatEnd) / 2) + 11} size={L.sz.small}>Fat</T>
        <T x={pl.labelX} y={Py((pl.fatEnd + pl.musEnd) / 2) + 11} size={L.sz.small}>Muscle</T>
      </Reveal>

      {/* the incision */}
      {!split && <Seg x1={Px(pl.incX0)} y1={Py(pl.skinY)} x2={Px(pl.incX1)} y2={Py(pl.skinY)} p={draw} w={8} c={C.iodine} />}
      {split && centers.map((c, i) => {
        const x = Px(c);
        return <line key={i} x1={x - half} x2={x + half} y1={Py(pl.skinY)} y2={Py(pl.skinY)} stroke={C.iodine} strokeWidth={8} />;
      })}

      {/* S2 ticks: each tick is skin to mend */}
      {tStart.map((s0, i) => {
        const v = prog(f, s0, 6, E.out) * (1 - prog(f, s3.split + i, 8, E.out));
        if (v <= 0.001) return null;
        const x = Px(tickX(i)); const y = Py(pl.skinY);
        return <line key={i} x1={x} x2={x} y1={y - 14 * v} y2={y + 14 * v} stroke={C.ink} strokeWidth={3} />;
      })}

      {/* callout */}
      <Seg x1={ex} x2={ex} y1={ey - 18} y2={ey - 18 - 96 * (1 - cOut)} p={cIn} w={2} />
      <Reveal p={cTxt * (1 - cOut)} dx={10}>
        <T x={Math.min(ex + 12, L.W - L.safe)} y={calloutBaseline} size={L.sz.label} anchor="end">Infection risk</T>
      </Reveal>

      {/* instrument / camera names above their ticks */}
      {names.map((n, i) => (
        <Reveal key={i} p={nameP[i]} dx={10}>
          <T x={Px(centers[i])} y={Py(pl.skinY) - pl.labelOff} size={L.sz.label} anchor="middle">{n}</T>
        </Reveal>
      ))}
    </g>
  );
};
