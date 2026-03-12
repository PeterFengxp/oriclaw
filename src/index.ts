import { VoiceWebAgent } from './agent.js';
import { loadConfig } from './utils/config.js';
import { logger } from './utils/logger.js';
import { LLMProviderConfig } from './services/llm-provider.factory.js';

async function main() {
  try {
    // Load configuration
    const config = loadConfig();

    // Create LLM provider configuration
    const llmProviderConfig: LLMProviderConfig = {
      provider: config.llmProvider,
      apiKey: getApiKeyForProvider(config),
      groupId: config.minimaxGroupId
    };

    // Create and initialize the agent
    const agent = new VoiceWebAgent(
      llmProviderConfig,
      config.openaiApiKey,
      config.screenshotDir
    );

    await agent.initialize(config.headless);

    // Optional: Navigate to a starting page
    // await agent.getServices().browser.navigate('https://www.google.com');

    // Start the interactive loop
    await agent.start();
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

/**
 * Get the API key for the selected provider
 */
function getApiKeyForProvider(config: any): string {
  switch (config.llmProvider) {
    case 'claude':
      return config.anthropicApiKey!;
    case 'minimax':
      return config.minimaxApiKey!;
    case 'kimi':
      return config.kimiApiKey!;
    case 'deepseek':
      return config.deepseekApiKey!;
    default:
      throw new Error(`Unknown provider: ${config.llmProvider}`);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('\nReceived SIGINT, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down...');
  process.exit(0);
});

main();
