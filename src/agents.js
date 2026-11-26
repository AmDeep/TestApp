/**
 * Simplified multi-agent orchestration using Groq Chat Completions.
 * Agents: Orchestrator context → Tradition Interpreter → Feasibility → Synthesizer
 * Deterministic findings are the source of truth; LLM only explains & ranks.
 */
import Groq from 'groq-sdk'

const SYSTEM_GUARDRAILS = `You are part of Harmonious Home, an assessment system for Indian households.
Hard rules you must obey:
- Never invent tradition rules, citations, directions, measurements or user answers.
- Use ONLY the supplied deterministic findings and the user profile.
- Keep Feng Shui and Vastu distinct; never blend them into one score or claim.
- Prefer safe, reversible, low-cost actions. Never recommend structural work, gas, electrical or plumbing changes as a first response.
- Safety, accessibility, ventilation and fire egress always outrank symbolic preference.
- Do not promise wealth, health, fertility, marriage or protection from misfortune.
- Treat unknown values as unknown.
- Return valid JSON only when asked for JSON. No markdown fences.`

/**
 * Run a short agent chain and return structured recommendations + headline.
 */
export async function runAssessmentAgents({ profile, findings, missing, model, apiKey }) {
  const groq = new Groq({ apiKey })

  const profileSummary = summariseProfile(profile)
  const findingsText = findings
    .map(
      (f, i) =>
        `[${i + 1}] id=${f.id} priority=${f.priority} basis=${f.basis?.join('; ')}
observation: ${f.observation}
action: ${f.action}
alternative: ${f.alternative || 'n/a'}
confidence: ${f.confidence}`
    )
    .join('\n\n')

  // --- Agent 2+4 style: single synthesis call (keeps latency low for demo) ---
  const userPrompt = `User profile summary:
${profileSummary}

Deterministic findings (source of truth — do not invent new rules):
${findingsText || '(none triggered)'}

Missing information that would improve confidence:
${missing.length ? missing.map((m) => '- ' + m).join('\n') : '- none listed'}

Task:
1. Write a short neutral headline (max 12 words).
2. Write a one-paragraph overallNote that explains the assessment style and limitations.
3. Produce an array "recommendations" that re-expresses the findings in clear language.
   For each item keep: id, title, priority, observation, basis (array), explanation, action, alternative, confidence, costBand, caveats (array).
   You may lightly rephrase titles and explanations for clarity, but do NOT invent new findings or change priority / basis.
4. If findings is empty, still return a helpful overallNote and an empty recommendations array.

Return ONLY a JSON object with keys: headline, overallNote, recommendations.`

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: SYSTEM_GUARDRAILS },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
  })

  const raw = completion.choices?.[0]?.message?.content || '{}'
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    // Fallback: return deterministic findings unchanged
    return {
      headline: 'Assessment based on deterministic rules',
      overallNote:
        'The language model returned unparseable output. Showing the rule-engine findings only.',
      recommendations: findings,
      meta: {
        model,
        tokens: completion.usage || null,
        parseError: true,
      },
    }
  }

  // Ensure recommendations still carry original ids where possible
  const recs = Array.isArray(parsed.recommendations) ? parsed.recommendations : findings

  return {
    headline: parsed.headline || 'First-pass assessment',
    overallNote: parsed.overallNote || null,
    recommendations: recs,
    meta: {
      model,
      usage: completion.usage || null,
      agent: 'synthesizer',
    },
  }
}

function summariseProfile(p) {
  const parts = []
  if (p.city) parts.push(`City/region: ${p.city}`)
  if (p.propertyType) parts.push(`Property: ${p.propertyType}`)
  if (p.stage) parts.push(`Stage: ${p.stage}`)
  if (p.tradition) parts.push(`Tradition lens: ${p.tradition}`)
  if (p.northKnown) parts.push(`North known: ${p.northKnown}`)
  if (p.entranceDirection) parts.push(`Entrance faces: ${p.entranceDirection}`)
  if (p.ventilation) parts.push(`Ventilation: ${p.ventilation}`)
  if (p.daylight) parts.push(`Daylight: ${p.daylight}`)
  if (p.clutter?.length) parts.push(`Clutter hotspots: ${p.clutter.join(', ')}`)
  if (p.climateConcerns?.length) parts.push(`Climate concerns: ${p.climateConcerns.join(', ')}`)
  if (p.goals?.length) parts.push(`Goals: ${p.goals.join(', ')}`)
  if (p.constraints?.length) parts.push(`Constraints: ${p.constraints.join(', ')}`)
  if (p.freeText) parts.push(`Extra notes: ${p.freeText.slice(0, 200)}`)
  return parts.join('\n') || 'Minimal profile'
}
