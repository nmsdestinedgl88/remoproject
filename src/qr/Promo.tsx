import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Background, CornerMark, StatusCtx, FPS, H, INK, W, clamp01, prog} from './base';
import {END, HIDE_MARK, MODES, SCENE_COMPONENTS, STARTS} from './scenes';
import {random} from 'remotion';

export const QR_SECONDS = END;
export const QR_FRAMES = Math.round(END * FPS) + 1; // 1457

const HALF = 0.175; // mosaic is 0.35 s, centred on the sentence start
const COLS = 22;
const ROWS = 40;

// taps that give a 4% push-in
const PUSHES = [31.0, 35.55];

const revealed = (p: number, thr: number) => p * 1.2 > thr;

const mosaic = (p: number, seed: string) => {
  const cw = W / COLS;
  const ch = H / ROWS;
  let d = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (revealed(p, random(`${seed}-m-${r}-${c}`))) {
        d += `M${(c * cw).toFixed(1)} ${(r * ch).toFixed(1)}h${(cw + 0.8).toFixed(1)}v${(ch + 0.8).toFixed(1)}h-${(cw + 0.8).toFixed(1)}z`;
      }
    }
  }
  return d;
};

const sfx = (name: string, at: number, volume: number) => (
  <Sequence key={`${name}-${at}`} from={Math.max(0, Math.round(at * FPS))}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const QuickreachPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;

  const push = PUSHES.reduce((a, t) => {
    const d = T - t;
    if (d < -0.02 || d > 0.4) return a;
    return Math.max(a, d < 0.08 ? 0.04 * clamp01((d + 0.02) / 0.1) : 0.04 * (1 - (d - 0.08) / 0.32));
  }, 0);

  const sfxEls: React.ReactNode[] = [];
  for (let i = 1; i < STARTS.length; i++) sfxEls.push(sfx('whoosh', STARTS[i] - HALF, 0.1));
  [0.55, 1.1, 5.0, 13.9, 26.95, 29.0, 33.0, 33.4, 40.5, 40.7, 40.9, 41.1, 41.3, 43.0, 45.9].forEach((t) => sfxEls.push(sfx('pop', t, 0.11)));
  [31.0, 35.55].forEach((t) => sfxEls.push(sfx('tick', t, 0.13)));
  for (let i = 0; i < 15; i += 2) sfxEls.push(sfx('tick', 35.65 + i * 0.04, 0.09));

  return (
    <AbsoluteFill style={{background: INK}}>
      {SCENE_COMPONENTS.map((C, i) => {
        const start = STARTS[i];
        const end = i + 1 < STARTS.length ? STARTS[i + 1] : END;
        if (T < start - HALF - 0.001 || T > end + HALF + 0.001) return null;
        const mode = MODES[i];
        const p = i === 0 ? 1 : prog(T, start - HALF, 2 * HALF);
        const done = p >= 1;
        const m = done ? '' : mosaic(p, `s${i}`);
        const d = done ? undefined : m ? `path("${m}")` : 'polygon(0 0, 0 0, 0 0)';
        const zoom = 1 + 0.03 * clamp01((T - start) / (end - start)) + push;
        return (
          <AbsoluteFill key={i} style={{clipPath: d, WebkitClipPath: d, zIndex: i}}>
            <Background T={T} mode={mode} seed={`bg${i}`} spotlight={i !== 7} />
            <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 45%'}}>
              <C T={T} />
            </AbsoluteFill>
            {HIDE_MARK.has(i) ? null : <CornerMark mode={mode} />}
          </AbsoluteFill>
        );
      })}
      {/* 0.3 s fade-in */}
      <AbsoluteFill style={{background: INK, opacity: 1 - clamp01(T / 0.3), zIndex: 100, pointerEvents: 'none'}} />
      <Audio src={staticFile('qr/voiceover.wav')} />
      {sfxEls}
    </AbsoluteFill>
  );
};

export const QuickreachStatus: React.FC = () => (
  <StatusCtx.Provider value={true}>
    <QuickreachPromo />
  </StatusCtx.Provider>
);
