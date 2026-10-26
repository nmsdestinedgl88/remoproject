"""Stage 7: compile Scout Explores Tennessee interior as A4 PDF (vector art pages + typeset header)."""
import sys, os, json, re, subprocess
sys.path.insert(0, "/home/user/bedardandy/coloring-book-skill/lib")
sys.path.insert(0, "/home/user/remoproject/scout-tennessee")
from charlib import word, word_width, TXT, text_width, wrap_width, star, P, C, LINE, _serialize
import cairosvg
import extras               # letter-size front matter from the earlier build (re-used, scaled to A4)

AW, AH = 827, 1169          # A4 at 100 dpi units
OUT = "book_a4"; os.makedirs(OUT + "/pages", exist_ok=True)
data = {d["key"]: d for d in json.load(open("pages_data.json"))}
DIV = {"West": "WEST TENNESSEE", "Middle": "MIDDLE TENNESSEE", "East": "EAST TENNESSEE"}
NOPILL = {"welcome", "flag", "family", "goodbye"}
ART = {}                    # key -> final svg path
for f in sorted(os.listdir("pages_final")):
    if f.endswith(".svg"):
        m = re.match(r"\d+_(.+?)(_r)?\.svg$", f); ART[m.group(1)] = "pages_final/" + f

import numpy as np
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
LEFT, RIGHT, BOTTOM = 55, 795, 1114          # KDP-safe art box in page units (100/inch): >=0.55 in gutter, 0.32 in outer, 0.55 in bottom

def art_svg(path):
    s = open(path).read()
    d = re.search(r' d="([^"]+)"', s).group(1)
    png = np.array(Image.open(path.replace(".svg", ".png")).convert("L")) < 128
    ys, xs = np.where(png); H, W = png.shape
    ux, uy = AW / W, AH / H                                  # png px -> page units
    x0, x1, y0, y1 = xs.min() * ux, xs.max() * ux, ys.min() * uy, ys.max() * uy
    sc = min(1.0, (RIGHT - LEFT) / (x1 - x0), (BOTTOM - 222) / (y1 - y0))   # also keep art below the header text (y>=222)
    tx = (LEFT + RIGHT) / 2 - sc * (x0 + x1) / 2
    ty = BOTTOM - sc * y1
    return (f'<g transform="translate({tx:.2f},{ty:.2f}) scale({sc:.4f})">'
            f'<svg x="0" y="0" width="{AW}" height="{AH}" viewBox="0 0 2680 3790" preserveAspectRatio="none">'
            f'<rect width="2680" height="3790" fill="white"/><path d="{d}" fill="black" fill-rule="evenodd"/></svg></g>')

def pill(text, x, y):
    w = text_width(text, 13) + 26
    return (P(f"M {x-w/2+11} {y-15} L {x+w/2-11} {y-15} Q {x+w/2} {y-15} {x+w/2} {y-4} L {x+w/2} {y+4} Q {x+w/2} {y+15} {x+w/2-11} {y+15} "
              f"L {x-w/2+11} {y+15} Q {x-w/2} {y+15} {x-w/2} {y+4} L {x-w/2} {y-4} Q {x-w/2} {y-15} {x-w/2+11} {y-15} Z", 2.2)
            + TXT(x, y + 4.5, text, 13))

def legend():
    cx, cy = 752, 62
    o = C(cx, cy, 20, 3, "white")
    for dx, dy in ((0, -8), (-8, 5), (8, 5)):
        o += star(cx + dx, cy + dy, 7, 2, "white")
    return o + TXT(cx, 104, "Find & color", 12, weight="normal") + TXT(cx, 119, "3 flag stars!", 12, weight="normal")

def art_page(key, num):
    d = data[key]
    title, fact, nick = d["title"], d["fact"], d["nickname"]
    size = min(62, 62 * 540 / word_width(title, 62))
    b = [f'<rect width="{AW}" height="{AH}" fill="white"/>', art_svg(ART[key])]
    ch = []
    if key not in NOPILL:
        ch.append(pill(DIV[d["division"]], 128, 58))
    ch.append(legend())
    ch.append(word(title, AW / 2, 142, size=size, tracking=6))
    line = (f"Nickname: “{nick}”  •  Scout's Fun Fact: {fact}" if nick else f"Scout's Fun Fact: {fact}")
    lines = wrap_width(line, 690, 16.5)
    for i, ln in enumerate(lines[:3]):
        ch.append(TXT(AW / 2, 172 + i * 21, ln, 16.5))
    ch.append(TXT(AW / 2, 1143, str(num), 14, weight="normal"))
    return _serialize(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{AW}" height="{AH}" viewBox="0 0 {AW} {AH}">' + "".join(b) + "".join(ch) + "</svg>")

def letter_to_a4(svg_letter, top_fill=None):
    """Re-use a letter-size front-matter page: scale to A4 width, centre vertically."""
    inner = re.sub(r'^<svg[^>]*>', '', svg_letter.strip()); inner = inner[:-6]
    sc = AW / 850.0; off = (AH - 1100 * sc) / 2
    bg = f'<rect width="{AW}" height="{AH}" fill="white"/>'
    if top_fill:
        bg += f'<rect width="{AW}" height="{off + 2:.1f}" fill="{top_fill}"/>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{AW}" height="{AH}" viewBox="0 0 {AW} {AH}">' + bg +
            f'<g transform="translate(0,{off:.1f}) scale({sc:.5f})">{inner}</g></svg>')

