import type { AIProviderResponse, GenerateObjectParams, GenerateTextParams } from '#types/ai'

export abstract class AIProvider {
  abstract generateObject<T>(params: GenerateObjectParams<T>): Promise<AIProviderResponse<T>>
  abstract generateText(params: GenerateTextParams): Promise<AIProviderResponse<string>>
}
