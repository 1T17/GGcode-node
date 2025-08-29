/**
 * Editor Settings Manager
 * Manages Monaco editor settings and preferences
 */

import themeManager from './themes.js';
import storageManager from '../utils/storageManager.js';

class EditorSettingsManager {
  constructor() {
    this.settings = {};
    this.modalElement = null;
    this.contentElement = null;
    this.formElement = null;
    this.onSettingsChange = null;
    this.editorInstance = null;

    // Default settings
    this.defaultSettings = {
      theme: 'ggcode-dark',
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      wordWrap: 'off',
      minimap: 'enabled',
      lineNumbers: 'on',
      renderWhitespace: 'none',
      renderIndentGuides: true,
      bracketMatching: true,
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoClosingDelete: 'always',
      autoClosingOvertype: 'always',
      surroudWithBrackets: true,
      autoSave: false,
      autoSaveDelay: 30000,
      tabSize: 2,
      insertSpaces: true,
      cursorBlinking: 'blink',
      cursorStyle: 'line',
      scrollBeyondLastLine: true,
      smoothScrolling: true,
      mouseWheelZoom: true,
      contextmenu: true,
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
      wordBasedSuggestions: true,
      parameterHints: true,
      formatOnType: false,
      formatOnPaste: false,
      renderLineHighlight: 'line',
      glyphMargin: false,
      folding: true,
      showFoldingControls: 'mouseover',
      dragAndDrop: true,
      links: true,
      colorDecorators: true,
      lightbulb: { enabled: true },
      codeLens: false,
      inlayHints: { enabled: 'offUnlessPressed' },
      hideBrowserValidation: true,
    };

    this.loadSettings();
  }

