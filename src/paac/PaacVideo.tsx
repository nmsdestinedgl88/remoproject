import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  Img,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring as rspring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* ------------------------------------------------------------------ theme */
const C = {
  red: '#BE0F08',
  deepRed: '#6E0805',
  white: '#FFFFFF',
  gold: '#FBC21B',
  paper: '#FDFDFD', // the intro clip's own background colour
};
const F = {
  caps: 'BebasNeue, Impact, sans-serif',
  body: 'Inter, Helvetica, Arial, sans-serif',
};
const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};
const SPR = {smooth: {damping: 30, stiffness: 120, mass: 0.9}, snappy: {damping: 28, stiffness: 200, mass: 0.7}};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

if (typeof document !== 'undefined') {
  const h = delayRender('paac-fonts');
  Promise.all(
    [
      ['BebasNeue', '400', 'fonts/bebas-neue-latin-400-normal.woff2'],
      ['Inter', '600', 'fonts/inter-latin-600-normal.woff2'],
    ].map(([family, weight, file]) =>
      new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight}).load().then((f) => {
        (document.fonts as unknown as {add(f: FontFace): void}).add(f);
      }),
    ),
  )
    .catch((e) => console.error('font load failed', e))
    .finally(() => continueRender(h));
}

/* ----------------------------------------------------------------- timing */
export const PAAC_SECONDS = 50;
const T = {
  introEnd: 4.0, // trimmed intro: first 4 s of the source
  reveal: [3.7, 4.6] as const, // red background circle-reveals out of the logo
  voStart: 7.0, // Lumumba voiceover (source 13 s to 40 s, 27 s long)
  voLen: 27,
  phases: [4.8, 10.5, 17.5, 24.0, 30.5, 37.0], // text phase start times, last = end
  poster: [36.4, 37.2, 46.0] as const, // dissolve start, dissolve end, settle end
};

const useSec = () => {
  const {fps} = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};

/* ---------------------------------------------------------------- helpers */
const useP = (delay = 0, config = SPR.smooth) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return rspring({frame: frame - Math.round(delay * fps), fps, config});
};

/** Slides children up (or in from a side) out of a mask. */
const Mask: React.FC<{delay?: number; from?: 'bottom' | 'left' | 'right'; children: React.ReactNode; style?: React.CSSProperties}> = ({
  delay = 0,
  from = 'bottom',
  children,
  style,
}) => {
  const p = useP(delay, SPR.snappy);
  const off = (1 - p) * 110;
  const tf = from === 'bottom' ? `translateY(${off}%)` : from === 'left' ? `translateX(${-off}%)` : `translateX(${off}%)`;
  return (
    <div style={{overflow: 'hidden', padding: '0.04em 0.1em', margin: '-0.04em -0.1em', ...style}}>
      <div style={{transform: tf}}>{children}</div>
    </div>
  );
};

