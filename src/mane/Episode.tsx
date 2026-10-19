// One engine for every Manetrust episode. Scenes are data (see episodes.ts), timed to the voiceover.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon} from './Icons';
import {PersistentObject} from './Objects';
import {clamp, mt} from './theme';

export type Num = {to: number; from?: number; dec?: number; pre?: string; suf?: string; tail?: string; at?: number; comma?: boolean};
export type IconSpot = {k: string; x: number; y: number; s?: number; at?: number};
export type Chip = {text: string; icon?: string; at?: number; hot?: boolean};
export type ObjKey = {x: number; y: number; s?: number; r?: number; state?: string; level?: number; la?: number; ld?: number};
export type Scene = {
  t: number;
  layout: 'hook' | 'headline' | 'block' | 'equation' | 'chips' | 'brand' | 'action' | 'split' | 'name' | 'grid' | 'table';
  kicker?: string;
  head?: string;
  headSize?: number;
  sub?: string;
  subAt?: number;
  num?: Num;
  label?: string;
  align?: 'left' | 'right';
  outline?: boolean;
  icons?: IconSpot[];
  chips?: Chip[];
  cells?: {num: Num; label: string}[];
  tag?: string;
  split?: {num: Num; label: string; icon: string}[];
  grid?: {n: number; icon: string; cols: number; at?: number; step?: number};
  table?: {gapAt: number};
  avatar?: {pose: 'present' | 'thumbs' | 'clipboard' | 'think_up' | 'think_clip'; side: 'left' | 'right'};
  obj: ObjKey;
  sfx?: [number, 'pop' | 'swap' | 'tick' | 'whoosh' | 'stamp' | 'chime'][];
};
export type EpisodeData = {
  id: string;
  vo: string;
  dur: number; // voiceover seconds
  object: string;
  objSize: number;
  tint: {color: string; op: number};
  firstLevel?: number;
  scenes: Scene[];
};

const FPS = 30;
export const episodeFrames = (d: EpisodeData) => Math.ceil((d.dur + 0.5) * FPS);

const ease = (x: number, a: number, b: number) => interpolate(x, [a, b], [0, 1], {...clamp, easing: mt.ease.out});
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/* ---------- text primitives ---------- */

const useLocal = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {l: frame / fps, frame, fps};
};

const In: React.FC<{at?: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number; cfg?: 'smooth' | 'snappy' | 'pop'}> = ({
  at = 0,
  children,
  style,
  dy = 40,
  cfg = 'snappy',
}) => {
  const {frame, fps} = useLocal();
  const p = spring({frame: frame - Math.round(at * fps), fps, config: mt.spring[cfg]});
  return (
    <div style={{opacity: Math.min(1, p), transform: `translateY(${(1 - p) * dy}px) scale(${0.92 + 0.08 * Math.min(1, p)})`, ...style}}>
      {children}
    </div>
  );
};

const Kicker: React.FC<{text: string; at?: number; color?: string}> = ({text, at = 0, color = mt.c.ink}) => (
  <In at={at} dy={20}>
    <div style={{fontFamily: mt.f.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, color, display: 'flex', alignItems: 'center', columnGap: 14}}>
      <span style={{width: 14, height: 14, borderRadius: 7, background: mt.c.hot, display: 'inline-block'}} />
      {text}
    </div>
  </In>
);

