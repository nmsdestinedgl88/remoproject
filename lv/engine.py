#!/usr/bin/env python3
"""Line-art video engine: script + drawn cut-outs -> HyperFrames motion-graphics video (1080x1920, any two brand colours).

An episode file defines TITLE, SLUG, BRAND, SCENES, HTML, ANIM (optional HUD (off unless declared), EXTRA_CSS, SPOKEN, STARTS) and calls engine.main(globals()).
  python3 ep.py setup                    create the HyperFrames project, bundle the animation library and fonts
  python3 ep.py cut SHEET 2x2 a,b,c,d    slice an image sheet into cut-outs (white removed, lines recoloured) in assets/
  python3 ep.py build [--vo F] [--caps]  write index.html, timing sheet and captions.srt (--vo: scene lengths from the voiceover)
  python3 ep.py mux VIDEO VO OUT         put the voiceover on a rendered video at -14 LUFS
  python3 ep.py small VIDEO OUT          720x1280 copy under 16 MB for WhatsApp
"""
import html as _html, json, os, pathlib, re, shutil, subprocess, sys

ROOT = pathlib.Path(os.environ.get("LV_HOME", "/home/claude/lv"))
W, H, FPS = 1080, 1920, 30
LEAD = 0.25                      # seconds before the first caption of a scene
WPS = 2.45                       # speaking pace used when a scene has no explicit duration
def _rgb(h): h = h.lstrip("#"); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]
def _hex(c): return "#" + "".join(f"{max(0, min(255, round(v))):02X}" for v in c)
def mix(a, b, t): return _hex([x + (y - x) * t for x, y in zip(_rgb(a), _rgb(b))])
def lum(h): r, g, b = [(v / 255) ** 2.2 for v in _rgb(h)]; return 0.2126 * r + 0.7152 * g + 0.0722 * b


def palette(ink, hot, bg="#F1EEE8"):
    """Everything on screen derives from two brand colours: ink (dark, text and lines) and hot (accent), on a light background."""
    on = lambda c: "#FFFFFF" if lum(c) < 0.42 else ink
    return dict(bg=bg, ink=ink, hot=hot, white=mix(bg, "#FFFFFF", 0.55), mute=mix(ink, bg, 0.30), card=mix(bg, ink, 0.07), track=mix(bg, ink, 0.15),
                soft=mix(ink, "#FFFFFF", 0.68), bgtop=mix(bg, "#FFFFFF", 0.4), bgbot=mix(bg, ink, 0.05), grid=mix(bg, ink, 0.10), onink=on(ink), onhot=on(hot))


CHECK = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13 L10 19 L20 6"/></svg>'
NEQ = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"><path d="M4 9 H20 M4 16 H20 M16 3 L8 21"/></svg>'
TRI_R = '<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3 L21 12 L6 21 Z"/></svg>'
TRI_D = '<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6 L21 6 L12 21 Z"/></svg>'


def bridge():
    """Suspension-bridge line drawing; every stroke has class 'bd' so draw('#id .bd', ...) animates it."""
    hang = "".join(f'<path class="bd" d="M{x} {y} V220"/>' for x, y in
                   [(135, 170), (192, 122), (300, 107), (350, 136), (400, 145), (450, 136), (500, 107), (608, 122), (665, 170)])
    water = "M0 282 q25 -12 50 0" + " t50 0" * 15
    return ('<svg class="bridge" viewBox="0 0 800 300" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">'
            '<path class="bd" d="M20 220 H780"/><path class="bd" d="M250 60 V262"/><path class="bd" d="M550 60 V262"/>'
            f'<path class="bd" d="M20 220 Q135 200 250 60 Q400 230 550 60 Q665 200 780 220"/>{hang}'
            f'<path class="bd" stroke-width="4" d="{water}"/></svg>')


FONTS = [("Anton", "anton", [400]), ("Inter", "inter", [500, 600, 700, 800, 900]), ("JetBrains Mono", "jetbrains-mono", [500, 700])]
RANGES = {"latin": "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
          "latin-ext": "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"}
ALLOWED = re.compile(r"[\x00-\xff -₦]")   # glyphs the bundled fonts are known to carry


