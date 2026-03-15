import { Link } from '@inertiajs/react'
import { useState, useCallback } from 'react'
import AppLayout from '~/layouts/app_layout'

interface Props {
  plan: any
  idea: any
}

const STEPS = [
  { key: 'mvp', label: 'MVP', num: '01' },
  { key: 'features', label: 'Fonctionnalites', num: '02' },
  { key: 'marketing', label: 'Marketing', num: '03' },
  { key: 'roadmap', label: 'Roadmap', num: '04' },
  { key: 'kpis', label: 'Metriques', num: '05' },
]

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function StructuredPlanPage({ plan, idea }: Props) {
  const [step, setStep] = useState(0)
  const content = plan?.content

  const go = useCallback((i: number) => {
    if (i >= 0 && i < STEPS.length) setStep(i)
  }, [])

  if (!content || plan.status !== 'completed') {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4">
          <BackLink slug={idea.slug} />
          <div className="animate-pulse space-y-6 mt-12">
            <div className="h-5 w-48 bg-nb-border/30 rounded" />
            <div className="h-3 w-96 bg-nb-border/20 rounded" />
            <div className="h-64 bg-nb-border/10 rounded-2xl mt-8" />
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4">
        <BackLink slug={idea.slug} />

        {/* Hero */}
        <div className="mt-6 mb-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-nb-gray-600 mb-3">Plan structure</p>
          <h1 className="text-[28px] md:text-[34px] font-extrabold text-nb-white leading-[1.15] mb-2">{idea.title}</h1>
          <p className="text-[14px] text-nb-gray-500">v{plan.version}</p>
        </div>

        {/* Layout */}
        <div className="flex gap-12">
          {/* Sidebar nav — desktop */}
          <nav className="hidden md:block w-48 flex-shrink-0 sticky top-8 self-start">
            <div className="space-y-1">
              {STEPS.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => go(i)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                    i === step ? 'bg-nb-surface' : 'hover:bg-nb-surface/50'
                  }`}
                >
                  <span className={`text-[11px] font-mono tabular-nums transition-colors ${
                    i === step ? 'text-nb-red' : i < step ? 'text-nb-gray-500' : 'text-nb-gray-600'
                  }`}>{s.num}</span>
                  <span className={`text-[13px] transition-colors ${
                    i === step ? 'text-nb-white font-medium' : 'text-nb-gray-500 group-hover:text-nb-gray-300'
                  }`}>{s.label}</span>
                  {i < step && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-nb-green ml-auto">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 px-3">
              <div className="h-[2px] bg-nb-border rounded-full overflow-hidden">
                <div className="h-full bg-nb-red rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
              </div>
              <p className="text-[11px] text-nb-gray-600 mt-2">{step + 1} sur {STEPS.length}</p>
            </div>
          </nav>

          {/* Mobile nav */}
          <div className="md:hidden flex gap-1.5 overflow-x-auto pb-4 mb-2 -mx-4 px-4 scrollbar-none">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => go(i)}
                className={`flex-shrink-0 text-[12px] px-3.5 py-2 rounded-full transition-all ${
                  i === step ? 'bg-nb-white text-nb-black font-medium' : 'text-nb-gray-500 hover:text-nb-gray-300'
                }`}
              >{s.label}</button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pb-16">
            {step === 0 && <StepMvp mvp={content.mvp} />}
            {step === 1 && <StepFeatures mvp={content.mvp} />}
            {step === 2 && <StepMarketing marketing={content.marketingPlan} />}
            {step === 3 && <StepRoadmap roadmap={content.launchRoadmap} />}
            {step === 4 && <StepKpis marketing={content.marketingPlan} />}

            {/* Footer nav */}
            <div className="flex items-center justify-between mt-16 pt-6 border-t border-nb-border/50">
              <button
                onClick={() => go(step - 1)}
                disabled={step === 0}
                className="flex items-center gap-2 text-[13px] text-nb-gray-400 hover:text-nb-white disabled:text-nb-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
                {step > 0 && STEPS[step - 1].label}
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => go(step + 1)}
                  className="flex items-center gap-2 text-[13px] font-medium text-nb-white bg-nb-surface border border-nb-border hover:border-nb-gray-500 px-5 py-2.5 rounded-lg transition-colors"
                >
                  {STEPS[step + 1].label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              ) : (
                <Link
                  href={`/ideas/${idea.slug}`}
                  className="flex items-center gap-2 text-[13px] font-medium text-nb-white bg-nb-red hover:bg-nb-red-hover px-5 py-2.5 rounded-lg transition-colors"
                >
                  Retour a l'idee
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

/* ═══════════════════════════════════════════════════════════
   STEP 01 — MVP
   ═══════════════════════════════════════════════════════════ */

const PHASE_COLORS = [
  'bg-nb-red',
  'bg-nb-orange',
  'bg-nb-blue',
  'bg-nb-purple',
  'bg-nb-green',
  'bg-nb-yellow',
]

function parseBudget(field: any): { total: string; categories?: { name: string; emoji: string; items: string[] }[] } {
  if (!field) return { total: '' }
  if (typeof field === 'string') return { total: field }
  if (field.total) return { total: field.total, categories: field.categories }
  if (field.value) return { total: field.value }
  return { total: '' }
}

function parseTimeline(field: any): { total: string; phases?: { name: string; duration: string }[] } {
  if (!field) return { total: '' }
  if (typeof field === 'string') return { total: field }
  if (field.total) return { total: field.total, phases: field.phases }
  if (field.value) return { total: field.value }
  return { total: '' }
}

function StepMvp({ mvp }: { mvp: any }) {
  const [activePhase, setActivePhase] = useState<number | null>(null)

  if (!mvp) return null

  const budget = parseBudget(mvp.estimatedBudget)
  const timeline = parseTimeline(mvp.estimatedTimeline)

  return (
    <div>
      <StepHeader num="01" title="Resume du MVP" />

      {/* Emoji + Summary */}
      <div className="mb-12">
        {mvp.emoji && (
          <span className="text-[48px] leading-none block mb-5">{mvp.emoji}</span>
        )}
        <p className="text-[16px] md:text-[17px] text-nb-gray-300 leading-[1.9]">
          {mvp.summary}
        </p>
      </div>

      {/* ── Budget ── */}
      {budget.total && (
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-1">
            <p className="text-[11px] uppercase tracking-[0.1em] text-nb-gray-600">Budget</p>
          </div>
          <p className="text-[22px] font-extrabold text-nb-white tracking-tight mb-1">
            Total estime : {budget.total}
          </p>

          {budget.categories && budget.categories.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-[0.12em] text-nb-gray-600 mt-4 mb-3">Structure de couts</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {budget.categories.map((cat, i) => (
                  <div key={i} className="bg-nb-surface border border-nb-border rounded-xl p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="text-[20px] leading-none">{cat.emoji}</span>
                      <h4 className="text-[13px] font-semibold text-nb-white">{cat.name}</h4>
                    </div>
                    <div className="space-y-1">
                      {cat.items.map((item, j) => (
                        <p key={j} className="text-[12px] text-nb-gray-400 leading-[1.6]">{item}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Timeline ── */}
      {timeline.total && (
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            <p className="text-[11px] uppercase tracking-[0.1em] text-nb-gray-600">Duree</p>
          </div>
          <p className="text-[22px] font-extrabold text-nb-white tracking-tight mb-4">
            Total : {timeline.total}
          </p>

          {timeline.phases && timeline.phases.length > 0 && (
            <div className="mt-2">
              {/* ── Gantt bars ── */}
              <div className="flex h-12 rounded-xl overflow-hidden border border-nb-border">
                {timeline.phases.map((phase, i) => {
                  const isActive = activePhase === i
                  const color = PHASE_COLORS[i % PHASE_COLORS.length]
                  return (
                    <button
                      key={i}
                      onClick={() => setActivePhase(isActive ? null : i)}
                      className={`relative flex-1 ${color} transition-all duration-300 flex items-center justify-center group cursor-pointer ${
                        isActive ? 'flex-[2]' : activePhase !== null ? 'opacity-50' : ''
                      }`}
                      style={{ minWidth: 0 }}
                    >
                      {/* Separator */}
                      {i > 0 && <div className="absolute left-0 top-2 bottom-2 w-px bg-black/20" />}

                      <div className="flex flex-col items-center gap-0.5 px-1 overflow-hidden">
                        <span className={`font-bold text-white/95 transition-all whitespace-nowrap ${isActive ? 'text-[13px]' : 'text-[11px]'}`}>
                          {phase.duration}
                        </span>
                        {isActive && (
                          <span className="text-[10px] text-white/70 whitespace-nowrap truncate max-w-full">
                            {phase.name}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* ── Step indicators ── */}
              <div className="flex mt-2.5">
                {timeline.phases.map((phase, i) => {
                  const isActive = activePhase === i
                  return (
                    <div key={i} className="flex-1 min-w-0 flex justify-center">
                      <button
                        onClick={() => setActivePhase(isActive ? null : i)}
                        className={`text-[10px] transition-all truncate max-w-full px-1 ${
                          isActive ? 'text-nb-white font-medium' : 'text-nb-gray-600 hover:text-nb-gray-400'
                        }`}
                      >
                        {phase.name}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* ── Detail panel ── */}
              {activePhase !== null && timeline.phases[activePhase] && (
                <div className="mt-4 rounded-xl border border-nb-border bg-nb-surface px-5 py-4 animate-[fadeIn_200ms_ease-out]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${PHASE_COLORS[activePhase % PHASE_COLORS.length]}`} />
                      <h4 className="text-[14px] font-semibold text-nb-white">{timeline.phases[activePhase].name}</h4>
                    </div>
                    <span className="text-[13px] text-nb-gray-400 tabular-nums">{timeline.phases[activePhase].duration}</span>
                  </div>
                  <p className="text-[12px] text-nb-gray-500 ml-6">
                    Phase {activePhase + 1} sur {timeline.phases.length}
                    {activePhase === timeline.phases.length - 1 && (
                      <span className="text-nb-green ml-2">— Phase finale</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   STEP 02 — FEATURES
   Style: Split layout — green "Build" vs red "Skip"
   ═══════════════════════════════════════════════════════════ */

function StepFeatures({ mvp }: { mvp: any }) {
  if (!mvp) return null

  return (
    <div>
      <StepHeader num="02" title="Fonctionnalites" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Left — Build */}
        {mvp.coreFeatures?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-nb-green" />
              <p className="text-[12px] uppercase tracking-[0.12em] text-nb-green font-semibold">A construire</p>
            </div>

            <div className="space-y-6">
              {mvp.coreFeatures.map((f: any, i: number) => (
                <div key={i} className="relative">
                  {/* Numbered connector */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <span className="w-8 h-8 rounded-full border-2 border-nb-green/30 bg-nb-green/5 flex items-center justify-center">
                        <span className="text-[12px] font-bold text-nb-green">{i + 1}</span>
                      </span>
                      {i < mvp.coreFeatures.length - 1 && (
                        <div className="w-px h-6 bg-nb-border/50 mt-2" />
                      )}
                    </div>
                    <div className="pt-1 flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap mb-1">
                        <h4 className="text-[15px] font-semibold text-nb-white">{f.feature}</h4>
                        {f.tool && (
                          <span className="text-[10px] text-nb-gray-500 font-mono tracking-wide">{f.tool}</span>
                        )}
                      </div>
                      <p className="text-[13px] text-nb-gray-400 leading-[1.7]">{f.why}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right — Skip */}
        {mvp.excludeFromMvp?.length > 0 && (
          <div className="lg:border-l lg:border-nb-border/50 lg:pl-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-nb-red" />
              <p className="text-[12px] uppercase tracking-[0.12em] text-nb-red font-semibold">Hors MVP</p>
            </div>

            <div className="space-y-4">
              {mvp.excludeFromMvp.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-3 group">
                  <span className="text-nb-red/40 text-[14px] leading-none mt-0.5 group-hover:text-nb-red transition-colors">×</span>
                  <p className="text-[13px] text-nb-gray-500 leading-[1.6] group-hover:text-nb-gray-400 transition-colors">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   STEP 03 — MARKETING
   Style: Hero angle, channel flow, staggered content grid
   ═══════════════════════════════════════════════════════════ */

function StepMarketing({ marketing }: { marketing: any }) {
  if (!marketing) return null

  return (
    <div>
      <StepHeader num="03" title="Plan marketing" />

      {/* Angle — oversized quote */}
      {marketing.primaryAngle && (
        <div className="relative mb-14">
          <span className="absolute -top-4 -left-2 text-[72px] leading-none font-serif text-nb-red/10 select-none">"</span>
          <p className="text-[17px] md:text-[19px] text-nb-gray-200 leading-[1.85] font-light relative z-10 pl-4">
            {marketing.primaryAngle}
          </p>
        </div>
      )}

      {/* Channels — horizontal flow */}
      {marketing.channels?.length > 0 && (
        <div className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.12em] text-nb-gray-600 font-medium mb-5">Canaux de distribution</p>
          <div className="space-y-0">
            {marketing.channels.map((ch: any, i: number) => (
              <div key={i} className="flex items-stretch group">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center mr-5 flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                    ch.priority?.toLowerCase() === 'haute'
                      ? 'border-nb-green bg-nb-green/20'
                      : ch.priority?.toLowerCase() === 'moyenne'
                        ? 'border-nb-yellow bg-nb-yellow/20'
                        : 'border-nb-gray-600 bg-nb-dark'
                  }`} />
                  {i < marketing.channels.length - 1 && (
                    <div className="w-px flex-1 bg-nb-border/40 min-h-[20px]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6 flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1">
                    <h4 className="text-[14px] font-semibold text-nb-white">{ch.name}</h4>
                    <span className="text-[10px] text-nb-gray-600 uppercase tracking-wide">{ch.priority}</span>
                  </div>
                  <p className="text-[13px] text-nb-gray-400 leading-[1.65]">{ch.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content ideas — staggered cards */}
      {marketing.contentIdeas?.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-nb-gray-600 font-medium mb-5">Idees de contenu</p>
          <div className="columns-1 sm:columns-2 gap-4 space-y-4">
            {marketing.contentIdeas.map((ci: any, i: number) => (
              <div
                key={i}
                className="break-inside-avoid bg-nb-surface border border-nb-border rounded-xl p-5 hover:border-nb-border-light transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-nb-purple" />
                  <span className="text-[10px] uppercase tracking-[0.1em] text-nb-purple font-medium">{ci.type}</span>
                </div>
                <h4 className="text-[14px] font-semibold text-nb-white leading-snug mb-2">{ci.topic}</h4>
                <p className="text-[12px] text-nb-gray-500 leading-[1.6] italic">"{ci.hook}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   STEP 04 — ROADMAP
   Style: Horizontal progress bar + stacked week cards with colored accent
   ═══════════════════════════════════════════════════════════ */

const WEEK_ACCENTS = [
  { bg: 'bg-nb-red/10', border: 'border-nb-red/30', accent: 'bg-nb-red', text: 'text-nb-red', dot: 'bg-nb-red' },
  { bg: 'bg-nb-orange/10', border: 'border-nb-orange/30', accent: 'bg-nb-orange', text: 'text-nb-orange', dot: 'bg-nb-orange' },
  { bg: 'bg-nb-blue/10', border: 'border-nb-blue/30', accent: 'bg-nb-blue', text: 'text-nb-blue', dot: 'bg-nb-blue' },
  { bg: 'bg-nb-purple/10', border: 'border-nb-purple/30', accent: 'bg-nb-purple', text: 'text-nb-purple', dot: 'bg-nb-purple' },
  { bg: 'bg-nb-green/10', border: 'border-nb-green/30', accent: 'bg-nb-green', text: 'text-nb-green', dot: 'bg-nb-green' },
  { bg: 'bg-nb-yellow/10', border: 'border-nb-yellow/30', accent: 'bg-nb-yellow', text: 'text-nb-yellow', dot: 'bg-nb-yellow' },
]

function StepRoadmap({ roadmap }: { roadmap: any[] }) {
  if (!roadmap?.length) return null

  return (
    <div>
      <StepHeader num="04" title="Roadmap de lancement" />

      {/* ── Horizontal progress bar ── */}
      <div className="flex items-center gap-0 mb-10">
        {roadmap.map((week: any, idx: number) => {
          const colors = WEEK_ACCENTS[idx % WEEK_ACCENTS.length]
          const isLast = idx === roadmap.length - 1
          return (
            <div key={idx} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full ${colors.accent} flex items-center justify-center`}>
                  <span className="text-[11px] font-bold text-white">S{week.week}</span>
                </div>
                <span className="text-[10px] text-nb-gray-500 truncate max-w-[80px] text-center">{week.title}</span>
              </div>
              {!isLast && (
                <div className="flex-1 h-px bg-nb-border mx-2" />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Week cards ── */}
      <div className="space-y-5">
        {roadmap.map((week: any, idx: number) => {
          const colors = WEEK_ACCENTS[idx % WEEK_ACCENTS.length]
          return (
            <div key={idx} className={`relative rounded-xl border ${colors.border} overflow-hidden`}>
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.accent}`} />

              <div className="pl-5 pr-5 py-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-[12px] font-bold ${colors.text} uppercase tracking-wide`}>Semaine {week.week}</span>
                  <span className="text-[11px] text-nb-gray-600">—</span>
                  <h4 className="text-[15px] font-semibold text-nb-white">{week.title}</h4>
                </div>

                {/* Tasks */}
                {week.tasks?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-4">
                    {week.tasks.map((task: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} flex-shrink-0 mt-[7px]`} />
                        <p className="text-[13px] text-nb-gray-400 leading-[1.65]">{task}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Milestone */}
                {week.milestone && (
                  <div className={`${colors.bg} rounded-lg px-4 py-3 flex items-start gap-3`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${colors.text} flex-shrink-0 mt-0.5`}>
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" x2="4" y1="22" y2="15" />
                    </svg>
                    <p className={`text-[13px] ${colors.text} font-medium leading-[1.5]`}>{week.milestone}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   STEP 05 — KPIs
   Style: Visual bars + numbered action checklist
   ═══════════════════════════════════════════════════════════ */

function StepKpis({ marketing }: { marketing: any }) {
  if (!marketing) return null

  const kpis = marketing.kpis || []
  const actions = marketing.firstWeekActions || []

  return (
    <div>
      <StepHeader num="05" title="Metriques & actions" />

      {/* KPIs as horizontal bars */}
      {kpis.length > 0 && (
        <div className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.12em] text-nb-gray-600 font-medium mb-5">KPIs a suivre</p>
          <div className="space-y-3">
            {kpis.map((kpi: string, i: number) => (
              <div key={i} className="group">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-mono text-nb-gray-600 w-5 text-right flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-nb-gray-200 leading-[1.5] mb-2">{kpi}</p>
                    <div className="h-[3px] bg-nb-border/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-nb-blue rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(20, 100 - i * 15)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions — step-by-step checklist */}
      {actions.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-nb-gray-600 font-medium mb-5">Actions prioritaires — Semaine 1</p>
          <div className="relative">
            {/* Connector */}
            <div className="absolute left-[15px] top-6 bottom-6 w-px bg-nb-border/40" />

            <div className="space-y-4">
              {actions.map((action: string, i: number) => (
                <div key={i} className="relative flex items-start gap-5">
                  <span className="relative z-10 w-8 h-8 rounded-full bg-nb-surface border-2 border-nb-border flex items-center justify-center flex-shrink-0">
                    <span className="text-[12px] font-bold text-nb-gray-400">{i + 1}</span>
                  </span>
                  <p className="text-[13px] text-nb-gray-300 leading-[1.75] pt-1.5">{action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SHARED
   ═══════════════════════════════════════════════════════════ */

function BackLink({ slug }: { slug: string }) {
  return (
    <Link
      href={`/ideas/${slug}`}
      className="text-[13px] text-nb-gray-500 hover:text-nb-white transition-colors inline-flex items-center gap-2 py-4"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
      </svg>
      Retour a l'idee
    </Link>
  )
}

function StepHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-10">
      <span className="text-[12px] font-mono text-nb-red tracking-wide">{num}</span>
      <h2 className="text-[22px] font-bold text-nb-white mt-1">{title}</h2>
      <div className="w-12 h-[2px] bg-nb-red rounded-full mt-4" />
    </div>
  )
}
