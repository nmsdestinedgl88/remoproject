// usage: node video/dhf/rstills.mjs <CompId> <outDir> <frame,frame,...>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [id, out, list] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const comp = await selectComposition({serveUrl, id, browserExecutable});
for (const fr of list.split(',').map(Number)) {
  await renderStill({composition: comp, serveUrl, output: path.join(out, `${id}_${String(fr).padStart(4, '0')}.png`), frame: fr, browserExecutable, imageFormat: 'png', overwrite: true});
  console.log('still', fr);
}
