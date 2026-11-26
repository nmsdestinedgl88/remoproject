#!/usr/bin/env python3
"""manevid3 motion kit: animated line icons + ambient decorations for the clientvid engine.

Use in an episode file:
    import engine, kit
    EXTRA_CSS = kit.CSS            # after BRAND is set
    PRE_JS    = kit.JS             # defines IC.* animators on the shared GSAP timeline
    HTML = kit.fill(HTML, BRAND)   # expands __K:...__ tokens and __INK__/__HOT__/__WHITE__
Tokens (fields split by |; ids use hyphens, never underscores):
  __K:icon:NAME|id|size|style__   __K:ring:id|size|style|dash|INK_or_HOT__
  __K:badge:id|size|style|img__   __K:spark:id|size|style__   __K:ripple:id|size|style__
  __K:float:id|count|seed__   __K:uline:id|width|style__
"""
import math, re, random

CSS = """
      .ik { position: absolute; overflow: visible; }
      .kfloat { position: absolute; inset: 0; pointer-events: none; }
      .kf { position: absolute; opacity: 0.32; }
      .kbadge { position: absolute; border-radius: 50%; }
      .kbadge .k-bg { position: absolute; inset: 0; border-radius: 50%; background: var(--card); }
      .kbadge .k-im { position: absolute; inset: 0; border-radius: 50%; overflow: hidden; }
      .kbadge .k-im img { display: block; width: 112%; margin: 2% 0 0 -6%; }
      .kbadge svg { position: absolute; overflow: visible; }
"""


def _k(markup):
    """Prefix every class with k- (engine CSS already owns .ln, .ck, .pin ...); ik and k* classes are left alone."""
    def one(m):
        return 'class="' + " ".join(c if c == "ik" or c.startswith("k") else "k-" + c for c in m.group(1).split()) + '"'
    return re.sub(r'class="([^"]+)"', one, markup)


def gear(cx, cy, R, r, n, off=0.0):
    pts, w = [], math.pi / n
    for i in range(n):
        a = 2 * w * i + math.radians(off)
        for rad, da in ((r, -0.5), (R, -0.28), (R, 0.28), (r, 0.5)):
            pts.append((cx + rad * math.cos(a + da * w), cy + rad * math.sin(a + da * w)))
    return "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + " Z"


def _typed_lines():
    ys = [46, 60, 74, 88, 102]
    ws = [78, 52, 86, 40, 66]
    hot = [0, 1, 0, 0, 1]
    return "".join(f'<rect class="ln" x="54" y="{y}" width="{w}" height="7" rx="3.5" fill="{"__HOT__" if h else "__INK__"}" stroke="none"/>' for y, w, h in zip(ys, ws, hot))


def _bars():
    out = ""
    for i, h in enumerate([34, 62, 92, 124]):
        x = 46 + i * 34
        out += f'<rect class="bar" x="{x}" y="{170 - h}" width="24" height="{h}" rx="4" fill="{"__HOT__" if i == 3 else "__WHITE__"}"/>'
    return out


def _rays(cx=100, cy=78, n=7):
    out = ""
    for i in range(n):
        a = math.radians(-180 + i * 180 / (n - 1))
        x1, y1, x2, y2 = cx + 54 * math.cos(a), cy + 54 * math.sin(a), cx + 74 * math.cos(a), cy + 74 * math.sin(a)
        out += f'<path class="ray" d="M{x1:.1f} {y1:.1f} L{x2:.1f} {y2:.1f}" stroke="__HOT__"/>'
    return out


def _awning():
    out = ""
    for i in range(5):
        out += f'<path class="aw" d="M{30 + i * 28} 56 H{58 + i * 28} V74 Q{44 + i * 28} 88 {30 + i * 28} 74 Z" fill="{"__HOT__" if i % 2 == 0 else "__WHITE__"}"/>'
    return out


def _clock_ticks():
    out = ""
    for i in range(12):
        a = math.radians(i * 30)
        r1 = 52 if i % 3 == 0 else 57
        out += f'<path d="M{100 + r1 * math.sin(a):.1f} {100 - r1 * math.cos(a):.1f} L{100 + 62 * math.sin(a):.1f} {100 - 62 * math.cos(a):.1f}" stroke-width="{5 if i % 3 == 0 else 3}"/>'
    return out


