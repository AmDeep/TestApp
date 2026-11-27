import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const speech=readFileSync(new URL('../src/AzureNarrator.jsx',import.meta.url),'utf8')
const server=readFileSync(new URL('../server.js',import.meta.url),'utf8')
const agents=readFileSync(new URL('../src/agents.js',import.meta.url),'utf8')
const flow=readFileSync(new URL('../src/AgentFlow.jsx',import.meta.url),'utf8')
const editor=readFileSync(new URL('../src/RichJournalEditor.jsx',import.meta.url),'utf8')
const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'))

test('Azure Speech uses short-lived server-issued tokens and keeps resource keys server-side',()=>{
 assert.match(server,/\/api\/speech\/token/)
 assert.match(server,/AZURE_SPEECH_KEY/)
 assert.match(server,/issueToken/)
 assert.match(server,/auth,membership,speechLimiter/)
 assert.match(speech,/fromAuthorizationToken/)
 assert.doesNotMatch(speech,/AZURE_SPEECH_KEY/)
 assert.equal(pkg.dependencies['microsoft-cognitiveservices-speech-sdk'],'^1.53.0')
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
