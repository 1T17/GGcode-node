/**
 * Theme Loader
 * Loads theme data from JSON files and creates theme definitions
 * Supports team-based theme configurations
 */

import themeManager from './themes.js';
import storageManager from '../utils/storageManager.js';

class ThemeLoader {
  constructor() {
    this.teamData = null;
    this.themeColors = {};
    this.basePath = '/data/themes/';
  }

  /**
   * Initialize theme loading system
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      // Load team configuration
      await this.loadTeamData();

      // Load available color palettes
      await this.loadColorPalettes();

      // Generate and register themes based on team preferences
      await this.generateThemes();

      return true;
    } catch (error) {
      console.error('ThemeLoader: Failed to initialize:', error);
      return false;
    }
  }

  /**
   * Load team configuration from JSON
   * @returns {Promise<void>}
   */
  async loadTeamData() {
    try {
      const response = await fetch('/data/team-themes.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.teamData = await response.json();
    } catch (error) {
      console.error('ThemeLoader: Failed to load team data:', error);
      // Fallback to default team configuration
      this.teamData = {
        teams: {
          default: {
            name: 'GGcode Default',
            description: 'Default theme configuration',
            theme: 'ggcode-dark',
            colors: 'ggcode-dark-colors',
            settings: { customizable: true, shared: false },
          },
        },
      };
    }
  }

  /**
   * Load color palettes from JSON files
   * @returns {Promise<void>}
   */
  async loadColorPalettes() {
    try {
      // Define color palette files to load
      const colorFiles = [
        'ggcode-dark-colors.json',
        'ggcode-light-colors.json',
      ];

      for (const file of colorFiles) {
        try {
          const response = await fetch(`${this.basePath}${file}`);
          if (!response.ok) {
            console.warn(
              `ThemeLoader: Color file ${file} not found (HTTP ${response.status})`
            );
            continue;
          }

          const colorData = await response.json();
          const paletteName = file.replace('.json', '');
          this.themeColors[paletteName] = colorData.colors;
        } catch (error) {
          console.warn(
            `ThemeLoader: Failed to load color file ${file}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error('ThemeLoader: Failed to load color palettes:', error);
    }
  }

  /**
   * Generate complete theme definitions from loaded data
   */
  async generateThemes() {
    // Always generate both themes so settings can show both options
    const themes = {
      'ggcode-dark': this.createGGcodeDarkTheme(),
      'ggcode-light': this.createGGcodeLightTheme(),
    };

    // Register both themes with ThemeManager
    Object.entries(themes).forEach(([themeName, themeData]) => {
      themeManager.registerTheme(
        themeName,
        themeData.definition,
        themeData.colors
      );
    });

    // Apply any pending theme preferences that couldn't be applied during initialization
    themeManager.applyPendingThemePreferences();

    // Apply stored background images
    ThemeLoader.applyBackgroundImages();

    // Check for direct theme preference (from settings) first
    const directThemePreference = storageManager.getSelectedTheme();

    if (
      directThemePreference &&
      themeManager.getAvailableThemes().includes(directThemePreference)
    ) {
      // User has explicitly selected a theme in settings - use that
      themeManager.switchTheme(directThemePreference);
    } else if (directThemePreference === null) {
      // No direct theme preference set, use team preference
      const preferredTeam = storageManager.getSelectedTeam();
      const teamConfig = this.getTeamConfig(preferredTeam);

      if (!teamConfig) {
        console.warn(
          `ThemeLoader: Team '${preferredTeam}' not found, using default team`
        );
        const defaultTeamConfig = this.getTeamConfig('default');
        if (defaultTeamConfig) {
          const themeName = defaultTeamConfig.theme;
          if (themeManager.getAvailableThemes().includes(themeName)) {
            themeManager.switchTheme(themeName);
          }
        }
      } else {
        const themeName = teamConfig.theme;
        if (themeManager.getAvailableThemes().includes(themeName)) {
          themeManager.switchTheme(themeName);
        }
      }
    }
  }

  /**
   * Set a direct theme preference (overrides team preferences)
   * @param {string} themeName - Name of the theme to set
   * @returns {boolean} Success status
   */
  setThemePreference(themeName) {
    try {
      if (!themeManager.getAvailableThemes().includes(themeName)) {
        console.error(`ThemeLoader: Theme '${themeName}' not available`);
        return false;
      }

      // Save theme preference
      storageManager.setSelectedTheme(themeName);
      console.log(`ThemeLoader: Set theme preference to: ${themeName}`);

      return true;
    } catch (error) {
      console.error(`ThemeLoader: Failed to set theme preference:`, error);
      return false;
    }
  }
  /**
   * Create GGCode Dark theme definition
   * @returns {Object} Theme definition with colors
   */
  createGGcodeDarkTheme() {
    const colors = this.themeColors['ggcode-dark-colors'];
    if (!colors) {
      console.error('ThemeLoader: Dark theme colors not available');
      return this.createFallbackTheme();
    }

    return {
      definition: {
        base: 'vs-dark',
        inherit: true,
        rules: this.generateSyntaxRules(colors, false),
        colors: this.generateMonacoColors(colors),
      },
      colors: colors,
    };
  }

  /**
   * Create GGCode Light theme definition
   * @returns {Object} Theme definition with colors
   */
  createGGcodeLightTheme() {
    const colors = this.themeColors['ggcode-light-colors'];
    if (!colors) {
      console.error('ThemeLoader: Light theme colors not available');
      return this.createFallbackTheme(true);
    }

    return {
      definition: {
        base: 'vs',
        inherit: true,
        rules: this.generateSyntaxRules(colors, true),
        colors: this.generateMonacoColors(colors),
      },
      colors: colors,
    };
  }

  /**
   * Generate syntax highlighting rules
   * @param {Object} colors - Color palette
   * @param {boolean} isLight - Whether this is a light theme
   * @returns {Array} Monaco syntax rules
   */
  generateSyntaxRules(colors, isLight = false) {
    return [
      // Core syntax highlighting
      {
        token: 'keyword',
        foreground: this.extractHex(colors.keyword),
        fontStyle: 'bold',
      },

      // Differentiated G-code colors
      {
        token: 'gcode-rapid',
        foreground: this.extractHex(colors.gcodeRapid),
        fontStyle: 'bold',
      },
      {
        token: 'gcode-linear',
        foreground: this.extractHex(colors.gcodeLinear),
        fontStyle: 'bold',
      },
      {
        token: 'gcode-arc',
        foreground: this.extractHex(colors.gcodeArc),
        fontStyle: 'bold',
      },
      {
        token: 'gcode-dwell',
        foreground: this.extractHex(colors.gcodeDwell),
        fontStyle: 'bold',
      },
      {
        token: 'gcode-drill',
        foreground: this.extractHex(colors.gcodeDrill),
        fontStyle: 'bold',
      },
      {
        token: 'gcode-bore',
        foreground: this.extractHex(colors.gcodeBore),
        fontStyle: 'bold',
      },
      {
        token: 'gcode-ref',
        foreground: this.extractHex(colors.gcodeRef),
        fontStyle: 'bold',
      },
      {
        token: 'gcode-tap',
        foreground: this.extractHex(colors.gcodeTap),
        fontStyle: 'bold',
      },
      {
        token: 'gcode',
        foreground: this.extractHex(colors.gcode),
        fontStyle: 'bold',
      },

      // Differentiated M-code colors
      {
        token: 'mcode-spindle',
        foreground: this.extractHex(colors.mcodeSpindle),
        fontStyle: 'bold',
      },
      {
        token: 'mcode-toolchange',
        foreground: this.extractHex(colors.mcodeToolchange),
        fontStyle: 'bold',
      },
      {
        token: 'mcode-coolant',
        foreground: this.extractHex(colors.mcodeCoolant),
        fontStyle: 'bold',
      },
      {
        token: 'mcode-control',
        foreground: this.extractHex(colors.mcodeControl),
        fontStyle: 'bold',
      },
      {
        token: 'mcode',
        foreground: this.extractHex(colors.mcode),
        fontStyle: 'bold',
      },

      // Other token types
      {
        token: 'axis',
        foreground: this.extractHex(colors.axis),
        fontStyle: 'italic',
      },
      { token: 'number', foreground: this.extractHex(colors.number) },
      {
        token: 'comment',
        foreground: this.extractHex(colors.comment),
        fontStyle: 'italic',
      },
      { token: 'variable', foreground: this.extractHex(colors.variable) },
      {
        token: 'variable-declaration',
        foreground: this.extractHex(colors.variable),
        fontStyle: 'bold',
      },
      {
        token: 'variable-reference',
        foreground: this.extractHex(colors.variable),
        fontStyle: 'italic',
      },
      { token: 'constant', foreground: this.extractHex(colors.constant) },
      { token: 'predefined', foreground: this.extractHex(colors.predefined) },
      { token: 'identifier', foreground: this.extractHex(colors.identifier) },

      // Axis-specific colors
      { token: 'axis.x', foreground: this.extractHex(colors.axisX) },
      { token: 'axis.y', foreground: this.extractHex(colors.axisY) },
      { token: 'axis.z', foreground: this.extractHex(colors.axisZ) },
      { token: 'axis.a', foreground: this.extractHex(colors.axisA) },
      { token: 'axis.b', foreground: this.extractHex(colors.axisB) },
      { token: 'axis.c', foreground: this.extractHex(colors.axisC) },
      { token: 'axis.e', foreground: this.extractHex(colors.axisE) },
      { token: 'axis.f', foreground: this.extractHex(colors.axisF) },
      { token: 'axis.s', foreground: this.extractHex(colors.axisS) },
      { token: 'axis.t', foreground: this.extractHex(colors.axisT) },
      { token: 'axis.h', foreground: this.extractHex(colors.axisH) },
      { token: 'axis.r', foreground: this.extractHex(colors.axisR) },
      { token: 'axis.p', foreground: this.extractHex(colors.axisP) },
      { token: 'axis.i', foreground: this.extractHex(colors.axisI) },
      { token: 'axis.j', foreground: this.extractHex(colors.axisJ) },
      { token: 'nline', foreground: this.extractHex(colors.nline) },

      // Enhanced bracketed variables
      {
        token: 'axis-with-var.x',
        foreground: this.extractHex(colors.axisX),
        fontStyle: 'bold',
      },
      {
        token: 'axis-with-var.y',
        foreground: this.extractHex(colors.axisY),
        fontStyle: 'bold',
      },
      {
        token: 'axis-with-var.z',
        foreground: this.extractHex(colors.axisZ),
        fontStyle: 'bold',
      },
      {
        token: 'axis-with-var.a',
        foreground: this.extractHex(colors.axisA),
        fontStyle: 'bold',
      },
      {
        token: 'axis-with-var.b',
        foreground: this.extractHex(colors.axisB),
        fontStyle: 'bold',
      },
      {
        token: 'axis-with-var.c',
        foreground: this.extractHex(colors.axisC),
        fontStyle: 'bold',
      },
      {
        token: 'axis-with-var.i',
        foreground: this.extractHex(colors.axisI),
        fontStyle: 'bold',
      },
      {
        token: 'axis-with-var.j',
        foreground: this.extractHex(colors.axisJ),
        fontStyle: 'bold',
      },
      {
        token: 'axis-with-var.r',
        foreground: this.extractHex(colors.axisR),
        fontStyle: 'bold',
      },
      {
        token: 'axis-with-var.f',
        foreground: this.extractHex(colors.axisF),
        fontStyle: 'bold',
      },
      {
        token: 'axis-with-var.s',
        foreground: this.extractHex(colors.axisS),
        fontStyle: 'bold',
      },

      // Standard Monaco tokens
      { token: 'string', foreground: this.extractHex(colors.gcode) },
      { token: 'string.escape', foreground: this.extractHex(colors.variable) },
      { token: 'character', foreground: this.extractHex(colors.gcode) },
      { token: 'operator', foreground: isLight ? '000000' : 'd4d4d4' },
      { token: 'punctuation', foreground: isLight ? '000000' : 'd4d4d4' },
      { token: 'delimiter', foreground: isLight ? '000000' : 'd4d4d4' },

      // Bracket delimiters with subtle accent colors (let Bracket Pair Colorization handle main visuals)
      {
        token: 'delimiter.bracket',
        foreground: this.extractHex(colors.bracketLevel1),
      },
      {
        token: 'delimiter.parenthesis',
        foreground: this.extractHex(colors.bracketLevel2),
      },
      {
        token: 'delimiter.curly',
        foreground: this.extractHex(colors.bracketLevel3),
      },
      { token: 'type', foreground: '4ec9b0' },
      { token: 'type.parameter', foreground: '4ec9b0' },
      { token: 'type.builtin', foreground: '4ec9b0' },
      { token: 'function', foreground: 'dcdcaa' },
      { token: 'method', foreground: 'dcdcaa' },
      { token: 'function.call', foreground: 'dcdcaa' },
    ];
  }

  /**
   * Generate Monaco editor colors configuration
   * @param {Object} colors - Color palette
   * @returns {Object} Monaco colors object
   */
  generateMonacoColors(colors) {
    return {
      // Base editor colors
      'editor.background': colors.background,
      'editor.foreground': colors.foreground,
      'editor.selectionBackground': colors.backgroundSelection,
      'editor.lineHighlightBackground': colors.backgroundHover,
      'editor.cursor': colors.foreground,
      'editor.whitespace': colors.foregroundMuted,
      'editor.indentGuide': colors.border,
      'editor.activeIndentGuide': colors.borderLight,

      // Line numbers and rulers
      'editorLineNumber.foreground': colors.foregroundMuted,
      'editorLineNumber.activeForeground': colors.foreground,
      'editor.ruler': 'transparent',

      // Code folding
      'editor.foldBackground': colors.backgroundHover,
      'editorFoldWidget.foreground': colors.foregroundMuted,

      // Selection and find
      'editor.selectionHighlightBackground': colors.backgroundSelection + '60',
      'editor.wordHighlightBackground': colors.backgroundSelection + '40',
      'editor.wordHighlightStrongBackground': colors.backgroundSelection + '60',
      'editor.findMatchBackground': colors.backgroundSelection + '80',
      'editor.findMatchHighlightBackground': colors.backgroundSelection + '60',
      'editor.findRangeHighlightBackground': colors.backgroundSelection + '40',

      // Hover and lightbulb
      'editor.hoverHighlightBackground': colors.backgroundHover,
      'editorLightBulb.foreground': colors.warning,

      // Errors and warnings
      'editorError.foreground': colors.error,
      'editorError.border': colors.border,
      'editorWarning.foreground': colors.warning,
      'editorWarning.border': colors.border,
      'editorInfo.foreground': colors.info,
      'editorInfo.border': colors.info,
      'editorHint.foreground': colors.foregroundMuted,
      'editorHint.border': colors.foregroundMuted,

      // Gutter
      'editorGutter.background': colors.background,
      'editorGutter.modifiedBackground': colors.warning + '40',
      'editorGutter.addedBackground': colors.success + '40',
      'editorGutter.deletedBackground': colors.error + '40',

      // Scrollbar
      'scrollbar.shadow': colors.widgetShadow,
      'scrollbarSlider.background': colors.scrollbar,
      'scrollbarSlider.hoverBackground': colors.scrollbarHover,
      'scrollbarSlider.activeBackground': colors.scrollbarActive,

      // Activity bar
      'activityBar.background': colors.panel,
      'activityBar.foreground': colors.foreground,
      'activityBar.border': colors.border,
      'activityBarBadge.background': colors.primary,
      'activityBarBadge.foreground': '#ffffff',

      // Status bar
      'statusBar.background': colors.statusBar,
      'statusBar.foreground': '#ffffff',
      'statusBar.border': colors.border,
      'statusBarItem.hoverBackground': colors.statusBarHover,
      'statusBarItem.prominentBackground': colors.primary,
      'statusBarItem.prominentForeground': '#ffffff',
      'statusBarItem.prominentHoverBackground': colors.primary + 'cc',

      // Title bar
      'titleBar.activeBackground': colors.panel,
      'titleBar.activeForeground': colors.foreground,
      'titleBar.inactiveBackground': colors.panel,
      'titleBar.inactiveForeground': colors.foregroundMuted,
      'titleBar.border': colors.border,

      // Menu bar
      'menu.background': colors.panel,
      'menu.foreground': colors.foreground,
      'menu.selectionBackground': colors.backgroundActive,
      'menu.selectionForeground': colors.foreground,
      'menu.border': colors.border,

      // Notifications
      'notificationCenter.background': colors.panel,
      'notificationCenter.foreground': colors.foreground,
      'notificationCenter.border': colors.border,
      'notificationToast.background': colors.panel,
      'notificationToast.foreground': colors.foreground,
      'notificationToast.border': colors.border,
      'notifications.foreground': colors.foreground,
      'notifications.background': colors.panel,
      'notifications.border': colors.border,
      'notificationLink.foreground': colors.primary,

      // Input fields
      'input.background': colors.input,
      'input.foreground': colors.foreground,
      'input.border': colors.inputBorder,
      'input.placeholderForeground': colors.inputPlaceholder,
      'inputOption.activeBackground': colors.backgroundActive,
      'inputOption.activeForeground': colors.foreground,
      'inputValidation.errorBackground': colors.error + '20',
      'inputValidation.errorBorder': colors.error,
      'inputValidation.infoBackground': colors.info + '20',
      'inputValidation.infoBorder': colors.info,
      'inputValidation.warningBackground': colors.warning + '20',
      'inputValidation.warningBorder': colors.warning,

      // Lists
      'list.activeSelectionBackground': colors.listActive,
      'list.activeSelectionForeground': colors.foreground,
      'list.dropBackground': colors.backgroundSelection,
      'list.focusBackground': colors.listFocus,
      'list.focusForeground': colors.foreground,
      'list.highlightForeground': colors.primary,
      'list.hoverBackground': colors.listHover,
      'list.hoverForeground': colors.foreground,
      'list.inactiveSelectionBackground': colors.listActive,
      'list.inactiveSelectionForeground': colors.foreground,
      'list.inactiveFocusBackground': colors.listFocus,
      'list.invalidItemForeground': colors.error,
      'list.errorForeground': colors.error,
      'list.warningForeground': colors.warning,

      // Panels
      'panel.background': colors.panel,
      'panel.border': colors.panelBorder,
      'panelTitle.activeBorder': colors.borderFocus,
      'panelTitle.activeForeground': colors.foreground,
      'panelTitle.inactiveForeground': colors.foregroundMuted,

      // Badge
      'badge.background': colors.primary,
      'badge.foreground': '#ffffff',

      // Terminal
      'terminal.background': colors.background,
      'terminal.foreground': colors.foreground,
      'terminal.selectionBackground': colors.backgroundSelection,
      'terminal.border': colors.border,
      'terminal.activeTabBackground': colors.backgroundActive,

      // Quick input
      'quickInput.background': colors.dropdown,
      'quickInput.foreground': colors.foreground,
      'quickInput.listFocusBackground': colors.listFocus,
      'quickInput.listFocusForeground': colors.foreground,

      // Bracket pair colorization
      'editorBracketHighlight.foreground1': colors.bracketLevel1,
      'editorBracketHighlight.foreground2': colors.bracketLevel2,
      'editorBracketHighlight.foreground3': colors.bracketLevel3,
      'editorBracketHighlight.foreground4': colors.bracketLevel4,
      'editorBracketHighlight.foreground5': colors.bracketLevel5,
      'editorBracketHighlight.foreground6': colors.bracketLevel6,
      'editorBracketHighlight.unexpectedBracket.foreground': colors.error,

      // Bracket matching colors
      'editorBracketMatch.background': colors.backgroundSelection,
      'editorBracketMatch.border': colors.borderFocus,
    };
  }

  /**
   * Extract hex color without # prefix for Monaco
   * @param {string} color - Color value (with or without #)
   * @returns {string} Hex color without #
   */
  extractHex(color) {
    if (!color) return 'cccccc';
    return color.startsWith('#') ? color.substring(1) : color;
  }

  /**
   * Create fallback theme
   * @param {boolean} light - Whether to create light theme fallback
   * @returns {Object} Fallback theme definition
   */
  createFallbackTheme(light = false) {
    const baseColors = light
      ? {
          background: '#ffffff',
          foreground: '#000000',
          keyword: '#0000ff',
          comment: '#008000',
          number: '#008000',
        }
      : {
          background: '#1e1e1e',
          foreground: '#cccccc',
          keyword: '#6FBAE3',
          comment: '#577834',
          number: '#D0ECB1',
        };

    return {
      definition: {
        base: light ? 'vs' : 'vs-dark',
        inherit: true,
        rules: [
          {
            token: 'keyword',
            foreground: this.extractHex(baseColors.keyword),
            fontStyle: 'bold',
          },
          {
            token: 'comment',
            foreground: this.extractHex(baseColors.comment),
            fontStyle: 'italic',
          },
          { token: 'number', foreground: this.extractHex(baseColors.number) },
        ],
        colors: {
          'editor.background': baseColors.background,
          'editor.foreground': baseColors.foreground,
          'editor.selectionBackground': light ? '#add6ff' : '#264f78',
        },
      },
      colors: baseColors,
    };
  }

  /**
   * Get team configuration
   * @param {string} teamName - Name of the team
   * @returns {Object} Team configuration
   */
  getTeamConfig(teamName = 'default') {
    return this.teamData?.teams?.[teamName] || this.teamData?.teams?.default;
  }

  /**
   * Apply background images to editor containers
   * @static
   */
  static applyBackgroundImages() {
    const editorElement = document.getElementById('editor');
    const outputElement = document.getElementById('output');

    try {
      // Import storage manager dynamically to avoid circular imports
      import('../utils/storageManager.js').then((storageManager) => {
        // Apply stored background preferences
        const editorBg = storageManager.default.getEditorBackground();
        const outputBg = storageManager.default.getOutputBackground();

        // Clear all background classes first
        const allBgClasses = [
          'bg-space',
          'bg-circuit',
          'bg-code-gradient',
          'bg-matrix',
          'bg-coffee-shop',
          'bg-minimal-dark',
          'bg-minimal-light',
          'bg-blue-grid',
        ];

        if (editorElement) {
          allBgClasses.forEach((cls) => editorElement.classList.remove(cls));
          if (editorBg !== 'none' && allBgClasses.includes(editorBg)) {
            editorElement.classList.add(editorBg);
          }
        }

        if (outputElement) {
          allBgClasses.forEach((cls) => outputElement.classList.remove(cls));
          if (outputBg !== 'none' && allBgClasses.includes(outputBg)) {
            outputElement.classList.add(outputBg);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to apply background images:', error);
    }
  }

  /**
   * Set editor background
   * @param {string} backgroundClass - Background class name
   */
  static setEditorBackground(backgroundClass = 'none') {
    try {
      import('../utils/storageManager.js').then((storageManager) => {
        storageManager.default.setEditorBackground(backgroundClass);
        ThemeLoader.applyBackgroundImages();
      });
    } catch (error) {
      console.warn('Failed to set editor background:', error);
    }
  }

  /**
   * Set output background
   * @param {string} backgroundClass - Background class name
   */
  static setOutputBackground(backgroundClass = 'none') {
    try {
      import('../utils/storageManager.js').then((storageManager) => {
        storageManager.default.setOutputBackground(backgroundClass);
        ThemeLoader.applyBackgroundImages();
      });
    } catch (error) {
      console.warn('Failed to set output background:', error);
    }
  }

  /**
   * Get available background options
   * @returns {Array} Array of background option objects
   */
  static getAvailableBackgrounds() {
    return [
      { value: 'none', label: 'None', description: 'No background image' },
      { value: 'bg-space', label: 'Space', description: 'NASA space image' },
      {
        value: 'bg-circuit',
        label: 'Circuit Board',
        description: 'Electronic circuit pattern',
      },
      {
        value: 'bg-code-gradient',
        label: 'Code Gradient',
        description: 'Smooth gradient background',
      },
      {
        value: 'bg-matrix',
        label: 'Matrix Rain',
        description: 'Animated green matrix effect',
      },
      {
        value: 'bg-coffee-shop',
        label: 'Coffee Shop',
        description: 'Cozy coffee shop ambiance',
      },
      {
        value: 'bg-minimal-dark',
        label: 'Minimal Dark',
        description: 'Clean gradient background',
      },
      {
        value: 'bg-minimal-light',
        label: 'Minimal Light',
        description: 'Bright gradient background',
      },
      {
        value: 'bg-blue-grid',
        label: 'Blue Grid',
        description: 'Geometric grid pattern',
      },
    ];
  }
}

// Create global theme loader instance
const themeLoader = new ThemeLoader();

// Export for use in other modules
export { ThemeLoader, themeLoader };
export default themeLoader;
