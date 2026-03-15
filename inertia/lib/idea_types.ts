export interface QuickInsight {
  label: string
  value: string
  icon: string
  color: 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'purple'
}

export interface BusinessSnapshot {
  monetizationModel: string
  revenueType: string
  averagePrice: string
  estimatedMargin: string
  timeToFirstRevenue: string
  operationalComplexity: string
  scalePotential: string
  soloFriendly: boolean
}

export interface MarketInsight {
  label: string
  value: number
  maxValue: number
  description: string
}

export interface AcquisitionChannel {
  name: string
  relevance: number
  difficulty: string
  speed: string
  estimatedCost: string
  comment: string
}

export interface Risk {
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  category: string
}

export interface MvpRecommendation {
  approach: string
  includes: string[]
  excludes: string[]
  minBudget: string
  timeToLaunch: string
  resources: string[]
}

export interface ValidationStep {
  step: number
  title: string
  description: string
  duration: string
  objective: string
}

export interface MarketingAngle {
  type: string
  title: string
  description: string
  example?: string
}

export interface CompetitionData {
  saturationLevel: string
  saturationScore: number
  differentiation: string
  unexploitedAngle: string
  entryBarrier: string
  whyNow: string
}

export interface ExpansionIdea {
  title: string
  description: string
  type: string
}

export interface IdeaExtendedData {
  quickInsights: QuickInsight[]
  businessSnapshot: BusinessSnapshot
  marketInsights: MarketInsight[]
  acquisitionChannels: AcquisitionChannel[]
  risks: Risk[]
  mvp: MvpRecommendation
  validationSteps: ValidationStep[]
  marketingAngles: MarketingAngle[]
  competition: CompetitionData
  expansions: ExpansionIdea[]
}
