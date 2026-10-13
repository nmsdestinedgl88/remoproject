import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {BgMesh, Grade, Grain, Vignette} from './Layers';
import {Flywheel, Gap, Guardrails, Hook, Outro, Payoff, Unlock, Why} from './scenes';

// [component, seconds]; total = 60s
const SCENES: [React.FC, number][] = [
  [Hook, 7],
  [Gap, 8],
  [Why, 7],
  [Unlock, 9],
  [Payoff, 8],
  [Flywheel, 9],
  [Guardrails, 6],
  [Outro, 6],
];

export const CREDIT_SECONDS = SCENES.reduce((a, [, s]) => a + s, 0);

export const CreditVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill>
      <BgMesh />
      <Audio src={staticFile('sfx/pad.wav')} volume={0.22} />
      {SCENES.map(([C, s], i) => {
        const dur = s * fps;
        const el = (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <C />
          </Sequence>
        );
        from += dur;
        return el;
      })}
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
