class AIService {
  constructor() {
    this.summarizer = null;
    this.promptAPI = null;
    this.writer = null;
  }

  async initializeSummarizer() {
    try {
      if (!window.ai || !window.ai.summarizer) {
        throw new Error('AI Summarizer not available');
      }
      
      const capabilities = await window.ai.summarizer.capabilities();
      if (capabilities.available === 'no') {
        throw new Error('AI Summarizer not available on this device');
      }
      
      if (capabilities.available === 'after-download') {
        console.log('AI Summarizer downloading...');
      }
      
      this.summarizer = await window.ai.summarizer.create({
        type: 'tl;dr',
        format: 'markdown',
        length: 'medium'
      });
      
      return this.summarizer;
    } catch (error) {
      console.error('Failed to initialize summarizer:', error);
      throw error;
    }
  }

  async initializePromptAPI() {
    try {
      if (!window.ai || !window.ai.languageModel) {
        throw new Error('AI Language Model not available');
      }
      
      const capabilities = await window.ai.languageModel.capabilities();
      if (capabilities.available === 'no') {
        throw new Error('AI Language Model not available on this device');
      }
      
      if (capabilities.available === 'after-download') {
        console.log('AI Language Model downloading...');
      }
      
      this.promptAPI = await window.ai.languageModel.create({
        temperature: 0.7,
        topK: 3
      });
      
      return this.promptAPI;
    } catch (error) {
      console.error('Failed to initialize Prompt API:', error);
      throw error;
    }
  }

  async summarizeContent(content, title) {
    try {
      if (!this.summarizer) {
        await this.initializeSummarizer();
      }
      
      const textToSummarize = `Title: ${title}\n\nContent: ${content}`;
      const summary = await this.summarizer.summarize(textToSummarize);
      
      return summary;
    } catch (error) {
      console.error('Summarization failed:', error);
      throw new Error(`Summarization failed: ${error.message}`);
    }
  }

  async generateResearchQuestions(content, title) {
    try {
      if (!this.promptAPI) {
        await this.initializePromptAPI();
      }
      
      const prompt = `Based on the following article titled "${title}", generate 5 thoughtful research questions that would help someone dive deeper into this topic. Focus on questions that encourage critical thinking and further exploration.

Article content: ${content.substring(0, 2000)}

Format your response as a numbered list of questions only, without any additional text or explanations.`;

      const response = await this.promptAPI.prompt(prompt);
      
      const questions = response
        .split('\n')
        .filter(line => line.match(/^\d+\./))
        .map(q => q.replace(/^\d+\.\s*/, '').trim())
        .filter(q => q.length > 10);
      
      return questions.slice(0, 5);
    } catch (error) {
      console.error('Question generation failed:', error);
      throw new Error(`Question generation failed: ${error.message}`);
    }
  }

  async cleanup() {
    try {
      if (this.summarizer) {
        this.summarizer.destroy();
        this.summarizer = null;
      }
      if (this.promptAPI) {
        this.promptAPI.destroy();
        this.promptAPI = null;
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

const aiService = new AIService();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    aiService.summarizeContent(request.content, request.title)
      .then(summary => sendResponse({ success: true, summary }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'generateQuestions') {
    aiService.generateResearchQuestions(request.content, request.title)
      .then(questions => sendResponse({ success: true, questions }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

chrome.runtime.onSuspend.addListener(() => {
  aiService.cleanup();
});

console.log('Smart Research Assistant background script loaded');