def font_css():
    out = []
    for fam, pkg, weights in FONTS:
        for wt in weights:
            for sub, rng in RANGES.items():
                out.append(f'@font-face {{ font-family: "{fam}"; font-weight: {wt}; src: url("assets/fonts/{pkg}-{sub}-{wt}-normal.woff2") format("woff2"); unicode-range: {rng}; }}')
    return "\n      ".join(out)


CSS = """
      __FONTS__
      :root { --bg: __bg__; --ink: __ink__; --hot: __hot__; --white: __white__; --mute: __mute__; --card: __card__; --track: __track__; --soft: __soft__; --onink: __onink__; --onhot: __onhot__; --navy: var(--ink); --maroon: var(--hot); }
      body { margin: 0; background: var(--bg); color: var(--ink); font-family: "Inter"; font-weight: 500; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; }
      .clip { position: absolute; inset: 0; }
      #bgfill { position: absolute; inset: 0; background: radial-gradient(120% 70% at 50% 30%, __bgtop__ 0%, var(--bg) 60%, __bgbot__ 100%); }
      #bggrid { position: absolute; left: -120px; top: -120px; width: 1320px; height: 2160px; opacity: 0.55;
        background-image: linear-gradient(__grid__ 2px, transparent 2px), linear-gradient(90deg, __grid__ 2px, transparent 2px); background-size: 120px 120px; }
      .wrap { position: absolute; inset: 0; }
      .stage { position: absolute; left: 60px; top: 380px; width: 960px; height: 1060px; }
      .abs { position: absolute; }
      .ic { display: inline-block; width: 1em; height: 1em; vertical-align: -0.12em; }
      .anton { font-family: "Anton"; font-weight: 400; text-transform: uppercase; letter-spacing: 0.005em; }
      .num { font-family: "Inter"; font-weight: 900; font-variant-numeric: tabular-nums; letter-spacing: -0.05em; line-height: 1; }
      .mono { font-family: "JetBrains Mono"; font-weight: 500; }
      .body { font-family: "Inter"; }
      .lab { font-family: "JetBrains Mono"; font-weight: 700; font-size: 36px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mute); }
      .fl, .w { display: inline-block; }
      .inv { background: var(--ink); color: var(--onink); }
      .hot { background: var(--hot); color: var(--onhot); }
      .panel { background: var(--card); border: 4px solid var(--track); border-radius: 24px; box-sizing: border-box; }
      .sheet { background: var(--ink); color: var(--onink); border-radius: 18px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.22); box-sizing: border-box; }
      .sheet .mono { color: var(--soft); }
      .stamp { font-family: "Anton"; text-transform: uppercase; text-align: center; color: var(--hot); border: 10px solid var(--hot); border-radius: 18px; padding: 6px 0 0; background: var(--white); }
      .note { position: absolute; width: 340px; height: 170px; box-sizing: border-box; background: var(--ink); border: 6px solid var(--bg); box-shadow: 0 0 0 5px var(--ink); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
      .note span { font-family: "Inter"; font-weight: 900; font-size: 110px; color: var(--onink); line-height: 1; }
      .bridge { display: block; width: 100%; height: auto; }
      .chip { font-family: "Inter"; font-weight: 800; font-size: 38px; border: 4px solid var(--ink); border-radius: 999px; padding: 16px 30px; }
      .step { flex: 1; background: var(--card); border: 4px solid var(--ink); border-radius: 22px; padding: 30px; font-family: "Anton"; font-size: 84px; line-height: 1; display: flex; gap: 22px; align-items: center; }
      .ck { flex: none; width: 80px; height: 80px; border-radius: 50%; background: var(--ink); color: var(--onink); font-size: 46px; display: flex; align-items: center; justify-content: center; }
      .row { display: flex; gap: 30px; align-items: baseline; border-top: 3px solid var(--track); padding: 22px 0; }
      .row .k { width: 190px; font-size: 28px; color: var(--mute); letter-spacing: 0.16em; font-weight: 700; }
      .row .v { font-family: "Inter"; font-weight: 700; font-size: 44px; }
      .blk { display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--onink); text-align: center; }
      .blk.hot { color: var(--onhot); }
      .fig { position: absolute; display: block; }
      .stripes { background-image: repeating-linear-gradient(135deg, rgba(255,255,255,.10) 0 18px, transparent 18px 46px); background-size: 130px 130px; }
      .eq { left: 0; display: flex; align-items: center; gap: 30px; }
      .eql { font-size: 40px; line-height: 1.1; font-weight: 700; letter-spacing: 0.12em; }
      .pin { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 90px; }
      .pin i { display: block; width: 34px; height: 34px; border-radius: 50%; background: var(--ink); border: 6px solid var(--bg); box-shadow: 0 0 0 4px var(--ink); }
      .pin b { font-size: 28px; font-weight: 700; letter-spacing: 0.1em; }
      .dots { background-color: var(--card); background-image: radial-gradient(#b9b09b 3px, transparent 3.5px); background-size: 40px 40px; border: 4px solid var(--track); box-sizing: border-box; }
      .opt { width: 460px; height: 326px; box-sizing: border-box; border: 4px solid var(--track); border-radius: 24px; padding: 26px 30px; background: var(--card); }
      .opt .k { font-size: 26px; color: var(--mute); letter-spacing: 0.16em; font-weight: 700; }
      .opt .t { font-size: 88px; line-height: 1.04; }
      .opt .d { font-size: 38px; font-weight: 600; }
      .ln { height: 16px; background: var(--track); border-radius: 8px; margin: 14px 0; width: 100%; }
      .hd { position: absolute; width: 84px; height: 130px; }
      .hd i { position: absolute; left: 15px; top: 0; width: 54px; height: 54px; border-radius: 50%; background: var(--ink); }
      .hd b { position: absolute; left: 0; top: 62px; width: 84px; height: 60px; border-radius: 42px 42px 10px 10px; background: var(--ink); }
      .tile { flex: 1; position: relative; border: 4px solid var(--track); border-radius: 24px; padding: 26px 20px 20px; text-align: center; background: var(--card); }
      .tile svg { display: block; width: 100%; height: 150px; }
      .tile .mono { font-size: 28px; font-weight: 700; letter-spacing: 0.14em; margin-top: 8px; }
      .tile .pt { position: absolute; top: -20px; right: -12px; background: var(--hot); color: var(--onhot); font-size: 46px; padding: 8px 16px; border-radius: 12px; letter-spacing: 0; }
      .part { position: absolute; width: 18px; height: 18px; background: var(--hot); border-radius: 3px; }
      #hudrow { position: absolute; left: 60px; top: 252px; width: 960px; height: 76px; display: flex; align-items: center; justify-content: space-between; }
      #hud-tag { font-family: "JetBrains Mono"; font-weight: 700; font-size: 24px; letter-spacing: 0.14em; color: var(--hot); border: 3px solid var(--hot); border-radius: 10px; padding: 10px 14px; }
      .cells { display: flex; gap: 12px; }
      .cell { border-radius: 10px; padding: 8px 14px; text-align: center; box-sizing: border-box; }
      .cell .mono { font-size: 17px; font-weight: 700; letter-spacing: 0.12em; }
      .cell .num { font-size: 38px; }
      .cell.ink, .cell.navy { background: var(--ink); color: var(--onink); }
      .cell.hot, .cell.maroon { background: var(--hot); color: var(--onhot); }
      .cell.outline { border: 4px solid var(--ink); color: var(--ink); padding: 4px 10px; }
      .clip.cap { inset: auto 80px 290px 80px; text-align: center; }
      .cap span { display: inline-block; background: var(--ink); color: var(--onink); font-family: "Inter"; font-weight: 600; font-size: 46px; line-height: 1.25; padding: 14px 26px; border-radius: 16px; }
"""

