import BusinessIdea from '#models/business_idea'
import type { PaginationParams } from '#types/pagination'

interface IdeaFilters {
  search?: string
  category?: string
  difficulty?: string
  budget?: string
  monetization?: string
  status?: string
  tags?: string[]
}

export class IdeaSearchService {
  async search(filters: IdeaFilters, pagination: PaginationParams) {
    const query = BusinessIdea.query().preload('categories')

    if (filters.search) {
      const term = `%${filters.search}%`
      query.where((q) => {
        q.whereILike('title', term)
          .orWhereILike('one_liner', term)
          .orWhereILike('summary', term)
          .orWhereILike('problem', term)
      })
    }

    if (filters.category) {
      query.where('categoryPrimary', filters.category)
    }

    if (filters.difficulty) {
      query.where('difficultyLevel', filters.difficulty)
    }

    if (filters.budget) {
      query.where('startupBudgetLevel', filters.budget)
    }

    if (filters.monetization) {
      query.where('monetizationModel', filters.monetization)
    }

    if (filters.status) {
      query.where('validationStatus', filters.status)
    }

    const sortBy = pagination.sortBy || 'created_at'
    const sortOrder = pagination.sortOrder || 'desc'
    query.orderBy(sortBy, sortOrder)

    const page = pagination.page || 1
    const limit = pagination.limit || 20

    const results = await query.paginate(page, limit)
    return results
  }

  async findBySlug(slug: string) {
    return BusinessIdea.query()
      .where('slug', slug)
      .preload('categories')
      .preload('sourceItem')
      .preload('structuredPlans', (q) => q.where('status', 'completed').orderBy('version', 'desc').limit(1))
      .preload('launchPacks', (q) => q.orderBy('version', 'desc').limit(1))
      .firstOrFail()
  }
}