ICONS = {
    # two meshing gears; GA turns one way, GB the other at the tooth ratio
    "gear": lambda: (f'<path class="gA" d="{gear(80, 108, 62, 50, 10, -12)}" fill="__WHITE__"/><circle class="gA" cx="80" cy="108" r="14" fill="__HOT__"/><circle class="gA" cx="80" cy="82" r="5" fill="__INK__" stroke="none"/>'
                     f'<path class="gB" d="{gear(154, 62, 34, 26, 7, -4.3)}" fill="__WHITE__" stroke="__HOT__"/><circle class="gB" cx="154" cy="62" r="8" fill="__INK__" stroke="none"/>'),
    "bars": lambda: ('<path class="axes" d="M30 20 V170 H182"/>' + _bars() + '<path class="trend" d="M40 118 L92 84 L126 56 L166 22" stroke="__HOT__" stroke-width="7"/><path class="head" d="M142 22 H166 V46" stroke="__HOT__" stroke-width="7"/>'),
    "line": lambda: ('<path class="axes" d="M30 20 V170 H182"/><path class="area" d="M36 140 L72 112 L102 126 L140 72 L176 40 V170 H36 Z" fill="__HOT__" stroke="none" opacity="0.16"/>'
                     '<path class="ln1" d="M36 140 L72 112 L102 126 L140 72 L176 40" stroke="__HOT__" stroke-width="8"/><circle class="dot" cx="0" cy="0" r="10" fill="__INK__" stroke="__WHITE__" stroke-width="4"/><circle class="pulse" cx="176" cy="40" r="10" stroke="__HOT__" stroke-width="4"/>'),
    "pie": lambda: ('<circle cx="100" cy="100" r="64" fill="__WHITE__"/><g class="slg"><circle class="sl" cx="100" cy="100" r="31" stroke="__HOT__" stroke-width="62" stroke-linecap="butt" fill="none" transform="rotate(-90 100 100)" stroke-dasharray="0 400"/></g>'
                    '<circle cx="100" cy="100" r="64"/><path d="M100 100 L100 36 M100 100 L38 118"/>'),
    "laptop": lambda: ('<rect class="scr" x="40" y="26" width="120" height="92" rx="8" fill="__WHITE__"/>' + _typed_lines() + '<rect class="cur" x="0" y="0" width="6" height="12" fill="__HOT__" stroke="none"/>'
                       '<path class="base" d="M20 130 H180 L168 148 H32 Z" fill="__WHITE__"/><path d="M88 138 H112"/>'),
    "phone": lambda: ('<circle class="rip r1" cx="100" cy="90" r="70" stroke="__HOT__" stroke-width="4" fill="none"/><circle class="rip r2" cx="100" cy="90" r="70" stroke="__HOT__" stroke-width="4" fill="none"/>'
                      '<g class="ph"><rect x="62" y="14" width="76" height="152" rx="14" fill="__WHITE__"/><path d="M90 26 H110"/>'
                      '<rect class="msg" x="72" y="48" width="56" height="20" rx="8" fill="__INK__" stroke="none"/><rect class="msg" x="72" y="76" width="44" height="20" rx="8" fill="__HOT__" stroke="none"/><rect class="msg" x="72" y="104" width="56" height="20" rx="8" fill="__INK__" stroke="none"/>'
                      '<circle class="bdg" cx="138" cy="22" r="17" fill="__HOT__" stroke="__WHITE__" stroke-width="4"/><text class="bdgt" x="138" y="30" text-anchor="middle" font-family="Inter" font-weight="900" font-size="22" fill="__WHITE__" stroke="none">1</text></g>'),
    "coin": lambda: ('<g class="cn"><circle cx="100" cy="100" r="66" fill="__WHITE__"/><circle cx="100" cy="100" r="52" stroke-width="3" stroke-dasharray="3 9"/>'
                     '<text x="100" y="124" text-anchor="middle" font-family="Anton" font-size="78" fill="__HOT__" stroke="none">₦</text></g>'
                     '<path class="sp s1" d="M164 30 L168 42 L180 46 L168 50 L164 62 L160 50 L148 46 L160 42 Z" fill="__HOT__" stroke="none"/><path class="sp s2" d="M30 150 L33 158 L41 161 L33 164 L30 172 L27 164 L19 161 L27 158 Z" fill="__INK__" stroke="none"/>'),
    "clock": lambda: ('<circle cx="100" cy="100" r="68" fill="__WHITE__"/>' + _clock_ticks() + '<path class="hh" d="M100 100 V70" stroke-width="8"/><path class="mh" d="M100 100 V52" stroke="__HOT__" stroke-width="6"/><circle cx="100" cy="100" r="7" fill="__INK__"/><circle class="bell" cx="52" cy="34" r="10" fill="__HOT__" stroke="none"/><circle class="bell" cx="148" cy="34" r="10" fill="__HOT__" stroke="none"/>'),
    "magnifier": lambda: ('<rect x="28" y="22" width="120" height="150" rx="10" fill="__WHITE__"/><path d="M48 50 H108 M48 76 H128 M48 102 H96 M48 128 H116" stroke-width="5"/>'
                          '<g class="lens"><circle cx="0" cy="0" r="34" fill="__WHITE__" fill-opacity="0.55" stroke="__HOT__" stroke-width="8"/><path d="M24 24 L52 52" stroke="__HOT__" stroke-width="12"/><path d="M-16 -14 A22 22 0 0 1 2 -22" stroke="__INK__" stroke-width="4"/></g>'),
    "bulb": lambda: ('<circle class="glow" cx="100" cy="82" r="56" fill="__HOT__" stroke="none" opacity="0.16"/>' + _rays() + '<path class="bb" d="M100 36 C72 36 58 58 60 80 C62 98 76 106 78 122 H122 C124 106 138 98 140 80 C142 58 128 36 100 36 Z" fill="__WHITE__"/><path class="fil" d="M86 100 L94 80 L100 96 L106 80 L114 100" stroke="__HOT__" stroke-width="5"/><path d="M80 136 H120 M84 150 H116 M92 164 H108"/>'),
    "truck": lambda: ('<g class="road"><path d="M10 160 H190"/><path class="dash" d="M10 174 H190" stroke-dasharray="22 20" stroke-width="4"/></g><g class="spd"><path class="sl1" d="M6 84 H30" stroke="__HOT__"/><path class="sl1" d="M0 104 H24" stroke="__HOT__"/><path class="sl1" d="M10 124 H30" stroke="__HOT__"/></g>'
                      '<g class="tb"><rect x="30" y="52" width="92" height="76" rx="6" fill="__WHITE__"/><path d="M30 84 H122" stroke="__HOT__" stroke-width="12"/><path d="M122 76 H152 L176 104 V128 H122 Z" fill="__WHITE__"/><path d="M130 84 H148 L162 102 H130 Z" fill="__INK__" stroke="none"/><path d="M30 128 H176"/>'
                      '<g class="wh w1"><circle cx="64" cy="132" r="19" fill="__WHITE__"/><path d="M64 118 V146 M50 132 H78" stroke-width="4"/></g><g class="wh w2"><circle cx="148" cy="132" r="19" fill="__WHITE__"/><path d="M148 118 V146 M134 132 H162" stroke-width="4"/></g></g>'),
    "doc": lambda: ('<path class="pg" d="M46 18 H122 L160 56 V182 H46 Z" fill="__WHITE__"/><path d="M122 18 V56 H160"/><path class="dl" d="M64 82 H140 M64 104 H140 M64 126 H112" stroke-width="5"/>'
                    '<g class="ck"><circle cx="138" cy="150" r="26" fill="__HOT__"/><path d="M126 150 L135 159 L151 140" stroke="__WHITE__" stroke-width="7"/></g>'),
    "pin": lambda: ('<ellipse class="gr" cx="100" cy="170" rx="30" ry="8" fill="__INK__" stroke="none" opacity="0.18"/><ellipse class="rp rp1" cx="100" cy="170" rx="30" ry="8" stroke="__HOT__" stroke-width="4"/><ellipse class="rp rp2" cx="100" cy="170" rx="30" ry="8" stroke="__HOT__" stroke-width="4"/>'
                    '<g class="pn"><path d="M100 20 C70 20 52 42 52 68 C52 100 100 152 100 152 C100 152 148 100 148 68 C148 42 130 20 100 20 Z" fill="__WHITE__"/><circle cx="100" cy="68" r="17" fill="__HOT__"/></g>'),
    "shield": lambda: ('<defs><clipPath id="{id}-c"><path d="M100 16 L158 38 V92 C158 128 134 154 100 172 C66 154 42 128 42 92 V38 Z"/></clipPath></defs><g class="sh"><path d="M100 16 L158 38 V92 C158 128 134 154 100 172 C66 154 42 128 42 92 V38 Z" fill="__WHITE__"/>'
                       '<g clip-path="url(#{id}-c)"><path class="gl" d="M-30 0 L0 0 L-20 190 L-50 190 Z" fill="__HOT__" stroke="none" opacity="0.22"/></g></g><path class="chk" d="M72 94 L92 114 L130 70" stroke="__HOT__" stroke-width="12"/>'),
    "shop": lambda: ('<rect class="bd" x="34" y="74" width="132" height="98" rx="4" fill="__WHITE__"/>' + _awning() + '<rect x="30" y="50" width="140" height="10" rx="3" fill="__INK__"/><rect x="48" y="104" width="52" height="40" rx="3"/><rect x="118" y="104" width="30" height="68" rx="3" fill="__INK__"/>'
                     '<g class="sg"><path d="M133 104 V118" stroke-width="3"/><rect x="124" y="118" width="18" height="12" rx="2" fill="__HOT__" stroke="none"/></g><path class="sh" d="M52 128 H96" stroke="__HOT__" stroke-width="4"/>'),
    "factory": lambda: ('<g class="smk"><circle class="pf p1" cx="52" cy="40" r="10" fill="__WHITE__"/><circle class="pf p2" cx="52" cy="40" r="10" fill="__WHITE__"/><circle class="pf p3" cx="52" cy="40" r="10" fill="__WHITE__"/></g>'
                        '<path class="fb" d="M26 172 V90 L72 66 V90 L118 66 V90 L164 66 V172 Z" fill="__WHITE__"/><rect x="44" y="52" width="16" height="48" fill="__WHITE__"/><path d="M26 172 H164"/>'
                        '<rect class="win" x="42" y="112" width="22" height="18" fill="__HOT__" stroke="none"/><rect class="win" x="82" y="112" width="22" height="18" fill="__HOT__" stroke="none"/><rect class="win" x="122" y="112" width="22" height="18" fill="__HOT__" stroke="none"/><rect x="84" y="142" width="26" height="30" fill="__INK__"/>'),
    "note": lambda: ('<defs><clipPath id="{id}-n"><rect x="24" y="58" width="152" height="88" rx="8"/></clipPath></defs><g class="nt"><rect x="30" y="64" width="140" height="84" rx="8" fill="__WHITE__" transform="translate(8 -8)"/><rect class="nm" x="24" y="58" width="152" height="88" rx="8" fill="__WHITE__"/><rect x="36" y="70" width="128" height="64" rx="4" stroke-width="3" stroke-dasharray="8 8"/>'
                     '<circle cx="100" cy="102" r="24" fill="__HOT__"/><text x="100" y="116" text-anchor="middle" font-family="Anton" font-size="40" fill="__WHITE__" stroke="none">₦</text><circle cx="52" cy="102" r="6" fill="__INK__" stroke="none"/><circle cx="148" cy="102" r="6" fill="__INK__" stroke="none"/>'
                     '<g clip-path="url(#{id}-n)"><path class="shine" d="M-10 50 L10 50 L-10 160 L-30 160 Z" fill="__HOT__" stroke="none" opacity="0.2"/></g></g>'),
}


