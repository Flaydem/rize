import type { HttpContext } from '@adonisjs/core/http'
import SavedIdea from '#models/saved_idea'

export default class SavedIdeasController {
  async toggle({ params, auth, response }: HttpContext) {
    const userId = auth.user!.id
    const businessIdeaId = Number(params.id)

    const existing = await SavedIdea.query()
      .where('userId', userId)
      .where('businessIdeaId', businessIdeaId)
      .first()

    if (existing) {
      await existing.delete()
      return response.json({ saved: false })
    }

    await SavedIdea.create({ userId, businessIdeaId })
    return response.json({ saved: true })
  }
}
