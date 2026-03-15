import { parse } from 'csv-parse/sync'
import { Platform } from '#types/enums'
import type { IngestionInput, NormalizedSourceItem, CsvRow } from '#types/ingestion'
import type { SourceIngestionAdapter } from './source_ingestion_adapter.js'

export class CsvImportAdapter implements SourceIngestionAdapter {
  readonly name = 'csv_import'

  canHandle(input: IngestionInput): boolean {
    return input.platform === Platform.Csv
  }

  async normalize(input: IngestionInput): Promise<NormalizedSourceItem> {
    let publishedAt: Date | undefined
    if (input.publishedAt) {
      // Support du format DD/MM/YYYY (ex. 13/03/2026)
      const ddmmyyyy = input.publishedAt.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
      if (ddmmyyyy) {
        publishedAt = new Date(`${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`)
      } else {
        publishedAt = new Date(input.publishedAt)
      }
    }

    return {
      platform: Platform.Csv,
      externalId: input.externalId,
      title: input.title || null,
      sourceUrl: input.sourceUrl || null,
      rawText: input.rawText,
      rawMetadata: input.metadata || {},
      publishedAt,
    }
  }

  parseCsv(csvContent: string): CsvRow[] {
    return parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as CsvRow[]
  }

  csvRowToIngestionInput(row: CsvRow): IngestionInput {
    const platform = (row.platform as Platform) || Platform.Csv

    // Support du format No Business : date, resume, likes, vues, videoUrl
    const rawText = row.text || row.resume || row.title || ''
    const sourceUrl = row.url || row.source_url || row.videoUrl
    const title = row.title || (row.resume ? row.resume.slice(0, 80) : undefined)
    const publishedAt = row.published_at || row.date
    const externalId = row.external_id || row.id

    // Conserver likes et vues dans les metadata
    const metadata: Record<string, unknown> = { ...row }
    if (row.likes) metadata.likes = Number(row.likes)
    if (row.vues) metadata.views = Number(row.vues)

    return {
      platform,
      rawText,
      sourceUrl,
      externalId,
      title,
      metadata,
      publishedAt,
    }
  }
}
