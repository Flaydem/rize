import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import type { DifficultyLevel, BudgetLevel, ValidationStatus } from '#types/enums'
import SourceItem from './source_item.js'
import User from './user.js'
import BusinessIdeaCategory from './business_idea_category.js'
import StructuredPlan from './structured_plan.js'
import LaunchPack from './launch_pack.js'

export default class BusinessIdea extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sourceItemId: number | null

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare oneLiner: string

  @column()
  declare summary: string

  @column()
  declare problem: string

  @column()
  declare solution: string

  @column()
  declare audience: string

  @column()
  declare monetizationModel: string

  @column()
  declare categoryPrimary: string | null

  @column()
  declare difficultyLevel: DifficultyLevel

  @column()
  declare startupBudgetLevel: BudgetLevel

  @column()
  declare estimatedLaunchTimeDays: number | null

  @column()
  declare validationStatus: ValidationStatus

  @column()
  declare viabilityScore: number | null

  @column()
  declare confidenceScore: number | null

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare tags: string[]

  @column({
    prepare: (value: Record<string, unknown>) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare structuredData: Record<string, unknown>

  @column()
  declare createdByUserId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => SourceItem)
  declare sourceItem: BelongsTo<typeof SourceItem>

  @belongsTo(() => User, { foreignKey: 'createdByUserId' })
  declare createdBy: BelongsTo<typeof User>

  @manyToMany(() => BusinessIdeaCategory, {
    pivotTable: 'business_idea_category_assignments',
    pivotForeignKey: 'business_idea_id',
    pivotRelatedForeignKey: 'category_id',
    pivotColumns: ['score'],
  })
  declare categories: ManyToMany<typeof BusinessIdeaCategory>

  @hasMany(() => StructuredPlan)
  declare structuredPlans: HasMany<typeof StructuredPlan>

  @hasMany(() => LaunchPack)
  declare launchPacks: HasMany<typeof LaunchPack>
}
