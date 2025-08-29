/**
 * Monaco Editor Theme System
 * Centralized theme management with color definitions and loading
 */

class ThemeManager {
  constructor() {
    this.themes = {};
    this.currentTheme = 'ggcode-dark';
    this.colors = {};
    this.initialized = false;
  }

  /**
   * Load and initialize the complete theme system (moved from monaco.js)
   * @returns {Promise<boolean>} Success status
   */
  async loadAndInitializeTheme() {
    try {
      // Wait for Monaco to be available if needed
      if (typeof monaco === 'undefined') {
        let attempts = 0;
        const maxAttempts = 50; // Wait up to 5 seconds

        while (typeof monaco === 'undefined' && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (typeof monaco === 'undefined') {
          throw new Error('Monaco is not available after waiting');
        }
      }

      // Theme loading is now handled by ThemeLoader in main.js
      this.initialized = true;
      return true;
    } catch (error) {
      // Fallback theme handling moved to separate method
      this.createFallbackThemeIfNeeded();
      return false;
    }
  }

  /**
   * Create fallback theme if native theme fails (from monaco.js)
   */
  createFallbackThemeIfNeeded() {
    if (typeof monaco === 'undefined') return;

    try {
      // Create fallback theme with essential colors
      monaco.editor.defineTheme('ggcode-dark-fallback', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          // Keywords
          { token: 'keyword', foreground: '6FBAE3', fontStyle: 'bold' },

          // G-code categories with distinct colors
          { token: 'gcode-rapid', foreground: '5CB85C', fontStyle: 'bold' }, // G0 - Green (rapid moves)
          { token: 'gcode-linear', foreground: '0275D8', fontStyle: 'bold' }, // G1 - Blue (linear moves)
          { token: 'gcode-arc', foreground: '9B59B6', fontStyle: 'bold' }, // G2/G3 - Purple (arc moves)
          { token: 'gcode-dwell', foreground: 'E67E22', fontStyle: 'bold' }, // G4 - Orange (dwell)
          { token: 'gcode-drill', foreground: '27AE60', fontStyle: 'bold' }, // G8x - Dark green (drilling)
          { token: 'gcode-bore', foreground: '34495E', fontStyle: 'bold' }, // G7x - Dark blue (boring/cutoff)
          { token: 'gcode-ref', foreground: '00BCD4', fontStyle: 'bold' }, // G28/G30 - Cyan (reference returns)
          { token: 'gcode-tap', foreground: 'F1C40F', fontStyle: 'bold' }, // G84 - Gold (rigid tapping)
          { token: 'gcode', foreground: 'E74C3C', fontStyle: 'bold' }, // Other G-codes - Red

          // M-code categories with distinct colors
          { token: 'mcode-spindle', foreground: 'F39C12', fontStyle: 'bold' }, // M3/M4/M5 - Orange (spindle control)
          {
            token: 'mcode-toolchange',
            foreground: '9C27B0',
            fontStyle: 'bold',
          }, // M6 - Purple (tool change)
          { token: 'mcode-coolant', foreground: '00BCD4', fontStyle: 'bold' }, // M7/M8/M9 - Cyan (coolant)
          { token: 'mcode-control', foreground: 'FFC107', fontStyle: 'bold' }, // M0/M1/M2/M30 - Yellow (program control)
          { token: 'mcode', foreground: 'F06292', fontStyle: 'bold' }, // Other M-codes - Pink

          // Other token types
          { token: 'axis', foreground: 'ff66cc', fontStyle: 'italic' },

          // Regular axis coordinates (X100, Y200, etc.)
          { token: 'axis.x', foreground: 'D9372B', fontStyle: 'italic' },
          { token: 'axis.y', foreground: '57C24F', fontStyle: 'italic' },
          { token: 'axis.z', foreground: '3B65B8', fontStyle: 'italic' },
          { token: 'axis.a', foreground: 'ff99ff', fontStyle: 'italic' },
          { token: 'axis.b', foreground: '99ffff', fontStyle: 'italic' },
          { token: 'axis.c', foreground: 'ffff99', fontStyle: 'italic' },
          { token: 'axis.e', foreground: 'ffdddd', fontStyle: 'italic' },
          { token: 'axis.f', foreground: 'aaaaaa', fontStyle: 'italic' },
          { token: 'axis.s', foreground: 'ffbb66', fontStyle: 'italic' },
          { token: 'axis.t', foreground: 'B02BD9', fontStyle: 'italic' },
          { token: 'axis.h', foreground: 'bbbbff', fontStyle: 'italic' },
          { token: 'axis.r', foreground: 'aaffaa', fontStyle: 'italic' },
          { token: 'axis.p', foreground: 'bbffff', fontStyle: 'italic' },
          { token: 'axis.n', foreground: '5C5C5C', fontStyle: 'italic' },

          // Bracketed axis variables (X[end_x2]), etc. - highlight with bracket accent
          { token: 'axis-with-var.x', foreground: 'D9372B', fontStyle: 'bold' },
          { token: 'axis-with-var.y', foreground: '57C24F', fontStyle: 'bold' },
          { token: 'axis-with-var.z', foreground: '3B65B8', fontStyle: 'bold' },
          { token: 'axis-with-var.a', foreground: 'E91E63', fontStyle: 'bold' },
          { token: 'axis-with-var.b', foreground: '00BCD4', fontStyle: 'bold' },
          { token: 'axis-with-var.c', foreground: 'FFC107', fontStyle: 'bold' },
          { token: 'axis-with-var.e', foreground: 'ffdddd', fontStyle: 'bold' },
          { token: 'axis-with-var.f', foreground: 'aaaaaa', fontStyle: 'bold' },
          { token: 'axis-with-var.s', foreground: 'ffbb66', fontStyle: 'bold' },
          { token: 'axis-with-var.t', foreground: 'B02BD9', fontStyle: 'bold' },
          { token: 'axis-with-var.h', foreground: 'bbbbff', fontStyle: 'bold' },
          { token: 'axis-with-var.r', foreground: 'aaffaa', fontStyle: 'bold' },
          { token: 'axis-with-var.p', foreground: 'bbffff', fontStyle: 'bold' },

          // Bracketed variables (F[feed_rate], R[radius])
          {
            token: 'variable-bracket',
            foreground: 'FFA500',
            fontStyle: 'bold',
          },
          { token: 'number', foreground: 'D0ECB1' },
          { token: 'comment', foreground: '#577834', fontStyle: 'italic' },
          { token: 'variable', foreground: 'ffaa00' },
          { token: 'constant', foreground: '00ff99' },
          { token: 'predefined', foreground: 'ff66cc' },
        ],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.foreground': '#cccccc',
          'editor.selectionBackground': '#264f78',
          'editor.lineHighlightBackground': '#2a2a2a',
        },
      });

