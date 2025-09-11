chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ success: false, error: 'No active tab found' });
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'summarizeContent',
        content: request.content,
        title: request.title
      }, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse(response);
        }
      });
    });
    return true;
  }
  
  if (request.action === 'generateQuestions') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ success: false, error: 'No active tab found' });
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'generateQuestions',
        content: request.content,
        title: request.title
      }, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse(response);
        }
      });
    });
    return true;
  }
  
  if (request.action === 'rewriteSummary') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ success: false, error: 'No active tab found' });
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'rewriteSummary',
        summary: request.summary
      }, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse(response);
        }
      });
    });
    return true;
  }
  
  if (request.action === 'enhanceNotes') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ success: false, error: 'No active tab found' });
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'enhanceNotes',
        content: request.content
      }, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse(response);
        }
      });
    });
    return true;
  }
});

console.log('Smart Research Assistant background script loaded');