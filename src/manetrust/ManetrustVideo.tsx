import React, {createContext, useContext} from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {theme} from '../theme';

// ---------------------------------------------------------------- constants
export const MT_SECONDS = 73;
const FPS = 30;
const FADE = 0.9; // scene crossfade length in seconds (slower than the reference ~0.5 s)

const C = {
  ink: '#333333',
  purple: '#800080',
  purpleDeep: '#4d004d',
  lilac: '#f1e4f1',
  white: '#ffffff',
  paper: '#f6f3f6',
};
const SHADOW = '0 28px 70px rgba(51,51,51,0.24)';
const SOFT = {damping: 24, stiffness: 70, mass: 1.1};
const POP = {damping: 15, stiffness: 95, mass: 1};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const F = theme.fonts.display;
const B = theme.fonts.body;

// Absolute film time (seconds) provided to every scene so cues use voiceover time.
const TCtx = createContext(0);
const useT = () => useContext(TCtx);

const sp = (t: number, at: number, config = SOFT) =>
  spring({frame: Math.round((t - at) * FPS), fps: FPS, config});

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

// ---------------------------------------------------------------- primitives
const Reveal: React.FC<{at: number; dy?: number; children: React.ReactNode; style?: React.CSSProperties; cfg?: typeof SOFT}> = ({
  at,
  dy = 44,
  children,
  style,
  cfg = SOFT,
}) => {
  const p = sp(useT(), at, cfg);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * dy}px) scale(${0.95 + 0.05 * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Word-by-word headline, 0.14 s per word. Words in *stars* use the hero colour. */
const Words: React.FC<{text: string; at: number; size: number; color?: string; hero?: string; align?: 'center' | 'left'; per?: number; weight?: number}> = ({
  text,
  at,
  size,
  color = C.ink,
  hero = C.purple,
  align = 'center',
  per = 0.14,
  weight = 800,
}) => {
  const t = useT();
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.26,
        rowGap: size * 0.06,
        fontFamily: F,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: '-0.02em',
        textAlign: align,
      }}
    >
      {text.split(' ').map((raw, i) => {
        const isHero = raw.startsWith('*');
        const w = raw.replace(/\*/g, '');
        const p = sp(t, at + i * per);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: Math.min(1, p * 1.5),
              transform: `translateY(${(1 - p) * 38}px)`,
              color: isHero ? hero : color,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Check: React.FC<{size?: number; color?: string; draw?: number}> = ({size = 56, color = C.purple, draw = 1}) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <circle cx="28" cy="28" r="26" fill={color} opacity={draw} />
    <path
      d="M16 29 L25 38 L41 19"
      fill="none"
      stroke="#fff"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="44"
      strokeDashoffset={44 * (1 - draw)}
    />
  </svg>
);

const Icon: React.FC<{kind: 'eye' | 'send' | 'question' | 'bell' | 'files' | 'play'; size?: number; color?: string}> = ({
  kind,
  size = 84,
  color = C.purple,
}) => {
  const common = {fill: 'none', stroke: color, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {kind === 'eye' && (
        <>
          <path d="M6 32 C16 16 48 16 58 32 C48 48 16 48 6 32 Z" {...common} />
          <circle cx="32" cy="32" r="8" {...common} />
        </>
      )}
      {kind === 'send' && (
        <>
          <path d="M8 30 L56 8 L40 56 L30 36 Z" {...common} />
          <path d="M30 36 L56 8" {...common} />
        </>
      )}
      {kind === 'question' && (
        <>
          <circle cx="32" cy="32" r="24" {...common} />
          <path d="M24 26 C24 18 40 18 40 27 C40 33 32 33 32 40" {...common} />
          <circle cx="32" cy="47" r="1.5" fill={color} stroke={color} strokeWidth="3" />
        </>
      )}
      {kind === 'bell' && (
        <>
          <path d="M14 46 L50 46 C44 40 44 34 44 28 C44 19 38 14 32 14 C26 14 20 19 20 28 C20 34 20 40 14 46 Z" {...common} />
          <path d="M27 52 C29 56 35 56 37 52" {...common} />
        </>
      )}
      {kind === 'files' && (
        <>
          <rect x="14" y="10" width="30" height="40" rx="4" {...common} />
          <path d="M22 18 L22 56 L50 56 L50 22" {...common} />
          <path d="M22 22 L36 22 M22 30 L36 30" {...common} />
        </>
      )}
      {kind === 'play' && <path d="M22 14 L52 32 L22 50 Z" fill={color} />}
    </svg>
  );
};

// ---------------------------------------------------------------- scene shell
type BgSpec = {tint: string; mode: React.CSSProperties['mixBlendMode']; alpha: number; bright?: number};
const BGS: Record<string, BgSpec> = {
  cream: {tint: '#f1e4f1', mode: 'multiply', alpha: 0.45},
  lilac: {tint: '#b873b8', mode: 'multiply', alpha: 0.55},
  charcoal: {tint: '#333333', mode: 'multiply', alpha: 0.94},
  purple: {tint: '#800080', mode: 'multiply', alpha: 0.92},
};

const Scene: React.FC<{
  start: number;
  end: number;
  bg: keyof typeof BGS;
  dark?: boolean;
  first?: boolean;
  last?: boolean;
  brand?: boolean;
  children: React.ReactNode;
}> = ({start, end, bg, dark, first, last, brand = true, children}) => {
  const from = Math.round((start - FADE / 2) * FPS);
  const dur = Math.round((end - start + FADE) * FPS);
  return (
    <Sequence from={Math.max(0, from)} durationInFrames={dur}>
      <SceneInner start={start} end={end} bg={bg} dark={dark} first={first} last={last} brand={brand} offset={Math.max(0, from) / FPS}>
        {children}
      </SceneInner>
    </Sequence>
  );
};

const SceneInner: React.FC<{
  start: number;
  end: number;
  bg: keyof typeof BGS;
  dark?: boolean;
  first?: boolean;
  last?: boolean;
  brand: boolean;
  offset: number;
  children: React.ReactNode;
}> = ({start, end, bg, dark, first, last, brand, offset, children}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS + offset;
  const h = FADE / 2;
  const o = interpolate(t, [start - h, start + h, end - h, end + h], [first ? 1 : 0, 1, 1, last ? 1 : 0], clamp);
  const exitDrift = interpolate(t, [end - h, end + h], [0, -26], clamp);
  const enterScale = interpolate(t, [start - h, start + h], [first ? 1 : 0.985, 1], clamp);
  const spec = BGS[bg];
  const drift = (t - start) * 0.0035;
  return (
    <TCtx.Provider value={t}>
      <AbsoluteFill style={{opacity: o}}>
        <AbsoluteFill style={{overflow: 'hidden', background: '#ddd'}}>
          <Img
            src={staticFile('manetrust/paper.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.06 + drift}) translate(${(t - start) * -3}px, ${(t - start) * -2}px)`,
            }}
          />
          <AbsoluteFill style={{background: spec.tint, mixBlendMode: spec.mode, opacity: spec.alpha}} />
        </AbsoluteFill>
        {brand && (
          <div style={{position: 'absolute', left: 72, top: 92, display: 'flex', alignItems: 'center', gap: 18, opacity: 0.95}}>
            <div style={{width: 84, height: 84, borderRadius: 42, overflow: 'hidden', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.18)'}}>
              <Img src={staticFile('manetrust/logo.png')} style={{width: 84, height: 112, display: 'block', marginTop: -2}} />
            </div>
            <div style={{fontFamily: F, fontWeight: 600, fontSize: 30, letterSpacing: 1, color: dark ? '#fff' : C.ink}}>
              Manetrust <span style={{fontWeight: 400, opacity: 0.8}}>Solutions</span>
            </div>
          </div>
        )}
        <AbsoluteFill style={{transform: `translateY(${exitDrift}px) scale(${enterScale})`}}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </TCtx.Provider>
  );
};

const Center: React.FC<{children: React.ReactNode; top?: number; bottom?: number; gap?: number}> = ({
  children,
  top = 250,
  bottom = 420,
  gap = 36,
}) => (
  <AbsoluteFill
    style={{padding: `${top}px 72px ${bottom}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap}}
  >
    {children}
  </AbsoluteFill>
);

// ---------------------------------------------------------------- scene 1: three kinds of women
const KindCard: React.FC<{at: number; until: number; n: number; icon: 'eye' | 'send' | 'question'; title: string; sub: string}> = ({
  at,
  until,
  n,
  icon,
  title,
  sub,
}) => {
  const t = useT();
  const p = sp(t, at, POP);
  const active = t >= at && t < until ? 1 : 0;
  const a = interpolate(t, [at, at + 0.6, until - 0.4, until + 0.4], [0, 1, 1, 0.55], clamp) * (active || t >= until ? 1 : 0);
  const glow = interpolate(t, [at, at + 0.6, until - 0.2, until + 0.6], [0, 1, 1, 0], clamp);
  const skel = sp(t, 1.4 + (n - 1) * 0.5) * 0.4;
  const main = Math.min(1, p * 1.5) * (0.6 + a * 0.4);
  return (
    <div
      style={{
        width: 900,
        height: 232,
        borderRadius: 36,
        background: '#fff',
        boxShadow: `0 ${18 + glow * 18}px ${44 + glow * 30}px rgba(128,0,128,${0.12 + glow * 0.16})`,
        border: `3px solid rgba(128,0,128,${0.1 + glow * 0.6})`,
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        padding: '0 44px',
        opacity: Math.max(main, skel),
        transform: `translateY(${(1 - Math.max(p, skel * 2.5)) * 70}px) scale(${(0.94 + 0.06 * Math.max(p, skel * 2.5)) * (1 + glow * 0.02)})`,
      }}
    >
      <div style={{display: 'contents', opacity: 1}} />
      <div style={{fontFamily: F, fontWeight: 800, fontSize: 120, lineHeight: 1, color: C.purple, width: 78, textAlign: 'center', opacity: Math.min(1, p * 1.5)}}>{n}</div>
      <div style={{flex: 1, opacity: Math.min(1, p * 1.5)}}>
        <div style={{fontFamily: F, fontWeight: 800, fontSize: 50, color: C.ink, lineHeight: 1.1}}>{title}</div>
        <div style={{fontFamily: B, fontWeight: 500, fontSize: 32, color: '#6b6b6b', marginTop: 10}}>{sub}</div>
      </div>
      <div style={{opacity: Math.min(1, p * 1.5)}}>
        <Icon kind={icon} size={96} />
      </div>
    </div>
  );
};

const S1: React.FC = () => (
  <Center top={240} bottom={400} gap={44}>
    <Reveal at={0.7} dy={30}>
      <Words text="*3 kinds of women." at={0.7} size={112} />
    </Reveal>
    <KindCard at={3.4} until={9.2} n={1} icon="eye" title="Saw it. Planned to apply." sub="BOI guaranteed loans for women" />
    <KindCard at={9.3} until={12.1} n={2} icon="send" title="Actually applied." sub="Took the step" />
    <KindCard at={12.2} until={15.0} n={3} icon="question" title="Never knew it existed." sub="The opportunity passed her by" />
  </Center>
);

// ---------------------------------------------------------------- scene 2: which one are you / overwhelmed
const S2: React.FC = () => {
  const t = useT();
  const q = interpolate(t, [15.6, 16.4, 17.0, 17.8], [0, 1, 1, 0], clamp);
  const qs = 0.96 + 0.04 * ease((t - 15.6) / 1.2) + (t > 16.0 ? (t - 16.0) * 0.012 : 0);
  const rows = [
    {at: 18.4, label: 'Business plan', done: true},
    {at: 19.5, label: 'Financial projections', done: true},
    {at: 20.6, label: 'Executive pitch', done: false},
    {at: 21.7, label: 'Supporting documents', done: false},
  ];
  const bar = interpolate(t, [18.2, 21.2], [0, 0.55], {easing: theme.ease.inOut, ...clamp});
  const shake = t > 21.4 && t < 22.2 ? Math.sin((t - 21.4) * 38) * 7 * (1 - (t - 21.4) / 0.8) : 0;
  const cardP = sp(t, 17.9);
  return (
    <>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: q, transform: `scale(${qs})`, padding: '0 72px 380px'}}>
        <Words text="Which one are *you?*" at={15.7} size={150} />
      </AbsoluteFill>
      <Center top={250} bottom={400} gap={34}>
        <div style={{opacity: Math.min(1, cardP * 1.5), transform: `translateY(${(1 - cardP) * 60}px)`, width: 920}}>
          <div style={{fontFamily: B, fontWeight: 500, fontSize: 34, letterSpacing: 6, color: C.purple, marginBottom: 14}}>TYPE 1</div>
          <div style={{fontFamily: F, fontWeight: 800, fontSize: 84, color: C.ink, lineHeight: 1.05}}>
            Overwhelmed <span style={{color: C.purple}}>midway.</span>
          </div>
        </div>
        <div
          style={{
            width: 920,
            borderRadius: 40,
            background: '#fff',
            boxShadow: SHADOW,
            padding: '44px 48px',
            opacity: Math.min(1, cardP * 1.5),
            transform: `translateY(${(1 - cardP) * 90 + shake * 0}px) translateX(${shake}px)`,
          }}
        >
          {rows.map((r, i) => {
            const p = sp(t, r.at);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '20px 0', opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -40}px)`}}>
                {r.done ? (
                  <Check size={58} draw={sp(t, r.at + 0.4)} />
                ) : (
                  <div style={{width: 58, height: 58, borderRadius: 29, border: '4px dashed #b9b9b9'}} />
                )}
                <div style={{fontFamily: F, fontWeight: 600, fontSize: 44, color: r.done ? C.ink : '#8a8a8a'}}>{r.label}</div>
              </div>
            );
          })}
          <div style={{marginTop: 26, height: 26, borderRadius: 13, background: '#ece6ec', overflow: 'hidden'}}>
            <div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 13, background: `linear-gradient(90deg, ${C.purple}, #b04cb0)`}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16, fontFamily: B, fontWeight: 500, fontSize: 32, color: '#777'}}>
            <span>{Math.round(bar * 100)}% complete</span>
            <span style={{opacity: interpolate(t, [21.8, 22.6], [0, 1], clamp), color: C.purple, fontWeight: 600}}>Stuck…</span>
          </div>
        </div>
      </Center>
    </>
  );
};

