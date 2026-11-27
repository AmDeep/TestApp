import Groq from 'groq-sdk'

const GUARDRAILS = `You are an assistant inside Harmonious Home. Treat supplied deterministic findings as the only source of recommendations. Never create rules, citations, measurements, directions, or user facts. Keep Feng Shui, Vastu, and practical building guidance distinct. Unknown means unknown. Safety, accessibility, ventilation and fire egress outrank symbolic preferences. Never promise wealth, health, fertility, relationships or protection from misfortune. Never recommend structural, gas, electrical or plumbing changes as first-line actions. Return JSON only.`

const PROFILE_KEYS = ['city','propertyType','stage','tradition','northKnown','entranceDirection','kitchenLocation','bedSeesDoor','centreUse','ventilation','daylight','climateConcerns','clutter','goals','constraints','freeText']

function compactProfile(p) {
  return Object.fromEntries(PROFILE_KEYS.filter(k => p[k] !== undefined).map(k => [k, p[k]]))
}
function safeRecommendations(parsed, findings) {
  const allowed = new Map(findings.map(f => [f.id, f]))
  if (!Array.isArray(parsed?.recommendations)) return findings
  return parsed.recommendations.flatMap(candidate => {
    const original = allowed.get(candidate?.id)
    if (!original) return []
    // AI may clarify language, but immutable fields remain deterministic.
    return [{
      ...original,
      title: typeof candidate.title === 'string' ? candidate.title.slice(0,180) : original.title,
      explanation: typeof candidate.explanation === 'string' ? candidate.explanation.slice(0,1200) : undefined,
      action: original.action,
    }]
  }).concat(findings.filter(f => !parsed.recommendations.some(x => x?.id === f.id)))
}
async function completion(groq, model, messages, max_tokens=1200) {
  const res = await groq.chat.completions.create({
    model, messages, temperature:0.2, max_tokens,
    response_format:{type:'json_object'},
  })
  return JSON.parse(res.choices?.[0]?.message?.content || '{}')
}

/**
 * Three bounded roles. Deterministic findings remain authoritative and are
 * reattached after every LLM step to prevent the model changing the rules.
 */
export async function runAssessmentAgents({profile,findings,missing,model,apiKey}) {
  const groq = new Groq({apiKey, timeout:25000, maxRetries:1})
  const source = JSON.stringify({profile:compactProfile(profile),findings,missing})
  const started = Date.now()
  let context = {observations:[], constraints:[], focus:'Explain only the supplied observations.'}
  const agentRuns = []

  try {
    const interpreted = await completion(groq,model,[
      {role:'system',content:GUARDRAILS+' You are the Tradition Interpreter. Organise the supplied findings by their stated tradition. Do not add findings. Return JSON with keys observations (array of {id, plainLanguage}), confidenceNote.'},
      {role:'user',content:source},
    ],900)
    context = {...context, observations:Array.isArray(interpreted.observations)?interpreted.observations:[], confidenceNote:interpreted.confidenceNote}
    agentRuns.push({agent:'tradition_interpreter',status:'completed'})
  } catch { agentRuns.push({agent:'tradition_interpreter',status:'fallback'}) }

  try {
    const feasible = await completion(groq,model,[
      {role:'system',content:GUARDRAILS+' You are the Feasibility & Safety Agent. Review only the supplied findings and profile constraints. You may flag conflicts, but may not invent recommendations or change actions. Return JSON with keys safetyFlags (array of strings), prioritisationNote.'},
      {role:'user',content:source+'\nInterpreter context: '+JSON.stringify(context)},
    ],700)
    context = {...context, safetyFlags:Array.isArray(feasible.safetyFlags)?feasible.safetyFlags:[], prioritisationNote:feasible.prioritisationNote}
    agentRuns.push({agent:'feasibility_safety',status:'completed'})
  } catch { agentRuns.push({agent:'feasibility_safety',status:'fallback'}) }

  try {
    const synthesized = await completion(groq,model,[
      {role:'system',content:GUARDRAILS+' You are the Report Synthesizer. Return JSON keys headline, overallNote, recommendations. Rephrase supplied finding titles and explain them plainly. Do not change ids, priority, basis, action, caveats or confidence. Do not drop findings.'},
      {role:'user',content:source+'\nAgent context: '+JSON.stringify(context)},
    ],1600)
    agentRuns.push({agent:'report_synthesizer',status:'completed'})
    return {
      headline: typeof synthesized.headline==='string'?synthesized.headline.slice(0,120):'Your home assessment',
      overallNote: typeof synthesized.overallNote==='string'?synthesized.overallNote.slice(0,1400):'A first-pass review based on the answers and deterministic rule matches.',
      recommendations:safeRecommendations(synthesized,findings),
      meta:{model,agentRuns,elapsedMs:Date.now()-started,toolCalls:['evaluate_home_rules','get_missing_questions','get_safety_constraints']},
    }
  } catch (error) {
    return {
      headline:'Assessment based on deterministic rules',
      overallNote:'The report agent could not complete synthesis. The deterministic findings are shown without AI modification.',
      recommendations:findings,
      meta:{model,agentRuns,elapsedMs:Date.now()-started,fallback:true,error:error.message},
    }
  }
}
