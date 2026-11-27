import React, { useMemo } from 'react'
import { Background, Controls, Handle, MiniMap, Position, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const LABELS={intake:'Workspace context',planner:'Project planner',care:'Maintenance triage',budget:'Budget steward',access:'Accessibility reviewer',safety:'Safety gate',approval:'Your approval'}
function AgentNode({data}){return <div className={`agent-flow-node ${data.active?'active':''}`}><Handle type="target" position={Position.Left}/><span>{data.kicker}</span><b>{data.label}</b><small>{data.description}</small><Handle type="source" position={Position.Right}/></div>}
const nodeTypes={agent:AgentNode}
export default function AgentFlow({runs=[]}){
 const statusById=Object.fromEntries(runs.map(run=>[run.name,run.status]))
 const nodes=useMemo(()=>[
  {id:'intake',type:'agent',position:{x:0,y:130},data:{label:LABELS.intake,kicker:'INPUT',description:'Only the records you supplied'}},
  {id:'planner',type:'agent',position:{x:230,y:0},data:{label:LABELS.planner,kicker:'AGENT 01',description:statusById.home_project_planner||'Low-risk project proposals',active:statusById.home_project_planner==='completed'}},
  {id:'care',type:'agent',position:{x:230,y:110},data:{label:LABELS.care,kicker:'AGENT 02',description:statusById.maintenance_triage||'Due dates and care priorities',active:statusById.maintenance_triage==='completed'}},
  {id:'budget',type:'agent',position:{x:230,y:220},data:{label:LABELS.budget,kicker:'AGENT 03',description:statusById.budget_steward||'Recorded budget and spend only',active:statusById.budget_steward==='completed'}},
  {id:'access',type:'agent',position:{x:230,y:330},data:{label:LABELS.access,kicker:'AGENT 04',description:statusById.accessibility_reviewer||'Access and usability prompts',active:statusById.accessibility_reviewer==='completed'}},
  {id:'safety',type:'agent',position:{x:490,y:155},data:{label:LABELS.safety,kicker:'REVIEW',description:statusById.safety_gate||'Reject unsafe or unsupported ideas',active:statusById.safety_gate==='completed'}},
  {id:'approval',type:'agent',position:{x:730,y:155},data:{label:LABELS.approval,kicker:'HUMAN IN THE LOOP',description:'Nothing is saved without approval'}},
 ],[runs])
 const edges=useMemo(()=>[
  {id:'e1',source:'intake',target:'planner',animated:true},{id:'e2',source:'intake',target:'care',animated:true},{id:'e3',source:'intake',target:'budget',animated:true},{id:'e4',source:'intake',target:'access',animated:true},
  ...['planner','care','budget','access'].map(id=>({id:`${id}-safety`,source:id,target:'safety',animated:true})),{id:'safety-approval',source:'safety',target:'approval',animated:true}
 ],[])
 return <div className="agent-flow-shell"><div className="agent-flow-heading"><b>Agent orchestration map</b><small>{runs.length?`${runs.filter(x=>x.status==='completed').length} specialist checks completed`:'Workflow preview · awaiting a run'}</small></div><div className="agent-flow-canvas"><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{padding:.16}} minZoom={.35} maxZoom={1.25} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} proOptions={{hideAttribution:true}}><Background color="#dce5d8" gap={18}/><MiniMap pannable zoomable/><Controls showInteractive={false}/></ReactFlow></div></div>
}
