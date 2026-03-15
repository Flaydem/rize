import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'source_accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.enum('platform', ['instagram', 'tiktok', 'youtube', 'manual', 'csv', 'other']).notNullable()
      table.string('name', 255).notNullable()
      table.string('handle', 255).nullable()
      table.string('source_url', 1024).nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
