import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { theme, clampX } from "../theme";
import { Card, Counter, Display, Pop, Stage, Tag, useAt, useRange, useT } from "../components/common";
import { Box, Coin, Cyl, Iso, OnTop, OnLeft, Packet, Person, Phone, Shadow, proj, mix } from "../components/iso";

const { colors: c } = theme;

const Chat: React.FC<{ at: number; y: number; text: string; mine?: boolean; w?: number }> = ({ at, y, text, mine, w = 600 }) => {
  const p = useAt(at, theme.spring.snappy);
  return (
    <div style={{ position: "absolute", top: y, left: mine ? undefined : 0, right: mine ? 0 : undefined, opacity: p, transform: `translateY(${(1 - p) * 24}px) scale(${0.9 + 0.1 * p})`, transformOrigin: mine ? "right" : "left" }}>
      <div style={{ background: mine ? c.blue : "#fff", color: mine ? "#fff" : c.ink, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 36, padding: "20px 30px", borderRadius: 30, borderBottomRightRadius: mine ? 6 : 30, borderBottomLeftRadius: mine ? 30 : 6, maxWidth: w, boxShadow: "0 12px 30px -12px rgba(0,30,120,0.3)" }}>{text}</div>
    </div>
  );
};

export const Borders: React.FC = () => {
  const t = useT();
  const k = 1;
  const islands = [
    { x: -330, y: -60, name: "Lagos" },
    { x: -60, y: -330, name: "London" },
    { x: 150, y: 120, name: "São Paulo" },
  ];
  const fence = useRange(23.2, 24.0);
  const phone = useAt(26.3, theme.spring.smooth);
  return (
    <Stage mode="blue" seed={5}>
      <Iso ox={540} oy={900}>
        {islands.map((il, i) => {
          const p = useAt(22.95 + i * 0.25, theme.spring.smooth);
          return (
            <g key={i} opacity={p} transform={`translate(0,${(1 - p) * 60})`}>
              <Shadow x={il.x} y={il.y} w={200} d={200} k={k} />
              <Box x={il.x} y={il.y} w={200} d={200} h={26} color="#fff" k={k} grid={4} />
              <Person x={il.x + 60} y={il.y + 70} z={26} k={1.5} color={c.blue} />
              <Person x={il.x + 130} y={il.y + 120} z={26} k={1.5} color={c.ink} />
            </g>
          );
        })}
        {/* dashed border lines */}
        {[[-100, -400, -100, 400], [-400, 30, 400, 30]].map(([a, b, cc, d], i) => {
          const [x1, y1] = proj(a, b, 26, k), [x2, y2] = proj(cc, d, 26, k);
          return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * fence} y2={y1 + (y2 - y1) * fence} stroke="#fff" strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" opacity={0.9} />;
        })}
        {/* coins hopping between islands over the borders */}
        {[[0, 1, 0], [1, 2, 0.5], [2, 0, 1.0]].map(([a, b, d], i) => {
          const f = ((t - 23.8 - d) / 1.4) % 1;
          const on = t > 23.8 + d && t < 26.3 ? 1 : 0;
          const A = islands[a], B = islands[b];
          const x = A.x + 100 + (B.x - A.x) * f, y = A.y + 100 + (B.y - A.y) * f;
          const z = 40 + Math.sin(f * Math.PI) * 130;
          return <Coin key={i} x={x} y={y} z={z} r={34} k={k} spin={t * 200} o={on * Math.min(1, f * 6, (1 - f) * 6)} />;
        })}
      </Iso>
      <div style={{ position: "absolute", left: 170, top: 1230, width: 740, opacity: phone, transform: `translateY(${(1 - phone) * 60}px)` }}>
        <Card style={{ padding: 28, background: "#F4F7FF", position: "relative", height: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, color: c.ink }}>
            <Img src={staticFile("wa-icon.png")} style={{ width: 54, height: 54 }} /> WhatsApp
          </div>
          <Chat at={26.5} y={92} mine text="Sent you 1 coin 🪙" w={560} />
          <Chat at={27.1} y={188} text="Received ✓ instant" w={560} />
        </Card>
      </div>
    </Stage>
  );
};

