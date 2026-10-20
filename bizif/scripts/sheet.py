import sys
from PIL import Image
names=sys.argv[2:]
ims=[Image.open(f'/home/user/remoproject/bizif/out/s_{n}.png') for n in names]
w,h=ims[0].size
s=Image.new('RGB',(w*len(ims),h))
for i,im in enumerate(ims): s.paste(im,(i*w,0))
s.save(sys.argv[1]); print(s.size)
