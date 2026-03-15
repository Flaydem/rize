import vine from '@vinejs/vine'

export const runValidationValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(500),
    description: vine.string().minLength(20).maxLength(5000),
    targetAudience: vine.string().maxLength(500).optional(),
    context: vine.object({
      monetizationModel: vine.string().optional(),
      distributionChannels: vine.string().optional(),
      differentiation: vine.string().optional(),
      technicalFeasibility: vine.string().optional(),
      timeToMarket: vine.string().optional(),
    }).optional(),
  })
)
