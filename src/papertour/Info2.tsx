import React from 'react';
import {Head, Label, PaperTour, Rise, Station, C, F, B, ease, sp, stroke, useT, POP, SOFT} from './Engine';
import {Chip, Svg} from './Monday';

const Tick: React.FC<{r?: number}> = ({r = 28}) => (
  <g>
    <circle r={r} fill={C.purple} />
    <path d={`M${-r * 0.46} ${r * 0.07} L${-r * 0.15} ${r * 0.43} L${r * 0.5} ${-r * 0.4}`} fill="none" stroke="#fff" strokeWidth={r * 0.3} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const DmBlock: React.FC<{at: number; y: number}> = ({at, y}) => {
  const t = useT();
  const k = sp(t, at, {damping: 11, stiffness: 190, mass: 0.7});
  const buzz = t > at + 0.2 ? Math.sin((t - at) * 38) * 3 : 0;
  const shift = ((t - at) * 40) % 40;
  return (
    <Rise at={at} y={y} style={{transform: `translate(-50%,-50%) scale(${1.35 - 0.35 * k})`, opacity: Math.min(1, k * 2)}}>
      <div style={{width: 820, height: 190, borderRadius: 40, background: C.purple, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 20px, rgba(255,255,255,0) 20px 40px)', backgroundPosition: `${shift}px 0`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34, boxShadow: '0 22px 50px rgba(128,0,128,0.5)'}}>
        <svg width={86} height={110} viewBox="0 0 86 110" style={{transform: `translateX(${buzz}px) rotate(${buzz}deg)`}}>
          <rect x={14} y={6} width={58} height={98} rx={14} fill="#fff" />
          <rect x={22} y={22} width={42} height={58} rx={4} fill={C.purple} opacity={0.35} />
          <circle cx={43} cy={92} r={5} fill={C.purple} />
        </svg>
        <span style={{fontFamily: F, fontWeight: 800, fontSize: 108, color: '#fff'}}>DM US</span>
      </div>
    </Rise>
  );
};

const Card: React.FC<{at: number; y: number; children: React.ReactNode; h?: number}> = ({at, y, children, h = 200}) => (
  <Rise at={at} y={y} cfg={POP} style={{width: 900}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 30, height: h, background: '#fff', borderRadius: 30, padding: '0 36px', boxShadow: '0 16px 40px rgba(0,0,0,0.2)', borderLeft: `18px solid ${C.purple}`}}>{children}</div>
  </Rise>
);

// =========================================================== WEDNESDAY: three funding lines
const W = {
  1: {s: 0.5, e: 4.68}, 2: {s: 5.48, e: 6.536}, 3: {s: 7.336, e: 25.524, a: [7.336, 12.44, 17.511]},
  4: {s: 26.324, e: 28.319}, 5: {s: 29.119, e: 39.841, a: [29.119, 33.872]}, 6: {s: 40.641, e: 43.553, a: [40.641, 42.228]},
  7: {s: 44.353, e: 46.613}, 8: {s: 47.413, e: 57.4, a: [47.413, 48.814, 56.351]},
};
export const WED_PULLBACK = 57.6;
export const WED_SECONDS = 63.4;

const Pipes: React.FC<{s: number}> = ({s}) => {
  const t = useT();
  const hs = [190, 270, 350];
  return (
    <Svg at={s + 0.3} y={110} w={640} h={470}>
      {hs.map((h, i) => {
        const g = ease((t - (s + 0.6 + i * 0.7)) / 0.9);
        const bob = Math.sin((t - s) * 3 + i) * 4 * g;
        return (
          <g key={i}>
            <rect x={80 + i * 190} y={430 - h * g} width={120} height={h * g} rx={18} fill={i === 2 ? C.purple : C.ink} />
            <g transform={`translate(${140 + i * 190} ${410 - h * g - 40 + bob})`} opacity={g}>
              <circle r={40} fill="#fff" stroke={C.ink} strokeWidth={8} />
              <circle r={22} fill="none" stroke={C.purple} strokeWidth={7} />
            </g>
          </g>
        );
      })}
      <line x1={40} y1={434} x2={600} y2={434} {...stroke} />
    </Svg>
  );
};
const Wed1 = () => (
  <>
    <Head lines={['THREE NEW', 'FUNDING LINES']} at={W[1].s + 0.2} size={100} y={-330} hot={[1]} />
    <Pipes s={W[1].s} />
  </>
);
const Wed2 = () => {
  const t = useT();
  const b = Math.sin((t - W[2].s) * 4) * 14;
  return (
    <>
      <Head lines={['HERE', 'THEY ARE']} at={W[2].s + 0.1} size={120} y={-200} hot={[1]} />
      <Svg at={W[2].s + 0.5} y={190 + b} w={160} h={220}>
        <path d="M80 10 V170 M26 116 L80 176 L134 116" {...stroke} stroke={C.purple} strokeWidth={18} />
      </Svg>
    </>
  );
};
const Fund: React.FC<{at: number; y: number; num: number; unit: string; a: string; b: string}> = ({at, y, num, unit, a, b}) => {
  const t = useT();
  const p = ease((t - (at + 0.2)) / 1.1);
  return (
    <Card at={at} y={y} h={250}>
      <div style={{width: 380, fontFamily: F, fontWeight: 800, fontSize: 96, color: C.purple, lineHeight: 1, whiteSpace: 'nowrap'}}>
        ${Math.round(num * p)}
        {unit}
      </div>
      <div>
        <div style={{fontFamily: F, fontWeight: 800, fontSize: 42, color: C.ink, lineHeight: 1.1}}>{a}</div>
        <div style={{fontFamily: B, fontWeight: 500, fontSize: 32, color: C.mute, marginTop: 8}}>{b}</div>
      </div>
    </Card>
  );
};
const Wed3 = () => {
  const a = W[3].a;
  return (
    <>
      <Fund at={a[0] + 0.2} y={-290} num={200} unit="M" a="CASCADOR + STERLING" b="Credit backstop fund" />
      <Fund at={a[1] + 0.2} y={0} num={50} unit="M" a="BOI + IFC" b="Loan signed 3 Nov" />
      <Fund at={a[2] + 0.2} y={290} num={75} unit="M" a="AFREXIMBANK + DBN" b="Committed 11 Nov" />
    </>
  );
};
const Wed4 = () => {
  const t = useT();
  const sweep = ((t - W[4].s) * 0.9) % 1;
  return (
    <>
      <Head lines={['BEHIND THE', 'HEADLINES']} at={W[4].s + 0.1} size={100} y={-300} hot={[1]} />
      <Svg at={W[4].s + 0.4} y={150} w={520} h={380}>
        <rect x={20} y={20} width={480} height={340} rx={22} fill="#fff" stroke={C.ink} strokeWidth={8} />
        <rect x={52} y={52} width={416} height={56} rx={10} fill={C.ink} />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={52} y1={150 + i * 50} x2={i % 2 ? 360 : 468} y2={150 + i * 50} {...stroke} strokeWidth={8} opacity={0.35} />
        ))}
        <rect x={52 + sweep * 330} y={134} width={90} height={190} rx={10} fill="rgba(128,0,128,0.22)" />
      </Svg>
    </>
  );
};
const Wed5 = () => {
  const a = W[5].a;
  const t = useT();
  return (
    <>
      <Label at={a[0] + 0.1} y={-340} size={84} color={C.purple}>
        ₦2 TRILLION
      </Label>
      <Svg at={a[0] + 0.5} y={-200} w={780} h={150}>
        {Array.from({length: 9}, (_, i) => {
          const p = ease((t - (a[0] + 0.8 + i * 0.35)) / 0.5);
          return (
            <g key={i} transform={`translate(${30 + i * 82 - (1 - p) * 120} ${14})`} opacity={p}>
              <rect width={62} height={100} rx={10} fill="#fff" stroke={C.ink} strokeWidth={6} />
              <line x1={14} y1={32} x2={48} y2={32} stroke={C.purple} strokeWidth={6} strokeLinecap="round" />
              <line x1={14} y1={54} x2={48} y2={54} stroke={C.ink} strokeWidth={6} strokeLinecap="round" opacity={0.4} />
            </g>
          );
        })}
      </Svg>
      <Label at={a[0] + 0.6} y={-90} size={42} color={C.mute} weight={700}>
        APPLICATIONS WAITING AT BOI
      </Label>
      <Svg at={a[1] + 0.2} y={110} w={800} h={170}>
        {Array.from({length: 20}, (_, i) => {
          const p = ease((t - (a[1] + 0.5 + i * 0.08)) / 0.4);
          const col = i % 10;
          const row = Math.floor(i / 10);
          const hot = i === 19;
          return (
            <g key={i} transform={`translate(${42 + col * 79} ${28 + row * 82}) scale(${p})`}>
              <circle cy={-10} r={13} fill={hot ? C.purple : '#b9b0bb'} />
              <path d="M-20 34 a20 26 0 0 1 40 0 Z" fill={hot ? C.purple : '#b9b0bb'} />
            </g>
          );
        })}
      </Svg>
      <Label at={a[1] + 0.4} y={290} size={100} color={C.purple}>
        1 IN 20
      </Label>
      <Label at={a[1] + 0.6} y={382} size={40} color={C.mute} weight={700}>
        CAN ACCESS BANK CREDIT
      </Label>
    </>
  );
};
const Wed6 = () => {
  const a = W[6].a;
  const t = useT();
  const m = ease((t - (a[0] + 0.3)) / 0.8);
  const q = ease((t - (a[1] + 0.2)) / 1.2);
  return (
    <>
      <Label at={a[0] + 0.1} y={-110} size={54} color={C.purple}>
        MONEY ARRIVES
      </Label>
      <Rise at={a[0] + 0.2} y={-30}>
        <div style={{width: 840, height: 60, borderRadius: 30, background: '#e5dce6', overflow: 'hidden'}}>
          <div style={{width: 240 * m, height: '100%', borderRadius: 30, background: C.purple}} />
        </div>
      </Rise>
      <Label at={a[1] + 0.1} y={110} size={54} color={C.ink}>
        QUEUE IS LONGER
      </Label>
      <Rise at={a[1] + 0.2} y={190}>
        <div style={{width: 840, height: 60, borderRadius: 30, background: '#e5dce6', overflow: 'hidden'}}>
          <div style={{width: 840 * q, height: '100%', borderRadius: 30, background: C.ink}} />
        </div>
      </Rise>
    </>
  );
};
const Wed7 = () => {
  const t = useT();
  const o = sp(t, W[7].s + 1.0, {damping: 12, stiffness: 160, mass: 0.7});
  const shake = t > W[7].s + 1.0 && t < W[7].s + 1.7 ? Math.sin((t - W[7].s) * 60) * 5 : 0;
  return (
    <>
      <Head lines={['NEXT WINDOW', 'OPENS', 'NO NOTICE']} at={W[7].s + 0.1} size={90} y={-330} hot={[2]} />
      <Svg at={W[7].s + 0.4} y={150} w={520} h={440}>
        <rect x={40} y={30} width={440} height={380} rx={16} fill="rgba(128,0,128,0.14)" stroke={C.ink} strokeWidth={10} />
        <rect x={40} y={30} width={220 * (1 - o)} height={380} fill={C.ink} />
        <rect x={480 - 220 * (1 - o)} y={30} width={220 * (1 - o)} height={380} fill={C.ink} />
        <line x1={260} y1={30} x2={260} y2={410} {...stroke} strokeWidth={8} opacity={o} />
        <g transform={`translate(${440 + shake} 60) rotate(${shake})`}>
          <circle r={44} fill="#fff" stroke={C.purple} strokeWidth={10} />
          <path d="M0 -24 V0 L16 12" {...stroke} stroke={C.purple} strokeWidth={8} />
        </g>
      </Svg>
    </>
  );
};
const Wed8 = () => {
  const a = W[8].a;
  return (
    <>
      <Head lines={['STAY PREPARED']} at={a[0] + 0.1} size={104} y={-350} hot={[0]} />
      <Label at={a[1] + 0.2} y={-250} size={56} color={C.mute}>
        MANETRUST
      </Label>
      <Chip at={a[1] + 2.0} y={-110} icon="doc">
        PITCH DECK
      </Chip>
      <Chip at={a[1] + 3.2} y={40} icon="plan">
        BUSINESS PLAN
      </Chip>
      <Chip at={a[1] + 4.4} y={190} icon="bars">
        PROJECTIONS
      </Chip>
      <DmBlock at={a[2] + 0.1} y={380} />
    </>
  );
};
const wedStations: Station[] = [
  {n: 1, node: <Wed1 />, ...{start: W[1].s, end: W[1].e}},
  {n: 2, node: <Wed2 />, ...{start: W[2].s, end: W[2].e}},
  {n: 3, node: <Wed3 />, ...{start: W[3].s, end: W[3].e}},
  {n: 4, node: <Wed4 />, ...{start: W[4].s, end: W[4].e}},
  {n: 5, node: <Wed5 />, ...{start: W[5].s, end: W[5].e}},
  {n: 6, node: <Wed6 />, ...{start: W[6].s, end: W[6].e}},
  {n: 7, node: <Wed7 />, ...{start: W[7].s, end: W[7].e}},
  {n: 8, node: <Wed8 />, ...{start: W[8].s, end: W[8].e}},
];
const wedSfx: [number, 'whoosh' | 'pop' | 'tick' | 'thump', number][] = [
  ...wedStations.slice(0, -1).map((s) => [s.end - 0.6, 'whoosh', 0.22] as [number, 'whoosh', number]),
  [0.9, 'pop', 0.3], [1.6, 'pop', 0.3], [2.3, 'pop', 0.3], [5.9, 'pop', 0.3],
  [7.6, 'pop', 0.35], [12.7, 'pop', 0.35], [17.8, 'pop', 0.35],
  [26.8, 'pop', 0.3], [29.6, 'pop', 0.3], [34.1, 'pop', 0.35], [41.0, 'pop', 0.3], [42.5, 'pop', 0.3],
  [45.4, 'thump', 0.35], [49.0, 'pop', 0.3], [50.8, 'pop', 0.3], [52.0, 'pop', 0.3], [53.2, 'pop', 0.3],
  [56.45, 'thump', 0.45], [WED_PULLBACK, 'whoosh', 0.3],
];
export const WednesdayVideo: React.FC = () => (
  <PaperTour stations={wedStations} total={WED_SECONDS} pullbackAt={WED_PULLBACK} voSrc="wed/vo.wav" bgmSrc="shared/bgm2.mp3" sfx={wedSfx} />
);

