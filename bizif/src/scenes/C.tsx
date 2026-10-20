import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { theme } from "../theme";
import { Card, Counter, Display, Pop, Stage, Tag, useAt, useRange, useT } from "../components/common";
import { Box, Coin, Iso, OnLeft, OnTop, Packet, Shadow, proj } from "../components/iso";

const { colors: c } = theme;

export const Dwarf: React.FC = () => {
  const t = useT();
  const k = 1.3;
  const small = useAt(50.0, theme.spring.smooth);
  const tall = useRange(49.8, 53.6, theme.ease.inOut);
  const squash = useAt(54.0, theme.spring.slam);
  const H1 = 22 + tall * 520;
  return (
    <Stage mode="blue" seed={9}>
      <Iso ox={540} oy={1180}>
        <Shadow x={-260} y={-120} w={520} d={240} k={k} o={0.4} />
        <Box x={-250} y={-110} w={500} d={220} h={16} color="#EAF0FF" k={k} grid={0} />
        {/* today's earnings: tiny bar */}
        <Box x={-190} y={-30} z={16} w={90} d={90} h={22 * (1 - squash * 0.25)} color={c.ink} k={k} />
        {/* monthly fees: huge bar */}
        <Box x={40} y={-40} z={16} w={110} d={110} h={H1} color="#fff" k={k} band={c.blue} />
      </Iso>
      <Pop at={50.1} style={{ position: "absolute", left: 80, top: 520 }}>
        <Card style={{ padding: "20px 32px" }}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: c.muted }}>CURRENT EARNINGS · 2023</div>
          <Display size={70}>$382M</Display>
        </Card>
      </Pop>
      <Pop at={51.0} style={{ position: "absolute", right: 80, top: 640 }}>
        <Card style={{ padding: "20px 32px", background: c.ink }}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,0.65)" }}>TRANSACTION FEES</div>
          <Display size={70} color="#fff">$15B <span style={{ fontSize: 34 }}>/ month</span></Display>
        </Card>
      </Pop>
      {void t}
    </Stage>
  );
};

export const Data: React.FC = () => {
  const t = useT();
  const k = 1.15;
  const eng = useAt(58.4, theme.spring.smooth);
  const out = useAt(63.1, theme.spring.smooth);
  const out2 = useAt(65.8, theme.spring.smooth);
  return (
    <Stage mode="ink" seed={10}>
      {/* stream of transaction packets into the analytics engine */}
      <Iso ox={540} oy={780}>
        <Shadow x={-120} y={-120} w={240} d={240} k={k} o={0.5} />
        <g opacity={eng} transform={`translate(0,${(1 - eng) * 80})`}>
          <Box x={-100} y={-100} w={200} d={200} h={90} color={c.inkSoft} k={k} grid={4} />
          <Box x={-70} y={-70} w={140} d={140} h={50} z={90} color={c.blue} k={k} />
          <OnTop x={0} y={0} z={140} k={k}><circle r={44} fill="#fff" /><circle r={28} fill="none" stroke={c.blue} strokeWidth={8} /><line x1={20} y1={20} x2={46} y2={46} stroke={c.blue} strokeWidth={10} strokeLinecap="round" /></OnTop>
        </g>
        {Array.from({ length: 12 }, (_, i) => {
          const ph = ((t - 57.6) * 0.7 + i / 12) % 1;
          const on = t > 57.6 && t < 66 ? 1 : 0;
          return <Packet key={i} x={-330 + ph * 240 - 10} y={-10 + Math.sin(i * 2) * 60} z={110 - ph * 90} k={k} size={22} o={on * Math.min(1, ph * 6, (1 - ph) * 4)} />;
        })}
      </Iso>
      <Pop at={59.9} style={{ position: "absolute", left: 0, right: 0, top: 950, textAlign: "center" }}><Tag bg={c.gold} color={c.ink}>ALTERNATIVE REVENUE</Tag></Pop>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1050, display: "flex", gap: 24 }}>
        <div style={{ flex: 1, opacity: out, transform: `translateY(${(1 - out) * 60}px)` }}>
          <Card dark style={{ padding: 26, height: 400 }}>
            <div style={{ color: "#fff", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 38 }}>Global trade</div>
            <svg width={420} height={290} viewBox="0 0 210 145" style={{ marginTop: 10 }}>
              {[[30, 100], [80, 40], [150, 90], [185, 35], [110, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={i === 1 ? c.gold : c.blue} />)}
              {[[0, 1], [1, 3], [0, 4], [4, 2], [2, 3], [1, 2]].map(([a, b], i) => {
                const P = [[30, 100], [80, 40], [150, 90], [185, 35], [110, 120]];
                const p = useRange(63.2 + i * 0.25, 64.2 + i * 0.25);
                return <path key={i} d={`M${P[a][0]},${P[a][1]} Q${(P[a][0] + P[b][0]) / 2},${Math.min(P[a][1], P[b][1]) - 35} ${P[b][0]},${P[b][1]}`} stroke="#8FB0FF" strokeWidth={2.5} fill="none" strokeDasharray="200" strokeDashoffset={200 * (1 - p)} />;
              })}
            </svg>
          </Card>
        </div>
        <div style={{ flex: 1, opacity: out2, transform: `translateY(${(1 - out2) * 60}px)` }}>
          <Card dark style={{ padding: 26, height: 400 }}>
            <div style={{ color: "#fff", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 38 }}>Consumer behavior</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 250, marginTop: 20 }}>
              {[0.4, 0.75, 0.55, 0.95, 0.65].map((h, i) => {
                const p = useRange(65.9 + i * 0.12, 66.8 + i * 0.12);
                return <div key={i} style={{ flex: 1, height: `${h * p * 100}%`, background: i === 3 ? c.gold : c.blue, borderRadius: 12 }} />;
              })}
            </div>
          </Card>
        </div>
      </div>
    </Stage>
  );
};

