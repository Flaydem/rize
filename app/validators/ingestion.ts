import vine from '@vinejs/vine'

export const manualIngestionValidator = vine.compile(
  vine.object({
    rawText: vine.string().minLength(10).maxLength(50000),
    title: vine.string().maxLength(500).optional(),
    sourceUrl: vine.string().url().maxLength(1024).optional(),
    platform: vine.enum(['instagram', 'tiktok', 'youtube', 'manual', 'csv', 'other']).optional(),
    metadata: vine.object({}).allowUnknownProperties().optional(),
  })
)

export const sourceAccountValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(255),
    platform: vine.enum(['instagram', 'tiktok', 'youtube', 'manual', 'csv', 'other']),
    handle: vine.string().maxLength(255).optional(),
    sourceUrl: vine.string().url().maxLength(1024).optional(),
  })
)
