import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import { VoiceCommand } from '../types/index.js';

export class SpeechService {
  private openai: OpenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      logger.info('OpenAI speech service initialized');
    } else {
      logger.warn('OpenAI API key not provided. Speech recognition will use simulated mode.');
    }
  }

  /**
   * Simulate voice command input (for testing without actual audio)
   * In production, this would integrate with OpenAI Whisper or browser Web Speech API
   */
  async simulateVoiceCommand(text: string): Promise<VoiceCommand> {
    logger.info(`Simulated voice command: "${text}"`);
    return {
      text,
      timestamp: Date.now(),
      confidence: 0.95
    };
  }

  /**
   * Transcribe audio using OpenAI Whisper API
   * @param audioBuffer - Audio file buffer (mp3, wav, etc.)
   */
  async transcribeAudio(audioBuffer: Buffer): Promise<VoiceCommand> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured. Cannot transcribe audio.');
    }

    try {
      logger.info('Transcribing audio with Whisper...');

      // Convert Buffer to Uint8Array for Blob
      const uint8Array = new Uint8Array(audioBuffer);
      const blob = new Blob([uint8Array], { type: 'audio/mpeg' });
      const audioFile = new File([blob], 'audio.mp3', { type: 'audio/mpeg' });

      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
      });

      const command: VoiceCommand = {
        text: transcription.text,
        timestamp: Date.now(),
        confidence: 1.0
      };

      logger.info(`Transcription: "${command.text}"`);
      return command;
    } catch (error) {
      logger.error('Transcription failed:', error);
      throw error;
    }
  }

  /**
   * Get voice input from user (console-based for simplicity)
   * In a full implementation, this would use microphone input
   */
  async getVoiceInput(): Promise<VoiceCommand> {
    // For now, we'll use console input as a placeholder
    // In production, integrate with Web Speech API or record audio for Whisper
    logger.info('Voice input mode (using console for simulation)');

    return new Promise((resolve) => {
      process.stdin.once('data', (data) => {
        const text = data.toString().trim();
        resolve(this.simulateVoiceCommand(text));
      });
    });
  }

  /**
   * Convert text to speech (placeholder for TTS functionality)
   */
  async speak(text: string): Promise<void> {
    logger.info(`[AGENT SPEAKS]: ${text}`);
    // In production, integrate with OpenAI TTS or browser Speech Synthesis API
    // await this.openai.audio.speech.create({ ... });
  }
}
