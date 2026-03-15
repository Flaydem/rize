import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import type { UserRole } from '#types/enums'
import BusinessValidation from './business_validation.js'
import BusinessIdea from './business_idea.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  declare fullName: string

  @column()
  declare role: UserRole

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => BusinessValidation)
  declare validations: HasMany<typeof BusinessValidation>

  @manyToMany(() => BusinessIdea, {
    pivotTable: 'saved_ideas',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'business_idea_id',
    pivotTimestamps: { createdAt: 'created_at', updatedAt: false },
  })
  declare savedIdeas: ManyToMany<typeof BusinessIdea>

  get isAdmin() {
    return this.role === 'admin'
  }
}
