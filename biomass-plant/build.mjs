import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const SK = "/root/.claude/skills/anatomy";
const k = await import(`${SK}/kit/iso-kit.mjs`);
const { kitScript } = await import(`${SK}/scripts/inline-kit.mjs`);

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const WIDTH = 640, HEIGHT = 400;

// Truth: PKS ~17.5 MJ/kg, small steam plant ~22% net electrical efficiency.
const LHV = 17.5, EFF = 0.22, FEED_MAX = 900, FULL_TURN_KW = 1000;
const kw = (feed) => (feed * LHV * EFF) / 3.6;

const PLATE = { x: -135, y: -62, w: 270, d: 124, r: 8 };
const PLATE_H = 12, FOOT_H = 5;
const HOP = { x: -120, y: -20, w: 40, d: 40, r: 2 };
const FUR = { x: -72, y: -26, w: 50, d: 52, r: 3 }, FUR_H = 40;
const BOIL = [4, 0], BOIL_R = 20, BOIL_H = 70;
const TUR = { x: 44, y: -22, w: 40, d: 44, r: 3 }, TUR_H = 24;
const GEN = { x: 92, y: -18, w: 32, d: 36, r: 3 }, GEN_H = 20;
const DIAL = [108, 0], DIAL_R = 15, DIAL_Z = 36, DIAL_H = 7, DIAL_TOP = DIAL_Z + DIAL_H;
const STRIP = { x: -115, y: 46, w: 150, d: 8, r: 1.5 };
const SL0 = -100, SL1 = 15; // slider knob centre travel

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [-40, -12, 102], [BOIL[0], 0, 80], [DIAL[0], 0, DIAL_TOP + 2]],
  WIDTH, HEIGHT, { pad: 30, azimuth: 42 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const screws = (plan, z, inset = 4) => D(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.45 });

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const sc = k.corners(PLATE, 10);
  out.push(L(sc.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(sc.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // feed-rate ruler strip
  out.push(S(k.slabOf(STRIP, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(STRIP.x + 4, STRIP.x + STRIP.w - 4, 4, 5, STRIP.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(D([at([STRIP.x + 2, STRIP.y + 4, 0.6]), at([STRIP.x + STRIP.w - 2, STRIP.y + 4, 0.6])], { size: 0.45 }));
  return out.join("");
}

function hopper() {
  const out = [];
  out.push(S(k.slabOf({ x: HOP.x + 6, y: HOP.y + 6, w: 28, d: 28, r: 2 }, 0, 24, P, 3, 0.6), { tone: "mid" }));
  out.push(screws({ x: HOP.x + 6, y: HOP.y + 6, w: 28, d: 28 }, 24, 3));
  // funnel: widening stacked collars
  [[24, 22, 10], [34, 31, 10], [44, 40, 8]].forEach(([z, w, h]) => {
    const plan = { x: HOP.x + 20 - w / 2, y: -w / 2, w, d: w, r: 1.5 };
    out.push(S(k.slabOf(plan, z, h, P, 3, 0.6), { tone: "mid", crease: "lo" }));
    out.push(L(k.planOutline(k.insetPlan(plan, 2), z + h, P, 3), { tone: "faint" }));
  });
  const lip = { x: HOP.x, y: HOP.y, w: 40, d: 40, r: 2 };
  out.push(S(k.slabOf(lip, 52, 4, P, 3, 0.5), { tone: "mid" }));
  out.push(screws(lip, 56, 3.5));
  // palm kernel shells heaped inside the opening
  const shells = [];
  for (let i = 0; i < 26; i++) {
    const a = i * 2.399, r = 4 + (i % 5) * 3.2;
    shells.push(at([HOP.x + 20 + Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85, 56.4 + (i % 3) * 0.3]));
  }
  out.push(L(k.planOutline(k.insetPlan(lip, 4), 56, P, 3), { tone: "faint" }));
  out.push(D(shells, { size: 0.7, tone: "hi" }));
  // feed screw housing to the furnace
  out.push(S(k.slabOf({ x: HOP.x + 34, y: -5, w: 20, d: 10, r: 2 }, 8, 8, P, 3, 0.5), { tone: "mid" }));
  return out.join("");
}

function furnace() {
  const out = [];
  out.push(S(k.slabOf(FUR, 0, FUR_H, P, 5, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(FUR, 3), FUR_H, P, 5), { tone: "faint" }));
  out.push(screws(FUR, FUR_H, 5));
  // brick courses on the roof edge and a firebox door on the long face
  const door = { x: FUR.x + 12, y: FUR.y + FUR.d, w: 26, h: 20, z: 8 };
  const face = k.topMatrix ? null : null;
  out.push(L(k.lineOnTop([FUR.x, FUR.y + FUR.d - 0.01], [FUR.x + FUR.w, FUR.y + FUR.d - 0.01], 4, P), { tone: "faint" }));
  return out.join("");
}

function stack() {
  const out = [];
  const [x, y] = [-50, -10];
  out.push(S(k.cylinder(x, y, 7.5, FUR_H, 3, P, 28), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, 5, FUR_H + 3, 62, P, 28), { tone: "mid", crease: "none" }));
  out.push(L([60, 80, 100].map((z) => k.sideArc(x, y, 5, z, P, 14)).join(""), { tone: "faint" }));
  out.push(S(k.cylinder(x, y, 6, FUR_H + 62, 2.4, P, 28), { tone: "hi" }));
  return out.join("");
}

function boiler() {
  const out = [];
  const [x, y] = BOIL;
  out.push(`<path class="iso-halo" d="${k.ring(x, y, BOIL_R + 6, 0, P, 40)}"/>`);
  out.push(S(k.cylinder(x, y, BOIL_R + 3, 0, 4, P, 40), { tone: "lo" }));
  out.push(S(k.cylinder(x, y, BOIL_R, 4, BOIL_H - 4, P, 48), { tone: "mid", crease: "none" }));
  [18, 34, 50].forEach((z) => {
    out.push(S(k.cylinder(x, y, BOIL_R + 1.2, z, 2.4, P, 48), { tone: "lo" }));
    out.push(L(k.knurl(x, y, BOIL_R + 1.2, z, z + 2.4, 40, P), { tone: "faint" }));
  });
  out.push(S(k.cylinder(x, y, 12, BOIL_H, 6, P, 36), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, 5, BOIL_H + 6, 4, P, 24), { tone: "mid" }));
  return out.join("");
}

function turbine() {
  const out = [];
  out.push(S(k.slabOf(TUR, 0, TUR_H, P, 5, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(TUR, 4), TUR_H, P, 5), { tone: "faint" }));
  // rotor bearing caps on the long faces
  out.push(S(k.cylinder(TUR.x + 14, 0, 8, TUR_H, 4, P, 28), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(TUR.x + 14, 0, 8, TUR_H, TUR_H + 4, 28, P), { tone: "lo" }));
  out.push(D([at([TUR.x + 14, 0, TUR_H + 4])], { size: 0.6, tone: "hi" }));
  out.push(screws(TUR, TUR_H, 5));
  // steam riser
  out.push(S(k.slabOf({ x: TUR.x + 26, y: -4, w: 8, d: 8, r: 1.5 }, TUR_H, 56, P, 3, 0.5), { tone: "mid" }));
  return out.join("");
}

function generator() {
  const out = [];
  out.push(S(k.slabOf(GEN, 0, GEN_H, P, 5, 0.8), { tone: "mid" }));
  const t = k.topTicks(GEN.x + 4, GEN.x + GEN.w - 4, 3, 99, GEN.y + 4, GEN_H, [GEN.d - 8, GEN.d - 8], P);
  out.push(L(t.minor, { tone: "faint" }));
  out.push(screws(GEN, GEN_H, 3.5));
  // coupling between turbine and generator
  return out.join("");
}

function coupling() {
  return S(k.slabOf({ x: TUR.x + TUR.w, y: -4, w: GEN.x - TUR.x - TUR.w, d: 8, r: 2 }, 6, 8, P, 3, 0.5), { tone: "hi", crease: "lo" });
}

function steamLine() {
  const out = [];
  const z = BOIL_H + 10;
  out.push(S(k.slabOf({ x: BOIL[0] - 3, y: -3.5, w: TUR.x + 30 - BOIL[0] + 7.5, d: 7, r: 2 }, z, 6, P, 3, 0.5), { tone: "mid" }));
  for (const x of [BOIL[0] + 18, TUR.x + 6]) out.push(S(k.slabOf({ x, y: -4.5, w: 3, d: 9, r: 1 }, z - 0.5, 7, P, 2, 0.3), { tone: "lo" }));
  return out.join("");
}

function gauge() {
  const out = [];
  const [x, y] = DIAL;
  out.push(S(k.cylinder(x, y, 3, GEN_H, DIAL_Z - GEN_H, P, 20), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 56, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 3, DIAL_TOP, 72, P, 0.3), { tone: "lo" }));
  out.push(L(k.ring(x, y, DIAL_R - 2, DIAL_TOP, P, 56), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, DIAL_R - 3, 50, 5, DIAL_TOP, [1.2, 2.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.ring(x, y, 1.5, DIAL_TOP, P, 16), { tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([x, y + 8], DIAL_TOP, P, "x"), "kW", { size: 2.6, tone: "lo", anchor: "middle" }));
  return out.join("");
}

const needleAt = (turn) => {
  const a = turn * Math.PI * 2, [x, y] = DIAL;
  return k.lineOnTop([x - Math.sin(a) * 3, y + Math.cos(a) * 3], [x + Math.sin(a) * (DIAL_R - 3.5), y - Math.cos(a) * (DIAL_R - 3.5)], DIAL_TOP + 0.2, P);
};

function knob() {
  const out = [];
  const plan = { x: -7, y: STRIP.y - 1, w: 14, d: 10, r: 2 };
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(plan, 1), 1, 0.1, P)}" style="filter:blur(3px)"/>`);
  out.push(S(k.slabOf(plan, 1, 4, P, 3, 0.6), { tone: "mid" }));
  out.push(S(k.cylinder(0, STRIP.y + 4, 4, 5, 5, P, 24), { tone: "hi", lit: true }));
  out.push(L(k.knurl(0, STRIP.y + 4, 4, 5, 10, 24, P), { tone: "lo" }));
  out.push(L(k.lineOnTop([0, STRIP.y + 4], [4, STRIP.y + 4], 10, P), { tone: "hi" }));
  return out.join("");
}

// painter's order: footprints are disjoint, so sort by depth of centre; riser/line after
const clusters = [
  { c: [-100, 0], draw: hopper },
  { c: [-47, 0], draw: () => furnace() + stack(), later: true },
  { c: [4, 0], draw: boiler },
  { c: [64, 0], draw: turbine },
  { c: [108, 0], draw: generator },
].sort((a, b) => k.depthOf([a.c[0], a.c[1], 0], P) - k.depthOf([b.c[0], b.c[1], 0], P));

const startX = SL0 + (SL1 - SL0) * 0.5;
const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label: "A bench model of a palm kernel shell biomass power plant. Shells go from a hopper into a furnace, heat a boiler, steam runs along a pipe to a turbine that drives a generator, and a dial gauge reads electrical output in kilowatts. Sliding the knob changes the feed rate.",
  body: [
    plate(),
    ...clusters.map((c) => (c.draw === turbine ? coupling() : "") + c.draw()),
    steamLine(),
    gauge(),
    `<g data-part="knob" transform="${k.translateAlong(P, [startX, 0, 0])}">${knob()}</g>`,
    `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(kw(450) / FULL_TURN_KW)}" style="stroke-width:1.1"/>`,
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const DIAL = ${JSON.stringify(DIAL)}, DIAL_R = ${DIAL_R}, DIAL_TOP = ${DIAL_TOP};
const SL0 = ${SL0}, SL1 = ${SL1}, FEED_MAX = ${FEED_MAX}, LHV = ${LHV}, EFF = ${EFF}, FULL = ${FULL_TURN_KW};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const knob = svg.querySelector('[data-part="knob"]');
const needle = svg.querySelector('[data-part="needle"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const needleAt = ${needleAt.toString().replace("k.lineOnTop", "lineOnTop")};
let share = 0.5, target = 0.5, out = 0.5, frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0;
function draw() {
  const feed = share * FEED_MAX, electric = (out * FEED_MAX * LHV * EFF) / 3.6;
  knob.setAttribute("transform", translateAlong(P, [SL0 + (SL1 - SL0) * share, 0, 0]));
  needle.setAttribute("d", needleAt(electric / FULL));
  const text = Math.round(feed) + " kg/h shells · " + Math.round(electric) + " kW";
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(Math.round(feed)));
  stage.setAttribute("aria-valuetext", text);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (touring) { clock += dt; target = 0.5 + 0.45 * Math.sin(clock * 0.5); }
  share = still.matches ? target : share + (target - share) * (1 - Math.exp(-dt / 0.2));
  // the boiler stores heat: output lags the feed
  out = still.matches ? share : out + (share - out) * (1 - Math.exp(-dt / 0.9));
  draw();
  const settled = !touring && Math.abs(target - share) < 1e-3 && Math.abs(share - out) < 1e-3;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const steer = (v) => { touring = false; target = clamp(v, 0, 1); clearTimeout(idle); idle = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 3600); run(); };
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointermove", (e) => { const b = svg.getBoundingClientRect(); steer(((e.clientX - b.left) / b.width - 0.1) / 0.5); });
stage.addEventListener("keydown", (e) => {
  const d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 0.1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -0.1 : 0;
  if (!d) return; e.preventDefault(); steer(target + d);
});
draw();
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "Palm kernel shell power plant",
  hint: "Hover to set the feed rate",
  readout: `${450} kg/h shells · ${Math.round(kw(450))} kW`,
  keys: [
    { mark: "lit", label: "Feed knob and needle: what you set and what it makes" },
    { mark: "raised", label: "Shells in the hopper, rotor caps and coupling" },
  ],
  caption: "Bench model of a biomass plant. Shells (about 17.5 MJ/kg) feed a furnace and boiler; steam drives a turbine and generator at roughly 22% efficiency. One dial turn is 1,000 kW, and output trails the feed because the boiler stores heat.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Feed rate: arrow keys change shells per hour" aria-valuemin="0" aria-valuemax="${FEED_MAX}" aria-valuenow="450">${svg}</div>`,
});
const name = theme === "light" ? "biomass-plant-light.html" : "biomass-plant.html";
writeFileSync(join(HERE, name), k.pageHtml({ title: "Palm kernel shell power plant", theme, body, script: kitScript() + live }));
console.log("wrote", name);