JS = """
      const S = __S__, D = __D__, C = __C__, TOTAL = __TOTAL__;
      const tl = gsap.timeline({ paused: true });
      const Q = (s) => Array.from(document.querySelectorAll(s));
      const up = (sel, t, o = {}) => tl.fromTo(sel, { opacity: 0, y: o.y ?? 50 }, { opacity: 1, y: 0, duration: o.d ?? 0.5, ease: "power3.out", stagger: o.st ?? 0 }, t);
      const side = (sel, t, x = -90) => tl.fromTo(sel, { opacity: 0, x }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, t);
      const pop = (sel, t, o = {}) => tl.fromTo(sel, { opacity: 0, scale: o.from ?? 0.6 }, { opacity: 1, scale: 1, duration: o.d ?? 0.5, ease: o.ease ?? "back.out(1.8)", stagger: o.st ?? 0 }, t);
      const slam = (sel, t, rot = 0) => tl.fromTo(sel, { opacity: 0, scale: 2.2, rotation: rot }, { opacity: 1, scale: 1, rotation: rot, duration: 0.3, ease: "power4.in" }, t);
      const hide = (sel) => gsap.set(sel, { opacity: 0 });
      const show = (sel, t, d = 0.35) => tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: d, ease: "power1.out" }, t);
      const fade = (sel, t, to = 0, d = 0.3) => tl.to(sel, { opacity: to, duration: d }, t);
      const draw = (sel, t, d, st = 0) => Q(sel).forEach((el, i) => { const L = el.getTotalLength(); tl.fromTo(el, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: d, ease: "power2.inOut" }, t + i * st); });
      const count = (id, t, from, to, d) => { const el = document.getElementById(id); const o = { v: from }; const f = (v) => (Math.abs(v - to) < 0.005 ? String(to) : v.toFixed(1)); el.textContent = f(from);
        tl.to(o, { v: to, duration: d, ease: "power2.out", onUpdate: () => { el.textContent = f(o.v); } }, t); };
      const growX = (sel, t, d = 0.6) => tl.fromTo(sel, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: d, ease: "power3.out" }, t);
      const growY = (sel, t, d = 0.6, ease = "power3.out") => tl.fromTo(sel, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: d, ease }, t);
      function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
      // cut-out figures: enter, swap pose on a beat, slow push-in while held
      const figIn = (sel, t, from = "up") => tl.fromTo(sel, { opacity: 0, x: from === "left" ? -280 : from === "right" ? 280 : 0, y: from === "up" ? 1100 : 0, scale: from === "pop" ? 0.5 : 1, rotation: from === "left" ? -6 : from === "right" ? 6 : 0 },
        { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: from === "up" ? 0.8 : 0.6, ease: "back.out(1.2)" }, t);
      const swap = (a, b, t) => { tl.set(a, { opacity: 0 }, t); tl.set(b, { opacity: 1 }, t); tl.fromTo(b, { scale: 1.14, rotation: -4, transformOrigin: "50% 100%" }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.2)" }, t); };
      const push = (sel, t, d, to = 1.05) => tl.fromTo(sel, { scale: 1, transformOrigin: "50% 100%" }, { scale: to, duration: d, ease: "none" }, t);
      const shake = (sel, t, n = 9) => tl.to(sel, { y: -10, duration: 0.16, ease: "sine.inOut", yoyo: true, repeat: n }, t);
      // burst: scatter n small squares out of a box (element id), for "vanished" moments
      const burst = (hostId, t, n = 70, seed = 7) => { const host = document.getElementById(hostId), r = rng(seed), bw = host.offsetWidth - 18, bh = host.offsetHeight - 18;
        for (let i = 0; i < n; i++) { const d = document.createElement("div"); d.className = "part"; host.appendChild(d); const x = r() * bw, y = r() * bh; gsap.set(d, { x, y, opacity: 0 });
          const t0 = t + r() * 0.8; tl.set(d, { opacity: 1 }, t0);
          tl.to(d, { x: x + (r() - 0.5) * 320, y: y - 180 - r() * 320, rotation: (r() - 0.5) * 540, opacity: 0, duration: 1.2 + r() * 0.9, ease: "power1.out" }, t0); } };
      // fly: move an element along a quadratic curve P0 -> P2 (control P1), rotating to the path
      const fly = (id, t, d, P0, P1, P2, onPos) => { const el = document.getElementById(id), o = { p: 0 };
        const place = () => { const k = o.p, u = 1 - k; const x = u * u * P0[0] + 2 * u * k * P1[0] + k * k * P2[0], y = u * u * P0[1] + 2 * u * k * P1[1] + k * k * P2[1];
          const dx = 2 * u * (P1[0] - P0[0]) + 2 * k * (P2[0] - P1[0]), dy = 2 * u * (P1[1] - P0[1]) + 2 * k * (P2[1] - P1[1]);
          gsap.set(el, { x, y, rotation: (Math.atan2(dy, dx) * 180) / Math.PI }); if (onPos) onPos(x, y); };
        place(); tl.to(o, { p: 1, duration: d, ease: "power1.inOut", onUpdate: place }, t); };

      tl.fromTo("#bggrid", { x: 0, y: 0 }, { x: 120, y: 120, duration: TOTAL, ease: "none" }, 0);
      Object.keys(S).forEach((id, i, all) => { const w = "#" + id + "-w";
        if (i > 0) tl.fromTo(w, { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, S[id]);
        if (i < all.length - 1) tl.to(w, { opacity: 0, duration: 0.2, ease: "power1.in" }, S[id] + D[id] - 0.2); });
      Q(".clip.cap").forEach((el) => tl.fromTo(el.firstElementChild, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, parseFloat(el.dataset.start)));
      if (Q("#hud-tag").length) hide("#hud-tag"); Q(".cell").forEach((el) => hide(el));
__PRE__
__ANIM__
      window.__timelines["main"] = tl;
"""

