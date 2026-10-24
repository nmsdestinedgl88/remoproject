"""Page furniture + landmark helpers for Scout Explores Tennessee."""
import math
from scout import *
from scout import _f
from charlib import _serialize, _caption_lines, _caption_start
import cairosvg

GROUND = 935

DIV_LABEL = {"W": "WEST TENNESSEE", "M": "MIDDLE TENNESSEE", "E": "EAST TENNESSEE"}


def flag_star(cx, cy, r=30):
    """A flag star: Tennessee-flag blue-circle badge with one star inside. Colorable."""
    return C(cx, cy, r, 4, "white") + star(cx, cy + 1, r * 0.72, 3.4, "white")


def star_legend():
    cx, cy = 762, 78
    o = C(cx, cy, 24, 3.5, "white")
    for dx, dy in ((0, -9), (-9, 6), (9, 6)):
        o += star(cx + dx, cy + dy, 8, 2.2, "white")
    t = TXT(cx, 128, "Find & color", 15, weight="normal") + TXT(cx, 146, "3 flag stars!", 15, weight="normal")
    return '<g data-chrome="1">' + o + t + "</g>"


def zone_tag(div, x=118, y=78):
    s = DIV_LABEL[div]
    w = text_width(s, 15) + 30
    return ('<g data-chrome="1">' + P(f"M {x-w/2+12} {y-17} L {x+w/2-12} {y-17} Q {x+w/2} {y-17} {x+w/2} {y-5} "
                                    f"L {x+w/2} {y+5} Q {x+w/2} {y+17} {x+w/2-12} {y+17} L {x-w/2+12} {y+17} "
                                    f"Q {x-w/2} {y+17} {x-w/2} {y+5} L {x-w/2} {y-5} Q {x-w/2} {y-17} {x-w/2+12} {y-17} Z", 2.5)
            + TXT(x, y + 5, s, 15) + "</g>")


def city_page(num, name, div, nickname, fact, body, title_size=46):
    cap = f"Nickname: “{nickname}”  ·  Fun fact: {fact}" if nickname else f"Fun fact: {fact}"
    clip = ('<defs><clipPath id="pgclip"><rect x="44" y="150" width="762" height="866" rx="10"/></clipPath></defs>'
            '<g clip-path="url(#pgclip)">' + body + "</g>")
    svg = spage(name, clip + zone_tag(div) + star_legend(), num=num, caption=cap, title_size=title_size)
    return svg


def ground(y=GROUND, x0=50, x1=800, sw=4):
    return LINE(x0, y, x1, y, sw)


def tufts(xs, y):
    return "".join(grass_tuft(x, y) for x in xs)


# ------------------------------------------------------------ landmarks
def columns(x0, x1, y_top, y_bot, n, w=22, sw=4):
    out = []
    gap = (x1 - x0 - n * w) / (n - 1)
    for i in range(n):
        cx = x0 + i * (w + gap)
        out.append(P(f"M {cx} {y_top} L {cx+w} {y_top} L {cx+w} {y_bot} L {cx} {y_bot} Z", sw, "white"))
        out.append(P(f"M {cx-5} {y_top} L {cx+w+5} {y_top}", sw))
        out.append(P(f"M {cx+w*0.38} {y_top+14} L {cx+w*0.38} {y_bot-14}", 2.2))
    return "".join(out)


def parthenon(cx, gy, w=430, h=380):
    """Temple front: 3 steps, 8 columns, entablature, pediment."""
    x0, x1 = cx - w / 2, cx + w / 2
    out = []
    for i, k in enumerate((0, 16, 32)):
        out.append(P(f"M {x0+k} {gy-i*18} L {x1-k} {gy-i*18} L {x1-k} {gy-(i+1)*18} L {x0+k} {gy-(i+1)*18} Z", 4.5, "white"))
    base = gy - 54
    ped_h = h * 0.26
    col_h = h - 54 - ped_h - 30
    top = base - col_h
    out.append(P(f"M {x0+30} {top} L {x1-30} {top} L {x1-30} {base} L {x0+30} {base} Z", 4, "white"))
    out.append(P(f"M {cx-26} {base} L {cx-26} {base-110} L {cx+26} {base-110} L {cx+26} {base}", 3.5))
    out.append(columns(x0 + 34, x1 - 34, top, base, 8, w=(w - 68) / 8 * 0.52))
    out.append(P(f"M {x0+14} {top} L {x1-14} {top} L {x1-14} {top-30} L {x0+14} {top-30} Z", 4.5, "white"))
    out.append(P(f"M {x0+14} {top-14} L {x1-14} {top-14}", 2.8))
    out.append(P(f"M {x0+4} {top-30} L {cx} {top-30-ped_h} L {x1-4} {top-30} Z", 4.5, "white"))
    out.append(P(f"M {x0+60} {top-40} L {cx} {top-30-ped_h+26} L {x1-60} {top-40} Z", 2.8))
    return "".join(out)


def guitar(cx, cy, s=1.0, rot=0, sw=4.5):
    """Acoustic guitar standing upright (headstock up). ~300*s tall."""
    b = smooth_path([(0, 20), (34, 24), (52, 56), (40, 92), (60, 122), (56, 158), (28, 182), (0, 186),
                     (-28, 182), (-56, 158), (-60, 122), (-40, 92), (-52, 56), (-34, 24)], sw, closed=True, fill="white")
    neck = P("M -9 24 L -9 -110 L 9 -110 L 9 24", sw, "white")
    head = P("M -14 -110 L -14 -150 Q 0 -158 14 -150 L 14 -110 Z", sw, "white")
    pegs = "".join(DOT(x, y, 3.2) for x, y in ((-20, -140), (-20, -124), (20, -140), (20, -124)))
    hole = C(0, 100, 20, 3.5, "white") + C(0, 100, 9, 2.5, "white")
    bridge = P("M -20 148 L 20 148", 4.5)
    strings = P("M -3 -108 L -3 148 M 3 -108 L 3 148", 1.6)
    frets = "".join(P(f"M -9 {y} L 9 {y}", 2.2) for y in (-80, -52, -24))
    return G(cx, cy, b + neck + frets + head + pegs + hole + bridge + strings, s, rot)


def note(cx, cy, s=1.0):
    return music_note(cx, cy, s)


