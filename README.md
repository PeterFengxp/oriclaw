# Oriclaw - Voice-Interactive Web Automation Agent

一个通过语音交互控制网页的自动化 Agent，连接云端多模态大模型，通过视觉识别屏幕内容并根据语音指令进行交互。

A voice-interactive web automation agent that connects to cloud-based multimodal AI models, using visual recognition to understand screen content and execute voice commands.

## 🌟 Features

- 🎤 **Voice Command Processing** - Natural language voice commands for web control
- 👁️ **Visual Screen Analysis** - Claude AI analyzes screenshots to understand page context
- 🤖 **Intelligent Action Interpretation** - AI determines the correct browser actions from voice commands
- 🌐 **Browser Automation** - Powered by Playwright for reliable web interaction
- 🔄 **Context-Aware** - Maintains conversation history for better understanding
- 🗣️ **Text-to-Speech** - Agent provides voice feedback (ready for TTS integration)

## 📋 Requirements

- Node.js 18+
- Anthropic API key (for Claude AI)
- Optional: OpenAI API key (for Whisper speech recognition)

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/PeterFengxp/oriclaw.git
cd oriclaw

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### 2. Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Required: Anthropic Claude API Key
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Optional: OpenAI API Key for Whisper
OPENAI_API_KEY=sk-xxxxx

# Browser settings
HEADLESS=false
```

### 3. Build

```bash
npm run build
```

### 4. Run

```bash
# Run in development mode with tsx
npm run dev

# Or run the compiled version
npm start
```

## 💡 Usage

### Interactive Mode

When you start the agent, it will open a browser window and wait for your commands. Type your voice commands in the console:

```
> Navigate to google.com
> Type "artificial intelligence" in the search box
> Click the search button
> Scroll down the page
> Describe what you see on the screen
```

Type `exit` or `quit` to stop the agent.

### Programmatic Usage

You can also use the agent programmatically in your own code:

```typescript
import { VoiceWebAgent } from './agent.js';

const agent = new VoiceWebAgent(
  'your-anthropic-api-key',
  'your-openai-api-key' // optional
);

await agent.initialize(false); // false = visible browser

// Execute commands
await agent.executeCommand('Navigate to github.com');
await agent.executeCommand('Search for "typescript"');

// Access services directly
const { browser, claude, speech } = agent.getServices();
await browser.navigate('https://example.com');
const screenshot = await browser.takeScreenshot();
const analysis = await claude.analyzeScreen(screenshot);

await agent.stop();
```

### Example Demo

Run the included demo:

```bash
npx tsx src/examples/demo.ts
```

## 🏗️ Architecture

```
oriclaw/
├── src/
│   ├── agent.ts                 # Main agent orchestration
│   ├── index.ts                 # Entry point
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── services/
│   │   ├── browser.service.ts  # Browser automation (Playwright)
│   │   ├── speech.service.ts   # Speech recognition/synthesis
│   │   └── claude.service.ts   # Claude AI integration
│   ├── utils/
│   │   ├── config.ts           # Configuration loader
│   │   └── logger.ts           # Logging utility
│   └── examples/
│       └── demo.ts             # Example usage
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔧 Core Components

### VoiceWebAgent
Main orchestrator that coordinates all services:
- Manages the interaction loop
- Coordinates between speech, vision, and browser services
- Executes action sequences

### BrowserService
Handles all browser automation:
- Page navigation
- Element interaction (click, type, scroll)
- Screenshot capture
- DOM access

### ClaudeService
Manages AI interactions:
- Visual screen analysis using Claude's vision capabilities
- Command interpretation in context
- Action planning and generation

### SpeechService
Handles voice I/O:
- Voice command recognition (Whisper API ready)
- Text-to-speech output (ready for integration)
- Console fallback for testing

## 🎯 How It Works

1. **Capture**: Agent takes a screenshot of the current browser state
2. **Analyze**: Claude AI analyzes the screenshot to understand page content and structure
3. **Listen**: Agent receives voice command (currently via console, ready for audio input)
4. **Interpret**: Claude interprets the command in the context of the current screen
5. **Act**: Agent executes the determined browser actions
6. **Repeat**: Process repeats for continuous interaction

## 🔐 Security Notes

- Never commit your `.env` file with API keys
- API keys are stored locally and only used for API calls
- Screenshots are saved locally in `./screenshots/` directory
- No data is shared with third parties except API providers (Anthropic, OpenAI)

## 🛠️ Development

### Build the project
```bash
npm run build
```

### Run in development mode
```bash
npm run dev
```

### Project structure
- TypeScript source in `src/`
- Compiled output in `dist/`
- Screenshots saved in `screenshots/`

## 📝 Supported Commands

The agent can understand natural language commands like:

- **Navigation**: "Navigate to google.com", "Go to github.com"
- **Interaction**: "Click the search button", "Type 'hello' in the input field"
- **Scrolling**: "Scroll down", "Scroll up the page"
- **Information**: "Describe what you see", "What's on this page?"
- **Control**: "Wait 2 seconds", "Exit"

## 🚧 Future Enhancements

- [ ] Real-time audio input via microphone
- [ ] Integration with OpenAI Whisper for production speech recognition
- [ ] Text-to-speech output with OpenAI TTS
- [ ] Support for more complex multi-step workflows
- [ ] Chrome extension for easier deployment
- [ ] Web UI for remote control
- [ ] Support for multiple browser tabs
- [ ] Session recording and replay
- [ ] Custom command macros

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙏 Acknowledgments

- [Anthropic Claude](https://www.anthropic.com/) - Multimodal AI capabilities
- [Playwright](https://playwright.dev/) - Browser automation
- [OpenAI](https://openai.com/) - Speech recognition (Whisper) and TTS

## 📧 Support

For issues and questions, please use the [GitHub Issues](https://github.com/PeterFengxp/oriclaw/issues) page.

---

Made with ❤️ using Claude AI
