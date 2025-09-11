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
    document.getElementById('saveNoteBtn').addEventListener('click', () => this.handleSaveNote());
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