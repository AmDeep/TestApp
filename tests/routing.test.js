import test from 'node:test'
import assert from 'node:assert/strict'
import {routeFromPath,routeUrl} from '../src/routing.js'

test('primary modules resolve to stable routes and page identifiers',()=>{
  for(const [page,slug] of Object.entries({overview:'overview',assessment:'assessment',layout:'room-plan',explore:'explorer',rooms:'room-journal',projects:'projects',budget:'budget',finance:'finance',maintenance:'maintenance',compare:'compare',history:'history',account:'household',settings:'settings'})){
    assert.equal(routeFromPath(`/app/${slug}`).page,page)
    assert.equal(routeUrl(page),page==='finance'?'/app/finance/overview':`/app/${slug}`)
  }
})
test('finance subsections resolve independently and round-trip',()=>{
  for(const tab of ['overview','transactions','vendors','orders','invoices']){
    const url=routeUrl('finance',tab),route=routeFromPath(url)
    assert.equal(url,`/app/finance/${tab}`);assert.equal(route.page,'finance');assert.equal(route.financeTab,tab);assert.equal(route.invalid,false)
  }
})
test('root and legacy short routes remain safe',()=>{
  assert.equal(routeFromPath('/').page,'overview')
  assert.equal(routeFromPath('/finance').page,'finance')
  assert.equal(routeFromPath('/finance/transactions').financeTab,'transactions')
})
test('unknown routes are flagged for a safe overview redirect',()=>{
  assert.equal(routeFromPath('/app/not-a-module').invalid,true)
  assert.equal(routeFromPath('/app/finance/nope').invalid,true)
  assert.equal(routeFromPath('/app/finance/transactions/extra').invalid,true)
  assert.equal(routeFromPath('/app/projects/extra').invalid,true)
})
