import vine from '@vinejs/vine'

export const ideaFilterValidator = vine.compile(
  vine.object({
    page: vine.number().positive().optional(),
    limit: vine.number().positive().max(100).optional(),
    search: vine.string().maxLength(255).optional(),
    category: vine.string().maxLength(100).optional(),
    difficulty: vine.enum(['easy', 'medium', 'hard']).optional(),
    budget: vine.enum(['low', 'medium', 'high']).optional(),
    monetization: vine.string().maxLength(100).optional(),
    status: vine.enum(['draft', 'processed', 'reviewed']).optional(),
    sortBy: vine.enum(['created_at', 'viability_score', 'confidence_score', 'title']).optional(),
    sortOrder: vine.enum(['asc', 'desc']).optional(),
  })
)

export const ideaUpdateValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(500).optional(),
    oneLiner: vine.string().maxLength(500).optional(),
    summary: vine.string().optional(),
    problem: vine.string().optional(),
    solution: vine.string().optional(),
    audience: vine.string().optional(),
    monetizationModel: vine.string().maxLength(255).optional(),
    categoryPrimary: vine.string().maxLength(100).optional(),
    difficultyLevel: vine.enum(['easy', 'medium', 'hard']).optional(),
    startupBudgetLevel: vine.enum(['low', 'medium', 'high']).optional(),
    estimatedLaunchTimeDays: vine.number().positive().optional(),
    validationStatus: vine.enum(['draft', 'processed', 'reviewed']).optional(),
    tags: vine.array(vine.string()).optional(),
  })
)