PAGE = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>__TITLE__</title>
    <script src="vendor/gsap.min.js"></script>
__SCRIPTS__    <style>__CSS__</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="__TOTAL__">
      <div class="clip" id="bg" data-start="0" data-duration="__TOTAL__" data-track-index="0"><div id="bgfill"></div><div id="bggrid"></div></div>
__SCENES__
__HUDBLOCK__
__CAPS__
    </div>
    <script>__JS__</script>
  </body>
</html>
"""


def sh(*a, **k):
    return subprocess.run(a, text=True, capture_output=True, **k)


def browser():
    for p in ["/opt/pw-browsers/chromium", *map(str, pathlib.Path("/opt/pw-browsers").glob("chromium-*/chrome-linux/chrome")),
              "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"]:
        if os.path.exists(p):
            return p
    return ""


def setup(slug):
    """Create the HyperFrames project and bundle gsap + fonts locally (the render browser has no web access)."""
    ROOT.mkdir(parents=True, exist_ok=True)
    proj = ROOT / "videos" / slug
    if not (ROOT / "node_modules" / "gsap").exists():
        r = sh("npm", "i", "--no-save", "--silent", "gsap@3.14.2", "@fontsource/anton", "@fontsource/inter", "@fontsource/jetbrains-mono", cwd=ROOT)
        if r.returncode:
            sys.exit("npm install failed:\n" + r.stderr[-800:])
    if not (proj / "hyperframes.json").exists():
        r = sh("npx", "-y", "hyperframes", "init", f"videos/{slug}", "--non-interactive", "--example=blank", cwd=ROOT)
        if not (proj / "hyperframes.json").exists():
            sys.exit("hyperframes init failed:\n" + (r.stdout + r.stderr)[-800:])
    (proj / "vendor").mkdir(exist_ok=True)
    (proj / "assets" / "fonts").mkdir(parents=True, exist_ok=True)
    shutil.copy(ROOT / "node_modules/gsap/dist/gsap.min.js", proj / "vendor/gsap.min.js")
    for fam, pkg, weights in FONTS:
        for wt in weights:
            for sub in RANGES:
                f = ROOT / f"node_modules/@fontsource/{pkg}/files/{pkg}-{sub}-{wt}-normal.woff2"
                if not f.exists():
                    sys.exit(f"missing font file {f}")
                shutil.copy(f, proj / "assets/fonts" / f.name)
    print("project:", proj)
    print("browser:", browser() or "NOT FOUND - set HYPERFRAMES_BROWSER_PATH yourself")


def pauses(vo):
    """[(start, end)] of silences in the voiceover, longest first."""
    r = sh("ffmpeg", "-hide_banner", "-i", str(vo), "-af", "silencedetect=noise=-35dB:d=0.25", "-f", "null", "-")
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    return sorted(zip(st, en), key=lambda p: p[0] - p[1])


def vo_durations(vo, n):
    """Scene lengths from the n-1 longest pauses; each scene starts 0.2 s before its narration."""
    dur = float(sh("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(vo)).stdout)
    ps = [p for p in pauses(vo) if p[0] > 0.3 and p[1] < dur - 0.3]
    if len(ps) < n - 1:
        sys.exit(f"voiceover has {len(ps)} usable pauses but {n} scenes need {n - 1}. Pauses (start, end): "
                 f"{sorted(ps)}\nSet STARTS = [...] in the episode file by hand, or re-record with a clear pause between scenes.")
    cuts = sorted(max(0.0, e - 0.2) for s, e in ps[: n - 1])
    starts = [0.0] + cuts
    return [round(b - a, 3) for a, b in zip(starts, starts[1:] + [dur + 0.6])]


def build(ep, vo=None, captions=False):
    scenes = ep["SCENES"]
    slug = ep["SLUG"]
    proj = ROOT / "videos" / slug
    durs = [d if d else round(LEAD + sum(len(c.split()) for c in ch) / WPS + tail, 1) for _, d, tail, ch in scenes]
    if ep.get("STARTS"):
        st = ep["STARTS"]
        durs = [round(b - a, 3) for a, b in zip(st, st[1:] + [st[-1] + durs[-1]])]
    elif vo:
        durs = vo_durations(vo, len(scenes))
    S, D, C, caps, t = {}, {}, {}, [], 0.0
    for (sid, _, tail, chunks), dur in zip(scenes, durs):
        S[sid], D[sid] = round(t, 3), dur
        words = [len(c.split()) for c in chunks]
        tot, span, rel, acc = (sum(words) or 1), dur - LEAD - tail, [], 0
        for w in words:
            rel.append(round(LEAD + span * acc / tot, 3))
            acc += w
        C[sid] = rel
        for i, c in enumerate(chunks):
            end = rel[i + 1] if i + 1 < len(rel) else dur - 0.12
            caps.append((round(t + rel[i], 3), round(end - rel[i], 3), c))
        t += dur
    total = round(t, 3)

    def tag(body):  # the layout audit treats stacked text inside one card as overlap; these are designed stacks
        return (body.replace("__BRIDGE__", bridge()).replace("__CHECK__", CHECK).replace("__NEQ__", NEQ).replace("__TRI_R__", TRI_R).replace("__TRI_D__", TRI_D).replace(' class="', ' data-layout-allow-overlap class="').replace("<span>", "<span data-layout-allow-overlap>")
                .replace("<div style=", "<div data-layout-allow-overlap style="))
    sc = "".join(f'<section class="clip scene" id="{sid}" data-start="{S[sid]}" data-duration="{D[sid]}" data-track-index="1">'
                 f'<div class="wrap" id="{sid}-w"><div class="stage">{tag(ep["HTML"][sid])}</div></div></section>\n' for sid, *_ in scenes)
    cp = "".join(f'<div class="clip cap" id="cap{i}" data-start="{a}" data-duration="{d}" data-track-index="4"><span>{_html.escape(x, quote=False)}</span></div>\n'
                 for i, (a, d, x) in enumerate(caps)) if captions else ""
    anim = "".join(f"      {{ const s = S.{sid}, c = C.{sid};\n{ep['ANIM'].get(sid, '')}\n      }}\n" for sid, *_ in scenes)
    hud = ep.get("HUD", {})   # opt-in: no HUD declared means no tag, no tally cells and no progress bar
    hudblock = (f'<div class="clip" id="hud" data-start="0" data-duration="{total}" data-track-index="3">'
                f'<div id="hudrow"><div id="hud-tag">{hud.get("tag", "")}</div><div class="cells">__CELLS__</div></div></div>') if hud else ""
    cells = "".join(f'<div class="cell {kind}" id="cell-{i}"><div class="mono">{lab}</div><div class="num">{val}</div></div>'
                    for i, (lab, val, kind) in enumerate(hud.get("cells", [])))
    css = CSS.replace("__FONTS__", font_css()) + ep.get("EXTRA_CSS", "")
    for k, v in palette(*ep["BRAND"]).items():
        css = css.replace(f"__{k}__", v)
    js = JS.replace("__PRE__", ep.get("PRE_JS", "")).replace("__ANIM__", anim).replace("__S__", json.dumps(S)).replace("__D__", json.dumps(D)).replace("__C__", json.dumps(C))
    page = (PAGE.replace("__SCRIPTS__", "".join(f'    <script src="{x}"></script>\n' for x in ep.get("SCRIPTS", []))).replace("__CSS__", css).replace("__JS__", js).replace("__SCENES__", sc).replace("__CAPS__", cp)
            .replace("__HUDBLOCK__", hudblock.replace("__CELLS__", cells)).replace("__TITLE__", ep["TITLE"]).replace("__TOTAL__", str(total)))
    (proj / "index.html").write_text(page)

    odd = sorted({ch for ch in re.sub(r"<script>.*?</script>|<style>.*?</style>", "", page, flags=re.S) if not ALLOWED.match(ch)})
    if odd:
        print("WARNING: characters the bundled fonts may not contain (use an SVG icon instead):", " ".join(odd))
    lines = [f"{ep['TITLE'].upper()} - scene timing sheet (total {total:.1f}s, {W}x{H}, {FPS} fps)",
             "Record one paragraph per scene with a clear ~1 second pause between scenes.", ""]
    for (sid, _, _, chunks) in scenes:
        a, b = S[sid], S[sid] + D[sid]
        lines.append(f"{sid.upper():4} {int(a // 60)}:{a % 60:04.1f} - {int(b // 60)}:{b % 60:04.1f}  ({D[sid]:.1f}s)")
        lines += ["      " + c for c in (chunks or [ep.get("SPOKEN", {}).get(sid, "(on-screen text only)")])] + [""]
    (proj / "timing_sheet.txt").write_text("\n".join(lines))
    ts = lambda x: f"{int(x // 3600):02d}:{int(x % 3600 // 60):02d}:{int(x % 60):02d},{int(round(x % 1 * 1000)):03d}"
    (proj / "captions.srt").write_text("".join(f"{i + 1}\n{ts(a)} --> {ts(a + d)}\n{x}\n\n" for i, (a, d, x) in enumerate(caps)))
    mids = ",".join(str(round(S[s] + D[s] - 0.6, 1)) for s in S)
    print(f"built {proj/'index.html'}  total {total}s  scenes {len(scenes)}  burned captions {len(caps) if captions else 0}")
    print("end-of-scene frames:", mids)


def mux(video, vo, out):
    dur = sh("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video).stdout.strip()
    r = sh("ffmpeg", "-y", "-loglevel", "error", "-i", video, "-i", vo, "-filter_complex",
           "[1:a]aresample=48000,loudnorm=I=-14:TP=-1.5:LRA=11,apad[a]", "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", dur, out)
    print(r.stderr or f"wrote {out}")


def cut(slug, sheet, grid="2x2", names=""):
    """Slice a generated sheet into cells, lift each drawing off the white paper, recolour lines to the brand ink with a light fill."""
    try:
        import cv2, numpy as np
        from PIL import Image
    except ImportError:
        sys.exit("pip install opencv-python-headless numpy pillow --break-system-packages")
    ep = sys.modules["__main__"].__dict__; P = palette(*ep["BRAND"])
    INK, FILL = np.array(_rgb(P["ink"]), float), np.array(_rgb(P["white"]), float)
    cols, rows = [int(v) for v in grid.lower().split("x")]
    names = [n for n in names.split(",") if n] or [f"{pathlib.Path(sheet).stem}_{i + 1}" for i in range(cols * rows)]
    out = ROOT / "videos" / slug / "assets"; out.mkdir(parents=True, exist_ok=True)
    rgb0 = np.array(Image.open(sheet).convert("RGB")); g = np.array(Image.open(sheet).convert("L")); H0, W0 = g.shape
    dark = g < 110                                                      # panel frames, if the generator drew any, are painted out
    frame = np.zeros_like(g, bool)
    for x in np.where(dark.sum(0) > H0 * 0.33)[0]: frame[:, max(0, x - 8):x + 9] = True
    for y in np.where(dark.sum(1) > W0 * 0.33)[0]: frame[max(0, y - 8):y + 9, :] = True
    g[frame] = 255
    made = []
    for i, name in enumerate(names[: cols * rows]):
        if name in ("-", "skip"): continue
        r, c = divmod(i, cols); cell = g[r * H0 // rows:(r + 1) * H0 // rows, c * W0 // cols:(c + 1) * W0 // cols].copy(); h, w = cell.shape
        fr = frame[r * H0 // rows:(r + 1) * H0 // rows, c * W0 // cols:(c + 1) * W0 // cols]
        free = (cv2.morphologyEx((cell < 170).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)) == 0).astype(np.uint8)
        free[fr] = 0                                                     # a frame line is a wall for the flood, so limbs that touch it stay closed
        mask = np.zeros((h + 2, w + 2), np.uint8)
        seeds = [(x, 0) for x in range(0, w, 3)] + [(0, y) for y in range(0, h, 3)] + [(w - 1, y) for y in range(0, h, 3)]
        hl = np.where(fr.mean(1) > 0.5)[0]; hl = hl[hl > h * 0.6]
        yt, yl = (hl.min(), hl.max()) if len(hl) else (h, h)             # top and bottom rows of the bottom frame line, if the sheet has one
        ring = cv2.dilate(fr.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool) & ~fr
        seeds += [(x, y) for y, x in zip(*np.where(ring)) if y < yt - 6][::3]                              # just inside the top and side frame lines
        seeds += [(x, y) for x in range(0, w, 3) for y in range(yl + 2, h, 2)]                             # the gutter under a frame is never part of a drawing
        if (free[max(0, yt - 14):yt - 2] == 1).all():                                                       # clean paper above the bottom edge: the drawing ends higher up
            seeds += [(x, yt - 4) for x in range(0, w, 3)]
        for sx, sy in seeds:
            if free[sy, sx] == 1: cv2.floodFill(free, mask, (sx, sy), 2)
        free[fr] = 2
        inside = cv2.morphologyEx((free != 2).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        n, lab, st, _ = cv2.connectedComponentsWithStats(inside); keep = np.zeros_like(inside)
        for j in range(1, n):
            if st[j, cv2.CC_STAT_AREA] > max(1500, 0.004 * h * w): keep[lab == j] = 1
        if name.startswith("="):                                           # "=name": keep the whole panel (for a round badge), no cut-out
            name = name[1:]; keep = (~fr).astype(np.uint8)
        if not keep.any(): print("  nothing found in cell", i + 1); continue
        t = np.clip((cell.astype(float) - 40) / 195, 0, 1)[..., None]
        col = INK * (1 - t) + FILL * t
        if ep.get("KEEP_COLOURS"):                                         # keep the generator's own line colours, only tint the paper
            col = rgb0[r * H0 // rows:(r + 1) * H0 // rows, c * W0 // cols:(c + 1) * W0 // cols].astype(float) * FILL / 255
        rgba = np.dstack([col, cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 0.8) * 255]).astype(np.uint8)
        ys, xs = np.where(keep); y0, y1, x0, x1 = max(ys.min() - 6, 0), min(ys.max() + 6, h), max(xs.min() - 6, 0), min(xs.max() + 6, w)
        Image.fromarray(rgba).crop((x0, y0, x1, y1)).save(out / f"{name}.png"); made.append((name, x1 - x0, y1 - y0, "runs off the cell bottom" if y1 >= h - 8 else ""))
    tw = 300; sheet_im = Image.new("RGB", (tw * max(1, len(made)), 460), tuple(_rgb(P["bg"])))
    for i, (name, *_ ) in enumerate(made):
        im = Image.open(out / f"{name}.png"); im.thumbnail((tw - 20, 440)); sheet_im.paste(im, (i * tw + 10, 10), im)
    sheet_im.save(out / f"_cutouts_{pathlib.Path(sheet).stem}.png")
    for m in made: print("  cut", *m)
    print("look at", out / f"_cutouts_{pathlib.Path(sheet).stem}.png")


def small(video, out):
    dur = float(sh("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video).stdout)
    kb = min(2600, int(15.2 * 8192 / dur) - 96)
    r = sh("ffmpeg", "-y", "-loglevel", "error", "-i", video, "-vf", "scale=720:1280", "-c:v", "libx264", "-b:v", f"{kb}k", "-maxrate", f"{kb}k", "-bufsize", f"{2 * kb}k", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", out)
    print(r.stderr or f"wrote {out} ({os.path.getsize(out) / 1e6:.1f} MB)")


def main(ep):
    a = sys.argv[1:]
    cmd = a[0] if a else "build"
    if cmd == "setup":
        setup(ep["SLUG"])
    elif cmd == "build":
        vo = a[a.index("--vo") + 1] if "--vo" in a else None
        build(ep, vo=vo, captions="--caps" in a)
    elif cmd == "cut":
        cut(ep["SLUG"], a[1], a[2] if len(a) > 2 else "2x2", a[3] if len(a) > 3 else "")
    elif cmd == "mux":
        mux(*a[1:4])
    elif cmd == "small":
        small(*a[1:3])
    else:
        sys.exit(__doc__)
