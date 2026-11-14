import React from 'react';
import {Head, Label, PaperTour, Rise, Station, B, C, F, clamp, ease, sp, stroke, useT, POP, SOFT} from './Engine';

// Voiceover line starts and ends (seconds), from the recorded British narration.
const L = {
  1: {s: 0.5, e: 7.88},
  2: {s: 8.68, e: 11.014},
  3: {s: 11.814, e: 21.582},
  4: {s: 22.383, e: 24.297},
  5: {s: 25.097, e: 31.745},
  6: {s: 32.545, e: 37.331},
  7: {s: 38.131, e: 41.422},
  8: {s: 42.222, e: 50.202},
};
export const MON_PULLBACK = 50.4;
export const MON_SECONDS = 56;

const Svg: React.FC<{at: number; x?: number; y?: number; w: number; h: number; children: React.ReactNode}> = ({at, x = 0, y = 0, w, h, children}) => (
  <Rise at={at} x={x} y={y} cfg={POP}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
      {children}
    </svg>
  </Rise>
);

// ---------------------------------------------------------------- 1 hook: a net closes round shops
const NetIcon: React.FC<{s: number}> = ({s}) => {
  const t = useT();
  const close = ease((t - (s + 2.0)) / 4.0);
  const R = 300 - 110 * close;
  const dots = Array.from({length: 9}, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + 0.4;
    const r0 = 230 + (i % 3) * 38;
    const r1 = 120 + (i % 3) * 22;
    const r = r0 + (r1 - r0) * close;
    return {x: 340 + Math.cos(a) * r, y: 300 + Math.sin(a) * r, caught: r < R - 8};
  });
  return (
    <Svg at={s + 0.5} y={110} w={680} h={600}>
      <circle cx={340} cy={300} r={R} {...stroke} stroke={C.purple} strokeDasharray="22 16" transform={`rotate(${close * 90} 340 300)`} />
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1={340 - R} y1={300 + (k - 1.5) * R * 0.45} x2={340 + R} y2={300 + (k - 1.5) * R * 0.45} stroke={C.purple} strokeWidth={3} opacity={0.35} clipPath="url(#nc)" />
      ))}
      <clipPath id="nc">
        <circle cx={340} cy={300} r={R} />
      </clipPath>
      {dots.map((d, i) => (
        <g key={i} transform={`translate(${d.x - 28} ${d.y - 26})`}>
          <path d="M2 18 L8 2 H48 L54 18 Z" fill={d.caught ? C.purple : '#b9b0bb'} />
          <rect x={6} y={18} width={44} height={30} fill="#fff" stroke={C.ink} strokeWidth={4} />
          <rect x={22} y={28} width={12} height={20} fill={d.caught ? C.purple : C.ink} />
        </g>
      ))}
    </Svg>
  );
};
const S1 = () => (
  <>
    <Head lines={['THE TAX NET', 'IS WIDENING']} at={L[1].s + 0.2} size={100} y={-330} hot={[1]} />
    <NetIcon s={L[1].s} />
  </>
);

// ---------------------------------------------------------------- 2 calendar with an in-force stamp
const Calendar: React.FC<{s: number}> = ({s}) => {
  const t = useT();
  const stamp = sp(t, s + 0.9, {damping: 11, stiffness: 190, mass: 0.7});
  return (
    <Svg at={s + 0.3} y={80} w={620} h={560}>
      <rect x={30} y={60} width={560} height={470} rx={34} fill="#fff" stroke={C.ink} strokeWidth={8} />
      <path d="M30 94 a34 34 0 0 1 34 -34 H556 a34 34 0 0 1 34 34 V160 H30 Z" fill={C.purple} />
      <circle cx={170} cy={60} r={16} fill={C.ink} />
      <circle cx={450} cy={60} r={16} fill={C.ink} />
      {Array.from({length: 20}, (_, i) => (
        <rect key={i} x={70 + (i % 5) * 100} y={200 + Math.floor(i / 5) * 78} width={64} height={44} rx={10} fill={i === 0 ? C.purple : '#e5dce6'} />
      ))}
      <g transform={`translate(310 330) rotate(-9) scale(${1.6 - 0.6 * stamp})`} opacity={Math.min(1, stamp * 2)}>
        <rect x={-210} y={-62} width={420} height={124} rx={18} fill="none" stroke={C.purple} strokeWidth={10} />
        <text x={0} y={22} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={74} fill={C.purple}>
          JAN 2026
        </text>
      </g>
    </Svg>
  );
};
const S2 = () => (
  <>
    <Head lines={['IN FORCE']} at={L[2].s + 0.1} size={126} y={-330} />
    <Calendar s={L[2].s} />
  </>
);

