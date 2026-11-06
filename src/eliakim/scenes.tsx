import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Brackets, Card, Cutout, Draw, Marker, Pop, Rings, Stage, Typed, Words, useBreath, useProgress} from './kit';
import {colors, ease, fonts, spring, tone} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const abs = (s: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...s});

const Label: React.FC<{bg: 'white' | 'navy' | 'grey' | 'gold'; delay?: number; text: string; top: number; left?: number; center?: boolean}> = ({
  bg,
  delay = 0,
  text,
  top,
  left = 90,
  center,
}) => (
  <Pop delay={delay} style={center ? abs({left: 0, right: 0, top, textAlign: 'center'}) : abs({left, top})}>
    <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 52, letterSpacing: '0.24em', color: tone(bg).ink}}>{text}</div>
  </Pop>
);

/* ---- 1. Hook (white, 4 s) ------------------------------------------------ */
export const S1: React.FC = () => (
  <Stage bg="white">
    <Rings colorA={colors.gold} colorB={colors.grey} cx={540} cy={700} delay={0.05} />
    <Pop delay={0.15} style={abs({left: 90, top: 280})}>
      <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 560, lineHeight: 0.9, color: colors.navy, letterSpacing: '-0.05em'}}>3</div>
    </Pop>
    <div style={abs({left: 90, top: 880, width: 900})}>
      <Words bg="white" delay={0.6} size={96} text="ways to _earn_ | from [oil~palm] | with _Eliakim_" />
    </div>
    <Cutout file="palm-tree-fruit" width={340} style={{right: 40, top: 1150}} delay={1.2} fromX={90} />
  </Stage>
);

/* ---- 2. Overview (navy, 4 s) -------------------------------------------- */
const OPTIONS = ['Termed investment', 'Bring your own fruit', 'Documented order'];
export const S2: React.FC = () => (
  <Stage bg="navy">
    <Cutout file="palm-grove" sticker width={300} style={{right: 40, top: 250}} delay={0.5} fromX={60} />
    <div style={abs({left: 90, top: 330, width: 640})}>
      <Words bg="navy" size={90} delay={0.1} text="Here is how each option _works._" />
    </div>
    {OPTIONS.map((o, i) => (
      <Pop key={o} delay={0.9 + i * 0.22} fromX={-80} rise={20} style={abs({left: 90 + i * 50, top: 880 + i * 200})}>
        <Card style={{width: 800, height: 160, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 30}}>
          <div style={{width: 112, height: 112, borderRadius: 24, background: colors.gold, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{fontFamily: fonts.caps, fontSize: 80, color: colors.navy, lineHeight: 1}}>{`0${i + 1}`}</span>
          </div>
          <span style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 44, color: colors.navy}}>{o}</span>
        </Card>
      </Pop>
    ))}
  </Stage>
);

/* ---- giant-number option intro, used for options 1 and 3 ------------------ */
const OptionIntro: React.FC<{bg: 'gold' | 'navy'; num: string; title: string; bracket: string}> = ({bg, num, title, bracket}) => {
  const t = tone(bg);
  return (
    <Stage bg={bg}>
      <Brackets color={bracket} delay={0.05} />
      <div style={abs({left: 0, right: 0, top: 330, textAlign: 'center'})}>
        <Typed bg={bg} text="OPTION" family="body" weight={600} size={68} cps={12} align="center" delay={0.1} style={{letterSpacing: '0.3em', color: t.ink}} />
      </div>
      <Pop delay={0.45} rise={70} style={abs({left: 0, right: 0, top: 410, textAlign: 'center'})}>
        <div style={{fontFamily: fonts.caps, fontSize: 800, lineHeight: 1, color: bg === 'navy' ? colors.gold : colors.navy}}>{num}</div>
      </Pop>
      <div style={abs({left: 90, right: 90, top: 1330})}>
        <Words bg={bg} size={112} delay={0.9} align="center" text={title} />
      </div>
    </Stage>
  );
};

/* ---- 3. Option 1 title (gold, 3 s) --------------------------------------- */
export const S3: React.FC = () => <OptionIntro bg="gold" num="01" title="Termed _investment_" bracket={colors.navy} />;

/* ---- 4. Minimum (white, 4 s) --------------------------------------------- */
export const S4: React.FC = () => (
  <Stage bg="white">
    <Label bg="white" text="OPTION 1" top={560} center delay={0.05} />
    <Pop delay={0.25} style={abs({left: 0, right: 0, top: 740, textAlign: 'center'})}>
      <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 58, color: tone('white').dim}}>Put in a minimum of</div>
    </Pop>
    <Pop delay={0.5} style={abs({left: 0, right: 0, top: 860, textAlign: 'center'})}>
      <Marker bg="white" delay={0.9}>
        <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 262, letterSpacing: '-0.04em', color: colors.navy}}>₦2.5M</span>
      </Marker>
    </Pop>
    <Pop delay={1.2} style={abs({left: 0, right: 0, top: 1220, textAlign: 'center'})}>
      <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 84, color: colors.navy}}>to start earning</div>
    </Pop>
  </Stage>
);

