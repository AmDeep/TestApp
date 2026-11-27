import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const speech=readFileSync(new URL('../src/KokoroNarrator.jsx',import.meta.url),'utf8')
const server=readFileSync(new URL('../server.js',import.meta.url),'utf8')
const agents=readFileSync(new URL('../src/agents.js',import.meta.url),'utf8')
const flow=readFileSync(new URL('../src/AgentFlow.jsx',import.meta.url),'utf8')
const editor=readFileSync(new URL('../src/RichJournalEditor.jsx',import.meta.url),'utf8')
const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'))

test('Kokoro narrator is local, open source, selectable and has no speech service secrets',()=>{
 assert.match(speech,/kokoro-js/)
 assert.match(speech,/KokoroTTS\.from_pretrained/)
 assert.match(speech,/webgpu/)
 assert.match(speech,/wasm/)
 assert.match(speech,/af_heart/)
 assert.match(speech,/bf_emma/)
 assert.match(speech,/speech speed/i)
 assert.doesNotMatch(server,/AZURE_SPEECH_KEY|\/api\/speech\/token/)
 assert.equal(pkg.dependencies['kokoro-js'],'^1.2.1')
 assert.equal(pkg.dependencies['microsoft-cognitiveservices-speech-sdk'],undefined)
 assert.match(speech,/new Audio\(/)
})
test('agent council includes specialist reviewers and an independent safety gate',()=>{
 for(const role of ['maintenance_triage','budget_steward','accessibility_reviewer','home_project_planner','safety_gate'])assert.match(agents,new RegExp(role))
 assert.match(agents,/approvedInsightIndices/)
 assert.match(agents,/explicitly accepts a suggestion/)
})
test('agent orchestration is visualized with React Flow',()=>{
 assert.match(flow,/ReactFlow/)
 assert.match(flow,/animated:true/)
 assert.match(pkg.dependencies['@xyflow/react'],/^\^12\./)
})
test('room journal supports rich text editing and local updates',()=>{
 assert.match(editor,/useEditor/)
 assert.match(editor,/StarterKit/)
 assert.match(editor,/onChange\(editor.getHTML\(\)\)/)
 assert.match(pkg.dependencies['@tiptap/react'],/^\^3\./)
})
