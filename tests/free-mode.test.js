import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
const root=process.cwd()
test('Render blueprint is Free and has no persistent disk',()=>{const y=fs.readFileSync(path.join(root,'render.yaml'),'utf8');assert.match(y,/plan: free/);assert.doesNotMatch(y,/mountPath:|sizeGB:|DATABASE_DIR|HF_HOME/)})
test('server does not create a persistent data directory',()=>{const s=fs.readFileSync(path.join(root,'server.js'),'utf8');assert.match(s,/new PGlite\(\)/);assert.doesNotMatch(s,/mkdirSync|\/var\/data|DATABASE_DIR/)})
test('app uses browser localStorage and no CloudConsole dependency',()=>{const a=fs.readFileSync(path.join(root,'src/App.jsx'),'utf8');assert.match(a,/localStorage\.setItem/);assert.doesNotMatch(a,/CloudConsole/)})
