import { VoiceWebAgent } from '../agent.js';
import { loadConfig } from '../utils/config.js';

async function demoAutomation() {
  const config = loadConfig();
  const agent = new VoiceWebAgent(
    config.anthropicApiKey,
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

// Run the demo
demoAutomation().catch(console.error);