def pyramid(cx, gy, w=420, h=330):
    x0, x1 = cx - w / 2, cx + w / 2
    out = [P(f"M {x0} {gy} L {cx} {gy-h} L {x1} {gy} Z", 5, "white")]
    for i in range(1, 5):
        t = i / 5.0
        yy = gy - h * t
        out.append(P(f"M {x0 + (w/2)*t} {yy} L {x1 - (w/2)*t} {yy}", 2.6))
    for i in range(-3, 4):
        out.append(P(f"M {cx + i*w*0.11} {gy} L {cx + i*w*0.11*0.0 + i*4} {gy - h*0.78 if abs(i)<3 else gy - h*0.5}", 0.01) if False else "")
    for k in (-0.18, 0.0, 0.18):
        pass
    out.append(P(f"M {cx} {gy-h} L {cx} {gy}", 2.6))
    out.append(P(f"M {cx-w*0.17} {gy-h*0.66} L {cx-w*0.34} {gy}", 2.6))
    out.append(P(f"M {cx+w*0.17} {gy-h*0.66} L {cx+w*0.34} {gy}", 2.6))
    out.append(C(cx, gy - h - 12, 7, 3.5, "white"))
    return "".join(out)


def sunsphere(cx, gy, h=470):
    out = []
    ball_r = 62
    ball_cy = gy - h + ball_r
    leg_top = gy - h * 0.42
    out.append(P(f"M {cx-44} {gy} L {cx-8} {leg_top} L {cx+8} {leg_top} L {cx+44} {gy} Z", 4.5, "white"))
    out.append(P(f"M {cx-32} {gy-60} L {cx+32} {gy-60} M {cx-23} {gy-120} L {cx+23} {gy-120} M {cx-14} {gy-180} L {cx+14} {gy-180}", 2.8))
    out.append(P(f"M {cx-32} {gy-60} L {cx+23} {gy-120} L {cx-23} {gy-120} L {cx+32} {gy-60}", 2.2))
    out.append(P(f"M {cx-6} {leg_top} L {cx-6} {ball_cy+ball_r} M {cx+6} {leg_top} L {cx+6} {ball_cy+ball_r}", 4))
    out.append(P(f"M {cx-16} {leg_top} L {cx+16} {leg_top} L {cx+12} {leg_top-18} L {cx-12} {leg_top-18} Z", 3.5, "white"))
    out.append(C(cx, ball_cy, ball_r, 5, "white"))
    out.append(P(f"M {cx-ball_r} {ball_cy} Q {cx} {ball_cy+16} {cx+ball_r} {ball_cy}", 2.8))
    out.append(P(f"M {cx-ball_r+10} {ball_cy-26} Q {cx} {ball_cy-12} {cx+ball_r-10} {ball_cy-26}", 2.8))
    out.append(P(f"M {cx-ball_r+10} {ball_cy+28} Q {cx} {ball_cy+42} {cx+ball_r-10} {ball_cy+28}", 2.8))
    for dx in (-28, 0, 28):
        out.append(P(f"M {cx+dx} {ball_cy-ball_r+3} Q {cx+dx*1.25} {ball_cy} {cx+dx} {ball_cy+ball_r-3}", 2.6))
    out.append(P(f"M {cx} {ball_cy-ball_r} L {cx} {ball_cy-ball_r-34}", 3.5))
    return "".join(out)


def mountain_layer(gy, peaks=((120, 260, 400), (420, 330, 460), (720, 240, 380)), sw=4):
    out = []
    for cx, h, w in peaks:
        out.append(P(f"M {cx-w/2} {gy} L {cx-w*0.08} {gy-h} L {cx+w*0.06} {gy-h*0.94} L {cx+w/2} {gy} Z", sw, "white"))
        out.append(P(f"M {cx-w*0.08} {gy-h} L {cx-w*0.02} {gy-h*0.8} L {cx-w*0.1} {gy-h*0.74} L {cx-w*0.04} {gy-h*0.6}", 2.6))
    return "".join(out)


def river(y0, y1, x0=50, x1=800, waves=4):
    out = []
    for i in range(waves):
        yy = y0 + (y1 - y0) * (i + 0.5) / waves
        out.append(wavy_line(x0 + 20 + 25 * (i % 2), x1 - 20 - 35 * ((i + 1) % 2), yy, waves=5, amp=7, sw=3))
    return "".join(out)


def cloudy(*pts):
    return sky("".join(cloud(x, y, s) for x, y, s in pts))


def sc(fig, x, y, s, **kw):
    """Scout placed with white mat."""
    return G(x, y, matted(fig, 9, scale=s), s)


def bushes(xs, gy, s=1.0):
    out = []
    for i, x in enumerate(xs):
        r = (26 + 8 * (i % 3)) * s
        out.append(P(f"M {x-r*1.6} {gy} Q {x-r*1.7} {gy-r*1.1} {x-r*0.7} {gy-r*1.15} Q {x-r*0.3} {gy-r*1.9} {x+r*0.4} {gy-r*1.4} "
                     f"Q {x+r*1.7} {gy-r*1.6} {x+r*1.6} {gy} Z", 4, "white"))
        out.append(P(f"M {x-r*0.4} {gy-r*0.5} Q {x} {gy-r*0.9} {x+r*0.5} {gy-r*0.4}", 2.5))
    return "".join(out)


def hills_back(gy, variant=0):
    a = hill(210 + variant * 40, gy, w=520, h=150, sw=4) + hill(650 - variant * 30, gy, w=480, h=110, sw=4)
    return a


def rocks(xs, gy):
    out = []
    for i, x in enumerate(xs):
        r = 20 + 7 * (i % 3)
        out.append(P(f"M {x-r*1.5} {gy} Q {x-r*1.6} {gy-r*1.1} {x-r*0.2} {gy-r*1.2} Q {x+r*1.5} {gy-r*1.1} {x+r*1.6} {gy} Z", 4, "white"))
        out.append(P(f"M {x-r*0.5} {gy-r*0.6} L {x+r*0.3} {gy-r*0.5}", 2.5))
    return "".join(out)


