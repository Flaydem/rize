import { useState, useRef, useEffect } from 'react'

interface Props {
  problem: string
  solution: string
  audience: string
  summary: string
}

/* ─── SVG icons (14px, stroke only, no fill) ─── */

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

/* ─── Clampable text block ─── */

function ClampableText({ text, className = '' }: { text: string; className?: string }) {
  const [clamped, setClamped] = useState(true)
  const [needsClamp, setNeedsClamp] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setNeedsClamp(el.scrollHeight > el.clientHeight + 2)
  }, [text])

  return (
    <div>
      <p
        ref={ref}
        className={`text-sm text-nb-gray-300 leading-[1.6] ${clamped ? 'line-clamp-3' : ''} ${className}`}
      >
        {text}
      </p>
      {needsClamp && (
        <button
          onClick={() => setClamped(!clamped)}
          className="mt-1.5 text-xs text-nb-gray-500 hover:text-nb-white transition-colors"
        >
          {clamped ? 'Voir plus' : 'Voir moins'}
        </button>
      )}
    </div>
  )
}

/* ─── Timeline row ─── */

interface TimelineRowProps {
  icon: React.ReactNode
  label: string
  text: string
  isLast?: boolean
}

function TimelineRow({ icon, label, text, isLast = false }: TimelineRowProps) {
  return (
    <div className="relative flex gap-5">
      {/* Dot + connector */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <div className="w-8 h-8 rounded-full border border-nb-border bg-nb-surface flex items-center justify-center text-nb-gray-400">
          {icon}
        </div>
        {!isLast && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px bg-nb-border h-[calc(100%)]" />
        )}
      </div>

      {/* Content */}
      <div className="pb-6 min-w-0 flex-1">
        <span className="block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-nb-gray-500 mb-1.5">
          {label}
        </span>
        <ClampableText text={text || 'Non renseigne'} />
      </div>
    </div>
  )
}

/* ─── Main section ─── */

export default function IdeaUnderstandingSection({ problem, solution, audience, summary }: Props) {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="w-1 h-5 rounded-full bg-nb-red" />
          <h2 className="text-lg font-black text-nb-white">Comprendre l'idee</h2>
        </div>
        <p className="text-sm text-nb-gray-500 ml-[18px]">L'essentiel en un coup d'oeil</p>
      </div>

      <div className="pl-1">
        <TimelineRow icon={<AlertIcon />} label="Probleme" text={problem} />
        <TimelineRow icon={<CheckIcon />} label="Solution" text={solution} />
        <TimelineRow icon={<UserIcon />} label="Audience cible" text={audience} />
        <TimelineRow icon={<DocIcon />} label="Resume" text={summary} isLast />
      </div>
    </section>
  )
}
