"use strict";
(self["webpackChunkggcode_compiler"] = self["webpackChunkggcode_compiler"] || []).push([["src_client_js_ui_aiCommands_js"],{

/***/ "./src/client/js/ui/aiCommands.js":
/*!****************************************!*\
  !*** ./src/client/js/ui/aiCommands.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initializeMockEditor: () => (/* binding */ initializeMockEditor)
/* harmony export */ });
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * AI Commands - Editor integration functions for AI commands
 * Handles execution of AI-generated commands on the editor
 */
var AICommands = /*#__PURE__*/function () {
  function AICommands() {
    _classCallCheck(this, AICommands);
    this.pendingCommandData = null;
  }

  /**
   * Execute pending command
   * @param {string} command - AI command to execute
   * @param {string} params - Command parameters
   */
  return _createClass(AICommands, [{
    key: "executePendingCommand",
    value: function executePendingCommand(command, params) {
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
            this.addSystemMessage("<strong>System:</strong> Unknown command: ".concat(command));
        }
      } catch (error) {
        console.error('Error executing pending command:', error);
        this.addSystemMessage("<strong>System:</strong> Error executing command: ".concat(error.message));
      }
    }

    /**
     * Execute insert at position command
     * @param {string} params - Command parameters (lineNumber,column,text)
     */
  }, {
    key: "executeInsertAtCommand",
    value: function executeInsertAtCommand(params) {
      var insertParams = params.match(/(\d+),(\d+),(.+)/);
      if (insertParams) {
        var lineNumber = parseInt(insertParams[1]);
        var column = parseInt(insertParams[2]);
        var text = insertParams[3].replace(/^["']|["']$/g, '');
        if (this.shouldConfirmCommand()) {
          if (confirm("Insert \"".concat(text, "\" at line ").concat(lineNumber, ", column ").concat(column, "?"))) {
            this.insertAtPosition(lineNumber, column, text);
            this.addSystemMessage("<strong>System:</strong> Successfully inserted text at position (".concat(lineNumber, ",").concat(column, ")."));
          }
        } else {
          this.insertAtPosition(lineNumber, column, text);
          this.addSystemMessage("<strong>System:</strong> Successfully inserted text at position (".concat(lineNumber, ",").concat(column, ")."));
        }
      }
    }

    /**
     * Execute insert at cursor command
     * @param {string} params - Text to insert
     */
  }, {
    key: "executeInsertCommand",
    value: function executeInsertCommand(params) {
      var text = params.replace(/^["']|["']$/g, '');
      if (this.shouldConfirmCommand()) {
        if (confirm("Insert \"".concat(text, "\" at cursor position?"))) {
          this.insertAtCursor(text);
          this.addSystemMessage('<strong>System:</strong> Successfully inserted text at cursor position.');
        }
      } else {
        this.insertAtCursor(text);
        this.addSystemMessage('<strong>System:</strong> Successfully inserted text at cursor position.');
      }
    }

    /**
     * Execute replace selection command
     * @param {string} params - New text to replace selection with
     */
  }, {
    key: "executeReplaceCommand",
    value: function executeReplaceCommand(params) {
      var newText = params.replace(/^["']|["']$/g, '');
      if (this.shouldConfirmCommand()) {
        if (confirm("Replace selected text with \"".concat(newText, "\"?"))) {
          this.replaceSelection(newText);
          this.addSystemMessage('<strong>System:</strong> Successfully replaced selected text.');
        }
      } else {
        this.replaceSelection(newText);
        this.addSystemMessage('<strong>System:</strong> Successfully replaced selected text.');
      }
    }

    /**
     * Execute replace range command
     * @param {string} params - Command parameters (startLine,startColumn,endLine,endColumn,newText)
     */
  }, {
    key: "executeReplaceRangeCommand",
    value: function executeReplaceRangeCommand(params) {
      var rangeParams = params.match(/(\d+),(\d+),(\d+),(\d+),(.+)/);
      if (rangeParams) {
        var startLine = parseInt(rangeParams[1]);
        var startColumn = parseInt(rangeParams[2]);
        var endLine = parseInt(rangeParams[3]);
        var endColumn = parseInt(rangeParams[4]);
        var newText = rangeParams[5].replace(/^["']|["']$/g, '');
        if (this.shouldConfirmCommand()) {
          if (confirm("Replace text from (".concat(startLine, ",").concat(startColumn, ") to (").concat(endLine, ",").concat(endColumn, ") with \"").concat(newText, "\"?"))) {
            this.replaceRange(startLine, startColumn, endLine, endColumn, newText);
            this.addSystemMessage("<strong>System:</strong> Successfully replaced text in range (".concat(startLine, ",").concat(startColumn, ") to (").concat(endLine, ",").concat(endColumn, ")."));
          }
        } else {
          this.replaceRange(startLine, startColumn, endLine, endColumn, newText);
          this.addSystemMessage("<strong>System:</strong> Successfully replaced text in range (".concat(startLine, ",").concat(startColumn, ") to (").concat(endLine, ",").concat(endColumn, ")."));
        }
      } else {
        console.error('Invalid replacerange parameters:', params);
        this.addSystemMessage("<strong>System:</strong> Invalid replacerange parameters: ".concat(params));
      }
    }

    /**
     * Execute analyze command
     */
  }, {
    key: "executeAnalyzeCommand",
    value: function executeAnalyzeCommand() {
      var analysis = this.analyzeCode();
      var analysisSummary = '<strong>GGcode Analysis:</strong>' + '<ul>' + '<li>Total Lines: ' + analysis.totalLines + '</li>' + '<li>Code Lines: ' + analysis.codeLines + '</li>' + '<li>Comment Lines: ' + analysis.commentLines + '</li>' + '<li>G-code Commands: ' + analysis.gcodeCommands.length + '</li>' + '<li>Variables: ' + analysis.variables.length + '</li>' + '<li>Functions: ' + analysis.functions.length + '</li>' + '<li>Complexity: ' + analysis.complexity + '%</li>' + '<li>Code Density: ' + analysis.density + '%</li>' + '</ul>';
      this.addSystemMessage(analysisSummary);
      console.log('AI analyzed GGcode:', analysis);
    }

    /**
     * Execute help command
     */
  }, {
    key: "executeHelpCommand",
    value: function executeHelpCommand() {
      var helpText = "<strong>\uD83E\uDD16 AI Commands Help:</strong>\n<ul>\n<li><strong>/ai:help</strong> - Show this help</li>\n<li><strong>/ai:capabilities</strong> - List all AI capabilities</li>\n<li><strong>/ai:list</strong> - List commands by category</li>\n<li><strong>/ai:status</strong> - Show current editor state</li>\n<li><strong>/ai:analyze</strong> - Analyze G-code file</li>\n</ul>\n\n<strong>\uD83D\uDCDD Editing Commands:</strong>\n<ul>\n<li><strong>/ai:insert[\"text\"]</strong> - Insert text at cursor</li>\n<li><strong>/ai:insertat[1,1,\"text\"]</strong> - Insert at specific position</li>\n<li><strong>/ai:replace[\"text\"]</strong> - Replace selected text</li>\n<li><strong>/ai:replacerange[start,end,\"text\"]</strong> - Replace text range</li>\n</ul>\n\n<strong>\uD83D\uDCD6 Reading Commands:</strong>\n<ul>\n<li><strong>/ai:getcontent</strong> - Get entire file content</li>\n<li><strong>/ai:getlines[1,5]</strong> - Get specific lines</li>\n<li><strong>/ai:getline[2]</strong> - Get specific line</li>\n<li><strong>/ai:getselection</strong> - Get selected text</li>\n<li><strong>/ai:getcursor</strong> - Get cursor position</li>\n</ul>\n\n<strong>\uD83D\uDD27 G-code Specific:</strong>\n<ul>\n<li><strong>/ai:optimize</strong> - Optimize G-code for efficiency</li>\n<li><strong>/ai:validate</strong> - Validate G-code syntax</li>\n<li><strong>/ai:simulate</strong> - Start G-code simulation</li>\n</ul>\n\n<strong>\uD83D\uDCA1 Usage Tips:</strong>\n<ul>\n<li>Commands are case-sensitive</li>\n<li>Line and column numbers are 1-based</li>\n<li>Text should be quoted with double quotes</li>\n<li>Use /ai:help[\"command\"] for detailed help on specific commands</li>\n</ul>";
      console.log('📋 AI Help Command Executed');
      this.addSystemMessage(helpText);
    }

    /**
     * Execute capabilities command
     */
  }, {
    key: "executeCapabilitiesCommand",
    value: function executeCapabilitiesCommand() {
      var capabilitiesText = "<strong>\uD83D\uDE80 AI System Capabilities:</strong>\n\n<strong>\uD83E\uDD16 AI Model Information:</strong>\n<ul>\n<li><strong>Model:</strong> deepseek-coder-v2:16b</li>\n<li><strong>Type:</strong> Code-focused LLM</li>\n<li><strong>Context:</strong> 32K tokens</li>\n<li><strong>Specialization:</strong> CNC/G-code programming</li>\n</ul>\n\n<strong>\uD83D\uDCDD Text Editing Capabilities:</strong>\n<ul>\n<li>\u2705 Insert text at any position</li>\n<li>\u2705 Replace text selections</li>\n<li>\u2705 Multi-line text manipulation</li>\n<li>\u2705 Syntax-aware editing</li>\n<li>\u2705 Real-time editor integration</li>\n</ul>\n\n<strong>\uD83D\uDD0D Code Analysis Features:</strong>\n<ul>\n<li>\u2705 G-code syntax validation</li>\n<li>\u2705 Performance optimization suggestions</li>\n<li>\u2705 Code complexity analysis</li>\n<li>\u2705 Comment and documentation analysis</li>\n<li>\u2705 Feed rate and speed optimization</li>\n</ul>\n\n<strong>\uD83D\uDCCA Data Processing:</strong>\n<ul>\n<li>\u2705 Real-time G-code parsing</li>\n<li>\u2705 3D visualization integration</li>\n<li>\u2705 Performance metrics tracking</li>\n<li>\u2705 Error detection and reporting</li>\n<li>\u2705 Code statistics generation</li>\n</ul>\n\n<strong>\uD83C\uDFAF G-code Specific Operations:</strong>\n<ul>\n<li>\u2705 Rapid move optimization (G0)</li>\n<li>\u2705 Feed rate analysis and tuning</li>\n<li>\u2705 Tool path efficiency calculation</li>\n<li>\u2705 CNC machining best practices</li>\n<li>\u2705 Multi-axis coordinate validation</li>\n</ul>\n\n<strong>\uD83D\uDD04 Integration Features:</strong>\n<ul>\n<li>\u2705 Real-time AI chat interface</li>\n<li>\u2705 Command auto-completion</li>\n<li>\u2705 Error handling and recovery</li>\n<li>\u2705 User confirmation system</li>\n<li>\u2705 Undo/redo compatibility</li>\n</ul>\n\n<strong>\uD83D\uDCC8 Performance Metrics:</strong>\n<ul>\n<li><strong>Command Execution:</strong> <50ms average</li>\n<li><strong>AI Response Time:</strong> 2-5 seconds</li>\n<li><strong>Code Analysis:</strong> Real-time</li>\n<li><strong>Memory Usage:</strong> Optimized for large files</li>\n</ul>\n\n<strong>\uD83C\uDFA8 User Experience:</strong>\n<ul>\n<li>\u2705 Intuitive command syntax</li>\n<li>\u2705 Contextual help system</li>\n<li>\u2705 Visual feedback for all operations</li>\n<li>\u2705 Error messages with suggestions</li>\n<li>\u2705 Progress indicators for long operations</li>\n</ul>";
      console.log('🚀 AI Capabilities Command Executed');
      this.addSystemMessage(capabilitiesText);
    }

    /**
     * Execute status command
     */
  }, {
    key: "executeStatusCommand",
    value: function executeStatusCommand() {
      var cursorPosition = this.getCursorPosition();
      var selectedText = this.getSelectedText();
      var currentContent = this.getCurrentContent();
      var lines = currentContent.split('\n');
      var totalLines = lines.length;
      var currentLine = cursorPosition ? cursorPosition.lineNumber : 1;
      var currentColumn = cursorPosition ? cursorPosition.column : 1;
      var statusText = "<strong>\uD83D\uDCCA Editor Status:</strong>\n\n<strong>\uD83D\uDCDD File Information:</strong>\n<ul>\n<li><strong>Total Lines:</strong> ".concat(totalLines, "</li>\n<li><strong>File Size:</strong> ").concat(currentContent.length, " characters</li>\n<li><strong>Code Density:</strong> ").concat(Math.round(lines.filter(function (l) {
        return l.trim() !== '';
      }).length / totalLines * 100), "%</li>\n<li><strong>Empty Lines:</strong> ").concat(lines.filter(function (l) {
        return l.trim() === '';
      }).length, "</li>\n</ul>\n\n<strong>\uD83D\uDCCD Cursor Position:</strong>\n<ul>\n<li><strong>Current Line:</strong> ").concat(currentLine, " of ").concat(totalLines, "</li>\n<li><strong>Current Column:</strong> ").concat(currentColumn, "</li>\n<li><strong>Progress:</strong> ").concat(Math.round(currentLine / totalLines * 100), "% through file</li>\n</ul>\n\n<strong>\u2702\uFE0F Selection Status:</strong>\n<ul>\n<li><strong>Has Selection:</strong> ").concat(selectedText ? 'Yes' : 'No', "</li>\n").concat(selectedText ? "<li><strong>Selected Text:</strong> \"".concat(selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText, "\"</li>") : '', "\n<li><strong>Selection Length:</strong> ").concat(selectedText.length, " characters</li>\n</ul>\n\n<strong>\uD83D\uDD27 Editor State:</strong>\n<ul>\n<li><strong>Editor Available:</strong> ").concat(window.editor ? 'Yes' : 'No', "</li>\n<li><strong>Editor Manager:</strong> ").concat(window.editorManager ? 'Yes' : 'No', "</li>\n<li><strong>Auto-approve Commands:</strong> ").concat(!this.shouldConfirmCommand() ? 'Yes' : 'No', "</li>\n<li><strong>Command History:</strong> ").concat(this.getPendingCommandData() ? 'Active' : 'None', "</li>\n</ul>\n\n<strong>\uD83C\uDFAF Current Line Content:</strong>\n<ul>\n<li><strong>Line ").concat(currentLine, ":</strong> \"").concat(this.getLineContent(currentLine), "\"</li>\n</ul>\n\n<strong>\uD83D\uDCC8 Quick Stats:</strong>\n<ul>\n<li><strong>G-code Commands:</strong> ").concat(lines.filter(function (l) {
        return /\bG\d+/.test(l);
      }).length, "</li>\n<li><strong>Comments:</strong> ").concat(lines.filter(function (l) {
        return l.trim().startsWith('//');
      }).length, "</li>\n<li><strong>Variables:</strong> ").concat(lines.filter(function (l) {
        return /\blet\s+/.test(l);
      }).length, "</li>\n<li><strong>Functions:</strong> ").concat(lines.filter(function (l) {
        return /\bfunction\s+/.test(l);
      }).length, "</li>\n</ul>");
      console.log('📊 AI Status Command Executed');
      console.log('Current cursor position:', cursorPosition);
      console.log('Selected text length:', selectedText.length);
      this.addSystemMessage(statusText);
    }

    /**
     * Execute find command with intelligent search patterns
     * @param {string} params - Text to search for or special search type
     */
  }, {
    key: "executeFindCommand",
    value: function executeFindCommand(params) {
      var searchText = params.replace(/^["']|["']$/g, '');
      var currentContent = this.getCurrentContent();
      var lines = currentContent.split('\n');
      console.log('🔍 AI Find Command Executed - Searching for:', searchText);

      // Check for special search patterns
      var searchPattern = this.getIntelligentSearchPattern(searchText);
      var matches = [];
      lines.forEach(function (line, index) {
        var isMatch = false;
        var matchIndex = -1;
        if (searchPattern.isRegex) {
          // Use regex search
          var regex = new RegExp(searchPattern.pattern, searchPattern.flags || 'gi');
          var match = line.match(regex);
          if (match) {
            isMatch = true;
            matchIndex = line.indexOf(match[0]);
          }
        } else {
          // Use text search
          var lineLower = line.toLowerCase();
          var patternLower = searchPattern.pattern.toLowerCase();
          matchIndex = lineLower.indexOf(patternLower);
          isMatch = matchIndex !== -1;
        }
        if (isMatch) {
          matches.push({
            lineNumber: index + 1,
            content: line.trim(),
            matchIndex: matchIndex,
            searchType: searchPattern.type
          });
        }
      });
      var findText = "<strong>\uD83D\uDD0D Search Results for \"".concat(searchText, "\":</strong>");
      if (matches.length === 0) {
        findText += "<ul><li><strong>No matches found</strong></li>";
        if (searchPattern.suggestions) {
          findText += "<li><strong>\uD83D\uDCA1 Try:</strong> ".concat(searchPattern.suggestions.join(', '), "</li>");
        }
        findText += "</ul>";
      } else {
        findText += "<ul><li><strong>Found ".concat(matches.length, " match(es):</strong></li></ul>");

        // Show first 10 matches with context
        matches.slice(0, 10).forEach(function (match) {
          var beforeMatch = match.content.substring(0, match.matchIndex);
          var matchedText = match.content.substring(match.matchIndex, match.matchIndex + (searchPattern.isRegex ? match.content.match(new RegExp(searchPattern.pattern, searchPattern.flags || 'gi'))[0].length : searchPattern.pattern.length));
          var afterMatch = match.content.substring(match.matchIndex + (searchPattern.isRegex ? match.content.match(new RegExp(searchPattern.pattern, searchPattern.flags || 'gi'))[0].length : searchPattern.pattern.length));
          findText += "<ul>\n<li><strong>Line ".concat(match.lineNumber, ":</strong> ").concat(beforeMatch, "<mark>").concat(matchedText, "</mark>").concat(afterMatch, "</li>\n</ul>");
        });
        if (matches.length > 10) {
          findText += "<ul><li><strong>... and ".concat(matches.length - 10, " more matches</strong></li></ul>");
        }
      }

      // Add search type information
      if (searchPattern.type !== 'text') {
        findText += "<strong>\uD83D\uDD0D Search Type:</strong> <em>".concat(searchPattern.description, "</em><br>");
      }

      // Add CSS styles for search buttons
      findText += "<style>\n.search-quick-actions, .search-context-actions {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 8px;\n    margin: 10px 0;\n}\n\n.search-action-btn, .context-action-btn {\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    border: none;\n    padding: 8px 12px;\n    border-radius: 6px;\n    cursor: pointer;\n    font-size: 12px;\n    font-weight: 500;\n    transition: all 0.2s ease;\n    box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n\n.search-action-btn:hover, .context-action-btn:hover {\n    transform: translateY(-1px);\n    box-shadow: 0 4px 8px rgba(0,0,0,0.15);\n    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);\n}\n\n.search-action-btn:active, .context-action-btn:active {\n    transform: translateY(0);\n    box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n\n.context-action-btn {\n    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);\n}\n\n.context-action-btn:hover {\n    background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);\n}\n</style>";

      // Add quick actions with clickable buttons
      findText += "<strong>\uD83D\uDCA1 Quick Actions:</strong>\n<div class=\"search-quick-actions\">\n<button class=\"search-action-btn\" onclick=\"executeQuickSearch('variable')\" title=\"Find variable assignments\">\n    \uD83D\uDD0D Variables\n</button>\n<button class=\"search-action-btn\" onclick=\"executeQuickSearch('function')\" title=\"Find function definitions\">\n    \uD83D\uDD27 Functions\n</button>\n<button class=\"search-action-btn\" onclick=\"executeQuickSearch('comment')\" title=\"Find comments\">\n    \uD83D\uDCAC Comments\n</button>\n<button class=\"search-action-btn\" onclick=\"executeQuickSearch('gcode')\" title=\"Find G-code commands\">\n    \u2699\uFE0F G-code\n</button>\n<button class=\"search-action-btn\" onclick=\"executeQuickSearch('axis')\" title=\"Find axis movements\">\n    \uD83D\uDCCD Axis\n</button>\n<button class=\"search-action-btn\" onclick=\"executeQuickSearch('loop')\" title=\"Find loop structures\">\n    \uD83D\uDD04 Loops\n</button>\n</div>";

      // Add context viewing for matches
      if (matches.length > 0) {
        findText += "<strong>\uD83D\uDCC4 Context Actions:</strong>\n<div class=\"search-context-actions\">";
        matches.slice(0, 3).forEach(function (match) {
          var contextStart = Math.max(1, match.lineNumber - 2);
          var contextEnd = Math.min(lines.length, match.lineNumber + 2);
          findText += "<button class=\"context-action-btn\" onclick=\"executeQuickContext(".concat(contextStart, ", ").concat(contextEnd, ")\" title=\"View lines ").concat(contextStart, "-").concat(contextEnd, "\">\n                    \uD83D\uDC41\uFE0F Lines ").concat(contextStart, "-").concat(contextEnd, "\n                </button>");
        });
        findText += "</div>";
      }
      console.log("Found ".concat(matches.length, " matches for \"").concat(searchText, "\""));
      this.addSystemMessage(findText);
    }

    /**
     * Get intelligent search pattern based on input
     * @param {string} input - Search input
     * @returns {Object} Search pattern with type, pattern, and flags
     */
  }, {
    key: "getIntelligentSearchPattern",
    value: function getIntelligentSearchPattern(input) {
      var lowerInput = input.toLowerCase();

      // Special search patterns
      if (lowerInput === 'variable' || lowerInput === 'variables' || lowerInput.includes('set variable')) {
        return {
          type: 'variable',
          description: 'Variable assignments and declarations',
          pattern: '\\blet\\s+[a-zA-Z_]\\w*\\s*=|\\b[a-zA-Z_]\\w*\\s*=\\s*[^;]+',
          flags: 'gi',
          isRegex: true,
          suggestions: ['"let x = 5"', '"x = 10"', '"radius = 8"']
        };
      }
      if (lowerInput === 'function' || lowerInput === 'functions' || lowerInput.includes('function')) {
        return {
          type: 'function',
          description: 'Function definitions',
          pattern: '\\bfunction\\s+[a-zA-Z_]\\w*|\\blet\\s+[a-zA-Z_]\\w*\\s*=\\s*function',
          flags: 'gi',
          isRegex: true,
          suggestions: ['"function spiral"', '"let draw = function"']
        };
      }
      if (lowerInput === 'comment' || lowerInput === 'comments') {
        return {
          type: 'comment',
          description: 'Comments in code',
          pattern: '//.*$|/\\*.*\\*/',
          flags: 'gm',
          isRegex: true,
          suggestions: ['"// Set feed rate"', '"/* Multi-line comment */"']
        };
      }
      if (lowerInput === 'gcode' || lowerInput === 'g-code' || lowerInput.includes('g-code')) {
        return {
          type: 'gcode',
          description: 'G-code commands',
          pattern: '\\bG\\d+|\\bM\\d+',
          flags: 'gi',
          isRegex: true,
          suggestions: ['"G0 X10 Y20"', '"G1 F100"', '"M3 S1000"']
        };
      }
      if (lowerInput === 'axis' || lowerInput === 'axes' || lowerInput.includes('axis move')) {
        return {
          type: 'axis',
          description: 'Axis movements (X, Y, Z)',
          pattern: '\\b[XYZABC][+-]?\\d*\\.?\\d+',
          flags: 'gi',
          isRegex: true,
          suggestions: ['"X10 Y20"', '"Z-5"', '"A90"']
        };
      }
      if (lowerInput === 'loop' || lowerInput === 'loops' || lowerInput.includes('loop')) {
        return {
          type: 'loop',
          description: 'Loop structures',
          pattern: '\\bfor\\s*\\(|\\bwhile\\s*\\(|\\bdo\\s*\\{',
          flags: 'gi',
          isRegex: true,
          suggestions: ['"for(let i = 0"', '"while(x < 10"']
        };
      }
      if (lowerInput === 'math' || lowerInput === 'calculation' || lowerInput.includes('math')) {
        return {
          type: 'math',
          description: 'Mathematical operations',
          pattern: '[+\\-*/%]\\s*\\d|\\d\\s*[+\\-*/%]',
          flags: 'gi',
          isRegex: true,
          suggestions: ['"x + 5"', '"radius * 2"', '"angle / 2"']
        };
      }
      if (lowerInput === 'coordinate' || lowerInput === 'coordinates' || lowerInput.includes('coordinate')) {
        return {
          type: 'coordinate',
          description: 'Coordinate definitions',
          pattern: '\\bX\\d+\\s+Y\\d+|\\bY\\d+\\s+X\\d+',
          flags: 'gi',
          isRegex: true,
          suggestions: ['"X10 Y20"', '"Y5 X15"']
        };
      }

      // Check for regex patterns (enclosed in forward slashes)
      if (input.startsWith('/') && input.includes('/', 1)) {
        var lastSlashIndex = input.lastIndexOf('/');
        var pattern = input.slice(1, lastSlashIndex);
        var flags = input.slice(lastSlashIndex + 1);
        return {
          type: 'regex',
          description: 'Custom regex pattern',
          pattern: pattern,
          flags: flags,
          isRegex: true
        };
      }

      // Default text search
      return {
        type: 'text',
        description: 'Text search',
        pattern: input,
        isRegex: false
      };
    }

    /**
     * Execute get line command
     * @param {string} params - Line number, negative index, or special keyword ("last", "end")
     */
  }, {
    key: "executeGetLineCommand",
    value: function executeGetLineCommand(params) {
      var cleanParams = params.replace(/^["']|["']$/g, '').toLowerCase();
      var lineNumber;
      var isSpecialKeyword = false;
      var isNegativeIndex = false;

      // Handle special keywords
      if (cleanParams === 'last' || cleanParams === 'end') {
        // Get the last line of the file
        var content = this.getCurrentContent();
        var lines = content.split('\n');
        lineNumber = lines.length;
        isSpecialKeyword = true;
      } else {
        // Parse as line number (can be negative for indexing from end)
        var parsedNumber = parseInt(cleanParams);
        if (isNaN(parsedNumber)) {
          console.error('Invalid line number parameter:', params);
          this.addSystemMessage("<strong>\uD83D\uDCC4 Line Content:</strong><ul><li><strong>Invalid line specification: ".concat(params, "</strong></li><li><strong>Examples: [5], [-1], [last], [end]</strong></li></ul>"));
          return;
        }

        // Handle negative indexing (Python-style)
        if (parsedNumber < 0) {
          var _content = this.getCurrentContent();
          var _lines = _content.split('\n');
          lineNumber = _lines.length + parsedNumber + 1; // -1 becomes last line, -2 becomes second to last, etc.
          isNegativeIndex = true;
        } else {
          lineNumber = parsedNumber;
        }
      }

      // Validate the calculated line number
      if (lineNumber < 1) {
        console.error('Calculated line number is invalid:', lineNumber);
        this.addSystemMessage("<strong>\uD83D\uDCC4 Line Content:</strong><ul><li><strong>Invalid line specification: ".concat(params, "</strong></li><li><strong>Line number would be out of range</strong></li></ul>"));
        return;
      }
      var lineContent = this.getLineContent(lineNumber);
      var indexType = isSpecialKeyword ? '(last line)' : isNegativeIndex ? "(index ".concat(parseInt(cleanParams), ")") : '';
      console.log('📄 AI Get Line Command Executed - Line:', lineNumber, indexType);
      var getLineText = "<strong>\uD83D\uDCC4 Line ".concat(lineNumber, " Content:</strong>");
      if (lineContent) {
        getLineText += "<ul><li><strong>Line ".concat(lineNumber).concat(indexType ? ' ' + indexType : '', ":</strong> \"").concat(lineContent, "\"</li></ul>");
      } else {
        getLineText += "<ul><li><strong>Line ".concat(lineNumber, " not found - file may have fewer lines</strong></li></ul>");
      }
      this.addSystemMessage(getLineText);
    }

    /**
     * Execute get lines command
     * @param {string} params - Start and end line numbers (e.g., "1,5" or "1-5" or "1,end")
     */
  }, {
    key: "executeGetLinesCommand",
    value: function executeGetLinesCommand(params) {
      var cleanParams = params.replace(/^["']|["']$/g, '').toLowerCase();
      var startLine, endLine;

      // Try comma-separated format first (1,5 or 1,end)
      if (cleanParams.includes(',')) {
        var lineParams = cleanParams.split(',');
        startLine = this.parseLineSpec(lineParams[0]);
        endLine = this.parseLineSpec(lineParams[1]);
      }
      // Try dash format (1-5 or 1-end)
      else if (cleanParams.includes('-')) {
        var _lineParams = cleanParams.split('-');
        startLine = this.parseLineSpec(_lineParams[0]);
        endLine = this.parseLineSpec(_lineParams[1]);
      }
      // Try single number format
      else {
        var singleLine = this.parseLineSpec(cleanParams);
        startLine = singleLine;
        endLine = singleLine;
      }

      // Validate parsed values
      if (isNaN(startLine) || isNaN(endLine) || startLine < 1 || endLine < startLine) {
        console.error('Invalid line range parameters:', params);
        this.addSystemMessage("<strong>\uD83D\uDCC4 Lines Content:</strong><ul><li><strong>Invalid range format: ".concat(params, "</strong></li><li><strong>Examples: [1,5], [1-5], [1,end], [10] for single line</strong></li></ul>"));
        return;
      }
      var linesContent = this.getLinesContent(startLine, endLine);
      console.log('📄 AI Get Lines Command Executed - Range:', startLine, 'to', endLine);
      var getLinesText = "<strong>\uD83D\uDCC4 Lines ".concat(startLine, "-").concat(endLine, " Content:</strong>");
      if (linesContent) {
        var lines = linesContent.split('\n');
        getLinesText += '<ul>';
        lines.forEach(function (line, index) {
          var lineNumber = startLine + index;
          getLinesText += "<li><strong>Line ".concat(lineNumber, ":</strong> \"").concat(line, "\"</li>");
        });
        getLinesText += '</ul>';
      } else {
        getLinesText += "<ul><li><strong>No content found for lines ".concat(startLine, "-").concat(endLine, "</strong></li></ul>");
      }
      this.addSystemMessage(getLinesText);
    }

    /**
     * Parse line specification (number or special keyword)
     * @param {string} spec - Line specification (e.g., "5", "end", "last")
     * @returns {number} Parsed line number
     */
  }, {
    key: "parseLineSpec",
    value: function parseLineSpec(spec) {
      if (!spec) return NaN;
      var lowerSpec = spec.toLowerCase();

      // Handle special keywords
      if (lowerSpec === 'last' || lowerSpec === 'end') {
        var content = this.getCurrentContent();
        var lines = content.split('\n');
        return lines.length;
      }

      // Handle negative indexing (Python-style)
      var parsedNumber = parseInt(lowerSpec);
      if (!isNaN(parsedNumber)) {
        if (parsedNumber < 0) {
          // Handle negative indexing
          var _content2 = this.getCurrentContent();
          var _lines2 = _content2.split('\n');
          return _lines2.length + parsedNumber + 1; // -1 becomes last line, -2 becomes second to last, etc.
        }
        return parsedNumber;
      }
      return NaN;
    }

    /**
     * Execute get content command
     * @param {string} _params - Not used for this command
     */
  }, {
    key: "executeGetContentCommand",
    value: function executeGetContentCommand(_params) {
      var content = this.getCurrentContent();
      var lines = content.split('\n');
      console.log('📄 AI Get Content Command Executed - Total lines:', lines.length);
      var getContentText = "<strong>\uD83D\uDCC4 Full File Content:</strong>\n<ul>\n<li><strong>Total Lines:</strong> ".concat(lines.length, "</li>\n<li><strong>File Size:</strong> ").concat(content.length, " characters</li>\n</ul>\n\n<strong>\uD83D\uDCDD Content Preview (first 20 lines):</strong>\n<ul>");

      // Show first 20 lines as preview
      var previewLines = lines.slice(0, 20);
      previewLines.forEach(function (line, index) {
        getContentText += "<li><strong>Line ".concat(index + 1, ":</strong> \"").concat(line, "\"</li>");
      });
      if (lines.length > 20) {
        getContentText += "<li><strong>... and ".concat(lines.length - 20, " more lines</strong></li>");
      }
      getContentText += '</ul>';
      this.addSystemMessage(getContentText);
    }

    /**
     * Execute get selection command
     * @param {string} _params - Not used for this command
     */
  }, {
    key: "executeGetSelectionCommand",
    value: function executeGetSelectionCommand(_params) {
      var selectedText = this.getSelectedText();
      console.log('📄 AI Get Selection Command Executed - Selection length:', selectedText.length);
      var getSelectionText = "<strong>\uD83D\uDCC4 Selected Text:</strong>";
      if (selectedText) {
        getSelectionText += "<ul>\n<li><strong>Selected Text:</strong> \"".concat(selectedText, "\"</li>\n<li><strong>Selection Length:</strong> ").concat(selectedText.length, " characters</li>\n</ul>");
      } else {
        getSelectionText += "<ul><li><strong>No text currently selected</strong></li></ul>";
      }
      this.addSystemMessage(getSelectionText);
    }

    /**
     * Execute get cursor command
     * @param {string} _params - Not used for this command
     */
  }, {
    key: "executeGetCursorCommand",
    value: function executeGetCursorCommand(_params) {
      var cursorPos = this.getCursorPosition();
      console.log('📄 AI Get Cursor Command Executed - Position:', cursorPos);
      var getCursorText = "<strong>\uD83D\uDCC4 Cursor Position:</strong>";
      if (cursorPos) {
        getCursorText += "<ul>\n<li><strong>Current Line:</strong> ".concat(cursorPos.lineNumber, "</li>\n<li><strong>Current Column:</strong> ").concat(cursorPos.column, "</li>\n</ul>");
      } else {
        getCursorText += "<ul><li><strong>Cursor position not available</strong></li></ul>";
      }
      this.addSystemMessage(getCursorText);
    }

    /**
     * Check if commands should be confirmed
     * @returns {boolean} Whether to ask for confirmation
     */
  }, {
    key: "shouldConfirmCommand",
    value: function shouldConfirmCommand() {
      // Check auto-approve setting
      var autoApproveToggle = document.getElementById('autoApproveToggle');
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
  }, {
    key: "insertAtPosition",
    value: function insertAtPosition(lineNumber, column, text) {
      console.log('insertAtPosition called with:', {
        lineNumber: lineNumber,
        column: column,
        text: text
      });
      if (window.editor) {
        console.log('Current editor content (first 100 chars):', window.editor.getValue().substring(0, 100));
        console.log('Editor model exists:', !!window.editor.getModel());
        try {
          var result = window.editor.executeEdits('ai-agent', [{
            range: {
              startLineNumber: lineNumber,
              startColumn: column,
              endLineNumber: lineNumber,
              endColumn: column
            },
            text: text
          }]);
          console.log('executeEdits result:', result);
          console.log('New editor content (first 100 chars):', window.editor.getValue().substring(0, 100));

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
  }, {
    key: "insertAtCursor",
    value: function insertAtCursor(text) {
      console.log('insertAtCursor called with:', text);
      if (window.editor) {
        var position = window.editor.getPosition();
        console.log('Current cursor position:', position);
        try {
          var result = window.editor.executeEdits('ai-agent', [{
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            },
            text: text
          }]);
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
  }, {
    key: "replaceSelection",
    value: function replaceSelection(newText) {
      if (window.editor) {
        var selection = window.editor.getSelection();
        console.log('Current selection:', selection);
        if (selection && !selection.isEmpty()) {
          try {
            var selectedText = window.editor.getModel().getValueInRange(selection);
            console.log('Selected text to replace:', selectedText);
            var result = window.editor.executeEdits('ai-agent', [{
              range: selection,
              text: newText
            }]);
            console.log('replaceSelection executeEdits result:', result);
            console.log('New editor content after replacement:', window.editor.getValue().substring(0, 200));

            // Trigger save
            if (window.editorManager) {
              window.editorManager.saveContent();
            }
          } catch (error) {
            console.error('Error in replaceSelection:', error);
            throw error;
          }
        } else {
          console.warn('No text selected for replacement - selection is empty or null');
          console.log('Selection details:', {
            selection: selection,
            isEmpty: selection ? selection.isEmpty() : 'selection is null'
          });

          // Alternative: Replace current line if no selection
          var position = window.editor.getPosition();
          if (position) {
            var model = window.editor.getModel();
            var lineContent = model.getLineContent(position.lineNumber);
            console.log('Current line content:', lineContent);

            // Replace the entire current line
            var lineRange = {
              startLineNumber: position.lineNumber,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: lineContent.length + 1
            };
            try {
              var _result = window.editor.executeEdits('ai-agent', [{
                range: lineRange,
                text: newText
              }]);
              console.log('Replaced current line with:', newText);
              console.log('replaceLine executeEdits result:', _result);

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
  }, {
    key: "analyzeCode",
    value: function analyzeCode() {
      var content = this.getCurrentContent();
      var lines = content.split('\n');
      var gcodeCommands = [];
      var variables = [];
      var functions = [];
      var comments = [];
      var axisMoves = [];
      lines.forEach(function (line, index) {
        // Find G-code commands
        var gcodeMatches = line.match(/\b(G\d+)/g);
        if (gcodeMatches) {
          gcodeCommands.push.apply(gcodeCommands, _toConsumableArray(gcodeMatches.map(function (cmd) {
            return {
              command: cmd,
              line: index + 1,
              content: line.trim()
            };
          })));
        }

        // Find variable declarations
        var varMatches = line.match(/\b(let\s+[a-zA-Z_]\w*)/g);
        if (varMatches) {
          variables.push.apply(variables, _toConsumableArray(varMatches.map(function (v) {
            return {
              declaration: v,
              line: index + 1,
              content: line.trim()
            };
          })));
        }

        // Find function declarations
        var funcMatches = line.match(/\bfunction\s+([a-zA-Z_]\w*)/g);
        if (funcMatches) {
          functions.push.apply(functions, _toConsumableArray(funcMatches.map(function (f) {
            return {
              declaration: f,
              line: index + 1,
              content: line.trim()
            };
          })));
        }

        // Find comments
        var commentMatches = line.match(/(\/\/.*$|\/\*.*?\*\/)/g);
        if (commentMatches) {
          comments.push.apply(comments, _toConsumableArray(commentMatches.map(function (c) {
            return {
              content: c,
              line: index + 1
            };
          })));
        }

        // Find axis moves (X, Y, Z, etc.)
        var axisMatches = line.match(/\b([XYZABC][+-]?\d*\.?\d+)/g);
        if (axisMatches) {
          axisMoves.push.apply(axisMoves, _toConsumableArray(axisMatches.map(function (a) {
            return {
              axis: a.charAt(0),
              value: a.substring(1),
              line: index + 1,
              content: line.trim()
            };
          })));
        }
      });

      // Calculate complexity metrics
      var totalLines = lines.length;
      var codeLines = lines.filter(function (line) {
        return line.trim() !== '' && !line.trim().startsWith('//');
      }).length;
      var commentLines = comments.length;
      var emptyLines = totalLines - codeLines - commentLines;
      return {
        totalLines: totalLines,
        codeLines: codeLines,
        commentLines: commentLines,
        emptyLines: emptyLines,
        gcodeCommands: gcodeCommands,
        variables: variables,
        functions: functions,
        comments: comments,
        axisMoves: axisMoves,
        complexity: Math.round((gcodeCommands.length + variables.length + functions.length) / Math.max(codeLines, 1) * 100) || 0,
        density: Math.round(codeLines / Math.max(totalLines, 1) * 100) || 0
      };
    }

    /**
     * Get current editor content
     * @returns {string} Current editor content
     */
  }, {
    key: "getCurrentContent",
    value: function getCurrentContent() {
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
  }, {
    key: "getSelectedText",
    value: function getSelectedText() {
      if (window.editor) {
        var selection = window.editor.getSelection();
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
  }, {
    key: "getCursorPosition",
    value: function getCursorPosition() {
      if (window.editor) {
        return window.editor.getPosition();
      }
      return null;
    }

    /**
     * Set GGcode content in editor
     * @param {string} content - Content to set
     */
  }, {
    key: "setGGcodeContent",
    value: function setGGcodeContent(content) {
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
  }, {
    key: "getGGcodeContent",
    value: function getGGcodeContent() {
      return this.getCurrentContent();
    }

    /**
     * Insert GGcode text at cursor (alias for insertAtCursor)
     * @param {string} text - Text to insert
     */
  }, {
    key: "insertGGcodeText",
    value: function insertGGcodeText(text) {
      this.insertAtCursor(text);
    }

    /**
     * Replace selected GGcode text (alias for replaceSelection)
     * @param {string} newText - New text to replace selection with
     */
  }, {
    key: "replaceSelectedText",
    value: function replaceSelectedText(newText) {
      this.replaceSelection(newText);
    }

    /**
     * Get line content at specific line number
     * @param {number} lineNumber - Line number (1-based)
     * @returns {string} Line content
     */
  }, {
    key: "getLineContent",
    value: function getLineContent(lineNumber) {
      if (window.editor && lineNumber > 0) {
        var model = window.editor.getModel();
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
  }, {
    key: "getLinesContent",
    value: function getLinesContent(startLine, endLine) {
      if (window.editor && startLine > 0 && endLine >= startLine) {
        var model = window.editor.getModel();
        if (startLine <= model.getLineCount() && endLine <= model.getLineCount()) {
          var content = '';
          for (var i = startLine; i <= endLine; i++) {
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
  }, {
    key: "replaceRange",
    value: function replaceRange(startLine, startColumn, endLine, endColumn, newText) {
      if (window.editor) {
        try {
          var result = window.editor.executeEdits('ai-agent', [{
            range: {
              startLineNumber: startLine,
              startColumn: startColumn,
              endLineNumber: endLine,
              endColumn: endColumn
            },
            text: newText
          }]);
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
  }, {
    key: "analyzeGGcode",
    value: function analyzeGGcode() {
      return this.analyzeCode();
    }

    /**
     * Add system message to chat
     * @param {string} message - System message to add
     */
  }, {
    key: "addSystemMessage",
    value: function addSystemMessage(message) {
      var messagesContainer = document.getElementById('aiChatMessages');
      if (!messagesContainer) return;
      var messageDiv = document.createElement('div');
      messageDiv.className = 'ai-message ai-system';
      messageDiv.innerHTML = "<div class=\"ai-message-content\">".concat(message, "</div>");
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Set pending command data
     * @param {Object} data - Command data
     */
  }, {
    key: "setPendingCommandData",
    value: function setPendingCommandData(data) {
      this.pendingCommandData = data;
    }

    /**
     * Get pending command data
     * @returns {Object|null} Pending command data
     */
  }, {
    key: "getPendingCommandData",
    value: function getPendingCommandData() {
      return this.pendingCommandData;
    }

    /**
     * Clear pending command data
     */
  }, {
    key: "clearPendingCommandData",
    value: function clearPendingCommandData() {
      this.pendingCommandData = null;
    }
  }]);
}(); // Create and export singleton instance
var aiCommands = new AICommands();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (aiCommands);

// Global functions for search button clicks
window.executeQuickSearch = function (searchType) {
  console.log('🔍 Executing quick search:', searchType);
  if (aiCommands && typeof aiCommands.executePendingCommand === 'function') {
    aiCommands.executePendingCommand('find', "\"".concat(searchType, "\""));
    console.log('✅ Quick search executed successfully');
  } else {
    console.warn('AI Commands not available for quick search');
  }
};
window.executeQuickContext = function (startLine, endLine) {
  console.log('👁️ Executing quick context view:', startLine, 'to', endLine);
  if (aiCommands && typeof aiCommands.executePendingCommand === 'function') {
    aiCommands.executePendingCommand('getlines', "".concat(startLine, ",").concat(endLine));
    console.log('✅ Quick context view executed successfully');
  } else {
    console.warn('AI Commands not available for quick context');
  }
};

// Initialize testing framework
function initializeMockEditor() {
  // Mock Editor System
  window.mockEditor = {
    content: [],
    cursor: {
      line: 1,
      column: 1
    },
    selection: null,
    clipboard: '',
    undoStack: [],
    redoStack: [],
    getValue: function getValue() {
      return this.content.join('\n');
    },
    setValue: function setValue(text) {
      this.content = text.split('\n');
    },
    getPosition: function getPosition() {
      return this.cursor;
    },
    setPosition: function setPosition(position) {
      this.cursor = position;
    },
    getSelection: function getSelection() {
      return this.selection;
    },
    setSelection: function setSelection(range) {
      this.selection = range;
    },
    executeEdits: function executeEdits(source, edits) {
      var _this = this;
      console.log('📝 MOCK EDIT:', edits);
      // Simulate edit execution with detailed logging
      edits.forEach(function (edit) {
        var startLine = edit.range.startLineNumber - 1;
        var newText = edit.text;
        console.log("  Line ".concat(startLine + 1, ": \"").concat(_this.content[startLine] || '', "\" \u2192 \"").concat(newText, "\""));
      });
      return edits.length;
    }
  };

  // AI Testing API
  window.aiTest = {
    testCommand: function testCommand(command, params) {
      console.log("\n\uD83E\uDDEA Testing: /ai:".concat(command, "[").concat(params, "]"));
      var startState = this.captureState();
      try {
        var result = aiCommands.executePendingCommand(command, params);
        var endState = this.captureState();
        console.log('✅ Command executed successfully');
        console.log('📊 State changes:', this.diffStates(startState, endState));
        console.log('📝 Current content:', window.mockEditor.getValue());
        return result;
      } catch (error) {
        console.error('❌ Command failed:', error.message);
        return null;
      }
    },
    testAIInput: function testAIInput(userInput) {
      console.log("\n\uD83E\uDD16 Testing AI Input: \"".concat(userInput, "\""));
      console.log('Expected: AI should use appropriate command(s)');
      // Placeholder for AI simulation
      return 'AI would analyze and respond with commands';
    },
    captureState: function captureState() {
      return {
        content: _toConsumableArray(window.mockEditor.content),
        cursor: _objectSpread({}, window.mockEditor.cursor),
        selection: window.mockEditor.selection ? _objectSpread({}, window.mockEditor.selection) : null,
        timestamp: Date.now()
      };
    },
    diffStates: function diffStates(before, after) {
      var changes = [];
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
    }
  };

  // Quick access functions for console testing
  window.testCmd = function (cmd, params) {
    var _window$aiTest;
    return (_window$aiTest = window.aiTest) === null || _window$aiTest === void 0 ? void 0 : _window$aiTest.testCommand(cmd, params);
  };
  window.testAI = function (input) {
    var _window$aiTest2;
    return (_window$aiTest2 = window.aiTest) === null || _window$aiTest2 === void 0 ? void 0 : _window$aiTest2.testAIInput(input);
  };
  window.showState = function () {
    console.log('📋 Current Editor State:');
    console.log('Content:', window.mockEditor.getValue());
    console.log('Cursor:', window.mockEditor.getPosition());
    console.log('Selection:', window.mockEditor.getSelection());
  };
  window.setTestContent = function (text) {
    window.mockEditor.setValue(text);
    console.log('📝 Test content set:');
    console.log(window.mockEditor.getValue());
  };
  window.resetEditor = function () {
    window.mockEditor.content = [];
    window.mockEditor.cursor = {
      line: 1,
      column: 1
    };
    window.mockEditor.selection = null;
    console.log('🔄 Editor reset to empty state');
  };

  // Initialize other gcode-related global variables
  if (!window.gcodeLines) window.gcodeLines = [];
  if (!window.gcodeCurrentLineIdx) window.gcodeCurrentLineIdx = 1;
  if (!window.gcodeSegmentCounts) window.gcodeSegmentCounts = {
    G0: 0,
    G1: 0,
    G2: 0,
    G3: 0
  };
  if (!window.performanceStats) window.performanceStats = {};
  if (!window.performanceData) window.performanceData = {};
}

/***/ })

}]);
//# sourceMappingURL=src_client_js_ui_aiCommands_js.js.map