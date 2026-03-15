import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { GenerationStatus } from '#types/enums'
import BusinessIdea from './business_idea.js'
import StructuredPlan from './structured_plan.js'
import User from './user.js'

export default class LaunchPack extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare businessIdeaId: number

  @column()
  declare structuredPlanId: number | null

  @column()
  declare version: number

  @column()
  declare status: GenerationStatus

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare brandNames: string[]

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare domainSuggestions: string[]

  @column({
    prepare: (value: Record<string, unknown>) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare websiteOutline: Record<string, unknown>

  @column({
    prepare: (value: Record<string, unknown>) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare marketingPlan: Record<string, unknown>

  @column({
    prepare: (value: unknown[]) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare launchChecklist: unknown[]

  @column({
    prepare: (value: unknown[]) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare contentAngles: unknown[]

  @column({
    prepare: (value: Record<string, unknown>) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare offerDesign: Record<string, unknown>

  @column({
    prepare: (value: unknown[]) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare assumptions: unknown[]

  @column()
  declare markdown: string | null

  @column()
  declare createdByUserId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => BusinessIdea)
  declare businessIdea: BelongsTo<typeof BusinessIdea>

  @belongsTo(() => StructuredPlan)
  declare structuredPlan: BelongsTo<typeof StructuredPlan>

  @belongsTo(() => User, { foreignKey: 'createdByUserId' })
  declare createdBy: BelongsTo<typeof User>
}