// ---------------------------------------------------------------- scene 3: applied up to 50 million
const S3: React.FC = () => {
  const t = useT();
  const prog = interpolate(t, [24.4, 27.6], [0, 1], {easing: theme.ease.out, ...clamp});
  const R = 250;
  const circ = 2 * Math.PI * R;
  const badge = sp(t, 28.2, POP);
  return (
    <Center top={250} bottom={420} gap={40}>
      <Reveal at={24.0}>
        <div style={{fontFamily: B, fontWeight: 500, fontSize: 34, letterSpacing: 6, color: C.purple, textAlign: 'center'}}>TYPE 2</div>
        <div style={{fontFamily: F, fontWeight: 800, fontSize: 78, color: C.ink, textAlign: 'center', lineHeight: 1.05, marginTop: 10}}>
          Completed her documents <span style={{color: C.purple}}>and applied.</span>
        </div>
      </Reveal>
      <Reveal at={25.0} dy={60}>
        <div style={{position: 'relative', width: 620, height: 620, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={620} height={620} viewBox="0 0 620 620" style={{position: 'absolute'}}>
            <circle cx="310" cy="310" r={R} fill="#fff" opacity="0.9" />
            <circle cx="310" cy="310" r={R} fill="none" stroke="#e8dbe8" strokeWidth="26" />
            <circle
              cx="310"
              cy="310"
              r={R}
              fill="none"
              stroke={C.purple}
              strokeWidth="26"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - prog)}
              transform="rotate(-90 310 310)"
            />
          </svg>
          <div style={{textAlign: 'center', position: 'relative'}}>
            <div style={{fontFamily: B, fontWeight: 500, fontSize: 34, color: '#777'}}>up to</div>
            <div style={{fontFamily: F, fontWeight: 800, fontSize: 138, color: C.ink, lineHeight: 1}}>
              ₦{Math.round(50 * prog)}M
            </div>
          </div>
        </div>
      </Reveal>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          background: '#fff',
          borderRadius: 60,
          padding: '20px 40px 20px 26px',
          boxShadow: SHADOW,
          opacity: Math.min(1, badge * 1.5),
          transform: `scale(${0.9 + 0.1 * badge})`,
        }}
      >
        <Check size={60} draw={sp(t, 28.5)} />
        <span style={{fontFamily: F, fontWeight: 600, fontSize: 42, color: C.ink}}>To grow her business</span>
      </div>
    </Center>
  );
};

