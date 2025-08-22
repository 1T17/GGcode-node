/**
 * StorageManager - Centralized localStorage operations
 * Handles all client-side storage with consistent error handling and defaults
 */

class StorageManager {
  constructor() {
    this.STORAGE_KEYS = {
      INPUT_CONTENT: 'ggcode_input_content',
      OUTPUT_CONTENT: 'ggcode_output_content',
      LAST_FILENAME: 'ggcode_last_filename',
      AUTO_COMPILE: 'ggcode_auto_compile',
      SELECTED_LANGUAGE: 'ggcode_selected_language',
    };

    this.DEFAULTS = {
      INPUT_CONTENT: '',
      OUTPUT_CONTENT: '',
      LAST_FILENAME: '',
      AUTO_COMPILE: false,
      SELECTED_LANGUAGE: 'en',
    };
  }

  /**
   * Get input content from storage
   * @returns {string} Input content or default empty string
   */
  getInputContent() {
    try {
      return (
        localStorage.getItem(this.STORAGE_KEYS.INPUT_CONTENT) ||
        this.DEFAULTS.INPUT_CONTENT
      );
    } catch (error) {
      console.warn('Failed to retrieve input content from storage:', error);
      return this.DEFAULTS.INPUT_CONTENT;
    }
  }

  /**
   * Save input content to storage
   * @param {string} content - Content to save
   */
  setInputContent(content) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.INPUT_CONTENT, content);
    } catch (error) {
      console.warn('Failed to save input content to storage:', error);
    }
  }

  /**
   * Get output content from storage
   * @returns {string} Output content or default empty string
   */
  getOutputContent() {
    try {
      return (
        localStorage.getItem(this.STORAGE_KEYS.OUTPUT_CONTENT) ||
        this.DEFAULTS.OUTPUT_CONTENT
      );
    } catch (error) {
      console.warn('Failed to retrieve output content from storage:', error);
      return this.DEFAULTS.OUTPUT_CONTENT;
    }
  }

  /**
   * Save output content to storage
   * @param {string} content - Content to save
   */
  setOutputContent(content) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.OUTPUT_CONTENT, content);
    } catch (error) {
      console.warn('Failed to save output content to storage:', error);
    }
  }

  /**
   * Get last opened filename from storage
   * @returns {string} Last filename or default empty string
   */
  getLastFilename() {
    try {
      return (
        localStorage.getItem(this.STORAGE_KEYS.LAST_FILENAME) ||
        this.DEFAULTS.LAST_FILENAME
      );
    } catch (error) {
      console.warn('Failed to retrieve last filename from storage:', error);
      return this.DEFAULTS.LAST_FILENAME;
    }
  }

  /**
   * Save last opened filename to storage
   * @param {string} filename - Filename to save
   */
  setLastFilename(filename) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.LAST_FILENAME, filename);
    } catch (error) {
      console.warn('Failed to save last filename to storage:', error);
    }
  }

  /**
   * Get auto-compile state from storage
   * @returns {boolean} Auto-compile state
   */
  getAutoCompileState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.AUTO_COMPILE);
      return stored !== null ? JSON.parse(stored) : this.DEFAULTS.AUTO_COMPILE;
    } catch (error) {
      console.warn(
        'Failed to retrieve auto-compile state from storage:',
        error
      );
      return this.DEFAULTS.AUTO_COMPILE;
    }
  }

  /**
   * Save auto-compile state to storage
   * @param {boolean} enabled - Auto-compile enabled state
   */
  setAutoCompileState(enabled) {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.AUTO_COMPILE,
        JSON.stringify(enabled)
      );
    } catch (error) {
      console.warn('Failed to save auto-compile state to storage:', error);
    }
  }

  /**
   * Get selected language from storage
   * @returns {string} Selected language code
   */
  getSelectedLanguage() {
    try {
      return (
        localStorage.getItem(this.STORAGE_KEYS.SELECTED_LANGUAGE) ||
        this.DEFAULTS.SELECTED_LANGUAGE
      );
    } catch (error) {
      console.warn('Failed to retrieve selected language from storage:', error);
      return this.DEFAULTS.SELECTED_LANGUAGE;
    }
  }

  /**
   * Save selected language to storage
   * @param {string} language - Language code to save
   */
  setSelectedLanguage(language) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SELECTED_LANGUAGE, language);
    } catch (error) {
      console.warn('Failed to save selected language to storage:', error);
    }
  }

  /**
   * Clear all stored data
   */
  clearAll() {
    try {
      Object.values(this.STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      console.log('All stored data cleared successfully');
    } catch (error) {
      console.warn('Failed to clear stored data:', error);
    }
  }

  /**
   * Get all stored data as an object
   * @returns {Object} All stored data
   */
  getAllData() {
    try {
      return {
        inputContent: this.getInputContent(),
        outputContent: this.getOutputContent(),
        lastFilename: this.getLastFilename(),
        autoCompile: this.getAutoCompileState(),
        selectedLanguage: this.getSelectedLanguage(),
      };
    } catch (error) {
      console.warn('Failed to retrieve all stored data:', error);
      return { ...this.DEFAULTS };
    }
  }

  /**
   * Save all data from an object
   * @param {Object} data - Data object to save
   */
  setAllData(data = {}) {
    try {
      if (data.inputContent !== undefined) {
        this.setInputContent(data.inputContent);
      }
      if (data.outputContent !== undefined) {
        this.setOutputContent(data.outputContent);
      }
      if (data.lastFilename !== undefined) {
        this.setLastFilename(data.lastFilename);
      }
      if (data.autoCompile !== undefined) {
        this.setAutoCompileState(data.autoCompile);
      }
      if (data.selectedLanguage !== undefined) {
        this.setSelectedLanguage(data.selectedLanguage);
      }
    } catch (error) {
      console.warn('Failed to save all data to storage:', error);
    }
  }
}

// Create and export singleton instance
const storageManager = new StorageManager();
export default storageManager;
