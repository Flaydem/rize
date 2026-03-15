import { test } from '@japa/runner'
import { HeuristicScoringService } from '#services/validator/heuristic_scoring_service'

test.group('HeuristicScoringService', () => {
  test('returns a score between 0 and 100', ({ assert }) => {
    const service = new HeuristicScoringService()
    const result = service.score({
      problemClarity: 'People waste hours on manual data entry every week',
      audienceSpecificity: 'Freelance designers aged 25-40 earning $50K+',
      monetizationModel: 'SaaS subscription at $29/month',
      distributionChannels: 'SEO, content marketing, social media, referral',
      differentiation: 'The only tool that uses AI specifically for freelancer invoices',
      technicalFeasibility: 'Simple API integration, no complex infrastructure needed',
      timeToMarket: 'Can launch MVP in 2 weeks',
    })

    assert.isAbove(result.total, 0)
    assert.isBelow(result.total, 101)
    assert.properties(result.breakdown, [
      'problemClarity',
      'audienceSpecificity',
      'monetizationClarity',
      'distributionFeasibility',
      'competitiveDifferentiation',
      'buildFeasibility',
      'speedToMarket',
    ])
  })

  test('scores higher for detailed inputs', ({ assert }) => {
    const service = new HeuristicScoringService()

    const vague = service.score({
      problemClarity: 'problem',
      audienceSpecificity: 'people',
      monetizationModel: 'money',
      distributionChannels: 'online',
      differentiation: 'better',
      technicalFeasibility: 'easy',
      timeToMarket: 'fast',
    })

    const detailed = service.score({
      problemClarity: 'Small business owners waste 10+ hours per week on manual invoice processing, leading to frustration and errors',
      audienceSpecificity: 'Freelance web developers aged 25-40 who handle 20+ client invoices monthly and earn $60K-120K',
      monetizationModel: 'SaaS subscription model: $29/month basic, $49/month pro with recurring revenue',
      distributionChannels: 'SEO for long-tail keywords, content marketing via blog, social media presence on Twitter, referral program with 20% commission',
      differentiation: 'The only AI-powered invoice tool built specifically for freelancers with niche integrations',
      technicalFeasibility: 'Simple REST API built with existing AI APIs, no complex infrastructure',
      timeToMarket: 'MVP can be launched in 1 week using no-code tools and existing templates',
    })

    assert.isAbove(detailed.total, vague.total)
  })

  test('each breakdown score respects its maximum', ({ assert }) => {
    const service = new HeuristicScoringService()
    const result = service.score({
      problemClarity: 'Very clear painful problem that causes frustration and wastes time, very specific and measurable',
      audienceSpecificity: 'Freelance designers aged 25-40 who earn $60K-120K working with 10+ clients monthly',
      monetizationModel: 'SaaS subscription with recurring revenue at $49/month with high margin',
      distributionChannels: 'SEO, content marketing, social media, paid ads, referral program, partnerships, email list, community',
      differentiation: 'The first and only unique niche-focused AI tool, unlike anything else on the market, better and faster',
      technicalFeasibility: 'Simple easy API integration, no-code tools available, uses existing templates',
      timeToMarket: 'Can launch MVP in 1 week, very fast and rapid deployment',
    })

    assert.isAtMost(result.breakdown.problemClarity, 20)
    assert.isAtMost(result.breakdown.audienceSpecificity, 15)
    assert.isAtMost(result.breakdown.monetizationClarity, 15)
    assert.isAtMost(result.breakdown.distributionFeasibility, 15)
    assert.isAtMost(result.breakdown.competitiveDifferentiation, 15)
    assert.isAtMost(result.breakdown.buildFeasibility, 10)
    assert.isAtMost(result.breakdown.speedToMarket, 10)
  })

  test('handles empty inputs gracefully', ({ assert }) => {
    const service = new HeuristicScoringService()
    const result = service.score({
      problemClarity: '',
      audienceSpecificity: '',
      monetizationModel: '',
      distributionChannels: '',
      differentiation: '',
      technicalFeasibility: '',
      timeToMarket: '',
    })

    assert.isAbove(result.total, 0) // Should still return minimum scores
    assert.isBelow(result.total, 30) // But should be low
  })
})
