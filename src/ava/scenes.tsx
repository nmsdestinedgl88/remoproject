import React from 'react';
import {Img, OffthreadVideo, staticFile, interpolate} from 'remotion';
import {A} from './theme';
import {SCENES} from './cues';
import {Bg, Callout, Chip, Headline, Icon, Plate, Rise, Scene, Strip, Swipe, prog, useT} from './ui';

const {c} = A;
const FULL = A.W - 2 * A.M;

/** Full-bleed clip in the top 1020 px, bone block below. */
const Clip: React.FC<{src: string; rate?: number}> = ({src, rate = 1}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: A.W, height: 1020, overflow: 'hidden', background: c.mist}}>
    <OffthreadVideo src={staticFile(src)} volume={0} playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  </div>
);

const Mono: React.FC<{at: number; x: number; y: number; size?: number; weight?: number; color?: string; w?: number; children: React.ReactNode}> = ({
  at, x, y, size = 30, weight = 500, color = c.ink, w = FULL, children,
}) => (
  <Rise at={at} style={{left: x, top: y, width: w}}>
    <div style={{fontFamily: A.f.mono, fontWeight: weight, fontSize: size, letterSpacing: '0.08em', color, textTransform: 'uppercase'}}>{children}</div>
  </Rise>
);

// ------------------------------------------------------------------ S1 hook
export const S1: React.FC = () => (
  <Scene range={SCENES.s1}>
    <Bg />
    <Clip src="ava/video_a.mp4" />
    <Strip n="01" label="DIABETES" at={0.1} overlay />
    <Icon name="glucometer" size={150} at={0.4} style={{left: A.M, top: 1060}} />
    <Chip at={0.9} x={262} y={1112} text="Prostate surgery" />
    <Headline at={0.22} out={6.8} y={1268} size={104}>Diabetes can slow healing.</Headline>
    <Headline at={6.97} y={1268} size={104}>
      Ask <Swipe at={7.35}>how big the cut</Swipe> will be.
    </Headline>
  </Scene>
);

// ------------------------------------------------------------------ S2 the cut
const Dot: React.FC<{cx: number; cy: number; r?: number; s?: number}> = ({cx, cy, r = 12, s = 1}) => (
  <circle cx={cx} cy={cy} r={r * s} fill={c.hot} stroke={c.ink} strokeWidth={3} />
);

export const S2: React.FC = () => {
  const t = useT();
  const draw = prog(t, 9.9, 2.7, A.ease.inOut); // long line draws
  const retract = prog(t, 13.62, 0.45, A.ease.inOut); // tail slides into the lead dot
  const drop = prog(t, 14.1, 0.5, A.ease.inOut); // lead dot becomes the last port
  const x2 = 936 * draw;
  const x1 = 936 * retract;
  const leadX = 936 + (858 - 936) * drop;
  const leadY = 120 + (352 - 120) * drop;
  const topLabels = prog(t, 9.95, 0.5) * (1 - prog(t, 13.6, 0.25, A.ease.exit));
  const botLabels = prog(t, 14.6, 0.5);
  const ports = [78, 273, 468, 663].map((cx, i) => prog(t, 14.45 + i * 0.08, 0.22));
  const showLong = x2 - x1 > 0.5;
  return (
    <Scene range={SCENES.s2}>
      <Bg />
      <Strip n="02" label="THE CUT" at={9.6} />
      <Headline at={9.83} out={13.4} y={300} size={104}>One long incision.</Headline>
      <Headline at={13.6} y={300} size={104}>
        A few <Swipe at={16.55}>small</Swipe> ones.
      </Headline>
      <svg width={936} height={440} viewBox="-16 0 968 440" style={{position: 'absolute', left: A.M, top: 520, overflow: 'visible'}} fontFamily={A.f.mono}>
        <g opacity={topLabels}>
          <text x={0} y={40} fontSize={24} fill={c.ink} letterSpacing={1.5}>OPEN SURGERY</text>
          <text x={0} y={168} fontSize={24} fill={c.ink} letterSpacing={1.5}>ONE LONG INCISION</text>
        </g>
        {showLong && <line x1={x1} y1={120} x2={x2} y2={120} stroke={c.teal} strokeWidth={6} strokeLinecap="round" />}
        <line x1={0} y1={232} x2={936} y2={232} stroke={c.ink} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="4 8" />
        <g opacity={botLabels}>
          <text x={0} y={288} fontSize={24} fill={c.ink} letterSpacing={1.5}>MINIMAL ACCESS SURGERY</text>
          <text x={0} y={416} fontSize={24} fill={c.ink} letterSpacing={1.5}>A FEW SMALL INCISIONS (COUNT ILLUSTRATIVE)</text>
        </g>
        {[78, 273, 468, 663].map((cx, i) => ports[i] > 0 && (
          <g key={cx} opacity={ports[i]}><Dot cx={cx} cy={352} s={0.6 + 0.4 * ports[i]} /></g>
        ))}
        {draw > 0 && <Dot cx={leadX} cy={leadY} />}
      </svg>
      <Icon name="ruler" size={120} at={9.95} style={{left: A.M, top: 1100}} />
    </Scene>
  );
};

