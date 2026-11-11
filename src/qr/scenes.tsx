import React from 'react';
import {
  Avatar,
  Card,
  Chip,
  Cursor,
  DISPLAY,
  HAND,
  HOT,
  Headline,
  INK,
  MONO,
  Ring,
  Ripple,
  WHITE,
  abs,
  clamp01,
  ease,
  easeIO,
  img,
  kf,
  prog,
  sp,
  SOFT,
  POP,
} from './base';

// scene starts (seconds) from the voiceover sentence starts; END = voiceover 48.05 + 0.5 hold
export const STARTS = [0, 4.77, 8.17, 12.19, 15.41, 17.94, 21.81, 25.8, 28.47, 32.2, 35.17, 36.96, 39.63, 42.94, 45.03];
export const END = 48.55;
export const MODES = ['ink', 'grey', 'ink', 'grey', 'ink', 'grey', 'ink', 'grey', 'ink', 'grey', 'ink', 'grey', 'ink', 'grey', 'ink'] as const;
export const HIDE_MARK = new Set([7, 13, 14]); // scenes 8, 14, 15 (0-indexed)

type P = {T: number};
const pop = (T: number, t0: number, cfg = POP) => Math.max(0, sp(T, t0, cfg));
const NAMES = ['Ada', 'Tunde', 'Chioma', 'Emeka', 'Zainab', 'Kunle', 'Ngozi', 'Femi', 'Halima', 'Segun', 'Ife', 'Bisi', 'Uche', 'Musa', 'Tolu'];
const NOTES = [
  'read well today',
  'needs help with sums',
  'was kind to a classmate',
  'finished all the work',
  'asked great questions',
  'led the class today',
  'drew a lovely picture',
  'was on time all week',
  'shared with others',
  'sang beautifully',
  'tidied the class',
  'tried hard today',
  'helped a friend',
  'worked in a team',
  'listened well today',
];

const Book: React.FC<{w: number; h: number; hot?: boolean; label?: string}> = ({w, h, hot, label}) => (
  <div style={{width: w, height: h, borderRadius: 14, background: WHITE, boxShadow: '0 14px 30px rgba(0,0,0,0.25)', position: 'relative', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w * 0.16, background: hot ? HOT : 'rgba(15,69,38,0.28)'}} />
    <div style={{position: 'absolute', left: w * 0.3, top: h * 0.14, width: w * 0.55, height: h * 0.1, borderRadius: 6, background: 'rgba(15,69,38,0.18)'}} />
    {label ? (
      <div style={{position: 'absolute', left: w * 0.3, top: h * 0.4, fontFamily: MONO, fontWeight: 700, fontSize: Math.round(w * 0.12), color: INK, letterSpacing: '0.1em'}}>{label}</div>
    ) : null}
  </div>
);

