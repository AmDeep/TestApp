/**
 * Harmonious Home — Domain layer (simplified for demo)
 * Deterministic rules + adaptive question logic.
 * Traditions kept distinct. No invented certainty.
 */

export const STEPS = [
  { id: 'basics', label: 'Home basics' },
  { id: 'rooms', label: 'Rooms & layout' },
  { id: 'environment', label: 'Light, air & surroundings' },
  { id: 'people', label: 'People & priorities' },
  { id: 'results', label: 'Assessment' },
]

export const PROPERTY_TYPES = [
  'Apartment / flat',
  'Independent house',
  'Row house',
  'Duplex',
  'Studio',
  'Other',
]

export const TRADITIONS = [
  { value: 'feng_shui_form', label: 'Feng Shui — Form School' },
  { value: 'feng_shui_compass', label: 'Feng Shui — Compass / Bagua' },
  { value: 'vastu', label: 'Vastu Shastra (selected source)' },
  { value: 'compare', label: 'Compare Feng Shui & Vastu (separate)' },
  { value: 'practical_only', label: 'Practical building advice only' },
]

export const GOALS = [
  'Better flow & circulation',
  'Bedroom restfulness',
  'Kitchen practicality',
  'Daylight & ventilation',
  'Entrance & first impression',
  'Reduce clutter / storage',
  'Privacy',
  'Work-from-home setup',
]

export const DIRECTIONS = [
  'North',
  'North-East',
  'East',
  'South-East',
  'South',
  'South-West',
  'West',
  'North-West',
  'Unknown',
]

