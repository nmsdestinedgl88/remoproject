// OneTake comp -> frames (3 sub-frames per output frame for a shutter) -> mp4. usage: node otrender.mjs comp.html outDir [workers]
import {createRequire} from 'node:module';
import fs from 'node:fs'; import path from 'node:path'; import {execSync} from 'node:child_process';
const G = execSync('npm root -g').toString().trim();
const {chromium} = createRequire(G + '/')('playwright');
const [comp, out, wk = '3'] = process.argv.slice(2);
const FPS = 30, SUB = 3, SHUT = 0.5; // 180 deg shutter
fs.mkdirSync(out, {recursive: true});
const b0 = await chromium.launch({args: ['--no-sandbox']});
const pg0 = await b0.newPage({viewport: {width: 1080, height: 1920}});
await pg0.goto('file://' + path.resolve(comp)); await pg0.evaluate('window.__ready');
const DUR = await pg0.evaluate('window.__meta.dur'); await b0.close();
const N = Math.round(DUR * FPS), W = parseInt(wk);
console.log('frames', N, 'duration', DUR);
async function worker(id) {
  const b = await chromium.launch({args: ['--no-sandbox']});
  const pg = await b.newPage({viewport: {width: 1080, height: 1920}});
  await pg.goto('file://' + path.resolve(comp)); await pg.evaluate('window.__ready');
  for (let i = id; i < N; i += W) {
    const t = i / FPS;
    for (let k = 0; k < SUB; k++) {
      const off = ((k - (SUB - 1) / 2) / (SUB - 1)) * SHUT / FPS; // -/+ quarter frame
      await pg.evaluate(`window.__seek(${Math.max(0, t + off)}, ${t})`);
      await pg.screenshot({path: `${out}/f_${String(i * SUB + k).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 95});
    }
    if (i % 60 === id) console.log('worker', id, 'frame', i);
  }
  await b.close();
}
await Promise.all(Array.from({length: W}, (_, i) => worker(i)));
console.log('captured');
