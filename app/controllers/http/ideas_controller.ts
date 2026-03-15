import type { HttpContext } from '@adonisjs/core/http'
import { ideaFilterValidator } from '#validators/idea'
import { IdeaSearchService } from '#services/ideas/idea_search_service'
import { StructuredPlanGenerationService } from '#services/ideas/structured_plan_generation_service'
import { LaunchPackGenerationService } from '#services/launchpacks/launch_pack_generation_service'
import BusinessIdeaCategory from '#models/business_idea_category'
import StructuredPlan from '#models/structured_plan'
import LaunchPack from '#models/launch_pack'
import SavedIdea from '#models/saved_idea'

export default class IdeasController {
  async index({ request, inertia, auth }: HttpContext) {
    const filters = await request.validateUsing(ideaFilterValidator)
    const searchService = new IdeaSearchService()

    const ideas = await searchService.search(
      {
        search: filters.search,
        category: filters.category,
        difficulty: filters.difficulty,
        budget: filters.budget,
        monetization: filters.monetization,
        status: filters.status,
      },
      {
        page: filters.page || 1,
        limit: filters.limit || 20,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      }
    )

    const categories = await BusinessIdeaCategory.all()

    const savedIds = await SavedIdea.query()
      .where('userId', auth.user!.id)
      .select('businessIdeaId')
    const savedIdeaIds = savedIds.map((s) => s.businessIdeaId)

    return inertia.render('ideas/index', {
      ideas: ideas.serialize(),
      categories: categories.map((c) => c.serialize()),
      filters,
      savedIdeaIds,
    })
  }

  async show({ params, inertia, auth }: HttpContext) {
    const searchService = new IdeaSearchService()
    const idea = await searchService.findBySlug(params.slug)

    const isSaved = await SavedIdea.query()
      .where('userId', auth.user!.id)
      .where('businessIdeaId', idea.id)
      .first()

    return inertia.render('ideas/show', {
      idea: idea.serialize(),
      isSaved: !!isSaved,
    })
  }

  async generateStructuredPlan({ params, auth, response }: HttpContext) {
    const service = new StructuredPlanGenerationService()
    const plan = await service.generate(params.id, auth.user!.id)
    return response.json({ plan: plan.serialize() })
  }

  async showStructuredPlan({ params, inertia, auth, response, session }: HttpContext) {
    let plan = await StructuredPlan.query()
      .where('businessIdeaId', params.id)
      .where('status', 'completed')
      .orderBy('version', 'desc')
      .preload('businessIdea')
      .first()

    // Regenerer si aucun plan ou si ancien format (pas de champ mvp)
    const content = plan?.content as Record<string, unknown> | null
    if (!plan || !content?.mvp) {
      try {
        const service = new StructuredPlanGenerationService()
        plan = await service.generate(Number(params.id), auth.user?.id)
        await plan.load('businessIdea')
      } catch {
        session.flash('error', 'Erreur lors de la generation du plan. Veuillez reessayer.')
        return response.redirect().back()
      }
    }

    return inertia.render('ideas/structured-plan', {
      plan: plan.serialize(),
      idea: plan.businessIdea.serialize(),
    })
  }

  async generateLaunchPack({ params, auth, response }: HttpContext) {
    const service = new LaunchPackGenerationService()
    const pack = await service.generate(params.id, auth.user!.id)
    return response.json({ pack: pack.serialize() })
  }

  async showLaunchPack({ params, inertia }: HttpContext) {
    const pack = await LaunchPack.query()
      .where('businessIdeaId', params.id)
      .orderBy('version', 'desc')
      .preload('businessIdea')
      .firstOrFail()

    return inertia.render('ideas/launch-pack', {
      pack: pack.serialize(),
      idea: pack.businessIdea.serialize(),
    })
  }
}
