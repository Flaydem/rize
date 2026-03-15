import type { Platform } from './enums.js'

export interface IngestionInput {
  platform: Platform
  rawText: string
  sourceUrl?: string
  externalId?: string
  title?: string
  metadata?: Record<string, unknown>
  publishedAt?: string
}

export interface NormalizedSourceItem {
  platform: Platform
  externalId?: string
  title?: string
  sourceUrl?: string
  rawText: string
  rawMetadata: Record<string, unknown>
  publishedAt?: Date
}

export interface CsvRow {
  title?: string
  url?: string
  text?: string
  platform?: string
  published_at?: string
  [key: string]: string | undefined
}
