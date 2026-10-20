import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, theme, W, clampX } from "./theme";
import { SCENES, TOTAL } from "./timing";
import { Fonts, SceneProvider } from "./components/common";
import { Hook, Buy, Rev, Gold } from "./scenes/A";

const f = (s: number) => Math.round(s * FPS);

const registry: Record<string, React.FC> = { hook: Hook, buy: Buy, rev: Rev, gold: Gold };
import * as B from "./scenes/B";
import * as C from "./scenes/C";
import * as D from "./scenes/D";
Object.assign(registry, B.scenes, C.scenes, D.scenes);

const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 13], [0, 1], { ...clampX, easing: theme.ease.inOut });
  const x = interpolate(p, [0, 1], [-W - 260, W + 260]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, bottom: -40, width: W + 220, left: x, background: theme.colors.blue, transform: "skewX(-9deg)", boxShadow: "0 0 80px rgba(0,40,200,0.45)" }}>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 16, background: "rgba(255,255,255,0.85)" }} />
      </div>
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const entries = Object.entries(SCENES) as [string, readonly [number, number]][];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Fonts />
      {entries.map(([name, [s, e]]) => {
        const Scene = registry[name];
        if (!Scene) return null;
        return (
          <Sequence key={name} from={f(s)} durationInFrames={f(e) - f(s)} name={name}>
            <SceneProvider value={{ start: s, end: e }}>
              <Scene />
            </SceneProvider>
          </Sequence>
        );
      })}
      {entries.slice(1).map(([name, [s]]) => (
        <Sequence key={"w" + name} from={f(s) - 7} durationInFrames={14} name={"wipe-" + name}>
          <Wipe />
        </Sequence>
      ))}
      <Audio src={staticFile("vo.mp3")} volume={1} />
      <Audio src={staticFile("sfx/mix.wav")} volume={0.9} />
    </AbsoluteFill>
  );
};
export const TOTAL_FRAMES = f(TOTAL);
