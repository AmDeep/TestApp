/**
 * Harmonious Home — Express API + static frontend
 * Groq multi-agent style assessment (simplified)
 */
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
const PORT = process.env.PORT || 3000
const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b'

app.use(cors())
app.use(express.json({ limit: '32kb' }))

// Health
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    groqConfigured: Boolean(GROQ_API_KEY),
    model: GROQ_MODEL,
    mode: GROQ_API_KEY ? 'rules + groq agents' : 'rules-only (set GROQ_API_KEY)',
  })
})

// Assess endpoint
app.post('/api/assess', async (req, res) => {
  try {
    const profile = req.body?.profile
    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({ error: 'Missing profile object' })
    }

    // Size guard
    const raw = JSON.stringify(profile)
    if (raw.length > 16000) {
      return res.status(400).json({ error: 'Profile too large' })
    }

    // Deterministic layer always runs
    const findings = evaluateHomeRules(profile)
    const completeness = assessmentCompleteness(profile)
    const missing = getMissingQuestions(profile)
    const doNot = getDoNotList()

    let agentResult = null
    let agentError = null
    let mode = 'rules-only'

    if (GROQ_API_KEY) {
      try {
        agentResult = await runAssessmentAgents({
          profile,
          findings,
          missing,
          model: GROQ_MODEL,
          apiKey: GROQ_API_KEY,
        })
        mode = 'rules + groq agents'
      } catch (err) {
        agentError = err.message || String(err)
        console.error('Groq agent error:', agentError)
      }
    }

    res.json({
      mode,
      completeness,
      missing,
      doNot,
      findings, // deterministic
      recommendations: agentResult?.recommendations || findings,
      headline: agentResult?.headline || 'First-pass assessment from deterministic rules',
      overallNote: agentResult?.overallNote || null,
      agentMeta: agentResult?.meta || null,
      agentError: agentError || null,
      limitations: [
        'Illustrative rules and agent prompts only — not expert-certified.',
        'No full classical Flying Stars / Luopan calculation.',
        'Safety, ventilation and accessibility always outrank symbolic preference.',
        'Verify any significant change with qualified professionals.',
      ],
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Assessment failed', detail: err.message })
  }
})

// Production: serve Vite build
const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next()
  })
})

app.listen(PORT, () => {
  console.log(`Harmonious Home listening on http://localhost:${PORT}`)
  console.log(`Groq: ${GROQ_API_KEY ? 'configured (' + GROQ_MODEL + ')' : 'NOT SET — rules-only mode'}`)
})
