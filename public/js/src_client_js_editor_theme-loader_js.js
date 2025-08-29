"use strict";
(self["webpackChunkggcode_compiler"] = self["webpackChunkggcode_compiler"] || []).push([["src_client_js_editor_theme-loader_js"],{

/***/ "./src/client/js/editor/theme-loader.js":
/*!**********************************************!*\
  !*** ./src/client/js/editor/theme-loader.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ThemeLoader: () => (/* binding */ ThemeLoader),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   themeLoader: () => (/* binding */ themeLoader)
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
 * Theme Loader
 * Loads theme data from JSON files and creates theme definitions
 * Supports team-based theme configurations
 */



var ThemeLoader = /*#__PURE__*/function () {
  function ThemeLoader() {
    _classCallCheck(this, ThemeLoader);
    this.teamData = null;
    this.themeColors = {};
    this.basePath = '/data/themes/';
  }

  /**
   * Initialize theme loading system
   * @returns {Promise<boolean>} Success status
   */
  return _createClass(ThemeLoader, [{
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return this.loadTeamData();
            case 1:
              _context.n = 2;
              return this.loadColorPalettes();
            case 2:
              _context.n = 3;
              return this.generateThemes();
            case 3:
              return _context.a(2, true);
            case 4:
              _context.p = 4;
              _t = _context.v;
              console.error('ThemeLoader: Failed to initialize:', _t);
              return _context.a(2, false);
          }
        }, _callee, this, [[0, 4]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * Load team configuration from JSON
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "loadTeamData",
    value: (function () {
      var _loadTeamData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var response, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return fetch('/data/team-themes.json');
            case 1:
              response = _context2.v;
              if (response.ok) {
                _context2.n = 2;
                break;
              }
              throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
            case 2:
              _context2.n = 3;
              return response.json();
            case 3:
              this.teamData = _context2.v;
              _context2.n = 5;
              break;
            case 4:
              _context2.p = 4;
              _t2 = _context2.v;
              console.error('ThemeLoader: Failed to load team data:', _t2);
              // Fallback to default team configuration
              this.teamData = {
                teams: {
                  "default": {
                    name: 'GGcode Default',
                    description: 'Default theme configuration',
                    theme: 'ggcode-dark',
                    colors: 'ggcode-dark-colors',
                    settings: {
                      customizable: true,
                      shared: false
                    }
                  }
                }
              };
            case 5:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 4]]);
      }));
      function loadTeamData() {
        return _loadTeamData.apply(this, arguments);
      }
      return loadTeamData;
    }()
    /**
     * Load color palettes from JSON files
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "loadColorPalettes",
    value: (function () {
      var _loadColorPalettes = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var colorFiles, _i, _colorFiles, file, response, colorData, paletteName, _t3, _t4;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              // Define color palette files to load
              colorFiles = ['ggcode-dark-colors.json', 'ggcode-light-colors.json'];
              _i = 0, _colorFiles = colorFiles;
            case 1:
              if (!(_i < _colorFiles.length)) {
                _context3.n = 8;
                break;
              }
              file = _colorFiles[_i];
              _context3.p = 2;
              _context3.n = 3;
              return fetch("".concat(this.basePath).concat(file));
            case 3:
              response = _context3.v;
              if (response.ok) {
                _context3.n = 4;
                break;
              }
              console.warn("ThemeLoader: Color file ".concat(file, " not found (HTTP ").concat(response.status, ")"));
              return _context3.a(3, 7);
            case 4:
              _context3.n = 5;
              return response.json();
            case 5:
              colorData = _context3.v;
              paletteName = file.replace('.json', '');
              this.themeColors[paletteName] = colorData.colors;
              _context3.n = 7;
              break;
            case 6:
              _context3.p = 6;
              _t3 = _context3.v;
              console.warn("ThemeLoader: Failed to load color file ".concat(file, ":"), _t3);
            case 7:
              _i++;
              _context3.n = 1;
              break;
            case 8:
              _context3.n = 10;
              break;
            case 9:
              _context3.p = 9;
              _t4 = _context3.v;
              console.error('ThemeLoader: Failed to load color palettes:', _t4);
            case 10:
              return _context3.a(2);
          }
        }, _callee3, this, [[2, 6], [0, 9]]);
      }));
      function loadColorPalettes() {
        return _loadColorPalettes.apply(this, arguments);
      }
      return loadColorPalettes;
    }()
    /**
     * Generate complete theme definitions from loaded data
     */
    )
  }, {
    key: "generateThemes",
    value: (function () {
      var _generateThemes = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var themes, directThemePreference, preferredTeam, teamConfig, defaultTeamConfig, themeName, _themeName;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              // Always generate both themes so settings can show both options
              themes = {
                'ggcode-dark': this.createGGcodeDarkTheme(),
                'ggcode-light': this.createGGcodeLightTheme()
              }; // Register both themes with ThemeManager
              Object.entries(themes).forEach(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                  themeName = _ref2[0],
                  themeData = _ref2[1];
                _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].registerTheme(themeName, themeData.definition, themeData.colors);
              });

              // Apply any pending theme preferences that couldn't be applied during initialization
              _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].applyPendingThemePreferences();

              // Apply stored background images
              ThemeLoader.applyBackgroundImages();

              // Check for direct theme preference (from settings) first
              directThemePreference = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].getSelectedTheme();
              if (directThemePreference && _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAvailableThemes().includes(directThemePreference)) {
                // User has explicitly selected a theme in settings - use that
                _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].switchTheme(directThemePreference);
              } else if (directThemePreference === null) {
                // No direct theme preference set, use team preference
                preferredTeam = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].getSelectedTeam();
                teamConfig = this.getTeamConfig(preferredTeam);
                if (!teamConfig) {
                  console.warn("ThemeLoader: Team '".concat(preferredTeam, "' not found, using default team"));
                  defaultTeamConfig = this.getTeamConfig('default');
                  if (defaultTeamConfig) {
                    themeName = defaultTeamConfig.theme;
                    if (_themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAvailableThemes().includes(themeName)) {
                      _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].switchTheme(themeName);
                    }
                  }
                } else {
                  _themeName = teamConfig.theme;
                  if (_themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAvailableThemes().includes(_themeName)) {
                    _themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].switchTheme(_themeName);
                  }
                }
              }
            case 1:
              return _context4.a(2);
          }
        }, _callee4, this);
      }));
      function generateThemes() {
        return _generateThemes.apply(this, arguments);
      }
      return generateThemes;
    }()
    /**
     * Set a direct theme preference (overrides team preferences)
     * @param {string} themeName - Name of the theme to set
     * @returns {boolean} Success status
     */
    )
  }, {
    key: "setThemePreference",
    value: function setThemePreference(themeName) {
      try {
        if (!_themes_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAvailableThemes().includes(themeName)) {
          console.error("ThemeLoader: Theme '".concat(themeName, "' not available"));
          return false;
        }

        // Save theme preference
        _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].setSelectedTheme(themeName);
        console.log("ThemeLoader: Set theme preference to: ".concat(themeName));
        return true;
      } catch (error) {
        console.error("ThemeLoader: Failed to set theme preference:", error);
        return false;
      }
    }
    /**
     * Create GGCode Dark theme definition
     * @returns {Object} Theme definition with colors
     */
  }, {
    key: "createGGcodeDarkTheme",
    value: function createGGcodeDarkTheme() {
      var colors = this.themeColors['ggcode-dark-colors'];
      if (!colors) {
        console.error('ThemeLoader: Dark theme colors not available');
        return this.createFallbackTheme();
      }
      return {
        definition: {
          base: 'vs-dark',
          inherit: true,
          rules: this.generateSyntaxRules(colors, false),
          colors: this.generateMonacoColors(colors)
        },
        colors: colors
      };
    }

    /**
     * Create GGCode Light theme definition
     * @returns {Object} Theme definition with colors
     */
  }, {
    key: "createGGcodeLightTheme",
    value: function createGGcodeLightTheme() {
      var colors = this.themeColors['ggcode-light-colors'];
      if (!colors) {
        console.error('ThemeLoader: Light theme colors not available');
        return this.createFallbackTheme(true);
      }
      return {
        definition: {
          base: 'vs',
          inherit: true,
          rules: this.generateSyntaxRules(colors, true),
          colors: this.generateMonacoColors(colors)
        },
        colors: colors
      };
    }

    /**
     * Generate syntax highlighting rules
     * @param {Object} colors - Color palette
     * @param {boolean} isLight - Whether this is a light theme
     * @returns {Array} Monaco syntax rules
     */
  }, {
    key: "generateSyntaxRules",
    value: function generateSyntaxRules(colors) {
      var isLight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return [
      // Core syntax highlighting
      {
        token: 'keyword',
        foreground: this.extractHex(colors.keyword),
        fontStyle: 'bold'
      },
      // Differentiated G-code colors
      {
        token: 'gcode-rapid',
        foreground: this.extractHex(colors.gcodeRapid),
        fontStyle: 'bold'
      }, {
        token: 'gcode-linear',
        foreground: this.extractHex(colors.gcodeLinear),
        fontStyle: 'bold'
      }, {
        token: 'gcode-arc',
        foreground: this.extractHex(colors.gcodeArc),
        fontStyle: 'bold'
      }, {
        token: 'gcode-dwell',
        foreground: this.extractHex(colors.gcodeDwell),
        fontStyle: 'bold'
      }, {
        token: 'gcode-drill',
        foreground: this.extractHex(colors.gcodeDrill),
        fontStyle: 'bold'
      }, {
        token: 'gcode-bore',
        foreground: this.extractHex(colors.gcodeBore),
        fontStyle: 'bold'
      }, {
        token: 'gcode-ref',
        foreground: this.extractHex(colors.gcodeRef),
        fontStyle: 'bold'
      }, {
        token: 'gcode-tap',
        foreground: this.extractHex(colors.gcodeTap),
        fontStyle: 'bold'
      }, {
        token: 'gcode',
        foreground: this.extractHex(colors.gcode),
        fontStyle: 'bold'
      },
      // Differentiated M-code colors
      {
        token: 'mcode-spindle',
        foreground: this.extractHex(colors.mcodeSpindle),
        fontStyle: 'bold'
      }, {
        token: 'mcode-toolchange',
        foreground: this.extractHex(colors.mcodeToolchange),
        fontStyle: 'bold'
      }, {
        token: 'mcode-coolant',
        foreground: this.extractHex(colors.mcodeCoolant),
        fontStyle: 'bold'
      }, {
        token: 'mcode-control',
        foreground: this.extractHex(colors.mcodeControl),
        fontStyle: 'bold'
      }, {
        token: 'mcode',
        foreground: this.extractHex(colors.mcode),
        fontStyle: 'bold'
      },
      // Other token types
      {
        token: 'axis',
        foreground: this.extractHex(colors.axis),
        fontStyle: 'italic'
      }, {
        token: 'number',
        foreground: this.extractHex(colors.number)
      }, {
        token: 'comment',
        foreground: this.extractHex(colors.comment),
        fontStyle: 'italic'
      }, {
        token: 'variable',
        foreground: this.extractHex(colors.variable)
      }, {
        token: 'variable-declaration',
        foreground: this.extractHex(colors.variable),
        fontStyle: 'bold'
      }, {
        token: 'variable-reference',
        foreground: this.extractHex(colors.variable),
        fontStyle: 'italic'
      }, {
        token: 'constant',
        foreground: this.extractHex(colors.constant)
      }, {
        token: 'predefined',
        foreground: this.extractHex(colors.predefined)
      }, {
        token: 'identifier',
        foreground: this.extractHex(colors.identifier)
      },
      // Axis-specific colors
      {
        token: 'axis.x',
        foreground: this.extractHex(colors.axisX)
      }, {
        token: 'axis.y',
        foreground: this.extractHex(colors.axisY)
      }, {
        token: 'axis.z',
        foreground: this.extractHex(colors.axisZ)
      }, {
        token: 'axis.a',
        foreground: this.extractHex(colors.axisA)
      }, {
        token: 'axis.b',
        foreground: this.extractHex(colors.axisB)
      }, {
        token: 'axis.c',
        foreground: this.extractHex(colors.axisC)
      }, {
        token: 'axis.e',
        foreground: this.extractHex(colors.axisE)
      }, {
        token: 'axis.f',
        foreground: this.extractHex(colors.axisF)
      }, {
        token: 'axis.s',
        foreground: this.extractHex(colors.axisS)
      }, {
        token: 'axis.t',
        foreground: this.extractHex(colors.axisT)
      }, {
        token: 'axis.h',
        foreground: this.extractHex(colors.axisH)
      }, {
        token: 'axis.r',
        foreground: this.extractHex(colors.axisR)
      }, {
        token: 'axis.p',
        foreground: this.extractHex(colors.axisP)
      }, {
        token: 'axis.i',
        foreground: this.extractHex(colors.axisI)
      }, {
        token: 'axis.j',
        foreground: this.extractHex(colors.axisJ)
      }, {
        token: 'nline',
        foreground: this.extractHex(colors.nline)
      },
      // Enhanced bracketed variables
      {
        token: 'axis-with-var.x',
        foreground: this.extractHex(colors.axisX),
        fontStyle: 'bold'
      }, {
        token: 'axis-with-var.y',
        foreground: this.extractHex(colors.axisY),
        fontStyle: 'bold'
      }, {
        token: 'axis-with-var.z',
        foreground: this.extractHex(colors.axisZ),
        fontStyle: 'bold'
      }, {
        token: 'axis-with-var.a',
        foreground: this.extractHex(colors.axisA),
        fontStyle: 'bold'
      }, {
        token: 'axis-with-var.b',
        foreground: this.extractHex(colors.axisB),
        fontStyle: 'bold'
      }, {
        token: 'axis-with-var.c',
        foreground: this.extractHex(colors.axisC),
        fontStyle: 'bold'
      }, {
        token: 'axis-with-var.i',
        foreground: this.extractHex(colors.axisI),
        fontStyle: 'bold'
      }, {
        token: 'axis-with-var.j',
        foreground: this.extractHex(colors.axisJ),
        fontStyle: 'bold'
      }, {
        token: 'axis-with-var.r',
        foreground: this.extractHex(colors.axisR),
        fontStyle: 'bold'
      }, {
        token: 'axis-with-var.f',
        foreground: this.extractHex(colors.axisF),
        fontStyle: 'bold'
      }, {
        token: 'axis-with-var.s',
        foreground: this.extractHex(colors.axisS),
        fontStyle: 'bold'
      },
      // Standard Monaco tokens
      {
        token: 'string',
        foreground: this.extractHex(colors.gcode)
      }, {
        token: 'string.escape',
        foreground: this.extractHex(colors.variable)
      }, {
        token: 'character',
        foreground: this.extractHex(colors.gcode)
      }, {
        token: 'operator',
        foreground: isLight ? '000000' : 'd4d4d4'
      }, {
        token: 'punctuation',
        foreground: isLight ? '000000' : 'd4d4d4'
      }, {
        token: 'delimiter',
        foreground: isLight ? '000000' : 'd4d4d4'
      },
      // Bracket delimiters with subtle accent colors (let Bracket Pair Colorization handle main visuals)
      {
        token: 'delimiter.bracket',
        foreground: this.extractHex(colors.bracketLevel1)
      }, {
        token: 'delimiter.parenthesis',
        foreground: this.extractHex(colors.bracketLevel2)
      }, {
        token: 'delimiter.curly',
        foreground: this.extractHex(colors.bracketLevel3)
      }, {
        token: 'type',
        foreground: '4ec9b0'
      }, {
        token: 'type.parameter',
        foreground: '4ec9b0'
      }, {
        token: 'type.builtin',
        foreground: '4ec9b0'
      }, {
        token: 'function',
        foreground: 'dcdcaa'
      }, {
        token: 'method',
        foreground: 'dcdcaa'
      }, {
        token: 'function.call',
        foreground: 'dcdcaa'
      }];
    }

    /**
     * Generate Monaco editor colors configuration
     * @param {Object} colors - Color palette
     * @returns {Object} Monaco colors object
     */
  }, {
    key: "generateMonacoColors",
    value: function generateMonacoColors(colors) {
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
        'editorBracketMatch.border': colors.borderFocus
      };
    }

    /**
     * Extract hex color without # prefix for Monaco
     * @param {string} color - Color value (with or without #)
     * @returns {string} Hex color without #
     */
  }, {
    key: "extractHex",
    value: function extractHex(color) {
      if (!color) return 'cccccc';
      return color.startsWith('#') ? color.substring(1) : color;
    }

    /**
     * Create fallback theme
     * @param {boolean} light - Whether to create light theme fallback
     * @returns {Object} Fallback theme definition
     */
  }, {
    key: "createFallbackTheme",
    value: function createFallbackTheme() {
      var light = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var baseColors = light ? {
        background: '#ffffff',
        foreground: '#000000',
        keyword: '#0000ff',
        comment: '#008000',
        number: '#008000'
      } : {
        background: '#1e1e1e',
        foreground: '#cccccc',
        keyword: '#6FBAE3',
        comment: '#577834',
        number: '#D0ECB1'
      };
      return {
        definition: {
          base: light ? 'vs' : 'vs-dark',
          inherit: true,
          rules: [{
            token: 'keyword',
            foreground: this.extractHex(baseColors.keyword),
            fontStyle: 'bold'
          }, {
            token: 'comment',
            foreground: this.extractHex(baseColors.comment),
            fontStyle: 'italic'
          }, {
            token: 'number',
            foreground: this.extractHex(baseColors.number)
          }],
          colors: {
            'editor.background': baseColors.background,
            'editor.foreground': baseColors.foreground,
            'editor.selectionBackground': light ? '#add6ff' : '#264f78'
          }
        },
        colors: baseColors
      };
    }

    /**
     * Get team configuration
     * @param {string} teamName - Name of the team
     * @returns {Object} Team configuration
     */
  }, {
    key: "getTeamConfig",
    value: function getTeamConfig() {
      var _this$teamData, _this$teamData2;
      var teamName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
      return ((_this$teamData = this.teamData) === null || _this$teamData === void 0 || (_this$teamData = _this$teamData.teams) === null || _this$teamData === void 0 ? void 0 : _this$teamData[teamName]) || ((_this$teamData2 = this.teamData) === null || _this$teamData2 === void 0 || (_this$teamData2 = _this$teamData2.teams) === null || _this$teamData2 === void 0 ? void 0 : _this$teamData2["default"]);
    }

    /**
     * Apply background images to editor containers
     * @static
     */
  }], [{
    key: "applyBackgroundImages",
    value: function applyBackgroundImages() {
      var editorElement = document.getElementById('editor');
      var outputElement = document.getElementById('output');
      try {
        // Import storage manager dynamically to avoid circular imports
        Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../utils/storageManager.js */ "./src/client/js/utils/storageManager.js")).then(function (storageManager) {
          // Apply stored background preferences
          var editorBg = storageManager["default"].getEditorBackground();
          var outputBg = storageManager["default"].getOutputBackground();

          // Clear all background classes first
          var allBgClasses = ['bg-space', 'bg-circuit', 'bg-code-gradient', 'bg-matrix', 'bg-coffee-shop', 'bg-minimal-dark', 'bg-minimal-light', 'bg-blue-grid'];
          if (editorElement) {
            allBgClasses.forEach(function (cls) {
              return editorElement.classList.remove(cls);
            });
            if (editorBg !== 'none' && allBgClasses.includes(editorBg)) {
              editorElement.classList.add(editorBg);
            }
          }
          if (outputElement) {
            allBgClasses.forEach(function (cls) {
              return outputElement.classList.remove(cls);
            });
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
  }, {
    key: "setEditorBackground",
    value: function setEditorBackground() {
      var backgroundClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'none';
      try {
        Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../utils/storageManager.js */ "./src/client/js/utils/storageManager.js")).then(function (storageManager) {
          storageManager["default"].setEditorBackground(backgroundClass);
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
  }, {
    key: "setOutputBackground",
    value: function setOutputBackground() {
      var backgroundClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'none';
      try {
        Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../utils/storageManager.js */ "./src/client/js/utils/storageManager.js")).then(function (storageManager) {
          storageManager["default"].setOutputBackground(backgroundClass);
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
  }, {
    key: "getAvailableBackgrounds",
    value: function getAvailableBackgrounds() {
      return [{
        value: 'none',
        label: 'None',
        description: 'No background image'
      }, {
        value: 'bg-space',
        label: 'Space',
        description: 'NASA space image'
      }, {
        value: 'bg-circuit',
        label: 'Circuit Board',
        description: 'Electronic circuit pattern'
      }, {
        value: 'bg-code-gradient',
        label: 'Code Gradient',
        description: 'Smooth gradient background'
      }, {
        value: 'bg-matrix',
        label: 'Matrix Rain',
        description: 'Animated green matrix effect'
      }, {
        value: 'bg-coffee-shop',
        label: 'Coffee Shop',
        description: 'Cozy coffee shop ambiance'
      }, {
        value: 'bg-minimal-dark',
        label: 'Minimal Dark',
        description: 'Clean gradient background'
      }, {
        value: 'bg-minimal-light',
        label: 'Minimal Light',
        description: 'Bright gradient background'
      }, {
        value: 'bg-blue-grid',
        label: 'Blue Grid',
        description: 'Geometric grid pattern'
      }];
    }
  }]);
}(); // Create global theme loader instance
var themeLoader = new ThemeLoader();

// Export for use in other modules

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (themeLoader);

/***/ })

}]);
//# sourceMappingURL=src_client_js_editor_theme-loader_js.js.map