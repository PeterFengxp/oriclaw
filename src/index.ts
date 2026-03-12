import { VoiceWebAgent } from './agent.js';
import { loadConfig } from './utils/config.js';
import { logger } from './utils/logger.js';

async function main() {
  try {
    // Load configuration
    const config = loadConfig();

    // Create and initialize the agent
    const agent = new VoiceWebAgent(
      config.anthropicApiKey,
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
