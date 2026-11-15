// ================= Friday: "Femi's fortieth shop" =================
const FILM_DUR = 58.4;
const CUE = { s1a: 0.28, s1b: 3.80, doc: 7.15, a: 9.81, b: 12.88, c: 16.54, write: 20.89, sa: 23.00, sb: 28.31, sc: 30.82, six: 34.24, seven: 41.28, cta: 46.23, cta2: 51.56, dm: 56.23,
  wh1: 6.6, wh2: 9.2, wh3: 20.3, wh4: 22.4, wh5: 33.6, wh6: 40.7, wh7: 45.6, wh8: 53.2 };
function buildPage() {
  // B1: shop 40 against shop 1, the chicken tastes different
  shop(1290, 270, 1.5, 'SHOP 40', CUE.s1a + 0.1); chicken(1290, 530, 1.2, CUE.s1a + 0.8, { col: PU });
  figure(800, 470, 1.0, 'thumbs', CUE.s1a + 1.3, { hair: 'hat' });
  shop(320, 270, 1.5, 'SHOP 1', CUE.s1b + 0.1); chicken(320, 530, 1.2, CUE.s1b + 0.8, { col: GRY2 });
  TXT('=', 800, 160, 90, { f: 'KB', align: 'center' }, CUE.s1b + 1.6, 0.3); MST(line(750, 190, 850, 60), { w: 12, col: PU, amp: 1 }, CUE.s1b + 1.9, 0.2);
  // B2: one missing document
  ribbon(700, 660, 700, 90, 'ONE MISSING DOCUMENT', 50, CUE.doc, { fill: PU, td: 0.9, tcol: W_ });
  docIcon(1290, 560, 150, 190, CUE.doc + 0.4, 3, { dash: [10, 8] }); TXT('?', 1365, 700, 110, { f: 'KB', align: 'center', col: '#5a005a' }, CUE.doc + 1.0, 0.3);
  // B3: from one pair of hands to forty ways
  box(130, 780, 1340, 560, 9.3, 0.45);
  TXT("FEMI'S WAY", 360, 850, 50, { f: 'KB', align: 'center' }, CUE.a - 0.2, 0.6);
  figure(260, 1170, 0.9, 'point', CUE.a + 0.5, { hair: 'hat' });
  const pot = [[380, 1130], [380, 1190], [400, 1210], [500, 1210], [520, 1190], [520, 1130]]; FILL(pot, CUE.a + 1.2); MRK([pot], { col: GRYD, w: 10 }, CUE.a + 1.4, 0.2); INK_(pot, { closed: true, w: 3.2, amp: 0.7 }, CUE.a + 1.2, 0.3);
  MST(bez([420, 1100], [410, 1060], [440, 1050], [430, 1010], 14), { w: 6, col: PU, amp: 1 }, CUE.a + 1.8, 0.2); MST(bez([470, 1100], [460, 1060], [490, 1050], [480, 1010], 14), { w: 6, col: PU, amp: 1 }, CUE.a + 1.9, 0.2);
  inkArrow(bez([560, 1150], [640, 1130], [700, 1130], [760, 1150], 16), { w: 3, amp: 0.6, dash: [10, 8] }, CUE.b + 0.2, 0.7);
  MST(line(740, 1100, 800, 1190), { w: 14, col: PU, amp: 1 }, CUE.b + 1.0, 0.2); MST(line(800, 1100, 740, 1190), { w: 14, col: PU, amp: 1 }, CUE.b + 1.15, 0.2);
  TXT('NOBODY COPIES HIS HANDS', 640, 1290, 48, { f: 'KB', align: 'center', jit: 0.6 }, CUE.b + 0.9, 1.6);
  const marks = [[[0, 0], [14, -18], [28, 0]], [[0, 0], [10, 10], [20, -10], [30, 4]], [[0, -10], [28, -10], [28, 10], [0, 10]], [[0, 0], [30, 0]], [[0, 0], [14, 14], [28, 0], [14, -14], [0, 0]], [[0, 10], [14, -14], [28, 10]]];
  for (let i = 0; i < 6; i++) { const cx = 880 + (i % 3) * 190, cy = 960 + Math.floor(i / 3) * 190, tt = CUE.c + i * 0.55; shop(cx, cy, 0.62, '', tt, {}); INK_(marks[i].map(([a, b]) => [cx + a - 14, cy - 82 + b]), { w: 3, amp: 0.5, passes: 1, col: PU }, tt + 0.3, 0.2); }
  // B4: write it down
  ribbon(800, 1440, 560, 90, 'WRITE IT DOWN', 54, CUE.write, { fill: PU, td: 0.7, tcol: W_ });
  figure(300, 1530, 0.55, 'write', CUE.write + 0.2, { hair: 'hat' });
  // B5: the SOP sheet and what it did
  docIcon(170, 1600, 540, 560, CUE.sa - 0.4, 0);
  ribbon(440, 1640, 220, 70, 'SOP', 46, CUE.sa - 0.1, { fill: PU, td: 0.3, tcol: W_ });
  scaleIcon(280, 1790, 0.55, CUE.sa + 1.0); TXT('SEASONING', 400, 1800, 44, { f: 'KB', align: 'left', jit: 0.5 }, CUE.sa + 1.1, 0.6);
  timerIcon(280, 1930, 0.55, CUE.sa + 2.4); TXT('FRY TIME', 400, 1950, 44, { f: 'KB', align: 'left', jit: 0.5 }, CUE.sa + 2.5, 0.5);
  tallyIcon(280, 2070, 0.55, CUE.sa + 3.4); TXT('STOCK COUNT', 400, 2090, 44, { f: 'KB', align: 'left', jit: 0.5 }, CUE.sa + 3.5, 0.7);
  fatArrow(740, 1760, 840, CUE.sb + 0.1, { h: 24, hh: 30, hl: 28 });
  [0, 1, 2].forEach(i => { const cx = 950 + i * 190; shop(cx, 1740, 0.6, '', CUE.sb + 0.4 + i * 0.35); docIcon(cx - 30, 1610, 60, 70, CUE.sb + 0.9 + i * 0.35, 2); });
  TXT('SAME SHEET', 1140, 1880, 54, { f: 'KB', align: 'center', jit: 0.5 }, CUE.sb + 1.0, 0.8);
  const bw = 120; const wx = 980, rx = 1250, by = 2170;
  MRK([rrect(wx, by - 150, bw, 150, 6)], { col: GRY, w: 10, edge: false }, CUE.sc, 0.2); INK_(rrect(wx, by - 150, bw, 150, 6), { closed: true, w: 2.4, amp: 0.4, passes: 1, dash: [8, 6] }, CUE.sc, 0.3);
  MRK([rrect(wx, by - 70, bw, 70, 6)], { col: GRYD, w: 10 }, CUE.sc + 0.3, 0.3); INK_(rrect(wx, by - 70, bw, 70, 6), { closed: true, w: 3, amp: 0.4 }, CUE.sc + 0.3, 0.3);
  TXT('WASTE', wx + 60, by + 52, 44, { f: 'KB', align: 'center', jit: 0.5 }, CUE.sc + 0.4, 0.4); inkArrow([[wx + 60, by - 190], [wx + 60, by - 160]], { w: 4, amp: 0.2, col: PU }, CUE.sc + 0.6, 0.2);
  INK_(rrect(rx, by - 70, bw, 70, 6), { closed: true, w: 2.4, amp: 0.4, passes: 1, dash: [8, 6] }, CUE.sc + 0.9, 0.3);
  MRK([rrect(rx, by - 150, bw, 150, 6)], { col: PU, w: 10 }, CUE.sc + 1.2, 0.4); INK_(rrect(rx, by - 150, bw, 150, 6), { closed: true, w: 3, amp: 0.4 }, CUE.sc + 1.2, 0.3);
  TXT('REPEAT ORDERS', rx + 60, by + 52, 40, { f: 'KB', align: 'center', jit: 0.5 }, CUE.sc + 1.3, 0.8); inkArrow([[rx + 60, by - 210], [rx + 60, by - 250]], { w: 4, amp: 0.2, col: PU }, CUE.sc + 1.5, 0.2);
  // B6: where to plan systems
  const ny = 2400; INK_(line(200, ny, 1400, ny), { w: 4, amp: 1 }, CUE.six, 0.8);
  [[200, '0'], [560, '50'], [720, '70'], [1340, '300+']].forEach(([x, l], i) => { INK_(line(x, ny - 14, x, ny + 14), { w: 3, amp: 0.2, passes: 1 }, CUE.six + 0.6 + i * 0.1, 0.05); TXT(l, x, ny + 62, 46, { f: 'KB', align: 'center', jit: 0.5 }, CUE.six + 0.8 + i * 0.1, 0.35); });
  TXT('OUTLETS', 800, ny + 130, 40, { f: 'PH', align: 'center', col: INK2 }, CUE.six + 1.2, 0.5);
  MRK([rrect(560, ny - 26, 160, 52, 8)], { col: PU, w: 12 }, CUE.six + 4.6, 0.5); TXT('PLAN SYSTEMS HERE', 640, ny - 66, 50, { f: 'KB', align: 'center', jit: 0.6, col: '#5a005a' }, CUE.six + 4.4, 1.3);
  // B7: forty shops need capital for sixty
  [0, 1, 2, 3, 4].forEach(i => shop(230 + i * 170, 2670, 0.55, '', CUE.seven + 0.2 + i * 0.15));
  [0, 1, 2].forEach(i => { const cx = 1080 + i * 170; const b = rrect(cx - 33, 2640, 66, 44, 4); INK_(b, { closed: true, w: 2.6, amp: 0.4, passes: 1, dash: [8, 6] }, CUE.seven + 2.2 + i * 0.2, 0.3); });
  coin(1550, 2650, 34, CUE.seven + 2.6, 0.4);
  TXT('40 SHOPS', 540, 2810, 58, { f: 'KB', align: 'center', jit: 0.5 }, CUE.seven + 0.6, 0.8); TXT('CAPITAL FOR 60', 1200, 2810, 58, { f: 'KB', align: 'center', jit: 0.5 }, CUE.seven + 2.4, 1.2);
  // B8: call to action
  ribbon(800, 2960, 560, 100, 'MANETRUST', 70, CUE.cta, { fill: PU, td: 0.7, tcol: W_ });
  box(120, 3040, 440, 100, 47.4, 0.4); TXT('SOPS', 340, 3110, 56, { f: 'KB', align: 'center' }, 47.7, 0.5);
  box(580, 3040, 440, 100, 51.8, 0.4); TXT('BUSINESS PLAN', 800, 3110, 48, { f: 'KB', align: 'center' }, 52.1, 0.7);
  box(1040, 3040, 440, 100, 53.6, 0.4); TXT('PROJECTIONS', 1260, 3110, 48, { f: 'KB', align: 'center' }, 53.9, 0.7);
  ribbon(900, 3280, 380, 104, 'DM US', 72, CUE.dm, { fill: PU, td: 0.4, tcol: W_ });
  phone(560, 3280, 0.8, CUE.dm - 0.15);
}
const CAM = [
  [0.0, 800, 380, 1.0], [3.3, 800, 380, 1.0],
  [6.5, 720, 700, 1.15, 'whip'], [9.0, 700, 720, 1.1],
  [9.3, 800, 1140, 0.85, 'whip'], [20.0, 800, 1160, 0.88],
  [20.5, 700, 1490, 1.1, 'whip'], [22.3, 700, 1520, 1.05],
  [22.5, 800, 1900, 0.85, 'whip'], [33.0, 800, 1930, 0.88],
  [33.6, 800, 2470, 0.95, 'whip'], [40.5, 800, 2480, 0.95],
  [41.0, 800, 2700, 0.95, 'whip'], [45.4, 800, 2720, 0.95],
  [45.8, 800, 3080, 1.0], [55.0, 800, 3180, 0.9],
  [57.0, 800, 1750, 0.37], [58.4, 800, 1750, 0.37]];
