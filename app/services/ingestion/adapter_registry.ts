import type { SourceIngestionAdapter } from './source_ingestion_adapter.js'
import type { IngestionInput } from '#types/ingestion'
import { ManualTextAdapter } from './manual_text_adapter.js'
import { CsvImportAdapter } from './csv_import_adapter.js'
import { UrlIngestionAdapter } from './url_ingestion_adapter.js'

export class AdapterRegistry {
  private adapters: SourceIngestionAdapter[] = []

  constructor() {
    this.register(new ManualTextAdapter())
    this.register(new CsvImportAdapter())
    this.register(new UrlIngestionAdapter())
  }

  register(adapter: SourceIngestionAdapter) {
    this.adapters.push(adapter)
  }

  resolve(input: IngestionInput): SourceIngestionAdapter | null {
    return this.adapters.find((a) => a.canHandle(input)) ?? null
  }

  getByName(name: string): SourceIngestionAdapter | null {
    return this.adapters.find((a) => a.name === name) ?? null
  }

  getCsvAdapter(): CsvImportAdapter {
    return this.getByName('csv_import') as CsvImportAdapter
  }
}

let registry: AdapterRegistry | null = null

export function getAdapterRegistry(): AdapterRegistry {
  if (!registry) {
    registry = new AdapterRegistry()
  }
  return registry
}
