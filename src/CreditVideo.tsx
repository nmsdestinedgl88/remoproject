import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const GREEN = '#0a8f4e';
const DARK = '#06231a';
const GOLD = '#f5c542';
const WHITE = '#ffffff';
const FONT = 'Helvetica, Arial, sans-serif';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const useIn = (delay: number, dur = 18) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], clamp);
};

const Rise: React.FC<{delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  delay = 0,
  children,
  style,
}) => {
  const p = useIn(delay);
  return (
    <div style={{opacity: p, transform: `translateY(${(1 - p) * 50}px)`, ...style}}>{children}</div>
  );
};

const Scene: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const opacity = interpolate(frame, [0, 10, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        background: bg ?? `linear-gradient(160deg, ${DARK}, #0b3d2b)`,
        padding: '140px 80px',
        justifyContent: 'center',
        fontFamily: FONT,
        color: WHITE,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => (
  <Rise style={{fontSize: 40, letterSpacing: 6, color: GOLD, fontWeight: 700, marginBottom: 30}}>
    {children}
  </Rise>
);

const Big: React.FC<{children: React.ReactNode; delay?: number; size?: number}> = ({
  children,
  delay = 6,
  size = 100,
}) => (
  <Rise delay={delay} style={{fontSize: size, fontWeight: 800, lineHeight: 1.1}}>
    {children}
  </Rise>
);

const Small: React.FC<{children: React.ReactNode; delay?: number}> = ({children, delay = 20}) => (
  <Rise delay={delay} style={{fontSize: 52, lineHeight: 1.35, marginTop: 36, color: '#cfe9dc'}}>
    {children}
  </Rise>
);

const Hook = () => (
  <Scene>
    <Kicker>NIGERIA · 60 SECONDS</Kicker>
    <Big size={120}>
      What if <span style={{color: GOLD}}>200 million</span> people could finally borrow?
    </Big>
    <Small delay={40}>How unlocking consumer credit could power the whole economy.</Small>
  </Scene>
);

const Gap = () => {
  const frame = useCurrentFrame();
  const bars = [
    {label: 'Nigeria', v: 18, color: GOLD},
    {label: 'Kenya', v: 30, color: GREEN},
    {label: 'South Africa', v: 90, color: GREEN},
  ];
  return (
    <Scene>
      <Kicker>THE GAP</Kicker>
      <Big size={78}>Private credit is a thin slice of the economy</Big>
      <div style={{marginTop: 60}}>
        {bars.map((b, i) => {
          const w = interpolate(frame, [20 + i * 15, 70 + i * 15], [0, b.v], clamp);
          return (
            <div key={b.label} style={{marginBottom: 40}}>
              <div style={{fontSize: 44, marginBottom: 10}}>{b.label}</div>
              <div style={{background: 'rgba(255,255,255,0.12)', borderRadius: 20, height: 64}}>
                <div style={{width: `${w}%`, height: '100%', background: b.color, borderRadius: 20}} />
              </div>
            </div>
          );
        })}
      </div>
      <Rise delay={80} style={{fontSize: 34, color: '#9fc5b2'}}>
        Approx. private-sector credit, % of GDP (rounded, recent years)
      </Rise>
    </Scene>
  );
};

const Why = () => (
  <Scene>
    <Kicker>WHY IT'S STUCK</Kicker>
    <Big size={84}>Good borrowers get shut out</Big>
    {['No credit history to prove trustworthiness', 'Heavy collateral demands', 'Very high interest rates'].map(
      (t, i) => (
        <Rise
          key={t}
          delay={30 + i * 22}
          style={{fontSize: 52, marginTop: 44, display: 'flex', alignItems: 'center', gap: 28}}
        >
          <span style={{color: GOLD, fontSize: 70, fontWeight: 800}}>✕</span>
          <span>{t}</span>
        </Rise>
      ),
    )}
  </Scene>
);

const Unlock = () => (
  <Scene>
    <Kicker>THE UNLOCK</Kicker>
    <Big size={84}>Make trust measurable</Big>
    {[
      ['🪪', 'Digital identity (BVN & NIN) links every borrower to one record'],
      ['📊', 'Credit bureaus turn repayments into a score'],
      ['📱', 'Mobile & fintech data reach the unbanked'],
      ['🔒', 'Movable-asset registries make collateral flexible'],
    ].map(([icon, t], i) => (
      <Rise
        key={t}
        delay={25 + i * 20}
        style={{fontSize: 46, marginTop: 40, display: 'flex', gap: 28, alignItems: 'center', lineHeight: 1.25}}
      >
        <span style={{fontSize: 70}}>{icon}</span>
        <span>{t}</span>
      </Rise>
    ))}
  </Scene>
);

const Unleash = () => {
  const items = [
    ['🛍️', 'Households', 'smooth spending, buy appliances, phones, motorbikes'],
    ['🏪', 'Small businesses', 'stock up, hire and expand'],
    ['🏠', 'Homes & education', 'invest in the future, not just the next month'],
  ];
  return (
    <Scene>
      <Kicker>THE PAYOFF</Kicker>
      <Big size={84}>Demand wakes up</Big>
      {items.map(([icon, h, t], i) => (
        <Rise
          key={h}
          delay={28 + i * 24}
          style={{
            marginTop: 40,
            padding: '30px 36px',
            background: 'rgba(255,255,255,0.08)',
            borderLeft: `10px solid ${GOLD}`,
            borderRadius: 16,
            fontSize: 44,
            lineHeight: 1.25,
          }}
        >
          <span style={{fontSize: 60}}>{icon}</span> <b>{h}</b>: {t}
        </Rise>
      ))}
    </Scene>
  );
};

const Flywheel = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const steps = ['Borrow', 'Spend & invest', 'Firms grow', 'Jobs created', 'Incomes rise', 'Repay & borrow more'];
  const R = 330;
  const rot = frame * 0.6;
  return (
    <Scene>
      <Kicker>THE FLYWHEEL</Kicker>
      <Big size={84}>Credit compounds</Big>
      <div style={{position: 'relative', height: 900, marginTop: 30}}>
        <div
          style={{
            position: 'absolute',
            left: 540 - 80 - R,
            top: 450 - R,
            width: R * 2,
            height: R * 2,
            border: `6px dashed ${GOLD}`,
            borderRadius: '50%',
            transform: `rotate(${rot}deg)`,
            opacity: 0.5,
          }}
        />
        {steps.map((s, i) => {
          const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
          const p = spring({frame: frame - 20 - i * 12, fps, config: {damping: 14}});
          return (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: 540 - 80 + Math.cos(a) * R - 130,
                top: 450 + Math.sin(a) * R - 45,
                width: 260,
                height: 90,
                background: i === 0 ? GOLD : GREEN,
                color: i === 0 ? DARK : WHITE,
                borderRadius: 45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontSize: 32,
                fontWeight: 700,
                transform: `scale(${p})`,
                padding: 8,
              }}
            >
              {s}
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

const Guardrails = () => (
  <Scene>
    <Kicker>DONE RIGHT</Kicker>
    <Big size={84}>Access with guardrails</Big>
    {[
      'Affordability checks, not debt traps',
      'Transparent pricing and fair collections',
      'Strong data protection for borrowers',
    ].map((t, i) => (
      <Rise
        key={t}
        delay={28 + i * 22}
        style={{fontSize: 52, marginTop: 44, display: 'flex', gap: 28, alignItems: 'center'}}
      >
        <span style={{color: GOLD, fontSize: 70, fontWeight: 800}}>✓</span>
        <span>{t}</span>
      </Rise>
    ))}
  </Scene>
);

const Outro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 5, fps, config: {damping: 10}});
  return (
    <Scene bg={`linear-gradient(160deg, ${GREEN}, ${DARK})`}>
      <div style={{transform: `scale(${s})`, textAlign: 'center'}}>
        <div style={{fontSize: 120, fontWeight: 800, lineHeight: 1.1}}>
          Credit is <span style={{color: GOLD}}>infrastructure</span>.
        </div>
        <Rise delay={30} style={{fontSize: 80, fontWeight: 700, marginTop: 60}}>
          Unlock it.
        </Rise>
        <Rise delay={50} style={{fontSize: 48, marginTop: 50, color: '#d9f2e5'}}>
          Unleash Nigeria's economy.
        </Rise>
      </div>
    </Scene>
  );
};

const SCENES: [React.FC, number][] = [
  [Hook, 210],
  [Gap, 240],
  [Why, 210],
  [Unlock, 270],
  [Unleash, 240],
  [Flywheel, 270],
  [Guardrails, 180],
  [Outro, 180],
];

export const CREDIT_VIDEO_FRAMES = SCENES.reduce((a, [, d]) => a + d, 0);

export const CreditVideo: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: DARK}}>
      {SCENES.map(([C, d], i) => {
        const el = (
          <Sequence key={i} from={from} durationInFrames={d}>
            <C />
          </Sequence>
        );
        from += d;
        return el;
      })}
    </AbsoluteFill>
  );
};
