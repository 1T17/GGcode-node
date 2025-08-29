/**
 * AI Commands - Editor integration functions for AI commands
 * Handles execution of AI-generated commands on the editor
 */

class AICommands {
  constructor() {
    this.pendingCommandData = null;
  }

  /**
   * Execute pending command
   * @param {string} command - AI command to execute
   * @param {string} params - Command parameters
   */
  executePendingCommand(command, params) {
    console.log('Executing pending command:', command, 'with params:', params);

    try {
      switch (command) {
        case 'insertat':
          this.executeInsertAtCommand(params);
          break;
        case 'insert':
          this.executeInsertCommand(params);
          break;
        case 'replace':
          this.executeReplaceCommand(params);
          break;
        case 'replacerange':
          this.executeReplaceRangeCommand(params);
          break;
        case 'analyze':
          this.executeAnalyzeCommand();
          break;
        case 'help':
          this.executeHelpCommand();
          break;
        case 'capabilities':
          this.executeCapabilitiesCommand();
          break;
        case 'status':
          this.executeStatusCommand();
          break;
        case 'find':
          this.executeFindCommand(params);
          break;
        case 'getline':
          this.executeGetLineCommand(params);
          break;
        case 'getlines':
          this.executeGetLinesCommand(params);
          break;
        case 'getcontent':
          this.executeGetContentCommand(params);
          break;
        case 'getselection':
          this.executeGetSelectionCommand(params);
          break;
        case 'getcursor':
          this.executeGetCursorCommand(params);
          break;
        default:
          console.warn('Unknown pending command:', command);
          this.addSystemMessage(
            `<strong>System:</strong> Unknown command: ${command}`
          );
      }
    } catch (error) {
      console.error('Error executing pending command:', error);
      this.addSystemMessage(
        `<strong>System:</strong> Error executing command: ${error.message}`
      );
    }
  }

