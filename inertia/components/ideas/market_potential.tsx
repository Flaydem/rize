import type { MarketInsight } from '~/lib/idea_types'
import SectionBlock from './section_block'

interface Props {
  data: MarketInsight[]
}

function scoreLabel(pct: number): string {
  if (pct >= 80) return 'Excellent'
  if (pct >= 60) return 'Bon'
  if (pct >= 40) return 'Moyen'
  if (pct >= 20) return 'Faible'
  return 'Tres faible'
}

function scoreColor(pct: number): string {
  if (pct >= 80) return 'text-nb-green'
  if (pct >= 60) return 'text-nb-blue'
  if (pct >= 40) return 'text-nb-yellow'
  return 'text-nb-red'
}

function barGradient(pct: number): string {
  if (pct >= 80) return 'from-nb-green/80 to-nb-green'
  if (pct >= 60) return 'from-nb-blue/80 to-nb-blue'
  if (pct >= 40) return 'from-nb-yellow/80 to-nb-yellow'
  return 'from-nb-red/80 to-nb-red'
}

function dotColor(pct: number): string {
  if (pct >= 80) return 'bg-nb-green'
  if (pct >= 60) return 'bg-nb-blue'
  if (pct >= 40) return 'bg-nb-yellow'
  return 'bg-nb-red'
}

function InsightRow({ insight }: { insight: MarketInsight }) {
  const percentage = Math.round((insight.value / insight.maxValue) * 100)

  return (
    <div className="group flex items-center gap-4 py-4 border-b border-nb-border/30 last:border-0">
      {/* Dot indicator */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor(percentage)}`} />

      {/* Label + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-sm font-semibold text-nb-white">{insight.label}</span>
          <span className={`text-xs font-bold ${scoreColor(percentage)}`}>{scoreLabel(percentage)}</span>
        </div>
        <div className="w-full bg-nb-dark rounded-full h-1">
          <div
            className={`h-1 rounded-full bg-gradient-to-r ${barGradient(percentage)} transition-all duration-700`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-nb-gray-500 mt-1.5">{insight.description}</p>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <span className={`text-lg font-black ${scoreColor(percentage)}`}>{percentage}</span>
        <span className="text-xs text-nb-gray-600">/100</span>
      </div>
    </div>
  )
}

export default function MarketPotentialSection({ data }: Props) {
  const avgScore = data.length > 0
    ? Math.round(data.reduce((sum, d) => sum + (d.value / d.maxValue) * 100, 0) / data.length)
    : 0

  return (
    <SectionBlock title="Potentiel de marche" subtitle="Indicateurs cles du marche cible" accent="blue">
      <div className="bg-nb-surface rounded-xl border border-nb-border overflow-hidden">
        {/* Score global header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-nb-border bg-nb-dark/30">
          <span className="text-sm font-medium text-nb-gray-400">Score global du marche</span>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-black ${scoreColor(avgScore)}`}>{avgScore}</span>
            <span className="text-xs text-nb-gray-500">/100</span>
          </div>
        </div>

        {/* Insight rows */}
        <div className="px-5">
          {data.map((insight) => (
            <InsightRow key={insight.label} insight={insight} />
          ))}
        </div>
      </div>
    </SectionBlock>
  )
}
