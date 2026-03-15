import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'structured_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('business_idea_id').unsigned().notNullable().references('id').inTable('business_ideas').onDelete('CASCADE')
      table.integer('version').notNullable().defaultTo(1)
      table.enum('status', ['pending', 'processing', 'completed', 'failed']).notNullable().defaultTo('pending')
      table.jsonb('content').nullable()
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
