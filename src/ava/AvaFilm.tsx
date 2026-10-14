import React from 'react';
import {AbsoluteFill, continueRender, delayRender, Sequence, staticFile, useCurrentFrame} from 'remotion';
import A from './anchors.json';
import {C, E, getLayout, lerp, Orient, prog} from './tokens';
import {RegGrid, WipeOut} from './primitives';
import {PlateFilm} from './Plate';
import {S4} from './S4';
import {S5} from './S5';
import {S6, s6Geo} from './S6';
import {CaptionTrack} from './Captions';

const FONTS: [string, number, string][] = [
  ['Merriweather', 700, 'merriweather-latin-700-normal.woff2'],
  ['Merriweather', 900, 'merriweather-latin-900-normal.woff2'],
  ['Atkinson Hyperlegible', 400, 'atkinson-hyperlegible-latin-400-normal.woff2'],
  ['Atkinson Hyperlegible', 700, 'atkinson-hyperlegible-latin-700-normal.woff2'],
];

const useFonts = () => {
  const [ready, setReady] = React.useState(false);
  const [h] = React.useState(() => delayRender('ava fonts'));
  React.useEffect(() => {
    Promise.all(FONTS.map(async ([fam, w, file]) => {
      const ff = new FontFace(fam, `url(${staticFile('ava-fonts/' + file)}) format('woff2')`, {weight: String(w)});
      await ff.load();
      (document.fonts as unknown as {add(f: FontFace): void}).add(ff);
    })).then(() => { setReady(true); continueRender(h); }).catch((e) => { console.error(e); continueRender(h); });
  }, [h]);
  return ready;
};

/** The registration tick is the film's seed: orange 24x4 in the corner until S6, where it travels and becomes the dot. */
const Registration: React.FC<{L: ReturnType<typeof getLayout>}> = ({L}) => {
  const f = useCurrentFrame();
  const G = s6Geo(L);
  const t = prog(f, A.s6.dot, 30, E.io);
  const intro = prog(f, 0, 6, E.draw);
  const r = G.dotR;
  const x = lerp(L.mx, G.dotX - r, t);
  const y = lerp(L.zone.top, G.dotY - r, t);
  const w = lerp(24, 2 * r, t) * (t > 0 ? 1 : intro);
  const h = lerp(4, 2 * r, t);
  return <rect x={x} y={y} width={w} height={h} rx={lerp(0, r, t)} fill={C.iodine} />;
};

export const AvaFilm: React.FC<{orient: Orient}> = ({orient}) => {
  const ready = useFonts();
  const L = getLayout(orient);
  const f = useCurrentFrame();
  const S = A.scenes;
  const s5Out = prog(f, S[5].from, 18, E.draw);
  if (!ready) return <AbsoluteFill style={{background: C.bone}} />;
  return (
    <AbsoluteFill style={{background: C.bone}}>
      <svg width={L.W} height={L.H} viewBox={`0 0 ${L.W} ${L.H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <RegGrid L={L} />
        <Sequence layout="none" from={0} durationInFrames={S[2].to}><PlateFilm L={L} /></Sequence>
        <Sequence layout="none" from={S[3].from} durationInFrames={S[3].to - S[3].from}><S4 L={L} /></Sequence>
        <Sequence layout="none" from={S[4].from} durationInFrames={S[4].to - S[4].from + 18}>
          <WipeOut p={s5Out} toLeft><S5 L={L} /></WipeOut>
        </Sequence>
        <Sequence layout="none" from={S[5].from}><S6 L={L} /></Sequence>
        <Registration L={L} />
      </svg>
      <CaptionTrack L={L} />
    </AbsoluteFill>
  );
};
