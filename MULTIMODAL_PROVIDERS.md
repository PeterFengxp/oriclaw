# Multimodal LLM Providers Support

This document explains how to configure and use different multimodal LLM providers with Oriclaw.

## Supported Providers

Oriclaw now supports the following multimodal LLM providers:

1. **Claude** (Anthropic) - Default provider
2. **MiniMax** (MiniMax国内版本)
3. **Kimi** (Moonshot AI - Kimi多模态版本)
4. **DeepSeek** (DeepSeek)

## Configuration

### Environment Variables

Configure your provider by setting environment variables in your `.env` file:

```bash
# Select your LLM provider (options: claude, minimax, kimi, deepseek)
LLM_PROVIDER=claude

# Claude (Anthropic)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# MiniMax (国内版本)
MINIMAX_API_KEY=your_minimax_api_key_here
MINIMAX_GROUP_ID=your_minimax_group_id_here

# Kimi (Moonshot AI)
KIMI_API_KEY=your_kimi_api_key_here

# DeepSeek
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Optional: OpenAI for speech services
OPENAI_API_KEY=your_openai_api_key_here

# Browser settings
HEADLESS=false
```

### Provider-Specific Requirements

#### Claude
- **API Key**: Required
- **Model**: claude-3-5-sonnet-20241022
- **Endpoint**: Anthropic API
- **Features**: Vision, text, JSON output

#### MiniMax (国内版本)
- **API Key**: Required
- **Group ID**: Required (specific to MiniMax)
- **Model**: abab6.5-chat
- **Endpoint**: https://api.minimax.chat/v1
- **Features**: Vision, text, multimodal

#### Kimi (Moonshot AI)
- **API Key**: Required
- **Model**: moonshot-v1-32k
- **Endpoint**: https://api.moonshot.cn/v1
- **Features**: Vision, text, multimodal
- **Context**: 32K tokens

#### DeepSeek
- **API Key**: Required
- **Model**: deepseek-chat
- **Endpoint**: https://api.deepseek.com/v1
- **Features**: Vision, text, multimodal

## Usage Examples

### Using Claude (Default)

```bash
# .env
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### Using MiniMax

```bash
# .env
LLM_PROVIDER=minimax
MINIMAX_API_KEY=your_minimax_key
MINIMAX_GROUP_ID=your_group_id
```

### Using Kimi

```bash
# .env
LLM_PROVIDER=kimi
KIMI_API_KEY=your_kimi_key
```

### Using DeepSeek

```bash
# .env
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_deepseek_key
```

## API Key Acquisition

### Claude (Anthropic)
- Visit: https://console.anthropic.com/
- Sign up and create an API key
- International service

### MiniMax (国内版本)
- Visit: https://www.minimaxi.com/
- 注册并创建API密钥
- 获取Group ID
- 国内服务

### Kimi (Moonshot AI)
- Visit: https://platform.moonshot.cn/
- 注册并创建API密钥
- 国内服务

### DeepSeek
- Visit: https://platform.deepseek.com/
- Sign up and create an API key
- 国内服务

## Architecture

The system uses a provider abstraction layer:

```
VoiceWebAgent
    ├── LLMProviderFactory
    │   ├── ClaudeService (implements ILLMProvider)
    │   ├── MiniMaxService (implements ILLMProvider)
    │   ├── KimiService (implements ILLMProvider)
    │   └── DeepSeekService (implements ILLMProvider)
    ├── BrowserService
    └── SpeechService
```

All providers implement the same `ILLMProvider` interface:
- `analyzeScreen(screenshotPath)`: Analyze screenshots using vision capabilities
- `interpretCommand(voiceCommand, screenContext)`: Convert voice commands to actions
- `chat(message)`: General conversational interface
- `resetConversation()`: Clear conversation history

## Switching Providers

To switch providers, simply change the `LLM_PROVIDER` environment variable:

```bash
# Switch from Claude to Kimi
LLM_PROVIDER=kimi
KIMI_API_KEY=your_kimi_key
```

Restart the application for changes to take effect.

## Troubleshooting

### "API key required" error
- Ensure you've set the correct API key for your selected provider
- For MiniMax, both `MINIMAX_API_KEY` and `MINIMAX_GROUP_ID` are required

### "Unknown provider" error
- Check that `LLM_PROVIDER` is set to one of: `claude`, `minimax`, `kimi`, `deepseek`
- Value is case-sensitive

### API connection errors
- Verify your API key is valid and active
- Check network connectivity
- For domestic providers (MiniMax, Kimi, DeepSeek), ensure you can access their endpoints
- For Claude, ensure international API access is available

## Performance Considerations

Different providers have different characteristics:

| Provider | Speed | Cost | Context | Strengths |
|----------|-------|------|---------|-----------|
| Claude | Fast | Medium | Large | Best vision quality, JSON output |
| MiniMax | Medium | Low | Medium | Domestic access, cost-effective |
| Kimi | Fast | Low | 32K | Large context window |
| DeepSeek | Fast | Low | Medium | Cost-effective, good reasoning |

Choose based on your requirements for speed, cost, and availability.
