export const PROMPTS = {
  extractBusinessIdea: {
    version: '1.2',
    system: `Tu es un analyste business expert. Extrais une idee business structuree a partir du contenu fourni. Reponds TOUJOURS en francais et en JSON valide.`,
    user: (rawText: string) => `Analyse le contenu suivant et extrais une idee business structuree. Reponds UNIQUEMENT en francais.

Contenu :
"""
${rawText}
"""

Reponds avec un objet JSON contenant exactement ces champs (tout en francais) :
{
  "title": "titre concis de l'idee business",
  "oneLiner": "pitch en une phrase",
  "summary": "resume de 2-3 paragraphes",
  "problem": "le probleme resolu",
  "solution": "la solution proposee",
  "audience": "description de l'audience cible",
  "monetizationModel": "comment ca genere des revenus (ex : abonnement, commission, vente unique)",
  "categories": ["tableau de cles de categories parmi : ecommerce, saas, agency, info-product, local-service, marketplace, newsletter-media, content-brand, ai-automation, freelance-productized-service, community, education, recruiting, lead-generation, no-code-tool, b2b-service, b2c-product"],
  "difficulty": "easy|medium|hard",
  "budgetLevel": "low|medium|high",
  "estimatedLaunchTimeDays": nombre ou null,
  "tags": ["tags", "pertinents"],
  "viabilityScore": nombre 0-100 ou null,
  "confidenceScore": nombre 0-100 ou null,
  "marketPotential": {
    "marketSize": { "score": nombre 0-100, "description": "phrase courte expliquant la taille du marche cible" },
    "maturity": { "score": nombre 0-100, "description": "phrase courte sur la maturite du marche (emergent, en croissance, mature, sature)" },
    "trend": { "score": nombre 0-100, "description": "phrase courte sur la tendance actuelle du marche" },
    "demandPotential": { "score": nombre 0-100, "description": "phrase courte sur le potentiel de demande reel" },
    "purchaseFrequency": { "score": nombre 0-100, "description": "phrase courte sur la frequence d'achat attendue" }
  }
}`,
  },

  generateStructuredPlan: {
    version: '2.2',
    system: `Tu es un consultant senior en strategie startup, specialise dans le lancement de MVP. Tu produis des plans concrets, specifiques et actionnables — jamais generiques. Chaque element doit etre directement lie au projet analyse. Reponds TOUJOURS en francais et en JSON valide.`,
    user: (idea: { title: string; summary: string; problem: string; solution: string; audience: string; monetizationModel: string }) => `Genere un plan de lancement structure et hyper-specifique pour cette idee business. Reponds UNIQUEMENT en francais.

IMPORTANT : Chaque element du plan doit etre specifique a CE projet. Pas de conseils generiques. Cite des outils, des chiffres, des exemples concrets adaptes a cette idee.

Titre : ${idea.title}
Resume : ${idea.summary}
Probleme : ${idea.problem}
Solution : ${idea.solution}
Audience cible : ${idea.audience}
Monetisation : ${idea.monetizationModel}

Reponds avec un objet JSON contenant exactement ces champs (tout en francais) :
{
  "mvp": {
    "emoji": "un seul emoji representant le produit (ex: 🎮, 🍔, 📱)",
    "summary": "description en 2-3 phrases de ce que le MVP doit etre — specifique au projet",
    "coreFeatures": [
      { "feature": "nom de la fonctionnalite", "why": "pourquoi elle est essentielle pour ce projet specifiquement", "tool": "outil ou techno recommandee pour l'implementer" }
    ],
    "excludeFromMvp": ["element explicitement exclu du MVP et pourquoi"],
    "estimatedBudget": {
      "total": "fourchette courte ex: 1 500€ a 3 500€",
      "categories": [
        { "name": "nom categorie de couts", "emoji": "emoji pertinent", "items": ["poste : montant€", "poste : montant€"] }
      ]
    },
    "estimatedTimeline": {
      "total": "duree courte ex: 6 a 8 semaines",
      "phases": [
        { "name": "nom de la phase", "duration": "duree courte ex: 2 sem" }
      ]
    }
  },
  "launchRoadmap": [
    { "week": 1, "title": "titre de la phase", "tasks": ["tache concrete et specifique 1", "tache concrete 2"], "milestone": "resultat attendu en fin de semaine" },
    { "week": 2, "title": "titre de la phase", "tasks": ["tache concrete 1", "tache concrete 2"], "milestone": "resultat attendu" },
    { "week": 3, "title": "titre de la phase", "tasks": ["tache concrete 1", "tache concrete 2"], "milestone": "resultat attendu" },
    { "week": 4, "title": "titre de la phase", "tasks": ["tache concrete 1", "tache concrete 2"], "milestone": "resultat attendu" }
  ],
  "marketingPlan": {
    "primaryAngle": "l'angle marketing principal — comment positionner cette offre specifiquement pour toucher l'audience cible",
    "channels": [
      { "name": "nom du canal", "why": "pourquoi ce canal est pertinent pour cette audience", "action": "action concrete a faire sur ce canal", "priority": "haute|moyenne|basse" }
    ],
    "contentIdeas": [
      { "type": "type de contenu (video, article, post...)", "topic": "sujet specifique lie a l'idee", "hook": "accroche concrete" }
    ],
    "firstWeekActions": ["action marketing concrete pour la semaine 1"],
    "kpis": ["indicateur de performance a suivre"]
  }
}`,
  },

  generateLaunchPack: {
    version: '1.1',
    system: `Tu es un strategiste de lancement startup et consultant en marque. Genere un pack de lancement complet. Reponds TOUJOURS en francais et en JSON valide.`,
    user: (idea: { title: string; summary: string; audience: string; monetizationModel: string }, plan?: { marketAngle: string; offerHypothesis: string }) => `Genere un pack de lancement pour cette idee business. Reponds UNIQUEMENT en francais.

Titre : ${idea.title}
Resume : ${idea.summary}
Audience : ${idea.audience}
Monetisation : ${idea.monetizationModel}
${plan ? `Angle marche : ${plan.marketAngle}\nOffre : ${plan.offerHypothesis}` : ''}

Reponds avec un objet JSON (tout en francais) :
{
  "brandNames": ["10 suggestions de noms de marque"],
  "domainSuggestions": ["10 suggestions de domaines"],
  "positioningStatement": "declaration de positionnement",
  "homepageOutline": {
    "sections": [{ "title": "titre de section", "content": "contenu de la section" }]
  },
  "landingPageCopy": {
    "headline": "titre principal",
    "subheadline": "sous-titre",
    "cta": "texte de l'appel a l'action",
    "benefits": ["avantage1", "avantage2"],
    "socialProof": "texte de preuve sociale"
  },
  "featureMockOutline": ["fonctionnalite1", "fonctionnalite2"],
  "pricingHypothesis": {
    "tiers": [{ "name": "nom du palier", "price": "prix", "features": ["fonctionnalite1"] }]
  },
  "contentStrategy": {
    "platforms": ["plateforme1"],
    "contentTypes": ["type1"],
    "frequency": "frequence de publication",
    "hooks": ["accroche1", "accroche2"]
  },
  "launchSequence": [{ "day": 1, "action": "action" }],
  "leadMagnetIdea": "description du lead magnet",
  "distributionChannels": ["canal1"],
  "experimentBacklog": ["experience1"]
}`,
  },

  validateBusinessIdea: {
    version: '1.1',
    system: `Tu es un analyste business critique et conseiller startup. Evalue les idees business objectivement. Reponds TOUJOURS en francais et en JSON valide.`,
    user: (input: { title: string; description: string; targetAudience?: string; context?: Record<string, unknown> }) => `Evalue cette idee business. Reponds UNIQUEMENT en francais.

Titre : ${input.title}
Description : ${input.description}
${input.targetAudience ? `Audience cible : ${input.targetAudience}` : ''}
${input.context ? `Contexte supplementaire : ${JSON.stringify(input.context)}` : ''}

Note chaque dimension (dans la fourchette specifiee) :
- Clarte du probleme (0-20) : Le probleme est-il clair et douloureux ?
- Specificite de l'audience (0-15) : L'audience cible est-elle bien definie ?
- Clarte de la monetisation (0-15) : Le modele de revenus est-il clair et viable ?
- Faisabilite de la distribution (0-15) : Peuvent-ils atteindre les clients de maniere realiste ?
- Differenciation concurrentielle (0-15) : Qu'est-ce qui distingue cette idee ?
- Faisabilite technique (0-10) : Peut-on construire ca avec des ressources raisonnables ?
- Rapidite de mise sur le marche (0-10) : A quelle vitesse peut-on lancer ?

Reponds en JSON :
{
  "scoreProblem": nombre,
  "scoreAudience": nombre,
  "scoreMonetization": nombre,
  "scoreDistribution": nombre,
  "scoreDifferentiation": nombre,
  "scoreFeasibility": nombre,
  "scoreSpeedToMarket": nombre,
  "strengths": ["point fort 1", "point fort 2"],
  "risks": ["risque 1", "risque 2"],
  "recommendations": ["recommandation 1"],
  "validationPlan": [
    { "day": 1, "action": "action", "metric": "indicateur" }
  ],
  "repositioningSuggestion": "suggestion de repositionnement optionnelle",
  "verdict": "go|iterate|reject"
}`,
  },
}
