import React, { useEffect, useMemo, useRef, useState } from 'react'
import { buildInsights } from './workspaceInsights.js'
import { AnimatePresence, motion } from 'motion/react'
import { Bot, Command, Grip, Maximize2, Minimize2, X, Plus, Sparkles, ClipboardList, Activity, ArrowRight, Keyboard, WandSparkles } from 'lucide-react'

const PANELS = [
  { id:'copilot', title:'Home copilot', icon:Bot, width:390 },
  { id:'capture', title:'Quick capture', icon:ClipboardList, width:350 },
  { id:'pulse', title:'Workspace pulse', icon:Activity, width:350 },
]



export default function WorkspaceHub({ workspace, setWorkspace, setPage, notify }) {
  const [open,setOpen]=useState([])
  const [minimized,setMinimized]=useState([])
  const [maximized,setMaximized]=useState([])
  const [commandOpen,setCommandOpen]=useState(false)
  const [query,setQuery]=useState('')
  const [capture,setCapture]=useState('')
  const [dropHover,setDropHover]=useState(false)
  const [agentBusy,setAgentBusy]=useState(false)
  const [agentResult,setAgentResult]=useState(null)
  const [agentError,setAgentError]=useState('')
  const [positions,setPositions]=useState({})
  const drag=useRef(null)
  const insights=useMemo(()=>buildInsights(workspace),[workspace])
  const commands=useMemo(()=>[
    {label:'Go to overview',page:'overview',keywords:'home dashboard'},
    {label:'Start home assessment',page:'assessment',keywords:'assessment review'},
    {label:'Open room plan studio',page:'layout',keywords:'floor plan room dimensions'},
    {label:'Open projects',page:'projects',keywords:'project board kanban'},
    {label:'Open maintenance',page:'maintenance',keywords:'tasks schedule recurring'},
    {label:'Open finance',page:'finance',keywords:'budget spending invoices vendors'},
    {label:'Open room journal',page:'rooms',keywords:'notes diary'},
    {label:'Open settings and backup',page:'settings',keywords:'export restore data'},
  ],[])
  useEffect(()=>{const key=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setCommandOpen(v=>!v)}if(e.key==='Escape'){setCommandOpen(false)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[])
  useEffect(()=>{if(!drag.current)return;const move=e=>{const d=drag.current;if(!d)return;setPositions(p=>({...p,[d.id]:{x:Math.max(8,Math.min(window.innerWidth-180,d.x+e.clientX-d.startX)),y:Math.max(8,Math.min(window.innerHeight-100,d.y+e.clientY-d.startY))}}))};const up=()=>{drag.current=null};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)}},[])
  const show=id=>{setOpen(v=>v.includes(id)?v:[...v,id]);setMinimized(v=>v.filter(x=>x!==id));setCommandOpen(false)}
  const close=id=>{setOpen(v=>v.filter(x=>x!==id));setMinimized(v=>v.filter(x=>x!==id));setMaximized(v=>v.filter(x=>x!==id))}
  const minimize=id=>setMinimized(v=>v.includes(id)?v:[...v,id])
  const maximize=id=>setMaximized(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])
  async function runPlanningAgents(){setAgentBusy(true);setAgentError('');setAgentResult(null);try{const response=await fetch('/api/assist/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({intent:'general home improvement and care planning',workspace:{projects:workspace.projects||[],maintenance:workspace.maintenance||[],budget:workspace.budget||0,finance:workspace.finance||null}})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Planning agents unavailable');setAgentResult(data)}catch(error){setAgentError(error.message)}finally{setAgentBusy(false)}}
  function acceptSuggestion(suggestion){setWorkspace(w=>({...w,projects:[{id:crypto.randomUUID(),title:suggestion.title,room:suggestion.room||'Whole home',priority:suggestion.priority||'medium',estimate:'',status:'planned',aiSuggested:true},...(Array.isArray(w.projects)?w.projects:[])]}));notify('Draft idea added to your project board');close('copilot');setPage('projects')}
  function saveCapture(){const value=capture.trim();if(!value)return;setWorkspace(w=>({...w,quickNotes:[{id:Date.now(),note:value,createdAt:new Date().toISOString()},...(Array.isArray(w.quickNotes)?w.quickNotes:[])]}));setCapture('');notify('Note saved to your room journal workspace')}
  async function handleDrop(e){e.preventDefault();setDropHover(false);const files=[...(e.dataTransfer?.files||[])];if(!files.length)return;const file=files[0];if(file.size>1500000){notify('File is larger than the 1.5 MB quick-capture limit');return}if(!/\.(txt|md|csv)$/i.test(file.name)){notify('Quick capture accepts text, Markdown and CSV files only');return}try{const content=(await file.text()).slice(0,12000);setCapture(v=>(v?`${v}\n\n`:'')+`[${file.name}]\n${content}`);show('capture');notify(`Loaded ${file.name} into quick capture`)}catch{notify('Could not read that file')}}
  const filtered=commands.filter(c=>(c.label+' '+c.keywords).toLowerCase().includes(query.toLowerCase()))
  return <>
    <div className="workspace-hub-launchers" aria-label="Workspace tools">
      <button type="button" onClick={()=>setCommandOpen(true)} title="Command palette (Ctrl or Cmd + K)"><Command size={16}/> <span>Quick actions</span><kbd>⌘ K</kbd></button>
      <button type="button" onClick={()=>show('copilot')}><Sparkles size={16}/> <span>Copilot</span></button>
      <button type="button" onClick={()=>show('capture')}><Plus size={16}/> <span>Quick capture</span></button><button type="button" onClick={()=>show('pulse')}><Activity size={16}/> <span>Pulse</span></button>
    </div>
    <div className="workspace-dock" aria-label="Minimized workspace panels">
      {minimized.map(id=>{const p=PANELS.find(x=>x.id===id);return <button key={id} onClick={()=>setMinimized(v=>v.filter(x=>x!==id))}><p.icon size={14}/>{p.title}</button>})}
    </div>
    <AnimatePresence>
      {open.filter(id=>!minimized.includes(id)).map((id,windowIndex)=>{const p=PANELS.find(x=>x.id===id);const Icon=p.icon;const pos=positions[id];const isMax=maximized.includes(id);return <motion.section key={id} className={`workspace-window ${isMax?'is-maximized':''}`} style={!isMax?(pos?{left:pos.x,top:pos.y,right:'auto',bottom:'auto'}:{right:22+windowIndex*18,bottom:76+windowIndex*18}):undefined} initial={{opacity:0,scale:.96,y:12}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.96,y:8}} transition={{duration:.18}} aria-label={p.title}>
        <header className="workspace-window-head" onPointerDown={e=>{if(isMax||e.target.closest('button'))return;const r=e.currentTarget.parentElement.getBoundingClientRect();drag.current={id,x:r.left,y:r.top,startX:e.clientX,startY:e.clientY};e.currentTarget.setPointerCapture?.(e.pointerId)}}><div className="window-title"><Grip size={14}/><Icon size={16}/><b>{p.title}</b></div><div className="window-controls"><button title="Minimize" aria-label="Minimize panel" onClick={()=>minimize(id)}><Minimize2 size={14}/></button><button title={isMax?'Restore':'Maximize'} aria-label={isMax?'Restore panel':'Maximize panel'} onClick={()=>maximize(id)}><Maximize2 size={14}/></button><button title="Close" aria-label="Close panel" onClick={()=>close(id)}><X size={15}/></button></div></header>
        <div className="workspace-window-body">
          {id==='copilot'&&<><div className="copilot-intro"><span className="copilot-orb"><WandSparkles size={21}/></span><div><b>Small, grounded next steps</b><p>Workspace copilot · rule-based planning</p></div></div><div className="agent-scope-note">These helpers inspect the data you entered. They do not certify building safety, provide professional advice, or change records without your action.</div>{insights.insights.map((item,i)=><article className={`copilot-insight ${item.tone}`} key={i}><div><b>{item.title}</b><p>{item.detail}</p></div><button onClick={()=>{setPage(item.action);close('copilot')}}>Review <ArrowRight size={13}/></button></article>)}<div className="agent-workflow-launch"><div><b>AI planning workflow</b><small>Planner agent → independent safety gate → your approval</small></div><button className="btn btn-dark" disabled={agentBusy} onClick={runPlanningAgents}>{agentBusy?'Running agents…':'Run planning agents'} <Sparkles size={14}/></button>{agentError&&<p className="agent-error">{agentError}</p>}{agentResult&&<div className="agent-result"><b>{agentResult.summary}</b><small>{agentResult.agents?.map(a=>a.name.replaceAll('_',' ')).join(' → ')} · {agentResult.suggestions?.length||0} approved draft ideas</small>{(agentResult.suggestions||[]).map((suggestion,i)=><article key={i}><div><b>{suggestion.title}</b><p>{suggestion.room} · {suggestion.priority} priority</p><small>{suggestion.reason}</small></div><button onClick={()=>acceptSuggestion(suggestion)}>Add to projects</button></article>)}<p>{agentResult.disclaimer}</p></div>}</div><div className="agent-tiles"><button onClick={()=>setPage('assessment')}><Bot size={15}/><b>Assessment agents</b><small>Rule checks + optional AI synthesis</small></button><button onClick={()=>setPage('maintenance')}><Activity size={15}/><b>Care planner</b><small>Due dates and recurring tasks</small></button><button onClick={()=>setPage('finance')}><Sparkles size={15}/><b>Budget reviewer</b><small>Committed estimates and invoices</small></button></div></>}
          {id==='capture'&&<><p className="panel-copy">Capture a thought before it gets lost. Save it into the workspace journal.</p><textarea value={capture} onChange={e=>setCapture(e.target.value)} placeholder="e.g. Measure the bedroom window before choosing blinds…" rows={5}/><div className={`capture-drop ${dropHover?'is-over':''}`} onDragOver={e=>{e.preventDefault();setDropHover(true)}} onDragLeave={()=>setDropHover(false)} onDrop={handleDrop}><Plus size={18}/><b>Drop a text, Markdown or CSV file here</b><small>Maximum 1.5 MB · text is read locally and not uploaded</small></div><button className="btn btn-dark" disabled={!capture.trim()} onClick={saveCapture}>Save quick note</button></>}
          {id==='pulse'&&<><div className="pulse-grid"><div><b>{insights.stats.projects}</b><small>Projects</small></div><div><b>{insights.stats.active}</b><small>In progress</small></div><div><b>{insights.stats.maintenance}</b><small>Open care tasks</small></div><div><b>{insights.stats.overdue}</b><small>Overdue</small></div></div><div className="pulse-budget"><span>Project estimates</span><b>{insights.stats.committed.toLocaleString()}</b>{insights.stats.budget>0&&<small>Working budget: {insights.stats.budget.toLocaleString()}</small>}</div><button className="btn btn-light" onClick={()=>{close('pulse');setPage('projects')}}>Review workspace <ArrowRight size={14}/></button><p className="panel-copy">Counts are based on your current local workspace snapshot. Cloud sync status is shown in the relevant module.</p></>}
        </div>
      </motion.section>})}
    </AnimatePresence>
    <AnimatePresence>{commandOpen&&<motion.div className="command-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)setCommandOpen(false)}}><motion.div className="command-dialog" initial={{y:-12,scale:.98}} animate={{y:0,scale:1}} exit={{y:-8,scale:.98}} role="dialog" aria-modal="true" aria-label="Quick actions"><div className="command-search"><Command size={18}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search pages and actions…" onKeyDown={e=>{if(e.key==='Enter'&&filtered[0]){setPage(filtered[0].page);setCommandOpen(false)}}}/><kbd>ESC</kbd></div><div className="command-results">{filtered.map(c=><button key={c.page} onClick={()=>{setPage(c.page);setCommandOpen(false)}}><span>{c.label}</span><ArrowRight size={14}/></button>)}{!filtered.length&&<p>No matching actions. Try “maintenance” or “finance”.</p>}</div><footer><Keyboard size={13}/> Navigate by typing · Enter to open · Escape to close</footer></motion.div></motion.div>}</AnimatePresence>
  </>
}
