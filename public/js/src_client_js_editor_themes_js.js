"use strict";
(self["webpackChunkggcode_compiler"] = self["webpackChunkggcode_compiler"] || []).push([["src_client_js_editor_themes_js"],{

/***/ "./src/client/js/editor/themes.js":
/*!****************************************!*\
  !*** ./src/client/js/editor/themes.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ThemeManager: () => (/* binding */ ThemeManager),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   themeManager: () => (/* binding */ themeManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Monaco Editor Theme System
 * Centralized theme management with color definitions and loading
 */
var ThemeManager = /*#__PURE__*/function () {
  function ThemeManager() {
    _classCallCheck(this, ThemeManager);
    this.themes = {};
    this.currentTheme = 'ggcode-dark';
    this.colors = {};
    this.initialized = false;
  }

  /**
   * Load and initialize the complete theme system (moved from monaco.js)
   * @returns {Promise<boolean>} Success status
   */
  return _createClass(ThemeManager, [{
    key: "loadAndInitializeTheme",
    value: (function () {
      var _loadAndInitializeTheme = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var attempts, maxAttempts, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              if (!(typeof monaco === 'undefined')) {
                _context.n = 4;
                break;
              }
              attempts = 0;
              maxAttempts = 50; // Wait up to 5 seconds
            case 1:
              if (!(typeof monaco === 'undefined' && attempts < maxAttempts)) {
                _context.n = 3;
                break;
              }
              _context.n = 2;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 100);
              });
            case 2:
              attempts++;
              _context.n = 1;
              break;
            case 3:
              if (!(typeof monaco === 'undefined')) {
                _context.n = 4;
                break;
              }
              throw new Error('Monaco is not available after waiting');
            case 4:
              // Theme loading is now handled by ThemeLoader in main.js
              this.initialized = true;
              return _context.a(2, true);
            case 5:
              _context.p = 5;
              _t = _context.v;
              // Fallback theme handling moved to separate method
              this.createFallbackThemeIfNeeded();
              return _context.a(2, false);
          }
        }, _callee, this, [[0, 5]]);
      }));
      function loadAndInitializeTheme() {
        return _loadAndInitializeTheme.apply(this, arguments);
      }
      return loadAndInitializeTheme;
    }()
    /**
     * Create fallback theme if native theme fails (from monaco.js)
     */
    )
  }, {
    key: "createFallbackThemeIfNeeded",
    value: function createFallbackThemeIfNeeded() {
      if (typeof monaco === 'undefined') return;
      try {
        // Create fallback theme with essential colors
        monaco.editor.defineTheme('ggcode-dark-fallback', {
          base: 'vs-dark',
          inherit: true,
          rules: [
          // Keywords
          {
            token: 'keyword',
            foreground: '6FBAE3',
            fontStyle: 'bold'
          },
          // G-code categories with distinct colors
          {
            token: 'gcode-rapid',
            foreground: '5CB85C',
            fontStyle: 'bold'
          },
          // G0 - Green (rapid moves)
          {
            token: 'gcode-linear',
            foreground: '0275D8',
            fontStyle: 'bold'
          },
          // G1 - Blue (linear moves)
          {
            token: 'gcode-arc',
            foreground: '9B59B6',
            fontStyle: 'bold'
          },
          // G2/G3 - Purple (arc moves)
          {
            token: 'gcode-dwell',
            foreground: 'E67E22',
            fontStyle: 'bold'
          },
          // G4 - Orange (dwell)
          {
            token: 'gcode-drill',
            foreground: '27AE60',
            fontStyle: 'bold'
          },
          // G8x - Dark green (drilling)
          {
            token: 'gcode-bore',
            foreground: '34495E',
            fontStyle: 'bold'
          },
          // G7x - Dark blue (boring/cutoff)
          {
            token: 'gcode-ref',
            foreground: '00BCD4',
            fontStyle: 'bold'
          },
          // G28/G30 - Cyan (reference returns)
          {
            token: 'gcode-tap',
            foreground: 'F1C40F',
            fontStyle: 'bold'
          },
          // G84 - Gold (rigid tapping)
          {
            token: 'gcode',
            foreground: 'E74C3C',
            fontStyle: 'bold'
          },
          // Other G-codes - Red

          // M-code categories with distinct colors
          {
            token: 'mcode-spindle',
            foreground: 'F39C12',
            fontStyle: 'bold'
          },
          // M3/M4/M5 - Orange (spindle control)
          {
            token: 'mcode-toolchange',
            foreground: '9C27B0',
            fontStyle: 'bold'
          },
          // M6 - Purple (tool change)
          {
            token: 'mcode-coolant',
            foreground: '00BCD4',
            fontStyle: 'bold'
          },
          // M7/M8/M9 - Cyan (coolant)
          {
            token: 'mcode-control',
            foreground: 'FFC107',
            fontStyle: 'bold'
          },
          // M0/M1/M2/M30 - Yellow (program control)
          {
            token: 'mcode',
            foreground: 'F06292',
            fontStyle: 'bold'
          },
          // Other M-codes - Pink

          // Other token types
          {
            token: 'axis',
            foreground: 'ff66cc',
            fontStyle: 'italic'
          },
          // Regular axis coordinates (X100, Y200, etc.)
          {
            token: 'axis.x',
            foreground: 'D9372B',
            fontStyle: 'italic'
          }, {
            token: 'axis.y',
            foreground: '57C24F',
            fontStyle: 'italic'
          }, {
            token: 'axis.z',
            foreground: '3B65B8',
            fontStyle: 'italic'
          }, {
            token: 'axis.a',
            foreground: 'ff99ff',
            fontStyle: 'italic'
          }, {
            token: 'axis.b',
            foreground: '99ffff',
            fontStyle: 'italic'
          }, {
            token: 'axis.c',
            foreground: 'ffff99',
            fontStyle: 'italic'
          }, {
            token: 'axis.e',
            foreground: 'ffdddd',
            fontStyle: 'italic'
          }, {
            token: 'axis.f',
            foreground: 'aaaaaa',
            fontStyle: 'italic'
          }, {
            token: 'axis.s',
            foreground: 'ffbb66',
            fontStyle: 'italic'
          }, {
            token: 'axis.t',
            foreground: 'B02BD9',
            fontStyle: 'italic'
          }, {
            token: 'axis.h',
            foreground: 'bbbbff',
            fontStyle: 'italic'
          }, {
            token: 'axis.r',
            foreground: 'aaffaa',
            fontStyle: 'italic'
          }, {
            token: 'axis.p',
            foreground: 'bbffff',
            fontStyle: 'italic'
          }, {
            token: 'axis.n',
            foreground: '5C5C5C',
            fontStyle: 'italic'
          },
          // Bracketed axis variables (X[end_x2]), etc. - highlight with bracket accent
          {
            token: 'axis-with-var.x',
            foreground: 'D9372B',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.y',
            foreground: '57C24F',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.z',
            foreground: '3B65B8',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.a',
            foreground: 'E91E63',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.b',
            foreground: '00BCD4',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.c',
            foreground: 'FFC107',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.e',
            foreground: 'ffdddd',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.f',
            foreground: 'aaaaaa',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.s',
            foreground: 'ffbb66',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.t',
            foreground: 'B02BD9',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.h',
            foreground: 'bbbbff',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.r',
            foreground: 'aaffaa',
            fontStyle: 'bold'
          }, {
            token: 'axis-with-var.p',
            foreground: 'bbffff',
            fontStyle: 'bold'
          },
          // Bracketed variables (F[feed_rate], R[radius])
          {
            token: 'variable-bracket',
            foreground: 'FFA500',
            fontStyle: 'bold'
          }, {
            token: 'number',
            foreground: 'D0ECB1'
          }, {
            token: 'comment',
            foreground: '#577834',
            fontStyle: 'italic'
          },
          // Triple-slash configurator comments
          {
            token: 'comment.configurator.triple-slash',
            foreground: '569CD6',
            fontStyle: 'bold'
          }, {
            token: 'keyword.annotation.configurator',
            foreground: 'C586C0',
            fontStyle: 'bold'
          }, {
            token: 'constant.numeric.range.configurator',
            foreground: 'B5CEA8'
          }, {
            token: 'comment.description.configurator',
            foreground: '6A9955',
            fontStyle: 'italic'
          }, {
            token: 'variable',
            foreground: 'ffaa00'
          }, {
            token: 'constant',
            foreground: '00ff99'
          }, {
            token: 'predefined',
            foreground: 'ff66cc'
          }],
          colors: {
            'editor.background': '#1e1e1e',
            'editor.foreground': '#cccccc',
            'editor.selectionBackground': '#264f78',
            'editor.lineHighlightBackground': '#2a2a2a'
          }
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
  }, {
    key: "loadTheme",
    value: function loadTheme(themeName) {
      if (this.themes[themeName]) {
        this.currentTheme = themeName;
        var theme = this.themes[themeName];

        // Define the theme in Monaco if available
        if (typeof monaco !== 'undefined') {
          monaco.editor.defineTheme(themeName, theme.definition);
          // Theme defined successfully
        } else {
          console.warn("Monaco not available, theme '".concat(themeName, "' will be applied when Monaco loads"));
          return;
        }

        // Apply theme to all existing editors
        this.applyThemeToEditors();
        this.initialized = true;
      } else {
        console.warn("Theme '".concat(themeName, "' not found, using fallback theme. Available themes:"), this.getAvailableThemes());
        this.createFallbackThemeIfNeeded();
        this.initialized = true;
      }
    }

    /**
     * Apply current theme to all Monaco editors
     */
  }, {
    key: "applyThemeToEditors",
    value: function applyThemeToEditors() {
      var _this = this;
      if (typeof monaco === 'undefined') return;

      // Find all Monaco editors and apply theme
      var editors = monaco.editor.getEditors();
      editors.forEach(function (editor) {
        editor.updateOptions({
          theme: _this.currentTheme
        });
      });
    }

    /**
     * Get current theme colors
     * @returns {Object} Theme colors object
     */
  }, {
    key: "getCurrentThemeColors",
    value: function getCurrentThemeColors() {
      var _this$themes$this$cur;
      return ((_this$themes$this$cur = this.themes[this.currentTheme]) === null || _this$themes$this$cur === void 0 ? void 0 : _this$themes$this$cur.colors) || {};
    }

    /**
     * Register a new theme
     * @param {string} name - Theme name
     * @param {Object} themeDefinition - Monaco theme definition
     * @param {Object} colors - Color definitions
     */
  }, {
    key: "registerTheme",
    value: function registerTheme(name, themeDefinition) {
      var colors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.themes[name] = {
        definition: themeDefinition,
        colors: colors
      };

      // Merge colors into main colors object
      Object.assign(this.colors, colors);
    }

    /**
     * Get color by key
     * @param {string} key - Color key
     * @returns {string} Color value
     */
  }, {
    key: "getColor",
    value: function getColor(key) {
      return this.colors[key] || this.getCurrentThemeColors()[key];
    }

    /**
     * Get all available themes
     * @returns {Array<string>} Array of theme names
     */
  }, {
    key: "getAvailableThemes",
    value: function getAvailableThemes() {
      return Object.keys(this.themes);
    }

    /**
     * Apply theme to a specific editor instance
     * @param {Object} editorInstance - Monaco editor instance
     * @param {string} themeName - Optional theme name, defaults to current theme
     */
  }, {
    key: "applyThemeToSpecificEditor",
    value: function applyThemeToSpecificEditor(editorInstance) {
      var themeName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (typeof monaco === 'undefined' || !editorInstance) return;
      try {
        var theme = themeName || this.currentTheme;
        editorInstance.updateOptions({
          theme: theme
        });
      } catch (e) {
        console.warn('Failed to update editor theme:', e);
      }
    }

    /**
     * Initialize theme system state
     * @returns {boolean} Initialization status
     */
  }, {
    key: "isInitialized",
    value: function isInitialized() {
      return this.initialized && typeof monaco !== 'undefined';
    }

    /**
     * Get current theme name
     * @returns {string} Current theme name
     */
  }, {
    key: "getCurrentTheme",
    value: function getCurrentTheme() {
      return this.currentTheme;
    }

    /**
     * Enhanced theme switcher with validation
     * @param {string} themeName - Name of the theme to switch to
     * @returns {boolean} Success status
     */
  }, {
    key: "switchTheme",
    value: function switchTheme(themeName) {
      try {
        if (!this.themes[themeName]) {
          console.warn("Theme '".concat(themeName, "' not found. Available themes:"), this.getAvailableThemes());
          return false;
        }
        this.loadTheme(themeName);
        return true;
      } catch (error) {
        console.error("Failed to switch to theme '".concat(themeName, "':"), error);
        return false;
      }
    }

    /**
     * Apply any pending theme preferences that couldn't be applied during initialization
     */
  }, {
    key: "applyPendingThemePreferences",
    value: function applyPendingThemePreferences() {
      try {
        // Import here to avoid circular imports
        if (typeof window !== 'undefined' && window.storageManager && window.storageManager.getSelectedTheme) {
          var pendingTheme = window.storageManager.getSelectedTheme();
          if (pendingTheme && this.themes[pendingTheme]) {
            this.switchTheme(pendingTheme);
          }
        }
      } catch (error) {
        // Ignore errors for pending theme application
      }
    }
  }]);
}(); // Create global theme manager instance
var themeManager = new ThemeManager();

// Export for use in other modules

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (themeManager);

/***/ })

}]);
//# sourceMappingURL=src_client_js_editor_themes_js.js.map