// ---------------- 1 ink: desk of books ----------------
export const S1: React.FC<P> = ({T}) => {
  const s = STARTS[0];
  const lines = ['Dear Parent,', 'Ada read well today.', 'Please check homework.'];
  const reveal = (i: number) => prog(T, 1.7 + i * 0.85, 0.8);
  const last = Math.min(2, Math.floor(Math.max(0, (T - 1.7) / 0.85)));
  const penX = 150 + 400 * ease(reveal(last)) * (last === 0 ? 0.35 : last === 1 ? 0.6 : 0.62);
  return (
    <>
      <Headline T={T} start={s} mode="ink" words={[{w: 'I', t: 0.9}, {w: 'lost', t: 0.98}, {w: '8', t: 1.54, key: true}, {w: 'days', t: 2.2, key: true}]} />
      {/* fan of 15 books */}
      {Array.from({length: 15}).map((_, i) => {
        const p = pop(T, 0.35 + i * 0.05);
        const k = i - 7;
        return (
          <div
            key={i}
            style={abs(540 - 80 + k * 30, 1290 + Math.abs(k) * 10 + (1 - p) * 300, 160, 210, {
              transform: `rotate(${k * 5 * p}deg) scale(${0.6 + 0.4 * p})`,
              transformOrigin: '50% 100%',
              opacity: clamp01(p * 2),
              zIndex: i,
            })}
          >
            <Book w={160} h={210} hot={i === 7} />
          </div>
        );
      })}
      {/* open book */}
      <div style={abs(130, 640, 820, 520, {opacity: clamp01(pop(T, 1.3)), transform: `scale(${0.85 + 0.15 * pop(T, 1.3)})`, zIndex: 40})}>
        <div style={{width: 820, height: 520, background: WHITE, borderRadius: 26, boxShadow: '0 24px 50px rgba(0,0,0,0.35)', position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'rgba(15,69,38,0.22)'}} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{position: 'absolute', left: 110, right: 60, top: 150 + i * 80, height: 3, background: 'rgba(15,69,38,0.18)'}} />
          ))}
          {lines.map((l, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 120,
                top: 90 + i * 80,
                fontFamily: HAND,
                fontWeight: 600,
                fontSize: 54,
                color: INK,
                whiteSpace: 'nowrap',
                clipPath: `inset(0 ${100 - 100 * ease(reveal(i))}% 0 0)`,
                lineHeight: 1.3,
              }}
            >
              {l}
            </div>
          ))}
          {/* pen */}
          <div style={abs(penX + 90, 100 + last * 80, 0, 0, {transform: 'rotate(-35deg)', opacity: T > 1.6 ? 1 : 0})}>
            <div style={{width: 200, height: 18, background: WHITE, border: `3px solid ${INK}`, borderRadius: 9, transform: 'translate(-8px,-12px)'}} />
            <div style={{position: 'absolute', left: -26, top: -12, width: 22, height: 18, background: HOT, borderRadius: '9px 0 0 9px'}} />
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------- 2 grey: same sentence x15 ----------------
export const S2: React.FC<P> = ({T}) => {
  const s = STARTS[1];
  return (
    <>
      <Headline T={T} start={s} mode="grey" words={[{w: 'the', t: 5.2}, {w: 'same', t: 5.48}, {w: 'sentence', t: 5.9, key: true}]} />
      {Array.from({length: 15}).map((_, i) => {
        const c = i % 5;
        const r = Math.floor(i / 5);
        const p = pop(T, s + 0.5 + i * 0.12);
        return (
          <div key={i} style={{opacity: clamp01(p * 2), transform: `scale(${0.7 + 0.3 * p})`, ...abs(46 + c * 202, 640 + r * 252, 180, 230, {transformOrigin: '50% 50%'})}}>
            <Card x={0} y={0} w={180} h={230} radius={22}>
              <div style={{position: 'absolute', left: 16, top: 16, fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: '0.1em', color: INK}}>TO: {NAMES[i].toUpperCase()}</div>
              <div style={{position: 'absolute', left: 16, right: 14, top: 62, fontFamily: DISPLAY, fontWeight: 500, fontSize: 21, lineHeight: 1.25, color: INK}}>Please check homework today.</div>
              <div style={{position: 'absolute', left: 16, right: 14, top: 160, height: 8, borderRadius: 4, background: 'rgba(15,69,38,0.14)'}} />
              <div style={{position: 'absolute', left: 16, width: 90, top: 182, height: 8, borderRadius: 4, background: 'rgba(15,69,38,0.14)'}} />
            </Card>
          </div>
        );
      })}
    </>
  );
};

