export interface VoiceCommand {
  text: string;
  timestamp: number;
  confidence?: number;
}

export interface ScreenAnalysis {
  description: string;
  elements: ScreenElement[];
  suggestions: string[];
}

export interface ScreenElement {
  type: string;
  text?: string;
  position?: {
    x: number;
    y: number;
  };
  selector?: string;
}

export interface AgentAction {
  type: 'click' | 'type' | 'navigate' | 'scroll' | 'wait' | 'speak';
  target?: string;
  value?: string;
  coordinates?: {
    x: number;
    y: number;
  };
}

export interface AgentConfig {
  // LLM Provider Configuration
  llmProvider: 'claude' | 'minimax' | 'kimi' | 'deepseek';

  // API Keys for different providers
  anthropicApiKey?: string;  // For Claude
  minimaxApiKey?: string;    // For MiniMax
  minimaxGroupId?: string;   // Required for MiniMax
  kimiApiKey?: string;       // For Kimi (Moonshot AI)
  deepseekApiKey?: string;   // For DeepSeek

  // Other services
  openaiApiKey?: string;     // For speech services (optional)

  // Browser settings
  headless: boolean;
  screenshotDir: string;
}
