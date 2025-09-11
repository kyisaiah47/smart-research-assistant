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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const pageData = extractPageContent();
    sendResponse(pageData);
  }
  return true;
});

console.log('Smart Research Assistant content script loaded');