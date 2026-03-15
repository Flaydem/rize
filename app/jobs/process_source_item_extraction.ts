import logger from '@adonisjs/core/services/logger'
import SourceItem from '#models/source_item'
import { SyncStatus } from '#types/enums'
import { BusinessIdeaExtractionService } from '#services/ideas/business_idea_extraction_service'

export class ProcessSourceItemExtractionJob {
  async run(sourceItemId?: number): Promise<void> {
    const extractionService = new BusinessIdeaExtractionService()

    if (sourceItemId) {
      const item = await SourceItem.find(sourceItemId)
      if (item) {
        logger.info({ sourceItemId }, 'Processing single source item extraction')
        await extractionService.extractFromSourceItem(item)
      }
      return
    }

    // Process all pending items
    const pendingItems = await SourceItem.query()
      .where('syncStatus', SyncStatus.Pending)
      .orderBy('createdAt', 'asc')
      .limit(20)

    logger.info({ count: pendingItems.length }, 'Processing pending source items')

    for (const item of pendingItems) {
      try {
        await item.merge({ syncStatus: SyncStatus.Processing }).save()
        await extractionService.extractFromSourceItem(item)
        logger.info({ sourceItemId: item.id }, 'Source item processed successfully')
      } catch (error) {
        logger.error({ error, sourceItemId: item.id }, 'Failed to process source item')
        await item.merge({ syncStatus: SyncStatus.Failed }).save()
      }
    }
  }
}
