import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

test('Render build explicitly installs Vite development dependencies on Free', () => {
  const render = read('../render.yaml')
  assert.match(render, /yarn install --production=false && yarn build/)
  assert.match(render, /plan: free/)
  assert.doesNotMatch(render, /disk:/)
})

test('quick navigation is keyboard accessible and searchable', () => {
  const app = read('../src/App.jsx')
  assert.match(app, /e\.metaKey\|\|e\.ctrlKey/)
  assert.match(app, /setCommandOpen\(v=>!v\)/)
  assert.match(app, /commandItems=nav\.filter/)
  assert.match(app, /aria-modal="true"/)
  assert.match(app, /Skip to content/)
})

test('mobile navigation uses a bottom dock without changing local storage keys', () => {
  const css = read('../src/index.css')
  const app = read('../src/App.jsx')
  assert.match(css, /inset:auto 0 0;width:100%;height:72px/)
  assert.match(css, /env\(safe-area-inset-bottom\)/)
  assert.match(app, /harmonious-home-v2/)
  assert.match(app, /harmonious-home-workspace/)
})

test('Kokoro falls back to quantized WebAssembly after WebGPU initialization failure', () => {
  const narrator = read('../src/KokoroNarrator.jsx')
  assert.match(narrator, /device:'webgpu'/)
  assert.match(narrator, /dtype:'q8',device:'wasm'/)
})
