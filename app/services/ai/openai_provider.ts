import OpenAI from 'openai'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import { AIProvider } from './ai_provider.js'
import type { AIProviderResponse, GenerateObjectParams, GenerateTextParams } from '#types/ai'

export class OpenAIProvider extends AIProvider {
  private client: OpenAI
  private model: string

  constructor() {
    super()
    this.client = new OpenAI({ apiKey: env.get('OPENAI_API_KEY', '') })
    this.model = env.get('OPENAI_MODEL', 'gpt-4o')
  }

  async generateObject<T>(params: GenerateObjectParams<T>): Promise<AIProviderResponse<T>> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = []

    if (params.systemPrompt) {
      messages.push({ role: 'system', content: params.systemPrompt })
    }
    messages.push({ role: 'user', content: params.prompt })

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 4096,
        response_format: { type: 'json_object' },
      })

      const content = response.choices[0]?.message?.content ?? '{}'
      const parsed = JSON.parse(content) as T

      return {
        data: parsed,
        inputTokens: response.usage?.prompt_tokens,
        outputTokens: response.usage?.completion_tokens,
        model: this.model,
      }
    } catch (error) {
      logger.error({ error }, 'OpenAI generateObject failed')
      throw error
    }
  }

  async generateText(params: GenerateTextParams): Promise<AIProviderResponse<string>> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = []

    if (params.systemPrompt) {
      messages.push({ role: 'system', content: params.systemPrompt })
    }
    messages.push({ role: 'user', content: params.prompt })

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 4096,
      })

      const content = response.choices[0]?.message?.content ?? ''

      return {
        data: content,
        inputTokens: response.usage?.prompt_tokens,
        outputTokens: response.usage?.completion_tokens,
        model: this.model,
      }
    } catch (error) {
      logger.error({ error }, 'OpenAI generateText failed')
      throw error
    }
  }
}
