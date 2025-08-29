/**
 * Monaco Editor Manager
 * Handles Monaco editor initialization, configuration, and management
 */

import storageManager from '../utils/storageManager.js';
import themeManager from './themes.js';
import settingsManager from './settings.js';

class MonacoEditorManager {
  constructor() {
    this.editor = null;
    this.outputEditor = null;
    this.monacoReady = false;
    this.autoCompile = false;
    this.autoCompileTimeout = null;
    this.lastOpenedFilename = '';
    this.skipAutoCompile = false;

    // User-defined function support
    this.userFunctions = new Map();
    this.functionParseTimeout = null;
    this.userFunctionCache = {};

    // Completion data from external JSON files
    this.completionData = {
      keywords: null,
      functions: null,
      constants: null,
      axes: null,
      operators: null,
      brackets: null,
      paramMappings: null,
      tokenizer: null,
      languageConfig: null,
      hoverConstants: null,
      hoverKeywords: null,
      hoverFunctions: null,
      signatures: null,
      millDictionary: null,
      millAnnotations: null,
    };
  }

  /**
   * Initialize Monaco editor with GGcode language support
   * @param {Object} options - Configuration options
   * @param {string} options.inputContainerId - ID of input editor container
   * @param {string} options.outputContainerId - ID of output editor container
   * @param {string} options.initialInput - Initial input content
   * @param {string} options.initialOutput - Initial output content
   * @param {Function} options.onCompile - Callback for compilation
   * @param {Function} options.onAnnotationUpdate - Callback for annotation updates
   */
  async initialize(options = {}) {
    const {
      inputContainerId = 'editor',
      outputContainerId = 'output',
      initialInput = '',
      initialOutput = '',
      onCompile = null,
      onAnnotationUpdate = null,
    } = options;

    // Always check for global Monaco first (works for both webpack and AMD loading)
    return new Promise((resolve, reject) => {
      const initializeEditor = async () => {
        try {
          //console.log('MonacoEditorManager: Monaco available, initializing editors...');
          await this._loadCompletionData();
          await themeManager.loadAndInitializeTheme(); // Load theme BEFORE language registration for proper syntax highlighting
          this._registerGGcodeLanguage();
          this._createEditors(
            inputContainerId,
            outputContainerId,
            initialInput,
            initialOutput
          );
          this._setupEventHandlers(onCompile, onAnnotationUpdate);
          this._setupDragAndDrop();

          this.monacoReady = true;
          // Parse user functions from initial content
          this._parseUserFunctions();

          //console.log('MonacoEditorManager: Initialization complete!');
          resolve();
        } catch (error) {
          console.error('MonacoEditorManager: Initialization failed:', error);
          reject(error);
        }
      };

      // Check if Monaco is already available globally
      if (typeof window.monaco !== 'undefined') {
        //console.log('MonacoEditorManager: Monaco already available globally');
        initializeEditor();
      } else {
        // Load Monaco dynamically using the global require (from loader.js)
        //console.log('MonacoEditorManager: Loading Monaco dynamically...');

        const loadMonaco = () => {
          // Check if the global require from loader.js is available
          if (
            typeof window.require !== 'undefined' &&
            typeof window.require.config === 'function'
          ) {
            //console.log('MonacoEditorManager: Using global require to load Monaco');

            // Configure Monaco paths
            window.require.config({
              paths: {
                vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs',
              },
            });

            // Load Monaco
            window.require(['vs/editor/editor.main'], () => {
              //console.log('MonacoEditorManager: Monaco loaded successfully');
              initializeEditor();
            });
          } else {
            // Fallback: wait for Monaco to be available
            //console.log('MonacoEditorManager: Waiting for Monaco...');
            let attempts = 0;
            const maxAttempts = 50; // Wait up to 5 seconds

            const checkMonaco = () => {
              attempts++;
              if (typeof window.monaco !== 'undefined') {
                //console.log('MonacoEditorManager: Monaco became available after', attempts * 100, 'ms');
                initializeEditor();
              } else if (attempts < maxAttempts) {
                setTimeout(checkMonaco, 100);
              } else {
                console.error(
                  'MonacoEditorManager: Timeout waiting for Monaco to load'
                );
                reject(
                  new Error('Monaco Editor failed to load within timeout')
                );
              }
            };
            checkMonaco();
          }
        };

        // Give the loader.js a moment to set up the global require
        setTimeout(loadMonaco, 100);
      }
    });
  }

  /**
   * Load completion data from external JSON files
   * @private
   * @returns {Promise} Promise that resolves when all completion data is loaded
   */
  async _loadCompletionData() {
    const files = {
      keywords: '/data/completions/ggcode-keywords.json',
      functions: '/data/completions/ggcode-functions.json',
      constants: '/data/completions/ggcode-constants.json',
      axes: '/data/completions/ggcode-axes.json',
      operators: '/data/completions/ggcode-operators.json',
      brackets: '/data/completions/ggcode-brackets.json',
      paramMappings: '/data/completions/ggcode-param-mappings.json',
      tokenizer: '/data/completions/ggcode-tokenizer.json',
      languageConfig: '/data/completions/ggcode-language-config.json',
      hoverConstants: '/data/completions/ggcode-hover-constants.json',
      hoverKeywords: '/data/completions/ggcode-hover-keywords.json',
      hoverFunctions: '/data/completions/ggcode-hover-functions.json',
      signatures: '/data/completions/ggcode-signatures.json',
      millDictionary: '/mill-dictionary.json',
      millAnnotations: '/mill-annotations.json',
    };

    const loadPromises = Object.entries(files).map(async ([key, filePath]) => {
      try {
        const response = await fetch(filePath);
        if (response.ok) {
          const data = await response.json();
          this.completionData[key] = data;
        } else {
          console.warn(
            `Failed to load ${key} completion data: ${response.status}`
          );
        }
      } catch (error) {
        console.warn(`⚠️ Error loading ${key} completion data:`, error.message);
      }
    });

    await Promise.all(loadPromises);
  }

