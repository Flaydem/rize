import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'source_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('source_account_id').unsigned().nullable().references('id').inTable('source_accounts').onDelete('SET NULL')
      table.string('external_id', 255).nullable()
      table.enum('platform', ['instagram', 'tiktok', 'youtube', 'manual', 'csv', 'other']).notNullable()
      table.string('title', 500).nullable()
      table.string('source_url', 1024).nullable()
      table.text('raw_text').notNullable()
      table.jsonb('raw_metadata').notNullable().defaultTo('{}')
      table.timestamp('published_at').nullable()
      table.timestamp('ingested_at').notNullable()
      table.enum('sync_status', ['pending', 'processing', 'processed', 'failed']).notNullable().defaultTo('pending')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['source_url'])
      table.index(['sync_status'])
      table.index(['platform'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
