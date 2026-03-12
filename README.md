# Oriclaw - Voice-Interactive Web Automation Agent

一个通过语音交互控制网页的自动化 Agent，连接云端多模态大模型，通过视觉识别屏幕内容并根据语音指令进行交互。

A voice-interactive web automation agent that connects to cloud-based multimodal AI models, using visual recognition to understand screen content and execute voice commands.

## 🌟 Features

- 🎤 **Voice Command Processing** - Natural language voice commands for web control
- 👁️ **Visual Screen Analysis** - Multimodal AI analyzes screenshots to understand page context
- 🤖 **Intelligent Action Interpretation** - AI determines the correct browser actions from voice commands
- 🌐 **Browser Automation** - Powered by Playwright for reliable web interaction
- 🔄 **Context-Aware** - Maintains conversation history for better understanding
- 🗣️ **Text-to-Speech** - Agent provides voice feedback (ready for TTS integration)
- 🔌 **Multiple AI Providers** - Support for Claude, MiniMax, Kimi, and DeepSeek

## 📋 Requirements

- Node.js 18+
- At least one of the following API keys:
  - Anthropic API key (for Claude AI)
  - MiniMax API key + Group ID (for MiniMax 国内版本)
  - Kimi API key (for Kimi 多模态版本)
  - DeepSeek API key (for DeepSeek)
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
# Select your LLM provider (options: claude, minimax, kimi, deepseek)
LLM_PROVIDER=claude

# Required for Claude: Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Required for MiniMax: API Key + Group ID
MINIMAX_API_KEY=your_minimax_api_key
MINIMAX_GROUP_ID=your_group_id

# Required for Kimi: API Key
KIMI_API_KEY=your_kimi_api_key

# Required for DeepSeek: API Key
DEEPSEEK_API_KEY=your_deepseek_api_key

# Optional: OpenAI API Key for Whisper
OPENAI_API_KEY=sk-xxxxx

# Browser settings
HEADLESS=false
```

> 📘 **See [MULTIMODAL_PROVIDERS.md](./MULTIMODAL_PROVIDERS.md)** for detailed configuration guide for each provider.

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
import { LLMProviderConfig } from './services/llm-provider.factory.js';

// Configure your LLM provider
const llmConfig: LLMProviderConfig = {
  provider: 'claude', // or 'minimax', 'kimi', 'deepseek'
  apiKey: 'your-api-key',
  groupId: 'your-group-id' // only required for MiniMax
};

const agent = new VoiceWebAgent(
  llmConfig,
  'your-openai-api-key' // optional
);

await agent.initialize(false); // false = visible browser

// Execute commands
await agent.executeCommand('Navigate to github.com');
await agent.executeCommand('Search for "typescript"');

// Access services directly
const { browser, llm, speech } = agent.getServices();
await browser.navigate('https://example.com');
const screenshot = await browser.takeScreenshot();
const analysis = await llm.analyzeScreen(screenshot);

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
│   │   ├── browser.service.ts          # Browser automation (Playwright)
│   │   ├── speech.service.ts           # Speech recognition/synthesis
│   │   ├── llm-provider.interface.ts   # LLM provider interface
│   │   ├── llm-provider.factory.ts     # Provider factory
│   │   ├── claude.service.ts           # Claude AI integration
│   │   ├── minimax.service.ts          # MiniMax integration
│   │   ├── kimi.service.ts             # Kimi integration
│   │   └── deepseek.service.ts         # DeepSeek integration
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

### LLMProviderFactory
Creates LLM provider instances based on configuration:
- Supports multiple providers (Claude, MiniMax, Kimi, DeepSeek)
- Validates provider configuration
- Returns provider implementing ILLMProvider interface

### LLM Services (Claude/MiniMax/Kimi/DeepSeek)
Manages AI interactions:
- Visual screen analysis using multimodal capabilities
- Command interpretation in context
- Action planning and generation
- All implement the same ILLMProvider interface

### SpeechService
Handles voice I/O:
- Voice command recognition (Whisper API ready)
- Text-to-speech output (ready for integration)
- Console fallback for testing

## 🎯 How It Works

1. **Capture**: Agent takes a screenshot of the current browser state
2. **Analyze**: Multimodal AI analyzes the screenshot to understand page content and structure
3. **Listen**: Agent receives voice command (currently via console, ready for audio input)
4. **Interpret**: AI interprets the command in the context of the current screen
5. **Act**: Agent executes the determined browser actions
6. **Repeat**: Process repeats for continuous interaction

## 🔌 Multimodal LLM Providers

Oriclaw supports multiple multimodal AI providers:

### Supported Providers

| Provider | Model | Region | Features |
|----------|-------|--------|----------|
| **Claude** | claude-3-5-sonnet | International | Best vision quality, JSON output |
| **MiniMax** | abab6.5-chat | 国内 | Cost-effective, domestic access |
| **Kimi** | moonshot-v1-32k | 国内 | Large context (32K), fast |
| **DeepSeek** | deepseek-chat | 国内 | Good reasoning, cost-effective |

### Switching Providers

Simply change the `LLM_PROVIDER` environment variable in your `.env` file:

```bash
# Use Claude (default)
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Use MiniMax
LLM_PROVIDER=minimax
MINIMAX_API_KEY=your_key
MINIMAX_GROUP_ID=your_id

# Use Kimi
LLM_PROVIDER=kimi
KIMI_API_KEY=your_key

# Use DeepSeek
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_key
```

For detailed configuration instructions, see [MULTIMODAL_PROVIDERS.md](./MULTIMODAL_PROVIDERS.md).

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

- [Anthropic Claude](https://www.anthropic.com/) - Claude multimodal AI
- [MiniMax](https://www.minimaxi.com/) - MiniMax 国内多模态大模型
- [Moonshot AI](https://platform.moonshot.cn/) - Kimi 多模态大模型
- [DeepSeek](https://platform.deepseek.com/) - DeepSeek AI
- [Playwright](https://playwright.dev/) - Browser automation
- [OpenAI](https://openai.com/) - Speech recognition (Whisper) and TTS

## 📧 Support

For issues and questions, please use the [GitHub Issues](https://github.com/PeterFengxp/oriclaw/issues) page.

---

Made with ❤️ using Claude AI
