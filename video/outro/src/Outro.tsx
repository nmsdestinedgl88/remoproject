import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "./theme";

const C = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sec = (s: number) => Math.round(s * theme.fps);

// ── Logo geometry, traced from the brand file (1130 × 2000 px, IoU ≥ 0.99) ──
const LOGO_W = 1130;
const LOGO_H = 2000;
const ORANGE: [number, number][] = [
  [571, 0], [938, 343], [737, 787], [636, 611], [720, 382], [571, 235],
  [407, 393], [816, 1102], [722, 1270], [191, 350],
];
const STEM: [number, number][] = [[191, 350], [407, 393], [816, 1102], [722, 1270]];
const PURPLE: [number, number][] = [[426, 926], [674, 1354], [576, 1528], [338, 1116]];
const SEVUN = { y0: 1627, y1: 1829, x: [[0, 137], [230, 345], [420, 613], [695, 855], [960, 1129]] };
const MARKETING = {
  y0: 1902,
  y1: 1999,
  x: [[70, 166], [208, 298], [340, 416], [458, 532], [573, 627], [665, 738], [781, 802], [853, 932], [978, 1059]],
};
const pts = (p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(" ");

// ── Beats (seconds) ──
const T = {
  collapse: [0, 0.42],
  grow: [0.4, 1.15],
  orbitPeak: 1.2,
  shard: 0.8,
  sevun: 1.45,
  marketing: 1.95,
  move: [3.3, 4.25],
  kicker: 3.75,
  title: 4.0,
  line2: 4.85,
  underline: 5.6,
  cta: 6.3,
};

// Lockup placement: A = centred hero, B = left of the offer.
const A = { cx: 960, cy: 540, s: 0.37 };
const B = { cx: 500, cy: 540, s: 0.3 };

const font = `@font-face{font-family:Outfit;font-weight:500;src:url(${staticFile("fonts/outfit-latin-500-normal.woff2")}) format("woff2")}
@font-face{font-family:Outfit;font-weight:700;src:url(${staticFile("fonts/outfit-latin-700-normal.woff2")}) format("woff2")}
@font-face{font-family:Outfit;font-weight:800;src:url(${staticFile("fonts/outfit-latin-800-normal.woff2")}) format("woff2")}`;

// ── Layer 1: ground ──
const Ground: React.FC = () => {
  const f = useCurrentFrame();
  const d1 = Math.sin(f / 70) * 40;
  const d2 = Math.cos(f / 85) * 36;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div
        style={{
          position: "absolute", width: 1300, height: 1300, borderRadius: "50%",
          top: -620, right: -420 + d1, filter: "blur(60px)",
          background: `radial-gradient(circle, ${C.orange}26, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute", width: 1100, height: 1100, borderRadius: "50%",
          bottom: -560, left: -380 - d2, filter: "blur(70px)",
          background: `radial-gradient(circle, ${C.purple}22, transparent 64%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// One slice of the wordmark, cut from the brand file so the type is the real type.
const Letter: React.FC<{ x0: number; x1: number; y0: number; y1: number; style: React.CSSProperties }> = ({
  x0, x1, y0, y1, style,
}) => {
  const pad = 6;
  return (
    <div
      style={{
        position: "absolute", left: x0 - pad, top: y0 - pad,
        width: x1 - x0 + pad * 2, height: y1 - y0 + pad * 2, overflow: "hidden", ...style,
      }}
    >
      <Img
        src={staticFile("logo.png")}
        style={{ position: "absolute", left: -(x0 - pad), top: -(y0 - pad), width: LOGO_W, height: LOGO_H }}
      />
    </div>
  );
};

// ── Layer 2: the mark, extruded, on an orbiting camera ──
const Lockup: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The mark grows out of the stem: a circle opening from the stem's top corner.
  const grow = interpolate(f, [sec(T.grow[0]), sec(T.grow[1])], [0, 1], { ...clamp, easing: theme.ease.out });
  const radius = grow * 1500;

  // Orbit: swing out to show the thickness, then a premium spring back to face camera.
  const out = interpolate(f, [sec(T.grow[0]), sec(T.orbitPeak)], [0, 1], { ...clamp, easing: theme.ease.out });
  const back = spring({ frame: f - sec(T.orbitPeak), fps, config: theme.spring.premium });
  const yaw = 30 * out * (1 - back);
  const pitch = 8 * out * (1 - back);

  // Purple shard slides up its own axis (parallel to the stem) and lands.
  const shardP = spring({ frame: f - sec(T.shard), fps, config: theme.spring.land });
  const dir = [0.501, 0.865];
  const shardOff = (1 - shardP) * 900;
  const landF = sec(T.shard) + 14;
  const shake = f >= landF && f < landF + 10 ? Math.sin((f - landF) * 2.6) * 7 * (1 - (f - landF) / 10) : 0;

  // Sheen across the face while the camera swings.
  const sheen = interpolate(f, [sec(0.9), sec(1.9)], [-0.6, 1.4], { ...clamp, easing: theme.ease.inOut });

  // Camera: centred hero → left of the offer.
  const mv = interpolate(f, [sec(T.move[0]), sec(T.move[1])], [0, 1], { ...clamp, easing: theme.ease.move });
  const cx = A.cx + (B.cx - A.cx) * mv;
  const cy = A.cy + (B.cy - A.cy) * mv;
  const s = A.s + (B.s - A.s) * mv;

  const visible = f >= sec(T.collapse[1]) - 1;
  const depth = 14;

  const markSvg = (fillO: string, fillP: string, withSheen: boolean, key: string) => (
    <svg key={key} width={LOGO_W} height={LOGO_H} viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <clipPath id={`grow-${key}`}>
          <polygon points={pts(STEM)} />
          <circle cx={300} cy={372} r={radius} />
        </clipPath>
        <linearGradient id={`sheen-${key}`} x1="0" y1="0" x2="1" y2="0.6" gradientTransform={`translate(${sheen} 0)`}>
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#grow-${key})`}>
        <polygon points={pts(ORANGE)} fill={fillO} />
        {withSheen && <polygon points={pts(ORANGE)} fill={`url(#sheen-${key})`} />}
      </g>
      <g transform={`translate(${dir[0] * shardOff} ${dir[1] * shardOff})`} opacity={shardP > 0.001 ? 1 : 0}>
        <polygon points={pts(PURPLE)} fill={fillP} />
        {withSheen && <polygon points={pts(PURPLE)} fill={`url(#sheen-${key})`} />}
      </g>
    </svg>
  );

  return (
    <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: `${cx}px ${cy - 60}px` }}>
      <div
        style={{
          position: "absolute", left: cx - LOGO_W / 2 + shake, top: cy - LOGO_H / 2,
          width: LOGO_W, height: LOGO_H, transformStyle: "preserve-3d",
          transform: `scale(${s}) rotateY(${yaw}deg) rotateX(${pitch}deg)`,
          opacity: visible ? 1 : 0,
        }}
      >
        {/* extrusion: stacked back faces give the mark real thickness under the orbit */}
        {Array.from({ length: depth }, (_, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, transform: `translateZ(${-(i + 1) * 5}px)` }}>
            {markSvg(C.orangeDeep, C.purpleDeep, false, `d${i}`)}
          </div>
        ))}
        <div style={{ position: "absolute", inset: 0, transform: "translateZ(0px)" }}>{markSvg(C.orange, C.purple, true, "front")}</div>

        {SEVUN.x.map(([x0, x1], i) => {
          const p = spring({ frame: f - sec(T.sevun) - i * 4, fps, config: theme.spring.snappy });
          const o = interpolate(f, [sec(T.sevun) + i * 4, sec(T.sevun) + i * 4 + 7], [0, 1], clamp);
          return (
            <Letter key={i} x0={x0} x1={x1} y0={SEVUN.y0} y1={SEVUN.y1}
              style={{ opacity: o, transform: `translateY(${(1 - p) * 110}px) scale(${0.9 + 0.1 * p})`, filter: `blur(${(1 - o) * 26}px)` }} />
          );
        })}
        {MARKETING.x.map(([x0, x1], i) => {
          const p = interpolate(f, [sec(T.marketing) + i * 2, sec(T.marketing) + i * 2 + 16], [0, 1], { ...clamp, easing: theme.ease.out });
          return (
            <Letter key={i} x0={x0} x1={x1} y0={MARKETING.y0} y1={MARKETING.y1}
              style={{ opacity: p, transform: `translateX(${(i - 4) * 55 * (1 - p)}px)`, filter: `blur(${(1 - p) * 14}px)` }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── The carry in: the burst's full-frame orange collapses into the stem ──
const Collapse: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= sec(T.collapse[1])) return null;
  const p = interpolate(f, [sec(T.collapse[0]), sec(T.collapse[1])], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const corners: [number, number][] = [[-260, -260], [2180, -260], [2180, 1340], [-260, 1340]];
  const target = STEM.map(([x, y]) => [A.cx + (x - LOGO_W / 2) * A.s, A.cy + (y - LOGO_H / 2) * A.s]);
  const poly = corners.map(([x, y], i) => `${x + (target[i][0] - x) * p}px ${y + (target[i][1] - y) * p}px`).join(",");
  return <AbsoluteFill style={{ background: C.orange, clipPath: `polygon(${poly})` }} />;
};

// ── Layer 3: the offer ──
const Word: React.FC<{ at: number; children: React.ReactNode; color?: string }> = ({ at, children, color }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 8], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <span
      style={{
        display: "inline-block", marginRight: "0.24em", color, opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`, filter: `blur(${(1 - p) * 10}px)`,
      }}
    >
      {children}
    </span>
  );
};

const Offer: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const left = 820;
  const divider = interpolate(f, [sec(T.move[0]) + 6, sec(T.move[1])], [0, 1], { ...clamp, easing: theme.ease.out });
  const kick = interpolate(f, [sec(T.kicker), sec(T.kicker) + 14], [0, 1], { ...clamp, easing: theme.ease.out });
  const ul = interpolate(f, [sec(T.underline), sec(T.underline) + 12], [0, 1], { ...clamp, easing: theme.ease.out });
  const cta = spring({ frame: f - sec(T.cta), fps, config: theme.spring.land });
  const ctaO = interpolate(f, [sec(T.cta), sec(T.cta) + 6], [0, 1], clamp);
  const t0 = sec(T.title);
  const t1 = sec(T.line2);

  return (
    <AbsoluteFill style={{ fontFamily: theme.fonts.display, color: C.ink }}>
      <div style={{ position: "absolute", left: 730, top: 300, width: 2, height: 480, background: C.purple, opacity: 0.28, transformOrigin: "top", transform: `scaleY(${divider})` }} />

      <div style={{ position: "absolute", left, top: 292, display: "flex", alignItems: "center", gap: 18, opacity: kick, transform: `translateX(${(1 - kick) * -24}px)` }}>
        <div style={{ width: 14, height: 34, background: C.orange, transform: "skewX(-28deg)" }} />
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: `${0.32 + (1 - kick) * 0.3}em`, color: C.purple }}>THE SEVUN OFFER</div>
      </div>

      <div style={{ position: "absolute", left, top: 346, fontSize: 150, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
        <Word at={t0}>Try</Word>
        <Word at={t0 + 3} color={C.purple}>1</Word>
        <Word at={t0 + 6}>video.</Word>
      </div>

      <div style={{ position: "absolute", left, top: 528, fontSize: 74, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>
        <Word at={t1}>Pay</Word>
        <Word at={t1 + 3}>only</Word>
        <span style={{ position: "relative", display: "inline-block" }}>
          <Word at={t1 + 6} color={C.orange}>if</Word>
          <Word at={t1 + 9} color={C.orange}>you</Word>
          <Word at={t1 + 12} color={C.orange}>like</Word>
          <Word at={t1 + 15} color={C.orange}>it.</Word>
          <div style={{ position: "absolute", left: 0, right: "0.24em", bottom: -10, height: 9, borderRadius: 5, background: C.orange, transformOrigin: "left", transform: `scaleX(${ul})` }} />
        </span>
      </div>

      <div
        style={{
          position: "absolute", left, top: 690, display: "flex", alignItems: "center", gap: 20,
          padding: "26px 46px", borderRadius: 999, background: C.purple, color: "#fff",
          fontSize: 44, fontWeight: 700, letterSpacing: "-0.005em", opacity: ctaO,
          transform: `translateY(${(1 - cta) * 30}px) scale(${0.86 + 0.14 * cta})`, transformOrigin: "left center",
          boxShadow: "0 18px 40px rgba(78,49,117,0.28)",
        }}
      >
        DM us to get started
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ── Layers 4–5: grain and vignette ──
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: noise, backgroundSize: "220px",
        backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.06, mixBlendMode: "multiply",
      }}
    />
  );
};
const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 58%, rgba(34,22,47,0.14) 100%)" }} />
);

export const Outro: React.FC = () => (
  <AbsoluteFill>
    <style>{font}</style>
    <Ground />
    <Lockup />
    <Offer />
    <Collapse />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
