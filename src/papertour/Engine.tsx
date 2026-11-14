import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '../theme'; // loads Poppins / Inter

export const FPS = 30;
export const C = {ink: '#333333', purple: '#800080', lilac: '#efe3ef', paper: '#f4eff4', white: '#ffffff', mute: '#7a7380'};
export const F = 'Poppins, Helvetica, Arial, sans-serif';
export const B = 'Inter, Helvetica, Arial, sans-serif';
export const SOFT = {damping: 24, stiffness: 70, mass: 1.1};
export const POP = {damping: 15, stiffness: 95, mass: 1};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const WORLD_W = 2160;
export const WORLD_H = 4900;
/** Station centres on the sheet: a snake path, left column then right column, top to bottom. */
export const CELL = {
  1: {x: 540, y: 980},
  2: {x: 1620, y: 980},
  3: {x: 1620, y: 1940},
  4: {x: 540, y: 1940},
  5: {x: 540, y: 2900},
  6: {x: 1620, y: 2900},
  7: {x: 1620, y: 3860},
  8: {x: 540, y: 3860},
} as const;

const TCtx = createContext(0);
export const useT = () => useContext(TCtx);
export const sp = (t: number, at: number, config = SOFT) => spring({frame: Math.round((t - at) * FPS), fps: FPS, config});
export const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const inOut = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

export type Station = {
  n: keyof typeof CELL;
  start: number; // voiceover line start (s)
  end: number; // voiceover line end (s)
  node: React.ReactNode;
};

export type TourProps = {
  stations: Station[];
  total: number; // seconds
  pullbackAt: number; // when the pull-back starts (s)
  voSrc: string;
  bgmSrc: string;
  sfx: [number, 'whoosh' | 'pop' | 'tick' | 'thump', number][];
};

// ---------------------------------------------------------------- camera
type Cam = {cx: number; cy: number; z: number};
const MOVE_OUT = 0.6; // leave a station this long before its line ends
const ARRIVE = 0.5; // land this long after the next line starts

export const cameraAt = (st: Station[], pullbackAt: number, t: number): Cam => {
  const at = (s: Station): Cam => ({cx: CELL[s.n].x, cy: CELL[s.n].y + 50, z: 1});
  // intro settle
  const first = at(st[0]);
  if (t < st[0].start - 0.3) return {...first, z: 1 + 0.12 * (1 - ease(t / 1.6))};
  const lastLeave = pullbackAt;
  if (t >= lastLeave) {
    const u = inOut(Math.min(1, (t - lastLeave) / 3.0));
    const from = at(st[st.length - 1]);
    return {cx: from.cx + (WORLD_W / 2 - from.cx) * u, cy: from.cy + (WORLD_H / 2 - from.cy) * u, z: 1 + (1920 / WORLD_H - 1) * u};
  }
  for (let i = 0; i < st.length - 1; i++) {
    const depart = st[i].end - MOVE_OUT;
    const arrive = st[i + 1].start + ARRIVE;
    if (t >= depart && t < arrive) {
      const u = inOut((t - depart) / (arrive - depart));
      const a = at(st[i]);
      const b = at(st[i + 1]);
      return {cx: a.cx + (b.cx - a.cx) * u, cy: a.cy + (b.cy - a.cy) * u, z: 1 - 0.2 * Math.sin(Math.PI * u)};
    }
    if (t < depart) return at(st[i]);
  }
  return at(st[st.length - 1]);
};

// ---------------------------------------------------------------- world
const Sheet: React.FC<{t: number; st: Station[]; pullbackAt: number}> = ({t, st, pullbackAt}) => {
  // path line drawn as the camera travels
  const pts = st.map((s) => [CELL[s.n].x, CELL[s.n].y] as const);
  const segs = pts.slice(0, -1).map((p, i) => {
    const q = pts[i + 1];
    const depart = st[i].end - MOVE_OUT;
    const arrive = st[i + 1].start + ARRIVE;
    const u = inOut(Math.min(1, Math.max(0, (t - depart) / (arrive - depart))));
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    return {p, q, u, len};
  });
  const tint = '#efe3ef';
  const tiles: React.ReactNode[] = [];
  const TH = WORLD_H / 3;
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 2; c++)
      tiles.push(
        <Img
          key={`${r}-${c}`}
          src={staticFile('shared/paper.png')}
          style={{
            position: 'absolute',
            left: c * 1080,
            top: r * TH,
            width: 1080,
            height: TH,
            objectFit: 'cover',
            transform: `scale(${c % 2 ? -1 : 1}, ${r % 2 ? -1 : 1})`,
          }}
        />,
      );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: WORLD_W, height: WORLD_H, boxShadow: '0 40px 120px rgba(40,10,40,0.45)'}}>
      {tiles}
      <div style={{position: 'absolute', inset: 0, background: tint, mixBlendMode: 'multiply', opacity: 0.55}} />
      <svg width={WORLD_W} height={WORLD_H} style={{position: 'absolute', left: 0, top: 0}}>
        {segs.map((s, i) => (
          <line
            key={i}
            x1={s.p[0]}
            y1={s.p[1]}
            x2={s.p[0] + (s.q[0] - s.p[0]) * s.u}
            y2={s.p[1] + (s.q[1] - s.p[1]) * s.u}
            stroke={C.purple}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={`18 22`}
            opacity={0.55 * (s.u > 0 ? 1 : 0)}
          />
        ))}
      </svg>
      {st.map((s, i) => (
        <div key={i} style={{position: 'absolute', left: CELL[s.n].x - 540, top: CELL[s.n].y - 480, width: 1080, height: 960}}>
          {s.node}
        </div>
      ))}
    </div>
  );
};

