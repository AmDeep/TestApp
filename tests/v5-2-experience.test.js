import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { routeFromPath, routeUrl } from '../src/routing.js'
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')
test('Experience Studio has a stable direct route',()=>{
 assert.deepEqual(routeFromPath('/app/experience-studio'),{page:'studio',financeTab:'overview',invalid:false})
 assert.equal(routeUrl('studio'),'/app/experience-studio')
})
test('Experience Studio includes guided journeys, domain discovery and reduced-motion support',()=>{
 const ui=read('../src/ExperienceStudio.jsx');const css=read('../src/index.css');const app=read('../src/App.jsx')
 assert.match(ui,/Move-in, made calmer/);assert.match(ui,/One-room refresh/);assert.match(ui,/Experience domains/);assert.match(app,/page==='studio'/);assert.match(css,/prefers-reduced-motion:reduce\).*studio-orbit/)
})
test('1,000-item catalogue has exactly 1,000 numbered entries across 20 domains',()=>{
 const doc=read('../docs/V5_2_1000_EXPERIENCE_IDEAS.md');const ids=[...doc.matchAll(/^\d{4}\. \*\*/gm)].map(x=>x[0]);assert.equal(ids.length,1000);assert.match(doc,/### Dashboard & command centre/);assert.match(doc,/### Trust, quality & governance/)
})
test('release navigation exposes Experience Studio',()=>{
 const app=read('../src/App.jsx');const routes=read('../src/routing.js');assert.match(app,/\['studio','Experience studio'/);assert.match(routes,/studio:'experience-studio'/)
})