/* ---- 5. The 40% (navy, 8 s). First 3 frames are a black glitch ------------- */
export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const glitchFrames = Math.round(0.1 * fps);
  const n = Math.round(interpolate(frame, [Math.round(0.45 * fps), Math.round(1.95 * fps)], [0, 40], {...clamp, easing: ease.out}));
  const p = interpolate(frame, [Math.round(1.6 * fps), Math.round(6.4 * fps)], [0, 1], {...clamp, easing: ease.inOut});
  const breath = useBreath(5, 3, 1);
  if (frame < glitchFrames) {
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <div style={abs({left: 120, top: 900, fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 40, color: '#2B2B7A'})}>But</div>
      </AbsoluteFill>
    );
  }
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <Stage bg="navy">
      <Rings colorA={colors.gold} colorB="#FFFFFF" cx={540} cy={650} delay={0.4} max={1100} />
      <Pop delay={0.15} style={abs({left: 0, right: 0, top: 320, textAlign: 'center'})}>
        <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 56, letterSpacing: '0.2em', color: colors.pureWhite}}>YOUR INVESTMENT</div>
      </Pop>
      <div style={abs({left: 0, right: 0, top: 400, textAlign: 'center', transform: `translateY(${breath}px)`})}>
        <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 340, lineHeight: 1, letterSpacing: '-0.04em', color: colors.gold}}>
          {`+${n}%`}
        </span>
      </div>
      <Pop delay={1.4} style={abs({left: 0, right: 0, top: 760, textAlign: 'center'})}>
        <span style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 58, color: colors.pureWhite}}>profit in </span>
        <span style={{fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 120, color: colors.pureWhite}}>60 days</span>
      </Pop>
      {/* timeline */}
      <Draw d="M120 1040 H960" delay={1.6} dur={1.6} stroke={colors.gold} width={10} />
      {ticks.map((t, i) => (
        <div key={i} style={abs({left: 120 + 840 * t - 3, top: 1020, width: 6, height: 40, background: colors.pureWhite, opacity: p >= t ? 1 : 0.25})} />
      ))}
      <div style={abs({left: 120 + 840 * p - 22, top: 1018, width: 44, height: 44, borderRadius: 22, background: colors.gold, boxShadow: '0 0 0 10px rgba(225,176,41,0.25)'})} />
      <div style={abs({left: 90, top: 1090, fontFamily: fonts.body, fontWeight: 600, fontSize: 34, letterSpacing: '0.12em', color: tone('navy').dim})}>DAY 0</div>
      <div style={abs({right: 90, top: 1090, fontFamily: fonts.body, fontWeight: 600, fontSize: 34, letterSpacing: '0.12em', color: tone('navy').dim})}>DAY 60</div>
      <Pop delay={3.4} style={abs({left: 60, right: 60, top: 1190, textAlign: 'center'})}>
        <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 42, lineHeight: 1.3, color: tone('navy').dim}}>
          Profit from milling CPO, PKO and by-products
        </div>
      </Pop>
      <Cutout file="mill-press" sticker height={400} style={{left: 90, top: 1280}} delay={4.2} fromX={-60} />
      <Cutout file="oil-bottle" sticker height={400} style={{right: 130, top: 1280}} delay={4.5} fromX={60} phase={2} />
    </Stage>
  );
};

/* ---- 6. Option 2 title (grey, 3 s) --------------------------------------- */
export const S6: React.FC = () => (
  <Stage bg="grey">
    <Label bg="grey" text="OPTION 2" top={340} delay={0.05} />
    <div style={abs({left: 90, top: 440, width: 900})}>
      <Words bg="grey" size={132} delay={0.25} text="You source | the _fruit_" />
    </div>
    <Cutout file="harvester" sticker height={740} style={{left: 20, top: 880}} delay={0.8} fromX={-90} />
    <Cutout file="fruit-bunches" sticker width={430} style={{right: 30, top: 1250}} delay={1.1} fromX={90} phase={1} />
  </Stage>
);