# ------------------------------------------------------------ batch 2 landmarks
def courthouse(cx, gy, w=420, h=420, clock=True):
    """Classic county courthouse: wings, columned portico, pediment, clock tower with cupola."""
    x0, x1 = cx - w / 2, cx + w / 2
    out = []
    wing_top = gy - h * 0.40
    out.append(P(f"M {x0} {gy} L {x0} {wing_top} L {x1} {wing_top} L {x1} {gy} Z", 4.5, "white"))
    # windows on wings
    for wx in (x0 + 26, x0 + 74, x1 - 26 - 34, x1 - 74 - 34 + 0):
        out.append(P(f"M {wx} {wing_top+34} L {wx+34} {wing_top+34} L {wx+34} {wing_top+96} L {wx} {wing_top+96} Z", 3.5, "white"))
        out.append(P(f"M {wx+17} {wing_top+34} L {wx+17} {wing_top+96}", 2))
    # portico
    pw = w * 0.42
    px0, px1 = cx - pw / 2, cx + pw / 2
    ptop = gy - h * 0.58
    out.append(P(f"M {px0} {gy} L {px0} {ptop} L {px1} {ptop} L {px1} {gy} Z", 4.5, "white"))
    out.append(columns(px0 + 10, px1 - 32, ptop + 8, gy - 22, 4, w=22, sw=3.8))
    out.append(P(f"M {px0-10} {ptop} L {cx} {ptop-h*0.12} L {px1+10} {ptop} Z", 4.5, "white"))
    out.append(P(f"M {cx-26} {gy} L {cx-26} {gy-70} Q {cx} {gy-96} {cx+26} {gy-70} L {cx+26} {gy}", 3.5, "white"))
    # steps
    out.append(P(f"M {px0-14} {gy} L {px1+14} {gy} L {px1+14} {gy-10} L {px0-14} {gy-10} Z", 3.5, "white"))
    # tower
    tw = w * 0.16
    t_bot = ptop - h * 0.12 + 14
    t_top = t_bot - h * 0.26
    out.append(P(f"M {cx-tw/2} {t_bot} L {cx-tw/2} {t_top} L {cx+tw/2} {t_top} L {cx+tw/2} {t_bot} Z", 4.5, "white"))
    if clock:
        out.append(C(cx, t_top + h * 0.12, tw * 0.3, 3.5, "white"))
        out.append(P(f"M {cx} {t_top+h*0.12} L {cx} {t_top+h*0.12-tw*0.2} M {cx} {t_top+h*0.12} L {cx+tw*0.14} {t_top+h*0.12+tw*0.06}", 2.6))
    out.append(P(f"M {cx-tw/2-8} {t_top} L {cx+tw/2+8} {t_top} L {cx+tw/2+8} {t_top-10} L {cx-tw/2-8} {t_top-10} Z", 3.8, "white"))
    out.append(P(f"M {cx-tw/2} {t_top-10} L {cx} {t_top-h*0.2} L {cx+tw/2} {t_top-10} Z", 4.5, "white"))
    out.append(P(f"M {cx} {t_top-h*0.2} L {cx} {t_top-h*0.2-26}", 3.5))
    out.append(P(f"M {cx} {t_top-h*0.2-26} L {cx+22} {t_top-h*0.2-18} L {cx} {t_top-h*0.2-10}", 3, "white"))
    return "".join(out)


def podium(cx, gy, w=330, h=170):
    bw = w / 3
    out = []
    heights = (h * 0.62, h, h * 0.45)
    xs = (cx - bw * 1.5, cx - bw * 0.5, cx + bw * 0.5)
    labels = ("2", "1", "3")
    for x, hh, lab in zip(xs, heights, labels):
        out.append(P(f"M {x} {gy} L {x} {gy-hh} L {x+bw} {gy-hh} L {x+bw} {gy} Z", 4.5, "white"))
        out.append(P(f"M {x} {gy-hh+14} L {x+bw} {gy-hh+14}", 2.6))
        out.append(TXT(x + bw / 2, gy - hh + 14 + min(hh - 24, 58) * 0.78 + 8, lab, 48))
    return "".join(out)


def medal(cx, cy, r=18):
    return (P(f"M {cx-14} {cy-r-26} L {cx-3} {cy-r+2} L {cx+3} {cy-r+2} L {cx+14} {cy-r-26}", 4)
            + C(cx, cy, r, 4, "white") + star(cx, cy + 1, r * 0.62, 2.4, "white"))


def bleachers(x0, x1, y0, rows=5, rh=26, sw=3.5):
    out = []
    for i in range(rows):
        yy = y0 - i * rh
        xa = x0 + i * 18
        xb = x1 - i * 18
        out.append(P(f"M {xa} {yy} L {xb} {yy} L {xb} {yy-rh} L {xa} {yy-rh} Z", sw, "white"))
    return "".join(out)


def flag_pole(x, gy, h=220, w=90, fh=56):
    return (LINE(x, gy, x, gy - h, 5) + DOT(x, gy - h - 5, 5)
            + P(f"M {x} {gy-h+4} Q {x+w*0.3} {gy-h-8} {x+w*0.55} {gy-h+4} T {x+w} {gy-h+4} L {x+w} {gy-h+4+fh} Q {x+w*0.7} {gy-h+4+fh+12} {x+w*0.5} {gy-h+4+fh} T {x} {gy-h+4+fh} Z", 4, "white"))


def incline(a, b, n_ties=16):
    """Rails + ties from a to b (both (x,y))."""
    ax, ay = a; bx, by = b
    L = math.hypot(bx - ax, by - ay)
    ux, uy = (bx - ax) / L, (by - ay) / L
    nx, ny = -uy, ux
    out = []
    for off in (-9, 9):
        out.append(LINE(ax + nx * off, ay + ny * off, bx + nx * off, by + ny * off, 4))
    for i in range(n_ties + 1):
        t = i / n_ties
        px, py = ax + (bx - ax) * t, ay + (by - ay) * t
        out.append(LINE(px + nx * 15, py + ny * 15, px - nx * 15, py - ny * 15, 3.5))
    return "".join(out)