// ---------------- 3 ink: communication books, date stamps, clock ----------------
export const S3: React.FC<P> = ({T}) => {
  const s = STARTS[2];
  const days = ['MON 06', 'TUE 07', 'WED 08', 'THU 09', 'FRI 10'];
  const di = Math.min(4, Math.floor(Math.max(0, (T - (s + 0.9)) / 0.5)));
  const phase = ((T - (s + 0.9)) % 0.5) / 0.5;
  const squash = di < 4 && T > s + 0.9 ? 1 - 0.25 * Math.sin(Math.PI * Math.min(1, phase * 3)) : 1;
  const clockT = Math.max(0, T - s - 0.5);
  return (
    <>
      <Headline T={T} start={s} mode="ink" words={[{w: 'Communication', t: 8.28, key: true}, {w: 'books', t: 8.74}]} />
      {/* stack of books */}
      {[0, 1, 2, 3].map((i) => {
        const p = pop(T, s + 0.45 + i * 0.12);
        return (
          <div key={i} style={abs(80 + (i % 2) * 16, 1010 - i * 96 + (1 - p) * -200, 430, 84, {opacity: clamp01(p * 2), zIndex: i})}>
            <div style={{width: 430, height: 84, borderRadius: 12, background: WHITE, boxShadow: '0 12px 24px rgba(0,0,0,0.25)', position: 'relative'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 46, background: i === 3 ? HOT : 'rgba(15,69,38,0.3)', borderRadius: '12px 0 0 12px'}} />
              <div style={{position: 'absolute', left: 74, top: 30, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.14em', color: INK}}>BOOK {i + 1}</div>
            </div>
          </div>
        );
      })}
      {/* clock */}
      <div style={abs(610, 700, 370, 370, {opacity: clamp01(pop(T, s + 0.5) * 2), transform: `scale(${0.8 + 0.2 * pop(T, s + 0.5)})`})}>
        <div style={{width: 370, height: 370, borderRadius: '50%', background: WHITE, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative'}}>
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 183, top: 14, width: 4, height: i % 3 === 0 ? 26 : 14, background: INK, opacity: 0.6, transformOrigin: '2px 171px', transform: `rotate(${i * 30}deg)`}} />
          ))}
          <div style={{position: 'absolute', left: 181, top: 185 - 100, width: 8, height: 100, background: INK, borderRadius: 4, transformOrigin: '4px 100px', transform: `rotate(${clockT * 120}deg)`}} />
          <div style={{position: 'absolute', left: 182, top: 185 - 140, width: 6, height: 140, background: HOT, borderRadius: 3, transformOrigin: '3px 140px', transform: `rotate(${clockT * 1440}deg)`}} />
          <div style={{position: 'absolute', left: 170, top: 170, width: 30, height: 30, borderRadius: '50%', background: INK}} />
        </div>
      </div>
      {/* date stamp */}
      <Card x={250} y={1230} w={580} h={170} radius={26} style={{opacity: clamp01(pop(T, s + 0.7) * 2)}}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Chip text="date stamp" size={18} />
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 82, letterSpacing: '-0.03em', color: INK, transform: `scaleY(${squash})`, marginTop: 6}}>{days[di]}</div>
        </div>
      </Card>
    </>
  );
};

// ---------------- 4 grey: teacher card, the pen drops ----------------
export const S4: React.FC<P> = ({T}) => {
  const s = STARTS[3];
  const cardP = pop(T, s + 0.3, SOFT);
  const tilt = kf(T, [[12.9, 0], [13.9, -6]]);
  const penFall = easeIO(prog(T, 13.1, 0.9));
  return (
    <>
      <Headline T={T} start={s} mode="grey" words={[{w: 'the', t: 12.4}, {w: 'part', t: 12.62}, {w: 'I', t: 12.84}, {w: 'hate', t: 13.1, key: true}]} />
      <div style={{position: 'absolute', inset: 0, transform: `rotate(${tilt}deg)`, transformOrigin: '540px 1000px', opacity: clamp01(cardP * 2)}}>
        <Card x={170} y={760} w={740} h={430} radius={36} style={{transform: `scale(${0.88 + 0.12 * cardP})`}}>
          <Avatar text="MB" size={150} style={abs(54, 54)} />
          <div style={{position: 'absolute', left: 236, top: 66, fontFamily: DISPLAY, fontWeight: 800, fontSize: 60, letterSpacing: '-0.03em', color: INK}}>Ms. Bello</div>
          <div style={{position: 'absolute', left: 236, top: 150}}><Chip text="class teacher" /></div>
          <div style={{position: 'absolute', left: 54, right: 54, top: 262, height: 3, background: 'rgba(15,69,38,0.16)'}} />
          <div style={{position: 'absolute', left: 54, top: 290, fontFamily: HAND, fontWeight: 600, fontSize: 54, color: INK}}>Dear Parent, ...</div>
        </Card>
      </div>
      {/* pen drops */}
      <div style={abs(700, 1130 + penFall * 520, 0, 0, {transform: `rotate(${-35 + penFall * 70}deg)`, opacity: 1 - penFall * 0.9, zIndex: 5})}>
        <div style={{width: 200, height: 18, background: WHITE, border: `3px solid ${INK}`, borderRadius: 9}} />
        <div style={{position: 'absolute', left: -26, top: 0, width: 22, height: 18, background: HOT, borderRadius: '9px 0 0 9px'}} />
      </div>
    </>
  );
};

