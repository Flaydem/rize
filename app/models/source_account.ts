import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { Platform } from '#types/enums'
import SourceItem from './source_item.js'

export default class SourceAccount extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare platform: Platform

  @column()
  declare name: string

  @column()
  declare handle: string | null

  @column()
  declare sourceUrl: string | null

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => SourceItem)
  declare sourceItems: HasMany<typeof SourceItem>
}
