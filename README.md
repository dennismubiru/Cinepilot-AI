 # CinePilot AI

A film production intelligence agent built for the **Google Cloud × Gemini Summer Blockbuster Hackathon**.

CinePilot AI gives producers two powerful workflows in one tool: a **Production Planner** that turns a natural-language brief into a full production plan, and a **Movie Concept Developer** that builds a complete creative package — genre, story, characters, and casting — from a rough idea.

---

## Modes

### Production Planner

Enter a natural-language production brief and the agent runs a six-step pipeline to produce a structured, actionable production plan.

**Example input:**
> "Plan a 45-day documentary in Lagos with a $250,000 budget."

### Movie Concept Developer

Enter a movie idea and the agent develops a full creative development package in five steps.

**Example input:**
> "I want to make a futuristic robotics thriller set in Kampala and Nairobi with a $2 million budget."

---

## Features

### Agent Pipelines

Both modes display a **horizontal status bar** showing each pipeline step as a circular node that turns green on completion. The active step's detail is shown below the bar in real time.

**Production Planner — 6 steps:**

| Step | Agent | Description |
|------|-------|-------------|
| UNDERSTAND REQUEST | Gemini | Parses the production brief |
| EXTRACT PARAMETERS | Gemini | Identifies location, budget, crew, timeline |
| RESEARCH VIA PARALLEL | Parallel | Queries location data, weather, logistics |
| ANALYZE & REASON | Gemini | Evaluates tradeoffs and constraints |
| VALIDATE PLAN | Gemini | Cross-checks budget allocation and risks |
| GENERATE OUTPUT | Gemini | Produces the final production plan |

**Concept Developer — 5 steps:**

| Step | Agent | Description |
|------|-------|-------------|
| PARSE CONCEPT BRIEF | Gemini | Identifies genre signals and location context |
| DEVELOP STORY CONCEPT | Gemini | Generates title, logline, theme |
| BUILD CHARACTER ROSTER | Gemini | Architects protagonist, antagonist, supporting cast |
| RESEARCH CASTING VIA PARALLEL | Parallel | Scans filmographies and market positioning |
| COMPILE CONCEPT PACKAGE | Gemini | Assembles final creative development document |

---

### Production Plan Output

- Extracted parameters (location, budget, type, duration)
- Phase-by-phase production schedule with day counts
- Core crew roster
- Risk assessment with HIGH / MED / LOW severity ratings
- Numbered recommendations
- Recommended production strategy (typewriter reveal)

### Concept Development Output

Four structured sections delivered after the pipeline completes:

1. **Genre** — Primary genre tag + secondary genre labels
2. **Story Concept** — Title, logline, setting, theme, and target audience
3. **Main Characters** — Tabular roster with role badges colour-coded by function (Protagonist, Antagonist, Co-protagonist, etc.)
4. **Casting Suggestions** — Toggle between *fictional casting profiles* (age range + ideal profile type) and *real actor suggestions* researched via Parallel. All suggestions carry a clear disclaimer that no actor has agreed to participate.

---

### Interactive Budget Breakdown

Donut chart splitting the total budget across six categories: Crew & Talent, Locations & Permits, Equipment & Gear, Logistics & Travel, Post-production, and Contingency. Drag sliders to reallocate — percentages auto-balance to 100% in real time.

### Risk Score Meter

SVG arc gauge (0–100) calculating a live risk score from:
- Number and severity of identified risks (HIGH +22, MED +10, LOW +4)
- Shoot duration
- Budget headroom
- Location logistics complexity

Colour-coded LOW / MODERATE / HIGH with expandable factor-by-factor breakdown.

### Crew & Casting Finder

Location-aware directory covering **Kampala, Nairobi, Lagos, and Accra**, organised across two tabs:

**Core Crew tab** — Named individual crew members with:
- Role (Director of Photography, 1st Assistant Director, Production Designer, Sound Mixer, Gaffer, Script Supervisor, Production Manager)
- Day rate in local currency
- Availability status (Available / Booked until / On request)
- Skill pills
- Expandable credits list

**Director of Photography, Production Manager, and Script Supervisor cards are clickable** — opening a full profile modal with bio, equipment/tools kit, numbered workflow standards, credits, and contact details.

**Companies & Services tab** — Production companies, talent agencies, equipment rental houses, local fixers, and post-production studios. Filterable by contact type. Falls back to international contacts for other locations.

### PDF Export

One-click export of a formatted production brief PDF:
- Dark cover page with location, budget, and production type
- Production schedule table and crew roster
- Risk assessment with colour-coded severity badges
- Numbered recommendations and strategy block
- Named `CinePilot_{Location}_ProductionPlan.pdf`

---

## Architecture

```
User
 ├── Production Planner → Gemini (understand) → Parallel (research) → Gemini (analyze/validate) → Plan
 └── Concept Developer → Gemini (genre/story/characters) → Parallel (casting research) → Concept Package
```

Both workflows follow the hackathon's required deterministic multi-step pattern:

```
User → Agent → Task planning → Partner API → Data → Reasoning → Validation → Final result
```

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS v4 |
| PDF Export | jsPDF |
| AI Brain | Gemini via Google Cloud Agent Platform |
| Partner | Parallel (research / data retrieval) |
| Deployment | Google Cloud |

---

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server runs on the port set by `$PORT` (default 8443).

---

## Project structure

```
src/
  App.tsx                   # Application shell, mode toggle, Production Planner pipeline + output
  MovieConceptDeveloper.tsx  # Concept Developer pipeline, genre/story/character/casting output
  BudgetBreakdown.tsx        # Interactive donut chart + budget sliders
  RiskScoreMeter.tsx         # SVG arc gauge with factor breakdown
  CrewFinder.tsx             # Core Crew profiles + Companies & Services directory
  ExportPDF.tsx              # jsPDF production plan export
  index.css                  # Global styles and Tailwind CSS v4 import
  main.tsx                   # React entrypoint

scripts/
  generate-pptx.mjs          # Generates CinePilot_AI_PitchDeck.pptx
  generate-video.mjs         # Generates CinePilot_AI_Presentation.mp4
  slides.html                # HTML slide source for the video generator
```

---

## Generating pitch materials

```bash
# PowerPoint pitch deck → output/CinePilot_AI_PitchDeck.pptx
node scripts/generate-pptx.mjs

# 3-minute video presentation → output/CinePilot_AI_Presentation.mp4
node scripts/generate-video.mjs
```

---

## Hackathon criteria

| Criterion | Implementation |
|-----------|---------------|
| Gemini / Google Cloud Agent Platform | Core reasoning agent across both pipeline modes |
| Partner integration (Parallel) | Research step in both pipelines; crew directory sourcing |
| Real media & entertainment use case | Film production planning and creative development |
| Multi-step agentic workflow | Six-step Production Planner + five-step Concept Developer, each with status bar |
| Working integration | Partner API called at the research step in both workflows |
