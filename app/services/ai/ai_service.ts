import env from '#start/env'
import { AIProvider } from './ai_provider.js'
import { OpenAIProvider } from './openai_provider.js'
import { OpenRouterProvider } from './openrouter_provider.js'

let instance: AIProvider | null = null

export function getAIProvider(): AIProvider {
  if (!instance) {
    // Priorite a OpenRouter si la cle est configuree
    if (env.get('OPENROUTER_API_KEY')) {
      instance = new OpenRouterProvider()
    } else {
      instance = new OpenAIProvider()
    }
  }
  return instance
}
