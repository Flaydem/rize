import { Link } from '@inertiajs/react'
import AppLayout from '~/layouts/app_layout'
import { difficultyLabel, budgetLabel, scoreBgColor } from '~/lib/utils'

interface Props {
  stats: {
    totalIdeas: number
    reviewedIdeas: number
    totalValidations: number
    totalPlans: number
    totalPacks: number
    avgScore: number
  }
  difficultyBreakdown: { level: string; count: number }[]
  budgetBreakdown: { level: string; count: number }[]
  categoryBreakdown: { name: string; count: number }[]
  recentIdeas: any[]
  topIdeas: any[]
  savedIdeas: any[]
}

export default function Dashboard({ stats, difficultyBreakdown, budgetBreakdown, categoryBreakdown, recentIdeas, topIdeas, savedIdeas }: Props) {
  const totalForDiff = difficultyBreakdown.reduce((s, d) => s + d.count, 0) || 1
  const totalForBudget = budgetBreakdown.reduce((s, d) => s + d.count, 0) || 1

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">

        {/* ── Header + CTA principal ── */}
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.15em] text-nb-gray-600 mb-2">Tableau de bord</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-[28px] md:text-[32px] font-extrabold text-nb-white leading-tight">
              Vue d'ensemble
            </h1>
            <Link
              href="/ideas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-nb-red text-white rounded-lg text-sm font-bold hover:bg-nb-red-hover transition-colors"
            >
              Explorer les idees
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>

        {/* ── Key metrics row ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          <MetricTile label="Idees" value={stats.totalIdeas} />
          <MetricTile label="Validees" value={stats.reviewedIdeas} accent />
          <MetricTile label="Score moyen" value={stats.avgScore > 0 ? stats.avgScore : '—'} suffix={stats.avgScore > 0 ? '/100' : undefined} />
          <MetricTile label="Plans generes" value={stats.totalPlans} />
          <MetricTile label="Launch packs" value={stats.totalPacks} />
          <MetricTile label="Validations" value={stats.totalValidations} />
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">

          {/* ── Recent ideas ── */}
          <div className="lg:col-span-2">
            <SectionTitle title="Idees recentes" href="/ideas" linkText="Tout voir" />
            {recentIdeas.length > 0 ? (
              <div className="space-y-2">
                {recentIdeas.map((idea) => (
                  <IdeaRow key={idea.id} idea={idea} />
                ))}
              </div>
            ) : (
              <EmptyState text="Aucune idee pour le moment" />
            )}
          </div>

          {/* ── Categories ── */}
          <div>
            <SectionTitle title="Categories" />
            {categoryBreakdown.length > 0 ? (
              <div className="space-y-2.5">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] text-nb-gray-300 truncate">{cat.name}</span>
                        <span className="text-[12px] text-nb-gray-500 tabular-nums flex-shrink-0 ml-2">{cat.count}</span>
                      </div>
                      <div className="h-[3px] bg-nb-border/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-nb-red rounded-full transition-all duration-500"
                          style={{ width: `${(cat.count / (categoryBreakdown[0]?.count || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Aucune categorie" />
            )}
          </div>
        </div>

        {/* ── Saved ideas ── */}
        {savedIdeas.length > 0 && (
          <div className="mb-10">
            <SectionTitle title="Idees sauvegardees" href="/ideas" linkText="Voir tout" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedIdeas.map((idea) => (
                <Link
                  key={idea.id}
                  href={`/ideas/${idea.slug}`}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-nb-red/20 bg-nb-red-muted/30 hover:bg-nb-red-muted/50 transition-colors group"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nb-red flex-shrink-0">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="text-[13px] text-nb-gray-300 group-hover:text-nb-white transition-colors truncate flex-1 min-w-0">
                    {idea.title}
                  </span>
                  {idea.viabilityScore != null && (
                    <span className={`text-[12px] font-bold tabular-nums px-2 py-0.5 rounded ${scoreBgColor(idea.viabilityScore)}`}>
                      {idea.viabilityScore}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

          {/* ── Top ideas ── */}
          <div>
            <SectionTitle title="Meilleures idees" />
            {topIdeas.length > 0 ? (
              <div className="space-y-2">
                {topIdeas.map((idea, idx) => (
                  <Link
                    key={idea.id}
                    href={`/ideas/${idea.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-nb-surface transition-colors group"
                  >
                    <span className="text-[12px] font-mono text-nb-gray-600 w-5 text-right flex-shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] text-nb-gray-300 group-hover:text-nb-white transition-colors truncate flex-1 min-w-0">
                      {idea.title}
                    </span>
                    <span className={`text-[12px] font-bold tabular-nums px-2 py-0.5 rounded ${scoreBgColor(idea.viabilityScore)}`}>
                      {idea.viabilityScore}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState text="Aucune idee notee" />
            )}
          </div>

          {/* ── Difficulte ── */}
          <div>
            <SectionTitle title="Par difficulte" />
            <DistributionBars
              items={difficultyBreakdown.map((d) => ({
                label: difficultyLabel(d.level),
                count: d.count,
                pct: Math.round((d.count / totalForDiff) * 100),
                color: d.level === 'easy' ? 'bg-nb-green' : d.level === 'medium' ? 'bg-nb-yellow' : 'bg-nb-red',
              }))}
            />
          </div>

          {/* ── Budget ── */}
          <div>
            <SectionTitle title="Par budget" />
            <DistributionBars
              items={budgetBreakdown.map((b) => ({
                label: budgetLabel(b.level),
                count: b.count,
                pct: Math.round((b.count / totalForBudget) * 100),
                color: b.level === 'low' ? 'bg-nb-green' : b.level === 'medium' ? 'bg-nb-yellow' : 'bg-nb-red',
              }))}
            />
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="border-t border-nb-border/50 pt-8 pb-4">
          <div className="flex flex-wrap gap-3">
            <QuickAction href="/validator" label="Valider une idee" />
            <QuickAction href="/admin/source-items/create" label="Importer des sources" />
          </div>
        </div>

      </div>
    </AppLayout>
  )
}

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function MetricTile({ label, value, suffix, accent }: { label: string; value: string | number; suffix?: string; accent?: boolean }) {
  return (
    <div className="px-4 py-3.5 rounded-xl border border-nb-border bg-nb-surface">
      <p className="text-[11px] text-nb-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-[22px] font-extrabold tabular-nums leading-none ${accent ? 'text-nb-red' : 'text-nb-white'}`}>
        {value}
        {suffix && <span className="text-[12px] font-normal text-nb-gray-500 ml-0.5">{suffix}</span>}
      </p>
    </div>
  )
}

