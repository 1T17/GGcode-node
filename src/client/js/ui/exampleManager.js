/**
 * Example Manager Module
 * Handles loading and managing example files
 */

import storageManager from '../utils/storageManager.js';

class ExampleManager {
  constructor(apiManager, editorManager) {
    this.apiManager = apiManager;
    this.editorManager = editorManager;
    this.lastOpenedFilename = '';

    // Ensure loadExample is globally available
    this.ensureGlobalFunction();
  }

  /**
   * Show examples modal
   */
  showExamples() {
    if (window.showModal) {
      window.showModal('examplesModal');
    }
    this.loadExamples();
    // Setup examples search after examples are loaded
    setTimeout(() => this.setupExamplesSearch(), 100);
    // Focus search input
    setTimeout(() => {
      const searchInput = document.getElementById('examplesSearchInput');
      if (searchInput) {
        searchInput.focus();
      }
    }, 200);
  }

  /**
   * Load examples list
   */
  async loadExamples() {
    const examplesList = document.getElementById('examplesList');
    if (!examplesList) return;

    try {
      const examples = await this.apiManager.examples.getList();

      if (examples && examples.length > 0) {
        examplesList.innerHTML = examples
          .map(
            (file) => `
                    <div class="example-item" onclick="loadExample('${file.name}')">
                        <div class="example-title">${file.name}</div>
                        <div class="example-description">${file.description || 'Click to load this example'}</div>
                        <div class="example-preview">${file.preview || ''}</div>
                    </div>
                `
          )
          .join('');
      } else {
        examplesList.innerHTML =
          '<p style="color: #cccccc;">Failed to load examples</p>';
      }
    } catch (error) {
      examplesList.innerHTML =
        '<p style="color: #cccccc;">Error loading examples: ' +
        error.message +
        '</p>';
    }
  }

  /**
   * Load specific example
   */
  async loadExample(filename) {
    try {
      const result = await this.apiManager.examples.getContent(filename);

      if (result && result.content) {
        // Set the correct editor based on file type
        if (filename.endsWith('.ggcode')) {
          if (this.editorManager) {
            this.editorManager.setInputValue(result.content);
            this.editorManager.setLastOpenedFilename(filename);
          }
        } else if (filename.endsWith('.gcode')) {
          if (this.editorManager) {
            this.editorManager.setOutputValue(result.content);
          }
        }
        // Remember filename
        this.lastOpenedFilename = filename;
        storageManager.setLastFilename(this.lastOpenedFilename);
        // Direct compilation after file load
        if (window.submitGGcode) {
          window.submitGGcode(new Event('submit'));
        }
        if (window.closeModal) {
          window.closeModal('examplesModal');
        }
      } else {
        alert('Failed to load example: No content available');
      }
    } catch (error) {
      alert('Error loading example: ' + error.message);
    }
  }

  /**
   * Setup examples search
   */
  setupExamplesSearch() {
    // TODO: Implement examples search functionality
    console.log('Examples search setup - TODO');
  }

  /**
   * Fallback loadExample function for direct HTML onclick calls
   * This ensures loadExample is always available globally
   */
  ensureGlobalFunction() {
    if (typeof window !== 'undefined') {
      window.loadExample =
        window.loadExample ||
        ((filename) => {
          if (window.applicationManager) {
            window.applicationManager.getExampleManager().loadExample(filename);
          }
        });
    }
  }

  /**
   * Get last opened filename
   */
  getLastOpenedFilename() {
    return this.lastOpenedFilename;
  }

  /**
   * Set last opened filename
   */
  setLastOpenedFilename(filename) {
    this.lastOpenedFilename = filename;
  }
}

export default ExampleManager;
