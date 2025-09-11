# 🧠 Smart Research Assistant

**An intelligent Chrome extension that enhances your research workflow using Google Chrome's built-in AI APIs.**

## 🚀 Features

### Core Functionality
- **🔍 Intelligent Page Summarization**: Automatically extract key insights from any web page using Chrome's Summarizer API
- **❓ Research Question Generation**: Generate thoughtful follow-up questions to deepen your research using the Prompt API
- **📝 Research Notes**: Save and organize your research findings with timestamps
- **🔗 Quick Search Integration**: Click generated questions to search Google instantly
- **🔒 Privacy-First**: All AI processing happens locally on your device

### Key Benefits
- **⚙️ Cost-Free**: No API keys or server costs required
- **🔒 Complete Privacy**: Your data never leaves your device
- **⚡ Offline Capable**: Works without internet connection once loaded
- **🎯 Context-Aware**: Understands page content and generates relevant insights

## 📊 Chrome Built-in AI APIs Used

1. **Summarizer API**: Generates concise summaries of web page content
2. **Prompt API (Language Model)**: Creates relevant research questions based on content
3. **Storage API**: Saves research notes locally

## 🛠 Installation

### For Development/Testing

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. Make sure you have Chrome Built-in AI enabled:
   - Join the [Chrome Built-in AI Early Preview Program](https://docs.google.com/forms/d/e/1FAIpQLSfZXeiwj9KO9jMctffHPym88ln12xNWCrVkMY_u06WfSTulQg/viewform)
   - Enable the necessary flags in `chrome://flags/`

### Icon Setup
Open `icons/create-icons.html` in your browser and download the generated icon files to the `icons/` directory.

## 🎯 How to Use

1. **Navigate** to any article or webpage you want to research
2. **Click** the Smart Research Assistant icon in your Chrome toolbar
3. **Summarize**: Click "Summarize Page" to get key insights
4. **Explore**: Click "Generate Questions" to get research questions
5. **Save**: Click "Save Current Research" to store your findings
6. **Follow Up**: Click any generated question to search Google

## 🏆 Hackathon Submission

This extension was built for the **Google Chrome Built-in AI Challenge 2025**.

### Problem Solved
Research workflows are often fragmented and inefficient. Users typically:
- Read content without extracting key insights
- Miss important follow-up questions
- Lose track of their research progress
- Rely on external AI services that compromise privacy

### Solution
Smart Research Assistant streamlines research by:
- Automatically extracting key information from any webpage
- Suggesting relevant follow-up questions
- Maintaining a research history
- Operating completely offline and privately

### Target Prize Category
**Most Helpful - Chrome Extension** ($14,000)

This extension meaningfully improves the common research workflow by making it more systematic, thorough, and privacy-conscious.

## 🛡 Privacy & Security

- **Local Processing**: All AI operations run locally using Chrome's built-in models
- **No Data Collection**: No user data is collected or transmitted
- **Offline Capable**: Works without internet connection
- **Open Source**: Full transparency with open source code

## 🧪 Technical Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Content       │    │   Background     │    │   Popup UI      │
│   Script        │    │   Service        │    │                 │
│                 │    │                  │    │                 │
│ • Extract page  │◄──►│ • AI API calls   │◄──►│ • User controls │
│   content       │    │ • Summarizer     │    │ • Display       │
│ • Clean text    │    │ • Prompt API     │    │   results       │
│                 │    │ • Error handling │    │ • Save notes    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Chrome APIs   │
                    │                 │
                    │ • Summarizer    │
                    │ • Language Model│
                    │ • Storage       │
                    └─────────────────┘
```

## 🔧 Development

### Prerequisites
- Chrome Canary or Chrome Dev with AI APIs enabled
- Access to Chrome Built-in AI Early Preview Program

### File Structure
```
smart-research-assistant/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI interface
├── popup.js              # UI logic and event handling
├── content.js            # Page content extraction
├── background.js         # AI API integration
├── icons/                # Extension icons
│   └── create-icons.html # Icon generation utility
└── README.md             # Documentation
```

### Testing
1. Load the extension in Chrome
2. Visit a content-rich webpage (news articles work great)
3. Click the extension icon
4. Test summarization and question generation features
5. Verify notes saving and retrieval

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

This is a hackathon project, but feedback and suggestions are welcome! Please open issues for bugs or feature requests.

---

**Built for Google Chrome Built-in AI Challenge 2025** 🚀