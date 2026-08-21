import { useState, useEffect, useRef } from 'react'

type Step = {
  id: string
  label: string
  detail: string
  duration: number
}

type ProductionPlan = {
  location: string
  budget: string
  duration: string
  productionType: string
  schedule: { phase: string; days: number }[]
  crew: { role: string; count: number }[]
  risks: { severity: 'HIGH' | 'MED' | 'LOW'; text: string }[]
  recommendations: string[]
  strategy: string
}

const AGENT_STEPS: Step[] = [
  { id: 'understand', label: 'UNDERSTAND REQUEST', detail: 'Gemini parsing production brief…', duration: 1200 },
  { id: 'extract', label: 'EXTRACT PARAMETERS', detail: 'Identifying location, budget, crew, timeline…', duration: 900 },
  { id: 'research', label: 'RESEARCH VIA PARALLEL', detail: 'Querying location data, weather, logistics…', duration: 2200 },
  { id: 'analyze', label: 'ANALYZE & REASON', detail: 'Gemini evaluating tradeoffs and constraints…', duration: 1600 },
  { id: 'validate', label: 'VALIDATE PLAN', detail: 'Cross-checking budget allocation and risks…', duration: 800 },
  { id: 'generate', label: 'GENERATE OUTPUT', detail: 'Producing final production plan…', duration: 600 },
]

function parseBrief(text: string): ProductionPlan {
  const lower = text.toLowerCase()

  const locationMatch = lower.match(/in\s+([a-z\s]+?)(?:\s+with|\s+for|\s+over|\.|$)/)
  const location = locationMatch
    ? locationMatch[1].trim().replace(/\b\w/g, c => c.toUpperCase())
    : 'Kampala, Uganda'

  const budgetMatch = text.match(/\$[\d,]+(?:k|m|million|thousand)?/i)
  const budget = budgetMatch ? budgetMatch[0] : '$500,000'

  const daysMatch = lower.match(/(\d+)[- ]?day/)
  const days = daysMatch ? parseInt(daysMatch[1]) : 30

  const isDoc = lower.includes('documentary') || lower.includes('doc')
  const productionType = isDoc ? 'Feature Documentary' : 'Narrative Feature'

  const preProDays = Math.round(days * 0.45)
  const scoutDays = Math.round(days * 0.15)
  const castDays = Math.round(days * 0.2)
  const postDays = Math.round(days * 1.5)

  return {
    location,
    budget,
    duration: `${days} days`,
    productionType,
    schedule: [
      { phase: 'Pre-production', days: preProDays },
      { phase: 'Location scouting', days: scoutDays },
      { phase: 'Casting & rehearsals', days: castDays },
      { phase: 'Principal photography', days },
      { phase: 'Post-production', days: postDays },
    ],
    crew: [
      { role: 'Director', count: 1 },
      { role: 'Director of Photography', count: 1 },
      { role: 'Production Designer', count: 1 },
      { role: 'Sound Mixer', count: 2 },
      { role: 'Camera Operators', count: 3 },
      { role: 'Gaffer / Lighting', count: 4 },
      { role: 'Local Production Crew', count: 12 },
    ],
    risks: [
      { severity: 'HIGH', text: 'Permit delays at primary filming locations — begin applications 8 weeks in advance' },
      { severity: 'MED', text: 'Seasonal rainfall may impact outdoor schedules; build 4-day weather buffer' },
      { severity: 'MED', text: 'Equipment import duties — consider partnering with a local rental house' },
      { severity: 'LOW', text: 'Transportation between locations adds ~$18,000 to logistics budget' },
    ],
    recommendations: [
      'Allocate 60% of shoot days to primary location; 40% secondary',
      'Engage a local fixer for permits, talent sourcing, and logistics coordination',
      'Reserve 12% of total budget ($60,000) as contingency',
      'Consider shooting in dry season (Dec–Feb) to minimize weather risk',
      'Use ClickHouse analytics to track daily burn rate against projected spend',
    ],
    strategy: `Primary: ${location.split(',')[0]} (60% of shoot) — lower accommodation costs, authentic local texture. Secondary location for key sequences requiring infrastructure. Estimated total production: ${preProDays + scoutDays + castDays + days + postDays} days end-to-end.`,
  }
}

type StepState = 'pending' | 'active' | 'done'

