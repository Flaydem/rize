import type { MvpRecommendation } from '~/lib/idea_types'
import SectionBlock from './section_block'

interface Props {
  data: MvpRecommendation
}

export default function MvpRecommendationSection({ data }: Props) {
  return (
    <SectionBlock title="MVP recommande" subtitle="Comment lancer le projet rapidement et efficacement" accent="green">
      <div className="space-y-4">
        {/* Approach */}
        <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
          <p className="text-sm text-nb-gray-300 leading-relaxed">{data.approach}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Includes */}
          <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nb-green mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-nb-green-muted flex items-center justify-center text-[10px]">✓</span>
              A inclure
            </h3>
            <ul className="space-y-2.5">
              {data.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-nb-gray-300">
                  <span className="text-nb-green mt-0.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Excludes */}
          <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nb-red mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-nb-red-muted flex items-center justify-center text-[10px]">✕</span>
              A eviter au debut
            </h3>
            <ul className="space-y-2.5">
              {data.excludes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-nb-gray-400">
                  <span className="text-nb-red mt-0.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Budget, Time, Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-nb-surface rounded-xl border border-nb-border p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-nb-gray-500 mb-1">Budget minimum</p>
            <p className="text-lg font-black text-nb-white">{data.minBudget}</p>
          </div>
          <div className="bg-nb-surface rounded-xl border border-nb-border p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-nb-gray-500 mb-1">Mise en ligne</p>
            <p className="text-lg font-black text-nb-white">{data.timeToLaunch}</p>
          </div>
          <div className="bg-nb-surface rounded-xl border border-nb-border p-4">
            <p className="text-xs uppercase tracking-wider text-nb-gray-500 mb-2 text-center">Ressources</p>
            <ul className="space-y-1">
              {data.resources.map((r) => (
                <li key={r} className="text-xs text-nb-gray-300 text-center">{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionBlock>
  )
}
