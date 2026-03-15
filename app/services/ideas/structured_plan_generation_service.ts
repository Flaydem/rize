import logger from '@adonisjs/core/services/logger'
import BusinessIdea from '#models/business_idea'
import StructuredPlan from '#models/structured_plan'
import { GenerationStatus, GenerationType } from '#types/enums'
import type { StructuredPlanContent } from '#types/ai'
import { getAIProvider } from '../ai/ai_service.js'
import { AIUsageLoggingService } from '../ai/ai_usage_logging_service.js'
import { PROMPTS } from '../ai/prompts.js'

export class StructuredPlanGenerationService {
  private aiLogger = new AIUsageLoggingService()

  async generate(ideaId: number, userId?: number): Promise<StructuredPlan> {
    const idea = await BusinessIdea.findOrFail(ideaId)

    // Nettoyer les plans bloques en processing ou failed
    await StructuredPlan.query()
      .where('businessIdeaId', ideaId)
      .whereIn('status', [GenerationStatus.Processing, GenerationStatus.Failed])
      .delete()

    const latestPlan = await StructuredPlan.query()
      .where('businessIdeaId', ideaId)
      .orderBy('version', 'desc')
      .first()

    const version = (latestPlan?.version || 0) + 1

    const plan = await StructuredPlan.create({
      businessIdeaId: ideaId,
      version,
      status: GenerationStatus.Processing,
      createdByUserId: userId || null,
    })

    try {
      const ai = getAIProvider()
      const prompt = PROMPTS.generateStructuredPlan

      const response = await ai.generateObject<StructuredPlanContent>({
        systemPrompt: prompt.system,
        prompt: prompt.user({
          title: idea.title,
          summary: idea.summary,
          problem: idea.problem,
          solution: idea.solution,
          audience: idea.audience,
          monetizationModel: idea.monetizationModel,
        }),
        schema: null,
        promptVersion: prompt.version,
        maxTokens: 8192,
      })

      await plan.merge({
        content: response.data,
        status: GenerationStatus.Completed,
      }).save()

      await this.aiLogger.log({
        userId,
        entityType: 'structured_plan',
        entityId: plan.id,
        generationType: GenerationType.StructuredPlan,
        modelName: response.model,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        status: GenerationStatus.Completed,
        promptVersion: prompt.version,
        responseJson: response.data as unknown as Record<string, unknown>,
      })

      return plan
    } catch (error) {
      logger.error({ error, ideaId }, 'Failed to generate structured plan')

      await plan.merge({
        status: GenerationStatus.Failed,
      }).save()

      await this.aiLogger.log({
        userId,
        entityType: 'structured_plan',
        entityId: plan.id,
        generationType: GenerationType.StructuredPlan,
        modelName: 'unknown',
        status: GenerationStatus.Failed,
        promptVersion: PROMPTS.generateStructuredPlan.version,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })

      throw error
    }
  }
}
