import { ILLMProvider } from './llm-provider.interface.js';
import { ClaudeService } from './claude.service.js';
import { MiniMaxService } from './minimax.service.js';
import { KimiService } from './kimi.service.js';
import { DeepSeekService } from './deepseek.service.js';
import { logger } from '../utils/logger.js';

export type LLMProviderType = 'claude' | 'minimax' | 'kimi' | 'deepseek';

export interface LLMProviderConfig {
  provider: LLMProviderType;
  apiKey: string;
  groupId?: string; // Required for MiniMax
}

/**
 * Factory for creating LLM provider instances
 */
export class LLMProviderFactory {
  /**
   * Create an LLM provider instance based on the configuration
   */
  static createProvider(config: LLMProviderConfig): ILLMProvider {
    logger.info(`Creating LLM provider: ${config.provider}`);

    switch (config.provider) {
      case 'claude':
        return new ClaudeService(config.apiKey);

      case 'minimax':
        if (!config.groupId) {
          throw new Error('MiniMax provider requires groupId in configuration');
        }
        return new MiniMaxService(config.apiKey, config.groupId);

      case 'kimi':
        return new KimiService(config.apiKey);

      case 'deepseek':
        return new DeepSeekService(config.apiKey);

      default:
        throw new Error(`Unknown LLM provider: ${config.provider}`);
    }
  }

  /**
   * Get list of supported providers
   */
  static getSupportedProviders(): LLMProviderType[] {
    return ['claude', 'minimax', 'kimi', 'deepseek'];
  }

  /**
   * Validate provider configuration
   */
  static validateConfig(config: LLMProviderConfig): boolean {
    if (!config.provider) {
      throw new Error('Provider type is required');
    }

    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    if (config.provider === 'minimax' && !config.groupId) {
      throw new Error('MiniMax provider requires groupId');
    }

    if (!this.getSupportedProviders().includes(config.provider)) {
      throw new Error(`Unsupported provider: ${config.provider}. Supported providers: ${this.getSupportedProviders().join(', ')}`);
    }

    return true;
  }
}
