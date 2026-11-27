import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')
test('application uses guarded storage writes and atomic backup validation',()=>{
 const app=read('../src/App.jsx');assert.match(app,/safeWriteJSON\(STORE/);assert.match(app,/validateBackup\(data\)/);assert.match(app,/window\.confirm\('Restore this backup\? It will replace/)
})
test('Free Mode messaging does not promise durable cloud sync',()=>{
 const app=read('../src/App.jsx');assert.match(app,/does not provide durable cloud workspace synchronization/);assert.doesNotMatch(app,/enable cloud workspace sync/)
})
test('service worker excludes API calls from cache and supports update notification',()=>{
 const sw=read('../public/sw.js');assert.match(sw,/url\.pathname\.startsWith\('\/api\/'\)/);assert.match(sw,/caches\.match\('\/index\.html'\)/)
 const app=read('../src/App.jsx');assert.match(app,/serviceWorker\.register\('\/sw\.js'/);assert.match(app,/A new version is ready/)
})
test('release metadata is synchronized',()=>{
 const pkg=JSON.parse(read('../package.json'));const app=read('../src/App.jsx');assert.equal(pkg.version,'5.2.0');assert.match(app,/VERSION 5\.2\.0/)
})
