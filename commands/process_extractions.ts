import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class ProcessExtractions extends BaseCommand {
  static commandName = 'jobs:extract'
  static description = 'Process pending source items and extract business ideas'
  static options: CommandOptions = { startApp: true }

  async run() {
    const { ProcessSourceItemExtractionJob } = await import('#jobs/process_source_item_extraction')
    const job = new ProcessSourceItemExtractionJob()
    await job.run()
    this.logger.success('Extraction job completed')
  }
}
