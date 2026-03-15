import { Platform } from '#types/enums'
import type { IngestionInput, NormalizedSourceItem } from '#types/ingestion'
import type { SourceIngestionAdapter } from './source_ingestion_adapter.js'

export class ManualTextAdapter implements SourceIngestionAdapter {
  readonly name = 'manual_text'

  canHandle(input: IngestionInput): boolean {
    return input.platform === Platform.Manual
  }

  async normalize(input: IngestionInput): Promise<NormalizedSourceItem> {
    return {
      platform: Platform.Manual,
      externalId: input.externalId,
      title: input.title || null,
      sourceUrl: input.sourceUrl || null,
      rawText: input.rawText,
      rawMetadata: input.metadata || {},
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined,
    }
  }
}
