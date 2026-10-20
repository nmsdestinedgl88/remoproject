import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { theme } from "../theme";
import { Card, Counter, Display, Pop, Stage, Tag, useAt, useIdle, useRange, useT } from "../components/common";
import { Box, Coin, Cyl, Iso, OnLeft, OnTop, Packet, Person, Shadow, proj } from "../components/iso";
import { CoinFront } from "./A";

const { colors: c } = theme;

export const Adopt: React.FC = () => {
  const N = 11, k = 0.95;
  const arrow = useAt(78.4, theme.spring.slam);
  const cells = Array.from({ length: N * N }, (_, i) => i);
  return (
    <Stage mode="light" seed={12}>
      <Iso ox={540} oy={720}>
        <Shadow x={-(N * 40) / 2} y={-(N * 40) / 2} w={N * 40} d={N * 40} k={k} />
        <Box x={-(N * 40) / 2} y={-(N * 40) / 2} w={N * 40} d={N * 40} h={16} color="#fff" k={k} />
        {cells.map((i) => {
          const a = useAt(76.5 + ((i * 37) % (N * N)) * 0.02, theme.spring.snappy);
          const x = (i % N) * 40 - (N * 40) / 2 + 20, y = Math.floor(i / N) * 40 - (N * 40) / 2 + 20;
          const base = i % 4 === 0;
          return <Person key={i} x={x} y={y} z={16 + (1 - a) * 110} k={k} s={1.6} color={base ? c.ink : c.blue} o={a} />;
        })}
      </Iso>
      <Pop at={77.0} style={{ position: "absolute", top: 1230, left: 90 }}><Tag bg={c.ink} color="#fff">CURRENT USERS</Tag></Pop>
      <div style={{ position: "absolute", top: 1330, left: 90, right: 90, opacity: arrow, transform: `scale(${interpolate(arrow, [0, 1], [0.8, 1])})`, transformOrigin: "left" }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width={110} height={110} viewBox="0 0 24 24"><path d="M12 20V6M5 12l7-7 7 7" stroke={c.blue} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: c.muted }}>COIN ADOPTION</div>
            <Display size={100} color={c.blue}>+<Counter at={78.4} to={100} dur={2} />%</Display>
          </div>
        </Card>
      </div>
    </Stage>
  );
};

export const Regions: React.FC = () => {
  const t = useT();
  const k = 0.95;
  const spots = [{ x: -220, y: -40 }, { x: -20, y: -230 }, { x: 140, y: 30 }, { x: -60, y: 130 }];
  const chips = ["18–24", "25–40", "40+"];
  return (
    <Stage mode="blue" seed={13}>
      <Iso ox={540} oy={760}>
        {spots.map((s, i) => {
          const a = useAt(81.0 + i * 0.55, theme.spring.smooth);
          return (
            <g key={i} opacity={a} transform={`translate(0,${(1 - a) * 70})`}>
              <Shadow x={s.x} y={s.y} w={170} d={170} k={k} />
              <Box x={s.x} y={s.y} w={170} d={170} h={22} color="#fff" k={k} grid={3} />
              <Person x={s.x + 55} y={s.y + 60} z={22} k={1.4} color={c.blue} />
              <Person x={s.x + 115} y={s.y + 110} z={22} k={1.4} color={c.ink} />
              {/* pin */}
              <g transform={`translate(${proj(s.x + 85, s.y + 85, 22, k)[0]},${proj(s.x + 85, s.y + 85, 22, k)[1] - 70 - Math.sin(t * 4 + i) * 6})`}>
                <path d="M0,0 C-26,-34 -22,-64 0,-64 C22,-64 26,-34 0,0 Z" fill={c.gold} stroke={c.goldDeep} strokeWidth={3} />
                <circle cy={-40} r={9} fill="#fff" />
              </g>
            </g>
          );
        })}
      </Iso>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1260, display: "flex", gap: 20 }}>
        {chips.map((s, i) => (
          <Pop key={i} at={83.1 + i * 0.25} style={{ flex: 1 }}>
            <Card style={{ textAlign: "center", padding: "22px 8px", borderRadius: 34 }}>
              <Display size={54} color={c.blue}>{s}</Display>
              <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: c.muted, marginTop: 6 }}>{["NEW", "NEW", "NEW"][i]} DEMOGRAPHIC</div>
            </Card>
          </Pop>
        ))}
      </div>
    </Stage>
  );
};

