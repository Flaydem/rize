import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import AppLayout from '~/layouts/app_layout'
import { difficultyLabel, budgetLabel, difficultyColor, budgetColor, scoreColor } from '~/lib/utils'

interface Props {
  ideas: { data: any[]; meta: any }
  categories: any[]
  filters: Record<string, any>
  savedIdeaIds: number[]
}

export default function IdeasIndex({ ideas, categories, filters, savedIdeaIds }: Props) {
  const [search, setSearch] = useState(filters.search || '')
  const [savedSet, setSavedSet] = useState<Set<number>>(new Set(savedIdeaIds || []))

  function applyFilter(key: string, value: string | undefined) {
    const params = { ...filters, [key]: value, page: 1 }
    if (!value) delete params[key]
    router.get('/ideas', params, { preserveState: true })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    applyFilter('search', search || undefined)
  }

  function toggleSave(ideaId: number) {
    const wasSaved = savedSet.has(ideaId)
    setSavedSet((prev) => {
      const next = new Set(prev)
      if (wasSaved) next.delete(ideaId)
      else next.add(ideaId)
      return next
    })
    const token = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]
    fetch(`/ideas/${ideaId}/save`, {
      method: 'POST',
      headers: {
        'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    }).catch(() => {
      // Revert on error
      setSavedSet((prev) => {
        const next = new Set(prev)
        if (wasSaved) next.add(ideaId)
        else next.delete(ideaId)
        return next
      })
    })
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-[28px] md:text-[32px] font-extrabold text-nb-white leading-tight">
            Coffre aux Idees
          </h1>
          <p className="text-[14px] text-nb-gray-500 mt-1">Decouvrez et explorez des idees business</p>
        </div>

        {/* ── Category tabs + Search ── */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            <TabButton
              label="Toutes"
              active={!filters.category}
              onClick={() => applyFilter('category', undefined)}
            />
            {categories.map((cat) => (
              <TabButton
                key={cat.key}
                label={cat.label}
                active={filters.category === cat.key}
                onClick={() => applyFilter('category', cat.key)}
              />
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 md:ml-auto flex-shrink-0">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une idee..."
              className="w-full md:w-64 px-4 py-2.5 bg-nb-surface border border-nb-border rounded-lg outline-none text-[13px] text-nb-white placeholder:text-nb-gray-500 focus:border-nb-red transition-colors"
            />
            <button type="submit" className="px-5 py-2.5 bg-nb-red text-white rounded-lg font-semibold hover:bg-nb-red-hover transition-colors text-[13px] flex-shrink-0">
              Rechercher
            </button>
          </form>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          <FilterSelect
            value={filters.difficulty || ''}
            onChange={(v) => applyFilter('difficulty', v || undefined)}
            placeholder="Difficulte"
            options={[
              { value: 'easy', label: 'Facile' },
              { value: 'medium', label: 'Moyen' },
              { value: 'hard', label: 'Difficile' },
            ]}
          />
          <FilterSelect
            value={filters.budget || ''}
            onChange={(v) => applyFilter('budget', v || undefined)}
            placeholder="Budget"
            options={[
              { value: 'low', label: 'Petit' },
              { value: 'medium', label: 'Moyen' },
              { value: 'high', label: 'Eleve' },
            ]}
          />
          <FilterSelect
            value={filters.sortBy || 'created_at'}
            onChange={(v) => applyFilter('sortBy', v)}
            placeholder="Trier par"
            options={[
              { value: 'created_at', label: 'Plus recentes' },
              { value: 'viability_score', label: 'Score d\'innovation' },
              { value: 'confidence_score', label: 'Confiance' },
              { value: 'title', label: 'Titre' },
            ]}
          />
        </div>

        {/* ── Ideas grid ── */}
        {ideas.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {ideas.data.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  saved={savedSet.has(idea.id)}
                  onToggleSave={() => toggleSave(idea.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {ideas.meta.lastPage > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: ideas.meta.lastPage }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => applyFilter('page', String(page))}
                    className={`w-9 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                      ideas.meta.currentPage === page
                        ? 'bg-nb-red text-white'
                        : 'bg-nb-surface border border-nb-border text-nb-gray-400 hover:text-nb-white hover:border-nb-gray-500'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-[15px] text-nb-gray-400 mb-1">Aucune idee trouvee</p>
            <p className="text-[13px] text-nb-gray-600">Essayez d'ajuster vos filtres ou votre recherche</p>
          </div>
        )}

      </div>
    </AppLayout>
  )
}

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-nb-red text-white'
          : 'text-nb-gray-400 hover:text-nb-white hover:bg-nb-surface'
      }`}
    >
      {label}
    </button>
  )
}

function FilterSelect({ value, onChange, placeholder, options }: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3.5 pr-8 py-2 bg-nb-surface border border-nb-border rounded-lg text-[13px] text-nb-gray-300 hover:border-nb-gray-500 transition-colors cursor-pointer outline-none focus:border-nb-red"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-nb-gray-500 pointer-events-none">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  )
}

function IdeaCard({ idea, saved, onToggleSave }: { idea: any; saved: boolean; onToggleSave: () => void }) {
  const score = idea.viabilityScore

  return (
    <div className="bg-nb-surface border border-nb-border rounded-2xl overflow-hidden hover:border-nb-border-light transition-all group">
      {/* ── Score header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          {idea.categoryPrimary && (
            <span className="text-[11px] text-nb-gray-500 bg-nb-dark px-2.5 py-0.5 rounded-full border border-nb-border truncate">
              {idea.categoryPrimary}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {score != null && (
            <div className="flex items-baseline gap-1.5">
              <span className={`text-[24px] font-extrabold tabular-nums leading-none ${scoreColor(score)}`}>{score}</span>
              <span className="text-[12px] text-nb-gray-500">/ 100</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-5 pb-5">
        <h3 className="text-[15px] font-bold text-nb-white leading-snug mb-2 line-clamp-2 group-hover:text-nb-red transition-colors">
          {idea.title}
        </h3>
        <p className="text-[13px] text-nb-gray-400 leading-[1.6] line-clamp-3 mb-4">
          {idea.oneLiner || idea.summary}
        </p>

        {/* ── Tags ── */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${difficultyColor(idea.difficultyLevel)}`}>
            Difficulte : {difficultyLabel(idea.difficultyLevel)}
          </span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${budgetColor(idea.startupBudgetLevel)}`}>
            {budgetLabel(idea.startupBudgetLevel)}
          </span>
          {idea.estimatedLaunchTimeDays && (
            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-nb-blue-muted text-nb-blue">
              Temps : {idea.estimatedLaunchTimeDays} jours
            </span>
          )}
        </div>

        {/* ── Hashtags ── */}
        {idea.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {idea.tags.slice(0, 4).map((tag: string) => (
              <span key={tag} className="text-[11px] text-nb-gray-500">#{tag}</span>
            ))}
          </div>
        )}

        {/* ── CTAs ── */}
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.preventDefault(); onToggleSave() }}
            className={`px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors border ${
              saved
                ? 'bg-nb-red-muted border-nb-red/30 text-nb-red'
                : 'bg-nb-surface border-nb-border text-nb-gray-400 hover:text-nb-white hover:border-nb-gray-500'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <Link
            href={`/ideas/${idea.slug}`}
            className="flex-1 text-center px-3 py-2.5 bg-nb-red text-white rounded-lg text-[13px] font-semibold hover:bg-nb-red-hover transition-colors"
          >
            Voir les details
          </Link>
        </div>
      </div>
    </div>
  )
}
