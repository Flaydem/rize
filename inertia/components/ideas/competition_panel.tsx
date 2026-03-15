import type { CompetitionData } from '~/lib/idea_types'
import SectionBlock from './section_block'

interface Props {
  data: CompetitionData
}

export default function CompetitionPanel({ data }: Props) {
  const saturationColor = data.saturationScore <= 30 ? 'bg-nb-green' : data.saturationScore <= 60 ? 'bg-nb-yellow' : 'bg-nb-red'
  const barrierColor = data.entryBarrier === 'Faible' ? 'text-nb-green bg-nb-green-muted'
    : data.entryBarrier === 'Elevee' ? 'text-nb-red bg-nb-red-muted'
    : 'text-nb-yellow bg-nb-yellow-muted'

  return (
    <SectionBlock title="Concurrence & differenciation" subtitle="Analyse de l'environnement concurrentiel" accent="orange">
      <div className="space-y-4">
        {/* Saturation gauge */}
        <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-nb-white">Niveau de saturation</h4>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                data.saturationLevel === 'Faible' ? 'text-nb-green bg-nb-green-muted'
                : data.saturationLevel === 'Elevee' ? 'text-nb-red bg-nb-red-muted'
                : 'text-nb-yellow bg-nb-yellow-muted'
              }`}>{data.saturationLevel}</span>
            </div>
          </div>
          <div className="w-full bg-nb-dark rounded-full h-2">
            <div
              className={`${saturationColor} h-2 rounded-full transition-all duration-700`}
              style={{ width: `${data.saturationScore}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-nb-gray-500 mb-3">Differenciation</h4>
            <p className="text-sm text-nb-gray-300 leading-relaxed">{data.differentiation}</p>
          </div>
          <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-nb-gray-500 mb-3">Angle sous-exploite</h4>
            <p className="text-sm text-nb-gray-300 leading-relaxed">{data.unexploitedAngle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-nb-gray-400">Barriere d'entree</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${barrierColor}`}>{data.entryBarrier}</span>
            </div>
          </div>
          <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-nb-gray-500 mb-2">Pourquoi maintenant</h4>
            <p className="text-sm text-nb-gray-300 leading-relaxed">{data.whyNow}</p>
          </div>
        </div>
      </div>
    </SectionBlock>
  )
}
