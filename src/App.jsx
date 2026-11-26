import React, { useState, useMemo } from 'react'
import {
  STEPS,
  PROPERTY_TYPES,
  TRADITIONS,
  GOALS,
  DIRECTIONS,
  evaluateHomeRules,
  assessmentCompleteness,
  getMissingQuestions,
  getDoNotList,
} from './domain.js'

const initialProfile = {
  city: '',
  propertyType: '',
  stage: 'Occupied',
  tradition: '',
  northKnown: '',
  entranceDirection: '',
  kitchenLocation: '',
  bedSeesDoor: '',
  centreUse: '',
  ventilation: '',
  daylight: '',
  climateConcerns: [],
  clutter: [],
  goals: [],
  constraints: [],
  freeText: '',
}

function ChipGroup({ options, value = [], onChange, multi = true }) {
  const selected = multi ? value : value ? [value] : []
  const toggle = (opt) => {
    if (multi) {
      const next = selected.includes(opt)
        ? selected.filter((x) => x !== opt)
        : [...selected, opt]
      onChange(next)
    } else {
      onChange(opt === value ? '' : opt)
    }
  }
  return (
    <div className="chip-group">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`chip ${selected.includes(opt) ? 'selected' : ''}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(-1) // -1 = landing
  const [profile, setProfile] = useState(initialProfile)
  const [assessed, setAssessed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiResult, setApiResult] = useState(null)
  const [apiError, setApiError] = useState(null)

  const update = (key, val) => setProfile((p) => ({ ...p, [key]: val }))

  // Local fallback always available
  const localFindings = useMemo(
    () => (assessed ? evaluateHomeRules(profile) : []),
    [assessed, profile]
  )
  const completeness = useMemo(() => assessmentCompleteness(profile), [profile])
  const missing = useMemo(() => getMissingQuestions(profile), [profile])
  const doNot = getDoNotList()

  const findings = apiResult?.recommendations || localFindings
  const headline = apiResult?.headline || 'First-pass assessment from deterministic rules'
  const overallNote = apiResult?.overallNote
  const mode = apiResult?.mode || (assessed ? 'rules-only (local)' : null)

  const runAssessment = async () => {
    setLoading(true)
    setApiError(null)
    setApiResult(null)
    setAssessed(true)

    try {
      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setApiResult(data)
    } catch (err) {
      // Fallback to pure client-side rules if server unreachable (e.g. pure Vite dev)
      console.warn('API assess failed, using local rules:', err.message)
      setApiError(err.message)
      setApiResult({
        mode: 'rules-only (client fallback)',
        recommendations: evaluateHomeRules(profile),
        headline: 'Assessment from local rules (API unavailable)',
        overallNote:
          'Could not reach the assessment API. Showing deterministic rule findings only. Start the Express server (npm start) or deploy the full app to enable Groq agents.',
      })
    } finally {
      setLoading(false)
      setStep(4)
    }
  }

  const goNext = () => {
    if (step === 3) {
      runAssessment()
    } else {
      setStep((s) => s + 1)
    }
  }
  const goBack = () => {
    if (step === 4) {
      setAssessed(false)
      setApiResult(null)
      setApiError(null)
    }
    setStep((s) => Math.max(-1, s - 1))
  }

  const restart = () => {
    setProfile(initialProfile)
    setAssessed(false)
    setApiResult(null)
    setApiError(null)
    setStep(-1)
  }

  // ——— Landing ———
  if (step === -1) {
    return (
      <div className="app-shell">
        <div className="landing">
          <h1>Harmonious Home</h1>
          <p className="lead">
            A practical, explainable assessment for Indian households. Feng Shui first, optional
            separate Vastu lens. Safe, reversible recommendations with visible uncertainty.
          </p>

          <div className="principles">
            <h3>Design principles</h3>
            <ul>
              <li>
                <strong>Traditions stay distinct</strong> — Feng Shui and Vastu are never blended
                into one score.
              </li>
              <li>
                <strong>No invented certainty</strong> — unknown directions are gaps, not defects.
              </li>
              <li>
                <strong>Practical first</strong> — safety, ventilation and accessibility outrank
                symbolic preference.
              </li>
              <li>
                <strong>Respect existing homes</strong> — start with reversible, low-cost options.
              </li>
              <li>
                <strong>No life-outcome claims</strong> — no promises of wealth, health or fortune.
              </li>
            </ul>
          </div>

          <button className="btn btn-primary" onClick={() => setStep(0)}>
            Start assessment
          </button>
        </div>
        <footer className="app-footer">
          Prototype demo · Groq agents when API key is set · Based on the Harmonious Home system
          design
        </footer>
      </div>
    )
  }

  // ——— Results ———
  if (step === 4) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <p className="logo">Harmonious Home</p>
          <p className="tagline">Assessment results</p>
        </header>

        <div className="progress-bar">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`progress-step ${i <= 4 ? 'done' : ''}`} />
          ))}
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <p style={{ margin: 0, fontSize: '1.05rem' }}>Running assessment…</p>
            <p style={{ margin: '0.5rem 0 0', color: 'var(--ink-muted)', fontSize: '0.9rem' }}>
              Deterministic rules + optional Groq synthesis
            </p>
          </div>
        ) : (
          <>
            <div className="results-header">
              <h2>{headline}</h2>
              {overallNote && (
                <p style={{ margin: '0.5rem 0 0', color: 'var(--ink-muted)', fontSize: '0.9rem' }}>
                  {overallNote}
                </p>
              )}
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                Mode: {mode}
                {apiResult?.agentMeta?.model ? ` · model ${apiResult.agentMeta.model}` : ''}
              </p>
              <div className="completeness">
                <span>Completeness</span>
                <div className="completeness-bar">
                  <div className="completeness-fill" style={{ width: `${completeness}%` }} />
                </div>
                <span>{completeness}%</span>
              </div>
            </div>

            {apiError && (
              <div
                className="do-not"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
              >
                <h3 style={{ color: 'var(--ink-muted)' }}>API note</h3>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{apiError}</p>
              </div>
            )}

            {missing.length > 0 && (
              <div className="missing-list">
                <h3>Information that would improve confidence</h3>
                <ul>
                  {missing.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {findings.length === 0 ? (
              <div className="card">
                <p style={{ margin: 0 }}>
                  No strong rule triggers from the current answers. This can mean the home already
                  looks practical on the points we checked, or that more detail is needed. Try
                  adding orientation, ventilation or clutter information.
                </p>
              </div>
            ) : (
              findings.map((f, idx) => (
                <div key={f.id || idx} className="rec-card">
                  <div className="rec-top">
                    <h3>{f.title || f.observation}</h3>
                    <span className={`priority-badge ${f.priority || 'medium'}`}>
                      {f.priority || 'medium'}
                    </span>
                  </div>
                  <div className="basis-tags">
                    {(f.basis || []).map((b) => (
                      <span key={b} className="basis-tag">
                        {b}
                      </span>
                    ))}
                  </div>

                  {f.explanation && (
                    <div className="rec-section">
                      <div className="label">Explanation</div>
                      <p>{f.explanation}</p>
                    </div>
                  )}
                  {f.traditionalInterpretation && !f.explanation && (
                    <div className="rec-section">
                      <div className="label">Traditional interpretation</div>
                      <p>{f.traditionalInterpretation}</p>
                    </div>
                  )}
                  {f.practicalRationale && (
                    <div className="rec-section">
                      <div className="label">Practical rationale</div>
                      <p>{f.practicalRationale}</p>
                    </div>
                  )}
                  {(f.observation && f.title) && (
                    <div className="rec-section">
                      <div className="label">Observation</div>
                      <p>{f.observation}</p>
                    </div>
                  )}
                  <div className="rec-section">
                    <div className="label">Suggested action</div>
                    <p>{f.action}</p>
                  </div>
                  {f.alternative && (
                    <div className="rec-section">
                      <div className="label">Alternative</div>
                      <p>{f.alternative}</p>
                    </div>
                  )}
                  {(f.caveats?.length > 0 || f.caveats) && (
                    <div className="rec-section">
                      <div className="label">Caveats</div>
                      <p>
                        {Array.isArray(f.caveats) ? f.caveats.join(' ') : f.caveats}
                      </p>
                    </div>
                  )}
                  <div className="meta-row">
                    <span className="meta-item">
                      Confidence: <strong>{f.confidence || '—'}</strong>
                    </span>
                    <span className="meta-item">
                      Cost: <strong>{f.costBand || '—'}</strong>
                    </span>
                    {f.reversibility && (
                      <span className="meta-item">
                        Reversibility: <strong>{f.reversibility}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}

            <div className="do-not">
              <h3>Do-not list (hard constraints)</h3>
              <ul>
                {doNot.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="limitations">
              <h3>Limitations of this demo</h3>
              <ul>
                {(apiResult?.limitations || [
                  'Illustrative rules and agent prompts only — not expert-certified.',
                  'No full classical Flying Stars / Luopan calculation.',
                  'Safety, ventilation and accessibility always outrank symbolic preference.',
                  'Verify any significant change with qualified professionals.',
                ]).map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>

            <div className="btn-row">
              <button className="btn btn-secondary" onClick={goBack}>
                Edit answers
              </button>
              <button className="btn btn-primary" onClick={restart}>
                Start over
              </button>
            </div>
          </>
        )}

        <footer className="app-footer">
          Prototype · Traditions kept distinct · Safety & accessibility outrank symbolism
        </footer>
      </div>
    )
  }

  // ——— Form steps ———
  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="logo">Harmonious Home</p>
        <p className="tagline">
          Step {step + 1} of 4 — {STEPS[step].label}
        </p>
      </header>

      <div className="progress-bar">
        {STEPS.slice(0, 4).map((s, i) => (
          <div
            key={s.id}
            className={`progress-step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Step 0 — Basics */}
      {step === 0 && (
        <div className="card">
          <h2>About your home</h2>
          <p className="subtitle">Minimum context so recommendations stay relevant.</p>

          <Field label="City or broad region" hint="Never ask for exact street address.">
            <input
              type="text"
              placeholder="e.g. Pune, Bengaluru, coastal Kerala…"
              value={profile.city}
              onChange={(e) => update('city', e.target.value)}
            />
          </Field>

          <Field label="Property type">
            <select
              value={profile.propertyType}
              onChange={(e) => update('propertyType', e.target.value)}
            >
              <option value="">Select…</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Current stage">
            <select value={profile.stage} onChange={(e) => update('stage', e.target.value)}>
              <option>Occupied</option>
              <option>Moving in</option>
              <option>Renovation</option>
              <option>New build</option>
              <option>Rental</option>
            </select>
          </Field>

          <Field
            label="Which lens would you like?"
            hint="You can choose Feng Shui, Vastu, both separately, or practical advice only."
          >
            <select
              value={profile.tradition}
              onChange={(e) => update('tradition', e.target.value)}
            >
              <option value="">Select…</option>
              {TRADITIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Do you know true / geographic north?"
            hint="Controls whether directional (compass) rules are allowed."
          >
            <select
              value={profile.northKnown}
              onChange={(e) => update('northKnown', e.target.value)}
            >
              <option value="">Select…</option>
              <option>Verified (plan or careful compass)</option>
              <option>Approximate / guess</option>
              <option>Unknown</option>
            </select>
          </Field>

          <Field label="Which direction does the home’s own entrance face?">
            <select
              value={profile.entranceDirection}
              onChange={(e) => update('entranceDirection', e.target.value)}
            >
              <option value="">Select…</option>
              {DIRECTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {/* Step 1 — Rooms */}
      {step === 1 && (
        <div className="card">
          <h2>Rooms & layout</h2>
          <p className="subtitle">Functional relationships matter more than perfect labels.</p>

          <Field label="Kitchen location (if known)">
            <select
              value={profile.kitchenLocation}
              onChange={(e) => update('kitchenLocation', e.target.value)}
            >
              <option value="">Select or skip…</option>
              {DIRECTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
              <option>Open-plan / not fixed</option>
            </select>
          </Field>

          <Field
            label="Primary bedroom — bed and door relationship"
            hint="Command-position style question; only if a bedroom exists."
          >
            <select
              value={profile.bedSeesDoor}
              onChange={(e) => update('bedSeesDoor', e.target.value)}
            >
              <option value="">Select or skip…</option>
              <option>Can see door, not in direct line</option>
              <option>Direct alignment (door at foot of bed)</option>
              <option>Cannot see door from bed</option>
              <option>Not applicable / no fixed bed</option>
            </select>
          </Field>

          <Field label="What is near the centre of the home?">
            <select value={profile.centreUse} onChange={(e) => update('centreUse', e.target.value)}>
              <option value="">Select or skip…</option>
              <option>Open living / circulation</option>
              <option>Stairs or lift</option>
              <option>Wet area / bathroom</option>
              <option>Heavy storage / clutter</option>
              <option>Unknown</option>
            </select>
          </Field>
        </div>
      )}

      {/* Step 2 — Environment */}
      {step === 2 && (
        <div className="card">
          <h2>Light, air & surroundings</h2>
          <p className="subtitle">Practical building concerns are kept separate from tradition rules.</p>

          <Field label="Overall daylight quality">
            <select value={profile.daylight} onChange={(e) => update('daylight', e.target.value)}>
              <option value="">Select…</option>
              <option>Good / balanced</option>
              <option>Harsh / glare</option>
              <option>Limited / dark</option>
              <option>Seasonal variation</option>
            </select>
          </Field>

          <Field label="Ventilation">
            <select
              value={profile.ventilation}
              onChange={(e) => update('ventilation', e.target.value)}
            >
              <option value="">Select…</option>
              <option>Cross-flow possible</option>
              <option>Single-sided only</option>
              <option>Mostly mechanical</option>
              <option>Poor / stale air</option>
            </select>
          </Field>

          <Field label="Climate or environmental concerns (multi-select)">
            <ChipGroup
              options={[
                'Hot-dry / western sun',
                'Humid / coastal',
                'Monsoon dampness / mould',
                'Water ingress',
                'Dust / pollution',
                'Neighbourhood noise',
                'None of these',
              ]}
              value={profile.climateConcerns}
              onChange={(v) => update('climateConcerns', v)}
            />
          </Field>

          <Field label="Clutter or storage hotspots">
            <ChipGroup
              options={['Entrance', 'Centre', 'Bedroom', 'Kitchen', 'Balcony', 'Under stairs', 'None']}
              value={profile.clutter}
              onChange={(v) => update('clutter', v)}
            />
          </Field>
        </div>
      )}

      {/* Step 3 — People & priorities */}
      {step === 3 && (
        <div className="card">
          <h2>People & priorities</h2>
          <p className="subtitle">Your goals and constraints shape which recommendations appear first.</p>

          <Field label="What would you like to improve?">
            <ChipGroup
              options={GOALS}
              value={profile.goals}
              onChange={(v) => update('goals', v)}
            />
          </Field>

          <Field label="Constraints (if any)">
            <ChipGroup
              options={[
                'Rental / landlord approval needed',
                'Housing-society rules',
                'Limited budget',
                'No drilling / no structural change',
                'Mobility or accessibility needs',
                'Children in household',
                'Older adults in household',
              ]}
              value={profile.constraints}
              onChange={(v) => update('constraints', v)}
            />
          </Field>

          <Field
            label="Anything else we should know? (optional)"
            hint="Avoid names, exact address or sensitive personal details."
          >
            <textarea
              placeholder="e.g. narrow corridor, shared wall with neighbour kitchen…"
              value={profile.freeText}
              onChange={(e) => update('freeText', e.target.value)}
            />
          </Field>
        </div>
      )}

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={goBack} disabled={loading}>
          {step === 0 ? 'Back to start' : 'Back'}
        </button>
        <button className="btn btn-primary" onClick={goNext} disabled={loading}>
          {step === 3 ? (loading ? 'Assessing…' : 'See assessment') : 'Continue'}
        </button>
      </div>

      <footer className="app-footer">
        Answers stay in this browser session · API key never reaches the browser
      </footer>
    </div>
  )
}
