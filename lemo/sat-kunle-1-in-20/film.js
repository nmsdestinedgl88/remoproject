// ================= Saturday: "Kunle's 1 in 20" =================
const FILM_DUR = 35.6;
const CUE = { one: 0.26, wants: 4.78, a: 7.36, b: 10.08, c: 12.79, cust: 17.06, edge: 20.07, banker: 22.24, plan: 24.33, cta: 26.98, dm: 32.72,
  wh1: 4.2, wh2: 6.6, wh3: 16.6, wh4: 19.6, wh5: 26.2 };
function buildPage() {
  // B1: one in twenty
  dots(180, 220, 10, 2, 138, 130, [19], CUE.one, 0.1);
  TXT('1 IN 20', 800, 520, 170, { f: 'KB', align: 'center', jit: 0.6, col: '#5a005a' }, 2.6, 1.2); swash(420, 1180, 560, 3.9);
  // B2: Kunle wants to be the one
  ribbon(800, 690, 400, 90, 'THE ONE', 58, CUE.wants, { fill: PU, td: 0.5, tcol: W_ });
  figure(520, 880, 0.95, 'point', CUE.wants + 0.5, { hair: 'cap' });
  coin(950, 860, 44, CUE.wants + 1.0, 0.5); TXT('THE LOAN', 950, 960, 44, { f: 'KB', align: 'center', jit: 0.5 }, CUE.wants + 1.4, 0.5);
  // B3: not just another tailor: the mend-guarantee
  box(130, 1010, 1340, 640, 7.0, 0.45);
  TXT('NOT JUST ANOTHER TAILOR', 800, 1090, 56, { f: 'KB', align: 'center', jit: 0.6 }, CUE.a + 0.2, 1.6);
  figure(1230, 1450, 0.95, 'tape', CUE.a + 1.2, { hair: 'cap' });
  shirt(360, 1290, 1.5, CUE.b + 0.2);
  ribbon(420, 1470, 520, 80, 'MEND-GUARANTEE', 40, CUE.b + 1.0, { fill: PU, td: 0.5, tcol: W_ });
  tapeIcon(640, 1260, 0.9, CUE.c + 0.3); TXT('REFIT', 640, 1330, 44, { f: 'KB', align: 'center', jit: 0.5 }, CUE.c + 0.5, 0.4);
  needle(860, 1250, 0.9, CUE.c + 1.2); TXT('REPAIR', 860, 1330, 44, { f: 'KB', align: 'center', jit: 0.5 }, CUE.c + 1.4, 0.5);
  scissors(1070, 1245, 0.8, CUE.c + 2.1); TXT('ADJUST', 1070, 1330, 44, { f: 'KB', align: 'center', jit: 0.5 }, CUE.c + 2.3, 0.5);
  ribbon(850, 1570, 520, 76, 'NO LABOUR COST', 42, CUE.c + 2.8, { fill: PU, td: 0.5, tcol: W_ });
  // B4: customers return and bring friends
  shop(360, 1830, 1.1, 'KUNLE', CUE.cust);
  inkArrow(bez([470, 1800], [560, 1740], [680, 1740], [760, 1790], 20), { w: 4, amp: 0.8 }, CUE.cust + 0.8, 0.6);
  dots(840, 1810, 1, 1, 0, 0, [], CUE.cust + 1.2);
  inkArrow(bez([800, 1870], [700, 1930], [560, 1930], [470, 1890], 20), { w: 4, amp: 0.8, col: PU }, CUE.cust + 1.6, 0.6);
  dots(1000, 1810, 4, 1, 90, 0, [], CUE.cust + 2.3, 0.3); TXT('AND THEIR FRIENDS', 1130, 1950, 54, { f: 'KB', align: 'center', jit: 0.5 }, CUE.cust + 2.4, 1.0);
  // B5: the edge, and the banker who has never seen it
  ribbon(420, 2130, 400, 84, 'HIS EDGE', 52, CUE.edge, { fill: PU, td: 0.4, tcol: W_ });
  bank(380, 2300, 1.1, CUE.banker); TXT('?', 600, 2350, 150, { f: 'KB', align: 'center', col: '#5a005a' }, CUE.banker + 0.8, 0.4);
  TXT('NEVER SEEN IT', 420, 2430, 50, { f: 'KB', align: 'center', jit: 0.5 }, CUE.banker + 0.6, 0.9);
  // B6: a plan makes the edge visible
  docIcon(920, 2080, 480, 360, CUE.plan, 0); TXT('BUSINESS PLAN', 1160, 2150, 46, { f: 'KB', align: 'center', jit: 0.5 }, CUE.plan + 0.3, 0.8);
  MRK([rrect(960, 2210, 400, 70, 8)], { col: PU, w: 12 }, CUE.plan + 1.0, 0.4); TXT('MEND-GUARANTEE', 1160, 2258, 40, { f: 'KB', align: 'center', jit: 0.5, col: W_ }, CUE.plan + 1.2, 0.8);
  INK_(line(960, 2330, 1340, 2330), { w: 2.2, amp: 0.3, passes: 1 }, CUE.plan + 1.8, 0.1); INK_(line(960, 2370, 1280, 2370), { w: 2.2, amp: 0.3, passes: 1 }, CUE.plan + 1.9, 0.1);
  // B7: call to action
  ribbon(800, 2580, 560, 100, 'MANETRUST', 70, CUE.cta, { fill: PU, td: 0.7, tcol: W_ });
  box(300, 2660, 1000, 100, 29.0, 0.4); TXT('BUSINESS PLAN', 800, 2730, 58, { f: 'KB', align: 'center' }, 29.3, 0.8);
  ribbon(900, 2880, 380, 104, 'DM US', 72, CUE.dm, { fill: PU, td: 0.4, tcol: W_ });
  phone(560, 2880, 0.8, CUE.dm - 0.15);
}
const CAM = [
  [0.0, 765, 400, 0.9], [3.6, 800, 430, 0.95],
  [4.2, 700, 790, 1.1, 'whip'], [6.6, 720, 810, 1.05],
  [6.9, 800, 1340, 0.82, 'whip'], [16.5, 800, 1370, 0.86],
  [17.0, 800, 1890, 0.95, 'whip'], [19.8, 800, 1930, 0.98],
  [20.1, 800, 2300, 0.95], [26.1, 800, 2340, 0.95],
  [26.6, 800, 2700, 1.0], [30.2, 800, 2760, 1.0],
  [33.6, 800, 1605, 0.44], [35.6, 800, 1605, 0.44]];
