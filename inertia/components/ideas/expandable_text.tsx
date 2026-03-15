import { useState } from 'react'

interface Props {
  text: string
  maxLength?: number
  className?: string
}

export default function ExpandableText({ text, maxLength = 180, className = '' }: Props) {
  const [expanded, setExpanded] = useState(false)
  const needsTruncation = text.length > maxLength

  const displayText = !needsTruncation || expanded ? text : text.slice(0, maxLength).trimEnd() + '...'

  return (
    <div className={className}>
      <p className="text-[13.5px] text-nb-gray-300 leading-[1.75]">{displayText}</p>
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs font-medium text-nb-gray-500 hover:text-nb-white transition-colors"
        >
          {expanded ? 'Voir moins' : 'Voir plus'}
        </button>
      )}
    </div>
  )
}
