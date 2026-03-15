import { Link, router } from '@inertiajs/react'
import AppLayout from '~/layouts/app_layout'
import EmptyState from '~/components/empty_state'

interface Props {
  sourceItems: { data: any[]; meta: any }
}

export default function AdminSourceItems({ sourceItems }: Props) {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-nb-white">Sources</h1>
          <p className="text-nb-gray-500 mt-1">Gerez le contenu ingere</p>
        </div>
        <Link href="/admin/source-items/create" className="px-5 py-2.5 bg-nb-red text-white rounded-lg text-sm font-bold hover:bg-nb-red-hover transition-colors">
          + Ajouter une source
        </Link>
      </div>

      {sourceItems.data.length > 0 ? (
        <div className="bg-nb-surface rounded-xl border border-nb-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nb-border bg-nb-dark">
                <th className="text-left px-4 py-3 font-bold text-nb-gray-400 text-xs uppercase tracking-wider">Titre</th>
                <th className="text-left px-4 py-3 font-bold text-nb-gray-400 text-xs uppercase tracking-wider">Plateforme</th>
                <th className="text-left px-4 py-3 font-bold text-nb-gray-400 text-xs uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 font-bold text-nb-gray-400 text-xs uppercase tracking-wider">Idee</th>
                <th className="text-left px-4 py-3 font-bold text-nb-gray-400 text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 font-bold text-nb-gray-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sourceItems.data.map((item) => (
                <tr key={item.id} className="border-b border-nb-border hover:bg-nb-surface-hover transition-colors">
                  <td className="px-4 py-3">
                    <div className="truncate max-w-xs text-nb-white">{item.title || item.rawText?.slice(0, 60)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 bg-nb-dark border border-nb-border text-nb-gray-300 rounded text-xs font-medium">{item.platform}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                      item.syncStatus === 'processed'
                        ? 'bg-nb-green-muted text-nb-green'
                        : item.syncStatus === 'failed'
                          ? 'bg-nb-red-muted text-nb-red'
                          : 'bg-nb-yellow-muted text-nb-yellow'
                    }`}>
                      {item.syncStatus === 'processed' ? 'Traite' : item.syncStatus === 'failed' ? 'Echoue' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.businessIdea ? (
                      <Link href={`/ideas/${item.businessIdea.slug}`} className="text-nb-red hover:text-nb-red-hover text-xs font-medium transition-colors">
                        Voir l'idee
                      </Link>
                    ) : (
                      <span className="text-nb-gray-600 text-xs">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-nb-gray-500 text-xs">{new Date(item.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        if (confirm('Supprimer cette source ?')) {
                          router.delete(`/admin/source-items/${item.id}`)
                        }
                      }}
                      className="px-2.5 py-1 bg-nb-red-muted text-nb-red border border-nb-red/20 rounded text-xs font-bold hover:bg-nb-red/20 transition-colors"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Aucune source" message="Importez un CSV ou ajoutez du contenu manuellement" action={{ label: 'Ajouter une source', href: '/admin/source-items/create' }} />
      )}
    </AppLayout>
  )
}
