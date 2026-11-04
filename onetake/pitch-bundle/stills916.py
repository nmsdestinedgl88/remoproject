#!/usr/bin/env python3
"""9:16 contact sheet (onetake's stills.py resizes to 16:9). python3 stills916.py comp.html t1,t2,... out.png"""
import asyncio, io, os, sys
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright
async def main(comp, times, out, cols=6):
    ts = [float(x) for x in times.split(",")]
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": 1080, "height": 1920})
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://" + os.path.abspath(comp)); await pg.evaluate("window.__ready")
        tiles = []
        for t in ts:
            await pg.evaluate(f"window.__seek({t})"); await pg.wait_for_timeout(30)
            im = Image.open(io.BytesIO(await pg.screenshot())).resize((360, 640)); ImageDraw.Draw(im).text((6, 6), f"t={t}", fill=(200, 0, 0)); tiles.append(im)
        await b.close()
    rows = (len(tiles) + cols - 1) // cols; sheet = Image.new("RGB", (360 * cols, 640 * rows))
    for i, im in enumerate(tiles): sheet.paste(im, ((i % cols) * 360, (i // cols) * 640))
    sheet.save(out); print("wrote", out, errs[:3] or "no errors")
asyncio.run(main(*sys.argv[1:4]))
