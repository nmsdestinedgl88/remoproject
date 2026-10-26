#!/usr/bin/env python3
"""Builds the Sevun SaaS cut (720×1280) from the same glass-morphism kit as the cyber cut.

    python3 build.py      → index.html + compositions/p1..p4.html + pburst.html

Each scene file is ordinary HyperFrames source; this script only keeps the glass material,
the caption pills and the motion helpers identical across them. Edit here, then re-run.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ORANGE = "#FF7A1F"

# Root timeline: (id, start, duration, media file, media-start)
SCENES = [("p1", 0.0, 9.6, "l1", 0.0), ("p2", 9.6, 9.75, "l2", 0.0), ("p3", 19.35, 8.1, "l3", 0.2), ("p4", 27.45, 9.6, "l4", 0.0)]
BURST = ("pburst", 37.05, 2.35)
OUTRO = 39.4
TOTAL = 49.4
# House rule (video/CLAUDE.md): captions own the footer; widgets sit at chest height.
CAP_Y = 944

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

MARK = '<svg width="34" height="60" viewBox="180 0 770 1540"><polygon points="571,0 938,343 737,787 636,611 720,382 571,235 407,393 816,1102 722,1270 191,350" fill="#FF6600"/><polygon points="426,926 674,1354 576,1528 338,1116" fill="#9B7BD4"/></svg>'

TYPE_CSS = """
    .typed { display: inline-block; white-space: nowrap; overflow: hidden; vertical-align: bottom; }
    .caret { display: inline-block; width: 3px; height: 1.1em; background: #fff; margin-left: 4px; vertical-align: -0.18em; }
"""

# ── p1 · l1: "your product solves a problem… someone needs what you built and doesn't have the words… competition is giving them the words on video" ──
P1_CSS = TYPE_CSS + """
    #p1-search { left: 40px; width: 640px; top: 834px; height: 96px; padding: 14px 16px; }
    #p1-search .bar { display: flex; align-items: center; gap: 16px; height: 66px; padding: 0 20px; border-radius: 20px; background: rgba(255, 255, 255, 0.16); font-size: 25px; font-weight: 500; }
    #p1-res { position: absolute; right: 30px; top: 30px; opacity: 0; }
    #p1-res b { font-size: 24px; font-weight: 700; }
    #p1-res span { padding: 6px 14px; border-radius: 999px; background: rgba(255, 59, 48, 0.85); font-size: 20px; font-weight: 800; letter-spacing: 0.08em; }
    #p1-chat { left: 50px; width: 620px; top: 590px; height: 300px; padding: 22px 26px; }
    #p1-chat .hd { display: flex; align-items: center; gap: 14px; }
    #p1-chat .av { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(140deg, #6EA8FF, #9B7BD4); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; }
    #p1-chat .hd b { font-size: 26px; font-weight: 700; } #p1-chat .hd span { font-size: 20px; color: rgba(255, 255, 255, 0.72); display: block; }
    .p1-b { position: absolute; left: 26px; padding: 14px 20px; border-radius: 22px 22px 22px 8px; background: rgba(255, 255, 255, 0.2); font-size: 25px; font-weight: 500; opacity: 0; white-space: nowrap; }
    #p1-b1 { top: 104px; } #p1-b2 { top: 168px; }
    #p1-dots { position: absolute; left: 26px; top: 232px; width: 96px; height: 46px; border-radius: 23px; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; gap: 9px; opacity: 0; }
    #p1-dots i { display: block; width: 11px; height: 11px; border-radius: 50%; background: #fff; }
    #p1-nowords { position: absolute; right: 26px; top: 236px; padding: 8px 16px; border-radius: 14px; background: rgba(255, 102, 0, 0.9); font-size: 21px; font-weight: 800; letter-spacing: 0.06em; opacity: 0; }
    #p1-player { left: 50px; width: 620px; top: 590px; height: 300px; }
    #p1-scr { position: absolute; left: 14px; right: 14px; top: 14px; height: 206px; border-radius: 22px; overflow: hidden; background: radial-gradient(120% 100% at 30% 20%, rgba(110, 168, 255, 0.5), rgba(10, 12, 22, 0.8)); }
    #p1-sub { position: absolute; left: 0; right: 0; bottom: 18px; text-align: center; font-size: 28px; font-weight: 700; }
    #p1-sub span { padding: 6px 14px; border-radius: 10px; background: rgba(0, 0, 0, 0.55); }
    #p1-tag { position: absolute; left: 16px; top: 14px; padding: 6px 14px; border-radius: 999px; background: rgba(255, 59, 48, 0.9); font-size: 20px; font-weight: 800; letter-spacing: 0.1em; }
    #p1-bar { position: absolute; left: 14px; right: 14px; top: 216px; height: 6px; border-radius: 3px; background: rgba(255, 255, 255, 0.2); overflow: hidden; }
    #p1-fill { width: 100%; height: 100%; background: #FF3B30; transform-origin: 0 50%; }
    #p1-meta { position: absolute; left: 28px; right: 28px; bottom: 22px; display: flex; justify-content: space-between; align-items: center; }
    #p1-meta b { font-size: 27px; font-weight: 700; }
"""
SEARCH = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>'
P1_BODY = f"""    <div class="wipe-band" id="p1-band"></div>
    <div id="p1-search" class="glass"><div class="bar">{SEARCH}<span class="typed" id="p1-q">why do deals stall?</span><span class="caret" id="p1-caret"></span></div>
      <div id="p1-res"><span>0 RESULTS</span></div><div class="sheen"></div></div>
{cap("p1-k1", CAP_Y, ["Your", "product", "solves", "a", "problem"], ["prospects", "don't", "*know*", "yet."], big=52)}
    <div id="p1-chat" class="glass dark"><div class="hd"><div class="av">P</div><div><b>Prospect</b><span>typing…</span></div></div>
      <div id="p1-b1" class="p1-b">We need something that… hmm</div>
      <div id="p1-b2" class="p1-b">it's hard to explain.</div>
      <div id="p1-dots"><i></i><i></i><i></i></div><div id="p1-nowords">NO WORDS FOR IT</div><div class="sheen"></div></div>
{cap("p1-k2", CAP_Y, ["Right", "now,", "someone", "needs"], ["what", "you", "*built.*"])}
{cap("p1-k3", CAP_Y, ["and", "doesn't", "have"], ["the", "*words.*"])}
    <div id="p1-player" class="glass"><div id="p1-scr"><div id="p1-tag">● COMPETITOR</div><div id="p1-sub"><span id="p1-subt">Here's the problem you have…</span></div></div>
      <div id="p1-bar"><div id="p1-fill"></div></div><div id="p1-meta"><b>Product demo</b><span class="lab">ON VIDEO</span></div><div class="sheen"></div></div>
{cap("p1-k4", CAP_Y, ["The", "competition", "is", "giving", "them"], ["the", "words,", "on", "*video.*"])}"""
P1_JS = """
      tl.fromTo("#p1-band", { x: -1200, skewX: 30 }, { x: 800, skewX: 30, duration: 0.62, ease: "power3.inOut" }, 0);
      tl.fromTo("#p1-ft", { clipPath: "polygon(-800px 0px, -790px 0px, -51px 1280px, -800px 1280px)" },
        { clipPath: "polygon(-800px 0px, 800px 0px, 1539px 1280px, -800px 1280px)", duration: 0.62, ease: "power3.inOut" }, 0.02);
      tl.set("#p1-ft", { clipPath: "none" }, 0.7);

      // shot 1 (close-up): a prospect searches for a problem they can't name
      glassIn("#p1-search", 0.45); sheen("#p1-search", 0.9);
      tl.fromTo("#p1-q", { width: 0 }, { width: 240, duration: 1.2, ease: "none" }, 0.65);
      tl.fromTo("#p1-caret", { opacity: 1 }, { opacity: 0, duration: 0.25, ease: "steps(1)", yoyo: true, repeat: 7 }, 0.6);
      tl.fromTo("#p1-res", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 2.1);
      cap("p1-k1", [0.13, 0.27, 0.64, 0.82, 0.9, 1.39, 1.87, 2.03, 2.5], 2.78);
      glassOut("#p1-search", 2.78);

      // shot 2 (walking in): a prospect who can't find the words
      glassIn("#p1-chat", 3.3); sheen("#p1-chat", 3.8);
      tl.fromTo("#p1-b1", { opacity: 0, y: 14, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.36, ease: "back.out(2)" }, 4.2);
      tl.fromTo("#p1-b2", { opacity: 0, y: 14, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.36, ease: "back.out(2)" }, 5.5);
      tl.fromTo("#p1-dots", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 6.0);
      tl.fromTo("#p1-dots i", { y: 0 }, { y: -7, duration: 0.14, ease: "sine.inOut", yoyo: true, repeat: 3, stagger: 0.07 }, 6.05);
      tl.fromTo("#p1-nowords", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.6)" }, 6.69);
      cap("p1-k2", [3.62, 3.8, 4.89, 5.32, 5.53, 5.67, 5.77], 6.05);
      cap("p1-k3", [6.09, 6.24, 6.45, 6.61, 6.69], 7.32);
      glassOut("#p1-chat", 7.3);

      // "the competition is giving them the words, on video"
      glassIn("#p1-player", 7.45); sheen("#p1-player", 8.0);
      tl.fromTo("#p1-fill", { scaleX: 0 }, { scaleX: 1, duration: 2.0, ease: "none" }, 7.55);
      tl.fromTo("#p1-sub", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 8.3);
      cap("p1-k4", [7.5, 7.59, 8.19, 8.29, 8.51, 8.64, 8.7, 8.94, 9.07], null);
"""

# ── p2 · l2: "not a sales problem, a story problem… where I come in… scroll-stopping videos daily… you build the product, I make sure prospects see the problem" ──
P2_CSS = """
    #p2-diag { left: 60px; width: 600px; top: 600px; height: 210px; padding: 26px 30px; }
    #p2-line { display: flex; align-items: center; gap: 16px; margin-top: 24px; font-size: 54px; font-weight: 800; letter-spacing: -0.03em; }
    #p2-slot { position: relative; height: 64px; width: 172px; overflow: hidden; }
    #p2-col { position: absolute; left: 0; top: 0; }
    #p2-col div { height: 64px; line-height: 64px; }
    #p2-strike { position: absolute; left: 0; width: 168px; top: 30px; height: 6px; border-radius: 3px; background: #FF3B30; transform-origin: 0 50%; }
    #p2-phone { left: 220px; width: 280px; top: 460px; height: 470px; border-radius: 46px; padding: 12px; }
    #p2-scr { position: relative; width: 256px; height: 446px; border-radius: 36px; overflow: hidden; background: #0B0E18; }
    #p2-feed { position: absolute; left: 0; top: 0; width: 256px; }
    #p2-feed img { display: block; width: 256px; height: 455px; object-fit: cover; margin-bottom: 6px; }
    #p2-island { position: absolute; left: 50%; top: 10px; width: 84px; height: 24px; margin-left: -42px; border-radius: 12px; background: #000; }
    #p2-book { left: 60px; width: 600px; top: 740px; height: 160px; display: flex; align-items: center; gap: 24px; padding: 0 28px; }
    #p2-cal { width: 104px; height: 112px; border-radius: 22px; background: rgba(255, 255, 255, 0.92); color: #22162F; overflow: hidden; text-align: center; flex: 0 0 auto; }
    #p2-cal .m { background: #FF3B30; color: #fff; font-size: 20px; font-weight: 800; letter-spacing: 0.1em; padding: 6px 0; }
    #p2-cal .d { font-size: 54px; font-weight: 800; line-height: 74px; }
    #p2-book .t b { display: block; font-size: 34px; font-weight: 800; }
    #p2-book .t span { display: block; font-size: 23px; color: rgba(255, 255, 255, 0.8); margin-top: 6px; }
    #p2-ok { margin-left: auto; width: 60px; height: 60px; border-radius: 50%; background: #34C759; display: flex; align-items: center; justify-content: center; opacity: 0; }
"""
P2_BODY = f"""    <div id="p2-diag" class="glass"><div class="lab">DIAGNOSIS</div>
      <div id="p2-line"><div id="p2-slot"><div id="p2-col"><div>Sales</div><div class="o">Story</div></div><div id="p2-strike"></div></div><div>problem</div></div><div class="sheen"></div></div>
{cap("p2-k1", CAP_Y, ["Not", "a", "sales", "problem."], ["It's", "a", "*story*", "problem."], big=54)}
{cap("p2-k2", CAP_Y, ["And", "that's", "where"], ["I", "come", "in."])}
    <div id="p2-phone" class="glass"><div id="p2-scr"><div id="p2-feed">{"".join(f'<img src="assets/img/feed{i % 6}.jpg" />' for i in range(7))}</div><div id="p2-island"></div></div><div class="sheen"></div></div>
{cap("p2-k3", CAP_Y, ["*Scroll-stopping*"], ["videos,", "daily."])}
{cap("p2-k4", CAP_Y, [], ["You", "build", "the", "*product.*"], big=56)}
    <div id="p2-book" class="glass"><div id="p2-cal"><div class="m">TUE</div><div class="d">14</div></div>
      <div class="t"><b>Demo booked</b><span>They finally see the problem</span></div>
      <div id="p2-ok"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">{CHECK}</svg></div><div class="sheen"></div></div>
{cap("p2-k5", CAP_Y, ["I", "make", "sure", "prospects"], ["*see*", "the", "problem."])}"""
P2_JS = """
      // shot 1: the diagnosis changes — "sales" is struck, the slot rolls to "story"
      glassIn("#p2-diag", 0.1); sheen("#p2-diag", 0.6);
      tl.fromTo("#p2-strike", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power3.out" }, 0.66);
      tl.to("#p2-strike", { opacity: 0, duration: 0.15 }, 1.55);
      tl.fromTo("#p2-col", { y: 0 }, { y: -64, duration: 0.42, ease: "back.out(1.6)" }, 1.6);
      cap("p2-k1", [0.66, 0.79, 0.83, 1.14, 1.54, 1.67, 1.7, 2.04], 2.5);
      cap("p2-k2", [2.57, 2.69, 2.89, 3.0, 3.12, 3.34], 3.78);
      glassOut("#p2-diag", 3.6);

      // "scroll-stopping videos… daily"
      glassIn("#p2-phone", 3.85, { y: 120 }); sheen("#p2-phone", 4.8);
      tl.fromTo("#p2-feed", { y: 0 }, { y: -1600, duration: 0.6, ease: "power2.in" }, 4.0);
      tl.fromTo("#p2-feed", { y: -1600 }, { y: -1383, duration: 0.7, ease: "elastic.out(1, 0.45)", immediateRender: false }, 4.63);
      cap("p2-k3", [4.33, 4.98, 6.24], 6.68);
      glassOut("#p2-phone", 6.6);

      // shot 2 (close-up): "you build the product… I make sure prospects see the problem"
      cap("p2-k4", [6.95, 7.12, 7.31, 7.37], 7.95);
      glassIn("#p2-book", 8.05); sheen("#p2-book", 8.6);
      tl.fromTo("#p2-ok", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.36, ease: "back.out(2.8)" }, 9.25);
      cap("p2-k5", [8.01, 8.09, 8.25, 8.51, 9.25, 9.37, 9.44], null);
"""

# ── p3 · l3: "and the cost? seven dollars a day… less than a Big Mac… less than your morning coffee" (widgets on the right; the Big Mac stays visible) ──
P3_CSS = """
    #p3-card { left: 362px; width: 330px; top: 460px; height: 236px; padding: 22px 24px; border-radius: 30px;
      background: linear-gradient(140deg, rgba(120, 81, 169, 0.45), rgba(255, 102, 0, 0.25) 70%, rgba(255, 255, 255, 0.08)); }
    #p3-card .hd { display: flex; align-items: center; gap: 10px; }
    #p3-amt { position: absolute; left: 24px; top: 86px; white-space: nowrap; }
    #p3-amt b { font-size: 92px; font-weight: 800; letter-spacing: -0.05em; }
    #p3-amt span { font-size: 30px; font-weight: 600; margin-left: 8px; opacity: 0; display: inline-block; }
    .p3-row { left: 362px; width: 330px; height: 86px; border-radius: 24px; display: flex; align-items: center; gap: 14px; padding: 0 16px; }
    #p3-r1 { top: 712px; } #p3-r2 { top: 812px; }
    .p3-row .t { flex: 1; font-size: 24px; font-weight: 700; line-height: 1.1; }
    .p3-row .t small { display: block; font-size: 19px; font-weight: 700; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.75); }
    .p3-ok { width: 46px; height: 46px; border-radius: 50%; background: #34C759; display: flex; align-items: center; justify-content: center; opacity: 0; }
"""
P3_BODY = f"""    <div id="p3-card" class="glass"><div class="hd">{MARK.replace('width="34" height="60"', 'width="24" height="42"')}<span class="lab" style="font-size: 19px">SEVUN · DAILY VIDEO</span></div>
      <div id="p3-amt"><b id="p3-num">$0</b><span>/ day</span></div><div class="sheen"></div></div>
    <div id="p3-r1" class="glass p3-row"><div class="t"><small>LESS THAN</small>a Big Mac</div><div class="p3-ok"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">{CHECK}</svg></div><div class="sheen"></div></div>
    <div id="p3-r2" class="glass p3-row"><div class="t"><small>LESS THAN</small>your coffee</div><div class="p3-ok"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">{CHECK}</svg></div><div class="sheen"></div></div>
{cap("p3-k1", CAP_Y, [], ["And", "the", "*cost?*"])}
{cap("p3-k2", CAP_Y, ["Seven", "dollars"], ["a", "*day.*"])}
{cap("p3-k3", CAP_Y, ["That's", "less", "than"], ["a", "Big", "*Mac.*"])}
{cap("p3-k4", CAP_Y, ["Less", "than", "your"], ["morning", "*coffee.*"])}"""
P3_JS = """
      cap("p3-k1", [0.07, 0.22, 0.28], 1.3);
      glassIn("#p3-card", 1.35, { rotationY: -80, transformPerspective: 1200, y: 0 });
      count("#p3-num", 0, 7, 1.49, 0.6, (v) => "$" + Math.round(v));
      tl.fromTo("#p3-amt span", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }, 2.28);
      sheen("#p3-card", 2.4);
      tl.to("#p3-card", { rotationX: 8, rotationY: -8, transformPerspective: 1200, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 1 }, 2.8);
      cap("p3-k2", [1.49, 1.92, 2.28, 2.31], 3.9);
      glassIn("#p3-r1", 4.2, { x: 60, y: 0 }); sheen("#p3-r1", 4.6);
      tl.fromTo("#p3-r1 .p3-ok", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.36, ease: "back.out(2.8)" }, 5.06);
      cap("p3-k3", [4.22, 4.45, 4.67, 4.8, 4.84, 5.06], 6.6);
      glassIn("#p3-r2", 6.75, { x: 60, y: 0 }); sheen("#p3-r2", 7.1);
      tl.fromTo("#p3-r2 .p3-ok", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.36, ease: "back.out(2.8)" }, 7.66);
      cap("p3-k4", [6.89, 7.12, 7.25, 7.36, 7.66], null);
      glassOut("#p3-card, #p3-r1, #p3-r2", 7.85);