def _icon(name, id, size, style=""):
    inner = ICONS[name]().replace("{id}", id)
    return (f'<svg class="ik" id="{id}" viewBox="0 0 200 200" width="{size}" height="{size}" style="{style}" fill="none" stroke="__INK__" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">{inner}</svg>')


def _ring(id, size, style="", dash="14 18", colour="INK"):
    size = int(size); r = size / 2 - 6
    return (f'<svg class="ik" id="{id}" width="{size}" height="{size}" viewBox="0 0 {size} {size}" style="{style}" fill="none"><circle cx="{size / 2}" cy="{size / 2}" r="{r}" stroke="__{colour}__" stroke-width="5" stroke-dasharray="{dash}" stroke-linecap="round"/></svg>')


def _badge(id, size, style, img):
    s = int(size)
    return (f'<div class="kbadge" id="{id}" style="width:{s}px;height:{s}px;{style}"><div class="bg"></div>'
            f'<svg class="rg" style="left:-18px;top:-18px" width="{s + 36}" height="{s + 36}" viewBox="0 0 {s + 36} {s + 36}" fill="none"><circle cx="{(s + 36) / 2}" cy="{(s + 36) / 2}" r="{s / 2 + 8}" stroke="__HOT__" stroke-width="5" stroke-dasharray="12 16" stroke-linecap="round"/></svg>'
            f'<svg class="ob" style="left:-18px;top:-18px" width="{s + 36}" height="{s + 36}" viewBox="0 0 {s + 36} {s + 36}"><circle cx="{(s + 36) / 2}" cy="9" r="9" fill="__INK__"/></svg>'
            f'<div class="im" data-layout-allow-overflow><img src="{img}" alt=""></div></div>')


