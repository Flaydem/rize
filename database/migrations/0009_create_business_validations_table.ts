import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'business_validations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('input_title', 500).notNullable()
      table.text('input_description').notNullable()
      table.string('target_audience', 500).nullable()
      table.jsonb('input_context').notNullable().defaultTo('{}')
      table.integer('score_global').notNullable().defaultTo(0)
      table.integer('score_problem').notNullable().defaultTo(0)
      table.integer('score_audience').notNullable().defaultTo(0)
      table.integer('score_monetization').notNullable().defaultTo(0)
      table.integer('score_distribution').notNullable().defaultTo(0)
      table.integer('score_feasibility').notNullable().defaultTo(0)
      table.integer('score_differentiation').notNullable().defaultTo(0)
      table.jsonb('strengths').notNullable().defaultTo('[]')
      table.jsonb('risks').notNullable().defaultTo('[]')
      table.jsonb('recommendations').notNullable().defaultTo('[]')
      table.jsonb('validation_plan').notNullable().defaultTo('[]')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
