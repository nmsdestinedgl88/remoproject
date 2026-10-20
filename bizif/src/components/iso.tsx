// Isometric kit for Remotion: solids with four-tone shading, painter's order by caller.
// World: x → screen down-right, y → screen down-left, z up. Same camera as the isometric-motion skill (30° / 30°).
import React from "react";
import { staticFile } from "remotion";
import { theme } from "../theme";

export const C30 = 0.8660254;
export const S30 = 0.5;
export type V3 = [number, number, number];

export const proj = (x: number, y: number, z: number, k = 1): [number, number] => [(x - y) * C30 * k, (x + y) * S30 * k - z * k];

const hex = (h: string) => {
  const f = h.length === 4 ? "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3] : h;
  return [1, 3, 5].map((i) => parseInt(f.slice(i, i + 2), 16));
};
const toHex = (c: number[]) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return toHex(A.map((v, i) => v + (B[i] - v) * t));
};
export const tones = (base: string) => ({
  top: mix(base, "#ffffff", 0.28),
  left: base,
  right: mix(base, "#06103a", 0.28),
  edge: mix(base, "#06103a", 0.5),
  hi: mix(base, "#ffffff", 0.55),
});

const pts = (a: [number, number][]) => a.map((p) => p.join(",")).join(" ");

export const Iso: React.FC<{ ox: number; oy: number; k?: number; children: React.ReactNode; w?: number; h?: number; style?: React.CSSProperties }> = ({ ox, oy, children, w = 1080, h = 1920, style }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>
    <g transform={`translate(${ox},${oy})`}>{children}</g>
  </svg>
);

export const Shadow: React.FC<{ x: number; y: number; w: number; d: number; k?: number; o?: number }> = ({ x, y, w, d, k = 1, o = 0.16 }) => {
  const e = 8;
  const P = [proj(x - e, y - e, 0, k), proj(x + w + e, y - e, 0, k), proj(x + w + e, y + d + e, 0, k), proj(x - e, y + d + e, 0, k)];
  return <polygon points={P.map((p) => `${p[0]},${p[1] + 12 * k}`).join(" ")} fill={`rgba(8,20,70,${o})`} style={{ filter: `blur(${12 * k}px)` }} />;
};

export type BoxP = { x: number; y: number; z?: number; w: number; d: number; h: number; color: string; k?: number; o?: number; stroke?: boolean; children?: React.ReactNode; grid?: number; band?: string };
export const Box: React.FC<BoxP> = ({ x, y, z = 0, w, d, h, color, k = 1, o = 1, stroke = true, grid, band }) => {
  const t = tones(color);
  const P = (a: number, b: number, c: number) => proj(x + a, y + b, z + c, k);
  const top = [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)];
  const left = [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)];
  const right = [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)];
  const sw = Math.max(1, 1.4 * k);
  const lines: React.ReactNode[] = [];
  if (grid) {
    for (let i = 1; i < grid; i++) {
      const f = i / grid;
      const a = P(w * f, 0, h), b = P(w * f, d, h);
      const c = P(0, d * f, h), e = P(w, d * f, h);
      lines.push(<line key={"a" + i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={t.edge} strokeOpacity={0.35} strokeWidth={sw * 0.7} />);
      lines.push(<line key={"b" + i} x1={c[0]} y1={c[1]} x2={e[0]} y2={e[1]} stroke={t.edge} strokeOpacity={0.35} strokeWidth={sw * 0.7} />);
    }
  }
  const bandEls: React.ReactNode[] = [];
  if (band) {
    const f0 = 0.4, f1 = 0.6;
    const q = (a: number, b: number, c: number) => P(a, b, c);
    bandEls.push(<polygon key="bt" points={pts([q(w * f0, 0, h), q(w * f1, 0, h), q(w * f1, d, h), q(w * f0, d, h)])} fill={band} />);
    bandEls.push(<polygon key="bl" points={pts([q(w * f0, d, 0), q(w * f1, d, 0), q(w * f1, d, h), q(w * f0, d, h)])} fill={mix(band, "#06103a", 0.2)} />);
  }
  return (
    <g opacity={o} strokeLinejoin="round">
      <polygon points={pts(left)} fill={t.left} stroke={stroke ? t.edge : "none"} strokeWidth={sw} />
      <polygon points={pts(right)} fill={t.right} stroke={stroke ? t.edge : "none"} strokeWidth={sw} />
      <polygon points={pts(top)} fill={t.top} stroke={stroke ? t.edge : "none"} strokeWidth={sw} />
      {lines}
      {bandEls}
    </g>
  );
};

export const Cyl: React.FC<{ x: number; y: number; z?: number; r: number; h: number; color: string; k?: number; o?: number; ring?: boolean }> = ({ x, y, z = 0, r, h, color, k = 1, o = 1, ring }) => {
  const t = tones(color);
  const [cx, cy] = proj(x, y, z, k);
  const rx = 1.2247 * r * k, ry = 0.7071 * r * k, hh = h * k;
  const sw = Math.max(1, 1.4 * k);
  const id = `g${Math.round(cx)}_${Math.round(cy)}_${Math.round(r)}_${color.slice(1)}`;
  return (
    <g opacity={o}>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor={t.top} />
          <stop offset="0.45" stopColor={t.left} />
          <stop offset="1" stopColor={t.right} />
        </linearGradient>
      </defs>
      <path d={`M${cx - rx},${cy} L${cx - rx},${cy - hh} A${rx},${ry} 0 0 0 ${cx + rx},${cy - hh} L${cx + rx},${cy} A${rx},${ry} 0 0 1 ${cx - rx},${cy} Z`} fill={`url(#${id})`} stroke={t.edge} strokeWidth={sw} />
      <ellipse cx={cx} cy={cy - hh} rx={rx} ry={ry} fill={t.top} stroke={t.edge} strokeWidth={sw} />
      {ring && <ellipse cx={cx} cy={cy - hh} rx={rx * 0.78} ry={ry * 0.78} fill="none" stroke={t.edge} strokeOpacity={0.5} strokeWidth={sw} />}
    </g>
  );
};

