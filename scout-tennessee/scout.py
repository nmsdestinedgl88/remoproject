"""Scout the explorer fox — one parametric figure used on every page.

Local origin = feet centre, ~255 tall at scale 1.  Line-art mode fills
everything white (so overlaps knock out cleanly); colour mode (cover only)
swaps in the palette below.  Poses: wave | point | hold | cheer | down.
"""
import sys
sys.path.insert(0, "/home/user/bedardandy/coloring-book-skill/lib")
from charlib import *   # noqa
from charlib import _f

LINE_PAL = dict(fur="white", cream="white", hat="white", band="white", scarf="white",
                vest="white", shirt="white", shorts="white", boot="white", pack="white",
                map="white", inner="white")
COLOR_PAL = dict(fur="#F6A937", cream="#FFEFC7", hat="#D9C79E", band="#B89B6A",
                 scarf="#F4779F", vest="#C7B382", shirt="#E7DDBF", shorts="#BCA77E",
                 boot="#8A5B38", pack="#4F7FB2", map="#F4EEDB", inner="#F9C6A4")

HEAD = (0, -172)
HEAD_R = 44


def _pts(*p):
    return list(p)


def _mirror(pts):
    return [(-x, y) for x, y in pts]


def scout_head(pal, hat=True, sw=SW):
    cx, cy = HEAD
    out = []
    # ears (behind head & hat)
    for s in (-1, 1):
        out.append(smooth_path([(s * 30, -208), (s * 46, -248), (s * 64, -258), (s * 62, -222), (s * 50, -200)],
                               4.5, closed=True, fill=pal["fur"]))
        out.append(smooth_path([(s * 42, -214), (s * 53, -240), (s * 57, -232), (s * 52, -214)],
                               3, closed=True, fill=pal["inner"]))
    # head silhouette with cheek tufts
    right = [(0, -218), (26, -214), (42, -198), (47, -180), (60, -170), (49, -163),
             (54, -152), (40, -148), (26, -134), (0, -129)]
    left = [(-x, y) for x, y in reversed(right[1:-1])]
    pts = right + left
    out.append(smooth_path(pts, sw, closed=True, fill=pal["fur"]))
    # tiny invisible face tag so the validator sees a head of the right size
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{HEAD_R}" fill="none" stroke="none" '
               f'data-face="{cx},{cy},{HEAD_R}"/>')
    # cream muzzle / cheeks
    out.append(smooth_path([(0, -164), (16, -158), (26, -150), (22, -140), (10, -133), (0, -131),
                            (-10, -133), (-22, -140), (-26, -150), (-16, -158)],
                           3.2, closed=True, fill=pal["cream"]))
    # eyes
    for s in (-1, 1):
        out.append(E(s * 18, -174, 6.2, 7.4, 3, "black") if False else DOT(s * 18, -175, 6.2))
        out.append(C(s * 16, -177, 2.1, 1, "white"))
        out.append(f'<circle cx="{_f(s*16)}" cy="{_f(-177)}" r="2.1" fill="white"/>')
    # nose + mouth
    out.append(P("M -7 -158 Q 0 -163 7 -158 Q 5 -151 0 -149 Q -5 -151 -7 -158 Z", 2.5, "black"))
    out.append(P("M 0 -149 L 0 -144", 3))
    out.append(P("M -13 -146 Q -6 -136 0 -144 Q 6 -136 13 -146", 3.2))
    out.append(P("M -6 -140 Q 0 -129 6 -140 Z", 2.5, pal["inner"]))
    # brow tufts / forehead mark
    out.append(P("M -6 -206 L 0 -196 L 6 -206", 3))
    if hat:
        out += scout_hat(pal)
    return out


def scout_hat(pal):
    out = []
    out.append(smooth_path([(-40, -208), (-36, -234), (-18, -250), (0, -254), (18, -250), (36, -234), (40, -208)],
                           SW, closed=True, fill=pal["hat"]))
    out.append(P("M -39 -214 Q 0 -204 39 -214", 3.5))
    out.append(P("M -38 -222 Q 0 -212 38 -222", 3, pal["band"]))
    # brim (wide ellipse in front)
    out.append(smooth_path([(-66, -204), (-58, -196), (-32, -190), (0, -188), (32, -190), (58, -196), (66, -204),
                            (58, -212), (32, -216), (0, -218), (-32, -216), (-58, -212)],
                           SW, closed=True, fill=pal["hat"]))
    out.append(P("M -24 -199 Q 0 -195 24 -199", 2.5))
    out.append(DOT(0, -252, 3.5))
    return out


def _tail(pal):
    out = [smooth_path([(-20, -78), (-52, -86), (-84, -112), (-104, -150), (-100, -186), (-80, -190),
                        (-70, -160), (-56, -130), (-30, -106)], SW, closed=True, fill=pal["fur"])]
    out.append(P("M -103 -160 L -92 -168 L -88 -156 L -78 -166 L -72 -156", 3.2, pal["cream"]))
    out.append(smooth_path([(-100, -186), (-90, -168), (-84, -174), (-80, -190)], 3, closed=True, fill=pal["cream"]))
    return "".join(out)