const Building: React.FC<{ x: number; y: number; k: number; kind: "shop" | "gov" | "bank"; lit: number }> = ({ x, y, k, kind, lit }) => {
  const col = kind === "shop" ? c.blue : kind === "gov" ? "#fff" : c.ink;
  return (
    <g>
      <Shadow x={x - 10} y={y - 10} w={150} d={130} k={k} o={0.3} />
      <Box x={x} y={y} w={130} d={110} h={90 + lit * 0} color={col} k={k} />
      {kind === "shop" && <Box x={x - 10} y={y + 80} z={70} w={150} d={40} h={14} color={c.gold} k={k} />}
      {kind === "gov" && [0, 1, 2, 3].map((i) => <Box key={i} x={x + 8 + i * 30} y={y + 120} w={14} d={14} h={90} color="#DCE6FF" k={k} />)}
      {kind === "gov" && <Box x={x - 6} y={y - 6} z={90} w={142} d={122} h={14} color="#DCE6FF" k={k} />}
      {kind === "bank" && <Box x={x + 30} y={y + 20} z={90} w={70} d={70} h={40} color={c.blue} k={k} />}
      <OnLeft x={x + 18} y={y + 110} z={20} k={k}><rect width={94} height={44} rx={6} fill={lit > 0.5 ? c.gold : "rgba(255,255,255,0.25)"} /></OnLeft>
    </g>
  );
};

export const Clients: React.FC = () => {
  const t = useT();
  const k = 0.9;
  const layer = useAt(73.5, theme.spring.smooth);
  const lits = [70.4, 71.3, 72.7].map((s) => useAt(s, theme.spring.snappy));
  const labels = ["Businesses", "Governments", "Financial institutions"];
  return (
    <Stage mode="light" seed={11}>
      <Iso ox={540} oy={820}>
        <Shadow x={-290} y={-290} w={580} d={580} k={k} />
        <Box x={-290} y={-290} w={580} d={580} h={20 + layer * 26} color="#fff" k={k} grid={0} />
        <Box x={-250} y={-250} w={500} d={500} h={14 + layer * 26} color={c.blueSoft} k={k} stroke={false} o={0} />
        <Building x={-250} y={20} k={k} kind="shop" lit={lits[0]} />
        <Building x={-60} y={-250} k={k} kind="gov" lit={lits[1]} />
        <Building x={100} y={40} k={k} kind="bank" lit={lits[2]} />
        {/* data cube in the middle pushing insight packets */}
        <Box x={-30} y={-30} z={20 + layer * 26} w={60} d={60} h={60} color={c.blue} k={k} band="#fff" />
        {[0, 1, 2].map((i) => {
          const s = [70.4, 71.3, 72.7][i];
          const ph = Math.min(1, Math.max(0, (t - s) / 0.9));
          const tgt = [[-190, 80], [-10, -190], [165, 100]][i];
          return <Packet key={i} x={tgt[0] * ph - 10} y={tgt[1] * ph - 10} z={50 + Math.sin(ph * Math.PI) * 80} k={k} size={22} color={c.gold} icon={false} o={ph > 0 && ph < 1 ? 1 : 0} />;
        })}
      </Iso>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1170, display: "flex", gap: 16 }}>
        {labels.map((l, i) => (
          <Pop key={i} at={[70.4, 71.3, 72.7][i]} style={{ flex: 1 }}>
            <Card style={{ padding: "20px 12px", textAlign: "center", borderRadius: 30 }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, color: c.ink, lineHeight: 1.1 }}>{l}</div>
            </Card>
          </Pop>
        ))}
      </div>
      <Pop at={73.6} spr={theme.spring.slam} style={{ position: "absolute", left: 0, right: 0, top: 1360, textAlign: "center" }}>
        <Display size={96} color={c.blue}>+ profit layer</Display>
      </Pop>
      {void Coin}
    </Stage>
  );
};

export const scenes: Record<string, React.FC> = { dwarf: Dwarf, data: Data, clients: Clients };
void interpolate; void staticFile; void Img; void Counter; void proj;
