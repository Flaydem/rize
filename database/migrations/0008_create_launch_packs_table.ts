import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'launch_packs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('business_idea_id').unsigned().notNullable().references('id').inTable('business_ideas').onDelete('CASCADE')
      table.integer('structured_plan_id').unsigned().nullable().references('id').inTable('structured_plans').onDelete('SET NULL')
      table.integer('version').notNullable().defaultTo(1)
      table.enum('status', ['pending', 'processing', 'completed', 'failed']).notNullable().defaultTo('pending')
      table.jsonb('brand_names').notNullable().defaultTo('[]')
      table.jsonb('domain_suggestions').notNullable().defaultTo('[]')
      table.jsonb('website_outline').notNullable().defaultTo('{}')
      table.jsonb('marketing_plan').notNullable().defaultTo('{}')
      table.jsonb('launch_checklist').notNullable().defaultTo('[]')
      table.jsonb('content_angles').notNullable().defaultTo('[]')
      table.jsonb('offer_design').notNullable().defaultTo('{}')
      table.jsonb('assumptions').notNullable().defaultTo('[]')
      table.text('markdown').nullable()
      table.integer('created_by_user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
