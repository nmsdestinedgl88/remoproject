"""Stage 5: clean, fit to A4 with header room, trace to vector, render 2480x3508 pure B/W."""
import sys, os, glob, numpy as np
from PIL import Image
import potrace, cairosvg
from multiprocessing import Pool

OUT = "pages_final"; os.makedirs(OUT, exist_ok=True)
CW = 2680; CH = int(round(CW * 1.4142))       # 4x working canvas (A4 ratio)
HEADER = 0.215                                 # fraction of page kept free for title + fact

# Star-count corrections, in 1x page pixels: erase excess badges with white discs,
# draw missing badges (circle + five-point star, same weight as the generator's badges).
EDITS = {
 "01_welcome":       dict(erase=[(192, 187, 34), (656, 620, 34)]),
 "03_memphis":       dict(erase=[(430, 765, 32)]),
 "04_tiptonville":   dict(erase=[(652, 447, 30)]),
 "09_franklin":      dict(erase=[(627, 413, 34)]),
 "12_cookeville":    dict(erase=[(483, 311, 36), (636, 311, 18)]),
 "22_bristol":       dict(erase=[(20, 568, 34), (645, 576, 34), (434, 673, 30)]),
 "14_sweetwater_r":  dict(erase=[(468, 409, 34), (121, 805, 34)]),
 "15_oak_ridge_r":   dict(erase=[(59, 405, 34), (416, 725, 34)]),
 "05_paris":         dict(add=[(480, 230)]),
 "08_nashville":     dict(add=[(130, 170)]),
 "17_sevierville":   dict(add=[(400, 230)], erase=[(486, 495, 12), (503, 631, 12), (521, 646, 12)]),
 "20_johnson_city":  dict(add=[(330, 250)]),
 "23_family":        dict(add=[(576, 830)]),
}

def hollow_solid(big, rim=10):
    """Turn big solid-black fills into outlined shapes (keeps a rim of `rim` px at 4x)."""
    from PIL import ImageFilter
    mask = big.point(lambda v: 0 if v < 150 else 255)             # black = 0
    core = mask.filter(ImageFilter.MaxFilter(2 * rim + 1))         # erode the black regions
    arr = np.array(big); keep = np.array(core) == 0
    arr[keep] = 255
    return Image.fromarray(arr)

def apply_edits(big, name):
    from PIL import ImageDraw
    import math
    if name == "19_gatlinburg":          # shaded bear body (mid-grey) -> white; keep dark outline, eyes, nose
        arr = np.array(big); y0, y1, x0, x1 = 575 * 4, 892 * 4, 225 * 4, 470 * 4
        reg = arr[y0:y1, x0:x1]; reg[(reg >= 70) & (reg < 150)] = 255
        big = Image.fromarray(arr)
    e = EDITS.get(name)
    if not e: return big
    d = ImageDraw.Draw(big)
    for x, y, r in e.get("erase", []):
        d.ellipse([(x - r) * 4, (y - r) * 4, (x + r) * 4, (y + r) * 4], fill=255)
    for x, y in e.get("add", []):
        R, w = 26 * 4, 9
        d.ellipse([x * 4 - R, y * 4 - R, x * 4 + R, y * 4 + R], fill=255, outline=0, width=w)
        pts = []
        for i in range(10):
            rr = 18 * 4 * (1 if i % 2 == 0 else 0.46)
            a = math.pi / 2 + i * math.pi / 5
            pts.append((x * 4 + rr * math.cos(a), y * 4 + 3 - rr * math.sin(a)))
        d.polygon(pts, fill=255)
        d.line(pts + [pts[0]], fill=0, width=8, joint="curve")
    return big

def whiten_header_box(a):
    """Remove long horizontal rules the generator drew across the top zone."""
    h = a.shape[0]
    for y in range(int(h * 0.30)):
        if (a[y] < 130).mean() > 0.60:
            a[max(0, y - 3):y + 4, :] = 255
    return a

def process(path):
    name = os.path.splitext(os.path.basename(path))[0]
    im = Image.open(path).convert("L")
    a = np.array(im)   # header-box whitening no longer needed (round-2 sheets have none; it clipped the easel frame)
    im = Image.fromarray(a)
    big = im.resize((im.width * 4, im.height * 4), Image.LANCZOS)
    big = apply_edits(big, name)
    b = np.array(big) < 150
    ys, xs = np.where(b)
    top = ys.min() / big.height
    # shrink so the art starts below the header zone
    s = 1.0 if top >= HEADER else min(1.0, (1 - HEADER) / (1 - top))
    pw, ph = int(big.width * s), int(big.height * s)
    pg = big.resize((pw, ph), Image.LANCZOS) if s < 1 else big
    canvas = Image.new("L", (CW, CH), 255)
    canvas.paste(pg, ((CW - pw) // 2, int(CH * 0.975) - ph))
    arr = np.array(canvas) < 150
    pl = potrace.Bitmap(~arr).trace(turdsize=14, alphamax=1.0, opticurve=True, opttolerance=0.5)
    d = []
    for c in pl:
        st = c.start_point; p = f"M{st.x:.1f},{st.y:.1f}"
        for seg in c.segments:
            if seg.is_corner:
                p += f"L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}"
            else:
                p += f"C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} {seg.end_point.x:.1f},{seg.end_point.y:.1f}"
        d.append(p + "Z")
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW}" height="{CH}" viewBox="0 0 {CW} {CH}">'
           f'<rect width="100%" height="100%" fill="white"/><path d="{" ".join(d)}" fill="black" fill-rule="evenodd"/></svg>')
    open(f"{OUT}/{name}.svg", "w").write(svg)
    cairosvg.svg2png(bytestring=svg.encode(), write_to=f"{OUT}/{name}_rgb.png", output_width=2480, output_height=3508)
    Image.open(f"{OUT}/{name}_rgb.png").convert("L").point(lambda v: 0 if v < 128 else 255).convert("1").save(f"{OUT}/{name}.png", dpi=(300, 300))
    os.remove(f"{OUT}/{name}_rgb.png")
    return name, round(top, 3), round(s, 3)

if __name__ == "__main__":
    files = sorted(glob.glob(sys.argv[1] if len(sys.argv) > 1 else "pages_raw/*.png"))
    with Pool(4) as p:
        for r in p.imap_unordered(process, files):
            print("done", r, flush=True)
