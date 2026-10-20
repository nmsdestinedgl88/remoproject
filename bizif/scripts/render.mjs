// node scripts/render.mjs [scale] [out]  — default 2/3 → 720x1280
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
const scale = process.argv[2] ? eval(process.argv[2]) : 2 / 3;
const output = process.argv[3] || "out/bizif-whatsapp-coin.mp4";
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const composition = await selectComposition({ serveUrl, id: "Bizif", browserExecutable });
let last = 0;
await renderMedia({ composition, serveUrl, codec: "h264", crf: 18, scale, outputLocation: output, browserExecutable, concurrency: 4, overwrite: true,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 100); if (p >= last + 5) { last = p; console.log("progress", p); } } });
console.log("done", output);