export const Services: React.FC = () => {
  const t = useT();
  const k = 1.0;
  const mod = (at: number) => useAt(at, theme.spring.smooth);
  const trade = mod(86.5), loan = mod(87.95), ins = mod(88.85), ph = useAt(89.5, theme.spring.smooth);
  const candles = [14, 30, 22, 46, 38, 60, 52];
  return (
    <Stage mode="ink" seed={14}>
      <Iso ox={540} oy={760}>
        <Shadow x={-260} y={-260} w={520} d={520} k={k} />
        <Box x={-260} y={-260} w={520} d={520} h={20} color={c.inkSoft} k={k} grid={4} />
        {/* trading platform: screen + candles */}
        <g opacity={trade} transform={`translate(0,${(1 - trade) * 80})`}>
          <Box x={-200} y={-200} z={20} w={170} d={120} h={14} color={c.blue} k={k} />
          {candles.map((h, i) => <Box key={i} x={-190 + i * 22} y={-170} z={34} w={12} d={12} h={h * (0.6 + 0.4 * Math.sin(t * 3 + i))} color={i % 2 ? "#fff" : c.gold} k={k} />)}
        </g>
        {/* loans: coin stack */}
        <g opacity={loan} transform={`translate(0,${(1 - loan) * 80})`}>
          {[0, 1, 2, 3, 4].map((i) => <Coin key={i} x={110} y={-120} z={20 + i * 12} r={46} k={k} />)}
        </g>
        {/* insurance: shield block */}
        <g opacity={ins} transform={`translate(0,${(1 - ins) * 80})`}>
          <Box x={-40} y={60} z={20} w={150} d={90} h={110} color="#fff" k={k} />
          <OnLeft x={-40} y={150} z={20} k={k}><path d="M75,20 L115,34 L115,74 Q115,100 75,112 Q35,100 35,74 L35,34 Z" fill={c.blue} /><path d="M58,66 l12,12 l22,-26" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" /></OnLeft>
        </g>
      </Iso>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1180, display: "flex", gap: 16 }}>
        {[["Trading", trade], ["Loans", loan], ["Insurance", ins]].map(([l, p], i) => (
          <div key={i} style={{ flex: 1, opacity: p as number, transform: `translateY(${(1 - (p as number)) * 40}px)` }}>
            <Card dark style={{ padding: "22px 10px", textAlign: "center", borderRadius: 30 }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: "#fff" }}>{l as string}</div>
            </Card>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1380, display: "flex", justifyContent: "center", opacity: ph, transform: `translateY(${(1 - ph) * 40}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 38px", background: "#fff", borderRadius: 999 }}>
          <Img src={staticFile("wa-icon.png")} style={{ width: 74, height: 74 }} />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, color: c.ink }}>all inside the app</div>
        </div>
      </div>
    </Stage>
  );
};

export const Shop: React.FC = () => {
  const t = useT();
  const k = 1.0;
  const cart = useAt(91.3, theme.spring.smooth);
  const up = useAt(93.6, theme.spring.slam);
  return (
    <Stage mode="light" seed={15}>
      <Iso ox={540} oy={760}>
        <Shadow x={-300} y={-60} w={600} d={120} k={k} />
        <Box x={-300} y={-60} w={600} d={120} h={18} color="#C9D3F2" k={k} />
        {Array.from({ length: 7 }, (_, i) => {
          const x = ((i * 110 + (t - 91) * 120) % 770) - 340;
          const col = i % 3 === 0 ? c.blue : i % 3 === 1 ? c.gold : c.ink;
          return (
            <g key={i} opacity={cart}>
              <Box x={x} y={-30} z={18} w={64} d={60} h={50} color={col} k={k} band="#fff" />
            </g>
          );
        })}
        {/* checkout gate */}
        <Box x={60} y={-100} w={16} d={16} h={120} color={c.ink} k={k} />
        <Box x={60} y={84} w={16} d={16} h={120} color={c.ink} k={k} />
        <Box x={60} y={-100} z={120} w={16} d={200} h={20} color={c.blue} k={k} />
      </Iso>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1060, opacity: cart, transform: `translateY(${(1 - cart) * 50}px)` }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <svg width={110} height={110} viewBox="0 0 24 24"><path d="M3 4h2l2.4 11h10.2l2-8H6.2" stroke={c.blue} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx={9} cy={19} r={1.7} fill={c.blue} /><circle cx={17} cy={19} r={1.7} fill={c.blue} /></svg>
          <div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 28, color: c.muted }}>GLOBAL E-COMMERCE</div>
            <Display size={64}>pay with the coin</Display>
          </div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1300, opacity: up, transform: `scale(${interpolate(up, [0, 1], [0.8, 1])})` }}>
        <Card style={{ background: c.blue, border: "none", display: "flex", alignItems: "center", gap: 24 }}>
          <svg width={90} height={90} viewBox="0 0 24 24"><path d="M12 20V6M5 12l7-7 7 7" stroke="#fff" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <Display size={84} color="#fff">profitability</Display>
        </Card>
      </div>
    </Stage>
  );
};

export const Ask: React.FC = () => {
  const t = useT();
  const idle = useIdle(8, 24);
  const q = useAt(95.6, theme.spring.bouncy);
  const qs = [
    { at: 96.7, s: "Would you use it?" },
    { at: 97.76, s: "Would governments allow it?" },
    { at: 99.5, s: "How would this change tech?" },
    { at: 101.94, s: "How valuable would it be?" },
  ];
  const fin = useAt(103.2, theme.spring.slam);
  return (
    <Stage mode="blue" seed={16}>
      <div style={{ position: "absolute", left: 540 - 180, top: 470 + idle, width: 360, height: 360, opacity: q, transform: `scale(${q})` }}>
        <Img src={staticFile("q-icon.png")} style={{ width: 360, height: 360, filter: "drop-shadow(0 30px 40px rgba(0,10,80,0.45))" }} />
      </div>
      {qs.map((x, i) => {
        const p = useAt(x.at, theme.spring.smooth);
        const exit = interpolate(t, [x.at + 1.2, x.at + 1.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const lastCard = i === qs.length - 1;
        return (
          <div key={i} style={{ position: "absolute", left: 90, right: 90, top: 930 + i * 0, opacity: p * (lastCard ? 1 : 1 - exit), transform: `translateY(${(1 - p) * 90 - exit * 40}px) scale(${0.94 + 0.06 * p})` }}>
            <Card style={{ padding: "46px 40px", textAlign: "center" }}>
              <Display size={78} color={c.ink}>{x.s}</Display>
            </Card>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, display: "flex", justifyContent: "center", opacity: fin, transform: `scale(${interpolate(fin, [0, 1], [0.6, 1])})` }}>
        <div style={{ filter: "drop-shadow(0 30px 30px rgba(0,10,80,0.4))" }}><CoinFront size={260} angle={0} /></div>
      </div>
    </Stage>
  );
};

export const Outro: React.FC = () => {
  const logo = useAt(104.4, theme.spring.bouncy);
  const line = useAt(105.2, theme.spring.smooth);
  const cta = useAt(105.9, theme.spring.slam);
  return (
    <Stage mode="light" seed={17} logo={false}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`, opacity: logo }}>
        <Img src={staticFile("bizif-logo.png")} style={{ width: 720 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1090, textAlign: "center", opacity: line, transform: `translateY(${(1 - line) * 30}px)` }}>
        <Display size={84}>What's your <span style={{ color: c.blue }}>take?</span></Display>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, display: "flex", justifyContent: "center", opacity: cta, transform: `scale(${interpolate(cta, [0, 1], [0.7, 1])})` }}>
        <div style={{ background: c.blue, color: "#fff", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, padding: "26px 60px", borderRadius: 999, boxShadow: "0 30px 50px -20px rgba(0,60,220,0.6)" }}>Comment below</div>
      </div>
    </Stage>
  );
};

export const scenes: Record<string, React.FC> = { adopt: Adopt, regions: Regions, services: Services, shop: Shop, ask: Ask, outro: Outro };
void Cyl; void OnTop; void Packet; void Tag; void Counter; void useRange;
