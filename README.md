<div align="center">

# 🔬 Smart Research Assistant

**AI-powered research in your browser — summarize, question, highlight, and export with full privacy**

![Chrome](https://img.shields.io/badge/Chrome%20Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white) ![AI](https://img.shields.io/badge/AI-Powered-00D4FF?style=flat-square&logo=google&logoColor=white) ![Privacy](https://img.shields.io/badge/100%25%20Local%20AI-Privacy%20First-34A853?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

</div>

<br/>

Smart Research Assistant is a Chrome extension that transforms passive browsing into structured, AI-driven research — entirely on your device. Powered by Chrome's built-in Gemini Nano APIs, every operation runs locally: no external servers, no API keys, no data ever leaves your browser.

## ✨ Features

- **Intelligent Summarization** — Extract key insights from any webpage using Chrome's Summarizer API
- **Research Question Generation** — Automatically surface thoughtful follow-up questions via the Prompt API
- **Smart Content Highlighting** — Visually mark key terms from the AI summary directly on the page
- **Content Rewriting** — Rephrase summaries in different styles using the Rewriter API
- **Research Library & Export** — Save timestamped research notes and export to Markdown or clipboard
- **Keyboard Shortcuts** — Power-user bindings (`Alt+S` summarize, `Alt+Q` questions, `Alt+H` highlights)

## 🎥 Demo

[![Watch Demo](https://img.shields.io/badge/YouTube-Watch%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=CrFsx6nY4WU)

[![Watch the demo](https://img.youtube.com/vi/CrFsx6nY4WU/maxresdefault.jpg)](https://www.youtube.com/watch?v=CrFsx6nY4WU)

## 🛠️ Tech Stack

**Chrome Built-in AI APIs** (Summarizer · Prompt · Rewriter · Writer) · Gemini Nano · Chrome Extension Manifest V3 · Vanilla JavaScript · Chrome Storage API

## 🚀 Getting Started

### Prerequisites

1. **Chrome Canary** or **Chrome Dev** (required for built-in AI APIs)
2. Enroll in the [Chrome Built-in AI Early Preview Program](https://developer.chrome.com/docs/ai/)
3. Enable the following flags in `chrome://flags/`:
   - `#prompt-api-for-gemini-nano`
   - `#summarization-api-for-gemini-nano`
   - `#rewriter-api-for-gemini-nano` *(optional)*
   - `#writer-api-for-gemini-nano` *(optional)*

### Installation

1. Clone or download this repository
2. Navigate to `chrome://extensions/` in Chrome Canary
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the extension folder
5. The 🔬 icon will appear in your Chrome toolbar

### Basic Usage

1. Navigate to any article or webpage
2. Click the Smart Research Assistant icon in your toolbar
3. Hit **Summarize** for AI-generated key insights
4. Hit **Questions** to generate follow-up research questions
5. Hit **Highlight** to mark key terms on the page
6. **Save** or **Export** your findings to Markdown

## 📄 License

MIT — see [LICENSE](LICENSE) for details.
