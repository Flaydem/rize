import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'business_idea_category_assignments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('business_idea_id').unsigned().notNullable().references('id').inTable('business_ideas').onDelete('CASCADE')
      table.integer('category_id').unsigned().notNullable().references('id').inTable('business_idea_categories').onDelete('CASCADE')
      table.float('score').nullable()

      table.unique(['business_idea_id', 'category_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
