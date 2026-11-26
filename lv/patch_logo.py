#!/usr/bin/env python3
"""Add the Manetrust logo to the header band of every frame. Run after every `build`.  python3 patch_logo.py videos/SLUG"""
import pathlib, re, sys
proj = pathlib.Path(sys.argv[1]); idx = proj / "index.html"; page = idx.read_text()
if not (proj / "assets" / "logo.png").exists():
    sys.exit("no assets/logo.png: header band stays empty (correct when no logo was supplied)")
if 'id="logo"' in page:
    sys.exit("logo already present")
total = re.search(r'data-composition-id="main"[^>]*data-duration="([\d.]+)"', page).group(1)
logo = (f'      <div class="clip" id="logo" data-start="0" data-duration="{total}" data-track-index="5">'
        '<img src="assets/logo.png" alt="" style="position:absolute;left:48px;top:48px;height:96px;width:auto"/></div>\n')
new, n = re.subn(r"(\n    </div>\n    <script>)", "\n" + logo.rstrip("\n") + r"\1", page, count=1)
if not n:
    sys.exit("could not find the end of the root element")
idx.write_text(new); print("logo added to", idx)