export const Clearing: React.FC = () => {
  const t = useT();
  const k = 1.45;
  const hub = useAt(28.0, theme.spring.smooth);
  const bal = useAt(31.7, theme.spring.smooth);
  const tilt = interpolate(useAt(32.2, { damping: 8, stiffness: 60, mass: 1 }), [0, 1], [0, 1]);
  const flow = (t - 28.4) * 1.1;
  const items = Array.from({ length: 9 }, (_, i) => i);
  return (
    <Stage mode="light" seed={6}>
      <Iso ox={540} oy={720} style={{ opacity: hub }}>
        <Shadow x={-300} y={-80} w={600} d={160} k={k} />
        {/* conveyor belt */}
        <Box x={-330} y={-40} w={660} d={80} h={20} color="#C9D3F2" k={k} grid={0} />
        {Array.from({ length: 22 }, (_, i) => {
          const x = -330 + ((i * 30 + ((t * 80) % 30)) % 660);
          const [a, b] = proj(x, -38, 20, k), [d, e] = proj(x, 38, 20, k);
          return <line key={i} x1={a} y1={b} x2={d} y2={e} stroke="#9FB0E0" strokeWidth={2} />;
        })}
        {items.map((i) => {
          const pos = ((flow * 220 + i * 90) % 800) - 400;
          const done = pos > -30;
          return <Packet key={i} x={pos - 13} y={-13} z={20} k={k} color={done ? c.blue : c.muted} icon={done} o={Math.min(1, (400 - Math.abs(pos)) / 60)} />;
        })}
        {/* clearing gate */}
        <Box x={-40} y={-70} w={16} d={16} h={150} color={c.ink} k={k} />
        <Box x={-40} y={54} w={16} d={16} h={150} color={c.ink} k={k} />
        <Box x={-40} y={-70} w={16} d={140} h={22} z={150} color={c.blue} k={k} />
        <OnLeft x={-40} y={70} z={156} k={k}><text x={8} y={-4} fontSize={12} fontWeight={800} fill="#fff" fontFamily={theme.fonts.mono}>CLEAR</text></OnLeft>
        <polygon points={[proj(-34, -54, 0, k), proj(-34, 54, 0, k), proj(-34, 54, 150, k), proj(-34, -54, 150, k)].map((p) => p.join(",")).join(" ")} fill={c.blue} opacity={0.12 + 0.1 * Math.sin(t * 8)} />
      </Iso>
      <Pop at={28.5} style={{ position: "absolute", top: 960, left: 0, right: 0, textAlign: "center" }}>
        <Tag>CLEARINGHOUSE</Tag>
      </Pop>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1090, opacity: bal, transform: `translateY(${(1 - bal) * 60}px)` }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: c.muted }}>
            <span>MARKET MAKER · COIN</span><span style={{ color: c.good }}>● LIVE</span>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
            {[{ l: "BID", v: "buy", col: c.blue }, { l: "ASK", v: "sell", col: c.ink }].map((s, i) => (
              <div key={i} style={{ flex: 1, background: i ? "#EEF0F6" : c.blueSoft, borderRadius: 26, padding: "22px 26px" }}>
                <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 26, color: s.col }}>{s.l}</div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 72, color: s.col, marginTop: 4 }}>{s.v}</div>
                <div style={{ height: 14, borderRadius: 7, background: "rgba(0,0,0,0.08)", marginTop: 10, overflow: "hidden" }}>
                  <div style={{ width: `${55 + Math.sin(t * 4 + i * 3) * 30 * tilt}%`, height: "100%", background: s.col }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 22 }}>
            <Img src={staticFile("wa-icon.png")} style={{ width: 64, height: 64 }} />
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: c.ink }}>always a buyer. always a seller.</div>
          </div>
        </Card>
      </div>
    </Stage>
  );
};