  /**
   * Register GGcode language with Monaco
   * @private
   */
  _registerGGcodeLanguage() {
    monaco.languages.register({ id: 'ggcode' });

    // Register comprehensive completion provider for GGcode
    this._registerCompletionProvider();

    // Register hover provider for better documentation
    this._registerHoverProvider();

    // Register signature help for function parameters
    this._registerSignatureHelpProvider();

    // Set language configuration for GGcode using JSON data
    if (this.completionData.languageConfig) {
      const config = this.completionData.languageConfig.languageConfiguration;
      monaco.languages.setLanguageConfiguration('ggcode', {
        brackets: config.brackets,
        autoClosingPairs: config.autoClosingPairs,
        surroundingPairs: config.surroundingPairs,
        folding: {
          markers: {
            start: new RegExp(config.folding.markers.start),
            end: new RegExp(config.folding.markers.end),
          },
        },
      });
    } else {
      console.warn('⚠️ Language configuration not loaded, using defaults');
    }

    // Use completion data loaded at startup - fallback to minimal sets if JSON failed
    const keywords = this.completionData.keywords
      ? this.completionData.keywords.keywords.map((kw) => kw.word)
      : ['let', 'if', 'else', 'for', 'while', 'function', 'return', 'note'];

    const constants = this.completionData.constants
      ? this.completionData.constants.constants.map((constant) => constant.name)
      : ['PI', 'E', 'TAU', 'DEG_TO_RAD'];

    const builtins = this.completionData.functions
      ? this.completionData.functions.functions.map((func) => func.name)
      : [
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
        ];

    // Create dynamic regex patterns for tokenizer using JSON configuration
    const keywordPattern =
      keywords.length > 0
        ? new RegExp(`\\b(${keywords.join('|')})\\b`)
        : /\b(dummy)\b/;
    const constantPattern =
      constants.length > 0
        ? new RegExp(`\\b(${constants.join('|')})\\b`)
        : /\b(dummy)\b/;
    const builtinPattern =
      builtins.length > 0
        ? new RegExp(`\\b(${builtins.join('|')})\\b`)
        : /\b(dummy)\b/;

    // Build dynamic tokenizer using JSON configuration
    if (!this.completionData.tokenizer) {
      console.warn('⚠️ Tokenizer configuration not loaded');
      return;
    }

    const tokenizerConfig = this.completionData.tokenizer.tokenizer;
    const axisChars = tokenizerConfig.axisCharacters || 'XYZABCEFSHTHRPN';

    // Get language configuration patterns from JSON
    const langConfig = this.completionData.languageConfig;

    // Build dynamic tokenizer rules
    const tokenizerRules = [];

    // Generate axis patterns dynamically
    const axisTypes = {};
    for (const char of axisChars) {
      // Axis with bracketed variables (e.g., X[f], Y[y+1]) - HIGHER PRIORITY
      tokenizerRules.push([
        new RegExp(`\\b${char}\\[([^\\]]+)\\]`),
        `axis-with-var.${char.toLowerCase()}`,
      ]);

      // Axis with numeric values (e.g., X123.45, Y-789) - MEDIUM PRIORITY
      tokenizerRules.push([
        new RegExp(`\\b${char}[-+]?[0-9]*\\.?[0-9]+\\b`),
        `axis.${char.toLowerCase()}`,
      ]);

      // Map for word matching
      axisTypes[char] = `axis.${char.toLowerCase()}`;
    }

    // Add N-line pattern (for line numbers)
    if (axisChars.includes('N')) {
      tokenizerRules.push([/\bN[+-]?[0-9.]+\b/, 'nline']);
    }

    // Add predefined patterns using JSON configuration - each as separate push for proper tokenizer structure
    // G-code / M-code patterns with differentiated token types for better color coding

    // Rapid positioning (G0) - Yellow/green color
    tokenizerRules.push([/\bG0\b/, 'gcode-rapid']);

    // Linear interpolation (G1) - Blue color
    tokenizerRules.push([/\bG1\b/, 'gcode-linear']);

    // Arc moves (G2/G3) - Purple color
    tokenizerRules.push([/\b(G2|G3)\b/, 'gcode-arc']);

    // Dwell (G4) - Orange color
    tokenizerRules.push([/\bG4\b/, 'gcode-dwell']);

    // Drill cycles (G8x) - Dark green color
    tokenizerRules.push([/\bG8[0-9]\b/, 'gcode-drill']);

    // Boring/cutoff cycles (G76-G89) - Dark blue color
    tokenizerRules.push([/\bG[7-8][6-9]\b/, 'gcode-bore']);

    // Reference position returns (G28/G30) - Cyan color
    tokenizerRules.push([/\bG2[89]|G30\b/, 'gcode-ref']);

    // Rigid tapping (G84) - Gold color
    tokenizerRules.push([/\bG84\b/, 'gcode-tap']);

    // Other G-codes (directory setting, coordinate system, etc.) - Default G-code red
    tokenizerRules.push([/\bG\d+\b/, 'gcode']);

    // Spindle commands (M3/M4/M5) - Orange color
    tokenizerRules.push([/\b(M3|M4|M5)\b/, 'mcode-spindle']);

    // Tool change (M6) - Purple color
    tokenizerRules.push([/\bM6\b/, 'mcode-toolchange']);

    // Coolant commands (M7/M8/M9) - Cyan color
    tokenizerRules.push([/\b(M7|M8|M9)\b/, 'mcode-coolant']);

    // Program control (M0/M1/M2/M30) - Yellow color
    tokenizerRules.push([/\b(M0|M1|M2|M30)\b/, 'mcode-control']);

    // Other M-codes - Default M-code color
    tokenizerRules.push([/\bM\d+\b/, 'mcode']);

    // Dynamic patterns using loaded JSON data (keywords come after G-codes)
    tokenizerRules.push([keywordPattern, 'keyword']);
    tokenizerRules.push([constantPattern, 'constant']);
    tokenizerRules.push([builtinPattern, 'predefined']);

    // Axis fallback patterns using JSON templates
    tokenizerRules.push([
      new RegExp(
        langConfig.axisFallbackPattern1
          .replace(/\{axis0\}/g, axisChars.charAt(0))
          .replace(/\{axis1\}/g, axisChars.charAt(1))
          .replace(/\{axis2\}/g, axisChars.charAt(2))
      ),
      'axis',
    ]);
    tokenizerRules.push([new RegExp(langConfig.axisFallbackPattern2), 'axis']);

    // General bracketed variables (lower priority)
    tokenizerRules.push([/\b[A-Z]\[[^\]]+\]/, 'variable-bracket']);

    // Variable assignments (let var_name = value) - HIGHEST priority for consistency
    tokenizerRules.push([/\blet\s+([a-zA-Z_]\w*)\b/, 'variable-declaration']);

    // Variables in brackets using JSON pattern (fallback)
    tokenizerRules.push([new RegExp(langConfig.variablePattern), 'variable']);

    // General variable references (higher priority than identifiers)
    tokenizerRules.push([/\b[a-zA-Z_]\w*\b/, 'variable-reference']);

    // Numbers using JSON pattern
    tokenizerRules.push([
      new RegExp(`\\b${langConfig.numberPattern}\\b`),
      'number',
    ]);

    // Comments using JSON comment patterns
    tokenizerRules.push([
      new RegExp(`${tokenizerConfig.commentPatterns.lineComment}.*$`),
      'comment',
    ]);
    tokenizerRules.push([
      new RegExp(`${tokenizerConfig.commentPatterns.blockCommentStart}.*$`),
      'comment',
      '@blockComment',
    ]);

