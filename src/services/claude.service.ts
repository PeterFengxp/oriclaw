import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger.js';
import { ScreenAnalysis, AgentAction } from '../types/index.js';
import { ILLMProvider } from './llm-provider.interface.js';
import fs from 'fs/promises';

export class ClaudeService implements ILLMProvider {
  private client: Anthropic;
  private conversationHistory: Anthropic.MessageParam[] = [];

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
    logger.info('Claude AI service initialized');
  }

  /**
   * Analyze screenshot using Claude's vision capabilities
   */
  async analyzeScreen(screenshotPath: string): Promise<ScreenAnalysis> {
    try {
      logger.info(`Analyzing screenshot: ${screenshotPath}`);

      const imageBuffer = await fs.readFile(screenshotPath);
      const base64Image = imageBuffer.toString('base64');

      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: `Analyze this screenshot and describe:
1. What is shown on the screen (webpage, app, etc.)
2. Main interactive elements visible (buttons, links, forms, etc.)
3. The overall layout and structure

Provide a structured analysis that can help a voice-controlled automation agent interact with this screen.`,
              },
            ],
          },
        ],
      });

      const content = response.content[0];
      const description = content.type === 'text' ? content.text : '';

      logger.info('Screen analysis completed');

      return {
        description,
        elements: this.extractElements(description),
        suggestions: this.extractSuggestions(description),
      };
    } catch (error) {
      logger.error('Screen analysis failed:', error);
      throw error;
    }
  }

  /**
   * Interpret voice command in the context of the current screen
   */
  async interpretCommand(
    voiceCommand: string,
    screenContext: ScreenAnalysis
  ): Promise<AgentAction[]> {
    try {
      logger.info(`Interpreting command: "${voiceCommand}"`);

      const prompt = `You are an AI agent that controls a web browser based on voice commands.

Current screen context:
${screenContext.description}

User voice command: "${voiceCommand}"

Based on this command and the screen context, determine the specific browser actions needed.
Respond with a JSON array of actions. Each action should have:
- type: one of 'click', 'type', 'navigate', 'scroll', 'wait', 'speak'
- target: CSS selector or description (for click/type)
- value: text to type or URL to navigate (for type/navigate)
- coordinates: {x, y} if clicking by coordinates

Example response:
[
  {"type": "click", "target": "#search-button"},
  {"type": "type", "target": "input[name='q']", "value": "hello world"},
  {"type": "speak", "value": "I've entered the search text"}
]

Provide only the JSON array, no additional text.`;

      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          ...this.conversationHistory,
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      const responseText = content.type === 'text' ? content.text : '';

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: prompt },
        { role: 'assistant', content: responseText }
      );

      // Keep only last 10 messages to manage context
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      logger.info('Command interpretation completed');

      // Parse JSON response
      const actions = this.parseActions(responseText);
      return actions;
    } catch (error) {
      logger.error('Command interpretation failed:', error);
      throw error;
    }
  }

  /**
   * Get a conversational response from Claude
   */
  async chat(message: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          ...this.conversationHistory,
          {
            role: 'user',
            content: message,
          },
        ],
      });

      const content = response.content[0];
      const responseText = content.type === 'text' ? content.text : '';

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: responseText }
      );

      return responseText;
    } catch (error) {
      logger.error('Chat failed:', error);
      throw error;
    }
  }

  private parseActions(responseText: string): AgentAction[] {
    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonText = responseText.trim();

      // Remove markdown code block markers if present
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }

      const actions = JSON.parse(jsonText);
      return Array.isArray(actions) ? actions : [actions];
    } catch (error) {
      logger.warn('Failed to parse actions from response, using fallback');
      // Fallback: create a speak action
      return [
        {
          type: 'speak',
          value: 'I understood your command but could not determine specific actions.',
        },
      ];
    }
  }

  private extractElements(description: string): any[] {
    // Simple extraction - in production, use more sophisticated parsing
    // or have Claude return structured data
    return [];
  }

  private extractSuggestions(description: string): string[] {
    // Extract suggested actions from description
    return [];
  }

  resetConversation(): void {
    this.conversationHistory = [];
    logger.info('Conversation history reset');
  }
}
