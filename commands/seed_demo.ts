import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class SeedDemo extends BaseCommand {
  static commandName = 'seed:demo'
  static description = 'Run all seeders (categories, users, demo data)'
  static options: CommandOptions = { startApp: true }

  async run() {
    const { default: MainSeeder } = await import('#database/seeders/main')
    const seeder = new MainSeeder(this.app.container.use('lucid.db'))
    await seeder.run()
    this.logger.success('Demo data seeded successfully')
  }
}
