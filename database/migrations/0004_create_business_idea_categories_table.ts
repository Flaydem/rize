import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'business_idea_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('key', 100).notNullable().unique()
      table.string('label', 255).notNullable()
      table.text('description').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
