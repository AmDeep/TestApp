import test from 'node:test'
import assert from 'node:assert/strict'
import { KNOWLEDGE_SOURCES, chunkDocument } from '../src/knowledge.js'
import { LOCAL_KNOWLEDGE_PACKS } from '../src/knowledge-packs.js'

test('knowledge catalogue spans core home systems and has stable unique IDs',()=>{
 assert.ok(KNOWLEDGE_SOURCES.length>=40)
 const ids=KNOWLEDGE_SOURCES.map(s=>s.id)
 assert.equal(new Set(ids).size,ids.length)
 for(const id of ['nrc-national-building-code-2025','ontario-building-code','health-canada-carbon-monoxide','ontario-well-water','doe-heat-pumps','epa-rain-gardens','cpsc-tipovers'])assert.ok(ids.includes(id),`missing ${id}`)
 for(const source of KNOWLEDGE_SOURCES){assert.ok(source.required===false?source.url.startsWith('https://'):typeof source.content==='string'&&source.content.length>300);assert.ok(source.publisher);assert.ok(source.license)}
})
test('knowledge chunker preserves content in bounded overlapping pieces',()=>{
 const text=Array.from({length:600},(_,i)=>`Technical home maintenance detail ${i} describes ventilation, insulation and moisture control.`).join(' ')
 const chunks=chunkDocument(text,180,35)
 assert.ok(chunks.length>=3)
 assert.ok(chunks.every(chunk=>chunk.split(/\s+/).length<=180))
 assert.ok(chunks.join(' ').includes('Technical home maintenance detail 599'))
})

test('local-first RAG includes broad, substantive knowledge packs',()=>{
 assert.equal(LOCAL_KNOWLEDGE_PACKS.length,57)
 assert.ok(LOCAL_KNOWLEDGE_PACKS.every(d=>d.required!==false&&d.content.length>900&&d.title&&d.category))
 for(const category of ['health-safety','energy','maintenance','accessibility','interior-design','building-code','tradition-vastu','tradition-feng-shui','ai-workflows','spatial-design'])assert.ok(LOCAL_KNOWLEDGE_PACKS.some(d=>d.category===category),`missing ${category}`)
})
