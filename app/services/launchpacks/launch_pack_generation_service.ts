import logger from '@adonisjs/core/services/logger'
import BusinessIdea from '#models/business_idea'
import StructuredPlan from '#models/structured_plan'
import LaunchPack from '#models/launch_pack'
import { GenerationStatus, GenerationType } from '#types/enums'
import type { LaunchPackContent } from '#types/ai'
import { getAIProvider } from '../ai/ai_service.js'
import { AIUsageLoggingService } from '../ai/ai_usage_logging_service.js'
import { PROMPTS } from '../ai/prompts.js'

export class LaunchPackGenerationService {
  private aiLogger = new AIUsageLoggingService()

  async generate(ideaId: number, userId?: number): Promise<LaunchPack> {
    const idea = await BusinessIdea.findOrFail(ideaId)

    const latestPlan = await StructuredPlan.query()
      .where('businessIdeaId', ideaId)
      .where('status', GenerationStatus.Completed)
      .orderBy('version', 'desc')
      .first()

    const latestPack = await LaunchPack.query()
      .where('businessIdeaId', ideaId)
      .orderBy('version', 'desc')
      .first()

    const version = (latestPack?.version || 0) + 1

    const pack = await LaunchPack.create({
      businessIdeaId: ideaId,
      structuredPlanId: latestPlan?.id || null,
      version,
      status: GenerationStatus.Processing,
      brandNames: [],
      domainSuggestions: [],
      websiteOutline: {},
      marketingPlan: {},
      launchChecklist: [],
      contentAngles: [],
      offerDesign: {},
      assumptions: [],
      createdByUserId: userId || null,
    })

    try {
      const ai = getAIProvider()
      const prompt = PROMPTS.generateLaunchPack

      const planData = latestPlan?.content
        ? { marketAngle: latestPlan.content.marketAngle, offerHypothesis: latestPlan.content.offerHypothesis }
        : undefined

      const response = await ai.generateObject<LaunchPackContent>({
        systemPrompt: prompt.system,
        prompt: prompt.user(
          { title: idea.title, summary: idea.summary, audience: idea.audience, monetizationModel: idea.monetizationModel },
          planData
        ),
        schema: null,
        promptVersion: prompt.version,
      })

      const data = response.data

      await pack.merge({
        brandNames: data.brandNames || [],
        domainSuggestions: data.domainSuggestions || [],
        websiteOutline: data.homepageOutline || {},
        marketingPlan: { contentStrategy: data.contentStrategy, distributionChannels: data.distributionChannels },
        launchChecklist: data.launchSequence || [],
        contentAngles: data.contentStrategy?.hooks || [],
        offerDesign: { pricing: data.pricingHypothesis, leadMagnet: data.leadMagnetIdea },
        assumptions: data.experimentBacklog || [],
        status: GenerationStatus.Completed,
      }).save()

      await this.aiLogger.log({
        userId,
        entityType: 'launch_pack',
        entityId: pack.id,
        generationType: GenerationType.LaunchPack,
        modelName: response.model,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        status: GenerationStatus.Completed,
        promptVersion: prompt.version,
        responseJson: data as unknown as Record<string, unknown>,
      })

      return pack
    } catch (error) {
      logger.error({ error, ideaId }, 'Failed to generate launch pack')

      await pack.merge({ status: GenerationStatus.Failed }).save()

      await this.aiLogger.log({
        userId,
        entityType: 'launch_pack',
        entityId: pack.id,
        generationType: GenerationType.LaunchPack,
        modelName: 'unknown',
        status: GenerationStatus.Failed,
        promptVersion: PROMPTS.generateLaunchPack.version,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })

      throw error
    }
  }
}
