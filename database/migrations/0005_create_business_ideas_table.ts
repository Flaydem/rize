import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'business_ideas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('source_item_id').unsigned().nullable().references('id').inTable('source_items').onDelete('SET NULL')
      table.string('title', 1000).notNullable()
      table.string('slug', 1200).notNullable().unique()
      table.text('one_liner').notNullable()
      table.text('summary').notNullable()
      table.text('problem').notNullable()
      table.text('solution').notNullable()
      table.text('audience').notNullable()
      table.string('monetization_model', 500).notNullable()
      table.string('category_primary', 100).nullable()
      table.enum('difficulty_level', ['easy', 'medium', 'hard']).notNullable().defaultTo('medium')
      table.enum('startup_budget_level', ['low', 'medium', 'high']).notNullable().defaultTo('medium')
      table.integer('estimated_launch_time_days').nullable()
      table.enum('validation_status', ['draft', 'processed', 'reviewed']).notNullable().defaultTo('draft')
      table.integer('viability_score').nullable()
      table.integer('confidence_score').nullable()
      table.jsonb('tags').notNullable().defaultTo('[]')
      table.jsonb('structured_data').notNullable().defaultTo('{}')
      table.integer('created_by_user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['validation_status'])
      table.index(['difficulty_level'])
      table.index(['startup_budget_level'])
      table.index(['viability_score'])
      table.index(['category_primary'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
