#!/usr/bin/env python3
"""Builds the Sevun cybersecurity cut (720×1280) from one shared glass-morphism kit.

    python3 build.py      → index.html + compositions/c1..c4.html + cburst.html

Each scene file is ordinary HyperFrames source; this script only keeps the glass material,
the caption pills and the motion helpers identical across them. Edit here, then re-run.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ORANGE = "#FF7A1F"

# Root timeline: (id, start, duration, media file, media-start)
SCENES = [("c1", 0.0, 10.0, "n1", 0.0), ("c2", 10.0, 9.75, "n2", 0.0), ("c3", 19.75, 7.3, "n3", 1.3), ("c4", 27.05, 9.6, "n4", 0.0)]
BURST = ("cburst", 36.65, 2.35)
OUTRO = 39.0
TOTAL = 49.0

# ── the shared glass kit ────────────────────────────────────────────────────
CSS = """
    #root { position: absolute; inset: 0; font-family: "Inter", sans-serif; color: #fff; overflow: hidden; }
    .ft { position: absolute; inset: 0; }
    .ft video { position: absolute; left: 0; top: 0; width: 720px; height: 1280px; object-fit: cover; }
    .shade { position: absolute; left: 0; right: 0; pointer-events: none; }
    .shade.top { top: 0; height: 420px; background: linear-gradient(180deg, rgba(5, 8, 16, 0.55), rgba(5, 8, 16, 0)); }
    .shade.bot { bottom: 0; height: 640px; background: linear-gradient(0deg, rgba(5, 8, 16, 0.6), rgba(5, 8, 16, 0)); }
    .glass { position: absolute; border-radius: 32px; overflow: hidden; opacity: 0;
      background: linear-gradient(140deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.07));
      backdrop-filter: blur(26px) saturate(1.7); -webkit-backdrop-filter: blur(26px) saturate(1.7);
      border: 1px solid rgba(255, 255, 255, 0.38);
      box-shadow: 0 26px 60px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.55), inset 0 -1px 0 rgba(255, 255, 255, 0.1); }
    .glass.dark { background: linear-gradient(140deg, rgba(30, 32, 48, 0.55), rgba(12, 14, 24, 0.38)); }
    .sheen { position: absolute; top: -30%; bottom: -30%; left: 0; width: 44%; pointer-events: none;
      background: linear-gradient(100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0)); }
    .cap { position: absolute; left: 0; right: 0; text-align: center; white-space: nowrap; }
    .pill { display: inline-block; padding: 16px 30px 18px; border-radius: 30px; text-align: center; line-height: 1.08;
      background: linear-gradient(140deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.06));
      backdrop-filter: blur(22px) saturate(1.6); -webkit-backdrop-filter: blur(22px) saturate(1.6);
      border: 1px solid rgba(255, 255, 255, 0.34); box-shadow: 0 18px 44px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.5); opacity: 0; }
    .pill .l1 { display: block; font-size: 40px; font-weight: 600; letter-spacing: -0.02em; }
    .pill .l2 { display: block; font-size: 62px; font-weight: 800; letter-spacing: -0.035em; }
    .w { display: inline-block; margin-right: 0.22em; opacity: 0; }
    .o { color: __ORANGE__; }
    .lab { font-size: 22px; font-weight: 700; letter-spacing: 0.14em; color: rgba(255, 255, 255, 0.78); }
    .wipe-band { position: absolute; left: 0; top: 0; width: 420px; height: 1280px; background: #FF6600; transform-origin: 0 0; }
""".replace("__ORANGE__", ORANGE)

JS = """
      const tl = gsap.timeline({ paused: true });
      const $ = (s) => document.querySelectorAll(s);
      const one = (s) => document.querySelector(s);
      // Apple-style motion: springs in (soft overshoot, blur clears), quick clean exits
      const glassIn = (sel, at, extra = {}) =>
        tl.fromTo(sel, { opacity: 0, scale: 0.9, y: 36, filter: "blur(14px)", ...extra },
          { opacity: 1, scale: 1, y: 0, x: 0, rotationX: 0, rotationY: 0, filter: "blur(0px)", duration: 0.62, ease: "back.out(1.35)" }, at);
      const glassOut = (sel, at) => {
        tl.to(sel, { opacity: 0, scale: 0.95, y: -14, filter: "blur(12px)", duration: 0.26, ease: "power2.in" }, at);
        tl.set(sel, { visibility: "hidden" }, at + 0.3);
      };
      const sheen = (sel, at) => tl.fromTo(sel + " .sheen", { x: -340, skewX: -18 }, { x: 900, skewX: -18, duration: 0.9, ease: "power2.inOut" }, at);
      const wordIn = (el, at) =>
        tl.fromTo(el, { opacity: 0, y: 14, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.24, ease: "power3.out" }, at);
      // a caption pill: the glass lands first, then its words build on the voice
      const cap = (id, times, outAt) => {
        const p = "#" + id + " .pill";
        tl.fromTo(p, { opacity: 0, scale: 0.86, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.42, ease: "back.out(1.6)" }, times[0] - 0.12);
        const w = $("#" + id + " .w");
        times.forEach((t, i) => wordIn(w[i], t));
        if (outAt != null) glassOut(p, outAt);
      };
      const count = (sel, from, to, at, dur, fmt) => {
        const o = { v: from }, el = one(sel);
        tl.fromTo(o, { v: from }, { v: to, duration: dur, ease: "power2.out", onUpdate: () => { el.textContent = fmt(o.v); } }, at);
      };
      const comma = (v) => Math.round(v).toLocaleString("en-US");
"""


def cap(id_, top, l1, l2, big=None):
    """Two-line caption pill. l1/l2 are lists of words; a word wrapped as '*word*' is orange."""
    def words(ws):
        out = []
        for w in ws:
            if w.startswith("*") and w.endswith("*"):
                out.append(f'<span class="w o">{w[1:-1]}</span>')
            else:
                out.append(f'<span class="w">{w}</span>')
        return "".join(out)
    style = f' style="font-size: {big}px"' if big else ""
    l1h = f'<span class="l1">{words(l1)}</span>' if l1 else ""
    return f'    <div id="{id_}" class="cap" style="top: {top}px"><div class="pill">{l1h}<span class="l2"{style}>{words(l2)}</span></div></div>\n'


def scene(sid, dur, media, mstart, css, body, js):
    return f"""<template>
  <style>{CSS}{css}
  </style>
  <div id="root" data-composition-id="{sid}" data-width="720" data-height="1280">
    <div id="{sid}-ft" class="ft">
      <video id="{sid}-video" class="clip" data-start="0" data-duration="{dur}" data-media-start="{mstart}" data-track-index="0" src="assets/footage/{media}.mp4" data-has-audio="true" playsinline></video>
    </div>
    <div class="shade top"></div>
    <div class="shade bot"></div>
{body}  </div>
  <script>
    (function () {{{JS}
      tl.fromTo("#{sid}-ft", {{ scale: 1.06, transformOrigin: "50% 40%" }}, {{ scale: 1.0, duration: {dur}, ease: "sine.out" }}, 0);
{js}
      window.__timelines["{sid}"] = tl;
    }})();
  </script>
</template>
"""


SHIELD = '<path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5z"/>'
LOCK = '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'
CHECK = '<path d="M5 12.5 10 17 19 7"/>'

# ── c1 · n1: "your clients don't know they're at risk… under siege… competition on video… you're not." ──
C1_CSS = """
    .notif { left: 24px; right: 24px; height: 118px; display: flex; align-items: center; gap: 20px; padding: 0 24px; border-radius: 30px; }
    .notif .ic { width: 70px; height: 70px; border-radius: 18px; flex: 0 0 auto; display: flex; align-items: center; justify-content: center; }
    .notif .tx { flex: 1; min-width: 0; }
    .notif .row { display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.72); }
    .notif .t { font-size: 29px; font-weight: 700; margin-top: 4px; }
    .notif .s { font-size: 23px; font-weight: 500; color: rgba(255, 255, 255, 0.75); margin-top: 2px; }
    #c1-n1 { top: 60px; } #c1-n2 { top: 192px; }
    #c1-dash { left: 36px; width: 648px; top: 690px; height: 380px; padding: 26px 28px; }
    #c1-dash .hd { display: flex; align-items: center; gap: 14px; }
    #c1-dot { width: 16px; height: 16px; border-radius: 50%; background: #FF3B30; box-shadow: 0 0 14px #FF3B30; }
    #c1-live { margin-left: auto; padding: 6px 14px; border-radius: 999px; background: rgba(255, 59, 48, 0.85); font-size: 20px; font-weight: 800; letter-spacing: 0.12em; }
    #c1-radar { position: absolute; left: 26px; top: 86px; width: 268px; height: 268px; }
    #c1-stats { position: absolute; left: 324px; top: 96px; right: 26px; }
    #c1-stats .big { font-size: 70px; font-weight: 800; letter-spacing: -0.03em; margin-top: 6px; font-variant-numeric: tabular-nums; }
    #c1-siege { display: inline-block; margin-top: 22px; padding: 10px 18px; border-radius: 14px; background: rgba(255, 59, 48, 0.9); font-size: 24px; font-weight: 800; letter-spacing: 0.08em; opacity: 0; }
    #c1-player { left: 50px; width: 620px; top: 700px; height: 360px; }
    #c1-screen { position: absolute; left: 16px; right: 16px; top: 16px; height: 250px; border-radius: 22px; overflow: hidden;
      background: radial-gradient(120% 90% at 30% 20%, rgba(120, 81, 169, 0.55), rgba(10, 12, 22, 0.75)); }
    #c1-play { position: absolute; left: 50%; top: 50%; width: 96px; height: 96px; margin: -48px 0 0 -48px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.25); border: 1px solid rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; }
    #c1-rec { position: absolute; left: 18px; top: 16px; padding: 6px 14px; border-radius: 999px; background: rgba(255, 59, 48, 0.9); font-size: 20px; font-weight: 800; letter-spacing: 0.12em; }
    #c1-meta { position: absolute; left: 30px; right: 30px; bottom: 22px; display: flex; align-items: center; justify-content: space-between; }
    #c1-meta b { font-size: 28px; font-weight: 700; }
    #c1-bar { position: absolute; left: 16px; right: 16px; top: 262px; height: 6px; border-radius: 3px; background: rgba(255, 255, 255, 0.2); overflow: hidden; }
    #c1-fill { width: 100%; height: 100%; background: #FF3B30; transform-origin: 0 50%; }
