import React, { createContext, useContext } from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender } from "remotion";
import { theme, clampX, W, H } from "../theme";
import { CAPTIONS, SCENES } from "../timing";

// ---------- fonts (bundled via @fontsource, no network) ----------
const fontCss = [
  ["Outfit", 500], ["Outfit", 600], ["Outfit", 700], ["Outfit", 800],
  ["Inter", 500], ["Inter", 700], ["JetBrains Mono", 500], ["JetBrains Mono", 700],
]
  .map(([f, w]) => {
    const file = `${String(f).toLowerCase().replace(" ", "-")}-latin-${w}-normal.woff2`;
    return `@font-face{font-family:'${f}';font-weight:${w};src:url(${staticFile("fonts/" + file)}) format('woff2');}`;
  })
  .join("\n");
export const Fonts: React.FC = () => <style>{fontCss}</style>;

// ---------- scene time context ----------
const Ctx = createContext({ start: 0, end: 1 });
export const SceneProvider = Ctx.Provider;
/** absolute video time in seconds */
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return useContext(Ctx).start + frame / fps;
};
export const useScene = () => useContext(Ctx);
/** spring that starts at absolute second `sec` */
export const useAt = (sec: number, config: any = theme.spring.snappy) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start } = useContext(Ctx);
  return spring({ frame: frame - (sec - start) * fps, fps, config });
};
/** eased 0..1 between two absolute seconds */
export const useRange = (a: number, b: number, easing: (t: number) => number = theme.ease.out) => {
  const t = useT();
  return interpolate(t, [a, b], [0, 1], { ...clampX, easing });
};

// ---------- backgrounds ----------
export type Mode = "light" | "blue" | "ink";
const modeBg: Record<Mode, string> = { light: "#E9EBF0", blue: theme.colors.blue, ink: "#07102E" };

export const PaperBg: React.FC<{ mode: Mode; seed?: number }> = ({ mode, seed = 0 }) => {
  const t = useT();
  const s = 1.14 + Math.sin(t / 7 + seed) * 0.02;
  const dx = Math.sin(t / 9 + seed * 2) * 26 + (seed % 3) * 40 - 40;
  const dy = Math.cos(t / 11 + seed) * 30;
  const flip = seed % 2 ? -1 : 1;
  const common: React.CSSProperties = { width: W, height: H, objectFit: "cover", transform: `scale(${s * flip}, ${s}) translate(${dx}px, ${dy}px)` };
  return (
    <AbsoluteFill style={{ background: modeBg[mode], overflow: "hidden" }}>
      {mode === "light" && <Img src={staticFile("paper.png")} style={{ ...common, opacity: 0.95 }} />}
      {mode === "blue" && <Img src={staticFile("paper.png")} style={{ ...common, mixBlendMode: "multiply", opacity: 0.85 }} />}
      {mode === "ink" && <Img src={staticFile("paper.png")} style={{ ...common, mixBlendMode: "soft-light", opacity: 0.22, filter: "invert(1)" }} />}
      {mode === "light" && (
        <>
          <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", top: -500, left: -300 + Math.sin(t / 5) * 40, filter: "blur(60px)", background: `radial-gradient(circle, ${theme.colors.blue}22, transparent 65%)` }} />
          <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", bottom: -380, right: -300, filter: "blur(70px)", background: `radial-gradient(circle, ${theme.colors.blue}18, transparent 65%)` }} />
        </>
      )}
      {mode === "blue" && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.16), transparent 60%)" }} />}
      {mode === "ink" && (
        <div style={{ position: "absolute", width: 1200, height: 1200, borderRadius: "50%", top: 300 + Math.sin(t / 4) * 30, left: -60, filter: "blur(80px)", background: `radial-gradient(circle, ${theme.colors.blue}55, transparent 62%)` }} />
      )}
    </AbsoluteFill>
  );
};