export const Users: React.FC = () => {
  const t = useT();
  const k = 0.9;
  const N = 16;
  const grow = useRange(34.0, 36.3, theme.ease.inOut);
  const on = Math.floor(grow * N * N);
  const big = useAt(37.58, theme.spring.slam);
  const cells = Array.from({ length: N * N }, (_, i) => i);
  const rain = t > 37.6;
  return (
    <Stage mode="ink" seed={7}>
      <Iso ox={540} oy={700}>
        <Shadow x={0} y={0} w={N * 24} d={N * 24} k={k} />
        <Box x={0} y={0} w={N * 24} d={N * 24} h={16} color={c.inkSoft} k={k} />
        {cells.map((i) => {
          const x = (i % N) * 24, y = Math.floor(i / N) * 24;
          const lit = i < on;
          const rise = rain ? Math.max(0, Math.sin((t * 2 + (i % 7)) % 1.5)) * 0 : 0;
          return <g key={i}>{lit && <Cyl x={x + 12 - (N * 24) / 2 + (N * 24) / 2} y={y + 12} z={16} r={7} h={4 + ((i * 7) % 5)} color={i % 11 === 0 ? "#fff" : c.blue} k={k} />}{void rise}</g>;
        })}
      </Iso>
      <div style={{ position: "absolute", top: 1230, left: 60, right: 60, display: "flex", gap: 24 }}>
        <Pop at={34.1} style={{ flex: 1 }}>
          <Card dark style={{ textAlign: "center", padding: 28 }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 26 }}>USERS</div>
            <Display size={104} color="#fff"><Counter at={34.2} to={1} dur={2} fmt={(n) => n.toFixed(2)} />B</Display>
          </Card>
        </Pop>
        <div style={{ flex: 1.15, opacity: big, transform: `scale(${interpolate(big, [0, 1], [0.7, 1])})` }}>
          <Card style={{ textAlign: "center", padding: 28, background: c.blue, border: "none" }}>
            <div style={{ color: "rgba(255,255,255,0.75)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 26 }}>TRANSACTIONS / MONTH</div>
            <Display size={104} color="#fff"><Counter at={37.6} to={150} dur={2.4} />B</Display>
          </Card>
        </div>
      </div>
      {/* packets rising from the plate on "150 billion" */}
      <Iso ox={540} oy={700}>
        {rain && Array.from({ length: 14 }, (_, i) => {
          const ph = ((t - 37.6) * 0.8 + i * 0.13) % 1;
          return <Packet key={i} x={(i * 53) % 440 + 20} y={(i * 91) % 440 + 20} z={20 + ph * 300} k={k} size={20} o={Math.min(1, ph * 5, (1 - ph) * 3)} />;
        })}
      </Iso>
    </Stage>
  );
};

export const Fees: React.FC = () => {
  const t = useT();
  const big = useAt(40.75, theme.spring.slam);
  const row = (at: number) => useAt(at, theme.spring.smooth);
  const day = useRange(43.2, 45.6, theme.ease.inOut);
  const coinDrop = useRange(46.6, 47.3, theme.ease.in);
  const eq = useAt(48.0, theme.spring.smooth);
  const clicked = Math.floor(day * 5.99);
  return (
    <Stage mode="light" seed={8}>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", opacity: big, transform: `scale(${interpolate(big, [0, 1], [0.7, 1])})` }}>
        <Display size={210} color={c.blue}>$<Counter at={40.75} to={15} dur={1.5} />B</Display>
        <Tag style={{ marginTop: 6 }}>PER MONTH · FEES</Tag>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 820, opacity: row(43.0), transform: `translateY(${(1 - row(43.0)) * 60}px)` }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: c.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={50} height={50} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill={c.blue} /><path d="M4 21c0-5 4-8 8-8s8 3 8 8z" fill={c.blue} /></svg>
            </div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, color: c.ink }}>each user, per day</div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            {Array.from({ length: 5 }, (_, i) => {
              const p = i < clicked ? 1 : 0;
              return (
                <div key={i} style={{ flex: 1, height: 130, borderRadius: 26, background: p ? c.blue : "#EEF0F6", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p ? 1 : 0.94})`, transition: "none" }}>
                  <svg width={54} height={54} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke={p ? "#fff" : "#C9CFDD"} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 30, color: c.muted }}>5 transactions</div>
        </Card>
      </div>
      <Pop at={46.1} style={{ position: "absolute", left: 70, right: 70, top: 1250 }}>
        <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: c.muted }}>FEE PER TRANSACTION</div>
            <Display size={130} color={c.ink}>$0.10</Display>
          </div>
          <Iso ox={150} oy={110} w={300} h={220} style={{ position: "relative" }}>
            <Box x={-40} y={-24} w={80} d={48} h={34} color={c.ink} k={1.1} />
            <Coin x={0} y={0} z={34 + (1 - coinDrop) * 150} r={24} k={1.1} spin={t * 200} o={Math.min(1, coinDrop * 4)} />
          </Iso>
        </Card>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", opacity: eq, transform: `translateY(${(1 - eq) * 30}px)`, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 34, color: c.blueDeep }}>
        150B × $0.10 = $15B
      </div>
    </Stage>
  );
};

export const scenes: Record<string, React.FC> = { borders: Borders, clearing: Clearing, users: Users, fees: Fees };
void mix; void OnTop; void Phone;
