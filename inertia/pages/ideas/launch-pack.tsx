import { Link } from '@inertiajs/react'
import AppLayout from '~/layouts/app_layout'

interface Props {
  pack: any
  idea: any
}

export default function LaunchPackPage({ pack, idea }: Props) {
  if (pack.status !== 'completed') {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <h2 className="text-lg font-bold text-nb-white">Le pack de lancement est {pack.status === 'pending' ? 'en attente' : 'en cours'}</h2>
          <p className="text-nb-gray-500 mt-1">Veuillez patienter pendant la generation.</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl">
        <Link href={`/ideas/${idea.slug}`} className="text-sm text-nb-red hover:text-nb-red-hover transition-colors mb-6 inline-block">
          &larr; Retour a {idea.title}
        </Link>

        <h1 className="text-2xl font-black text-nb-white mb-1">Pack de <span className="bg-nb-red px-1.5 text-white">Lancement</span></h1>
        <p className="text-nb-gray-500 mb-8">Version {pack.version} pour "{idea.title}"</p>

        <div className="space-y-6">
          {pack.brandNames?.length > 0 && (
            <Section title="Idees de noms de marque">
              <div className="flex flex-wrap gap-2">
                {pack.brandNames.map((name: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-nb-red-muted text-nb-red rounded-lg text-sm font-bold">{name}</span>
                ))}
              </div>
            </Section>
          )}

          {pack.domainSuggestions?.length > 0 && (
            <Section title="Suggestions de domaines">
              <div className="flex flex-wrap gap-2">
                {pack.domainSuggestions.map((domain: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-nb-border text-nb-gray-300 rounded text-sm font-mono">{domain}</span>
                ))}
              </div>
            </Section>
          )}

          {pack.offerDesign && Object.keys(pack.offerDesign).length > 0 && (
            <Section title="Conception de l'offre">
              <div className="text-sm text-nb-gray-400 space-y-1">
                {Object.entries(pack.offerDesign).map(([key, value]) => (
                  <p key={key}><strong className="text-nb-white capitalize">{key.replace(/([A-Z])/g, ' $1')} :</strong> {typeof value === 'string' ? value : JSON.stringify(value)}</p>
                ))}
              </div>
            </Section>
          )}

          {pack.websiteOutline?.sections && (
            <Section title="Plan du site web">
              <div className="space-y-3 text-sm">
                {pack.websiteOutline.sections.map((section: any, i: number) => (
                  <div key={i} className="border-l-2 border-nb-red pl-4">
                    <h4 className="font-bold text-nb-white">{section.title}</h4>
                    <p className="text-nb-gray-400 mt-1">{section.content}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {pack.marketingPlan && Object.keys(pack.marketingPlan).length > 0 && (
            <Section title="Plan marketing">
              <div className="text-sm text-nb-gray-400 space-y-2">
                {Object.entries(pack.marketingPlan).map(([key, value]) => (
                  <div key={key}>
                    <strong className="text-nb-white capitalize">{key.replace(/([A-Z])/g, ' $1')} :</strong>{' '}
                    {Array.isArray(value) ? (
                      <div className="flex flex-wrap gap-1 mt-1">{(value as string[]).map((v, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-nb-blue-muted text-nb-blue rounded text-xs font-medium">{String(v)}</span>
                      ))}</div>
                    ) : typeof value === 'string' ? value : JSON.stringify(value)}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {pack.launchChecklist?.length > 0 && (
            <Section title="Liste de controle du lancement">
              <div className="space-y-2">
                {pack.launchChecklist.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-nb-red mt-0.5">&#9744;</span>
                    <span className="text-nb-gray-400">{typeof item === 'string' ? item : `Jour ${item.day} : ${item.action}`}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {pack.contentAngles?.length > 0 && (
            <Section title="Angles de contenu">
              <ul className="list-disc ml-5 text-sm text-nb-gray-400 space-y-1">
                {pack.contentAngles.map((angle: string, i: number) => <li key={i}>{angle}</li>)}
              </ul>
            </Section>
          )}

          {pack.assumptions?.length > 0 && (
            <Section title="Hypotheses a valider">
              <ul className="list-disc ml-5 text-sm text-nb-gray-400 space-y-1">
                {pack.assumptions.map((a: string, i: number) => <li key={i}>{a}</li>)}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-nb-surface rounded-xl border border-nb-border p-5">
      <h2 className="font-bold text-nb-white mb-3">{title}</h2>
      {children}
    </div>
  )
}