def incline_car(w=190, h=100):
    out = [P(f"M {-w/2} 0 L {-w/2} {-h} L {w/2} {-h} L {w/2} 0 Z", 5, "white")]
    out.append(P(f"M {-w/2-6} {-h} L {w/2+6} {-h} L {w/2+6} {-h-14} L {-w/2-6} {-h-14} Z", 4, "white"))
    for i in range(3):
        wx = -w/2 + 14 + i * (w - 28) / 3
        out.append(P(f"M {wx} {-h+14} L {wx+(w-28)/3-10} {-h+14} L {wx+(w-28)/3-10} {-h+56} L {wx} {-h+56} Z", 3.5, "white"))
    out.append(P(f"M {-w/2} {-14} L {w/2} {-14}", 3))
    out.append(P(f"M {-w*0.32} {-h-14} L {-w*0.32} {-h-60} M {w*0.32} {-h-14} L {w*0.32} {-h-60}", 3.5))
    return "".join(out)


def storefront(x, gy, w=130, h=230, awning=True, sign="", floors=2, door=True):
    out = [P(f"M {x} {gy} L {x} {gy-h} L {x+w} {gy-h} L {x+w} {gy} Z", 4.5, "white")]
    out.append(P(f"M {x-6} {gy-h} L {x+w+6} {gy-h} L {x+w+6} {gy-h-14} L {x-6} {gy-h-14} Z", 4, "white"))
    for f in range(floors - 1):
        yy = gy - h + 28 + f * 62
        for wx in (x + 16, x + w - 16 - 30):
            out.append(P(f"M {wx} {yy} L {wx+30} {yy} L {wx+30} {yy+44} L {wx} {yy+44} Z", 3.5, "white"))
            out.append(P(f"M {wx+15} {yy} L {wx+15} {yy+44}", 2))
    gy0 = gy - 84
    if awning:
        out.append(P(f"M {x+4} {gy0} L {x+w-4} {gy0} L {x+w+4} {gy0+22} Q {x+w*0.75} {gy0+32} {x+w*0.5} {gy0+22} Q {x+w*0.25} {gy0+32} {x-4} {gy0+22} Z", 3.8, "white"))
    out.append(P(f"M {x+14} {gy0+30} L {x+14} {gy-2} M {x+w-14} {gy0+30} L {x+w-14} {gy-2}", 2.6))
    if door:
        out.append(P(f"M {x+w/2-14} {gy} L {x+w/2-14} {gy-44} L {x+w/2+14} {gy-44} L {x+w/2+14} {gy}", 3.2))
    return "".join(out)


def marquee(cx, y, w=210, h=70, text="THEATRE"):
    out = [P(f"M {cx-w/2} {y} L {cx+w/2} {y} L {cx+w/2} {y+h} L {cx-w/2} {y+h} Z", 4.5, "white")]
    out.append(P(f"M {cx-w/2+8} {y+8} L {cx+w/2-8} {y+8} L {cx+w/2-8} {y+h-8} L {cx-w/2+8} {y+h-8} Z", 2.6))
    out.append(TXT(cx, y + h * 0.65, text, 24))
    for i in range(9):
        out.append(DOT(cx - w/2 + 14 + i * (w - 28) / 8, y - 8, 3.2))
    return "".join(out)


def bunting(x0, y0, x1, y1, n=8, sag=36):
    """Pennant string between two points."""
    out = []
    pts = []
    for i in range(n + 1):
        t = i / n
        pts.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + sag * 4 * t * (1 - t)))
    d = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in pts)
    out.append(P(d, 3.2))
    for i in range(n):
        ax, ay = pts[i]; bx, by = pts[i + 1]
        mx, my = (ax + bx) / 2, (ay + by) / 2 + 34
        out.append(P(f"M {ax+4} {ay+1} L {bx-4} {by+1} L {mx} {my} Z", 3, "white"))
    return "".join(out)


# ------------------------------------------------------------ batch 3 landmarks
def mule(cx, gy, s=1.0, sw=4.5):
    """Friendly mule facing right: round body, arched neck, long ears, tuft tail."""
    o = []
    for lx in (-44, 40):                                   # far legs
        o.append(P(f"M {lx} -62 L {lx} -8 L {lx+22} -8 L {lx+22} -62", sw, "white"))
        o.append(P(f"M {lx-2} -10 L {lx+24} -10 L {lx+24} 0 L {lx-2} 0 Z", sw, "white"))
    o.append(smooth_path([(-86, -104), (-112, -96), (-122, -58), (-108, -56), (-98, -76)], sw, closed=True, fill="white"))   # tail
    o.append(smooth_path([(-92, -98), (-72, -128), (-20, -136), (36, -132), (74, -120), (88, -92), (76, -62),
                          (30, -52), (-30, -50), (-78, -58)], sw, closed=True, fill="white"))                                # body
    for lx in (-72, 58):                                   # near legs
        o.append(P(f"M {lx} -64 L {lx} -8 L {lx+22} -8 L {lx+22} -64", sw, "white"))
        o.append(P(f"M {lx-2} -10 L {lx+24} -10 L {lx+24} 0 L {lx-2} 0 Z", sw, "white"))
    # neck rising from the shoulders
    o.append(smooth_path([(52, -126), (72, -170), (92, -196), (126, -196), (122, -160), (104, -128), (86, -112)], sw, closed=True, fill="white"))
    # head: long muzzle
    o.append(smooth_path([(96, -204), (128, -206), (166, -174), (168, -150), (150, -138), (118, -150), (98, -176)], sw, closed=True, fill="white"))
    # long ears
    o.append(smooth_path([(96, -204), (84, -258), (102, -262), (116, -210)], sw, closed=True, fill="white"))
    o.append(smooth_path([(114, -206), (120, -262), (138, -256), (132, -206)], sw, closed=True, fill="white"))
    o.append(DOT(124, -180, 4.2))
    o.append(DOT(160, -158, 3.2) + DOT(152, -154, 3.2))
    o.append(P("M 152 -142 Q 142 -140 134 -146", 3))
    o.append(P("M 70 -146 Q 82 -176 94 -196", 3))
    return G(cx, gy, "".join(o), s)


