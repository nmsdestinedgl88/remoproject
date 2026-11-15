
const toScreen = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + H / 2];
function keyCam(t) {
  const K = CAM; let i = 0; while (i < K.length - 2 && t >= K[i + 1][0]) i++;
  const a = K[i], b = K[i + 1];
  if (b[0] <= a[0]) return { x: b[1], y: b[2], z: b[3] };
  let u = clamp((t - a[0]) / (b[0] - a[0]));
  u = b[4] === 'whip' ? (u < 0.5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2) : eio(u);
  const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  const wa = 1 / a[3], wb = 1 / b[3], k = Math.abs(wa - wb) < 1e-6 ? u : (1 / z - wa) / (wb - wa);
  const kk = Math.abs(Math.log(a[3] / b[3])) > 0.5 ? k : u;
  return { x: lerp(a[1], b[1], kk), y: lerp(a[2], b[2], kk), z };
}
const cam = keyCam;

// ---------- paper ----------
let GRAIN = null; const GX0 = -300, GY0 = -300, GS = 1.0;
function makeGrain() {
  GRAIN = document.createElement('canvas'); GRAIN.width = Math.round(2200 * GS); GRAIN.height = Math.round(4300 * GS);
  const g = GRAIN.getContext('2d'); SEED = 9;
  for (let i = 0; i < 90000; i++) { g.fillStyle = `rgba(90,80,60,${rr(0.015, 0.05)})`; g.fillRect(rr(0, GRAIN.width), rr(0, GRAIN.height), rr(0.8, 2.6), rr(0.8, 2.6)); }
}
function paper(c) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(c.z, 0, 0, c.z, W / 2 - c.x * c.z, H / 2 - c.y * c.z);
  ctx.drawImage(GRAIN, GX0, GY0, GRAIN.width / GS, GRAIN.height / GS);
  const x0 = c.x - W / 2 / c.z, x1 = c.x + W / 2 / c.z, y0 = c.y - H / 2 / c.z, y1 = c.y + H / 2 / c.z;
  ctx.fillStyle = DOT; const st = 26;
  for (let y = Math.floor((y0 - 13) / st) * st + 13; y < y1 + st; y += st) for (let x = Math.floor((x0 - 13) / st) * st + 13; x < x1 + st; x += st) { ctx.beginPath(); ctx.arc(x, y, 1.3, 0, TAU); ctx.fill(); }
}
// footer: "fictional characters", small, above the bottom 290 px (screen space, the whole film)
function footer() {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const text = 'fictional characters'; ctx.font = '30px PH'; const w = ctx.measureText(text).width + 56, h = 48, x0 = W / 2 - w / 2, y0 = H - 290 - h - 14;
  ctx.fillStyle = PAPER; ctx.globalAlpha = 0.9; ctx.fill(pathOf(rrect(x0, y0, w, h, 10)));
  ctx.globalAlpha = 1; ctx.fillStyle = INK2; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(text, W / 2, y0 + 34);
  ctx.restore();
}
window.TEXTS = t => {
  t += FROM; const c = cam(t), out = [];
  PAGE_TEXTS.forEach(({ T, t0 }, i) => {
    if (t < t0) return;
    const x0 = T.x + T.chars[0].ox, x1 = x0 + T.tot, y0 = T.y - T.size * 0.85, y1 = T.y + T.size * 0.3;
    const [a0, b0] = toScreen(c, x0, y0), [a1, b1] = toScreen(c, x1, y1);
    out.push({ id: 'p' + i, text: T.s, x0: a0, y0: b0, x1: a1, y1: b1, pass: true });
  });
  return out;
};
const QS = new URLSearchParams(location.search);
const FROM = +(QS.get('from') || 0), TO = +(QS.get('to') || FILM_DUR);
window.DUR = TO - FROM;
window.render = function (t) { renderFilm(t + FROM); };
function renderFilm(t) {
  const f = Math.round(t * FPS); BOIL = Math.floor(f / 2) % 3;
  const c = cam(t);
  paper(c);
  for (const e of EL) { if (t < e.t0) continue; SEED = e.seed; e.draw(clamp((t - e.t0) / e.d)); }
  footer();
}
window.CAMAT = cam;
async function boot() {
  document.documentElement.style.background = document.body.style.background = PAPER;
  GLY = await (await fetch('glyphs.json')).json();
  await Promise.all(['KB', 'PH'].map(f => document.fonts.load(`40px ${f}`, 'Ag')));
  makeGrain(); buildPage();
  window.EV = EL.filter(e => e.kind !== 'fill').map(e => { const c = cam(e.t0 + e.d / 2), x = toScreen(c, e.wx, 0)[0]; return { t: +e.t0.toFixed(4), type: e.kind, d: +e.d.toFixed(4), pan: +clamp((x / W) * 2 - 1, -1, 1).toFixed(3) }; });
  for (const [k, v] of Object.entries(CUE)) window.EV.push({ t: v, type: 'cue', name: k });
  window.CUE = CUE; window.render(0); window.READY = true;
}
boot();
