import { useForm, Link } from '@inertiajs/react'
import { type FormEvent, useState } from 'react'
import AppLayout from '~/layouts/app_layout'

export default function AdminSourceItemCreate() {
  const [mode, setMode] = useState<'manual' | 'csv'>('manual')

  const manualForm = useForm({
    rawText: '',
    title: '',
    sourceUrl: '',
    platform: 'manual',
  })

  const csvForm = useForm<{ csv: File | null }>({ csv: null })

  function handleManualSubmit(e: FormEvent) {
    e.preventDefault()
    manualForm.post('/admin/source-items/manual')
  }

  function handleCsvSubmit(e: FormEvent) {
    e.preventDefault()
    if (!csvForm.data.csv) return
    csvForm.post('/admin/source-items/import-csv', {
      forceFormData: true,
    })
  }

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <Link href="/admin/source-items" className="text-sm text-nb-red hover:text-nb-red-hover transition-colors mb-6 inline-block">
          &larr; Retour aux sources
        </Link>

        <h1 className="text-3xl font-black text-nb-white mb-8">Ajouter du contenu</h1>

        {/* Bascule de mode */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setMode('manual')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
              mode === 'manual'
                ? 'bg-nb-red text-white'
                : 'bg-nb-surface border border-nb-border text-nb-gray-400 hover:text-nb-white hover:border-nb-gray-500'
            }`}
          >
            Saisie manuelle
          </button>
          <button
            onClick={() => setMode('csv')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
              mode === 'csv'
                ? 'bg-nb-red text-white'
                : 'bg-nb-surface border border-nb-border text-nb-gray-400 hover:text-nb-white hover:border-nb-gray-500'
            }`}
          >
            Importer un CSV
          </button>
        </div>

        {mode === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="bg-nb-surface rounded-xl border border-nb-border p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Titre (optionnel)</label>
              <input
                type="text"
                value={manualForm.data.title}
                onChange={(e) => manualForm.setData('title', e.target.value)}
                className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Contenu *</label>
              <textarea
                value={manualForm.data.rawText}
                onChange={(e) => manualForm.setData('rawText', e.target.value)}
                placeholder="Collez le contenu ici (transcription video, texte de post, description d'idee...)"
                rows={8}
                className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none resize-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
                required
                minLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">URL source (optionnel)</label>
              <input
                type="url"
                value={manualForm.data.sourceUrl}
                onChange={(e) => manualForm.setData('sourceUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Plateforme</label>
              <select
                value={manualForm.data.platform}
                onChange={(e) => manualForm.setData('platform', e.target.value)}
                className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white focus:border-nb-red transition-colors"
              >
                <option value="manual">Manuel</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={manualForm.processing}
              className="w-full py-3 bg-nb-red text-white rounded-lg font-bold hover:bg-nb-red-hover disabled:opacity-50 transition-colors"
            >
              {manualForm.processing ? 'Ajout en cours...' : 'Ajouter la source'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCsvSubmit} className="bg-nb-surface rounded-xl border border-nb-border p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Fichier CSV *</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => csvForm.setData('csv', e.target.files?.[0] || null)}
                className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg text-sm text-nb-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-nb-red file:text-white hover:file:bg-nb-red-hover file:cursor-pointer"
              />
              <p className="text-xs text-nb-gray-500 mt-2">Format supporte : date, resume, likes, vues, videoUrl (ou title, url, text, platform, published_at)</p>
            </div>

            <button
              type="submit"
              disabled={csvForm.processing || !csvForm.data.csv}
              className="w-full py-3 bg-nb-red text-white rounded-lg font-bold hover:bg-nb-red-hover disabled:opacity-50 transition-colors"
            >
              {csvForm.processing ? 'Import en cours...' : 'Importer le CSV'}
            </button>
          </form>
        )}
      </div>
    </AppLayout>
  )
}
