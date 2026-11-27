import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { LOCAL_KNOWLEDGE_PACKS } from '../src/knowledge-packs.js'
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')
test('v5.3 registers the adopted Konva canvas stack',()=>{
 const pkg=JSON.parse(read('../package.json'))
 assert.equal(pkg.version,'5.3.0')
 assert.ok(pkg.dependencies.konva)
 assert.ok(pkg.dependencies['react-konva'])
 assert.ok(pkg.dependencies['react-markdown'])
 assert.ok(pkg.dependencies['remark-gfm'])
 assert.match(read('../src/KnowledgeAssistant.jsx'),/ReactMarkdown remarkPlugins=\{\[remarkGfm\]\}/)
 assert.match(read('../src/EnterpriseModules.jsx'),/from 'react-konva'/)
 assert.match(read('../src/EnterpriseModules.jsx'),/onDragEnd/)
})
test('v5.3 includes 57 local RAG knowledge packs and mirrored markdown guides',()=>{
 assert.equal(LOCAL_KNOWLEDGE_PACKS.length,57)
 const files=readdirSync(new URL('../docs/knowledge/',import.meta.url)).filter(x=>x.endsWith('.md')&&x!=='README.md')
 assert.equal(files.length,57)
 assert.ok(LOCAL_KNOWLEDGE_PACKS.every(x=>x.content.length>900&&x.license.includes('Original educational synthesis')))
})
test('v5.3 register contains exactly 1,000 numbered items and explicit statuses',()=>{
 const doc=read('../docs/V5_3_1000_ITEM_VALIDATION_REGISTER.md')
 const ids=[...doc.matchAll(/^\d{4}\. /gm)]
 assert.equal(ids.length,1000)
 assert.match(doc,/Implemented in v5\.3\.0/)
 assert.match(doc,/Existing foundation/)
 assert.match(doc,/Roadmap/)
})
test('external RAG links are optional and local packs are required',()=>{
 const src=read('../src/knowledge.js')
 assert.match(src,/includeExternal=false/)
 assert.match(src,/source\.required===false&&!includeExternal/)
 assert.match(src,/requiredSources/)
})
test('Groq room-layout copilot is bounded, validated and non-mutating',()=>{
 const server=read('../server.js')
 assert.match(server,/api\/assist\/room-layout/)
 assert.match(server,/response_format:\{type:'json_object'\}/)
 assert.match(server,/applied:false/)
 assert.match(server,/Original local Harmonious Home educational synthesis/)
 assert.match(server,/Your measured plan was not changed/)
 const ui=read('../src/EnterpriseModules.jsx')
 assert.match(ui,/GROQ SPACE-PLANNING COPILOT/)
 assert.match(ui,/requestLayoutIdeas/)
})