// ---------------------------------------------------------------- scene 4: 7% vs high interest
const S4: React.FC = () => {
  const t = useT();
  const hi = interpolate(t, [32.0, 34.2], [0, 1], {easing: theme.ease.out, ...clamp});
  const lo = interpolate(t, [35.1, 36.9], [0, 1], {easing: theme.ease.out, ...clamp});
  const BAR_H = 600;
  const pct = Math.round(7 * lo);
  const labelP = sp(t, 35.6, POP);
  return (
    <Center top={250} bottom={420} gap={30}>
      <Reveal at={30.8}>
        <div style={{fontFamily: B, fontWeight: 500, fontSize: 34, letterSpacing: 6, color: '#e7c4e7', textAlign: 'center'}}>TYPE 3</div>
        <div style={{fontFamily: F, fontWeight: 800, fontSize: 76, color: '#fff', textAlign: 'center', lineHeight: 1.06, marginTop: 10}}>
          Still struggling with <span style={{color: '#e59be5'}}>high-interest</span> options.
        </div>
      </Reveal>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 80, height: BAR_H + 110, marginTop: 20}}>
        <div style={{width: 340, textAlign: 'center'}}>
          <div style={{height: BAR_H * hi, borderRadius: '28px 28px 0 0', background: 'linear-gradient(180deg,#8d8d8d,#5a5a5a)', marginTop: BAR_H * (1 - hi), boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}} />
          <div style={{fontFamily: F, fontWeight: 600, fontSize: 38, color: '#d9d9d9', marginTop: 20, opacity: hi}}>High-interest loans</div>
        </div>
        <div style={{width: 340, textAlign: 'center', position: 'relative'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: BAR_H - 200 * lo - 150, opacity: Math.min(1, labelP * 1.5), transform: `scale(${0.85 + 0.15 * labelP})`}}>
            <div style={{fontFamily: F, fontWeight: 800, fontSize: 130, color: '#fff', lineHeight: 1}}>{pct}%</div>
            <div style={{fontFamily: B, fontWeight: 500, fontSize: 36, color: '#f1d7f1'}}>per year</div>
          </div>
          <div style={{height: 200 * lo, borderRadius: '28px 28px 0 0', background: `linear-gradient(180deg,#b04cb0,${C.purple})`, marginTop: BAR_H - 200 * lo, boxShadow: '0 20px 60px rgba(176,76,176,0.55)'}} />
          <div style={{fontFamily: F, fontWeight: 600, fontSize: 38, color: '#fff', marginTop: 20, opacity: lo}}>BOI option</div>
        </div>
      </div>
      <Reveal at={37.3} dy={30}>
        <div style={{fontFamily: B, fontWeight: 500, fontSize: 40, color: '#f1d7f1', textAlign: 'center'}}>Available for you all along.</div>
      </Reveal>
    </Center>
  );
};