  /**
   * Initialize the settings manager
   * @param {Object} options - Configuration options
   * @param {string} options.modalId - ID of the modal element
   * @param {string} options.contentId - ID of the content container
   * @param {Function} options.onSettingsChange - Callback for settings changes
   */
  initialize(options = {}) {
    // Prevent multiple initializations
    if (this._initialized) {
      return true;
    }

    const {
      modalId = 'settingsModal',
      contentId = 'settingsContent',
      onSettingsChange = null,
    } = options;

    this.modalElement = document.getElementById(modalId);
    this.contentElement = document.getElementById(contentId);
    this.onSettingsChange = onSettingsChange;

    if (!this.modalElement || !this.contentElement) {
      console.error('Settings: Required DOM elements not found');
      return false;
    }

    // Add CSS styles
    this._addStyles();

    // Ensure browser validation setting is applied (only once)
    this.applyBrowserValidationSetting(this.settings.hideBrowserValidation);

    this._initialized = true;
    return true;
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem('ggcode-editor-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        this.settings = { ...this.defaultSettings, ...parsed };
      } else {
        this.settings = { ...this.defaultSettings };
      }

      // Apply browser validation setting after DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.applyBrowserValidationSetting(
            this.settings.hideBrowserValidation
          );
        });
      } else {
        // DOM is already ready
        this.applyBrowserValidationSetting(this.settings.hideBrowserValidation);
      }
    } catch (error) {
      console.error('Settings: Failed to load settings:', error);
      this.settings = { ...this.defaultSettings };
      // Apply default browser validation setting
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.applyBrowserValidationSetting(
            this.defaultSettings.hideBrowserValidation
          );
        });
      } else {
        this.applyBrowserValidationSetting(
          this.defaultSettings.hideBrowserValidation
        );
      }
    }
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem(
        'ggcode-editor-settings',
        JSON.stringify(this.settings)
      );
    } catch (error) {
      console.error('Settings: Failed to save settings:', error);
    }
  }

  /**
   * Get current settings
   * @returns {Object} Current settings
   */
  getSettings() {
    return { ...this.settings };
  }

  /**
   * Update a specific setting
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   */
  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();

    // Apply setting to editor if available
    if (this.editorInstance) {
      this.applySettingToEditor(key, value);
    }

    // Notify callback
    if (this.onSettingsChange) {
      this.onSettingsChange(key, value, this.settings);
    }
  }

  /**
   * Apply a setting to all Monaco editors
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   */
  applySettingToEditor(key, value) {
    // Get all Monaco editors
    const editors =
      typeof monaco !== 'undefined' ? monaco.editor.getEditors() : [];

    // If no editors available, store the setting for later application
    if (editors.length === 0) {
      //console.log(`Settings: No editors available, storing setting '${key}' for later application`);
      return;
    }

    try {
      editors.forEach((editor) => {
        this.applySettingToSingleEditor(editor, key, value);
      });
    } catch (error) {
      console.error(
        `Settings: Failed to apply setting '${key}' to editors:`,
        error
      );
    }
  }

  /**
   * Apply a setting to a single editor instance
   * @param {Object} editor - Monaco editor instance
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   */
  applySettingToSingleEditor(editor, key, value) {
    try {
      switch (key) {
        case 'theme':
          // Wait for themes to be available and then switch
          if (themeManager.getAvailableThemes().includes(value)) {
            themeManager.switchTheme(value);
          } else {
            // Store the preference for when themes become available
            storageManager.setSelectedTheme(value);
          }
          break;

        case 'fontSize':
          editor.updateOptions({ fontSize: parseInt(value) });
          break;

        case 'fontFamily':
          editor.updateOptions({ fontFamily: value });
          break;

        case 'wordWrap':
          editor.updateOptions({ wordWrap: value });
          break;

        case 'minimap': {
          const minimapValue =
            value === 'enabled' ? { enabled: true } : { enabled: false };
          editor.updateOptions({ minimap: minimapValue });
          break;
        }

        case 'lineNumbers':
          editor.updateOptions({ lineNumbers: value });
          break;

        case 'renderWhitespace':
          editor.updateOptions({ renderWhitespace: value });
          break;

        case 'renderIndentGuides':
          editor.updateOptions({ renderIndentGuides: value });
          break;

        case 'bracketMatching':
          editor.updateOptions({ bracketMatching: value });
          break;

        case 'autoClosingBrackets':
          editor.updateOptions({ autoClosingBrackets: value });
          break;

        case 'autoClosingQuotes':
          editor.updateOptions({ autoClosingQuotes: value });
          break;

        case 'autoClosingDelete':
          editor.updateOptions({ autoClosingDelete: value });
          break;

        case 'autoClosingOvertype':
          editor.updateOptions({ autoClosingOvertype: value });
          break;

        case 'surroudWithBrackets':
          editor.updateOptions({ surroudWithBrackets: value });
          break;

        case 'tabSize':
          editor.updateOptions({ tabSize: parseInt(value) });
          break;

        case 'insertSpaces':
          editor.updateOptions({ insertSpaces: value });
          break;

        case 'cursorBlinking':
          editor.updateOptions({ cursorBlinking: value });
          break;

        case 'cursorStyle':
          editor.updateOptions({ cursorStyle: value });
          break;

        case 'scrollBeyondLastLine':
          editor.updateOptions({ scrollBeyondLastLine: value });
          break;

        case 'smoothScrolling':
          editor.updateOptions({ smoothScrolling: value });
          break;

        case 'mouseWheelZoom':
          editor.updateOptions({ mouseWheelZoom: value });
          break;

        case 'contextmenu':
          editor.updateOptions({ contextmenu: value });
          break;

        case 'quickSuggestions':
          editor.updateOptions({ quickSuggestions: value });
          break;

        case 'suggestOnTriggerCharacters':
          editor.updateOptions({ suggestOnTriggerCharacters: value });
          break;

        case 'acceptSuggestionOnEnter':
          editor.updateOptions({ acceptSuggestionOnEnter: value });
          break;

        case 'tabCompletion':
          editor.updateOptions({ tabCompletion: value });
          break;

        case 'wordBasedSuggestions':
          editor.updateOptions({ wordBasedSuggestions: value });
          break;

        case 'parameterHints':
          editor.updateOptions({ parameterHints: value });
          break;

        case 'formatOnType':
          editor.updateOptions({ formatOnType: value });
          break;

        case 'formatOnPaste':
          editor.updateOptions({ formatOnPaste: value });
          break;

        case 'renderLineHighlight':
          editor.updateOptions({ renderLineHighlight: value });
          break;

        case 'glyphMargin':
          editor.updateOptions({ glyphMargin: value });
          break;

        case 'folding':
          editor.updateOptions({ folding: value });
          break;

        case 'showFoldingControls':
          editor.updateOptions({ showFoldingControls: value });
          break;

        case 'dragAndDrop':
          editor.updateOptions({ dragAndDrop: value });
          break;

        case 'links':
          editor.updateOptions({ links: value });
          break;

        case 'colorDecorators':
          editor.updateOptions({ colorDecorators: value });
          break;

        case 'lightbulb':
          editor.updateOptions({ lightbulb: value });
          break;

        case 'codeLens':
          editor.updateOptions({ codeLens: value });
          break;

        case 'inlayHints':
          editor.updateOptions({ inlayHints: value });
          break;

        case 'hideBrowserValidation':
          this.applyBrowserValidationSetting(value);
          break;

        case 'autoSave':
          // Auto save is handled by the application, not Monaco editor
          // Just acknowledge the setting without warning
          break;

        case 'autoSaveDelay':
          // Auto save delay is handled by the application, not Monaco editor
          // Just acknowledge the setting without warning
          break;

        default:
          console.warn(`Settings: Unknown setting '${key}'`);
      }
    } catch (error) {
      console.error(
        `Settings: Failed to apply setting '${key}' to editor:`,
        error
      );
    }
  }

  /**
   * Apply browser validation setting
   * @param {boolean} hide - Whether to hide browser validation styling
   */
  applyBrowserValidationSetting(hide) {
    const styleId = 'browser-validation-override';
    let existingStyle = document.getElementById(styleId);

    // Check if we need to make any changes
    const shouldHaveStyle = hide;
    const hasStyle = !!existingStyle;

    if (shouldHaveStyle === hasStyle) {
      // No change needed
      return;
    }

    if (hide) {
      // Add CSS to hide browser validation styling
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* DISABLE BROWSER VALIDATION STYLING ON EDITOR CONTAINERS */
        #editor,
        #output,
        #editor *,
        #output *,
        .monaco-editor,
        .monaco-editor * {
          /* Remove browser validation styling */
          box-shadow: none !important;
          outline: none !important;
          border: none !important;
          /* Disable browser form validation styling */
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }

        /* FORM VALIDATION OVERRIDE - Prevent red validation styling */
        form #editor,
        form #output,
        form .monaco-editor,
        form .monaco-editor * {
          /* Override any form validation styling */
          box-shadow: none !important;
          outline: none !important;
          border: none !important;
          /* Remove any red validation styling */
          border-color: transparent !important;
          outline-color: transparent !important;
        }

        /* FOCUS STATE OVERRIDE - Ensure no red focus styling */
        #editor:focus,
        #output:focus,
        #editor:focus-within,
        #output:focus-within,
        .monaco-editor:focus,
        .monaco-editor:focus-within {
          box-shadow: none !important;
          outline: none !important;
          border: none !important;
          border-color: transparent !important;
          outline-color: transparent !important;
        }

        /* BROWSER-SPECIFIC VALIDATION OVERRIDES */
        /* Chrome/Safari validation styling */
        #editor:invalid,
        #output:invalid,
        .monaco-editor:invalid {
          box-shadow: none !important;
          outline: none !important;
          border: none !important;
        }

        /* Firefox validation styling */
        #editor:-moz-ui-invalid,
        #output:-moz-ui-invalid,
        .monaco-editor:-moz-ui-invalid {
          box-shadow: none !important;
          outline: none !important;
          border: none !important;
        }

        /* Edge/IE validation styling */
        #editor:-ms-input-placeholder,
        #output:-ms-input-placeholder {
          box-shadow: none !important;
          outline: none !important;
          border: none !important;
        }

        /* Remove any red glow or shadow effects */
        #editor,
        #output,
        .monaco-editor {
          /* Webkit browsers */
          -webkit-box-shadow: none !important;
          /* Mozilla browsers */
          -moz-box-shadow: none !important;
          /* Standard */
          box-shadow: none !important;
          /* Remove any outline */
          outline: 0 !important;
          outline: none !important;
          /* Remove any border */
          border: 0 !important;
          border: none !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      // Remove the override style to allow browser validation styling
      existingStyle.remove();
    }
  }

  /**
   * Test the browser validation toggle
   */
  testBrowserValidationToggle() {
    // Toggle the setting
    const newValue = !this.settings.hideBrowserValidation;
    this.updateSetting('hideBrowserValidation', newValue);

    return newValue;
  }

  /**
   * Apply all current settings to all Monaco editors
   * @param {Object} editorInstance - Monaco editor instance (for backward compatibility)
   */
  applyAllSettingsToEditor(editorInstance = null) {
    // Prevent multiple rapid applications
    if (this._applyingAllSettings) {
      return;
    }
    this._applyingAllSettings = true;

    try {
      // Store the editor instance for backward compatibility
      if (editorInstance) {
        this.editorInstance = editorInstance;
      }

      // Apply all settings to all available editors
      Object.entries(this.settings).forEach(([key, value]) => {
        this.applySettingToEditor(key, value);
      });
    } finally {
      // Reset flag after a short delay
      setTimeout(() => {
        this._applyingAllSettings = false;
      }, 100);
    }
  }

  /**
   * Reset settings to defaults
   */
  resetToDefaults() {
    this.settings = { ...this.defaultSettings };
    this.saveSettings();

    // Apply defaults to all available editors
    Object.entries(this.settings).forEach(([key, value]) => {
      this.applySettingToEditor(key, value);
    });
  }

  /**
   * Get all current Monaco editors
   * @returns {Array} Array of Monaco editor instances
   */
  getAllEditors() {
    if (typeof monaco !== 'undefined') {
      return monaco.editor.getEditors();
    }
    return [];
  }

  /**
   * Check if settings are properly connected to editors
   * @returns {Object} Connection status
   */
  getConnectionStatus() {
    const editors = this.getAllEditors();
    return {
      settingsManagerInitialized: !!this.modalElement && !!this.contentElement,
      themeManagerAvailable: !!themeManager,
      monacoAvailable: typeof monaco !== 'undefined',
      editorCount: editors.length,
      editorsConnected: editors.length > 0,
      currentTheme: themeManager ? themeManager.getCurrentTheme() : null,
      availableThemes: themeManager ? themeManager.getAvailableThemes() : [],
    };
  }

  /**
   * Show settings modal
   */
  showSettings() {
    if (!this.modalElement || !this.contentElement) {
      console.error('Settings not initialized');
      return;
    }

    // Render the settings form
    const formHtml = this.renderSettingsForm();
    this.contentElement.innerHTML = formHtml;

    // Get form element and setup event handlers
    this.formElement = document.getElementById('settingsForm');
    if (this.formElement) {
      this.setupFormHandlers();
    }

    // Show modal
    this.modalElement.style.display = 'flex';
    this.modalElement.classList.add('settings-fade-in');
  }

  /**
   * Close settings modal
   */
  closeSettings() {
    if (this.modalElement) {
      this.modalElement.style.display = 'none';
      this.modalElement.classList.remove('settings-fade-in');
    }
  }

  /**
   * Render the settings form HTML
   * @returns {string} HTML string
   */
  renderSettingsForm() {
    const settings = this.settings;
    const themes = themeManager.getAvailableThemes();

    return `
      <div class="settings-container">
        <div class="settings-header">
          <div class="settings-header-content">
            <div class="settings-title-section">
              <h3>Editor Settings</h3>
              <p class="settings-description">Customize your Monaco editor experience</p>
            </div>
          </div>
        </div>

        <form id="settingsForm" class="settings-form">
          <!-- Theme Selection -->
          <div class="settings-group">
            <h4>Appearance</h4>

            <div class="setting-item">
              <label for="theme">Theme</label>
              <select id="theme" name="theme">
                ${themes.map((theme) => `<option value="${theme}" ${settings.theme === theme ? 'selected' : ''}>${theme}</option>`).join('')}
              </select>
              <div class="setting-description">Choose your editor theme</div>
            </div>

            <div class="setting-item">
              <label for="fontSize">Font Size</label>
              <input type="number" id="fontSize" name="fontSize" min="8" max="24" value="${settings.fontSize}">
              <div class="setting-description">Editor font size in pixels</div>
            </div>

            <div class="setting-item">
              <label for="fontFamily">Font Family</label>
              <select id="fontFamily" name="fontFamily">
                <option value="Consolas, 'Courier New', monospace" ${settings.fontFamily === "Consolas, 'Courier New', monospace" ? 'selected' : ''}>Consolas (Windows)</option>
                <option value="'Courier New', monospace" ${settings.fontFamily === "'Courier New', monospace" ? 'selected' : ''}>Courier New (Classic)</option>
                <option value="'Monaco', Consolas, 'Courier New', monospace" ${settings.fontFamily === "'Monaco', Consolas, 'Courier New', monospace" ? 'selected' : ''}>Monaco (macOS)</option>
                <option value="'Menlo', 'Monaco', Consolas, 'Courier New', monospace" ${settings.fontFamily === "'Menlo', 'Monaco', Consolas, 'Courier New', monospace" ? 'selected' : ''}>Menlo (macOS)</option>
                <option value="'Lucida Console', 'Courier New', monospace" ${settings.fontFamily === "'Lucida Console', 'Courier New', monospace" ? 'selected' : ''}>Lucida Console</option>
                <option value="'DejaVu Sans Mono', 'Lucida Console', 'Courier New', monospace" ${settings.fontFamily === "'DejaVu Sans Mono', 'Lucida Console', 'Courier New', monospace" ? 'selected' : ''}>DejaVu Sans Mono</option>
                <option value="'Liberation Mono', 'DejaVu Sans Mono', 'Courier New', monospace" ${settings.fontFamily === "'Liberation Mono', 'DejaVu Sans Mono', 'Courier New', monospace" ? 'selected' : ''}>Liberation Mono</option>
                <option value="'Ubuntu Mono', 'DejaVu Sans Mono', 'Courier New', monospace" ${settings.fontFamily === "'Ubuntu Mono', 'DejaVu Sans Mono', 'Courier New', monospace" ? 'selected' : ''}>Ubuntu Mono (Linux)</option>
                <option value="'Inconsolata', 'DejaVu Sans Mono', 'Courier New', monospace" ${settings.fontFamily === "'Inconsolata', 'DejaVu Sans Mono', 'Courier New', monospace" ? 'selected' : ''}>Inconsolata</option>
                <option value="'Source Code Pro', 'DejaVu Sans Mono', 'Courier New', monospace" ${settings.fontFamily === "'Source Code Pro', 'DejaVu Sans Mono', 'Courier New', monospace" ? 'selected' : ''}>Source Code Pro</option>
                <option value="'Fira Code', 'Fira Mono', 'DejaVu Sans Mono', 'Courier New', monospace" ${settings.fontFamily === "'Fira Code', 'Fira Mono', 'DejaVu Sans Mono', 'Courier New', monospace" ? 'selected' : ''}>Fira Code (Ligatures)</option>
                <option value="SFMono-Regular, 'SF Mono', Consolas, 'Courier New', monospace" ${settings.fontFamily === "SFMono-Regular, 'SF Mono', Consolas, 'Courier New', monospace" ? 'selected' : ''}>SF Mono (macOS)</option>
                <option value="monospace" ${settings.fontFamily === 'monospace' ? 'selected' : ''}>System Default</option>
              </select>
              <div class="setting-description">Choose a monospace font - all include reliable fallbacks for maximum compatibility</div>
            </div>

            <div class="setting-item">
              <label for="lineNumbers">Line Numbers</label>
              <select id="lineNumbers" name="lineNumbers">
                <option value="on" ${settings.lineNumbers === 'on' ? 'selected' : ''}>Show</option>
                <option value="off" ${settings.lineNumbers === 'off' ? 'selected' : ''}>Hide</option>
                <option value="relative" ${settings.lineNumbers === 'relative' ? 'selected' : ''}>Relative</option>
                <option value="interval" ${settings.lineNumbers === 'interval' ? 'selected' : ''}>Interval</option>
              </select>
              <div class="setting-description">Display line numbers in the editor</div>
            </div>

            <div class="setting-item">
              <label for="wordWrap">Word Wrap</label>
              <select id="wordWrap" name="wordWrap">
                <option value="off" ${settings.wordWrap === 'off' ? 'selected' : ''}>No Wrap</option>
                <option value="on" ${settings.wordWrap === 'on' ? 'selected' : ''}>Wrap Lines</option>
                <option value="wordWrapColumn" ${settings.wordWrap === 'wordWrapColumn' ? 'selected' : ''}>Wrap at Column</option>
                <option value="bounded" ${settings.wordWrap === 'bounded' ? 'selected' : ''}>Bounded Wrap</option>
              </select>
              <div class="setting-description">How to handle long lines</div>
            </div>

            <div class="setting-item">
              <label for="renderWhitespace">Render Whitespace</label>
              <select id="renderWhitespace" name="renderWhitespace">
                <option value="none" ${settings.renderWhitespace === 'none' ? 'selected' : ''}>None</option>
                <option value="boundary" ${settings.renderWhitespace === 'boundary' ? 'selected' : ''}>Boundary</option>
                <option value="selection" ${settings.renderWhitespace === 'selection' ? 'selected' : ''}>Selection</option>
                <option value="trailing" ${settings.renderWhitespace === 'trailing' ? 'selected' : ''}>Trailing</option>
                <option value="all" ${settings.renderWhitespace === 'all' ? 'selected' : ''}>All</option>
              </select>
              <div class="setting-description">Show whitespace characters</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="hideBrowserValidation" name="hideBrowserValidation" ${settings.hideBrowserValidation ? 'checked' : ''}>
                Hide Browser Validation Styling
              </label>
              <div class="setting-description">Remove red shadow lines and browser validation styling from editor (recommended)</div>
            </div>
          </div>

          <!-- Editor Behavior -->
          <div class="settings-group">
            <h4>Editor Behavior</h4>

            <div class="setting-item">
              <label for="tabSize">Tab Size</label>
              <input type="number" id="tabSize" name="tabSize" min="1" max="8" value="${settings.tabSize}">
              <div class="setting-description">Number of spaces for tab</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="insertSpaces" name="insertSpaces" ${settings.insertSpaces ? 'checked' : ''}>
                Insert Spaces
              </label>
              <div class="setting-description">Use spaces instead of tabs</div>
            </div>

            <div class="setting-item">
              <label for="cursorBlinking">Cursor Blinking</label>
              <select id="cursorBlinking" name="cursorBlinking">
                <option value="blink" ${settings.cursorBlinking === 'blink' ? 'selected' : ''}>Blink</option>
                <option value="smooth" ${settings.cursorBlinking === 'smooth' ? 'selected' : ''}>Smooth</option>
                <option value="phase" ${settings.cursorBlinking === 'phase' ? 'selected' : ''}>Phase</option>
                <option value="expand" ${settings.cursorBlinking === 'expand' ? 'selected' : ''}>Expand</option>
                <option value="solid" ${settings.cursorBlinking === 'solid' ? 'selected' : ''}>Solid</option>
              </select>
              <div class="setting-description">Cursor blinking style</div>
            </div>

            <div class="setting-item">
              <label for="cursorStyle">Cursor Style</label>
              <select id="cursorStyle" name="cursorStyle">
                <option value="line" ${settings.cursorStyle === 'line' ? 'selected' : ''}>Line</option>
                <option value="block" ${settings.cursorStyle === 'block' ? 'selected' : ''}>Block</option>
                <option value="underline" ${settings.cursorStyle === 'underline' ? 'selected' : ''}>Underline</option>
                <option value="line-thin" ${settings.cursorStyle === 'line-thin' ? 'selected' : ''}>Thin Line</option>
                <option value="block-outline" ${settings.cursorStyle === 'block-outline' ? 'selected' : ''}>Block Outline</option>
                <option value="underline-thin" ${settings.cursorStyle === 'underline-thin' ? 'selected' : ''}>Thin Underline</option>
              </select>
              <div class="setting-description">Cursor appearance</div>
            </div>
          </div>

          <!-- Features -->
          <div class="settings-group">
            <h4>Features</h4>

            <div class="setting-item">
              <label for="minimap">Minimap</label>
              <select id="minimap" name="minimap">
                <option value="enabled" ${settings.minimap === 'enabled' || (settings.minimap && typeof settings.minimap === 'object' && settings.minimap.enabled === true) ? 'selected' : ''}>Show Minimap</option>
                <option value="disabled" ${settings.minimap === 'disabled' || (settings.minimap && typeof settings.minimap === 'object' && settings.minimap.enabled === false) ? 'selected' : ''}>Hide Minimap</option>
              </select>
              <div class="setting-description">Display code minimap on the right side of the editor</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="renderIndentGuides" name="renderIndentGuides" ${settings.renderIndentGuides ? 'checked' : ''}>
                Indent Guides
              </label>
              <div class="setting-description">Show indentation guides</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="bracketMatching" name="bracketMatching" ${settings.bracketMatching ? 'checked' : ''}>
                Bracket Matching
              </label>
              <div class="setting-description">Highlight matching brackets</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="folding" name="folding" ${settings.folding ? 'checked' : ''}>
                Code Folding
              </label>
              <div class="setting-description">Allow code folding</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="dragAndDrop" name="dragAndDrop" ${settings.dragAndDrop ? 'checked' : ''}>
                Drag & Drop
              </label>
              <div class="setting-description">Enable drag and drop editing</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="links" name="links" ${settings.links ? 'checked' : ''}>
                Clickable Links
              </label>
              <div class="setting-description">Make URLs clickable</div>
            </div>
          </div>

          <!-- Suggestions & Intellisense -->
          <div class="settings-group">
            <h4>IntelliSense</h4>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="quickSuggestions" name="quickSuggestions" ${settings.quickSuggestions ? 'checked' : ''}>
                Quick Suggestions
              </label>
              <div class="setting-description">Show suggestions as you type</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="suggestOnTriggerCharacters" name="suggestOnTriggerCharacters" ${settings.suggestOnTriggerCharacters ? 'checked' : ''}>
                Trigger Characters
              </label>
              <div class="setting-description">Show suggestions on trigger characters</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="parameterHints" name="parameterHints" ${settings.parameterHints ? 'checked' : ''}>
                Parameter Hints
              </label>
              <div class="setting-description">Show parameter hints</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="formatOnType" name="formatOnType" ${settings.formatOnType ? 'checked' : ''}>
                Format on Type
              </label>
              <div class="setting-description">Auto-format as you type</div>
            </div>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="formatOnPaste" name="formatOnPaste" ${settings.formatOnPaste ? 'checked' : ''}>
                Format on Paste
              </label>
              <div class="setting-description">Auto-format when pasting</div>
            </div>
          </div>

          <!-- Auto Save -->
          <div class="settings-group">
            <h4>Auto Save</h4>

            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" id="autoSave" name="autoSave" ${settings.autoSave ? 'checked' : ''}>
                Enable Auto Save
              </label>
              <div class="setting-description">Automatically save content periodically</div>
            </div>

            <div class="setting-item">
              <label for="autoSaveDelay">Auto Save Delay (ms)</label>
              <input type="number" id="autoSaveDelay" name="autoSaveDelay" min="5000" max="300000" step="5000" value="${settings.autoSaveDelay}">
              <div class="setting-description">Delay between auto-saves (in milliseconds)</div>
            </div>
          </div>
        </form>


      </div>
    `;
  }

  /**
   * Setup form event handlers
   */
  setupFormHandlers() {
    if (!this.formElement) return;

    // Handle input changes
    this.formElement.addEventListener('input', (e) => {
      const { name, value, type, checked } = e.target;

      if (!name) return;

      let finalValue;
      if (type === 'checkbox') {
        finalValue = checked;
      } else if (type === 'number') {
        finalValue = parseInt(value);
      } else if (name === 'minimap') {
        finalValue = value; // 'enabled' or 'disabled'
      } else {
        finalValue = value;
      }

      this.updateSetting(name, finalValue);
    });

    // Handle select changes
    this.formElement.addEventListener('change', (e) => {
      const { name, value, type, checked } = e.target;

      if (!name) return;

      let finalValue;
      if (type === 'checkbox') {
        finalValue = checked;
      } else if (type === 'number') {
        finalValue = parseInt(value);
      } else if (name === 'minimap') {
        finalValue = value; // 'enabled' or 'disabled'
      } else {
        finalValue = value;
      }

      this.updateSetting(name, finalValue);
    });
  }

  /**
   * Apply current form settings
   */
  applyCurrentSettings() {
    // Settings are applied in real-time via event handlers
    // This method can be used for batch operations if needed
    this.closeSettings();
  }

  /**
   * Add CSS link for settings modal
   * @private
   */
  _addStyles() {
    const linkId = 'settings-styles-link';
    if (document.getElementById(linkId)) return;

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = '/css/modals/settings.css';

    document.head.appendChild(link);
  }
}

// Create global settings manager instance
const settingsManager = new EditorSettingsManager();

// Export for use in other modules
export { EditorSettingsManager, settingsManager };
export default settingsManager;

// Make globally available
if (typeof window !== 'undefined') {
  window.settingsManager = settingsManager;
}
