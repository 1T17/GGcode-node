/**
 * GGcode Syntax Highlighting and Tokenization
 * Provides syntax highlighting rules and tokenization for GGcode language
 */

class GGcodeSyntax {
  /**
   * Get GGcode language configuration for Monaco
   * @returns {Object} Language configuration
   */
  static getLanguageConfig() {
    return {
      id: 'ggcode',
      extensions: ['.ggcode'],
      aliases: ['GGcode', 'ggcode'],
      mimetypes: ['text/ggcode'],
    };
  }

  /**
   * Get Monaco tokenizer configuration for GGcode
   * @returns {Object} Tokenizer configuration
   */
  static getTokenizerConfig() {
    return {
      keywords: [
        'let',
        'if',
        'else',
        'for',
        'while',
        'function',
        'return',
        'note',
      ],
      constants: ['PI', 'E', 'TAU', 'DEG_TO_RAD'],
      builtins: [
        'abs',
        'mod',
        'sin',
        'cos',
        'tan',
        'sqrt',
        'hypot',
        'floor',
        'ceil',
        'round',
        'clamp',
        'distance',
      ],
      operators: ['=', '+', '-', '*', '/', '%', '..'],
      symbols: /[=><!~?:&|+\-*/^%]+/,

      tokenizer: {
        root: [
          // Axis with bracketed variables (e.g., X[f], Y[y+1])
          [/\bX\[[^\]]+\]/, 'axis.x'],
          [/\bY\[[^\]]+\]/, 'axis.y'],
          [/\bZ\[[^\]]+\]/, 'axis.z'],
          [/\bA\[[^\]]+\]/, 'axis.a'],
          [/\bB\[[^\]]+\]/, 'axis.b'],
          [/\bC\[[^\]]+\]/, 'axis.c'],
          [/\bE\[[^\]]+\]/, 'axis.e'],
          [/\bF\[[^\]]+\]/, 'axis.f'],
          [/\bS\[[^\]]+\]/, 'axis.s'],
          [/\bT\[[^\]]+\]/, 'axis.t'],
          [/\bH\[[^\]]+\]/, 'axis.h'],
          [/\bR\[[^\]]+\]/, 'axis.r'],
          [/\bP\[[^\]]+\]/, 'axis.p'],

          // Axis with numeric values
          [/\bX[+-]?[0-9.]+\b/, 'axis.x'],
          [/\bY[+-]?[0-9.]+\b/, 'axis.y'],
          [/\bZ[+-]?[0-9.]+\b/, 'axis.z'],
          [/\bA[+-]?[0-9.]+\b/, 'axis.a'],
          [/\bB[+-]?[0-9.]+\b/, 'axis.b'],
          [/\bC[+-]?[0-9.]+\b/, 'axis.c'],
          [/\bE[+-]?[0-9.]+\b/, 'axis.e'],
          [/\bF[+-]?[0-9.]+\b/, 'axis.f'],
          [/\bS[+-]?[0-9.]+\b/, 'axis.s'],
          [/\bT[+-]?[0-9.]+\b/, 'axis.t'],
          [/\bH[+-]?[0-9.]+\b/, 'axis.h'],
          [/\bR[+-]?[0-9.]+\b/, 'axis.r'],
          [/\bP[+-]?[0-9.]+\b/, 'axis.p'],
          [/\bN[+-]?[0-9.]+\b/, 'nline'],

          // Keywords
          [/\b(let|if|else|for|while|function|return|note)\b/, 'keyword'],

          // Built-in constants
          [/\b(PI|E|TAU|DEG_TO_RAD)\b/, 'constant'],

          // Built-in functions
          [
            /\b(abs|mod|sin|cos|tan|sqrt|hypot|floor|ceil|round|clamp|distance)\b/,
            'predefined',
          ],

          // G-code / M-code
          [/\b(G\d+|M\d+)\b/, 'gcode'],

          // Axis with numeric values (fallback)
          [/\b([XYZABC][+-]?[0-9.]+)\b/, 'axis'],
          [/\b([FSTHRP][+-]?[0-9.]+)\b/, 'axis'],

          // Variables in brackets like [x], [x+1]
          [/\[[^\]]+]/, 'variable'],

          // Numbers
          [/\b\d+(\.\d+)?\b/, 'number'],

          // Line comments
          [/\/\/.*$/, 'comment'],

          // Multiline comments /% ... %/
          [/%\/.*$/, 'comment', '@blockComment'],

          // Brackets and symbols
          [/[{}[\]()]/, '@brackets'],

          [
            /[a-zA-Z_]\w*/,
            {
              cases: {
                '@keywords': 'keyword',
                '@constants': 'constant',
                '@builtins': 'predefined',
                '@default': 'identifier',
              },
            },
          ],
        ],

        blockComment: [
          [/.*%\//, 'comment', '@pop'],
          [/.*$/, 'comment'],
        ],
      },
    };
  }

  /**
   * Get GGcode dark theme configuration
   * @returns {Object} Theme configuration
   */
  static getThemeConfig() {
    return {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '6FBAE3' },
        { token: 'gcode', foreground: '#F21B3F' },
        { token: 'axis', foreground: 'ff66cc' },
        { token: 'number', foreground: 'D0ECB1' },
        { token: 'comment', foreground: '#577834', fontStyle: 'italic' },
        { token: 'variable', foreground: 'ffaa00' },
        { token: 'constant', foreground: '00ff99' },
        { token: 'predefined', foreground: 'ff66cc' },
        { token: 'identifier', foreground: '#F5F5F5' },
        // Axis color-coded per CNC convention
        { token: 'axis.x', foreground: '#D9372B' }, // Soft red
        { token: 'axis.y', foreground: '#57C24F' }, // Soft green
        { token: 'axis.z', foreground: '#3B65B8' }, // Soft blue
        { token: 'axis.a', foreground: 'ff99ff' }, // Soft magenta
        { token: 'axis.b', foreground: '99ffff' }, // Soft cyan
        { token: 'axis.c', foreground: 'ffff99' }, // Soft yellow
        { token: 'axis.e', foreground: 'ffdddd' }, // Soft light red
        { token: 'axis.f', foreground: 'aaaaaa' }, // Soft gray
        { token: 'axis.s', foreground: 'ffbb66' }, // Soft orange
        { token: 'axis.t', foreground: '#B02BD9' }, // Soft purple
        { token: 'axis.h', foreground: 'bbbbff' }, // Soft light blue
        { token: 'axis.r', foreground: 'aaffaa' }, // Soft light green
        { token: 'axis.p', foreground: 'bbffff' }, // Soft pale cyan
        { token: 'nline', foreground: '#5C5C5C' }, // Soft gray
      ],
      colors: {},
    };
  }

  /**
   * Register GGcode language with Monaco editor
   * @param {Object} monaco - Monaco editor instance
   */
  static registerLanguage(monaco) {
    const config = this.getLanguageConfig();
    const tokenizerConfig = this.getTokenizerConfig();

    monaco.languages.register(config);
    monaco.languages.setMonarchTokensProvider(config.id, tokenizerConfig);
  }

  /**
   * Register GGcode theme with Monaco editor
   * @param {Object} monaco - Monaco editor instance
   * @param {string} themeName - Name for the theme (default: 'ggcode-dark')
   */
  static registerTheme(monaco, themeName = 'ggcode-dark') {
    const themeConfig = this.getThemeConfig();
    monaco.editor.defineTheme(themeName, themeConfig);
  }

  /**
   * Get token type for a given text
   * @param {string} text - Text to analyze
   * @returns {string} Token type
   */
  static getTokenType(text) {
    const tokenizerConfig = this.getTokenizerConfig();

    // Check keywords
    if (tokenizerConfig.keywords.includes(text)) {
      return 'keyword';
    }

    // Check constants
    if (tokenizerConfig.constants.includes(text)) {
      return 'constant';
    }

    // Check builtins
    if (tokenizerConfig.builtins.includes(text)) {
      return 'predefined';
    }

    // Check G-code/M-code pattern
    if (/^[GM]\d+$/i.test(text)) {
      return 'gcode';
    }

    // Check axis patterns
    if (/^[XYZABCEFSTHRP][+-]?[0-9.]+$/i.test(text)) {
      const axis = text.charAt(0).toLowerCase();
      return `axis.${axis}`;
    }

    // Check variables in brackets
    if (/^\[[^\]]+\]$/.test(text)) {
      return 'variable';
    }

    // Check numbers
    if (/^\d+(\.\d+)?$/.test(text)) {
      return 'number';
    }

    // Check comments
    if (text.startsWith('//')) {
      return 'comment';
    }

    return 'identifier';
  }

  /**
   * Parse a line of GGcode and return token information
   * @param {string} line - Line to parse
   * @returns {Array} Array of token objects
   */
  static parseLine(line) {
    const tokens = [];
    // const tokenizerConfig = this.getTokenizerConfig(); // TODO: Use for advanced tokenization

    // Simple tokenization - split by whitespace and analyze each part
    const parts = line.trim().split(/\s+/);

    for (const part of parts) {
      if (part) {
        const tokenType = this.getTokenType(part);
        tokens.push({
          text: part,
          type: tokenType,
          startIndex: line.indexOf(part),
          endIndex: line.indexOf(part) + part.length,
        });
      }
    }

    return tokens;
  }

  /**
   * Get color for a token type
   * @param {string} tokenType - Token type
   * @returns {string} Color hex code
   */
  static getTokenColor(tokenType) {
    const themeConfig = this.getThemeConfig();
    const rule = themeConfig.rules.find((r) => r.token === tokenType);
    return rule ? `#${rule.foreground}` : '#F5F5F5';
  }
}

export default GGcodeSyntax;
