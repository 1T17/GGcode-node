"use strict";
(self["webpackChunkggcode_compiler"] = self["webpackChunkggcode_compiler"] || []).push([["src_client_js_editor_settings_js"],{

/***/ "./src/client/js/editor/settings.js":
/*!******************************************!*\
  !*** ./src/client/js/editor/settings.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditorSettingsManager: () => (/* binding */ EditorSettingsManager),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   settingsManager: () => (/* binding */ settingsManager)
/* harmony export */ });
/* harmony import */ var _themes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./themes.js */ "./src/client/js/editor/themes.js");
/* harmony import */ var _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/storageManager.js */ "./src/client/js/utils/storageManager.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Editor Settings Manager
 * Manages Monaco editor settings and preferences
 */



var EditorSettingsManager = /*#__PURE__*/function () {
  function EditorSettingsManager() {
    _classCallCheck(this, EditorSettingsManager);
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
      lightbulb: {
        enabled: true
      },
      codeLens: false,
      inlayHints: {
        enabled: 'offUnlessPressed'
      },
      hideBrowserValidation: true
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
  return _createClass(EditorSettingsManager, [{
    key: "initialize",
    value: function initialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // Prevent multiple initializations
      if (this._initialized) {
        return true;
      }
      var _options$modalId = options.modalId,
        modalId = _options$modalId === void 0 ? 'settingsModal' : _options$modalId,
        _options$contentId = options.contentId,
        contentId = _options$contentId === void 0 ? 'settingsContent' : _options$contentId,
        _options$onSettingsCh = options.onSettingsChange,
        onSettingsChange = _options$onSettingsCh === void 0 ? null : _options$onSettingsCh;
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
  }, {
    key: "loadSettings",
    value: function loadSettings() {
      var _this = this;
      try {
        var savedSettings = localStorage.getItem('ggcode-editor-settings');
        if (savedSettings) {
          var parsed = JSON.parse(savedSettings);
          this.settings = _objectSpread(_objectSpread({}, this.defaultSettings), parsed);
        } else {
          this.settings = _objectSpread({}, this.defaultSettings);
        }

        // Apply browser validation setting after DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function () {
            _this.applyBrowserValidationSetting(_this.settings.hideBrowserValidation);
          });
        } else {
          // DOM is already ready
          this.applyBrowserValidationSetting(this.settings.hideBrowserValidation);
        }
      } catch (error) {
        console.error('Settings: Failed to load settings:', error);
        this.settings = _objectSpread({}, this.defaultSettings);
        // Apply default browser validation setting
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function () {
            _this.applyBrowserValidationSetting(_this.defaultSettings.hideBrowserValidation);
          });
        } else {
          this.applyBrowserValidationSetting(this.defaultSettings.hideBrowserValidation);
        }
      }
    }

    /**
     * Save settings to localStorage
     */
  }, {
    key: "saveSettings",
    value: function saveSettings() {
      try {
        localStorage.setItem('ggcode-editor-settings', JSON.stringify(this.settings));
      } catch (error) {
        console.error('Settings: Failed to save settings:', error);
      }
    }

    /**
     * Get current settings
     * @returns {Object} Current settings
     */
  }, {
    key: "getSettings",
    value: function getSettings() {
      return _objectSpread({}, this.settings);
    }

    /**
     * Update a specific setting
     * @param {string} key - Setting key
     * @param {any} value - Setting value
     */
  }, {
    key: "updateSetting",
    value: function updateSetting(key, value) {
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
  }, {
    key: "applySettingToEditor",
    value: function applySettingToEditor(key, value) {
      var _this2 = this;
      // Get all Monaco editors
      var editors = typeof monaco !== 'undefined' ? monaco.editor.getEditors() : [];

      // If no editors available, store the setting for later application
      if (editors.length === 0) {
        //console.log(`Settings: No editors available, storing setting '${key}' for later application`);
        return;
      }
      try {
        editors.forEach(function (editor) {
          _this2.applySettingToSingleEditor(editor, key, value);
        });
      } catch (error) {
        console.error("Settings: Failed to apply setting '".concat(key, "' to editors:"), error);
      }
    }

    /**
     * Apply a setting to a single editor instance
     * @param {Object} editor - Monaco editor instance
     * @param {string} key - Setting key
     * @param {any} value - Setting value
     */
  }, {
    key: "applySettingToSingleEditor",
    value: function applySettingToSingleEditor(editor, key, value) {
      try {
        switch (key) {
          case 'theme':
            // Wait for themes to be available and then switch
            if (_themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAvailableThemes().includes(value)) {
              _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].switchTheme(value);
            } else {
              // Store the preference for when themes become available
              _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].setSelectedTheme(value);
            }
            break;
          case 'fontSize':
            editor.updateOptions({
              fontSize: parseInt(value)
            });
            break;
          case 'fontFamily':
            editor.updateOptions({
              fontFamily: value
            });
            break;
          case 'wordWrap':
            editor.updateOptions({
              wordWrap: value
            });
            break;
          case 'minimap':
            {
              var minimapValue = value === 'enabled' ? {
                enabled: true
              } : {
                enabled: false
              };
              editor.updateOptions({
                minimap: minimapValue
              });
              break;
            }
          case 'lineNumbers':
            editor.updateOptions({
              lineNumbers: value
            });
            break;
          case 'renderWhitespace':
            editor.updateOptions({
              renderWhitespace: value
            });
            break;
          case 'renderIndentGuides':
            editor.updateOptions({
              renderIndentGuides: value
            });
            break;
          case 'bracketMatching':
            editor.updateOptions({
              bracketMatching: value
            });
            break;
          case 'autoClosingBrackets':
            editor.updateOptions({
              autoClosingBrackets: value
            });
            break;
          case 'autoClosingQuotes':
            editor.updateOptions({
              autoClosingQuotes: value
            });
            break;
          case 'autoClosingDelete':
            editor.updateOptions({
              autoClosingDelete: value
            });
            break;
          case 'autoClosingOvertype':
            editor.updateOptions({
              autoClosingOvertype: value
            });
            break;
          case 'surroudWithBrackets':
            editor.updateOptions({
              surroudWithBrackets: value
            });
            break;
          case 'tabSize':
            editor.updateOptions({
              tabSize: parseInt(value)
            });
            break;
          case 'insertSpaces':
            editor.updateOptions({
              insertSpaces: value
            });
            break;
          case 'cursorBlinking':
            editor.updateOptions({
              cursorBlinking: value
            });
            break;
          case 'cursorStyle':
            editor.updateOptions({
              cursorStyle: value
            });
            break;
          case 'scrollBeyondLastLine':
            editor.updateOptions({
              scrollBeyondLastLine: value
            });
            break;
          case 'smoothScrolling':
            editor.updateOptions({
              smoothScrolling: value
            });
            break;
          case 'mouseWheelZoom':
            editor.updateOptions({
              mouseWheelZoom: value
            });
            break;
          case 'contextmenu':
            editor.updateOptions({
              contextmenu: value
            });
            break;
          case 'quickSuggestions':
            editor.updateOptions({
              quickSuggestions: value
            });
            break;
          case 'suggestOnTriggerCharacters':
            editor.updateOptions({
              suggestOnTriggerCharacters: value
            });
            break;
          case 'acceptSuggestionOnEnter':
            editor.updateOptions({
              acceptSuggestionOnEnter: value
            });
            break;
          case 'tabCompletion':
            editor.updateOptions({
              tabCompletion: value
            });
            break;
          case 'wordBasedSuggestions':
            editor.updateOptions({
              wordBasedSuggestions: value
            });
            break;
          case 'parameterHints':
            editor.updateOptions({
              parameterHints: value
            });
            break;
          case 'formatOnType':
            editor.updateOptions({
              formatOnType: value
            });
            break;
          case 'formatOnPaste':
            editor.updateOptions({
              formatOnPaste: value
            });
            break;
          case 'renderLineHighlight':
            editor.updateOptions({
              renderLineHighlight: value
            });
            break;
          case 'glyphMargin':
            editor.updateOptions({
              glyphMargin: value
            });
            break;
          case 'folding':
            editor.updateOptions({
              folding: value
            });
            break;
          case 'showFoldingControls':
            editor.updateOptions({
              showFoldingControls: value
            });
            break;
          case 'dragAndDrop':
            editor.updateOptions({
              dragAndDrop: value
            });
            break;
          case 'links':
            editor.updateOptions({
              links: value
            });
            break;
          case 'colorDecorators':
            editor.updateOptions({
              colorDecorators: value
            });
            break;
          case 'lightbulb':
            editor.updateOptions({
              lightbulb: value
            });
            break;
          case 'codeLens':
            editor.updateOptions({
              codeLens: value
            });
            break;
          case 'inlayHints':
            editor.updateOptions({
              inlayHints: value
            });
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
            console.warn("Settings: Unknown setting '".concat(key, "'"));
        }
      } catch (error) {
        console.error("Settings: Failed to apply setting '".concat(key, "' to editor:"), error);
      }
    }

    /**
     * Apply browser validation setting
     * @param {boolean} hide - Whether to hide browser validation styling
     */
  }, {
    key: "applyBrowserValidationSetting",
    value: function applyBrowserValidationSetting(hide) {
      var styleId = 'browser-validation-override';
      var existingStyle = document.getElementById(styleId);

      // Check if we need to make any changes
      var shouldHaveStyle = hide;
      var hasStyle = !!existingStyle;
      if (shouldHaveStyle === hasStyle) {
        // No change needed
        return;
      }
      if (hide) {
        // Add CSS to hide browser validation styling
        var style = document.createElement('style');
        style.id = styleId;
        style.textContent = "\n        /* DISABLE BROWSER VALIDATION STYLING ON EDITOR CONTAINERS */\n        #editor,\n        #output,\n        #editor *,\n        #output *,\n        .monaco-editor,\n        .monaco-editor * {\n          /* Remove browser validation styling */\n          box-shadow: none !important;\n          outline: none !important;\n          border: none !important;\n          /* Disable browser form validation styling */\n          -webkit-appearance: none !important;\n          -moz-appearance: none !important;\n          appearance: none !important;\n        }\n\n        /* FORM VALIDATION OVERRIDE - Prevent red validation styling */\n        form #editor,\n        form #output,\n        form .monaco-editor,\n        form .monaco-editor * {\n          /* Override any form validation styling */\n          box-shadow: none !important;\n          outline: none !important;\n          border: none !important;\n          /* Remove any red validation styling */\n          border-color: transparent !important;\n          outline-color: transparent !important;\n        }\n\n        /* FOCUS STATE OVERRIDE - Ensure no red focus styling */\n        #editor:focus,\n        #output:focus,\n        #editor:focus-within,\n        #output:focus-within,\n        .monaco-editor:focus,\n        .monaco-editor:focus-within {\n          box-shadow: none !important;\n          outline: none !important;\n          border: none !important;\n          border-color: transparent !important;\n          outline-color: transparent !important;\n        }\n\n        /* BROWSER-SPECIFIC VALIDATION OVERRIDES */\n        /* Chrome/Safari validation styling */\n        #editor:invalid,\n        #output:invalid,\n        .monaco-editor:invalid {\n          box-shadow: none !important;\n          outline: none !important;\n          border: none !important;\n        }\n\n        /* Firefox validation styling */\n        #editor:-moz-ui-invalid,\n        #output:-moz-ui-invalid,\n        .monaco-editor:-moz-ui-invalid {\n          box-shadow: none !important;\n          outline: none !important;\n          border: none !important;\n        }\n\n        /* Edge/IE validation styling */\n        #editor:-ms-input-placeholder,\n        #output:-ms-input-placeholder {\n          box-shadow: none !important;\n          outline: none !important;\n          border: none !important;\n        }\n\n        /* Remove any red glow or shadow effects */\n        #editor,\n        #output,\n        .monaco-editor {\n          /* Webkit browsers */\n          -webkit-box-shadow: none !important;\n          /* Mozilla browsers */\n          -moz-box-shadow: none !important;\n          /* Standard */\n          box-shadow: none !important;\n          /* Remove any outline */\n          outline: 0 !important;\n          outline: none !important;\n          /* Remove any border */\n          border: 0 !important;\n          border: none !important;\n        }\n      ";
        document.head.appendChild(style);
      } else {
        // Remove the override style to allow browser validation styling
        existingStyle.remove();
      }
    }

    /**
     * Test the browser validation toggle
     */
  }, {
    key: "testBrowserValidationToggle",
    value: function testBrowserValidationToggle() {
      // Toggle the setting
      var newValue = !this.settings.hideBrowserValidation;
      this.updateSetting('hideBrowserValidation', newValue);
      return newValue;
    }

    /**
     * Apply all current settings to all Monaco editors
     * @param {Object} editorInstance - Monaco editor instance (for backward compatibility)
     */
  }, {
    key: "applyAllSettingsToEditor",
    value: function applyAllSettingsToEditor() {
      var _this3 = this;
      var editorInstance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
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
        Object.entries(this.settings).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];
          _this3.applySettingToEditor(key, value);
        });
      } finally {
        // Reset flag after a short delay
        setTimeout(function () {
          _this3._applyingAllSettings = false;
        }, 100);
      }
    }

    /**
     * Reset settings to defaults
     */
  }, {
    key: "resetToDefaults",
    value: function resetToDefaults() {
      var _this4 = this;
      this.settings = _objectSpread({}, this.defaultSettings);
      this.saveSettings();

      // Apply defaults to all available editors
      Object.entries(this.settings).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];
        _this4.applySettingToEditor(key, value);
      });
    }

    /**
     * Get all current Monaco editors
     * @returns {Array} Array of Monaco editor instances
     */
  }, {
    key: "getAllEditors",
    value: function getAllEditors() {
      if (typeof monaco !== 'undefined') {
        return monaco.editor.getEditors();
      }
      return [];
    }

    /**
     * Check if settings are properly connected to editors
     * @returns {Object} Connection status
     */
  }, {
    key: "getConnectionStatus",
    value: function getConnectionStatus() {
      var editors = this.getAllEditors();
      return {
        settingsManagerInitialized: !!this.modalElement && !!this.contentElement,
        themeManagerAvailable: !!_themes_js__WEBPACK_IMPORTED_MODULE_0__["default"],
        monacoAvailable: typeof monaco !== 'undefined',
        editorCount: editors.length,
        editorsConnected: editors.length > 0,
        currentTheme: _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrentTheme() : null,
        availableThemes: _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAvailableThemes() : []
      };
    }

    /**
     * Show settings modal
     */
  }, {
    key: "showSettings",
    value: function showSettings() {
      if (!this.modalElement || !this.contentElement) {
        console.error('Settings not initialized');
        return;
      }

      // Render the settings form
      var formHtml = this.renderSettingsForm();
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
  }, {
    key: "closeSettings",
    value: function closeSettings() {
      if (this.modalElement) {
        this.modalElement.style.display = 'none';
        this.modalElement.classList.remove('settings-fade-in');
      }
    }

    /**
     * Render the settings form HTML
     * @returns {string} HTML string
     */
  }, {
    key: "renderSettingsForm",
    value: function renderSettingsForm() {
      var settings = this.settings;
      var themes = _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAvailableThemes();
      return "\n      <div class=\"settings-container\">\n        <div class=\"settings-header\">\n          <div class=\"settings-header-content\">\n            <div class=\"settings-title-section\">\n              <h3>Editor Settings</h3>\n              <p class=\"settings-description\">Customize your Monaco editor experience</p>\n            </div>\n          </div>\n        </div>\n\n        <form id=\"settingsForm\" class=\"settings-form\">\n          <!-- Theme Selection -->\n          <div class=\"settings-group\">\n            <h4>Appearance</h4>\n\n            <div class=\"setting-item\">\n              <label for=\"theme\">Theme</label>\n              <select id=\"theme\" name=\"theme\">\n                ".concat(themes.map(function (theme) {
        return "<option value=\"".concat(theme, "\" ").concat(settings.theme === theme ? 'selected' : '', ">").concat(theme, "</option>");
      }).join(''), "\n              </select>\n              <div class=\"setting-description\">Choose your editor theme</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label for=\"fontSize\">Font Size</label>\n              <input type=\"number\" id=\"fontSize\" name=\"fontSize\" min=\"8\" max=\"24\" value=\"").concat(settings.fontSize, "\">\n              <div class=\"setting-description\">Editor font size in pixels</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label for=\"fontFamily\">Font Family</label>\n              <select id=\"fontFamily\" name=\"fontFamily\">\n                <option value=\"Consolas, 'Courier New', monospace\" ").concat(settings.fontFamily === "Consolas, 'Courier New', monospace" ? 'selected' : '', ">Consolas (Windows)</option>\n                <option value=\"'Courier New', monospace\" ").concat(settings.fontFamily === "'Courier New', monospace" ? 'selected' : '', ">Courier New (Classic)</option>\n                <option value=\"'Monaco', Consolas, 'Courier New', monospace\" ").concat(settings.fontFamily === "'Monaco', Consolas, 'Courier New', monospace" ? 'selected' : '', ">Monaco (macOS)</option>\n                <option value=\"'Menlo', 'Monaco', Consolas, 'Courier New', monospace\" ").concat(settings.fontFamily === "'Menlo', 'Monaco', Consolas, 'Courier New', monospace" ? 'selected' : '', ">Menlo (macOS)</option>\n                <option value=\"'Lucida Console', 'Courier New', monospace\" ").concat(settings.fontFamily === "'Lucida Console', 'Courier New', monospace" ? 'selected' : '', ">Lucida Console</option>\n                <option value=\"'DejaVu Sans Mono', 'Lucida Console', 'Courier New', monospace\" ").concat(settings.fontFamily === "'DejaVu Sans Mono', 'Lucida Console', 'Courier New', monospace" ? 'selected' : '', ">DejaVu Sans Mono</option>\n                <option value=\"'Liberation Mono', 'DejaVu Sans Mono', 'Courier New', monospace\" ").concat(settings.fontFamily === "'Liberation Mono', 'DejaVu Sans Mono', 'Courier New', monospace" ? 'selected' : '', ">Liberation Mono</option>\n                <option value=\"'Ubuntu Mono', 'DejaVu Sans Mono', 'Courier New', monospace\" ").concat(settings.fontFamily === "'Ubuntu Mono', 'DejaVu Sans Mono', 'Courier New', monospace" ? 'selected' : '', ">Ubuntu Mono (Linux)</option>\n                <option value=\"'Inconsolata', 'DejaVu Sans Mono', 'Courier New', monospace\" ").concat(settings.fontFamily === "'Inconsolata', 'DejaVu Sans Mono', 'Courier New', monospace" ? 'selected' : '', ">Inconsolata</option>\n                <option value=\"'Source Code Pro', 'DejaVu Sans Mono', 'Courier New', monospace\" ").concat(settings.fontFamily === "'Source Code Pro', 'DejaVu Sans Mono', 'Courier New', monospace" ? 'selected' : '', ">Source Code Pro</option>\n                <option value=\"'Fira Code', 'Fira Mono', 'DejaVu Sans Mono', 'Courier New', monospace\" ").concat(settings.fontFamily === "'Fira Code', 'Fira Mono', 'DejaVu Sans Mono', 'Courier New', monospace" ? 'selected' : '', ">Fira Code (Ligatures)</option>\n                <option value=\"SFMono-Regular, 'SF Mono', Consolas, 'Courier New', monospace\" ").concat(settings.fontFamily === "SFMono-Regular, 'SF Mono', Consolas, 'Courier New', monospace" ? 'selected' : '', ">SF Mono (macOS)</option>\n                <option value=\"monospace\" ").concat(settings.fontFamily === 'monospace' ? 'selected' : '', ">System Default</option>\n              </select>\n              <div class=\"setting-description\">Choose a monospace font - all include reliable fallbacks for maximum compatibility</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label for=\"lineNumbers\">Line Numbers</label>\n              <select id=\"lineNumbers\" name=\"lineNumbers\">\n                <option value=\"on\" ").concat(settings.lineNumbers === 'on' ? 'selected' : '', ">Show</option>\n                <option value=\"off\" ").concat(settings.lineNumbers === 'off' ? 'selected' : '', ">Hide</option>\n                <option value=\"relative\" ").concat(settings.lineNumbers === 'relative' ? 'selected' : '', ">Relative</option>\n                <option value=\"interval\" ").concat(settings.lineNumbers === 'interval' ? 'selected' : '', ">Interval</option>\n              </select>\n              <div class=\"setting-description\">Display line numbers in the editor</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label for=\"wordWrap\">Word Wrap</label>\n              <select id=\"wordWrap\" name=\"wordWrap\">\n                <option value=\"off\" ").concat(settings.wordWrap === 'off' ? 'selected' : '', ">No Wrap</option>\n                <option value=\"on\" ").concat(settings.wordWrap === 'on' ? 'selected' : '', ">Wrap Lines</option>\n                <option value=\"wordWrapColumn\" ").concat(settings.wordWrap === 'wordWrapColumn' ? 'selected' : '', ">Wrap at Column</option>\n                <option value=\"bounded\" ").concat(settings.wordWrap === 'bounded' ? 'selected' : '', ">Bounded Wrap</option>\n              </select>\n              <div class=\"setting-description\">How to handle long lines</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label for=\"renderWhitespace\">Render Whitespace</label>\n              <select id=\"renderWhitespace\" name=\"renderWhitespace\">\n                <option value=\"none\" ").concat(settings.renderWhitespace === 'none' ? 'selected' : '', ">None</option>\n                <option value=\"boundary\" ").concat(settings.renderWhitespace === 'boundary' ? 'selected' : '', ">Boundary</option>\n                <option value=\"selection\" ").concat(settings.renderWhitespace === 'selection' ? 'selected' : '', ">Selection</option>\n                <option value=\"trailing\" ").concat(settings.renderWhitespace === 'trailing' ? 'selected' : '', ">Trailing</option>\n                <option value=\"all\" ").concat(settings.renderWhitespace === 'all' ? 'selected' : '', ">All</option>\n              </select>\n              <div class=\"setting-description\">Show whitespace characters</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"hideBrowserValidation\" name=\"hideBrowserValidation\" ").concat(settings.hideBrowserValidation ? 'checked' : '', ">\n                Hide Browser Validation Styling\n              </label>\n              <div class=\"setting-description\">Remove red shadow lines and browser validation styling from editor (recommended)</div>\n            </div>\n          </div>\n\n          <!-- Editor Behavior -->\n          <div class=\"settings-group\">\n            <h4>Editor Behavior</h4>\n\n            <div class=\"setting-item\">\n              <label for=\"tabSize\">Tab Size</label>\n              <input type=\"number\" id=\"tabSize\" name=\"tabSize\" min=\"1\" max=\"8\" value=\"").concat(settings.tabSize, "\">\n              <div class=\"setting-description\">Number of spaces for tab</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"insertSpaces\" name=\"insertSpaces\" ").concat(settings.insertSpaces ? 'checked' : '', ">\n                Insert Spaces\n              </label>\n              <div class=\"setting-description\">Use spaces instead of tabs</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label for=\"cursorBlinking\">Cursor Blinking</label>\n              <select id=\"cursorBlinking\" name=\"cursorBlinking\">\n                <option value=\"blink\" ").concat(settings.cursorBlinking === 'blink' ? 'selected' : '', ">Blink</option>\n                <option value=\"smooth\" ").concat(settings.cursorBlinking === 'smooth' ? 'selected' : '', ">Smooth</option>\n                <option value=\"phase\" ").concat(settings.cursorBlinking === 'phase' ? 'selected' : '', ">Phase</option>\n                <option value=\"expand\" ").concat(settings.cursorBlinking === 'expand' ? 'selected' : '', ">Expand</option>\n                <option value=\"solid\" ").concat(settings.cursorBlinking === 'solid' ? 'selected' : '', ">Solid</option>\n              </select>\n              <div class=\"setting-description\">Cursor blinking style</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label for=\"cursorStyle\">Cursor Style</label>\n              <select id=\"cursorStyle\" name=\"cursorStyle\">\n                <option value=\"line\" ").concat(settings.cursorStyle === 'line' ? 'selected' : '', ">Line</option>\n                <option value=\"block\" ").concat(settings.cursorStyle === 'block' ? 'selected' : '', ">Block</option>\n                <option value=\"underline\" ").concat(settings.cursorStyle === 'underline' ? 'selected' : '', ">Underline</option>\n                <option value=\"line-thin\" ").concat(settings.cursorStyle === 'line-thin' ? 'selected' : '', ">Thin Line</option>\n                <option value=\"block-outline\" ").concat(settings.cursorStyle === 'block-outline' ? 'selected' : '', ">Block Outline</option>\n                <option value=\"underline-thin\" ").concat(settings.cursorStyle === 'underline-thin' ? 'selected' : '', ">Thin Underline</option>\n              </select>\n              <div class=\"setting-description\">Cursor appearance</div>\n            </div>\n          </div>\n\n          <!-- Features -->\n          <div class=\"settings-group\">\n            <h4>Features</h4>\n\n            <div class=\"setting-item\">\n              <label for=\"minimap\">Minimap</label>\n              <select id=\"minimap\" name=\"minimap\">\n                <option value=\"enabled\" ").concat(settings.minimap === 'enabled' || settings.minimap && _typeof(settings.minimap) === 'object' && settings.minimap.enabled === true ? 'selected' : '', ">Show Minimap</option>\n                <option value=\"disabled\" ").concat(settings.minimap === 'disabled' || settings.minimap && _typeof(settings.minimap) === 'object' && settings.minimap.enabled === false ? 'selected' : '', ">Hide Minimap</option>\n              </select>\n              <div class=\"setting-description\">Display code minimap on the right side of the editor</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"renderIndentGuides\" name=\"renderIndentGuides\" ").concat(settings.renderIndentGuides ? 'checked' : '', ">\n                Indent Guides\n              </label>\n              <div class=\"setting-description\">Show indentation guides</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"bracketMatching\" name=\"bracketMatching\" ").concat(settings.bracketMatching ? 'checked' : '', ">\n                Bracket Matching\n              </label>\n              <div class=\"setting-description\">Highlight matching brackets</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"folding\" name=\"folding\" ").concat(settings.folding ? 'checked' : '', ">\n                Code Folding\n              </label>\n              <div class=\"setting-description\">Allow code folding</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"dragAndDrop\" name=\"dragAndDrop\" ").concat(settings.dragAndDrop ? 'checked' : '', ">\n                Drag & Drop\n              </label>\n              <div class=\"setting-description\">Enable drag and drop editing</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"links\" name=\"links\" ").concat(settings.links ? 'checked' : '', ">\n                Clickable Links\n              </label>\n              <div class=\"setting-description\">Make URLs clickable</div>\n            </div>\n          </div>\n\n          <!-- Suggestions & Intellisense -->\n          <div class=\"settings-group\">\n            <h4>IntelliSense</h4>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"quickSuggestions\" name=\"quickSuggestions\" ").concat(settings.quickSuggestions ? 'checked' : '', ">\n                Quick Suggestions\n              </label>\n              <div class=\"setting-description\">Show suggestions as you type</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"suggestOnTriggerCharacters\" name=\"suggestOnTriggerCharacters\" ").concat(settings.suggestOnTriggerCharacters ? 'checked' : '', ">\n                Trigger Characters\n              </label>\n              <div class=\"setting-description\">Show suggestions on trigger characters</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"parameterHints\" name=\"parameterHints\" ").concat(settings.parameterHints ? 'checked' : '', ">\n                Parameter Hints\n              </label>\n              <div class=\"setting-description\">Show parameter hints</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"formatOnType\" name=\"formatOnType\" ").concat(settings.formatOnType ? 'checked' : '', ">\n                Format on Type\n              </label>\n              <div class=\"setting-description\">Auto-format as you type</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"formatOnPaste\" name=\"formatOnPaste\" ").concat(settings.formatOnPaste ? 'checked' : '', ">\n                Format on Paste\n              </label>\n              <div class=\"setting-description\">Auto-format when pasting</div>\n            </div>\n          </div>\n\n          <!-- Auto Save -->\n          <div class=\"settings-group\">\n            <h4>Auto Save</h4>\n\n            <div class=\"setting-item\">\n              <label class=\"checkbox-label\">\n                <input type=\"checkbox\" id=\"autoSave\" name=\"autoSave\" ").concat(settings.autoSave ? 'checked' : '', ">\n                Enable Auto Save\n              </label>\n              <div class=\"setting-description\">Automatically save content periodically</div>\n            </div>\n\n            <div class=\"setting-item\">\n              <label for=\"autoSaveDelay\">Auto Save Delay (ms)</label>\n              <input type=\"number\" id=\"autoSaveDelay\" name=\"autoSaveDelay\" min=\"5000\" max=\"300000\" step=\"5000\" value=\"").concat(settings.autoSaveDelay, "\">\n              <div class=\"setting-description\">Delay between auto-saves (in milliseconds)</div>\n            </div>\n          </div>\n        </form>\n\n\n      </div>\n    ");
    }

    /**
     * Setup form event handlers
     */
  }, {
    key: "setupFormHandlers",
    value: function setupFormHandlers() {
      var _this5 = this;
      if (!this.formElement) return;

      // Handle input changes
      this.formElement.addEventListener('input', function (e) {
        var _e$target = e.target,
          name = _e$target.name,
          value = _e$target.value,
          type = _e$target.type,
          checked = _e$target.checked;
        if (!name) return;
        var finalValue;
        if (type === 'checkbox') {
          finalValue = checked;
        } else if (type === 'number') {
          finalValue = parseInt(value);
        } else if (name === 'minimap') {
          finalValue = value; // 'enabled' or 'disabled'
        } else {
          finalValue = value;
        }
        _this5.updateSetting(name, finalValue);
      });

      // Handle select changes
      this.formElement.addEventListener('change', function (e) {
        var _e$target2 = e.target,
          name = _e$target2.name,
          value = _e$target2.value,
          type = _e$target2.type,
          checked = _e$target2.checked;
        if (!name) return;
        var finalValue;
        if (type === 'checkbox') {
          finalValue = checked;
        } else if (type === 'number') {
          finalValue = parseInt(value);
        } else if (name === 'minimap') {
          finalValue = value; // 'enabled' or 'disabled'
        } else {
          finalValue = value;
        }
        _this5.updateSetting(name, finalValue);
      });
    }

    /**
     * Apply current form settings
     */
  }, {
    key: "applyCurrentSettings",
    value: function applyCurrentSettings() {
      // Settings are applied in real-time via event handlers
      // This method can be used for batch operations if needed
      this.closeSettings();
    }

    /**
     * Add CSS link for settings modal
     * @private
     */
  }, {
    key: "_addStyles",
    value: function _addStyles() {
      var linkId = 'settings-styles-link';
      if (document.getElementById(linkId)) return;
      var link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = '/css/modals/settings.css';
      document.head.appendChild(link);
    }
  }]);
}(); // Create global settings manager instance
var settingsManager = new EditorSettingsManager();

// Export for use in other modules

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (settingsManager);

// Make globally available
if (typeof window !== 'undefined') {
  window.settingsManager = settingsManager;
}

/***/ })

}]);
//# sourceMappingURL=src_client_js_editor_settings_js.js.map