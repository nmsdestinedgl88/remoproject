import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const scale = spring({frame, fps, config: {damping: 12}});
  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0]);
  const subtitleY = interpolate(frame, [15, 45], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0b1d3a, #1f4e9c)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Helvetica, Arial, sans-serif',
        color: 'white',
      }}
    >
      <h1 style={{fontSize: 160, margin: 0, opacity, transform: `scale(${scale})`}}>
        Hello, Remotion
      </h1>
      <p
        style={{
          fontSize: 56,
          margin: 0,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        Built by hand
      </p>
    </AbsoluteFill>
  );
};
