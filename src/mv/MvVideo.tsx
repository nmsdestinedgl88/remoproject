import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../theme'; // loads bundled Poppins + Inter

export const MV_SECONDS = 20;
const INK = '#333333', HOT = '#800080', BG = '#E9E2E9', TXT = '#F6F1F6';
const HOT2 = '#B04DB0'; // tint of HOT for text/fills on charcoal
const DIM = '#B9AFB9';
const PANEL = '#3C3A3C', PANEL2 = '#454245', EDGE = 'rgba(246,241,246,0.12)';
const H = 'Poppins, Helvetica, Arial, sans-serif', B = 'Inter, Helvetica, Arial, sans-serif';
const OUT = Easing.bezier(0.16, 1, 0.3, 1), IO = Easing.bezier(0.65, 0, 0.35, 1);

const TW = 980, TH = 640; // tablet size
type K = [number, number, number, number, number, number, number]; // t, fx, fy, scale, rotZ, blur, tiltX
const CAM: K[] = [
  [0, 490, 320, 0.78, -7, 16, 14],
  [1.4, 490, 320, 0.98, -2, 0, 6],
  [3.4, 490, 320, 1.04, 0, 0, 0],
  [5.0, 260, 190, 1.55, 0, 0, 0],
  [7.2, 300, 200, 1.7, 0, 0, 0],
  [8.4, 760, 170, 2.0, 0, 7, 0],
  [9.2, 790, 190, 2.05, 0, 0, 0],
  [11.4, 790, 190, 2.05, 0, 0, 0],
  [12.6, 240, 470, 2.3, 0, 6, 0],
  [13.3, 240, 480, 2.3, 0, 0, 0],
  [14.2, 640, 500, 2.3, 0, 0, 0],
  [16.4, 490, 320, 1.0, 0, 0, 0],
];
const cam = (t: number) => {
  let i = 0;
  while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++;
  const a = CAM[i], b = CAM[i + 1];
  const p = interpolate(t, [a[0], b[0]], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: IO});
  const l = (j: number) => a[j] + (b[j] - a[j]) * p;
  return {fx: l(1), fy: l(2), s: l(3), rz: l(4), blur: l(5), tx: l(6)};
};
const ease = (t: number, a: number, b: number, from = 0, to = 1, e = OUT) =>
  interpolate(t, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

const Card: React.FC<{x: number; y: number; w: number; h: number; t: number; at: number; children: React.ReactNode; bg?: string}> = ({x, y, w, h, t, at, children, bg = PANEL}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 16, background: bg, border: `1px solid ${EDGE}`, padding: 14, boxSizing: 'border-box', opacity: ease(t, at, at + 0.5), transform: `translateY(${ease(t, at, at + 0.6, 14, 0)}px)`, overflow: 'hidden'}}>{children}</div>
);
const Lbl: React.FC<{children: React.ReactNode; s?: number; c?: string; w?: number}> = ({children, s = 11, c = DIM, w = 500}) => (
  <div style={{fontFamily: B, fontSize: s, color: c, fontWeight: w, letterSpacing: 0.2}}>{children}</div>
);