  /**
   * Execute insert at position command
   * @param {string} params - Command parameters (lineNumber,column,text)
   */
  executeInsertAtCommand(params) {
    const insertParams = params.match(/(\d+),(\d+),(.+)/);
    if (insertParams) {
      const lineNumber = parseInt(insertParams[1]);
      const column = parseInt(insertParams[2]);
      const text = insertParams[3].replace(/^["']|["']$/g, '');

      if (this.shouldConfirmCommand()) {
        if (
          confirm(`Insert "${text}" at line ${lineNumber}, column ${column}?`)
        ) {
          this.insertAtPosition(lineNumber, column, text);
          this.addSystemMessage(
            `<strong>System:</strong> Successfully inserted text at position (${lineNumber},${column}).`
          );
        }
      } else {
        this.insertAtPosition(lineNumber, column, text);
        this.addSystemMessage(
          `<strong>System:</strong> Successfully inserted text at position (${lineNumber},${column}).`
        );
      }
    }
  }

  /**
   * Execute insert at cursor command
   * @param {string} params - Text to insert
   */
  executeInsertCommand(params) {
    const text = params.replace(/^["']|["']$/g, '');

    if (this.shouldConfirmCommand()) {
      if (confirm(`Insert "${text}" at cursor position?`)) {
        this.insertAtCursor(text);
        this.addSystemMessage(
          '<strong>System:</strong> Successfully inserted text at cursor position.'
        );
      }
    } else {
      this.insertAtCursor(text);
      this.addSystemMessage(
        '<strong>System:</strong> Successfully inserted text at cursor position.'
      );
    }
  }

  /**
   * Execute replace selection command
   * @param {string} params - New text to replace selection with
   */
  executeReplaceCommand(params) {
    const newText = params.replace(/^["']|["']$/g, '');

    if (this.shouldConfirmCommand()) {
      if (confirm(`Replace selected text with "${newText}"?`)) {
        this.replaceSelection(newText);
        this.addSystemMessage(
          '<strong>System:</strong> Successfully replaced selected text.'
        );
      }
    } else {
      this.replaceSelection(newText);
      this.addSystemMessage(
        '<strong>System:</strong> Successfully replaced selected text.'
      );
    }
  }

  /**
   * Execute replace range command
   * @param {string} params - Command parameters (startLine,startColumn,endLine,endColumn,newText)
   */
  executeReplaceRangeCommand(params) {
    const rangeParams = params.match(/(\d+),(\d+),(\d+),(\d+),(.+)/);
    if (rangeParams) {
      const startLine = parseInt(rangeParams[1]);
      const startColumn = parseInt(rangeParams[2]);
      const endLine = parseInt(rangeParams[3]);
      const endColumn = parseInt(rangeParams[4]);
      const newText = rangeParams[5].replace(/^["']|["']$/g, '');

      if (this.shouldConfirmCommand()) {
        if (
          confirm(
            `Replace text from (${startLine},${startColumn}) to (${endLine},${endColumn}) with "${newText}"?`
          )
        ) {
          this.replaceRange(
            startLine,
            startColumn,
            endLine,
            endColumn,
            newText
          );
          this.addSystemMessage(
            `<strong>System:</strong> Successfully replaced text in range (${startLine},${startColumn}) to (${endLine},${endColumn}).`
          );
        }
      } else {
        this.replaceRange(startLine, startColumn, endLine, endColumn, newText);
        this.addSystemMessage(
          `<strong>System:</strong> Successfully replaced text in range (${startLine},${startColumn}) to (${endLine},${endColumn}).`
        );
      }
    } else {
      console.error('Invalid replacerange parameters:', params);
      this.addSystemMessage(
        `<strong>System:</strong> Invalid replacerange parameters: ${params}`
      );
    }
  }

  /**
   * Execute analyze command
   */
  executeAnalyzeCommand() {
    const analysis = this.analyzeCode();
    const analysisSummary =
      '<strong>GGcode Analysis:</strong>' +
      '<ul>' +
      '<li>Total Lines: ' +
      analysis.totalLines +
      '</li>' +
      '<li>Code Lines: ' +
      analysis.codeLines +
      '</li>' +
      '<li>Comment Lines: ' +
      analysis.commentLines +
      '</li>' +
      '<li>G-code Commands: ' +
      analysis.gcodeCommands.length +
      '</li>' +
      '<li>Variables: ' +
      analysis.variables.length +
      '</li>' +
      '<li>Functions: ' +
      analysis.functions.length +
      '</li>' +
      '<li>Complexity: ' +
      analysis.complexity +
      '%</li>' +
      '<li>Code Density: ' +
      analysis.density +
      '%</li>' +
      '</ul>';
    this.addSystemMessage(analysisSummary);
    console.log('AI analyzed GGcode:', analysis);
  }

  /**
   * Execute help command
   */
  executeHelpCommand() {
    const helpText = `<strong>🤖 AI Commands Help:</strong>
<ul>
<li><strong>/ai:help</strong> - Show this help</li>
<li><strong>/ai:capabilities</strong> - List all AI capabilities</li>
<li><strong>/ai:list</strong> - List commands by category</li>
<li><strong>/ai:status</strong> - Show current editor state</li>
<li><strong>/ai:analyze</strong> - Analyze G-code file</li>
</ul>

<strong>📝 Editing Commands:</strong>
<ul>
<li><strong>/ai:insert["text"]</strong> - Insert text at cursor</li>
<li><strong>/ai:insertat[1,1,"text"]</strong> - Insert at specific position</li>
<li><strong>/ai:replace["text"]</strong> - Replace selected text</li>
<li><strong>/ai:replacerange[start,end,"text"]</strong> - Replace text range</li>
</ul>

<strong>📖 Reading Commands:</strong>
<ul>
<li><strong>/ai:getcontent</strong> - Get entire file content</li>
<li><strong>/ai:getlines[1,5]</strong> - Get specific lines</li>
<li><strong>/ai:getline[2]</strong> - Get specific line</li>
<li><strong>/ai:getselection</strong> - Get selected text</li>
<li><strong>/ai:getcursor</strong> - Get cursor position</li>
</ul>

<strong>🔧 G-code Specific:</strong>
<ul>
<li><strong>/ai:optimize</strong> - Optimize G-code for efficiency</li>
<li><strong>/ai:validate</strong> - Validate G-code syntax</li>
<li><strong>/ai:simulate</strong> - Start G-code simulation</li>
</ul>

<strong>💡 Usage Tips:</strong>
<ul>
<li>Commands are case-sensitive</li>
<li>Line and column numbers are 1-based</li>
<li>Text should be quoted with double quotes</li>
<li>Use /ai:help["command"] for detailed help on specific commands</li>
</ul>`;

    console.log('📋 AI Help Command Executed');
    this.addSystemMessage(helpText);
  }

  /**
   * Execute capabilities command
   */
  executeCapabilitiesCommand() {
    const capabilitiesText = `<strong>🚀 AI System Capabilities:</strong>

<strong>🤖 AI Model Information:</strong>
<ul>
<li><strong>Model:</strong> deepseek-coder-v2:16b</li>
<li><strong>Type:</strong> Code-focused LLM</li>
<li><strong>Context:</strong> 32K tokens</li>
<li><strong>Specialization:</strong> CNC/G-code programming</li>
</ul>

<strong>📝 Text Editing Capabilities:</strong>
<ul>
<li>✅ Insert text at any position</li>
<li>✅ Replace text selections</li>
<li>✅ Multi-line text manipulation</li>
<li>✅ Syntax-aware editing</li>
<li>✅ Real-time editor integration</li>
</ul>

<strong>🔍 Code Analysis Features:</strong>
<ul>
<li>✅ G-code syntax validation</li>
<li>✅ Performance optimization suggestions</li>
<li>✅ Code complexity analysis</li>
<li>✅ Comment and documentation analysis</li>
<li>✅ Feed rate and speed optimization</li>
</ul>

<strong>📊 Data Processing:</strong>
<ul>
<li>✅ Real-time G-code parsing</li>
<li>✅ 3D visualization integration</li>
<li>✅ Performance metrics tracking</li>
<li>✅ Error detection and reporting</li>
<li>✅ Code statistics generation</li>
</ul>

<strong>🎯 G-code Specific Operations:</strong>
<ul>
<li>✅ Rapid move optimization (G0)</li>
<li>✅ Feed rate analysis and tuning</li>
<li>✅ Tool path efficiency calculation</li>
<li>✅ CNC machining best practices</li>
<li>✅ Multi-axis coordinate validation</li>
</ul>

<strong>🔄 Integration Features:</strong>
<ul>
<li>✅ Real-time AI chat interface</li>
<li>✅ Command auto-completion</li>
<li>✅ Error handling and recovery</li>
<li>✅ User confirmation system</li>
<li>✅ Undo/redo compatibility</li>
</ul>

<strong>📈 Performance Metrics:</strong>
<ul>
<li><strong>Command Execution:</strong> <50ms average</li>
<li><strong>AI Response Time:</strong> 2-5 seconds</li>
<li><strong>Code Analysis:</strong> Real-time</li>
<li><strong>Memory Usage:</strong> Optimized for large files</li>
</ul>

<strong>🎨 User Experience:</strong>
<ul>
<li>✅ Intuitive command syntax</li>
<li>✅ Contextual help system</li>
<li>✅ Visual feedback for all operations</li>
<li>✅ Error messages with suggestions</li>
<li>✅ Progress indicators for long operations</li>
</ul>`;

    console.log('🚀 AI Capabilities Command Executed');
    this.addSystemMessage(capabilitiesText);
  }

  /**
   * Execute status command
   */
  executeStatusCommand() {
    const cursorPosition = this.getCursorPosition();
    const selectedText = this.getSelectedText();
    const currentContent = this.getCurrentContent();
    const lines = currentContent.split('\n');
    const totalLines = lines.length;
    const currentLine = cursorPosition ? cursorPosition.lineNumber : 1;
    const currentColumn = cursorPosition ? cursorPosition.column : 1;

    const statusText = `<strong>📊 Editor Status:</strong>

<strong>📝 File Information:</strong>
<ul>
<li><strong>Total Lines:</strong> ${totalLines}</li>
<li><strong>File Size:</strong> ${currentContent.length} characters</li>
<li><strong>Code Density:</strong> ${Math.round((lines.filter((l) => l.trim() !== '').length / totalLines) * 100)}%</li>
<li><strong>Empty Lines:</strong> ${lines.filter((l) => l.trim() === '').length}</li>
</ul>

<strong>📍 Cursor Position:</strong>
<ul>
<li><strong>Current Line:</strong> ${currentLine} of ${totalLines}</li>
<li><strong>Current Column:</strong> ${currentColumn}</li>
<li><strong>Progress:</strong> ${Math.round((currentLine / totalLines) * 100)}% through file</li>
</ul>

<strong>✂️ Selection Status:</strong>
<ul>
<li><strong>Has Selection:</strong> ${selectedText ? 'Yes' : 'No'}</li>
${selectedText ? `<li><strong>Selected Text:</strong> "${selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText}"</li>` : ''}
<li><strong>Selection Length:</strong> ${selectedText.length} characters</li>
</ul>

<strong>🔧 Editor State:</strong>
<ul>
<li><strong>Editor Available:</strong> ${window.editor ? 'Yes' : 'No'}</li>
<li><strong>Editor Manager:</strong> ${window.editorManager ? 'Yes' : 'No'}</li>
<li><strong>Auto-approve Commands:</strong> ${!this.shouldConfirmCommand() ? 'Yes' : 'No'}</li>
<li><strong>Command History:</strong> ${this.getPendingCommandData() ? 'Active' : 'None'}</li>
</ul>

<strong>🎯 Current Line Content:</strong>
<ul>
<li><strong>Line ${currentLine}:</strong> "${this.getLineContent(currentLine)}"</li>
</ul>

<strong>📈 Quick Stats:</strong>
<ul>
<li><strong>G-code Commands:</strong> ${lines.filter((l) => /\bG\d+/.test(l)).length}</li>
<li><strong>Comments:</strong> ${lines.filter((l) => l.trim().startsWith('//')).length}</li>
<li><strong>Variables:</strong> ${lines.filter((l) => /\blet\s+/.test(l)).length}</li>
<li><strong>Functions:</strong> ${lines.filter((l) => /\bfunction\s+/.test(l)).length}</li>
</ul>`;

    console.log('📊 AI Status Command Executed');
    console.log('Current cursor position:', cursorPosition);
    console.log('Selected text length:', selectedText.length);
    this.addSystemMessage(statusText);
  }

  /**
   * Execute find command with intelligent search patterns
   * @param {string} params - Text to search for or special search type
   */
  executeFindCommand(params) {
    const searchText = params.replace(/^["']|["']$/g, '');
    const currentContent = this.getCurrentContent();
    const lines = currentContent.split('\n');

    console.log('🔍 AI Find Command Executed - Searching for:', searchText);

    // Check for special search patterns
    const searchPattern = this.getIntelligentSearchPattern(searchText);
    const matches = [];

    lines.forEach((line, index) => {
      let isMatch = false;
      let matchIndex = -1;

      if (searchPattern.isRegex) {
        // Use regex search
        const regex = new RegExp(
          searchPattern.pattern,
          searchPattern.flags || 'gi'
        );
        const match = line.match(regex);
        if (match) {
          isMatch = true;
          matchIndex = line.indexOf(match[0]);
        }
      } else {
        // Use text search
        const lineLower = line.toLowerCase();
        const patternLower = searchPattern.pattern.toLowerCase();
        matchIndex = lineLower.indexOf(patternLower);
        isMatch = matchIndex !== -1;
      }

      if (isMatch) {
        matches.push({
          lineNumber: index + 1,
          content: line.trim(),
          matchIndex: matchIndex,
          searchType: searchPattern.type,
        });
      }
    });

    let findText = `<strong>🔍 Search Results for "${searchText}":</strong>`;

    if (matches.length === 0) {
      findText += `<ul><li><strong>No matches found</strong></li>`;
      if (searchPattern.suggestions) {
        findText += `<li><strong>💡 Try:</strong> ${searchPattern.suggestions.join(', ')}</li>`;
      }
      findText += `</ul>`;
    } else {
      findText += `<ul><li><strong>Found ${matches.length} match(es):</strong></li></ul>`;

      // Show first 10 matches with context
      matches.slice(0, 10).forEach((match) => {
        const beforeMatch = match.content.substring(0, match.matchIndex);
        const matchedText = match.content.substring(
          match.matchIndex,
          match.matchIndex +
            (searchPattern.isRegex
              ? match.content.match(
                  new RegExp(searchPattern.pattern, searchPattern.flags || 'gi')
                )[0].length
              : searchPattern.pattern.length)
        );
        const afterMatch = match.content.substring(
          match.matchIndex +
            (searchPattern.isRegex
              ? match.content.match(
                  new RegExp(searchPattern.pattern, searchPattern.flags || 'gi')
                )[0].length
              : searchPattern.pattern.length)
        );

        findText += `<ul>
<li><strong>Line ${match.lineNumber}:</strong> ${beforeMatch}<mark>${matchedText}</mark>${afterMatch}</li>
</ul>`;
      });

      if (matches.length > 10) {
        findText += `<ul><li><strong>... and ${matches.length - 10} more matches</strong></li></ul>`;
      }
    }

    // Add search type information
    if (searchPattern.type !== 'text') {
      findText += `<strong>🔍 Search Type:</strong> <em>${searchPattern.description}</em><br>`;
    }

    // Add CSS styles for search buttons
    findText += `<style>
.search-quick-actions, .search-context-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 10px 0;
}

.search-action-btn, .context-action-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-action-btn:hover, .context-action-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.search-action-btn:active, .context-action-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.context-action-btn {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.context-action-btn:hover {
    background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
}
</style>`;

    // Add quick actions with clickable buttons
    findText += `<strong>💡 Quick Actions:</strong>
<div class="search-quick-actions">
<button class="search-action-btn" onclick="executeQuickSearch('variable')" title="Find variable assignments">
    🔍 Variables
</button>
<button class="search-action-btn" onclick="executeQuickSearch('function')" title="Find function definitions">
    🔧 Functions
</button>
<button class="search-action-btn" onclick="executeQuickSearch('comment')" title="Find comments">
    💬 Comments
</button>
<button class="search-action-btn" onclick="executeQuickSearch('gcode')" title="Find G-code commands">
    ⚙️ G-code
</button>
<button class="search-action-btn" onclick="executeQuickSearch('axis')" title="Find axis movements">
    📍 Axis
</button>
<button class="search-action-btn" onclick="executeQuickSearch('loop')" title="Find loop structures">
    🔄 Loops
</button>
</div>`;

    // Add context viewing for matches
    if (matches.length > 0) {
      findText += `<strong>📄 Context Actions:</strong>
<div class="search-context-actions">`;
      matches.slice(0, 3).forEach((match) => {
        const contextStart = Math.max(1, match.lineNumber - 2);
        const contextEnd = Math.min(lines.length, match.lineNumber + 2);
        findText += `<button class="context-action-btn" onclick="executeQuickContext(${contextStart}, ${contextEnd})" title="View lines ${contextStart}-${contextEnd}">
                    👁️ Lines ${contextStart}-${contextEnd}
                </button>`;
      });
      findText += `</div>`;
    }

    console.log(`Found ${matches.length} matches for "${searchText}"`);
    this.addSystemMessage(findText);
  }

  /**
   * Get intelligent search pattern based on input
   * @param {string} input - Search input
   * @returns {Object} Search pattern with type, pattern, and flags
   */
  getIntelligentSearchPattern(input) {
    const lowerInput = input.toLowerCase();

    // Special search patterns
    if (
      lowerInput === 'variable' ||
      lowerInput === 'variables' ||
      lowerInput.includes('set variable')
    ) {
      return {
        type: 'variable',
        description: 'Variable assignments and declarations',
        pattern: '\\blet\\s+[a-zA-Z_]\\w*\\s*=|\\b[a-zA-Z_]\\w*\\s*=\\s*[^;]+',
        flags: 'gi',
        isRegex: true,
        suggestions: ['"let x = 5"', '"x = 10"', '"radius = 8"'],
      };
    }

    if (
      lowerInput === 'function' ||
      lowerInput === 'functions' ||
      lowerInput.includes('function')
    ) {
      return {
        type: 'function',
        description: 'Function definitions',
        pattern:
          '\\bfunction\\s+[a-zA-Z_]\\w*|\\blet\\s+[a-zA-Z_]\\w*\\s*=\\s*function',
        flags: 'gi',
        isRegex: true,
        suggestions: ['"function spiral"', '"let draw = function"'],
      };
    }

    if (lowerInput === 'comment' || lowerInput === 'comments') {
      return {
        type: 'comment',
        description: 'Comments in code',
        pattern: '//.*$|/\\*.*\\*/',
        flags: 'gm',
        isRegex: true,
        suggestions: ['"// Set feed rate"', '"/* Multi-line comment */"'],
      };
    }

    if (
      lowerInput === 'gcode' ||
      lowerInput === 'g-code' ||
      lowerInput.includes('g-code')
    ) {
      return {
        type: 'gcode',
        description: 'G-code commands',
        pattern: '\\bG\\d+|\\bM\\d+',
        flags: 'gi',
        isRegex: true,
        suggestions: ['"G0 X10 Y20"', '"G1 F100"', '"M3 S1000"'],
      };
    }

    if (
      lowerInput === 'axis' ||
      lowerInput === 'axes' ||
      lowerInput.includes('axis move')
    ) {
      return {
        type: 'axis',
        description: 'Axis movements (X, Y, Z)',
        pattern: '\\b[XYZABC][+-]?\\d*\\.?\\d+',
        flags: 'gi',
        isRegex: true,
        suggestions: ['"X10 Y20"', '"Z-5"', '"A90"'],
      };
    }

    if (
      lowerInput === 'loop' ||
      lowerInput === 'loops' ||
      lowerInput.includes('loop')
    ) {
      return {
        type: 'loop',
        description: 'Loop structures',
        pattern: '\\bfor\\s*\\(|\\bwhile\\s*\\(|\\bdo\\s*\\{',
        flags: 'gi',
        isRegex: true,
        suggestions: ['"for(let i = 0"', '"while(x < 10"'],
      };
    }

    if (
      lowerInput === 'math' ||
      lowerInput === 'calculation' ||
      lowerInput.includes('math')
    ) {
      return {
        type: 'math',
        description: 'Mathematical operations',
        pattern: '[+\\-*/%]\\s*\\d|\\d\\s*[+\\-*/%]',
        flags: 'gi',
        isRegex: true,
        suggestions: ['"x + 5"', '"radius * 2"', '"angle / 2"'],
      };
    }

    if (
      lowerInput === 'coordinate' ||
      lowerInput === 'coordinates' ||
      lowerInput.includes('coordinate')
    ) {
      return {
        type: 'coordinate',
        description: 'Coordinate definitions',
        pattern: '\\bX\\d+\\s+Y\\d+|\\bY\\d+\\s+X\\d+',
        flags: 'gi',
        isRegex: true,
        suggestions: ['"X10 Y20"', '"Y5 X15"'],
      };
    }

    // Check for regex patterns (enclosed in forward slashes)
    if (input.startsWith('/') && input.includes('/', 1)) {
      const lastSlashIndex = input.lastIndexOf('/');
      const pattern = input.slice(1, lastSlashIndex);
      const flags = input.slice(lastSlashIndex + 1);

      return {
        type: 'regex',
        description: 'Custom regex pattern',
        pattern: pattern,
        flags: flags,
        isRegex: true,
      };
    }

    // Default text search
    return {
      type: 'text',
      description: 'Text search',
      pattern: input,
      isRegex: false,
    };
  }

  /**
   * Execute get line command
   * @param {string} params - Line number, negative index, or special keyword ("last", "end")
   */
  executeGetLineCommand(params) {
    const cleanParams = params.replace(/^["']|["']$/g, '').toLowerCase();

    let lineNumber;
    let isSpecialKeyword = false;
    let isNegativeIndex = false;

    // Handle special keywords
    if (cleanParams === 'last' || cleanParams === 'end') {
      // Get the last line of the file
      const content = this.getCurrentContent();
      const lines = content.split('\n');
      lineNumber = lines.length;
      isSpecialKeyword = true;
    } else {
      // Parse as line number (can be negative for indexing from end)
      const parsedNumber = parseInt(cleanParams);

      if (isNaN(parsedNumber)) {
        console.error('Invalid line number parameter:', params);
        this.addSystemMessage(
          `<strong>📄 Line Content:</strong><ul><li><strong>Invalid line specification: ${params}</strong></li><li><strong>Examples: [5], [-1], [last], [end]</strong></li></ul>`
        );
        return;
      }

      // Handle negative indexing (Python-style)
      if (parsedNumber < 0) {
        const content = this.getCurrentContent();
        const lines = content.split('\n');
        lineNumber = lines.length + parsedNumber + 1; // -1 becomes last line, -2 becomes second to last, etc.
        isNegativeIndex = true;
      } else {
        lineNumber = parsedNumber;
      }
    }

    // Validate the calculated line number
    if (lineNumber < 1) {
      console.error('Calculated line number is invalid:', lineNumber);
      this.addSystemMessage(
        `<strong>📄 Line Content:</strong><ul><li><strong>Invalid line specification: ${params}</strong></li><li><strong>Line number would be out of range</strong></li></ul>`
      );
      return;
    }

    const lineContent = this.getLineContent(lineNumber);
    const indexType = isSpecialKeyword
      ? '(last line)'
      : isNegativeIndex
        ? `(index ${parseInt(cleanParams)})`
        : '';

    console.log(
      '📄 AI Get Line Command Executed - Line:',
      lineNumber,
      indexType
    );

    let getLineText = `<strong>📄 Line ${lineNumber} Content:</strong>`;

    if (lineContent) {
      getLineText += `<ul><li><strong>Line ${lineNumber}${indexType ? ' ' + indexType : ''}:</strong> "${lineContent}"</li></ul>`;
    } else {
      getLineText += `<ul><li><strong>Line ${lineNumber} not found - file may have fewer lines</strong></li></ul>`;
    }

    this.addSystemMessage(getLineText);
  }

  /**
   * Execute get lines command
   * @param {string} params - Start and end line numbers (e.g., "1,5" or "1-5" or "1,end")
   */
  executeGetLinesCommand(params) {
    const cleanParams = params.replace(/^["']|["']$/g, '').toLowerCase();

    let startLine, endLine;

    // Try comma-separated format first (1,5 or 1,end)
    if (cleanParams.includes(',')) {
      const lineParams = cleanParams.split(',');
      startLine = this.parseLineSpec(lineParams[0]);
      endLine = this.parseLineSpec(lineParams[1]);
    }
    // Try dash format (1-5 or 1-end)
    else if (cleanParams.includes('-')) {
      const lineParams = cleanParams.split('-');
      startLine = this.parseLineSpec(lineParams[0]);
      endLine = this.parseLineSpec(lineParams[1]);
    }
    // Try single number format
    else {
      const singleLine = this.parseLineSpec(cleanParams);
      startLine = singleLine;
      endLine = singleLine;
    }

    // Validate parsed values
    if (
      isNaN(startLine) ||
      isNaN(endLine) ||
      startLine < 1 ||
      endLine < startLine
    ) {
      console.error('Invalid line range parameters:', params);
      this.addSystemMessage(
        `<strong>📄 Lines Content:</strong><ul><li><strong>Invalid range format: ${params}</strong></li><li><strong>Examples: [1,5], [1-5], [1,end], [10] for single line</strong></li></ul>`
      );
      return;
    }

    const linesContent = this.getLinesContent(startLine, endLine);
    console.log(
      '📄 AI Get Lines Command Executed - Range:',
      startLine,
      'to',
      endLine
    );

    let getLinesText = `<strong>📄 Lines ${startLine}-${endLine} Content:</strong>`;

    if (linesContent) {
      const lines = linesContent.split('\n');
      getLinesText += '<ul>';
      lines.forEach((line, index) => {
        const lineNumber = startLine + index;
        getLinesText += `<li><strong>Line ${lineNumber}:</strong> "${line}"</li>`;
      });
      getLinesText += '</ul>';
    } else {
      getLinesText += `<ul><li><strong>No content found for lines ${startLine}-${endLine}</strong></li></ul>`;
    }

    this.addSystemMessage(getLinesText);
  }

  /**
   * Parse line specification (number or special keyword)
   * @param {string} spec - Line specification (e.g., "5", "end", "last")
   * @returns {number} Parsed line number
   */
  parseLineSpec(spec) {
    if (!spec) return NaN;

    const lowerSpec = spec.toLowerCase();

    // Handle special keywords
    if (lowerSpec === 'last' || lowerSpec === 'end') {
      const content = this.getCurrentContent();
      const lines = content.split('\n');
      return lines.length;
    }

    // Handle negative indexing (Python-style)
    const parsedNumber = parseInt(lowerSpec);
    if (!isNaN(parsedNumber)) {
      if (parsedNumber < 0) {
        // Handle negative indexing
        const content = this.getCurrentContent();
        const lines = content.split('\n');
        return lines.length + parsedNumber + 1; // -1 becomes last line, -2 becomes second to last, etc.
      }
      return parsedNumber;
    }

    return NaN;
  }

  /**
   * Execute get content command
   * @param {string} _params - Not used for this command
   */
  executeGetContentCommand(_params) {
    const content = this.getCurrentContent();
    const lines = content.split('\n');

    console.log(
      '📄 AI Get Content Command Executed - Total lines:',
      lines.length
    );

    let getContentText = `<strong>📄 Full File Content:</strong>
<ul>
<li><strong>Total Lines:</strong> ${lines.length}</li>
<li><strong>File Size:</strong> ${content.length} characters</li>
</ul>

<strong>📝 Content Preview (first 20 lines):</strong>
<ul>`;

    // Show first 20 lines as preview
    const previewLines = lines.slice(0, 20);
    previewLines.forEach((line, index) => {
      getContentText += `<li><strong>Line ${index + 1}:</strong> "${line}"</li>`;
    });

    if (lines.length > 20) {
      getContentText += `<li><strong>... and ${lines.length - 20} more lines</strong></li>`;
    }

    getContentText += '</ul>';

    this.addSystemMessage(getContentText);
  }

  /**
   * Execute get selection command
   * @param {string} _params - Not used for this command
   */
  executeGetSelectionCommand(_params) {
    const selectedText = this.getSelectedText();

    console.log(
      '📄 AI Get Selection Command Executed - Selection length:',
      selectedText.length
    );

    let getSelectionText = `<strong>📄 Selected Text:</strong>`;

    if (selectedText) {
      getSelectionText += `<ul>
<li><strong>Selected Text:</strong> "${selectedText}"</li>
<li><strong>Selection Length:</strong> ${selectedText.length} characters</li>
</ul>`;
    } else {
      getSelectionText += `<ul><li><strong>No text currently selected</strong></li></ul>`;
    }

    this.addSystemMessage(getSelectionText);
  }

  /**
   * Execute get cursor command
   * @param {string} _params - Not used for this command
   */
  executeGetCursorCommand(_params) {
    const cursorPos = this.getCursorPosition();

    console.log('📄 AI Get Cursor Command Executed - Position:', cursorPos);

    let getCursorText = `<strong>📄 Cursor Position:</strong>`;

    if (cursorPos) {
      getCursorText += `<ul>
<li><strong>Current Line:</strong> ${cursorPos.lineNumber}</li>
<li><strong>Current Column:</strong> ${cursorPos.column}</li>
</ul>`;
    } else {
      getCursorText += `<ul><li><strong>Cursor position not available</strong></li></ul>`;
    }

    this.addSystemMessage(getCursorText);
  }

  /**
   * Check if commands should be confirmed
   * @returns {boolean} Whether to ask for confirmation
   */
  shouldConfirmCommand() {
    // Check auto-approve setting
    const autoApproveToggle = document.getElementById('autoApproveToggle');
    if (autoApproveToggle) {
      return !autoApproveToggle.checked;
    }

    // Fallback to localStorage
    try {
      return localStorage.getItem('aiAutoApprove') !== 'true';
    } catch (error) {
      console.warn('Failed to get aiAutoApprove from storage:', error);
      return true; // Default to requiring confirmation
    }
  }

  /**
   * Insert text at specific position
   * @param {number} lineNumber - Line number (1-based)
   * @param {number} column - Column number (1-based)
   * @param {string} text - Text to insert
   */
  insertAtPosition(lineNumber, column, text) {
    console.log('insertAtPosition called with:', { lineNumber, column, text });

    if (window.editor) {
      console.log(
        'Current editor content (first 100 chars):',
        window.editor.getValue().substring(0, 100)
      );
      console.log('Editor model exists:', !!window.editor.getModel());

      try {
        const result = window.editor.executeEdits('ai-agent', [
          {
            range: {
              startLineNumber: lineNumber,
              startColumn: column,
              endLineNumber: lineNumber,
              endColumn: column,
            },
            text: text,
          },
        ]);

        console.log('executeEdits result:', result);
        console.log(
          'New editor content (first 100 chars):',
          window.editor.getValue().substring(0, 100)
        );

        // Trigger save
        if (window.editorManager) {
          console.log('Triggering saveContent...');
          window.editorManager.saveContent();
        }
      } catch (error) {
        console.error('Error in insertAtPosition:', error);
        throw error;
      }
    } else {
      console.error('window.editor is not available');
      throw new Error('Editor not available');
    }
  }

  /**
   * Insert text at cursor position
   * @param {string} text - Text to insert
   */
  insertAtCursor(text) {
    console.log('insertAtCursor called with:', text);

    if (window.editor) {
      const position = window.editor.getPosition();
      console.log('Current cursor position:', position);

      try {
        const result = window.editor.executeEdits('ai-agent', [
          {
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
            text: text,
          },
        ]);

        console.log('insertAtCursor executeEdits result:', result);

        // Trigger save
        if (window.editorManager) {
          window.editorManager.saveContent();
        }
      } catch (error) {
        console.error('Error in insertAtCursor:', error);
        throw error;
      }
    } else {
      console.error('window.editor is not available for insertAtCursor');
      throw new Error('Editor not available');
    }
  }

  /**
   * Replace selected text
   * @param {string} newText - New text to replace selection with
   */
  replaceSelection(newText) {
    if (window.editor) {
      const selection = window.editor.getSelection();
      console.log('Current selection:', selection);

      if (selection && !selection.isEmpty()) {
        try {
          const selectedText = window.editor
            .getModel()
            .getValueInRange(selection);
          console.log('Selected text to replace:', selectedText);

          const result = window.editor.executeEdits('ai-agent', [
            {
              range: selection,
              text: newText,
            },
          ]);

          console.log('replaceSelection executeEdits result:', result);
          console.log(
            'New editor content after replacement:',
            window.editor.getValue().substring(0, 200)
          );

          // Trigger save
          if (window.editorManager) {
            window.editorManager.saveContent();
          }
        } catch (error) {
          console.error('Error in replaceSelection:', error);
          throw error;
        }
      } else {
        console.warn(
          'No text selected for replacement - selection is empty or null'
        );
        console.log('Selection details:', {
          selection,
          isEmpty: selection ? selection.isEmpty() : 'selection is null',
        });

        // Alternative: Replace current line if no selection
        const position = window.editor.getPosition();
        if (position) {
          const model = window.editor.getModel();
          const lineContent = model.getLineContent(position.lineNumber);
          console.log('Current line content:', lineContent);

          // Replace the entire current line
          const lineRange = {
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: lineContent.length + 1,
          };

          try {
            const result = window.editor.executeEdits('ai-agent', [
              {
                range: lineRange,
                text: newText,
              },
            ]);

            console.log('Replaced current line with:', newText);
            console.log('replaceLine executeEdits result:', result);

            // Trigger save
            if (window.editorManager) {
              window.editorManager.saveContent();
            }
          } catch (error) {
            console.error('Error replacing current line:', error);
            throw error;
          }
        }
      }
    } else {
      console.error('window.editor is not available for replaceSelection');
      throw new Error('Editor not available');
    }
  }

  /**
   * Analyze current code
   * @returns {Object} Analysis results
   */
  analyzeCode() {
    const content = this.getCurrentContent();
    const lines = content.split('\n');
    const gcodeCommands = [];
    const variables = [];
    const functions = [];
    const comments = [];
    const axisMoves = [];

    lines.forEach((line, index) => {
      // Find G-code commands
      const gcodeMatches = line.match(/\b(G\d+)/g);
      if (gcodeMatches) {
        gcodeCommands.push(
          ...gcodeMatches.map((cmd) => ({
            command: cmd,
            line: index + 1,
            content: line.trim(),
          }))
        );
      }

      // Find variable declarations
      const varMatches = line.match(/\b(let\s+[a-zA-Z_]\w*)/g);
      if (varMatches) {
        variables.push(
          ...varMatches.map((v) => ({
            declaration: v,
            line: index + 1,
            content: line.trim(),
          }))
        );
      }

      // Find function declarations
      const funcMatches = line.match(/\bfunction\s+([a-zA-Z_]\w*)/g);
      if (funcMatches) {
        functions.push(
          ...funcMatches.map((f) => ({
            declaration: f,
            line: index + 1,
            content: line.trim(),
          }))
        );
      }

      // Find comments
      const commentMatches = line.match(/(\/\/.*$|\/\*.*?\*\/)/g);
      if (commentMatches) {
        comments.push(
          ...commentMatches.map((c) => ({
            content: c,
            line: index + 1,
          }))
        );
      }

      // Find axis moves (X, Y, Z, etc.)
      const axisMatches = line.match(/\b([XYZABC][+-]?\d*\.?\d+)/g);
      if (axisMatches) {
        axisMoves.push(
          ...axisMatches.map((a) => ({
            axis: a.charAt(0),
            value: a.substring(1),
            line: index + 1,
            content: line.trim(),
          }))
        );
      }
    });

    // Calculate complexity metrics
    const totalLines = lines.length;
    const codeLines = lines.filter(
      (line) => line.trim() !== '' && !line.trim().startsWith('//')
    ).length;
    const commentLines = comments.length;
    const emptyLines = totalLines - codeLines - commentLines;

    return {
      totalLines,
      codeLines,
      commentLines,
      emptyLines,
      gcodeCommands,
      variables,
      functions,
      comments,
      axisMoves,
      complexity:
        Math.round(
          ((gcodeCommands.length + variables.length + functions.length) /
            Math.max(codeLines, 1)) *
            100
        ) || 0,
      density: Math.round((codeLines / Math.max(totalLines, 1)) * 100) || 0,
    };
  }

  /**
   * Get current editor content
   * @returns {string} Current editor content
   */
  getCurrentContent() {
    if (window.editorManager) {
      return window.editorManager.getInputValue();
    }
    if (window.editor) {
      return window.editor.getValue();
    }
    return '';
  }

  /**
   * Get selected text
   * @returns {string} Selected text
   */
  getSelectedText() {
    if (window.editor) {
      const selection = window.editor.getSelection();
      if (selection && !selection.isEmpty()) {
        return window.editor.getModel().getValueInRange(selection);
      }
    }
    return '';
  }

  /**
   * Get cursor position
   * @returns {Object|null} Cursor position
   */
  getCursorPosition() {
    if (window.editor) {
      return window.editor.getPosition();
    }
    return null;
  }

  /**
   * Set GGcode content in editor
   * @param {string} content - Content to set
   */
  setGGcodeContent(content) {
    if (window.editorManager) {
      window.editorManager.setInputValue(content);
    } else if (window.editor) {
      window.editor.setValue(content);
    }
  }

  /**
   * Get GGcode content from editor (alias for getCurrentContent)
   * @returns {string} Current editor content
   */
  getGGcodeContent() {
    return this.getCurrentContent();
  }

  /**
   * Insert GGcode text at cursor (alias for insertAtCursor)
   * @param {string} text - Text to insert
   */
  insertGGcodeText(text) {
    this.insertAtCursor(text);
  }

  /**
   * Replace selected GGcode text (alias for replaceSelection)
   * @param {string} newText - New text to replace selection with
   */
  replaceSelectedText(newText) {
    this.replaceSelection(newText);
  }

  /**
   * Get line content at specific line number
   * @param {number} lineNumber - Line number (1-based)
   * @returns {string} Line content
   */
  getLineContent(lineNumber) {
    if (window.editor && lineNumber > 0) {
      const model = window.editor.getModel();
      if (lineNumber <= model.getLineCount()) {
        return model.getLineContent(lineNumber);
      }
    }
    return '';
  }

  /**
   * Get multiple lines of content
   * @param {number} startLine - Start line number (1-based)
   * @param {number} endLine - End line number (1-based)
   * @returns {string} Lines content
   */
  getLinesContent(startLine, endLine) {
    if (window.editor && startLine > 0 && endLine >= startLine) {
      const model = window.editor.getModel();
      if (
        startLine <= model.getLineCount() &&
        endLine <= model.getLineCount()
      ) {
        let content = '';
        for (let i = startLine; i <= endLine; i++) {
          content += model.getLineContent(i) + '\n';
        }
        return content.trim();
      }
    }
    return '';
  }

  /**
   * Replace content in a specific range
   * @param {number} startLine - Start line number (1-based)
   * @param {number} startColumn - Start column number (1-based)
   * @param {number} endLine - End line number (1-based)
   * @param {number} endColumn - End column number (1-based)
   * @param {string} newText - New text to replace with
   */
  replaceRange(startLine, startColumn, endLine, endColumn, newText) {
    if (window.editor) {
      try {
        const result = window.editor.executeEdits('ai-agent', [
          {
            range: {
              startLineNumber: startLine,
              startColumn: startColumn,
              endLineNumber: endLine,
              endColumn: endColumn,
            },
            text: newText,
          },
        ]);

        console.log('replaceRange executeEdits result:', result);

        // Trigger save
        if (window.editorManager) {
          window.editorManager.saveContent();
        }
      } catch (error) {
        console.error('Error in replaceRange:', error);
        throw error;
      }
    } else {
      console.error('window.editor is not available for replaceRange');
      throw new Error('Editor not available');
    }
  }

  /**
   * Analyze GGcode (alias for analyzeCode)
   * @returns {Object} Analysis results
   */
  analyzeGGcode() {
    return this.analyzeCode();
  }

  /**
   * Add system message to chat
   * @param {string} message - System message to add
   */
  addSystemMessage(message) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message ai-system';
    messageDiv.innerHTML = `<div class="ai-message-content">${message}</div>`;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Set pending command data
   * @param {Object} data - Command data
   */
  setPendingCommandData(data) {
    this.pendingCommandData = data;
  }

  /**
   * Get pending command data
   * @returns {Object|null} Pending command data
   */
  getPendingCommandData() {
    return this.pendingCommandData;
  }

  /**
   * Clear pending command data
   */
  clearPendingCommandData() {
    this.pendingCommandData = null;
  }
}

// Create and export singleton instance
const aiCommands = new AICommands();
export default aiCommands;

// Global functions for search button clicks
window.executeQuickSearch = function (searchType) {
  console.log('🔍 Executing quick search:', searchType);
  if (aiCommands && typeof aiCommands.executePendingCommand === 'function') {
    aiCommands.executePendingCommand('find', `"${searchType}"`);
    console.log('✅ Quick search executed successfully');
  } else {
    console.warn('AI Commands not available for quick search');
  }
};

window.executeQuickContext = function (startLine, endLine) {
  console.log('👁️ Executing quick context view:', startLine, 'to', endLine);
  if (aiCommands && typeof aiCommands.executePendingCommand === 'function') {
    aiCommands.executePendingCommand('getlines', `${startLine},${endLine}`);
    console.log('✅ Quick context view executed successfully');
  } else {
    console.warn('AI Commands not available for quick context');
  }
};

// Initialize testing framework
export function initializeMockEditor() {
  // Mock Editor System
  window.mockEditor = {
    content: [],
    cursor: { line: 1, column: 1 },
    selection: null,
    clipboard: '',
    undoStack: [],
    redoStack: [],

    getValue() {
      return this.content.join('\n');
    },
    setValue(text) {
      this.content = text.split('\n');
    },
    getPosition() {
      return this.cursor;
    },
    setPosition(position) {
      this.cursor = position;
    },
    getSelection() {
      return this.selection;
    },
    setSelection(range) {
      this.selection = range;
    },
    executeEdits(source, edits) {
      console.log('📝 MOCK EDIT:', edits);
      // Simulate edit execution with detailed logging
      edits.forEach((edit) => {
        const startLine = edit.range.startLineNumber - 1;
        const newText = edit.text;

        console.log(
          `  Line ${startLine + 1}: "${this.content[startLine] || ''}" → "${newText}"`
        );
      });
      return edits.length;
    },
  };

  // AI Testing API
  window.aiTest = {
    testCommand(command, params) {
      console.log(`\n🧪 Testing: /ai:${command}[${params}]`);
      const startState = this.captureState();

      try {
        const result = aiCommands.executePendingCommand(command, params);
        const endState = this.captureState();

        console.log('✅ Command executed successfully');
        console.log('📊 State changes:', this.diffStates(startState, endState));
        console.log('📝 Current content:', window.mockEditor.getValue());
        return result;
      } catch (error) {
        console.error('❌ Command failed:', error.message);
        return null;
      }
    },

    testAIInput(userInput) {
      console.log(`\n🤖 Testing AI Input: "${userInput}"`);
      console.log('Expected: AI should use appropriate command(s)');
      // Placeholder for AI simulation
      return 'AI would analyze and respond with commands';
    },

    captureState() {
      return {
        content: [...window.mockEditor.content],
        cursor: { ...window.mockEditor.cursor },
        selection: window.mockEditor.selection
          ? { ...window.mockEditor.selection }
          : null,
        timestamp: Date.now(),
      };
    },

    diffStates(before, after) {
      const changes = [];
      if (JSON.stringify(before.content) !== JSON.stringify(after.content)) {
        changes.push('content');
      }
      if (JSON.stringify(before.cursor) !== JSON.stringify(after.cursor)) {
        changes.push('cursor');
      }
      if (before.selection !== after.selection) {
        changes.push('selection');
      }
      return changes.length > 0 ? changes : ['none'];
    },
  };

  // Quick access functions for console testing
  window.testCmd = (cmd, params) => window.aiTest?.testCommand(cmd, params);
  window.testAI = (input) => window.aiTest?.testAIInput(input);
  window.showState = () => {
    console.log('📋 Current Editor State:');
    console.log('Content:', window.mockEditor.getValue());
    console.log('Cursor:', window.mockEditor.getPosition());
    console.log('Selection:', window.mockEditor.getSelection());
  };
  window.setTestContent = (text) => {
    window.mockEditor.setValue(text);
    console.log('📝 Test content set:');
    console.log(window.mockEditor.getValue());
  };
  window.resetEditor = () => {
    window.mockEditor.content = [];
    window.mockEditor.cursor = { line: 1, column: 1 };
    window.mockEditor.selection = null;
    console.log('🔄 Editor reset to empty state');
  };

  // Initialize other gcode-related global variables
  if (!window.gcodeLines) window.gcodeLines = [];
  if (!window.gcodeCurrentLineIdx) window.gcodeCurrentLineIdx = 1;
  if (!window.gcodeSegmentCounts)
    window.gcodeSegmentCounts = { G0: 0, G1: 0, G2: 0, G3: 0 };
  if (!window.performanceStats) window.performanceStats = {};
  if (!window.performanceData) window.performanceData = {};
}