def _spark(id, size, style=""):
    return (f'<svg class="ik" id="{id}" width="{size}" height="{size}" viewBox="0 0 40 40" style="{style}"><path d="M20 0 L24 16 L40 20 L24 24 L20 40 L16 24 L0 20 L16 16 Z" fill="__HOT__"/></svg>')


def _ripple(id, size, style=""):
    return (f'<svg class="ik" id="{id}" width="{size}" height="{size}" viewBox="0 0 100 100" style="{style}" fill="none" stroke="__HOT__" stroke-width="3"><circle class="rp rp1" cx="50" cy="50" r="46"/><circle class="rp rp2" cx="50" cy="50" r="46"/></svg>')


def _float(id, count, seed):
    r = random.Random(int(seed))
    out = f'<div class="kfloat" id="{id}">'
    for i in range(int(count)):
        x, y, k = r.randint(0, 930), r.randint(0, 1030), r.choice(["plus", "dot", "ring", "tri"])
        sz = r.randint(18, 34)
        shape = {"plus": f'<path d="M{sz / 2} 3 V{sz - 3} M3 {sz / 2} H{sz - 3}" stroke="__INK__" stroke-width="4" stroke-linecap="round"/>',
                 "dot": f'<circle cx="{sz / 2}" cy="{sz / 2}" r="{sz / 4}" fill="__HOT__"/>',
                 "ring": f'<circle cx="{sz / 2}" cy="{sz / 2}" r="{sz / 2 - 3}" stroke="__HOT__" stroke-width="4" fill="none"/>',
                 "tri": f'<path d="M{sz / 2} 4 L{sz - 4} {sz - 4} H4 Z" stroke="__INK__" stroke-width="4" stroke-linejoin="round" fill="none"/>'}[k]
        out += f'<svg class="kf" style="left:{x}px;top:{y}px" width="{sz}" height="{sz}" viewBox="0 0 {sz} {sz}">{shape}</svg>'
    return out + "</div>"