export const PaperTour: React.FC<TourProps> = ({stations, total, pullbackAt, voSrc, bgmSrc, sfx}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = cameraAt(stations, pullbackAt, t);
  const bgmVol = (f: number) => {
    const s = f / FPS;
    const fin = interpolate(s, [0, 1.8], [0, 1], clamp);
    const fout = interpolate(s, [total - 3, total], [1, 0], clamp);
    const lift = interpolate(s, [0, 0.5, 1.5], [1.7, 1.7, 1], clamp) * interpolate(s, [pullbackAt + 0.5, pullbackAt + 2], [1, 1.6], clamp);
    return 0.09 * fin * fout * lift;
  };
  return (
    <TCtx.Provider value={t}>
      <AbsoluteFill style={{background: '#cdbfcd', overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 960,
            width: 0,
            height: 0,
            transform: `scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`,
            transformOrigin: '0 0',
          }}
        >
          <Sheet t={t} st={stations} pullbackAt={pullbackAt} />
        </div>
        {/* header band: logo only */}
        <div style={{position: 'absolute', left: 48, top: 48, height: 160, width: 120}}>
          <div style={{width: 120, height: 160, borderRadius: 18, background: 'rgba(255,255,255,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.18)'}}>
            <Img src={staticFile('shared/logo.png')} style={{width: 104, height: 139}} />
          </div>
        </div>
        <Audio src={staticFile(bgmSrc)} volume={bgmVol} />
        <Audio src={staticFile(voSrc)} volume={1} />
        {sfx.map(([s, n, v], i) => (
          <Sequence key={i} from={Math.max(0, Math.round(s * FPS) - 3)}>
            <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </TCtx.Provider>
  );
};

// ---------------------------------------------------------------- shared pieces
export const Rise: React.FC<{at: number; x?: number; y?: number; dy?: number; style?: React.CSSProperties; children: React.ReactNode; cfg?: typeof SOFT}> = ({
  at,
  x = 0,
  y = 0,
  dy = 44,
  style,
  children,
  cfg = SOFT,
}) => {
  const t = useT();
  const p = sp(t, at, cfg);
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 + x,
        top: 480 + y,
        opacity: Math.min(1, p * 1.4),
        transform: `translate(-50%, -50%) translateY(${(1 - p) * dy}px) scale(${0.92 + 0.08 * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Head: React.FC<{lines: string[]; at: number; size?: number; y?: number; color?: string; hot?: number[]}> = ({lines, at, size = 104, y = -300, color = C.ink, hot = []}) => (
  <>
    {lines.map((l, i) => (
      <Rise key={i} at={at + i * 0.25} y={y + i * size * 1.05} style={{fontFamily: F, fontWeight: 800, fontSize: size, lineHeight: 1, color: hot.includes(i) ? C.purple : color, whiteSpace: 'nowrap', letterSpacing: '-0.02em'}}>
        {l}
      </Rise>
    ))}
  </>
);

export const Label: React.FC<{at: number; x?: number; y?: number; size?: number; color?: string; weight?: number; children: React.ReactNode}> = ({at, x = 0, y = 0, size = 48, color = C.ink, weight = 800, children}) => (
  <Rise at={at} x={x} y={y} style={{fontFamily: F, fontWeight: weight, fontSize: size, color, whiteSpace: 'nowrap', lineHeight: 1.05}}>
    {children}
  </Rise>
);

export const stroke = {fill: 'none', stroke: C.ink, strokeWidth: 7, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
export {clamp, inOut};
