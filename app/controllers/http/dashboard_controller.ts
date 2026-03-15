import type { HttpContext } from '@adonisjs/core/http'
import BusinessIdea from '#models/business_idea'
import BusinessValidation from '#models/business_validation'
import StructuredPlan from '#models/structured_plan'
import LaunchPack from '#models/launch_pack'
import SavedIdea from '#models/saved_idea'

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    const userId = auth.user!.id

    // Stats
    const [totalIdeasRes, reviewedRes, validationsRes, plansRes, packsRes] = await Promise.all([
      BusinessIdea.query().count('* as total'),
      BusinessIdea.query().where('validationStatus', 'reviewed').count('* as total'),
      BusinessValidation.query().where('userId', userId).count('* as total'),
      StructuredPlan.query().where('status', 'completed').count('* as total'),
      LaunchPack.query().count('* as total'),
    ])

    // Repartition par difficulte
    const difficultyRaw = await BusinessIdea.query()
      .select('difficultyLevel')
      .count('* as total')
      .groupBy('difficultyLevel')
    const difficultyBreakdown = difficultyRaw.map((r) => ({
      level: r.difficultyLevel,
      count: Number(r.$extras.total),
    }))

    // Repartition par budget
    const budgetRaw = await BusinessIdea.query()
      .select('startupBudgetLevel')
      .count('* as total')
      .groupBy('startupBudgetLevel')
    const budgetBreakdown = budgetRaw.map((r) => ({
      level: r.startupBudgetLevel,
      count: Number(r.$extras.total),
    }))

    // Repartition par categorie (top 5)
    const categoryRaw = await BusinessIdea.query()
      .select('categoryPrimary')
      .whereNotNull('categoryPrimary')
      .count('* as total')
      .groupBy('categoryPrimary')
      .orderBy('total', 'desc')
      .limit(5)
    const categoryBreakdown = categoryRaw.map((r) => ({
      name: r.categoryPrimary,
      count: Number(r.$extras.total),
    }))

    // Score moyen
    const avgScoreRes = await BusinessIdea.query()
      .whereNotNull('viabilityScore')
      .avg('viability_score as avg')
    const avgScore = Math.round(Number(avgScoreRes[0]?.$extras.avg) || 0)

    // Idees recentes (3)
    const recentIdeas = await BusinessIdea.query()
      .orderBy('createdAt', 'desc')
      .limit(3)
      .preload('categories')

    // Top idees (3)
    const topIdeas = await BusinessIdea.query()
      .whereNotNull('viabilityScore')
      .orderBy('viabilityScore', 'desc')
      .limit(3)
      .preload('categories')

    // Idees sauvegardees
    const savedIdeaRecords = await SavedIdea.query()
      .where('userId', userId)
      .preload('businessIdea')
      .orderBy('createdAt', 'desc')
      .limit(5)
    const savedIdeas = savedIdeaRecords.map((s) => s.businessIdea.serialize())

    return inertia.render('dashboard', {
      stats: {
        totalIdeas: Number(totalIdeasRes[0].$extras.total),
        reviewedIdeas: Number(reviewedRes[0].$extras.total),
        totalValidations: Number(validationsRes[0].$extras.total),
        totalPlans: Number(plansRes[0].$extras.total),
        totalPacks: Number(packsRes[0].$extras.total),
        avgScore,
      },
      difficultyBreakdown,
      budgetBreakdown,
      categoryBreakdown,
      recentIdeas: recentIdeas.map((i) => i.serialize()),
      topIdeas: topIdeas.map((i) => i.serialize()),
      savedIdeas,
    })
  }
}
