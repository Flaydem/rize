import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'
import SourceItem from '#models/source_item'
import { SyncStatus } from '#types/enums'
import type { IngestionInput, NormalizedSourceItem } from '#types/ingestion'
import { getAdapterRegistry } from './adapter_registry.js'

export class IdeaIngestionService {
  async ingest(input: IngestionInput): Promise<SourceItem> {
    const registry = getAdapterRegistry()
    const adapter = registry.resolve(input)

    if (!adapter) {
      throw new Error(`No adapter found for platform: ${input.platform}`)
    }

    const normalized = await adapter.normalize(input)
    return this.persistSourceItem(normalized, input.sourceUrl)
  }

  async ingestBatch(inputs: IngestionInput[]): Promise<{ created: number; skipped: number; errors: number }> {
    let created = 0
    let skipped = 0
    let errors = 0

    for (const input of inputs) {
      try {
        if (input.sourceUrl) {
          const existing = await SourceItem.findBy('sourceUrl', input.sourceUrl)
          if (existing) {
            skipped++
            continue
          }
        }
        await this.ingest(input)
        created++
      } catch (error) {
        errors++
        logger.error({ error, input: input.title || input.sourceUrl }, 'Failed to ingest item')
      }
    }

    return { created, skipped, errors }
  }

  private async persistSourceItem(normalized: NormalizedSourceItem, _sourceUrl?: string): Promise<SourceItem> {
    if (normalized.sourceUrl) {
      const existing = await SourceItem.findBy('sourceUrl', normalized.sourceUrl)
      if (existing) {
        logger.info({ sourceUrl: normalized.sourceUrl }, 'Source item already exists, skipping')
        return existing
      }
    }

    return SourceItem.create({
      platform: normalized.platform,
      externalId: normalized.externalId || null,
      title: normalized.title || null,
      sourceUrl: normalized.sourceUrl || null,
      rawText: normalized.rawText,
      rawMetadata: normalized.rawMetadata,
      publishedAt: normalized.publishedAt ? DateTime.fromJSDate(normalized.publishedAt) : null,
      ingestedAt: DateTime.now(),
      syncStatus: SyncStatus.Pending,
    })
  }
}
