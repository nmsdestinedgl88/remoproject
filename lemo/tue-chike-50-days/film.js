// ================= Tuesday: "Chike and the 50 days" =================
// One dot-grid page, drawn stroke by stroke to the recorded voiceover. Purple is the one accent: the cash coin's thread.
const PAGE = { w: 1600, h: 3250 };
const CUE = { n400: 0.12, why: 5.98, s30: 10.66, s40: 12.85, s20: 15.72, sum: 18.41, stuck: 22.10, watch: 25.70, h20: 27.33, h25: 29.0, sum2: 31.65, back: 35.63, depot: 38.95, lender: 41.89, reads: 45.0, cta: 48.54, dm: 55.79, pull: 54.0, done: 56.6 };

// ---------- small drawings ----------
const PU = YEL;   // the accent, purple
function carton(x, y, s, t0) {
  const b = rrect(x - 44 * s, y - 32 * s, 88 * s, 64 * s, 6);
  FILL(b, t0); MRK([b], { col: GRY, w: 10 }, t0 + 0.14, 0.1); MRK([b, shift(b, -5 * s, -6 * s)], { col: GRY2, w: 8 }, t0 + 0.2, 0.06);
  INK_(b, { closed: true, w: 2.8, amp: 0.8 }, t0, 0.18);
  INK_(line(x - 44 * s, y - 10 * s, x + 44 * s, y - 10 * s), { w: 2, amp: 0.4, passes: 1 }, t0 + 0.14, 0.05);
  MST(line(x - 14 * s, y - 32 * s, x - 14 * s, y - 10 * s), { w: 8 * s, col: PU }, t0 + 0.2, 0.05);
  return t0 + 0.3;
}
function coin(x, y, r, t0, d = 0.3) {
  const c = ell(x, y, r, r, 0, TAU, 40);
  FILL(c, t0); MRK([c], { col: PU, w: 12 }, t0 + d * 0.5, d * 0.5); MRK([c, shift(c, -r * 0.2, -r * 0.24)], { col: YELS, w: 8 }, t0 + d * 0.8, d * 0.2);
  INK_(c, { closed: true, w: 3.2, amp: 0.7 }, t0, d * 0.6);
  INK_(ell(x, y, r * 0.72, r * 0.72, 0, TAU, 30), { w: 1.8, amp: 0.4, passes: 1, alpha: 0.7 }, t0 + d * 0.4, d * 0.4);
  TXT('N', x, y + r * 0.34, r * 1.05, { f: 'KB', align: 'center', jit: 0.4, col: '#ffffff' }, t0 + d * 0.8, d * 0.3);
  INK_(line(x - r * 0.42, y - r * 0.1, x + r * 0.42, y - r * 0.1), { w: 2.4, amp: 0.2, passes: 1, col: '#ffffff' }, t0 + d * 0.95, 0.04);
  INK_(line(x - r * 0.42, y + r * 0.14, x + r * 0.42, y + r * 0.14), { w: 2.4, amp: 0.2, passes: 1, col: '#ffffff' }, t0 + d * 0.98, 0.04);
  return t0 + d;
}
// Chike: a sketch figure. pose: 'shrug' | 'point' | 'thumbs' | 'carry'
function chike(cx, cy, s, pose, t0, k = 1) {
  const S = (x, y) => [cx + x * s, cy + y * s];
  const head = ell(cx, cy - 118 * s, 30 * s, 33 * s, 0, TAU, 50);
  FILL(head, t0); INK_(head, { closed: true, w: 3, amp: 0.7 }, t0, 0.12 * k);
  // short hair
  MRK([ell(cx, cy - 128 * s, 32 * s, 26 * s, Math.PI, TAU, 24)], { col: INKM(0.85), w: 6, edge: false, op: 'source-over' }, t0 + 0.1 * k, 0.06);
  // face
  const ey = cy - 120 * s; const eye = (x) => MRK([ell(cx + x * s, ey, 3.2 * s, 3.8 * s, 0, TAU, 12)], { col: INKM(0.9), w: 5, edge: false, op: 'source-over' }, t0 + 0.14 * k, 0.03);
  eye(-10); eye(10);
  if (pose === 'shrug') { INK_(bez(S(-10, -100), S(-4, -106), S(4, -106), S(10, -100), 12), { w: 2.2, amp: 0.2, passes: 1 }, t0 + 0.16 * k, 0.04); INK_(line(cx - 16 * s, cy - 134 * s, cx - 5 * s, cy - 131 * s), { w: 2, amp: 0.1, passes: 1 }, t0 + 0.16 * k, 0.03); INK_(line(cx + 16 * s, cy - 134 * s, cx + 5 * s, cy - 131 * s), { w: 2, amp: 0.1, passes: 1 }, t0 + 0.16 * k, 0.03); }
  else INK_(bez(S(-11, -106), S(-5, -97), S(5, -97), S(11, -106), 12), { w: 2.2, amp: 0.2, passes: 1 }, t0 + 0.16 * k, 0.04);
  // torso + apron
  const torso = [S(-30, -82), S(30, -82), S(26, 0), S(-26, 0)];
  const apron = [S(-22, -70), S(22, -70), S(26, 0), S(-26, 0)];
  FILL(torso, t0 + 0.18 * k); MRK([torso], { col: GRY, w: 12 }, t0 + 0.26 * k, 0.1 * k); MRK([apron], { col: PU, w: 10 }, t0 + 0.32 * k, 0.08 * k);
  INK_(torso, { closed: true, w: 3, amp: 0.8 }, t0 + 0.18 * k, 0.12 * k); INK_(apron, { closed: true, w: 2.4, amp: 0.5, passes: 1 }, t0 + 0.3 * k, 0.08 * k);
  // legs
  INK_([S(-12, 0), S(-14, 62), S(-30, 66)], { w: 3.2, amp: 0.6 }, t0 + 0.36 * k, 0.08 * k); INK_([S(12, 0), S(14, 62), S(30, 66)], { w: 3.2, amp: 0.6 }, t0 + 0.38 * k, 0.08 * k);
  // arms
  const arm = (pts, i) => INK_(pts, { w: 3.2, amp: 0.7 }, t0 + (0.42 + i * 0.04) * k, 0.08 * k);
  if (pose === 'shrug') { arm([S(-28, -76), S(-62, -52), S(-78, -86)], 0); arm([S(28, -76), S(62, -52), S(78, -86)], 1); INK_(ell(cx - 80 * s, cy - 92 * s, 7 * s, 7 * s), { closed: true, w: 2, amp: 0.2, passes: 1 }, t0 + 0.5 * k, 0.04); INK_(ell(cx + 80 * s, cy - 92 * s, 7 * s, 7 * s), { closed: true, w: 2, amp: 0.2, passes: 1 }, t0 + 0.52 * k, 0.04); }
  if (pose === 'point') { arm([S(28, -76), S(100, -78)], 0); arm([S(-28, -76), S(-48, -30), S(-26, -22)], 1); INK_(line(cx + 100 * s, cy - 78 * s, cx + 118 * s, cy - 78 * s), { w: 2.6, amp: 0.2, passes: 1 }, t0 + 0.5 * k, 0.04); }
  if (pose === 'thumbs') { arm([S(28, -76), S(62, -92), S(66, -128)], 0); arm([S(-28, -76), S(-48, -30), S(-26, -22)], 1); INK_(line(cx + 66 * s, cy - 128 * s, cx + 66 * s, cy - 148 * s), { w: 5 * s + 1, amp: 0.2, passes: 1 }, t0 + 0.5 * k, 0.04); }
  if (pose === 'carry') { arm([S(-28, -76), S(-52, -40), S(-16, -22)], 0); arm([S(28, -76), S(52, -40), S(16, -22)], 1); carton(cx, cy - 26 * s, 0.9 * s, t0 + 0.5 * k); }
  // ground shadow
  MRK([ell(cx, cy + 68 * s, 46 * s, 8 * s)], { col: GRY, w: 8, edge: false }, t0 + 0.44 * k, 0.06);
  return t0 + 0.6 * k;
}
function clock(x, y, r, t0) {
  const c = ell(x, y, r, r, 0, TAU, 40); FILL(c, t0); MRK([c], { col: GRY, w: 10 }, t0 + 0.12, 0.08); INK_(c, { closed: true, w: 3, amp: 0.6 }, t0, 0.14);
  INK_([[x, y - r * 0.7], [x, y], [x + r * 0.45, y + r * 0.2]], { w: 2.6, amp: 0.2, passes: 1 }, t0 + 0.16, 0.08);
  return t0 + 0.26;
}
function invoice(x, y, w, h, t0) {
  const b = rrect(x, y, w, h, 14); dropShadow(b, 8, 9, t0 + 0.2, 0.1); FILL(b, t0); INK_(b, { closed: true, w: 3.2, amp: 1 }, t0, 0.22);
  for (let i = 0; i < 4; i++) INK_(line(x + 28, y + 100 + i * 46, x + w - 28 - (i % 2) * 50, y + 100 + i * 46), { w: 2.4, amp: 0.4, passes: 1, alpha: 0.7 }, t0 + 0.2 + i * 0.05, 0.08);
  TXT('INVOICE', x + w / 2, y + 62, 44, { f: 'KB', align: 'center', jit: 0.6 }, t0 + 0.12, 0.3);
  return t0 + 0.5;
}
function bar(x0, x1, y, h, label, t0, d, col, o = {}) {
  const b = rrect(x0, y, x1 - x0, h, 12);
  FILL(b, t0); MRK([b], { col, w: 16, ang: o.ang ?? -0.4 }, t0 + d * 0.3, d * 0.6);
  INK_(b, { closed: true, w: 3.2, amp: 1 }, t0, d * 0.5);
  if (label) TXT(label, (x0 + x1) / 2, y + h / 2 + (o.sz || 46) * 0.34, o.sz || 46, { f: o.f || 'KB', align: 'center', jit: 0.6 }, t0 + d * 0.5, d * 0.6);
  return t0 + d;
}
function bracket(x0, x1, y, t0, d = 0.5) {
  INK_([[x0, y - 22], [x0, y], [x1, y], [x1, y - 22]], { w: 3.4, amp: 1 }, t0, d);
  return t0 + d;
}
function bank(cx, cy, s, t0) {
  const roof = [[cx - 70 * s, cy - 40 * s], [cx, cy - 86 * s], [cx + 70 * s, cy - 40 * s]];
  FILL(roof, t0); MRK([roof], { col: GRY2, w: 10 }, t0 + 0.12, 0.08); INK_(roof, { closed: true, w: 3, amp: 0.6 }, t0, 0.12);
  [-50, -17, 17, 50].forEach((x, i) => { const c = rrect(cx + (x - 9) * s, cy - 34 * s, 18 * s, 66 * s, 3); FILL(c, t0 + 0.1 + i * 0.03); MRK([c], { col: GRY, w: 8 }, t0 + 0.2 + i * 0.03, 0.05); INK_(c, { closed: true, w: 2.4, amp: 0.4, passes: 1 }, t0 + 0.1 + i * 0.03, 0.06); });
  INK_([[cx - 76 * s, cy + 38 * s], [cx + 76 * s, cy + 38 * s]], { w: 4, amp: 0.4 }, t0 + 0.3, 0.08);
  return t0 + 0.45;
}
function depot(cx, cy, s, label, t0, o = {}) {
  const body = rrect(cx - 100 * s, cy - 50 * s, 200 * s, 110 * s, 6), roof = [[cx - 112 * s, cy - 50 * s], [cx, cy - 104 * s], [cx + 112 * s, cy - 50 * s]];
  dropShadow(body, 7, 8, t0 + 0.3, 0.08); FILL(body, t0); MRK([body], { col: o.fill || GRY, w: 12 }, t0 + 0.2, 0.15); INK_(body, { closed: true, w: 3, amp: 0.8 }, t0, 0.2);
  FILL(roof, t0 + 0.12); MRK([roof], { col: o.roof || GRY2, w: 10 }, t0 + 0.28, 0.1); INK_(roof, { closed: true, w: 3, amp: 0.8 }, t0 + 0.12, 0.16);
  const door = rrect(cx - 26 * s, cy - 4 * s, 52 * s, 64 * s, 4); FILL(door, t0 + 0.24); MRK([door], { col: GRYD, w: 8 }, t0 + 0.32, 0.06); INK_(door, { closed: true, w: 2.6, amp: 0.4, passes: 1 }, t0 + 0.24, 0.08);
  if (label) TXT(label, cx, cy - 18 * s + 0, 30 * s, { f: 'KB', align: 'center', jit: 0.5, col: o.tcol || INK }, t0 + 0.36, 0.3);
  return t0 + 0.6;
}
function clipboard(x, y, w, h, t0) {
  const b = rrect(x, y, w, h, 16); dropShadow(b, 8, 9, t0 + 0.25, 0.1); FILL(b, t0); INK_(b, { closed: true, w: 3.2, amp: 0.9 }, t0, 0.22);
  const clip = rrect(x + w / 2 - 40, y - 16, 80, 36, 8); FILL(clip, t0 + 0.14); MRK([clip], { col: GRY2, w: 10 }, t0 + 0.24, 0.06); INK_(clip, { closed: true, w: 2.8, amp: 0.4, passes: 1 }, t0 + 0.14, 0.08);
  return t0 + 0.4;
}
function phone(cx, cy, s, t0) {
  const b = rrect(cx - 42 * s, cy - 76 * s, 84 * s, 152 * s, 14 * s); FILL(b, t0); MRK([b], { col: GRY, w: 10 }, t0 + 0.12, 0.08); INK_(b, { closed: true, w: 3.2, amp: 0.6 }, t0, 0.18);
  const sc = rrect(cx - 34 * s, cy - 58 * s, 68 * s, 104 * s, 6); FILL(sc, t0 + 0.14); INK_(sc, { closed: true, w: 2, amp: 0.3, passes: 1 }, t0 + 0.14, 0.08);
  const bub = rrect(cx - 28 * s, cy - 40 * s, 56 * s, 30 * s, 10); MRK([bub], { col: PU, w: 8 }, t0 + 0.22, 0.08); INK_(bub, { closed: true, w: 2, amp: 0.3, passes: 1 }, t0 + 0.22, 0.08);
  return t0 + 0.4;
}

