import { Link, router } from '@inertiajs/react'
import { useState, useMemo, useRef } from 'react'
import AppLayout from '~/layouts/app_layout'
import InsightMetricCard from '~/components/ideas/insight_metric_card'
import MarketPotentialSection from '~/components/ideas/market_potential'
import IdeaUnderstandingSection from '~/components/ideas/idea_understanding_section'
import KeywordTrendsSection, { generateMockKeywords } from '~/components/ideas/keyword_trends_section'
import { difficultyColor, budgetColor, difficultyLabel, budgetLabel, scoreColor } from '~/lib/utils'
import { generateMockData } from '~/lib/idea_mock_data'

interface Props {
  idea: any
}

export default function IdeaShow({ idea }: Props) {
  const [generating, setGenerating] = useState<string | null>(null)

  const hasPlan = idea.structuredPlans?.length > 0
  const hasLaunchPack = idea.launchPacks?.length > 0
  const videoUrl: string | null = idea.sourceItem?.sourceUrl || null

  const extendedData = useMemo(() => generateMockData(idea), [idea])

  const mockKeywords = useMemo(() => generateMockKeywords(idea), [idea])

  const marketInsights = useMemo(() => {
    const mp = idea.structuredData?.marketPotential
    if (mp?.marketSize && mp?.maturity && mp?.trend && mp?.demandPotential && mp?.purchaseFrequency) {
      return [
        { label: 'Taille du marche', value: mp.marketSize.score, maxValue: 100, description: mp.marketSize.description },
        { label: 'Maturite', value: mp.maturity.score, maxValue: 100, description: mp.maturity.description },
        { label: 'Tendance', value: mp.trend.score, maxValue: 100, description: mp.trend.description },
        { label: 'Potentiel de demande', value: mp.demandPotential.score, maxValue: 100, description: mp.demandPotential.description },
        { label: "Frequence d'achat", value: mp.purchaseFrequency.score, maxValue: 100, description: mp.purchaseFrequency.description },
      ]
    }
    return extendedData.marketInsights
  }, [idea, extendedData.marketInsights])

  function generatePlan() {
    setGenerating('plan')
    router.post(`/ideas/${idea.id}/generate-structured-plan`, {}, {
      onFinish: () => setGenerating(null),
      onSuccess: () => router.visit(`/ideas/${idea.id}/structured-plan`),
    })
  }

  function generateLaunchPack() {
    setGenerating('launch-pack')
    router.post(`/ideas/${idea.id}/generate-launch-pack`, {}, {
      onFinish: () => setGenerating(null),
      onSuccess: () => router.visit(`/ideas/${idea.id}/launch-pack`),
    })
  }

  function PlanTooltip() {
    const [show, setShow] = useState(false)
    return (
      <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <span className="w-5 h-5 rounded-full bg-nb-dark border border-nb-border text-[10px] font-bold text-nb-gray-400 flex items-center justify-center cursor-help">?</span>
        {show && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-nb-dark/95 backdrop-blur border border-nb-border rounded-lg px-3 py-2.5 shadow-lg z-50 pointer-events-none">
            <p className="text-[11px] text-nb-gray-300 leading-relaxed">
              Genere un plan sur-mesure : resume du MVP, roadmap de lancement semaine par semaine, et plan marketing avec angle specifique.
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-nb-dark/95 border-r border-b border-nb-border rotate-45 -mt-1" />
          </div>
        )}
      </span>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-5xl">
        {/* Breadcrumb */}
        <Link href="/ideas" className="text-sm text-nb-gray-500 hover:text-nb-red transition-colors mb-6 inline-flex items-center gap-1.5">
          <span>&larr;</span> Retour au coffre
        </Link>

        {/* ═══════════════════════════════════════════════════
            BLOC 1 — VISION IMMEDIATE
        ═══════════════════════════════════════════════════ */}

        {/* Hero Header */}
        <div className="bg-nb-surface rounded-2xl border border-nb-border p-6 md:p-8 mb-6">

          {/* Row 1 — Titre + scores (pleine largeur) */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-nb-white leading-tight mb-2">{idea.title}</h1>
              <p className="text-nb-gray-400 text-base">{idea.oneLiner}</p>
            </div>
            <div className="flex gap-5 flex-shrink-0">
              <div className="text-center">
                <div className={`text-3xl font-black ${scoreColor(idea.viabilityScore ?? 0)}`}>
                  {idea.viabilityScore ?? '—'}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-nb-gray-500 mt-0.5">Viabilite</p>
              </div>
              <div className="w-px bg-nb-border" />
              <div className="text-center">
                <div className={`text-3xl font-black ${scoreColor(idea.confidenceScore ?? 0)}`}>
                  {idea.confidenceScore ?? '—'}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-nb-gray-500 mt-0.5">Confiance</p>
              </div>
            </div>
          </div>

          <div className="border-t border-nb-border pt-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">

              {/* Colonne gauche — donnees */}
              <div className="min-w-0 space-y-4">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {idea.categoryPrimary && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-nb-red-muted text-nb-red">{idea.categoryPrimary}</span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColor(idea.difficultyLevel)}`}>
                    {difficultyLabel(idea.difficultyLevel)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${budgetColor(idea.startupBudgetLevel)}`}>
                    {budgetLabel(idea.startupBudgetLevel)}
                  </span>
                  {idea.monetizationModel && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-nb-blue-muted text-nb-blue">{idea.monetizationModel}</span>
                  )}
                  {idea.estimatedLaunchTimeDays && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-nb-purple-muted text-nb-purple">
                      {idea.estimatedLaunchTimeDays} jours
                    </span>
                  )}
                </div>

                {/* Monetisation description */}
                {idea.monetizationModel && (
                  <p className="text-sm text-nb-gray-400 leading-relaxed">{idea.monetizationModel}</p>
                )}

                {/* Tags */}
                {idea.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {idea.tags.map((tag: string) => (
                      <span key={tag} className="text-xs text-nb-gray-500 bg-nb-dark px-2.5 py-0.5 rounded-full border border-nb-border">#{tag}</span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-nb-border/50">
                  <div className="flex items-center gap-2">
                    {hasPlan ? (
                      <Link
                        href={`/ideas/${idea.id}/structured-plan`}
                        className="px-5 py-2.5 bg-nb-red text-white rounded-lg text-sm font-bold hover:bg-nb-red-hover transition-colors"
                      >
                        Voir le plan structure
                      </Link>
                    ) : (
                      <button
                        onClick={generatePlan}
                        disabled={generating === 'plan'}
                        className="px-5 py-2.5 bg-nb-red text-white rounded-lg text-sm font-bold hover:bg-nb-red-hover disabled:opacity-50 transition-colors"
                      >
                        {generating === 'plan' ? 'Generation en cours...' : 'Generer un plan structure'}
                      </button>
                    )}
                    <PlanTooltip />
                  </div>

                  {hasLaunchPack ? (
                    <Link
                      href={`/ideas/${idea.id}/launch-pack`}
                      className="px-5 py-2.5 bg-nb-surface border border-nb-border text-nb-white rounded-lg text-sm font-bold hover:border-nb-gray-500 transition-colors"
                    >
                      Voir le pack de lancement
                    </Link>
                  ) : (
                    <button
                      onClick={generateLaunchPack}
                      disabled={generating === 'launch-pack'}
                      className="px-5 py-2.5 bg-nb-surface border border-nb-border text-nb-white rounded-lg text-sm font-bold hover:border-nb-gray-500 disabled:opacity-50 transition-colors"
                    >
                      {generating === 'launch-pack' ? 'Generation en cours...' : 'Generer un pack de lancement'}
                    </button>
                  )}
                </div>
              </div>

              {/* Colonne droite — preview video */}
              {videoUrl && (
                <div className="w-full md:w-44 flex-shrink-0">
                  <div className="bg-nb-dark rounded-xl border border-nb-border overflow-hidden h-[280px]">
                    <video
                      src={videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] text-nb-gray-600 mt-2 text-center">Video source</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
          {extendedData.quickInsights.map((insight) => (
            <InsightMetricCard key={insight.label} {...insight} />
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════
            BLOC 2 — COMPREHENSION
        ═══════════════════════════════════════════════════ */}

        <IdeaUnderstandingSection
          problem={idea.problem}
          solution={idea.solution}
          audience={idea.audience}
          summary={idea.summary}
        />

        {/* ═══════════════════════════════════════════════════
            BLOC 3 — POTENTIEL MARCHE
        ═══════════════════════════════════════════════════ */}

        <div className="mb-12">
          <MarketPotentialSection data={marketInsights} />
        </div>

        {/* ═══════════════════════════════════════════════════
            BLOC 4 — MOTS-CLES
        ═══════════════════════════════════════════════════ */}

        <div className="mb-12">
          <KeywordTrendsSection keywords={mockKeywords} />
        </div>

        {/* Bottom CTA */}
        <div className="bg-nb-surface rounded-2xl border border-nb-border p-8 text-center mb-6">
          <h3 className="text-lg font-black text-nb-white mb-2">Pret a passer a l'action ?</h3>
          <p className="text-sm text-nb-gray-500 mb-5">Generez un plan detaille ou un pack de lancement complet pour cette idee.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2">
              {hasPlan ? (
                <Link
                  href={`/ideas/${idea.id}/structured-plan`}
                  className="px-6 py-3 bg-nb-red text-white rounded-lg text-sm font-bold hover:bg-nb-red-hover transition-colors"
                >
                  Voir le plan structure
                </Link>
              ) : (
                <button
                  onClick={generatePlan}
                  disabled={generating === 'plan'}
                  className="px-6 py-3 bg-nb-red text-white rounded-lg text-sm font-bold hover:bg-nb-red-hover disabled:opacity-50 transition-colors"
                >
                  {generating === 'plan' ? 'Generation en cours...' : 'Generer un plan structure'}
                </button>
              )}
              <PlanTooltip />
            </div>
            {hasLaunchPack ? (
              <Link
                href={`/ideas/${idea.id}/launch-pack`}
                className="px-6 py-3 bg-nb-surface border border-nb-border text-nb-white rounded-lg text-sm font-bold hover:border-nb-gray-500 transition-colors"
              >
                Voir le pack de lancement
              </Link>
            ) : (
              <button
                onClick={generateLaunchPack}
                disabled={generating === 'launch-pack'}
                className="px-6 py-3 bg-nb-surface border border-nb-border text-nb-white rounded-lg text-sm font-bold hover:border-nb-gray-500 disabled:opacity-50 transition-colors"
              >
                {generating === 'launch-pack' ? 'Generation en cours...' : 'Generer un pack de lancement'}
              </button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
