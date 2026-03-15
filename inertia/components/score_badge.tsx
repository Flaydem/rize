import { scoreBgColor } from '~/lib/utils'

interface Props {
  score: number | null
  label?: string
  maxScore?: number
}

export default function ScoreBadge({ score, label, maxScore }: Props) {
  if (score === null || score === undefined) {
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-nb-surface text-nb-gray-500">—</span>
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${scoreBgColor(maxScore ? (score / maxScore) * 100 : score)}`}>
      {label && <span className="font-medium">{label}:</span>}
      <span>{score}{maxScore ? `/${maxScore}` : ''}</span>
    </span>
  )
}
