import { ScreenAnalysis, AgentAction } from '../types/index.js';

/**
 * Base interface for all LLM providers
 * This interface defines the contract that all LLM services must implement
 */
export interface ILLMProvider {
  /**
   * Analyze a screenshot using the LLM's vision capabilities
   * @param screenshotPath Path to the screenshot file
   * @returns Structured analysis of the screen content
   */
  analyzeScreen(screenshotPath: string): Promise<ScreenAnalysis>;

  /**
   * Interpret a voice command in the context of the current screen
   * @param voiceCommand The user's voice command
   * @param screenContext Analysis of the current screen
   * @returns Array of actions to execute
   */
  interpretCommand(
    voiceCommand: string,
    screenContext: ScreenAnalysis
  ): Promise<AgentAction[]>;

  /**
   * Get a conversational response from the LLM
   * @param message User message
   * @returns LLM response
   */
  chat(message: string): Promise<string>;

  /**
   * Reset the conversation history
   */
  resetConversation(): void;
}
