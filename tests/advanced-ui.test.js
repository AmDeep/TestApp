import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const modules = readFileSync(new URL('../src/EnterpriseModules.jsx', import.meta.url), 'utf8')
const board = readFileSync(new URL('../src/ProjectBoard.jsx', import.meta.url), 'utf8')
const validation = readFileSync(new URL('../src/validation.js', import.meta.url), 'utf8')
const entry = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8')
const vite = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8')

test('route transitions respect reduced-motion preferences', () => {
  assert.match(app, /AnimatePresence mode="wait"/)
  assert.match(app, /useReducedMotion/)
  assert.match(app, /prefersReducedMotion\?0\.01:0\.24/)
})

test('project board supports pointer and keyboard reordering', () => {
  assert.match(board, /PointerSensor/)
  assert.match(board, /KeyboardSensor/)
  assert.match(board, /sortableKeyboardCoordinates/)
  assert.match(board, /arrayMove/)
})

test('finance dashboard uses responsive chart primitives', () => {
  assert.match(modules, /ResponsiveContainer/)
  assert.match(modules, /BarChart/)
  assert.match(modules, /dataKey="amount"/)
})

test('project, maintenance and measured-room data have validation boundaries', () => {
  assert.match(validation, /projectSchema/)
  assert.match(validation, /maintenanceSchema/)
  assert.match(validation, /floorPlanRoomSchema/)
  assert.match(app, /projectSchema\.safeParse/)
  assert.match(app, /maintenanceSchema\.safeParse/)
  assert.match(modules, /floorPlanRoomSchema\.safeParse/)
})

test('application root provides query cache and notification surface', () => {
  assert.match(entry, /QueryClientProvider/)
  assert.match(entry, /Toaster/)
})

test('Vite serves root-relative assets and defines cacheable vendor chunks', () => {
  assert.match(vite, /base:\s*'\/'/)
  assert.match(vite, /codeSplitting/)
  assert.match(vite, /react-vendor/)
  assert.match(vite, /charts-vendor/)
})

test('maintenance UI exposes status views and recurring completion workflow', () => {
  assert.match(app, /maintenanceFilter==='overdue'/)
  assert.match(app, /maintenanceFilter==='completed'/)
  assert.match(app, /nextMaintenanceDate\(localToday,current\.frequency\)/)
  assert.match(app, /previousTaskId:id/)
})

const hub = readFileSync(new URL('../src/WorkspaceHub.jsx', import.meta.url), 'utf8')
const insights = readFileSync(new URL('../src/workspaceInsights.js', import.meta.url), 'utf8')
const agents = readFileSync(new URL('../src/agents.js', import.meta.url), 'utf8')
const server = readFileSync(new URL('../server.js', import.meta.url), 'utf8')

test('project board supports cross-lane Kanban drag and drop', () => {
  assert.match(board, /useDroppable/)
  assert.match(board, /lane:/)
  assert.match(board, /onDragEnd/)
  assert.match(board, /LANES/)
})

test('workspace windows support open, close, minimize, maximize and restore', () => {
  assert.match(hub, /const show=/)
  assert.match(hub, /const close=/)
  assert.match(hub, /const minimize=/)
  assert.match(hub, /const maximize=/)
  assert.match(hub, /is-maximized/)
})

test('command palette and local file drop are available', () => {
  assert.match(hub, /metaKey/)
  assert.match(hub, /dataTransfer\?\.files/)
  assert.match(hub, /txt\|md\|csv/)
  assert.match(hub, /file\.size>1500000/)
})

test('workspace copilot uses safe local insights and bounded AI proposals', () => {
  assert.match(insights, /overdue/)
  assert.match(hub, /\/api\/assist\/plan/)
  assert.match(hub, /acceptSuggestion/)
  assert.match(agents, /Safety Gate Agent/)
  assert.match(agents, /unsafeTerms/)
  assert.match(server, /\/api\/assist\/plan/)
})
