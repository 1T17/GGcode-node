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
      AI_AUTO_APPROVE: 'aiAutoApprove',
      AI_MODE: 'aiMode',
      AI_CHAT_MESSAGES: 'aiChatMessages',
      ANNOTATION_TOGGLE: 'ggcode_annotation_toggle',
      SELECTED_TEAM: 'ggcode_selected_team',
      SELECTED_THEME: 'ggcode_theme',
      EDITOR_BACKGROUND: 'ggcode_editor_background',
      OUTPUT_BACKGROUND: 'ggcode_output_background',
    };

    this.DEFAULTS = {
      INPUT_CONTENT: '',
      OUTPUT_CONTENT: '',
      LAST_FILENAME: '',
      AUTO_COMPILE: false,
      SELECTED_LANGUAGE: 'en',
      AI_AUTO_APPROVE: false,
      AI_MODE: 'assistant',
      AI_CHAT_MESSAGES: [],
      ANNOTATION_TOGGLE: true, // Default to expanded (true)
      SELECTED_TEAM: 'default',
      SELECTED_THEME: null, // No direct theme preference by default
      EDITOR_BACKGROUND: 'none', // Default editor background
      OUTPUT_BACKGROUND: 'none', // Default output background
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
      console.warn('Failed to save output content to storage:');
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
   * Get selected team from storage
   * @returns {string} Selected team name
   */
  getSelectedTeam() {
    try {
      return (
        localStorage.getItem(this.STORAGE_KEYS.SELECTED_TEAM) ||
        this.DEFAULTS.SELECTED_TEAM
      );
    } catch (error) {
      console.warn('Failed to retrieve selected team from storage:', error);
      return this.DEFAULTS.SELECTED_TEAM;
    }
  }

  /**
   * Save selected team to storage
   * @param {string} team - Team name to save
   */
  setSelectedTeam(team) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SELECTED_TEAM, team);
    } catch (error) {
      console.warn('Failed to save selected team to storage:', error);
    }
  }

  /**
   * Get selected theme from storage
   * @returns {string} Selected theme name
   */
  getSelectedTheme() {
    try {
      return (
        localStorage.getItem(this.STORAGE_KEYS.SELECTED_THEME) ||
        this.DEFAULTS.SELECTED_THEME
      );
    } catch (error) {
      console.warn('Failed to retrieve selected theme from storage:', error);
      return this.DEFAULTS.SELECTED_THEME;
    }
  }

  /**
   * Save selected theme to storage
   * @param {string} theme - Theme name to save
   */
  setSelectedTheme(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SELECTED_THEME, theme);
    } catch (error) {
      console.warn('Failed to save selected theme to storage:', error);
    }
  }

  /**
   * Get editor background setting
   * @returns {string} Editor background class name or default 'none'
   */
  getEditorBackground() {
    try {
      return (
        localStorage.getItem(this.STORAGE_KEYS.EDITOR_BACKGROUND) ||
        this.DEFAULTS.EDITOR_BACKGROUND
      );
    } catch (error) {
      console.warn('Failed to retrieve editor background setting:', error);
      return this.DEFAULTS.EDITOR_BACKGROUND;
    }
  }

  /**
   * Set editor background setting
   * @param {string} background - Background class name ('none', 'bg-space', etc.)
   */
  setEditorBackground(background = 'none') {
    try {
      localStorage.setItem(this.STORAGE_KEYS.EDITOR_BACKGROUND, background);
    } catch (error) {
      console.warn('Failed to save editor background setting:', error);
    }
  }

  /**
   * Get output background setting
   * @returns {string} Output background class name or default 'none'
   */
  getOutputBackground() {
    try {
      return (
        localStorage.getItem(this.STORAGE_KEYS.OUTPUT_BACKGROUND) ||
        this.DEFAULTS.OUTPUT_BACKGROUND
      );
    } catch (error) {
      console.warn('Failed to retrieve output background setting:', error);
      return this.DEFAULTS.OUTPUT_BACKGROUND;
    }
  }

  /**
   * Set output background setting
   * @param {string} background - Background class name ('none', 'bg-space', etc.)
   */
  setOutputBackground(background = 'none') {
    try {
      localStorage.setItem(this.STORAGE_KEYS.OUTPUT_BACKGROUND, background);
    } catch (error) {
      console.warn('Failed to save output background setting:', error);
    }
  }

  /**
   * Get AI auto-approve setting
   * @returns {boolean} AI auto-approve state
   */
  getAiAutoApprove() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.AI_AUTO_APPROVE);
      return stored !== null
        ? JSON.parse(stored)
        : this.DEFAULTS.AI_AUTO_APPROVE;
    } catch (error) {
      console.warn('Failed to retrieve AI auto-approve from storage:', error);
      return this.DEFAULTS.AI_AUTO_APPROVE;
    }
  }

  /**
   * Save AI auto-approve setting
   * @param {boolean} enabled - AI auto-approve enabled state
   */
  setAiAutoApprove(enabled) {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.AI_AUTO_APPROVE,
        JSON.stringify(enabled)
      );
    } catch (error) {
      console.warn('Failed to save AI auto-approve to storage:', error);
    }
  }

  /**
   * Get AI mode
   * @returns {string} AI mode (assistant, editor, optimizer, teacher)
   */
  getAiMode() {
    try {
      return (
        localStorage.getItem(this.STORAGE_KEYS.AI_MODE) || this.DEFAULTS.AI_MODE
      );
    } catch (error) {
      console.warn('Failed to retrieve AI mode from storage:', error);
      return this.DEFAULTS.AI_MODE;
    }
  }

  /**
   * Save AI mode
   * @param {string} mode - AI mode to save
   */
  setAiMode(mode) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.AI_MODE, mode);
    } catch (error) {
      console.warn('Failed to save AI mode to storage:', error);
    }
  }

  /**
   * Get annotation toggle state from storage
   * @returns {boolean} Annotation toggle state (true = expanded, false = collapsed)
   */
  getAnnotationToggleState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.ANNOTATION_TOGGLE);
      return stored !== null
        ? JSON.parse(stored)
        : this.DEFAULTS.ANNOTATION_TOGGLE;
    } catch (error) {
      console.warn(
        'Failed to retrieve annotation toggle state from storage:',
        error
      );
      return this.DEFAULTS.ANNOTATION_TOGGLE;
    }
  }

  /**
   * Save annotation toggle state to storage
   * @param {boolean} expanded - Annotation toggle state (true = expanded, false = collapsed)
   */
  setAnnotationToggleState(expanded) {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.ANNOTATION_TOGGLE,
        JSON.stringify(expanded)
      );
    } catch (error) {
      console.warn('Failed to save annotation toggle state to storage:', error);
    }
  }

  /**
   * Get AI chat messages
   * @returns {Array} Array of AI chat messages
   */
  getAiChatMessages() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.AI_CHAT_MESSAGES);
      return stored !== null
        ? JSON.parse(stored)
        : this.DEFAULTS.AI_CHAT_MESSAGES;
    } catch (error) {
      console.warn('Failed to retrieve AI chat messages from storage:', error);
      return this.DEFAULTS.AI_CHAT_MESSAGES;
    }
  }

  /**
   * Save AI chat messages
   * @param {Array} messages - Array of messages to save
   */
  setAiChatMessages(messages) {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.AI_CHAT_MESSAGES,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.warn('Failed to save AI chat messages to storage:', error);
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
        aiAutoApprove: this.getAiAutoApprove(),
        aiMode: this.getAiMode(),
        aiChatMessages: this.getAiChatMessages(),
        annotationToggle: this.getAnnotationToggleState(),
        selectedTeam: this.getSelectedTeam(),
        selectedTheme: this.getSelectedTheme(),
        editorBackground: this.getEditorBackground(),
        outputBackground: this.getOutputBackground(),
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
      if (data.aiAutoApprove !== undefined) {
        this.setAiAutoApprove(data.aiAutoApprove);
      }
      if (data.aiMode !== undefined) {
        this.setAiMode(data.aiMode);
      }
      if (data.aiChatMessages !== undefined) {
        this.setAiChatMessages(data.aiChatMessages);
      }
      if (data.annotationToggle !== undefined) {
        this.setAnnotationToggleState(data.annotationToggle);
      }
      if (data.selectedTeam !== undefined) {
        this.setSelectedTeam(data.selectedTeam);
      }
      if (data.selectedTheme !== undefined) {
        this.setSelectedTheme(data.selectedTheme);
      }
      if (data.editorBackground !== undefined) {
        this.setEditorBackground(data.editorBackground);
      }
      if (data.outputBackground !== undefined) {
        this.setOutputBackground(data.outputBackground);
      }
    } catch (error) {
      console.warn('Failed to save all data to storage:', error);
    }
  }
}

// Create and export singleton instance
const storageManager = new StorageManager();
export default storageManager;
