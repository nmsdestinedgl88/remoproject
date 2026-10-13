import React from 'react';
import {Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Seconds -> frames helper. */
export const useSec = () => {
  const {fps} = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};

/** Fade + rise + scale, spring-driven. `delay` is in seconds. */
export const Entrance: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  config?: typeof theme.spring.smooth | typeof theme.spring.snappy | typeof theme.spring.bouncy;
}> = ({delay = 0, children, style, config = theme.spring.smooth}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - Math.round(delay * fps), fps, config});
  return (
    <div
      style={{
        opacity: Math.min(1, p),
        transform: `translateY(${interpolate(p, [0, 1], [48, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Word-by-word headline. Words wrapped in *stars* use the hero colour. */
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({text, delay = 0, size = 104, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const per = Math.round(fps * 0.1);
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: Math.round(size * 0.26),
        rowGap: Math.round(size * 0.04),
        fontFamily: theme.fonts.display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        color: theme.colors.text,
        ...style,
      }}
    >
      {text.split(' ').map((raw, i) => {
        const hero = raw.startsWith('*');
        const word = raw.replace(/\*/g, '');
        const p = spring({frame: frame - Math.round(delay * fps) - i * per, fps, config: theme.spring.snappy});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: Math.min(1, p),
              transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px)`,
              color: hero ? theme.colors.primary : undefined,
              textShadow: hero ? `0 0 50px ${theme.colors.glow}` : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const Kicker: React.FC<{children: string; delay?: number}> = ({children, delay = 0}) => (
  <Entrance delay={delay}>
    <div
      style={{
        fontFamily: theme.fonts.body,
        fontWeight: 500,
        fontSize: 36,
        letterSpacing: 10,
        color: theme.colors.accent,
        marginBottom: 36,
      }}
    >
      {children}
    </div>
  </Entrance>
);

export const Body: React.FC<{children: React.ReactNode; delay?: number; size?: number}> = ({
  children,
  delay = 0,
  size = 48,
}) => (
  <Entrance delay={delay}>
    <div
      style={{
        fontFamily: theme.fonts.body,
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.35,
        color: theme.colors.textDim,
      }}
    >
      {children}
    </div>
  </Entrance>
);

/** Idle micro-motion for anything on screen > 2s. */
export const Breathe: React.FC<{children: React.ReactNode; phase?: number; style?: React.CSSProperties}> = ({
  children,
  phase = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + phase;
  return (
    <div style={{transform: `translateY(${Math.sin(t * 1.6) * 4}px) scale(${1 + Math.sin(t * 1.3) * 0.008})`, ...style}}>
      {children}
    </div>
  );
};

/** Scene wrapper: content in the 9:16 safe zone, quick exit over the last ~0.33s. */
export const SceneContent: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const exit = Math.round(fps / 3);
  const o = interpolate(frame, [durationInFrames - exit, durationInFrames - 2], [1, 0], {
    easing: theme.ease.in,
    ...clamp,
  });
  const y = interpolate(frame, [durationInFrames - exit, durationInFrames - 2], [0, -60], {
    easing: theme.ease.in,
    ...clamp,
  });
  const s = interpolate(frame, [durationInFrames - exit, durationInFrames - 2], [1, 0.97], {
    easing: theme.ease.in,
    ...clamp,
  });
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '300px 84px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: o,
        transform: `translateY(${y}px) scale(${s})`,
      }}
    >
      {children}
    </div>
  );
};

/** SFX that starts a few frames before the visual lands. `at` is seconds into the scene. */
export const Sfx: React.FC<{src: string; at?: number; volume?: number}> = ({src, at = 0, volume = 0.6}) => {
  const {fps} = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps) - 3)}>
      <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
    </Sequence>
  );
};
