import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class ExtractPending extends BaseCommand {
  static commandName = 'extract:pending'
  static description = 'Extraire les idees business des sources en attente'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const { default: SourceItem } = await import('#models/source_item')
    const { default: User } = await import('#models/user')
    const { BusinessIdeaExtractionService } = await import(
      '#services/ideas/business_idea_extraction_service'
    )
    const { SyncStatus, ValidationStatus } = await import('#types/enums')

    const pendingItems = await SourceItem.query().where('syncStatus', SyncStatus.Pending)
    this.logger.info(`${pendingItems.length} source(s) en attente`)

    if (pendingItems.length === 0) return

    const user = await User.query().firstOrFail()
    const service = new BusinessIdeaExtractionService()

    for (const item of pendingItems) {
      this.logger.info(`Extraction: ${item.title || item.id}`)
      try {
        const idea = await service.extractFromSourceItem(item, user.id)
        if (idea) {
          await idea.merge({ validationStatus: ValidationStatus.Reviewed }).save()
          this.logger.success(`Idee creee: ${idea.title}`)
        } else {
          this.logger.warning(`Aucune idee extraite pour ${item.id}`)
        }
      } catch (error) {
        this.logger.error(`Echec pour ${item.id}: ${(error as Error).message}`)
      }
    }

    this.logger.success('Extraction terminee')
  }
}
