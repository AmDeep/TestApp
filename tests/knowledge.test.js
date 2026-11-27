import test from 'node:test'
import assert from 'node:assert/strict'
import {KNOWLEDGE_SOURCES,chunkDocument,terms,searchKnowledge} from '../src/knowledge.js'
import {readFileSync} from 'node:fs'
const server=readFileSync(new URL('../server.js',import.meta.url),'utf8')
const ui=readFileSync(new URL('../src/KnowledgeAssistant.jsx',import.meta.url),'utf8')

test('knowledge catalogue spans the major household topics and has provenance',()=>{
 assert.ok(KNOWLEDGE_SOURCES.length>=15)
 const categories=new Set(KNOWLEDGE_SOURCES.map(x=>x.category))
 for(const category of ['energy','maintenance','indoor-air','health-safety','accessibility','kitchen','gardening'])assert.ok(categories.has(category),`missing ${category}`)
 for(const source of KNOWLEDGE_SOURCES){assert.ok(source.title&&source.publisher&&source.url.startsWith('https://')&&source.license)}
})

test('chunker produces bounded overlapping sections and discards tiny fragments',()=>{
 const words=Array.from({length:1000},(_,i)=>`houseword${i}`).join(' ')
 const chunks=chunkDocument(`## Building envelope\n\n${words}`,180,35)
 assert.ok(chunks.length>=3)
 assert.ok(chunks.every(c=>c.split(/\s+/).length<=180))
 assert.ok(chunks[0].includes('houseword0'))
 assert.ok(chunks[1].includes('houseword145'))
 assert.ok(!chunkDocument('tiny').length)
})

test('tokenizer emits normalized terms and adjacent phrase features',()=>{
 const tokens=terms('The HVAC filters need regular replacement')
 assert.ok(tokens.includes('hvac'))
 assert.ok(tokens.includes('filter'))
 assert.ok(tokens.includes('hvac__filter'))
 assert.ok(!tokens.includes('the'))
})

test('hybrid retrieval returns ranked, source-attributed passages',async()=>{
 const meta={model:'tfidf-fallback',idf:{hvac:2,filter:2,hvac__filter:2,roof:2},df:{hvac:1,filter:1,hvac__filter:1,roof:1},avgLength:4}
 const pool={query:async(sql)=>sql.includes('knowledge_meta')?{rows:[{value:meta}]}:{rows:[{id:'c1',document_id:'d1',chunk_index:0,heading:'HVAC filters',content:'Replace the HVAC filter on a regular schedule and inspect it for dust.',token_count:4,terms:['hvac','filter','hvac__filter'],vector:{hvac:0.7,filter:0.7,'hvac__filter':0.14},title:'Maintaining Your HVAC System',publisher:'ENERGY STAR',category:'maintenance',url:'https://www.energystar.gov/',license:'Public guidance'},{id:'c2',document_id:'d2',chunk_index:0,heading:'Roofing',content:'Inspect roof shingles after storms.',token_count:4,terms:['roof','shingle'],vector:{roof:1},title:'Roof Maintenance',publisher:'Test Publisher',category:'maintenance',url:'https://example.org/roof',license:'Test'}]}}
 const result=await searchKnowledge(pool,'HVAC filter replacement')
 assert.equal(result.ready,true)
 assert.equal(result.results[0].id,'c1')
 assert.equal(result.results[0].title,'Maintaining Your HVAC System')
 assert.ok(result.results[0].score>0)
})

test('RAG endpoints are authenticated and the UI renders per-answer citations',()=>{
 assert.match(server,/app\.get\('\/api\/knowledge\/documents',auth/)
 assert.match(server,/app\.post\('\/api\/assist\/chat',auth,membership,chatLimiter/)
 assert.match(server,/retrieval\.strategy/)
 assert.match(ui,/SOURCES USED/)
 assert.match(ui,/item\.url/)
 assert.match(ui,/Reference library/)
})
