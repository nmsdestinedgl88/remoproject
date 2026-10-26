import sys, io
sys.path.insert(0, "/home/user/bedardandy/coloring-book-skill/lib")
from charlib import text_path, text_width, wrap_width
import numpy as np, cairosvg
from PIL import Image, ImageDraw

DPI = 300
TRIM_W, TRIM_H, BLEED = 8.268, 11.693, 0.125
PAGES = 56
SPINE_IN = PAGES * 0.002252
PW = round((TRIM_W + BLEED) * DPI)                 # panel width incl. outer bleed = 2518
SP = round(SPINE_IN * DPI)                         # 38
FW = PW + SP + PW                                  # 5074
FH = round((TRIM_H + 2 * BLEED) * DPI)             # 3583
print("wrap px", FW, FH, "spine px", SP)

def cover_fit(img, w, h):
    s = max(w / img.width, h / img.height)
    big = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    ox, oy = (big.width - w) // 2, (big.height - h) // 2
    return big.crop((ox, oy, ox + w, oy + h)), s, ox, oy

front = Image.open("cover/cover_scout-tennessee_clean.png").convert("RGB")
back = Image.open("cover/cover_scout-tennessee_back_raw.jpg").convert("RGB")
# keep the publisher line inside the 0.25 in safe zone: repaint it a little further left/up
fa = np.array(front); reg = fa[950:1015, 520:718]
dark = np.where((reg.sum(2) < 330))
ty0, ty1, tx0_, tx1_ = dark[0].min() + 950, dark[0].max() + 950, dark[1].min() + 520, dark[1].max() + 520
print("JCF text bbox", tx0_, tx1_, ty0, ty1)
ring = np.concatenate([fa[ty0 - 14:ty0 - 6, tx0_ - 8:tx1_ + 8].reshape(-1, 3), fa[ty1 + 6:ty1 + 14, tx0_ - 8:tx1_ + 8].reshape(-1, 3)])
bgc = tuple(int(v) for v in np.median(ring, axis=0))
fa[ty0 - 8:ty1 + 9, tx0_ - 10:tx1_ + 11] = bgc
front = Image.fromarray(fa)
w_old = tx1_ - tx0_; k = w_old / text_width("JCF Publishing", 1)
tsvg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{front.width}" height="{front.height}">' +
        text_path(tx1_ - 24, ty1 - 18, "JCF Publishing", k, anchor="end", weight="normal", fill="#1C2430") + "</svg>")
tov = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=tsvg.encode()))).convert("RGBA")
front = front.convert("RGBA"); front.alpha_composite(tov); front = front.convert("RGB")
f_img, fs, fox, foy = cover_fit(front, PW, FH)
b_img, bs, box_, boy = cover_fit(back, PW, FH)
print("scale front/back", round(fs, 3), round(bs, 3), "effective dpi", round(DPI / fs), round(DPI / bs))

# spine: flat band in the front cover's sky blue
sky = np.array(front.crop((2, 300, 40, 600))).reshape(-1, 3)
spine_rgb = tuple(int(v) for v in np.median(sky, axis=0)); print("spine colour", spine_rgb)
canvas = Image.new("RGB", (FW, FH), spine_rgb)
canvas.paste(b_img, (0, 0)); canvas.paste(f_img, (PW + SP, 0))

# ---- back-cover text, typeset in the reserved cream panel
px0, px1, py0, py1 = (97 * bs - box_), (622 * bs - box_), (110 * bs - boy), (783 * bs - boy)
print("panel", round(px0), round(px1), round(py0), round(py1))
NAVY, BLUE, PINK = "#1C2430", "#2F8FCB", "#E0527F"
pad = 150
tx0, tx1 = px0 + pad, px1 - pad
maxw = tx1 - tx0
parts = []
y = py0 + 190
def para(text, size, fill=NAVY, weight="bold", lh=1.28, gap=0, anchor="start", x=None):
    global y
    lines = wrap_width(text, maxw if anchor == "start" else maxw, size)
    for ln in lines:
        parts.append(text_path(x if x is not None else (tx0 if anchor == "start" else (tx0 + tx1) / 2), y, ln, size, anchor=anchor, weight=weight, fill=fill))
        y += size * lh
    y += gap
para("Pack your crayons - Scout is exploring Tennessee!", 112, NAVY, "bold", 1.18, 50, anchor="middle")
para("Join Scout the explorer fox on a road trip from the Mississippi River to the Great Smoky Mountains. Visit 20 Tennessee cities and towns - from Memphis and Nashville to Knoxville, Chattanooga and Gatlinburg - and color a big scene for each one with a fun fact to learn.", 66, NAVY, "normal", 1.32, 60)
bul = ["24 single-sided coloring pages with blank backs", "20 cities and towns across East, Middle and West Tennessee",
       "A fun fact on every page, written for ages 6-9", "Find and color 3 hidden flag stars on every page",
       "Travel checklist, color test page and \"My Family's Town\" drawing page"]
for b in bul:
    lines = wrap_width(b, maxw - 70, 62)
    parts.append(f'<circle cx="{tx0 + 18}" cy="{y - 22}" r="12" fill="{PINK}"/>')
    for i, ln in enumerate(lines):
        parts.append(text_path(tx0 + 60, y, ln, 62, anchor="start", weight="normal", fill=NAVY)); y += 62 * 1.3
    y += 14
y += 40
parts.append(text_path((tx0 + tx1) / 2, py1 - 150, "A Scout Explores book", 62, anchor="middle", weight="bold", fill=BLUE))
parts.append(text_path((tx0 + tx1) / 2, py1 - 75, "JCF Publishing", 62, anchor="middle", weight="bold", fill=NAVY))
print("text bottom", round(y), "limit", round(py1 - 230))
assert y < py1 - 230, "text overflows the panel"
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{FW}" height="{FH}" viewBox="0 0 {FW} {FH}">' + "".join(parts) + "</svg>"
ov = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode()))).convert("RGBA")
canvas = canvas.convert("RGBA"); canvas.alpha_composite(ov); wrap = canvas.convert("RGB")
wrap.save("cover/cover_scout-tennessee_wrap.png", dpi=(DPI, DPI))
wrap.save("cover/cover_scout-tennessee_wrap.pdf", resolution=DPI, quality=95)

# ---- proof with guides
pr = wrap.copy(); d = ImageDraw.Draw(pr, "RGBA")
bl = round(BLEED * DPI)
d.rectangle([bl, bl, FW - bl, FH - bl], outline=(255, 0, 0, 255), width=6)                       # trim
sm = round(0.25 * DPI)
for x0, x1 in ((bl + sm, PW - sm), (PW + SP + sm - bl, FW - bl - sm)):
    d.rectangle([x0, bl + sm, x1, FH - bl - sm], outline=(0, 160, 0, 255), width=4)               # 0.25 in safe
d.rectangle([PW, 0, PW + SP, FH], outline=(0, 0, 255, 255), width=6)                             # spine
bx1 = PW - bl - sm; bx0 = bx1 - 2 * DPI; by1 = FH - bl - sm; by0 = by1 - round(1.2 * DPI)
d.rectangle([bx0, by0, bx1, by1], fill=(255, 255, 0, 110), outline=(255, 140, 0, 255), width=6)   # barcode 2 x 1.2 in
pr.resize((FW // 4, FH // 4), Image.LANCZOS).save("cover/cover_scout-tennessee_wrap_proof.png")
print("done", wrap.size)
