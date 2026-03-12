import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { logger } from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';

export class BrowserService {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private screenshotDir: string;

  constructor(screenshotDir: string = './screenshots') {
    this.screenshotDir = screenshotDir;
  }

  async initialize(headless: boolean = false): Promise<void> {
    try {
      logger.info('Initializing browser...');

      // Ensure screenshot directory exists
      await fs.mkdir(this.screenshotDir, { recursive: true });

      this.browser = await chromium.launch({
        headless,
        args: ['--start-maximized']
      });

      this.context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 }
      });

      this.page = await this.context.newPage();
      logger.info('Browser initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  async navigate(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    try {
      logger.info(`Navigating to: ${url}`);
      await this.page.goto(url, { waitUntil: 'networkidle' });
      logger.info('Navigation completed');
    } catch (error) {
      logger.error('Navigation failed:', error);
      throw error;
    }
  }

  async takeScreenshot(): Promise<string> {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    try {
      const timestamp = Date.now();
      const filename = `screenshot-${timestamp}.png`;
      const filepath = path.join(this.screenshotDir, filename);

      await this.page.screenshot({
        path: filepath,
        fullPage: false
      });

      logger.info(`Screenshot saved: ${filepath}`);
      return filepath;
    } catch (error) {
      logger.error('Screenshot failed:', error);
      throw error;
    }
  }

  async click(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized.');
    }

    try {
      logger.info(`Clicking element: ${selector}`);
      await this.page.click(selector);
      await this.page.waitForTimeout(500);
    } catch (error) {
      logger.error(`Failed to click ${selector}:`, error);
      throw error;
    }
  }

  async clickCoordinates(x: number, y: number): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized.');
    }

    try {
      logger.info(`Clicking coordinates: (${x}, ${y})`);
      await this.page.mouse.click(x, y);
      await this.page.waitForTimeout(500);
    } catch (error) {
      logger.error(`Failed to click coordinates:`, error);
      throw error;
    }
  }

  async type(selector: string, text: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized.');
    }

    try {
      logger.info(`Typing into ${selector}: ${text}`);
      await this.page.fill(selector, text);
      await this.page.waitForTimeout(300);
    } catch (error) {
      logger.error(`Failed to type into ${selector}:`, error);
      throw error;
    }
  }

  async scroll(direction: 'up' | 'down', amount: number = 300): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized.');
    }

    try {
      const scrollAmount = direction === 'down' ? amount : -amount;
      await this.page.evaluate((scroll) => {
        window.scrollBy(0, scroll);
      }, scrollAmount);
      await this.page.waitForTimeout(300);
    } catch (error) {
      logger.error('Scroll failed:', error);
      throw error;
    }
  }

  async getPageContent(): Promise<string> {
    if (!this.page) {
      throw new Error('Browser not initialized.');
    }

    try {
      const content = await this.page.content();
      return content;
    } catch (error) {
      logger.error('Failed to get page content:', error);
      throw error;
    }
  }

  async waitForTimeout(ms: number): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized.');
    }
    await this.page.waitForTimeout(ms);
  }

  async close(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
      logger.info('Browser closed');
    } catch (error) {
      logger.error('Error closing browser:', error);
      throw error;
    }
  }

  getPage(): Page | null {
    return this.page;
  }
}
