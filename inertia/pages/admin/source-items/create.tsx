import { useForm, Link } from '@inertiajs/react'
import { type FormEvent } from 'react'
import AppLayout from '~/layouts/app_layout'

export default function AdminSourceItemCreate() {
  const form = useForm({
    rawText: '',
    title: '',
    sourceUrl: '',
    platform: 'manual',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    form.post('/admin/source-items/manual')
  }

  return (
    <AppLayout>
      {/* Loading screen */}
      {form.processing && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="text-center px-6">
            <div className="w-12 h-12 border-2 border-nb-red border-t-transparent rounded-full animate-spin mx-auto mb-8" />
            <h2 className="text-xl font-black text-nb-white mb-3">Analyse en cours...</h2>
            <p className="text-sm text-nb-gray-400 mb-1">Extraction de l'idee et generation du plan structure</p>
            <p className="text-xs text-nb-gray-600">Cette operation peut prendre quelques instants</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl">
        <Link href="/admin/source-items" className="text-sm text-nb-red hover:text-nb-red-hover transition-colors mb-6 inline-block">
          &larr; Retour aux sources
        </Link>

        <h1 className="text-3xl font-black text-nb-white mb-2">Nouvelle idee</h1>
        <p className="text-sm text-nb-gray-500 mb-8">Collez le contenu d'une video — l'idee et son plan seront generes automatiquement.</p>

        <form onSubmit={handleSubmit} className="bg-nb-surface rounded-xl border border-nb-border p-6 space-y-5">
          {/* Transcription */}
          <div>
            <label className="block text-sm font-semibold text-nb-gray-200 mb-1.5">
              Transcription de la video <span className="text-nb-red">*</span>
            </label>
            <textarea
              value={form.data.rawText}
              onChange={(e) => form.setData('rawText', e.target.value)}
              placeholder="Collez ici la transcription complete de la video..."
              rows={10}
              className="w-full px-4 py-3 bg-nb-dark border border-nb-border rounded-lg outline-none resize-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
              required
              minLength={10}
            />
            {form.errors.rawText && (
              <p className="text-xs text-nb-red mt-1">{form.errors.rawText}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-nb-gray-200 mb-1.5">
              Description / Resume <span className="text-nb-gray-600 font-normal">(optionnel)</span>
            </label>
            <input
              type="text"
              value={form.data.title}
              onChange={(e) => form.setData('title', e.target.value)}
              placeholder="Ex : Comment monter un SaaS en 30 jours..."
              className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-semibold text-nb-gray-200 mb-1.5">
              URL de la video <span className="text-nb-gray-600 font-normal">(optionnel)</span>
            </label>
            <input
              type="url"
              value={form.data.sourceUrl}
              onChange={(e) => form.setData('sourceUrl', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
            />
            {form.errors.sourceUrl && (
              <p className="text-xs text-nb-red mt-1">{form.errors.sourceUrl}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={form.processing || !form.data.rawText}
            className="w-full py-3 bg-nb-red text-white rounded-lg font-bold hover:bg-nb-red-hover disabled:opacity-50 transition-colors"
          >
            Generer l'idee et le plan
          </button>
        </form>
      </div>
    </AppLayout>
  )
}
