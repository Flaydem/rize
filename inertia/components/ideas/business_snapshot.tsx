import type { BusinessSnapshot } from '~/lib/idea_types'
import SectionBlock from './section_block'

interface Props {
  data: BusinessSnapshot
}

function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-nb-border/50 last:border-0">
      <span className="text-sm text-nb-gray-400">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-nb-red' : 'text-nb-white'}`}>{value}</span>
    </div>
  )
}

export default function BusinessSnapshotSection({ data }: Props) {
  return (
    <SectionBlock title="Apercu business" subtitle="Vue d'ensemble du modele economique" accent="green">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-nb-gray-500 mb-3">Revenus</h3>
          <DataRow label="Modele" value={data.monetizationModel} highlight />
          <DataRow label="Type de revenus" value={data.revenueType} />
          <DataRow label="Prix moyen estime" value={data.averagePrice} />
          <DataRow label="Marge potentielle" value={data.estimatedMargin} />
        </div>
        <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-nb-gray-500 mb-3">Operations</h3>
          <DataRow label="Delai avant revenus" value={data.timeToFirstRevenue} />
          <DataRow label="Complexite operationnelle" value={data.operationalComplexity} />
          <DataRow label="Potentiel de croissance" value={data.scalePotential} />
          <DataRow
            label="Realisable seul"
            value={data.soloFriendly ? 'Oui' : 'Non'}
          />
        </div>
      </div>
    </SectionBlock>
  )
}
