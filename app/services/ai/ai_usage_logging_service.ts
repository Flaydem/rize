import AiGeneration from '#models/ai_generation'
import type { GenerationStatus, GenerationType } from '#types/enums'

interface LogParams {
  userId?: number
  entityType: string
  entityId: number
  generationType: GenerationType
  modelName: string
  inputTokens?: number
  outputTokens?: number
  status: GenerationStatus
  promptVersion?: string
  responseJson?: Record<string, unknown>
  responseText?: string
  errorMessage?: string
}

export class AIUsageLoggingService {
  async log(params: LogParams): Promise<AiGeneration> {
    return AiGeneration.create({
      userId: params.userId ?? null,
      entityType: params.entityType,
      entityId: params.entityId,
      generationType: params.generationType,
      modelName: params.modelName,
      inputTokens: params.inputTokens ?? null,
      outputTokens: params.outputTokens ?? null,
      status: params.status,
      promptVersion: params.promptVersion ?? null,
      responseJson: params.responseJson ?? null,
      responseText: params.responseText ?? null,
      errorMessage: params.errorMessage ?? null,
    })
  }
}
