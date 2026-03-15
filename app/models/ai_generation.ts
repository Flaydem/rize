import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { GenerationStatus, GenerationType } from '#types/enums'
import User from './user.js'

export default class AiGeneration extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number | null

  @column()
  declare entityType: string

  @column()
  declare entityId: number

  @column()
  declare generationType: GenerationType

  @column()
  declare modelName: string

  @column()
  declare inputTokens: number | null

  @column()
  declare outputTokens: number | null

  @column()
  declare status: GenerationStatus

  @column()
  declare promptVersion: string | null

  @column({
    prepare: (value: Record<string, unknown> | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value && typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare responseJson: Record<string, unknown> | null

  @column()
  declare responseText: string | null

  @column()
  declare errorMessage: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