// ---------------------------------------------------------------- 3 TIN, banks, 18 percent
const IdCard: React.FC<{s: number}> = ({s}) => (
  <Svg at={s} x={-300} y={-250} w={240} h={170}>
    <rect x={8} y={8} width={224} height={154} rx={20} fill="#fff" stroke={C.ink} strokeWidth={8} />
    <circle cx={64} cy={72} r={26} fill={C.purple} />
    <path d="M26 138 a38 30 0 0 1 76 0 Z" fill={C.purple} />
    <line x1={124} y1={62} x2={206} y2={62} {...stroke} strokeWidth={8} />
    <line x1={124} y1={92} x2={190} y2={92} {...stroke} strokeWidth={8} opacity={0.5} />
    <line x1={124} y1={122} x2={176} y2={122} {...stroke} strokeWidth={8} opacity={0.5} />
  </Svg>
);
const Bank: React.FC<{s: number}> = ({s}) => {
  const t = useT();
  const k = sp(t, s + 0.6, POP);
  return (
    <Svg at={s} x={-300} y={0} w={240} h={190}>
      <path d="M120 10 L228 64 H12 Z" fill={C.ink} />
      {[34, 86, 138, 190].map((x) => (
        <rect key={x} x={x - 12} y={78} width={24} height={72} fill="#fff" stroke={C.ink} strokeWidth={6} />
      ))}
      <rect x={8} y={158} width={224} height={20} rx={6} fill={C.ink} />
      <g transform={`translate(190 40) scale(${k})`}>
        <circle r={34} fill={C.purple} />
        <path d="M-16 2 L-5 14 L17 -12" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Svg>
  );
};
const Ring: React.FC<{s: number}> = ({s}) => {
  const t = useT();
  const p = ease((t - (s + 2.2)) / 1.6);
  const R = 82;
  const c = 2 * Math.PI * R;
  return (
    <Svg at={s} x={-300} y={255} w={220} h={220}>
      <circle cx={110} cy={110} r={R} fill="#fff" stroke="#e5dce6" strokeWidth={22} />
      <circle cx={110} cy={110} r={R} fill="none" stroke={C.purple} strokeWidth={22} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p * 0.18)} transform="rotate(-90 110 110)" />
      <text x={110} y={128} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={58} fill={C.ink}>
        {Math.round(18 * p)}%
      </text>
    </Svg>
  );
};
const S3 = () => {
  const s = L[3].s;
  return (
    <>
      <IdCard s={s + 0.2} />
      <Label at={s + 0.5} x={110} y={-250} size={60}>
        TAX ID (TIN)
      </Label>
      <Bank s={s + 3.8} />
      <Label at={s + 4.0} x={110} y={0} size={60}>
        BANKS CHECK IT
      </Label>
      <Ring s={s + 6.2} />
      <Label at={s + 6.4} x={110} y={255} size={60}>
        OF GDP: THE GOAL
      </Label>
    </>
  );
};

// ---------------------------------------------------------------- 4 magnifier over papers
const Magnifier: React.FC<{s: number}> = ({s}) => {
  const t = useT();
  const mx = 190 + Math.sin((t - s) * 1.7) * 90;
  const my = 210 + Math.cos((t - s) * 1.3) * 80;
  return (
    <Svg at={s + 0.4} y={90} w={440} h={520}>
      <rect x={30} y={20} width={330} height={450} rx={22} fill="#fff" stroke={C.ink} strokeWidth={8} />
      {Array.from({length: 8}, (_, i) => (
        <line key={i} x1={66} y1={80 + i * 46} x2={i % 3 === 2 ? 240 : 320} y2={80 + i * 46} {...stroke} strokeWidth={8} opacity={0.35} />
      ))}
      <g transform={`translate(${mx} ${my})`}>
        <circle r={86} fill="rgba(128,0,128,0.14)" stroke={C.purple} strokeWidth={14} />
        <line x1={62} y1={62} x2={130} y2={130} stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
      </g>
    </Svg>
  );
};
const S4 = () => (
  <>
    <Head lines={['THE PART', 'OWNERS MISS']} at={L[4].s + 0.1} size={100} y={-330} hot={[1]} />
    <Magnifier s={L[4].s} />
  </>
);

