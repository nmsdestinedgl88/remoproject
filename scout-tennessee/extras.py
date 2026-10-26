"""Front matter, special coloring pages and back matter for Scout Explores Tennessee."""
import re
from kit import *
from pages import S, stars3, GY
from charlib import _serialize

BLUE, YEL, PINK, NAVY, GOLD, GREEN, RED = "#4FB0E5", "#FBBF2B", "#F4779F", "#1C2430", "#D9A210", "#7CC576", "#D6283A"
PUB = "JCF Publishing"


def svgwrap(body, bg="white"):
    return _serialize(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
                      f'<rect data-chrome="1" width="{W}" height="{H}" fill="{bg}"/>' + body + "</svg>")


def T(x, y, s, size, fill=NAVY, anchor="middle", weight="bold"):
    return text_path(x, y, s, size=size, anchor=anchor, weight=weight, fill=fill)


def outlined(x, y, s, size, fill="white", ow=9, anchor="middle"):
    k = size / 2048.0
    back = text_path(x, y, s, size=size, anchor=anchor, weight="bold", fill="black")
    back = re.sub(r'stroke="[^"]*" stroke-width="[0-9.]+"', f'stroke="black" stroke-width="{ow/k:.0f}"', back, count=1)
    return back + text_path(x, y, s, size=size, anchor=anchor, weight="bold", fill=fill)


def centered_wrap(text, x, y, size, max_w, fill=NAVY, lh=None, weight="normal"):
    lh = lh or size * 1.35
    lines = wrap_width(text, max_w, size)
    return "".join(T(x, y + i * lh, ln, size, fill, weight=weight) for i, ln in enumerate(lines)), len(lines)


def dots():
    d = ""
    for x, y, c in ((758, 60, PINK), (86, 106, YEL), (55, 540, BLUE), (770, 618, YEL), (110, 1051, PINK), (708, 1098 - 12, BLUE)):
        d += f'<circle cx="{x}" cy="{y}" r="15" fill="{c}"/>'
    return d


def flag_emblem(cx, cy, r, bg=RED):
    o = C(cx, cy, r * 1.22, 3.5, bg) + C(cx, cy, r, 3.5, "#2E5FA8")
    o += C(cx, cy, r * 0.92, 2, "none").replace('stroke="black"', 'stroke="white"')
    for dx, dy in ((0, -0.38), (-0.38, 0.3), (0.38, 0.3)):
        o += star(cx + dx * r, cy + dy * r, r * 0.3, 2.4, "white")
    return o


# ------------------------------------------------------------------ cover
def cover():
    b = []
    b.append(f'<rect width="{W}" height="{H}" fill="#6EC1EE"/>')
    def cl(x, y, s):
        return cloud(x, y, s).replace('fill="white"', 'fill="white"').replace('data-sky="1" ', '')
    b.append(cl(120, 520, 38) + cl(730, 600, 40) + cl(640, 330, 22) + cl(160, 330, 24))
    # mountains + hills
    b.append(P("M 0 760 L 150 560 L 240 640 L 380 470 L 520 650 L 640 540 L 850 760 Z", 5, "#8FB4D6"))
    b.append(P("M 0 860 Q 200 700 420 800 Q 640 700 850 840 L 850 1100 L 0 1100 Z", 5, GREEN))
    b.append(P("M 0 960 Q 260 880 500 950 Q 700 900 850 960 L 850 1100 L 0 1100 Z", 5, "#68B35F"))
    # title
    b.append(outlined(425, 118, "Scout Explores", 92))
    b.append(outlined(425, 258, "Tennessee", 150, fill="white", ow=11))
    # ribbon
    b.append(P("M 130 318 L 720 318 L 720 428 L 130 428 Z", 4, "white"))
    b.append(P("M 130 338 L 70 372 L 130 408 Z", 4, "white") + P("M 720 338 L 780 372 L 720 408 Z", 4, "white"))
    b.append(T(425, 358, "A Tennessee Coloring Book for Kids —", 25))
    b.append(T(425, 388, "Cities, Towns & Fun Facts from Across", 25))
    b.append(T(425, 418, "the Volunteer State (Ages 6–9)", 25))
    # scout
    b.append(G(425, 1040, scout("hold", color=True), 1.95))
    # decorations
    for x, y, r, c in ((70, 480, 20, PINK), (790, 470, 22, YEL), (70, 760, 18, YEL), (790, 800, 18, PINK), (150, 250, 0, PINK)):
        if r:
            b.append(star(x, y, r, 3, c))
    b.append(flag_emblem(105, 960, 52))
    b.append(T(700, 1050, PUB, 30, NAVY))
    return svgwrap("".join(b))


