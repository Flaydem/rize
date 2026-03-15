import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  private async seed(Seeder: { default: new () => BaseSeeder }) {
    const seeder = new Seeder.default()
    await seeder.run()
  }

  async run() {
    await this.seed(await import('#database/seeders/category_seeder'))
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/demo_seeder'))
  }
}
