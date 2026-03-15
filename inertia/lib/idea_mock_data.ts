import type { IdeaExtendedData } from './idea_types'

export function generateMockData(idea: any): IdeaExtendedData {
  const score = idea.viabilityScore ?? 50
  const isEasy = idea.difficultyLevel === 'easy'
  const isHard = idea.difficultyLevel === 'hard'
  const budget = idea.startupBudgetLevel

  return {
    quickInsights: [
      {
        label: 'Revenu potentiel',
        value: budget === 'high' ? '10k-50k€/mois' : budget === 'medium' ? '2k-10k€/mois' : '500-2k€/mois',
        icon: 'revenue',
        color: score >= 70 ? 'green' : 'yellow',
      },
      {
        label: 'Mise sur le marche',
        value: idea.estimatedLaunchTimeDays
          ? idea.estimatedLaunchTimeDays <= 14 ? 'Tres rapide' : idea.estimatedLaunchTimeDays <= 30 ? 'Rapide' : 'Moderee'
          : 'A evaluer',
        icon: 'speed',
        color: isEasy ? 'green' : isHard ? 'orange' : 'yellow',
      },
      {
        label: 'Concurrence',
        value: score >= 70 ? 'Faible' : score >= 50 ? 'Moderee' : 'Forte',
        icon: 'competition',
        color: score >= 70 ? 'green' : score >= 50 ? 'yellow' : 'red',
      },
      {
        label: 'Recurrence',
        value: idea.monetizationModel?.toLowerCase().includes('abonnement') || idea.monetizationModel?.toLowerCase().includes('saas')
          ? 'Forte' : idea.monetizationModel?.toLowerCase().includes('service') ? 'Moderee' : 'Faible',
        icon: 'recurrence',
        color: 'blue',
      },
      {
        label: 'Effort estime',
        value: isEasy ? 'Faible' : isHard ? 'Eleve' : 'Modere',
        icon: 'effort',
        color: isEasy ? 'green' : isHard ? 'red' : 'yellow',
      },
    ],

    businessSnapshot: {
      monetizationModel: idea.monetizationModel || 'A definir',
      revenueType: idea.monetizationModel?.toLowerCase().includes('abonnement') ? 'Recurrent'
        : idea.monetizationModel?.toLowerCase().includes('service') ? 'Hybride' : 'Ponctuel',
      averagePrice: budget === 'high' ? '200-500€' : budget === 'medium' ? '50-200€' : '10-50€',
      estimatedMargin: score >= 70 ? '60-80%' : score >= 50 ? '30-60%' : '15-30%',
      timeToFirstRevenue: idea.estimatedLaunchTimeDays
        ? `${Math.round(idea.estimatedLaunchTimeDays * 1.5)} jours` : '30-60 jours',
      operationalComplexity: isEasy ? 'Faible' : isHard ? 'Elevee' : 'Moderee',
      scalePotential: score >= 70 ? 'Fort' : score >= 50 ? 'Modere' : 'Limite',
      soloFriendly: isEasy || idea.difficultyLevel === 'medium',
    },

    marketInsights: [
      { label: 'Taille du marche', value: score >= 60 ? 75 : 40, maxValue: 100, description: score >= 60 ? 'Marche large et accessible' : 'Marche de niche' },
      { label: 'Maturite', value: score >= 70 ? 60 : 35, maxValue: 100, description: score >= 70 ? 'Marche en croissance' : 'Marche emergent' },
      { label: 'Tendance', value: Math.min(score + 10, 100), maxValue: 100, description: 'Tendance haussiere' },
      { label: 'Potentiel de demande', value: score, maxValue: 100, description: score >= 60 ? 'Demande forte identifiee' : 'Demande a valider' },
      { label: 'Frequence d\'achat', value: idea.monetizationModel?.includes('abonnement') ? 80 : 45, maxValue: 100, description: idea.monetizationModel?.includes('abonnement') ? 'Achats recurrents' : 'Achats ponctuels' },
    ],

    acquisitionChannels: [
      { name: 'TikTok / Reels', relevance: 85, difficulty: 'Facile', speed: 'Rapide', estimatedCost: 'Gratuit', comment: 'Ideal pour le contenu viral et la preuve sociale' },
      { name: 'SEO / Blog', relevance: 60, difficulty: 'Moyen', speed: 'Lent', estimatedCost: '0-100€/mois', comment: 'Trafic organique a long terme' },
      { name: 'Meta Ads', relevance: 70, difficulty: 'Moyen', speed: 'Rapide', estimatedCost: '300-1000€/mois', comment: 'Ciblage precis, ROI mesurable' },
      { name: 'Influence', relevance: 75, difficulty: 'Facile', speed: 'Rapide', estimatedCost: '100-500€', comment: 'Micro-influenceurs pour credibilite' },
      { name: 'Communautes', relevance: 55, difficulty: 'Facile', speed: 'Moyen', estimatedCost: 'Gratuit', comment: 'Reddit, Discord, groupes Facebook' },
      { name: 'Prospection directe', relevance: 45, difficulty: 'Difficile', speed: 'Moyen', estimatedCost: '50-200€/mois', comment: 'Email a froid pour B2B' },
    ],

    risks: [
      { title: 'Validation du marche', description: 'La demande reelle n\'est pas encore prouvee. Un test rapide est necessaire avant d\'investir.', severity: 'high', category: 'Marche' },
      { title: 'Execution technique', description: 'Le MVP doit etre simple pour eviter les blocages techniques.', severity: isHard ? 'high' : 'medium', category: 'Technique' },
      { title: 'Acquisition clients', description: 'Le cout d\'acquisition pourrait etre plus eleve que prevu sans strategie organique.', severity: 'medium', category: 'Marketing' },
      { title: 'Concurrence reactive', description: 'Des concurrents pourraient copier rapidement le concept si le marche est valide.', severity: score >= 70 ? 'low' : 'medium', category: 'Concurrence' },
      { title: 'Scalabilite', description: 'La croissance pourrait etre limitee sans automatisation des processus cles.', severity: isHard ? 'high' : 'low', category: 'Operations' },
    ],

    mvp: {
      approach: 'Lancer une version minimale pour valider l\'interet avant de developper davantage. Privilegier la preuve de concept avec un investissement minimal.',
      includes: [
        'Page de vente simple',
        'Offre principale clairement definie',
        'Moyen de paiement integre',
        'Canal d\'acquisition principal active',
        'Systeme de retour client',
      ],
      excludes: [
        'Maquette complexe ou sur-mesure',
        'Fonctionnalites secondaires',
        'Application mobile native',
        'Automatisations avancees',
        'Multi-langue',
      ],
      minBudget: budget === 'high' ? '2000-5000€' : budget === 'medium' ? '500-2000€' : '0-500€',
      timeToLaunch: idea.estimatedLaunchTimeDays ? `${idea.estimatedLaunchTimeDays} jours` : '14-30 jours',
      resources: isEasy
        ? ['Fondateur solo', 'Outil no-code', 'Modele premium']
        : ['Fondateur + 1 freelance', 'Outil no-code ou low-code', 'Graphiste UI ponctuel'],
    },

    validationSteps: [
      { step: 1, title: 'Recherche rapide', description: 'Analyser la concurrence et les signaux de demande existants.', duration: 'Jour 1-2', objective: 'Confirmer qu\'un marche existe' },
      { step: 2, title: 'Creer l\'offre', description: 'Definir l\'offre exacte, le prix et le positionnement.', duration: 'Jour 2-3', objective: 'Avoir une proposition claire' },
      { step: 3, title: 'Page de vente', description: 'Creer une page de vente simple avec appel a l\'action.', duration: 'Jour 3-4', objective: 'Capturer de l\'interet' },
      { step: 4, title: 'Premier contenu', description: 'Publier 3-5 contenus sur le canal principal.', duration: 'Jour 4-5', objective: 'Generer du trafic' },
      { step: 5, title: 'Tester la conversion', description: 'Envoyer du trafic vers la page et mesurer les inscriptions / ventes.', duration: 'Jour 5-6', objective: '10+ inscriptions ou 1+ vente' },
      { step: 6, title: 'Analyser & decider', description: 'Evaluer les resultats et decider : continuer, pivoter ou abandonner.', duration: 'Jour 7', objective: 'Decision Go / No-Go' },
    ],

    marketingAngles: [
      { type: 'Emotionnel', title: 'La frustration du probleme', description: 'Mettre en avant la douleur ressentie par l\'audience cible et montrer que la solution existe.', example: '"Vous en avez marre de... ? Voici la solution."' },
      { type: 'Rationnel', title: 'Les chiffres qui parlent', description: 'Utiliser des donnees, statistiques ou projections pour convaincre de l\'opportunite.', example: '"X% des gens rencontrent ce probleme chaque jour."' },
      { type: 'Viralite', title: 'Le contenu partageable', description: 'Creer du contenu surprenant, educatif ou divertissant autour du concept.', example: '"J\'ai lance un business en 7 jours, voici les resultats."' },
      { type: 'Autorite', title: 'La preuve sociale', description: 'Montrer des temoignages, cas d\'usage ou resultats concrets pour etablir la credibilite.', example: '"3 clients en 48h sans pub payante."' },
      { type: 'Urgence', title: 'La fenetre d\'opportunite', description: 'Creer un sentiment d\'urgence lie a la tendance ou a la rarete.', example: '"Ce marche explose en ce moment. Voici pourquoi il faut agir vite."' },
    ],

    competition: {
      saturationLevel: score >= 70 ? 'Faible' : score >= 50 ? 'Moderee' : 'Elevee',
      saturationScore: score >= 70 ? 25 : score >= 50 ? 55 : 80,
      differentiation: 'L\'angle unique de cette idee repose sur une approche plus accessible et un positionnement fort en contenu viral.',
      unexploitedAngle: 'Le marche francophone est sous-exploite pour cette categorie. Il y a une opportunite de premier entrant.',
      entryBarrier: isEasy ? 'Faible' : isHard ? 'Elevee' : 'Moderee',
      whyNow: 'Les tendances actuelles du marche et la croissance des plateformes de contenu creent une fenetre d\'opportunite ideale.',
    },

    expansions: [
      { title: 'Version premium', description: 'Offre haut de gamme avec accompagnement personnalise ou fonctionnalites avancees.', type: 'Montee en gamme' },
      { title: 'Abonnement mensuel', description: 'Passer a un modele recurrent avec du contenu ou un service continu.', type: 'Recurrence' },
      { title: 'Extension B2B', description: 'Adapter l\'offre pour les entreprises et les professionnels.', type: 'Marche' },
      { title: 'Produits derives', description: 'Creer des ressources complementaires : modeles, formations, outils.', type: 'Offre groupee' },
      { title: 'Passage a l\'echelle', description: 'Automatiser et developper une plateforme pour servir plus de clients.', type: 'Croissance' },
    ],
  }
}
