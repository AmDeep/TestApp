import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const modules = readFileSync(new URL('../src/EnterpriseModules.jsx', import.meta.url), 'utf8')

test('maintenance page uses safe collection fallbacks for legacy workspaces', () => {
  assert.match(app, /\(workspace\.maintenance\|\|\[\]\)\.filter/)
  assert.match(app, /Array\.isArray\(w\.maintenance\)\?w\.maintenance:\[\]/)
})

test('floor plan studio contains no account-console effects or undefined auth references', () => {
  const start = modules.indexOf('export function FloorPlanStudio')
  const end = modules.indexOf('export function FinanceDesk', start)
  const studio = modules.slice(start, end)
  assert.ok(start >= 0 && end > start)
  assert.doesNotMatch(studio, /useEffect|loadHousehold|resetPassword|cloudReady|household\?\.role/)
  assert.match(studio, /Array\.isArray\(storedPlan\.rooms\)/)
})
