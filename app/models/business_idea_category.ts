import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class BusinessIdeaCategory extends BaseModel {
  static timestamps = false

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare key: string

  @column()
  declare label: string

  @column()
  declare description: string | null
}