def _uline(id, width, style=""):
    w = int(width)
    return (f'<svg class="ik" id="{id}" width="{w}" height="26" viewBox="0 0 {w} 26" style="{style}" fill="none"><path class="ul" d="M4 16 Q{w * 0.25:.0f} 4 {w * 0.5:.0f} 14 T{w - 4} 12" stroke="__HOT__" stroke-width="8" stroke-linecap="round"/></svg>')


def fill(html, brand):
    """Expand kit tokens and colour tokens. `html` is a dict {scene_id: markup} or a string."""
    import engine
    P = engine.palette(*brand)
    cols = {"__INK__": brand[0], "__HOT__": brand[1], "__WHITE__": P["white"], "__BG__": brand[2], "__CARD__": P["card"]}

    def one(s):
        def tok(m):
            kind, args = m.group(1), m.group(2).split("|")
            if kind == "icon":
                return _k(_icon(args[0], *args[1:]))
            return _k({"ring": _ring, "badge": _badge, "spark": _spark, "ripple": _ripple, "float": _float, "uline": _uline}[kind](*args))
        s = re.sub(r"__K:([a-z]+):([^_]*?)__", lambda m: tok(m), s)
        for k, v in cols.items():
            s = s.replace(k, v)
        return s
    return {k: one(v) for k, v in html.items()} if isinstance(html, dict) else one(html)


