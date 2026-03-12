import { logger } from '../utils/logger.js';
import { ScreenAnalysis, AgentAction } from '../types/index.js';
import { ILLMProvider } from './llm-provider.interface.js';
import fs from 'fs/promises';

/**
 * MiniMax service implementation for multimodal AI capabilities
 * Supports MiniMax domestic version API
 */
export class MiniMaxService implements ILLMProvider {
  private apiKey: string;
  private groupId: string;
  private baseUrl: string = 'https://api.minimax.chat/v1';
  private conversationHistory: any[] = [];
  private model: string = 'abab6.5-chat'; // MiniMax multimodal model

  constructor(apiKey: string, groupId: string) {
    this.apiKey = apiKey;
    this.groupId = groupId;
    logger.info('MiniMax AI service initialized');
  }

  /**
   * Analyze screenshot using MiniMax's vision capabilities
   */
  async analyzeScreen(screenshotPath: string): Promise<ScreenAnalysis> {
    try {
      logger.info(`Analyzing screenshot with MiniMax: ${screenshotPath}`);

      const imageBuffer = await fs.readFile(screenshotPath);
      const base64Image = imageBuffer.toString('base64');

      const response = await fetch(`${this.baseUrl}/text/chatcompletion_v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`
                  }
                },
                {
                  type: 'text',
                  text: `Analyze this screenshot and describe:
1. What is shown on the screen (webpage, app, etc.)
2. Main interactive elements visible (buttons, links, forms, etc.)
3. The overall layout and structure

Provide a structured analysis that can help a voice-controlled automation agent interact with this screen.`
                }
              ]
            }
          ],
          tokens_to_generate: 2048,
          temperature: 0.7,
          top_p: 0.95
        })
      });

      if (!response.ok) {
        throw new Error(`MiniMax API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const description = data.choices?.[0]?.message?.content || '';

      logger.info('Screen analysis completed with MiniMax');

      return {
        description,
        elements: this.extractElements(description),
        suggestions: this.extractSuggestions(description),
      };
    } catch (error) {
      logger.error('MiniMax screen analysis failed:', error);
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
      logger.info(`Interpreting command with MiniMax: "${voiceCommand}"`);

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

      const messages = [
        ...this.conversationHistory,
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await fetch(`${this.baseUrl}/text/chatcompletion_v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          tokens_to_generate: 1024,
          temperature: 0.7,
          top_p: 0.95
        })
      });

      if (!response.ok) {
        throw new Error(`MiniMax API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || '';

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: prompt },
        { role: 'assistant', content: responseText }
      );

      // Keep only last 10 messages to manage context
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      logger.info('Command interpretation completed with MiniMax');

      // Parse JSON response
      const actions = this.parseActions(responseText);
      return actions;
    } catch (error) {
      logger.error('MiniMax command interpretation failed:', error);
      throw error;
    }
  }

  /**
   * Get a conversational response from MiniMax
   */
  async chat(message: string): Promise<string> {
    try {
      const messages = [
        ...this.conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch(`${this.baseUrl}/text/chatcompletion_v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          tokens_to_generate: 1024,
          temperature: 0.7,
          top_p: 0.95
        })
      });

      if (!response.ok) {
        throw new Error(`MiniMax API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || '';

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: responseText }
      );

      return responseText;
    } catch (error) {
      logger.error('MiniMax chat failed:', error);
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
      logger.warn('Failed to parse actions from MiniMax response, using fallback');
      return [
        {
          type: 'speak',
          value: 'I understood your command but could not determine specific actions.',
        },
      ];
    }
  }

  private extractElements(description: string): any[] {
    return [];
  }

  private extractSuggestions(description: string): string[] {
    return [];
  }

  resetConversation(): void {
    this.conversationHistory = [];
    logger.info('MiniMax conversation history reset');
  }
}
