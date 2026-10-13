import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {Body, Breathe, Entrance, Kicker, SceneContent, Sfx, WordReveal} from './Motion';
import {CartIcon, ChartIcon, CheckIcon, HomeIcon, IdIcon, LockIcon, PhoneIcon, StoreIcon, XIcon} from './Icons';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Row: React.FC<{
  icon: React.ReactNode;
  children: React.ReactNode;
  delay: number;
  tint?: string;
}> = ({icon, children, delay, tint = theme.colors.accent}) => (
  <Entrance delay={delay} config={theme.spring.snappy} style={{marginTop: 34}}>
    <Breathe phase={delay}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          columnGap: 32,
          padding: '28px 34px',
          background: theme.colors.surface,
          border: `1.5px solid ${theme.colors.surfaceLine}`,
          borderRadius: 28,
          fontFamily: theme.fonts.body,
          fontWeight: 500,
          fontSize: 44,
          lineHeight: 1.25,
          color: theme.colors.text,
        }}
      >
        <div style={{color: tint, flexShrink: 0, display: 'flex'}}>{icon}</div>
        <div>{children}</div>
      </div>
    </Breathe>
  </Entrance>
);

export const Hook: React.FC = () => (
  <SceneContent>
    <Sfx src="whoosh" at={0} />
    <Sfx src="thump" at={0.9} volume={0.7} />
    <Kicker>NIGERIA · 60 SECONDS</Kicker>
    <WordReveal text="What if *200 million* people could finally borrow?" size={116} delay={0.2} />
    <div style={{height: 50}} />
    <Body delay={2.4}>How unlocking consumer credit could power the whole economy.</Body>
  </SceneContent>
);

const Bar: React.FC<{label: string; value: number; delay: number; hero?: boolean}> = ({label, value, delay, hero}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - Math.round(delay * fps), fps, config: {damping: 30, stiffness: 60}});
  const w = interpolate(p, [0, 1], [0, value]);
  return (
    <Entrance delay={delay} style={{marginBottom: 44}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: theme.fonts.body,
          fontWeight: 500,
          fontSize: 44,
          marginBottom: 14,
          color: theme.colors.text,
        }}
      >
        <span>{label}</span>
        <span style={{fontVariantNumeric: 'tabular-nums', color: hero ? theme.colors.primary : theme.colors.textDim}}>
          ~{Math.round(w)}%
        </span>
      </div>
      <div style={{background: theme.colors.surface, borderRadius: 24, height: 60, overflow: 'hidden'}}>
        <div
          style={{
            width: `${w}%`,
            height: '100%',
            borderRadius: 24,
            background: hero ? theme.colors.primary : theme.colors.accent,
            boxShadow: hero ? `0 0 50px ${theme.colors.glow}` : undefined,
          }}
        />
      </div>
    </Entrance>
  );
};

export const Gap: React.FC = () => (
  <SceneContent>
    <Sfx src="whoosh" at={0} />
    <Sfx src="tick" at={1.4} volume={0.35} />
    <Sfx src="tick" at={1.9} volume={0.35} />
    <Sfx src="tick" at={2.4} volume={0.35} />
    <Kicker>THE GAP</Kicker>
    <WordReveal text="Private credit is a thin slice of the economy" size={84} delay={0.2} style={{marginBottom: 60}} />
    <Bar label="Nigeria" value={18} delay={1.4} hero />
    <Bar label="Kenya" value={30} delay={1.9} />
    <Bar label="South Africa" value={90} delay={2.4} />
    <Body delay={3.4} size={32}>
      Approx. private-sector credit, % of GDP (rounded, recent years)
    </Body>
  </SceneContent>
);

export const Why: React.FC = () => (
  <SceneContent>
    <Sfx src="whoosh" at={0} />
    <Sfx src="pop" at={1.5} />
    <Sfx src="pop" at={2.1} />
    <Sfx src="pop" at={2.7} />
    <Kicker>WHY IT'S STUCK</Kicker>
    <WordReveal text="Good borrowers get *shut* out" size={96} delay={0.2} />
    <div style={{height: 20}} />
    <Row delay={1.5} icon={<XIcon />} tint={theme.colors.textDim}>No credit history to prove trust</Row>
    <Row delay={2.1} icon={<XIcon />} tint={theme.colors.textDim}>Heavy collateral demands</Row>
    <Row delay={2.7} icon={<XIcon />} tint={theme.colors.textDim}>Very high interest rates</Row>
  </SceneContent>
);

export const Unlock: React.FC = () => (
  <SceneContent>
    <Sfx src="whoosh" at={0} />
    {[1.4, 2.2, 3.0, 3.8].map((t) => (
      <Sfx key={t} src="pop" at={t} />
    ))}
    <Kicker>THE UNLOCK</Kicker>
    <WordReveal text="Make trust *measurable*" size={96} delay={0.2} />
    <div style={{height: 14}} />
    <Row delay={1.4} icon={<IdIcon />}>One digital ID per borrower (BVN and NIN)</Row>
    <Row delay={2.2} icon={<ChartIcon />}>Credit bureaus turn repayment into a score</Row>
    <Row delay={3.0} icon={<PhoneIcon />}>Mobile and fintech data reach the unbanked</Row>
    <Row delay={3.8} icon={<LockIcon />}>Asset registries make collateral flexible</Row>
  </SceneContent>
);

