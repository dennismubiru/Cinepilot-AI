import PptxGenJS from 'pptxgenjs'

const NAVY = '0f2a3f'
const BLUE = '1a6fa8'
const SKY = 'e8f4fd'
const PALE = 'f0f8ff'
const MUTED = '4a7a9b'
const LIGHT_MUTED = '8ab8d4'
const WHITE = 'FFFFFF'
const BORDER = 'b8d8ef'
const GREEN = '2e7d52'
const RED = 'c0392b'

function hex(c: string) { return c.replace('#', '') }

export async function generatePitchDeck() {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.title = 'CinePilot AI — Pitch Deck'
  pptx.author = 'CinePilot AI'

  // Shared helpers
  const monoFont = 'Courier New'
  const serifFont = 'Georgia'
  const sansFont = 'Calibri'

  const tagOpts = (text: string, x: number, y: number): PptxGenJS.TextPropsOptions => ({
    x, y, w: 3.5, h: 0.22,
    fontSize: 7, bold: true, fontFace: monoFont,
    color: BLUE, border: { pt: 1, color: BLUE },
    align: 'left', valign: 'middle',
  })

  // ─── Slide 1: Title ───────────────────────────────────────────────────────
  {
    const s = pptx.addSlide()
    s.background = { color: NAVY }

    // dot grid via many small shapes
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 20; col++) {
        s.addShape(pptx.ShapeType.ellipse, {
          x: col * 0.65 + 0.1, y: row * 0.56 + 0.1, w: 0.04, h: 0.04,
          fill: { color: BLUE, transparency: 75 }, line: { color: BLUE, transparency: 75 },
        })
      }
    }

    s.addText('🎬  CINEPILOT AI', {
      x: 0.5, y: 0.3, w: 4, h: 0.3,
      fontSize: 9, fontFace: monoFont, color: BLUE, bold: true,
    })

    s.addText('GOOGLE CLOUD × GEMINI HACKATHON', {
      x: 0.5, y: 1.1, w: 5, h: 0.22,
      fontSize: 7, fontFace: monoFont, color: BLUE,
      border: { pt: 1, color: BLUE },
    })

    s.addText('Lights. Camera.\nIntelligence.', {
      x: 0.5, y: 1.55, w: 8, h: 2.2,
      fontSize: 52, fontFace: serifFont, color: SKY, bold: true,
    })

    s.addText('In seconds.', {
      x: 0.5, y: 3.6, w: 5, h: 0.6,
      fontSize: 36, fontFace: serifFont, color: BLUE, italic: true,
    })

    s.addText(
      'An AI-powered film production planning agent that transforms a single brief into a complete, actionable production plan.',
      {
        x: 0.5, y: 4.4, w: 6.5, h: 0.8,
        fontSize: 13, fontFace: sansFont, color: LIGHT_MUTED,
      }
    )

    const tags = [['GEMINI', 'AI Brain'], ['PARALLEL', 'Research'], ['GOOGLE CLOUD', 'Platform']]
    tags.forEach(([label, sub], i) => {
      s.addText(label, { x: 0.5 + i * 2.2, y: 5.5, w: 2, h: 0.2, fontSize: 8, fontFace: monoFont, color: BLUE, bold: true })
      s.addText(sub, { x: 0.5 + i * 2.2, y: 5.75, w: 2, h: 0.18, fontSize: 9, fontFace: sansFont, color: MUTED })
    })
  }

  // ─── Slide 2: The Problem ─────────────────────────────────────────────────
  {
    const s = pptx.addSlide()
    s.background = { color: SKY }

    s.addText('THE PROBLEM', tagOpts('', 0.5, 0.35))
    s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.7, w: 0.35, h: 0.04, fill: { color: BLUE }, line: { color: BLUE } })

    s.addText('Film production planning is slow, fragmented, and expensive.', {
      x: 0.5, y: 0.88, w: 8, h: 1.4,
      fontSize: 32, fontFace: serifFont, color: NAVY, bold: true,
    })

    const stats = [
      { n: '94', unit: ' days', label: 'Average pre-production timeline for a $500K feature' },
      { n: '23%', unit: '', label: 'of productions go over budget due to poor planning' },
      { n: '6+', unit: ' vendors', label: 'A producer must coordinate just to get a location plan' },
    ]
    stats.forEach(({ n, unit, label }, i) => {
      const x = 0.5 + i * 3.3
      s.addShape(pptx.ShapeType.rect, { x, y: 2.5, w: 3.1, h: 2.4, fill: { color: PALE }, line: { pt: 1, color: hex(BORDER) } })
      s.addText(n + unit, { x, y: 2.6, w: 3.1, h: 0.8, fontSize: 34, fontFace: serifFont, color: BLUE, bold: true, align: 'center' })
      s.addText(label, { x, y: 3.45, w: 3.1, h: 1.3, fontSize: 11, fontFace: sansFont, color: MUTED, align: 'center', valign: 'top' })
    })

    s.addText('Producers spend weeks gathering location data, crew costs, logistics, and risk assessments — manually.', {
      x: 0.5, y: 5.15, w: 9.5, h: 0.4,
      fontSize: 11, fontFace: sansFont, color: LIGHT_MUTED, italic: true,
    })
  }

  // ─── Slide 3: The Solution ────────────────────────────────────────────────
  {
    const s = pptx.addSlide()
    s.background = { color: PALE }

    s.addText('THE SOLUTION', tagOpts('', 0.5, 0.35))
    s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.7, w: 0.35, h: 0.04, fill: { color: BLUE }, line: { color: BLUE } })

    s.addText('One brief.\nA complete production plan.', {
      x: 0.5, y: 0.88, w: 4.8, h: 1.6,
      fontSize: 28, fontFace: serifFont, color: NAVY, bold: true,
    })

    s.addText(
      'CinePilot AI is a deterministic multi-step agent that understands a natural language production request and orchestrates research, reasoning, and validation to produce a ready-to-use plan.',
      { x: 0.5, y: 2.6, w: 4.8, h: 1.2, fontSize: 12, fontFace: sansFont, color: MUTED }
    )

    s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.95, w: 4.8, h: 0.9, fill: { color: hex(SKY) }, line: { pt: 1, color: hex(BORDER) } })
    s.addText('"Plan a 30-day film in Kampala\nwith a $500,000 budget."', {
      x: 0.6, y: 4.0, w: 4.6, h: 0.8, fontSize: 12, fontFace: monoFont, color: '1a5a8a',
    })

    const outputs = [
      '📍  Location analysis & logistics',
      '📅  Full production schedule',
      '👥  Core crew requirements',
      '⚠   Risk assessment with severity',
      '✦   Actionable recommendations',
      '◈   Recommended production strategy',
    ]
    outputs.forEach((text, i) => {
      s.addShape(pptx.ShapeType.rect, { x: 5.6, y: 0.85 + i * 0.78, w: 4.2, h: 0.6, fill: { color: SKY }, line: { pt: 1, color: hex(BORDER) } })
      s.addText(text, { x: 5.7, y: 0.88 + i * 0.78, w: 4.0, h: 0.55, fontSize: 12, fontFace: sansFont, color: '2a5a7a', valign: 'middle' })
    })
  }

  // ─── Slide 4: How It Works ────────────────────────────────────────────────
  {
    const s = pptx.addSlide()
    s.background = { color: SKY }

    s.addText('HOW IT WORKS', tagOpts('', 0.5, 0.35))
    s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.7, w: 0.35, h: 0.04, fill: { color: BLUE }, line: { color: BLUE } })
    s.addText('A deterministic 6-step agent pipeline', {
      x: 0.5, y: 0.88, w: 9, h: 0.7, fontSize: 26, fontFace: serifFont, color: NAVY, bold: true,
    })

    const steps = [
      { n: '01', label: 'UNDERSTAND', detail: 'Gemini parses the production brief', color: BLUE },
      { n: '02', label: 'EXTRACT', detail: 'Pulls location, budget, timeline, type', color: BLUE },
      { n: '03', label: 'RESEARCH', detail: 'Parallel queries location data & logistics', color: '1a5a8a' },
      { n: '04', label: 'ANALYZE', detail: 'Gemini reasons over research results', color: BLUE },
      { n: '05', label: 'VALIDATE', detail: 'Cross-checks budget and risk constraints', color: BLUE },
      { n: '06', label: 'GENERATE', detail: 'Produces the structured production plan', color: GREEN },
    ]

    steps.forEach(({ n, label, detail, color }, i) => {
      const x = 0.3 + i * 1.65
      s.addShape(pptx.ShapeType.rect, { x, y: 1.75, w: 1.55, h: 2.8, fill: { color: PALE }, line: { pt: 1, color: hex(BORDER) } })
      s.addText(n, { x, y: 1.88, w: 1.55, h: 0.55, fontSize: 28, fontFace: serifFont, color: hex(color), bold: true, align: 'center' })
      s.addText(label, { x, y: 2.5, w: 1.55, h: 0.3, fontSize: 7, fontFace: monoFont, color: hex(color), bold: true, align: 'center' })
      s.addText(detail, { x, y: 2.88, w: 1.55, h: 1.5, fontSize: 9.5, fontFace: sansFont, color: MUTED, align: 'center', valign: 'top' })
      if (i < 5) {
        s.addShape(pptx.ShapeType.rect, { x: x + 1.55, y: 3.1, w: 0.1, h: 0.02, fill: { color: hex(BORDER) }, line: { color: hex(BORDER) } })
      }
    })

    s.addShape(pptx.ShapeType.rect, { x: 0.3, y: 4.75, w: 9.9, h: 0.7, fill: { color: PALE }, line: { pt: 1, color: hex(BORDER) } })
    s.addText('KEY PRINCIPLE', { x: 0.5, y: 4.82, w: 1.5, h: 0.18, fontSize: 7, fontFace: monoFont, color: BLUE, bold: true })
    s.addText(
      'This is not a chatbot. Every step is deterministic and produces structured output — demonstrating true agent orchestration.',
      { x: 2.1, y: 4.82, w: 8, h: 0.55, fontSize: 11, fontFace: sansFont, color: MUTED }
    )
  }

  // ─── Slide 5: Architecture ────────────────────────────────────────────────
  {
    const s = pptx.addSlide()
    s.background = { color: PALE }

    s.addText('ARCHITECTURE', tagOpts('', 0.5, 0.35))
    s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.7, w: 0.35, h: 0.04, fill: { color: BLUE }, line: { color: BLUE } })
    s.addText('Built on Google Cloud\'s agent platform', {
      x: 0.5, y: 0.88, w: 5.5, h: 1.1, fontSize: 26, fontFace: serifFont, color: NAVY, bold: true,
    })

    s.addText(
      'The architecture places Gemini Enterprise Agent Platform at the center, orchestrating calls to Parallel for real-world research and Google Cloud services — satisfying the hackathon\'s runtime integration requirement.',
      { x: 0.5, y: 2.1, w: 5.2, h: 1.2, fontSize: 11.5, fontFace: sansFont, color: MUTED }
    )

    const layers = [
      ['Frontend', 'React + Vite + Tailwind CSS v4'],
      ['Agent Brain', 'Gemini via Google Cloud Agent Platform'],
      ['Partner', 'Parallel — web research & data retrieval'],
      ['Backend', 'FastAPI on Google Cloud Run'],
    ]
    layers.forEach(([layer, tech], i) => {
      s.addText(layer, { x: 0.5, y: 3.45 + i * 0.52, w: 1.4, h: 0.38, fontSize: 8, fontFace: monoFont, color: LIGHT_MUTED })
      s.addShape(pptx.ShapeType.rect, { x: 2.0, y: 3.42 + i * 0.52, w: 3.6, h: 0.36, fill: { color: hex(SKY) }, line: { pt: 1, color: hex(BORDER) } })
      s.addText(tech, { x: 2.1, y: 3.44 + i * 0.52, w: 3.4, h: 0.32, fontSize: 10, fontFace: sansFont, color: '2a5a7a', valign: 'middle' })
    })

    // Flow diagram
    const nodes = [
      { label: 'USER', sub: 'Production Brief', bg: SKY, textColor: NAVY },
      { label: 'WEB APP', sub: 'React Frontend', bg: SKY, textColor: NAVY },
      { label: 'GEMINI AGENT', sub: 'Google Cloud Agent Platform', bg: BLUE, textColor: WHITE },
      { label: 'PARALLEL', sub: 'Research & Data', bg: SKY, textColor: NAVY },
      { label: 'GEMINI REASONING', sub: 'Analysis & Validation', bg: 'ddeef9', textColor: NAVY },
      { label: 'PRODUCTION PLAN', sub: 'Structured Output', bg: GREEN, textColor: WHITE },
    ]
    nodes.forEach(({ label, sub, bg, textColor }, i) => {
      const y = 0.6 + i * 0.88
      s.addShape(pptx.ShapeType.rect, { x: 6.2, y, w: 3.5, h: 0.62, fill: { color: hex(bg) }, line: { pt: 1, color: hex(BORDER) } })
      s.addText(label, { x: 6.2, y: y + 0.04, w: 3.5, h: 0.28, fontSize: 8, fontFace: monoFont, color: hex(textColor), bold: true, align: 'center' })
      s.addText(sub, { x: 6.2, y: y + 0.32, w: 3.5, h: 0.22, fontSize: 9, fontFace: sansFont, color: i === 2 || i === 5 ? 'aaccdd' : MUTED, align: 'center' })
      if (i < nodes.length - 1) {
        s.addShape(pptx.ShapeType.rect, { x: 7.8, y: y + 0.62, w: 0.02, h: 0.26, fill: { color: hex(BORDER) }, line: { color: hex(BORDER) } })
      }
    })
  }

  // ─── Slide 6: Demo Output ─────────────────────────────────────────────────
  {
    const s = pptx.addSlide()
    s.background = { color: SKY }

    s.addText('DEMO OUTPUT', tagOpts('', 0.5, 0.35))
    s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.7, w: 0.35, h: 0.04, fill: { color: BLUE }, line: { color: BLUE } })
    s.addText('What the agent produces', {
      x: 0.5, y: 0.88, w: 9, h: 0.65, fontSize: 26, fontFace: serifFont, color: NAVY, bold: true,
    })

    // Input
    s.addShape(pptx.ShapeType.rect, { x: 0.3, y: 1.7, w: 4.7, h: 2.0, fill: { color: PALE }, line: { pt: 1, color: hex(BORDER) } })
    s.addText('INPUT — PRODUCTION BRIEF', { x: 0.5, y: 1.8, w: 4.3, h: 0.22, fontSize: 7, fontFace: monoFont, color: MUTED, bold: true })
    s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.1, w: 4.3, h: 1.4, fill: { color: hex(SKY) }, line: { pt: 1, color: hex(BORDER) } })
    s.addText('"Plan a 30-day narrative feature\nto be filmed in Kampala and\nNairobi with a $500,000 budget."', {
      x: 0.6, y: 2.18, w: 4.1, h: 1.25, fontSize: 11, fontFace: monoFont, color: '1a5a8a',
    })

    // Schedule
    s.addShape(pptx.ShapeType.rect, { x: 5.3, y: 1.7, w: 4.4, h: 2.0, fill: { color: PALE }, line: { pt: 1, color: hex(BORDER) } })
    s.addText('PRODUCTION SCHEDULE', { x: 5.5, y: 1.8, w: 4.0, h: 0.22, fontSize: 7, fontFace: monoFont, color: BLUE, bold: true })
    const schedule = [['Pre-production', '14 days'], ['Location scouting', '5 days'], ['Casting & rehearsals', '7 days'], ['Principal photography', '30 days'], ['Post-production', '45 days']]
    schedule.forEach(([phase, days], i) => {
      s.addText(phase, { x: 5.5, y: 2.12 + i * 0.28, w: 2.8, h: 0.25, fontSize: 10, fontFace: sansFont, color: '2a5a7a' })
      s.addText(days, { x: 8.3, y: 2.12 + i * 0.28, w: 1.2, h: 0.25, fontSize: 10, fontFace: monoFont, color: BLUE, align: 'right' })
    })

    // Risks
    s.addShape(pptx.ShapeType.rect, { x: 0.3, y: 3.85, w: 4.7, h: 1.75, fill: { color: PALE }, line: { pt: 1, color: hex(BORDER) } })
    s.addText('⚠  RISK ASSESSMENT', { x: 0.5, y: 3.95, w: 4.3, h: 0.22, fontSize: 7, fontFace: monoFont, color: BLUE, bold: true })
    const risks = [
      { s: 'HIGH', t: 'Permit delays — start applications 8 weeks early', c: RED },
      { s: 'MED', t: 'Seasonal rainfall — build 4-day weather buffer', c: BLUE },
      { s: 'LOW', t: 'Transport adds ~$18K to logistics budget', c: GREEN },
    ]
    risks.forEach(({ s: sev, t, c }, i) => {
      s.addText(sev, { x: 0.5, y: 4.25 + i * 0.42, w: 0.48, h: 0.28, fontSize: 7, fontFace: monoFont, color: hex(c), bold: true, border: { pt: 1, color: hex(c) }, align: 'center', valign: 'middle' })
      s.addText(t, { x: 1.08, y: 4.25 + i * 0.42, w: 3.7, h: 0.28, fontSize: 10, fontFace: sansFont, color: '2a5a7a', valign: 'middle' })
    })

    // Strategy
    s.addShape(pptx.ShapeType.rect, { x: 5.3, y: 3.85, w: 4.4, h: 1.75, fill: { color: 'ddeef9' }, line: { pt: 1, color: hex(BORDER) } })
    s.addText('◈  STRATEGY', { x: 5.5, y: 3.95, w: 4.0, h: 0.22, fontSize: 7, fontFace: monoFont, color: BLUE, bold: true })
    s.addText('Kampala: 60% of filming — lower accommodation costs, authentic local texture. Nairobi: 40% for key infrastructure sequences. Total: 101 days end-to-end. Reserve $60,000 (12%) as contingency.', {
      x: 5.5, y: 4.28, w: 4.0, h: 1.2, fontSize: 11, fontFace: sansFont, color: '1a5a8a', italic: true,
    })
  }

  // ─── Slide 7: Why It Scores ───────────────────────────────────────────────
  {
    const s = pptx.addSlide()
    s.background = { color: PALE }

    s.addText('WHY IT SCORES', tagOpts('', 0.5, 0.35))
    s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.7, w: 0.35, h: 0.04, fill: { color: BLUE }, line: { color: BLUE } })
    s.addText('Meets every judging criterion', {
      x: 0.5, y: 0.88, w: 9, h: 0.7, fontSize: 28, fontFace: serifFont, color: NAVY, bold: true,
    })

    const criteria = [
      { criterion: 'Gemini / Google Cloud Agent Platform', detail: 'Gemini is the agent brain for understanding, reasoning, and generation. Hosted on Google Cloud Agent Builder.' },
      { criterion: 'Partner technology integration', detail: 'Parallel is actually called in the Research step — not just mentioned in the README. Real runtime use.' },
      { criterion: 'Real media & entertainment use case', detail: 'Film production planning is a concrete, high-value workflow used by real producers every day.' },
      { criterion: 'Deterministic multi-step agent', detail: 'Six sequential steps with structured output at each stage. Not a chatbot — a proper agent orchestration.' },
    ]

    criteria.forEach(({ criterion, detail }, i) => {
      const x = 0.3 + (i % 2) * 5.0
      const y = 1.85 + Math.floor(i / 2) * 2.1
      s.addShape(pptx.ShapeType.rect, { x, y, w: 4.7, h: 1.9, fill: { color: hex(SKY) }, line: { pt: 1, color: hex(BORDER) } })
      s.addText('MET', { x: x + 3.8, y: y + 0.12, w: 0.7, h: 0.24, fontSize: 7, fontFace: monoFont, color: GREEN, bold: true, border: { pt: 1, color: GREEN }, align: 'center' })
      s.addText(criterion, { x: x + 0.18, y: y + 0.12, w: 3.5, h: 0.5, fontSize: 9, fontFace: monoFont, color: MUTED, bold: true })
      s.addText(detail, { x: x + 0.18, y: y + 0.72, w: 4.3, h: 1.1, fontSize: 11, fontFace: sansFont, color: '2a5a7a' })
    })
  }

  // ─── Slide 8: Closing ─────────────────────────────────────────────────────
  {
    const s = pptx.addSlide()
    s.background = { color: NAVY }

    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 20; col++) {
        s.addShape(pptx.ShapeType.ellipse, {
          x: col * 0.65 + 0.1, y: row * 0.56 + 0.1, w: 0.04, h: 0.04,
          fill: { color: BLUE, transparency: 75 }, line: { color: BLUE, transparency: 75 },
        })
      }
    }

    s.addText('🎬  CINEPILOT AI', {
      x: 0.5, y: 0.3, w: 4, h: 0.3, fontSize: 9, fontFace: monoFont, color: BLUE, bold: true,
    })

    s.addText('The film industry runs\non great planning.\nNow it runs on AI.', {
      x: 0.5, y: 1.0, w: 8.5, h: 3.2, fontSize: 42, fontFace: serifFont, color: SKY, bold: true,
    })

    s.addText('CinePilot AI — a Summer Blockbuster Hackathon submission demonstrating real agent orchestration with Gemini and Parallel on Google Cloud.', {
      x: 0.5, y: 4.2, w: 7, h: 0.9, fontSize: 13, fontFace: sansFont, color: LIGHT_MUTED,
    })

    const stats = [['6', 'AGENT STEPS'], ['2', 'AI INTEGRATIONS'], ['∞', 'PRODUCTIONS PLANNED']]
    stats.forEach(([n, l], i) => {
      s.addText(n, { x: 0.5 + i * 2.2, y: 5.35, w: 2, h: 0.7, fontSize: 36, fontFace: serifFont, color: BLUE, bold: true })
      s.addText(l, { x: 0.5 + i * 2.2, y: 6.05, w: 2, h: 0.22, fontSize: 7, fontFace: monoFont, color: MUTED })
    })
  }

  await pptx.writeFile({ fileName: 'CinePilot_AI_PitchDeck.pptx' })
}