// ---------------------------------------------------------------- 5 no records, so an estimated bill
const Bill: React.FC<{s: number; label?: string}> = ({s, label = '?'}) => {
  const t = useT();
  const wob = Math.sin((t - s) * 5) * 4;
  const stamp = sp(t, s + 1.6, {damping: 11, stiffness: 190, mass: 0.7});
  return (
    <Svg at={s} x={230} y={-90} w={280} h={360}>
      <path d="M20 10 H260 V320 L228 300 L196 322 L164 300 L132 322 L100 300 L68 322 L36 300 L20 320 Z" fill="#fff" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      <text x={140} y={190 + wob} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={170} fill={C.purple} transform={`rotate(${wob} 140 150)`}>
        {label}
      </text>
      <g transform={`translate(140 280) rotate(-10) scale(${1.5 - 0.5 * stamp})`} opacity={Math.min(1, stamp * 2)}>
        <rect x={-120} y={-30} width={240} height={60} rx={10} fill="rgba(255,255,255,0.9)" stroke={C.purple} strokeWidth={6} />
        <text x={0} y={12} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={36} fill={C.purple}>
          ESTIMATED
        </text>
      </g>
    </Svg>
  );
};
const EmptyDoc: React.FC<{s: number}> = ({s}) => (
  <Svg at={s} x={-250} y={-90} w={260} h={330}>
    <rect x={14} y={10} width={232} height={310} rx={18} fill="#fff" stroke={C.ink} strokeWidth={8} />
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={i} x1={44} y1={70 + i * 46} x2={216} y2={70 + i * 46} stroke={C.ink} strokeWidth={6} strokeDasharray="4 14" strokeLinecap="round" opacity={0.5} />
    ))}
    <path d="M70 40 L190 280 M190 40 L70 280" stroke={C.purple} strokeWidth={0} />
  </Svg>
);
const S5 = () => {
  const s = L[5].s;
  const t = useT();
  const a = sp(t, s + 1.4, POP);
  return (
    <>
      <EmptyDoc s={s + 0.2} />
      <Label at={s + 0.4} x={-250} y={-300} size={52}>
        NO RECORDS
      </Label>
      <Rise at={s + 1.4} y={-90} style={{opacity: a}}>
        <svg width={120} height={60} viewBox="0 0 120 60">
          <path d="M6 30 H100 M72 8 L100 30 L72 52" {...stroke} stroke={C.purple} />
        </svg>
      </Rise>
      <Bill s={s + 1.6} />
      <Label at={s + 4.9} y={250} size={64} color={C.purple}>
        SOMEONE ELSE SETS IT
      </Label>
    </>
  );
};

// ---------------------------------------------------------------- 6 lower bill, if you prove it
const S6 = () => {
  const s = L[6].s;
  const t = useT();
  const g = ease((t - (s + 0.3)) / 1.0);
  const h = ease((t - (s + 1.2)) / 0.9);
  const k = sp(t, s + 3.0, POP);
  return (
    <>
      <Label at={s + 0.1} y={-340} size={70}>
        SMALL COMPANIES
      </Label>
      <Rise at={s + 0.2} x={-210} y={30}>
        <div style={{position: 'relative', width: 230, height: 520}}>
          <div style={{position: 'absolute', bottom: 40, left: 0, width: 230, height: 420 * g, borderRadius: '22px 22px 0 0', background: '#8a8290', boxShadow: '0 14px 30px rgba(0,0,0,0.2)'}} />
          <div style={{position: 'absolute', bottom: -10, width: 230, textAlign: 'center', fontFamily: F, fontWeight: 800, fontSize: 40, color: C.ink}}>FULL BILL</div>
        </div>
      </Rise>
      <Rise at={s + 1.1} x={210} y={30}>
        <div style={{position: 'relative', width: 230, height: 520}}>
          <div style={{position: 'absolute', bottom: 40, left: 0, width: 230, height: 190 * h, borderRadius: '22px 22px 0 0', background: C.purple, boxShadow: '0 14px 30px rgba(128,0,128,0.35)'}} />
          <div style={{position: 'absolute', bottom: -10, width: 230, textAlign: 'center', fontFamily: F, fontWeight: 800, fontSize: 40, color: C.purple}}>LOWER BILL</div>
        </div>
      </Rise>
      <Rise at={s + 3.0} x={210} y={-170} style={{transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 60, padding: '16px 34px 16px 20px', boxShadow: '0 14px 34px rgba(0,0,0,0.22)'}}>
          <svg width={54} height={54} viewBox="-30 -30 60 60">
            <circle r={28} fill={C.purple} />
            <path d="M-13 2 L-4 12 L14 -10" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{fontFamily: F, fontWeight: 800, fontSize: 44, color: C.ink}}>PROVE IT</span>
        </div>
      </Rise>
    </>
  );
};

