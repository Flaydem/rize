import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import SectionBlock from './section_block'

/* ─── Types ─── */

interface KeywordData {
  keyword: string
  volume: number
  growth: number
  data: { month: string; value: number }[]
}

interface Props {
  keywords: KeywordData[]
}

/* ─── Mock data generator ─── */

export function generateMockKeywords(idea: any): KeywordData[] {
  const title = (idea.title || '').toLowerCase()
  const category = idea.categoryPrimary || ''
  const monetization = (idea.monetizationModel || '').toLowerCase()

  const baseKeywords = [
    title.split(' ').slice(0, 3).join(' '),
    category,
    monetization.includes('abonnement') ? 'saas ' + category : category + ' en ligne',
  ].filter((k) => k.length > 2)

  const keywords: KeywordData[] = baseKeywords.slice(0, 3).map((kw, idx) => {
    const baseVolume = [14800, 8200, 3400][idx] || 5000
    const growth = [124, 67, -12][idx] || 30

    const months = generateMonthlyData(baseVolume, idx)

    return {
      keyword: kw.charAt(0).toUpperCase() + kw.slice(1),
      volume: baseVolume,
      growth,
      data: months,
    }
  })

  if (keywords.length === 0) {
    keywords.push({
      keyword: 'Mot-cle principal',
      volume: 9600,
      growth: 45,
      data: generateMonthlyData(9600, 0),
    })
  }

  return keywords
}

function generateMonthlyData(baseVolume: number, seed: number): { month: string; value: number }[] {
  const data: { month: string; value: number }[] = []
  const startYear = 2022
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']

  for (let y = 0; y < 4; y++) {
    for (let m = 0; m < 12; m++) {
      const seasonality = 1 + 0.3 * Math.sin(((m + seed * 3) / 12) * Math.PI * 2)
      const trendGrowth = 1 + y * 0.15
      const noise = 0.7 + Math.abs(Math.sin(y * 13 + m * 7 + seed * 17)) * 0.6
      const value = Math.round(baseVolume * 0.4 * seasonality * trendGrowth * noise)

      data.push({
        month: `${months[m]} ${startYear + y}`,
        value,
      })
    }
  }

  return data
}

/* ─── Format helpers ─── */

function formatVolume(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function formatYAxis(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(0) + 'k'
  return String(n)
}

/* ─── Custom tooltip ─── */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-nb-dark border border-nb-border rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-nb-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-nb-white">
        {payload[0].value.toLocaleString('fr-FR')} recherches
      </p>
    </div>
  )
}

/* ─── Main component ─── */

export default function KeywordTrendsSection({ keywords }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeKeyword = keywords[activeIndex] || keywords[0]
  if (!activeKeyword) return null

  const maxValue = useMemo(
    () => Math.max(...activeKeyword.data.map((d) => d.value)),
    [activeKeyword]
  )

  return (
    <SectionBlock title="Recherche de mots-cles" subtitle="Tendances de recherche associees a cette idee" accent="purple">
      <div className="bg-nb-surface rounded-xl border border-nb-border overflow-hidden">
        {/* Header: keyword selector + stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-b border-nb-border">
          {/* Keyword pills */}
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <button
                key={kw.keyword}
                onClick={() => setActiveIndex(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  i === activeIndex
                    ? 'bg-nb-purple-muted text-nb-purple'
                    : 'bg-nb-dark text-nb-gray-400 hover:text-nb-white'
                }`}
              >
                {kw.keyword}
              </button>
            ))}
          </div>

          {/* Volume + Growth stats */}
          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="text-right">
              <span className="text-xl font-black text-nb-blue">{formatVolume(activeKeyword.volume)}</span>
              <p className="text-[10px] uppercase tracking-wider text-nb-gray-500 mt-0.5">Volume</p>
            </div>
            <div className="text-right">
              <span className={`text-xl font-black ${activeKeyword.growth >= 0 ? 'text-nb-green' : 'text-nb-red'}`}>
                {activeKeyword.growth >= 0 ? '+' : ''}{activeKeyword.growth}%
              </span>
              <p className="text-[10px] uppercase tracking-wider text-nb-gray-500 mt-0.5">Croissance</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-3 py-4 sm:px-5 sm:py-6">
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeKeyword.data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-nb-blue, #3b82f6)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-nb-blue, #3b82f6)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={60}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatYAxis}
                  domain={[0, Math.ceil(maxValue * 1.15)]}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-nb-blue, #3b82f6)"
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: 'var(--color-nb-blue, #3b82f6)',
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SectionBlock>
  )
}