def water_tower(cx, gy, h=300):
    o = [P(f"M {cx-60} {gy-h+120} L {cx-60} {gy-h+20} Q {cx} {gy-h-14} {cx+60} {gy-h+20} L {cx+60} {gy-h+120} Z", 4.8, "white")]
    o.append(P(f"M {cx-60} {gy-h+60} L {cx+60} {gy-h+60}", 3))
    o.append(P(f"M {cx-60} {gy-h+20} L {cx} {gy-h-40} L {cx+60} {gy-h+20}", 4.5, "white"))
    for x in (-50, 50):
        o.append(P(f"M {cx+x} {gy-h+120} L {cx+x*1.15} {gy}", 4.5))
    o.append(P(f"M {cx-50} {gy-h+120} L {cx+57} {gy-80} M {cx+50} {gy-h+120} L {cx-57} {gy-80}", 2.8))
    o.append(P(f"M {cx-58} {gy-80} L {cx+58} {gy-80}", 3.5))
    return "".join(o)


def eiffel(cx, gy, h=520, w=250):
    o = []
    # legs / outline
    o.append(P(f"M {cx-w/2} {gy} L {cx-w*0.12} {gy-h*0.45} L {cx-w*0.07} {gy-h*0.78} L {cx} {gy-h} "
               f"L {cx+w*0.07} {gy-h*0.78} L {cx+w*0.12} {gy-h*0.45} L {cx+w/2} {gy} "
               f"L {cx+w*0.34} {gy} Q {cx} {gy-h*0.3} {cx-w*0.34} {gy} Z", 5, "white"))
    for yf, wf in ((0.45, 0.36), (0.78, 0.2)):
        yy = gy - h * yf
        o.append(P(f"M {cx-w*wf/2-4} {yy} L {cx+w*wf/2+4} {yy} L {cx+w*wf/2+4} {yy-14} L {cx-w*wf/2-4} {yy-14} Z", 4, "white"))
    # lattice X's
    for (y0, y1, w0, w1) in ((0.02, 0.4, 0.8, 0.42), (0.5, 0.72, 0.36, 0.24), (0.82, 0.95, 0.16, 0.08)):
        ya, yb = gy - h * y0, gy - h * y1
        xa, xb = w * w0 / 2 * 0.92, w * w1 / 2 * 0.92
        o.append(P(f"M {cx-xa} {ya} L {cx+xb} {yb} M {cx+xa} {ya} L {cx-xb} {yb}", 2.4))
    o.append(P(f"M {cx} {gy-h} L {cx} {gy-h-34}", 4))
    return "".join(o)


def atom(cx, cy, r=110):
    o = [C(cx, cy, 16, 4.5, "white")]
    for ang in (0, 60, 120):
        o.append(f'<g transform="rotate({ang} {cx} {cy})">' + E(cx, cy, r, r * 0.36, 4, "none") + "</g>")
    for ang, t in ((0, 0.0), (60, 2.2), (120, 4.1)):
        a = math.radians(ang)
        x = r * math.cos(t); y = r * 0.36 * math.sin(t)
        xx = cx + x * math.cos(a) - y * math.sin(a); yy = cy + x * math.sin(a) + y * math.cos(a)
        o.append(C(xx, yy, 13, 4, "white"))
    return "".join(o)


def lab_building(cx, gy, w=330, h=250):
    x0 = cx - w / 2
    o = [P(f"M {x0} {gy} L {x0} {gy-h} L {x0+w} {gy-h} L {x0+w} {gy} Z", 4.8, "white")]
    for i in range(4):
        for j in range(3):
            wx = x0 + 28 + i * (w - 56) / 4
            wy = gy - h + 28 + j * 62
            o.append(P(f"M {wx} {wy} L {wx+44} {wy} L {wx+44} {wy+40} L {wx} {wy+40} Z", 3.2, "white"))
    o.append(P(f"M {cx-26} {gy} L {cx-26} {gy-52} L {cx+26} {gy-52} L {cx+26} {gy}", 3.5, "white"))
    # smokestack/tower
    o.append(P(f"M {x0+w-60} {gy-h} L {x0+w-52} {gy-h-110} L {x0+w-28} {gy-h-110} L {x0+w-20} {gy-h} Z", 4.5, "white"))
    o.append(P(f"M {x0+w-54} {gy-h-84} L {x0+w-26} {gy-h-84}", 3))
    return "".join(o)


def waterfall(cx, top, gy, w=150, cliff_w=520):
    o = []
    x0, x1 = cx - cliff_w / 2, cx + cliff_w / 2
    # cliff mass with a gap where water falls
    o.append(P(f"M {x0} {gy} L {x0} {top+30} Q {x0+60} {top-10} {cx-w/2-30} {top} L {cx-w/2} {top+12} L {cx-w/2+4} {gy-40} L {x0+40} {gy} Z", 5, "white"))
    o.append(P(f"M {x1} {gy} L {x1} {top+50} Q {x1-70} {top-4} {cx+w/2+30} {top+4} L {cx+w/2} {top+12} L {cx+w/2-4} {gy-40} L {x1-40} {gy} Z", 5, "white"))
    for (rx, ry) in ((x0 + 60, top + 120), (x0 + 150, top + 230), (x0 + 90, top + 330), (x1 - 70, top + 140), (x1 - 160, top + 250), (x1 - 90, top + 340)):
        o.append(P(f"M {rx} {ry} Q {rx+22} {ry-14} {rx+44} {ry} M {rx+10} {ry+26} L {rx+34} {ry+30}", 3))
    # water streaks
    for i in range(5):
        xx = cx - w / 2 + 14 + i * (w - 28) / 4
        o.append(P(f"M {xx} {top+18} Q {xx+6} {(top+gy)/2} {xx-2} {gy-48}", 3.2))
    o.append(P(f"M {cx-w/2-6} {top+12} Q {cx} {top+30} {cx+w/2+6} {top+12}", 3))
    # splash pool
    o.append(wavy_line(cx - w * 0.9, cx + w * 0.9, gy - 22, waves=6, amp=7, sw=3.2))
    o.append(C(cx - 36, gy - 40, 10, 3, "white") + C(cx + 40, gy - 36, 8, 3, "white") + C(cx + 6, gy - 62, 7, 2.6, "white"))
    return "".join(o)