def title_page(inset=False):
    if inset:      # print interior: no full-bleed colour (KDP black-ink interior, no bleed)
        b = [f'<rect x="45" y="45" width="{W-90}" height="435" rx="36" fill="{BLUE}"/><rect x="45" y="490" width="{W-90}" height="10" rx="5" fill="{YEL}"/>']
    else:
        b = [f'<rect width="{W}" height="480" fill="{BLUE}"/><rect y="480" width="{W}" height="14" fill="{YEL}"/>']
    b.append(T(425, 210, "Scout Explores", 78, "white") + T(425, 360, "Tennessee", 134, "white"))
    b.append(f'<rect x="100" y="395" width="650" height="84" rx="42" fill="{YEL}"/>')
    b.append(T(425, 428, "A Tennessee Coloring Book for Kids: Towns & Fun Facts", 22) + T(425, 458, "from Across the Volunteer State (Ages 6-9)", 22))
    b.append(G(425, 880, scout("wave"), 1.45))
    b.append(T(425, 995, "Featuring Scout, the explorer fox", 23, PINK, weight="normal"))
    b.append(T(425, 1055, PUB, 28, NAVY))
    return svgwrap("".join(b))


def copyright_page():
    b = [dots()]
    b.append(T(425, 170, "Scout Explores Tennessee", 40, BLUE))
    paras = [
        "Copyright © 2026 JCF Publishing. All rights reserved.",
        "Families who buy this book may print or photocopy the coloring pages for use by children in their own household. No part of this book may be resold, shared online or reproduced for commercial or classroom distribution without written permission from the publisher.",
        "The cities, towns and nicknames were chosen to show East, Middle and West Tennessee. The fun facts were checked in October 2026 and are written simply for young readers.",
        "The illustrations are vector line art drawn with the help of AI tools, then checked page by page and cleaned up for young colorists.",
        "Note for grown-ups: every coloring page has a blank back, so markers and felt-tips won't spoil the next picture. Slip a sheet of card behind the page for extra protection.",
        "First edition, October 2026.",
    ]
    y = 250
    for p in paras:
        svg, n = centered_wrap(p, 118, y, 21, 590)
        svg = svg.replace('text-anchor', 'text-anchor')
        # left-aligned
        lines = wrap_width(p, 590, 21)
        for i, ln in enumerate(lines):
            b.append(T(118, y + i * 28, ln, 21, NAVY, anchor="start", weight="normal"))
        y += len(lines) * 28 + 14
    b.append(f'<rect x="118" y="905" width="590" height="92" rx="40" fill="{PINK}"/>')
    b.append(T(413, 945, "Tennessee became the 16th state on June 1, 1796 —", 21, "white", weight="normal"))
    b.append(T(413, 974, "let's explore it together!", 21, "white", weight="normal"))
    b.append(T(413, 1055, PUB, 26, NAVY))
    return svgwrap(b[0] + "".join(b[1:]))


def belongs_page():
    b = [dots()]
    b.append(f'<rect x="78" y="118" width="670" height="930" rx="60" fill="none" stroke="{BLUE}" stroke-width="6"/>')
    b.append(T(413, 275, "This book belongs to", 48, BLUE))
    b.append(f'<line x1="157" y1="395" x2="669" y2="395" stroke="black" stroke-width="2.5"/>')
    b.append(T(413, 520, "My favorite Tennessee town is", 34, PINK))
    b.append(f'<line x1="217" y1="598" x2="609" y2="598" stroke="black" stroke-width="2"/>')
    b.append(T(413, 725, "My age", 34, GOLD))
    b.append(f'<line x1="335" y1="806" x2="492" y2="806" stroke="black" stroke-width="2.5"/>')
    b.append(G(413, 1000, scout("wave"), 0.6))
    b.append(T(413, 1030, "Scout says: “Every town has a story!”", 20, NAVY, weight="normal"))
    return svgwrap("".join(b))


