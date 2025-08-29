/**
 * G-code Annotation System
 * Handles parsing and generation of G-code annotations and modal state tracking
 */

class GcodeAnnotationSystem {
  constructor() {
    this.millDictionary = {};
    this.millAnnotations = {};
    this.annotationsLoaded = false;
    this.lastGCommand = null;
  }

  /**
   * Initialize the annotation system by loading dictionaries
   */
  async initialize() {
    await this.loadGcodeDictionaries();
  }

  /**
   * Load G-code dictionaries from server
   */
  async loadGcodeDictionaries() {
    try {
      const [dictResponse, annotResponse] = await Promise.all([
        fetch('/mill-dictionary.json'),
        fetch('/mill-annotations.json'),
      ]);

      if (dictResponse.ok && annotResponse.ok) {
        this.millDictionary = await dictResponse.json();
        this.millAnnotations = await annotResponse.json();
        this.annotationsLoaded = true;
        //console.log('G-code dictionaries loaded successfully');
      } else {
        console.error('Failed to load G-code dictionaries');
      }
    } catch (error) {
      console.error('Error loading G-code dictionaries:', error);
    }
  }

  /**
   * Check if a command is a motion command
   * @param {string} cmd - Command to check
   * @returns {boolean} True if motion command
   */
  isMotionCmd(cmd) {
    return /^G(?:0|1|2|3|33|38\.2|38\.3|38\.4|38\.5|80|81|82|83|85|86|89)$/i.test(
      cmd
    );
  }

  /**
   * Check if parameters contain motion-relevant coordinates
   * @param {Object} params - Parameters object
   * @returns {boolean} True if has motion coordinates
   */
  hasMotionCoords(params) {
    for (const k of Object.keys(params)) {
      if (/[XYZIJKRABCUVW]/.test(k)) return true;
    }
    return false;
  }

  /**
   * Get all G-code lines from editor
   * @param {Object} outputEditor - Monaco output editor instance
   * @returns {Array} Array of G-code lines
   */
  getAllGcodeLines(outputEditor) {
    if (outputEditor && typeof outputEditor.getValue === 'function') {
      return outputEditor.getValue().split(/\r?\n/);
    }
    const out = document.getElementById('output');
    return out ? out.textContent.split(/\r?\n/) : [];
  }

  /**
   * Find last motion G command before a given line number
   * @param {number} lineNumber - 1-based line number
   * @param {Object} outputEditor - Monaco output editor instance
   * @returns {Object} Object with cmd and line properties
   */
  findPreviousMotion(lineNumber, outputEditor) {
    const lines = this.getAllGcodeLines(outputEditor);
    const targetIdx = Math.max(0, (lineNumber | 0) - 2);

    for (let i = targetIdx; i >= 0; i--) {
      const parsed = this.parseGcodeLine(lines[i]);
      if (!parsed || !parsed.commands || !parsed.commands.length) continue;

      const motions = parsed.commands.filter((cmd) => this.isMotionCmd(cmd));
      if (motions.length) {
        return { cmd: motions[motions.length - 1], line: i + 1 };
      }
    }

    return { cmd: null, line: null };
  }