def cave_arch(gy, y_top=170, x0=45, x1=805):
    """Cave mouth frame: jagged ceiling with stalactites, sides."""
    o = []
    pts = [(x0, gy), (x0, y_top + 60), (x0 + 60, y_top + 20), (150, y_top + 40), (210, y_top), (290, y_top + 36),
           (350, y_top + 8), (430, y_top + 42), (500, y_top + 6), (580, y_top + 38), (650, y_top + 4), (720, y_top + 36),
           (x1 - 30, y_top + 14), (x1, y_top + 60), (x1, gy)]
    d = "M " + " L ".join(f"{x} {y}" for x, y in pts)
    o.append(P(d, 5))
    for sx, ln in ((210, 90), (350, 120), (500, 100), (650, 130), (290, 60), (580, 70)):
        yb = y_top + 36
        o.append(P(f"M {sx-16} {yb-4} L {sx} {yb+ln} L {sx+16} {yb-4}", 4.2, "white"))
    return "".join(o)


def stalagmites(xs, gy, hs=None):
    o = []
    for i, x in enumerate(xs):
        h = (hs[i] if hs else 70 + 30 * (i % 3))
        o.append(P(f"M {x-24} {gy} L {x-5} {gy-h} L {x+5} {gy-h} L {x+24} {gy} Z", 4.2, "white"))
    return "".join(o)


def cypress(cx, gy, h=360, w=150):
    """Bald cypress: flared base with knees, tall trunk, feathery crown."""
    o = []
    o.append(P(f"M {cx-w*0.38} {gy} Q {cx-w*0.1} {gy-40} {cx-18} {gy-h*0.55} L {cx-14} {gy-h*0.72} L {cx+14} {gy-h*0.72} "
               f"L {cx+18} {gy-h*0.55} Q {cx+w*0.1} {gy-40} {cx+w*0.38} {gy} Z", 4.8, "white"))
    o.append(P(f"M {cx-6} {gy-30} L {cx-4} {gy-h*0.6} M {cx+7} {gy-24} L {cx+5} {gy-h*0.55}", 2.4))
    top = gy - h * 0.72
    f = lambda a, b: (cx + w * a, top + b)
    pts = [f(0, -104), f(0.15, -66), f(0.09, -62), f(0.3, -20), f(0.2, -18), f(0.5, 16), f(0.3, 22), f(0.2, 10), f(0.08, 24), f(0, 12)]
    right = pts
    left = [(2 * cx - x, y) for x, y in reversed(pts[1:-1])]
    allp = right + left
    d = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in allp) + " Z"
    o.append(P(d, 4.8, "white"))
    for dx, dy in ((-0.14, -30), (0.12, -48), (-0.06, -70), (0.2, -2), (-0.26, 0)):
        o.append(P(f"M {cx+w*dx-9} {top+dy} L {cx+w*dx} {top+dy+9} L {cx+w*dx+9} {top+dy}", 2.4))
    return "".join(o)


def cypress_knee(cx, gy, h=36):
    return P(f"M {cx-14} {gy} Q {cx-6} {gy-h} {cx} {gy-h} Q {cx+6} {gy-h} {cx+14} {gy} Z", 3.8, "white")


def eagle(cx, cy, s=1.0, sw=4.5):
    """Bald eagle soaring, wings spread. ~300*s wide."""
    o = []
    wing = [(-16, -6), (-60, -52), (-120, -62), (-158, -30), (-146, -12), (-136, -2), (-124, 6), (-112, 0), (-98, 14), (-84, 8), (-66, 22), (-44, 14), (-22, 24)]
    o.append(P("M " + " L ".join(f"{x} {y}" for x, y in wing) + " Z", sw, "white"))
    wr = [(-x, y) for x, y in wing]
    o.append(P("M " + " L ".join(f"{x} {y}" for x, y in wr) + " Z", sw, "white"))
    for x, y in ((-100, -20), (-72, -22), (-46, -14)):
        o.append(P(f"M {x} {y} L {x+16} {y+34}", 2.4))
        o.append(P(f"M {-x} {y} L {-x-16} {y+34}", 2.4))
    o.append(smooth_path([(-20, -6), (-22, 30), (-12, 60), (0, 66), (12, 60), (22, 30), (20, -6)], sw, closed=True, fill="white"))
    o.append(P("M -14 60 L -22 84 L -6 76 L 0 90 L 6 76 L 22 84 L 14 60", 3.6, "white"))
    o.append(C(0, -22, 20, sw, "white"))
    o.append(P("M -4 -20 L 18 -14 L 4 -4 Z", 3.2, "white"))
    o.append(DOT(-8, -28, 3.4) + DOT(8, -28, 3.4))
    return G(cx, cy, "".join(o), s)


def bear_cub(cx, gy, s=1.0, sw=4.8):
    """Black-bear cub sitting, front view, ~170*s tall."""
    o = []
    o.append(smooth_path([(-52, -10), (-62, -60), (-44, -108), (0, -118), (44, -108), (62, -60), (52, -10)], sw, closed=True, fill="white"))
    o.append(E(-34, -4, 24, 12, sw, "white") + E(34, -4, 24, 12, sw, "white"))
    o.append(E(0, -52, 28, 38, 3, "white"))
    for sx in (-1, 1):
        o.append(C(sx * 36, -150, 17, sw, "white") + C(sx * 36, -150, 7, 3, "white"))
    o.append(C(0, -138, 42, sw, "white", face="0,-138,42"))
    o.append(E(0, -122, 22, 17, 3.4, "white"))
    o.append(P("M -9 -131 Q 0 -138 9 -131 Q 6 -124 0 -123 Q -6 -124 -9 -131 Z", 2.5, "black"))
    o.append(P("M 0 -123 L 0 -117 M -9 -113 Q 0 -105 9 -113", 3))
    o.append(DOT(-16, -146, 4.6) + DOT(16, -146, 4.6))
    return G(cx, gy, "".join(o), s)


def space_needle(cx, gy, h=560):
    o = []
    deck_y = gy - h * 0.72
    o.append(P(f"M {cx-34} {gy} L {cx-9} {deck_y+14} L {cx+9} {deck_y+14} L {cx+34} {gy} Z", 4.8, "white"))
    o.append(P(f"M {cx-26} {gy-70} L {cx+26} {gy-70} M {cx-20} {gy-140} L {cx+20} {gy-140}", 2.6))
    o.append(P(f"M {cx-26} {gy-70} L {cx+20} {gy-140} M {cx+26} {gy-70} L {cx-20} {gy-140}", 2.2))
    o.append(E(cx, deck_y, 70, 18, 4.8, "white"))
    o.append(P(f"M {cx-70} {deck_y} L {cx-60} {deck_y-26} L {cx+60} {deck_y-26} L {cx+70} {deck_y}", 4.5, "white"))
    for i in range(1, 6):
        xx = cx - 60 + i * 20
        o.append(P(f"M {xx} {deck_y-24} L {xx} {deck_y-2}", 2.2))
    o.append(P(f"M {cx-28} {deck_y-26} Q {cx} {deck_y-70} {cx+28} {deck_y-26}", 4, "white"))
    o.append(P(f"M {cx} {deck_y-52} L {cx} {deck_y-92}", 3.8))
    return "".join(o)