// ---------------- 5 ink: 15 books count-up ----------------
export const S5: React.FC<P> = ({T}) => {
  const s = STARTS[4];
  const n = Math.round(15 * ease(prog(T, s + 0.2, 1.4)));
  return (
    <>
      <Headline T={T} start={s} mode="ink" words={[{w: 'books', t: 16.26}, {w: 'a', t: 16.9}, {w: 'day', t: 17.12, key: true}]} />
      <div
        style={abs(0, 560, 1080, 340, {
          textAlign: 'center',
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 300,
          letterSpacing: '-0.05em',
          color: HOT,
          lineHeight: 1,
          textShadow: '0 0 60px rgba(55,200,113,0.45)',
          transform: `scale(${1 + 0.04 * Math.sin(prog(T, s + 0.2, 1.6) * Math.PI)})`,
        })}
      >
        {n}
      </div>
      {Array.from({length: 15}).map((_, i) => {
        const on = T > s + 0.2 + (i / 15) * 1.4;
        const c = i % 5;
        const r = Math.floor(i / 5);
        const p = pop(T, s + 0.2 + (i / 15) * 1.4, SOFT);
        return (
          <div key={i} style={abs(105 + c * 180, 1010 + r * 150, 130, 120, {opacity: on ? 1 : 0.25, transform: `scale(${on ? 0.85 + 0.15 * p : 0.85})`})}>
            <Book w={130} h={120} hot={on} />
          </div>
        );
      })}
    </>
  );
};

// ---------------- 6 grey: same note, rolling names ----------------
export const S6: React.FC<P> = ({T}) => {
  const s = STARTS[5];
  const names = ['Ada', 'Tunde', 'Chioma', 'Emeka', 'Zainab'];
  const idx = Math.min(4, Math.max(0, Math.floor((T - 19.0) / 0.3)));
  const ph = T < 19 ? 0 : ((T - 19.0) % 0.3) / 0.3;
  const slide = idx < 4 && T >= 19 && T < 20.5 ? ph : 1;
  const cardP = pop(T, s + 0.4, SOFT);
  return (
    <>
      <Headline T={T} start={s} mode="grey" words={[{w: 'same', t: 17.84}, {w: 'message,', t: 18.24}, {w: 'different', t: 20.6, key: true}, {w: 'name', t: 20.84}]} />
      <Card x={140} y={820} w={800} h={540} radius={36} style={{opacity: clamp01(cardP * 2), transform: `scale(${0.9 + 0.1 * cardP})`}}>
        <div style={{position: 'absolute', left: 48, top: 44, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: '0.14em', color: INK}}>TO:</div>
        <div style={{position: 'absolute', left: 130, top: 26, width: 620, height: 84, borderRadius: 20, background: 'rgba(55,200,113,0.22)', overflow: 'hidden'}}>
          <div
            key={idx}
            style={{position: 'absolute', left: 28, top: 0, height: 84, display: 'flex', alignItems: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 46, letterSpacing: '-0.03em', color: INK, transform: `translateY(${(1 - ease(slide)) * 70}px)`, opacity: clamp01(slide * 2)}}
          >
            {names[idx]}'s parent
          </div>
        </div>
        <div style={{position: 'absolute', left: 48, right: 48, top: 150, height: 3, background: 'rgba(15,69,38,0.16)'}} />
        <div style={{position: 'absolute', left: 48, right: 48, top: 190, fontFamily: DISPLAY, fontWeight: 500, fontSize: 44, lineHeight: 1.3, color: INK}}>
          Same message. Please check homework today. Thank you.
        </div>
        <div style={{position: 'absolute', left: 48, bottom: 40}}><Chip text="same text every time" /></div>
      </Card>
    </>
  );
};

