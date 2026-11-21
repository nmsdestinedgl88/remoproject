import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {theme} from '../theme';

// ---------- console ad theme ----------
const C = {
  ink: '#0B0714',
  glass: 'rgba(20, 12, 40, 0.62)',
  glassLine: 'rgba(255,255,255,0.22)',
  text: '#F7F3FF',
  textDim: 'rgba(247,243,255,0.68)',
  flash: '#F2E9FF',
};

type Seg = {
  src: string;
  from: number; // start frame in the source clip
  srcFrames: number; // source frames used
  frames: number; // output frames this segment fills
  zoom?: number;
  origin?: string;
  orbit?: boolean;
  sfx?: boolean;
};

// Output timeline @30fps, locked to the voiceover phrases (1272 frames = 42.4s).
const SEGS: Seg[] = [
  {src: 'b.mp4', from: 0, srcFrames: 108, frames: 108}, //  0.0-3.6  "Give your kids over 30,000 games this Christmas"
  {src: 's3.mp4', from: 0, srcFrames: 105, frames: 105, sfx: true}, //  3.6-7.1  "Yes, you read that right"
  {src: 'c.mp4', from: 0, srcFrames: 150, frames: 173, orbit: true, sfx: true}, //  7.1-12.9 "...pre-loaded with decades of games" + emulator orbit
  {src: 's2.mp4', from: 0, srcFrames: 43, frames: 56, sfx: true}, // 12.9-18.0 "across every genre..."
  {src: 's1.mp4', from: 0, srcFrames: 30, frames: 39},
  {src: 'b.mp4', from: 90, srcFrames: 60, frames: 59, zoom: 1.35, origin: '50% 30%'},
  {src: 'a.mp4', from: 0, srcFrames: 150, frames: 215, sfx: true}, // 18.0-27.4 "lost in play... building skills"
  {src: 's2.mp4', from: 0, srcFrames: 43, frames: 67, zoom: 1.5, origin: '50% 40%'},
  {src: 's3.mp4', from: 0, srcFrames: 105, frames: 108, zoom: 1.3, origin: '50% 35%', sfx: true}, // 27.4-31.0 "pocket-sized escape"
  {src: 'b.mp4', from: 0, srcFrames: 150, frames: 171, sfx: true}, // 31.0-36.7 "one gift... price"
  {src: 'c.mp4', from: 0, srcFrames: 150, frames: 171, orbit: true, sfx: true}, // 36.7-42.4 "keeps them playing..."
];
export const CONSOLE_FRAMES = SEGS.reduce((a, s) => a + s.frames, 0);

const SYSTEMS = [
  {code: 'PSP', name: 'PlayStation Portable', color: '#3D7BFF'},
  {code: 'N64', name: 'Nintendo 64', color: '#2EC27E'},
  {code: 'PS1', name: 'PlayStation', color: '#C9CEDB'},
  {code: 'GAMECUBE', name: 'Nintendo GameCube', color: '#9B6BFF'},
  {code: 'GBA', name: 'Game Boy Advance', color: '#FF8A3D'},
];

