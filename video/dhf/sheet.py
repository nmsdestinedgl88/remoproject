import sys
from PIL import Image, ImageDraw
out, cols, *files = sys.argv[1:]
cols = int(cols); W, H = 360, 640
rows = (len(files) + cols - 1) // cols
im = Image.new('RGB', (cols * W, rows * H), (40, 40, 40))
for i, f in enumerate(files):
    t = Image.open(f).convert('RGB').resize((W, H), Image.LANCZOS)
    ImageDraw.Draw(t).text((8, 8), f.split('/')[-1][-12:], fill=(255, 0, 255))
    im.paste(t, ((i % cols) * W, (i // cols) * H))
im.save(out)