"""

# ── p4 · l4: "try us with one… don't pay… prospects have a problem they can't name… tell them the story before they write their own… DM us" ──
P4_CSS = TYPE_CSS + """
    #p4-tog { left: 50px; width: 620px; top: 660px; height: 220px; padding: 28px 30px; }
    .p4-line { display: flex; justify-content: space-between; align-items: center; }
    .p4-line b { font-size: 32px; font-weight: 700; }
    #p4-track { position: relative; width: 104px; height: 62px; border-radius: 31px; background: rgba(255, 255, 255, 0.24); }
    #p4-on { position: absolute; inset: 0; border-radius: 31px; background: #34C759; opacity: 0; }
    #p4-knob { position: absolute; left: 5px; top: 5px; width: 52px; height: 52px; border-radius: 50%; background: #fff; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3); }
    #p4-sep { height: 1px; background: rgba(255, 255, 255, 0.24); margin: 24px 0; }
    #p4-chip { padding: 8px 18px; border-radius: 999px; background: rgba(52, 199, 89, 0.9); font-size: 24px; font-weight: 800; letter-spacing: 0.06em; }
    #p4-doc { left: 50px; width: 620px; top: 590px; height: 300px; padding: 24px 28px; }
    #p4-doc .hd { display: flex; align-items: center; gap: 12px; }
    .p4-l { margin-top: 18px; font-size: 27px; font-weight: 600; }
    .p4-l .n { display: inline-block; width: 38px; height: 38px; border-radius: 50%; background: rgba(255, 255, 255, 0.2); text-align: center; line-height: 38px; font-size: 21px; font-weight: 800; margin-right: 12px; vertical-align: 2px; }
    .p4-l .typed { vertical-align: middle; }
    #p4-first { position: absolute; right: 26px; top: 22px; padding: 6px 14px; border-radius: 12px; background: rgba(255, 102, 0, 0.9); font-size: 20px; font-weight: 800; letter-spacing: 0.06em; opacity: 0; }
    #p4-typing { left: 50px; top: 966px; width: 150px; height: 76px; border-radius: 38px 38px 38px 10px; display: flex; align-items: center; justify-content: center; gap: 12px; }
    #p4-typing i { width: 14px; height: 14px; border-radius: 50%; background: #fff; display: block; }
    #p4-dm { left: 50px; top: 950px; height: 104px; padding: 0 36px 0 26px; border-radius: 44px 44px 44px 12px; display: flex; align-items: center; gap: 18px;
      background: linear-gradient(140deg, rgba(120, 81, 169, 0.85), rgba(120, 81, 169, 0.6)); font-size: 42px; font-weight: 700; white-space: nowrap; }