/* ---- 7. Field to mill (white, 6 s) --------------------------------------- */
const Arrow: React.FC<{x1: number; x2: number; y: number; delay: number}> = ({x1, x2, y, delay}) => (
  <Draw d={`M${x1} ${y} H${x2} M${x2 - 26} ${y - 22} L${x2} ${y} L${x2 - 26} ${y + 22}`} delay={delay} dur={0.7} stroke={colors.gold} width={12} />
);
export const S7: React.FC = () => (
  <Stage bg="white">
    <div style={abs({left: 90, top: 330, width: 900})}>
      <Words bg="white" size={92} delay={0.1} text="You [source] the fruit. | We _mill_ it." />
    </div>
    <Cutout file="fruit-bunches" width={250} style={{left: 40, top: 940}} delay={1.2} fromX={-60} />
    <Arrow x1={300} x2={395} y={1000} delay={1.9} />
    <Cutout file="fruit-truck" width={270} style={{left: 400, top: 830}} delay={2.2} />
    <Arrow x1={680} x2={790} y={1000} delay={2.8} />
    <Cutout file="mill-press" width={210} style={{left: 800, top: 750}} delay={3.1} fromX={60} />
    <Pop delay={1.5} style={abs({left: 40, width: 250, top: 1140, textAlign: 'center'})}>
      <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 38, color: colors.navy}}>Your fruit</div>
    </Pop>
    <Pop delay={3.4} style={abs({left: 800, width: 210, top: 1140, textAlign: 'center'})}>
      <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 38, color: colors.navy}}>Our mill</div>
    </Pop>
    <Pop delay={3.9} style={abs({left: 70, top: 1290})}>
      <div style={{width: 940, borderRadius: 44, background: colors.navy, padding: '40px 50px', textAlign: 'center', boxShadow: '0 30px 60px -18px rgba(10,6,50,0.45)'}}>
        <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 34, letterSpacing: '0.22em', color: '#C9C7EE'}}>MINIMUM</div>
        <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 70, marginTop: 10, color: colors.gold, letterSpacing: '-0.02em'}}>1,000 bunches</div>
        <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 44, marginTop: 4, color: colors.pureWhite}}>or 10 bags of threshed fruit</div>
      </div>
    </Pop>
  </Stage>
);

/* ---- 8. Farm gate rates (gold, 5 s) -------------------------------------- */
export const S8: React.FC = () => (
  <Stage bg="gold">
    <div style={abs({left: 90, top: 330, width: 900})}>
      <Words bg="gold" size={118} delay={0.1} text="Your oil. | _Farm_ _gate_ _rates._" />
    </div>
    <Cutout file="oil-bottle" sticker height={640} style={{left: 420, top: 740}} delay={0.8} />
    <Pop delay={2.0} style={abs({left: 90, top: 1470})}>
      <Card style={{width: 900, padding: '30px 44px'}}>
        <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: '0.2em', color: colors.navy}}>FARM GATE RATE</div>
        <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 40, lineHeight: 1.3, marginTop: 10, color: colors.navy}}>
          The price paid at the farm, before transport and middlemen.
        </div>
      </Card>
    </Pop>
  </Stage>
);

/* ---- 9. Option 3 title (navy, 3 s) --------------------------------------- */
export const S9: React.FC = () => <OptionIntro bg="navy" num="03" title="Documented _order_" bracket={colors.gold} />;

/* ---- 10. Order card (white, 6 s) ----------------------------------------- */
const Field: React.FC<{label: string; top: number; delay: number; fill: number}> = ({label, top, delay, fill}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w = interpolate(frame - Math.round(delay * fps), [0, Math.round(0.9 * fps)], [0, fill], {...clamp, easing: ease.out});
  return (
    <div style={abs({left: 60, right: 60, top})}>
      <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 38, letterSpacing: '0.08em', color: tone('white').dim}}>{label}</div>
      <div style={{position: 'relative', height: 96, borderBottom: `6px solid ${colors.navy}`}}>
        <div style={{position: 'absolute', left: 0, bottom: 26, height: 44, width: `${w}%`, borderRadius: 22, background: colors.gold}} />
      </div>
    </div>
  );
};
export const S10: React.FC = () => (
  <Stage bg="white">
    <div style={abs({left: 90, top: 330, width: 900})}>
      <Words bg="white" size={104} delay={0.1} text="Put it in | [writing.]" />
    </div>
    <Pop delay={0.7} style={abs({left: 90, top: 700})}>
      <Card style={{width: 900, height: 700, position: 'relative'}}>
        <div style={abs({left: 60, top: 50, fontFamily: fonts.body, fontWeight: 600, fontSize: 36, letterSpacing: '0.26em', color: colors.navy})}>ORDER</div>
        <div style={abs({left: 60, right: 60, top: 118, height: 4, background: colors.navy, opacity: 0.15})} />
        <Field label="Volume" top={170} delay={1.6} fill={62} />
        <Field label="Order price" top={400} delay={2.8} fill={46} />
        <div style={abs({right: 60, top: 600, width: 0, height: 0})} />
        <Draw w={900} h={700} d="M690 628 L728 664 L800 588" stroke={colors.navy} width={16} delay={4.2} dur={0.6} />
        <Pop delay={4.1} style={abs({left: 60, top: 598})}>
          <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 52, color: colors.navy}}>agreed</div>
        </Pop>
      </Card>
    </Pop>
    <Pop delay={4.6} style={abs({left: 0, right: 0, top: 1480, textAlign: 'center'})}>
      <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 44, color: tone('white').dim}}>State the volume. State the price.</div>
    </Pop>
  </Stage>
);

