import logger from '@adonisjs/core/services/logger'
import BusinessValidation from '#models/business_validation'
import { GenerationType, GenerationStatus } from '#types/enums'
import type { ValidationResult } from '#types/ai'
import { getAIProvider } from '../ai/ai_service.js'
import { AIUsageLoggingService } from '../ai/ai_usage_logging_service.js'
import { HeuristicScoringService } from './heuristic_scoring_service.js'
import { PROMPTS } from '../ai/prompts.js'

interface ValidationInput {
  title: string
  description: string
  targetAudience?: string
  context?: Record<string, unknown>
}

export class BusinessValidationService {
  private heuristic = new HeuristicScoringService()
  private aiLogger = new AIUsageLoggingService()

  async validate(input: ValidationInput, userId: number): Promise<BusinessValidation> {
    // Step 1: Compute heuristic score
    const heuristicResult = this.heuristic.score({
      problemClarity: input.description,
      audienceSpecificity: input.targetAudience || '',
      monetizationModel: (input.context?.monetizationModel as string) || '',
      distributionChannels: (input.context?.distributionChannels as string) || '',
      differentiation: (input.context?.differentiation as string) || '',
      technicalFeasibility: (input.context?.technicalFeasibility as string) || '',
      timeToMarket: (input.context?.timeToMarket as string) || '',
    })

    // Step 2: Create initial validation record with heuristic scores
    const validation = await BusinessValidation.create({
      userId,
      inputTitle: input.title,
      inputDescription: input.description,
      targetAudience: input.targetAudience || null,
      inputContext: input.context || {},
      scoreGlobal: heuristicResult.total,
      scoreProblem: heuristicResult.breakdown.problemClarity,
      scoreAudience: heuristicResult.breakdown.audienceSpecificity,
      scoreMonetization: heuristicResult.breakdown.monetizationClarity,
      scoreDistribution: heuristicResult.breakdown.distributionFeasibility,
      scoreFeasibility: heuristicResult.breakdown.buildFeasibility,
      scoreDifferentiation: heuristicResult.breakdown.competitiveDifferentiation,
      strengths: [],
      risks: [],
      recommendations: [],
      validationPlan: [],
    })

    // Step 3: Enrich with AI analysis
    try {
      const ai = getAIProvider()
      const prompt = PROMPTS.validateBusinessIdea

      const response = await ai.generateObject<ValidationResult>({
        systemPrompt: prompt.system,
        prompt: prompt.user(input),
        schema: null,
        promptVersion: prompt.version,
      })

      const aiResult = response.data

      // Merge heuristic and AI scores (average)
      const mergedScores = {
        scoreProblem: Math.round((heuristicResult.breakdown.problemClarity + aiResult.scoreProblem) / 2),
        scoreAudience: Math.round((heuristicResult.breakdown.audienceSpecificity + aiResult.scoreAudience) / 2),
        scoreMonetization: Math.round((heuristicResult.breakdown.monetizationClarity + aiResult.scoreMonetization) / 2),
        scoreDistribution: Math.round((heuristicResult.breakdown.distributionFeasibility + aiResult.scoreDistribution) / 2),
        scoreFeasibility: Math.round((heuristicResult.breakdown.buildFeasibility + aiResult.scoreFeasibility) / 2),
        scoreDifferentiation: Math.round((heuristicResult.breakdown.competitiveDifferentiation + aiResult.scoreDifferentiation) / 2),
      }

      const scoreGlobal = Object.values(mergedScores).reduce((sum, val) => sum + val, 0)

      await validation.merge({
        ...mergedScores,
        scoreGlobal,
        strengths: aiResult.strengths || [],
        risks: aiResult.risks || [],
        recommendations: aiResult.recommendations || [],
        validationPlan: aiResult.validationPlan || [],
      }).save()

      await this.aiLogger.log({
        userId,
        entityType: 'business_validation',
        entityId: validation.id,
        generationType: GenerationType.Validation,
        modelName: response.model,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        status: GenerationStatus.Completed,
        promptVersion: prompt.version,
        responseJson: aiResult as unknown as Record<string, unknown>,
      })
    } catch (error) {
      logger.error({ error, validationId: validation.id }, 'AI validation failed, keeping heuristic scores')

      await this.aiLogger.log({
        userId,
        entityType: 'business_validation',
        entityId: validation.id,
        generationType: GenerationType.Validation,
        modelName: 'unknown',
        status: GenerationStatus.Failed,
        promptVersion: PROMPTS.validateBusinessIdea.version,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    return validation.refresh()
  }
}