// ---------------------------------------------------------------- 7 clear papers beat a guessed bill
const S7 = () => {
  const s = L[7].s;
  const t = useT();
  const x = ease((t - (s + 1.6)) / 0.6);
  const k = sp(t, s + 1.0, POP);
  return (
    <>
      <Svg at={s + 0.1} x={-230} y={-30} w={280} h={360}>
        {[2, 1, 0].map((i) => (
          <rect key={i} x={20 + i * 14} y={30 + i * 20} width={220} height={290} rx={16} fill="#fff" stroke={C.ink} strokeWidth={8} transform={`rotate(${(i - 1) * 4} 130 180)`} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={60} y1={110 + i * 40} x2={200} y2={110 + i * 40} stroke={C.ink} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
        ))}
        <g transform={`translate(215 70) scale(${k})`}>
          <circle r={36} fill={C.purple} />
          <path d="M-16 2 L-5 14 L17 -12" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </Svg>
      <Label at={s + 0.3} x={-230} y={-290} size={56}>
        CLEAR PAPERS
      </Label>
      <Svg at={s + 0.9} x={230} y={-30} w={280} h={360}>
        <path d="M20 10 H260 V320 L228 300 L196 322 L164 300 L132 322 L100 300 L68 322 L36 300 L20 320 Z" fill="#fff" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" opacity={1 - 0.45 * x} />
        <text x={140} y={190} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={170} fill={C.purple} opacity={1 - 0.5 * x}>
          ?
        </text>
        <path d="M40 60 L240 300 M240 60 L40 300" stroke={C.purple} strokeWidth={16} strokeLinecap="round" strokeDasharray="340" strokeDashoffset={340 * (1 - x)} />
      </Svg>
      <Label at={s + 1.2} x={230} y={-290} size={56} color={C.mute}>
        GUESSED BILL
      </Label>
    </>
  );
};

