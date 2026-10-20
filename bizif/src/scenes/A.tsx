import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { theme, clampX } from "../theme";
import { Card, Counter, Display, Pop, Stage, Tag, useAt, useIdle, useRange, useT } from "../components/common";
import { Box, Coin, Cyl, GoldBar, Iso, OnTop, Person, Shadow, proj } from "../components/iso";

const { colors: c } = theme;

/** flat front-facing coin that flips about its vertical axis */
export const CoinFront: React.FC<{ size: number; angle: number }> = ({ size, angle }) => {
  const cos = Math.cos(angle), sin = Math.abs(Math.sin(angle));
  const th = size * 0.1;
  const layers = 10;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {Array.from({ length: layers }).map((_, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: c.goldDeep, transform: `translateX(${(i - layers / 2) * (th / layers) * sin * 2}px) scaleX(${Math.abs(cos)})` }} />
      ))}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", transform: `scaleX(${cos})`, background: `radial-gradient(circle at 35% 30%, ${c.goldLight}, ${c.gold} 55%, ${c.goldDeep})`, boxShadow: `inset 0 0 0 ${size * 0.04}px ${c.goldDeep}55, inset 0 0 0 ${size * 0.07}px ${c.goldLight}88`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Img src={staticFile("wa-icon.png")} style={{ width: size * 0.62, height: size * 0.62, borderRadius: "50%", boxShadow: `0 0 0 ${size * 0.025}px ${c.goldDeep}` }} />
      </div>
    </div>
  );
};

export const Hook: React.FC = () => {
  const t = useT();
  const icon = useAt(0.1, theme.spring.bouncy);
  const coin = useAt(1.44, theme.spring.smooth);
  const title = useAt(2.35, theme.spring.slam);
  const sub = useAt(2.9, theme.spring.smooth);
  const idle = useIdle(10, 26);
  const flip = interpolate(t, [1.44, 3.0], [Math.PI * 2.5, 0], { ...clampX, easing: theme.ease.out });
  const ringSpin = interpolate(t, [0, 4], [0, 25]);
  return (
    <Stage mode="light" seed={1}>
      <Pop at={0.2} style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center" }}>
        <Tag bg={c.blue} color="#fff" style={{ fontSize: 30, padding: "12px 28px" }}>EPISODE · BIZIF BREAKDOWN</Tag>
      </Pop>
      {/* concentric rings */}
      {[0, 1, 2].map((i) => {
        const p = useAt(0.2 + i * 0.12, theme.spring.smooth);
        return <div key={i} style={{ position: "absolute", left: 540 - (340 + i * 120), top: 1000 - (340 + i * 120), width: (340 + i * 120) * 2, height: (340 + i * 120) * 2, borderRadius: "50%", border: `3px dashed ${c.blue}${["55", "33", "22"][i]}`, transform: `scale(${p}) rotate(${ringSpin * (i % 2 ? -1 : 1)}deg)` }} />;
      })}
      <div style={{ position: "absolute", left: 540 - 190, top: 1000 - 190 + idle, width: 380, height: 380, transform: `scale(${icon * (1 - coin * 0.0)}) translateX(${interpolate(coin, [0, 1], [0, -170])}px)` }}>
        <Img src={staticFile("wa-icon.png")} style={{ width: 380, height: 380, filter: "drop-shadow(0 30px 40px rgba(0,50,200,0.35))" }} />
      </div>
      <div style={{ position: "absolute", left: 540 - 190 + 190, top: 1000 - 190 - interpolate(coin, [0, 1], [-200, 40]) - idle, opacity: coin, transform: `scale(${interpolate(coin, [0, 1], [0.4, 1])})` }}>
        <div style={{ filter: "drop-shadow(0 30px 30px rgba(120,70,0,0.35))" }}><CoinFront size={380} angle={flip} /></div>
      </div>
      <Pop at={2.35} spr={theme.spring.slam} from={1.25} style={{ position: "absolute", top: 1330, left: 0, right: 0, textAlign: "center" }}>
        <Display size={128} style={{ display: "inline-block" }}>
          WhatsApp <span style={{ color: c.blue }}>Coin</span>
        </Display>
      </Pop>
      <div style={{ position: "absolute", top: 1520, left: 0, right: 0, textAlign: "center", opacity: sub, transform: `translateY(${(1 - sub) * 24}px)`, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 34, color: c.muted, letterSpacing: 3 }}>
        A THOUGHT EXPERIMENT
      </div>
    </Stage>
  );
};

/** banknote brick: blue block with white band */
const Brick: React.FC<{ x: number; y: number; z: number; k: number; o?: number }> = ({ x, y, z, k, o = 1 }) => (
  <Box x={x} y={y} z={z} w={64} d={40} h={14} color={c.blue} k={k} o={o} band="#fff" />
);

