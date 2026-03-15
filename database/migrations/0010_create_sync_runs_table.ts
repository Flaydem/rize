import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sync_runs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('source_account_id').unsigned().nullable().references('id').inTable('source_accounts').onDelete('SET NULL')
      table.string('adapter_name', 100).notNullable()
      table.enum('status', ['running', 'completed', 'failed']).notNullable().defaultTo('running')
      table.timestamp('started_at').notNullable()
      table.timestamp('finished_at').nullable()
      table.jsonb('stats').notNullable().defaultTo('{}')
      table.text('error_message').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
