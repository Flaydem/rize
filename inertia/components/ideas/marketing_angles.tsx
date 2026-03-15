import type { MarketingAngle } from '~/lib/idea_types'
import SectionBlock from './section_block'

interface Props {
  data: MarketingAngle[]
}

const typeColors: Record<string, string> = {
  'Emotionnel': 'text-nb-red bg-nb-red-muted',
  'Rationnel': 'text-nb-blue bg-nb-blue-muted',
  'Viralite': 'text-nb-purple bg-nb-purple-muted',
  'Autorite': 'text-nb-green bg-nb-green-muted',
  'Urgence': 'text-nb-orange bg-nb-orange-muted',
}

export default function MarketingAnglesSection({ data }: Props) {
  return (
    <SectionBlock title="Angles marketing" subtitle="Strategies de communication pour vendre l'idee" accent="red">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((angle) => (
          <div key={angle.type} className="bg-nb-surface rounded-xl border border-nb-border p-5 hover:border-nb-border-light transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${typeColors[angle.type] || 'bg-nb-dark text-nb-gray-400'}`}>
                {angle.type}
              </span>
            </div>
            <h4 className="text-sm font-bold text-nb-white mb-2">{angle.title}</h4>
            <p className="text-sm text-nb-gray-400 leading-relaxed mb-3">{angle.description}</p>
            {angle.example && (
              <div className="border-l-2 border-nb-red/30 pl-3">
                <p className="text-xs text-nb-gray-500 italic">{angle.example}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionBlock>
  )
}
