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
  anthropicApiKey: string;
  openaiApiKey?: string;
  headless: boolean;
  screenshotDir: string;
}