export const Payoff: React.FC = () => (
  <SceneContent>
    <Sfx src="whoosh" at={0} />
    {[1.4, 2.4, 3.4].map((t) => (
      <Sfx key={t} src="pop" at={t} />
    ))}
    <Kicker>THE PAYOFF</Kicker>
    <WordReveal text="Demand *wakes* up" size={92} delay={0.2} />
    <div style={{height: 16}} />
    <Row delay={1.4} icon={<CartIcon size={84} />}>
      <b>Households</b> smooth spending and buy what they need
    </Row>
    <Row delay={2.4} icon={<StoreIcon size={84} />}>
      <b>Small firms</b> stock up, hire and expand
    </Row>
    <Row delay={3.4} icon={<HomeIcon size={84} />}>
      <b>Families</b> invest in homes and education
    </Row>
  </SceneContent>
);

export const Flywheel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const steps = ['Borrow', 'Spend & invest', 'Firms grow', 'Jobs created', 'Incomes rise', 'Repay & reborrow'];
  const R = 340;
  const rot = (frame / fps) * 14;
  const dotA = ((frame / fps) * 0.9 - Math.PI / 2) % (Math.PI * 2);
  return (
    <SceneContent>
      <Sfx src="whoosh" at={0} />
      {steps.map((_, i) => (
        <Sfx key={i} src="pop" at={1.2 + i * 0.4} volume={0.45} />
      ))}
      <Kicker>THE FLYWHEEL</Kicker>
      <WordReveal text="Credit compounds" size={104} delay={0.2} />
      <div style={{position: 'relative', height: 940, marginTop: 20}}>
        <div
          style={{
            position: 'absolute',
            left: 456 - R,
            top: 470 - R,
            width: R * 2,
            height: R * 2,
            border: `5px dashed ${theme.colors.accent}`,
            borderRadius: '50%',
            opacity: 0.45,
            transform: `rotate(${rot}deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 456 + Math.cos(dotA) * R - 14,
            top: 470 + Math.sin(dotA) * R - 14,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: theme.colors.text,
            boxShadow: `0 0 30px ${theme.colors.text}88`,
          }}
        />
        <Entrance delay={0.8} style={{position: 'absolute', left: 456 - 190, top: 470 - 56, width: 380, textAlign: 'center'}}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 800,
              fontSize: 50,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: theme.colors.text,
            }}
          >
            More credit
            <br />
            <span style={{color: theme.colors.textDim}}>more growth</span>
          </div>
        </Entrance>
        {steps.map((s, i) => {
          const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
          const p = spring({frame: frame - Math.round((1.2 + i * 0.4) * fps), fps, config: theme.spring.bouncy});
          const hero = i === 0;
          return (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: 456 + Math.cos(a) * R - 140,
                top: 470 + Math.sin(a) * R - 48,
                width: 280,
                height: 96,
                background: hero ? theme.colors.primary : theme.colors.accent,
                color: hero ? theme.colors.bg : theme.colors.text,
                borderRadius: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontFamily: theme.fonts.body,
                fontWeight: 500,
                fontSize: 32,
                lineHeight: 1.1,
                padding: '0 16px',
                opacity: Math.min(1, p),
                transform: `scale(${interpolate(p, [0, 1], [0.5, 1])})`,
                boxShadow: hero ? `0 0 60px ${theme.colors.glow}` : undefined,
              }}
            >
              {s}
            </div>
          );
        })}
      </div>
    </SceneContent>
  );
};

export const Guardrails: React.FC = () => (
  <SceneContent>
    <Sfx src="whoosh" at={0} />
    {[1.3, 1.9, 2.5].map((t) => (
      <Sfx key={t} src="pop" at={t} />
    ))}
    <Kicker>DONE RIGHT</Kicker>
    <WordReveal text="Access with *guardrails*" size={96} delay={0.2} />
    <div style={{height: 20}} />
    <Row delay={1.3} icon={<CheckIcon />}>Affordability checks, not debt traps</Row>
    <Row delay={1.9} icon={<CheckIcon />}>Transparent pricing, fair collections</Row>
    <Row delay={2.5} icon={<CheckIcon />}>Strong protection for borrower data</Row>
  </SceneContent>
);

export const Outro: React.FC = () => (
  <SceneContent>
    <Sfx src="whoosh" at={0} />
    <Sfx src="thump" at={2.0} volume={0.9} />
    <div style={{textAlign: 'center'}}>
      <WordReveal
        text="Credit is *infrastructure.*"
        size={120}
        delay={0.2}
        style={{justifyContent: 'center', textAlign: 'center'}}
      />
      <Entrance delay={2.0} config={theme.spring.bouncy} style={{marginTop: 70}}>
        <Breathe>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 800,
              fontSize: 96,
              letterSpacing: '-0.03em',
              color: theme.colors.text,
            }}
          >
            Unlock it.
          </div>
        </Breathe>
      </Entrance>
      <Body delay={3.0} size={46}>
        Unleash Nigeria's economy.
      </Body>
    </div>
  </SceneContent>
);
