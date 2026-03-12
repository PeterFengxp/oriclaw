# Quick Start Guide - Oriclaw Voice Web Agent

## 快速入门 / Quick Setup

### 1. 克隆并安装 / Clone and Install
```bash
git clone https://github.com/PeterFengxp/oriclaw.git
cd oriclaw
npm install
npx playwright install chromium
```

### 2. 配置 API 密钥 / Configure API Keys
```bash
# 复制示例配置
cp .env.example .env

# 编辑 .env 文件并添加你的 API 密钥
# 至少需要 ANTHROPIC_API_KEY
```

### 3. 运行 / Run
```bash
# 开发模式（推荐）
npm run dev

# 或者构建后运行
npm run build
npm start
```

## 使用示例 / Usage Examples

### 基本命令 / Basic Commands

启动后，在控制台输入以下命令：

```
# 导航到网站
> Navigate to google.com
> Go to github.com

# 搜索和输入
> Type "machine learning" in the search box
> Enter "hello world" in the input field

# 点击操作
> Click the search button
> Click on the first link

# 页面滚动
> Scroll down
> Scroll down the page
> Scroll up

# 获取信息
> Describe what you see on the screen
> What's on this page?

# 等待
> Wait 2 seconds

# 退出
> exit
> quit
```

### 运行演示 / Run Demo

查看完整的自动化演示：

```bash
npx tsx src/examples/demo.ts
```

## 程序化使用 / Programmatic Usage

在你自己的代码中使用 Agent：

```typescript
import { VoiceWebAgent } from './agent.js';

const agent = new VoiceWebAgent(
  'your-anthropic-api-key',
  'your-openai-api-key' // 可选
);

await agent.initialize(false); // false = 显示浏览器

// 执行命令
await agent.executeCommand('Navigate to example.com');
await agent.executeCommand('Click the login button');

// 访问底层服务
const { browser, claude, speech } = agent.getServices();

// 清理
await agent.stop();
```

## 故障排除 / Troubleshooting

### 常见问题 / Common Issues

1. **缺少 API 密钥 / Missing API Key**
   ```
   Error: ANTHROPIC_API_KEY is required in .env file
   ```
   解决方案：确保 `.env` 文件中有有效的 Anthropic API 密钥

2. **浏览器未安装 / Browser Not Installed**
   ```
   Error: Executable doesn't exist
   ```
   解决方案：运行 `npx playwright install chromium`

3. **TypeScript 构建错误 / Build Errors**
   ```bash
   # 清理并重新构建
   rm -rf dist node_modules
   npm install
   npm run build
   ```

## 系统要求 / System Requirements

- Node.js 18 或更高版本
- 至少 2GB 可用内存
- 互联网连接（用于 API 调用）
- Anthropic API 密钥（必需）
- OpenAI API 密钥（可选，用于 Whisper）

## 环境变量 / Environment Variables

在 `.env` 文件中配置：

```env
# 必需 / Required
ANTHROPIC_API_KEY=sk-ant-xxxxx

# 可选 / Optional
OPENAI_API_KEY=sk-xxxxx  # 用于真实语音识别
HEADLESS=false            # true = 无头浏览器模式
```

## 支持的浏览器操作 / Supported Browser Actions

| 操作类型 | 描述 | 示例命令 |
|---------|------|---------|
| 导航 | 访问 URL | "Navigate to google.com" |
| 点击 | 点击元素 | "Click the search button" |
| 输入 | 输入文本 | "Type hello in the search box" |
| 滚动 | 滚动页面 | "Scroll down" |
| 等待 | 延迟执行 | "Wait 2 seconds" |
| 描述 | 获取页面信息 | "Describe what you see" |

## 提示和技巧 / Tips and Tricks

1. **使用自然语言**：Agent 理解自然语言，不需要精确的命令
2. **具体描述**：提供清晰的元素描述（例如："search button" 而不仅仅是 "button"）
3. **等待加载**：在页面加载后执行操作前添加等待命令
4. **查看截图**：截图保存在 `./screenshots/` 目录中供参考
5. **查看日志**：注意控制台日志以了解 Agent 的操作

## 下一步 / Next Steps

1. 尝试 `src/examples/demo.ts` 中的示例
2. 阅读 `README.md` 了解详细文档
3. 查看 `IMPLEMENTATION.md` 了解技术细节
4. 根据需要修改和扩展代码

## 获取帮助 / Get Help

- 文档：README.md
- 问题：https://github.com/PeterFengxp/oriclaw/issues
- 示例：src/examples/demo.ts

---

祝使用愉快！/ Enjoy using Oriclaw!