export const Buy: React.FC = () => {
  const meta = useAt(4.28, theme.spring.smooth);
  const arrow = useRange(4.7, 5.3);
  const wa = useAt(5.0, theme.spring.bouncy);
  const grow = useRange(5.3, 6.9, theme.ease.inOut);
  const stamp = useAt(7.25, theme.spring.slam);
  const price = useAt(5.3, theme.spring.smooth);
  const layers = Math.floor(grow * 11);
  const bricks: { x: number; y: number; z: number; i: number }[] = [];
  for (let l = 0; l < 11; l++) for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) bricks.push({ x: a * 64, y: b * 40, z: l * 14, i: l });
  bricks.sort((p, q) => p.z - q.z || p.x + p.y - (q.x + q.y));
  return (
    <Stage mode="light" seed={2}>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 36 }}>
        <div style={{ opacity: meta, transform: `translateY(${(1 - meta) * 40}px) scale(${0.92 + meta * 0.08})` }}>
          <Card style={{ padding: "26px 44px" }}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, color: c.muted, fontWeight: 700 }}>BUYER</div>
            <Display size={86} color={c.ink}>Meta</Display>
          </Card>
        </div>
        <svg width={170} height={40} style={{ overflow: "visible" }}>
          <line x1={0} y1={20} x2={150 * arrow} y2={20} stroke={c.blue} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 16" />
          <path d="M138,6 L162,20 L138,34" stroke={c.blue} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.9 ? 1 : 0} />
        </svg>
        <div style={{ transform: `scale(${wa})`, opacity: wa }}>
          <Card style={{ padding: "22px 30px", display: "flex", alignItems: "center", gap: 20 }}>
            <Img src={staticFile("wa-icon.png")} style={{ width: 96, height: 96 }} />
            <div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, color: c.muted, fontWeight: 700 }}>TARGET</div>
              <Display size={50}>WhatsApp</Display>
            </div>
          </Card>
        </div>
      </div>
      <div style={{ position: "absolute", top: 620, left: 0, right: 0, textAlign: "center", opacity: price, transform: `scale(${0.9 + price * 0.1})` }}>
        <Display size={170} color={c.blue}>
          $<Counter at={5.3} to={19.3} dur={1.5} fmt={(n) => n.toFixed(1)} />B
        </Display>
      </div>
      <Iso ox={540} oy={1130}>
        <Shadow x={-10} y={-10} w={200} d={130} k={1.35} />
        {bricks.map((b, i) => (b.i < layers ? <Brick key={i} x={b.x - 90} y={b.y - 60} z={b.z} k={1.35} /> : null))}
      </Iso>
      <div style={{ position: "absolute", top: 1370, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `scale(${interpolate(stamp, [0, 1], [2.2, 1])}) rotate(-6deg)`, opacity: Math.min(1, stamp * 2) }}>
          <div style={{ border: `8px solid ${c.blue}`, color: c.blue, padding: "10px 40px", borderRadius: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 90, letterSpacing: 6, background: "rgba(255,255,255,0.6)" }}>ACQUIRED · 2014</div>
        </div>
      </div>
    </Stage>
  );
};

