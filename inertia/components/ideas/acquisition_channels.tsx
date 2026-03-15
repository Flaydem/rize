import type { AcquisitionChannel } from '~/lib/idea_types'
import SectionBlock from './section_block'

interface Props {
  data: AcquisitionChannel[]
}

function RelevanceDot({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-nb-green' : score >= 50 ? 'bg-nb-yellow' : 'bg-nb-gray-500'
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-sm text-nb-white font-bold">{score}%</span>
    </div>
  )
}

function DifficultyPill({ level }: { level: string }) {
  const color = level === 'Facile' ? 'text-nb-green bg-nb-green-muted'
    : level === 'Difficile' ? 'text-nb-red bg-nb-red-muted'
    : 'text-nb-yellow bg-nb-yellow-muted'
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>{level}</span>
}

export default function AcquisitionChannelsSection({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.relevance - a.relevance)

  return (
    <SectionBlock title="Canaux d'acquisition" subtitle="Meilleurs canaux pour atteindre votre audience" accent="purple">
      {/* Desktop table */}
      <div className="hidden md:block bg-nb-surface rounded-xl border border-nb-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-nb-border bg-nb-dark">
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-nb-gray-500">Canal</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-nb-gray-500">Pertinence</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-nb-gray-500">Difficulte</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-nb-gray-500">Vitesse</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-nb-gray-500">Cout</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-nb-gray-500">Note</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((channel) => (
              <tr key={channel.name} className="border-b border-nb-border/50 last:border-0 hover:bg-nb-surface-hover transition-colors">
                <td className="px-4 py-3 font-bold text-nb-white">{channel.name}</td>
                <td className="px-4 py-3"><RelevanceDot score={channel.relevance} /></td>
                <td className="px-4 py-3"><DifficultyPill level={channel.difficulty} /></td>
                <td className="px-4 py-3 text-nb-gray-400">{channel.speed}</td>
                <td className="px-4 py-3 text-nb-gray-400">{channel.estimatedCost}</td>
                <td className="px-4 py-3 text-nb-gray-500 text-xs max-w-[200px]">{channel.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((channel) => (
          <div key={channel.name} className="bg-nb-surface rounded-xl border border-nb-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-nb-white">{channel.name}</span>
              <RelevanceDot score={channel.relevance} />
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <DifficultyPill level={channel.difficulty} />
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-nb-dark text-nb-gray-400">{channel.speed}</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-nb-dark text-nb-gray-400">{channel.estimatedCost}</span>
            </div>
            <p className="text-xs text-nb-gray-500">{channel.comment}</p>
          </div>
        ))}
      </div>
    </SectionBlock>
  )
}
