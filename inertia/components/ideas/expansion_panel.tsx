import type { ExpansionIdea } from '~/lib/idea_types'
import SectionBlock from './section_block'

interface Props {
  data: ExpansionIdea[]
}

const typeColors: Record<string, string> = {
  'Montee en gamme': 'text-nb-green bg-nb-green-muted',
  'Recurrence': 'text-nb-blue bg-nb-blue-muted',
  'Marche': 'text-nb-purple bg-nb-purple-muted',
  'Offre groupee': 'text-nb-yellow bg-nb-yellow-muted',
  'Croissance': 'text-nb-orange bg-nb-orange-muted',
}

export default function ExpansionPanel({ data }: Props) {
  return (
    <SectionBlock title="Extensions possibles" subtitle="Potentiel de croissance long terme" accent="purple">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item) => (
          <div key={item.title} className="bg-nb-surface rounded-xl border border-nb-border p-4 hover:border-nb-border-light transition-colors">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2.5 ${typeColors[item.type] || 'bg-nb-dark text-nb-gray-400'}`}>
              {item.type}
            </span>
            <h4 className="text-sm font-bold text-nb-white mb-1.5">{item.title}</h4>
            <p className="text-xs text-nb-gray-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </SectionBlock>
  )
}