// ------------------------------------------------------------------ S3 mechanism
export const S3: React.FC = () => {
  const t = useT();
  const surface = prog(t, 17.85, 0.5, A.ease.inOut);
  const portsP = [0, 1, 2].map((i) => prog(t, 18.4 + i * 0.08, 0.22));
  const shaft = (a: number) => prog(t, a, 0.9, A.ease.inOut);
  const sCam = shaft(18.8);
  const sL = shaft(18.95);
  const sR = shaft(19.1);
  const parts = prog(t, 18.7, 0.4);
  const jaws = prog(t, 19.9, 0.35);
  const screen = prog(t, 20.4, 0.45);
  const arrow = prog(t, 20.85, 0.4, A.ease.inOut);
  const zone = prog(t, 20.0, 0.5);
  const lab = (a: number) => prog(t, a, 0.4);
  const dash = (len: number, p: number): React.CSSProperties => ({strokeDasharray: len, strokeDashoffset: len * (1 - p)});
  const stroke = {stroke: c.teal, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
  return (
    <Scene range={SCENES.s3}>
      <Bg />
      <Strip n="03" label="LAPAROSCOPIC" at={17.55} />
      <svg width={936} height={760} viewBox="0 0 936 760" style={{position: 'absolute', left: A.M, top: 410, overflow: 'visible'}} fontFamily={A.f.mono}>
        <rect x={120} y={480} width={696} height={200} rx={8} fill="none" stroke={c.ink} strokeWidth={3} strokeDasharray="10 8" opacity={zone} />
        <line x1={0} y1={304} x2={936 * surface} y2={304} stroke={c.ink} strokeWidth={3} />
        <g opacity={parts}>
          <rect x={424} y={152} width={88} height={48} rx={6} fill={c.paper} stroke={c.teal} strokeWidth={6} />
          <rect x={220} y={216} width={40} height={48} rx={4} fill={c.paper} stroke={c.teal} strokeWidth={6} />
          <rect x={676} y={216} width={40} height={48} rx={4} fill={c.paper} stroke={c.teal} strokeWidth={6} />
        </g>
        <line x1={468} y1={200} x2={468} y2={520} {...stroke} style={dash(320, sCam)} opacity={sCam > 0 ? 1 : 0} />
        <line x1={240} y1={264} x2={240} y2={584} {...stroke} style={dash(320, sL)} opacity={sL > 0 ? 1 : 0} />
        <line x1={696} y1={264} x2={696} y2={584} {...stroke} style={dash(320, sR)} opacity={sR > 0 ? 1 : 0} />
        <g opacity={jaws}>
          <path d="M226 598 L240 584 L254 598" fill="none" {...stroke} />
          <path d="M682 598 L696 584 L710 598" fill="none" {...stroke} />
          <circle cx={468} cy={520} r={9} fill={c.paper} stroke={c.teal} strokeWidth={6} />
        </g>
        <g opacity={screen}>
          <rect x={348} y={24} width={240} height={96} rx={6} fill={c.mist} stroke={c.teal} strokeWidth={6} />
          <text x={468} y={82} textAnchor="middle" fontSize={28} fontWeight={600} fill={c.ink} letterSpacing={2}>SCREEN</text>
        </g>
        <g style={dash(60, arrow)} opacity={arrow > 0 ? 1 : 0}>
          <line x1={468} y1={152} x2={468} y2={124} {...stroke} />
          <path d="M456 136 L468 122 L480 136" fill="none" {...stroke} />
        </g>
        {portsP.map((p, i) => p > 0 && (
          <g key={i} opacity={p}><Dot cx={[240, 468, 696][i]} cy={304} s={0.6 + 0.4 * p} /></g>
        ))}
        <g fontSize={22} fill={c.ink} letterSpacing={1.5}>
          <text x={536} y={186} opacity={lab(19.4)}>CAMERA</text>
          <text x={260} y={418} opacity={lab(19.7)}>INSTRUMENT</text>
          <text x={516} y={418} opacity={lab(19.8)}>INSTRUMENT</text>
          <text x={388} y={714} opacity={zone}>TARGET AREA</text>
          <g fontSize={20} fillOpacity={0.7} opacity={lab(18.5)}>
            <text x={0} y={290}>OUTSIDE</text>
            <text x={0} y={332}>INSIDE</text>
          </g>
        </g>
      </svg>
      <Headline at={18.2} y={1210} size={88} w={760}>The surgeon works from a screen.</Headline>
      <Icon name="laparoscope" size={120} at={18.4} style={{left: 888, top: 1230}} />
    </Scene>
  );
};

// ------------------------------------------------------------------ S4 for diabetics
export const S4: React.FC = () => (
  <Scene range={SCENES.s4}>
    <Bg />
    <Strip n="04" label="FOR DIABETICS" at={22.05} />
    <Plate x={A.M} y={300} w={FULL} h={702} src="ava/i1.jpg" at={22.0} kb={[22.0, 27.1, 1, 1.05]} />
    <Callout at={23.2} dot={[751, 700]} to={[751, 1040]} />
    <Chip at={23.5} x={600} y={1030} text="Diabetic patient" />
    <Headline at={22.55} y={1110} size={112}>Less wound to heal.</Headline>
    <Chip at={22.9} x={A.M} y={1370} text="For diabetic patients" icon="plaster" />
    <Chip at={25.1} x={A.M} y={1456} text="Recovery can be quicker." />
  </Scene>
);

// ------------------------------------------------------------------ S5 proof
export const S5: React.FC = () => {
  const t = useT();
  const n = Math.round(interpolate(t, [30.3, 31.5], [0, 50], {easing: A.ease.out, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const plus = prog(t, 31.55, 0.3);
  return (
    <Scene range={SCENES.s5}>
      <Bg />
      <Clip src="ava/video_b.mp4" rate={10 / 11.3} />
      <Strip n="05" label="THE SURGEON" at={27.2} overlay />
      <Rise at={28.0} style={{left: A.M, top: 1060}}>
        <div style={{fontFamily: A.f.display, fontWeight: 700, fontSize: 60, letterSpacing: '-0.01em', color: c.ink, textTransform: 'uppercase'}}>Dr. Oto Peters</div>
      </Rise>
      <div style={{position: 'absolute', left: A.M, top: 1112, display: 'flex', alignItems: 'baseline'}}>
        <span style={{fontFamily: A.f.display, fontWeight: 800, fontSize: 250, lineHeight: 1.05, color: c.teal, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', opacity: prog(t, 30.2, 0.2)}}>{n}</span>
        <span style={{fontFamily: A.f.display, fontWeight: 800, fontSize: 250, lineHeight: 1.05, color: c.teal, opacity: plus, transform: `translateY(${(1 - plus) * 20}px)`}}>+</span>
        <span style={{marginLeft: 14, width: 34, height: 34, borderRadius: '50%', background: c.hot, border: `5px solid ${c.ink}`, boxSizing: 'border-box', opacity: prog(t, 31.7, 0.2), transform: `scale(${0.6 + 0.4 * prog(t, 31.7, 0.25)})`}} />
      </div>
      <Icon name="check-circle" size={140} at={32.4} style={{left: 868, top: 1180}} />
      <Mono at={31.0} x={A.M} y={1405} size={30}>Consecutive successful operations</Mono>
      <Mono at={35.71} x={A.M} y={1456} size={28} weight={400}>With this procedure and equipment</Mono>
      <Mono at={28.6} x={A.M} y={1512} size={24} color={c.teal}>Ava Consultants &amp; Urology Centre</Mono>
    </Scene>
  );
};

// ------------------------------------------------------------------ S6 only one in Uyo
export const S6: React.FC = () => (
  <Scene range={SCENES.s6}>
    <Bg />
    <Strip n="06" label="UYO" at={38.45} />
    <Rise at={38.74} style={{left: A.M, top: 290, width: FULL}}>
      <div style={{fontFamily: A.f.display, fontWeight: 800, fontSize: 116, lineHeight: 1.02, letterSpacing: '-0.015em', color: c.teal, textTransform: 'uppercase'}}>The only one</div>
    </Rise>
    <Rise at={38.86} style={{left: A.M, top: 408, width: FULL}}>
      <div style={{fontFamily: A.f.display, fontWeight: 800, fontSize: 116, lineHeight: 1.02, letterSpacing: '-0.015em', color: c.teal, textTransform: 'uppercase'}}>of its kind</div>
    </Rise>
    <Rise at={38.98} style={{left: A.M, top: 526, width: FULL}}>
      <div style={{fontFamily: A.f.display, fontWeight: 800, fontSize: 116, lineHeight: 1.02, letterSpacing: '-0.015em', color: c.ink, textTransform: 'uppercase'}}>in <Swipe at={40.6}>Uyo.</Swipe></div>
    </Rise>
    <Plate x={A.M} y={690} w={FULL} h={624} src="ava/i2.jpg" at={39.2} kb={[38.4, 42.35, 1, 1.035]} />
    <Callout at={40.0} dot={[704, 940]} to={[704, 1346]} />
    <Chip at={40.3} x={540} y={1340} text="Surgeon’s screen" />
    <Chip at={40.9} x={A.M} y={1430} text="Laparoscopic prostate surgery" icon="monitor" />
  </Scene>
);

// ------------------------------------------------------------------ S7 offer
const Row: React.FC<{at: number; y: number; children: React.ReactNode}> = ({at, y, children}) => {
  const t = useT();
  const p = prog(t, at, 0.5, A.ease.inOut);
  return (
    <>
      <div style={{position: 'absolute', left: A.M, top: y, height: 3, width: FULL * p, background: c.ink}} />
      <Rise at={at + 0.12} style={{left: A.M, top: y + 24, width: FULL}}>{children}</Rise>
    </>
  );
};

export const S7: React.FC = () => (
  <Scene range={SCENES.s7}>
    <Bg />
    <Strip n="07" label="BOOK" at={42.4} />
    <Plate x={A.M} y={290} w={FULL} h={624} src="ava/i3.jpg" at={42.35} kb={[42.35, 46.5, 1, 1.035]} />
    <Row at={42.42} y={966}>
      <div style={{fontFamily: A.f.display, fontWeight: 800, fontSize: 84, lineHeight: 1.02, letterSpacing: '-0.015em', color: c.teal, textTransform: 'uppercase'}}>Free consultation</div>
    </Row>
    <Row at={44.42} y={1130}>
      <div style={{width: 760, fontFamily: A.f.text, fontWeight: 600, fontSize: 44, lineHeight: 1.2, color: c.ink, textTransform: 'uppercase', letterSpacing: '0.02em'}}>Ask about diabetic <span style={{whiteSpace: 'nowrap'}}>pre-surgical</span> screening</div>
    </Row>
    <Icon name="glucometer" size={130} at={44.6} style={{left: 878, top: 1168}} />
  </Scene>
);

// ------------------------------------------------------------------ S8 call to action
const Group: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const t = useT();
  const p = prog(t, at, 0.4);
  return (
    <span style={{display: 'inline-block', clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, transform: `translateY(${(1 - p) * 18}px)`, opacity: p > 0 ? 1 : 0}}>{children}</span>
  );
};

const WebDot: React.FC = () => (
  <span style={{display: 'inline-block', width: 18, height: 18, borderRadius: '50%', background: c.hot, border: `3.5px solid ${c.ink}`, boxSizing: 'border-box', margin: '0 7px'}} />
);

export const S8: React.FC = () => {
  const t = useT();
  return (
    <Scene range={SCENES.s8}>
      <Bg />
      <Rise at={46.6} dy={0} dur={0.4} style={{left: A.M, top: 196}}>
        <Img src={staticFile('ava/logo.png')} style={{height: 120, width: 'auto'}} />
      </Rise>
      <Plate x={A.M} y={350} w={FULL} h={624} src="ava/i4.jpg" at={46.75} kb={[46.5, 56, 1, 1.04]} />
      <div style={{position: 'absolute', left: A.M, top: 1010, width: FULL, fontFamily: A.f.display, fontWeight: 800, fontSize: 112, lineHeight: 1.05, letterSpacing: '-0.02em', color: c.teal, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
        <Group at={46.72}>0808</Group> <Group at={48.16}>888</Group> <Group at={49.09}>2788</Group>
      </div>
      <Rise at={50.9} style={{left: A.M, top: 1160, width: FULL}}>
        <div style={{fontFamily: A.f.mono, fontWeight: 500, fontSize: 54, letterSpacing: '0.01em', color: c.ink, display: 'flex', alignItems: 'center'}}>
          avacentre<WebDot />com<WebDot />ng
        </div>
      </Rise>
      <Mono at={53.4} x={A.M} y={1252} size={34}>Off 4-Lane, Uyo</Mono>
      <Mono at={53.9} x={A.M} y={1500} size={24} weight={400} color={c.ink}>Scenes are illustrative.</Mono>
    </Scene>
  );
};