  /**
   * Parse a G-code line to extract commands and parameters
   * @param {string} line - G-code line to parse
   * @returns {Object|null} Parsed line object or null
   */
  parseGcodeLine(line) {
    if (!line || typeof line !== 'string') return null;

    // Remove comments and trim
    const cleanLine = line.split('//')[0].split('(')[0].trim();
    if (!cleanLine) return null;

    // Extract ALL commands (G, M codes) from the line
    const commandMatches = cleanLine.matchAll(/([GM])(\d+)/gi);
    const commands = [];
    const commandsUsed = new Set();

    for (const match of commandMatches) {
      const cmd = (match[1] + match[2]).toUpperCase();
      commands.push(cmd);
      commandsUsed.add(match[0].toUpperCase());
    }

    // Update last G command if this line has any G commands
    const gCommands = commands.filter((cmd) => cmd.startsWith('G'));

    // Handle modal behavior - if no commands but has motion coordinates, use last G command
    let primaryCommand = null;
    if (commands.length > 0) {
      primaryCommand =
        gCommands.length > 0 ? gCommands[gCommands.length - 1] : commands[0];
    } else if (cleanLine.match(/[XYZ]/i)) {
      primaryCommand = this.lastGCommand;
    }

    // Extract all parameters (letter followed by number/value, including negative)
    const paramMatches = cleanLine.matchAll(/([A-Z])([+-]?\d*\.?\d+)/gi);
    const parameters = {};

    for (const match of paramMatches) {
      const letter = match[1].toUpperCase();
      const value = match[2];
      const fullMatch = match[0].toUpperCase();

      // Skip if this is part of a command (like G1, M3)
      if (!commandsUsed.has(fullMatch)) {
        parameters[letter] = value;
      }
    }

    return {
      original: line,
      commands: commands,
      primaryCommand: primaryCommand,
      parameters: parameters,
      cleanLine: cleanLine,
      isModal: commands.length === 0 && primaryCommand,
      hasParams: Object.keys(parameters).length > 0,
      hasMultipleCommands: commands.length > 1,
    };
  }

