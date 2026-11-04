import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon} from './Icons';
import {allCards, type Card, type Story} from './data';
import {SHADES, brand, theme, type Shade} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OVERLAP = 0.5; // seconds a card stays under the next card's wipe

// ---------- background: crumpled paper in a brand shade ----------
const Paper: React.FC<{shade: Shade; seed: number}> = ({shade, seed}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const s = 1.04 + p * 0.06;
  const dx = Math.sin(seed * 1.7) * 30 * p;
  const dy = Math.cos(seed * 2.3) * 30 * p;
  const t = frame / fps;
  return (
    <AbsoluteFill style={{backgroundColor: shade.dark ? brand.ink : brand.bg, overflow: 'hidden'}}>
      <Img
        src={staticFile('pitch/paper.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${s}) translate(${dx}px, ${dy}px) rotate(${seed % 2 ? 180 : 0}deg)`,
        }}
      />
      <AbsoluteFill style={{backgroundColor: shade.tint, opacity: shade.opacity, mixBlendMode: shade.blend}} />
      {/* soft drifting brand glow so the shade never reads flat */}
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 1300,
          borderRadius: '50%',
          left: -300 + Math.sin(t * 0.5 + seed) * 80,
          top: 900 + Math.cos(t * 0.4 + seed) * 80,
          background: `radial-gradient(circle, ${shade.dark ? '#ffffff' : brand.hot}${shade.dark ? '14' : '1c'}, transparent 62%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          backgroundImage: NOISE,
          backgroundSize: '220px',
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: 0.07,
          mixBlendMode: 'overlay',
        }}
      />
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.28) 100%)'}} />
    </>
  );
};

// ---------- caption parsing ----------
type Word = {w: string; hero: boolean};
const parse = (text: string): {words: Word[]; heroes: string[]} => {
  const words: Word[] = [];
  const heroes: string[] = [];
  text.split('**').forEach((seg, i) => {
    const hero = i % 2 === 1;
    if (hero) heroes.push(seg);
    seg.split(' ').filter(Boolean).forEach((w) => words.push({w, hero}));
  });
  return {words, heroes};
};

/** "$9M" -> {pre:"$", n:9, dec:0, post:"M"}; null when not a figure. */
const figure = (s: string) => {
  const m = s.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const raw = m[2];
  return {pre: m[1], n: parseFloat(raw.replace(/,/g, '')), dec: raw.includes('.') ? raw.split('.')[1].length : 0, comma: raw.includes(','), post: m[3]};
};

const CountUp: React.FC<{text: string; delay: number}> = ({text, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = figure(text);
  if (!f) return <>{text}</>;
  const p = interpolate(frame, [delay * fps, (delay + 0.9) * fps], [0, 1], {easing: theme.ease.out, ...clamp});
  const v = f.n * p;
  const str = f.dec ? v.toFixed(f.dec) : Math.round(v).toLocaleString('en-US', {useGrouping: f.comma});
  return (
    <>
      {f.pre}
      {str}
      {f.post}
    </>
  );
};

// ---------- one caption card ----------
const CardView: React.FC<{card: Card; shade: Shade; index: number; total: number; story: Story; seed: number}> = ({
  card,
  shade,
  index,
  total,
  story,
  seed,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const ink = shade.dark ? brand.white : brand.ink;
  const hot = shade.dark ? (shade.tint === brand.hot ? brand.white : '#C77DC7') : brand.hot;
  const iconHot = shade.tint === brand.hot ? brand.white : brand.hot === hot ? brand.hot : '#C77DC7';
  const {words} = parse(card.text);
  const n = words.length;
  const size = card.chips ? 104 : n <= 3 ? 168 : n <= 5 ? 128 : n <= 7 ? 108 : 96;

  // wipe in: diagonal clip from the left
  const wipe = spring({frame, fps, config: {damping: 22, stiffness: 120, mass: 0.8}});
  const clip = `polygon(0 0, ${wipe * 140}% 0, ${wipe * 140 - 40}% 100%, 0 100%)`;

  // content exit before the next card wipes over
  const exitStart = durationInFrames - Math.round((OVERLAP + theme.exitSec) * fps);
  const ex = interpolate(frame, [exitStart, exitStart + Math.round(theme.exitSec * fps)], [0, 1], {easing: theme.ease.in, ...clamp});

  const per = Math.round(fps * 0.09);
  const textDelay = 0.25;
  const t = frame / fps;

  return (
    <AbsoluteFill style={{clipPath: index === 0 ? undefined : clip}}>
      <Paper shade={shade} seed={seed} />
      <div style={{position: 'absolute', inset: 0, opacity: 1 - ex, transform: `translateY(${-50 * ex}px) scale(${1 - 0.03 * ex})`}}>
        {/* series kicker, below the header band */}
        <div
          style={{
            position: 'absolute',
            left: 84,
            top: 290,
            fontFamily: theme.fonts.mono,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: 4,
            color: ink,
            opacity: 0.75 * Math.min(1, spring({frame: frame - 4, fps, config: theme.spring.smooth})),
          }}
        >
          {card.kicker ?? `${story.title.toUpperCase()} · ${story.tag}`}
        </div>

        <div style={{position: 'absolute', left: 84, right: 84, top: 380, height: 1120, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 56}}>
        {/* animated icon */}
        <div style={{transform: `translateY(${Math.sin(t * 1.6) * 5}px)`}}>
          <Icon name={card.icon} ink={ink} hot={iconHot} size={250} />
        </div>

        {/* caption */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: Math.round(size * 0.24),
            rowGap: Math.round(size * 0.06),
            fontFamily: theme.fonts.display,
            fontSize: size,
            lineHeight: 1.04,
            textTransform: 'uppercase',
            color: ink,
          }}
        >
          {words.map((wd, i) => {
            const d = textDelay + (i * per) / fps;
            const p = spring({frame: frame - Math.round(d * fps), fps, config: wd.hero ? theme.spring.bouncy : theme.spring.snappy});
            const isFig = wd.hero && figure(wd.w) && !wd.w.match(/[a-z]{2,}/i);
            const hl = spring({frame: frame - Math.round((d + 0.15) * fps), fps, config: theme.spring.smooth});
            return (
              <span
                key={i}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  opacity: Math.min(1, p),
                  transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
                  color: wd.hero ? hot : undefined,
                }}
              >
                {wd.hero && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: -size * 0.08,
                      height: Math.max(10, size * 0.07),
                      borderRadius: 6,
                      background: hot,
                      transform: `scaleX(${hl})`,
                      transformOrigin: 'left',
                    }}
                  />
                )}
                {isFig ? <CountUp text={wd.w} delay={d} /> : wd.w}
              </span>
            );
          })}
        </div>

        {/* chips */}
        {card.chips && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
            {card.chips.map((c, i) => {
              const p = spring({frame: frame - Math.round((0.7 + i * 0.35) * fps), fps, config: theme.spring.bouncy});
              return (
                <div
                  key={c}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 26,
                    alignSelf: 'flex-start',
                    padding: '22px 36px',
                    borderRadius: 26,
                    background: i === 3 ? brand.hot : shade.dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.72)',
                    border: `3px solid ${i === 3 ? brand.hot : ink}`,
                    color: i === 3 ? brand.white : ink,
                    fontFamily: theme.fonts.body,
                    fontWeight: 500,
                    fontSize: 50,
                    opacity: Math.min(1, p),
                    transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
                  }}
                >
                  <span style={{fontFamily: theme.fonts.mono, fontSize: 34, opacity: 0.7}}>0{i + 1}</span>
                  {c}
                </div>
              );
            })}
          </div>
        )}

        </div>
        {/* progress, above the platform-button zone */}
        <div style={{position: 'absolute', left: 84, right: 84, top: 1560, display: 'flex', gap: 10}}>
          {Array.from({length: total}).map((_, i) => (
            <div key={i} style={{flex: 1, height: 8, borderRadius: 4, background: ink, opacity: i < index ? 0.55 : i === index ? 0.9 : 0.15}} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- header band: logo only ----------
const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: theme.spring.smooth});
  return (
    <div
      style={{
        position: 'absolute',
        left: 48,
        top: 40,
        height: 140,
        padding: '10px 22px',
        borderRadius: 28,
        background: 'rgba(255,255,255,0.88)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
        display: 'flex',
        alignItems: 'center',
        opacity: Math.min(1, p),
        transform: `translateY(${interpolate(p, [0, 1], [-20, 0])}px)`,
      }}
    >
      <Img src={staticFile('pitch/logo.png')} style={{height: 120, width: 'auto'}} />
    </div>
  );
};

const Sfx: React.FC<{src: string; at: number; volume: number}> = ({src, at, volume}) => {
  const {fps} = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps) - 2)} durationInFrames={Math.round(2 * fps)}>
      <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
    </Sequence>
  );
};

export const PitchVideo: React.FC<{story: Story}> = ({story}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const cards = allCards(story);
  const starts: number[] = [];
  cards.reduce((a, c) => (starts.push(a), a + c.hold), 0);
  const storyIndex = parseInt(story.id.replace(/\D/g, ''), 10) || 1;
  const fadeOut = Math.round(1.5 * fps);

  return (
    <AbsoluteFill style={{backgroundColor: brand.bg}}>
      {cards.map((c, i) => {
        const from = Math.round(starts[i] * fps);
        const last = i === cards.length - 1;
        const dur = last ? durationInFrames - from : Math.round((c.hold + OVERLAP) * fps);
        const shade = SHADES[(i + storyIndex) % SHADES.length];
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <CardView card={c} shade={shade} index={i} total={cards.length} story={story} seed={i + storyIndex * 3} />
          </Sequence>
        );
      })}
      <Logo />
      <Finish />

      {/* audio: BGM kept low and steady, effects under it */}
      <Audio
        src={staticFile('pitch/bgm.mp3')}
        volume={(f) =>
          0.4 *
          interpolate(f, [0, fps], [0, 1], clamp) *
          interpolate(f, [durationInFrames - fadeOut, durationInFrames - 1], [1, 0], clamp)
        }
      />
      {cards.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Sfx src="whoosh" at={starts[i]} volume={0.18} />}
          {c.text.includes('**') && <Sfx src="pop" at={starts[i] + 0.3} volume={0.3} />}
          {c.icon === 'xstamp' && <Sfx src="thump" at={starts[i] + 0.35} volume={0.35} />}
          {c.chips?.map((_, k) => <Sfx key={k} src="tick" at={starts[i] + 0.7 + k * 0.35} volume={0.25} />)}
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
