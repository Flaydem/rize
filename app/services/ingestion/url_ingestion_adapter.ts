import { Platform } from '#types/enums'
import logger from '@adonisjs/core/services/logger'
import type { IngestionInput, NormalizedSourceItem } from '#types/ingestion'
import type { SourceIngestionAdapter } from './source_ingestion_adapter.js'

export class UrlIngestionAdapter implements SourceIngestionAdapter {
  readonly name = 'url_ingestion'

  canHandle(input: IngestionInput): boolean {
    return !!input.sourceUrl && input.platform !== Platform.Manual && input.platform !== Platform.Csv
  }

  async normalize(input: IngestionInput): Promise<NormalizedSourceItem> {
    let fetchedText = input.rawText

    if (input.sourceUrl && !input.rawText) {
      try {
        const response = await fetch(input.sourceUrl)
        const html = await response.text()
        fetchedText = this.extractTextFromHtml(html)
      } catch (error) {
        logger.warn({ url: input.sourceUrl, error }, 'Failed to fetch URL content')
        fetchedText = input.rawText || ''
      }
    }

    return {
      platform: input.platform,
      externalId: input.externalId,
      title: input.title || null,
      sourceUrl: input.sourceUrl || null,
      rawText: fetchedText,
      rawMetadata: input.metadata || {},
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined,
    }
  }

  private extractTextFromHtml(html: string): string {
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 10000)
  }
}
