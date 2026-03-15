import type { QuickInsight } from '~/lib/idea_types'

const colorMap: Record<string, string> = {
  red: 'border-nb-red/20 bg-nb-red-muted text-nb-red',
  green: 'border-nb-green/20 bg-nb-green-muted text-nb-green',
  blue: 'border-nb-blue/20 bg-nb-blue-muted text-nb-blue',
  yellow: 'border-nb-yellow/20 bg-nb-yellow-muted text-nb-yellow',
  orange: 'border-nb-orange/20 bg-nb-orange-muted text-nb-orange',
  purple: 'border-nb-purple/20 bg-nb-purple-muted text-nb-purple',
}

const iconMap: Record<string, string> = {
  revenue: '€',
  speed: '⚡',
  competition: '⚔',
  recurrence: '↻',
  effort: '⚙',
}

export default function InsightMetricCard({ label, value, icon, color }: QuickInsight) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colorMap[color]} bg-opacity-50`}>
      <span className="text-lg w-7 h-7 flex items-center justify-center rounded-lg bg-nb-dark/50 flex-shrink-0">
        {iconMap[icon] || '•'}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider font-medium opacity-70">{label}</p>
        <p className="text-sm font-bold text-nb-white">{value}</p>
      </div>
    </div>
  )
}