/** Example deterministic rules (illustrative only, not production-certified) */
export const RULES = [
  {
    ruleId: 'FS-FORM-ENTRY-001',
    tradition: 'feng_shui',
    schoolOrSource: 'Form School — reviewed guidance set',
    topic: 'entry_and_arrival',
    preconditions: ['clutter'],
    trigger: (p) => Array.isArray(p.clutter) && p.clutter.includes('Entrance'),
    observation: 'The entrance storage / circulation area is reported as cluttered.',
    traditionalInterpretation:
      'Form-oriented readings pay attention to the approach and quality of arrival. A clear entry is commonly valued.',
    practicalRationale:
      'A congested entry can impede circulation, door clearance and accessibility.',
    recommendations: [
      'Clear the door swing and primary walking line; use ventilated closed storage where feasible.',
    ],
    alternative: 'Use a slim freestanding unit that does not reduce the accessible route.',
    contraindications: [
      'Do not remove required footwear, mobility aids or emergency equipment from reachable storage.',
    ],
    priority: 'medium',
    confidence: 'moderate',
    costBand: 'low',
    reversibility: 'reversible',
  },
  {
    ruleId: 'PRAC-VENT-001',
    tradition: 'practical_building',
    schoolOrSource: 'Practical building / ventilation guidance',
    topic: 'ventilation',
    preconditions: ['ventilation'],
    trigger: (p) => p.ventilation === 'Poor / stale air' || p.ventilation === 'Single-sided only',
    observation: 'Ventilation is reported as limited or poor.',
    traditionalInterpretation: null,
    practicalRationale:
      'Adequate cross-ventilation or mechanical extraction improves air quality, reduces moisture risk and supports comfort in Indian climates.',
    recommendations: [
      'Keep existing openings clear of heavy furniture; use exhaust fans where possible; consider cross-flow when windows allow.',
    ],
    alternative: 'A quiet portable air-purifier / fan can help temporarily while openings remain limited.',
    contraindications: ['Do not block fire exits or permanently seal required ventilation paths.'],
    priority: 'high',
    confidence: 'high',
    costBand: 'low',
    reversibility: 'reversible',
  },
  {
    ruleId: 'FS-BED-001',
    tradition: 'feng_shui',
    schoolOrSource: 'Modern Form / Command-position guidance',
    topic: 'bedroom',
    preconditions: ['bedSeesDoor'],
    trigger: (p) => p.bedSeesDoor === 'Direct alignment (door at foot of bed)',
    observation: 'The bed is reported in direct alignment with the door.',
    traditionalInterpretation:
      'Many contemporary Feng Shui practitioners prefer the bed not to sit in a direct “door line” when avoidable, while still allowing the occupant to see the entry.',
    practicalRationale:
      'A bed in the direct path of a door can feel less private and may be disturbed by drafts or sudden light.',
    recommendations: [
      'If room size allows, shift the bed so the head has solid support and the occupant can still see the door without lying in its direct path.',
    ],
    alternative: 'A solid screen or tall headboard can reduce the sense of exposure when rearrangement is limited.',
    contraindications: [
      'Do not block emergency egress or create trip hazards for mobility-impaired occupants.',
    ],
    priority: 'low',
    confidence: 'moderate',
    costBand: 'low',
    reversibility: 'reversible',
  },
  {
    ruleId: 'PRAC-DAMP-001',
    tradition: 'practical_building',
    schoolOrSource: 'Practical building / moisture guidance',
    topic: 'moisture',
    preconditions: ['climateConcerns'],
    trigger: (p) =>
      Array.isArray(p.climateConcerns) &&
      (p.climateConcerns.includes('Monsoon dampness / mould') ||
        p.climateConcerns.includes('Water ingress')),
    observation: 'Dampness, mould or water-ingress concerns are reported.',
    traditionalInterpretation: null,
    practicalRationale:
      'Moisture and mould affect indoor air quality and building fabric. These are practical health and maintenance issues first.',
    recommendations: [
      'Identify and address sources of ingress; improve exhaust in wet areas; keep furniture slightly off exterior walls in problem zones.',
    ],
    alternative: 'Consult a building professional for persistent leaks or structural damp before decorative fixes.',
    contraindications: [
      'Do not cover active mould with paint alone or ignore gas / electrical risks near wet areas.',
    ],
    priority: 'high',
    confidence: 'high',
    costBand: 'varies',
    reversibility: 'depends',
  },
  {
    ruleId: 'FS-FORM-CENTRE-001',
    tradition: 'feng_shui',
    schoolOrSource: 'Form School — centre / circulation',
    topic: 'centre',
    preconditions: ['centreUse'],
    trigger: (p) => p.centreUse === 'Wet area / bathroom' || p.centreUse === 'Heavy storage / clutter',
    observation: 'The centre of the home is reported as a wet area or heavy storage.',
    traditionalInterpretation:
      'Form-oriented readings often prefer the geometric centre of a dwelling to feel open and usable rather than occupied by wet functions or dense clutter.',
    practicalRationale:
      'A clear central circulation zone supports movement and can make the home feel less congested.',
    recommendations: [
      'Where possible, keep primary walking paths through the centre clear; relocate non-essential storage to the perimeter.',
    ],
    alternative: 'If the centre is fixed by structure, improve lighting and keep the floor free of obstacles.',
    contraindications: [],
    priority: 'medium',
    confidence: 'moderate',
    costBand: 'low',
    reversibility: 'reversible',
  },
  {
    ruleId: 'VASTU-KITCHEN-001',
    tradition: 'vastu',
    schoolOrSource: 'Common contemporary Vastu preference (illustrative)',
    topic: 'kitchen',
    preconditions: ['tradition', 'kitchenLocation'],
    trigger: (p) =>
      (p.tradition === 'vastu' || p.tradition === 'compare') &&
      p.kitchenLocation === 'South-West',
    observation: 'Kitchen is reported in the South-West sector.',
    traditionalInterpretation:
      'Many contemporary Vastu sources prefer the kitchen (fire) away from the South-West, which is often associated with stability / earth. This is a preference found in modern summaries and is not a single classical rule for every region or text.',
    practicalRationale:
      'Kitchen location is often constrained by plumbing and exhaust; practical ventilation and safety matter more than directional preference alone.',
    recommendations: [
      'If relocation is impossible, focus on good exhaust, clear work triangle and safe storage rather than forced directional change.',
    ],
    alternative: 'Keep the cooking zone well-ventilated and the floor free of slip hazards.',
    contraindications: [
      'Do not recommend moving gas lines, plumbing or structural walls as a first response.',
    ],
    priority: 'low',
    confidence: 'low',
    costBand: 'n/a',
    reversibility: 'n/a',
  },
  {
    ruleId: 'PRAC-ENTRANCE-LIGHT-001',
    tradition: 'practical_building',
    schoolOrSource: 'Practical building / daylight',
    topic: 'daylight',
    preconditions: ['daylight'],
    trigger: (p) => p.daylight === 'Limited / dark' || p.daylight === 'Harsh / glare',
    observation: 'Daylight quality is reported as limited or harsh.',
    traditionalInterpretation: null,
    practicalRationale:
      'Good, controllable daylight supports visual comfort and reduces reliance on artificial lighting. Harsh western sun is a common Indian climate issue.',
    recommendations: [
      'Use light curtains or blinds for glare control; keep window sills clear; consider light-coloured surfaces near openings.',
    ],
    alternative: 'Task lighting and warmer evening lamps can compensate for limited natural light.',
    contraindications: [],
    priority: 'medium',
    confidence: 'high',
    costBand: 'low',
    reversibility: 'reversible',
  },
  {
    ruleId: 'FS-ORIENT-WARN-001',
    tradition: 'feng_shui',
    schoolOrSource: 'Compass School — data quality',
    topic: 'orientation',
    preconditions: ['northKnown'],
    trigger: (p) =>
      (p.tradition === 'feng_shui_compass' || p.tradition === 'compare') &&
      (p.northKnown === 'Unknown' || p.northKnown === 'Approximate / guess'),
    observation: 'True / geographic north is unknown or only approximate.',
    traditionalInterpretation:
      'Compass-based and Bagua directional systems require a trustworthy orientation reference. Without it, directional claims have low confidence.',
    practicalRationale: null,
    recommendations: [
      'Obtain a north-marked floor plan or take a careful outdoor compass reading away from metal and concrete before applying directional rules.',
    ],
    alternative: 'Use Form School and practical observations that do not depend on exact degrees.',
    contraindications: [],
    priority: 'info',
    confidence: 'high',
    costBand: 'n/a',
    reversibility: 'n/a',
  },
]

