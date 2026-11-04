// Shared drawing code from comp.html (v2): helpers, icons, the five documents, ground.
'use strict';
// ---------- helpers ----------
let CAM, VIEW;
const mat = m => cx.setTransform(m[0] * DPR, m[1] * DPR, m[2] * DPR, m[3] * DPR, m[4] * DPR, m[5] * DPR);
function rrect(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function withBody(o, z, fn) {
  const k = DPR * CAM.zoom;
  cx.save(); mat(VIEW);
  cx.translate(o.x, o.y); cx.rotate(o.rot || 0);
  const s = (o.s || 1) * (1 + 0.42 * z);
  cx.scale(s * (o.sx || 1), s * (o.sy || 1));
  cx.shadowColor = `rgba(40, 10, 40, ${0.26 - 0.1 * z})`;
  cx.shadowBlur = (8 + 70 * z) * k * s;
  cx.shadowOffsetX = (6 + 60 * z) * k * s; cx.shadowOffsetY = (10 + 90 * z) * k * s;
  fn(cx);
  cx.restore();
}
const noShadow = (c = cx) => { c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetX = 0; c.shadowOffsetY = 0; };
function label(c, text, x, y, size, color, font = 'Anton', align = 'left', track = 0) {
  c.font = `${font === 'Anton' ? '' : '500 '}${size}px ${font}`;
  c.fillStyle = color; c.textAlign = align; c.textBaseline = 'alphabetic';
  c.letterSpacing = `${track}px`;
  c.fillText(text, x, y);
}
function lines(c, x, y, w, n, gap, color, widths, th = 8) {
  c.fillStyle = color;
  for (let i = 0; i < n; i++) { const ww = w * (widths ? widths[i % widths.length] : 1); rrect(c, x, y + i * gap, ww, th, th / 2); c.fill(); }
}
function lerpColor(a, b, k) {
  const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], k))).join(',')})`;
}
// circuit traces, as on the references' corners
function circuit(c, x, y, s, col, flip = 1) {
  c.save(); c.translate(x, y); c.scale(s * flip, s); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2.2 / s;
  [[0, 0, 60, 0, 80, -20, 130, -20], [0, 14, 70, 14, 90, -6, 150, -6], [0, 28, 50, 28, 70, 48, 120, 48]].forEach(p => {
    c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.stroke();
    c.beginPath(); c.arc(p[p.length - 2], p[p.length - 1], 4, 0, 7); c.stroke();
  });
  c.restore();
}
// ---------- icons (line, from the references) ----------
const IC = {
  bulb(c, x, y, r, col) { c.save(); c.translate(x, y); c.strokeStyle = col; c.lineWidth = r * 0.12; c.lineCap = 'round';
    c.beginPath(); c.arc(0, -r * 0.15, r * 0.5, Math.PI * 0.8, Math.PI * 0.2); c.lineTo(r * 0.22, r * 0.55); c.lineTo(-r * 0.22, r * 0.55); c.closePath(); c.stroke();
    c.beginPath(); c.moveTo(-r * 0.2, r * 0.75); c.lineTo(r * 0.2, r * 0.75); c.stroke();
    for (const a of [-2.4, -1.57, -0.74]) { c.beginPath(); c.moveTo(Math.cos(a) * r * 0.7, -r * 0.15 + Math.sin(a) * r * 0.7); c.lineTo(Math.cos(a) * r * 0.92, -r * 0.15 + Math.sin(a) * r * 0.92); c.stroke(); }
    c.restore(); },
  hands(c, x, y, r, col) { c.save(); c.translate(x, y); c.strokeStyle = col; c.lineWidth = r * 0.12; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-r * 0.9, -r * 0.1); c.lineTo(-r * 0.45, -r * 0.3); c.lineTo(r * 0.1, r * 0.2); c.lineTo(r * 0.3, r * 0.05); c.stroke();
    c.beginPath(); c.moveTo(r * 0.9, -r * 0.1); c.lineTo(r * 0.45, -r * 0.3); c.lineTo(-r * 0.05, -r * 0.05); c.lineTo(-r * 0.25, r * 0.2); c.lineTo(-r * 0.05, r * 0.4); c.lineTo(r * 0.25, r * 0.35); c.stroke();
    c.restore(); },
  chart(c, x, y, r, col) { c.save(); c.translate(x, y); c.fillStyle = col; c.strokeStyle = col; c.lineWidth = r * 0.1; c.lineCap = 'round';
    [0.3, 0.5, 0.75].forEach((h, i) => c.fillRect(-r * 0.6 + i * r * 0.42, r * 0.55 - h * r, r * 0.28, h * r));
    c.beginPath(); c.moveTo(-r * 0.7, r * 0.0); c.lineTo(-r * 0.2, -r * 0.35); c.lineTo(r * 0.1, -r * 0.2); c.lineTo(r * 0.65, -r * 0.65); c.stroke();
    c.beginPath(); c.moveTo(r * 0.4, -r * 0.68); c.lineTo(r * 0.68, -r * 0.68); c.lineTo(r * 0.68, -r * 0.4); c.stroke(); c.restore(); },
  gear(c, x, y, r, col, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col;
    c.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = i % 2 ? r * 0.8 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill();
    c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(0, 0, r * 0.32, 0, 7); c.fill(); c.restore(); },
  magnifier(c, x, y, r, col) { c.save(); c.translate(x, y); c.strokeStyle = col; c.lineWidth = r * 0.18; c.lineCap = 'round';
    c.beginPath(); c.arc(-r * 0.15, -r * 0.15, r * 0.5, 0, 7); c.stroke(); c.beginPath(); c.moveTo(r * 0.22, r * 0.22); c.lineTo(r * 0.7, r * 0.7); c.stroke(); c.restore(); },
  pie(c, x, y, r, col) { c.save(); c.translate(x, y); c.fillStyle = col;
    c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r * 0.8, -1.2, 3.6); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(r * 0.12, -r * 0.1); c.arc(r * 0.12, -r * 0.1, r * 0.8, -1.57, -1.25); c.closePath(); c.fill(); c.restore(); },
  easel(c, x, y, r, col) { c.save(); c.translate(x, y); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = r * 0.1;
    c.strokeRect(-r * 0.75, -r * 0.6, r * 1.5, r * 0.95); c.beginPath(); c.moveTo(0, r * 0.35); c.lineTo(-r * 0.5, r * 0.9); c.moveTo(0, r * 0.35); c.lineTo(r * 0.5, r * 0.9); c.stroke();
    IC.pie(c, -r * 0.3, -r * 0.13, r * 0.36, col); lines(c, r * 0.05, -r * 0.35, r * 0.5, 3, r * 0.2, col, null, r * 0.08); c.restore(); },
  person(c, x, y, r, col) { c.save(); c.translate(x, y); c.fillStyle = col; c.beginPath(); c.arc(0, -r * 0.3, r * 0.32, 0, 7); c.fill();
    c.beginPath(); c.ellipse(0, r * 0.55, r * 0.6, r * 0.45, 0, Math.PI, 0); c.fill(); c.restore(); },
  tick(c, x, y, r, col) { c.save(); c.translate(x, y); c.strokeStyle = col; c.lineWidth = r * 0.3; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-r * 0.6, 0); c.lineTo(-r * 0.15, r * 0.45); c.lineTo(r * 0.7, -r * 0.5); c.stroke(); c.restore(); },
};

// ---------- 1 · business plan (after the cover reference) ----------
function drawPlan(c, w, h) {
  c.fillStyle = CARD; rrect(c, -w / 2, -h / 2, w, h, 8); c.fill(); noShadow(c);
  c.save(); rrect(c, -w / 2, -h / 2, w, h, 8); c.clip();
  const L = -w / 2, Tp = -h / 2;
  label(c, 'BUSINESS PLAN', L + 26, Tp + 62, 44, INK);
  label(c, 'YOUR COMPANY', L + 26, Tp + 96, 18, MUTE, 'Inter');
  lines(c, L + 26, Tp + 106, 150, 2, 12, LINE, [1, 0.8], 5);
  // logo top-right
  const lh = 100, lw = lh * LOGO.width / LOGO.height; c.drawImage(LOGO, w / 2 - lw - 24, Tp + 84, lw, lh);
  // the segmented fan on the left
  const fx = L - 30, fy = Tp + h * 0.6, R = 250, r0 = 70;
  const segs = [[-1.5, -1.0, INK], [-0.97, -0.5, '#5A585C'], [-0.47, 0, HOT], [0.03, 0.5, '#9A1E9A'], [0.53, 1.0, '#5A585C'], [1.03, 1.5, INK]];
  segs.forEach(([a0, a1, col], i) => {
    const RR = i === 2 || i === 3 ? R * 1.06 : R;
    c.fillStyle = col; c.beginPath(); c.arc(fx, fy, RR, a0, a1); c.arc(fx, fy, r0, a1, a0, true); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.08)'; c.beginPath(); c.moveTo(fx + Math.cos(a0) * r0, fy + Math.sin(a0) * r0); c.lineTo(fx + Math.cos(a1) * RR, fy + Math.sin(a1) * RR); c.lineTo(fx + Math.cos(a0) * RR, fy + Math.sin(a0) * RR); c.closePath(); c.fill();
  });
  // blurred city band
  const bx = fx + R * 0.9, by = fy - 80;
  const g = c.createLinearGradient(0, by, 0, by + 160); g.addColorStop(0, '#BFD3E2'); g.addColorStop(0.55, '#C8CDD1'); g.addColorStop(1, '#7E8A86');
  c.fillStyle = g; c.fillRect(bx, by, w, 160);
  c.fillStyle = 'rgba(120,128,132,0.55)'; [[20, 40, 60], [95, 18, 46], [150, 60, 40]].forEach(([dx, dy, ww]) => c.fillRect(bx + dx, by + dy, ww, 160 - dy));
  // icon dots
  for (let i = 0; i < 5; i++) { c.fillStyle = INK; c.beginPath(); c.arc(w / 2 - 150 + i * 30, by + 196, 11, 0, 7); c.fill(); }
  label(c, 'MARKET · MODEL · FINANCIALS', w / 2 - 22, h / 2 - 34, 15, INK, 'JBM', 'right', 1);
  c.restore();
}
// ---------- 2 · one-page executive summary (after the summary reference) ----------
function drawSummary(c, w, h) {
  c.fillStyle = '#C9C6C9'; rrect(c, -w / 2, -h / 2, w, h, 6); c.fill(); noShadow(c);
  const L = -w / 2, Tp = -h / 2;
  const lh = 66, lw = lh * LOGO.width / LOGO.height; c.drawImage(LOGO, L + 16, Tp + 14, lw, lh);
  label(c, 'Executive', L + 96, Tp + 44, 34, INK, 'Inter');
  label(c, 'Summary', L + 96, Tp + 82, 34, INK, 'Inter');
  c.fillStyle = BG; rrect(c, w / 2 - 90, Tp + 60, 76, 26, 13); c.fill();
  label(c, '1 PAGE', w / 2 - 52, Tp + 78, 13, HOT, 'JBM', 'center', 1);
  const gx = L + 12, gy = Tp + 104, cw = (w - 24) / 2, ch = (h - 116) / 3;
  const cells = [['Vision &', 'Mission', 'bulb'], ['Partner-', 'ship', 'hands'], ['Market', 'Opportunity', 'hands'], ['Financial', 'Overview', 'chart'], ['Key', 'Milestones', 'hands'], ['Operational', 'Roadmap', 'gear']];
  cells.forEach(([a, b, ic], i) => {
    const col = i % 2, row = (i / 2) | 0, purple = (row + col) % 2 === 1;
    const x = gx + col * cw, y = gy + row * ch;
    c.fillStyle = purple ? HOT : INK; c.fillRect(x, y, cw, ch);
    c.fillStyle = '#D9D6D9'; c.beginPath(); c.arc(x + 40, y + ch / 2 + 6, 28, 0, 7); c.fill();
    IC[ic](c, x + 40, y + ch / 2 + 6, 20, INK);
    label(c, a, x + 78, y + 46, 17, '#FFFFFF', 'Inter'); label(c, b, x + 78, y + 66, 17, '#FFFFFF', 'Inter');
    lines(c, x + 78, y + 80, cw - 92, 3, 12, 'rgba(255,255,255,0.45)', [1, 0.8, 0.6], 5);
  });
}
// ---------- 3 · deck slides: white, purple, grey, charcoal, white (after the deck reference) ----------
const SLIDE_BG = ['#FFFFFF', HOT, '#B4B1B4', INK, '#FFFFFF'];
function drawSlide(c, i) {
  const w = SL.w, h = SL.h, L = -w / 2, Tp = -h / 2;
  c.fillStyle = SLIDE_BG[i]; rrect(c, L, Tp, w, h, 8); c.fill(); noShadow(c);
  c.save(); rrect(c, L, Tp, w, h, 8); c.clip();
  const onDark = i === 1 || i === 3, fg = onDark ? '#FFFFFF' : INK;
  circuit(c, w / 2 - 12, Tp + 18, 0.55, onDark ? 'rgba(255,255,255,0.45)' : 'rgba(128,0,128,0.45)', -1);
  if (i === 0) {
    const lh = 92, lw = lh * LOGO.width / LOGO.height; c.drawImage(LOGO, L + 16, Tp + 26, lw, lh);
    label(c, 'MANETRUST', L + 120, Tp + 66, 30, INK); label(c, 'SOLUTIONS', L + 120, Tp + 98, 30, INK);
    label(c, 'PITCH DECK', L + 18, Tp + 146, 15, INK, 'Inter', 'left', 1);
    c.fillStyle = INK; c.fillRect(L, h / 2 - 10, w * 0.6, 10); c.fillStyle = '#8D8A8D'; c.fillRect(L + w * 0.6, h / 2 - 10, w * 0.15, 10); c.fillStyle = HOT; c.fillRect(L + w * 0.75, h / 2 - 10, w * 0.25, 10);
  } else if (i === 1) {
    label(c, 'VISION & MISSION', L + 18, Tp + 44, 30, fg);
    IC.bulb(c, L + 50, Tp + 108, 40, fg);
    for (let k = 0; k < 3; k++) { c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2; rrect(c, L + 102 + k * 74, Tp + 78, 64, 72, 6); c.stroke(); lines(c, L + 110 + k * 74, Tp + 118, 48, 2, 12, 'rgba(255,255,255,0.6)', [1, 0.7], 5); }
  } else if (i === 2) {
    label(c, 'THE CHALLENGE', L + 18, Tp + 44, 30, fg);
    IC.gear(c, L + 70, Tp + 100, 30, INK, 0.3); IC.gear(c, L + 118, Tp + 120, 20, HOT, 0.1); IC.gear(c, L + 210, Tp + 100, 30, '#777', 0.5); IC.gear(c, L + 255, Tp + 122, 18, HOT, 0.2);
    lines(c, L + 18, Tp + 152, w - 60, 2, 14, 'rgba(51,51,51,0.45)', [1, 0.75], 6);
  } else if (i === 3) {
    label(c, 'OUR UNIQUE', L + 18, Tp + 44, 30, fg); label(c, 'SOLUTION', L + 18, Tp + 78, 30, fg);
    c.strokeStyle = '#C77DC7'; c.lineWidth = 2.5;
    for (let k = 0; k < 3; k++) { const bx = L + 200 + (k % 2) * 40, by = Tp + 60 + k * 28; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + 40, by - 16); c.lineTo(bx + 80, by); c.lineTo(bx + 40, by + 16); c.closePath(); c.stroke(); }
    for (let k = 0; k < 3; k++) { c.fillStyle = 'rgba(199,125,199,0.8)'; c.beginPath(); c.arc(L + 26 + k * 70, Tp + 128, 8, 0, 7); c.fill(); lines(c, L + 40 + k * 70, Tp + 122, 40, 2, 12, 'rgba(255,255,255,0.5)', [1, 0.7], 5); }
  } else {
    c.fillStyle = HOT; c.fillRect(L + 14, Tp + 18, 5, 32);
    label(c, 'MARKET & FINANCIALS', L + 28, Tp + 46, 26, fg);
    for (let k = 0; k < 8; k++) { c.fillStyle = k % 2 ? HOT : '#8D8A8D'; const bh = 22 + k * 10; c.fillRect(L + 22 + k * 20, h / 2 - 16 - bh, 14, bh); }
    c.globalAlpha = 0.95; c.fillStyle = HOT; c.beginPath(); c.arc(L + 250, Tp + 118, 50, 0, 7); c.fill();
    c.fillStyle = '#8D8A8D'; c.beginPath(); c.arc(L + 250, Tp + 130, 34, 0, 7); c.fill(); c.fillStyle = INK; c.beginPath(); c.arc(L + 250, Tp + 142, 20, 0, 7); c.fill(); c.globalAlpha = 1;
    label(c, 'TAM', L + 250, Tp + 92, 12, '#fff', 'JBM', 'center'); label(c, 'SAM', L + 250, Tp + 118, 11, '#fff', 'JBM', 'center'); label(c, 'SOM', L + 250, Tp + 146, 10, '#fff', 'JBM', 'center');
  }
  c.restore();
  if (SLIDE_BG[i] === '#FFFFFF') { c.strokeStyle = '#E2DAE2'; c.lineWidth = 2; rrect(c, L, Tp, w, h, 8); c.stroke(); }
}
function drawDeckPile(c) { for (let k = 4; k >= 0; k--) { c.save(); c.translate(k * 7, k * 7); drawSlide(c, k); c.restore(); noShadow(c); } }

// ---------- 4 · the pitch site, built once as a long page (after the landing-page reference) ----------
let SITE, SITE_H = 0;
const SW = 520;
function buildSite() {
  const S = 3, Hp = 2350; SITE_H = Hp;
  SITE = document.createElement('canvas'); SITE.width = SW * S; SITE.height = Hp * S;
  const c = SITE.getContext('2d'); c.scale(S, S);
  const P = (y, h, col) => { c.fillStyle = col; c.fillRect(0, y, SW, h); };
  // header
  P(0, 64, HOT); c.fillStyle = '#fff'; rrect(c, 14, 8, 150, 48, 8); c.fill();
  const lh = 40, lw = lh * LOGO.width / LOGO.height; c.drawImage(LOGO, 22, 12, lw, lh); label(c, 'Manetrust', 22 + lw + 6, 38, 17, INK, 'Inter');
  // hero
  P(64, 300, '#F1EAF1'); circuit(c, SW - 20, 96, 0.9, 'rgba(128,0,128,0.5)', -1); circuit(c, 20, 300, 0.9, 'rgba(128,0,128,0.5)');
  label(c, 'Pitch Landing Page', SW / 2, 190, 44, HOT, 'Inter', 'center');
  label(c, 'Crafting compelling stories that win', SW / 2, 228, 19, INK, 'Inter', 'center');
  c.fillStyle = INK; rrect(c, SW / 2 - 110, 256, 220, 50, 10); c.fill(); label(c, 'Get Your Pitch Today', SW / 2, 288, 17, '#fff', 'Inter', 'center');
  // process
  P(364, 360, '#FFFFFF'); label(c, 'Our Proven Pitch Process', SW / 2, 420, 28, HOT, 'Inter', 'center');
  [['chart', 'Step 1'], ['magnifier', 'Step 2'], ['easel', 'Step 3']].forEach(([ic, s], k) => {
    const x = 90 + k * 170; IC[ic](c, x, 500, 40, k === 1 ? INK : HOT);
    c.fillStyle = k === 2 ? INK : HOT; c.beginPath(); c.moveTo(x - 76, 560); c.lineTo(x + 62, 560); c.lineTo(x + 78, 580); c.lineTo(x + 62, 600); c.lineTo(x - 76, 600); c.lineTo(x - 62, 580); c.closePath(); c.fill();
    label(c, s, x, 588, 17, '#fff', 'Inter', 'center'); lines(c, x - 60, 622, 120, 3, 16, LINE, [1, 0.85, 0.6], 6);
  });
  // testimonials
  P(724, 330, '#F1EAF1'); label(c, 'TESTIMONIALS', SW / 2, 784, 30, HOT, 'Anton', 'center', 1);
  for (let k = 0; k < 3; k++) { const x = 24 + k * 164; c.fillStyle = '#fff'; rrect(c, x, 812, 148, 200, 10); c.fill(); c.fillStyle = '#CFCACF'; c.beginPath(); c.arc(x + 74, 846, 22, 0, 7); c.fill(); IC.person(c, x + 74, 848, 20, '#8D8A8D'); lines(c, x + 16, 886, 116, 5, 16, LINE, [1, 0.9, 1, 0.7, 0.5], 6); }
  // features
  P(1054, 420, '#FFFFFF'); label(c, 'FEATURES & BENEFITS', SW / 2, 1112, 30, HOT, 'Anton', 'center', 1);
  [['pie', 'Data Visualization'], ['bulb', 'Strategic Narrative'], ['easel', 'Compelling Design']].forEach(([ic, s], k) => {
    const y = 1180 + k * 100; IC[ic](c, 70, y, 34, INK); label(c, s, 130, y - 6, 24, HOT, 'Inter'); lines(c, 130, y + 12, 330, 2, 16, LINE, [1, 0.7], 6);
  });
  // plans (no prices invented)
  P(1474, 420, INK); label(c, 'PLANS & PACKAGES', SW / 2, 1532, 28, '#fff', 'Anton', 'center', 1);
  ['Basic', 'Standard', 'Enterprise'].forEach((s, k) => {
    const x = 24 + k * 164; c.fillStyle = '#F4F0F4'; rrect(c, x, 1560, 148, 290, 10); c.fill();
    c.fillStyle = k === 1 ? HOT : '#4A484A'; rrect(c, x, 1560, 148, 70, 10); c.fill(); c.fillRect(x, 1600, 148, 30);
    label(c, s, x + 74, 1604, 21, '#fff', 'Inter', 'center');
    for (let j = 0; j < 4 + (k === 2); j++) { IC.tick(c, x + 20, 1660 + j * 28, 8, HOT); lines(c, x + 34, 1655 + j * 28, 90, 1, 0, '#BDB4BD', null, 7); }
    c.fillStyle = HOT; rrect(c, x + 16, 1800, 116, 34, 7); c.fill(); label(c, 'Get Started', x + 74, 1823, 14, '#fff', 'Inter', 'center');
  });
  // contact
  P(1894, 456, '#FFFFFF'); label(c, 'CONTACT US', SW / 2, 1952, 30, HOT, 'Anton', 'center', 1);
  ['Name', 'Email', 'Phone'].forEach((s, k) => { c.strokeStyle = HOT; c.lineWidth = 2; rrect(c, 24, 1976 + k * 46, 240, 34, 6); c.stroke(); label(c, s, 34, 1999 + k * 46, 13, MUTE, 'Inter'); });
  c.strokeStyle = HOT; rrect(c, 24, 2114, 240, 80, 6); c.stroke(); label(c, 'Message', 34, 2136, 13, MUTE, 'Inter');
  c.fillStyle = HOT; rrect(c, 24, 2206, 240, 38, 6); c.fill(); label(c, 'SUBMIT', 144, 2231, 15, '#fff', 'Inter', 'center', 1);
  c.fillStyle = '#E3EDE3'; rrect(c, 290, 2090, 206, 150, 8); c.fill(); c.strokeStyle = '#F2D46A'; c.lineWidth = 6; c.beginPath(); c.moveTo(300, 2230); c.lineTo(420, 2100); c.stroke();
  c.fillStyle = '#D33'; c.beginPath(); c.arc(400, 2150, 10, 0, 7); c.fill();
  [['Address'], ['Email'], ['Phone']].forEach(([s], k) => { c.fillStyle = HOT; c.beginPath(); c.arc(300, 1990 + k * 30, 7, 0, 7); c.fill(); label(c, s, 316, 1996 + k * 30, 15, INK, 'Inter'); });
  const lh2 = 50, lw2 = lh2 * LOGO.width / LOGO.height; c.drawImage(LOGO, 24, 2270, lw2, lh2); label(c, 'Manetrust Solutions', 24 + lw2 + 10, 2302, 18, INK, 'Inter');
}
function drawTablet(c, t) {
  const w = TAB.w, h = TAB.h;
  c.fillStyle = '#2B2B2B'; rrect(c, -w / 2, -h / 2, w, h, 40); c.fill(); noShadow(c);
  const sw = w - 40, sh = h - 40, L = -sw / 2, Tp = -sh / 2;
  const on = sstep(T.tabHit, T.tabHit + 0.35, t);
  c.fillStyle = '#1A1A1A'; rrect(c, L, Tp, sw, sh, 22); c.fill();
  c.fillStyle = '#111'; c.beginPath(); c.arc(0, -h / 2 + 10, 4, 0, 7); c.fill();
  if (on <= 0) return;
  c.save(); rrect(c, L, Tp, sw, sh, 22); c.clip(); c.globalAlpha = on;
  // the scroll: eased like a flick that decelerates, then an overscroll bounce at the bottom
  const max = SITE_H * (sw / SW) - sh;
  const u = seg(t, T.scroll0, T.scroll1);
  const k = 0.45 * ease.quintOut(seg(u, 0, 0.4)) + 0.55 * ease.quartOut(seg(u, 0.45, 1));
  const over = t > T.scroll1 ? 26 * Math.exp(-6 * (t - T.scroll1)) * Math.sin(Math.min(Math.PI, (t - T.scroll1) * 9)) : 0;
  const y = -(k * max + over);
  c.drawImage(SITE, L, Tp + y, sw, SITE_H * (sw / SW));
  // scroll bar
  c.fillStyle = 'rgba(51,51,51,0.35)'; const bh = sh * sh / (max + sh); rrect(c, sw / 2 - 10, Tp + (k * (sh - bh)), 5, bh, 3); c.fill();
  c.restore(); c.globalAlpha = 1;
}
// ---------- 5 · the pitch video, a glass play button over it ----------
function videoFrame(c, x, y, w, h, t, playing) {
  c.fillStyle = HOT; c.fillRect(x, y, w, h);
  const g = c.createRadialGradient(x + w * 0.7, y + h * 0.2, 10, x + w * 0.6, y + h * 0.3, w); g.addColorStop(0, '#B04AB0'); g.addColorStop(1, 'rgba(128,0,128,0)'); c.fillStyle = g; c.fillRect(x, y, w, h);
  circuit(c, x + w - 14, y + 24, 0.6, 'rgba(255,255,255,0.45)', -1);
  const bob = playing ? Math.sin(t * 5.2) * 3 : 0;
  c.fillStyle = '#F6F1F6'; c.beginPath(); c.arc(x + w * 0.5, y + h * 0.42 + bob, h * 0.15, 0, 7); c.fill();
  c.beginPath(); c.ellipse(x + w * 0.5, y + h * 0.95 + bob, w * 0.32, h * 0.34, 0, Math.PI, 0); c.fill();
  c.fillStyle = INK; c.fillRect(x + w * 0.38, y + h * 0.76 + bob, w * 0.24, h * 0.24);   // jacket
}
function drawPhone(c, t) {
  const w = PHONE.w, h = PHONE.h;
  c.fillStyle = '#2B2B2B'; rrect(c, -w / 2, -h / 2, w, h, 52); c.fill(); noShadow(c);
  const sw = w - 30, sh = h - 30, L = -sw / 2, Tp = -sh / 2;
  const on = sstep(T.phoneHit, T.phoneHit + 0.3, t);
  c.fillStyle = on > 0 ? lerpColor('#1D1D1D', '#F6F1F6', on) : '#1D1D1D'; rrect(c, L, Tp, sw, sh, 40); c.fill();
  c.fillStyle = '#111'; rrect(c, -40, -h / 2 + 26, 80, 18, 9); c.fill();
  if (on <= 0) return;
  c.globalAlpha = on;
  const vx = L + 16, vy = Tp + 64, vw = sw - 32, vh = 330;
  const playing = t >= T.playStart && t < T.playEnd;
  c.save(); rrect(c, vx, vy, vw, vh, 22); c.clip(); videoFrame(c, vx, vy, vw, vh, t, playing); c.restore();
  // the glass play button: blurred copy of the frame behind it, a frosted fill, a bright rim, a highlight
  const pr = OM.press(t, T.playStart, {depth: 0.18});
  const fade = 1 - 0.55 * sstep(T.playStart + 0.15, T.playStart + 0.5, t) + 0.55 * sstep(T.playEnd, T.playEnd + 0.3, t);
  const bx = 0, by = vy + vh * 0.5, R = 62 * (pr.s || 1);
  c.save(); c.globalAlpha = on * fade;
  c.beginPath(); c.arc(bx, by, R, 0, 7); c.clip();
  c.filter = `blur(${10 * DPR * CAM.zoom}px)`; videoFrame(c, vx, vy, vw, vh, t, playing); c.filter = 'none';
  c.fillStyle = 'rgba(255,255,255,0.26)'; c.fillRect(bx - R, by - R, 2 * R, 2 * R);
  const hg = c.createLinearGradient(0, by - R, 0, by + R); hg.addColorStop(0, 'rgba(255,255,255,0.5)'); hg.addColorStop(0.45, 'rgba(255,255,255,0.05)'); hg.addColorStop(1, 'rgba(255,255,255,0.18)');
  c.fillStyle = hg; c.fillRect(bx - R, by - R, 2 * R, 2 * R);
  c.restore();
  c.save(); c.globalAlpha = on * fade;
  c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 3; c.beginPath(); c.arc(bx, by, R - 1.5, 0, 7); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.95)'; c.beginPath(); c.moveTo(bx - 16, by - 26); c.lineTo(bx + 28, by); c.lineTo(bx - 16, by + 26); c.closePath();
  c.shadowColor = 'rgba(60,0,60,0.35)'; c.shadowBlur = 8 * DPR * CAM.zoom; c.fill(); noShadow(c);
  c.restore(); c.globalAlpha = on;
  // title and progress
  const p = ease.smooth(seg(t, T.playStart, T.playEnd));
  label(c, 'PITCH VIDEO', L + 22, vy + vh + 74, 62, INK);
  label(c, 'Manetrust Solutions', L + 24, vy + vh + 110, 22, HOT, 'Inter');
  const ly = vy + vh + 140;
  c.fillStyle = '#DDD2DD'; rrect(c, L + 22, ly, sw - 44, 10, 5); c.fill();
  c.fillStyle = HOT; rrect(c, L + 22, ly, Math.max(10, (sw - 44) * p), 10, 5); c.fill();
  const secs = Math.round(60 * p);
  label(c, secs >= 60 ? '1:00' : `0:${String(secs).padStart(2, '0')}`, L + 22, ly + 44, 24, INK, 'JBM');
  if (secs < 60) label(c, '1:00', sw / 2 - 22, ly + 44, 24, MUTE, 'JBM', 'right');
  c.globalAlpha = 1;
}


// ---------- ground ----------
let PAPER, LOGO;
function ground() {
  cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.fillStyle = BG; cx.fillRect(0, 0, W, H);
  mat(VIEW);
  const tw = 1500, th = tw * 1920 / 1080;
  // mirrored tiles so the seams meet themselves
  for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) {
    cx.save(); cx.translate(-1260 + q * tw + (q % 2) * tw, -900 + r * th + (r % 2) * th); cx.scale(q % 2 ? -1 : 1, r % 2 ? -1 : 1);
    cx.drawImage(PAPER, 0, 0, tw, th); cx.restore();
  }
  const g = cx.createLinearGradient(0, 0, 0, 4200);
  g.addColorStop(0, 'rgba(233,226,233,0.55)'); g.addColorStop(0.35, 'rgba(214,196,214,0.55)'); g.addColorStop(0.62, 'rgba(205,205,210,0.55)'); g.addColorStop(0.85, 'rgba(190,160,190,0.55)'); g.addColorStop(1, 'rgba(233,226,233,0.55)');
  cx.globalCompositeOperation = 'multiply'; cx.fillStyle = g; cx.fillRect(-1200, -1500, 3500, 6400); cx.globalCompositeOperation = 'source-over';
}
function vignette() {
  cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const g = cx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.72);
  g.addColorStop(0, 'rgba(40,10,40,0)'); g.addColorStop(1, 'rgba(40,10,40,0.22)');
  cx.fillStyle = g; cx.fillRect(0, 0, W, H);
}

