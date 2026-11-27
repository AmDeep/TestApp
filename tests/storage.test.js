import test from 'node:test'
import assert from 'node:assert/strict'
import { safeReadJSON, safeWriteJSON, validateBackup, getStorageEstimate } from '../src/storage.js'

function memoryStorage(seed = {}) {
  const data = new Map(Object.entries(seed))
  return { get length(){return data.size}, getItem:k=>data.has(k)?data.get(k):null, setItem:(k,v)=>data.set(k,String(v)), key:i=>[...data.keys()][i] ?? null }
}

test('safeReadJSON returns defaults for empty or malformed storage without throwing',()=>{
  const storage=memoryStorage({broken:'{'})
  assert.deepEqual(safeReadJSON('missing',[],storage),{value:[],status:'empty'})
  assert.equal(safeReadJSON('broken',{},storage).status,'invalid')
})
test('safeWriteJSON round-trips structured values',()=>{
  const storage=memoryStorage();assert.equal(safeWriteJSON('x',{ok:true},storage).ok,true)
  assert.deepEqual(safeReadJSON('x',null,storage).value,{ok:true})
})
test('safeWriteJSON reports quota failures',()=>{
  const storage={setItem(){const e=new Error('quota');e.name='QuotaExceededError';throw e}}
  assert.equal(safeWriteJSON('x',{},storage).status,'quota')
})
test('backup validation rejects malformed and unrelated files',()=>{
  assert.equal(validateBackup([]).ok,false)
  assert.equal(validateBackup({application:'Other'}).ok,false)
  assert.equal(validateBackup({application:'Harmonious Home',history:{}}).ok,false)
  assert.equal(validateBackup({application:'Harmonious Home',profile:{},history:[],workspace:{}}).ok,true)
})
test('storage estimate counts local keys and values',()=>{
  const estimate=getStorageEstimate(memoryStorage({abc:'def'}))
  assert.equal(estimate.entries,1);assert.equal(estimate.usedBytes,12)
})
