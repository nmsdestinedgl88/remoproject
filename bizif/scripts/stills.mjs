// Bundle once, render many stills fast: node scripts/stills.mjs 0.4 frame frame ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
const [scale, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const comp = await selectComposition({ serveUrl, id: "Bizif", browserExecutable });
for (const f of frames) {
  await renderStill({ composition: comp, serveUrl, frame: +f, output: `out/s_${f}.png`, scale: +scale, browserExecutable, overwrite: true });
  console.log("ok", f);
}
