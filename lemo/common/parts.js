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


// ---------- shared parts for the other films ----------
// figure: a sketch person. opts: hair 'short' | 'bun' | 'cap' | 'hat' | 'scarf'; pose 'stand' | 'shrug' | 'point' | 'thumbs' | 'carry' | 'write' | 'tape'
function figure(cx, cy, s, pose, t0, o = {}) {
  const k = o.k || 1, hair = o.hair || 'short';
  const S = (x, y) => [cx + x * s, cy + y * s];
  const head = ell(cx, cy - 118 * s, 30 * s, 33 * s, 0, TAU, 50);
  FILL(head, t0); INK_(head, { closed: true, w: 3, amp: 0.7 }, t0, 0.12 * k);
  if (hair === 'short') MRK([ell(cx, cy - 128 * s, 32 * s, 26 * s, Math.PI, TAU, 24)], { col: INKM(0.85), w: 6, edge: false, op: 'source-over' }, t0 + 0.1 * k, 0.06);
  if (hair === 'bun') { MRK([ell(cx, cy - 128 * s, 32 * s, 26 * s, Math.PI, TAU, 24)], { col: INKM(0.85), w: 6, edge: false, op: 'source-over' }, t0 + 0.1 * k, 0.06); const bun = ell(cx, cy - 158 * s, 14 * s, 12 * s, 0, TAU, 20); MRK([bun], { col: INKM(0.85), w: 6, edge: false, op: 'source-over' }, t0 + 0.12 * k, 0.05); INK_(bun, { closed: true, w: 2.4, amp: 0.3, passes: 1 }, t0 + 0.12 * k, 0.05); }
  if (hair === 'scarf') { const sc = ell(cx, cy - 126 * s, 34 * s, 30 * s, Math.PI * 0.95, TAU * 1.03, 28); MRK([sc], { col: PU, w: 7, edge: false }, t0 + 0.1 * k, 0.06); INK_(sc, { w: 2.6, amp: 0.4, passes: 1 }, t0 + 0.1 * k, 0.06); INK_(bez(S(26, -134), S(50, -128), S(52, -108), S(40, -96), 14), { w: 2.6, amp: 0.3, passes: 1 }, t0 + 0.12 * k, 0.05); }
  if (hair === 'hat') { const hat = [S(-24, -140), S(-30, -168), S(-12, -186), S(0, -178), S(12, -186), S(30, -168), S(24, -140)]; FILL(hat, t0 + 0.1 * k); MRK([hat], { col: GRY, w: 8 }, t0 + 0.14 * k, 0.05); INK_(hat, { closed: true, w: 2.8, amp: 0.5, passes: 1 }, t0 + 0.1 * k, 0.08); }
  if (hair === 'cap') { const cp = ell(cx, cy - 134 * s, 32 * s, 20 * s, Math.PI, TAU, 24); MRK([cp], { col: PU, w: 8, edge: false }, t0 + 0.1 * k, 0.06); INK_(cp, { w: 2.6, amp: 0.4, passes: 1 }, t0 + 0.1 * k, 0.06); }
  const ey = cy - 120 * s; const eye = x => MRK([ell(cx + x * s, ey, 3.2 * s, 3.8 * s, 0, TAU, 12)], { col: INKM(0.9), w: 5, edge: false, op: 'source-over' }, t0 + 0.14 * k, 0.03);
  eye(-10); eye(10);
  if (pose === 'shrug') INK_(bez(S(-10, -100), S(-4, -106), S(4, -106), S(10, -100), 12), { w: 2.2, amp: 0.2, passes: 1 }, t0 + 0.16 * k, 0.04);
  else INK_(bez(S(-11, -106), S(-5, -97), S(5, -97), S(11, -106), 12), { w: 2.2, amp: 0.2, passes: 1 }, t0 + 0.16 * k, 0.04);
  const dress = o.dress;
  const torso = dress ? [S(-30, -82), S(30, -82), S(44, 30), S(-44, 30)] : [S(-30, -82), S(30, -82), S(26, 0), S(-26, 0)];
  const apron = [S(-22, -70), S(22, -70), S(26, dress ? 30 : 0), S(-26, dress ? 30 : 0)];
  FILL(torso, t0 + 0.18 * k); MRK([torso], { col: GRY, w: 12 }, t0 + 0.26 * k, 0.1 * k); MRK([apron], { col: o.apron || PU, w: 10 }, t0 + 0.32 * k, 0.08 * k);
  INK_(torso, { closed: true, w: 3, amp: 0.8 }, t0 + 0.18 * k, 0.12 * k); INK_(apron, { closed: true, w: 2.4, amp: 0.5, passes: 1 }, t0 + 0.3 * k, 0.08 * k);
  const ly = dress ? 30 : 0;
  INK_([S(-12, ly), S(-14, 62), S(-30, 66)], { w: 3.2, amp: 0.6 }, t0 + 0.36 * k, 0.08 * k); INK_([S(12, ly), S(14, 62), S(30, 66)], { w: 3.2, amp: 0.6 }, t0 + 0.38 * k, 0.08 * k);
  const arm = (pts, i) => INK_(pts, { w: 3.2, amp: 0.7 }, t0 + (0.42 + i * 0.04) * k, 0.08 * k);
  if (pose === 'stand') { arm([S(-28, -76), S(-48, -30), S(-26, -22)], 0); arm([S(28, -76), S(48, -30), S(26, -22)], 1); }
  if (pose === 'shrug') { arm([S(-28, -76), S(-62, -52), S(-78, -86)], 0); arm([S(28, -76), S(62, -52), S(78, -86)], 1); }
  if (pose === 'point') { arm([S(28, -76), S(100, -78)], 0); arm([S(-28, -76), S(-48, -30), S(-26, -22)], 1); }
  if (pose === 'thumbs') { arm([S(28, -76), S(62, -92), S(66, -128)], 0); arm([S(-28, -76), S(-48, -30), S(-26, -22)], 1); INK_(line(cx + 66 * s, cy - 128 * s, cx + 66 * s, cy - 148 * s), { w: 5 * s + 1, amp: 0.2, passes: 1 }, t0 + 0.5 * k, 0.04); }
  if (pose === 'carry') { arm([S(-28, -76), S(-52, -40), S(-16, -22)], 0); arm([S(28, -76), S(52, -40), S(16, -22)], 1); carton(cx, cy - 26 * s, 0.9 * s, t0 + 0.5 * k); }
  if (pose === 'write') { arm([S(28, -76), S(60, -50), S(40, -20)], 0); arm([S(-28, -76), S(-50, -40), S(-30, -20)], 1); }
  if (pose === 'tape') { arm([S(-28, -76), S(-60, -50), S(-86, -60)], 0); arm([S(28, -76), S(60, -50), S(86, -60)], 1); INK_(bez(S(-86, -60), S(-30, -40), S(30, -40), S(86, -60), 20), { w: 2.4, amp: 0.4, passes: 1, dash: [8, 6] }, t0 + 0.52 * k, 0.1); }
  MRK([ell(cx, cy + 68 * s, 46 * s, 8 * s)], { col: GRY, w: 8, edge: false }, t0 + 0.44 * k, 0.06);
  return t0 + 0.6 * k;
}
function shop(cx, cy, s, label, t0, o = {}) {
  const body = rrect(cx - 60 * s, cy - 30 * s, 120 * s, 80 * s, 4), awn = [[cx - 70 * s, cy - 30 * s], [cx - 56 * s, cy - 64 * s], [cx + 56 * s, cy - 64 * s], [cx + 70 * s, cy - 30 * s]];
  FILL(body, t0); MRK([body], { col: o.fill || GRY, w: 10 }, t0 + 0.14, 0.08); INK_(body, { closed: true, w: 2.8, amp: 0.6 }, t0, 0.14);
  FILL(awn, t0 + 0.08); MRK([awn], { col: o.awn || PU, w: 10 }, t0 + 0.2, 0.08); INK_(awn, { closed: true, w: 2.8, amp: 0.5 }, t0 + 0.08, 0.1);
  const d = rrect(cx - 14 * s, cy + 6 * s, 28 * s, 44 * s, 3); INK_(d, { closed: true, w: 2.2, amp: 0.3, passes: 1 }, t0 + 0.16, 0.06);
  if (label) TXT(label, cx, cy + 88 * s + 14, 30 * Math.max(0.9, s), { f: 'KB', align: 'center', jit: 0.5, col: o.tcol || INK }, t0 + 0.24, 0.3);
  return t0 + 0.5;
}
function chicken(cx, cy, s, t0, o = {}) {
  const meat = ell(cx, cy, 34 * s, 26 * s, 0, TAU, 40, -0.5);
  FILL(meat, t0); MRK([meat], { col: o.col || GRY2, w: 10 }, t0 + 0.12, 0.08); INK_(meat, { closed: true, w: 3, amp: 0.7 }, t0, 0.14);
  INK_([[cx + 22 * s, cy - 26 * s], [cx + 46 * s, cy - 52 * s]], { w: 5 * s + 1, amp: 0.3, passes: 1 }, t0 + 0.14, 0.06);
  INK_(ell(cx + 52 * s, cy - 56 * s, 7 * s, 7 * s), { closed: true, w: 2.4, amp: 0.2, passes: 1 }, t0 + 0.18, 0.05);
  return t0 + 0.3;
}
function docIcon(x, y, w, h, t0, nl = 4, o = {}) {
  const b = rrect(x, y, w, h, 10); dropShadow(b, 7, 8, t0 + 0.2, 0.08); FILL(b, t0); INK_(b, { closed: true, w: 3, amp: 0.8, dash: o.dash }, t0, 0.2);
  for (let i = 0; i < nl; i++) INK_(line(x + 20, y + 56 + i * 36, x + w - 20 - (i % 2) * 40, y + 56 + i * 36), { w: 2.2, amp: 0.3, passes: 1, alpha: 0.7 }, t0 + 0.2 + i * 0.04, 0.06);
  return t0 + 0.45;
}
function shield(cx, cy, s, t0, tick = true) {
  const p = [[cx - 50 * s, cy - 56 * s], [cx, cy - 72 * s], [cx + 50 * s, cy - 56 * s], [cx + 48 * s, cy + 6 * s], [cx, cy + 66 * s], [cx - 48 * s, cy + 6 * s]];
  FILL(p, t0); MRK([p], { col: GRY, w: 10 }, t0 + 0.14, 0.08); INK_(p, { closed: true, w: 3, amp: 0.6 }, t0, 0.16);
  if (tick) MST([[cx - 22 * s, cy - 2 * s], [cx - 6 * s, cy + 16 * s], [cx + 26 * s, cy - 24 * s]], { w: 12 * s, col: PU, amp: 1 }, t0 + 0.2, 0.2);
  return t0 + 0.4;
}
function laptop(cx, cy, s, t0) {
  const sc = rrect(cx - 62 * s, cy - 46 * s, 124 * s, 82 * s, 6), base = [[cx - 80 * s, cy + 40 * s], [cx + 80 * s, cy + 40 * s], [cx + 66 * s, cy + 54 * s], [cx - 66 * s, cy + 54 * s]];
  FILL(sc, t0); MRK([sc], { col: GRY, w: 10 }, t0 + 0.12, 0.06); INK_(sc, { closed: true, w: 3, amp: 0.5 }, t0, 0.14); INK_(base, { closed: true, w: 3, amp: 0.4 }, t0 + 0.1, 0.1);
  INK_(line(cx - 36 * s, cy - 16 * s, cx + 36 * s, cy - 16 * s), { w: 2.4, amp: 0.2, passes: 1, col: PU }, t0 + 0.2, 0.05);
  return t0 + 0.35;
}
function pie(cx, cy, r, frac, t0, d = 0.6) {
  const c = ell(cx, cy, r, r, 0, TAU, 50);
  FILL(c, t0); MRK([c], { col: GRY, w: 14 }, t0 + d * 0.3, d * 0.4); INK_(c, { closed: true, w: 3.4, amp: 0.8 }, t0, d * 0.4);
  const w = [[cx, cy]]; for (let i = 0; i <= 30; i++) { const a = -Math.PI / 2 + frac * TAU * i / 30; w.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  MRK([w], { col: PU, w: 12 }, t0 + d * 0.6, d * 0.4); INK_(w, { closed: true, w: 3, amp: 0.6 }, t0 + d * 0.6, d * 0.3);
  return t0 + d;
}
function oven(cx, cy, s, t0) {
  const b = rrect(cx - 80 * s, cy - 60 * s, 160 * s, 130 * s, 10), win = rrect(cx - 56 * s, cy - 24 * s, 112 * s, 74 * s, 6);
  dropShadow(b, 8, 9, t0 + 0.3, 0.08); FILL(b, t0); MRK([b], { col: GRY, w: 12 }, t0 + 0.14, 0.1); INK_(b, { closed: true, w: 3.2, amp: 0.7 }, t0, 0.18);
  FILL(win, t0 + 0.14); MRK([win], { col: PU, w: 10 }, t0 + 0.22, 0.1); INK_(win, { closed: true, w: 2.6, amp: 0.4, passes: 1 }, t0 + 0.14, 0.1);
  [-50, -16, 18].forEach((x, i) => INK_(ell(cx + x * s, cy - 42 * s, 7 * s, 7 * s), { closed: true, w: 2.4, amp: 0.2, passes: 1 }, t0 + 0.2 + i * 0.03, 0.04));
  return t0 + 0.4;
}
function chefHat(cx, cy, s, t0) {
  const p = [[cx - 40 * s, cy + 30 * s], [cx - 48 * s, cy - 10 * s], [cx - 34 * s, cy - 38 * s], [cx - 12 * s, cy - 44 * s], [cx, cy - 56 * s], [cx + 12 * s, cy - 44 * s], [cx + 34 * s, cy - 38 * s], [cx + 48 * s, cy - 10 * s], [cx + 40 * s, cy + 30 * s]];
  FILL(p, t0); MRK([p], { col: GRY, w: 10 }, t0 + 0.12, 0.08); INK_(p, { closed: true, w: 3, amp: 0.7 }, t0, 0.16);
  INK_(line(cx - 40 * s, cy + 12 * s, cx + 40 * s, cy + 12 * s), { w: 2.4, amp: 0.3, passes: 1 }, t0 + 0.16, 0.05);
  return t0 + 0.3;
}
function shirt(cx, cy, s, t0) {
  const p = [[cx - 30 * s, cy - 70 * s], [cx - 78 * s, cy - 40 * s], [cx - 60 * s, cy - 8 * s], [cx - 42 * s, cy - 22 * s], [cx - 42 * s, cy + 70 * s], [cx + 42 * s, cy + 70 * s], [cx + 42 * s, cy - 22 * s], [cx + 60 * s, cy - 8 * s], [cx + 78 * s, cy - 40 * s], [cx + 30 * s, cy - 70 * s], [cx, cy - 52 * s]];
  dropShadow(p, 7, 8, t0 + 0.3, 0.08); FILL(p, t0); MRK([p], { col: PU, w: 12 }, t0 + 0.14, 0.12); INK_(p, { closed: true, w: 3.2, amp: 0.7 }, t0, 0.2);
  [-10, 6, 22].forEach((y, i) => INK_(ell(cx, cy + y * s, 3 * s, 3 * s), { closed: true, w: 2, amp: 0.1, passes: 1, col: '#ffffff' }, t0 + 0.2 + i * 0.03, 0.03));
  return t0 + 0.4;
}
function scissors(cx, cy, s, t0) {
  INK_(line(cx - 40 * s, cy - 30 * s, cx + 40 * s, cy + 30 * s), { w: 4, amp: 0.3, passes: 1 }, t0, 0.1); INK_(line(cx - 40 * s, cy + 30 * s, cx + 40 * s, cy - 30 * s), { w: 4, amp: 0.3, passes: 1 }, t0 + 0.04, 0.1);
  INK_(ell(cx + 52 * s, cy + 40 * s, 14 * s, 14 * s), { closed: true, w: 3, amp: 0.2, passes: 1 }, t0 + 0.1, 0.06); INK_(ell(cx + 52 * s, cy - 40 * s, 14 * s, 14 * s), { closed: true, w: 3, amp: 0.2, passes: 1 }, t0 + 0.12, 0.06);
  return t0 + 0.25;
}
function needle(cx, cy, s, t0) {
  INK_(line(cx - 50 * s, cy + 40 * s, cx + 50 * s, cy - 40 * s), { w: 4, amp: 0.2, passes: 1 }, t0, 0.1); INK_(ell(cx + 40 * s, cy - 32 * s, 5 * s, 9 * s, 0, TAU, 14, 0.7), { closed: true, w: 2.2, amp: 0.1, passes: 1 }, t0 + 0.08, 0.04);
  MST(bez([cx + 40 * s, cy - 32 * s], [cx + 70 * s, cy - 10 * s], [cx - 10 * s, cy + 10 * s], [cx - 30 * s, cy + 50 * s], 24), { w: 5, col: PU, amp: 1 }, t0 + 0.1, 0.2);
  return t0 + 0.3;
}
function tapeIcon(cx, cy, s, t0) {
  const p = [[cx - 60 * s, cy - 14 * s], [cx + 60 * s, cy - 14 * s], [cx + 60 * s, cy + 14 * s], [cx - 60 * s, cy + 14 * s]];
  FILL(p, t0); MRK([p], { col: PU, w: 8 }, t0 + 0.1, 0.08); INK_(p, { closed: true, w: 3, amp: 0.5 }, t0, 0.14);
  for (let i = -5; i <= 5; i++) INK_(line(cx + i * 11 * s, cy - 14 * s, cx + i * 11 * s, cy - (i % 5 === 0 ? 2 : 6) * s), { w: 1.8, amp: 0.1, passes: 1 }, t0 + 0.14 + (i + 5) * 0.01, 0.02);
  return t0 + 0.3;
}
function scaleIcon(cx, cy, s, t0) {
  INK_(line(cx, cy - 56 * s, cx, cy + 50 * s), { w: 3, amp: 0.3, passes: 1 }, t0, 0.08); INK_(line(cx - 56 * s, cy - 40 * s, cx + 56 * s, cy - 40 * s), { w: 3, amp: 0.3, passes: 1 }, t0 + 0.05, 0.08);
  INK_(line(cx - 30 * s, cy + 50 * s, cx + 30 * s, cy + 50 * s), { w: 4, amp: 0.3, passes: 1 }, t0 + 0.08, 0.06);
  [-1, 1].forEach((d, i) => { const pan = [[cx + d * 56 * s - 26 * s, cy - 6 * s], [cx + d * 56 * s + 26 * s, cy - 6 * s], [cx + d * 56 * s + 16 * s, cy + 12 * s], [cx + d * 56 * s - 16 * s, cy + 12 * s]]; MRK([pan], { col: i ? PU : GRY2, w: 8 }, t0 + 0.14, 0.06); INK_(pan, { closed: true, w: 2.4, amp: 0.3, passes: 1 }, t0 + 0.1, 0.08); INK_(line(cx + d * 56 * s, cy - 40 * s, cx + d * 56 * s - 20 * s, cy - 6 * s), { w: 2, amp: 0.1, passes: 1 }, t0 + 0.12, 0.04); INK_(line(cx + d * 56 * s, cy - 40 * s, cx + d * 56 * s + 20 * s, cy - 6 * s), { w: 2, amp: 0.1, passes: 1 }, t0 + 0.12, 0.04); });
  return t0 + 0.3;
}
function timerIcon(cx, cy, s, t0) {
  const c = ell(cx, cy + 6 * s, 44 * s, 44 * s, 0, TAU, 40); FILL(c, t0); MRK([c], { col: GRY, w: 10 }, t0 + 0.1, 0.08); INK_(c, { closed: true, w: 3, amp: 0.5 }, t0, 0.14);
  INK_(line(cx, cy - 38 * s, cx, cy - 52 * s), { w: 5, amp: 0.1, passes: 1 }, t0 + 0.1, 0.04); INK_([[cx, cy + 6 * s], [cx, cy - 26 * s]], { w: 3, amp: 0.1, passes: 1 }, t0 + 0.16, 0.05); INK_([[cx, cy + 6 * s], [cx + 22 * s, cy + 16 * s]], { w: 3, amp: 0.1, passes: 1 }, t0 + 0.18, 0.05);
  return t0 + 0.3;
}
function tallyIcon(cx, cy, s, t0) {
  [-30, -10, 10, 30].forEach((x, i) => INK_(line(cx + x * s, cy - 34 * s, cx + x * s, cy + 34 * s), { w: 4, amp: 0.2, passes: 1 }, t0 + i * 0.05, 0.06));
  INK_(line(cx - 42 * s, cy + 20 * s, cx + 42 * s, cy - 20 * s), { w: 4, amp: 0.2, passes: 1, col: PU }, t0 + 0.22, 0.08);
  return t0 + 0.35;
}
function dots(x0, y0, cols, rows, gx, gy, hot, t0, per = 0.06) {
  let i = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++, i++) {
    const x = x0 + c * gx, y = y0 + r * gy, isHot = hot.includes(i), s = isHot ? 1.25 : 1, tt = t0 + i * per;
    const h = ell(x, y - 18 * s, 11 * s, 11 * s, 0, TAU, 14), b = [[x - 18 * s, y + 24 * s], [x - 14 * s, y + 4 * s], [x + 14 * s, y + 4 * s], [x + 18 * s, y + 24 * s]];
    FILL(h, tt); MRK([h], { col: isHot ? PU : GRY2, w: 8, edge: false }, tt + 0.06, 0.05); INK_(h, { closed: true, w: 2.4, amp: 0.3, passes: 1 }, tt, 0.06);
    MRK([b], { col: isHot ? PU : GRY2, w: 8, edge: false }, tt + 0.06, 0.05); INK_(b, { w: 2.4, amp: 0.3, passes: 1 }, tt + 0.02, 0.06);
  }
  return t0 + i * per;
}
function tickRow(x, y, text, size, t0, o = {}) {
  const c = ell(x, y - size * 0.3, size * 0.4, size * 0.4, 0, TAU, 24); FILL(c, t0); MRK([c], { col: PU, w: 8, edge: false }, t0 + 0.06, 0.05); INK_(c, { closed: true, w: 2.6, amp: 0.3, passes: 1 }, t0, 0.08);
  INK_([[x - size * 0.18, y - size * 0.3], [x - size * 0.04, y - size * 0.16], [x + size * 0.2, y - size * 0.46]], { w: 4, amp: 0.2, passes: 1, col: '#ffffff' }, t0 + 0.08, 0.06);
  return TXT(text, x + size * 0.7, y, size, { f: o.f || 'KB', align: 'left', jit: 0.6, col: o.col || INK }, t0 + 0.12, o.d || 0.7);
}
function swash(x0, x1, y, t0, d = 0.35) { return MST(bez([x0, y + 6], [x0 + (x1 - x0) * 0.3, y + 18], [x0 + (x1 - x0) * 0.7, y - 2], [x1, y + 8], 18), { w: 14, col: PU, amp: 3 }, t0, d); }
function loop(cx, cy, rx, ry, t0, d = 0.45) { return MST(ell(cx, cy, rx, ry, 0.2, TAU + 0.1, 40, -0.1), { w: 9, col: PU, amp: 2 }, t0, d); }
const W_ = '#ffffff';
