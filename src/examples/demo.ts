import { VoiceWebAgent } from '../agent.js';
import { loadConfig } from '../utils/config.js';
import { LLMProviderConfig } from '../services/llm-provider.factory.js';

async function demoAutomation() {
  const config = loadConfig();

  // Create LLM provider configuration
  const llmProviderConfig: LLMProviderConfig = {
    provider: config.llmProvider,
    apiKey: getApiKeyForProvider(config),
    groupId: config.minimaxGroupId
  };

  const agent = new VoiceWebAgent(
    llmProviderConfig,
    config.openaiApiKey
  );

  await agent.initialize(false); // Run in visible mode

  console.log('=== Demo: Automated Web Search ===\n');

  // Navigate to Google
  await agent.executeCommand('Navigate to google.com');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Perform a search
  await agent.executeCommand('Type "artificial intelligence" in the search box and submit');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Scroll down
  await agent.executeCommand('Scroll down the page');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Describe what's on screen
  await agent.executeCommand('Describe what you see on the screen');

  console.log('\n=== Demo Complete ===');
  await agent.stop();
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

// Run the demo
demoAutomation().catch(console.error);

