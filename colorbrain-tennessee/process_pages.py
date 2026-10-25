"""Stage 5: clean, fit to A4 with header room, trace to vector, render 2480x3508 pure B/W."""
import sys, os, glob, numpy as np
from PIL import Image
import potrace, cairosvg
from multiprocessing import Pool

OUT = "pages_final"; os.makedirs(OUT, exist_ok=True)
CW = 2680; CH = int(round(CW * 1.4142))       # 4x working canvas (A4 ratio)
HEADER = 0.19                                  # fraction of page kept free for title + fact

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
    a = whiten_header_box(np.array(im))
    im = Image.fromarray(a)
    big = im.resize((im.width * 4, im.height * 4), Image.LANCZOS)
    b = np.array(big) < 150
    ys, xs = np.where(b)
    top = ys.min() / big.height
    # shrink so the art starts below the header zone
    s = 1.0 if top >= HEADER - 0.02 else min(1.0, (1 - HEADER) / (1 - top))
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