// ---------------------------------------------------------------- 8 Manetrust call to action
const Chip: React.FC<{at: number; y: number; icon: 'doc' | 'bars' | 'plan'; children: string}> = ({at, y, icon, children}) => (
  <Rise at={at} y={y} cfg={POP} style={{width: 820}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 28, background: '#fff', borderRadius: 30, padding: '20px 36px', boxShadow: '0 16px 40px rgba(0,0,0,0.2)', borderLeft: `18px solid ${C.purple}`}}>
      <svg width={74} height={74} viewBox="0 0 74 74">
        {icon === 'doc' && (
          <>
            <rect x={12} y={6} width={50} height={62} rx={8} fill="none" stroke={C.ink} strokeWidth={6} />
            <line x1={24} y1={24} x2={50} y2={24} stroke={C.purple} strokeWidth={6} strokeLinecap="round" />
            <line x1={24} y1={38} x2={50} y2={38} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
          </>
        )}
        {icon === 'bars' && (
          <>
            <rect x={8} y={40} width={16} height={26} fill={C.ink} />
            <rect x={29} y={26} width={16} height={40} fill={C.purple} />
            <rect x={50} y={10} width={16} height={56} fill={C.ink} />
          </>
        )}
        {icon === 'plan' && (
          <>
            <rect x={8} y={10} width={58} height={54} rx={8} fill="none" stroke={C.ink} strokeWidth={6} />
            <path d="M20 46 L32 34 L42 42 L56 24" fill="none" stroke={C.purple} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
      <span style={{fontFamily: F, fontWeight: 800, fontSize: 50, color: C.ink}}>{children}</span>
    </div>
  </Rise>
);
const S8 = () => {
  const s = L[8].s;
  const t = useT();
  const k = sp(t, s + 7.0, {damping: 11, stiffness: 190, mass: 0.7});
  const buzz = t > s + 7.2 ? Math.sin((t - s) * 38) * 3 : 0;
  const shift = ((t - s) * 40) % 40;
  return (
    <>
      <Label at={s + 0.2} y={-340} size={118}>
        MANETRUST
      </Label>
      <Chip at={s + 3.2} y={-150} icon="doc">
        COMPANY PROFILE
      </Chip>
      <Chip at={s + 4.5} y={0} icon="bars">
        PROJECTIONS
      </Chip>
      <Chip at={s + 5.8} y={150} icon="plan">
        BUSINESS PLAN
      </Chip>
      <Rise at={s + 7.0} y={340} style={{transform: `translate(-50%,-50%) scale(${1.35 - 0.35 * k})`, opacity: Math.min(1, k * 2)}}>
        <div style={{width: 820, height: 190, borderRadius: 40, background: C.purple, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 20px, rgba(255,255,255,0) 20px 40px)', backgroundPosition: `${shift}px 0`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34, boxShadow: '0 22px 50px rgba(128,0,128,0.5)'}}>
          <svg width={86} height={110} viewBox="0 0 86 110" style={{transform: `translateX(${buzz}px) rotate(${buzz}deg)`}}>
            <rect x={14} y={6} width={58} height={98} rx={14} fill="#fff" />
            <rect x={22} y={22} width={42} height={58} rx={4} fill={C.purple} opacity={0.35} />
            <circle cx={43} cy={92} r={5} fill={C.purple} />
          </svg>
          <span style={{fontFamily: F, fontWeight: 800, fontSize: 108, color: '#fff'}}>DM US</span>
        </div>
      </Rise>
    </>
  );
};

const stations: Station[] = [
  {n: 1, ...L[1], node: <S1 />},
  {n: 2, ...L[2], node: <S2 />},
  {n: 3, ...L[3], node: <S3 />},
  {n: 4, ...L[4], node: <S4 />},
  {n: 5, ...L[5], node: <S5 />},
  {n: 6, ...L[6], node: <S6 />},
  {n: 7, ...L[7], node: <S7 />},
  {n: 8, ...L[8], node: <S8 />},
].map((x) => ({n: x.n as Station['n'], start: x.s, end: x.e, node: x.node}));

const sfx: [number, 'whoosh' | 'pop' | 'tick' | 'thump', number][] = [
  [0.6, 'pop', 0.3], [1.0, 'pop', 0.3],
  [7.28, 'whoosh', 0.22], [9.0, 'pop', 0.3], [9.6, 'thump', 0.3],
  [10.4, 'whoosh', 0.22], [12.0, 'pop', 0.3], [15.6, 'pop', 0.3], [18.0, 'pop', 0.3],
  [20.4, 'tick', 0.18], [20.8, 'tick', 0.18], [21.2, 'tick', 0.18],
  [21.0, 'whoosh', 0.22], [22.5, 'pop', 0.3], [23.7, 'whoosh', 0.22],
  [25.4, 'pop', 0.3], [26.7, 'pop', 0.3], [27.9, 'thump', 0.3], [31.15, 'whoosh', 0.22],
  [32.8, 'pop', 0.3], [33.7, 'pop', 0.3], [35.6, 'pop', 0.35],
  [36.7, 'whoosh', 0.22], [38.4, 'pop', 0.3], [39.2, 'pop', 0.3], [39.8, 'thump', 0.3], [40.8, 'whoosh', 0.22],
  [42.6, 'pop', 0.3], [45.4, 'pop', 0.35], [46.7, 'pop', 0.35], [48.0, 'pop', 0.35],
  [49.2, 'thump', 0.45], [50.4, 'whoosh', 0.3],
];

export const MondayVideo: React.FC = () => (
  <PaperTour stations={stations} total={MON_SECONDS} pullbackAt={MON_PULLBACK} voSrc="mon/vo.wav" bgmSrc="shared/bgm2.mp3" sfx={sfx} />
);