      // Switch to fallback theme
      this.currentTheme = 'ggcode-dark-fallback';
      // Applied fallback theme
    } catch (fallbackError) {
      console.error('ThemeManager: Even fallback theme failed:', fallbackError);
    }
  }

  /**
   * Load a theme by name (enhanced with better logging)
   * @param {string} themeName - Name of the theme to load
   */
  loadTheme(themeName) {
    if (this.themes[themeName]) {
      this.currentTheme = themeName;
      const theme = this.themes[themeName];

      // Define the theme in Monaco if available
      if (typeof monaco !== 'undefined') {
        monaco.editor.defineTheme(themeName, theme.definition);
        // Theme defined successfully
      } else {
        console.warn(
          `Monaco not available, theme '${themeName}' will be applied when Monaco loads`
        );
        return;
      }

      // Apply theme to all existing editors
      this.applyThemeToEditors();

      this.initialized = true;
    } else {
      console.warn(
        `Theme '${themeName}' not found, using fallback theme. Available themes:`,
        this.getAvailableThemes()
      );
      this.createFallbackThemeIfNeeded();
      this.initialized = true;
    }
  }

  /**
   * Apply current theme to all Monaco editors
   */
  applyThemeToEditors() {
    if (typeof monaco === 'undefined') return;

    // Find all Monaco editors and apply theme
    const editors = monaco.editor.getEditors();
    editors.forEach((editor) => {
      editor.updateOptions({ theme: this.currentTheme });
    });
  }

  /**
   * Get current theme colors
   * @returns {Object} Theme colors object
   */
  getCurrentThemeColors() {
    return this.themes[this.currentTheme]?.colors || {};
  }

  /**
   * Register a new theme
   * @param {string} name - Theme name
   * @param {Object} themeDefinition - Monaco theme definition
   * @param {Object} colors - Color definitions
   */
  registerTheme(name, themeDefinition, colors = {}) {
    this.themes[name] = {
      definition: themeDefinition,
      colors: colors,
    };

    // Merge colors into main colors object
    Object.assign(this.colors, colors);
  }

  /**
   * Get color by key
   * @param {string} key - Color key
   * @returns {string} Color value
   */
  getColor(key) {
    return this.colors[key] || this.getCurrentThemeColors()[key];
  }

  /**
   * Get all available themes
   * @returns {Array<string>} Array of theme names
   */
  getAvailableThemes() {
    return Object.keys(this.themes);
  }

  /**
   * Apply theme to a specific editor instance
   * @param {Object} editorInstance - Monaco editor instance
   * @param {string} themeName - Optional theme name, defaults to current theme
   */
  applyThemeToSpecificEditor(editorInstance, themeName = null) {
    if (typeof monaco === 'undefined' || !editorInstance) return;

    try {
      const theme = themeName || this.currentTheme;
      editorInstance.updateOptions({ theme: theme });
    } catch (e) {
      console.warn('Failed to update editor theme:', e);
    }
  }

  /**
   * Initialize theme system state
   * @returns {boolean} Initialization status
   */
  isInitialized() {
    return this.initialized && typeof monaco !== 'undefined';
  }

  /**
   * Get current theme name
   * @returns {string} Current theme name
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Enhanced theme switcher with validation
   * @param {string} themeName - Name of the theme to switch to
   * @returns {boolean} Success status
   */
  switchTheme(themeName) {
    try {
      if (!this.themes[themeName]) {
        console.warn(
          `Theme '${themeName}' not found. Available themes:`,
          this.getAvailableThemes()
        );
        return false;
      }

      this.loadTheme(themeName);
      return true;
    } catch (error) {
      console.error(`Failed to switch to theme '${themeName}':`, error);
      return false;
    }
  }

  /**
   * Apply any pending theme preferences that couldn't be applied during initialization
   */
  applyPendingThemePreferences() {
    try {
      // Import here to avoid circular imports
      if (
        typeof window !== 'undefined' &&
        window.storageManager &&
        window.storageManager.getSelectedTheme
      ) {
        const pendingTheme = window.storageManager.getSelectedTheme();
        if (pendingTheme && this.themes[pendingTheme]) {
          this.switchTheme(pendingTheme);
        }
      }
    } catch (error) {
      // Ignore errors for pending theme application
    }
  }
}

// Create global theme manager instance
const themeManager = new ThemeManager();

// Export for use in other modules
export { ThemeManager, themeManager };
export default themeManager;
