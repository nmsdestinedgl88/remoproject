import React from 'react';
import {useCurrentFrame} from 'remotion';
import A from './anchors.json';
import {C, E, FONT, Layout, lerp, prog, textW} from './tokens';
import {DrawPath, Reveal, Seg, T} from './primitives';

const FROM = A.scenes[5].from;

/** Geometry shared with the Registration travel so the tick lands on the dot. */
export const s6Geo = (L: Layout) => {
  const L1 = L.L;
  const mapX = L.mx; const mapW = L1 ? L.colR(5) - L.mx : L.W - 2 * L.mx;
  const titleLines = L1 ? ['Ava Consultants', '& Urology', 'Centre'] : ['Ava Consultants', '& Urology Centre'];
  const tY = L1 ? 190 : 230;
  const bandY = L1 ? 560 : 560 + (titleLines.length - 2) * 0 + 70;
  const bandH = 56;
  const dotR = 20;
  const dotX = mapX + (L1 ? 150 : 150);
  const dotY = bandY + bandH + 96 + dotR;
  const panel = L1 ? {x: L.colX(6), y: 500, w: L.colR(12) - L.colX(6), h: 290} : {x: L.mx, y: dotY + 90, w: L.W - 2 * L.mx, h: 300};
  const footY = L1 ? 818 : panel.y + panel.h + 56;
  return {mapX, mapW, titleLines, tY, bandY, bandH, dotR, dotX, dotY, panel, footY};
};

export const S6: React.FC<{L: Layout}> = ({L}) => {
  const f = useCurrentFrame();
  const g = f + FROM;
  const G = s6Geo(L);
  const a6 = A.s6;
  const tsz = L.sz.s6title;
  const phoneTxt = '[CLIENT PHONE]';
  const avail = G.panel.w - 64;
  const phoneSz = Math.min(L.sz.phone, Math.floor((avail / textW(phoneTxt, 100, 700)) * 100));
  const bookP = prog(g, a6.phone, 14, E.draw);
  const addrP = prog(g, a6.address, 14, E.draw);
  const footSz = L.L ? 28 : 28;
  const footLines = L.L
    ? ['Suitability for minimal access surgery depends on your condition and is decided by your surgeon.', 'Illustrations are schematic.']
    : ['Suitability for minimal access surgery depends on', 'your condition and is decided by your surgeon.', 'Illustrations are schematic.'];
  return (
    <g>
      <Reveal p={prog(g, a6.dot, 16, E.out)} dx={36}>
        {G.titleLines.map((t, i) => <T key={i} x={L.mx} y={G.tY + i * tsz * 1.08} size={tsz} weight={900} family={FONT.head}>{t}</T>)}
      </Reveal>

      {/* schematic map: the band is the road, the dot is the centre */}
      <rect x={G.mapX} y={G.bandY} width={G.mapW * addrP} height={G.bandH} fill="none" stroke={C.ink} strokeWidth={3} />
      <Reveal p={prog(g, a6.address + 6, 10, E.out)} dx={12}>
        <T x={G.mapX + 20} y={G.bandY + G.bandH / 2 + 12} size={L.sz.label} c={C.ink}>4-Lane</T>
      </Reveal>
      <Seg x1={G.dotX} x2={G.dotX} y1={G.bandY + G.bandH} y2={G.dotY - G.dotR} p={prog(g, a6.address + 8, 12, E.draw)} w={3} />
      <Reveal p={prog(g, a6.address + 14, 12, E.out)} dx={14}>
        <T x={G.dotX + G.dotR + 28} y={G.dotY + 12} size={L.sz.label}>Off 4-Lane, Uyo</T>
      </Reveal>

      {/* call panel */}
      <rect x={G.panel.x} y={G.panel.y} width={G.panel.w * bookP} height={G.panel.h} fill={C.ink} />
      <g style={{clipPath: `inset(0 ${(1 - bookP) * 100}% 0 0)`}}>
        <T x={G.panel.x + 32} y={G.panel.y + 80} size={40} weight={400} c={C.paper}>Book a consultation</T>
        <T x={G.panel.x + 32} y={G.panel.y + G.panel.h - 56} size={phoneSz} weight={700} c={C.paper}>{phoneTxt}</T>
      </g>

      <Reveal p={prog(g, a6.phone + 26, 14, E.out)} dx={18}>
        {footLines.map((t, i) => <T key={i} x={L.mx} y={G.footY + i * 38} size={footSz} weight={400}>{t}</T>)}
      </Reveal>
    </g>
  );
};
