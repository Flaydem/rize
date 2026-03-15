import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { GenerationStatus } from '#types/enums'
import type { StructuredPlanContent } from '#types/ai'
import BusinessIdea from './business_idea.js'
import User from './user.js'

export default class StructuredPlan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare businessIdeaId: number

  @column()
  declare version: number

  @column()
  declare status: GenerationStatus

  @column({
    prepare: (value: StructuredPlanContent | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value && typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare content: StructuredPlanContent | null

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

  @belongsTo(() => User, { foreignKey: 'createdByUserId' })
  declare createdBy: BelongsTo<typeof User>
}
