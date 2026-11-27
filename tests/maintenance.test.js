import test from 'node:test'
import assert from 'node:assert/strict'
import { nextMaintenanceDate } from '../src/maintenance.js'

test('weekly maintenance advances by seven calendar days',()=>assert.equal(nextMaintenanceDate('2026-11-26','Weekly'),'2026-12-03'))
test('monthly recurrence clamps month end instead of overflowing',()=>assert.equal(nextMaintenanceDate('2026-01-31','Monthly'),'2026-02-28'))
test('yearly recurrence clamps leap day in non-leap year',()=>assert.equal(nextMaintenanceDate('2024-02-29','Yearly'),'2025-02-28'))
test('one-time tasks do not recur',()=>assert.equal(nextMaintenanceDate('2026-11-26','One-time'),null))
test('invalid dates are rejected',()=>assert.equal(nextMaintenanceDate('not-a-date','Monthly'),null))

test('invalid calendar dates are rejected',()=>assert.equal(nextMaintenanceDate('2026-02-31','Monthly'),null))

test('maintenance page tolerates a legacy workspace without a maintenance array', () => {
  const workspace = { projects: [], rooms: {}, budget: 0 }
  const tasks = Array.isArray(workspace.maintenance) ? workspace.maintenance : []
  assert.deepEqual(tasks, [])
})