function IdeaRow({ idea }: { idea: any }) {
  return (
    <Link
      href={`/ideas/${idea.slug}`}
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-nb-border hover:border-nb-red/30 bg-nb-surface hover:bg-nb-surface-hover transition-all group"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-semibold text-nb-white truncate group-hover:text-nb-red transition-colors">
          {idea.title}
        </h3>
        <p className="text-[12px] text-nb-gray-500 truncate mt-0.5">{idea.oneLiner}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {idea.categoryPrimary && (
          <span className="text-[10px] text-nb-gray-500 bg-nb-dark px-2 py-0.5 rounded-full border border-nb-border hidden sm:inline">
            {idea.categoryPrimary}
          </span>
        )}
        {idea.viabilityScore != null && (
          <span className={`text-[12px] font-bold tabular-nums px-2 py-0.5 rounded ${scoreBgColor(idea.viabilityScore)}`}>
            {idea.viabilityScore}
          </span>
        )}
      </div>
    </Link>
  )
}

function DistributionBars({ items }: { items: { label: string; count: number; pct: number; color: string }[] }) {
  if (!items.length) return <EmptyState text="Aucune donnee" />

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] text-nb-gray-300">{item.label}</span>
            <span className="text-[12px] text-nb-gray-500 tabular-nums">{item.count} <span className="text-nb-gray-600">({item.pct}%)</span></span>
          </div>
          <div className="h-[4px] bg-nb-border/30 rounded-full overflow-hidden">
            <div
              className={`h-full ${item.color} rounded-full transition-all duration-700`}
              style={{ width: `${item.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SectionTitle({ title, href, linkText }: { title: string; href?: string; linkText?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[13px] uppercase tracking-[0.1em] text-nb-gray-500 font-medium">{title}</h2>
      {href && linkText && (
        <Link href={href} className="text-[12px] text-nb-gray-600 hover:text-nb-red transition-colors">{linkText}</Link>
      )}
    </div>
  )
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-[13px] text-nb-gray-400 hover:text-nb-white px-4 py-2 rounded-lg border border-nb-border hover:border-nb-gray-500 transition-all"
    >
      {label}
    </Link>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-[13px] text-nb-gray-600 py-4">{text}</p>
}
