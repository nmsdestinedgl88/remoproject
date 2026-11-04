#!/usr/bin/env python3
"""Inline fonts and images into assets.js so the file:// render needs nothing else."""
import base64, pathlib
R = pathlib.Path(__file__).resolve().parents[2] / "public"
def uri(p, mime): return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()
out = "window.ASSETS = {\n"
out += f"  anton: '{uri(R/'fonts/anton-400.woff2','font/woff2')}',\n"
out += f"  inter: '{uri(R/'fonts/inter-500.woff2','font/woff2')}',\n"
out += f"  mono: '{uri(R/'fonts/jbmono-500.woff2','font/woff2')}',\n"
out += f"  logo: '{uri(R/'pitch/logo.png','image/png')}',\n"
out += f"  paper: '{uri(R/'pitch/paper.png','image/png')}',\n"
out += "};\n"
pathlib.Path(__file__).with_name("assets.js").write_text(out)
print("assets.js", len(out) // 1024, "KB")
