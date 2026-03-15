import type { ValidationStep } from '~/lib/idea_types'
import SectionBlock from './section_block'

interface Props {
  data: ValidationStep[]
}

export default function ValidationPlanSection({ data }: Props) {
  return (
    <SectionBlock title="Validation en 7 jours" subtitle="Plan de test rapide pour valider l'idee" accent="yellow">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-6 bottom-6 w-px bg-nb-border hidden md:block" />

        <div className="space-y-3">
          {data.map((step, i) => (
            <div key={step.step} className="flex gap-4 group">
              {/* Step number */}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-nb-surface border border-nb-border flex items-center justify-center text-sm font-black text-nb-white group-hover:border-nb-red/50 group-hover:text-nb-red transition-colors z-10">
                {step.step}
              </div>

              {/* Content */}
              <div className="flex-1 bg-nb-surface rounded-xl border border-nb-border p-4 group-hover:border-nb-border-light transition-colors">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4 className="text-sm font-bold text-nb-white">{step.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-nb-gray-500 bg-nb-dark px-2 py-0.5 rounded flex-shrink-0">
                    {step.duration}
                  </span>
                </div>
                <p className="text-sm text-nb-gray-400 mb-2">{step.description}</p>
                <p className="text-xs text-nb-gray-500">
                  Objectif : <span className="text-nb-yellow font-medium">{step.objective}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionBlock>
  )
}