// ---------- the page ----------
function buildPage() {
  const W_ = '#ffffff';
  // B1: 400 cartons, Chike, a late invoice (y 80-540)
  TXT('400', 330, 300, 230, { f: 'KB', align: 'center', jit: 0.6 }, 0.12, 1.2);
  MST(bez([150, 346], [260, 364], [400, 352], [520, 338], 16), { w: 16, col: PU, amp: 3 }, 1.4, 0.35);
  TXT('cartons a month', 340, 430, 62, { f: 'PH', align: 'center' }, 1.5, 0.8);
  carton(640, 450, 1.1, 1.9); carton(724, 450, 1.1, 2.0); carton(682, 388, 1.1, 2.1);
  chike(900, 470, 1.1, 'shrug', 2.2);
  invoice(1090, 90, 330, 380, 3.3);
  clock(1330, 140, 52, 4.1);
  ribbon(1255, 500, 250, 76, 'LATE', 44, 4.35, { fill: PU, td: 0.4, tcol: W_ });
  // B2: why / the question (y 600-900)
  ribbon(800, 650, 300, 96, 'WHY?', 62, CUE.why, { fill: PU, td: 0.45, tcol: W_ });
  TXT('CASH CONVERSION', 800, 800, 88, { f: 'KB', align: 'center', jit: 0.7 }, 6.7, 1.6);
  TXT('CYCLE', 800, 890, 88, { f: 'KB', align: 'center', jit: 0.7 }, 8.3, 0.7);
  MST(bez([590, 914], [720, 930], [880, 910], [1010, 922], 20), { w: 16, col: PU, amp: 3 }, 9.0, 0.35);
  // B3: the 50-day cycle (card y 990-1560)
  const X = d => 250 + d * 14.2;
  box(130, 990, 1340, 570, 10.1, 0.45);
  TXT('THE OLD CYCLE', 360, 1062, 56, { f: 'KB', align: 'left' }, 10.3, 0.5);
  bar(X(0), X(30), 1100, 96, 'STOCK 30', CUE.s30, 1.1, GRY, { sz: 52 });
  bar(X(30), X(70), 1100, 96, 'SHOPS PAY 40', CUE.s40, 1.3, GRY2, { ang: 0.4, sz: 52 });
  TXT('-', 190, 1290, 90, { f: 'KB', align: 'center' }, CUE.s20 - 0.1, 0.2);
  bar(X(0), X(20), 1230, 80, 'SUPPLIER 20', CUE.s20, 1.0, GRYD, { sz: 40, ang: 0.9 });
  bracket(X(20), X(70), 1380, CUE.sum, 0.5);
  TXT('30 + 40 - 20 =', 560, 1480, 80, { f: 'KB', align: 'center', jit: 0.6 }, CUE.sum + 0.3, 1.5);
  TXT('50', 860, 1496, 130, { f: 'KB', align: 'center', jit: 0.5, col: '#5a005a' }, CUE.sum + 1.7, 0.7);
  MST(ell(860, 1458, 96, 74, 0.2, TAU + 0.1, 40, -0.1), { w: 9, col: PU, amp: 2 }, CUE.sum + 2.4, 0.45);
  coin(X(20) + 40, 1380 - 36, 28, CUE.stuck, 0.4);
  TXT('cash sits elsewhere', 1170, 1450, 56, { f: 'PH', align: 'center', col: INK2 }, CUE.stuck + 0.5, 0.9);
  inkArrow(bez([X(20) + 74, 1344], [X(30), 1330], [X(55), 1332], [X(70) - 20, 1340], 24), { w: 3, amp: 0.8, dash: [12, 9] }, CUE.stuck + 0.4, 1.2);
  chike(1390, 1060, 0.45, 'point', 18.5);
  // B3 -> B4: watch
  fatArrow(560, 1612, 700, CUE.watch, { h: 26, hh: 32, hl: 32 });
  TXT('WATCH', 860, 1630, 66, { f: 'KB', align: 'center', jit: 0.7 }, CUE.watch + 0.2, 0.45);
  // B4: the 25-day cycle (card y 1670-2180)
  box(130, 1680, 1340, 500, CUE.watch + 0.7, 0.45);
  TXT('THE NEW CYCLE', 360, 1752, 56, { f: 'KB', align: 'left' }, CUE.watch + 1.1, 0.5);
  bar(X(0), X(20), 1790, 96, 'STOCK 20', CUE.h20, 1.1, GRY, { sz: 52 });
  bar(X(20), X(45), 1790, 96, 'SHOPS PAY 25', CUE.h25, 1.3, GRY2, { ang: 0.4, sz: 46 });
  TXT('-', 190, 1980, 90, { f: 'KB', align: 'center' }, 30.2, 0.2);
  bar(X(0), X(20), 1920, 80, 'SUPPLIER 20', 30.3, 0.6, GRYD, { sz: 40, ang: 0.9 });
  bracket(X(20), X(45), 2060, CUE.sum2, 0.4);
  TXT('20 + 25 - 20 =', 560, 2150, 80, { f: 'KB', align: 'center', jit: 0.6 }, CUE.sum2 + 0.3, 1.5);
  TXT('25', 860, 2166, 130, { f: 'KB', align: 'center', jit: 0.5, col: '#5a005a' }, CUE.sum2 + 1.8, 0.6);
  MST(ell(860, 2128, 90, 72, 0.2, TAU + 0.1, 40, -0.1), { w: 9, col: PU, amp: 2 }, CUE.sum2 + 2.4, 0.45);
  // cash comes back: the coin leaves the bracket and runs down to the new depot
  coin(X(45) - 6, 2060 - 38, 28, CUE.back, 0.3);
  inkArrow(bez([X(45) + 30, 2050], [1180, 2090], [1290, 2260], [1130, 2330], 30), { w: 4, amp: 0.8 }, CUE.back + 0.3, 0.9);
  TXT('cash back 25 days sooner', 1230, 2250, 52, { f: 'PH', align: 'center', col: INK2 }, CUE.back + 0.8, 1.0);
  // B5: depot 2 (left, y 2280-2620)
  depot(330, 2500, 1.0, '', CUE.depot - 0.8, { fill: GRY, roof: GRY2 });
  depot(640, 2500, 1.25, 'DEPOT 2', CUE.depot + 0.3, { fill: PU, roof: GRYD, tcol: W_ });
  chike(150, 2530, 0.8, 'thumbs', CUE.depot + 1.0);
  // B6: the lender reads the numbers (right, y 2300-2680)
  clipboard(950, 2330, 330, 360, CUE.lender);
  TXT('PROJECTIONS', 1115, 2410, 40, { f: 'KB', align: 'center', jit: 0.5 }, CUE.lender + 0.4, 0.6);
  INK_(line(990, 2450, 1240, 2450), { w: 2, amp: 0.3, passes: 1 }, CUE.lender + 1.0, 0.1);
  [[1010, 90], [1090, 55], [1170, 118]].forEach(([x, h], i) => MRK([rrect(x, 2670 - h, 50, h, 4)], { col: i === 2 ? PU : GRY, w: 8 }, CUE.lender + 1.1 + i * 0.2, 0.2));
  bank(1420, 2500, 0.9, CUE.reads);
  MST([[1380, 2520], [1404, 2544], [1450, 2480]], { w: 10, col: PU, amp: 1 }, CUE.reads + 0.6, 0.3);
  // B7: the call to action (y 2750-3080)
  ribbon(800, 2810, 560, 100, 'MANETRUST', 70, CUE.cta, { fill: PU, td: 0.7, tcol: W_ });
  box(120, 2900, 640, 100, 50.0, 0.4); TXT('PROJECTIONS', 440, 2970, 56, { f: 'KB', align: 'center' }, 50.3, 0.7);
  box(840, 2900, 640, 100, 52.9, 0.4); TXT('BUSINESS PLAN', 1160, 2970, 56, { f: 'KB', align: 'center' }, 53.2, 0.8);
  fatArrow(780, 2950, 840, 52.6, { h: 16, hh: 22, hl: 20 });
  ribbon(900, 3120, 380, 104, 'DM US', 72, CUE.dm, { fill: PU, td: 0.4, tcol: W_ });
  phone(560, 3120, 0.8, CUE.dm - 0.15);
}