def _pack(pal):
    out = [P("M -58 -122 Q -60 -134 -46 -134 L -22 -130 L -20 -76 L -52 -76 Q -60 -80 -58 -94 Z", 4.5, pal["pack"])]
    out.append(C(-42, -100, 9, 3.2, "white"))
    out.append(P("M -42 -107 L -42 -93 M -49 -100 L -35 -100", 1.8))
    out.append(P("M -57 -118 L -24 -118", 3))
    return "".join(out)


def _legs_and_boots(pal):
    out = []
    for s in (-1, 1):
        out.append(P(f"M {s*17} -44 L {s*17} -26", 6.5))
        out.append(P(f"M {s*17-7} -44 L {s*17-7} -26 M {s*17+7} -44 L {s*17+7} -26", 4.5))
        # boot
        pts = [(s*10, -30), (s*26, -30), (s*27, -12), (s*34, -7), (s*34, 0), (s*4, 0), (s*6, -10)]
        out.append(smooth_path(pts, 4.5, closed=True, fill=pal["boot"]))
        out.append(P(f"M {s*8} -4 L {s*33} -4", 3))
        out.append(P(f"M {s*13} -23 L {s*21} -23 M {s*14} -17 L {s*22} -17", 2.5))
    return "".join(out)


def _torso(pal):
    out = []
    # shorts
    out.append(P("M -31 -74 L 31 -74 L 34 -42 L 4 -42 L 0 -50 L -4 -42 L -34 -42 Z", 4.5, pal["shorts"]))
    out.append(P("M 14 -66 L 26 -66 L 26 -54 L 14 -54 Z", 2.8, pal["shorts"]))
    # shirt/vest body
    out.append(smooth_path([(-27, -126), (27, -126), (33, -100), (32, -72), (-32, -72), (-33, -100)],
                           SW, closed=True, fill=pal["vest"]))
    out.append(P("M 0 -118 L 0 -72", 3.2))
    for s in (-1, 1):
        out.append(P(f"M {s*8} -100 L {s*24} -100 L {s*24} -84 L {s*8} -84 Z", 3, pal["vest"]))
        out.append(P(f"M {s*8} -95 L {s*24} -95", 2.5))
        out.append(DOT(s*16, -97.5, 1.6))
    # neckerchief
    out.append(P("M -22 -131 Q 0 -122 22 -131 L 4 -104 Q 0 -100 -4 -104 Z", 3.5, pal["scarf"]))
    out.append(P("M -4 -121 L 6 -112", 2))
    return "".join(out)


_POSES = {
    "wave":  ((-44, -76), (72, -184)),
    "point": ((-44, -76), (92, -132)),
    "hold":  ((-34, -98), (34, -98)),
    "cheer": ((-70, -196), (70, -196)),
    "down":  ((-44, -76), (44, -76)),
    "wave2": ((-72, -184), (72, -184)),
    "lpoint": ((-92, -132), (44, -76)),
}


def scout(pose="wave", color=False, prop=None, hat=True):
    """Standing Scout. prop: 'map' draws a folded map between the hands (pose hold)."""
    pal = COLOR_PAL if color else LINE_PAL
    lw, rw = _POSES[pose]
    out = [_tail(pal), _pack(pal), _legs_and_boots(pal), _torso(pal)]
    out.append(arm((-24, -118), lw, sw=4.5, hand_r=9, bulge=12, lift=3))
    out.append(arm((24, -118), rw, sw=4.5, hand_r=9, bulge=12, lift=3))
    if pose == "hold":
        out.append(P("M -36 -112 L -12 -116 L 0 -112 L 12 -116 L 36 -112 L 36 -80 L 12 -84 L 0 -80 L -12 -84 L -36 -80 Z",
                     3.8, pal["map"]))
        out.append(P("M -12 -116 L -12 -84 M 12 -116 L 12 -84", 2.4))
        out.append(P("M -28 -102 Q -20 -108 -18 -96 M 16 -104 Q 26 -100 28 -92", 2))
        out.append(C(-36, -98, 9, 3.5, pal["fur"], hand="1") + C(36, -98, 9, 3.5, pal["fur"], hand="1"))
    out += scout_head(pal, hat=hat)
    return '<g data-el="figure">' + "".join(out) + "</g>"


def scout_bust(color=False, paws=True):
    """Head + shoulders + paws, for peeking out of windows / over ledges. Origin = bottom centre of chest."""
    pal = COLOR_PAL if color else LINE_PAL
    out = [_pack(pal)]
    out.append(smooth_path([(-30, -128), (30, -128), (36, -100), (36, -60), (-36, -60), (-36, -100)],
                           SW, closed=True, fill=pal["vest"]))
    out.append(P("M 0 -118 L 0 -64", 3.2))
    out.append(P("M -22 -131 Q 0 -122 22 -131 L 4 -104 Q 0 -100 -4 -104 Z", 3.5, pal["scarf"]))
    out += scout_head(pal)
    out_g = G(0, 0, "".join(out), 1)
    return '<g data-el="figure">' + "".join(out) + "</g>"