// ---------- orbit effect ----------
const Orbit: React.FC<{frames: number}> = ({frames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = frame / frames; // progress through the (dolly-in) clip
  // The console in the source clip sits at ~(51%, 45%) and grows 44% -> 79% of frame width.
  const cx = 1080 * 0.51;
  const cy = 1920 * 0.45;
  const rx = 330 + 40 * p;
  const ry = 150 + 40 * p;
  const tilt = -7; // deg
  const exit = interpolate(frame, [frames - 10, frames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const speed = interpolate(frame, [0, 40], [0.02, 0.058], {easing: theme.ease.out, extrapolateRight: 'clamp'});
  const spin = (speed * 0 + interpolate(frame, [0, 40, 1000], [0, 0.058 * 40 * 0.55, 0.058 * 40 * 0.55 + 0.058 * 960], {extrapolateRight: 'extend'})) || 0;
  const items = SYSTEMS.map((s, i) => {
    const enter = spring({frame: frame - 4 - i * 5, fps, config: theme.spring.bouncy});
    const th = spin + (i * Math.PI * 2) / SYSTEMS.length - Math.PI / 2;
    const depth = (Math.sin(th) + 1) / 2; // 1 = front
    const x = Math.cos(th) * rx * enter;
    const y = Math.sin(th) * ry * enter;
    return {s, x, y, depth, enter};
  });
  items.sort((a, b) => a.depth - b.depth);
  const ringDraw = interpolate(frame, [0, 24], [0, 1], {easing: theme.ease.out, extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: exit, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: cx, top: cy, width: 0, height: 0, transform: `rotate(${tilt}deg)`}}>
        <svg width={rx * 2 + 80} height={ry * 2 + 80} style={{position: 'absolute', left: -rx - 40, top: -ry - 40, overflow: 'visible'}}>
          <ellipse
            cx={rx + 40}
            cy={ry + 40}
            rx={rx}
            ry={ry}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={2}
            strokeDasharray="6 12"
            pathLength={1}
            style={{strokeDashoffset: 1 - ringDraw}}
            opacity={ringDraw}
          />
        </svg>
        {items.map(({s, x, y, depth, enter}) => {
          const sc = 1.25 * (0.62 + 0.5 * depth) * (0.6 + 0.4 * enter);
          return (
            <div
              key={s.code}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                zIndex: Math.round(depth * 100),
                opacity: (0.5 + 0.5 * depth) * enter,
                transform: `translate(-50%, -50%) rotate(${-tilt}deg) scale(${sc})`,
                filter: `blur(${(1 - depth) * 1.2}px)`,
              }}
            >
              <Badge code={s.code} name={s.name} color={s.color} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Badge: React.FC<{code: string; name: string; color: string}> = ({code, name, color}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 28px 16px 20px',
      borderRadius: 999,
      background: C.glass,
      border: `1.5px solid ${C.glassLine}`,
      boxShadow: `0 10px 40px rgba(0,0,0,0.45), 0 0 34px ${color}55`,
      backdropFilter: 'blur(10px)',
      whiteSpace: 'nowrap',
    }}
  >
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 999,
        background: color,
        boxShadow: `0 0 18px ${color}`,
      }}
    />
    <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1}}>
      <span style={{fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, letterSpacing: 1.5, color: C.text}}>{code}</span>
      <span style={{fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 19, marginTop: 6, color: C.textDim}}>{name}</span>
    </div>
  </div>
);

// ---------- layers ----------
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.16, pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={frame % 7} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 55%, rgba(8,4,18,0.55) 100%)', pointerEvents: 'none'}}
  />
);

// ---------- one footage segment ----------
const Clip: React.FC<{seg: Seg}> = ({seg}) => {
  const frame = useCurrentFrame();
  const rate = seg.srcFrames / seg.frames;
  const zoom = seg.zoom ?? 1;
  // cut punch: quick push-in settle + 3-frame flash
  const punch = interpolate(frame, [0, 12], [1.07, 1], {easing: theme.ease.out, extrapolateRight: 'clamp'});
  const flash = interpolate(frame, [0, 4], [0.35, 0], {extrapolateRight: 'clamp'});
  // slow breathing push so nothing sits static
  const drift = 1 + 0.025 * (frame / seg.frames);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill style={{transform: `scale(${zoom * punch * drift})`, transformOrigin: seg.origin ?? '50% 50%'}}>
        <OffthreadVideo
          src={staticFile(`console/${seg.src}`)}
          startFrom={seg.from}
          playbackRate={rate}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.06) saturate(1.1)'}}
        />
      </AbsoluteFill>
      {seg.orbit ? <Orbit frames={seg.frames} /> : null}
      <AbsoluteFill style={{background: C.flash, opacity: flash, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

export const ConsoleAd: React.FC = () => {
  const frame = useCurrentFrame();
  let t = 0;
  const seqs = SEGS.map((seg, i) => {
    const start = t;
    t += seg.frames;
    return (
      <Sequence key={i} from={start} durationInFrames={seg.frames}>
        <Clip seg={seg} />
        {seg.sfx ? <Audio src={staticFile('sfx/whoosh.wav')} volume={0.22} /> : null}
      </Sequence>
    );
  });
  const fade = interpolate(frame, [CONSOLE_FRAMES - 12, CONSOLE_FRAMES], [0, 1], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {seqs}
      <Vignette />
      <Grain />
      <AbsoluteFill style={{background: C.ink, opacity: fade}} />
      <Audio src={staticFile('console/vo.wav')} />
    </AbsoluteFill>
  );
};
