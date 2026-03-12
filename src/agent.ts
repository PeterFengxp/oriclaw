import { BrowserService } from './services/browser.service.js';
import { SpeechService } from './services/speech.service.js';
import { ClaudeService } from './services/claude.service.js';
import { AgentAction, VoiceCommand } from './types/index.js';
import { logger } from './utils/logger.js';

export class VoiceWebAgent {
  private browserService: BrowserService;
  private speechService: SpeechService;
  private claudeService: ClaudeService;
  private isRunning: boolean = false;

  constructor(
    anthropicApiKey: string,
    openaiApiKey?: string,
    screenshotDir: string = './screenshots'
  ) {
    this.browserService = new BrowserService(screenshotDir);
    this.speechService = new SpeechService(openaiApiKey);
    this.claudeService = new ClaudeService(anthropicApiKey);
  }

  /**
   * Initialize the agent
   */
  async initialize(headless: boolean = false): Promise<void> {
    try {
      logger.info('Initializing Voice Web Agent...');
      await this.browserService.initialize(headless);
      logger.info('Voice Web Agent initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize agent:', error);
      throw error;
    }
  }

  /**
   * Start the agent's main control loop
   */
  async start(): Promise<void> {
    this.isRunning = true;
    logger.info('Voice Web Agent started');

    await this.speechService.speak('Voice Web Agent ready. Listening for commands...');

    console.log('\n=== Voice Web Agent ===');
    console.log('Type your voice commands (or "exit" to quit):');
    console.log('Examples:');
    console.log('  - Navigate to google.com');
    console.log('  - Click the search button');
    console.log('  - Type "hello world" in the search box');
    console.log('  - Take a screenshot and describe what you see');
    console.log('========================\n');

    // Main interaction loop
    while (this.isRunning) {
      try {
        await this.processVoiceCommand();
      } catch (error) {
        logger.error('Error processing command:', error);
        await this.speechService.speak('Sorry, I encountered an error processing that command.');
      }
    }
  }

  /**
   * Process a single voice command
   */
  private async processVoiceCommand(): Promise<void> {
    // Get voice input (currently using console as placeholder)
    process.stdout.write('> ');

    const command = await this.speechService.getVoiceInput();

    // Handle exit command
    if (command.text.toLowerCase() === 'exit' || command.text.toLowerCase() === 'quit') {
      await this.stop();
      return;
    }

    // Take screenshot of current state
    const screenshotPath = await this.browserService.takeScreenshot();

    // Analyze the screen with Claude's vision
    const screenAnalysis = await this.claudeService.analyzeScreen(screenshotPath);

    logger.info('Screen analysis:', screenAnalysis.description.substring(0, 100) + '...');

    // Interpret the command in context
    const actions = await this.claudeService.interpretCommand(
      command.text,
      screenAnalysis
    );

    // Execute the actions
    await this.executeActions(actions);
  }

  /**
   * Execute a sequence of actions
   */
  private async executeActions(actions: AgentAction[]): Promise<void> {
    for (const action of actions) {
      try {
        logger.info(`Executing action: ${action.type}`);

        switch (action.type) {
          case 'navigate':
            if (action.value) {
              // Add protocol if missing
              let url = action.value;
              if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
              }
              await this.browserService.navigate(url);
            }
            break;

          case 'click':
            if (action.coordinates) {
              await this.browserService.clickCoordinates(
                action.coordinates.x,
                action.coordinates.y
              );
            } else if (action.target) {
              await this.browserService.click(action.target);
            }
            break;

          case 'type':
            if (action.target && action.value) {
              await this.browserService.type(action.target, action.value);
            }
            break;

          case 'scroll':
            const direction = action.value === 'up' ? 'up' : 'down';
            await this.browserService.scroll(direction);
            break;

          case 'wait':
            const waitTime = action.value ? parseInt(action.value) : 1000;
            await this.browserService.waitForTimeout(waitTime);
            break;

          case 'speak':
            if (action.value) {
              await this.speechService.speak(action.value);
            }
            break;

          default:
            logger.warn(`Unknown action type: ${action.type}`);
        }

        // Small delay between actions
        await this.browserService.waitForTimeout(300);
      } catch (error) {
        logger.error(`Failed to execute action ${action.type}:`, error);
        await this.speechService.speak(`Failed to ${action.type}. ${error}`);
      }
    }
  }

  /**
   * Execute a single command (useful for programmatic control)
   */
  async executeCommand(commandText: string): Promise<void> {
    const command: VoiceCommand = {
      text: commandText,
      timestamp: Date.now(),
      confidence: 1.0
    };

    const screenshotPath = await this.browserService.takeScreenshot();
    const screenAnalysis = await this.claudeService.analyzeScreen(screenshotPath);
    const actions = await this.claudeService.interpretCommand(command.text, screenAnalysis);
    await this.executeActions(actions);
  }

  /**
   * Stop the agent
   */
  async stop(): Promise<void> {
    logger.info('Stopping Voice Web Agent...');
    this.isRunning = false;
    await this.speechService.speak('Voice Web Agent shutting down. Goodbye!');
    await this.browserService.close();
    logger.info('Voice Web Agent stopped');
    process.exit(0);
  }

  /**
   * Get direct access to services for advanced usage
   */
  getServices() {
    return {
      browser: this.browserService,
      speech: this.speechService,
      claude: this.claudeService
    };
  }
}