/**
 * Evaluate rules against a profile. Returns structured findings.
 */
export function evaluateHomeRules(profile) {
  const findings = []
  const selectedTradition = profile.tradition || 'feng_shui_form'

  for (const rule of RULES) {
    // Tradition filter: keep distinct
    if (rule.tradition === 'feng_shui') {
      if (
        selectedTradition !== 'feng_shui_form' &&
        selectedTradition !== 'feng_shui_compass' &&
        selectedTradition !== 'compare'
      ) {
        continue
      }
      // Form vs Compass soft filter
      if (
        selectedTradition === 'feng_shui_form' &&
        rule.topic === 'orientation' &&
        rule.ruleId.includes('ORIENT')
      ) {
        // still allow orientation warning
      }
    }
    if (rule.tradition === 'vastu') {
      if (selectedTradition !== 'vastu' && selectedTradition !== 'compare') {
        continue
      }
    }

    try {
      if (rule.trigger(profile)) {
        findings.push({
          id: rule.ruleId,
          title: rule.recommendations[0]?.slice(0, 60) + (rule.recommendations[0]?.length > 60 ? '…' : '') || rule.observation.slice(0, 50),
          priority: rule.priority,
          observation: rule.observation,
          basis: [
            rule.tradition === 'feng_shui'
              ? `Feng Shui – ${rule.schoolOrSource}`
              : rule.tradition === 'vastu'
                ? `Vastu – ${rule.schoolOrSource}`
                : 'Practical building',
          ],
          traditionalInterpretation: rule.traditionalInterpretation,
          practicalRationale: rule.practicalRationale,
          action: rule.recommendations[0] || '',
          alternative: rule.alternative || '',
          caveats: rule.contraindications || [],
          confidence: rule.confidence,
          costBand: rule.costBand,
          reversibility: rule.reversibility,
          sourceIds: [rule.ruleId],
        })
      }
    } catch (e) {
      // skip broken trigger
    }
  }

  // Sort: high > medium > low > info
  const order = { high: 0, medium: 1, low: 2, info: 3 }
  findings.sort((a, b) => (order[a.priority] ?? 9) - (order[b.priority] ?? 9))

  return findings
}

/**
 * Compute simple completeness score (0–100)
 */
export function assessmentCompleteness(profile) {
  const keys = [
    'city',
    'propertyType',
    'tradition',
    'northKnown',
    'entranceDirection',
    'ventilation',
    'daylight',
    'clutter',
    'goals',
  ]
  let filled = 0
  for (const k of keys) {
    const v = profile[k]
    if (v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)) {
      filled++
    }
  }
  return Math.round((filled / keys.length) * 100)
}

/**
 * Suggest next missing questions
 */
export function getMissingQuestions(profile) {
  const missing = []
  if (!profile.city) missing.push('City or broad region')
  if (!profile.propertyType) missing.push('Property type')
  if (!profile.tradition) missing.push('Preferred tradition / lens')
  if (
    (profile.tradition === 'feng_shui_compass' || profile.tradition === 'compare') &&
    (!profile.northKnown || profile.northKnown === 'Unknown')
  ) {
    missing.push('Verified north / orientation method (required for reliable compass rules)')
  }
  if (!profile.ventilation) missing.push('Ventilation quality')
  if (!profile.daylight) missing.push('Daylight quality')
  if (!profile.goals || profile.goals.length === 0) missing.push('Your improvement goals')
  return missing
}

export function getDoNotList() {
  return [
    'Do not block doors, windows, ventilation grilles or emergency exits.',
    'Do not move gas lines, structural walls, or major plumbing as a first response.',
    'Do not place open flames, unsecured heavy objects or water near electrical points unsafely.',
    'Do not remove handrails, grab bars or accessible routes for symbolic reasons.',
    'Treat mould, dampness, unsafe wiring or cracks as practical safety issues first.',
  ]
}
