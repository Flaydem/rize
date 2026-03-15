interface Props {
  label: string
  value: string | number
  icon?: string
  accent?: boolean
}

export default function StatCard({ label, value, icon, accent }: Props) {
  return (
    <div className={`rounded-xl border p-5 transition-colors ${accent ? 'bg-nb-red-muted border-nb-red/20' : 'bg-nb-surface border-nb-border'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-nb-gray-400 font-medium">{label}</p>
          <p className={`text-3xl font-black mt-1 ${accent ? 'text-nb-red' : 'text-nb-white'}`}>{value}</p>
        </div>
        {icon && <span className={`text-2xl ${accent ? 'text-nb-red' : 'text-nb-gray-600'}`}>{icon}</span>}
      </div>
    </div>
  )
}
