import React from 'react';
import {useCurrentFrame} from 'remotion';
import A from './anchors.json';
import {C, E, FONT, Layout, prog} from './tokens';
import {DrawPath, Reveal, Seg, T} from './primitives';

const FROM = A.scenes[3].from;

/** Technical/Schematic icons (icon_styles:23): fine ink line drawings, drawn once at rest. */
const Gauge: React.FC<{x: number; y: number; s: number; rest?: number}> = ({x, y, s, rest = -62}) => {
  const r = s * 0.42;
  const cx = x + s / 2; const cy = y + s * 0.62;
  const a = (rest * Math.PI) / 180;
  const arc = (deg: number) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)];
  const [x0, y0] = arc(-80); const [x1, y1] = arc(80);
  return (
    <g fill="none" stroke={C.ink} strokeWidth={3}>
      <path d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`} />
      <line x1={x0 - 2} y1={cy} x2={x1 + 2} y2={cy} />
      {[-60, -30, 0, 30, 60].map((d) => { const [ax, ay] = arc(d); const ix = cx + (r - 9) * Math.sin((d * Math.PI) / 180); const iy = cy - (r - 9) * Math.cos((d * Math.PI) / 180); return <line key={d} x1={ax} y1={ay} x2={ix} y2={iy} strokeWidth={2} />; })}
      <line x1={cx} y1={cy} x2={cx + (r - 8) * Math.sin(a)} y2={cy - (r - 8) * Math.cos(a)} strokeWidth={4} />
      <rect x={cx - 5} y={cy - 5} width={10} height={10} fill={C.ink} stroke="none" />
    </g>
  );
};
const Wound: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g>
    <line x1={x + s * 0.3} y1={y + s * 0.5} x2={x + s * 0.5} y2={y + s * 0.5} stroke={C.iodine} strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={x + s * 0.06 + i * 22} y1={y + s * 0.78} x2={x + s * 0.06 + i * 22 + 12} y2={y + s * 0.78} stroke={C.ink} strokeWidth={3} />)}
  </g>
);
const Days: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g stroke={C.ink} strokeWidth={3} fill="none">
    {[0, 1, 2, 3, 4].map((i) => {
      const bx = x + i * (s / 5); const by = y + s * 0.3; const bw = s / 5 - 4; const bh = s * 0.4;
      return (
        <g key={i}>
          <rect x={bx} y={by} width={bw} height={bh} />
          {i >= 3 && [0, 1, 2].map((k) => <line key={k} x1={bx} y1={by + bh - 6 - k * 14} x2={bx + bw} y2={by + bh - 6 - k * 14 - 8} strokeWidth={2} />)}
        </g>
      );
    })}
  </g>
);

export const S4: React.FC<{L: Layout}> = ({L}) => {
  const f = useCurrentFrame();
  const a4 = A.s4;
  const labels: string[][] = [['Less pain'], L.L ? ['Smaller wound', 'to heal'] : ['Smaller wound to heal'], L.L ? ['Lower risk of', 'wound', 'infection'] : ['Lower risk of', 'wound infection'], L.L ? ['Shorter', 'hospital stay'] : ['Shorter hospital stay']];
  const sz = L.sz.row;
  const lh = sz * 1.12;
  const icon = L.L ? 80 : 84;
  const left = L.mx;
  const labelX = left + icon + 24;
  const rowW = L.L ? L.colR(7) - L.mx : L.W - 2 * L.mx;

  // row geometry (variable height, Swiss ruled rows)
  const pad = L.L ? 22 : 40;
  const hs = labels.map((l) => Math.max(icon, l.length * lh) + pad * 2);
  const top = L.zone.top;
  const ys: number[] = [];
  let acc = top;
  hs.forEach((h) => { ys.push(acc); acc += h; });
  const panelP = prog(f + FROM, a4.panel, 12, E.draw);
  const dim = 1 - 0.65 * prog(f + FROM, a4.panel, 8, E.io);
  const g = f + FROM;

  const panelX = L.L ? L.colX(5) : L.mx;
  const panelY = L.L ? L.zone.top : acc + 56;
  const panelW = L.L ? L.colR(12) - panelX : L.W - 2 * L.mx;
  const panelH = L.L ? L.zone.bottom - L.zone.top : L.zone.bottom - panelY;
  const lines = ['A smaller wound', 'gives slow healing', 'less to repair.'];
  const stSz = L.sz.statement;

  return (
    <g>
      {/* ruled rows draw on at the start so the scene moves from frame 1 */}
      {ys.map((y, i) => <Seg key={i} x1={left} x2={left + rowW} y1={y + hs[i]} y2={y + hs[i]} p={prog(g, FROM + 2 + i * 8, 16, E.draw)} w={1} opacity={dim} />)}
      <Seg x1={left} x2={left + rowW} y1={ys[0]} y2={ys[0]} p={prog(g, FROM + 2, 16, E.draw)} w={1} opacity={dim} />
      {labels.map((lab, i) => {
        const p = prog(g, a4.rows[i], 10, E.out);
        const cy = ys[i] + hs[i] / 2;
        const iy = cy - icon / 2;
        return (
          <g key={i} opacity={dim}>
            <Reveal p={p} dx={32}>
              {i === 0 && <Gauge x={left} y={iy} s={icon} rest={-62} />}
              {i === 1 && <Wound x={left} y={iy} s={icon} />}
              {i === 2 && <Gauge x={left} y={iy} s={icon} rest={-48} />}
              {i === 3 && <Days x={left} y={iy} s={icon} />}
              {lab.map((t, k) => (
                <T key={k} x={labelX} y={cy - ((lab.length - 1) * lh) / 2 + k * lh + sz * 0.34} size={sz} weight={700} family={FONT.head}>{t}</T>
              ))}
            </Reveal>
          </g>
        );
      })}
      <Reveal p={prog(g, FROM + 6, 12, E.out)} dx={14}>
        <T x={left} y={L.zone.bottom - 8} size={L.sz.small} weight={400} c={C.ink}>Illustrative, not to scale.</T>
      </Reveal>

      {/* statement panel: wipe from the left */}
      {panelP > 0 && (
        <g>
          <rect x={panelX} y={panelY} width={panelW * panelP} height={panelH} fill={C.green} />
          <g style={{clipPath: `inset(0 ${(1 - panelP) * 100}% 0 0)`}}>
            <rect x={panelX} y={panelY} width={panelW} height={panelH} fill="none" />
            {lines.map((t, i) => (
              <T key={i} x={panelX + (L.L ? 56 : 40)} y={panelY + panelH / 2 - ((lines.length - 1) * stSz * 1.12) / 2 + i * stSz * 1.12 + stSz * 0.34} size={stSz} weight={900} c={C.paper} family={FONT.head}>{t}</T>
            ))}
          </g>
        </g>
      )}
    </g>
  );
};