def coaster(x0, x1, y_base, h=300):
    """Roller-coaster hill track on supports."""
    o = []
    pts = [(x0, y_base - 40), (x0 + 120, y_base - h), (x0 + 220, y_base - 60), (x0 + 320, y_base - h * 0.6),
           (x0 + 420, y_base - 40), (x1, y_base - h * 0.85)]
    o.append(smooth_path(pts, 5))
    o.append(smooth_path([(x, y + 16) for x, y in pts], 3.5))
    for (x, y) in pts[1:-1]:
        o.append(P(f"M {x} {y+16} L {x} {y_base}", 3.8))
    for (x, y) in pts[1:-1]:
        o.append(P(f"M {x-30} {y_base} L {x+30} {y_base}", 3.8))
    return "".join(o)


def coaster_car(cx, cy, rot=0, n=2):
    o = []
    for i in range(n):
        x = -i * 66
        o.append(P(f"M {x-30} -4 L {x-30} -34 Q {x-30} -42 {x-22} -42 L {x+22} -42 Q {x+30} -42 {x+30} -34 L {x+30} -4 Z", 4.2, "white"))
        o.append(C(x - 16, 2, 8, 3.8, "white") + C(x + 16, 2, 8, 3.8, "white"))
    return G(cx, cy, "".join(o), 1.0, rot)


def dome(cx, gy, w=360):
    r = w / 2
    o = [P(f"M {cx-r} {gy} L {cx-r} {gy-60} L {cx+r} {gy-60} L {cx+r} {gy} Z", 4.8, "white")]
    o.append(P(f"M {cx-r+10} {gy-60} A {r-10} {r-10} 0 0 1 {cx+r-10} {gy-60} Z", 4.8, "white"))
    o.append(P(f"M {cx-r*0.55} {gy-60} Q {cx-r*0.4} {gy-60-r*0.82} {cx} {gy-60-r*0.86}", 2.6))
    o.append(P(f"M {cx+r*0.55} {gy-60} Q {cx+r*0.4} {gy-60-r*0.82} {cx} {gy-60-r*0.86}", 2.6))
    o.append(P(f"M {cx-r*0.2} {gy-60-r*0.85} L {cx+r*0.2} {gy-60-r*0.85} M {cx-r*0.75} {gy-60-r*0.5} L {cx+r*0.75} {gy-60-r*0.5}", 2.4))
    o.append(P(f"M {cx-28} {gy} L {cx-28} {gy-44} L {cx+28} {gy-44} L {cx+28} {gy}", 3.5, "white"))
    return "".join(o)


def checker_flag(x, gy, h=200, w=100, sq=20):
    o = [LINE(x, gy, x, gy - h, 5)]
    cols, rows = int(w / sq), int(w * 0.7 / sq)
    for r in range(rows):
        for c in range(cols):
            fill = "black" if (r + c) % 2 == 0 else "white"
            o.append(f'<rect x="{x+4+c*sq}" y="{gy-h+4+r*sq}" width="{sq}" height="{sq}" fill="{fill}" stroke="black" stroke-width="2.6"/>')
    return "".join(o)


def crossbuck(x, gy, h=230):
    return (LINE(x, gy, x, gy - h, 6)
            + P(f"M {x-68} {gy-h-8} L {x+68} {gy-h+44} L {x+60} {gy-h+66} L {x-76} {gy-h+14} Z", 4, "white")
            + P(f"M {x+68} {gy-h-8} L {x-68} {gy-h+44} L {x-60} {gy-h+66} L {x+76} {gy-h+14} Z", 4, "white"))


def fossil_dig(cx, gy, w=480):
    """Dirt cutaway with a fossil tusk, ribs and a skull peeking out."""
    o = []
    x0, x1 = cx - w / 2, cx + w / 2
    o.append(P(f"M {x0} {gy} Q {x0+20} {gy-70} {x0+110} {gy-84} Q {cx} {gy-110} {x1-110} {gy-84} Q {x1-20} {gy-70} {x1} {gy} Z", 5, "white"))
    for (xx, yy) in ((x0 + 70, gy - 24), (x0 + 150, gy - 34), (x1 - 60, gy - 20), (x1 - 150, gy - 30), (cx, gy - 14)):
        o.append(C(xx, yy, 6, 3, "white"))
    # tusk
    o.append(P(f"M {cx-150} {gy-70} Q {cx-120} {gy-190} {cx-30} {gy-170} Q {cx-90} {gy-150} {cx-96} {gy-60} Z", 4.5, "white"))
    # ribs
    for i in range(4):
        xx = cx + 20 + i * 34
        o.append(P(f"M {xx} {gy-86} Q {xx+16} {gy-150} {xx+54} {gy-136}", 4.2))
    o.append(P(f"M {cx+10} {gy-98} L {cx+170} {gy-98}", 4))
    # skull
    o.append(smooth_path([(cx-70, gy-40), (cx-80, gy-70), (cx-48, gy-96), (cx, gy-92), (cx+26, gy-64), (cx+20, gy-40), (cx-20, gy-34)], 4.5, closed=True, fill="white"))
    o.append(C(cx - 40, gy - 66, 8, 3.2, "white") + P(f"M {cx-10} {gy-44} L {cx+14} {gy-48}", 3))
    return "".join(o)


def shovel(x, gy, h=170):
    return (LINE(x, gy, x - 20, gy - h, 5) + P(f"M {x-34} {gy-h-8} L {x-6} {gy-h-8} L {x-8} {gy-h-44} L {x-32} {gy-h-44} Z", 4.2, "white"))


