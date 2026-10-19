// Render check stills for Manetrust episodes: node scripts/mc-stills.mjs <compId> <sec,sec,...> [outDir]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {mkdirSync} from 'node:fs';

const [id, secs, outDir = 'out/stills'] = process.argv.slice(2);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const s of secs.split(',')) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(s) * 30));
  const output = `${outDir}/${id}_${String(frame).padStart(4, '0')}.png`;
  await renderStill({serveUrl, composition, frame, output, browserExecutable, scale: 0.5});
  console.log(output);
}
