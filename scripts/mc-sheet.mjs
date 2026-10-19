// Contact sheet per episode: one still per scene (just before its cut) plus frame 0.
// node scripts/mc-sheet.mjs <compId>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {mkdirSync} from 'node:fs';

const id = process.argv[2];
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const outDir = `out/stills/${id}`;
mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
const d = composition.props.d;
const starts = d.scenes.map((s) => s.t);
const ends = [...starts.slice(1), composition.durationInFrames / 30];
const times = [0, ...ends.map((e) => e - 0.4)];
for (const s of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * 30));
  const output = `${outDir}/${String(frame).padStart(4, '0')}.png`;
  await renderStill({serveUrl, composition, frame, output, browserExecutable, scale: 0.4});
}
console.log('done', id);
