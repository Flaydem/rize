import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_generations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL')
      table.string('entity_type', 100).notNullable()
      table.integer('entity_id').notNullable()
      table.string('generation_type', 100).notNullable()
      table.string('model_name', 100).notNullable()
      table.integer('input_tokens').nullable()
      table.integer('output_tokens').nullable()
      table.enum('status', ['pending', 'processing', 'completed', 'failed']).notNullable().defaultTo('pending')
      table.string('prompt_version', 50).nullable()
      table.jsonb('response_json').nullable()
      table.text('response_text').nullable()
      table.text('error_message').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['entity_type', 'entity_id'])
      table.index(['generation_type'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
