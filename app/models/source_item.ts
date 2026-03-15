import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import type { Platform, SyncStatus } from '#types/enums'
import SourceAccount from './source_account.js'
import BusinessIdea from './business_idea.js'

export default class SourceItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sourceAccountId: number | null

  @column()
  declare externalId: string | null

  @column()
  declare platform: Platform

  @column()
  declare title: string | null

  @column()
  declare sourceUrl: string | null

  @column()
  declare rawText: string

  @column({
    prepare: (value: Record<string, unknown>) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare rawMetadata: Record<string, unknown>

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column.dateTime()
  declare ingestedAt: DateTime

  @column()
  declare syncStatus: SyncStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => SourceAccount)
  declare sourceAccount: BelongsTo<typeof SourceAccount>

  @hasOne(() => BusinessIdea)
  declare businessIdea: HasOne<typeof BusinessIdea>
}
