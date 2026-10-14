import React from 'react';
import {useCurrentFrame} from 'remotion';
import A from './anchors.json';
import {C, E, FONT, Layout, prog} from './tokens';
import {DrawPath, Reveal, Seg, T} from './primitives';

const FROM = A.scenes[4].from;

const Pict: React.FC<{k: number; x: number; y: number; s: number}> = ({k, x, y, s}) => {
  const cx = x + s / 2; const cy = y + s / 2;
  return (
    <g fill="none" stroke={C.ink} strokeWidth={3}>
      {k === 0 && <path d={`M${cx} ${y + 4} L${cx - 20} ${cy + 6} A22 22 0 1 0 ${cx + 20} ${cy + 6} Z`} />}
      {k === 1 && (<g><rect x={x + 8} y={cy - 18} width={s - 16} height={36} /><line x1={cx} y1={cy - 18} x2={cx} y2={cy + 18} /></g>)}
      {k === 2 && (<g><rect x={cx - 14} y={y + 4} width={28} height={28} /><path d={`M${cx - 30} ${y + s - 4} L${cx - 30} ${y + 44} L${cx + 30} ${y + 44} L${cx + 30} ${y + s - 4} Z`} /></g>)}
    </g>
  );
};

export const S5: React.FC<{L: Layout}> = ({L}) => {
  const f = useCurrentFrame();
  const g = f + FROM;
  const a5 = A.s5;
  const names = ['Blood sugar', 'Medicines', 'General health'];
  const cardH = L.L ? 186 : 170;
  const gap = 24;
  const x0 = L.mx;
  const cw = L.L ? L.colR(6) - L.mx : L.W - 2 * L.mx;
  const y0 = L.zone.top + (L.L ? 36 : 0);
  const pict = 84;

  // decision fork
  const nodeW = L.L ? 232 : 300; const nodeH = 88;
  const nx = L.L ? L.colX(8) : L.mx;
  const ny = L.L ? y0 + (3 * cardH + 2 * gap) / 2 - nodeH / 2 : y0 + 3 * (cardH + gap) + 130;
  const bw = L.L ? L.colR(12) - (nx + nodeW + 56) : L.W - 2 * L.mx - nodeW - 56; // label boxes
  const bx = nx + nodeW + 56;
  const bh = 96;
  const byA = ny + nodeH / 2 - bh - 20; const byB = ny + nodeH / 2 + 20;
  const forkP = prog(g, a5.fork, 14, E.draw);
  const boxP = prog(g, a5.fork + 10, 12, E.out);
  const elbow = (yt: number) => `M${nx + nodeW} ${ny + nodeH / 2} L${nx + nodeW + 28} ${ny + nodeH / 2} L${nx + nodeW + 28} ${yt} L${bx} ${yt}`;

  return (
    <g>
      {names.map((n, i) => {
        const y = y0 + i * (cardH + gap);
        const outline = prog(g, FROM + 4 + i * 8, 20, E.draw);
        const p = prog(g, a5.cards[i], 10, E.out);
        const tick = prog(g, a5.cards[i] + 14, 9, E.draw);
        return (
          <g key={i}>
            <DrawPath p={outline} w={3} d={`M${x0} ${y + cardH} L${x0} ${y} L${x0 + cw} ${y} L${x0 + cw} ${y + cardH} Z`} />
            <Reveal p={p} dx={26}>
              <Pict k={i} x={x0 + 32} y={y + (cardH - pict) / 2} s={pict} />
              <T x={x0 + 32 + pict + 32} y={y + cardH / 2 + 15} size={L.L ? 46 : 42} weight={700} family={FONT.head}>{n}</T>
            </Reveal>
            <DrawPath p={tick} w={4} d={`M${x0 + cw - 84} ${y + cardH / 2} L${x0 + cw - 62} ${y + cardH / 2 + 22} L${x0 + cw - 26} ${y + cardH / 2 - 24}`} />
          </g>
        );
      })}

      {/* decision node */}
      <DrawPath p={prog(g, FROM + 14, 20, E.draw)} w={3} d={`M${nx} ${ny + nodeH} L${nx} ${ny} L${nx + nodeW} ${ny} L${nx + nodeW} ${ny + nodeH} Z`} />
      <rect x={nx} y={ny} width={nodeW * prog(g, FROM + 26, 12, E.draw)} height={nodeH} fill={C.ink} />
      <Reveal p={prog(g, FROM + 30, 10, E.out)} dx={14}>
        <T x={nx + nodeW / 2} y={ny + nodeH / 2 + 13} size={L.sz.label} c={C.paper} anchor="middle">Your surgeon</T>
      </Reveal>
      {[byA, byB].map((yy, i) => (
        <g key={i}>
          <DrawPath d={elbow(yy + bh / 2)} p={forkP} w={3} />
          <Reveal p={boxP} dx={20}>
            <rect x={bx} y={yy} width={bw} height={bh} fill="none" stroke={C.ink} strokeWidth={3} />
            {i === 0 ? (
              <>
                <T x={bx + 24} y={yy + 40} size={L.sz.label}>Minimal access</T>
                <T x={bx + 24} y={yy + 78} size={L.sz.label}>surgery</T>
              </>
            ) : (
              <T x={bx + 24} y={yy + bh / 2 + 12} size={L.sz.label}>Another approach</T>
            )}
          </Reveal>
        </g>
      ))}

      <Reveal p={prog(g, a5.final, 12, E.out)} dx={20}>
        <T x={L.mx} y={L.zone.bottom - 6} size={L.L ? 36 : 34} weight={400}>Your surgeon decides if it suits your case.</T>
      </Reveal>
    </g>
  );
};
