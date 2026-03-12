import dotenv from 'dotenv';
import { AgentConfig } from '../types/index.js';

dotenv.config();

export function loadConfig(): AgentConfig {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY is required in .env file');
  }

  return {
    anthropicApiKey,
    openaiApiKey: process.env.OPENAI_API_KEY,
    headless: process.env.HEADLESS === 'true',
    screenshotDir: './screenshots'
  };
}
