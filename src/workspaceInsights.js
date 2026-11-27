export function buildInsights(workspace={}) {
  const projects=Array.isArray(workspace.projects)?workspace.projects:[]
  const maintenance=Array.isArray(workspace.maintenance)?workspace.maintenance:[]
  const today=new Date().toISOString().slice(0,10)
  const open=maintenance.filter(x=>!x.done)
  const overdue=open.filter(x=>String(x.due||'') && String(x.due)<today)
  const upcoming=open.filter(x=>String(x.due||'')>=today).sort((a,b)=>String(a.due).localeCompare(String(b.due)))
  const active=projects.filter(x=>x.status==='doing')
  const planned=projects.filter(x=>!x.status||x.status==='planned')
  const committed=projects.reduce((s,x)=>s+(Number(x.estimate)||0),0)
  const insights=[]
  if(overdue.length) insights.push({tone:'warning',title:`${overdue.length} maintenance ${overdue.length===1?'task is':'tasks are'} overdue`,detail:'Review due dates and decide whether to reschedule or complete them.',action:'maintenance'})
  if(upcoming.length) insights.push({tone:'calm',title:`Next maintenance: ${upcoming[0].title||'Home task'}`,detail:`Due ${upcoming[0].due||'soon'}. Check supplies and access before the day.`,action:'maintenance'})
  if(planned.length) insights.push({tone:'calm',title:`${planned.length} projects are waiting to start`,detail:'Choose one small, low-risk task and confirm its scope before scheduling.',action:'projects'})
  if(active.length>3) insights.push({tone:'warning',title:`${active.length} projects are in progress`,detail:'Consider finishing or pausing work before starting more projects.',action:'projects'})
  if(workspace.budget>0 && committed>Number(workspace.budget)) insights.push({tone:'warning',title:'Project estimates exceed the working budget',detail:'Review estimates and committed work. Estimates are not quotes.',action:'budget'})
  if(!insights.length) insights.push({tone:'good',title:'Your workspace looks clear',detail:'Add a project or maintenance task to turn observations into a manageable plan.',action:'projects'})
  return {insights,stats:{projects:projects.length,active:active.length,maintenance:open.length,overdue:overdue.length,committed,budget:Number(workspace.budget)||0}}
}
