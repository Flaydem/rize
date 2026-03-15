interface Props {
  label: string
  score: number
  maxScore: number
}

export default function ScoreBar({ label, score, maxScore }: Props) {
  const percentage = Math.min((score / maxScore) * 100, 100)
  const color = percentage >= 70 ? 'bg-nb-green' : percentage >= 50 ? 'bg-nb-yellow' : percentage >= 30 ? 'bg-nb-orange' : 'bg-nb-red'

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-nb-gray-400">{label}</span>
        <span className="font-bold text-nb-white">{score}/{maxScore}</span>
      </div>
      <div className="w-full bg-nb-border rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