"""
PEN = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>'
P4_BODY = f"""    <div id="p4-tog" class="glass">
      <div class="p4-line"><b>Pay only if you like it</b><div id="p4-track"><div id="p4-on"></div><div id="p4-knob"></div></div></div>
      <div id="p4-sep"></div>
      <div class="p4-line"><span class="lab">FIRST VIDEO</span><span id="p4-chip">NO RISK</span></div><div class="sheen"></div></div>
{cap("p4-k1", CAP_Y, [], ["Try", "us", "with", "*one.*"])}
{cap("p4-k2", CAP_Y, ["If", "you", "don't", "like", "it,"], ["you", "don't", "*pay.*"])}
    <div id="p4-doc" class="glass dark"><div class="hd">{PEN}<span class="lab">YOUR STORY</span></div><div id="p4-first">TOLD FIRST</div>
      <div class="p4-l"><span class="n">1</span><span class="typed" id="p4-t1">The problem they can't name</span></div>
      <div class="p4-l"><span class="n">2</span><span class="typed" id="p4-t2">What it's costing them</span></div>
      <div class="p4-l"><span class="n">3</span><span class="typed" id="p4-t3">How your product fixes it</span></div>
      <div class="sheen"></div></div>
{cap("p4-k3", CAP_Y, ["Your", "prospects", "have", "a"], ["*problem*", "they", "can't", "name."], big=46)}
{cap("p4-k4", CAP_Y, ["Tell", "them", "the", "story"], ["before", "they", "write", "their", "*own.*"], big=44)}
    <div id="p4-typing" class="glass"><i></i><i></i><i></i></div>
    <div id="p4-dm" class="glass"><svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z" fill="rgba(255,255,255,0.18)"/></svg>DM us to get started<div class="sheen"></div></div>"""
