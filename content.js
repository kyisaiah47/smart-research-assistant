function extractPageContent() {
  const article = document.querySelector('article') ||
                 document.querySelector('[role="main"]') ||
                 document.querySelector('main') ||
                 document.body;
  
  const clonedArticle = article.cloneNode(true);
  
  const elementsToRemove = clonedArticle.querySelectorAll('script, style, nav, header, footer, .sidebar, .ad, .advertisement, .comments');
  elementsToRemove.forEach(el => el.remove());
  
  let textContent = clonedArticle.textContent || clonedArticle.innerText || '';
  
  textContent = textContent
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
  
  return {
    title: document.title,
    url: window.location.href,
    content: textContent.substring(0, 8000),
    timestamp: new Date().toISOString()
  };
}

class AIService {
  constructor() {
    this.summarizer = null;
    this.promptAPI = null;
  }

  async initializeSummarizer() {
    try {
      if (!window.Summarizer) {
        throw new Error('Summarizer API not available');
      }
      
      const availability = await window.Summarizer.availability();
      if (availability === 'no') {
        throw new Error('Summarizer not available on this device');
      }
      
      if (availability === 'after-download' || availability === 'downloadable') {
        console.log('Summarizer downloading...');
      }
      
      this.summarizer = await window.Summarizer.create({
        type: 'key-points',
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
      if (!window.LanguageModel) {
        throw new Error('LanguageModel API not available');
      }
      
      const availability = await window.LanguageModel.availability();
      if (availability === 'no') {
        throw new Error('LanguageModel not available on this device');
      }
      
      if (availability === 'after-download' || availability === 'downloadable') {
        console.log('LanguageModel downloading...');
      }
      
      this.promptAPI = await window.LanguageModel.create({
        temperature: 0.7,
        topK: 3,
        language: 'en'
      });
      
      return this.promptAPI;
    } catch (error) {
      console.error('Failed to initialize LanguageModel API:', error);
      throw error;
    }
  }

  async summarizeContent(content, title) {
    try {
      if (!this.summarizer) {
        await this.initializeSummarizer();
      }
      
      const textToSummarize = `Title: ${title}\n\nContent: ${content}`;
      const summary = await this.summarizer.summarize(textToSummarize, {
        language: 'en'
      });
      
      return summary;
    } catch (error) {
      console.error('Summarization failed, using demo mode:', error);
      
      // Demo mode fallback
      return this.getDemoSummary(title, content);
    }
  }

  getDemoSummary(title, content) {
    const keyWords = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const uniqueWords = [...new Set(keyWords)].slice(0, 8);
    
    return `📄 Summary of "${title}":

This article covers ${uniqueWords.slice(0, 3).join(', ')} and discusses key concepts including ${uniqueWords.slice(3, 6).join(', ')}. The content explores various aspects of the topic, providing insights into ${uniqueWords.slice(-2).join(' and ')}.

Key points include important information about the subject matter, relevant background context, and practical applications. The article presents a comprehensive overview that would be valuable for further research.

🤖 Demo Mode: Real AI summary will appear when Chrome's built-in AI is available.`;
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
      console.error('Question generation failed, using demo mode:', error);
      
      // Demo mode fallback
      return this.getDemoQuestions(title, content);
    }
  }

  getDemoQuestions(title, content) {
    const keyWords = content.toLowerCase().match(/\b\w{5,}\b/g) || [];
    const uniqueWords = [...new Set(keyWords)].slice(0, 10);
    
    const questions = [
      `What are the key implications of ${uniqueWords[0] || 'this topic'} for future research?`,
      `How does ${uniqueWords[1] || 'this subject'} compare to related concepts in the field?`,
      `What methodology would be most effective for studying ${uniqueWords[2] || 'these phenomena'}?`,
      `What are the potential applications of ${uniqueWords[3] || 'this research'} in real-world scenarios?`,
      `How might recent developments in ${uniqueWords[4] || 'this area'} change our understanding?`
    ];
    
    return questions;
  }
}

const aiService = new AIService();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const pageData = extractPageContent();
    sendResponse(pageData);
    return true;
  }
  
  if (request.action === 'summarizeContent') {
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

console.log('Smart Research Assistant content script loaded');