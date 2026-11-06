import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from './theme';
import {S1, S10, S11, S12, S13, S14, S2, S3, S4, S5, S6, S7, S8, S9} from './scenes';

export const ELIAKIM_SECONDS = 60;

// [start s, length s, component]. Hard cuts; backgrounds never repeat in a row:
// W N G W N Grey W G N W G Grey W N
const SCENES: [number, number, React.FC][] = [
  [0, 4, S1],
  [4, 4, S2],
  [8, 3, S3],
  [11, 4, S4],
  [15, 8, S5],
  [23, 3, S6],
  [26, 6, S7],
  [32, 5, S8],
  [37, 3, S9],
  [40, 6, S10],
  [46, 4, S11],
  [50, 3, S12],
  [53, 4, S13],
  [57, 3, S14],
];

// All dull, low-passed effects from scripts/gen-sfx-eliakim.mjs. [time s, file, volume]
const SFX: [number, string, number][] = [
  [0.05, 'swell', 0.5],
  [4.1, 'thud', 0.6],
  [8.1, 'tick', 0.6],
  [11.0, 'whoosh', 0.5],
  [14.0, 'riser', 0.5],
  [15.45, 'thud', 0.8],
  [23.1, 'tick', 0.6],
  [26.0, 'whoosh', 0.5],
  [32.1, 'tick', 0.6],
  [37.1, 'tick', 0.6],
  [40.0, 'whoosh', 0.5],
  [46.1, 'tick', 0.6],
  [50.0, 'whoosh', 0.5],
  [53.1, 'tick', 0.6],
  [57.1, 'swell', 0.5],
  [57.35, 'chime', 0.6],
];

export type EliakimProps = {
  /** Optional voiceover file in public/ (e.g. "audio/voiceover.mp3"). Music ducks under it. */
  voiceover?: string;
};

export const EliakimVideo: React.FC<EliakimProps> = ({voiceover}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const base = voiceover ? 0.26 : 0.5; // about -22 LUFS under voice, about -16 LUFS alone
  const music = (f: number) =>
    base *
    interpolate(f, [0, fps], [0, 1], {extrapolateRight: 'clamp'}) *
    interpolate(f, [durationInFrames - 3 * fps, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});
  const fadeOut = interpolate(frame, [durationInFrames - Math.round(0.4 * fps), durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{background: colors.navy}}>
      {SCENES.map(([start, len, Scene], i) => (
        <Sequence key={i} from={Math.round(start * fps)} durationInFrames={Math.round(len * fps)} name={`S${i + 1}`}>
          <Scene />
        </Sequence>
      ))}
      <AbsoluteFill style={{background: colors.navyDeep, opacity: fadeOut, pointerEvents: 'none'}} />
      <Audio src={staticFile('audio/bgm-60.mp3')} volume={music} />
      {SFX.map(([t, name, vol], i) => (
        <Sequence key={i} from={Math.round(t * fps)}>
          <Audio src={staticFile(`sfx/eliakim-${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      {voiceover ? <Audio src={staticFile(voiceover)} volume={1} /> : null}
    </AbsoluteFill>
  );
};