    // Dynamic brackets using JSON bracket symbols
    tokenizerRules.push([
      new RegExp(`[${langConfig.bracketSymbols}]`),
      'bracket',
    ]);

    // Build block comment pattern from JSON
    const blockEndPattern =
      tokenizerConfig.commentPatterns.blockCommentEnd || '%/';

    monaco.languages.setMonarchTokensProvider('ggcode', {
      keywords: keywords,
      constants: constants,
      builtins: builtins,
      operators: tokenizerConfig.operators || [
        '=',
        '+',
        '-',
        '*',
        '/',
        '%',
        '..',
      ],
      symbols: new RegExp(`[${langConfig.tokenizerSymbolsPattern}]`),

      tokenizer: {
        root: tokenizerRules,

        blockComment: [
          [new RegExp(`.*${blockEndPattern}`), 'comment', '@pop'],
          [/.*$/, 'comment'],
        ],
      },
    });
  }

  /**
   * Register comprehensive completion provider for GGcode language
   * Provides IntelliSense-style completion suggestions for all GGcode elements
   * @private
   */
  _registerCompletionProvider() {
    // Store reference to help system for dictionary access
    this.helpSystem = window.applicationManager?.getHelpSystem?.();

    // Register the main completion item provider
    monaco.languages.registerCompletionItemProvider('ggcode', {
      provideCompletionItems: (model, position, _context, _token) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = [];

        // Add context-aware completions based on current line content
        const lineContent = model.getLineContent(position.lineNumber);
        const linePrefix = lineContent.substring(0, position.column - 1);

        // Unified completion processing - combine all sources with proper priority sorting
        const allCompletions = [];

        // Standard completions (G-codes, M-codes, functions, constants, etc.)
        allCompletions.push(...this._getGcodeCompletions(range));
        allCompletions.push(...this._getMcodeCompletions(range));
        allCompletions.push(...this._getKeywordCompletions(range));
        allCompletions.push(...this._getFunctionCompletions(range));
        allCompletions.push(...this._getConstantCompletions(range));
        allCompletions.push(...this._getAxisCompletions(range));
        allCompletions.push(...this._getOperatorCompletions(range));
        allCompletions.push(...this._getBracketCompletions(range));

        // User-defined function completions (higher priority)
        allCompletions.push(...this._getUserFunctionCompletions(range));

        // Context-aware axis parameters when user types G/M codes
        if (linePrefix.match(/\b(G\d+|M\d+)\s*$/)) {
          allCompletions.push(...this._getAxisParametersCompletions(range));
        }

        // External dictionary and annotation completions (lowest priority)
        if (this.helpSystem?.dictionaryCache) {
          allCompletions.push(
            ...this._getMillDictionaryCompletions(range, linePrefix)
          );
        }
        if (this.helpSystem?.annotationsCache) {
          allCompletions.push(
            ...this._getMillAnnotationsCompletions(range, linePrefix)
          );
        }

        // Sort all completions by sortText to ensure consistent priority
        suggestions.push(
          ...allCompletions.sort((a, b) => a.sortText.localeCompare(b.sortText))
        );

        return {
          suggestions: suggestions,
          incomplete: false,
        };
      },

      triggerCharacters: [
        'G',
        'M',
        'g',
        'm',
        'x',
        'y',
        'z',
        'a',
        'b',
        'c',
        'f',
        's',
        't',
        'h',
        'r',
        'p',
        'l',
        'i',
        'f',
        'w',
        '(',
        '[',
        ' ',
      ],
    });
  }

  /**
   * Get G-code completion items from mill dictionary JSON data
   * @private
   */
  _getGcodeCompletions(range) {
    const gcodes = this.completionData.millDictionary || {};

    if (!gcodes || Object.keys(gcodes).length === 0) {
      console.warn('⚠️ Mill dictionary JSON not loaded for G-code completions');
      return [];
    }

    const completions = [];

    for (const [gcode, definition] of Object.entries(gcodes)) {
      if (gcode.startsWith('G') && gcode.length >= 2) {
        const description = definition.desc || 'G-code command';
        let detail = gcode;
        let usage = gcode;

        // Build usage string from parameters
        if (definition.sub && Object.keys(definition.sub).length > 0) {
          const params = Object.keys(definition.sub).join(' ');
          usage = `${gcode} ${params}`;
          detail = `Usage: ${usage}`;
        }

        const completionItem = {
          label: gcode,
          kind: monaco.languages.CompletionItemKind.Class,
          detail: detail,
          documentation: {
            value: `**${gcode}** - ${description}${
              definition.sub
                ? '\n\nParameters:\n' +
                  Object.entries(definition.sub)
                    .map(([param, desc]) => `  ${param}: ${desc}`)
                    .join('\n')
                : ''
            }`,
          },
          insertText: gcode,
          sortText: `01${gcode}`,
          range: range,
        };

        // Validate the completion item
        if (!completionItem.label || !completionItem.insertText) {
          console.warn(
            `⚠️ Invalid completion item for ${gcode}:`,
            completionItem
          );
          continue;
        }

        completions.push(completionItem);
      }
    }

    return completions;
  }

  /**
   * Get M-code completion items from mill dictionary JSON data
   * @private
   */
  _getMcodeCompletions(range) {
    const mcodes = this.completionData.millDictionary || {};

    if (!mcodes || Object.keys(mcodes).length === 0) {
      console.warn('⚠️ Mill dictionary JSON not loaded for M-code completions');
      return [];
    }

    const completions = [];
    for (const [mcode, definition] of Object.entries(mcodes)) {
      if (mcode.startsWith('M') && mcode.length >= 2) {
        const description = definition.desc || 'M-code command';
        let detail = mcode;
        let usage = mcode;

        // Build usage string from parameters
        if (definition.sub && Object.keys(definition.sub).length > 0) {
          const params = Object.keys(definition.sub).join(' ');
          usage = `${mcode} ${params}`;
          detail = `Usage: ${usage}`;
        }

        completions.push({
          label: mcode,
          kind: monaco.languages.CompletionItemKind.Interface,
          detail: detail,
          documentation: {
            value: `**${mcode}** - ${description}${
              definition.sub
                ? '\n\nParameters:\n' +
                  Object.entries(definition.sub)
                    .map(([param, desc]) => `  ${param}: ${desc}`)
                    .join('\n')
                : ''
            }`,
          },
          insertText: mcode,
          sortText: `02${mcode}`,
          range: range,
        });
      }
    }

    return completions;
  }

  /**
   * Get keyword completion items from external JSON only
   * @private
   */
  _getKeywordCompletions(range) {
    if (!this.completionData.keywords) {
      console.warn('⚠️ Keywords JSON not loaded');
      return [];
    }

    const { keywords } = this.completionData.keywords;
    return keywords.map((kw) => ({
      label: kw.word,
      kind: monaco.languages.CompletionItemKind.Keyword,
      detail: kw.detail,
      documentation: {
        value: `**${kw.word}** - ${kw.description}\n\nExample: \`${kw.detail}\``,
      },
      insertText: kw.snippet || kw.word,
      insertTextRules: kw.snippet
        ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        : undefined,
      sortText: `10${kw.word}`,
      range: range,
    }));
  }

  /**
   * Get mathematical function completion items from external JSON only
   * @private
   */
  _getFunctionCompletions(range) {
    if (!this.completionData.functions) {
      console.warn('⚠️ Functions JSON not loaded');
      return [];
    }

    const { functions } = this.completionData.functions;
    return functions.map((func) => ({
      label: func.name,
      kind: monaco.languages.CompletionItemKind.Function,
      detail: func.detail,
      documentation: {
        value: `**${func.name}** - ${func.description}\n\nUsage: \`${func.detail}\``,
      },
      insertText: func.snippet,
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      sortText: `30${func.name}`,
      range: range,
    }));
  }

  /**
   * Get constant completion items from external JSON only
   * @private
   */
  _getConstantCompletions(range) {
    if (!this.completionData.constants) {
      console.warn('⚠️ Constants JSON not loaded');
      return [];
    }

    const { constants } = this.completionData.constants;
    return constants.map((constant) => ({
      label: constant.name,
      kind: monaco.languages.CompletionItemKind.Constant,
      detail: constant.detail,
      documentation: {
        value: `**${constant.name}** - ${constant.description}\n\nValue: ${constant.detail}`,
      },
      insertText: constant.name,
      sortText: `20${constant.name}`,
      range: range,
    }));
  }

  /**
   * Get axis completion items from external JSON only
   * @private
   */
  _getAxisCompletions(range) {
    if (!this.completionData.axes) {
      console.warn('⚠️ Axes JSON not loaded');
      return [];
    }

    const { axes } = this.completionData.axes;
    return axes.map((axis) => ({
      label: axis.axis,
      kind: monaco.languages.CompletionItemKind.Variable,
      detail: axis.description,
      documentation: {
        value: `**${axis.axis}** - ${axis.description}\n\nExample: \`${axis.snippet}\``,
      },
      insertText: axis.snippet,
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      sortText: `40${axis.axis}`,
      range: range,
    }));
  }

  /**
   * Get operator completion items from external JSON only
   * @private
   */
  _getOperatorCompletions(range) {
    if (!this.completionData.operators) {
      console.warn('⚠️ Operators JSON not loaded');
      return [];
    }

    const { operators } = this.completionData.operators;
    return operators.map((operator) => ({
      label: operator.op,
      kind: monaco.languages.CompletionItemKind.Operator,
      detail: operator.detail,
      documentation: {
        value: `**${operator.op}** - ${operator.description}\n\nExample: \`${operator.detail}\``,
      },
      insertText: operator.op,
      sortText: `50${operator.op}`,
      range: range,
    }));
  }

  /**
   * Get bracket completion items from external JSON only
   * @private
   */
  _getBracketCompletions(range) {
    if (!this.completionData.brackets) {
      console.warn('⚠️ Brackets JSON not loaded');
      return [];
    }

    const { brackets } = this.completionData.brackets;
    return brackets
      .map((bracket) => {
        if (bracket.snippet) {
          return {
            label: bracket.pair,
            kind: monaco.languages.CompletionItemKind.Snippet,
            detail: bracket.description,
            documentation: { value: bracket.description },
            insertText: bracket.snippet,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: `60${bracket.pair}`,
            range: range,
          };
        } else {
          const label = bracket.pair.replace(
            /\{|\[|\(|\}|\]|\)/,
            (match) => match
          ); // Keep the original bracket
          if (!label) {
            console.warn('⚠️ Empty label for bracket:', bracket);
            return null; // Skip invalid brackets
          }
          return {
            label: label,
            kind: monaco.languages.CompletionItemKind.Value,
            detail: bracket.description,
            documentation: { value: bracket.description },
            insertText: label,
            sortText: `60${bracket.pair}`,
            range: range,
          };
        }
      })
      .filter((item) => item !== null); // Remove null items
  }

  /**
   * Get mill dictionary completions (shows detailed G/M-codes with parameters)
   * @private
   */
  _getMillDictionaryCompletions(range, linePrefix) {
    const completions = [];
    const helpSystem = window.applicationManager?.getHelpSystem?.();
    const dictionary = helpSystem?.dictionaryCache;

    if (!dictionary) return completions;

    // Get user input to filter completions
    const word = linePrefix.toUpperCase();

    for (const [gcode, definition] of Object.entries(dictionary)) {
      // Skip single characters like "F", "S", "T" etc. - those are handled elsewhere
      if (gcode.length === 1) continue;

      // Filter based on what user has typed
      if (word && !gcode.startsWith(word)) continue;

      let description = definition.desc || 'G/M-code command';
      let detail = gcode;
      let usage = gcode;

      // Build full usage string from parameters
      if (definition.sub && Object.keys(definition.sub).length > 0) {
        const params = Object.keys(definition.sub).join(' ');
        usage = `${gcode} ${params}`;
        detail = `Usage: ${usage}`;

        // Create detailed parameter documentation
        const paramDocs = Object.entries(definition.sub)
          .map(([param, desc]) => `  ${param}: ${desc}`)
          .join('\n');

        description = description + '\n\nParameters:\n' + paramDocs;
      }

      completions.push({
        label: gcode,
        kind: monaco.languages.CompletionItemKind.Class,
        detail: detail,
        documentation: {
          value: `**${gcode}** - ${description}`,
        },
        insertText: gcode,
        sortText: `000${gcode}`, // Very high priority for official G/M-codes
        range: range,
      });
    }

    return completions;
  }

  /**
   * Get mill annotations completions (shows parameter syntax and smart completions)
   * Enhanced to support both G1/G01 formats and improved full line completion
   * @private
   */
  _getMillAnnotationsCompletions(range, linePrefix) {
    const completions = [];
    const helpSystem = window.applicationManager?.getHelpSystem?.();
    const annotations = helpSystem?.annotationsCache;

    if (!annotations) {
      return completions;
    }

    // Get user input to filter completions
    const word = linePrefix.toUpperCase();
    const isGCode = word.startsWith('G');
    const isMCode = word.startsWith('M');

    if (!isGCode && !isMCode) return completions;

    // Process each annotation entry
    for (const [description, usage] of Object.entries(annotations)) {
      // Skip single-character annotations and non-motion commands
      if (usage.length <= 2 || /^\s*[A-Z](\s+[A-Z])*\s*$/.test(usage)) {
        continue;
      }

      // Extract G/M code from usage
      const gcodeMatch = usage.match(/^[GM]\d+/);
      const gcode = gcodeMatch ? gcodeMatch[0] : null;

      if (!gcode) continue;

      // Enhanced matching logic to handle both G1 and G01 formats
      let shouldInclude = false;
      let altCode = null;

      if (gcode.length === 2) {
        // G1 format - check if user's input matches G1 or G01
        if (word === gcode || word === gcode[0] + '0' + gcode[1]) {
          shouldInclude = true;
          altCode = word;
        }
      } else if (gcode.length === 3 && gcode[1] === '0') {
        // G01 format - check if user's input matches G01 or G1
        const shortForm = gcode[0] + gcode[2];
        if (word === gcode || word === shortForm) {
          shouldInclude = true;
          altCode = word;
        }
      }

      // Alternative: check if word starts with G/M code (case insensitive)
      if (
        !shouldInclude &&
        word &&
        gcode.toUpperCase().startsWith(word.toUpperCase())
      ) {
        shouldInclude = true;
        altCode = gcode;
      }

      // Additional fuzzy matching for common patterns
      if (!shouldInclude && word && word.length >= 2) {
        // For example, "35" should match G35, "rapid" could match G00, etc.
        const searchNum = parseInt(word);
        if (searchNum && gcode.match(/G\d+/)) {
          const gcodeNum = parseInt(gcode.slice(1));
          if (searchNum === gcodeNum) {
            shouldInclude = true;
            altCode = gcode;
          }
        }
      }

      if (!shouldInclude) continue;

      // Use the matching code for display (user's format preference)
      const displayCode = altCode || gcode;
      const isFullLinePreset = description.startsWith('FULL LINE PRESET');

      // Add completion for valid code

      // Option 1: Just the G/M code (for basic completion)
      completions.push({
        label: `${isFullLinePreset ? '📋 ' : ''}${displayCode}`,
        kind: monaco.languages.CompletionItemKind.Property,
        detail: `${isFullLinePreset ? '📑 FULL PRESET: ' : 'Basic: '}${displayCode}`,
        documentation: {
          value: `${isFullLinePreset ? '⭐ **FULL LINE PRESET** ⭐\n\n' : ''}**${description}**\n\nComplete Syntax: \`${usage}\`\n\n${gcode !== displayCode ? `Equivalent to: **${gcode}**` : ''}${isFullLinePreset ? '\n\n💡 *This preset includes all standard parameters with smart placeholders!*' : ''}`,
        },
        insertText: displayCode,
        sortText: `${isFullLinePreset ? '000-' : '800'}${displayCode}`,
        range: range,
      });

      // Option 2: Complete syntax (enhanced smart completion - works even when not exact match)
      const lineTrimmed = linePrefix.trim().toUpperCase();
      const isExactMatch = lineTrimmed === displayCode || lineTrimmed === gcode;
      const hasComplexParameters = usage.split(' ').length > 3; // G36 F I J K X Y Z has 7 params

      // Trigger full completion if:
      // - exact match (original logic)
      // - complex command like G36 (at least 4 parameters)
      // - user just typed the G/M code
      if (
        isExactMatch ||
        hasComplexParameters ||
        lineTrimmed.match(/^[GM]\d+$/)
      ) {
        const paramsOnly = usage.replace(gcode, '').trim();
        if (paramsOnly) {
          const completionParams = paramsOnly
            .split(' ')
            .map((p) => {
              // Try to use external parameter mappings first
              if (
                this.completionData.paramMappings &&
                this.completionData.paramMappings.paramMappings
              ) {
                const paramMappings =
                  this.completionData.paramMappings.paramMappings;
                return paramMappings[p]
                  ? paramMappings[p]
                  : `[${p.toLowerCase()}]`;
              }

              // Fallback to hardcoded parameter mapping
              const paramMap = {
                X: '[x_pos]',
                Y: '[y_pos]',
                Z: '[z_pos]',
                A: '[a_pos]',
                B: '[b_pos]',
                C: '[c_pos]',
                F: '[feed_rate]',
                S: '[rpm]',
                T: '[tool_num]',
                I: '[arc_x]',
                J: '[arc_y]',
                K: '[arc_z]',
                R: '[radius]',
                Q: '[depth]',
                P: '[dwell]',
              };
              return paramMap[p] ? paramMap[p] : `[${p.toLowerCase()}]`;
            })
            .join(' ');

          // Generate the sort text - full line presets get absolute top priority
          const fullPresetPriority = isFullLinePreset ? '000' : '010';
          const completionLabel = isFullLinePreset
            ? `🚀 FULL LINE: ${displayCode}`
            : `🚀 ${displayCode} • Complete Script`;

          completions.push({
            label: completionLabel,
            kind: monaco.languages.CompletionItemKind.Snippet,
            detail: `${isFullLinePreset ? '⭐⭐ FULL LINE PRESET:' : '⭐ FULL PRESET:'} ${displayCode} ${paramsOnly}`,
            documentation: {
              value: `🎯 **${description}**\n\n📋 **Complete Pattern:**\n\`\`\`gcode\n${displayCode} ${paramsOnly}\n\`\`\`\n\n⚡ **Auto-filled Parameters:**\n${completionParams
                .split(' ')
                .map((p) => `• **${p.replace(/\[|\]/g, '')}** - ${p}`)
                .join(
                  '\n'
                )}\n\n💡 **Quick Use:** Just press TAB to insert the complete line with smart placeholders!\n\n${isFullLinePreset ? '⭐ **This is a pre-configured preset - recommended for quick use!**' : '📝 *Standard parameter completion pattern*'}`,
            },
            insertText: `${displayCode} ${completionParams}`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: `${fullPresetPriority}${displayCode}`, // FULL LINE PRESETS get absolute highest priority
            range: range,
          });

          // Added smart completion pattern
        }
      }
    }

    return completions;
  }

  /**
   * Get axis parameter completions for G/M code context from external JSON only
   * @private
   */
  _getAxisParametersCompletions(range) {
    if (
      !this.completionData.paramMappings ||
      !this.completionData.paramMappings.axisParameters
    ) {
      console.warn('⚠️ Axis Parameters JSON not loaded');
      return [];
    }

    const { axisParameters } = this.completionData.paramMappings;
    return axisParameters.map((param) => ({
      label: param.param.trim(),
      kind: monaco.languages.CompletionItemKind.Field,
      detail: param.description,
      documentation: {
        value: `**${param.param.trim()}** - ${param.description}`,
      },
      insertText: param.snippet,
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      sortText: `00${param.param}`,
      range: range,
    }));
  }

  /**
   * Register hover provider for enhanced documentation
   * @private
   */
  _registerHoverProvider() {
    monaco.languages.registerHoverProvider('ggcode', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const hoverInfo = this._getHoverInfo(word.word);
        if (hoverInfo) {
          return {
            range: range,
            contents: hoverInfo.contents,
          };
        }

        return null;
      },
    });
  }

  /**
   * Get hover information for a word (using external JSON data)
   * @private
   */
  _getHoverInfo(word) {
    // Check mill dictionary data first (official G/M-code definitions)
    const helpSystem = window.applicationManager?.getHelpSystem?.();
    const dictionary = helpSystem?.dictionaryCache;

    if (dictionary) {
      // Check for exact match first
      if (dictionary[word]) {
        const definition = dictionary[word];
        let description = definition.desc || 'G/M-code command';
        let parameters = '';

        // Build parameter documentation
        if (definition.sub && Object.keys(definition.sub).length > 0) {
          const paramList = Object.entries(definition.sub)
            .map(([param, desc]) => `${param}: ${desc}`)
            .join('\n');
          parameters = `\n\n**Parameters:**\n${paramList}`;
        }

        return {
          contents: [
            {
              value: `**${word}** - ${description}${parameters}`,
            },
          ],
        };
      }

      // For G/M codes, also check the alternate format (G1 <-> G01)
      if (word.match(/^[GM]\d+$/)) {
        let altWord = word;
        if (word.length === 2 && word[1] !== '0') {
          // G1 -> G01
          altWord = word[0] + '0' + word[1];
        } else if (word.length === 3 && word[1] === '0' && word[2] !== '0') {
          // G01 -> G1 (but only if not G00)
          altWord = word[0] + word[2];
        }

        if (altWord !== word && dictionary[altWord]) {
          const definition = dictionary[altWord];
          let description = definition.desc || 'G/M-code command';
          let parameters = '';

          // Build parameter documentation
          if (definition.sub && Object.keys(definition.sub).length > 0) {
            const paramList = Object.entries(definition.sub)
              .map(([param, desc]) => `${param}: ${desc}`)
              .join('\n');
            parameters = `\n\n**Parameters:**\n${paramList}`;
          }

          return {
            contents: [
              {
                value: `**${altWord} / ${word}** - ${description}${parameters}`,
              },
            ],
          };
        }
      }
    }

    // Use JSON-based hover data instead of hardcoded values

    // Check constants from JSON
    if (
      this.completionData.hoverConstants &&
      this.completionData.hoverConstants[word]
    ) {
      const constant = this.completionData.hoverConstants[word];
      return {
        contents: [
          {
            value: `**${constant.title}**\n\n${constant.description}\n\nValue: ${constant.value}${constant.usage ? '\n\n' + constant.usage : ''}`,
          },
        ],
      };
    }

    // Check mill dictionary data (single source of truth)
    if (
      this.completionData.millDictionary &&
      this.completionData.millDictionary[word]
    ) {
      const entry = this.completionData.millDictionary[word];
      const description = entry.desc || 'G/M-code command';
      const subParams = entry.sub ? Object.keys(entry.sub) : [];
      const paramInfo =
        subParams.length > 0
          ? '\n\n**Parameters:**\n' +
            subParams
              .map((param) => `• **${param}**: ${entry.sub[param]}`)
              .join('\n')
          : '';

      return {
        contents: [
          {
            value: `**${word}** - ${description}${paramInfo}`,
          },
        ],
      };
    }

    // Check functions from JSON
    if (
      this.completionData.hoverFunctions &&
      this.completionData.hoverFunctions[word]
    ) {
      const func = this.completionData.hoverFunctions[word];
      return {
        contents: [
          {
            value: `**${func.syntax}** - ${func.description}${
              func.parameters && func.parameters.length > 0
                ? '\n\nParameters:\n' +
                  func.parameters.map((p) => `• ${p}`).join('\n')
                : '\n\nParameters: none'
            }${func.returns ? '\n\nReturns: ' + func.returns : ''}`,
          },
        ],
      };
    }

    // Check keywords from JSON
    if (
      this.completionData.hoverKeywords &&
      this.completionData.hoverKeywords[word]
    ) {
      const keyword = this.completionData.hoverKeywords[word];
      return {
        contents: [
          {
            value: `**${word}** - ${keyword.description}\n\n${keyword.example}${
              keyword.usage ? '\n\n' + keyword.usage : ''
            }`,
          },
        ],
      };
    }

    // Check for user-defined functions (kept for backward compatibility)
    if (this.userFunctionCache[word]) {
      const userFunc = this.userFunctionCache[word];
      const signature = `${userFunc.name}(${userFunc.parameters.join(', ')})`;
      const documentation = userFunc.documentation || 'User-defined function';

      return {
        contents: [
          {
            value: `**${signature}**\n\n${documentation}${userFunc.documentation ? '' : '\n\nParameters: ' + (userFunc.parameters.length > 0 ? userFunc.parameters.join(', ') : 'none')}`,
          },
        ],
      };
    }

    return null;
  }

  /**
   * Register signature help for function parameters
   * @private
   */
  _registerSignatureHelpProvider() {
    monaco.languages.registerSignatureHelpProvider('ggcode', {
      signatureHelpTriggerCharacters: ['(', ','],
      provideSignatureHelp: (model, position, _token, _context) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const beforeCursor = lineContent.substring(0, position.column - 1);

        // Find the function call
        const functionMatch = beforeCursor.match(/(\w+)\s*\(\s*([^)]*)$/);
        if (!functionMatch) return null;

        const functionName = functionMatch[1];
        const parametersText = functionMatch[2] || '';

        const signatureInfo = this._getFunctionSignature(functionName);
        if (!signatureInfo) return null;

        // Count parameters
        const commaCount = (parametersText.match(/,/g) || []).length;
        const parameterIndex = Math.min(
          commaCount,
          signatureInfo.parameters.length - 1
        );

        return {
          signatures: [signatureInfo],
          activeSignature: 0,
          activeParameter: parameterIndex,
        };
      },
    });
  }

  /**
   * Get function signature information (using external JSON data)
   * @private
   */
  _getFunctionSignature(functionName) {
    // Check signatures from JSON data first
    if (
      this.completionData.signatures &&
      this.completionData.signatures.functions
    ) {
      const signatures = this.completionData.signatures.functions;
      if (signatures[functionName]) {
        return signatures[functionName];
      }
    }

    // Check for user-defined functions
    if (this.userFunctionCache[functionName]) {
      const userFunc = this.userFunctionCache[functionName];
      return {
        label: `${userFunc.name}(${userFunc.parameters.join(', ')})`,
        documentation: `User-defined function${userFunc.documentation ? `\n\n${userFunc.documentation}` : ''}`,
        parameters: userFunc.parameters.map((param) => ({
          label: param,
          documentation: `Parameter: ${param}`,
        })),
      };
    }

    return null;
  }

  /**
   * Legacy method for backward compatibility - replaced by _registerCompletionProvider
   * @private
   * @deprecated
   */
  _registerBracketPairCompletionProvider() {
    return this._registerCompletionProvider();
  }

  /**
   * Parse user-defined functions from the current editor content
   * @private
   */
  _parseUserFunctions(model = null) {
    try {
      // Use current model if not provided
      if (!model && this.editor) {
        model = this.editor.getModel();
      }

      if (!model) return;

      const content = model.getValue();
      this.userFunctions.clear();

      // Regex pattern to match function definitions: function name(parameters) { ... }
      const functionRegex = /function\s+(\w+)\s*\(\s*([^)]*)\s*\)\s*\{[^}]*\}/g;
      let match;

      while ((match = functionRegex.exec(content)) !== null) {
        const functionName = match[1];
        const parameters = match[2].trim();

        // Parse parameters
        const paramList =
          parameters === ''
            ? []
            : parameters
                .split(',')
                .map((param) => param.trim())
                .filter((param) => param.length > 0);

        // Extract function documentation from comments
        const functionStart = match.index;
        const linesBefore = content.substring(0, functionStart).split('\n');
        const functionLineIndex = linesBefore.length;
        let documentation = '';

        // Look for note { ... } comments above the function
        for (let i = linesBefore.length - 1; i >= 0; i--) {
          const line = linesBefore[i].trim();
          if (line.startsWith('note')) {
            const noteMatch = line.match(/note\s*\{\s*(.+?)\s*\}/);
            if (noteMatch) {
              documentation = noteMatch[1];
              break;
            }
          } else if (line.includes('function')) {
            // Stop looking when we hit another function definition
            break;
          }
        }

        // Store function information
        this.userFunctions.set(functionName, {
          name: functionName,
          parameters: paramList,
          documentation: documentation,
          lineNumber: functionLineIndex + 1,
        });
      }

      // Cache for performance
      this.userFunctionCache = {};
      this.userFunctions.forEach((func, name) => {
        this.userFunctionCache[name] = func;
      });
    } catch (error) {
      console.warn('Error parsing user functions:', error);
    }
  }

  /**
   * Get user-defined function completion items
   * @private
   * @param {Object} range - Range for the completion items
   * @returns {Array} Array of completion items
   */
  _getUserFunctionCompletions(range) {
    const suggestions = [];

    this.userFunctions.forEach((func) => {
      const docString = `**${func.name}**(${func.parameters.join(', ')})\n\nUser-defined function${func.documentation ? `\n\n${func.documentation}` : ''}`;
      const snippet = `${func.name}(${func.parameters.map((param, i) => `\${${i + 1}:${param}}`).join(', ')})`;

      suggestions.push({
        label: func.name,
        kind: monaco.languages.CompletionItemKind.Function,
        detail: `${func.name}(${func.parameters.join(', ')})`,
        documentation: {
          value: docString,
        },
        insertText: snippet,
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        sortText: `05${func.name}`, // Sort after built-ins but before other items
        range: range,
      });
    });

    return suggestions;
  }

  // Theme management is now handled by the consolidated theme system
  // See themes.js for all theme-related functionality

  /**
   * Create input and output editors
   * @private
   */
  _createEditors(
    inputContainerId,
    outputContainerId,
    initialInput,
    initialOutput
  ) {
    // Load saved content from StorageManager
    const savedInput = storageManager.getInputContent();
    const savedOutput = storageManager.getOutputContent();

    const inputContent =
      savedInput && savedInput.trim() !== '' ? savedInput : initialInput;
    const outputContent =
      savedOutput && savedOutput.trim() !== '' ? savedOutput : initialOutput;

    // Hide loading indicators and show editor containers
    const inputLoading = document.getElementById(inputContainerId + '-loading');
    const outputLoading = document.getElementById(
      outputContainerId + '-loading'
    );
    const inputContainer = document.getElementById(inputContainerId);
    const outputContainer = document.getElementById(outputContainerId);

    if (inputLoading) inputLoading.style.display = 'none';
    if (outputLoading) outputLoading.style.display = 'none';
    if (inputContainer) inputContainer.style.display = 'block';
    if (outputContainer) outputContainer.style.display = 'block';

    // Get initial settings from settings manager
    const initialSettings = settingsManager
      ? settingsManager.getSettings()
      : {};

    // Create input editor with proper initial settings
    this.editor = monaco.editor.create(inputContainer, {
      value: inputContent,
      language: 'ggcode',
      theme: 'vs-dark', // Start with safe default theme
      automaticLayout: true,
      minimap:
        initialSettings.minimap === 'disabled'
          ? { enabled: false }
          : { enabled: true },
      fontSize: initialSettings.fontSize || 14,
      fontFamily:
        initialSettings.fontFamily || 'Consolas, "Courier New", monospace',
      wordWrap: initialSettings.wordWrap || 'off',
      lineNumbers: initialSettings.lineNumbers || 'on',
      renderWhitespace: initialSettings.renderWhitespace || 'none',
      renderIndentGuides:
        initialSettings.renderIndentGuides !== undefined
          ? initialSettings.renderIndentGuides
          : true,
      bracketMatching:
        initialSettings.bracketMatching !== undefined
          ? initialSettings.bracketMatching
          : true,
      autoClosingBrackets: initialSettings.autoClosingBrackets || 'always',
      autoClosingQuotes: initialSettings.autoClosingQuotes || 'always',
      autoClosingDelete: initialSettings.autoClosingDelete || 'always',
      autoClosingOvertype: initialSettings.autoClosingOvertype || 'always',
      surroudWithBrackets:
        initialSettings.surroudWithBrackets !== undefined
          ? initialSettings.surroudWithBrackets
          : true,
      tabSize: initialSettings.tabSize || 2,
      insertSpaces:
        initialSettings.insertSpaces !== undefined
          ? initialSettings.insertSpaces
          : true,

      // Bracket pair colorization settings
      bracketPairColorization: {
        enabled: true,
      },

      // Semantic highlighting settings
      'semanticHighlighting.enabled': true,
    });

    // Create output editor with proper initial settings
    this.outputEditor = monaco.editor.create(outputContainer, {
      value: outputContent,
      language: 'ggcode',
      theme: 'vs-dark', // Start with safe default theme
      automaticLayout: true,
      minimap:
        initialSettings.minimap === 'disabled'
          ? { enabled: false }
          : { enabled: true },
      fontSize: initialSettings.fontSize || 14,
      fontFamily:
        initialSettings.fontFamily || 'Consolas, "Courier New", monospace',
      wordWrap: initialSettings.wordWrap || 'off',
      lineNumbers: initialSettings.lineNumbers || 'on',
      renderWhitespace: initialSettings.renderWhitespace || 'none',
      renderIndentGuides:
        initialSettings.renderIndentGuides !== undefined
          ? initialSettings.renderIndentGuides
          : true,
      bracketMatching:
        initialSettings.bracketMatching !== undefined
          ? initialSettings.bracketMatching
          : true,
      autoClosingBrackets: initialSettings.autoClosingBrackets || 'always',
      autoClosingQuotes: initialSettings.autoClosingQuotes || 'always',
      autoClosingDelete: initialSettings.autoClosingDelete || 'always',
      autoClosingOvertype: initialSettings.autoClosingOvertype || 'always',
      surroudWithBrackets:
        initialSettings.surroudWithBrackets !== undefined
          ? initialSettings.surroudWithBrackets
          : true,
      tabSize: initialSettings.tabSize || 2,
      insertSpaces:
        initialSettings.insertSpaces !== undefined
          ? initialSettings.insertSpaces
          : true,

      // Bracket pair colorization settings
      bracketPairColorization: {
        enabled: true,
      },
    });

    // Make output editor globally accessible for backward compatibility
    window.outputEditor = this.outputEditor;

    // Apply current settings to both editors
    if (settingsManager) {
      settingsManager.applyAllSettingsToEditor(this.editor);
      settingsManager.applyAllSettingsToEditor(this.outputEditor);
    }

    // Apply the actual GGCode theme after editors are created
    setTimeout(() => {
      if (this.editor) {
        themeManager.applyThemeToSpecificEditor(this.editor);
      }
      if (this.outputEditor) {
        themeManager.applyThemeToSpecificEditor(this.outputEditor);
      }
    }, 100); // Small delay to ensure editors are fully initialized

    //console.log('MonacoEditorManager: Editors created and configured successfully');
  }

  /**
   * Setup event handlers for editors
   * @private
   */
  _setupEventHandlers(onCompile, onAnnotationUpdate) {
    // Auto-compile logic for input editor
    this.editor.onDidChangeModelContent(() => {
      // Parse user functions with debouncing
      if (this.functionParseTimeout) clearTimeout(this.functionParseTimeout);
      this.functionParseTimeout = setTimeout(() => {
        this._parseUserFunctions();
      }, 300); // Debounce parsing by 300ms

      if (this.autoCompile && !this.skipAutoCompile) {
        if (this.autoCompileTimeout) clearTimeout(this.autoCompileTimeout);
        this.autoCompileTimeout = setTimeout(() => {
          if (onCompile) onCompile(new Event('submit'));
        }, 1000);
      }
      this.skipAutoCompile = false;
    });

    // Annotation updates for output editor
    this.outputEditor.onDidChangeCursorPosition((e) => {
      const lineNumber = e.position.lineNumber;
      const lineContent = this.outputEditor
        .getModel()
        .getLineContent(lineNumber);
      if (onAnnotationUpdate) {
        onAnnotationUpdate(lineNumber, lineContent);
      }
    });
  }

  /**
   * Setup drag and drop functionality
   * @private
   */
  _setupDragAndDrop() {
    const editorDom = this.editor.getDomNode();
    if (!editorDom) return;

    editorDom.addEventListener('dragover', (e) => {
      e.preventDefault();
      editorDom.style.background = '#222a';
    });

    editorDom.addEventListener('dragleave', (e) => {
      e.preventDefault();
      editorDom.style.background = '';
    });

    editorDom.addEventListener('drop', (e) => {
      e.preventDefault();
      editorDom.style.background = '';

      if (
        e.dataTransfer &&
        e.dataTransfer.files &&
        e.dataTransfer.files.length > 0
      ) {
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
          if (file.name.endsWith('.gcode') || file.name.endsWith('.ggcode')) {
            if (this.outputEditor) {
              this.outputEditor.setValue(evt.target.result);
            }
          }
          this.setLastOpenedFilename(file.name || '');
        };

        reader.readAsText(file);
      }
    });
  }

  /**
   * Get input editor content
   * @returns {string} Editor content
   */
  getInputValue() {
    return this.editor ? this.editor.getValue() : '';
  }

  /**
   * Set input editor content
   * @param {string} content - Content to set
   */
  setInputValue(content) {
    if (this.editor) {
      this.skipAutoCompile = true;
      this.editor.setValue(content);
    }
  }

  /**
   * Get output editor content
   * @returns {string} Editor content
   */
  getOutputValue() {
    return this.outputEditor ? this.outputEditor.getValue() : '';
  }

  /**
   * Set output editor content
   * @param {string} content - Content to set
   */
  setOutputValue(content) {
    if (this.outputEditor) {
      this.outputEditor.setValue(content);
    }
  }

  /**
   * Enable or disable auto-compile
   * @param {boolean} enabled - Whether auto-compile should be enabled
   */
  setAutoCompile(enabled) {
    this.autoCompile = enabled;
    storageManager.setAutoCompileState(enabled);
  }

  /**
   * Get auto-compile state
   * @returns {boolean} Auto-compile state
   */
  getAutoCompile() {
    return this.autoCompile;
  }

  /**
   * Load auto-compile state from localStorage
   */
  loadAutoCompileState() {
    this.autoCompile = storageManager.getAutoCompileState();
    return this.autoCompile;
  }

  /**
   * Set last opened filename
   * @param {string} filename - Filename to remember
   */
  setLastOpenedFilename(filename) {
    this.lastOpenedFilename = filename;
    storageManager.setLastFilename(filename);
  }

  /**
   * Get last opened filename
   * @returns {string} Last opened filename
   */
  getLastOpenedFilename() {
    return this.lastOpenedFilename;
  }

  /**
   * Load last opened filename from localStorage
   */
  loadLastOpenedFilename() {
    this.lastOpenedFilename = storageManager.getLastFilename();
    return this.lastOpenedFilename;
  }

  /**
   * Save editor content to localStorage
   */
  saveContent() {
    try {
      if (this.editor) {
        storageManager.setInputContent(this.editor.getValue());
      }
      if (this.outputEditor) {
        storageManager.setOutputContent(this.outputEditor.getValue());
      }
    } catch (e) {
      console.warn('Failed to save content to storage:', e);
    }
  }

  /**
   * Setup auto-save functionality
   */
  setupAutoSave() {
    // Auto-save content every 30 seconds
    setInterval(() => this.saveContent(), 30000);

    // Save content when page is about to unload
    window.addEventListener('beforeunload', () => this.saveContent());
  }

  /**
   * Check if Monaco is ready
   * @returns {boolean} Monaco ready state
   */
  isReady() {
    return this.monacoReady;
  }

  /**
   * Force parsing of user-defined functions
   * Useful for initial setup or manual refresh
   */
  refreshUserFunctions() {
    this._parseUserFunctions();
  }

  /**
   * Get all current user-defined functions
   * @returns {Array} Array of user function objects
   */
  getUserFunctions() {
    return Array.from(this.userFunctions.values());
  }

  /**
   * Get editor instances
   * @returns {Object} Object containing editor instances
   */
  getEditors() {
    return {
      input: this.editor,
      output: this.outputEditor,
    };
  }
}

// Export for use in other modules
export default MonacoEditorManager;
