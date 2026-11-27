import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { evaluateHomeRules, assessmentCompleteness, getMissingQuestions, getDoNotList } from './src/domain.js'
import { runAssessmentAgents } from './src/agents.js'

dotenv.config()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT || 3000)
const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b'
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(x=>x.trim()).filter(Boolean)

app.disable('x-powered-by')
app.use(cors({origin: allowedOrigins.length ? allowedOrigins : true}))
app.use(express.json({limit:'32kb',strict:true}))
app.use((req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');next()})

// Lightweight per-process abuse guard. Use a managed gateway for multi-instance production.
const hits = new Map()
app.use('/api', (req,res,next)=>{
  const key=req.ip || 'unknown', now=Date.now(), entry=hits.get(key) || {count:0,start:now}
  if(now-entry.start>60000){entry.count=0;entry.start=now}
  entry.count++;hits.set(key,entry)
  if(entry.count>90)return res.status(429).json({error:'Too many requests. Please wait a moment and retry.'})
  next()
})

const PROFILE_KEYS = new Set(['city','propertyType','stage','tradition','northKnown','entranceDirection','kitchenLocation','bedSeesDoor','centreUse','ventilation','daylight','climateConcerns','clutter','goals','constraints','freeText'])
const TOOL_REGISTRY = {
  evaluate_home_rules: profile => evaluateHomeRules(profile),
  get_missing_questions: profile => getMissingQuestions(profile),
  get_safety_constraints: () => getDoNotList(),
  calculate_completeness: profile => assessmentCompleteness(profile),
}
function validateProfile(input){
  if(!input || typeof input!=='object' || Array.isArray(input))return 'A valid profile object is required.'
  const unknown=Object.keys(input).filter(k=>!PROFILE_KEYS.has(k))
  if(unknown.length)return `Unsupported profile fields: ${unknown.join(', ')}`
  for(const key of ['city','propertyType','stage','tradition','northKnown','entranceDirection','kitchenLocation','bedSeesDoor','centreUse','ventilation','daylight','freeText']){
    if(input[key]!==undefined && typeof input[key]!=='string')return `${key} must be text.`
  }
  for(const key of ['climateConcerns','clutter','goals','constraints']){
    if(input[key]!==undefined && (!Array.isArray(input[key]) || input[key].length>30 || input[key].some(v=>typeof v!=='string')))return `${key} must be a short list of text values.`
  }
  if(input.freeText && input.freeText.length>1200)return 'Additional notes are limited to 1,200 characters.'
  return null
}

app.get('/api/health',(_req,res)=>res.json({
  status:'ok',service:'harmonious-home',version:'2.0.0',
  groqConfigured:Boolean(GROQ_API_KEY),model:GROQ_MODEL,
  mode:GROQ_API_KEY?'deterministic rules + three bounded AI roles':'deterministic rules-only',
  tools:Object.keys(TOOL_REGISTRY),
}))
app.get('/api/tools',(_req,res)=>res.json({tools:[
  {name:'evaluate_home_rules',description:'Evaluate deterministic domain rules against a profile.'},
  {name:'get_missing_questions',description:'Identify missing context that limits assessment confidence.'},
  {name:'get_safety_constraints',description:'Return non-negotiable safety constraints.'},
  {name:'calculate_completeness',description:'Calculate profile completeness from supported fields.'},
]}))
app.post('/api/tools/:tool', (req,res)=>{
  const fn=TOOL_REGISTRY[req.params.tool]
  if(!fn)return res.status(404).json({error:'Unknown tool'})
  const profile=req.body?.profile || {}
  const validation=validateProfile(profile)
  if(validation)return res.status(400).json({error:validation})
  try{return res.json({tool:req.params.tool,result:fn(profile)})}
  catch{return res.status(500).json({error:'Tool execution failed'})}
})
app.post('/api/assess',async(req,res)=>{
  const profile=req.body?.profile
  const validation=validateProfile(profile)
  if(validation)return res.status(400).json({error:validation})
  try{
    // Agent tool calls: deterministic engine, missing-context analyser and safety guard.
    const findings=TOOL_REGISTRY.evaluate_home_rules(profile)
    const completeness=TOOL_REGISTRY.calculate_completeness(profile)
    const missing=TOOL_REGISTRY.get_missing_questions(profile)
    const doNot=TOOL_REGISTRY.get_safety_constraints()
    let agentResult=null,agentError=null,mode='deterministic rules-only'
    if(GROQ_API_KEY){
      try{
        agentResult=await runAssessmentAgents({profile,findings,missing,model:GROQ_MODEL,apiKey:GROQ_API_KEY})
        mode='deterministic rules + bounded AI agents'
      }catch(err){agentError='AI synthesis unavailable; deterministic results retained.';console.error('Agent pipeline error:',err.message)}
    }
    res.json({
      mode,completeness,missing,doNot,findings,
      recommendations:agentResult?.recommendations||findings,
      headline:agentResult?.headline||'Your home assessment',
      overallNote:agentResult?.overallNote||'A first-pass review based on deterministic rule matches.',
      agentMeta:agentResult?.meta||{agentRuns:[],toolCalls:Object.keys(TOOL_REGISTRY)},
      agentError,
      limitations:[
        'Illustrative rules and agent prompts only — not expert-certified.',
        'No full classical Flying Stars / Luopan calculation.',
        'Safety, ventilation and accessibility always outrank symbolic preference.',
        'Verify significant building changes with qualified professionals.',
        'AI language synthesis cannot create or override deterministic findings.',
      ],
    })
  }catch(err){console.error('Assessment error:',err);res.status(500).json({error:'Assessment could not be completed.'})}
})

const distPath=path.join(__dirname,'dist')
app.use(express.static(distPath,{maxAge:process.env.NODE_ENV==='production'?'1h':0}))
app.get('*',(req,res,next)=>{if(req.path.startsWith('/api'))return next();res.sendFile(path.join(distPath,'index.html'),err=>{if(err)next(err)})})
app.use((err,_req,res,_next)=>{if(err.type==='entity.too.large')return res.status(413).json({error:'Request body is too large.'});console.error(err);res.status(500).json({error:'Unexpected server error.'})})
app.listen(PORT,'0.0.0.0',()=>console.log(`Harmonious Home listening on ${PORT} · ${GROQ_API_KEY?'AI configured':'rules-only mode'}`))