"""
C1_BODY = f"""    <div class="wipe-band" id="c1-band"></div>
    <div id="c1-n1" class="glass notif"><div class="ic" style="background: linear-gradient(140deg, #FF5A4E, #D8261C)">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">{SHIELD}<path d="M12 8v4M12 16h.01"/></svg></div>
      <div class="tx"><div class="row"><span>SECURITY ALERT</span><span>now</span></div><div class="t">Unusual sign-in detected</div><div class="s">Unknown device · 2:14 AM</div></div><div class="sheen"></div></div>
    <div id="c1-n2" class="glass notif"><div class="ic" style="background: linear-gradient(140deg, #FF9A3D, #FF6600)">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">{LOCK}</svg></div>
      <div class="tx"><div class="row"><span>PASSWORDS</span><span>1m ago</span></div><div class="t">Password found in a leak</div><div class="s">Change it on 3 accounts</div></div><div class="sheen"></div></div>
{cap("c1-k1", 1000, ["Your", "clients", "don't", "know"], ["they're", "at", "*risk.*"])}
    <div id="c1-dash" class="glass dark">
      <div class="hd"><div id="c1-dot"></div><div class="lab">THREAT MONITOR</div><div id="c1-live">LIVE</div></div>
      <svg id="c1-radar" viewBox="0 0 268 268" fill="none">
        <circle cx="134" cy="134" r="128" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
        <circle cx="134" cy="134" r="88" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
        <circle cx="134" cy="134" r="46" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
        <path d="M134 6v256M6 134h256" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
        <g id="c1-sweep"><path d="M134 134 L134 6 A128 128 0 0 1 224 44 Z" fill="url(#c1-sg)"/></g>
        <defs><linearGradient id="c1-sg" x1="134" y1="6" x2="224" y2="60" gradientUnits="userSpaceOnUse"><stop stop-color="#FF7A1F" stop-opacity="0.65"/><stop offset="1" stop-color="#FF7A1F" stop-opacity="0"/></linearGradient></defs>
        <g id="c1-blips" fill="#FF3B30">
          <circle cx="190" cy="80" r="8"/><circle cx="70" cy="96" r="7"/><circle cx="200" cy="180" r="8"/>
          <circle cx="96" cy="200" r="7"/><circle cx="160" cy="120" r="6"/><circle cx="58" cy="160" r="7"/><circle cx="150" cy="226" r="6"/><circle cx="222" cy="128" r="7"/>
        </g>
      </svg>
      <div id="c1-stats"><div class="lab">INTRUSION ATTEMPTS</div><div class="big" id="c1-count">0</div><div id="c1-siege">UNDER SIEGE</div></div>
      <div class="sheen"></div>
    </div>
{cap("c1-k2", 96, ["Right", "now,", "their", "data"], ["could", "be", "under", "*siege.*"])}
{cap("c1-k3", 96, ["Your", "clients", "would"], ["have", "no", "*idea.*"])}
    <div id="c1-player" class="glass">
      <div id="c1-screen"><div id="c1-rec">● ON VIDEO</div>
        <div id="c1-play"><svg width="40" height="40" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div></div>
      <div id="c1-bar"><div id="c1-fill"></div></div>
      <div id="c1-meta"><b>Your competitor</b><span class="lab">POSTED TODAY</span></div>
      <div class="sheen"></div>
    </div>
{cap("c1-k4", 96, ["Your", "competition"], ["is", "on", "*video.*"])}
{cap("c1-k5", 560, [], ["You're", "*not.*"], big=104)}"""
C1_JS = """
      // the orange stroke from the logo wipes the film open
      tl.fromTo("#c1-band", { x: -1200, skewX: 30 }, { x: 800, skewX: 30, duration: 0.62, ease: "power3.inOut" }, 0);
      tl.fromTo("#c1-ft", { clipPath: "polygon(-800px 0px, -790px 0px, -51px 1280px, -800px 1280px)" },
        { clipPath: "polygon(-800px 0px, 800px 0px, 1539px 1280px, -800px 1280px)", duration: 0.62, ease: "power3.inOut" }, 0.02);
      tl.set("#c1-ft", { clipPath: "none" }, 0.7);

      // shot 1 (close-up): iOS-style alerts drop in over a face that doesn't know yet
      glassIn("#c1-n1", 0.7, { y: -170, scale: 0.96 }); sheen("#c1-n1", 1.0);
      glassIn("#c1-n2", 1.45, { y: -170, scale: 0.96 }); sheen("#c1-n2", 1.75);
      cap("c1-k1", [0.42, 0.56, 0.91, 1.08, 1.22, 1.37, 1.44], 2.6);
      tl.to("#c1-n1, #c1-n2", { y: -220, opacity: 0, filter: "blur(10px)", duration: 0.3, ease: "power3.in", stagger: 0.04 }, 2.6);

      // shot 2 (control room): a live threat monitor
      glassIn("#c1-dash", 3.0); sheen("#c1-dash", 3.5);
      tl.fromTo("#c1-sweep", { rotation: 0, svgOrigin: "134 134" }, { rotation: 1080, svgOrigin: "134 134", duration: 3.9, ease: "none" }, 3.0);
      tl.fromTo("#c1-blips circle", { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)", stagger: 0.18 }, 3.4);
      tl.fromTo("#c1-dot", { opacity: 1 }, { opacity: 0.25, duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: 7 }, 3.1);
      count("#c1-count", 0, 1284, 3.2, 3.4, comma);
      tl.fromTo("#c1-siege", { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.24, ease: "expo.out" }, 4.97);
      tl.to("#c1-dash", { keyframes: [{ x: -10 }, { x: 8 }, { x: -5 }, { x: 2 }, { x: 0 }], duration: 0.3, ease: "none" }, 4.98);
      cap("c1-k2", [3.4, 3.57, 4.1, 4.24, 4.51, 4.67, 4.79, 4.97], 5.3);
      cap("c1-k3", [5.55, 5.66, 6.02, 6.13, 6.25, 6.47], 6.85);
      glassOut("#c1-dash", 6.9);

      // "your competition is talking about it on video"
      glassIn("#c1-player", 7.25); sheen("#c1-player", 7.8);
      tl.fromTo("#c1-fill", { scaleX: 0 }, { scaleX: 1, duration: 1.9, ease: "none" }, 7.35);
      tl.fromTo("#c1-play", { scale: 0.6 }, { scale: 1, duration: 0.5, ease: "back.out(2.4)" }, 7.5);
      cap("c1-k4", [7.29, 7.4, 7.96, 8.65, 8.78], 9.2);
      glassOut("#c1-player", 9.2);

      // "You're not."
      cap("c1-k5", [9.4, 9.53], null);
"""

# ── c2 · n2: "be the one who warns them first, every single day… scroll-stopping… the name they call before the breach, not after" ──
C2_CSS = """
    #c2-week { left: 50px; width: 620px; top: 770px; height: 250px; padding: 26px 28px; }
    #c2-week .hd { display: flex; justify-content: space-between; align-items: center; }
    #c2-week .chip { padding: 6px 14px; border-radius: 999px; background: rgba(255, 255, 255, 0.18); font-size: 20px; font-weight: 700; }
    #c2-days { display: flex; justify-content: space-between; margin-top: 30px; }
    .c2-d { width: 66px; text-align: center; }
    .c2-d span { display: block; font-size: 22px; font-weight: 700; color: rgba(255, 255, 255, 0.72); margin-bottom: 12px; }
    .c2-c { position: relative; width: 66px; height: 66px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.4); background: rgba(255, 255, 255, 0.08); }
    .c2-f { position: absolute; inset: -2px; border-radius: 50%; background: #FF6600; display: flex; align-items: center; justify-content: center; opacity: 0; box-shadow: 0 6px 18px rgba(255, 102, 0, 0.5); }
    #c2-phone { left: 200px; width: 320px; top: 600px; height: 600px; border-radius: 52px; padding: 14px; }
    #c2-scr { position: relative; width: 292px; height: 572px; border-radius: 40px; overflow: hidden; background: #0B0E18; }
    #c2-feed { position: absolute; left: 0; top: 0; width: 292px; }
    #c2-feed img { display: block; width: 292px; height: 519px; object-fit: cover; margin-bottom: 8px; }
    #c2-island { position: absolute; left: 50%; top: 12px; width: 96px; height: 28px; margin-left: -48px; border-radius: 14px; background: #000; }
    #c2-call { left: 36px; width: 648px; top: 760px; height: 330px; padding: 30px 32px; }
    #c2-av { position: absolute; left: 32px; top: 34px; width: 116px; height: 116px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(140deg, #9B7BD4, #FF6600); font-size: 44px; font-weight: 800; }
    #c2-ring { position: absolute; left: 32px; top: 34px; width: 116px; height: 116px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.7); }
    #c2-who { position: absolute; left: 176px; top: 46px; }
    #c2-who b { display: block; font-size: 42px; font-weight: 800; letter-spacing: -0.02em; }
    #c2-who span { display: block; font-size: 25px; font-weight: 500; color: rgba(255, 255, 255, 0.78); margin-top: 6px; }
    .c2-btn { position: absolute; bottom: 30px; width: 88px; height: 88px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    #c2-no { left: 110px; background: #FF3B30; } #c2-yes { right: 110px; background: #34C759; }
    #c2-after { position: absolute; right: 40px; top: 700px; padding: 12px 22px; border-radius: 18px; background: rgba(255, 59, 48, 0.9); font-size: 30px; font-weight: 800; opacity: 0; }
    #c2-strike { position: absolute; left: 14px; right: 14px; top: 50%; height: 4px; margin-top: -2px; background: #fff; transform-origin: 0 50%; }
"""
C2_BODY = f"""{cap("c2-k1", 96, ["Be", "the", "one", "who"], ["warns", "them", "*first.*"])}
    <div id="c2-week" class="glass"><div class="hd"><span class="lab">THIS WEEK</span><span class="chip">1 video / day</span></div>
      <div id="c2-days">{"".join(f'<div class="c2-d"><span>{d}</span><div class="c2-c"><div class="c2-f"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">{CHECK}</svg></div></div></div>' for d in "MTWTFSS")}</div>
      <div class="sheen"></div></div>
{cap("c2-k2", 96, ["Every"], ["single", "*day.*"])}
{cap("c2-k3", 96, ["That's", "where"], ["I", "come", "in."])}
    <div id="c2-phone" class="glass"><div id="c2-scr"><div id="c2-feed">{"".join(f'<img src="assets/img/feed{i % 6}.jpg" />' for i in range(7))}</div><div id="c2-island"></div></div><div class="sheen"></div></div>
{cap("c2-k4", 96, ["*Scroll-stopping*"], ["videos,", "daily."])}
{cap("c2-k5", 96, ["You", "do", "the"], ["security", "work."])}
    <div id="c2-call" class="glass dark"><div id="c2-ring"></div><div id="c2-av">YF</div>
      <div id="c2-who"><b>Your Firm</b><span>incoming call…</span></div>
      <div id="c2-no" class="c2-btn"><svg width="40" height="40" viewBox="0 0 24 24" fill="#fff"><path d="M3 15.5c5-4.6 13-4.6 18 0l-2.2 2.6-3.6-1.4v-2.6a12 12 0 0 0-6.4 0v2.6l-3.6 1.4z"/></svg></div>
      <div id="c2-yes" class="c2-btn"><svg width="40" height="40" viewBox="0 0 24 24" fill="#fff"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg></div>
      <div class="sheen"></div></div>
{cap("c2-k6", 96, ["The", "name", "they", "call"], ["before", "the", "*breach.*"])}
    <div id="c2-after">not after.<div id="c2-strike"></div></div>"""
C2_JS = """
      // shot 1: a week of daily videos, ticked off
      cap("c2-k1", [0.41, 0.52, 0.6, 0.8, 0.9, 1.21, 1.35], 1.86);
      glassIn("#c2-week", 0.45); sheen("#c2-week", 1.0);
      tl.fromTo("#c2-week .c2-f", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.36, ease: "back.out(2.6)", stagger: 0.09 }, 1.95);
      cap("c2-k2", [1.99, 2.23, 2.5], 3.0);
      cap("c2-k3", [3.11, 3.3, 3.45, 3.53, 3.76], 4.2);
      glassOut("#c2-week", 4.0);

      // shot 2 (closer): a feed flicks past… and stops
      glassIn("#c2-phone", 4.2, { y: 120 }); sheen("#c2-phone", 4.9);
      tl.fromTo("#c2-feed", { y: 0 }, { y: -1800, duration: 0.46, ease: "power2.in" }, 4.25);
      tl.fromTo("#c2-feed", { y: -1800 }, { y: -1581, duration: 0.7, ease: "elastic.out(1, 0.45)", immediateRender: false }, 4.71);
      cap("c2-k4", [4.44, 5.05, 5.75], 6.2);
      glassOut("#c2-phone", 6.2);
      cap("c2-k5", [6.36, 6.48, 6.62, 6.69, 7.1], 7.42);

      // "…the name they call before the breach"
      glassIn("#c2-call", 7.45); sheen("#c2-call", 8.0);
      tl.fromTo("#c2-ring", { scale: 1, opacity: 0.9 }, { scale: 1.6, opacity: 0, duration: 0.7, ease: "power2.out", repeat: 2 }, 7.7);
      tl.to("#c2-yes", { keyframes: [{ rotation: -14 }, { rotation: 12 }, { rotation: -8 }, { rotation: 0 }], duration: 0.4, ease: "none" }, 8.4);
      cap("c2-k6", [8.04, 8.12, 8.32, 8.41, 8.65, 8.9, 8.96], null);
      tl.fromTo("#c2-after", { opacity: 0, scale: 0.7, rotation: -6 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.3, ease: "back.out(2.4)" }, 9.31);
      tl.fromTo("#c2-strike", { scaleX: 0 }, { scaleX: 1, duration: 0.22, ease: "power3.out" }, 9.48);
"""

# ── c3 · n3: "and the cost? seven dollars a day… less than a Big Mac… less than your morning coffee" ──
C3_CSS = """
    #c3-card { left: 70px; width: 580px; top: 620px; height: 330px; padding: 30px 34px; border-radius: 34px;
      background: linear-gradient(140deg, rgba(120, 81, 169, 0.42), rgba(255, 102, 0, 0.22) 70%, rgba(255, 255, 255, 0.08)); }
    #c3-card .hd { display: flex; align-items: center; gap: 14px; }
    #c3-amt { position: absolute; left: 34px; top: 110px; white-space: nowrap; }
    #c3-amt b { font-size: 132px; font-weight: 800; letter-spacing: -0.05em; }
    #c3-amt span { font-size: 42px; font-weight: 600; margin-left: 12px; color: rgba(255, 255, 255, 0.85); opacity: 0; display: inline-block; }
    #c3-foot { position: absolute; left: 34px; right: 34px; bottom: 26px; display: flex; justify-content: space-between; font-size: 22px; font-weight: 600; letter-spacing: 0.12em; color: rgba(255, 255, 255, 0.72); }
    .c3-row { left: 70px; width: 580px; height: 96px; border-radius: 26px; display: flex; align-items: center; gap: 20px; padding: 0 22px; }
    #c3-r1 { top: 966px; } #c3-r2 { top: 1076px; }
    .c3-row .ic { width: 58px; height: 58px; border-radius: 16px; background: rgba(255, 255, 255, 0.16); display: flex; align-items: center; justify-content: center; }
    .c3-row .t { flex: 1; font-size: 30px; font-weight: 700; }
    .c3-row .t small { display: block; font-size: 19px; font-weight: 700; letter-spacing: 0.12em; color: rgba(255, 255, 255, 0.7); }
    .c3-ok { width: 52px; height: 52px; border-radius: 50%; background: #34C759; display: flex; align-items: center; justify-content: center; opacity: 0; }
"""
MARK = '<svg width="34" height="60" viewBox="180 0 770 1540"><polygon points="571,0 938,343 737,787 636,611 720,382 571,235 407,393 816,1102 722,1270 191,350" fill="#FF6600"/><polygon points="426,926 674,1354 576,1528 338,1116" fill="#9B7BD4"/></svg>'
C3_BODY = f"""{cap("c3-k1", 96, [], ["And", "the", "*cost?*"])}
    <div id="c3-card" class="glass">
      <div class="hd">{MARK}<span class="lab">SEVUN · DAILY VIDEO</span></div>
      <div id="c3-amt"><b id="c3-num">$0</b><span>/ day</span></div>
      <div id="c3-foot"><span>•••• 0007</span><span>LESS THAN LUNCH</span></div>
      <div class="sheen"></div>
    </div>
    <div id="c3-r1" class="glass c3-row"><div class="ic"><svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 22c0-8 7.6-13 17-13s17 5 17 13z"/><path d="M6 28h36"/><path d="M8 33h32" stroke="#FF7A1F" stroke-width="5"/><path d="M9 38h30v1a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z"/></svg></div>
      <div class="t"><small>LESS THAN</small>a Big Mac</div><div class="c3-ok"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">{CHECK}</svg></div><div class="sheen"></div></div>
    <div id="c3-r2" class="glass c3-row"><div class="ic"><svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h26v11a10 10 0 0 1-10 10h-6A10 10 0 0 1 9 29z"/><path d="M35 21h3a5 5 0 0 1 0 10h-3"/><path d="M16 6c-2 3 2 5 0 8M24 6c-2 3 2 5 0 8" stroke="#FF7A1F"/></svg></div>
      <div class="t"><small>LESS THAN</small>your morning coffee</div><div class="c3-ok"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">{CHECK}</svg></div><div class="sheen"></div></div>"""
C3_JS = """
      cap("c3-k1", [0.22, 0.31, 0.37], 1.35);
      // an Apple-Wallet-style card flips round as he names the price
      glassIn("#c3-card", 1.35, { rotationY: -80, transformPerspective: 1200, y: 0 });
      count("#c3-num", 0, 7, 1.49, 0.6, (v) => "$" + Math.round(v));
      tl.fromTo("#c3-amt span", { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }, 2.29);
      sheen("#c3-card", 2.4);
      tl.to("#c3-card", { rotationX: 8, rotationY: -6, transformPerspective: 1200, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: 1 }, 2.8);
      // the comparisons, each ticked on the word
      glassIn("#c3-r1", 3.7, { x: -60, y: 0 }); sheen("#c3-r1", 4.2);
      tl.fromTo("#c3-r1 .c3-ok", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.36, ease: "back.out(2.8)" }, 4.48);
      glassIn("#c3-r2", 5.75, { x: 60, y: 0 }); sheen("#c3-r2", 6.2);
      tl.fromTo("#c3-r2 .c3-ok", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.36, ease: "back.out(2.8)" }, 6.55);
      glassOut("#c3-card, #c3-r1, #c3-r2", 6.95);
"""

# ── c4 · n4: "try us with one… don't pay… who's protecting them… a story worth telling… DM us to get started" ──
C4_CSS = """
    #c4-tog { left: 50px; width: 620px; top: 790px; height: 220px; padding: 28px 30px; }
    .c4-line { display: flex; justify-content: space-between; align-items: center; }
    .c4-line b { font-size: 32px; font-weight: 700; }
    #c4-track { position: relative; width: 104px; height: 62px; border-radius: 31px; background: rgba(255, 255, 255, 0.24); }
    #c4-on { position: absolute; inset: 0; border-radius: 31px; background: #34C759; opacity: 0; }
    #c4-knob { position: absolute; left: 5px; top: 5px; width: 52px; height: 52px; border-radius: 50%; background: #fff; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3); }
    #c4-sep { height: 1px; background: rgba(255, 255, 255, 0.24); margin: 24px 0; }
    #c4-chip { padding: 8px 18px; border-radius: 999px; background: rgba(52, 199, 89, 0.9); font-size: 26px; font-weight: 800; letter-spacing: 0.06em; }
    #c4-shield { left: 190px; width: 340px; top: 690px; height: 380px; display: flex; flex-direction: column; align-items: center; padding-top: 34px; }
    #c4-shield .by { font-size: 22px; font-weight: 700; letter-spacing: 0.14em; color: rgba(255, 255, 255, 0.75); margin-top: 18px; }
    #c4-shield .firm { font-size: 40px; font-weight: 800; letter-spacing: -0.02em; margin-top: 4px; }
    #c4-story { left: 60px; width: 600px; top: 760px; height: 300px; }
    #c4-sscr { position: absolute; left: 14px; right: 14px; top: 14px; bottom: 76px; border-radius: 22px; overflow: hidden;
      background: radial-gradient(120% 100% at 70% 20%, rgba(255, 102, 0, 0.5), rgba(10, 12, 22, 0.75)); display: flex; align-items: center; justify-content: center; }
    #c4-splay { width: 88px; height: 88px; border-radius: 50%; background: rgba(255, 255, 255, 0.26); border: 1px solid rgba(255, 255, 255, 0.5); display: flex; align-items: center; justify-content: center; }
    #c4-smeta { position: absolute; left: 28px; right: 28px; bottom: 22px; display: flex; justify-content: space-between; align-items: center; }
    #c4-smeta b { font-size: 28px; font-weight: 700; }
    #c4-typing { left: 50px; top: 1000px; width: 150px; height: 76px; border-radius: 38px 38px 38px 10px; display: flex; align-items: center; justify-content: center; gap: 12px; }
    #c4-typing i { width: 14px; height: 14px; border-radius: 50%; background: #fff; display: block; }
    #c4-dm { left: 50px; top: 980px; height: 104px; padding: 0 36px 0 26px; border-radius: 44px 44px 44px 12px; display: flex; align-items: center; gap: 18px;
      background: linear-gradient(140deg, rgba(120, 81, 169, 0.85), rgba(120, 81, 169, 0.6)); font-size: 42px; font-weight: 700; white-space: nowrap; }
"""
C4_BODY = f"""{cap("c4-k1", 96, [], ["Try", "us", "with", "*one.*"])}
    <div id="c4-tog" class="glass">
      <div class="c4-line"><b>Pay only if you like it</b><div id="c4-track"><div id="c4-on"></div><div id="c4-knob"></div></div></div>
      <div id="c4-sep"></div>
      <div class="c4-line"><span class="lab">FIRST VIDEO</span><span id="c4-chip">NO RISK</span></div>
      <div class="sheen"></div></div>
{cap("c4-k2", 96, ["If", "you", "don't", "like", "it,"], ["you", "don't", "*pay.*"])}
    <div id="c4-shield" class="glass">
      <svg width="170" height="190" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path id="c4-sh" d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5z" stroke="#fff" stroke-width="1.3" fill="rgba(255,255,255,0.08)"/>
        <path id="c4-ck" d="M8.2 12.2 11 15l5-6" stroke="#34C759" stroke-width="1.8"/></svg>
      <div class="by">PROTECTED BY</div><div class="firm">your firm</div><div class="sheen"></div></div>
{cap("c4-k3", 96, ["Your", "clients", "deserve", "to", "know"], ["who's", "*protecting*", "them."], big=50)}
    <div id="c4-story" class="glass"><div id="c4-sscr"><div id="c4-splay"><svg width="38" height="38" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div></div>
      <div id="c4-smeta"><b>Your security story</b><span class="lab">0:30</span></div><div class="sheen"></div></div>
{cap("c4-k4", 96, ["That's", "a", "story"], ["worth", "*telling.*"])}
    <div id="c4-typing" class="glass"><i></i><i></i><i></i></div>
    <div id="c4-dm" class="glass"><svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z" fill="rgba(255,255,255,0.18)"/></svg>DM us to get started<div class="sheen"></div></div>"""
C4_JS = """
      cap("c4-k1", [0.15, 0.4, 0.54, 0.67], 1.1);
      // an iOS switch: "pay only if you like it" — flipped on "pay"
      glassIn("#c4-tog", 0.55); sheen("#c4-tog", 1.1);
      cap("c4-k2", [1.26, 1.36, 1.43, 1.6, 1.83, 2.15, 2.24, 2.4], 3.3);
      tl.to("#c4-knob", { x: 42, duration: 0.34, ease: "back.out(1.8)" }, 2.4);
      tl.to("#c4-on", { opacity: 1, duration: 0.24, ease: "power2.out" }, 2.42);
      tl.fromTo("#c4-chip", { scale: 0.7 }, { scale: 1, duration: 0.36, ease: "back.out(3)" }, 2.5);
      glassOut("#c4-tog", 3.35);

      // "who's protecting them" — a shield draws itself and locks green
      glassIn("#c4-shield", 3.55); sheen("#c4-shield", 4.4);
      tl.fromTo("#c4-sh", { strokeDasharray: 70, strokeDashoffset: 70 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 3.7);
      tl.fromTo("#c4-ck", { strokeDasharray: 14, strokeDashoffset: 14 }, { strokeDashoffset: 0, duration: 0.36, ease: "power3.out" }, 5.05);
      tl.fromTo("#c4-shield svg", { filter: "drop-shadow(0 0 0 rgba(52,199,89,0))" }, { filter: "drop-shadow(0 0 22px rgba(52,199,89,0.8))", duration: 0.4, ease: "power2.out" }, 5.1);
      cap("c4-k3", [3.64, 3.76, 4.17, 4.54, 4.64, 4.86, 5.05, 5.59], 6.45);
      glassOut("#c4-shield", 6.5);

      // "That's a story worth telling."
      glassIn("#c4-story", 6.6); sheen("#c4-story", 7.2);
      tl.to("#c4-splay", { scale: 0.86, duration: 0.08, ease: "power2.out" }, 7.68);
      tl.to("#c4-splay", { scale: 1, duration: 0.3, ease: "back.out(3)" }, 7.76);
      cap("c4-k4", [6.86, 7.07, 7.1, 7.45, 7.68], 8.15);
      glassOut("#c4-story", 8.1);

      // "DM us to get started" — typing… then the message
      glassIn("#c4-typing", 7.95, { y: 20, scale: 0.7 });
      tl.fromTo("#c4-typing i", { y: 0 }, { y: -8, duration: 0.12, ease: "sine.inOut", yoyo: true, repeat: 1, stagger: 0.06 }, 8.05);
      tl.set("#c4-typing", { opacity: 0 }, 8.32);
      glassIn("#c4-dm", 8.32, { y: 20, scale: 0.8 }); sheen("#c4-dm", 8.8);
"""

# ── closing burst: three glass hits on a dark field, then the orange stroke fills the frame ──
BURST_HTML = """<template>
  <style>
    #root { position: absolute; inset: 0; font-family: "Inter", sans-serif; color: #fff; overflow: hidden; background: #0A0D16; }
    .cb-blob { position: absolute; border-radius: 50%; }
    #cb-a { width: 700px; height: 700px; left: -220px; top: 120px; background: radial-gradient(circle, rgba(255, 102, 0, 0.55), transparent 65%); }
    #cb-b { width: 760px; height: 760px; right: -260px; bottom: 60px; background: radial-gradient(circle, rgba(120, 81, 169, 0.6), transparent 65%); }
    .cb-hit { position: absolute; left: 0; right: 0; top: 0; bottom: 0; display: flex; align-items: center; justify-content: center; opacity: 0; }
    .cb-hit div { padding: 26px 44px 30px; border-radius: 40px; font-size: 96px; font-weight: 800; letter-spacing: -0.04em; line-height: 1.02; text-align: center;
      background: linear-gradient(140deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.06)); backdrop-filter: blur(26px) saturate(1.7); -webkit-backdrop-filter: blur(26px) saturate(1.7);
      border: 1px solid rgba(255, 255, 255, 0.38); box-shadow: 0 26px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.55); }
    .o { color: #FF7A1F; }
    #cb-wipe { position: absolute; inset: 0; background: #FF6600; }
  </style>
  <div id="root" data-composition-id="cburst" data-width="720" data-height="1280">
    <div id="cb-a" class="cb-blob"></div><div id="cb-b" class="cb-blob"></div>
    <div id="cb-1" class="cb-hit"><div>Warn them<br />first.</div></div>
    <div id="cb-2" class="cb-hit"><div>Every<br /><span class="o">day.</span></div></div>
    <div id="cb-3" class="cb-hit"><div><span class="o">$7</span><br />a day.</div></div>
    <div id="cb-wipe" data-layout-ignore></div>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#cb-a", { x: 0, y: 0 }, { x: 160, y: -120, duration: 2.35, ease: "sine.inOut" }, 0);
      tl.fromTo("#cb-b", { x: 0, y: 0 }, { x: -140, y: 100, duration: 2.35, ease: "sine.inOut" }, 0);
      const hit = (sel, at, end) => {
        tl.fromTo(sel, { opacity: 0, scale: 1.12, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.2, ease: "expo.out" }, at);
        tl.set(sel, { opacity: 0 }, end);
      };
      hit("#cb-1", 0.0, 0.5);
      hit("#cb-2", 0.5, 0.95);
      hit("#cb-3", 0.95, 2.35);
      tl.fromTo("#cb-wipe", { clipPath: "polygon(-800px 0px, -790px 0px, -51px 1280px, -800px 1280px)" },
        { clipPath: "polygon(-800px 0px, 760px 0px, 1499px 1280px, -800px 1280px)", duration: 0.66, ease: "power3.in" }, 1.66);
      window.__timelines["cburst"] = tl;
    })();
  </script>
</template>
"""

INDEX = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=720, height=1280" />
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 720px; height: 1280px; overflow: hidden; background: #0A0D16; }
      #root { width: 100%%; height: 100%%; position: relative; font-family: "Inter", sans-serif; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="%(TOTAL)s" data-width="720" data-height="1280">
%(HOSTS)s
      <!-- 10 s outro: the same Remotion logo + offer, portrait layout (video/outro, OutroVertical) -->
      <video id="outro" class="clip" data-start="%(OUTRO)s" data-duration="10" data-track-index="6" src="assets/footage/outro.mp4"
        muted playsinline style="position: absolute; left: 0; top: 0; width: 720px; height: 1280px; z-index: 4"></video>

      <audio id="sfx" class="clip" data-start="0" data-duration="%(TOTAL)s" data-track-index="7" data-volume="1" src="assets/sfx/sfx.wav"></audio>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""


def main():
    hosts = []
    for i, (sid, start, dur, _, _) in enumerate(SCENES + [(BURST[0], BURST[1], BURST[2], None, None)]):
        hosts.append(f'      <div id="{sid}" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" data-start="{start}" data-duration="{dur}"\n'
                     f'        data-track-index="{i + 1}" data-track-kind="graphics" data-width="720" data-height="1280" style="z-index: {3 if sid == BURST[0] else 2}"></div>')
    with open(os.path.join(HERE, "index.html"), "w") as f:
        f.write(INDEX % {"TOTAL": TOTAL, "OUTRO": OUTRO, "HOSTS": "\n".join(hosts)})
    parts = {"c1": (C1_CSS, C1_BODY, C1_JS), "c2": (C2_CSS, C2_BODY, C2_JS), "c3": (C3_CSS, C3_BODY, C3_JS), "c4": (C4_CSS, C4_BODY, C4_JS)}
    for sid, _, dur, media, mstart in SCENES:
        css, body, js = parts[sid]
        with open(os.path.join(HERE, "compositions", f"{sid}.html"), "w") as f:
            f.write(scene(sid, dur, media, mstart, css, body + "\n", js))
    with open(os.path.join(HERE, "compositions", "cburst.html"), "w") as f:
        f.write(BURST_HTML)
    print("built index.html +", ", ".join(s[0] for s in SCENES), "+ cburst")


if __name__ == "__main__":
    main()
