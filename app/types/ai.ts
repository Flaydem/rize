export interface GenerateObjectParams<T = unknown> {
  prompt: string
  systemPrompt?: string
  schema: unknown // Zod schema
  temperature?: number
  maxTokens?: number
  promptVersion?: string
}

export interface GenerateTextParams {
  prompt: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  promptVersion?: string
}

export interface AIProviderResponse<T = unknown> {
  data: T
  inputTokens?: number
  outputTokens?: number
  model: string
}

export interface MarketPotentialItem {
  score: number
  description: string
}

export interface MarketPotentialData {
  marketSize: MarketPotentialItem
  maturity: MarketPotentialItem
  trend: MarketPotentialItem
  demandPotential: MarketPotentialItem
  purchaseFrequency: MarketPotentialItem
}

export interface ExtractedBusinessIdea {
  title: string
  oneLiner: string
  summary: string
  problem: string
  solution: string
  audience: string
  monetizationModel: string
  categories: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  budgetLevel: 'low' | 'medium' | 'high'
  estimatedLaunchTimeDays: number | null
  tags: string[]
  viabilityScore: number | null
  confidenceScore: number | null
  marketPotential?: MarketPotentialData
}

export interface StructuredPlanContent {
  mvp: {
    emoji?: string
    summary: string
    coreFeatures: { feature: string; why: string; tool: string }[]
    excludeFromMvp: string[]
    estimatedBudget: string | { total: string; categories: { name: string; emoji: string; items: string[] }[] }
    estimatedTimeline: string | { total: string; phases: { name: string; duration: string }[] }
  }
  launchRoadmap: {
    week: number
    title: string
    tasks: string[]
    milestone: string
  }[]
  marketingPlan: {
    primaryAngle: string
    channels: { name: string; why: string; action: string; priority: string }[]
    contentIdeas: { type: string; topic: string; hook: string }[]
    firstWeekActions: string[]
    kpis: string[]
  }
}

export interface LaunchPackContent {
  brandNames: string[]
  domainSuggestions: string[]
  positioningStatement: string
  homepageOutline: {
    sections: { title: string; content: string }[]
  }
  landingPageCopy: {
    headline: string
    subheadline: string
    cta: string
    benefits: string[]
    socialProof: string
  }
  featureMockOutline: string[]
  pricingHypothesis: {
    tiers: { name: string; price: string; features: string[] }[]
  }
  contentStrategy: {
    platforms: string[]
    contentTypes: string[]
    frequency: string
    hooks: string[]
  }
  launchSequence: { day: number; action: string }[]
  leadMagnetIdea: string
  distributionChannels: string[]
  experimentBacklog: string[]
}

export interface ValidationResult {
  scoreGlobal: number
  scoreProblem: number
  scoreAudience: number
  scoreMonetization: number
  scoreDistribution: number
  scoreFeasibility: number
  scoreDifferentiation: number
  strengths: string[]
  risks: string[]
  recommendations: string[]
  validationPlan: {
    day: number
    action: string
    metric: string
  }[]
  repositioningSuggestion?: string
  verdict: 'go' | 'iterate' | 'reject'
}

export interface HeuristicScoreInput {
  problemClarity: string
  audienceSpecificity: string
  monetizationModel: string
  distributionChannels: string
  differentiation: string
  technicalFeasibility: string
  timeToMarket: string
}

export interface HeuristicScoreResult {
  total: number
  breakdown: {
    problemClarity: number
    audienceSpecificity: number
    monetizationClarity: number
    distributionFeasibility: number
    competitiveDifferentiation: number
    buildFeasibility: number
    speedToMarket: number
  }
}
