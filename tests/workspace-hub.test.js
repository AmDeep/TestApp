import test from 'node:test'
import assert from 'node:assert/strict'
import { buildInsights } from '../src/workspaceInsights.js'

test('workspace copilot identifies overdue maintenance and planned work',()=>{
 const result=buildInsights({projects:[{id:1,status:'planned',estimate:500}],maintenance:[{id:2,title:'Filter change',due:'2020-01-01',done:false}]})
 assert.equal(result.stats.projects,1)
 assert.equal(result.stats.overdue,1)
 assert.ok(result.insights.some(x=>x.title.includes('overdue')))
 assert.ok(result.insights.some(x=>x.title.includes('waiting to start')))
})
test('workspace copilot handles incomplete legacy data safely',()=>{
 const result=buildInsights({})
 assert.equal(result.stats.projects,0)
 assert.equal(result.stats.maintenance,0)
 assert.ok(result.insights.length>0)
})
test('workspace copilot flags estimates above budget',()=>{
 const result=buildInsights({budget:100,projects:[{estimate:150,status:'doing'}]})
 assert.ok(result.insights.some(x=>x.title.includes('exceed')))
})