/** A digit that rolls like a counter reel and lands on `digit`. */
const DigitRoll: React.FC<{digit: number; delay?: number; size: number; color?: string}> = ({digit, delay = 0, size, color = C.gold}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reel = [(digit + 3) % 10, (digit + 5) % 10, (digit + 7) % 10, (digit + 9) % 10, digit];
  const p = interpolate(frame - Math.round(delay * fps), [0, Math.round(0.9 * fps)], [0, 1], {...clamp, easing: ease.out});
  const h = size * 0.86;
  return (
    <div style={{height: h, overflow: 'hidden', fontFamily: F.caps, fontSize: size, lineHeight: `${h}px`, color, display: 'inline-block'}}>
      <div style={{transform: `translateY(${-p * (reel.length - 1) * h}px)`}}>
        {reel.map((d, i) => (
          <div key={i} style={{height: h}}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Wrapper: fades and lifts a phase out over its last 0.35 s. */
const Phase: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = interpolate(frame, [Math.round((len - 0.35) * fps), Math.round(len * fps)], [0, 1], {...clamp, easing: ease.in});
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1 - e,
        transform: `translateY(${-70 * e}px)`,
        filter: `blur(${e * 8}px)`,
        textShadow: '0 10px 36px rgba(70,0,0,0.38)',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Bar: React.FC<{delay: number; width: number; color?: string; y?: number}> = ({delay, width, color = C.gold}) => {
  const p = useP(delay, SPR.smooth);
  return <div style={{height: 10, width: width * p, background: color, borderRadius: 5}} />;
};

/* ----------------------------------------------------------------- phases */
// 1. JOIN US AT THE: focus-pull with tracking that tightens
const Join: React.FC = () => {
  const lines = ['JOIN US', 'AT THE'];
  return (
    <div style={{textAlign: 'center'}}>
      {lines.map((l, i) => {
        const p = useP(0.15 + i * 0.35, SPR.smooth);
        return (
          <div
            key={l}
            style={{
              fontFamily: F.caps,
              fontSize: i === 0 ? 210 : 150,
              lineHeight: 1,
              color: C.white,
              letterSpacing: `${interpolate(p, [0, 1], [0.9, 0.08])}em`,
              opacity: Math.min(1, p * 1.5),
              filter: `blur(${interpolate(p, [0, 1], [18, 0])}px)`,
              transform: `scale(${interpolate(p, [0, 1], [1.12, 1])})`,
            }}
          >
            {l}
          </div>
        );
      })}
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
        <Bar delay={1.0} width={300} />
      </div>
    </div>
  );
};

// 2. PAN-AFRICAN AWAKENING CONFERENCE 2026: stacked mask reveals, 2026 rolls in gold
const Title: React.FC = () => {
  const lines = ['PAN-AFRICAN', 'AWAKENING', 'CONFERENCE'];
  return (
    <div style={{textAlign: 'center'}}>
      {lines.map((l, i) => (
        <Mask key={l} delay={0.15 + i * 0.2}>
          <div style={{fontFamily: F.caps, fontSize: 215, lineHeight: 0.92, color: C.white, letterSpacing: '0.01em'}}>{l}</div>
        </Mask>
      ))}
      <div style={{display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14}}>
        {[2, 0, 2, 6].map((d, i) => (
          <DigitRoll key={i} digit={d} delay={1.0 + i * 0.12} size={250} />
        ))}
      </div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
        <Bar delay={1.8} width={520} />
      </div>
    </div>
  );
};

const Counter: React.FC<{n: number; words: React.ReactNode}> = ({n, words}) => (
  <div style={{textAlign: 'center'}}>
    <DigitRoll digit={n} delay={0.15} size={560} />
    <div style={{display: 'flex', justifyContent: 'center', margin: '4px 0 18px'}}>
      <Bar delay={0.9} width={340} />
    </div>
    {words}
  </div>
);

// 3. 1 KEYNOTE SPEAKER: lines slide in from the right
const Keynote: React.FC = () => (
  <Counter
    n={1}
    words={['KEYNOTE', 'SPEAKER'].map((l, i) => (
      <Mask key={l} from="right" delay={0.7 + i * 0.18}>
        <div style={{fontFamily: F.caps, fontSize: 215, lineHeight: 0.95, color: C.white, letterSpacing: '0.02em'}}>{l}</div>
      </Mask>
    ))}
  />
);

// 4. 2 PAPER PRESENTATIONS: words converge from opposite sides
const Papers: React.FC = () => (
  <Counter
    n={2}
    words={['PAPER', 'PRESENTATIONS'].map((l, i) => (
      <Mask key={l} from={i === 0 ? 'left' : 'right'} delay={0.7 + i * 0.2}>
        <div style={{fontFamily: F.caps, fontSize: i === 0 ? 215 : 160, lineHeight: 0.98, color: C.white, letterSpacing: '0.02em'}}>{l}</div>
      </Mask>
    ))}
  />
);

// 5. 2 PANEL SESSIONS ON THE THEME: staggered pop, highlighter wipe behind THEME
const Panels: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bar = interpolate(frame - Math.round(1.7 * fps), [0, Math.round(0.45 * fps)], [0, 1], {...clamp, easing: ease.out});
  const pop = (delay: number) => {
    const p = rspring({frame: frame - Math.round(delay * fps), fps, config: SPR.snappy});
    return {opacity: Math.min(1, p * 1.5), transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`};
  };
  return (
    <Counter
      n={2}
      words={
        <>
          <div style={{display: 'flex', justifyContent: 'center', gap: 28, fontFamily: F.caps, fontSize: 190, lineHeight: 0.98, color: C.white}}>
            <span style={pop(0.7)}>PANEL</span>
            <span style={pop(0.85)}>SESSIONS</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, marginTop: 6, fontFamily: F.caps, fontSize: 150, lineHeight: 1, color: C.white}}>
            <span style={pop(1.1)}>ON THE</span>
            <span style={{position: 'relative', isolation: 'isolate', padding: '0 0.14em', color: C.deepRed, ...pop(1.25)}}>
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '10%',
                  bottom: '4%',
                  background: C.gold,
                  transformOrigin: 'left center',
                  transform: `scaleX(${bar})`,
                  zIndex: -1,
                }}
              />
              THEME
            </span>
          </div>
        </>
      }
    />
  );
};

/* ------------------------------------------------------------- background */
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSec();
  const t = frame / fps;
  const scale = 1.08 + 0.05 * Math.sin(t / 7);
  const sweep = ((t * 90) % 2400) - 700;
  return (
    <AbsoluteFill style={{background: C.red, overflow: 'hidden'}}>
      <Img
        src={staticFile('paac/bg.png')}
        style={{width: '100%', height: '100%', transform: `scale(${scale}) translate(${Math.sin(t / 5) * 18}px, ${Math.cos(t / 6) * 14}px)`}}
      />
      {/* slow light sweep, keeps the red field alive */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: sweep,
          width: 520,
          height: 1900,
          transform: 'rotate(18deg)',
          background: 'linear-gradient(90deg, transparent, rgba(255,120,90,0.16), transparent)',
          filter: 'blur(30px)',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(60,0,0,0.38) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------- main */
export const PaacVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const s = useSec();

  // circle reveal of the red field out of the logo
  const rp = interpolate(frame, [s(T.reveal[0]), s(T.reveal[1])], [0, 1], {...clamp, easing: ease.inOut});
  const radius = rp * Math.hypot(width, height) * 0.62;

  // poster dissolve then slow settle to the exact final frame
  const dissolve = interpolate(frame, [s(T.poster[0]), s(T.poster[1])], [0, 1], {...clamp, easing: ease.out});
  const settle = interpolate(frame, [s(T.poster[0]), s(T.poster[2])], [1.05, 1], {...clamp, easing: ease.out});

  const vid = {width, height: Math.round((width / 608) * 480), position: 'absolute', left: 0, top: Math.round((height - (width / 608) * 480) / 2)} as const;

  return (
    <AbsoluteFill style={{background: C.paper}}>
      {/* 1. intro: first 4 s of the source, original audio */}
      <Sequence from={0} durationInFrames={s(T.introEnd)}>
        <OffthreadVideo src={staticFile('paac/intro.mp4')} style={vid} />
      </Sequence>
      <Sequence from={s(T.introEnd)} durationInFrames={s(0.9)}>
        <Freeze frame={s(T.introEnd) - 2}>
          <OffthreadVideo src={staticFile('paac/intro.mp4')} muted style={vid} />
        </Freeze>
      </Sequence>

      {/* 2. base background from source second 44 */}
      {frame >= s(T.reveal[0]) && (
        <AbsoluteFill style={{clipPath: `circle(${radius}px at 50% 50%)`}}>
          <Background />
        </AbsoluteFill>
      )}

      {/* 3. motion typography */}
      {[Join, Title, Keynote, Papers, Panels].map((Comp, i) => {
        const from = s(T.phases[i]);
        const len = T.phases[i + 1] - T.phases[i];
        return (
          <Sequence key={i} from={from} durationInFrames={s(len)} name={`T${i + 1}`}>
            <Phase len={len}>
              <Comp />
            </Phase>
          </Sequence>
        );
      })}

      {/* 4. final frame: source second 60 */}
      {frame >= s(T.poster[0]) && (
        <AbsoluteFill style={{opacity: dissolve, background: C.red}}>
          <Img src={staticFile('paac/final.png')} style={{width: '100%', height: '100%', transform: `scale(${settle})`}} />
        </AbsoluteFill>
      )}

      {/* audio: intro audio comes from the video above; Lumumba voiceover from source 13 s to 40 s */}
      <Sequence from={s(T.voStart)} durationInFrames={s(T.voLen)}>
        <Audio src={staticFile('paac/vo.wav')} volume={1.4} />
      </Sequence>
    </AbsoluteFill>
  );
};