const Tablet: React.FC<{t: number}> = ({t}) => {
  // palm grid
  const rows = 6, cols = 12;
  const sweep = ease(t, 5.4, 7.4, -0.2, 1.2, IO);
  const sidebarOpen = ease(t, 4.4, 5.2) - ease(t, 7.6, 8.2);
  const gauge = ease(t, 12.4, 14.2, 0, 0.72, OUT);
  const count = (a: number, b: number, to: number, d = 1) => (ease(t, a, b, 0, to)).toFixed(d);
  return (
    <div style={{position: 'relative', width: TW, height: TH, borderRadius: 34, background: '#2C2A2C', border: '3px solid #1E1C1E', boxShadow: '0 40px 80px rgba(51,40,51,0.45), 0 8px 18px rgba(51,40,51,0.35)', overflow: 'hidden'}}>
      {/* top bar */}
      <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 54, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 12, borderBottom: `1px solid ${EDGE}`}}>
        <Img src={staticFile('mv/mark.png')} style={{width: 28, height: 28}} />
        <div style={{fontFamily: H, fontWeight: 600, fontSize: 17, color: TXT}}>Manetrust</div>
        <div style={{marginLeft: 22, flex: 1, maxWidth: 360, height: 30, borderRadius: 15, background: PANEL, border: `1px solid ${EDGE}`, display: 'flex', alignItems: 'center', padding: '0 14px'}}><Lbl>Search plans, sections, files</Lbl></div>
        <div style={{marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center'}}>
          <div style={{width: 30, height: 30, borderRadius: 15, background: HOT, color: TXT, fontFamily: B, fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>PE</div>
          <div><Lbl s={12} c={TXT} w={600}>Palm Estate</Lbl><Lbl s={9}>Plan workspace</Lbl></div>
        </div>
      </div>
      {/* sidebar icons */}
      <div style={{position: 'absolute', left: 14, top: 74, width: 42, display: 'flex', flexDirection: 'column', gap: 16, opacity: 1 - sidebarOpen * 0.0}}>
        {[0, 1, 2, 3, 4, 5].map((i) => (<div key={i} style={{width: 30, height: 30, borderRadius: 9, background: i === 1 ? HOT : PANEL, border: `1px solid ${EDGE}`, marginLeft: 4}} />))}
      </div>
      {/* main: palm map */}
      <Card x={70} y={70} w={560} h={300} t={t} at={0.9} bg="#2F3B2F00">
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(135deg, #3A353A, #2E2B2E)`}} />
        <div style={{position: 'absolute', left: 16, top: 12}}><Lbl s={14} c={TXT} w={600}>Palm estate site overview</Lbl><Lbl s={10}>Planting blocks and yield zones (sample)</Lbl></div>
        <div style={{position: 'absolute', left: 30, top: 70, right: 30, bottom: 30, display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)`}}>
          {Array.from({length: rows * cols}).map((_, i) => {
            const c = i % cols, r = Math.floor(i / cols);
            const dly = 0.9 + (c + r) * 0.035;
            const hot = c >= 3 && c <= 6 && r >= 1 && r <= 3;
            const sw = Math.max(0, 1 - Math.abs(c / cols - sweep) * 7);
            return (<div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 16, height: 16, borderRadius: 8, background: sw > 0.2 ? HOT2 : hot && t > 6.6 ? HOT2 : '#6A606A', transform: `scale(${ease(t, dly, dly + 0.4, 0.2, 1) * (1 + sw * 0.5)})`, opacity: ease(t, dly, dly + 0.4)}} />
            </div>);
          })}
        </div>
        <div style={{position: 'absolute', left: `${30 + (3 / 12) * 500}px`, top: 100, width: 4 * 41.5, height: 3 * 31.5, border: `2px solid ${HOT2}`, borderRadius: 10, background: 'rgba(128,0,128,0.28)', opacity: ease(t, 6.4, 7.0) }} />
        <div style={{position: 'absolute', left: 190, top: 76, padding: '4px 10px', borderRadius: 12, background: TXT, color: INK, fontFamily: B, fontSize: 10, fontWeight: 600, opacity: ease(t, 6.6, 7.1)}}>Block B · priority</div>
      </Card>
      {/* right column */}
      <Card x={644} y={70} w={150} h={96} t={t} at={1.0}><Lbl>Plan readiness</Lbl><div style={{fontFamily: H, fontSize: 30, color: TXT, fontWeight: 600, marginTop: 6}}>{count(8.4, 10, 86.3)}<span style={{fontSize: 13, color: DIM}}>%</span></div><Lbl s={9} c={HOT2}>sample</Lbl></Card>
      <Card x={802} y={70} w={150} h={96} t={t} at={1.1}><Lbl>Sections done</Lbl><div style={{fontFamily: H, fontSize: 30, color: TXT, fontWeight: 600, marginTop: 6}}>{Math.round(ease(t, 8.6, 9.6, 0, 6))}<span style={{fontSize: 13, color: DIM}}> of 8</span></div><Lbl s={9} c={HOT2}>sample</Lbl></Card>
      <Card x={644} y={176} w={150} h={96} t={t} at={1.2}><Lbl>Documents</Lbl><div style={{fontFamily: H, fontSize: 30, color: TXT, fontWeight: 600, marginTop: 6}}>{Math.round(ease(t, 8.8, 9.8, 0, 5))}</div><Lbl s={9} c={HOT2}>plan, projections, +3</Lbl></Card>
      <Card x={802} y={176} w={150} h={96} t={t} at={1.3}><Lbl>Next step</Lbl><div style={{marginTop: 10, padding: '6px 10px', borderRadius: 14, background: HOT, color: TXT, fontFamily: B, fontSize: 11, fontWeight: 600, display: 'inline-block'}}>Review draft</div></Card>
      <Card x={644} y={282} w={308} h={88} t={t} at={1.4}>
        <Lbl s={12} c={TXT} w={600}>Recent messages</Lbl>
        {['Projections ready for review', 'Market research added', 'Proposal outline approved'].map((m, i) => (
          <div key={i} style={{display: 'flex', gap: 8, alignItems: 'center', marginTop: 5, opacity: ease(t, 9.0 + i * 0.25, 9.5 + i * 0.25)}}><div style={{width: 8, height: 8, borderRadius: 4, background: HOT2}} /><Lbl s={10} c={TXT}>{m}</Lbl></div>
        ))}
      </Card>
      {/* bottom row: gauge + bars */}
      <Card x={70} y={382} w={290} h={240} t={t} at={1.5}>
        <Lbl s={13} c={TXT} w={600}>Funding readiness</Lbl><Lbl s={10}>How complete the plan pack is (sample)</Lbl>
        <svg width={290} height={170} viewBox="0 0 290 170" style={{position: 'absolute', left: 0, top: 56}}>
          <circle cx={90} cy={86} r={52} fill="none" stroke="#2A282A" strokeWidth={14} />
          <circle cx={90} cy={86} r={52} fill="none" stroke={HOT2} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52 * gauge} 999`} transform="rotate(-90 90 86)" />
          <text x={90} y={93} textAnchor="middle" fontFamily={H} fontSize={26} fontWeight={600} fill={TXT}>{Math.round(gauge * 100 / 0.72 * 0.72)}</text>
          {[['Plan', '48%'], ['Numbers', '32%'], ['Research', '20%']].map(([a, b], i) => (
            <g key={i} opacity={ease(t, 12.9 + i * 0.2, 13.4 + i * 0.2)}><circle cx={178} cy={52 + i * 32} r={4} fill={i === 0 ? HOT2 : i === 1 ? '#8C7E8C' : '#6A606A'} /><text x={190} y={56 + i * 32} fontFamily={B} fontSize={11} fill={DIM}>{a}</text><text x={190} y={70 + i * 32} fontFamily={H} fontSize={14} fontWeight={600} fill={TXT}>{b}</text></g>
          ))}
        </svg>
      </Card>
      <Card x={372} y={382} w={580} h={240} t={t} at={1.6}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><div><Lbl s={13} c={TXT} w={600}>Projection by quarter</Lbl><Lbl s={10}>Revenue outline, sample values only</Lbl></div><div style={{padding: '3px 10px', borderRadius: 12, background: PANEL2, border: `1px solid ${EDGE}`}}><Lbl s={10} c={TXT}>Full plan</Lbl></div></div>
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 26, height: 140, display: 'flex', alignItems: 'flex-end', gap: 12}}>
          {Array.from({length: 16}).map((_, i) => {
            const base = 28 + i * 6 + ((i * 37) % 13);
            const hgt = base * ease(t, 13.3 + i * 0.07, 14.2 + i * 0.07, 0, 1, Easing.bezier(0.34, 1.4, 0.64, 1));
            return <div key={i} style={{flex: 1, height: hgt, borderRadius: 5, background: i >= 13 ? HOT2 : '#7B6F7B'}} />;
          })}
        </div>
        <div style={{position: 'absolute', left: 20, bottom: 8, right: 20, display: 'flex', justifyContent: 'space-between'}}>{['Q1', 'Q2', 'Q3', 'Q4'].map((q) => <Lbl key={q} s={9}>{q}</Lbl>)}</div>
      </Card>
      {/* sidebar overlay (opens) */}
      <div style={{position: 'absolute', left: 8, top: 66, width: 180 * sidebarOpen + 50, height: 270, borderRadius: 18, background: 'rgba(30,28,30,0.94)', border: `1px solid ${EDGE}`, opacity: sidebarOpen, overflow: 'hidden', backdropFilter: 'blur(6px)'}}>
        {['Overview', 'Business plan', 'Projections', 'Market research', 'Proposal', 'Pitch deck', 'Messages'].map((n, i) => (
          <div key={n} style={{margin: '8px 10px', padding: '6px 10px', borderRadius: 10, background: i === 2 && t > 5.6 ? HOT : 'transparent', fontFamily: B, fontSize: 11, color: TXT, fontWeight: 500, whiteSpace: 'nowrap', transform: `translateX(${ease(t, 4.5 + i * 0.07, 5.0 + i * 0.07, -16, 0)}px)`}}>{n}</div>
        ))}
      </div>
    </div>
  );
};

export const MvVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const c = cam(t);
  // tablet visible until end card takes over
  const tabletOp = 1 - ease(t, 16.1, 16.9, 0, 1, IO);
  const endIn = (a: number, d = 0.7) => ease(t, a, a + d);
  // crumpled paper: slow drift + parallax with camera
  const px = -(c.fx - 490) * 0.05, py = -(c.fy - 320) * 0.05;
  const paperScale = 1.12 + ease(t, 0, 20, 0, 0.06, Easing.linear);
  const cornerOp = ease(t, 1.0, 1.6) * (1 - endIn(16.4, 0.4));
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{transform: `translate(${px}px,${py}px) scale(${paperScale})`}}>
        <Img src={staticFile('mv/paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {/* tablet under camera */}
      <AbsoluteFill style={{opacity: tabletOp, filter: `blur(${c.blur}px)`, perspective: 1800, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
        <div style={{width: TW, height: TH, transformOrigin: '50% 50%', transform: `translate(${(490 - c.fx) * c.s}px, ${(320 - c.fy) * c.s}px) rotateX(${c.tx}deg) rotateZ(${c.rz}deg) scale(${c.s})`}}>
          <Tablet t={t} />
        </div>
      </AbsoluteFill>
      {/* corner logo (the only persistent mark) */}
      <Img src={staticFile('mv/mark.png')} style={{position: 'absolute', right: 56, top: 64, width: 96, height: 96, opacity: cornerOp}} />
      {/* end card */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', opacity: endIn(16.4, 0.6)}}>
        <Img src={staticFile('mv/logo.png')} style={{width: 560, transform: `scale(${ease(t, 16.5, 17.4, 0.9, 1)})`, opacity: endIn(16.5), filter: 'drop-shadow(0 18px 24px rgba(51,40,51,0.25))'}} />
        <div style={{marginTop: 70, background: HOT, color: TXT, fontFamily: H, fontWeight: 800, fontSize: 70, lineHeight: 1.12, textAlign: 'center', padding: '34px 48px', borderRadius: 34, width: 860, boxSizing: 'border-box', transform: `translateY(${ease(t, 17.4, 18.1, 40, 0)}px) scale(${ease(t, 17.4, 18.1, 0.94, 1, Easing.bezier(0.34, 1.4, 0.64, 1))})`, opacity: endIn(17.4, 0.5), boxShadow: '0 20px 40px rgba(128,0,128,0.28)'}}>
          DM us for your unique palm estate plan
        </div>
      </AbsoluteFill>
      <Audio src={staticFile('mv/bgm.mp3')} volume={(f) => 0.8 * ease(f / fps, 0, 0.6)} />
      {[4.4, 8.2, 12.5, 16.3].map((s) => (<Sequence key={s} from={Math.round(s * fps)}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.28} /></Sequence>))}
      <Sequence from={Math.round(17.4 * fps)}><Audio src={staticFile('sfx/pop.wav')} volume={0.4} /></Sequence>
    </AbsoluteFill>
  );
};
