// usage: node otstills.mjs comp.html outDir t1 t2 ...   (T = comp-local seconds)
import {createRequire} from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const {chromium} = require('playwright');
import fs from 'node:fs'; import path from 'node:path';
const [comp, out, ...times] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const b = await chromium.launch({args: ['--no-sandbox']});
const pg = await b.newPage({viewport: {width: 1080, height: 1920}});
const msgs = []; pg.on('console', m => msgs.push(m.text())); pg.on('pageerror', e => msgs.push('ERR ' + e));
await pg.goto('file://' + path.resolve(comp)); await pg.evaluate('window.__ready');
for (const t of times) { await pg.evaluate(`window.__seek(${parseFloat(t)})`); await pg.waitForTimeout(50); await pg.screenshot({path: `${out}/ot_${parseFloat(t).toFixed(2).padStart(5, '0')}.png`}); }
console.log(msgs.slice(0, 6).join('\n')); await b.close();
