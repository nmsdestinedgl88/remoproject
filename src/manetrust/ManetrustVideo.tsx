import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Breathe, Entrance, Sfx} from '../credit/Motion';
import {BgPaper, Grade, Grain, Vignette, Watermark} from './Layers';
import {Captions, ChainTracker, Draw, SceneShell} from './parts';
import {HOOK_LINES, HOOK_SECONDS, OUTRO_LINES, OUTRO_SECONDS, STAGES, TOTAL_SECONDS} from './data';
import {ICONS, PALM, ring} from './icons';
import {mt} from './theme';

export const MT_SECONDS = TOTAL_SECONDS;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const pad2 = (n: number) => String(n).padStart(2, '0');

/** Words spring in one by one. */
const Title: React.FC<{text: string; delay?: number; size?: number; align?: 'left' | 'center'; heroWord?: number}> = ({
  text, delay = 0, size = 100, align = 'left', heroWord,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', columnGap: Math.round(size * 0.24), fontFamily: mt.fonts.display, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: '-0.03em', color: mt.colors.ink}}>
      {text.split(' ').map((w, i) => {
        const p = spring({frame: frame - Math.round(delay * fps) - i * 3, fps, config: mt.spring.snappy});
        return (
          <span key={i} style={{display: 'inline-block', opacity: Math.min(1, p), transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px)`, color: i === heroWord ? mt.colors.hero : undefined}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const VentureCard: React.FC<{index: number; name: string; kind: string; icon: keyof typeof ICONS; delay: number}> = ({index, name, kind, icon, delay}) => (
  <Entrance delay={delay} style={{width: 912, height: 126, boxSizing: 'border-box', borderRadius: 30, border: `2px solid ${mt.colors.cardLine}`, background: mt.colors.card, boxShadow: '0 24px 50px -24px rgba(47,59,45,0.35)', display: 'flex', alignItems: 'center', padding: '0 30px', gap: 28}}>
    <Draw paths={ICONS[icon]} size={86} delay={delay + 0.15} dur={1.0} width={2.8} />
    <div style={{flex: 1}}>
      <div style={{fontFamily: mt.fonts.body, fontWeight: 500, fontSize: 22, letterSpacing: 5, color: mt.colors.inkDim}}>{kind}</div>
      <div style={{fontFamily: mt.fonts.display, fontWeight: 800, fontSize: 42, lineHeight: 1.1, letterSpacing: '-0.02em', color: mt.colors.ink}}>{name}</div>
    </div>
    <div style={{fontFamily: mt.fonts.display, fontWeight: 800, fontSize: 54, color: mt.colors.sage, fontVariantNumeric: 'tabular-nums'}}>{pad2(index)}</div>
  </Entrance>
);

/** Large ring + stage glyph drawn on, with crosshairs; the whole panel gets a slow Ken Burns push. */
const StagePanel: React.FC<{icon: keyof typeof ICONS; size: number}> = ({icon, size}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.09], {easing: mt.ease.inOut});
  const marks = ['M20 220 H44 M32 208 V232', 'M396 220 H420 M408 208 V232', 'M220 20 V44 M208 32 H232', 'M220 396 V420 M208 408 H232'];
  return (
    <Breathe style={{width: size, height: size, margin: '0 auto'}}>
      <div style={{position: 'relative', width: size, height: size, transform: `scale(${scale})`}}>
        <Draw paths={[ring(220, 220, 196)]} size={size} viewBox="0 0 440 440" delay={0.2} dur={1.4} width={3} wash={false} wobble={2.2} style={{position: 'absolute', inset: 0}} />
        <Draw paths={marks} size={size} viewBox="0 0 440 440" delay={0.9} dur={0.9} width={2} wash={false} wobble={0.8} style={{position: 'absolute', inset: 0}} />
        <Draw paths={ICONS[icon]} size={size} viewBox="-28 -28 156 156" delay={0.5} dur={1.8} width={2.4} wobble={1.2} style={{position: 'absolute', inset: 0}} />
      </div>
    </Breathe>
  );
};

const StageScene: React.FC<{stage: number}> = ({stage}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = STAGES[stage];
  const base = STAGES.slice(0, stage).reduce((a, x) => a + x.ventures.length, 0);
  const t = frame / fps;
  const revealed = base + s.delays.filter((d) => t >= d).length;
  const n = s.ventures.length;
  const cardsTop = n === 3 ? 1010 : 1085;
  return (
    <SceneShell>
      <Sfx src="whoosh" at={0} volume={0.45} />
      <ChainTracker active={stage} count={revealed} />
      <div style={{position: 'absolute', left: 84, right: 84, top: 430}}>
        <Entrance delay={0.1}>
          <div style={{fontFamily: mt.fonts.body, fontWeight: 500, fontSize: 28, letterSpacing: 10, color: mt.colors.inkDim, marginBottom: 14}}>STAGE {pad2(stage + 1)}</div>
        </Entrance>
        <Title text={s.name} delay={0.2} size={96} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640}}>
        <StagePanel icon={s.icon} size={340} />
      </div>
      <div style={{position: 'absolute', left: 84, top: cardsTop, display: 'flex', flexDirection: 'column', gap: 14}}>
        {s.ventures.map((v, i) => (
          <React.Fragment key={v.name}>
            <Sfx src="pop" at={s.delays[i]} volume={0.5} />
            <VentureCard index={base + i + 1} name={v.name} kind={v.kind} icon={v.icon} delay={s.delays[i]} />
          </React.Fragment>
        ))}
      </div>
      <Captions lines={s.lines} />
    </SceneShell>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const count = Math.round(interpolate(frame / fps, [2.9, 4.6], [0, 13], {easing: mt.ease.out, ...clamp}));
  const lift = interpolate(frame / fps, [0, 1.4], [30, 0], {easing: mt.ease.out, ...clamp});
  return (
    <SceneShell>
      <Sfx src="whoosh" at={0} volume={0.45} />
      <Sfx src="thump" at={2.9} volume={0.5} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', transform: `translateY(${lift}px)`}}>
        <Breathe>
          <Draw paths={PALM} size={560} viewBox="0 0 200 260" delay={0.2} dur={2.6} width={2.4} wobble={2.2} style={{height: 728}} />
        </Breathe>
      </div>
      <div style={{position: 'absolute', left: 84, right: 84, top: 1080, textAlign: 'center'}}>
        <Title text="Oil palm." delay={0.9} size={112} align="center" />
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 26, marginTop: 6, opacity: interpolate(frame / fps, [2.6, 3.0], [0, 1], clamp)}}>
          <span style={{fontFamily: mt.fonts.display, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: '-0.04em', color: mt.colors.hero, textShadow: `0 0 50px ${mt.colors.heroGlow}`, fontVariantNumeric: 'tabular-nums', minWidth: 190, textAlign: 'right'}}>{count}</span>
          <span style={{fontFamily: mt.fonts.display, fontWeight: 800, fontSize: 84, letterSpacing: '-0.03em', color: mt.colors.ink}}>ventures.</span>
        </div>
      </div>
      <Captions lines={HOOK_LINES} />
    </SceneShell>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const colW = 912 / 5;
  const total = STAGES.reduce((a, s) => a + s.ventures.length, 0);
  let n = 0;
  const mark = spring({frame: frame - Math.round(2.6 * fps), fps, config: mt.spring.bouncy});
  return (
    <SceneShell>
      <Sfx src="whoosh" at={0} volume={0.45} />
      <Sfx src="thump" at={2.6} volume={0.55} />
      <div style={{position: 'absolute', left: 84, top: 330, width: 912, display: 'flex'}}>
        {STAGES.map((s, si) => (
          <div key={s.name} style={{width: colW, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Draw paths={ICONS[s.icon]} size={132} delay={0.2 + si * 0.25} dur={1.0} width={3} />
            <div style={{fontFamily: mt.fonts.body, fontWeight: 500, fontSize: 24, letterSpacing: 2, color: mt.colors.ink, margin: '16px 0 26px'}}>{s.short}</div>
            {s.ventures.map((v, vi) => {
              n += 1;
              return (
                <Entrance key={v.name} delay={0.7 + si * 0.25 + vi * 0.14} style={{marginBottom: 20}}>
                  <div style={{width: 84, height: 84, borderRadius: '50%', border: `3px solid ${mt.colors.ink}`, background: mt.colors.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mt.fonts.display, fontWeight: 800, fontSize: 34, color: mt.colors.ink, fontVariantNumeric: 'tabular-nums'}}>{pad2(n)}</div>
                </Entrance>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1090, textAlign: 'center'}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 28, transform: `scale(${interpolate(mark, [0, 1], [0.85, 1])})`, opacity: Math.min(1, mark)}}>
          <div style={{width: 120, height: 120, borderRadius: '50%', background: mt.colors.hero, color: mt.colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mt.fonts.display, fontWeight: 800, fontSize: 54}}>mt</div>
          <div style={{fontFamily: mt.fonts.display, fontWeight: 800, fontSize: 104, letterSpacing: '-0.04em', color: mt.colors.ink}}>Manetrust</div>
        </div>
        <Entrance delay={3.2}>
          <div style={{fontFamily: mt.fonts.body, fontWeight: 400, fontSize: 38, color: mt.colors.inkDim, marginTop: 18}}>
            {total} ventures along the oil palm value chain
          </div>
        </Entrance>
      </div>
      <Captions lines={OUTRO_LINES} />
    </SceneShell>
  );
};

export const ManetrustVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  let from = 0;
  const seq = (el: React.ReactNode, secs: number, key: string) => {
    const f = from;
    from += secs * fps;
    return (
      <Sequence key={key} from={f} durationInFrames={secs * fps}>
        {el}
      </Sequence>
    );
  };
  const scenes = [
    seq(<Hook />, HOOK_SECONDS, 'hook'),
    ...STAGES.map((s, i) => seq(<StageScene stage={i} />, s.seconds, s.name)),
    seq(<Outro />, OUTRO_SECONDS, 'outro'),
  ];
  return (
    <AbsoluteFill>
      <BgPaper />
      <Audio src={staticFile('sfx/pad.wav')} volume={0.2} />
      {scenes}
      <Sequence from={0} durationInFrames={(MT_SECONDS - OUTRO_SECONDS) * fps}>
        <Watermark />
      </Sequence>
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