// ---------- camera: one world -> screen function ----------
const CAM = [
  [0.0, 330, 290, 2.15], [2.2, 380, 330, 1.9], [3.0, 760, 330, 1.35], [4.9, 1180, 300, 1.3],        // 400, Chike, the late invoice
  [5.7, 800, 740, 1.2, 'whip'], [9.8, 800, 780, 1.15],                                                // why / the question
  [10.3, 800, 1290, 0.8, 'whip'], [22.0, 800, 1330, 0.84],                                            // the old cycle
  [25.4, 800, 1950, 0.8, 'whip'], [35.2, 780, 1990, 0.84],                                            // the new cycle
  [36.2, 900, 2080, 1.9], [38.0, 700, 2440, 1.05],                                                    // cash comes back, down to the depot
  [41.5, 1180, 2460, 1.02], [42.6, 1110, 2460, 1.7], [44.5, 1115, 2480, 1.6],                          // the lender's clipboard (dive)
  [45.2, 1300, 2490, 1.35], [47.9, 1330, 2500, 1.3],                                                  // the bank reads it
  [48.3, 800, 2860, 1.05], [53.4, 800, 2930, 1.02],                                                   // the call to action
  [56.6, 800, 1760, 0.41], [58.0, 800, 1760, 0.41]];                                                  // pull back to the whole page
