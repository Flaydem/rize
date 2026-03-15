import type { HttpContext } from '@adonisjs/core/http'
import { ideaUpdateValidator } from '#validators/idea'
import BusinessIdea from '#models/business_idea'
import SourceItem from '#models/source_item'
import { SyncStatus } from '#types/enums'
import { BusinessIdeaExtractionService } from '#services/ideas/business_idea_extraction_service'

export default class AdminIdeasReviewController {
  async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const status = request.input('status', '')

    const query = BusinessIdea.query()
      .preload('categories')
      .preload('sourceItem')
      .orderBy('createdAt', 'desc')

    if (status) {
      query.where('validationStatus', status)
    }

    const ideas = await query.paginate(page, 20)

    return inertia.render('admin/ideas/review', {
      ideas: ideas.serialize(),
      currentStatus: status,
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const idea = await BusinessIdea.findOrFail(params.id)
    const data = await request.validateUsing(ideaUpdateValidator)

    await idea.merge(data).save()

    session.flash('success', 'Idee mise a jour avec succes')
    return response.redirect().back()
  }

  async reprocess({ params, auth, response, session }: HttpContext) {
    const idea = await BusinessIdea.findOrFail(params.id)

    if (!idea.sourceItemId) {
      session.flash('errors', { reprocess: 'Aucune source liee a cette idee' })
      return response.redirect().back()
    }

    const sourceItem = await SourceItem.findOrFail(idea.sourceItemId)
    await sourceItem.merge({ syncStatus: SyncStatus.Pending }).save()

    const service = new BusinessIdeaExtractionService()
    await service.extractFromSourceItem(sourceItem, auth.user!.id)

    session.flash('success', 'Idee retraitee avec succes')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const idea = await BusinessIdea.findOrFail(params.id)
    await idea.delete()

    session.flash('success', 'Idee supprimee avec succes')
    return response.redirect().back()
  }
}
