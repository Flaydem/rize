import { Link, router } from '@inertiajs/react'
import AppLayout from '~/layouts/app_layout'
import ScoreBadge from '~/components/score_badge'
import EmptyState from '~/components/empty_state'

interface Props {
  ideas: { data: any[]; meta: any }
  currentStatus: string
}

export default function AdminIdeasReview({ ideas, currentStatus }: Props) {
  function filterByStatus(status: string) {
    router.get('/admin/ideas/review', status ? { status } : {}, { preserveState: true })
  }

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-black text-nb-white mb-1">Moderation des <span className="bg-nb-red px-1.5 text-white">idees</span></h1>
        <p className="text-nb-gray-500 mb-8">Examinez et gerez les idees generees par l'IA</p>

        {/* Filtres par statut */}
        <div className="flex gap-2 mb-6">
          {[
            { value: '', label: 'Toutes' },
            { value: 'draft', label: 'Brouillon' },
            { value: 'processed', label: 'Traitees' },
            { value: 'reviewed', label: 'Validees' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => filterByStatus(item.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStatus === item.value
                  ? 'bg-nb-red text-white'
                  : 'bg-nb-surface border border-nb-border text-nb-gray-400 hover:text-nb-white hover:border-nb-gray-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Liste des idees */}
        {ideas.data.length > 0 ? (
          <div className="space-y-3">
            {ideas.data.map((idea) => (
              <div key={idea.id} className="bg-nb-surface rounded-xl border border-nb-border p-4 flex items-center justify-between hover:border-nb-border-light transition-colors">
                <div className="flex-1 min-w-0">
                  <Link href={`/ideas/${idea.slug}`} className="font-bold text-nb-white hover:text-nb-red transition-colors">
                    {idea.title}
                  </Link>
                  <p className="text-sm text-nb-gray-500 truncate">{idea.oneLiner}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      idea.validationStatus === 'reviewed'
                        ? 'bg-nb-green-muted text-nb-green'
                        : idea.validationStatus === 'processed'
                          ? 'bg-nb-blue-muted text-nb-blue'
                          : 'bg-nb-dark text-nb-gray-500'
                    }`}>
                      {idea.validationStatus === 'reviewed' ? 'Validee' : idea.validationStatus === 'processed' ? 'Traitee' : 'Brouillon'}
                    </span>
                    {idea.categoryPrimary && (
                      <span className="px-2 py-0.5 bg-nb-red-muted text-nb-red rounded text-xs font-medium">{idea.categoryPrimary}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <ScoreBadge score={idea.viabilityScore} />
                  <button
                    onClick={() => router.patch(`/admin/ideas/${idea.id}`, { validationStatus: 'reviewed' }, { preserveState: true })}
                    className="px-3 py-1.5 bg-nb-green-muted text-nb-green border border-nb-green/20 rounded-lg text-xs font-bold hover:bg-nb-green/20 transition-colors"
                  >
                    Approuver
                  </button>
                  <button
                    onClick={() => router.post(`/admin/ideas/${idea.id}/reprocess`)}
                    className="px-3 py-1.5 bg-nb-surface border border-nb-border text-nb-gray-400 rounded-lg text-xs font-bold hover:text-nb-white hover:border-nb-gray-500 transition-colors"
                  >
                    Retraiter
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Supprimer cette idee ?')) {
                        router.delete(`/admin/ideas/${idea.id}`)
                      }
                    }}
                    className="px-3 py-1.5 bg-nb-red-muted text-nb-red border border-nb-red/20 rounded-lg text-xs font-bold hover:bg-nb-red/20 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Aucune idee a moderer" message="Les idees apparaitront ici apres l'ingestion et le traitement IA" />
        )}
      </div>
    </AppLayout>
  )
}
