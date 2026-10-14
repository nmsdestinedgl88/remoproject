import React from 'react';
import {useCurrentFrame} from 'remotion';
import A from './anchors.json';
import {C, FONT, Layout} from './tokens';

const VO: Record<string, string> = {
  S1: 'With diabetes, a wound takes longer to heal.',
  S2: 'That includes the wound from surgery. A long incision means more skin to mend, and more chance of infection while it does.',
  S3: 'Minimal access surgery uses a few small openings instead of one long cut. A camera and fine instruments do the work inside.',
  S4: 'For suitable procedures, it can mean less pain, a smaller wound to heal, lower risk of wound infection and a shorter hospital stay. A smaller wound gives slow healing less to repair.',
  S5: 'Before any procedure, our team reviews your blood sugar, medicines and general health. Your surgeon then tells you whether minimal access surgery suits your case.',
  S6: 'Ava Consultants and Urology Centre, off the Four-Lane, Uyo. Call the number on screen to book.',
};

type Tok = {text: string; s: number; e: number};
export const buildPages = (limit: number) => {
  const pages: Tok[][] = [];
  let cur: Tok[] = [];
  for (const sc of Object.keys(VO)) {
    const toks = VO[sc].split(' ');
    const ws = A.words.filter((w) => w.scene === sc);
    toks.forEach((text, i) => {
      const w = ws[Math.min(i, ws.length - 1)];
      const len = cur.map((t) => t.text).join(' ').length + text.length + 1;
      if (cur.length && len > limit) { pages.push(cur); cur = []; }
      cur.push({text, s: w.s, e: w.e});
      const endSentence = /[.]$/.test(text);
      const comma = /,$/.test(text) && cur.map((t) => t.text).join(' ').length > limit * 0.6;
      if (endSentence || comma) { pages.push(cur); cur = []; }
    });
    if (cur.length) { pages.push(cur); cur = []; }
  }
  return pages;
};

export const CaptionTrack: React.FC<{L: Layout}> = ({L}) => {
  const f = useCurrentFrame();
  const pages = React.useMemo(() => buildPages(L.L ? 96 : 60), [L.L]);
  const idx = pages.findIndex((pg, i) => f >= pg[0].s && (i === pages.length - 1 ? f <= pg[pg.length - 1].e + 20 : f < pages[i + 1][0].s) && f <= pg[pg.length - 1].e + 24);
  return (
    <div style={{position: 'absolute', left: 0, top: L.cap.y - 12, width: L.W, height: L.cap.h + 12, background: C.bone}}>
      {idx >= 0 && (
        <div style={{position: 'absolute', left: L.mx - 10, top: 12, width: L.W - 2 * L.mx + 20, display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', fontFamily: FONT.body, fontWeight: 700, fontSize: L.sz.caption, lineHeight: 1.3}}>
          {pages[idx].map((t, i) => {
            const active = f >= t.s && f < (pages[idx][i + 1] ? pages[idx][i + 1].s : t.e + 4);
            return (
              <span key={i} style={{padding: '0 10px', marginRight: 0, background: active ? C.green : 'transparent', color: active ? C.paper : C.ink, whiteSpace: 'pre'}}>
                {t.text}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