P4_JS = """
      cap("p4-k1", [0.12, 0.4, 0.54, 0.69], 1.3);
      glassIn("#p4-tog", 0.5); sheen("#p4-tog", 1.0);
      cap("p4-k2", [1.42, 1.54, 1.63, 1.79, 2.03, 2.47, 2.59, 2.75], 3.4);
      tl.to("#p4-knob", { x: 42, duration: 0.34, ease: "back.out(1.8)" }, 2.75);
      tl.to("#p4-on", { opacity: 1, duration: 0.24, ease: "power2.out" }, 2.77);
      tl.fromTo("#p4-chip", { scale: 0.7 }, { scale: 1, duration: 0.36, ease: "back.out(3)" }, 2.85);
      glassOut("#p4-tog", 3.42);

      // the story writes itself, line by line
      glassIn("#p4-doc", 3.55); sheen("#p4-doc", 4.1);
      tl.fromTo("#p4-t1", { width: 0 }, { width: 380, duration: 0.9, ease: "none" }, 4.1);
      tl.fromTo("#p4-t2", { width: 0 }, { width: 320, duration: 0.8, ease: "none" }, 5.3);
      tl.fromTo("#p4-t3", { width: 0 }, { width: 370, duration: 0.9, ease: "none" }, 6.5);
      tl.fromTo("#p4-first", { opacity: 0, scale: 0.6, rotation: -8 }, { opacity: 1, scale: 1, rotation: -3, duration: 0.3, ease: "back.out(2.6)" }, 7.0);
      cap("p4-k3", [3.63, 3.75, 4.25, 4.39, 4.44, 4.88, 4.98, 5.29], 6.05);
      cap("p4-k4", [6.2, 6.4, 6.55, 6.61, 7.0, 7.27, 7.4, 7.6, 7.8], 8.05);
      glassOut("#p4-doc", 8.0);

      // "DM us to get started" — typing… then the message, in the footer
      glassIn("#p4-typing", 8.0, { y: 20, scale: 0.7 });
      tl.fromTo("#p4-typing i", { y: 0 }, { y: -8, duration: 0.1, ease: "sine.inOut", yoyo: true, repeat: 1, stagger: 0.05 }, 8.08);
      tl.set("#p4-typing", { opacity: 0 }, 8.3);
      glassIn("#p4-dm", 8.3, { y: 20, scale: 0.8 }); sheen("#p4-dm", 8.8);
"""