def color_test():
    b = [dots(), T(425, 152, "Color Test Page", 48, BLUE),
         T(425, 205, "Try your crayons, pencils and markers here before you start.", 20, NAVY, weight="normal")]
    cols = (BLUE, YEL, PINK)
    for r in range(6):
        for c in range(4):
            x, y = 78 + c * 173, 275 + r * 134
            b.append(f'<rect x="{x}" y="{y}" width="150" height="110" rx="20" fill="none" stroke="{cols[(r+c)%3]}" stroke-width="4"/>')
    return svgwrap("".join(b))


GROUPS = [("WEST TENNESSEE", PINK, [("Memphis", 11), ("Tiptonville", 13), ("Paris", 15), ("Jackson", 17)]),
          ("MIDDLE TENNESSEE", BLUE, [("Clarksville", 19), ("Nashville", 21), ("Franklin", 23), ("Columbia", 25), ("Murfreesboro", 27), ("Cookeville", 29)]),
          ("EAST TENNESSEE", GOLD, [("Chattanooga", 31), ("Sweetwater", 33), ("Oak Ridge", 35), ("Knoxville", 37), ("Sevierville", 39),
                                    ("Pigeon Forge", 41), ("Gatlinburg", 43), ("Johnson City", 45), ("Kingsport", 47), ("Bristol", 49)])]


def checklist():
    b = [dots(), T(425, 145, "Scout's Travel Checklist", 46, BLUE),
         T(425, 195, "Tick each town when you finish coloring it!", 20, NAVY, weight="normal")]
    y = 250
    for name, col, items in GROUPS[:2]:
        b.append(f'<rect x="88" y="{y-30}" width="330" height="38" rx="19" fill="{col}"/>' + T(112, y - 4, name, 17, "white", anchor="start"))
        y += 30
        for city, pg in items:
            b.append(f'<rect x="92" y="{y-18}" width="19" height="19" rx="5" fill="none" stroke="black" stroke-width="2.4"/>')
            b.append(T(122, y, city, 21, NAVY, anchor="start", weight="normal") + T(412, y, f"p. {pg}", 17, NAVY, anchor="end", weight="normal"))
            y += 31
        y += 28
    y2 = 250
    name, col, items = GROUPS[2]
    b.append(f'<rect x="440" y="{y2-30}" width="310" height="38" rx="19" fill="{col}"/>' + T(464, y2 - 4, name, 17, "white", anchor="start"))
    y2 += 30
    for city, pg in items:
        b.append(f'<rect x="444" y="{y2-18}" width="19" height="19" rx="5" fill="none" stroke="black" stroke-width="2.4"/>')
        b.append(T(474, y2, city, 21, NAVY, anchor="start", weight="normal") + T(744, y2, f"p. {pg}", 17, NAVY, anchor="end", weight="normal"))
        y2 += 31
    b.append(G(425, 1030, scout("wave"), 1.45))
    return svgwrap("".join(b))


def blank_page():
    return svgwrap(T(425, 1068, "This page is left blank so colors don't bleed through. Keep exploring with Scout!", 15, "#9AA3B0", weight="normal"))


