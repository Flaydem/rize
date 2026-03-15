import type { HeuristicScoreInput, HeuristicScoreResult } from '#types/ai'

export class HeuristicScoringService {
  score(input: HeuristicScoreInput): HeuristicScoreResult {
    const breakdown = {
      problemClarity: this.scoreProblemClarity(input.problemClarity),
      audienceSpecificity: this.scoreAudienceSpecificity(input.audienceSpecificity),
      monetizationClarity: this.scoreMonetizationClarity(input.monetizationModel),
      distributionFeasibility: this.scoreDistribution(input.distributionChannels),
      competitiveDifferentiation: this.scoreDifferentiation(input.differentiation),
      buildFeasibility: this.scoreBuildFeasibility(input.technicalFeasibility),
      speedToMarket: this.scoreSpeedToMarket(input.timeToMarket),
    }

    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

    return { total, breakdown }
  }

  private scoreProblemClarity(text: string): number {
    // Max 20 points
    if (!text || text.length < 10) return 3
    let score = 5
    if (text.length > 50) score += 4
    if (text.length > 100) score += 3
    if (/pain|frustrat|waste|struggle|difficult|expensive|slow|manual/i.test(text)) score += 4
    if (/specific|exact|measur/i.test(text)) score += 4
    return Math.min(score, 20)
  }

  private scoreAudienceSpecificity(text: string): number {
    // Max 15 points
    if (!text || text.length < 5) return 2
    let score = 3
    if (text.length > 30) score += 3
    if (/\d/.test(text)) score += 3 // contains numbers (quantified)
    if (/who|that|with|aged|earning|working/i.test(text)) score += 3
    if (text.split(' ').length > 5) score += 3
    return Math.min(score, 15)
  }

  private scoreMonetizationClarity(text: string): number {
    // Max 15 points
    if (!text || text.length < 3) return 2
    let score = 4
    const models = ['subscription', 'saas', 'commission', 'freemium', 'one-time', 'recurring', 'license', 'marketplace']
    if (models.some((m) => text.toLowerCase().includes(m))) score += 5
    if (/\$|\€|price|revenue|margin/i.test(text)) score += 3
    if (text.length > 30) score += 3
    return Math.min(score, 15)
  }

  private scoreDistribution(text: string): number {
    // Max 15 points
    if (!text || text.length < 5) return 2
    let score = 3
    const channels = ['seo', 'content', 'social', 'paid', 'referral', 'partnership', 'cold', 'community', 'email', 'viral']
    const matchCount = channels.filter((c) => text.toLowerCase().includes(c)).length
    score += Math.min(matchCount * 3, 9)
    if (text.length > 40) score += 3
    return Math.min(score, 15)
  }

  private scoreDifferentiation(text: string): number {
    // Max 15 points
    if (!text || text.length < 5) return 2
    let score = 3
    if (text.length > 30) score += 3
    if (/unique|only|first|different|unlike|better|faster|cheaper/i.test(text)) score += 4
    if (/niche|specific|focus|special/i.test(text)) score += 3
    if (text.split(' ').length > 8) score += 2
    return Math.min(score, 15)
  }

  private scoreBuildFeasibility(text: string): number {
    // Max 10 points
    if (!text || text.length < 3) return 3
    let score = 4
    if (/simple|easy|no-code|low-code|api|existing|template/i.test(text)) score += 3
    if (/complex|difficult|hard|custom|infrastructure/i.test(text)) score -= 2
    if (text.length > 20) score += 2
    return Math.max(Math.min(score, 10), 1)
  }

  private scoreSpeedToMarket(text: string): number {
    // Max 10 points
    if (!text || text.length < 3) return 3
    let score = 4
    if (/week|day|fast|quick|rapid|mvp|lean/i.test(text)) score += 3
    if (/month|year|long|slow/i.test(text)) score -= 1
    if (/1\s*week|2\s*week|30\s*day|weekend/i.test(text)) score += 3
    return Math.max(Math.min(score, 10), 1)
  }
}