# ── closing burst: three glass hits on a dark field, then the orange stroke fills the frame ──
BURST_HTML = """<template>
  <style>
    #root { position: absolute; inset: 0; font-family: "Inter", sans-serif; color: #fff; overflow: hidden; background: #0A0D16; }
    .pb-blob { position: absolute; border-radius: 50%; }
    #pb-a { width: 700px; height: 700px; left: -220px; top: 120px; background: radial-gradient(circle, rgba(255, 102, 0, 0.55), transparent 65%); }
    #pb-b { width: 760px; height: 760px; right: -260px; bottom: 60px; background: radial-gradient(circle, rgba(120, 81, 169, 0.6), transparent 65%); }
    .pb-hit { position: absolute; left: 0; right: 0; top: 0; bottom: 0; display: flex; align-items: center; justify-content: center; opacity: 0; }
    .pb-hit div { padding: 26px 44px 30px; border-radius: 40px; font-size: 96px; font-weight: 800; letter-spacing: -0.04em; line-height: 1.02; text-align: center;
      background: linear-gradient(140deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.06)); backdrop-filter: blur(26px) saturate(1.7); -webkit-backdrop-filter: blur(26px) saturate(1.7);
      border: 1px solid rgba(255, 255, 255, 0.38); box-shadow: 0 26px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.55); }
    .o { color: #FF7A1F; }
    #pb-wipe { position: absolute; inset: 0; background: #FF6600; }
  </style>
  <div id="root" data-composition-id="pburst" data-width="720" data-height="1280">
    <div id="pb-a" class="pb-blob"></div><div id="pb-b" class="pb-blob"></div>
    <div id="pb-1" class="pb-hit"><div>Tell the<br /><span class="o">story.</span></div></div>
    <div id="pb-2" class="pb-hit"><div>Every<br />day.</div></div>
    <div id="pb-3" class="pb-hit"><div><span class="o">$7</span><br />a day.</div></div>
    <div id="pb-wipe" data-layout-ignore></div>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#pb-a", { x: 0, y: 0 }, { x: 160, y: -120, duration: 2.35, ease: "sine.inOut" }, 0);
      tl.fromTo("#pb-b", { x: 0, y: 0 }, { x: -140, y: 100, duration: 2.35, ease: "sine.inOut" }, 0);
      const hit = (sel, at, end) => {
        tl.fromTo(sel, { opacity: 0, scale: 1.12, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.2, ease: "expo.out" }, at);
        tl.set(sel, { opacity: 0 }, end);
      };
      hit("#pb-1", 0.0, 0.5);
      hit("#pb-2", 0.5, 0.95);
      hit("#pb-3", 0.95, 2.35);
      tl.fromTo("#pb-wipe", { clipPath: "polygon(-800px 0px, -790px 0px, -51px 1280px, -800px 1280px)" },
        { clipPath: "polygon(-800px 0px, 760px 0px, 1499px 1280px, -800px 1280px)", duration: 0.66, ease: "power3.in" }, 1.66);
      window.__timelines["pburst"] = tl;
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
    parts = {"p1": (P1_CSS, P1_BODY, P1_JS), "p2": (P2_CSS, P2_BODY, P2_JS), "p3": (P3_CSS, P3_BODY, P3_JS), "p4": (P4_CSS, P4_BODY, P4_JS)}
    for sid, _, dur, media, mstart in SCENES:
        css, body, js = parts[sid]
        with open(os.path.join(HERE, "compositions", f"{sid}.html"), "w") as f:
            f.write(scene(sid, dur, media, mstart, css, body + "\n", js))
    with open(os.path.join(HERE, "compositions", "pburst.html"), "w") as f:
        f.write(BURST_HTML)
    print("built index.html +", ", ".join(s[0] for s in SCENES), "+ pburst")


if __name__ == "__main__":
    main()