/** Anton headline; *word* renders purple; \n breaks lines. Words stagger in. */
const Head: React.FC<{text: string; size?: number; at?: number; color?: string; hotColor?: string; align?: 'left' | 'right' | 'center'}> = ({
  text,
  size = 118,
  at = 0,
  color = mt.c.ink,
  hotColor = mt.c.hot,
  align = 'left',
}) => {
  const {frame, fps} = useLocal();
  let idx = 0;
  return (
    <div style={{fontFamily: mt.f.head, fontSize: size, lineHeight: 1.04, color, textTransform: 'uppercase', textAlign: align}}>
      {text.split('\n').map((line, li) => (
        <div key={li} style={{display: 'flex', flexWrap: 'wrap', columnGap: Math.round(size * 0.24), justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'}}>
          {line.split(' ').map((raw, wi) => {
            const hot = raw.includes('*');
            const w = raw.replace(/\*/g, '');
            const p = spring({frame: frame - Math.round((at + idx++ * 0.08) * fps), fps, config: mt.spring.snappy});
            return (
              <span key={wi} style={{display: 'inline-block', color: hot ? hotColor : undefined, opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 50}px) scale(${0.9 + 0.1 * Math.min(1, p)})`}}>
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const fmt = (v: number, n: Num) => {
  const s = n.dec ? v.toFixed(n.dec) : Math.round(v).toString();
  const withCommas = n.comma ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
  return `${n.pre ?? ''}${withCommas}${n.suf ?? ''}`;
};

/** Counts up once over 0.9s, then freezes. */
const Count: React.FC<{n: Num; size: number; color?: string}> = ({n, size, color = mt.c.ink}) => {
  const {l} = useLocal();
  const at = n.at ?? 0.2;
  const v = lerp(n.from ?? 0, n.to, ease(l, at, at + 0.9));
  const tailP = ease(l, at + 0.7, at + 1.1);
  const show = at <= 0.1 ? 1 : ease(l, at - 0.15, at + 0.05);
  // at < 0 means the count is already under way at the scene's first frame (hook)
  return (
    <div style={{fontFamily: mt.f.head, fontSize: size, lineHeight: 1, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', opacity: show}}>
      {fmt(v, n)}
      {n.tail && <span style={{opacity: tailP, display: 'inline-block', transform: `translateX(${(1 - tailP) * 30}px)`}}>{n.tail}</span>}
    </div>
  );
};

const Label: React.FC<{text: string; at?: number; size?: number; color?: string; align?: 'left' | 'right'}> = ({text, at = 0.5, size = 46, color = mt.c.ink, align = 'left'}) => (
  <In at={at} dy={24}>
    <div style={{fontFamily: mt.f.body, fontWeight: 500, fontSize: size, lineHeight: 1.22, color, textAlign: align}}>{text}</div>
  </In>
);

const stripes = (frame: number): React.CSSProperties => ({
  backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.09) 0 24px, transparent 24px 48px)',
  backgroundPosition: `${(frame * 1.2) % 68}px 0`,
});

const IconAt: React.FC<{spot: IconSpot}> = ({spot}) => {
  const {l} = useLocal();
  const at = spot.at ?? 0.4;
  return (
    <div style={{position: 'absolute', left: spot.x, top: spot.y}}>
      <In at={at} cfg="pop" dy={30}>
        <Icon k={spot.k} t={l - at} size={Math.round((spot.s ?? 200) * 1.2)} />
      </In>
    </div>
  );
};

const ChipRow: React.FC<{c: Chip; i: number}> = ({c, i}) => {
  const {l} = useLocal();
  const at = c.at ?? 0.5 + i * 0.35;
  return (
    <In at={at} cfg="pop" dy={26} style={{marginTop: 18}}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          columnGap: 18,
          padding: '14px 30px 14px 16px',
          borderRadius: 999,
          background: c.hot ? mt.c.hot : mt.c.card,
          border: `3px solid ${c.hot ? mt.c.hot : mt.c.ink}`,
          fontFamily: mt.f.body,
          fontWeight: 500,
          fontSize: 48,
          color: c.hot ? mt.c.white : mt.c.ink,
        }}
      >
        {c.icon && (
          <div style={{width: 80, height: 80, borderRadius: 40, background: mt.c.white, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon k={c.icon} t={l - at} size={68} />
          </div>
        )}
        {c.text}
      </div>
    </In>
  );
};

/* ---------- layouts (stage: x 60..1020, y 260..1630) ---------- */

const Layout: React.FC<{s: Scene}> = ({s}) => {
  const {frame, l} = useLocal();
  const abs = (top: number, extra?: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: 72, right: 72, top, ...extra});
  switch (s.layout) {
    case 'hook':
      return (
        <>
          <div style={abs(290)}>{s.kicker && <Kicker text={s.kicker} at={-0.4} />}</div>
          <div style={abs(350)}>
            <In at={-0.3} cfg="pop" dy={30}>
              <Count n={{...s.num!, at: -0.5}} size={s.headSize ?? 230} color={mt.c.hot} />
            </In>
          </div>
          <div style={abs(350 + (s.headSize ?? 230) + 30, {right: 120})}>
            <Label text={s.label!} at={0.35} size={52} />
            {s.sub && (
              <In at={s.subAt ?? 1} cfg="pop" dy={30} style={{marginTop: 28}}>
                <div style={{fontFamily: mt.f.head, fontSize: 92, lineHeight: 1.04, color: mt.c.hot, textTransform: 'uppercase'}}>{s.sub}</div>
              </In>
            )}
          </div>
        </>
      );
    case 'headline':
      return (
        <>
          {s.kicker && (
            <div style={abs(290)}>
              <Kicker text={s.kicker} />
            </div>
          )}
          <div style={abs(s.kicker ? 350 : 300)}>
            <Head text={s.head!} size={s.headSize ?? 118} at={0.1} />
            {s.sub && (
              <div style={{marginTop: 34}}>
                <Label text={s.sub} at={s.subAt ?? 0.8} size={44} color={mt.c.mute} />
              </div>
            )}
          </div>
        </>
      );
    case 'block': {
      const right = s.align === 'right';
      const grow = spring({frame, fps: FPS, config: mt.spring.smooth});
      const fill = !s.outline;
      const fg = fill ? mt.c.white : mt.c.ink;
      return (
        <div
          style={{
            position: 'absolute',
            left: 60,
            right: 60,
            top: 290,
            height: 470,
            borderRadius: 44,
            background: fill ? mt.c.hot : mt.c.card,
            border: fill ? 'none' : `5px solid ${mt.c.ink}`,
            transform: `scaleY(${0.6 + 0.4 * Math.min(1, grow)})`,
            transformOrigin: 'top',
            opacity: Math.min(1, grow * 1.4),
            padding: '44px 56px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: right ? 'flex-end' : 'flex-start',
            ...(fill ? stripes(frame) : {}),
          }}
        >
          {s.kicker && <Kicker text={s.kicker} at={0.15} color={fg} />}
          <div style={{marginTop: 18}}>
            <Count n={{at: 0.3, ...s.num!}} size={s.headSize ?? 200} color={fill ? mt.c.white : mt.c.hot} />
          </div>
          <div style={{marginTop: 18}}>
            <Label text={s.label!} at={0.6} size={46} color={fg} align={right ? 'right' : 'left'} />
          </div>
        </div>
      );
    }
    case 'equation':
      return (
        <>
          {s.kicker && (
            <div style={abs(290)}>
              <Kicker text={s.kicker} />
            </div>
          )}
          {s.cells!.map((c, i) => {
            const last = i === s.cells!.length - 1;
            const at = (c.num.at ?? 0.3 + i * 0.6) - 0.2;
            return (
              <div key={i} style={abs(350 + i * 178)}>
                <In at={at} cfg={last ? 'pop' : 'snappy'} dy={36}>
                  <div
                    style={{
                      height: 154,
                      borderRadius: 30,
                      background: last ? mt.c.hot : mt.c.card,
                      border: last ? 'none' : `4px solid ${mt.c.ink}`,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 40px',
                      columnGap: 26,
                      ...(last ? stripes(frame) : {}),
                    }}
                  >
                    <div style={{fontFamily: mt.f.body, fontWeight: 500, fontSize: 72, color: last ? mt.c.white : mt.c.hot, width: 50}}>{i === 0 ? '' : last ? '=' : '×'}</div>
                    <Count n={{...c.num, at: c.num.at ?? 0.3 + i * 0.6}} size={100} color={last ? mt.c.white : mt.c.ink} />
                    <div style={{fontFamily: mt.f.body, fontWeight: 500, fontSize: 38, color: last ? mt.c.white : mt.c.mute, marginLeft: 'auto', textAlign: 'right'}}>{c.label}</div>
                  </div>
                </In>
              </div>
            );
          })}
          {s.tag && (
            <div style={abs(350 + s.cells!.length * 178 + 6)}>
              <In at={0.8} dy={14}>
                <div style={{fontFamily: mt.f.mono, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: mt.c.mute}}>{s.tag}</div>
              </In>
            </div>
          )}
        </>
      );
    case 'chips':
      return (
        <>
          {s.kicker && (
            <div style={abs(290)}>
              <Kicker text={s.kicker} />
            </div>
          )}
          <div style={abs(s.kicker ? 350 : 300)}>
            {s.head && <Head text={s.head} size={s.headSize ?? 104} at={0.1} />}
            <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
              {s.chips!.map((c, i) => (
                <ChipRow key={i} c={c} i={i} />
              ))}
            </div>
          </div>
        </>
      );
    case 'name':
      return (
        <>
          <div style={abs(290)}>
            <Kicker text={s.kicker ?? 'MEET'} />
          </div>
          <div style={abs(350)}>
            <Head text={s.head!} size={210} at={0.1} />
            <div style={{marginTop: 18}}>
              <In at={0.5} dy={16}>
                <div style={{display: 'inline-block', fontFamily: mt.f.mono, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: mt.c.white, background: mt.c.ink, padding: '10px 20px', borderRadius: 10}}>{s.tag}</div>
              </In>
            </div>
            {s.num && (
              <div style={{marginTop: 34, display: 'flex', alignItems: 'baseline', columnGap: 20}}>
                <Count n={s.num} size={120} color={mt.c.hot} />
                <Label text={s.label!} at={(s.num.at ?? 0.2) + 0.2} size={42} />
              </div>
            )}
          </div>
        </>
      );
    case 'split':
      return (
        <>
          {s.kicker && (
            <div style={abs(290)}>
              <Kicker text={s.kicker} />
            </div>
          )}
          <div style={abs(350, {display: 'flex', columnGap: 28})}>
            {s.split!.map((c, i) => {
              const at = (c.num.at ?? 0.3 + i * 0.5) - 0.25;
              return (
                <In key={i} at={at} cfg="pop" style={{flex: 1}}>
                  <div style={{height: 520, borderRadius: 36, background: i === 1 ? mt.c.hot : mt.c.card, border: i === 1 ? 'none' : `4px solid ${mt.c.ink}`, padding: 34, boxSizing: 'border-box', ...(i === 1 ? stripes(frame) : {})}}>
                    <div style={{width: 150, height: 150, borderRadius: 75, background: mt.c.white, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Icon k={c.icon} t={l - at} size={120} />
                    </div>
                    <div style={{marginTop: 30}}>
                      <Count n={{...c.num, at: c.num.at ?? 0.3 + i * 0.5}} size={c.num.tail || (c.num.pre ?? '').length + (c.num.suf ?? '').length > 2 ? 92 : 110} color={i === 1 ? mt.c.white : mt.c.hot} />
                    </div>
                    <div style={{marginTop: 14, fontFamily: mt.f.body, fontWeight: 500, fontSize: 38, lineHeight: 1.2, color: i === 1 ? mt.c.white : mt.c.ink}}>{c.label}</div>
                  </div>
                </In>
              );
            })}
          </div>
        </>
      );
    case 'grid': {
      const g = s.grid!;
      const size = g.cols >= 4 ? 150 : 190;
      return (
        <>
          <div style={abs(300)}>
            <Head text={s.head!} size={s.headSize ?? 112} at={0.1} />
          </div>
          <div style={abs(s.headSize && s.headSize < 100 ? 560 : 640, {display: 'grid', gridTemplateColumns: `repeat(${g.cols}, ${size}px)`, gap: 22})}>
            {Array.from({length: g.n}).map((_, i) => {
              const at = (g.at ?? 0.6) + i * (g.step ?? 0.09);
              return (
                <In key={i} at={at} cfg="pop" dy={20}>
                  <div style={{width: size, height: size, borderRadius: 28, background: i === g.n - 1 ? mt.c.hot : mt.c.card, border: `3px solid ${i === g.n - 1 ? mt.c.hot : mt.c.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{background: mt.c.white, borderRadius: 999, padding: 6}}>
                      <Icon k={g.icon} t={l - at} size={size * 0.62} />
                    </div>
                  </div>
                </In>
              );
            })}
          </div>
        </>
      );
    }
    case 'table': {
      const rows = [
        ['MONTH 1', 0.8, 0.6],
        ['MONTH 2', 0.7, 0.75],
        ['MONTH 3', 0.45, 0.9],
        ['MONTH 4', 0.85, 0.7],
      ] as const;
      const gap = ease(l, s.table!.gapAt, s.table!.gapAt + 0.4);
      return (
        <>
          <div style={abs(290)}>
            <Kicker text={s.kicker!} />
          </div>
          <div style={abs(350)}>
            <Head text={s.head!} size={92} at={0.1} />
          </div>
          <div style={abs(560, {background: mt.c.card, border: `4px solid ${mt.c.ink}`, borderRadius: 30, padding: '26px 34px'})}>
            <div style={{display: 'flex', fontFamily: mt.f.mono, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: mt.c.mute, marginBottom: 10}}>
              <div style={{width: 200}}>MONTH</div>
              <div style={{flex: 1}}>IN</div>
              <div style={{flex: 1}}>OUT</div>
            </div>
            {rows.map(([m, a, b], i) => {
              const p = ease(l, 0.6 + i * 0.35, 1.3 + i * 0.35);
              const bad = i === 2;
              return (
                <div key={m} style={{display: 'flex', alignItems: 'center', height: 74, position: 'relative'}}>
                  <div style={{width: 200, fontFamily: mt.f.mono, fontWeight: 700, fontSize: 28, color: mt.c.ink}}>{m}</div>
                  <div style={{flex: 1, paddingRight: 16}}>
                    <div style={{height: 30, width: `${a * 100 * p}%`, background: mt.c.ink, borderRadius: 8}} />
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{height: 30, width: `${b * 100 * p}%`, background: bad && gap > 0 ? mt.c.hot : 'rgba(51,51,51,0.45)', borderRadius: 8}} />
                  </div>
                  {bad && (
                    <div style={{position: 'absolute', right: -20, top: -6, opacity: gap, transform: `scale(${1.6 - 0.6 * gap}) rotate(-6deg)`, background: mt.c.hot, color: mt.c.white, fontFamily: mt.f.head, fontSize: 44, padding: '4px 22px', borderRadius: 12}}>
                      GAP
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      );
    }
    case 'brand':
      return (
        <>
          <div style={abs(290)}>
            <Kicker text={s.kicker ?? 'WHAT WE WRITE'} />
          </div>
          <div style={abs(345)}>
            <In at={0.05} cfg="pop" dy={40}>
              <div style={{fontFamily: mt.f.head, fontSize: 170, lineHeight: 1, color: mt.c.ink}}>MANETRUST</div>
              <div style={{fontFamily: mt.f.mono, fontWeight: 700, fontSize: 40, letterSpacing: 16, color: mt.c.hot, marginTop: 10}}>SOLUTIONS</div>
            </In>
            <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
              {s.chips!.map((c, i) => (
                <ChipRow key={i} c={c} i={i} />
              ))}
            </div>
          </div>
        </>
      );
    case 'action': {
      const slam = spring({frame, fps: FPS, config: {damping: 13, stiffness: 220, mass: 0.7}});
      return (
        <>
          <div
            style={{
              position: 'absolute',
              left: 60,
              right: 60,
              top: 300,
              height: 440,
              borderRadius: 48,
              background: mt.c.hot,
              transform: `scale(${1.25 - 0.25 * Math.min(1, slam)})`,
              opacity: Math.min(1, slam * 2),
              display: 'flex',
              alignItems: 'center',
              padding: '0 64px',
              boxShadow: '0 30px 80px rgba(128,0,128,0.25)',
              ...stripes(frame),
            }}
          >
            <div style={{fontFamily: mt.f.head, fontSize: 250, color: mt.c.white, lineHeight: 1}}>DM US</div>
            <div style={{marginLeft: 'auto', background: mt.c.white, borderRadius: 999, padding: 14}}>
              <Icon k="phone" t={l} size={150} />
            </div>
          </div>
          <div style={abs(780)}>
            <Label text={s.sub!} at={0.4} size={50} />
          </div>
        </>
      );
    }
  }
};

/* ---------- avatar, object, background ---------- */

const POSES = {
  present: ['maneclaud/avatar_present.webp', 1111 / 2000],
  thumbs: ['maneclaud/avatar_thumbs.webp', 951 / 2000],
  clipboard: ['maneclaud/avatar_clipboard.webp', 984 / 2000],
  think_up: ['maneclaud/avatar_think_up.webp', 902 / 2000],
  think_clip: ['maneclaud/avatar_think_clip.webp', 851 / 2000],
} as const;

const Avatar: React.FC<{a: NonNullable<Scene['avatar']>}> = ({a}) => {
  const {frame, fps, l} = useLocal();
  const [src, ratio] = POSES[a.pose];
  const h = 740;
  const w = Math.round(h * ratio);
  const p = spring({frame, fps, config: mt.spring.pop});
  const sway = Math.sin(l * 1.4) * 1.2;
  return (
    <div
      style={{
        position: 'absolute',
        top: 1630 - h,
        left: a.side === 'left' ? 40 : 1040 - w,
        width: w,
        height: h,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - Math.min(1, p)) * 80}px) scale(${0.9 + 0.1 * p}) rotate(${sway}deg)`,
        transformOrigin: '50% 100%',
      }}
    >
      <Img src={staticFile(src)} style={{width: w, height: h}} />
    </div>
  );
};

const Scene: React.FC<{s: Scene; dur: number}> = ({s, dur}) => {
  const frame = useCurrentFrame();
  const exit = 8;
  const o = interpolate(frame, [dur - exit, dur], [1, 0], {...clamp, easing: mt.ease.in});
  const y = interpolate(frame, [dur - exit, dur], [0, -40], {...clamp, easing: mt.ease.in});
  return (
    <AbsoluteFill style={{opacity: o, transform: `translateY(${y}px)`}}>
      <Layout s={s} />
      {s.icons?.map((spot, i) => (
        <IconAt key={i} spot={spot} />
      ))}
      {s.avatar && <Avatar a={s.avatar} />}
    </AbsoluteFill>
  );
};

const ObjectLayer: React.FC<{d: EpisodeData; starts: number[]}> = ({d, starts}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let i = 0;
  while (i + 1 < d.scenes.length && frame >= starts[i + 1]) i++;
  const cur = d.scenes[i].obj;
  const prev = i === 0 ? {...cur, y: cur.y + 90, s: (cur.s ?? 1) * 0.7, level: d.firstLevel ?? cur.level} : d.scenes[i - 1].obj;
  const local = frame - starts[i];
  const p = spring({frame: i === 0 ? local + 14 : local, fps: FPS, config: mt.spring.smooth});
  const x = lerp(prev.x, cur.x, p);
  const yy = lerp(prev.y, cur.y, p);
  const sc = lerp(prev.s ?? 1, cur.s ?? 1, p);
  const r = lerp(prev.r ?? 0, cur.r ?? 0, p);
  const la = cur.la ?? 0;
  const lp = interpolate(local / FPS, [la, la + (cur.ld ?? 0.8)], [0, 1], {...clamp, easing: mt.ease.out});
  const level = lerp(prev.level ?? 0, cur.level ?? 0, lp);
  const bob = Math.sin(t * 1.5) * 6;
  const tilt = Math.sin(t * 1.1) * 1.5;
  const size = d.objSize;
  const ringR = size * 0.56 * sc;
  return (
    <AbsoluteFill style={{opacity: i === 0 ? Math.min(1, 0.4 + p) : 1}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={x} cy={yy + bob} r={ringR} fill="rgba(255,255,255,0.55)" />
        <circle cx={x} cy={yy + bob} r={ringR} fill="none" stroke={mt.c.hot} strokeOpacity={0.4} strokeWidth={3} strokeDasharray="14 18" transform={`rotate(${t * 12} ${x} ${yy + bob})`} />
      </svg>
      <div style={{position: 'absolute', left: x - (size * sc) / 2, top: yy - (size * sc) / 2 + bob, transform: `rotate(${r + tilt}deg)`}}>
        <PersistentObject kind={d.object} size={size * sc} t={t} l={local / FPS} state={cur.state ?? 'rest'} level={level} />
      </div>
    </AbsoluteFill>
  );
};

const Background: React.FC<{d: EpisodeData}> = ({d}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const kb = interpolate(frame, [0, durationInFrames], [1.0, 1.07], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: mt.c.bg, overflow: 'hidden'}}>
      <Img src={staticFile('maneclaud/paper.png')} style={{width: 1080, height: 1920, transform: `scale(${kb}) translateX(${(kb - 1) * -120}px)`}} />
      <AbsoluteFill style={{backgroundColor: d.tint.color, mixBlendMode: 'multiply', opacity: d.tint.op}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, transparent 55%, rgba(51,51,51,0.16) 100%)'}} />
    </AbsoluteFill>
  );
};

const Header: React.FC = () => (
  <div style={{position: 'absolute', left: 48, top: 48, height: 124}}>
    <Img src={staticFile('maneclaud/logo.png')} style={{height: 124, width: 'auto'}} />
  </div>
);

const SFX_VOL = {pop: 0.16, swap: 0.14, tick: 0.12, whoosh: 0.12, stamp: 0.2, chime: 0.15} as const;
const BGM_VOL = 0.026; // BGM masters at about -8.6 LUFS; this keeps it near 20 dB under the voice

export const Episode: React.FC<{d: EpisodeData}> = ({d}) => {
  const {durationInFrames} = useVideoConfig();
  const starts = d.scenes.map((s) => Math.round(s.t * FPS));
  return (
    <AbsoluteFill>
      <Background d={d} />
      <Audio src={staticFile(`maneclaud/vo/${d.vo}`)} />
      <Audio
        src={staticFile('maneclaud/bgm.mp3')}
        volume={(f) => BGM_VOL * interpolate(f, [0, 30, durationInFrames - 60, durationInFrames - 1], [0, 1, 1, 0], clamp)}
      />
      {d.scenes.map((s, i) => {
        const from = starts[i];
        const to = i + 1 < starts.length ? starts[i + 1] : durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <Scene s={s} dur={to - from} />
            {s.sfx?.map(([at, name], j) => (
              <Sequence key={j} from={Math.max(0, Math.round(at * FPS) - 2)}>
                <Audio src={staticFile(`sfx/mc_${name}.wav`)} volume={SFX_VOL[name]} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      <ObjectLayer d={d} starts={starts} />
      <Header />
    </AbsoluteFill>
  );
};