# ------------------------------------------------------------------ special coloring pages
def welcome():
    b = [sky_deco(1)]
    b.append(mountain_layer(GY - 90, ((170, 330, 460), (500, 400, 560), (800, 300, 400))))
    b.append(treeline(GY - 20, 40, 810, 100, 3))
    # welcome sign
    sg = GY - 6
    b.append(P(f"M 500 {sg} L 500 470 M 740 {sg} L 740 470", 8))
    b.append(P("M 450 560 L 790 560 L 790 400 L 450 400 Z", 5, "white"))
    b.append(P("M 462 548 L 778 548 L 778 412 L 462 412 Z", 2.6))
    b.append(TXT(620, 468, "WELCOME", 38) + TXT(620, 512, "TO TENNESSEE", 30))
    b.append(S("wave", 250, 1.45))
    b.append(fg_details(GY + 8, 2))
    b.append(ground(GY, 40, 810))
    b.append(stars3((380, 300), (140, 400), (700, 330)))
    return city_page(7, "Welcome to Tennessee!", "M", "", "Tennessee is the Volunteer State. Its flag has 3 stars for East, Middle and West!", "".join(b), 40).replace(zone_tag("M"), "")


def flag_page():
    b = []
    fx0, fy0, fx1, fy1 = 100, 190, 750, 590
    b.append(P(f"M {fx0} {fy0} L {fx1} {fy0} L {fx1} {fy1} L {fx0} {fy1} Z", 5, "white"))
    b.append(LINE(660, fy0, 660, fy1, 3.5) + LINE(678, fy0, 678, fy1, 3.5))
    cx, cy = 360, 390
    b.append(C(cx, cy, 148, 4.5, "white") + C(cx, cy, 120, 4.5, "white"))
    for dx, dy in ((0, -52), (-54, 40), (54, 40)):
        b.append(star(cx + dx, cy + dy, 44, 4, "white"))
    b.append(TXT(425, 670, "Each star stands for one part of Tennessee!", 27))
    for x, lab in zip((330, 530, 720), ("East", "Middle", "West")):
        b.append(C(x, 770, 56, 5, "white") + star(x, 772, 40, 4, "white"))
        b.append(TXT(x, 872, lab, 36))
    b.append(sc(scout("point"), 110, 1000, 0.85))
    return spage("The Tennessee Flag", "".join(b), num=9, caption="Color the flag: red, white and blue. The 3 stars stand for East, Middle and West Tennessee!", title_size=44, layout="activity")


def family_page():
    b = []
    b.append(P("M 250 250 L 790 250 L 790 800 L 250 800 Z", 7, "white") + P("M 290 290 L 750 290 L 750 760 L 290 760 Z", 5, "white"))
    b.append(P("M 300 800 L 250 960 M 740 800 L 790 960 M 520 800 L 520 960", 7))
    b.append(P("M 480 250 L 480 210 L 560 210 L 560 250", 5, "white"))
    b.append(S("point", 130, 1.15, 960))
    b.append(stars3((420, 190), (330, 880), (700, 900), r=(26, 26, 26)))
    return spage("My Family's Town", "".join(b), num=53, caption="My family is from ________. Draw your family inside the frame!", title_size=44, layout="creative")


def goodbye():
    b = [sky_deco(2)]
    b.append(hills_back(GY - 10, 0))
    b.append(sky(hot_air_balloon(440, 480, 330)))
    b.append(treeline(GY - 6, 40, 810, 90, 5))
    b.append(S("wave", 170, 1.4))
    b.append(fg_details(GY + 8, 5))
    b.append(ground(GY, 40, 810))
    b.append(stars3((650, 330), (230, 380), (700, 700)))
    return city_page(51, "Goodbye, Tennessee!", "M", "", "Scout visited 20 towns in East, Middle and West Tennessee. Which was your favorite?", "".join(b), 42).replace(zone_tag("M"), "")


def end_page():
    b = [dots(), T(425, 235, "Great exploring!", 72, BLUE)]
    b.append(G(425, 760, scout("cheer"), 1.8))
    ln, _ = centered_wrap("You visited 20 towns in Tennessee with Scout. Show your family your favorite page, and tell them one fun fact you learned!", 425, 830, 22, 620)
    b.append(ln)
    b.append(f'<rect x="170" y="910" width="510" height="86" rx="43" fill="{YEL}"/>')
    b.append(T(425, 946, "Grown-ups: if your child enjoyed this book, a short", 19, NAVY, weight="normal") + T(425, 974, "review helps other families find it. Thank you!", 19, NAVY, weight="normal"))
    b.append(T(425, 1050, PUB, 28, PINK))
    return svgwrap("".join(b))