export const Rev: React.FC = () => {
  const t = useT();
  const card = useAt(8.5, theme.spring.smooth);
  const dashed = useRange(8.5, 10.4, theme.ease.inOut);
  const dashedFade = 1 - useRange(10.5, 11.1);
  const num = useAt(10.92, theme.spring.slam);
  const crowdOn = useRange(14.5, 14.8);
  const wob = (i: number) => Math.sin(t * 5 + i * 1.7) * 2.2;
  const real = Array.from({ length: 24 }, (_, i) => `${i * 18},${150 - (i > 14 ? (i - 14) * 1.2 : 0) + wob(i)}`).join(" ");
  const cols = 15, rows = 8;
  const people: { r: number; q: number }[] = [];
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) people.push({ r, q });
  return (
    <Stage mode="light" seed={3}>
      <Iso ox={540} oy={470} style={{ opacity: crowdOn }}>
        <Shadow x={-6} y={-6} w={cols * 24 + 12} d={rows * 24 + 12} k={1.2} />
        <Box x={-6} y={-6} w={cols * 24 + 12} d={rows * 24 + 12} h={12} color="#fff" k={1.2} grid={0} />
        {people.map((p, i) => {
          const a = useAt(14.5 + (p.r * cols + p.q) * 0.0045, theme.spring.snappy);
          return <Person key={i} x={p.q * 24 + 8 - (cols * 24) / 2 + 150} y={p.r * 24 + 8 - (rows * 24) / 2 + 80} z={12 + (1 - a) * 90} k={1.2} s={1.25} color={(p.q + p.r) % 9 === 0 ? c.ink : c.blue} o={a} />;
        })}
      </Iso>
      <Pop at={14.9} style={{ position: "absolute", top: 800, left: 0, right: 0, textAlign: "center" }}>
        <Tag bg={c.ink} color="#fff">LARGE USER BASE</Tag>
      </Pop>
      <div style={{ position: "absolute", left: 70, right: 70, top: 930, opacity: card, transform: `translateY(${(1 - card) * 70}px) scale(${0.95 + 0.05 * card})` }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: c.muted }}>WHATSAPP · ANNUAL REVENUE</div>
            <Tag>2023</Tag>
          </div>
          <div style={{ transform: `scale(${interpolate(num, [0, 1], [0.8, 1])})`, transformOrigin: "left", opacity: num, marginTop: 8 }}>
            <Display size={150} color={c.blue}>$<Counter at={10.92} to={382} dur={1.2} />M</Display>
          </div>
          <svg width={860} height={300} viewBox="0 0 430 190" style={{ marginTop: 6, overflow: "visible" }}>
            <line x1={0} y1={170} x2={430} y2={170} stroke={c.line} strokeWidth={2} />
            <polyline points={`0,150 ${Array.from({ length: 24 }, (_, i) => `${i * 18},${150 - dashed * i * 6}`).join(" ")}`} fill="none" stroke={c.muted} strokeWidth={3} strokeDasharray="6 8" opacity={dashedFade * 0.7} />
            <polyline points={real} fill="none" stroke={c.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={414} cy={150 - 10 * 1.2 + wob(23)} r={7} fill={c.blue} />
          </svg>
        </Card>
      </div>
    </Stage>
  );
};

export const Gold: React.FC = () => {
  const t = useT();
  const k = 1.5;
  const cn = useAt(17.8, theme.spring.smooth);
  const base = useAt(16.7, theme.spring.smooth);
  const btc = useAt(19.1, theme.spring.snappy);
  const flash = interpolate(t, [21.55, 21.7, 22.5], [0, 1, 0.2], { ...clampX });
  const spin = (t - 17.8) * 70;
  const bars: { x: number; y: number; z: number; n: number }[] = [];
  let n = 0;
  for (let l = 0; l < 3; l++) for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) bars.push({ x: a * 80 - 80, y: b * 40 - 40, z: l * 24, n: n++ });
  const bob = Math.sin(t * 3) * 8;
  return (
    <Stage mode="ink" seed={4}>
      <div style={{ position: "absolute", left: 540 - 520, top: 1010 - 520, width: 1040, height: 1040, borderRadius: "50%", background: `radial-gradient(circle, ${c.gold}${Math.round(60 + flash * 120).toString(16)}, transparent 62%)`, opacity: base }} />
      <Iso ox={540} oy={1180} style={{ opacity: base }}>
        <Shadow x={-130} y={-130} w={260} d={260} k={k} o={0.5} />
        <Box x={-130} y={-130} w={260} d={260} h={30} color={c.inkSoft} k={k} grid={4} />
        <Box x={-110} y={-110} w={220} d={220} h={12} z={30} color={c.blueDeep} k={k} />
        {bars.map((b) => {
          const a = useAt(19.9 + b.n * 0.15, theme.spring.slam);
          return <GoldBar key={b.n} x={b.x - 30} y={b.y - 10} z={42 + b.z + (1 - a) * 220} k={k} o={a} />;
        })}
        <Coin x={0} y={0} z={42 + 80 + 110 + 40 + (1 - cn) * 500 + bob} r={92} k={k} spin={spin} o={cn} />
      </Iso>
      <Pop at={19.1} style={{ position: "absolute", left: 90, top: 520 }}>
        <Card dark style={{ padding: "18px 30px", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 58, height: 58, borderRadius: "50%", background: "#F7931A", color: "#fff", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>₿</div>
          <div style={{ color: "#fff", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40 }}>Bitcoin-style</div>
        </Card>
      </Pop>
      <Pop at={21.0} style={{ position: "absolute", left: 160, right: 160, top: 1470 }}>
        <Card dark style={{ padding: "18px 30px" }}>
          <div style={{ color: c.goldLight, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 30 }}>FINITE GOLD BACKING</div>
          <div style={{ marginTop: 12, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, useRange(21.0, 22.0) * 100)}%`, height: "100%", background: c.gold }} />
          </div>
        </Card>
      </Pop>
      {void btc}
    </Stage>
  );
};