def cover_page():
    import base64
    b = base64.b64encode(open("cover/cover_a4_300.jpg", "rb").read()).decode()
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{AW}" height="{AH}" viewBox="0 0 {AW} {AH}">'
            f'<image width="{AW}" height="{AH}" preserveAspectRatio="none" xlink:href="data:image/jpeg;base64,{b}"/></svg>')

def half_title():
    body = (f'<rect width="{AW}" height="{AH}" fill="white"/>' + TXT(AW / 2, 520, "Scout Explores Tennessee", 40) +
            TXT(AW / 2, 570, "JCF Publishing", 20, weight="normal"))
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{AW}" height="{AH}" viewBox="0 0 {AW} {AH}">' + _serialize(body) + "</svg>"

def blank():
    return letter_to_a4(extras.blank_page())

if __name__ == "__main__":
    from PIL import Image
    Image.open("cover/cover_a4_300.png").convert("RGB").save("cover/cover_a4_300.jpg", quality=95, dpi=(300, 300))
    cities = ["memphis", "tiptonville", "paris", "jackson", "clarksville", "nashville", "franklin", "columbia", "murfreesboro", "cookeville",
              "chattanooga", "sweetwater", "oak_ridge", "knoxville", "sevierville", "pigeon_forge", "gatlinburg", "johnson_city", "kingsport", "bristol"]
    seq = [("cover", cover_page()), ("title", letter_to_a4(extras.title_page(), "#4FB0E5")), ("copyright", letter_to_a4(extras.copyright_page())),
           ("belongs", letter_to_a4(extras.belongs_page())), ("colortest", letter_to_a4(extras.color_test())), ("checklist", letter_to_a4(extras.checklist())),
           ("welcome", art_page("welcome", 7)), ("b8", blank()), ("flag", art_page("flag", 9)), ("b10", blank())]
    n = 11
    for c in cities:
        seq.append((c, art_page(c, n))); seq.append((f"b{n+1}", blank())); n += 2
    seq += [("family", art_page("family", 51)), ("b52", blank()), ("goodbye", art_page("goodbye", 53)), ("b54", blank()),
            ("end", letter_to_a4(extras.end_page())), ("b56", blank())]
    assert len(seq) == 56, len(seq)
    def build(seq, out):
        pdfs = []
        for i, (name, svg) in enumerate(seq, 1):
            p = f"{OUT}/pages/{i:03d}_{name}"
            open(p + ".svg", "w").write(svg)
            cairosvg.svg2pdf(bytestring=svg.encode(), write_to=p + ".pdf", output_width=793.7, output_height=1122.5)
            pdfs.append(p + ".pdf")
        subprocess.run(["gs", "-dBATCH", "-dNOPAUSE", "-q", "-sDEVICE=pdfwrite", "-dPDFSETTINGS=/prepress", f"-sOutputFile={out}"] + pdfs, check=True)
        print("built", out, flush=True)
    build(seq, f"{OUT}/Scout-Explores-Tennessee_A4_preview.pdf")
    seq_print = [("halftitle", half_title()), ("title", letter_to_a4(extras.title_page(inset=True)))] + seq[2:]
    build(seq_print, f"{OUT}/Scout-Explores-Tennessee_print_interior_A4.pdf")
    sys.exit(0)
    pdfs = []
    for i, (name, svg) in enumerate(seq, 1):
        p = f"{OUT}/pages/{i:03d}_{name}"
        open(p + ".svg", "w").write(svg)
        cairosvg.svg2pdf(bytestring=svg.encode(), write_to=p + ".pdf", output_width=793.7, output_height=1122.5)
        pdfs.append(p + ".pdf"); print("built", i, name, flush=True)
    subprocess.run(["gs", "-dBATCH", "-dNOPAUSE", "-q", "-sDEVICE=pdfwrite", "-dPDFSETTINGS=/prepress", f"-sOutputFile={OUT}/Scout-Explores-Tennessee_A4.pdf"] + pdfs, check=True)
    print("PDF ready")
