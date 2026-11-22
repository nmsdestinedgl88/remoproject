import sys, asyncio
from playwright.async_api import async_playwright
comp, outdir, *times = sys.argv[1:]
import os; os.makedirs(outdir, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width':1080,'height':1920})
        msgs=[]; pg.on('console', lambda m: msgs.append(m.text)); pg.on('pageerror', lambda e: msgs.append('ERR '+str(e)))
        await pg.goto('file://'+os.path.abspath(comp)); await pg.evaluate('window.__ready')
        for t in times:
            await pg.evaluate(f'window.__seek({float(t)})'); await pg.wait_for_timeout(60)
            await pg.screenshot(path=f'{outdir}/ot_{float(t):05.2f}.png')
        print('\n'.join(msgs[:8])); await b.close()
asyncio.run(main())
