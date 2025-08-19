/**
 * Monaco Editor Manager
 * Handles Monaco editor initialization, configuration, and management
 */

class MonacoEditorManager {
  constructor() {
    this.editor = null;
    this.outputEditor = null;
    this.monacoReady = false;
    this.autoCompile = false;
    this.autoCompileTimeout = null;
    this.lastOpenedFilename = '';
    this.skipAutoCompile = false;
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

    // Configure Monaco loader
    require.config({
      paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs',
      },
    });

    return new Promise((resolve, reject) => {
      require(['vs/editor/editor.main'], () => {
        try {
          this._registerGGcodeLanguage();
          this._defineGGcodeTheme();
          this._createEditors(
            inputContainerId,
            outputContainerId,
            initialInput,
            initialOutput
          );
          this._setupEventHandlers(onCompile, onAnnotationUpdate);
          this._setupDragAndDrop();

          this.monacoReady = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Register GGcode language with Monaco
   * @private
   */
  _registerGGcodeLanguage() {
    monaco.languages.register({ id: 'ggcode' });

    monaco.languages.setMonarchTokensProvider('ggcode', {
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
    });
  }

  /**
   * Define GGcode dark theme
   * @private
   */
  _defineGGcodeTheme() {
    monaco.editor.defineTheme('ggcode-dark', {
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
    });
  }

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
    // Load saved content from localStorage
    const savedInput = localStorage.getItem('ggcode_input_content');
    const savedOutput = localStorage.getItem('ggcode_output_content');

    const inputContent =
      savedInput && savedInput.trim() !== '' ? savedInput : initialInput;
    const outputContent =
      savedOutput && savedOutput.trim() !== '' ? savedOutput : initialOutput;

    // Create input editor
    this.editor = monaco.editor.create(
      document.getElementById(inputContainerId),
      {
        value: inputContent,
        language: 'ggcode',
        theme: 'ggcode-dark',
        automaticLayout: true,
        minimap: { enabled: true },
      }
    );

    // Create output editor
    this.outputEditor = monaco.editor.create(
      document.getElementById(outputContainerId),
      {
        value: outputContent,
        language: 'ggcode',
        theme: 'ggcode-dark',
        automaticLayout: true,
        minimap: { enabled: true },
      }
    );

    // Make output editor globally accessible for backward compatibility
    window.outputEditor = this.outputEditor;
  }

  /**
   * Setup event handlers for editors
   * @private
   */
  _setupEventHandlers(onCompile, onAnnotationUpdate) {
    // Auto-compile logic for input editor
    this.editor.onDidChangeModelContent(() => {
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
    localStorage.setItem('ggcode_auto_compile', enabled.toString());
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
    const savedAutoCompile = localStorage.getItem('ggcode_auto_compile');
    if (savedAutoCompile !== null) {
      this.autoCompile = savedAutoCompile === 'true';
    }
    return this.autoCompile;
  }

  /**
   * Set last opened filename
   * @param {string} filename - Filename to remember
   */
  setLastOpenedFilename(filename) {
    this.lastOpenedFilename = filename;
    localStorage.setItem('ggcode_last_filename', filename);
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
    const savedFilename = localStorage.getItem('ggcode_last_filename');
    if (savedFilename) {
      this.lastOpenedFilename = savedFilename;
    }
    return this.lastOpenedFilename;
  }

  /**
   * Save editor content to localStorage
   */
  saveContent() {
    try {
      if (this.editor) {
        localStorage.setItem('ggcode_input_content', this.editor.getValue());
      }
      if (this.outputEditor) {
        localStorage.setItem(
          'ggcode_output_content',
          this.outputEditor.getValue()
        );
      }
    } catch (e) {
      if (
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) {
        console.warn('LocalStorage quota exceeded, unable to save content');
      } else {
        throw e;
      }
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
