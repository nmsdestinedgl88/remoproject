// ================= Thursday: "Rose and the 7 percent window" =================
const FILM_DUR = 66.5;
const CUE = { hook: 0.27, almost: 2.58, prog: 4.27, a: 5.75, b: 12.02, c: 17.94, d: 22.55, bake: 26.59, eats: 28.84, p25: 31.59, m5: 34.48, p7: 38.72, m14: 42.96, oven: 46.65, plan: 50.49, cta: 54.15, appr: 60.07, paper: 61.94, dm: 63.83,
  wh1: 3.9, wh2: 5.2, wh3: 26.0, wh4: 30.9, wh5: 46.0, wh6: 49.8, wh7: 53.5, wh8: 61.2 };
function buildPage() {
  // B1: "7%" and the window Rose nearly walked past
  TXT('7%', 420, 330, 320, { f: 'KB', align: 'center', jit: 0.6, col: '#5a005a' }, CUE.hook, 1.1);
  swash(200, 640, 372, 1.4); TXT('a year', 430, 460, 70, { f: 'PH', align: 'center' }, 1.6, 0.7);
  const win = rrect(1000, 120, 480, 340, 16); dropShadow(win, 9, 10, 2.8, 0.1); FILL(win, 2.4); INK_(win, { closed: true, w: 3.4, amp: 1 }, 2.4, 0.3);
  ribbon(1240, 230, 330, 84, 'LOAN 7%', 46, 2.8, { fill: PU, td: 0.4, tcol: W_ });
  figure(820, 520, 1.1, 'shrug', CUE.almost, { hair: 'bun', dress: true });
  inkArrow(bez([700, 590], [820, 640], [960, 640], [1040, 580], 24), { w: 3, amp: 0.8, dash: [10, 8] }, CUE.almost + 0.8, 0.8);
  // B2: the programme
  ribbon(800, 650, 560, 90, 'THE PROGRAMME', 56, CUE.prog, { fill: PU, td: 0.6, tcol: W_ });
  // B3: what GLOW offers
  box(130, 740, 1340, 700, 5.0, 0.45);
  ribbon(800, 810, 380, 84, 'BOI GLOW', 52, 5.6, { fill: PU, td: 0.5, tcol: W_ });
  tickRow(210, 960, 'WOMEN-LED, REGISTERED', 56, 6.9, { d: 1.4 });
  tickRow(210, 1070, '7% A YEAR', 64, CUE.b + 0.5, { d: 0.8, col: '#5a005a' });
  tickRow(210, 1180, 'UP TO 50 MILLION NAIRA', 54, CUE.b + 2.7, { d: 1.4 });
  shield(255, 1256, 0.62, CUE.c + 0.6); TXT('25% GUARANTEE', 360, 1292, 56, { f: 'KB', align: 'left', jit: 0.6 }, CUE.c + 1.0, 0.9);
  laptop(255, 1386, 0.5, CUE.d + 0.3); TXT('APPLY AT boi.ng', 360, 1400, 56, { f: 'KB', align: 'left', jit: 0.6 }, CUE.d + 0.7, 0.9);
  // B4: the bakery and the loan that eats the profit
  depot(330, 1700, 1.1, 'BAKERY', CUE.bake, { fill: GRY, roof: GRYD });
  figure(700, 1750, 0.95, 'shrug', CUE.bake + 0.9, { hair: 'bun', dress: true });
  TXT('PROFIT', 1180, 1540, 58, { f: 'KB', align: 'center', jit: 0.6 }, CUE.eats, 0.6);
  pie(1180, 1710, 150, 0.4, CUE.eats + 0.2, 1.0);
  TXT('LOAN', 1250, 1730, 48, { f: 'KB', align: 'center', jit: 0.5, col: W_ }, CUE.eats + 1.1, 0.5);
  // B5: the sum on 20 million naira
  box(130, 1950, 1340, 570, 31.0, 0.45);
  TXT('ON 20 MILLION NAIRA', 800, 2030, 56, { f: 'KB', align: 'center' }, CUE.m5 - 0.2, 1.2);
  TXT('25%', 450, 2200, 130, { f: 'KB', align: 'center', jit: 0.5 }, CUE.p25 + 0.1, 0.7);
  TXT('5 MILLION', 450, 2320, 78, { f: 'KB', align: 'center', jit: 0.6 }, CUE.m5 + 1.2, 1.0);
  TXT('a year', 450, 2380, 52, { f: 'PH', align: 'center' }, CUE.m5 + 2.4, 0.4);
  TXT('7%', 1050, 2200, 130, { f: 'KB', align: 'center', jit: 0.5, col: '#5a005a' }, CUE.p7 + 0.1, 0.6); loop(1050, 2166, 100, 78, CUE.p7 + 0.9);
  TXT('1.4 MILLION', 1050, 2320, 78, { f: 'KB', align: 'center', jit: 0.6 }, CUE.p7 + 1.6, 1.0);
  TXT('a year', 1050, 2380, 52, { f: 'PH', align: 'center' }, CUE.p7 + 2.8, 0.4);
  TXT('GAP: 3.6 MILLION A YEAR', 800, 2470, 62, { f: 'KB', align: 'center', jit: 0.6, col: '#5a005a' }, CUE.m14 + 0.6, 1.6); swash(300, 1300, 2492, CUE.m14 + 2.2);
  // B6: a second oven and two bakers
  oven(300, 2730, 1.1, CUE.oven);
  chefHat(580, 2690, 0.9, CUE.oven + 0.9); chefHat(720, 2690, 0.9, CUE.oven + 1.3);
  TXT('2ND OVEN', 300, 2840, 50, { f: 'KB', align: 'center', jit: 0.5 }, CUE.oven + 0.5, 0.5); TXT('2 BAKERS', 650, 2790, 50, { f: 'KB', align: 'center', jit: 0.5 }, CUE.oven + 1.6, 0.5);
  // B7: a bankable plan before she applies
  clipboard(1000, 2590, 360, 330, CUE.plan);
  TXT('BANKABLE', 1180, 2680, 42, { f: 'KB', align: 'center', jit: 0.5 }, CUE.plan + 0.4, 0.5); TXT('PLAN', 1180, 2735, 42, { f: 'KB', align: 'center', jit: 0.5 }, CUE.plan + 0.9, 0.3);
  MST([[1100, 2810], [1150, 2860], [1260, 2750]], { w: 16, col: PU, amp: 1 }, CUE.plan + 1.4, 0.4);
  figure(1480, 2760, 0.8, 'point', CUE.plan + 1.8, { hair: 'bun', dress: true });
  // B8: the call to action
  ribbon(800, 3010, 560, 100, 'MANETRUST', 70, CUE.cta, { fill: PU, td: 0.7, tcol: W_ });
  box(120, 3090, 640, 100, 54.9, 0.4); TXT('BUSINESS PLAN', 440, 3160, 56, { f: 'KB', align: 'center' }, 55.2, 0.8);
  box(840, 3090, 640, 100, 56.6, 0.4); TXT('PROJECTIONS', 1160, 3160, 56, { f: 'KB', align: 'center' }, 56.9, 0.7);
  TXT("approval is the lender's call", 800, 3280, 56, { f: 'PH', align: 'center', col: INK2 }, CUE.appr, 1.3);
  TXT('the paperwork is ours', 800, 3360, 60, { f: 'KB', align: 'center', jit: 0.6 }, CUE.paper, 1.0); swash(480, 1120, 3376, CUE.paper + 1.0);
  ribbon(900, 3490, 380, 104, 'DM US', 72, CUE.dm, { fill: PU, td: 0.4, tcol: W_ });
  phone(560, 3490, 0.8, CUE.dm - 0.15);
}
const CAM = [
  [0.0, 430, 330, 2.0], [2.4, 700, 330, 1.45], [3.8, 1000, 340, 1.25],
  [4.1, 800, 720, 1.2, 'whip'], [5.2, 800, 730, 1.15],
  [5.6, 800, 1130, 0.82, 'whip'], [25.8, 800, 1170, 0.86],
  [26.5, 800, 1760, 0.95, 'whip'], [30.6, 800, 1770, 1.0],
  [31.1, 800, 2240, 0.82, 'whip'], [45.8, 800, 2270, 0.86],
  [46.4, 640, 2770, 1.25], [49.6, 700, 2770, 1.25],
  [50.2, 1180, 2770, 1.25], [53.5, 1180, 2780, 1.2],
  [53.9, 800, 3100, 1.0], [59.8, 800, 3230, 0.95], [61.4, 800, 3320, 0.95],
  [65.0, 800, 1990, 0.364], [66.5, 800, 1990, 0.364]];
