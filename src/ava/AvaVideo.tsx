import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {S1, S2, S3, S4, S5, S6, S7, S8} from './scenes';
import {Captions, Grain, IconSprite, Wipes} from './ui';
import {SCENES, TOTAL_SECONDS, WIPES, WIPE_HALF} from './cues';

export const AVA_SECONDS = TOTAL_SECONDS;

// Quiet cues: a whoosh under each wipe and a tick as the phone number lands.
const TICKS = [46.72, 48.16, 49.09];

export const AvaVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  const at = (s: number) => Math.round(s * fps);
  return (
    <AbsoluteFill style={{background: '#F3EFE6'}}>
      <IconSprite />
      <Audio src={staticFile('ava/voiceover.wav')} />
      {WIPES.map((w) => (
        <Sequence key={w} from={at(w - WIPE_HALF)} durationInFrames={at(1)}>
          <Audio src={staticFile('sfx/whoosh.wav')} volume={0.28} />
        </Sequence>
      ))}
      {TICKS.map((s) => (
        <Sequence key={s} from={at(s)} durationInFrames={at(0.5)}>
          <Audio src={staticFile('sfx/tick.wav')} volume={0.3} />
        </Sequence>
      ))}
      <Sequence from={at(31.45)} durationInFrames={at(1)}>
        <Audio src={staticFile('sfx/thump.wav')} volume={0.3} />
      </Sequence>
      <S1 />
      <S2 />
      <S3 />
      <S4 />
      <S5 />
      <S6 />
      <S7 />
      <S8 />
      <Captions />
      <Wipes />
      <Grain />
    </AbsoluteFill>
  );
};
void SCENES;
