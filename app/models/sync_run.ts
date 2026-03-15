import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { SyncRunStatus } from '#types/enums'
import SourceAccount from './source_account.js'

export default class SyncRun extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sourceAccountId: number | null

  @column()
  declare adapterName: string

  @column()
  declare status: SyncRunStatus

  @column.dateTime()
  declare startedAt: DateTime

  @column.dateTime()
  declare finishedAt: DateTime | null

  @column({
    prepare: (value: Record<string, unknown>) => JSON.stringify(value),
    consume: (value: string) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare stats: Record<string, unknown>

  @column()
  declare errorMessage: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => SourceAccount)
  declare sourceAccount: BelongsTo<typeof SourceAccount>
}