// ---------------------------------------------------------------- scene 5: deliverables carousel
const CARD_W = 560;
const CARD_H = 835;
type Item = {at: number; label: string; node: React.ReactNode};

const DeckCard: React.FC = () => (
  <div style={{width: '100%', height: '100%', background: C.ink, position: 'relative', overflow: 'hidden', padding: 34}}>
    <Img src={staticFile('manetrust/paper.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, mixBlendMode: 'screen'}} />
    <div style={{position: 'relative', fontFamily: F, fontWeight: 800, fontSize: 40, color: '#fff', marginBottom: 22}}>Presentation deck</div>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          position: 'relative',
          height: 220,
          borderRadius: 18,
          background: i === 1 ? C.purple : '#fff',
          marginBottom: 22,
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          padding: 24,
        }}
      >
        <div style={{height: 22, width: '55%', borderRadius: 11, background: i === 1 ? '#fff' : C.ink, opacity: 0.9}} />
        <div style={{height: 14, width: '80%', borderRadius: 7, background: i === 1 ? '#e7c4e7' : '#cfcfcf', marginTop: 18}} />
        <div style={{height: 14, width: '68%', borderRadius: 7, background: i === 1 ? '#e7c4e7' : '#cfcfcf', marginTop: 12}} />
        <div style={{display: 'flex', gap: 12, alignItems: 'flex-end', position: 'absolute', right: 28, bottom: 22}}>
          {[40, 62, 84].map((h, k) => (
            <div key={k} style={{width: 26, height: h, borderRadius: 6, background: i === 1 ? '#fff' : C.purple}} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const VideoCard: React.FC<{t: number}> = ({t}) => {
  const prog = interpolate(t, [48.4, 51.8], [0, 1], clamp);
  return (
    <div style={{width: '100%', height: '100%', background: C.purple, position: 'relative', overflow: 'hidden'}}>
      <Img src={staticFile('manetrust/paper.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.55}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center'}}>
        <div style={{width: 170, height: 170, borderRadius: 85, overflow: 'hidden', background: '#fff'}}>
          <Img src={staticFile('manetrust/logo.png')} style={{width: 170, height: 227}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            transform: `scale(${1 + Math.sin(t * 3) * 0.03})`,
          }}
        >
          <Icon kind="play" size={78} color={C.purple} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 585, fontFamily: F, fontWeight: 800, fontSize: 36, color: '#fff', textAlign: 'center'}}>
        Your 1-minute video pitch
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, bottom: 56}}>
        <div style={{height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.3)'}}>
          <div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 5, background: '#fff'}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: B, fontWeight: 500, fontSize: 26, color: '#fff', marginTop: 12}}>
          <span>0:{String(Math.round(prog * 60)).padStart(2, '0')}</span>
          <span>1:00</span>
        </div>
      </div>
    </div>
  );
};

