import base64, pathlib, sys
here = pathlib.Path(__file__).parent
fd = here.parent / 'shared' / 'fonts'
def face(fam, w, f, ur=None):
    b = base64.b64encode((fd / f).read_bytes()).decode()
    return f"@font-face{{font-family:'{fam}';font-weight:{w};src:url(data:font/woff2;base64,{b}) format('woff2');" + (f"unicode-range:{ur};" if ur else "unicode-range:U+0000-00FF,U+2000-206F;") + "}"
fonts = "\n".join([face('Archivo',900,'archivo-900.woff2'), face('Archivo',900,'archivo-ext-900.woff2','U+20A0-20AB'),
                   face('IBM Plex Mono',600,'plexmono-600.woff2'), face('IBM Plex Mono',600,'plexmono-ext-600.woff2','U+20A0-20AB')])
src = (here / 'comp.src.html').read_text()
src = src.replace('/*@@FONTS@@*/', fonts)
src = src.replace('/*@@ICONS@@*/', (here.parent / 'shared' / 'icons.js').read_text())
mo = pathlib.Path.home() / 'onetake_src/repo/lib/motion.js'
src = src.replace('/*@@MOTION@@*/', mo.read_text().replace('</script>', '<\/script>'))
def uri(f,mime): return f"data:{mime};base64,"+base64.b64encode((here.parent/'shared'/f).read_bytes()).decode()
src = src.replace('/*@@PAPER@@*/', uri('paper.jpg','image/jpeg')).replace('/*@@DHFLOGO@@*/', uri('dhf_logo_s.png','image/png')).replace('/*@@MANELOGO@@*/', uri('manetrust_logo_s.png','image/png'))
out = pathlib.Path(sys.argv[1]); out.parent.mkdir(parents=True, exist_ok=True); out.write_text(src)
print('built', out, len(src))
