import { Link } from '@inertiajs/react'
import AppLayout from '~/layouts/app_layout'
import ScoreBar from '~/components/score_bar'
import { scoreColor } from '~/lib/utils'

interface Props {
  validation: any
}

export default function ValidatorShow({ validation }: Props) {
  const v = validation

  return (
    <AppLayout>
      <div className="max-w-3xl">
        <Link href="/validator" className="text-sm text-nb-red hover:text-nb-red-hover transition-colors mb-6 inline-block">
          &larr; Nouvelle validation
        </Link>

        <div className="bg-nb-surface rounded-xl border border-nb-border p-6 mb-6">
          <h1 className="text-xl font-black text-nb-white">{v.inputTitle}</h1>
          <p className="text-sm text-nb-gray-400 mt-1">{v.inputDescription}</p>
          {v.targetAudience && <p className="text-sm text-nb-gray-500 mt-1">Audience : {v.targetAudience}</p>}
        </div>

        {/* Score global */}
        <div className="bg-nb-surface rounded-xl border border-nb-border p-8 mb-6 text-center">
          <p className="text-sm text-nb-gray-500 mb-2 uppercase tracking-wider font-bold">Score global</p>
          <p className={`text-6xl font-black ${scoreColor(v.scoreGlobal)}`}>{v.scoreGlobal}</p>
          <p className="text-sm text-nb-gray-600 mt-1">sur 100</p>
        </div>

        {/* Detail des scores */}
        <div className="bg-nb-surface rounded-xl border border-nb-border p-6 mb-6">
          <h2 className="font-bold text-nb-white mb-4">Detail des scores</h2>
          <div className="space-y-4">
            <ScoreBar label="Clarte du probleme" score={v.scoreProblem} maxScore={20} />
            <ScoreBar label="Specificite de l'audience" score={v.scoreAudience} maxScore={15} />
            <ScoreBar label="Clarte de la monetisation" score={v.scoreMonetization} maxScore={15} />
            <ScoreBar label="Faisabilite de distribution" score={v.scoreDistribution} maxScore={15} />
            <ScoreBar label="Faisabilite technique" score={v.scoreFeasibility} maxScore={10} />
            <ScoreBar label="Differenciation" score={v.scoreDifferentiation} maxScore={15} />
          </div>
        </div>

        {/* Points forts et risques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {v.strengths?.length > 0 && (
            <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
              <h2 className="font-bold text-nb-green mb-3">Points forts</h2>
              <ul className="list-disc ml-5 text-sm text-nb-gray-400 space-y-1">
                {v.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {v.risks?.length > 0 && (
            <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
              <h2 className="font-bold text-nb-red mb-3">Risques</h2>
              <ul className="list-disc ml-5 text-sm text-nb-gray-400 space-y-1">
                {v.risks.map((r: string, i: number) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Recommandations */}
        {v.recommendations?.length > 0 && (
          <div className="bg-nb-surface rounded-xl border border-nb-border p-5 mb-6">
            <h2 className="font-bold text-nb-white mb-3">Recommandations</h2>
            <ul className="list-disc ml-5 text-sm text-nb-gray-400 space-y-1">
              {v.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* Plan de validation */}
        {v.validationPlan?.length > 0 && (
          <div className="bg-nb-surface rounded-xl border border-nb-border p-5 mb-6">
            <h2 className="font-bold text-nb-white mb-4">Plan de validation <span className="bg-nb-red px-1 text-white text-sm">7 jours</span></h2>
            <div className="space-y-4">
              {v.validationPlan.map((step: any, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-8 h-8 bg-nb-red-muted text-nb-red rounded-full flex items-center justify-center font-bold text-xs">
                    J{step.day}
                  </span>
                  <div>
                    <p className="text-nb-white font-medium">{step.action}</p>
                    <p className="text-nb-gray-500 text-xs mt-0.5">Metrique : {step.metric}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
