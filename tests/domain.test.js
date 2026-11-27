import test from 'node:test'
import assert from 'node:assert/strict'
import {evaluateHomeRules,assessmentCompleteness,getMissingQuestions,getDoNotList} from '../src/domain.js'

test('empty profile has zero completeness and missing context',()=>{
  assert.equal(assessmentCompleteness({}),0)
  assert.ok(getMissingQuestions({}).length>0)
})
test('practical-only lens does not return tradition findings',()=>{
  const findings=evaluateHomeRules({tradition:'practical_only',climateConcerns:['Monsoon dampness / mould'],daylight:'Limited / dark'})
  assert.ok(findings.every(f=>f.basis?.some(b=>b==='Practical building')))
})
test('Vastu findings are isolated from Feng Shui',()=>{
  const profile={tradition:'vastu',kitchenLocation:'South-West'}
  const findings=evaluateHomeRules(profile)
  assert.ok(findings.every(f=>f.id.startsWith('VASTU-')||f.basis?.some(b=>b==='Practical building')))
})
test('safety constraints are always returned',()=>{
  const list=getDoNotList()
  assert.ok(list.length>=4)
  assert.ok(list.some(x=>x.toLowerCase().includes('emergency exits')))
})
