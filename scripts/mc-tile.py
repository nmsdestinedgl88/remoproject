import glob, sys
from PIL import Image
for d in sys.argv[1:]:
    fs = sorted(glob.glob(f'out/stills/{d}/*.png')); ims = [Image.open(f) for f in fs]
    w, h = ims[0].size; cols = 8; rows = (len(ims) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * w, rows * h), 'white')
    for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * w, (i // cols) * h))
    sheet.save(f'out/sheet_{d}.png'); print(d, sheet.size)