/** Place SVG/HTML-like content on the top plane at world (x,y,z) — u along +x, v along +y */
export const OnTop: React.FC<{ x: number; y: number; z: number; k?: number; rot?: number; children: React.ReactNode }> = ({ x, y, z, k = 1, rot = 0, children }) => {
  const [ox, oy] = proj(x, y, z, k);
  return <g transform={`matrix(${C30 * k},${S30 * k},${-C30 * k},${S30 * k},${ox},${oy}) rotate(${rot})`}>{children}</g>;
};
/** content on the +y facing (left) wall; u along +x, v up */
export const OnLeft: React.FC<{ x: number; y: number; z: number; k?: number; children: React.ReactNode }> = ({ x, y, z, k = 1, children }) => {
  const [ox, oy] = proj(x, y, z, k);
  return <g transform={`matrix(${C30 * k},${S30 * k},0,${k},${ox},${oy})`}>{children}</g>;
};
/** content on the +x facing (right) wall; u along -y, v up */
export const OnRight: React.FC<{ x: number; y: number; z: number; k?: number; children: React.ReactNode }> = ({ x, y, z, k = 1, children }) => {
  const [ox, oy] = proj(x, y, z, k);
  return <g transform={`matrix(${C30 * k},${-S30 * k},0,${k},${ox},${oy})`}>{children}</g>;
};

export const Coin: React.FC<{ x: number; y: number; z?: number; r?: number; k?: number; spin?: number; o?: number }> = ({ x, y, z = 0, r = 40, k = 1, spin = 0, o = 1 }) => (
  <g opacity={o}>
    <Cyl x={x} y={y} z={z} r={r} h={r * 0.26} color={theme.colors.gold} k={k} ring />
    <OnTop x={x} y={y} z={z + r * 0.26} k={k} rot={spin}>
      <image href={staticFile("wa-icon.png")} x={-r * 0.58} y={-r * 0.58} width={r * 1.16} height={r * 1.16} />
    </OnTop>
  </g>
);

export const GoldBar: React.FC<{ x: number; y: number; z?: number; k?: number; o?: number; w?: number }> = ({ x, y, z = 0, k = 1, o = 1, w = 74 }) => (
  <g opacity={o}>
    <Box x={x} y={y} z={z} w={w} d={34} h={20} color={theme.colors.gold} k={k} />
    <Box x={x + 7} y={y + 6} z={z + 20} w={w - 14} d={22} h={4} color={theme.colors.goldLight} k={k} stroke={false} />
  </g>
);

/** small person: body cylinder + head sphere-ish */
export const Person: React.FC<{ x: number; y: number; z?: number; k?: number; color?: string; o?: number; s?: number }> = ({ x, y, z = 0, k = 1, color = theme.colors.blue, o = 1, s = 1 }) => {
  const [cx, cy] = proj(x, y, z, k);
  const t = tones(color);
  return (
    <g opacity={o}>
      <ellipse cx={cx} cy={cy + 2 * k} rx={9 * k * s} ry={5 * k * s} fill="rgba(8,20,70,0.18)" />
      <path d={`M${cx - 8 * k * s},${cy} q0,${-18 * k * s} ${8 * k * s},${-18 * k * s} q${8 * k * s},0 ${8 * k * s},${18 * k * s} Z`} fill={t.left} />
      <circle cx={cx} cy={cy - 24 * k * s} r={6.5 * k * s} fill={t.top} />
    </g>
  );
};

export const Phone: React.FC<{ x: number; y: number; z?: number; k?: number; children?: React.ReactNode; o?: number }> = ({ x, y, z = 0, k = 1, children, o = 1 }) => (
  <g opacity={o}>
    <Box x={x} y={y} z={z} w={56} d={90} h={8} color={theme.colors.ink} k={k} />
    <OnTop x={x + 4} y={y + 4} z={z + 8} k={k}>
      <rect width={48} height={82} rx={5} fill={theme.colors.blueSoft} />
      {children}
    </OnTop>
  </g>
);

/** a stack of tokens hovering: quick packet (rounded tile on top plane) */
export const Packet: React.FC<{ x: number; y: number; z?: number; k?: number; color?: string; o?: number; icon?: boolean; size?: number }> = ({ x, y, z = 0, k = 1, color = theme.colors.blue, o = 1, icon = true, size = 26 }) => (
  <g opacity={o}>
    <Box x={x} y={y} z={z} w={size} d={size} h={size * 0.45} color={color} k={k} />
    {icon && (
      <OnTop x={x + size / 2} y={y + size / 2} z={z + size * 0.45} k={k}>
        <circle r={size * 0.28} fill="#fff" />
        <path d={`M${-size * 0.1},${-size * 0.12} l${size * 0.14},${size * 0.2} l${size * 0.12},${-size * 0.28}`} stroke={color} strokeWidth={size * 0.07} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </OnTop>
    )}
  </g>
);

export const depth = (x: number, y: number, z = 0) => x + y + z * 0.01;