def locomotive(cx, gy, w=520, sw=5):
    """Steam locomotive facing right, wheels tangent to gy."""
    s = w / 520.0
    o = []
    R = 44
    # frame
    o.append(P("M -250 -70 L 250 -70 L 250 -44 L -250 -44 Z", sw, "white"))
    # cab
    o.append(P("M -250 -70 L -250 -240 L -130 -240 L -130 -70 Z", sw, "white"))
    o.append(P("M -262 -240 L -118 -240 L -118 -262 L -262 -262 Z", sw, "white"))
    o.append(P("M -234 -218 L -146 -218 L -146 -140 L -234 -140 Z", 3.6, "white"))
    # boiler
    o.append(P("M -130 -80 L -130 -200 Q -130 -216 -114 -216 L 150 -216 Q 200 -216 210 -150 L 210 -80 Z", sw, "white"))
    o.append(P("M -40 -216 L -40 -80 M 60 -216 L 60 -80", 3))
    o.append(E(214, -148, 10, 62, 4, "white"))
    o.append(DOT(214, -148, 4))
    # smokestack + dome
    o.append(P("M 150 -216 L 138 -290 L 196 -290 L 184 -216 Z", sw, "white"))
    o.append(P("M 126 -290 L 208 -290 L 200 -306 L 134 -306 Z", 4, "white"))
    o.append(P("M -30 -216 Q -30 -256 14 -256 Q 58 -256 58 -216", 4, "white"))
    # cowcatcher
    o.append(P("M 250 -44 L 300 -2 L 250 -2 L 218 -44 Z", 4.5, "white"))
    for i in range(3):
        o.append(P(f"M {232+i*14} -44 L {260+i*14} -2", 2.2))
    # wheels
    for wx, r in ((-180, 54), (-84, 54), (150, 36), (216, 36)):
        o.append(C(wx, -r, r, sw, "white") + C(wx, -r, r * 0.34, 3.4, "white"))
        for a in range(0, 180, 60):
            ar = math.radians(a)
            o.append(LINE(wx - r * 0.34 * math.cos(ar), -r - r * 0.34 * math.sin(ar), wx + r * 0.34 * math.cos(ar), -r + r * 0.34 * math.sin(ar), 2.4) if False else "")
    o.append(P("M -180 -54 L -84 -54", 7))
    o.append(P("M -180 -54 L 150 -36", 3.8) if False else "")
    o.append(C(-84, -54, 8, 3.2, "white") + C(-180, -54, 8, 3.2, "white"))
    return G(cx, gy, "".join(o), s)


def steam_puffs(x, y, n=3):
    o = []
    for i in range(n):
        o.append(cloud(x + i * 36, y - i * 46, 17 + i * 5, 4))
    return sky("".join(o))


def birds(x, y, n=3, s=1.0):
    o = []
    for i in range(n):
        bx, by = x + i * 46 * s, y + (i % 2) * 26 * s
        o.append(P(f"M {bx-16*s} {by} Q {bx-8*s} {by-12*s} {bx} {by} Q {bx+8*s} {by-12*s} {bx+16*s} {by}", 3.2))
    return sky("".join(o))


def sky_deco(v=0, birds_at=None):
    o = []
    if v == 0:
        o.append(sky(sun(130, 250, 40)))
        o.append(cloudy((470, 215, 20), (700, 300, 24))); o.append(birds(520, 330) if birds_at is None else birds(*birds_at))
    elif v == 1:
        o.append(sky(sun(715, 250, 40)))
        o.append(cloudy((200, 230, 24), (480, 300, 20))); o.append(birds(300, 330) if birds_at is None else birds(*birds_at))
    else:
        o.append(cloudy((190, 240, 26), (660, 230, 24), (430, 300, 18))); o.append(birds(300, 380) if birds_at is None else birds(*birds_at))
    return "".join(o)


def treeline(gy, x0=40, x1=810, h=120, seed=0):
    o = []
    n = int((x1 - x0) / 62) + 1
    for i in range(n):
        x = x0 + i * 62 + ((i * 37 + seed * 13) % 26)
        hh = h + ((i * 23 + seed * 17) % 46)
        o.append(tree_round(x, gy, h=hh, sw=4))
    return "".join(o)


def fg_details(gy, seed=0, xs=None):
    """Foreground flowers/pebbles in the band below the ground line."""
    o = []
    xs = xs or [90, 210, 330, 470, 600, 730]
    for i, x in enumerate(xs):
        y = gy + 22 + ((i * 17 + seed * 7) % 28)
        kind = (i + seed) % 3
        if kind == 0:
            o.append(grass_tuft(x, y))
        elif kind == 1:
            o.append(G(x, y - 12, flower(0, 0, s=0.85), 1.0) + LINE(x, y - 12, x, y + 4, 3))
        else:
            o.append(stones([(x, y), (x + 18, y + 3)], 3))
    return "".join(o)


def boat(cx, wy, w=330, canopy=True):
    o = []
    o.append(P(f"M {cx-w/2} {wy-46} L {cx+w/2} {wy-46} L {cx+w/2-36} {wy+6} L {cx-w/2+36} {wy+6} Z", 5, "white"))
    o.append(P(f"M {cx-w/2+22} {wy-26} L {cx+w/2-22} {wy-26}", 3))
    if canopy:
        o.append(P(f"M {cx-w/2+30} {wy-46} L {cx-w/2+30} {wy-190} M {cx+w/2-30} {wy-46} L {cx+w/2-30} {wy-190}", 5))
        o.append(P(f"M {cx-w/2+6} {wy-190} L {cx+w/2-6} {wy-190} L {cx+w/2-26} {wy-224} L {cx-w/2+26} {wy-224} Z", 4.5, "white"))
    return "".join(o)


def dock(x0, x1, y, h=70):
    o = [P(f"M {x0} {y} L {x1} {y} L {x1} {y+16} L {x0} {y+16} Z", 4.5, "white")]
    for x in (x0 + 30, (x0 + x1) / 2, x1 - 30):
        o.append(P(f"M {x-8} {y+16} L {x-8} {y+h} L {x+8} {y+h} L {x+8} {y+16}", 4, "white"))
    for x in range(int(x0 + 60), int(x1), 60):
        o.append(LINE(x, y + 2, x, y + 14, 2.4))
    return "".join(o)
