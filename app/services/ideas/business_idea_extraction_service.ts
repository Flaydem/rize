import logger from '@adonisjs/core/services/logger'
import slugify from 'slugify'
import SourceItem from '#models/source_item'
import BusinessIdea from '#models/business_idea'
import BusinessIdeaCategory from '#models/business_idea_category'
import { SyncStatus, ValidationStatus, GenerationType, GenerationStatus } from '#types/enums'
import type { DifficultyLevel, BudgetLevel } from '#types/enums'
import type { ExtractedBusinessIdea } from '#types/ai'
import { getAIProvider } from '../ai/ai_service.js'
import { AIUsageLoggingService } from '../ai/ai_usage_logging_service.js'
import { PROMPTS } from '../ai/prompts.js'

export class BusinessIdeaExtractionService {
  private aiLogger = new AIUsageLoggingService()

  async extractFromSourceItem(sourceItem: SourceItem, userId?: number): Promise<BusinessIdea | null> {
    const ai = getAIProvider()
    const prompt = PROMPTS.extractBusinessIdea

    try {
      const response = await ai.generateObject<ExtractedBusinessIdea>({
        systemPrompt: prompt.system,
        prompt: prompt.user(sourceItem.rawText),
        schema: null,
        promptVersion: prompt.version,
      })

      const data = response.data
      const slug = this.generateSlug(data.title)

      const idea = await BusinessIdea.create({
        sourceItemId: sourceItem.id,
        title: data.title,
        slug,
        oneLiner: data.oneLiner,
        summary: data.summary,
        problem: data.problem,
        solution: data.solution,
        audience: data.audience,
        monetizationModel: data.monetizationModel,
        categoryPrimary: data.categories[0] || null,
        difficultyLevel: (data.difficulty || 'medium') as DifficultyLevel,
        startupBudgetLevel: (data.budgetLevel || 'medium') as BudgetLevel,
        estimatedLaunchTimeDays: data.estimatedLaunchTimeDays,
        validationStatus: ValidationStatus.Processed,
        viabilityScore: data.viabilityScore,
        confidenceScore: data.confidenceScore,
        tags: data.tags || [],
        structuredData: {
          ...(data.marketPotential ? { marketPotential: data.marketPotential } : {}),
        },
        createdByUserId: userId || null,
      })

      // Assign categories
      if (data.categories?.length) {
        const categories = await BusinessIdeaCategory.query().whereIn('key', data.categories)
        if (categories.length) {
          await idea.related('categories').sync(
            categories.reduce(
              (acc, cat) => {
                acc[cat.id] = { score: null }
                return acc
              },
              {} as Record<number, { score: number | null }>
            )
          )
        }
      }

      await sourceItem.merge({ syncStatus: SyncStatus.Processed }).save()

      await this.aiLogger.log({
        userId,
        entityType: 'source_item',
        entityId: sourceItem.id,
        generationType: GenerationType.IdeaExtraction,
        modelName: response.model,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        status: GenerationStatus.Completed,
        promptVersion: prompt.version,
        responseJson: response.data as unknown as Record<string, unknown>,
      })

      return idea
    } catch (error) {
      logger.error({ error, sourceItemId: sourceItem.id }, 'Failed to extract business idea')

      await sourceItem.merge({ syncStatus: SyncStatus.Failed }).save()

      await this.aiLogger.log({
        userId,
        entityType: 'source_item',
        entityId: sourceItem.id,
        generationType: GenerationType.IdeaExtraction,
        modelName: 'unknown',
        status: GenerationStatus.Failed,
        promptVersion: prompt.version,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })

      return null
    }
  }

  private generateSlug(title: string): string {
    const base = slugify(title, { lower: true, strict: true })
    const suffix = Date.now().toString(36).slice(-4)
    return `${base}-${suffix}`
  }
}