export default function App() {
  const [brief, setBrief] = useState('')
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle')
  const [stepStates, setStepStates] = useState<StepState[]>(AGENT_STEPS.map(() => 'pending'))
  const [currentStepDetail, setCurrentStepDetail] = useState('')
  const [plan, setPlan] = useState<ProductionPlan | null>(null)
  const [typedStrategy, setTypedStrategy] = useState('')
  const planRef = useRef<HTMLDivElement>(null)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimeouts = () => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
  }

  const runPipeline = () => {
    if (!brief.trim()) return
    clearTimeouts()
    setPhase('running')
    setStepStates(AGENT_STEPS.map(() => 'pending'))
    setPlan(null)
    setTypedStrategy('')

    let elapsed = 0
    AGENT_STEPS.forEach((step, i) => {
      const startAt = elapsed
      elapsed += step.duration

      timeouts.current.push(setTimeout(() => {
        setStepStates(prev => prev.map((s, idx) => idx === i ? 'active' : s))
        setCurrentStepDetail(step.detail)
      }, startAt))

      timeouts.current.push(setTimeout(() => {
        setStepStates(prev => prev.map((s, idx) => idx === i ? 'done' : s))
      }, startAt + step.duration - 100))
    })

    timeouts.current.push(setTimeout(() => {
      const result = parseBrief(brief)
      setPlan(result)
      setPhase('done')
      setTimeout(() => planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)

      let i = 0
      const typeInterval = setInterval(() => {
        i++
        setTypedStrategy(result.strategy.slice(0, i))
        if (i >= result.strategy.length) clearInterval(typeInterval)
      }, 18)
    }, elapsed))
  }

  useEffect(() => () => clearTimeouts(), [])

  const reset = () => {
    clearTimeouts()
    setPhase('idle')
    setStepStates(AGENT_STEPS.map(() => 'pending'))
    setPlan(null)
    setBrief('')
    setTypedStrategy('')
  }

  const riskColor = (s: 'HIGH' | 'MED' | 'LOW') =>
    s === 'HIGH' ? '#c0392b' : s === 'MED' ? '#1a6fa8' : '#2e7d52'

  return (
    <div className="min-h-screen" style={{ background: '#e8f4fd', position: 'relative' }}>
      {/* Top accent line */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, #1a6fa8, transparent)',
        zIndex: 10,
      }} />

      {/* Header */}
      <header style={{
        borderBottom: '1px solid #b8d8ef',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky', top: 0,
        background: 'rgba(232,244,253,0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 9,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 36, height: 36,
            border: '1px solid #1a6fa8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>🎬</div>
          <div>
            <div className="font-display" style={{ fontSize: 18, color: '#0f2a3f', letterSpacing: '0.02em' }}>
              CinePilot AI
            </div>
            <div className="font-mono" style={{ fontSize: 10, color: '#5a8aaa', letterSpacing: '0.12em' }}>
              FILM PRODUCTION INTELLIGENCE AGENT
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {['GEMINI', 'PARALLEL', 'GOOGLE CLOUD'].map(tag => (
            <span key={tag} className="font-mono" style={{
              fontSize: 9, color: '#5a8aaa', letterSpacing: '0.14em',
              border: '1px solid #b8d8ef', padding: '3px 8px',
            }}>{tag}</span>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 920, margin: '0 auto', padding: '60px 40px 120px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 56 }}>
          <div className="font-mono" style={{ fontSize: 10, color: '#1a6fa8', letterSpacing: '0.2em', marginBottom: 16 }}>
            SUMMER BLOCKBUSTER HACKATHON — GOOGLE CLOUD × GEMINI
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(36px, 5vw, 58px)', color: '#0f2a3f', lineHeight: 1.1, marginBottom: 16 }}>
            Plan any film production.<br />
            <span style={{ color: '#1a6fa8', fontStyle: 'italic' }}>In seconds.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#4a7a9b', maxWidth: 540, lineHeight: 1.7 }}>
            Describe your production — location, budget, timeline — and the agent orchestrates
            a multi-step pipeline: Gemini understands, Parallel researches, and the system
            produces an actionable production plan.
          </p>
        </div>

        {/* Input card */}
        <div style={{
          border: '1px solid #1a1810',
          background: '#f0f8ff',
          padding: 32,
          marginBottom: 40,
        }}>
          <label className="font-mono" style={{ fontSize: 10, color: '#4a7a9b', letterSpacing: '0.18em', display: 'block', marginBottom: 12 }}>
            PRODUCTION BRIEF
          </label>
          <textarea
            value={brief}
            onChange={e => setBrief(e.target.value)}
            placeholder={`Plan a 30-day narrative feature to be filmed in Kampala and Nairobi with a $500,000 budget.`}
            disabled={phase === 'running'}
            rows={4}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid #1a1810',
              color: '#0f2a3f',
              fontSize: 15,
              fontFamily: "'Work Sans', sans-serif",
              padding: '14px 16px',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.65,
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = '#1a6fa844')}
            onBlur={e => (e.target.style.borderColor = '#b8d8ef')}
          />
          <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={runPipeline}
              disabled={phase === 'running' || !brief.trim()}
              style={{
                background: phase === 'running' || !brief.trim() ? 'transparent' : '#1a6fa8',
                color: phase === 'running' || !brief.trim() ? '#5a8aaa' : '#0f2a3f',
                border: `1px solid ${phase === 'running' || !brief.trim() ? '#c8e0ef' : '#1a6fa8'}`,
                padding: '11px 28px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.14em',
                cursor: phase === 'running' || !brief.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {phase === 'running' ? 'PROCESSING…' : 'GENERATE PLAN'}
            </button>
            {phase !== 'idle' && (
              <button onClick={reset} style={{
                background: 'transparent', border: '1px solid #222018',
                color: '#5a8aaa', padding: '11px 20px',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                letterSpacing: '0.1em', cursor: 'pointer',
              }}>
                RESET
              </button>
            )}
            {phase === 'running' && (
              <span className="font-mono animate-pulse-blue" style={{ fontSize: 10, color: '#1a6fa8', letterSpacing: '0.1em' }}>
                {currentStepDetail}
              </span>
            )}
          </div>
        </div>

        {/* Agent pipeline */}
        {phase !== 'idle' && (
          <div style={{
            border: '1px solid #1a1810',
            background: '#eaf4fc',
            padding: 28,
            marginBottom: 40,
            animation: 'fade-in-up 0.4s ease forwards',
          }}>
            <div className="font-mono" style={{ fontSize: 10, color: '#5a8aaa', letterSpacing: '0.18em', marginBottom: 20 }}>
              AGENT PIPELINE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AGENT_STEPS.map((step, i) => {
                const state = stepStates[i]
                return (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className={`font-mono step-${state}`} style={{
                      width: 22, height: 22, border: '1px solid',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, flexShrink: 0, transition: 'all 0.3s',
                    }}>
                      {state === 'done' ? '✓' : state === 'active' ? <span className="animate-blink">▸</span> : String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="font-mono" style={{
                        fontSize: 10, letterSpacing: '0.14em',
                        color: state === 'active' ? '#1a6fa8' : state === 'done' ? '#2e7d52' : '#8ab8d4',
                        transition: 'color 0.3s',
                      }}>
                        {step.label}
                      </div>
                    </div>
                    {state === 'active' && (
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[0, 1, 2].map(j => (
                          <div key={j} className="animate-pulse-blue" style={{
                            width: 3, height: 3, background: '#1a6fa8',
                            animationDelay: `${j * 0.2}s`,
                          }} />
                        ))}
                      </div>
                    )}
                    {state === 'done' && (
                      <div style={{ width: 40, height: 1, background: '#2e7d52', opacity: 0.5 }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Production plan output */}
        {plan && phase === 'done' && (
          <div ref={planRef} className="animate-fade-in-up">
            {/* Plan header */}
            <div style={{
              border: '1px solid #1a6fa822',
              background: '#f0f8ff',
              padding: 32,
              marginBottom: 2,
            }}>
              <div className="font-mono" style={{ fontSize: 9, color: '#1a6fa8', letterSpacing: '0.2em', marginBottom: 20 }}>
                PRODUCTION PLAN — GENERATED BY CINEPILOT AI
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
                {[
                  ['📍 LOCATION', plan.location],
                  ['💰 BUDGET', plan.budget],
                  ['🎬 PRODUCTION TYPE', plan.productionType],
                  ['📅 SHOOT DURATION', plan.duration],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="font-mono" style={{ fontSize: 9, color: '#5a8aaa', letterSpacing: '0.16em', marginBottom: 6 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 15, color: '#0f2a3f', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 2 }}>
              {/* Schedule */}
              <div style={{ border: '1px solid #1a1810', background: '#f0f8ff', padding: 28 }}>
                <div className="font-mono" style={{ fontSize: 9, color: '#1a6fa8', letterSpacing: '0.2em', marginBottom: 20 }}>
                  PRODUCTION SCHEDULE
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th className="font-mono" style={{ fontSize: 8, color: '#5a8aaa', letterSpacing: '0.12em', textAlign: 'left', paddingBottom: 10, borderBottom: '1px solid #1a1810' }}>PHASE</th>
                      <th className="font-mono" style={{ fontSize: 8, color: '#5a8aaa', letterSpacing: '0.12em', textAlign: 'right', paddingBottom: 10, borderBottom: '1px solid #1a1810' }}>DAYS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.schedule.map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: '9px 0', fontSize: 13, color: '#2a5a7a', borderBottom: '1px solid #111010' }}>
                          {row.phase}
                        </td>
                        <td className="font-mono" style={{ padding: '9px 0', fontSize: 12, color: '#1a6fa8', textAlign: 'right', borderBottom: '1px solid #111010' }}>
                          {row.days}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="font-mono" style={{ paddingTop: 12, fontSize: 9, color: '#5a8aaa', letterSpacing: '0.1em' }}>TOTAL</td>
                      <td className="font-mono" style={{ paddingTop: 12, fontSize: 13, color: '#0f2a3f', textAlign: 'right', fontWeight: 600 }}>
                        {plan.schedule.reduce((s, r) => s + r.days, 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Crew */}
              <div style={{ border: '1px solid #1a1810', background: '#f0f8ff', padding: 28 }}>
                <div className="font-mono" style={{ fontSize: 9, color: '#1a6fa8', letterSpacing: '0.2em', marginBottom: 20 }}>
                  CORE CREW
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.crew.map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111010', paddingBottom: 8 }}>
                      <span style={{ fontSize: 13, color: '#2a5a7a' }}>{c.role}</span>
                      <span className="font-mono" style={{ fontSize: 12, color: '#1a6fa8' }}>×{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risks */}
            <div style={{ border: '1px solid #1a1810', background: '#f0f8ff', padding: 28, marginBottom: 2 }}>
              <div className="font-mono" style={{ fontSize: 9, color: '#1a6fa8', letterSpacing: '0.2em', marginBottom: 20 }}>
                ⚠ RISK ASSESSMENT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.risks.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span className="font-mono" style={{
                      fontSize: 8, letterSpacing: '0.1em',
                      color: riskColor(r.severity),
                      border: `1px solid ${riskColor(r.severity)}`,
                      padding: '2px 6px', flexShrink: 0, marginTop: 2,
                    }}>
                      {r.severity}
                    </span>
                    <span style={{ fontSize: 13, color: '#2a5a7a', lineHeight: 1.55 }}>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ border: '1px solid #1a1810', background: '#f0f8ff', padding: 28, marginBottom: 2 }}>
              <div className="font-mono" style={{ fontSize: 9, color: '#1a6fa8', letterSpacing: '0.2em', marginBottom: 20 }}>
                ✦ RECOMMENDATIONS
              </div>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.recommendations.map((rec, i) => (
                  <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span className="font-mono" style={{ fontSize: 9, color: '#5a8aaa', flexShrink: 0, marginTop: 3 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: 13, color: '#2a5a7a', lineHeight: 1.55 }}>{rec}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Strategy */}
            <div style={{ border: '1px solid #1a6fa818', background: '#e4f1fb', padding: 28 }}>
              <div className="font-mono" style={{ fontSize: 9, color: '#1a6fa8', letterSpacing: '0.2em', marginBottom: 14 }}>
                ◈ RECOMMENDED STRATEGY
              </div>
              <p style={{ fontSize: 14, color: '#2a6080', lineHeight: 1.7, fontStyle: 'italic' }}>
                {typedStrategy}
                {typedStrategy.length < plan.strategy.length && (
                  <span className="animate-blink" style={{ color: '#1a6fa8' }}>▌</span>
                )}
              </p>
            </div>

            {/* Footer tag */}
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: 9, color: '#8ab8d4', letterSpacing: '0.1em' }}>
                CINEPILOT AI — POWERED BY GEMINI + PARALLEL + GOOGLE CLOUD
              </span>
              <span className="font-mono" style={{ fontSize: 9, color: '#8ab8d4', letterSpacing: '0.1em' }}>
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