JS = r"""
      // ---- manevid3 motion kit (all motion lives on the shared paused timeline, so it is frame-exact) ----
      const IC = (() => {
        const Qs = (id, c) => `#${id} .k-${c}`;
        const O = (x, y) => `${x} ${y}`;
        // finite oscillation: from -> to -> from ..., never longer than d
        const osc = (sel, t, d, p, from, to, ease = "sine.inOut") => tl.fromTo(sel, { ...from, immediateRender: false }, { ...to, duration: p / 2, ease, yoyo: true, repeat: Math.max(1, Math.floor(d / (p / 2))) - 1 }, t);
        const spin = (sel, t, d, deg, ox, oy) => tl.fromTo(sel, { rotation: 0, svgOrigin: O(ox, oy) }, { rotation: deg, svgOrigin: O(ox, oy), duration: d, ease: "none" }, t);
        const enter = (id, t) => tl.fromTo("#" + id, { opacity: 0, scale: 0.8, transformOrigin: "50% 60%" }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, t);
        const bob = (id, t, d, amp = 7, p = 2.4) => osc("#" + id, t + 0.5, d - 0.5, p, { y: 0 }, { y: -amp });
        const twinkle = (sel, t, d, p = 1.4) => tl.fromTo(sel, { scale: 0.55, rotation: 0, opacity: 0.4, transformOrigin: "50% 50%" }, { scale: 1.05, rotation: 90, opacity: 1, duration: p / 2, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, Math.floor(d / (p / 2))) - 1 }, t);
        const rip = (sel, t, d, p = 1.6, to = 1.5) => Q(sel).forEach((el, i) => tl.fromTo(el, { scale: 0.55, opacity: 0.8, transformOrigin: "50% 50%" }, { scale: to, opacity: 0, duration: p, ease: "power2.out", repeat: Math.max(1, Math.floor(d / p)) - 1 }, t + i * p / 2));
        const I = {};

        I.gear = (id, t, d) => { enter(id, t); spin(Qs(id, "gA"), t + 0.2, d, 360 * d / 6, 80, 108); spin(Qs(id, "gB"), t + 0.2, d, -360 * (10 / 7) * d / 6, 154, 62); };
        I.bars = (id, t, d) => { enter(id, t); draw(Qs(id, "axes"), t + 0.1, 0.5);
          Q(Qs(id, "bar")).forEach((b, i) => tl.fromTo(b, { scaleY: 0.02, svgOrigin: O(+b.getAttribute("x") + 12, 170) }, { scaleY: 1, svgOrigin: O(+b.getAttribute("x") + 12, 170), duration: 0.7, ease: "elastic.out(1,0.55)" }, t + 0.35 + i * 0.14));
          draw(Qs(id, "trend"), t + 1.0, 0.9); draw(Qs(id, "head"), t + 1.8, 0.3); osc(Qs(id, "bar") + ":last-of-type", t + 2.4, d - 2.4, 1.6, { scaleY: 1, svgOrigin: O(160, 170) }, { scaleY: 1.07, svgOrigin: O(160, 170) }); };
        I.line = (id, t, d) => { enter(id, t); draw(Qs(id, "axes"), t + 0.1, 0.5); tl.fromTo(Qs(id, "area"), { opacity: 0 }, { opacity: 0.16, duration: 0.6 }, t + 1.3); draw(Qs(id, "ln1"), t + 0.5, 1.2);
          const path = document.querySelector(Qs(id, "ln1")), dot = document.querySelector(Qs(id, "dot")), L = path.getTotalLength(), o = { p: 0 }, place = () => { const pt = path.getPointAtLength(o.p * L); dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y); };
          place(); tl.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.1 }, t + 0.5); tl.to(o, { p: 1, duration: 1.2, ease: "power2.inOut", onUpdate: place }, t + 0.5); rip(Qs(id, "pulse"), t + 1.7, d - 1.7, 1.4, 2.2); };
        I.pie = (id, t, d) => { enter(id, t); const sl = Qs(id, "sl"); tl.fromTo(sl, { attr: { "stroke-dasharray": "0 400" } }, { attr: { "stroke-dasharray": "68 400" }, duration: 1.1, ease: "power3.out" }, t + 0.4);
          tl.fromTo(Qs(id, "slg"), { x: 0, y: 0 }, { x: 9, y: -5, duration: 0.5, ease: "back.out(2)" }, t + 1.6); osc(Qs(id, "slg"), t + 2.4, d - 2.4, 1.8, { x: 9, y: -5 }, { x: 3, y: -2 }); };
        I.laptop = (id, t, d) => { enter(id, t); const lines = Q(Qs(id, "ln")), cur = document.querySelector(Qs(id, "cur")); let tt = t + 0.6; const cyc = [];
          lines.forEach((ln, i) => { const x = +ln.getAttribute("x"), y = +ln.getAttribute("y"), w = +ln.getAttribute("width"), dur = 0.25 + w / 140; cyc.push([ln, x, y, w, dur]); });
          const total = cyc.reduce((a, c) => a + c[4] + 0.12, 0), period = total + 1.3; let k = 0;
          for (let start = t + 0.6; start + total <= t + d + 0.05; start += period, k++) { let u = start;
            cyc.forEach(([ln, x, y, w, dur]) => { if (k) tl.set(ln, { scaleX: 0.0001 }, u - 0.01); tl.fromTo(ln, { scaleX: 0.0001, svgOrigin: O(x, y) }, { scaleX: 1, svgOrigin: O(x, y), duration: dur, ease: "steps(10)" }, u);
              tl.set(cur, { x, y: y - 2 }, u); tl.fromTo(cur, { x }, { x: x + w, duration: dur, ease: "steps(10)" }, u); u += dur + 0.12; });
            if (start + period <= t + d) cyc.forEach(([ln, x, y]) => tl.to(ln, { scaleX: 0.0001, svgOrigin: O(x, y), duration: 0.25, ease: "power2.in" }, start + total + 0.9)); }
          tl.set(cur, { x: 54, y: 44 }, t); osc(cur, t + 0.6, d - 0.6, 0.6, { opacity: 1 }, { opacity: 0.15 }, "steps(1)"); };
        I.phone = (id, t, d) => { enter(id, t); tl.fromTo(Qs(id, "msg"), { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.25 }, t + 0.5); tl.fromTo(Qs(id, "bdg") + "," + Qs(id, "bdgt"), { scale: 0.3, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(3)" }, t + 1.3);
          rip(Qs(id, "rip"), t + 1.3, d - 1.3, 1.6, 1.4);
          for (let u = t + 1.4; u < t + d - 0.5; u += 2.2) tl.fromTo(Qs(id, "ph"), { rotation: 0, svgOrigin: O(100, 90) }, { rotation: 0, svgOrigin: O(100, 90), keyframes: [{ rotation: -5, duration: 0.07 }, { rotation: 5, duration: 0.1 }, { rotation: -4, duration: 0.1 }, { rotation: 3, duration: 0.08 }, { rotation: 0, duration: 0.08 }] }, u); };
        I.coin = (id, t, d) => { enter(id, t); const g = document.querySelector(Qs(id, "cn")), o = { a: 0 }, put = () => gsap.set(g, { scaleX: Math.max(0.04, Math.abs(Math.cos(o.a))), svgOrigin: O(100, 100) });
          put(); tl.to(o, { a: Math.PI * 2 * Math.max(1, d / 1.8), duration: d, ease: "none", onUpdate: put }, t + 0.3); twinkle(Qs(id, "s1"), t + 0.6, d - 0.6, 1.3); twinkle(Qs(id, "s2"), t + 1.0, d - 1.0, 1.7); bob(id, t, d, 6, 2.2); };
        I.clock = (id, t, d) => { enter(id, t); spin(Qs(id, "mh"), t + 0.3, d, 360 * d / 2.4, 100, 100); spin(Qs(id, "hh"), t + 0.3, d, 360 * d / 28.8, 100, 100); osc(Qs(id, "bell"), t + 1, d - 1, 0.5, { rotation: -8, svgOrigin: "100 100" }, { rotation: 8, svgOrigin: "100 100" }); };
        I.magnifier = (id, t, d) => { enter(id, t); const L = document.querySelector(Qs(id, "lens")); gsap.set(L, { x: 62, y: 70 });
          tl.fromTo(L, { x: 62, y: 70 }, { x: 62, y: 70, duration: 0.01 }, t); osc(L, t + 0.5, d - 0.5, 3.0, { x: 62 }, { x: 118 }); osc(L, t + 0.5, d - 0.5, 2.2, { y: 66 }, { y: 112 }); };
        I.bulb = (id, t, d) => { enter(id, t); tl.fromTo(Qs(id, "glow"), { scale: 0.4, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 0.16, duration: 0.6, ease: "power3.out" }, t + 0.4);
          tl.fromTo(Qs(id, "ray"), { opacity: 0, scale: 0.6, svgOrigin: "100 78" }, { opacity: 1, scale: 1, svgOrigin: "100 78", duration: 0.35, ease: "back.out(2)", stagger: 0.07 }, t + 0.5);
          osc(Qs(id, "glow"), t + 1.4, d - 1.4, 1.6, { opacity: 0.1, scale: 0.95 }, { opacity: 0.26, scale: 1.08 }); osc(Qs(id, "ray"), t + 1.4, d - 1.4, 1.2, { opacity: 1 }, { opacity: 0.45 }); };
        I.truck = (id, t, d) => { tl.fromTo("#" + id, { opacity: 0, x: -260 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, t);
          spin(Qs(id, "w1"), t, d, 360 * d / 0.7, 64, 132); spin(Qs(id, "w2"), t, d, 360 * d / 0.7, 148, 132); osc(Qs(id, "tb"), t + 0.8, d - 0.8, 0.36, { y: 0 }, { y: -2.5 });
          tl.fromTo(Qs(id, "dash"), { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": 170 * d }, duration: d, ease: "none" }, t);
          tl.fromTo(Qs(id, "sl1"), { x: 10, opacity: 0 }, { x: -26, opacity: 0.9, duration: 0.45, ease: "power1.out", repeat: Math.max(1, Math.floor((d - 0.8) / 0.45)) - 1, stagger: 0.1 }, t + 0.8); };
        I.doc = (id, t, d) => { enter(id, t); draw(Qs(id, "dl"), t + 0.4, 0.9); tl.fromTo(Qs(id, "ck"), { opacity: 0, scale: 2.2, rotation: -12, svgOrigin: "138 150" }, { opacity: 1, scale: 1, rotation: -6, svgOrigin: "138 150", duration: 0.3, ease: "power4.in" }, t + 1.5);
          tl.fromTo(Qs(id, "pg"), { y: 0 }, { y: 4, duration: 0.07, yoyo: true, repeat: 3 }, t + 1.8); osc(Qs(id, "ck"), t + 2.4, d - 2.4, 1.8, { rotation: -6, svgOrigin: "138 150" }, { rotation: 2, svgOrigin: "138 150" }); };
        I.pin = (id, t, d) => { tl.fromTo("#" + id, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t); tl.fromTo(Qs(id, "pn"), { y: -150 }, { y: 0, duration: 0.8, ease: "bounce.out" }, t + 0.1);
          tl.fromTo(Qs(id, "gr"), { scale: 0.3, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 0.18, duration: 0.5, ease: "power2.out" }, t + 0.4); rip(Qs(id, "rp"), t + 0.9, d - 0.9, 1.5, 2.2); osc(Qs(id, "pn"), t + 1.2, d - 1.2, 1.8, { y: 0 }, { y: -9 }); };
        I.shield = (id, t, d) => { enter(id, t); draw(Qs(id, "chk"), t + 0.6, 0.55);
          const glint = (u) => tl.fromTo(Qs(id, "gl"), { x: 0 }, { x: 240, duration: 0.9, ease: "power2.inOut" }, u); for (let u = t + 1.4; u < t + d - 0.9; u += 2.4) glint(u); osc(Qs(id, "sh"), t + 1, d - 1, 2.0, { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.03, transformOrigin: "50% 50%" }); };
        I.shop = (id, t, d) => { enter(id, t); tl.fromTo(Qs(id, "aw"), { y: -26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.08 }, t + 0.4);
          osc(Qs(id, "sg"), t + 1.2, d - 1.2, 1.6, { rotation: -10, svgOrigin: "133 104" }, { rotation: 10, svgOrigin: "133 104" }); osc(Qs(id, "sh"), t + 1.2, d - 1.2, 1.2, { opacity: 1 }, { opacity: 0.35 }); };
        I.factory = (id, t, d) => { enter(id, t); tl.fromTo(Qs(id, "win"), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.18 }, t + 0.6);
          Q(Qs(id, "pf")).forEach((el, i) => tl.fromTo(el, { x: 0, y: 0, scale: 0.5, opacity: 0.9, transformOrigin: "50% 50%" }, { x: 16 + i * 4, y: -46, scale: 1.5, opacity: 0, duration: 1.8, ease: "power1.out", repeat: Math.max(1, Math.floor(d / 1.8)) - 1 }, t + 0.5 + i * 0.6)); };
        I.note = (id, t, d) => { enter(id, t); osc(Qs(id, "nt"), t + 0.5, d - 0.5, 2.4, { y: 0, rotation: -3, svgOrigin: "100 100" }, { y: -8, rotation: 3, svgOrigin: "100 100" });
          for (let u = t + 1.0; u < t + d - 1.2; u += 2.2) tl.fromTo(Qs(id, "shine"), { x: 0 }, { x: 190, duration: 0.9, ease: "power2.inOut" }, u); };

        // ---- ambient pieces ----
        I.ring = (id, t, d, dir = 1) => { tl.fromTo("#" + id, { opacity: 0, scale: 0.6, rotation: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, rotation: 25 * dir, duration: 0.7, ease: "back.out(1.4)" }, t); tl.to("#" + id, { rotation: 25 * dir + 40 * dir * d, duration: d, ease: "none" }, t + 0.7); };
        I.badge = (id, t, d) => { tl.fromTo("#" + id, { opacity: 0, scale: 0.2, rotation: -20, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, rotation: 6, duration: 0.5, ease: "back.out(2)" }, t); tl.to("#" + id, { rotation: -4, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 2 }, t + 0.5);
          tl.fromTo(`#${id} .k-rg`, { rotation: 0, transformOrigin: "50% 50%" }, { rotation: 40 * d, duration: d, ease: "none" }, t); tl.fromTo(`#${id} .k-ob`, { rotation: 0, transformOrigin: "50% 50%" }, { rotation: -90 * d, duration: d, ease: "none" }, t); };
        I.spark = (id, t, d) => twinkle("#" + id, t, d, 1.2);
        I.ripple = (id, t, d) => rip(Qs(id, "rp"), t, d, 1.8, 1.0);
        I.uline = (id, t) => draw(Qs(id, "ul"), t, 0.45);
        I.float = (id, t, d) => { const r = rng(id.length * 131 + 7); Q(`#${id} .kf`).forEach((el) => { const p = 3 + r() * 3; tl.fromTo(el, { opacity: 0 }, { opacity: 0.32, duration: 0.6 }, t + r() * 0.6); osc(el, t, d, p, { y: 0, rotation: 0, transformOrigin: "50% 50%" }, { y: (r() > 0.5 ? 1 : -1) * (10 + r() * 14), rotation: (r() - 0.5) * 50 }); }); };
        I.stripes = (sel, t, d) => tl.fromTo(sel, { backgroundPosition: "0px 0px" }, { backgroundPosition: (130 * Math.ceil(d / 4.6)) + "px 0px", duration: d, ease: "none" }, t);
        I.march = (sel, t, d, speed = 60) => tl.fromTo(sel, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -speed * d }, duration: d, ease: "none" }, t);
        return I;
      })();
"""