// ---------------- 7 ink: calendar, 20 hours ----------------
export const S7: React.FC<P> = ({T}) => {
  const s = STARTS[6];
  const n = Math.min(20, Math.max(0, Math.floor((T - 22.2) / 0.085)));
  return (
    <>
      <Headline T={T} start={s} mode="ink" words={[{w: '20', t: 23.14, key: true}, {w: 'hours', t: 23.68}, {w: 'a', t: 24.0}, {w: 'month', t: 24.22}]} />
      <div style={abs(87, 580, 906, 140, {display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 20})}>
        <span style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 150, letterSpacing: '-0.05em', color: HOT, lineHeight: 1, textShadow: '0 0 40px rgba(55,200,113,0.4)'}}>{n}</span>
        <Chip text="hours" fill="rgba(255,255,255,0.14)" color={WHITE} />
      </div>
      {Array.from({length: 20}).map((_, i) => {
        const c = i % 5;
        const r = Math.floor(i / 5);
        const on = i < n;
        const p = pop(T, 22.2 + i * 0.085, SOFT);
        return (
          <div key={i} style={abs(87 + c * 184, 780 + r * 164, 170, 150, {borderRadius: 22, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'})}>
            <div style={{position: 'absolute', left: 16, top: 12, fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: '0.1em', color: WHITE, opacity: 0.8}}>{String(i + 1).padStart(2, '0')}</div>
            {on ? (
              <div style={{position: 'absolute', left: 14, right: 14, bottom: 14, height: 70, borderRadius: 14, background: HOT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 24, color: INK, letterSpacing: '0.1em', transform: `scale(${0.6 + 0.4 * p})`}}>1H</div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

// ---------------- 8 grey: logo moment ----------------
export const S8: React.FC<P> = ({T}) => {
  const s = STARTS[7];
  const p = pop(T, 26.95);
  return (
    <>
      <Ripple T={T} t0={27.05} cx={540} cy={1020} maxR={620} dur={1.3} color={HOT} />
      <Ripple T={T} t0={27.3} cx={540} cy={1020} maxR={620} dur={1.3} color={WHITE} />
      <Headline T={T} start={s} mode="grey" words={[{w: 'My', t: 25.96}, {w: 'school', t: 26.14}, {w: 'introduced', t: 26.42, key: true}]} />
      <div style={{position: 'absolute', inset: 0, opacity: clamp01(p * 2), transform: `translateY(${(1 - p) * -420}px)`}}>
        <Card x={150} y={720} w={780} h={600} radius={44}>
          <img src={img.fullColor} style={{position: 'absolute', left: 90, top: 100, width: 600}} />
        </Card>
      </div>
    </>
  );
};

// ---------------- 9 ink: composer on phone ----------------
const TEMPLATE: ({t: string} | {chip: string})[] = [
  {t: 'Dear '},
  {chip: '{Parent}'},
  {t: ', '},
  {chip: '{Child}'},
  {t: ' '},
  {chip: '{Note}'},
  {t: '. Please check homework today. Ms. Bello'},
];
export const S9: React.FC<P> = ({T}) => {
  const s = STARTS[8];
  const phoneP = pop(T, s + 0.2, SOFT);
  const typeP = prog(T, 28.9, 2.0);
  const total = TEMPLATE.reduce((a, t) => a + ('t' in t ? t.t.length : 6), 0);
  const upto = Math.floor(typeP * total);
  let used = 0;
  const parts: React.ReactNode[] = [];
  TEMPLATE.forEach((tk, i) => {
    const len = 't' in tk ? tk.t.length : 6;
    const n = Math.max(0, Math.min(len, upto - used));
    used += len;
    if (n <= 0) return;
    if ('t' in tk) parts.push(<span key={i}>{tk.t.slice(0, n)}</span>);
    else if (n >= 6) parts.push(<Chip key={i} text={tk.chip.replace(/[{}]/g, '')} size={22} style={{margin: '0 4px', transform: `scale(${0.9 + 0.1 * pop(T, 28.9 + (used / total) * 2.0, POP)})`}} />);
  });
  const clickAt = 31.0;
  const noteOn = T > clickAt;
  const cx = kf(T, [[29.8, 880], [30.9, 640]]);
  const cy = kf(T, [[29.8, 1400], [30.9, 880]]);
  return (
    <>
      <Headline T={T} start={s} mode="ink" words={[{w: 'Type', t: 28.72}, {w: 'one', t: 29.06, key: true}, {w: 'message', t: 29.4}]} />
      <div style={abs(250, 520, 580, 1000, {opacity: clamp01(phoneP * 2), transform: `perspective(1800px) rotateY(${-8 * phoneP}deg) rotateX(${3 * phoneP}deg) scale(${0.9 + 0.1 * phoneP})`})}>
        <div style={{width: 580, height: 1000, borderRadius: 64, background: WHITE, boxShadow: '0 40px 80px rgba(0,0,0,0.4)', border: '10px solid rgba(255,255,255,0.9)', position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 200, top: 18, width: 160, height: 34, borderRadius: 17, background: INK}} />
          <div style={{position: 'absolute', left: 36, top: 86, display: 'flex', gap: 14, alignItems: 'center'}}>
            <div style={{width: 54, height: 54, borderRadius: 16, background: WHITE, boxShadow: '0 4px 12px rgba(15,69,38,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <img src={img.markColor} style={{width: 36, height: 36}} />
            </div>
            <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: INK, letterSpacing: '-0.02em'}}>Quickreach</div>
          </div>
          <div style={{position: 'absolute', left: 36, top: 176}}><Chip text="new message" size={18} /></div>
          <div style={{position: 'absolute', left: 36, right: 36, top: 240, minHeight: 280, borderRadius: 26, background: 'rgba(55,200,113,0.12)', padding: 28, fontFamily: DISPLAY, fontWeight: 500, fontSize: 34, lineHeight: 1.7, color: INK}}>
            {parts}
            {typeP < 1 ? <span style={{display: 'inline-block', width: 3, height: 34, background: INK, marginLeft: 2, opacity: Math.floor(T * 3) % 2 ? 0 : 1}} /> : null}
          </div>
          {/* special note popup */}
          <div style={{position: 'absolute', left: 36, top: 620, opacity: noteOn ? 1 : 0, transform: `translateY(${noteOn ? (1 - pop(T, clickAt)) * 24 : 24}px)`}}>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: '0.14em', color: INK, marginBottom: 12}}>SPECIAL NOTE</div>
            <div style={{background: HOT, color: INK, fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, borderRadius: 22, padding: '18px 28px', display: 'inline-block'}}>Ada: read well today</div>
          </div>
        </div>
      </div>
      <Cursor x={cx} y={cy} down={T > clickAt - 0.05 && T < clickAt + 0.1} />
    </>
  );
};

// ---------------- 10 grey: template splits into 15 messages ----------------
export const S10: React.FC<P> = ({T}) => {
  const s = STARTS[9];
  const tp = pop(T, s + 0.1, SOFT);
  const count = Math.min(15, Math.max(0, Math.floor((T - 32.95) / 0.08) + 1));
  return (
    <>
      <Headline T={T} start={s} mode="grey" words={[{w: '15', t: 32.88, key: true}, {w: 'personal', t: 33.62}, {w: 'messages', t: 34.06}]} />
      <div style={abs(0, 600, 1080, 70, {display: 'flex', justifyContent: 'center', opacity: clamp01((T - 32.95) * 4)})}>
        <Chip text={`drafts ${String(count).padStart(2, '0')} / 15`} fill={INK} color={WHITE} />
      </div>
      {T < 33.5 ? (
        <Card x={170} y={760} w={740} h={300} radius={32} style={{opacity: clamp01(tp * 2) * (1 - prog(T, 32.95, 0.4)), transform: `scale(${0.9 + 0.1 * tp})`}}>
          <div style={{position: 'absolute', left: 36, top: 36, right: 36, fontFamily: DISPLAY, fontWeight: 500, fontSize: 38, lineHeight: 1.7, color: INK}}>
            Dear <Chip text="Parent" size={20} />, <Chip text="Child" size={20} /> <Chip text="Note" size={20} />. Please check homework today.
          </div>
        </Card>
      ) : null}
      {Array.from({length: 15}).map((_, i) => {
        const c = i % 5;
        const r = Math.floor(i / 5);
        const t0 = 32.95 + i * 0.08;
        const p = sp(T, t0, {damping: 16, stiffness: 140, mass: 0.8});
        if (T < t0) return null;
        const tx = 46 + c * 202;
        const ty = 700 + r * 262;
        const x = 175 + (tx - 175) * p;
        const y = 760 + (ty - 760) * p;
        return (
          <div key={i} style={abs(x, y, 180, 240, {transform: `scale(${0.95 * (1 - p) + 1 * p})`, opacity: clamp01((T - t0) * 12), zIndex: i})}>
            <Card x={0} y={0} w={180} h={240} radius={22}>
              <div style={{position: 'absolute', left: 16, top: 14, fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: '0.1em', color: INK}}>{NAMES[i].toUpperCase()}</div>
              <div style={{position: 'absolute', left: 16, right: 12, top: 52, fontFamily: DISPLAY, fontWeight: 600, fontSize: 21, lineHeight: 1.25, color: INK}}>
                {NAMES[i]} {NOTES[i]}.
              </div>
              <div style={{position: 'absolute', left: 16, right: 12, top: 168, fontFamily: DISPLAY, fontWeight: 500, fontSize: 17, lineHeight: 1.25, color: 'rgba(15,69,38,0.7)'}}>Please check homework today.</div>
            </Card>
          </div>
        );
      })}
    </>
  );
};

// ---------------- 11 ink: THE TAP ----------------
export const S11: React.FC<P> = ({T}) => {
  const s = STARTS[10];
  const tap = 35.55;
  const btnP = pop(T, s + 0.05);
  const cx = kf(T, [[35.17, 860], [tap, 600]]);
  const cy = kf(T, [[35.17, 1250], [tap, 900]]);
  const down = T > tap - 0.04 && T < tap + 0.12;
  return (
    <>
      <Ripple T={T} t0={tap} cx={540} cy={880} maxR={1500} dur={1.0} color={HOT} />
      <Ripple T={T} t0={tap + 0.12} cx={540} cy={880} maxR={1500} dur={1.0} color={WHITE} />
      <Headline T={T} start={s} mode="ink" words={[{w: 'Just', t: 35.26}, {w: 'tapped', t: 35.5, key: true}, {w: 'to', t: 35.84}, {w: 'send', t: 36.08}]} />
      <div style={abs(160, 800, 760, 160, {borderRadius: 80, background: HOT, boxShadow: '0 0 60px rgba(55,200,113,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, letterSpacing: '-0.02em', color: INK, opacity: clamp01(btnP * 2), transform: `scale(${(0.8 + 0.2 * btnP) * (down ? 0.94 : 1)})`})}>
        Send to 15 parents
      </div>
      {Array.from({length: 15}).map((_, i) => {
        const c = i % 5;
        const r = Math.floor(i / 5);
        const t0 = tap + 0.1 + i * 0.04;
        const on = T > t0;
        const p = pop(T, t0);
        return (
          <div key={i} style={abs(114 + c * 168, 1090 + r * 150, 108, 108, {borderRadius: '50%', background: on ? HOT : 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 0.85 + 0.15 * p : 1})`, boxShadow: on ? '0 0 24px rgba(55,200,113,0.55)' : 'none'})}>
            <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.04em', color: on ? INK : WHITE, opacity: on ? 1 : 0.7}}>{on ? '✓' : NAMES[i].slice(0, 2).toUpperCase()}</span>
          </div>
        );
      })}
      <Cursor x={cx} y={cy} down={down} />
      {T > tap && T < tap + 0.08 ? <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.12)', zIndex: 90}} /> : null}
    </>
  );
};

// ---------------- 12 grey: five minutes ----------------
export const S12: React.FC<P> = ({T}) => {
  const s = STARTS[11];
  const cardP = pop(T, s + 0.2, SOFT);
  const sweep = 0.84 * easeIO(prog(T, 37.2, 1.5));
  const R = 250;
  const C = 2 * Math.PI * R;
  return (
    <>
      <Headline T={T} start={s} mode="grey" words={[{w: 'less', t: 37.68}, {w: 'than', t: 38.06}, {w: '5', t: 38.26, key: true}, {w: 'minutes', t: 38.74}]} />
      <Card x={170} y={640} w={740} h={780} radius={44} style={{opacity: clamp01(cardP * 2), transform: `scale(${0.92 + 0.08 * cardP})`}}>
        <svg width={740} height={780} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={370} cy={390} r={R} fill="none" stroke="rgba(15,69,38,0.12)" strokeWidth={34} />
          <circle cx={370} cy={390} r={R} fill="none" stroke={HOT} strokeWidth={34} strokeLinecap="round" strokeDasharray={`${C * sweep} ${C}`} transform="rotate(-90 370 390)" />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 280, letterSpacing: '-0.05em', color: INK, lineHeight: 1}}>5</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center'}}><Chip text="minutes" size={30} /></div>
      </Card>
    </>
  );
};

// ---------------- 13 ink: time for pupils ----------------
export const S13: React.FC<P> = ({T}) => {
  const s = STARTS[12];
  const pupils = ['AD', 'TU', 'CH', 'EM'];
  const tp = pop(T, s + 0.35, POP);
  return (
    <>
      <Headline T={T} start={s} mode="ink" words={[{w: 'Time', t: 40.06}, {w: 'for', t: 40.26}, {w: 'my', t: 41.76}, {w: 'pupils', t: 41.86, key: true}]} />
      <div style={abs(300, 640, 480, 300, {display: 'flex', justifyContent: 'center', transform: `scale(${tp})`, opacity: clamp01(tp * 2)})}>
        <Avatar text="MB" size={280} fill={HOT} color={INK} style={{boxShadow: '0 0 70px rgba(55,200,113,0.45)'}} />
      </div>
      {pupils.map((n, i) => {
        const p = pop(T, 40.5 + i * 0.2);
        return (
          <div key={i} style={abs(120 + i * 220, 1100, 160, 160, {transform: `scale(${p})`, opacity: clamp01(p * 2)})}>
            <Avatar text={n} size={160} fill={WHITE} color={INK} style={{boxShadow: '0 14px 30px rgba(0,0,0,0.3)'}} />
          </div>
        );
      })}
      <div style={abs(560, 960, 420, 100, {opacity: clamp01(pop(T, 41.3) * 2), transform: `scale(${pop(T, 41.3)})`, transformOrigin: '10% 100%', borderRadius: '40px 40px 40px 8px', background: HOT, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 48, letterSpacing: '-0.02em'})}>
        Well done!
      </div>
    </>
  );
};

// ---------------- 14 grey: Quickreach by Cimple ----------------
export const S14: React.FC<P> = ({T}) => {
  const p = pop(T, 42.95, SOFT);
  const p2 = pop(T, 43.55, SOFT);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: clamp01(p * 2), transform: `scale(${0.9 + 0.1 * p})`}}>
        <Card x={120} y={400} w={840} h={1120} radius={48}>
          <img src={img.fullColor} style={{position: 'absolute', left: 130, top: 90, width: 580}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 600, fontSize: 56, color: INK, opacity: clamp01(p2 * 2)}}>by</div>
          <img src={img.cimpleColor} style={{position: 'absolute', left: 290, top: 560, width: 260 + 0, opacity: clamp01(p2 * 2), transform: `scale(${0.9 + 0.1 * p2})`, transformOrigin: '50% 50%'}} />
        </Card>
      </div>
    </>
  );
};

// ---------------- 15 ink: CTA ----------------
export const S15: React.FC<P> = ({T}) => {
  const s = STARTS[14];
  const bp = pop(T, 45.9);
  const pulse = 1 + 0.02 * (1 + Math.sin(((T - 45.9) / 1.2) * Math.PI * 2));
  return (
    <>
      {[0, 1, 2, 3].map((k) => (
        <Ripple key={k} T={T} t0={46.2 + k * 1.5} cx={540} cy={1180} maxR={700} dur={1.5} color={HOT} />
      ))}
      <Headline T={T} start={s} mode="ink" top={560} words={[{w: 'School', t: 44.94}, {w: 'owners,', t: 45.28}, {w: 'free', t: 47.48}, {w: 'demo', t: 47.62, key: true}]} />
      <img src={img.cimpleWhite} style={{position: 'absolute', left: 540 - 110, top: 120, width: 220, opacity: clamp01(pop(T, s + 0.3) * 2)}} />
      <div style={abs(190, 1100, 700, 160, {borderRadius: 80, background: HOT, boxShadow: '0 0 60px rgba(55,200,113,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 56, letterSpacing: '-0.02em', color: INK, opacity: clamp01(bp * 2), transform: `scale(${(0.8 + 0.2 * bp) * pulse})`})}>
        Free demo
      </div>
    </>
  );
};

export const SCENE_COMPONENTS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15];
