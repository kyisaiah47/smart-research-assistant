class PopupController {
  constructor() {
    this.currentPageData = null;
    this.currentSummary = null;
    this.currentQuestions = [];
    this.initializeEventListeners();
    this.loadSavedNotes();
  }

  initializeEventListeners() {
    document.getElementById('summarizeBtn').addEventListener('click', () => this.handleSummarize());
    document.getElementById('questionsBtn').addEventListener('click', () => this.handleGenerateQuestions());
    document.getElementById('rewriteBtn').addEventListener('click', () => this.handleRewrite());
    document.getElementById('saveNoteBtn').addEventListener('click', () => this.handleSaveNote());
    
    // Export buttons
    document.getElementById('exportMarkdownBtn').addEventListener('click', () => this.exportMarkdown());
    document.getElementById('highlightBtn').addEventListener('click', () => this.highlightContent());
    document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
    
    // Notes management
    document.getElementById('exportAllBtn').addEventListener('click', () => this.exportAllNotes());
    document.getElementById('clearNotesBtn').addEventListener('click', () => this.clearNotes());
    document.getElementById('helpBtn').addEventListener('click', () => this.toggleHelp());
  }

  async getCurrentPageData() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
          reject(new Error('No active tab found'));
          return;
        }

        chrome.tabs.sendMessage(tabs[0].id, { action: 'extractContent' }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          
          if (!response) {
            reject(new Error('Failed to extract page content'));
            return;
          }
          
          resolve(response);
        });
      });
    });
  }

  showLoading(show = true) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'block' : 'none';
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => btn.disabled = show);
  }

  showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  }

  async handleSummarize() {
    try {
      this.showLoading(true);
      
      if (!this.currentPageData) {
        this.currentPageData = await this.getCurrentPageData();
      }
      
      const response = await this.sendBackgroundMessage('summarize', {
        content: this.currentPageData.content,
        title: this.currentPageData.title
      });
      
      if (response.success) {
        this.currentSummary = response.summary;
        this.displaySummary(response.summary);
      } else {
        this.showError(response.error || 'Summarization failed');
      }
    } catch (error) {
      console.error('Summarization error:', error);
      this.showError(error.message || 'Failed to summarize page');
    } finally {
      this.showLoading(false);
    }
  }

  async handleGenerateQuestions() {
    try {
      this.showLoading(true);
      
      if (!this.currentPageData) {
        this.currentPageData = await this.getCurrentPageData();
      }
      
      const response = await this.sendBackgroundMessage('generateQuestions', {
        content: this.currentPageData.content,
        title: this.currentPageData.title
      });
      
      if (response.success) {
        this.currentQuestions = response.questions;
        this.displayQuestions(response.questions);
      } else {
        this.showError(response.error || 'Question generation failed');
      }
    } catch (error) {
      console.error('Question generation error:', error);
      this.showError(error.message || 'Failed to generate questions');
    } finally {
      this.showLoading(false);
    }
  }

  sendBackgroundMessage(action, data) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action, ...data }, resolve);
    });
  }

  displaySummary(summary) {
    const summarySection = document.getElementById('summarySection');
    const summaryContent = document.getElementById('summaryContent');
    
    summaryContent.textContent = summary;
    summarySection.style.display = 'block';
  }

  displayQuestions(questions) {
    const questionsSection = document.getElementById('questionsSection');
    const questionsList = document.getElementById('questionsList');
    
    questionsList.innerHTML = '';
    
    questions.forEach((question, index) => {
      const li = document.createElement('li');
      li.textContent = question;
      li.addEventListener('click', () => this.handleQuestionClick(question));
      questionsList.appendChild(li);
    });
    
    questionsSection.style.display = 'block';
  }

  handleQuestionClick(question) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(question)}`;
    chrome.tabs.create({ url: searchUrl });
  }

  async handleSaveNote() {
    try {
      if (!this.currentPageData) {
        this.showError('No page data to save');
        return;
      }

      const note = {
        id: Date.now(),
        title: this.currentPageData.title,
        url: this.currentPageData.url,
        summary: this.currentSummary,
        questions: this.currentQuestions,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };

      const { notes = [] } = await chrome.storage.local.get(['notes']);
      notes.unshift(note);
      
      const maxNotes = 10;
      const trimmedNotes = notes.slice(0, maxNotes);
      
      await chrome.storage.local.set({ notes: trimmedNotes });
      
      this.displayNotes(trimmedNotes);
      
      const saveBtn = document.getElementById('saveNoteBtn');
      const originalText = saveBtn.textContent;
      saveBtn.textContent = '✓ Saved!';
      setTimeout(() => {
        saveBtn.textContent = originalText;
      }, 2000);
      
    } catch (error) {
      console.error('Save note error:', error);
      this.showError('Failed to save note');
    }
  }

  async loadSavedNotes() {
    try {
      const { notes = [] } = await chrome.storage.local.get(['notes']);
      this.displayNotes(notes);
    } catch (error) {
      console.error('Load notes error:', error);
    }
  }

  async handleRewrite() {
    if (!this.currentSummary) {
      this.showError('No summary to rewrite. Please summarize a page first.');
      return;
    }

    try {
      this.showLoading(true);
      
      // Visual feedback on rewrite button
      const rewriteBtn = document.getElementById('rewriteBtn');
      const originalText = rewriteBtn.innerHTML;
      rewriteBtn.innerHTML = '<span class="section-icon">⚡</span> Rewriting...';
      rewriteBtn.disabled = true;
      
      const response = await this.sendBackgroundMessage('rewriteSummary', {
        summary: this.currentSummary
      });
      
      if (response.success) {
        this.currentSummary = response.rewritten;
        this.displaySummary(response.rewritten);
        
        // Show success feedback
        rewriteBtn.innerHTML = '<span class="section-icon">✅</span> Rewritten!';
        setTimeout(() => {
          rewriteBtn.innerHTML = originalText;
          rewriteBtn.disabled = false;
        }, 2000);
      } else {
        this.showError(response.error || 'Rewriting failed');
        rewriteBtn.innerHTML = originalText;
        rewriteBtn.disabled = false;
      }
    } catch (error) {
      console.error('Rewrite error:', error);
      this.showError(error.message || 'Failed to rewrite summary');
      
      // Restore button state on error
      const rewriteBtn = document.getElementById('rewriteBtn');
      rewriteBtn.innerHTML = '<span class="section-icon">✨</span> Rewrite';
      rewriteBtn.disabled = false;
    } finally {
      this.showLoading(false);
    }
  }

  exportMarkdown() {
    if (!this.currentSummary && this.currentQuestions.length === 0) {
      this.showError('No content to export');
      return;
    }

    const content = this.generateMarkdownContent();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-${Date.now()}.md`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  generateMarkdownContent() {
    let content = `# Research Summary\n\n`;
    
    if (this.currentPageData) {
      content += `**Source:** [${this.currentPageData.title}](${this.currentPageData.url})\n`;
      content += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
    }
    
    if (this.currentSummary) {
      content += `## Summary\n\n${this.currentSummary}\n\n`;
    }
    
    if (this.currentQuestions.length > 0) {
      content += `## Research Questions\n\n`;
      this.currentQuestions.forEach((q, i) => {
        content += `${i + 1}. ${q}\n`;
      });
    }
    
    return content;
  }

  async copyToClipboard() {
    const content = this.generateMarkdownContent();
    try {
      await navigator.clipboard.writeText(content);
      
      const btn = document.getElementById('copyBtn');
      const originalText = btn.textContent;
      btn.textContent = '✓ Copied!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    } catch (error) {
      this.showError('Failed to copy to clipboard');
    }
  }

  async highlightContent() {
    if (!this.currentPageData) {
      this.showError('No page content available');
      return;
    }

    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'highlightContent',
          summary: this.currentSummary
        });
      });
    } catch (error) {
      this.showError('Failed to highlight content');
    }
  }

  async exportAllNotes() {
    try {
      const { notes = [] } = await chrome.storage.local.get(['notes']);
      
      if (notes.length === 0) {
        this.showError('No notes to export');
        return;
      }

      let content = `# Research Library Export\n\n`;
      content += `**Exported:** ${new Date().toLocaleDateString()}\n`;
      content += `**Total Notes:** ${notes.length}\n\n`;
      
      notes.forEach((note, index) => {
        content += `## ${index + 1}. ${note.title}\n\n`;
        content += `**URL:** [${note.title}](${note.url})\n`;
        content += `**Date:** ${note.date}\n\n`;
        
        if (note.summary) {
          content += `### Summary\n${note.summary}\n\n`;
        }
        
        if (note.questions && note.questions.length > 0) {
          content += `### Research Questions\n`;
          note.questions.forEach((q, i) => {
            content += `${i + 1}. ${q}\n`;
          });
          content += '\n';
        }
        
        content += '---\n\n';
      });

      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `research-library-${Date.now()}.md`;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      this.showError('Failed to export notes');
    }
  }

  async clearNotes() {
    if (confirm('Clear all research notes? This cannot be undone.')) {
      try {
        await chrome.storage.local.set({ notes: [] });
        this.displayNotes([]);
      } catch (error) {
        this.showError('Failed to clear notes');
      }
    }
  }

  toggleHelp() {
    const helpSection = document.getElementById('helpSection');
    const isVisible = helpSection.style.display !== 'none';
    helpSection.style.display = isVisible ? 'none' : 'block';
    
    const btn = document.getElementById('helpBtn');
    btn.textContent = isVisible ? '❓ Help' : '❌ Close';
  }

  displayNotes(notes) {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    
    if (notes.length === 0) {
      notesList.innerHTML = '<div style="color: #666; font-size: 12px; text-align: center; padding: 8px;">No saved notes yet</div>';
      return;
    }
    
    notes.slice(0, 5).forEach(note => {
      const noteDiv = document.createElement('div');
      noteDiv.className = 'note-item';
      noteDiv.innerHTML = `
        <div style="font-weight: 500; margin-bottom: 4px;">${note.title.substring(0, 50)}${note.title.length > 50 ? '...' : ''}</div>
        <div class="note-time">${note.date}</div>
      `;
      noteDiv.addEventListener('click', () => {
        chrome.tabs.create({ url: note.url });
      });
      notesList.appendChild(noteDiv);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});