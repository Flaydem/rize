import { useForm } from '@inertiajs/react'
import { type FormEvent } from 'react'
import AppLayout from '~/layouts/app_layout'

export default function ValidatorIndex() {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    targetAudience: '',
    context: {
      monetizationModel: '',
      distributionChannels: '',
      differentiation: '',
      technicalFeasibility: '',
      timeToMarket: '',
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/validator/run')
  }

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-black text-nb-white mb-1">Business <span className="bg-nb-red px-1.5 text-white">Validateur</span></h1>
        <p className="text-nb-gray-500 mb-8">Soumettez votre idee business pour une analyse et un scoring</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-nb-surface rounded-xl border border-nb-border p-6 space-y-4">
            <h2 className="font-bold text-nb-white">Votre idee</h2>

            <div>
              <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Titre *</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="ex. Application IA de planification de repas"
                className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
                required
              />
              {errors.title && <p className="text-nb-red text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Description *</label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Decrivez votre idee business en detail : le probleme, la solution, comment ca marche..."
                rows={5}
                className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none resize-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
                required
                minLength={20}
              />
              {errors.description && <p className="text-nb-red text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Audience cible</label>
              <input
                type="text"
                value={data.targetAudience}
                onChange={(e) => setData('targetAudience', e.target.value)}
                placeholder="ex. Professionnels actifs de 25-40 ans"
                className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
              />
            </div>
          </div>

          <div className="bg-nb-surface rounded-xl border border-nb-border p-6 space-y-4">
            <h2 className="font-bold text-nb-white">Contexte additionnel <span className="font-normal text-nb-gray-600">(optionnel)</span></h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Modele de monetisation</label>
                <input
                  type="text"
                  value={data.context.monetizationModel}
                  onChange={(e) => setData('context', { ...data.context, monetizationModel: e.target.value })}
                  placeholder="ex. abonnement, freemium"
                  className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Canaux de distribution</label>
                <input
                  type="text"
                  value={data.context.distributionChannels}
                  onChange={(e) => setData('context', { ...data.context, distributionChannels: e.target.value })}
                  placeholder="ex. SEO, reseaux sociaux, prospection directe"
                  className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Differenciation</label>
                <input
                  type="text"
                  value={data.context.differentiation}
                  onChange={(e) => setData('context', { ...data.context, differentiation: e.target.value })}
                  placeholder="Qu'est-ce qui vous differencie ?"
                  className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Faisabilite technique</label>
                <input
                  type="text"
                  value={data.context.technicalFeasibility}
                  onChange={(e) => setData('context', { ...data.context, technicalFeasibility: e.target.value })}
                  placeholder="ex. API simple, no-code possible"
                  className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Delai de mise sur le marche</label>
              <input
                type="text"
                value={data.context.timeToMarket}
                onChange={(e) => setData('context', { ...data.context, timeToMarket: e.target.value })}
                placeholder="ex. MVP en 2 semaines, lancement complet en 1 mois"
                className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3.5 bg-nb-red text-white rounded-lg font-bold text-base hover:bg-nb-red-hover disabled:opacity-50 transition-colors"
          >
            {processing ? 'Analyse en cours...' : 'Valider mon idee'}
          </button>
        </form>
      </div>
    </AppLayout>
  )
}