// =========================================================== SUNDAY: 54gene case
const U = {
  1: {s: 0.5, e: 7.502, a: [0.5, 4.344]}, 2: {s: 8.302, e: 10.398}, 3: {s: 11.198, e: 29.152, a: [11.198, 15.394, 18.018, 20.847, 26.571]},
  4: {s: 29.952, e: 31.992}, 5: {s: 32.792, e: 40.343, a: [32.792, 38.502]}, 6: {s: 41.143, e: 45.315},
  7: {s: 46.115, e: 49.164}, 8: {s: 49.964, e: 58.377, a: [49.964, 57.327]},
};
export const SUN_PULLBACK = 58.6;
export const SUN_SECONDS = 64.4;

const Sun1 = () => {
  const t = useT();
  const a = U[1].a;
  const g = ease((t - (a[0] + 0.8)) / 1.6);
  const fall = ease((t - (a[1] + 0.2)) / 0.9);
  const stamp = sp(t, a[1] + 0.3, {damping: 11, stiffness: 190, mass: 0.7});
  const H = 360 * g * (1 - 0.82 * fall);
  return (
    <>
      <Head lines={['$45M RAISED', 'IN 2 YEARS']} at={a[0] + 0.1} size={96} y={-330} hot={[0]} />
      <Svg at={a[0] + 0.5} y={120} w={640} h={480}>
        <rect x={190} y={430 - H} width={190} height={H} rx={20} fill={fall > 0.5 ? C.ink : C.purple} />
        <text x={285} y={420 - H} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={74} fill={C.ink}>
          ${Math.round(45 * g)}M
        </text>
        <line x1={60} y1={434} x2={580} y2={434} {...stroke} />
        <g transform={`translate(330 300) rotate(-9) scale(${1.5 - 0.5 * stamp})`} opacity={Math.min(1, stamp * 2)}>
          <rect x={-250} y={-66} width={500} height={132} rx={18} fill="rgba(255,255,255,0.92)" stroke={C.purple} strokeWidth={10} />
          <text x={0} y={-8} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={58} fill={C.purple}>
            SHUT DOWN
          </text>
          <text x={0} y={44} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={40} fill={C.ink}>
            SEP 2023
          </text>
        </g>
      </Svg>
    </>
  );
};
const Sun2 = () => {
  const t = useT();
  const s = U[2].s;
  return (
    <>
      <Head lines={['ON THE', 'PUBLIC RECORD']} at={s + 0.1} size={100} y={-300} hot={[1]} />
      <Svg at={s + 0.4} y={150} w={440} h={420}>
        <rect x={40} y={20} width={360} height={380} rx={22} fill="#fff" stroke={C.ink} strokeWidth={8} />
        {[0, 1, 2].map((i) => {
          const p = ease((t - (s + 0.9 + i * 0.4)) / 0.4);
          return (
            <g key={i} transform={`translate(0 ${i * 100})`}>
              <line x1={130} y1={100} x2={340} y2={100} {...stroke} strokeWidth={8} opacity={0.35} />
              <g transform={`translate(88 100) scale(${p})`}>
                <Tick r={26} />
              </g>
            </g>
          );
        })}
      </Svg>
    </>
  );
};
const Row: React.FC<{at: number; y: number; label: string; sub?: string; children: React.ReactNode}> = ({at, y, label, sub, children}) => (
  <>
    <Svg at={at} x={-300} y={y} w={240} h={170}>
      {children}
    </Svg>
    <Label at={at + 0.15} x={150} y={y - (sub ? 22 : 0)} size={52}>
      {label}
    </Label>
    {sub && (
      <Label at={at + 0.3} x={150} y={y + 34} size={36} color={C.mute} weight={700}>
        {sub}
      </Label>
    )}
  </>
);
const Sun3 = () => {
  const a = U[3].a;
  const t = useT();
  const draw = ease((t - (a[1] - 0.2)) / 1.2);
  const jobs = ease((t - (a[3] + 0.4)) / 0.8);
  return (
    <>
      <Row at={a[0] + 0.2} y={-330} label="COVID TESTING" sub="REVENUE FELL">
        <path d="M14 20 H226 M14 20 V150" {...stroke} strokeWidth={6} opacity={0.4} />
        <path d="M24 40 C70 30 100 50 130 80 C160 110 190 126 220 142" {...stroke} stroke={C.purple} strokeWidth={12} strokeDasharray="280" strokeDashoffset={280 * (1 - draw)} />
      </Row>
      <Row at={a[2] + 0.2} y={-110} label="NEW DIAGNOSTICS ARM" sub="BUILT TO FILL THE GAP">
        <path d="M90 14 H150 M110 14 V70 L50 140 a10 10 0 0 0 8 16 H182 a10 10 0 0 0 8 -16 L130 70 V14" fill="#fff" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
        <path d="M70 118 H170 L184 142 H56 Z" fill={C.purple} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={100 + i * 22} cy={100 - ((t * 40 + i * 18) % 50)} r={7} fill={C.purple} opacity={0.7} />
        ))}
      </Row>
      <Row at={a[3] + 0.2} y={110} label="95 JOBS CUT" sub="OVER 30% OF STAFF">
        {Array.from({length: 10}, (_, i) => (
          <g key={i} transform={`translate(${26 + (i % 5) * 46} ${i < 5 ? 40 : 110})`} opacity={i < 3 ? 1 : 0.9}>
            <circle cy={-6} r={11} fill={i < 3 ? C.purple : '#b9b0bb'} transform={`scale(${i < 3 ? 1 - 0.0 * jobs : 1})`} />
            <path d="M-17 30 a17 22 0 0 1 34 0 Z" fill={i < 3 ? C.purple : '#b9b0bb'} />
          </g>
        ))}
      </Row>
      <Row at={a[4] + 0.2} y={330} label="3 CEOS IN 1 YEAR">
        {[0, 1, 2].map((i) => {
          const p = ease((t - (a[4] + 0.5 + i * 0.7)) / 0.5);
          return (
            <g key={i} transform={`translate(${46 + i * 70} 80) scale(${p})`}>
              <circle cy={-22} r={22} fill={i === 2 ? C.purple : C.ink} />
              <path d="M-30 50 a30 36 0 0 1 60 0 Z" fill={i === 2 ? C.purple : C.ink} />
            </g>
          );
        })}
      </Row>
    </>
  );
};
const Sun4 = () => {
  const t = useT();
  const r = (t - U[4].s) * 120;
  return (
    <>
      <Head lines={['EACH MOVE ANSWERED', 'THE LAST PROBLEM']} at={U[4].s + 0.1} size={70} y={-250} hot={[1]} />
      <Svg at={U[4].s + 0.4} y={130} w={360} h={360}>
        <g transform={`rotate(${r} 180 180)`}>
          <path d="M60 180 a120 120 0 0 1 200 -90" {...stroke} stroke={C.purple} strokeWidth={18} />
          <path d="M250 40 L268 100 L208 108" {...stroke} stroke={C.purple} strokeWidth={18} />
          <path d="M300 180 a120 120 0 0 1 -200 90" {...stroke} strokeWidth={18} />
          <path d="M110 320 L92 260 L152 252" {...stroke} strokeWidth={18} />
        </g>
      </Svg>
    </>
  );
};
const Sun5 = () => {
  const a = U[5].a;
  const t = useT();
  const stamp = sp(t, a[1] + 0.1, {damping: 11, stiffness: 190, mass: 0.7});
  return (
    <>
      <Row at={a[0] + 0.4} y={-300} label="REVENUE LINES">
        {[0, 1, 2].map((i) => {
          const g = ease((t - (a[0] + 0.8 + i * 0.3)) / 0.6);
          return <rect key={i} x={30 + i * 70} y={150 - (50 + i * 30) * g} width={50} height={(50 + i * 30) * g} rx={8} fill={i === 2 ? C.purple : C.ink} />;
        })}
      </Row>
      <Row at={a[0] + 2.4} y={-100} label="MILESTONES">
        <path d="M60 150 V20" {...stroke} />
        <path d="M60 24 H190 L160 54 L190 84 H60" fill={C.purple} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      </Row>
      <Row at={a[0] + 4.0} y={100} label="FALLBACK">
        <path d="M20 40 C80 40 100 110 160 110" {...stroke} strokeDasharray="14 16" />
        <path d="M130 90 L170 110 L130 130" {...stroke} stroke={C.purple} />
        <circle cx={206} cy={110} r={22} fill={C.purple} />
      </Row>
      <Rise at={a[1] + 0.1} y={320} style={{transform: `translate(-50%,-50%) scale(${1.35 - 0.35 * stamp})`, opacity: Math.min(1, stamp * 2)}}>
        <div style={{background: C.purple, color: '#fff', borderRadius: 40, padding: '26px 70px', fontFamily: F, fontWeight: 800, fontSize: 76, whiteSpace: 'nowrap', boxShadow: '0 22px 50px rgba(128,0,128,0.5)'}}>INVESTORS ASK</div>
      </Rise>
    </>
  );
};
const Sun6 = () => {
  const t = useT();
  const s = U[6].s;
  const sw = Math.sin((t - s) * 2.2) * 7;
  return (
    <>
      <Head lines={['SUPPLIERS', 'STILL OWED']} at={s + 0.1} size={100} y={-310} hot={[1]} />
      <Svg at={s + 0.4} x={-230} y={140} w={300} h={380}>
        {[2, 1, 0].map((i) => (
          <path key={i} transform={`rotate(${(i - 1) * 6} 150 200) translate(${i * 8} ${i * 10})`} d="M30 20 H250 V330 L222 312 L194 332 L166 312 L138 332 L110 312 L82 332 L54 312 L30 330 Z" fill="#fff" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
        ))}
        <text x={150} y={200} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={44} fill={C.purple} transform="rotate(-12 150 190)">
          UNPAID
        </text>
      </Svg>
      <Svg at={s + 2.0} x={220} y={140} w={300} h={380}>
        <rect x={34} y={20} width={16} height={340} fill={C.ink} />
        <path d="M34 40 H250" {...stroke} />
        <g transform={`rotate(${sw} 150 40)`}>
          <line x1={110} y1={40} x2={110} y2={90} {...stroke} strokeWidth={6} />
          <line x1={230} y1={40} x2={230} y2={90} {...stroke} strokeWidth={6} />
          <rect x={80} y={90} width={180} height={110} rx={12} fill={C.purple} />
          <text x={170} y={134} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={40} fill="#fff">
            FOR
          </text>
          <text x={170} y={178} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={40} fill="#fff">
            SALE
          </text>
        </g>
      </Svg>
    </>
  );
};
const Sun7 = () => {
  const t = useT();
  const s = U[7].s;
  const u = ease((t - (s + 0.8)) / 1.8);
  return (
    <>
      <Head lines={['MILESTONES TELL YOU', 'WHEN TO CHANGE COURSE']} at={s + 0.1} size={62} y={-310} hot={[1]} />
      <Svg at={s + 0.4} y={120} w={520} h={460}>
        <path d="M260 440 V250" {...stroke} strokeWidth={46} stroke="#8f8794" />
        <path d="M260 250 V40" {...stroke} strokeWidth={46} stroke="#b9b0bb" strokeDasharray="22 18" />
        <path d="M260 250 C260 190 340 180 440 90" {...stroke} strokeWidth={46} stroke={C.purple} strokeDasharray="500" strokeDashoffset={500 * (1 - u)} />
        <path d="M80 300 V190" {...stroke} />
        <path d="M80 192 H170 L150 220 L170 248 H80" fill={C.purple} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
        <circle cx={260 + 180 * Math.max(0, u * 2 - 1)} cy={440 - 190 * Math.min(1, u * 2) - 160 * Math.max(0, u * 2 - 1)} r={16} fill={C.ink} />
      </Svg>
    </>
  );
};
const Sun8 = () => {
  const a = U[8].a;
  return (
    <>
      <Label at={a[0] + 0.2} y={-340} size={118}>
        MANETRUST
      </Label>
      <Chip at={a[0] + 2.4} y={-150} icon="plan">
        BUSINESS PLANS
      </Chip>
      <Chip at={a[0] + 3.8} y={0} icon="bars">
        PROJECTIONS
      </Chip>
      <Chip at={a[0] + 5.4} y={150} icon="doc">
        MILESTONES + FALLBACK
      </Chip>
      <DmBlock at={a[1] + 0.1} y={340} />
    </>
  );
};
const sunStations: Station[] = [
  {n: 1, node: <Sun1 />, start: U[1].s, end: U[1].e},
  {n: 2, node: <Sun2 />, start: U[2].s, end: U[2].e},
  {n: 3, node: <Sun3 />, start: U[3].s, end: U[3].e},
  {n: 4, node: <Sun4 />, start: U[4].s, end: U[4].e},
  {n: 5, node: <Sun5 />, start: U[5].s, end: U[5].e},
  {n: 6, node: <Sun6 />, start: U[6].s, end: U[6].e},
  {n: 7, node: <Sun7 />, start: U[7].s, end: U[7].e},
  {n: 8, node: <Sun8 />, start: U[8].s, end: U[8].e},
];
const sunSfx: [number, 'whoosh' | 'pop' | 'tick' | 'thump', number][] = [
  ...sunStations.slice(0, -1).map((s) => [s.end - 0.6, 'whoosh', 0.22] as [number, 'whoosh', number]),
  [0.9, 'pop', 0.3], [1.4, 'tick', 0.18], [1.9, 'tick', 0.18], [4.7, 'thump', 0.45], [8.8, 'pop', 0.3], [9.3, 'pop', 0.25],
  [11.4, 'pop', 0.3], [18.2, 'pop', 0.3], [21.0, 'pop', 0.3], [26.8, 'pop', 0.3], [30.4, 'pop', 0.3],
  [33.2, 'pop', 0.3], [35.2, 'pop', 0.3], [36.8, 'pop', 0.3], [38.7, 'thump', 0.4], [41.6, 'pop', 0.3], [43.2, 'pop', 0.3],
  [46.9, 'pop', 0.3], [52.4, 'pop', 0.3], [53.8, 'pop', 0.3], [55.4, 'pop', 0.3], [57.4, 'thump', 0.45], [SUN_PULLBACK, 'whoosh', 0.3],
];
export const SundayVideo: React.FC = () => (
  <PaperTour stations={sunStations} total={SUN_SECONDS} pullbackAt={SUN_PULLBACK} voSrc="sun/vo.wav" bgmSrc="shared/bgm2.mp3" sfx={sunSfx} />
);