  /**
   * Generate enhanced annotation for G-code line
   * @param {number} lineNumber - Line number (1-based)
   * @param {string} lineContent - Content of the line
   * @param {Object} outputEditor - Monaco output editor instance
   * @returns {string} HTML annotation
   */
  generateAnnotation(lineNumber, lineContent, outputEditor = null) {
    if (!this.annotationsLoaded) {
      return `<div class="annotation-loading">Loading G-code dictionaries...</div>`;
    }

    const parsed = this.parseGcodeLine(lineContent);

    // Check if parsing failed first
    if (!parsed) {
      return `<div class="annotation-simple">
        <strong>Line ${lineNumber}:</strong> ${lineContent || '(empty line)'}
        <br><em>No G-code content detected</em>
      </div>`;
    }

    // If line has coords but no explicit G, find implied motion from above
    let implied = null;
    if (
      !parsed.primaryCommand &&
      parsed.parameters &&
      this.hasMotionCoords(parsed.parameters)
    ) {
      const prev = this.findPreviousMotion(lineNumber, outputEditor);
      if (prev.cmd) {
        parsed.primaryCommand = prev.cmd.toUpperCase();
        parsed.isModal = true;
        implied = prev;
      }
    }

    if (
      !parsed.primaryCommand &&
      !parsed.hasParams &&
      (!parsed.commands || parsed.commands.length === 0)
    ) {
      return `<div class="annotation-simple">
        <strong>Line ${lineNumber}:</strong> ${lineContent}
        <br><em>No G-code command or parameters detected</em>
      </div>`;
    }

    let annotation = '';

    // Build annotation header
    annotation += `<div class="annotation-header">`;
    annotation += `<strong>Line ${lineNumber}:</strong> `;

    if (parsed.commands.length > 0) {
      if (parsed.hasMultipleCommands) {
        annotation += `Multiple Commands (${parsed.commands.length})`;
        if (parsed.isModal) {
          annotation += ` <span class="modal-indicator">(Modal)</span>`;
        }
      } else {
        // Single command
        const cmd = parsed.primaryCommand || parsed.commands[0];
        let cmdDesc = '';
        if (cmd) {
          if (this.millDictionary[cmd]) {
            cmdDesc =
              typeof this.millDictionary[cmd] === 'string'
                ? this.millDictionary[cmd]
                : this.millDictionary[cmd].desc || '';
          } else if (this.millAnnotations[cmd]) {
            cmdDesc = this.millAnnotations[cmd];
          }
        }
        annotation += `${cmd || 'Unknown'} - ${cmdDesc || 'Unknown command'}`;

        if (parsed.isModal) {
          annotation += ` <span class="modal-indicator">(Implied</span>`;
          if (implied && implied.line != null) {
            annotation += ` <span class="modal-indicator">from line ${implied.line}</span>`;
          }
          annotation += `<span class="modal-indicator">)</span>`;
        }
      }
    } else {
      if (parsed.primaryCommand) {
        annotation += `Implied ${parsed.primaryCommand}`;
        if (implied && implied.line != null) {
          annotation += ` <span class="modal-indicator">(from line ${implied.line})</span>`;
        } else {
          annotation += ` <span class="modal-indicator">(modal)</span>`;
        }
      } else {
        annotation += `Parameters only`;
        if (parsed.hasParams) {
          annotation += ` <span class="modal-indicator">(no prior motion found)</span>`;
        }
      }
    }

    annotation += `</div>`;

    // Add command details for multiple commands
    if (parsed.hasMultipleCommands) {
      annotation += `<div class="annotation-commands">`;
      for (const cmd of parsed.commands) {
        let cmdDesc = '';
        if (this.millDictionary[cmd]) {
          if (typeof this.millDictionary[cmd] === 'string') {
            cmdDesc = this.millDictionary[cmd];
          } else if (this.millDictionary[cmd].desc) {
            cmdDesc = this.millDictionary[cmd].desc;
          }
        } else if (this.millAnnotations[cmd]) {
          cmdDesc = this.millAnnotations[cmd];
        }
        annotation += `<div class="annotation-command">`;
        annotation += `<span class="command-name">${cmd}:</span> `;
        annotation += `<span class="command-desc">${cmdDesc || 'Unknown command'}</span>`;
        annotation += `</div>`;
      }
      annotation += `</div>`;
    }

    // Add parameter details
    if (Object.keys(parsed.parameters).length > 0) {
      annotation += `<div class="annotation-params">`;

      for (const [param, value] of Object.entries(parsed.parameters)) {
        let paramDesc = `${param}-Axis Motion`;

        // Get parameter description from dictionary
        if (
          parsed.primaryCommand &&
          this.millDictionary[parsed.primaryCommand] &&
          this.millDictionary[parsed.primaryCommand].sub &&
          this.millDictionary[parsed.primaryCommand].sub[param]
        ) {
          paramDesc = this.millDictionary[parsed.primaryCommand].sub[param];
        } else if (this.millDictionary[param]) {
          paramDesc =
            typeof this.millDictionary[param] === 'string'
              ? this.millDictionary[param]
              : this.millDictionary[param].desc || paramDesc;
        }

        annotation += `<div class="annotation-param">`;
        annotation += `<span class="param-name">${paramDesc}:</span> `;
        annotation += `<span class="param-value">${value}</span>`;
        annotation += `</div>`;
      }

      annotation += `</div>`;
    }

    // Add raw line for reference
    annotation += `<div class="annotation-raw">`;
    annotation += `<em>Raw: ${lineContent}</em>`;
    annotation += `</div>`;

    return annotation;
  }

  /**
   * Update annotations display
   * @param {number} lineNumber - Line number (1-based)
   * @param {string} lineContent - Content of the line
   * @param {Object} outputEditor - Monaco output editor instance
   */
  updateAnnotations(lineNumber, lineContent, outputEditor = null) {
    const annotationsDiv = document.getElementById('annotations');
    if (!annotationsDiv) return;

    const annotation = this.generateAnnotation(
      lineNumber,
      lineContent,
      outputEditor
    );
    annotationsDiv.innerHTML = annotation;
  }

  /**
   * Reset modal state (call when new G-code is loaded)
   */
  resetModalState() {
    this.lastGCommand = null;
  }

  /**
   * Get current modal state
   * @returns {Object} Current modal state
   */
  getModalState() {
    return {
      lastGCommand: this.lastGCommand,
    };
  }

  /**
   * Set modal state
   * @param {Object} state - Modal state to set
   */
  setModalState(state) {
    if (state.lastGCommand !== undefined) {
      this.lastGCommand = state.lastGCommand;
    }
  }
}

export default GcodeAnnotationSystem;
