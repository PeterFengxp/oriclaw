import dotenv from 'dotenv';
import { AgentConfig } from '../types/index.js';

dotenv.config();

export function loadConfig(): AgentConfig {
  // Get LLM provider type (default to claude for backwards compatibility)
  const llmProvider = (process.env.LLM_PROVIDER || 'claude') as 'claude' | 'minimax' | 'kimi' | 'deepseek';

  // Load API keys for different providers
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  const minimaxApiKey = process.env.MINIMAX_API_KEY;
  const minimaxGroupId = process.env.MINIMAX_GROUP_ID;
  const kimiApiKey = process.env.KIMI_API_KEY;
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

  // Validate that the required API key for the selected provider is present
  if (llmProvider === 'claude' && !anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY is required when using Claude provider');
  }
  if (llmProvider === 'minimax' && (!minimaxApiKey || !minimaxGroupId)) {
    throw new Error('MINIMAX_API_KEY and MINIMAX_GROUP_ID are required when using MiniMax provider');
  }
  if (llmProvider === 'kimi' && !kimiApiKey) {
    throw new Error('KIMI_API_KEY is required when using Kimi provider');
  }
  if (llmProvider === 'deepseek' && !deepseekApiKey) {
    throw new Error('DEEPSEEK_API_KEY is required when using DeepSeek provider');
  }

  return {
    llmProvider,
    anthropicApiKey,
    minimaxApiKey,
    minimaxGroupId,
    kimiApiKey,
    deepseekApiKey,
    openaiApiKey: process.env.OPENAI_API_KEY,
    headless: process.env.HEADLESS === 'true',
    screenshotDir: './screenshots'
  };
}
