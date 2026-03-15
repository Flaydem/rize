import type { Risk } from '~/lib/idea_types'
import SectionBlock from './section_block'

interface Props {
  data: Risk[]
}

const severityConfig: Record<string, { color: string; label: string; dot: string }> = {
  high: { color: 'border-nb-red/20', label: 'Eleve', dot: 'bg-nb-red' },
  medium: { color: 'border-nb-yellow/20', label: 'Moyen', dot: 'bg-nb-yellow' },
  low: { color: 'border-nb-green/20', label: 'Faible', dot: 'bg-nb-green' },
}

export default function RiskListSection({ data }: Props) {
  const sorted = [...data].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <SectionBlock title="Risques & contraintes" subtitle="Points de vigilance a anticiper" accent="orange">
      <div className="space-y-3">
        {sorted.map((risk) => {
          const config = severityConfig[risk.severity]
          return (
            <div key={risk.title} className={`bg-nb-surface rounded-xl border ${config.color} p-4 hover:bg-nb-surface-hover transition-colors`}>
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${config.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-nb-white">{risk.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-nb-dark text-nb-gray-500">{risk.category}</span>
                  </div>
                  <p className="text-sm text-nb-gray-400 leading-relaxed">{risk.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SectionBlock>
  )
}