/* ---- 11. Delivered at order price (gold, 4 s) ---------------------------- */
export const S11: React.FC = () => (
  <Stage bg="gold">
    <div style={abs({left: 90, top: 330, width: 900})}>
      <Words bg="gold" size={124} delay={0.1} text="Delivered | at your | [order~price]" />
    </div>
    <Cutout file="fruit-truck" sticker width={740} style={{left: 170, top: 900}} delay={0.9} fromX={320} rise={0} />
  </Stage>
);

/* ---- 12. Pick one (grey, 3 s) -------------------------------------------- */
export const S12: React.FC = () => {
  const labels = ['Termed investment', 'Bring your fruit', 'Documented order'];
  const centers = [215, 540, 865];
  return (
    <Stage bg="grey">
      <div style={abs({left: 90, top: 330, width: 900})}>
        <Words bg="grey" size={100} delay={0.05} text="Three options. | Pick the one that | _fits_ _you._" />
      </div>
      <Draw d="M330 1110 H425 M655 1110 H750" delay={0.9} dur={0.8} stroke={colors.navy} width={8} />
      {centers.map((c, i) => (
        <React.Fragment key={i}>
          <Pop delay={0.6 + i * 0.2} style={abs({left: c - 110, top: 995})}>
            <div style={{width: 220, height: 220, borderRadius: 110, background: colors.pureWhite, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 24px 40px -14px rgba(10,6,50,0.4)'}}>
              <span style={{fontFamily: fonts.caps, fontSize: 130, color: colors.navy, lineHeight: 1}}>{`0${i + 1}`}</span>
            </div>
          </Pop>
          <Pop delay={0.9 + i * 0.2} style={abs({left: c - 150, width: 300, top: 1250, textAlign: 'center'})}>
            <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 36, color: colors.navy}}>{labels[i]}</div>
          </Pop>
        </React.Fragment>
      ))}
    </Stage>
  );
};

/* ---- 13. Call to action (white, 4 s) ------------------------------------- */
const Pill: React.FC<{num: string; top: number; delay: number}> = ({num, top, delay}) => (
  <Pop delay={delay} fromX={-60} rise={16} style={abs({left: 90, top})}>
    <div style={{width: 900, height: 130, borderRadius: 65, background: colors.navy, display: 'flex', alignItems: 'center', gap: 30, padding: '0 48px', boxShadow: '0 24px 44px -16px rgba(10,6,50,0.45)'}}>
      <div style={{width: 30, height: 30, borderRadius: 15, background: colors.gold}} />
      <span style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 62, letterSpacing: '0.02em', color: colors.pureWhite}}>{num}</span>
    </div>
  </Pop>
);
export const S13: React.FC = () => (
  <Stage bg="white">
    <Pop delay={0.05} style={abs({left: 470, top: 230})}>
      <Img src={staticFile('assets/logo-color.png')} style={{width: 140, display: 'block'}} />
    </Pop>
    <div style={abs({left: 90, right: 90, top: 440})}>
      <Words bg="white" size={100} delay={0.2} align="center" text="Call or _WhatsApp_ | Eliakim today." />
    </div>
    <Pill num="+234 803 473 8511" top={820} delay={0.9} />
    <Pill num="+234 802 606 8881" top={990} delay={1.15} />
    <Cutout file="mill-team" height={500} style={{left: 337, top: 1180}} delay={1.5} />
  </Stage>
);

/* ---- 14. Logo end card (navy, 3 s) --------------------------------------- */
export const S14: React.FC = () => {
  const bob = useBreath(5, 3.4);
  const p = useProgress(0.35, spring.slow);
  return (
    <Stage bg="navy">
      <Rings colorA={colors.gold} colorB="#FFFFFF" cx={540} cy={820} delay={0.1} max={1000} />
      <div style={abs({left: 260, top: 520, transform: `translateY(${bob}px) scale(${0.92 + 0.08 * p})`, opacity: Math.min(1, p * 1.4)})}>
        <Img src={staticFile('assets/logo-white.png')} style={{width: 560, display: 'block'}} />
      </div>
      <Pop delay={1.2} style={abs({left: 90, right: 90, top: 1400, textAlign: 'center'})}>
        <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 34, color: tone('navy').dim}}>Investment involves risk. Terms apply.</div>
      </Pop>
    </Stage>
  );
};