const S5: React.FC = () => {
  const t = useT();
  const items: Item[] = [
    {at: 41.3, label: 'Your business plan', node: <Img src={staticFile('manetrust/cover.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />},
    {at: 43.2, label: 'Your executive pitch', node: <Img src={staticFile('manetrust/exec.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />},
    {at: 45.0, label: 'Your presentation decks', node: <DeckCard />},
    {
      at: 46.8,
      label: 'A pitch page',
      node: (
        <Img
          src={staticFile('manetrust/pitch.jpg')}
          style={{
            width: '100%',
            display: 'block',
            transform: `translateY(${-interpolate(t, [47.2, 51.0], [0, 1888 * (CARD_W / 560) - CARD_H], {easing: theme.ease.inOut, ...clamp})}px)`,
          }}
        />
      ),
    },
    {at: 48.2, label: 'A 1-minute video pitch', node: <VideoCard t={t} />},
  ];
  // continuous index: how many items are in focus so far
  const idx = items.reduce((a, it) => a + sp(t, it.at, SOFT), 0) - 1;
  const ov = ease((t - 50.2) / 1.4); // overview: all five shrink into a row
  const intro = interpolate(t, [39.4, 40.2, 40.9, 41.7], [0, 1, 1, 0], clamp);
  const headerP = sp(t, 41.0);
  const label = items.reduce((cur, it, i) => (t >= it.at ? i : cur), -1);
  return (
    <>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 72px 380px', opacity: intro, transform: `scale(${0.96 + 0.04 * ease((t - 39.4) / 1.4)})`}}>
        <Words text="We make it *simple.*" at={39.5} size={150} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 250,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: F,
          fontWeight: 800,
          fontSize: 62,
          color: C.ink,
          opacity: Math.min(1, headerP * 1.5) * (1 - ov * 0.0),
          transform: `translateY(${(1 - headerP) * 30}px)`,
        }}
      >
        {ov > 0.5 ? (
          <>
            All of it, <span style={{color: C.purple}}>done for you.</span>
          </>
        ) : (
          <>
            We <span style={{color: C.purple}}>prepare</span> your…
          </>
        )}
      </div>
      <AbsoluteFill>
        {items.map((it, i) => {
          const d = i - idx;
          const ad = Math.abs(d);
          const baseX = d * 520;
          const baseS = interpolate(ad, [0, 1], [1, 0.6], clamp);
          const baseO = it.at - 0.0 > t ? 0 : interpolate(ad, [0, 1, 2], [1, 0.5, 0], clamp);
          const ovX = (i - 2) * 196;
          const x = baseX + (ovX - baseX) * ov;
          const s = baseS + (0.4 - baseS) * ov;
          const o = baseO + (1 - baseO) * ov * (t >= it.at ? 1 : 0);
          const y = 790 - 20 * ov;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 540 - CARD_W / 2 + x,
                top: y - CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                borderRadius: 30,
                overflow: 'hidden',
                background: '#fff',
                boxShadow: SHADOW,
                opacity: o,
                transform: `scale(${s}) rotate(${d * 2.5 * (1 - ov) + (i % 2 ? 1.5 : -1.5) * ov}deg)`,
                zIndex: 10 - Math.round(ad),
              }}
            >
              {it.node}
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1265, display: 'flex', justifyContent: 'center'}}>
        {items.map((it, i) => {
          const show = i === label && ov < 0.6;
          const p = show ? sp(t, it.at + 0.3) : 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                background: '#fff',
                borderRadius: 60,
                padding: '16px 42px',
                fontFamily: F,
                fontWeight: 600,
                fontSize: 44,
                color: C.purple,
                boxShadow: SHADOW,
                opacity: show ? Math.min(1, p * 1.5) : 0,
                transform: `translateY(${(1 - p) * 24}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              {it.label}
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- scene 6: alerts + apply
const Notif: React.FC<{at: number; tag: string; title: string; sub: string; icon: 'bell' | 'files' | 'send'; done?: boolean}> = ({
  at,
  tag,
  title,
  sub,
  icon,
  done,
}) => {
  const t = useT();
  const p = sp(t, at, POP);
  return (
    <div
      style={{
        width: 920,
        borderRadius: 36,
        background: '#fff',
        boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
        padding: '34px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: 34,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 90}px) scale(${0.94 + 0.06 * p})`,
      }}
    >
      <div style={{width: 120, height: 120, borderRadius: 30, background: C.lilac, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon kind={icon} size={78} />
      </div>
      <div style={{flex: 1}}>
        <div style={{fontFamily: B, fontWeight: 500, fontSize: 28, letterSpacing: 5, color: C.purple}}>{tag}</div>
        <div style={{fontFamily: F, fontWeight: 800, fontSize: 48, color: C.ink, lineHeight: 1.1, marginTop: 4}}>{title}</div>
        <div style={{fontFamily: B, fontWeight: 400, fontSize: 30, color: '#6f6f6f', marginTop: 6}}>{sub}</div>
      </div>
      {done && <Check size={64} draw={sp(t, at + 0.7)} />}
    </div>
  );
};

const S6: React.FC = () => (
  <Center top={250} bottom={400} gap={34}>
    <Reveal at={52.2}>
      <Words text="Never miss *out.*" at={52.2} size={96} color="#fff" hero="#f2c6f2" />
    </Reveal>
    <Notif at={52.7} tag="WE NOTIFY YOU" title="New: BOI GLOW" sub="A fresh opportunity just opened" icon="bell" />
    <Notif at={55.7} tag="WE UPDATE" title="Documents stack ready" sub="Plan, pitch, deck and page refreshed" icon="files" done />
    <Notif at={57.3} tag="WE APPLY" title="Application submitted" sub="You do not miss the window" icon="send" done />
  </Center>
);

// ---------------------------------------------------------------- scene 7: pricing
const S7: React.FC = () => {
  const t = useT();
  const p = sp(t, 59.5, POP);
  return (
    <Center top={250} bottom={420} gap={20}>
      <Reveal at={59.3}>
        <div style={{fontFamily: B, fontWeight: 500, fontSize: 44, letterSpacing: 8, color: '#e7c4e7', textAlign: 'center'}}>PLANS START FROM</div>
      </Reveal>
      <div style={{opacity: Math.min(1, p * 1.5), transform: `scale(${0.9 + 0.1 * p})`, textAlign: 'center'}}>
        <div style={{fontFamily: F, fontWeight: 800, fontSize: 210, lineHeight: 1, color: '#fff'}}>₦10,000</div>
        <div style={{fontFamily: F, fontWeight: 600, fontSize: 70, color: '#e59be5', marginTop: 6}}>a month</div>
      </div>
    </Center>
  );
};

// ---------------------------------------------------------------- scene 8: CTA
const S8: React.FC = () => {
  const t = useT();
  const lp = sp(t, 62.4, SOFT);
  const cta = sp(t, 66.8, POP);
  const pulse = t > 67.8 ? 1 + Math.sin((t - 67.8) * 3.2) * 0.025 : 1;
  return (
    <AbsoluteFill style={{padding: '170px 72px 380px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 36}}>
      <div style={{opacity: Math.min(1, lp * 1.5), transform: `translateY(${(1 - lp) * 50}px) scale(${0.92 + 0.08 * lp})`}}>
        <Img src={staticFile('manetrust/logo.png')} style={{width: 470, height: 627, display: 'block'}} />
      </div>
      <Words text="Let’s open your business to *more opportunities* today." at={62.9} size={66} per={0.2} />
      <div
        style={{
          marginTop: 12,
          background: C.purple,
          color: '#fff',
          borderRadius: 80,
          padding: '28px 90px',
          fontFamily: F,
          fontWeight: 800,
          fontSize: 88,
          boxShadow: '0 24px 60px rgba(128,0,128,0.45)',
          opacity: Math.min(1, cta * 1.5),
          transform: `scale(${(0.8 + 0.2 * cta) * pulse})`,
        }}
      >
        DM us.
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- captions
const PHRASES: [number, number, string][] = [
  [0.64, 2.5, 'There are 3 kinds of women;'],
  [3.4, 8.3, 'the ones who saw the BOI guaranteed loans for women and planned to apply,'],
  [9.3, 11.6, 'the ones who actually applied'],
  [12.2, 14.9, 'and the ones who do not even know it existed.'],
  [15.9, 16.7, 'Which one are you?'],
  [17.8, 23.1, 'Are you the type that tried to prepare your business plan and documents and got overwhelmed midway?'],
  [24.0, 30.0, 'The one who completed her documents and applied for up to 50 million to grow her business?'],
  [30.8, 38.5, 'Or the one still struggling with high interest options when a “7% per year” option has been available for you?'],
  [39.5, 40.65, 'We make it simple.'],
  [41.4, 42.75, 'We will prepare your plan,'],
  [43.3, 44.6, 'your executive pitch,'],
  [45.1, 46.5, 'your presentation decks,'],
  [46.9, 47.8, 'a pitch page'],
  [48.2, 51.4, 'and even a 1 minute video pitch for your business.'],
  [52.4, 55.4, 'Any opportunities like the BOI GLOW that come up, we notify you,'],
  [55.8, 56.95, 'update your documents stack'],
  [57.4, 58.95, 'and apply so you do not miss out.'],
  [59.3, 61.4, 'Our plans start from just 10,000 a month.'],
  [62.1, 66.0, 'Let’s open your business to more opportunities today.'],
  [66.8, 69.8, 'DM us.'],
];

const CHUNKS: [number, number, string][] = PHRASES.flatMap(([s, e, text]) => {
  const words = text.split(' ');
  const n = Math.max(1, Math.ceil(words.length / 5));
  const per = Math.ceil(words.length / n);
  const groups: string[] = [];
  for (let i = 0; i < words.length; i += per) groups.push(words.slice(i, i + per).join(' '));
  const total = groups.reduce((a, g) => a + g.length, 0);
  let cur = s;
  return groups.map((g) => {
    const d = ((e - s) * g.length) / total;
    const r: [number, number, string] = [cur, cur + d, g];
    cur += d;
    return r;
  });
});

const DARK_RANGES: [number, number][] = [
  [30.4, 39.2],
  [52.0, 62.0],
];

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const c = CHUNKS.find(([s, e]) => t >= s - 0.05 && t < e + 0.12);
  if (!c) return null;
  const [s, e, text] = c;
  const o = interpolate(t, [s, s + 0.25, e - 0.1, e + 0.12], [0, 1, 1, 0], clamp);
  const dark = DARK_RANGES.some(([a, b]) => t >= a && t < b);
  return (
    <div style={{position: 'absolute', left: 90, right: 90, bottom: 330, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * 14}px)`}}>
      <div
        style={{
          fontFamily: F,
          fontWeight: 600,
          fontSize: 50,
          lineHeight: 1.18,
          textAlign: 'center',
          color: dark ? '#fff' : C.ink,
          background: dark ? 'rgba(20,0,20,0.42)' : 'rgba(255,255,255,0.72)',
          padding: '14px 34px',
          borderRadius: 30,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- audio
const SFX: [number, 'whoosh' | 'pop' | 'tick' | 'thump', number][] = [
  [0.7, 'whoosh', 0.25],
  [3.4, 'pop', 0.35],
  [9.3, 'pop', 0.35],
  [12.2, 'pop', 0.35],
  [15.7, 'whoosh', 0.25],
  [17.9, 'whoosh', 0.2],
  [18.4, 'pop', 0.3],
  [19.5, 'pop', 0.3],
  [20.6, 'pop', 0.3],
  [21.7, 'pop', 0.3],
  [23.6, 'whoosh', 0.25],
  [25.0, 'tick', 0.2],
  [25.6, 'tick', 0.2],
  [26.2, 'tick', 0.2],
  [26.8, 'tick', 0.2],
  [28.2, 'pop', 0.4],
  [30.4, 'whoosh', 0.25],
  [32.2, 'whoosh', 0.2],
  [35.3, 'thump', 0.4],
  [39.4, 'whoosh', 0.3],
  [41.3, 'whoosh', 0.22],
  [43.2, 'whoosh', 0.22],
  [45.0, 'whoosh', 0.22],
  [46.8, 'whoosh', 0.22],
  [48.2, 'whoosh', 0.22],
  [50.2, 'whoosh', 0.28],
  [52.0, 'whoosh', 0.25],
  [52.7, 'pop', 0.4],
  [55.7, 'pop', 0.4],
  [57.3, 'pop', 0.4],
  [59.1, 'whoosh', 0.25],
  [59.6, 'thump', 0.4],
  [62.0, 'whoosh', 0.25],
  [62.5, 'pop', 0.3],
  [66.9, 'thump', 0.45],
];

const bgmVolume = (f: number) => {
  const t = f / FPS;
  const fadeIn = interpolate(t, [0, 1.6], [0, 1], clamp);
  const fadeOut = interpolate(t, [69.5, 73], [1, 0], clamp);
  // 12 dB under the voiceover while it speaks; slightly lifted for the first and last seconds
  const lift = interpolate(t, [0, 0.6, 1.4], [1.5, 1.5, 1], clamp);
  return 0.1 * fadeIn * fadeOut * lift;
};

// ---------------------------------------------------------------- composition
export const ManetrustVideo: React.FC = () => (
  <AbsoluteFill style={{background: '#eee'}}>
    <Audio src={staticFile('manetrust/bgm.mp3')} volume={bgmVolume} />
    <Audio src={staticFile('manetrust/vo-norm.wav')} volume={1} />
    {SFX.map(([t, name, v], i) => (
      <Sequence key={i} from={Math.max(0, Math.round(t * FPS) - 3)}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
      </Sequence>
    ))}
    <Scene start={0} end={15.4} bg="cream" first>
      <S1 />
    </Scene>
    <Scene start={15.4} end={23.6} bg="lilac">
      <S2 />
    </Scene>
    <Scene start={23.6} end={30.5} bg="cream">
      <S3 />
    </Scene>
    <Scene start={30.5} end={39.2} bg="charcoal" dark>
      <S4 />
    </Scene>
    <Scene start={39.2} end={52.0} bg="cream">
      <S5 />
    </Scene>
    <Scene start={52.0} end={59.1} bg="purple" dark>
      <S6 />
    </Scene>
    <Scene start={59.1} end={62.0} bg="charcoal" dark>
      <S7 />
    </Scene>
    <Scene start={62.0} end={MT_SECONDS} bg="cream" last brand={false}>
      <S8 />
    </Scene>
    <Captions />
  </AbsoluteFill>
);