const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
export const Finish: React.FC<{ mode: Mode }> = ({ mode }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.blue, mixBlendMode: "soft-light", opacity: mode === "light" ? 0.1 : 0.16 }} />
      <AbsoluteFill style={{ backgroundImage: noise, backgroundSize: "220px", backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: mode === "light" ? 0.05 : 0.07, mixBlendMode: mode === "light" ? "multiply" : "overlay" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, transparent 58%, rgba(5,15,50,${mode === "light" ? 0.14 : 0.35}) 100%)` }} />
    </AbsoluteFill>
  );
};

// ---------- motion primitives ----------
export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number; y?: number; spr?: any; exitAt?: number }> = ({ at, children, style, from = 0.9, y = 36, spr = theme.spring.smooth, exitAt }) => {
  const p = useAt(at, spr);
  const t = useT();
  const ex = exitAt === undefined ? 0 : interpolate(t, [exitAt, exitAt + 0.3], [0, 1], { ...clampX, easing: theme.ease.in });
  return (
    <div style={{ opacity: Math.min(1, p * 1.4) * (1 - ex), transform: `translateY(${interpolate(p, [0, 1], [y, 0]) - ex * 30}px) scale(${interpolate(p, [0, 1], [from, 1])})`, willChange: "transform", ...style }}>{children}</div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; dark?: boolean }> = ({ children, style, dark }) => (
  <div
    style={{
      background: dark ? "rgba(12,22,60,0.92)" : theme.colors.card,
      border: `2px solid ${dark ? "rgba(120,150,255,0.25)" : "rgba(0,0,0,0.04)"}`,
      borderRadius: 40,
      boxShadow: dark ? "0 40px 80px -30px rgba(0,0,0,0.7)" : "0 40px 70px -30px rgba(10,30,100,0.35), 0 4px 0 rgba(10,30,100,0.05)",
      padding: 36,
      fontFamily: theme.fonts.body,
      ...style,
    }}
  >{children}</div>
);

export const Counter: React.FC<{ at: number; to: number; dur?: number; fmt?: (n: number) => string; style?: React.CSSProperties }> = ({ at, to, dur = 1.4, fmt = (n) => n.toFixed(0), style }) => {
  const v = useRange(at, at + dur, theme.ease.out) * to;
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{fmt(v)}</span>;
};

export const Tag: React.FC<{ children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties }> = ({ children, bg = theme.colors.blueSoft, color = theme.colors.blue, style }) => (
  <span style={{ display: "inline-block", padding: "10px 22px", borderRadius: 999, background: bg, color, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, letterSpacing: 1, ...style }}>{children}</span>
);

export const Display: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 120, color = theme.colors.ink, style }) => (
  <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: "-0.035em", color, ...style }}>{children}</div>
);

// ---------- captions (word-timed, key word in a drawn box) ----------
export const Captions: React.FC<{ dark: boolean }> = ({ dark }) => {
  const t = useT();
  const { start, end } = useScene();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunk = CAPTIONS.find((c) => t >= c.s - 0.02 && t < c.e + 0.35 && c.s < end && c.e > start && !(CAPTIONS.some((o) => o !== c && o.s > c.s && o.s <= t + 0.0 && t >= o.s)));
  if (!chunk) return null;
  const words = chunk.t.split(" ");
  const total = words.reduce((a, w) => a + w.replace(/\*/g, "").length + 2, 0);
  const span = Math.max(0.5, Math.min(chunk.e - chunk.s, 2.4)) * 0.8;
  let acc = 0;
  const fadeOut = interpolate(t, [chunk.e, chunk.e + 0.3], [1, 0], { ...clampX });
  let keyOn = false;
  return (
    <div style={{ position: "absolute", top: 150, left: 60, right: 60, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 18px", opacity: fadeOut, fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 70, letterSpacing: "-0.02em", lineHeight: 1.12, textAlign: "center" }}>
      {words.map((raw, i) => {
        const startsKey = raw.startsWith("*");
        const endsKey = raw.endsWith("*");
        if (startsKey) keyOn = true;
        const isKey = keyOn;
        if (endsKey) keyOn = false;
        const w = raw.replace(/\*/g, "");
        const ws = chunk.s + (acc / total) * span;
        acc += w.length + 2;
        const p = spring({ frame: (t - ws) * fps, fps, config: theme.spring.snappy });
        const boxP = spring({ frame: (t - ws - 0.12) * fps, fps, config: theme.spring.smooth });
        void frame;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", opacity: Math.min(1, p * 1.5), transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`, color: isKey ? (dark ? "#fff" : theme.colors.blue) : dark ? "rgba(255,255,255,0.78)" : theme.colors.ink }}>
            {isKey && (
              <span style={{ position: "absolute", inset: "-4px -12px", border: `4px solid ${dark ? "#fff" : theme.colors.blue}`, borderRadius: 14, background: dark ? "rgba(255,255,255,0.12)" : `${theme.colors.blue}14`, transform: `scaleX(${boxP})`, transformOrigin: "left center", opacity: boxP }} />
            )}
            <span style={{ position: "relative" }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

// ---------- scene shell ----------
export const Stage: React.FC<{ mode: Mode; seed?: number; children: React.ReactNode; logo?: boolean }> = ({ mode, seed = 0, children, logo = true }) => {
  const dark = mode !== "light";
  const { start, end } = useScene();
  const t = useT();
  const exit = interpolate(t, [end - 0.18, end], [1, 0], { ...clampX, easing: theme.ease.in });
  return (
    <AbsoluteFill>
      <PaperBg mode={mode} seed={seed} />
      <AbsoluteFill style={{ opacity: 0.35 + exit * 0.65 }}>{children}</AbsoluteFill>
      <Captions dark={dark} />
      {logo && (
        <Img src={staticFile("bizif-logo.png")} style={{ position: "absolute", left: W / 2 - 95, bottom: 84, width: 190, opacity: 0.9, filter: dark ? "brightness(0) invert(1)" : "none" }} />
      )}
      <Finish mode={mode} />
      {void start}
    </AbsoluteFill>
  );
};

export const useIdle = (amp = 1, period = 30) => {
  const t = useT();
  return Math.sin((t * 30) / period) * amp;
};
export { theme, W, H, SCENES };
void delayRender; void continueRender;
