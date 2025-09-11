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
    this.writer = null;
    this.rewriter = null;
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

  async initializeWriter() {
    try {
      if (!window.Writer) {
        throw new Error('Writer API not available');
      }
      
      const availability = await window.Writer.availability();
      if (availability === 'no') {
        throw new Error('Writer not available on this device');
      }
      
      if (availability === 'after-download' || availability === 'downloadable') {
        console.log('Writer downloading...');
      }
      
      this.writer = await window.Writer.create({
        tone: 'formal',
        format: 'markdown',
        length: 'medium'
      });
      
      return this.writer;
    } catch (error) {
      console.error('Failed to initialize Writer API:', error);
      throw error;
    }
  }

  async initializeRewriter() {
    try {
      if (!window.Rewriter) {
        throw new Error('Rewriter API not available');
      }
      
      const availability = await window.Rewriter.availability();
      if (availability === 'no') {
        throw new Error('Rewriter not available on this device');
      }
      
      if (availability === 'after-download' || availability === 'downloadable') {
        console.log('Rewriter downloading...');
      }
      
      this.rewriter = await window.Rewriter.create({
        tone: 'more-casual',
        format: 'markdown',
        length: 'shorter'
      });
      
      return this.rewriter;
    } catch (error) {
      console.error('Failed to initialize Rewriter API:', error);
      throw error;
    }
  }

  async enhanceNotes(content) {
    try {
      if (!this.writer) {
        await this.initializeWriter();
      }
      
      const prompt = `Enhance and format these research notes into a well-structured format with clear sections and bullet points: ${content}`;
      const enhanced = await this.writer.write(prompt);
      
      return enhanced;
    } catch (error) {
      console.error('Note enhancement failed:', error);
      return content;
    }
  }

  async rewriteSummary(summary) {
    try {
      if (!this.rewriter) {
        await this.initializeRewriter();
      }
      
      const rewritten = await this.rewriter.rewrite(summary);
      return rewritten;
    } catch (error) {
      console.error('Summary rewriting failed:', error);
      
      // Enhanced demo mode for rewriting
      return this.getDemoRewrite(summary);
    }
  }

  getDemoRewrite(originalSummary) {
    // Simple demo rewrite that makes it more casual and shorter
    let rewritten = originalSummary
      .replace(/\* /g, '• ')
      .replace(/This article/gi, 'This page')
      .replace(/encompasses/gi, 'covers')
      .replace(/significant/gi, 'major')
      .replace(/various aspects/gi, 'different parts')
      .replace(/comprehensive/gi, 'complete')
      .replace(/furthermore/gi, 'also')
      .replace(/additionally/gi, 'plus')
      .replace(/however/gi, 'but')
      .replace(/therefore/gi, 'so');
    
    // Add a demo indicator
    rewritten += '\n\n🔄 Demo Mode: Real rewriting will work when Chrome\'s Rewriter API is available.';
    
    return rewritten;
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
  
  if (request.action === 'rewriteSummary') {
    aiService.rewriteSummary(request.summary)
      .then(rewritten => sendResponse({ success: true, rewritten }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'enhanceNotes') {
    aiService.enhanceNotes(request.content)
      .then(enhanced => sendResponse({ success: true, enhanced }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'highlightContent') {
    highlightImportantContent(request.summary);
    sendResponse({ success: true });
    return true;
  }
});

// Content highlighting functionality
function highlightImportantContent(summary) {
  // Remove existing highlights
  removeExistingHighlights();
  
  // Extract key terms from summary
  const keyTerms = extractKeyTerms(summary);
  
  // Highlight terms in the page
  highlightTermsInPage(keyTerms);
  
  // Show notification
  showHighlightNotification(keyTerms.length);
}

function removeExistingHighlights() {
  const existingHighlights = document.querySelectorAll('.smart-research-highlight');
  existingHighlights.forEach(highlight => {
    const parent = highlight.parentNode;
    parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    parent.normalize();
  });
}

function extractKeyTerms(summary) {
  // Simple key term extraction - could be enhanced with NLP
  const terms = summary.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(term => term.length > 4)
    .filter(term => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'will', 'would', 'could', 'should'].includes(term));
  
  // Get unique terms, limit to top 10
  return [...new Set(terms)].slice(0, 10);
}

function highlightTermsInPage(terms) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip script and style nodes
        const parent = node.parentNode;
        if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  textNodes.forEach(textNode => {
    let text = textNode.textContent;
    let hasHighlight = false;
    
    terms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(text)) {
        text = text.replace(regex, `<span class="smart-research-highlight" style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 1px 3px; border-radius: 3px; font-weight: 500;">${term}</span>`);
        hasHighlight = true;
      }
    });
    
    if (hasHighlight) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = text;
      const parent = textNode.parentNode;
      while (wrapper.firstChild) {
        parent.insertBefore(wrapper.firstChild, textNode);
      }
      parent.removeChild(textNode);
    }
  });
}

function showHighlightNotification(count) {
  // Create notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = `🎯 Highlighted ${count} key terms from your summary`;
  
  // Add animation keyframes
  if (!document.querySelector('#smart-research-styles')) {
    const style = document.createElement('style');
    style.id = 'smart-research-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
  // Alt + S = Summarize
  if (event.altKey && event.key === 's') {
    event.preventDefault();
    chrome.runtime.sendMessage({ action: 'keyboard-shortcut', shortcut: 'summarize' });
  }
  
  // Alt + Q = Questions
  if (event.altKey && event.key === 'q') {
    event.preventDefault();
    chrome.runtime.sendMessage({ action: 'keyboard-shortcut', shortcut: 'questions' });
  }
  
  // Alt + H = Highlight
  if (event.altKey && event.key === 'h') {
    event.preventDefault();
    removeExistingHighlights();
  }
});

console.log('Smart Research Assistant content script loaded');