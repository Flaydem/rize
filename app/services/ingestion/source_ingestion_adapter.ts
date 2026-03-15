import type { IngestionInput, NormalizedSourceItem } from '#types/ingestion'
import type SourceAccount from '#models/source_account'

export interface SourceIngestionAdapter {
  readonly name: string
  canHandle(input: IngestionInput): boolean
  normalize(input: IngestionInput): Promise<NormalizedSourceItem>
  syncLatest?(account: SourceAccount): Promise<NormalizedSourceItem[]>
}
