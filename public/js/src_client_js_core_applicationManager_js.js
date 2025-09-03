"use strict";
(self["webpackChunkggcode_compiler"] = self["webpackChunkggcode_compiler"] || []).push([["src_client_js_core_applicationManager_js"],{

/***/ "./src/client/js/config/configuratorSystem.js":
/*!****************************************************!*\
  !*** ./src/client/js/config/configuratorSystem.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Configurator System Module
 * Handles configurator-related operations
 */
var ConfiguratorSystem = /*#__PURE__*/function () {
  function ConfiguratorSystem(configuratorManager, editorManager) {
    _classCallCheck(this, ConfiguratorSystem);
    this.configuratorManager = configuratorManager;
    this.editorManager = editorManager;
  }

  /**
   * Initialize configurator
   */
  return _createClass(ConfiguratorSystem, [{
    key: "initialize",
    value: function initialize(options) {
      if (this.configuratorManager) {
        this.configuratorManager.initialize(options);
      }
    }

    /**
     * Show configurator
     */
  }, {
    key: "showConfigurator",
    value: function showConfigurator() {
      if (this.configuratorManager) {
        var ggcode = this.editorManager ? this.editorManager.getInputValue() : '';
        this.configuratorManager.showConfigurator(ggcode);
      } else {
        console.error('ConfiguratorManager module not available');
      }
    }

    /**
     * Handle configurator compile action
     */
  }, {
    key: "handleConfiguratorCompile",
    value: function handleConfiguratorCompile(result) {
      console.log('Configurator compile completed:', result);
    }

    /**
     * Handle configurator save action
     */
  }, {
    key: "handleConfiguratorSave",
    value: function handleConfiguratorSave(result) {
      console.log('Configurator save completed:', result);
    }

    /**
     * Configurator save and compile
     */
  }, {
    key: "configuratorSaveAndCompile",
    value: function configuratorSaveAndCompile() {
      var _this = this;
      if (this.configuratorManager) {
        var ggcode = this.editorManager ? this.editorManager.getInputValue() : '';
        this.configuratorManager.handleSaveAndCompile(ggcode, function (code) {
          var _this$editorManager;
          return (_this$editorManager = _this.editorManager) === null || _this$editorManager === void 0 ? void 0 : _this$editorManager.setInputValue(code);
        }, function () {
          if (window.submitGGcode) {
            window.submitGGcode(new Event('submit'));
          }
        });
      } else {
        console.error('ConfiguratorManager module not available');
      }
    }

    /**
     * Configurator compile only
     */
  }, {
    key: "configuratorCompileOnly",
    value: function configuratorCompileOnly() {
      if (this.configuratorManager) {
        var ggcode = this.editorManager ? this.editorManager.getInputValue() : '';
        this.configuratorManager.handleCompileOnly(ggcode, function (code) {
          if (window.submitGGcode) {
            window.submitGGcode(new Event('submit'), code);
          }
        });
      } else {
        console.error('ConfiguratorManager module not available');
      }
    }

    /**
     * Close configurator
     */
  }, {
    key: "closeConfigurator",
    value: function closeConfigurator() {
      if (this.configuratorManager) {
        this.configuratorManager.closeConfigurator();
      }
      var modal = document.getElementById('configuratorModal');
      if (modal) {
        modal.style.display = 'none';
      }
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ConfiguratorSystem);

/***/ }),

/***/ "./src/client/js/configurator/index.js":
/*!*********************************************!*\
  !*** ./src/client/js/configurator/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parser.js */ "./src/client/js/configurator/parser.js");
/* harmony import */ var _renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderer.js */ "./src/client/js/configurator/renderer.js");
/* harmony import */ var _validator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./validator.js */ "./src/client/js/configurator/validator.js");
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
 * Configurator Manager
 * Main configurator module that coordinates parsing, rendering, and validation
 */




var ConfiguratorManager = /*#__PURE__*/function () {
  function ConfiguratorManager() {
    _classCallCheck(this, ConfiguratorManager);
    this.configVars = [];
    this.currentValues = {};
    this.modalElement = null;
    this.contentElement = null;
    this.formElement = null;
    this.onCompile = null;
    this.onSave = null;
  }

  /**
   * Initialize the configurator manager
   * @param {Object} options - Configuration options
   * @param {string} options.modalId - ID of the modal element
   * @param {string} options.contentId - ID of the content container
   * @param {Function} options.onCompile - Callback for compilation
   * @param {Function} options.onSave - Callback for saving
   */
  return _createClass(ConfiguratorManager, [{
    key: "initialize",
    value: function initialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$modalId = options.modalId,
        modalId = _options$modalId === void 0 ? 'configuratorModal' : _options$modalId,
        _options$contentId = options.contentId,
        contentId = _options$contentId === void 0 ? 'configuratorContent' : _options$contentId,
        _options$onCompile = options.onCompile,
        onCompile = _options$onCompile === void 0 ? null : _options$onCompile,
        _options$onSave = options.onSave,
        onSave = _options$onSave === void 0 ? null : _options$onSave;
      this.modalElement = document.getElementById(modalId);
      this.contentElement = document.getElementById(contentId);
      this.onCompile = onCompile;
      this.onSave = onSave;
      if (!this.modalElement || !this.contentElement) {
        console.error('Configurator: Required DOM elements not found');
        return false;
      }

      // Add CSS styles
      this._addStyles();
      return true;
    }

    /**
     * Show configurator modal with GGcode content
     * @param {string} ggcode - GGcode content to parse
     */
  }, {
    key: "showConfigurator",
    value: function showConfigurator(ggcode) {
      if (!this.modalElement || !this.contentElement) {
        console.error('Configurator not initialized');
        return;
      }

      // Parse configurator variables from GGcode
      this.configVars = _parser_js__WEBPACK_IMPORTED_MODULE_0__["default"].parseConfiguratorVars(ggcode);
      this.currentValues = _parser_js__WEBPACK_IMPORTED_MODULE_0__["default"].getDefaultValues(this.configVars);

      // Render the form
      var formHtml = _renderer_js__WEBPACK_IMPORTED_MODULE_1__["default"].renderConfiguratorForm(this.configVars);
      this.contentElement.innerHTML = formHtml;

      // Get form element and setup validation
      this.formElement = document.getElementById('configuratorForm');
      if (this.formElement) {
        _validator_js__WEBPACK_IMPORTED_MODULE_2__["default"].setupRealTimeValidation(this.formElement, this.configVars);
      }

      // Show modal
      this.modalElement.style.display = 'flex';
      this.modalElement.classList.add('configurator-fade-in');
    }

    /**
     * Close configurator modal
     */
  }, {
    key: "closeConfigurator",
    value: function closeConfigurator() {
      if (this.modalElement) {
        this.modalElement.style.display = 'none';
        this.modalElement.classList.remove('configurator-fade-in');
      }
    }

    /**
     * Get current form values
     * @returns {Object} Current form values
     */
  }, {
    key: "getFormValues",
    value: function getFormValues() {
      if (!this.formElement) {
        return {};
      }
      return _validator_js__WEBPACK_IMPORTED_MODULE_2__["default"].getFormValues(this.formElement, this.configVars);
    }

    /**
     * Validate current form
     * @returns {Object} Validation result
     */
  }, {
    key: "validateForm",
    value: function validateForm() {
      if (!this.formElement) {
        return {
          isValid: false,
          errors: {
            general: 'Form not available'
          },
          values: {}
        };
      }
      return _validator_js__WEBPACK_IMPORTED_MODULE_2__["default"].validateForm(this.formElement, this.configVars);
    }

    /**
     * Save form values and update GGcode
     * @param {string} originalGGcode - Original GGcode content
     * @returns {Object} Result with updated code and status
     */
  }, {
    key: "saveAndUpdateGGcode",
    value: function saveAndUpdateGGcode(originalGGcode) {
      var validation = this.validateForm();
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Form validation failed',
          errors: validation.errors
        };
      }
      var values = validation.values;
      var updateResult = _parser_js__WEBPACK_IMPORTED_MODULE_0__["default"].updateGGcodeWithValues(originalGGcode, values);

      // Log any variables not found
      if (updateResult.notFound.length > 0) {
        console.warn('[Configurator] Variables not found in code:', updateResult.notFound);
      }

      // Update current values
      this.currentValues = values;
      return {
        success: true,
        code: updateResult.code,
        foundVars: updateResult.foundVars,
        notFound: updateResult.notFound,
        values: values
      };
    }

    /**
     * Compile with current form values without saving
     * @param {string} originalGGcode - Original GGcode content
     * @returns {Object} Result with temporary code for compilation
     */
  }, {
    key: "compileWithCurrentValues",
    value: function compileWithCurrentValues(originalGGcode) {
      var validation = this.validateForm();
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Form validation failed',
          errors: validation.errors
        };
      }
      var values = validation.values;
      var updateResult = _parser_js__WEBPACK_IMPORTED_MODULE_0__["default"].updateGGcodeWithValues(originalGGcode, values);
      return {
        success: true,
        code: updateResult.code,
        values: values
      };
    }

    /**
     * Handle save and compile action
     * @param {string} originalGGcode - Original GGcode content
     * @param {Function} editorSetValue - Function to update editor
     * @param {Function} compileFunction - Function to trigger compilation
     */
  }, {
    key: "handleSaveAndCompile",
    value: (function () {
      var _handleSaveAndCompile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(originalGGcode, editorSetValue, compileFunction) {
        var result, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              result = this.saveAndUpdateGGcode(originalGGcode);
              if (result.success) {
                _context.n = 1;
                break;
              }
              console.error('[Configurator] Save failed:', result.error);
              this._showErrorMessage('Failed to save: ' + result.error);
              return _context.a(2);
            case 1:
              //console.log('[Configurator] Saving values from form:', result.values);
              //console.log('[Configurator] Updated code:', result.code);

              // Update editor
              if (editorSetValue) {
                editorSetValue(result.code);
                console.log('[Configurator] Editor updated with new values.');
              }

              // Close modal
              this.closeConfigurator();

              // Trigger compilation
              if (!compileFunction) {
                _context.n = 5;
                break;
              }
              _context.p = 2;
              _context.n = 3;
              return compileFunction();
            case 3:
              _context.n = 5;
              break;
            case 4:
              _context.p = 4;
              _t = _context.v;
              console.error('[Configurator] Compilation failed:', _t);
            case 5:
              // Call save callback if provided
              if (this.onSave) {
                this.onSave(result);
              }
            case 6:
              return _context.a(2);
          }
        }, _callee, this, [[2, 4]]);
      }));
      function handleSaveAndCompile(_x, _x2, _x3) {
        return _handleSaveAndCompile.apply(this, arguments);
      }
      return handleSaveAndCompile;
    }()
    /**
     * Handle compile only action
     * @param {string} originalGGcode - Original GGcode content
     * @param {Function} compileFunction - Function to compile code
     */
    )
  }, {
    key: "handleCompileOnly",
    value: (function () {
      var _handleCompileOnly = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(originalGGcode, compileFunction) {
        var result, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              result = this.compileWithCurrentValues(originalGGcode);
              if (result.success) {
                _context2.n = 1;
                break;
              }
              console.error('[Configurator] Compile preparation failed:', result.error);
              this._showErrorMessage('Failed to prepare compilation: ' + result.error);
              return _context2.a(2);
            case 1:
              if (!compileFunction) {
                _context2.n = 5;
                break;
              }
              _context2.p = 2;
              _context2.n = 3;
              return compileFunction(result.code);
            case 3:
              _context2.n = 5;
              break;
            case 4:
              _context2.p = 4;
              _t2 = _context2.v;
              console.error('[Configurator] Compilation failed:', _t2);
              this._showErrorMessage('Compilation failed: ' + _t2.message);
            case 5:
              // Call compile callback if provided
              if (this.onCompile) {
                this.onCompile(result);
              }
            case 6:
              return _context2.a(2);
          }
        }, _callee2, this, [[2, 4]]);
      }));
      function handleCompileOnly(_x4, _x5) {
        return _handleCompileOnly.apply(this, arguments);
      }
      return handleCompileOnly;
    }()
    /**
     * Get configurator variables
     * @returns {Array} Array of configurator variables
     */
    )
  }, {
    key: "getConfigVars",
    value: function getConfigVars() {
      return this.configVars;
    }

    /**
     * Get current values
     * @returns {Object} Current form values
     */
  }, {
    key: "getCurrentValues",
    value: function getCurrentValues() {
      return this.currentValues;
    }

    /**
     * Check if configurator has variables
     * @returns {boolean} True if has variables
     */
  }, {
    key: "hasVariables",
    value: function hasVariables() {
      return this.configVars.length > 0;
    }

    /**
     * Reset configurator state
     */
  }, {
    key: "reset",
    value: function reset() {
      this.configVars = [];
      this.currentValues = {};
      this.formElement = null;
      if (this.contentElement) {
        this.contentElement.innerHTML = '';
      }
    }

    /**
     * Show error message in the configurator
     * @param {string} message - Error message
     * @private
     */
  }, {
    key: "_showErrorMessage",
    value: function _showErrorMessage(message) {
      if (this.contentElement) {
        var errorHtml = _renderer_js__WEBPACK_IMPORTED_MODULE_1__["default"].renderErrorMessage(message);
        var errorDiv = document.createElement('div');
        errorDiv.innerHTML = errorHtml;
        this.contentElement.insertBefore(errorDiv, this.contentElement.firstChild);

        // Remove error after 5 seconds
        setTimeout(function () {
          if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
          }
        }, 5000);
      }
    }

    /**
     * Add CSS styles for configurator
     * @private
     */
  }, {
    key: "_addStyles",
    value: function _addStyles() {
      var styleId = 'configurator-styles';
      if (document.getElementById(styleId)) return;
      var style = document.createElement('style');
      style.id = styleId;
      style.textContent = "\n      ".concat(_renderer_js__WEBPACK_IMPORTED_MODULE_1__["default"].getValidationStyles(), "\n      ").concat(_renderer_js__WEBPACK_IMPORTED_MODULE_1__["default"].getAnimationStyles(), "\n    ");
      document.head.appendChild(style);
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ConfiguratorManager);

/***/ }),

/***/ "./src/client/js/configurator/parser.js":
/*!**********************************************!*\
  !*** ./src/client/js/configurator/parser.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Configurator Variable Parser
 * Parses GGcode to extract configurator variables and their annotations
 */
var ConfiguratorParser = /*#__PURE__*/function () {
  function ConfiguratorParser() {
    _classCallCheck(this, ConfiguratorParser);
  }
  return _createClass(ConfiguratorParser, null, [{
    key: "parseConfiguratorVars",
    value:
    /**
     * Parse GGcode to extract configurator variables
     * @param {string} ggcode - GGcode content to parse
     * @returns {Array} Array of configurator variable objects
     */
    function parseConfiguratorVars(ggcode) {
      var lines = ggcode.split(/\r?\n/);
      var configVars = [];
      var _iterator = _createForOfIteratorHelper(lines),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var line = _step.value;
          var match = line.match(/^\s*let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^/]+?)\s*\/\/\/\s*(.*)$/);
          if (!match) continue;
          var name = match[1];
          var rawValue = match[2].trim();
          var tag = match[3].trim();
          var description = '';

          // Extract description if present (after //)
          var descIdx = tag.indexOf('//');
          if (descIdx !== -1) {
            description = tag.slice(descIdx + 2).trim();
            tag = tag.slice(0, descIdx).trim();
          }
          var variable = this._parseVariableTag(name, rawValue, tag, description);
          if (variable) {
            configVars.push(variable);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return configVars;
    }

    /**
     * Parse a variable tag to determine type and parameters
     * @param {string} name - Variable name
     * @param {string} rawValue - Raw variable value
     * @param {string} tag - Annotation tag
     * @param {string} description - Variable description
     * @returns {Object|null} Parsed variable object or null if invalid
     * @private
     */
  }, {
    key: "_parseVariableTag",
    value: function _parseVariableTag(name, rawValue, tag, description) {
      var type,
        params = {},
        defaultValue = rawValue;
      if (tag.startsWith('@number')) {
        type = 'number';
        var numMatch = tag.match(/@number\s+(-?\d+(?:\.\d+)?)(?:\s+|\s*to\s*)(-?\d+(?:\.\d+)?)/);
        if (numMatch) {
          params.min = parseFloat(numMatch[1]);
          params.max = parseFloat(numMatch[2]);
        }
        defaultValue = parseFloat(rawValue);
      } else if (tag.startsWith('@check')) {
        type = 'check';
        defaultValue = rawValue == '1' || rawValue.toLowerCase() == 'true';
      } else if (tag.startsWith('@selction')) {
        type = 'selection';
        var selMatch = tag.match(/@selction\s+([\d, ]+)/);
        if (selMatch) {
          params.options = selMatch[1].split(',').map(function (s) {
            return s.trim();
          }).filter(Boolean);
        }
        defaultValue = rawValue;
      } else if (tag.startsWith('@text')) {
        type = 'text';
        var textMatch = tag.match(/@text\s+(\d+)(?:\s+max\s*(\d+))?/);
        if (textMatch) {
          params.rows = parseInt(textMatch[1]);
          if (textMatch[2]) params.max = parseInt(textMatch[2]);
        }
        defaultValue = rawValue;
      } else {
        return null; // skip unknown tags
      }
      return {
        name: name,
        type: type,
        defaultValue: defaultValue,
        params: params,
        description: description
      };
    }

    /**
     * Update GGcode with new variable values
     * @param {string} ggcode - Original GGcode
     * @param {Object} values - New variable values
     * @returns {Object} Object with updated code and found variables
     */
  }, {
    key: "updateGGcodeWithValues",
    value: function updateGGcodeWithValues(ggcode, values) {
      var lines = ggcode.split(/\r?\n/);
      var foundVars = {};
      var newLines = lines.map(function (line) {
        var match = line.match(/^\s*let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^/]+)(\/\/\/)/);
        if (!match) return line;
        var name = match[1];
        if (Object.prototype.hasOwnProperty.call(values, name)) {
          foundVars[name] = true;
          // Replace value, keep tag and description
          var newLine = line.replace(/(let\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*)([^/]+)(\/\/\/)/, function (_, p1, p2, p3) {
            return p1 + values[name] + ' ' + p3;
          });
          return newLine;
        }
        return line;
      });

      // Log any variables not found in code
      var notFound = Object.keys(values).filter(function (name) {
        return !foundVars[name];
      });
      return {
        code: newLines.join('\n'),
        foundVars: foundVars,
        notFound: notFound
      };
    }

    /**
     * Validate variable value against its constraints
     * @param {Object} variable - Variable definition
     * @param {*} value - Value to validate
     * @returns {Object} Validation result with isValid and error message
     */
  }, {
    key: "validateVariableValue",
    value: function validateVariableValue(variable, value) {
      var result = {
        isValid: true,
        error: null
      };
      switch (variable.type) {
        case 'number':
          {
            var numValue = parseFloat(value);
            if (isNaN(numValue)) {
              result.isValid = false;
              result.error = 'Must be a valid number';
            } else if (variable.params.min !== undefined && numValue < variable.params.min) {
              result.isValid = false;
              result.error = "Must be at least ".concat(variable.params.min);
            } else if (variable.params.max !== undefined && numValue > variable.params.max) {
              result.isValid = false;
              result.error = "Must be at most ".concat(variable.params.max);
            }
            break;
          }
        case 'text':
          if (variable.params.max && value.length > variable.params.max) {
            result.isValid = false;
            result.error = "Must be at most ".concat(variable.params.max, " characters");
          }
          break;
        case 'selection':
          if (variable.params.options && !variable.params.options.includes(value)) {
            result.isValid = false;
            result.error = 'Must be one of the available options';
          }
          break;
        case 'check':
          // Boolean values are always valid
          break;
      }
      return result;
    }

    /**
     * Get default values for all configurator variables
     * @param {Array} configVars - Array of configurator variables
     * @returns {Object} Object with variable names as keys and default values
     */
  }, {
    key: "getDefaultValues",
    value: function getDefaultValues(configVars) {
      var defaults = {};
      var _iterator2 = _createForOfIteratorHelper(configVars),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var variable = _step2.value;
          defaults[variable.name] = variable.defaultValue;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return defaults;
    }

    /**
     * Convert form values to appropriate types
     * @param {Object} formValues - Raw form values
     * @param {Array} configVars - Array of configurator variables
     * @returns {Object} Typed values
     */
  }, {
    key: "convertFormValues",
    value: function convertFormValues(formValues, configVars) {
      var converted = {};
      var varMap = {};

      // Create a map for quick lookup
      var _iterator3 = _createForOfIteratorHelper(configVars),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _variable = _step3.value;
          varMap[_variable.name] = _variable;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      for (var _i = 0, _Object$entries = Object.entries(formValues); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          name = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        var variable = varMap[name];
        if (!variable) {
          converted[name] = value;
          continue;
        }
        switch (variable.type) {
          case 'number':
            converted[name] = parseFloat(value);
            break;
          case 'check':
            converted[name] = value ? 1 : 0;
            break;
          default:
            converted[name] = value;
        }
      }
      return converted;
    }

    /**
     * Get variable by name
     * @param {Array} configVars - Array of configurator variables
     * @param {string} name - Variable name to find
     * @returns {Object|null} Variable object or null if not found
     */
  }, {
    key: "getVariableByName",
    value: function getVariableByName(configVars, name) {
      return configVars.find(function (variable) {
        return variable.name === name;
      }) || null;
    }

    /**
     * Get variables by type
     * @param {Array} configVars - Array of configurator variables
     * @param {string} type - Variable type to filter by
     * @returns {Array} Array of variables of the specified type
     */
  }, {
    key: "getVariablesByType",
    value: function getVariablesByType(configVars, type) {
      return configVars.filter(function (variable) {
        return variable.type === type;
      });
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ConfiguratorParser);

/***/ }),

/***/ "./src/client/js/configurator/renderer.js":
/*!************************************************!*\
  !*** ./src/client/js/configurator/renderer.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Configurator Form Renderer
 * Handles rendering of configurator forms and UI components
 */
var ConfiguratorRenderer = /*#__PURE__*/function () {
  function ConfiguratorRenderer() {
    _classCallCheck(this, ConfiguratorRenderer);
  }
  return _createClass(ConfiguratorRenderer, null, [{
    key: "renderConfiguratorForm",
    value:
    /**
     * Render configurator form HTML
     * @param {Array} configVars - Array of configurator variables
     * @returns {string} HTML string for the form
     */
    function renderConfiguratorForm(configVars) {
      if (!Array.isArray(configVars) || configVars.length === 0) {
        return this._renderEmptyState();
      }
      return this._renderForm(configVars);
    }

    /**
     * Render empty state when no configurator variables are found
     * @returns {string} HTML for empty state
     * @private
     */
  }, {
    key: "_renderEmptyState",
    value: function _renderEmptyState() {
      return "<div style=\"color:#aaa; padding:2em;\">\n      <div style=\"font-size:1.1em; font-weight:600; color:#ff0000; margin-bottom:10px;\">No configurable variables found in GGcode.</div>\n      <div style=\"margin-top:10px; color:#ccc; font-size:0.98em;\">\n        <p>\n          <strong>How to add Configurator support:</strong>\n        </p>\n        <ul style=\"margin-left:1.2em; padding-left:0;\">\n          <li>\n            Add <code>/// @number min max</code> after a <code>let</code> variable to create a number input.<br>\n            Example: <code>let width = 10 /// @number 1 100 // Part width in mm</code>\n          </li>\n          <li>\n            Add <code>/// @check</code> for a checkbox (boolean).<br>\n            Example: <code>let enabled = 1 /// @check // Enable feature</code>\n          </li>\n          <li>\n            Add <code>/// @selction 1,2,3</code> for a dropdown with options.<br>\n            Example: <code>let mode = 2 /// @selction 1,2,3 // Select mode</code>\n          </li>\n          <li>\n            Add <code>/// @text rows [max N]</code> for a text input or textarea.<br>\n            Example: <code>let notes = \"\" /// @text 3 max 120 // Notes for operator</code>\n          </li>\n          <li>\n            To add a field title/description, append <code>// Title here</code> at the end of the line.\n          </li>\n        </ul>\n        <div style=\"margin-top:8px; color:#aaa; font-size:0.93em;\">\n          Example:<br>\n          <code>let speed = 1200 /// @number 500 3000 // Spindle speed (RPM)</code>\n        </div>\n        <div style=\"margin-top:14px; color:#b0b0b0; font-size:0.97em;\">\n          <strong>How to use the Configurator:</strong><br>\n          When you add variables with configurator tags, they will appear here for easy editing.<br>\n        </div>\n      </div>\n    </div>";
    }

    /**
     * Render the main configurator form
     * @param {Array} configVars - Array of configurator variables
     * @returns {string} HTML for the form
     * @private
     */
  }, {
    key: "_renderForm",
    value: function _renderForm(configVars) {
      var html = "\n      <div style=\"background:#23272e; box-shadow:0 2px 16px #0002; padding:18px 18px 8px 18px; max-width:38vw; margin:0 auto;\">\n        <div style=\"font-size:1.1em; font-weight:600; color:#fff; margin-bottom:10px;\">Configurator</div>\n        <div style=\"color:#ccc; font-size:0.98em; margin-bottom:12px;\">\n          <ul style=\"margin:0 0 0 1.2em; padding:0; list-style:disc;\">\n            <li>Edit variables below before compiling.</li>\n            <li>Numbers: range-limited. Checks: on/off. Select: preset options. Text: custom input.</li>\n          </ul>\n          <div style=\"margin-top:6px; color:#aaa; font-size:0.93em;\">\n            <div>\n              <strong>Press <span style=\"color:#fff;\">Save</span></strong> to save your changes and apply them to the GGcode source.<br>\n              Or just press <strong><span style=\"color:#fff;\">Compile</span></strong> to test the results only, without updating your main GGcode.\n            </div>\n          </div>\n        </div>\n        <form id=\"configuratorForm\" style=\"display:flex; flex-direction:column; gap:16px;\">";
      var _iterator = _createForOfIteratorHelper(configVars),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var variable = _step.value;
          html += this._renderFormField(variable);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      html += '</form>';
      html += '<hr style="border: none; border-top: 1px solid #333; margin: 18px 0 8px 0;">';
      html += '</div>';
      return html;
    }

    /**
     * Render a single form field based on variable type
     * @param {Object} variable - Variable configuration
     * @returns {string} HTML for the form field
     * @private
     */
  }, {
    key: "_renderFormField",
    value: function _renderFormField(variable) {
      var html = "<div style=\"display:flex; align-items:center; gap:8px; padding:4px 0;\">";
      html += "<label style=\"color:#e0e0e0; font-weight:500; font-size:0.9em; min-width:80px; text-align:right;\">".concat(variable.name, ":</label>");
      switch (variable.type) {
        case 'number':
          html += this._renderNumberField(variable);
          break;
        case 'check':
          html += this._renderCheckboxField(variable);
          break;
        case 'selection':
          html += this._renderSelectionField(variable);
          break;
        case 'text':
          html += this._renderTextField(variable);
          break;
        default:
          html += "<div style=\"color:#ff6b6b;\">Unknown field type: ".concat(variable.type, "</div>");
      }
      html += "</div>";
      return html;
    }

    /**
     * Render number input field
     * @param {Object} variable - Variable configuration
     * @returns {string} HTML for number field
     * @private
     */
  }, {
    key: "_renderNumberField",
    value: function _renderNumberField(variable) {
      var _variable$params$min, _variable$params$max;
      var inputStyles = "margin-left:0; width:140px; padding:6px 8px; border-radius:4px; border:1px solid #444; background:#181b20; color:#fff; font-size:0.9em; transition:border 0.2s; outline:none;";
      var focusBlurHandlers = "onfocus=\"this.style.borderColor='#0074D9'\" onblur=\"this.style.borderColor='#444'; if(this.value !== '' && !isNaN(this.value)) { this.value = Math.max(this.min, Math.min(this.max, this.value)); }\"";
      var numberInputHtml = "<input type=\"number\" title=\"".concat(variable.description, "\" name=\"").concat(variable.name, "\" value=\"").concat(variable.defaultValue, "\" min=\"").concat((_variable$params$min = variable.params.min) !== null && _variable$params$min !== void 0 ? _variable$params$min : '', "\" max=\"").concat((_variable$params$max = variable.params.max) !== null && _variable$params$max !== void 0 ? _variable$params$max : '', "\" style=\"").concat(inputStyles, "\" ").concat(focusBlurHandlers, ">");
      var minMaxHtml = '';
      if (variable.params.min !== undefined && variable.params.max !== undefined) {
        minMaxHtml = " <span style=\"color:#ffb347; font-size:0.85em; margin-left:6px;\">[".concat(variable.params.min, "-").concat(variable.params.max, "]</span>");
      }
      return "<div style=\"display:flex; align-items:center; gap:6px; flex:1;\">".concat(numberInputHtml).concat(minMaxHtml, "</div>");
    }

    /**
     * Render checkbox field
     * @param {Object} variable - Variable configuration
     * @returns {string} HTML for checkbox field
     * @private
     */
  }, {
    key: "_renderCheckboxField",
    value: function _renderCheckboxField(variable) {
      var checked = variable.defaultValue ? 'checked' : '';
      return "<div style=\"display:flex; align-items:center; gap:6px; flex:1;\">\n      <input title=\"".concat(variable.description, "\" type=\"checkbox\" name=\"").concat(variable.name, "\" ").concat(checked, " style=\"margin-left:0; width:18px; height:18px; accent-color:#0074D9;\">\n    </div>");
    }

    /**
     * Render selection dropdown field
     * @param {Object} variable - Variable configuration
     * @returns {string} HTML for selection field
     * @private
     */
  }, {
    key: "_renderSelectionField",
    value: function _renderSelectionField(variable) {
      var selectStyles = "margin-left:0; width:160px; padding:6px 8px; border-radius:4px; border:1px solid #444; background:#181b20; color:#fff; font-size:0.9em; transition:border 0.2s; outline:none;";
      var focusBlurHandlers = "onfocus=\"this.style.borderColor='#0074D9'\" onblur=\"this.style.borderColor='#444'\"";
      var html = "<div style=\"display:flex; align-items:center; gap:6px; flex:1;\">\n      <select title=\"".concat(variable.description, "\" name=\"").concat(variable.name, "\" style=\"").concat(selectStyles, "\" ").concat(focusBlurHandlers, ">");
      var _iterator2 = _createForOfIteratorHelper(variable.params.options || []),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var option = _step2.value;
          var selected = option == variable.defaultValue ? ' selected' : '';
          html += "<option value=\"".concat(option, "\"").concat(selected, ">").concat(option, "</option>");
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      html += "</select></div>";
      return html;
    }

    /**
     * Render text input or textarea field
     * @param {Object} variable - Variable configuration
     * @returns {string} HTML for text field
     * @private
     */
  }, {
    key: "_renderTextField",
    value: function _renderTextField(variable) {
      var baseStyles = "margin-left:0; padding:6px 8px; border-radius:4px; border:1px solid #444; background:#181b20; color:#fff; font-size:0.9em; transition:border 0.2s; outline:none;";
      var focusBlurHandlers = "onfocus=\"this.style.borderColor='#0074D9'\" onblur=\"this.style.borderColor='#444'\"";
      if (variable.params.rows && variable.params.rows > 1) {
        var _variable$params$max2;
        // Textarea for multi-line text
        var textareaStyles = "".concat(baseStyles, " width:100%; min-width:160px; max-width:100%; resize:vertical;");
        return "<div style=\"display:flex; align-items:flex-start; gap:6px; flex:1;\">\n        <textarea title=\"".concat(variable.description, "\" name=\"").concat(variable.name, "\" rows=\"").concat(variable.params.rows, "\" maxlength=\"").concat((_variable$params$max2 = variable.params.max) !== null && _variable$params$max2 !== void 0 ? _variable$params$max2 : '', "\" style=\"").concat(textareaStyles, "\" ").concat(focusBlurHandlers, ">").concat(variable.defaultValue, "</textarea>\n      </div>");
      } else {
        var _variable$params$max3;
        // Single-line text input
        var inputStyles = "".concat(baseStyles, " width:100%; min-width:160px; max-width:100%;");
        var html = "<div style=\"display:flex; align-items:center; gap:6px; flex:1;\">\n        <input type=\"text\" title=\"".concat(variable.description, "\" name=\"").concat(variable.name, "\" value=\"").concat(variable.defaultValue, "\" maxlength=\"").concat((_variable$params$max3 = variable.params.max) !== null && _variable$params$max3 !== void 0 ? _variable$params$max3 : '', "\" style=\"").concat(inputStyles, "\" ").concat(focusBlurHandlers, ">");
        if (variable.params.max) {
          html += " <span style=\"color:#888; font-size:0.85em;\">[max ".concat(variable.params.max, "]</span>");
        }
        html += "</div>";
        return html;
      }
    }

    /**
     * Create form validation styles
     * @returns {string} CSS styles for form validation
     */
  }, {
    key: "getValidationStyles",
    value: function getValidationStyles() {
      return "\n      .configurator-field-error {\n        border: 2px solid #ff6b6b !important;\n      }\n      .configurator-field-valid {\n        border: 1px solid #444 !important;\n      }\n      .configurator-error-message {\n        color: #ff6b6b;\n        font-size: 0.8em;\n        margin-top: 2px;\n      }\n    ";
    }

    /**
     * Render validation error message
     * @param {string} message - Error message
     * @returns {string} HTML for error message
     */
  }, {
    key: "renderErrorMessage",
    value: function renderErrorMessage(message) {
      return "<div class=\"configurator-error-message\">".concat(message, "</div>");
    }

    /**
     * Render success message
     * @param {string} message - Success message
     * @returns {string} HTML for success message
     */
  }, {
    key: "renderSuccessMessage",
    value: function renderSuccessMessage(message) {
      return "<div style=\"color:#51cf66; font-size:0.9em; padding:8px; background:#1a4d3a; border-radius:4px; margin:8px 0;\">\n      ".concat(message, "\n    </div>");
    }

    /**
     * Render loading indicator
     * @param {string} message - Loading message
     * @returns {string} HTML for loading indicator
     */
  }, {
    key: "renderLoadingIndicator",
    value: function renderLoadingIndicator() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Loading...';
      return "<div style=\"color:#aaa; padding:2em; text-align:center;\">\n      <div style=\"font-size:1.1em; margin-bottom:10px;\">".concat(message, "</div>\n      <div style=\"width:20px; height:20px; border:2px solid #444; border-top:2px solid #0074D9; border-radius:50%; animation:spin 1s linear infinite; margin:0 auto;\"></div>\n    </div>");
    }

    /**
     * Get CSS animations for the configurator
     * @returns {string} CSS animation styles
     */
  }, {
    key: "getAnimationStyles",
    value: function getAnimationStyles() {
      return "\n      @keyframes spin {\n        0% { transform: rotate(0deg); }\n        100% { transform: rotate(360deg); }\n      }\n      .configurator-fade-in {\n        animation: fadeIn 0.3s ease-in;\n      }\n      @keyframes fadeIn {\n        from { opacity: 0; }\n        to { opacity: 1; }\n      }\n    ";
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ConfiguratorRenderer);

/***/ }),

/***/ "./src/client/js/configurator/validator.js":
/*!*************************************************!*\
  !*** ./src/client/js/configurator/validator.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Configurator Form Validator
 * Handles validation of configurator form inputs and values
 */
var ConfiguratorValidator = /*#__PURE__*/function () {
  function ConfiguratorValidator() {
    _classCallCheck(this, ConfiguratorValidator);
  }
  return _createClass(ConfiguratorValidator, null, [{
    key: "validateForm",
    value:
    /**
     * Validate entire configurator form
     * @param {HTMLFormElement} form - Form element to validate
     * @param {Array} configVars - Array of configurator variables
     * @returns {Object} Validation result with isValid flag and errors
     */
    function validateForm(form, configVars) {
      var result = {
        isValid: true,
        errors: {},
        values: {}
      };
      if (!form || !configVars) {
        result.isValid = false;
        result.errors.general = 'Form or configuration variables not provided';
        return result;
      }

      // Create a map for quick variable lookup
      var varMap = {};
      var _iterator = _createForOfIteratorHelper(configVars),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var variable = _step.value;
          varMap[variable.name] = variable;
        }

        // Validate each form element
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var _iterator2 = _createForOfIteratorHelper(form.elements),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var element = _step2.value;
          if (!element.name) continue;
          var _variable2 = varMap[element.name];
          if (!_variable2) continue;
          var value = this._getElementValue(element);
          var validation = this.validateVariableValue(_variable2, value);
          result.values[element.name] = value;
          if (!validation.isValid) {
            result.isValid = false;
            result.errors[element.name] = validation.error;
            this._markElementAsInvalid(element, validation.error);
          } else {
            this._markElementAsValid(element);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return result;
    }

    /**
     * Validate a single variable value against its constraints
     * @param {Object} variable - Variable definition
     * @param {*} value - Value to validate
     * @returns {Object} Validation result with isValid and error message
     */
  }, {
    key: "validateVariableValue",
    value: function validateVariableValue(variable, value) {
      var result = {
        isValid: true,
        error: null
      };
      if (!variable) {
        result.isValid = false;
        result.error = 'Variable definition not found';
        return result;
      }
      switch (variable.type) {
        case 'number':
          return this._validateNumberValue(variable, value);
        case 'text':
          return this._validateTextValue(variable, value);
        case 'selection':
          return this._validateSelectionValue(variable, value);
        case 'check':
          return this._validateCheckValue(variable, value);
        default:
          result.isValid = false;
          result.error = "Unknown variable type: ".concat(variable.type);
      }
      return result;
    }

    /**
     * Validate number value
     * @param {Object} variable - Variable definition
     * @param {*} value - Value to validate
     * @returns {Object} Validation result
     * @private
     */
  }, {
    key: "_validateNumberValue",
    value: function _validateNumberValue(variable, value) {
      var result = {
        isValid: true,
        error: null
      };

      // Convert to number
      var numValue = parseFloat(value);
      if (isNaN(numValue)) {
        result.isValid = false;
        result.error = 'Must be a valid number';
        return result;
      }

      // Check minimum value
      if (variable.params.min !== undefined && numValue < variable.params.min) {
        result.isValid = false;
        result.error = "Must be at least ".concat(variable.params.min);
        return result;
      }

      // Check maximum value
      if (variable.params.max !== undefined && numValue > variable.params.max) {
        result.isValid = false;
        result.error = "Must be at most ".concat(variable.params.max);
        return result;
      }
      return result;
    }

    /**
     * Validate text value
     * @param {Object} variable - Variable definition
     * @param {*} value - Value to validate
     * @returns {Object} Validation result
     * @private
     */
  }, {
    key: "_validateTextValue",
    value: function _validateTextValue(variable, value) {
      var result = {
        isValid: true,
        error: null
      };
      var stringValue = String(value);

      // Check maximum length
      if (variable.params.max && stringValue.length > variable.params.max) {
        result.isValid = false;
        result.error = "Must be at most ".concat(variable.params.max, " characters");
        return result;
      }
      return result;
    }

    /**
     * Validate selection value
     * @param {Object} variable - Variable definition
     * @param {*} value - Value to validate
     * @returns {Object} Validation result
     * @private
     */
  }, {
    key: "_validateSelectionValue",
    value: function _validateSelectionValue(variable, value) {
      var result = {
        isValid: true,
        error: null
      };
      if (variable.params.options && !variable.params.options.includes(String(value))) {
        result.isValid = false;
        result.error = 'Must be one of the available options';
        return result;
      }
      return result;
    }

    /**
     * Validate checkbox value
     * @param {Object} variable - Variable definition
     * @param {*} value - Value to validate
     * @returns {Object} Validation result
     * @private
     */
  }, {
    key: "_validateCheckValue",
    value: function _validateCheckValue(_variable, _value) {
      // Boolean values are always valid
      return {
        isValid: true,
        error: null
      };
    }

    /**
     * Get value from form element based on its type
     * @param {HTMLElement} element - Form element
     * @returns {*} Element value
     * @private
     */
  }, {
    key: "_getElementValue",
    value: function _getElementValue(element) {
      if (element.type === 'checkbox') {
        return element.checked;
      }
      return element.value;
    }

    /**
     * Mark form element as invalid
     * @param {HTMLElement} element - Form element
     * @param {string} errorMessage - Error message
     * @private
     */
  }, {
    key: "_markElementAsInvalid",
    value: function _markElementAsInvalid(element, errorMessage) {
      element.classList.remove('configurator-field-valid');
      element.classList.add('configurator-field-error');
      element.style.border = '2px solid #ff6b6b';

      // Add or update error message
      this._updateErrorMessage(element, errorMessage);
    }

    /**
     * Mark form element as valid
     * @param {HTMLElement} element - Form element
     * @private
     */
  }, {
    key: "_markElementAsValid",
    value: function _markElementAsValid(element) {
      element.classList.remove('configurator-field-error');
      element.classList.add('configurator-field-valid');
      element.style.border = '1px solid #444';

      // Remove error message
      this._removeErrorMessage(element);
    }

    /**
     * Update error message for form element
     * @param {HTMLElement} element - Form element
     * @param {string} message - Error message
     * @private
     */
  }, {
    key: "_updateErrorMessage",
    value: function _updateErrorMessage(element, message) {
      var errorId = "error-".concat(element.name);
      var errorElement = document.getElementById(errorId);
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'configurator-error-message';
        errorElement.style.cssText = 'color:#ff6b6b; font-size:0.8em; margin-top:2px;';

        // Insert after the element's parent container
        var container = element.closest('div');
        if (container && container.parentNode) {
          container.parentNode.insertBefore(errorElement, container.nextSibling);
        }
      }
      errorElement.textContent = message;
    }

    /**
     * Remove error message for form element
     * @param {HTMLElement} element - Form element
     * @private
     */
  }, {
    key: "_removeErrorMessage",
    value: function _removeErrorMessage(element) {
      var errorId = "error-".concat(element.name);
      var errorElement = document.getElementById(errorId);
      if (errorElement) {
        errorElement.remove();
      }
    }

    /**
     * Validate form in real-time as user types
     * @param {HTMLFormElement} form - Form element
     * @param {Array} configVars - Array of configurator variables
     */
  }, {
    key: "setupRealTimeValidation",
    value: function setupRealTimeValidation(form, configVars) {
      var _this = this;
      if (!form || !configVars) return;

      // Create a map for quick variable lookup
      var varMap = {};
      var _iterator3 = _createForOfIteratorHelper(configVars),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var variable = _step3.value;
          varMap[variable.name] = variable;
        }

        // Add event listeners to form elements
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var _iterator4 = _createForOfIteratorHelper(form.elements),
        _step4;
      try {
        var _loop = function _loop() {
            var element = _step4.value;
            if (!element.name) return 0; // continue
            var variable = varMap[element.name];
            if (!variable) return 0; // continue

            // Add input event listener for real-time validation
            element.addEventListener('input', function () {
              var value = _this._getElementValue(element);
              var validation = _this.validateVariableValue(variable, value);
              if (!validation.isValid) {
                _this._markElementAsInvalid(element, validation.error);
              } else {
                _this._markElementAsValid(element);
              }
            });

            // Add blur event listener for final validation
            element.addEventListener('blur', function () {
              var value = _this._getElementValue(element);
              var validation = _this.validateVariableValue(variable, value);
              if (!validation.isValid) {
                _this._markElementAsInvalid(element, validation.error);
              } else {
                _this._markElementAsValid(element);
              }
            });

            // Special handling for number inputs
            if (element.type === 'number' && variable.type === 'number') {
              element.addEventListener('blur', function () {
                var value = parseFloat(element.value);
                if (!isNaN(value)) {
                  // Clamp value to min/max range
                  var min = variable.params.min !== undefined ? variable.params.min : -Infinity;
                  var max = variable.params.max !== undefined ? variable.params.max : Infinity;
                  var clampedValue = Math.max(min, Math.min(max, value));
                  if (clampedValue !== value) {
                    element.value = clampedValue;
                  }
                }
              });
            }
          },
          _ret;
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          _ret = _loop();
          if (_ret === 0) continue;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }

    /**
     * Clear all validation states from form
     * @param {HTMLFormElement} form - Form element
     */
  }, {
    key: "clearValidationStates",
    value: function clearValidationStates(form) {
      if (!form) return;
      var _iterator5 = _createForOfIteratorHelper(form.elements),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var element = _step5.value;
          if (!element.name) continue;
          element.classList.remove('configurator-field-error', 'configurator-field-valid');
          element.style.border = '';
          this._removeErrorMessage(element);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }

    /**
     * Get form values with type conversion
     * @param {HTMLFormElement} form - Form element
     * @param {Array} configVars - Array of configurator variables
     * @returns {Object} Form values with proper types
     */
  }, {
    key: "getFormValues",
    value: function getFormValues(form, configVars) {
      var values = {};
      if (!form || !configVars) return values;

      // Create a map for quick variable lookup
      var varMap = {};
      var _iterator6 = _createForOfIteratorHelper(configVars),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var variable = _step6.value;
          varMap[variable.name] = variable;
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      var _iterator7 = _createForOfIteratorHelper(form.elements),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var element = _step7.value;
          if (!element.name) continue;
          var _variable3 = varMap[element.name];
          var rawValue = this._getElementValue(element);
          if (_variable3) {
            // Convert value based on variable type
            switch (_variable3.type) {
              case 'number':
                values[element.name] = parseFloat(rawValue);
                break;
              case 'check':
                values[element.name] = rawValue ? 1 : 0;
                break;
              default:
                values[element.name] = rawValue;
            }
          } else {
            values[element.name] = rawValue;
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      return values;
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ConfiguratorValidator);

/***/ }),

/***/ "./src/client/js/core/applicationManager.js":
/*!**************************************************!*\
  !*** ./src/client/js/core/applicationManager.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _editor_monaco_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../editor/monaco.js */ "./src/client/js/editor/monaco.js");
/* harmony import */ var _editor_annotations_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../editor/annotations.js */ "./src/client/js/editor/annotations.js");
/* harmony import */ var _configurator_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../configurator/index.js */ "./src/client/js/configurator/index.js");
/* harmony import */ var _visualizer_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../visualizer/index.js */ "./src/client/js/visualizer/index.js");
/* harmony import */ var _ui_navigation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ui/navigation.js */ "./src/client/js/ui/navigation.js");
/* harmony import */ var _ui_aiManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ui/aiManager.js */ "./src/client/js/ui/aiManager.js");
/* harmony import */ var _ui_aiCommands_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ui/aiCommands.js */ "./src/client/js/ui/aiCommands.js");
/* harmony import */ var _ui_helpSystem_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ui/helpSystem.js */ "./src/client/js/ui/helpSystem.js");
/* harmony import */ var _ui_exampleManager_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ui/exampleManager.js */ "./src/client/js/ui/exampleManager.js");
/* harmony import */ var _ui_fileOperations_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../ui/fileOperations.js */ "./src/client/js/ui/fileOperations.js");
/* harmony import */ var _compilationSystem_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./compilationSystem.js */ "./src/client/js/core/compilationSystem.js");
/* harmony import */ var _ui_modalManager_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../ui/modalManager.js */ "./src/client/js/ui/modalManager.js");
/* harmony import */ var _config_configuratorSystem_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../config/configuratorSystem.js */ "./src/client/js/config/configuratorSystem.js");
/* harmony import */ var _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/storageManager.js */ "./src/client/js/utils/storageManager.js");
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
 * Application Manager Module
 * Coordinates all application modules and provides the main entry point
 */















var ApplicationManager = /*#__PURE__*/function () {
  function ApplicationManager() {
    _classCallCheck(this, ApplicationManager);
    this.editorManager = null;
    this.annotationSystem = null;
    this.configuratorManager = null;
    this.visualizerModules = null;
    this.navigationManager = null;
    this.helpSystem = null;
    this.exampleManager = null;
    this.fileOperationsManager = null;
    this.compilationSystem = null;
    this.modalManager = null;
    this.configuratorSystem = null;

    // Legacy global variables for backward compatibility
    this.monacoReady = false;
    this.lastOpenedFilename = '';

    // Track monaco ready state for deferred setting on CompilationSystem
    this.pendingMonacoReady = false;
  }

  /**
   * Initialize all application modules
   */
  return _createClass(ApplicationManager, [{
    key: "initializeApplication",
    value: (function () {
      var _initializeApplication = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              // Initialize managers
              this.editorManager = new _editor_monaco_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
              this.annotationSystem = new _editor_annotations_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
              this.configuratorManager = new _configurator_index_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
              this.visualizerModules = _visualizer_index_js__WEBPACK_IMPORTED_MODULE_3__;
              this.navigationManager = new _ui_navigation_js__WEBPACK_IMPORTED_MODULE_4__["default"]();

              // Initialize UI managers
              this.modalManager = new _ui_modalManager_js__WEBPACK_IMPORTED_MODULE_11__["default"]();
              this.helpSystem = null; // Will be initialized when API manager is set
              this.exampleManager = null; // Will be initialized when API manager is set
              this.fileOperationsManager = new _ui_fileOperations_js__WEBPACK_IMPORTED_MODULE_9__["default"]();
              this.compilationSystem = null; // Will be initialized when API manager is set
              this.configuratorSystem = new _config_configuratorSystem_js__WEBPACK_IMPORTED_MODULE_12__["default"](this.configuratorManager, this.editorManager);

              // Initialize AI modules
              _ui_aiManager_js__WEBPACK_IMPORTED_MODULE_5__["default"].initialize();

              // Make managers globally available for the functions
              this.makeManagersGloballyAvailable();

              // Load saved filename
              this.lastOpenedFilename = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_13__["default"].getLastFilename();

              // Initialize annotation system
              _context.n = 1;
              return this.annotationSystem.initialize();
            case 1:
              // Initialize configurator
              this.configuratorSystem.initialize({
                modalId: 'configuratorModal',
                contentId: 'configuratorContent'
              });

              // Initialize Monaco editor
              _context.n = 2;
              return this.initializeMonacoEditor();
            case 2:
              // Setup auto-compile checkbox
              this.setupAutoCompileCheckbox();

              // Setup file operations
              this.setupFileOperations();
            case 3:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function initializeApplication() {
        return _initializeApplication.apply(this, arguments);
      }
      return initializeApplication;
    }()
    /**
     * Initialize Monaco editor with modular approach
     */
    )
  }, {
    key: "initializeMonacoEditor",
    value: (function () {
      var _initializeMonacoEditor = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var _this = this;
        var initialInput, initialOutput, editors;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              // Load saved content
              initialInput = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_13__["default"].getInputContent();
              initialOutput = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_13__["default"].getOutputContent();
              _context2.n = 1;
              return this.editorManager.initialize({
                inputContainerId: 'editor',
                outputContainerId: 'output',
                initialInput: initialInput,
                initialOutput: initialOutput,
                onCompile: function onCompile(event, customCode) {
                  if (_this.compilationSystem) {
                    return _this.compilationSystem.submitGGcode(event, customCode);
                  } else {
                    console.warn('CompilationSystem not available for compile callback');
                    return false;
                  }
                },
                onAnnotationUpdate: function onAnnotationUpdate(lineNumber, lineContent) {
                  return _this.updateAnnotations(lineNumber, lineContent);
                }
              });
            case 1:
              // Set up backward compatibility
              editors = this.editorManager.getEditors();
              window.outputEditor = editors.output;
              window.editor = editors.input;
              this.monacoReady = true;
              if (this.compilationSystem) {
                this.compilationSystem.setMonacoReady(true);
              } else {
                this.pendingMonacoReady = true;
              }

              // Load auto-compile state
              this.editorManager.loadAutoCompileState();

              // Load last opened filename
              this.lastOpenedFilename = this.editorManager.loadLastOpenedFilename();

              // Setup auto-save
              this.editorManager.setupAutoSave();
            case 2:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function initializeMonacoEditor() {
        return _initializeMonacoEditor.apply(this, arguments);
      }
      return initializeMonacoEditor;
    }()
    /**
     * Setup auto-compile checkbox functionality
     */
    )
  }, {
    key: "setupAutoCompileCheckbox",
    value: function setupAutoCompileCheckbox() {
      var _this2 = this;
      var autoCheckbox = document.getElementById('autoCompileCheckbox');
      if (autoCheckbox) {
        autoCheckbox.checked = this.editorManager ? this.editorManager.loadAutoCompileState() : false;
        autoCheckbox.addEventListener('change', function (e) {
          if (_this2.editorManager) {
            _this2.editorManager.setAutoCompile(e.target.checked);
          }
        });
      }
    }

    /**
     * Setup file operations
     */
  }, {
    key: "setupFileOperations",
    value: function setupFileOperations() {
      var _this3 = this;
      var openBtn = document.getElementById('openGGcodeBtn');
      var fileInput = document.getElementById('ggcodeFileInput');
      if (openBtn && fileInput) {
        openBtn.addEventListener('click', function () {
          fileInput.value = '';
          fileInput.click();
        });
        fileInput.addEventListener('change', function (e) {
          var file = e.target.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function (evt) {
            if (_this3.editorManager) {
              _this3.editorManager.setInputValue(evt.target.result);
              _this3.editorManager.setLastOpenedFilename(file.name || '');
              _this3.lastOpenedFilename = file.name || '';
              if (_this3.compilationSystem) {
                _this3.compilationSystem.submitGGcode(new Event('submit'));
              } else {
                // Fallback to global submitGGcode if compilationSystem not ready
                if (window.submitGGcode) {
                  window.submitGGcode(new Event('submit'));
                }
              }
            }
          };
          reader.readAsText(file);
        });
      }
    }

    /**
     * Update annotations
     */
  }, {
    key: "updateAnnotations",
    value: function updateAnnotations(lineNumber, lineContent) {
      if (this.annotationSystem) {
        var editors = this.editorManager ? this.editorManager.getEditors() : {
          output: window.outputEditor
        };
        this.annotationSystem.updateAnnotations(lineNumber, lineContent, editors.output);
      }
    }

    /**
     * Make managers globally available for backward compatibility
     */
  }, {
    key: "makeManagersGloballyAvailable",
    value: function makeManagersGloballyAvailable() {
      window.editorManager = this.editorManager;
      window.apiManager = {}; // This should be passed from main.js
      window.configuratorManager = this.configuratorManager;
      window.visualizerModules = this.visualizerModules;
      window.navigationManager = this.navigationManager;
      window.aiManager = _ui_aiManager_js__WEBPACK_IMPORTED_MODULE_5__["default"];
      window.aiCommands = _ui_aiCommands_js__WEBPACK_IMPORTED_MODULE_6__["default"];
    }

    /**
     * Set API manager reference
     */
  }, {
    key: "setApiManager",
    value: function setApiManager(apiManager) {
      this.apiManager = apiManager;

      // Initialize modules that depend on API manager
      this.helpSystem = new _ui_helpSystem_js__WEBPACK_IMPORTED_MODULE_7__["default"](apiManager);
      this.exampleManager = new _ui_exampleManager_js__WEBPACK_IMPORTED_MODULE_8__["default"](apiManager, this.editorManager);
      this.compilationSystem = new _compilationSystem_js__WEBPACK_IMPORTED_MODULE_10__["default"](apiManager, this.editorManager, this.annotationSystem);
      this.configuratorSystem = new _config_configuratorSystem_js__WEBPACK_IMPORTED_MODULE_12__["default"](this.configuratorManager, this.editorManager);

      // Apply any pending monaco ready state to newly initialized CompilationSystem
      if (this.pendingMonacoReady && this.compilationSystem) {
        console.log('Applying pending monaco ready state to CompilationSystem');
        this.compilationSystem.setMonacoReady(true);
        this.pendingMonacoReady = false;
      }

      // Update global reference
      window.apiManager = apiManager;
    }

    /**
     * Getters for external access
     */
  }, {
    key: "getEditorManager",
    value: function getEditorManager() {
      return this.editorManager;
    }
  }, {
    key: "getAnnotationSystem",
    value: function getAnnotationSystem() {
      return this.annotationSystem;
    }
  }, {
    key: "getConfiguratorManager",
    value: function getConfiguratorManager() {
      return this.configuratorManager;
    }
  }, {
    key: "getHelpSystem",
    value: function getHelpSystem() {
      if (!this.helpSystem && this.apiManager) {
        this.helpSystem = new _ui_helpSystem_js__WEBPACK_IMPORTED_MODULE_7__["default"](this.apiManager);
      }
      return this.helpSystem;
    }
  }, {
    key: "getExampleManager",
    value: function getExampleManager() {
      if (!this.exampleManager && this.apiManager && this.editorManager) {
        this.exampleManager = new _ui_exampleManager_js__WEBPACK_IMPORTED_MODULE_8__["default"](this.apiManager, this.editorManager);
      }
      return this.exampleManager;
    }
  }, {
    key: "getFileOperationsManager",
    value: function getFileOperationsManager() {
      return this.fileOperationsManager;
    }
  }, {
    key: "getCompilationSystem",
    value: function getCompilationSystem() {
      if (!this.compilationSystem && this.apiManager && this.editorManager && this.annotationSystem) {
        this.compilationSystem = new _compilationSystem_js__WEBPACK_IMPORTED_MODULE_10__["default"](this.apiManager, this.editorManager, this.annotationSystem);
      }
      return this.compilationSystem;
    }
  }, {
    key: "getModalManager",
    value: function getModalManager() {
      return this.modalManager;
    }
  }, {
    key: "getConfiguratorSystem",
    value: function getConfiguratorSystem() {
      return this.configuratorSystem;
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ApplicationManager);

/***/ }),

/***/ "./src/client/js/core/compilationSystem.js":
/*!*************************************************!*\
  !*** ./src/client/js/core/compilationSystem.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
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
 * Compilation System Module
 * Handles GGcode compilation and loading indicators
 */
var CompilationSystem = /*#__PURE__*/function () {
  function CompilationSystem(apiManager, editorManager, annotationSystem) {
    _classCallCheck(this, CompilationSystem);
    this.apiManager = apiManager;
    this.editorManager = editorManager;
    this.annotationSystem = annotationSystem;
    this.monacoReady = false;
  }

  /**
   * Set Monaco ready state
   */
  return _createClass(CompilationSystem, [{
    key: "setMonacoReady",
    value: function setMonacoReady(ready) {
      this.monacoReady = ready;
      console.log('CompilationSystem: Monaco ready state set to:', ready);
    }

    /**
     * Submit GGcode for compilation
     */
  }, {
    key: "submitGGcode",
    value: (function () {
      var _submitGGcode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(event) {
        var customCode,
          code,
          result,
          editors,
          firstLineContent,
          _args = arguments,
          _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              customCode = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
              if (event) event.preventDefault();
              this.syncEditors();
              code = customCode || this.editorManager.getInputValue();
              if (this.editorManager) {
                this.editorManager.setOutputValue('Compiling...');
              }
              _context.p = 1;
              _context.n = 2;
              return this.apiManager.compiler.compile(code);
            case 2:
              result = _context.v;
              if (result.success) {
                if (this.editorManager) {
                  this.editorManager.setOutputValue(result.output);

                  // Reset annotation modal state when new G-code is loaded
                  if (this.annotationSystem) {
                    this.annotationSystem.resetModalState();
                  }

                  // Trigger annotation for first line if content exists
                  if (result.output.trim()) {
                    editors = this.editorManager.getEditors();
                    if (editors.output) {
                      firstLineContent = editors.output.getModel().getLineContent(1);
                      if (window.updateAnnotations) {
                        window.updateAnnotations(1, firstLineContent);
                      }
                    }
                  }
                }
                if (window.saveContent) {
                  window.saveContent();
                }
              } else {
                if (this.editorManager) {
                  this.editorManager.setOutputValue(result.error);
                }
              }
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              if (this.editorManager) {
                this.editorManager.setOutputValue('Network error: ' + _t.message);
              }
            case 4:
              return _context.a(2, false);
          }
        }, _callee, this, [[1, 3]]);
      }));
      function submitGGcode(_x) {
        return _submitGGcode.apply(this, arguments);
      }
      return submitGGcode;
    }()
    /**
     * Sync editors (legacy function for backward compatibility)
     */
    )
  }, {
    key: "syncEditors",
    value: function syncEditors() {
      if (this.editorManager) {
        var ggcodeElement = document.getElementById('ggcode');
        if (ggcodeElement) {
          ggcodeElement.value = this.editorManager.getInputValue();
        }
      }
    }

    /**
     * Show/hide compile loading indicator
     */
  }, {
    key: "showCompileLoadingIndicator",
    value: function showCompileLoadingIndicator(show) {
      // Create or find compile loading indicator element
      var compileIndicator = document.getElementById('compileLoadingIndicator');
      if (show) {
        if (!compileIndicator) {
          // Create compile loading indicator if it doesn't exist
          compileIndicator = document.createElement('div');
          compileIndicator.id = 'compileLoadingIndicator';
          compileIndicator.style.cssText = "\n                    position: fixed;\n                    top: 50%;\n                    left: 50%;\n                    transform: translate(-50%, -50%);\n                    background: rgba(0, 0, 0, 0.9);\n                    color: white;\n                    padding: 20px 30px;\n                    border-radius: 10px;\n                    font-family: monospace;\n                    font-size: 14px;\n                    text-align: center;\n                    z-index: 1000;\n                    border: 2px solid #007acc;\n                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);\n                    min-width: 200px;\n                ";

          // Add loading animation
          compileIndicator.innerHTML = "\n                    <div style=\"margin-bottom: 10px; font-weight: bold;\">Compiling GGcode...</div>\n                    <div style=\"display: inline-block; width: 20px; height: 20px; border: 3px solid #ffffff; border-radius: 50%; border-top-color: #007acc; animation: spin 1s ease-in-out infinite; margin: 0 auto;\"></div>\n                    <div id=\"compileStatus\" style=\"margin-top: 10px; font-size: 12px; color: #ccc;\">Processing...</div>\n                    <style>\n                        @keyframes spin {\n                            to { transform: rotate(360deg); }\n                        }\n                    </style>\n                ";
          document.body.appendChild(compileIndicator);
        }
        compileIndicator.style.display = 'block';
        //console.log('Showing compile loading indicator');
      } else {
        if (compileIndicator) {
          compileIndicator.style.display = 'none';
          // Remove after fade out
          setTimeout(function () {
            if (compileIndicator.parentNode) {
              compileIndicator.parentNode.removeChild(compileIndicator);
            }
          }, 300);
        }
        //console.log('Hiding compile loading indicator');
      }
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CompilationSystem);

/***/ }),

/***/ "./src/client/js/editor/annotations.js":
/*!*********************************************!*\
  !*** ./src/client/js/editor/annotations.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
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
 * G-code Annotation System
 * Handles parsing and generation of G-code annotations and modal state tracking
 */
var GcodeAnnotationSystem = /*#__PURE__*/function () {
  function GcodeAnnotationSystem() {
    _classCallCheck(this, GcodeAnnotationSystem);
    this.millDictionary = {};
    this.millAnnotations = {};
    this.annotationsLoaded = false;
    this.lastGCommand = null;
  }

  /**
   * Initialize the annotation system by loading dictionaries
   */
  return _createClass(GcodeAnnotationSystem, [{
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.loadGcodeDictionaries();
            case 1:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * Load G-code dictionaries from server
     */
    )
  }, {
    key: "loadGcodeDictionaries",
    value: (function () {
      var _loadGcodeDictionaries = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var _yield$Promise$all, _yield$Promise$all2, dictResponse, annotResponse, _t;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return Promise.all([fetch('/mill-dictionary.json'), fetch('/mill-annotations.json')]);
            case 1:
              _yield$Promise$all = _context2.v;
              _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
              dictResponse = _yield$Promise$all2[0];
              annotResponse = _yield$Promise$all2[1];
              if (!(dictResponse.ok && annotResponse.ok)) {
                _context2.n = 4;
                break;
              }
              _context2.n = 2;
              return dictResponse.json();
            case 2:
              this.millDictionary = _context2.v;
              _context2.n = 3;
              return annotResponse.json();
            case 3:
              this.millAnnotations = _context2.v;
              this.annotationsLoaded = true;
              //console.log('G-code dictionaries loaded successfully');
              _context2.n = 5;
              break;
            case 4:
              console.error('Failed to load G-code dictionaries');
            case 5:
              _context2.n = 7;
              break;
            case 6:
              _context2.p = 6;
              _t = _context2.v;
              console.error('Error loading G-code dictionaries:', _t);
            case 7:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 6]]);
      }));
      function loadGcodeDictionaries() {
        return _loadGcodeDictionaries.apply(this, arguments);
      }
      return loadGcodeDictionaries;
    }()
    /**
     * Check if a command is a motion command
     * @param {string} cmd - Command to check
     * @returns {boolean} True if motion command
     */
    )
  }, {
    key: "isMotionCmd",
    value: function isMotionCmd(cmd) {
      return /^G(?:0|1|2|3|33|38\.2|38\.3|38\.4|38\.5|80|81|82|83|85|86|89)$/i.test(cmd);
    }

    /**
     * Check if parameters contain motion-relevant coordinates
     * @param {Object} params - Parameters object
     * @returns {boolean} True if has motion coordinates
     */
  }, {
    key: "hasMotionCoords",
    value: function hasMotionCoords(params) {
      for (var _i = 0, _Object$keys = Object.keys(params); _i < _Object$keys.length; _i++) {
        var k = _Object$keys[_i];
        if (/[XYZIJKRABCUVW]/.test(k)) return true;
      }
      return false;
    }

    /**
     * Get all G-code lines from editor
     * @param {Object} outputEditor - Monaco output editor instance
     * @returns {Array} Array of G-code lines
     */
  }, {
    key: "getAllGcodeLines",
    value: function getAllGcodeLines(outputEditor) {
      if (outputEditor && typeof outputEditor.getValue === 'function') {
        return outputEditor.getValue().split(/\r?\n/);
      }
      var out = document.getElementById('output');
      return out ? out.textContent.split(/\r?\n/) : [];
    }

    /**
     * Find last motion G command before a given line number
     * @param {number} lineNumber - 1-based line number
     * @param {Object} outputEditor - Monaco output editor instance
     * @returns {Object} Object with cmd and line properties
     */
  }, {
    key: "findPreviousMotion",
    value: function findPreviousMotion(lineNumber, outputEditor) {
      var _this = this;
      var lines = this.getAllGcodeLines(outputEditor);
      var targetIdx = Math.max(0, (lineNumber | 0) - 2);
      for (var i = targetIdx; i >= 0; i--) {
        var parsed = this.parseGcodeLine(lines[i]);
        if (!parsed || !parsed.commands || !parsed.commands.length) continue;
        var motions = parsed.commands.filter(function (cmd) {
          return _this.isMotionCmd(cmd);
        });
        if (motions.length) {
          return {
            cmd: motions[motions.length - 1],
            line: i + 1
          };
        }
      }
      return {
        cmd: null,
        line: null
      };
    }

    /**
     * Parse a G-code line to extract commands and parameters
     * @param {string} line - G-code line to parse
     * @returns {Object|null} Parsed line object or null
     */
  }, {
    key: "parseGcodeLine",
    value: function parseGcodeLine(line) {
      if (!line || typeof line !== 'string') return null;

      // Remove comments and trim
      var cleanLine = line.split('//')[0].split('(')[0].trim();
      if (!cleanLine) return null;

      // Extract ALL commands (G, M codes) from the line
      var commandMatches = cleanLine.matchAll(/([GM])(\d+)/gi);
      var commands = [];
      var commandsUsed = new Set();
      var _iterator = _createForOfIteratorHelper(commandMatches),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var match = _step.value;
          var cmd = (match[1] + match[2]).toUpperCase();
          commands.push(cmd);
          commandsUsed.add(match[0].toUpperCase());
        }

        // Update last G command if this line has any G commands
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var gCommands = commands.filter(function (cmd) {
        return cmd.startsWith('G');
      });

      // Handle modal behavior - if no commands but has motion coordinates, use last G command
      var primaryCommand = null;
      if (commands.length > 0) {
        primaryCommand = gCommands.length > 0 ? gCommands[gCommands.length - 1] : commands[0];
      } else if (cleanLine.match(/[XYZ]/i)) {
        primaryCommand = this.lastGCommand;
      }

      // Extract all parameters (letter followed by number/value, including negative)
      var paramMatches = cleanLine.matchAll(/([A-Z])([+-]?\d*\.?\d+)/gi);
      var parameters = {};
      var _iterator2 = _createForOfIteratorHelper(paramMatches),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _match = _step2.value;
          var letter = _match[1].toUpperCase();
          var value = _match[2];
          var fullMatch = _match[0].toUpperCase();

          // Skip if this is part of a command (like G1, M3)
          if (!commandsUsed.has(fullMatch)) {
            parameters[letter] = value;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return {
        original: line,
        commands: commands,
        primaryCommand: primaryCommand,
        parameters: parameters,
        cleanLine: cleanLine,
        isModal: commands.length === 0 && primaryCommand,
        hasParams: Object.keys(parameters).length > 0,
        hasMultipleCommands: commands.length > 1
      };
    }

    /**
     * Generate enhanced annotation for G-code line
     * @param {number} lineNumber - Line number (1-based)
     * @param {string} lineContent - Content of the line
     * @param {Object} outputEditor - Monaco output editor instance
     * @returns {string} HTML annotation
     */
  }, {
    key: "generateAnnotation",
    value: function generateAnnotation(lineNumber, lineContent) {
      var outputEditor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (!this.annotationsLoaded) {
        return "<div class=\"annotation-loading\">Loading G-code dictionaries...</div>";
      }
      var parsed = this.parseGcodeLine(lineContent);

      // Check if parsing failed first
      if (!parsed) {
        return "<div class=\"annotation-simple\">\n        <strong>Line ".concat(lineNumber, ":</strong> ").concat(lineContent || '(empty line)', "\n        <br><em>No G-code content detected</em>\n      </div>");
      }

      // If line has coords but no explicit G, find implied motion from above
      var implied = null;
      if (!parsed.primaryCommand && parsed.parameters && this.hasMotionCoords(parsed.parameters)) {
        var prev = this.findPreviousMotion(lineNumber, outputEditor);
        if (prev.cmd) {
          parsed.primaryCommand = prev.cmd.toUpperCase();
          parsed.isModal = true;
          implied = prev;
        }
      }
      if (!parsed.primaryCommand && !parsed.hasParams && (!parsed.commands || parsed.commands.length === 0)) {
        return "<div class=\"annotation-simple\">\n        <strong>Line ".concat(lineNumber, ":</strong> ").concat(lineContent, "\n        <br><em>No G-code command or parameters detected</em>\n      </div>");
      }
      var annotation = '';

      // Build annotation header
      annotation += "<div class=\"annotation-header\">";
      annotation += "<strong>Line ".concat(lineNumber, ":</strong> ");
      if (parsed.commands.length > 0) {
        if (parsed.hasMultipleCommands) {
          annotation += "Multiple Commands (".concat(parsed.commands.length, ")");
          if (parsed.isModal) {
            annotation += " <span class=\"modal-indicator\">(Modal)</span>";
          }
        } else {
          // Single command
          var cmd = parsed.primaryCommand || parsed.commands[0];
          var cmdDesc = '';
          if (cmd) {
            if (this.millDictionary[cmd]) {
              cmdDesc = typeof this.millDictionary[cmd] === 'string' ? this.millDictionary[cmd] : this.millDictionary[cmd].desc || '';
            } else if (this.millAnnotations[cmd]) {
              cmdDesc = this.millAnnotations[cmd];
            }
          }
          annotation += "".concat(cmd || 'Unknown', " - ").concat(cmdDesc || 'Unknown command');
          if (parsed.isModal) {
            annotation += " <span class=\"modal-indicator\">(Implied</span>";
            if (implied && implied.line != null) {
              annotation += " <span class=\"modal-indicator\">from line ".concat(implied.line, "</span>");
            }
            annotation += "<span class=\"modal-indicator\">)</span>";
          }
        }
      } else {
        if (parsed.primaryCommand) {
          annotation += "Implied ".concat(parsed.primaryCommand);
          if (implied && implied.line != null) {
            annotation += " <span class=\"modal-indicator\">(from line ".concat(implied.line, ")</span>");
          } else {
            annotation += " <span class=\"modal-indicator\">(modal)</span>";
          }
        } else {
          annotation += "Parameters only";
          if (parsed.hasParams) {
            annotation += " <span class=\"modal-indicator\">(no prior motion found)</span>";
          }
        }
      }
      annotation += "</div>";

      // Add command details for multiple commands
      if (parsed.hasMultipleCommands) {
        annotation += "<div class=\"annotation-commands\">";
        var _iterator3 = _createForOfIteratorHelper(parsed.commands),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _cmd = _step3.value;
            var _cmdDesc = '';
            if (this.millDictionary[_cmd]) {
              if (typeof this.millDictionary[_cmd] === 'string') {
                _cmdDesc = this.millDictionary[_cmd];
              } else if (this.millDictionary[_cmd].desc) {
                _cmdDesc = this.millDictionary[_cmd].desc;
              }
            } else if (this.millAnnotations[_cmd]) {
              _cmdDesc = this.millAnnotations[_cmd];
            }
            annotation += "<div class=\"annotation-command\">";
            annotation += "<span class=\"command-name\">".concat(_cmd, ":</span> ");
            annotation += "<span class=\"command-desc\">".concat(_cmdDesc || 'Unknown command', "</span>");
            annotation += "</div>";
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        annotation += "</div>";
      }

      // Add parameter details
      if (Object.keys(parsed.parameters).length > 0) {
        annotation += "<div class=\"annotation-params\">";
        for (var _i2 = 0, _Object$entries = Object.entries(parsed.parameters); _i2 < _Object$entries.length; _i2++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
            param = _Object$entries$_i[0],
            value = _Object$entries$_i[1];
          var paramDesc = "".concat(param, "-Axis Motion");

          // Get parameter description from dictionary
          if (parsed.primaryCommand && this.millDictionary[parsed.primaryCommand] && this.millDictionary[parsed.primaryCommand].sub && this.millDictionary[parsed.primaryCommand].sub[param]) {
            paramDesc = this.millDictionary[parsed.primaryCommand].sub[param];
          } else if (this.millDictionary[param]) {
            paramDesc = typeof this.millDictionary[param] === 'string' ? this.millDictionary[param] : this.millDictionary[param].desc || paramDesc;
          }
          annotation += "<div class=\"annotation-param\">";
          annotation += "<span class=\"param-name\">".concat(paramDesc, ":</span> ");
          annotation += "<span class=\"param-value\">".concat(value, "</span>");
          annotation += "</div>";
        }
        annotation += "</div>";
      }

      // Add raw line for reference
      annotation += "<div class=\"annotation-raw\">";
      annotation += "<em>Raw: ".concat(lineContent, "</em>");
      annotation += "</div>";
      return annotation;
    }

    /**
     * Update annotations display
     * @param {number} lineNumber - Line number (1-based)
     * @param {string} lineContent - Content of the line
     * @param {Object} outputEditor - Monaco output editor instance
     */
  }, {
    key: "updateAnnotations",
    value: function updateAnnotations(lineNumber, lineContent) {
      var outputEditor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var annotationsDiv = document.getElementById('annotations');
      if (!annotationsDiv) return;
      var annotation = this.generateAnnotation(lineNumber, lineContent, outputEditor);
      annotationsDiv.innerHTML = annotation;
    }

    /**
     * Reset modal state (call when new G-code is loaded)
     */
  }, {
    key: "resetModalState",
    value: function resetModalState() {
      this.lastGCommand = null;
    }

    /**
     * Get current modal state
     * @returns {Object} Current modal state
     */
  }, {
    key: "getModalState",
    value: function getModalState() {
      return {
        lastGCommand: this.lastGCommand
      };
    }

    /**
     * Set modal state
     * @param {Object} state - Modal state to set
     */
  }, {
    key: "setModalState",
    value: function setModalState(state) {
      if (state.lastGCommand !== undefined) {
        this.lastGCommand = state.lastGCommand;
      }
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GcodeAnnotationSystem);

/***/ }),

/***/ "./src/client/js/editor/monaco.js":
/*!****************************************!*\
  !*** ./src/client/js/editor/monaco.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/storageManager.js */ "./src/client/js/utils/storageManager.js");
/* harmony import */ var _themes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./themes.js */ "./src/client/js/editor/themes.js");
/* harmony import */ var _settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./settings.js */ "./src/client/js/editor/settings.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
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
 * Monaco Editor Manager
 * Handles Monaco editor initialization, configuration, and management
 */




var MonacoEditorManager = /*#__PURE__*/function () {
  function MonacoEditorManager() {
    _classCallCheck(this, MonacoEditorManager);
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
      millAnnotations: null
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
  return _createClass(MonacoEditorManager, [{
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var _this = this;
        var options,
          _options$inputContain,
          inputContainerId,
          _options$outputContai,
          outputContainerId,
          _options$initialInput,
          initialInput,
          _options$initialOutpu,
          initialOutput,
          _options$onCompile,
          onCompile,
          _options$onAnnotation,
          onAnnotationUpdate,
          _args2 = arguments;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              _options$inputContain = options.inputContainerId, inputContainerId = _options$inputContain === void 0 ? 'editor' : _options$inputContain, _options$outputContai = options.outputContainerId, outputContainerId = _options$outputContai === void 0 ? 'output' : _options$outputContai, _options$initialInput = options.initialInput, initialInput = _options$initialInput === void 0 ? '' : _options$initialInput, _options$initialOutpu = options.initialOutput, initialOutput = _options$initialOutpu === void 0 ? '' : _options$initialOutpu, _options$onCompile = options.onCompile, onCompile = _options$onCompile === void 0 ? null : _options$onCompile, _options$onAnnotation = options.onAnnotationUpdate, onAnnotationUpdate = _options$onAnnotation === void 0 ? null : _options$onAnnotation; // Always check for global Monaco first (works for both webpack and AMD loading)
              return _context3.a(2, new Promise(function (resolve, reject) {
                var initializeEditor = /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
                    var _t;
                    return _regenerator().w(function (_context2) {
                      while (1) switch (_context2.p = _context2.n) {
                        case 0:
                          _context2.p = 0;
                          _context2.n = 1;
                          return _this._loadCompletionData();
                        case 1:
                          _context2.n = 2;
                          return _themes_js__WEBPACK_IMPORTED_MODULE_1__["default"].loadAndInitializeTheme();
                        case 2:
                          // Load theme BEFORE language registration for proper syntax highlighting
                          _this._registerGGcodeLanguage();
                          _this._createEditors(inputContainerId, outputContainerId, initialInput, initialOutput);
                          _this._setupEventHandlers(onCompile, onAnnotationUpdate);
                          _this._setupDragAndDrop();
                          _this.monacoReady = true;
                          // Parse user functions from initial content
                          _this._parseUserFunctions();

                          //console.log('MonacoEditorManager: Initialization complete!');
                          resolve();
                          _context2.n = 4;
                          break;
                        case 3:
                          _context2.p = 3;
                          _t = _context2.v;
                          console.error('MonacoEditorManager: Initialization failed:', _t);
                          reject(_t);
                        case 4:
                          return _context2.a(2);
                      }
                    }, _callee, null, [[0, 3]]);
                  }));
                  return function initializeEditor() {
                    return _ref.apply(this, arguments);
                  };
                }();

                // Check if Monaco is already available globally
                if (typeof window.monaco !== 'undefined') {
                  //console.log('MonacoEditorManager: Monaco already available globally');
                  initializeEditor();
                } else {
                  // Load Monaco dynamically using the global require (from loader.js)
                  //console.log('MonacoEditorManager: Loading Monaco dynamically...');

                  var loadMonaco = function loadMonaco() {
                    // Check if the global require from loader.js is available
                    if (typeof window.require !== 'undefined' && typeof window.require.config === 'function') {
                      //console.log('MonacoEditorManager: Using global require to load Monaco');

                      // Configure Monaco paths
                      window.require.config({
                        paths: {
                          vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
                        }
                      });

                      // Load Monaco
                      window.require(['vs/editor/editor.main'], function () {
                        //console.log('MonacoEditorManager: Monaco loaded successfully');
                        initializeEditor();
                      });
                    } else {
                      // Fallback: wait for Monaco to be available
                      //console.log('MonacoEditorManager: Waiting for Monaco...');
                      var attempts = 0;
                      var maxAttempts = 50; // Wait up to 5 seconds

                      var _checkMonaco = function checkMonaco() {
                        attempts++;
                        if (typeof window.monaco !== 'undefined') {
                          //console.log('MonacoEditorManager: Monaco became available after', attempts * 100, 'ms');
                          initializeEditor();
                        } else if (attempts < maxAttempts) {
                          setTimeout(_checkMonaco, 100);
                        } else {
                          console.error('MonacoEditorManager: Timeout waiting for Monaco to load');
                          reject(new Error('Monaco Editor failed to load within timeout'));
                        }
                      };
                      _checkMonaco();
                    }
                  };

                  // Give the loader.js a moment to set up the global require
                  setTimeout(loadMonaco, 100);
                }
              }));
          }
        }, _callee2);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * Load completion data from external JSON files
     * @private
     * @returns {Promise} Promise that resolves when all completion data is loaded
     */
    )
  }, {
    key: "_loadCompletionData",
    value: (function () {
      var _loadCompletionData2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var _this2 = this;
        var files, loadPromises;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              files = {
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
                millAnnotations: '/mill-annotations.json'
              };
              loadPromises = Object.entries(files).map(/*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(_ref2) {
                  var _ref4, key, filePath, response, data, _t2;
                  return _regenerator().w(function (_context4) {
                    while (1) switch (_context4.p = _context4.n) {
                      case 0:
                        _ref4 = _slicedToArray(_ref2, 2), key = _ref4[0], filePath = _ref4[1];
                        _context4.p = 1;
                        _context4.n = 2;
                        return fetch(filePath);
                      case 2:
                        response = _context4.v;
                        if (!response.ok) {
                          _context4.n = 4;
                          break;
                        }
                        _context4.n = 3;
                        return response.json();
                      case 3:
                        data = _context4.v;
                        _this2.completionData[key] = data;
                        _context4.n = 5;
                        break;
                      case 4:
                        console.warn("Failed to load ".concat(key, " completion data: ").concat(response.status));
                      case 5:
                        _context4.n = 7;
                        break;
                      case 6:
                        _context4.p = 6;
                        _t2 = _context4.v;
                        console.warn("\u26A0\uFE0F Error loading ".concat(key, " completion data:"), _t2.message);
                      case 7:
                        return _context4.a(2);
                    }
                  }, _callee3, null, [[1, 6]]);
                }));
                return function (_x) {
                  return _ref3.apply(this, arguments);
                };
              }());
              _context5.n = 1;
              return Promise.all(loadPromises);
            case 1:
              return _context5.a(2);
          }
        }, _callee4);
      }));
      function _loadCompletionData() {
        return _loadCompletionData2.apply(this, arguments);
      }
      return _loadCompletionData;
    }()
    /**
     * Register GGcode language with Monaco
     * @private
     */
    )
  }, {
    key: "_registerGGcodeLanguage",
    value: function _registerGGcodeLanguage() {
      monaco.languages.register({
        id: 'ggcode'
      });

      // Register comprehensive completion provider for GGcode
      this._registerCompletionProvider();

      // Register hover provider for better documentation
      this._registerHoverProvider();

      // Register signature help for function parameters
      this._registerSignatureHelpProvider();

      // Set language configuration for GGcode using JSON data
      if (this.completionData.languageConfig) {
        var config = this.completionData.languageConfig.languageConfiguration;
        monaco.languages.setLanguageConfiguration('ggcode', {
          brackets: config.brackets,
          autoClosingPairs: config.autoClosingPairs,
          surroundingPairs: config.surroundingPairs,
          folding: {
            markers: {
              start: new RegExp(config.folding.markers.start),
              end: new RegExp(config.folding.markers.end)
            }
          }
        });
      } else {
        console.warn('⚠️ Language configuration not loaded, using defaults');
      }

      // Use completion data loaded at startup - fallback to minimal sets if JSON failed
      var keywords = this.completionData.keywords ? this.completionData.keywords.keywords.map(function (kw) {
        return kw.word;
      }) : ['let', 'if', 'else', 'for', 'while', 'function', 'return', 'note'];
      var constants = this.completionData.constants ? this.completionData.constants.constants.map(function (constant) {
        return constant.name;
      }) : ['PI', 'E', 'TAU', 'DEG_TO_RAD'];
      var builtins = this.completionData.functions ? this.completionData.functions.functions.map(function (func) {
        return func.name;
      }) : ['abs', 'mod', 'sin', 'cos', 'tan', 'sqrt', 'hypot', 'floor', 'ceil', 'round'];

      // Create dynamic regex patterns for tokenizer using JSON configuration
      var keywordPattern = keywords.length > 0 ? new RegExp("\\b(".concat(keywords.join('|'), ")\\b")) : /\b(dummy)\b/;
      var constantPattern = constants.length > 0 ? new RegExp("\\b(".concat(constants.join('|'), ")\\b")) : /\b(dummy)\b/;
      var builtinPattern = builtins.length > 0 ? new RegExp("\\b(".concat(builtins.join('|'), ")\\b")) : /\b(dummy)\b/;

      // Build dynamic tokenizer using JSON configuration
      if (!this.completionData.tokenizer) {
        console.warn('⚠️ Tokenizer configuration not loaded');
        return;
      }
      var tokenizerConfig = this.completionData.tokenizer.tokenizer;
      var axisChars = tokenizerConfig.axisCharacters || 'XYZABCEFSHTHRPN';

      // Get language configuration patterns from JSON
      var langConfig = this.completionData.languageConfig;

      // Build dynamic tokenizer rules
      var tokenizerRules = [];

      // Generate axis patterns dynamically
      var axisTypes = {};
      var _iterator = _createForOfIteratorHelper(axisChars),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _char = _step.value;
          // Axis with bracketed variables (e.g., X[f], Y[y+1]) - HIGHER PRIORITY
          tokenizerRules.push([new RegExp("\\b".concat(_char, "\\[([^\\]]+)\\]")), "axis-with-var.".concat(_char.toLowerCase())]);

          // Axis with numeric values (e.g., X123.45, Y-789) - MEDIUM PRIORITY
          tokenizerRules.push([new RegExp("\\b".concat(_char, "[-+]?[0-9]*\\.?[0-9]+\\b")), "axis.".concat(_char.toLowerCase())]);

          // Map for word matching
          axisTypes[_char] = "axis.".concat(_char.toLowerCase());
        }

        // Add N-line pattern (for line numbers)
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
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
      tokenizerRules.push([new RegExp(langConfig.axisFallbackPattern1.replace(/\{axis0\}/g, axisChars.charAt(0)).replace(/\{axis1\}/g, axisChars.charAt(1)).replace(/\{axis2\}/g, axisChars.charAt(2))), 'axis']);
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
      tokenizerRules.push([new RegExp("\\b".concat(langConfig.numberPattern, "\\b")), 'number']);

      // Comments using JSON comment patterns
      tokenizerRules.push([new RegExp("".concat(tokenizerConfig.commentPatterns.lineComment, ".*$")), 'comment']);
      tokenizerRules.push([new RegExp("".concat(tokenizerConfig.commentPatterns.blockCommentStart, ".*$")), 'comment', '@blockComment']);

      // Dynamic brackets using JSON bracket symbols
      tokenizerRules.push([new RegExp("[".concat(langConfig.bracketSymbols, "]")), 'bracket']);

      // Build block comment pattern from JSON
      var blockEndPattern = tokenizerConfig.commentPatterns.blockCommentEnd || '%/';
      monaco.languages.setMonarchTokensProvider('ggcode', {
        keywords: keywords,
        constants: constants,
        builtins: builtins,
        operators: tokenizerConfig.operators || ['=', '+', '-', '*', '/', '%', '..'],
        symbols: new RegExp("[".concat(langConfig.tokenizerSymbolsPattern, "]")),
        tokenizer: {
          root: tokenizerRules,
          blockComment: [[new RegExp(".*".concat(blockEndPattern)), 'comment', '@pop'], [/.*$/, 'comment']]
        }
      });
    }

    /**
     * Register comprehensive completion provider for GGcode language
     * Provides IntelliSense-style completion suggestions for all GGcode elements
     * @private
     */
  }, {
    key: "_registerCompletionProvider",
    value: function _registerCompletionProvider() {
      var _window$applicationMa,
        _window$applicationMa2,
        _this3 = this;
      // Store reference to help system for dictionary access
      this.helpSystem = (_window$applicationMa = window.applicationManager) === null || _window$applicationMa === void 0 || (_window$applicationMa2 = _window$applicationMa.getHelpSystem) === null || _window$applicationMa2 === void 0 ? void 0 : _window$applicationMa2.call(_window$applicationMa);

      // Register the main completion item provider
      monaco.languages.registerCompletionItemProvider('ggcode', {
        provideCompletionItems: function provideCompletionItems(model, position, _context, _token) {
          var _this3$helpSystem, _this3$helpSystem2;
          var word = model.getWordUntilPosition(position);
          var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
          var suggestions = [];

          // Add context-aware completions based on current line content
          var lineContent = model.getLineContent(position.lineNumber);
          var linePrefix = lineContent.substring(0, position.column - 1);

          // Unified completion processing - combine all sources with proper priority sorting
          var allCompletions = [];

          // Standard completions (G-codes, M-codes, functions, constants, etc.)
          allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getGcodeCompletions(range)));
          allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getMcodeCompletions(range)));
          allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getKeywordCompletions(range)));
          allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getFunctionCompletions(range)));
          allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getConstantCompletions(range)));
          allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getAxisCompletions(range)));
          allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getOperatorCompletions(range)));
          allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getBracketCompletions(range)));

          // User-defined function completions (higher priority)
          allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getUserFunctionCompletions(range)));

          // Context-aware axis parameters when user types G/M codes
          if (linePrefix.match(/\b(G\d+|M\d+)\s*$/)) {
            allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getAxisParametersCompletions(range)));
          }

          // External dictionary and annotation completions (lowest priority)
          if ((_this3$helpSystem = _this3.helpSystem) !== null && _this3$helpSystem !== void 0 && _this3$helpSystem.dictionaryCache) {
            allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getMillDictionaryCompletions(range, linePrefix)));
          }
          if ((_this3$helpSystem2 = _this3.helpSystem) !== null && _this3$helpSystem2 !== void 0 && _this3$helpSystem2.annotationsCache) {
            allCompletions.push.apply(allCompletions, _toConsumableArray(_this3._getMillAnnotationsCompletions(range, linePrefix)));
          }

          // Sort all completions by sortText to ensure consistent priority
          suggestions.push.apply(suggestions, _toConsumableArray(allCompletions.sort(function (a, b) {
            return a.sortText.localeCompare(b.sortText);
          })));
          return {
            suggestions: suggestions,
            incomplete: false
          };
        },
        triggerCharacters: ['G', 'M', 'g', 'm', 'x', 'y', 'z', 'a', 'b', 'c', 'f', 's', 't', 'h', 'r', 'p', 'l', 'i', 'f', 'w', '(', '[', ' ']
      });
    }

    /**
     * Get G-code completion items from mill dictionary JSON data
     * @private
     */
  }, {
    key: "_getGcodeCompletions",
    value: function _getGcodeCompletions(range) {
      var gcodes = this.completionData.millDictionary || {};
      if (!gcodes || Object.keys(gcodes).length === 0) {
        console.warn('⚠️ Mill dictionary JSON not loaded for G-code completions');
        return [];
      }
      var completions = [];
      for (var _i = 0, _Object$entries = Object.entries(gcodes); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          gcode = _Object$entries$_i[0],
          definition = _Object$entries$_i[1];
        if (gcode.startsWith('G') && gcode.length >= 2) {
          var description = definition.desc || 'G-code command';
          var detail = gcode;
          var usage = gcode;

          // Build usage string from parameters
          if (definition.sub && Object.keys(definition.sub).length > 0) {
            var params = Object.keys(definition.sub).join(' ');
            usage = "".concat(gcode, " ").concat(params);
            detail = "Usage: ".concat(usage);
          }
          var completionItem = {
            label: gcode,
            kind: monaco.languages.CompletionItemKind.Class,
            detail: detail,
            documentation: {
              value: "**".concat(gcode, "** - ").concat(description).concat(definition.sub ? '\n\nParameters:\n' + Object.entries(definition.sub).map(function (_ref5) {
                var _ref6 = _slicedToArray(_ref5, 2),
                  param = _ref6[0],
                  desc = _ref6[1];
                return "  ".concat(param, ": ").concat(desc);
              }).join('\n') : '')
            },
            insertText: gcode,
            sortText: "01".concat(gcode),
            range: range
          };

          // Validate the completion item
          if (!completionItem.label || !completionItem.insertText) {
            console.warn("\u26A0\uFE0F Invalid completion item for ".concat(gcode, ":"), completionItem);
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
  }, {
    key: "_getMcodeCompletions",
    value: function _getMcodeCompletions(range) {
      var mcodes = this.completionData.millDictionary || {};
      if (!mcodes || Object.keys(mcodes).length === 0) {
        console.warn('⚠️ Mill dictionary JSON not loaded for M-code completions');
        return [];
      }
      var completions = [];
      for (var _i2 = 0, _Object$entries2 = Object.entries(mcodes); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          mcode = _Object$entries2$_i[0],
          definition = _Object$entries2$_i[1];
        if (mcode.startsWith('M') && mcode.length >= 2) {
          var description = definition.desc || 'M-code command';
          var detail = mcode;
          var usage = mcode;

          // Build usage string from parameters
          if (definition.sub && Object.keys(definition.sub).length > 0) {
            var params = Object.keys(definition.sub).join(' ');
            usage = "".concat(mcode, " ").concat(params);
            detail = "Usage: ".concat(usage);
          }
          completions.push({
            label: mcode,
            kind: monaco.languages.CompletionItemKind.Interface,
            detail: detail,
            documentation: {
              value: "**".concat(mcode, "** - ").concat(description).concat(definition.sub ? '\n\nParameters:\n' + Object.entries(definition.sub).map(function (_ref7) {
                var _ref8 = _slicedToArray(_ref7, 2),
                  param = _ref8[0],
                  desc = _ref8[1];
                return "  ".concat(param, ": ").concat(desc);
              }).join('\n') : '')
            },
            insertText: mcode,
            sortText: "02".concat(mcode),
            range: range
          });
        }
      }
      return completions;
    }

    /**
     * Get keyword completion items from external JSON only
     * @private
     */
  }, {
    key: "_getKeywordCompletions",
    value: function _getKeywordCompletions(range) {
      if (!this.completionData.keywords) {
        console.warn('⚠️ Keywords JSON not loaded');
        return [];
      }
      var keywords = this.completionData.keywords.keywords;
      return keywords.map(function (kw) {
        return {
          label: kw.word,
          kind: monaco.languages.CompletionItemKind.Keyword,
          detail: kw.detail,
          documentation: {
            value: "**".concat(kw.word, "** - ").concat(kw.description, "\n\nExample: `").concat(kw.detail, "`")
          },
          insertText: kw.snippet || kw.word,
          insertTextRules: kw.snippet ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet : undefined,
          sortText: "10".concat(kw.word),
          range: range
        };
      });
    }

    /**
     * Get mathematical function completion items from external JSON only
     * @private
     */
  }, {
    key: "_getFunctionCompletions",
    value: function _getFunctionCompletions(range) {
      if (!this.completionData.functions) {
        console.warn('⚠️ Functions JSON not loaded');
        return [];
      }
      var functions = this.completionData.functions.functions;
      return functions.map(function (func) {
        return {
          label: func.name,
          kind: monaco.languages.CompletionItemKind.Function,
          detail: func.detail,
          documentation: {
            value: "**".concat(func.name, "** - ").concat(func.description, "\n\nUsage: `").concat(func.detail, "`")
          },
          insertText: func.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          sortText: "30".concat(func.name),
          range: range
        };
      });
    }

    /**
     * Get constant completion items from external JSON only
     * @private
     */
  }, {
    key: "_getConstantCompletions",
    value: function _getConstantCompletions(range) {
      if (!this.completionData.constants) {
        console.warn('⚠️ Constants JSON not loaded');
        return [];
      }
      var constants = this.completionData.constants.constants;
      return constants.map(function (constant) {
        return {
          label: constant.name,
          kind: monaco.languages.CompletionItemKind.Constant,
          detail: constant.detail,
          documentation: {
            value: "**".concat(constant.name, "** - ").concat(constant.description, "\n\nValue: ").concat(constant.detail)
          },
          insertText: constant.name,
          sortText: "20".concat(constant.name),
          range: range
        };
      });
    }

    /**
     * Get axis completion items from external JSON only
     * @private
     */
  }, {
    key: "_getAxisCompletions",
    value: function _getAxisCompletions(range) {
      if (!this.completionData.axes) {
        console.warn('⚠️ Axes JSON not loaded');
        return [];
      }
      var axes = this.completionData.axes.axes;
      return axes.map(function (axis) {
        return {
          label: axis.axis,
          kind: monaco.languages.CompletionItemKind.Variable,
          detail: axis.description,
          documentation: {
            value: "**".concat(axis.axis, "** - ").concat(axis.description, "\n\nExample: `").concat(axis.snippet, "`")
          },
          insertText: axis.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          sortText: "40".concat(axis.axis),
          range: range
        };
      });
    }

    /**
     * Get operator completion items from external JSON only
     * @private
     */
  }, {
    key: "_getOperatorCompletions",
    value: function _getOperatorCompletions(range) {
      if (!this.completionData.operators) {
        console.warn('⚠️ Operators JSON not loaded');
        return [];
      }
      var operators = this.completionData.operators.operators;
      return operators.map(function (operator) {
        return {
          label: operator.op,
          kind: monaco.languages.CompletionItemKind.Operator,
          detail: operator.detail,
          documentation: {
            value: "**".concat(operator.op, "** - ").concat(operator.description, "\n\nExample: `").concat(operator.detail, "`")
          },
          insertText: operator.op,
          sortText: "50".concat(operator.op),
          range: range
        };
      });
    }

    /**
     * Get bracket completion items from external JSON only
     * @private
     */
  }, {
    key: "_getBracketCompletions",
    value: function _getBracketCompletions(range) {
      if (!this.completionData.brackets) {
        console.warn('⚠️ Brackets JSON not loaded');
        return [];
      }
      var brackets = this.completionData.brackets.brackets;
      return brackets.map(function (bracket) {
        if (bracket.snippet) {
          return {
            label: bracket.pair,
            kind: monaco.languages.CompletionItemKind.Snippet,
            detail: bracket.description,
            documentation: {
              value: bracket.description
            },
            insertText: bracket.snippet,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: "60".concat(bracket.pair),
            range: range
          };
        } else {
          var label = bracket.pair.replace(/\{|\[|\(|\}|\]|\)/, function (match) {
            return match;
          }); // Keep the original bracket
          if (!label) {
            console.warn('⚠️ Empty label for bracket:', bracket);
            return null; // Skip invalid brackets
          }
          return {
            label: label,
            kind: monaco.languages.CompletionItemKind.Value,
            detail: bracket.description,
            documentation: {
              value: bracket.description
            },
            insertText: label,
            sortText: "60".concat(bracket.pair),
            range: range
          };
        }
      }).filter(function (item) {
        return item !== null;
      }); // Remove null items
    }

    /**
     * Get mill dictionary completions (shows detailed G/M-codes with parameters)
     * @private
     */
  }, {
    key: "_getMillDictionaryCompletions",
    value: function _getMillDictionaryCompletions(range, linePrefix) {
      var _window$applicationMa3, _window$applicationMa4;
      var completions = [];
      var helpSystem = (_window$applicationMa3 = window.applicationManager) === null || _window$applicationMa3 === void 0 || (_window$applicationMa4 = _window$applicationMa3.getHelpSystem) === null || _window$applicationMa4 === void 0 ? void 0 : _window$applicationMa4.call(_window$applicationMa3);
      var dictionary = helpSystem === null || helpSystem === void 0 ? void 0 : helpSystem.dictionaryCache;
      if (!dictionary) return completions;

      // Get user input to filter completions
      var word = linePrefix.toUpperCase();
      for (var _i3 = 0, _Object$entries3 = Object.entries(dictionary); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
          gcode = _Object$entries3$_i[0],
          definition = _Object$entries3$_i[1];
        // Skip single characters like "F", "S", "T" etc. - those are handled elsewhere
        if (gcode.length === 1) continue;

        // Filter based on what user has typed
        if (word && !gcode.startsWith(word)) continue;
        var description = definition.desc || 'G/M-code command';
        var detail = gcode;
        var usage = gcode;

        // Build full usage string from parameters
        if (definition.sub && Object.keys(definition.sub).length > 0) {
          var params = Object.keys(definition.sub).join(' ');
          usage = "".concat(gcode, " ").concat(params);
          detail = "Usage: ".concat(usage);

          // Create detailed parameter documentation
          var paramDocs = Object.entries(definition.sub).map(function (_ref9) {
            var _ref0 = _slicedToArray(_ref9, 2),
              param = _ref0[0],
              desc = _ref0[1];
            return "  ".concat(param, ": ").concat(desc);
          }).join('\n');
          description = description + '\n\nParameters:\n' + paramDocs;
        }
        completions.push({
          label: gcode,
          kind: monaco.languages.CompletionItemKind.Class,
          detail: detail,
          documentation: {
            value: "**".concat(gcode, "** - ").concat(description)
          },
          insertText: gcode,
          sortText: "000".concat(gcode),
          // Very high priority for official G/M-codes
          range: range
        });
      }
      return completions;
    }

    /**
     * Get mill annotations completions (shows parameter syntax and smart completions)
     * Enhanced to support both G1/G01 formats and improved full line completion
     * @private
     */
  }, {
    key: "_getMillAnnotationsCompletions",
    value: function _getMillAnnotationsCompletions(range, linePrefix) {
      var _window$applicationMa5,
        _window$applicationMa6,
        _this4 = this;
      var completions = [];
      var helpSystem = (_window$applicationMa5 = window.applicationManager) === null || _window$applicationMa5 === void 0 || (_window$applicationMa6 = _window$applicationMa5.getHelpSystem) === null || _window$applicationMa6 === void 0 ? void 0 : _window$applicationMa6.call(_window$applicationMa5);
      var annotations = helpSystem === null || helpSystem === void 0 ? void 0 : helpSystem.annotationsCache;
      if (!annotations) {
        return completions;
      }

      // Get user input to filter completions
      var word = linePrefix.toUpperCase();
      var isGCode = word.startsWith('G');
      var isMCode = word.startsWith('M');
      if (!isGCode && !isMCode) return completions;

      // Process each annotation entry
      for (var _i4 = 0, _Object$entries4 = Object.entries(annotations); _i4 < _Object$entries4.length; _i4++) {
        var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
          description = _Object$entries4$_i[0],
          usage = _Object$entries4$_i[1];
        // Skip single-character annotations and non-motion commands
        if (usage.length <= 2 || /^\s*[A-Z](\s+[A-Z])*\s*$/.test(usage)) {
          continue;
        }

        // Extract G/M code from usage
        var gcodeMatch = usage.match(/^[GM]\d+/);
        var gcode = gcodeMatch ? gcodeMatch[0] : null;
        if (!gcode) continue;

        // Enhanced matching logic to handle both G1 and G01 formats
        var shouldInclude = false;
        var altCode = null;
        if (gcode.length === 2) {
          // G1 format - check if user's input matches G1 or G01
          if (word === gcode || word === gcode[0] + '0' + gcode[1]) {
            shouldInclude = true;
            altCode = word;
          }
        } else if (gcode.length === 3 && gcode[1] === '0') {
          // G01 format - check if user's input matches G01 or G1
          var shortForm = gcode[0] + gcode[2];
          if (word === gcode || word === shortForm) {
            shouldInclude = true;
            altCode = word;
          }
        }

        // Alternative: check if word starts with G/M code (case insensitive)
        if (!shouldInclude && word && gcode.toUpperCase().startsWith(word.toUpperCase())) {
          shouldInclude = true;
          altCode = gcode;
        }

        // Additional fuzzy matching for common patterns
        if (!shouldInclude && word && word.length >= 2) {
          // For example, "35" should match G35, "rapid" could match G00, etc.
          var searchNum = parseInt(word);
          if (searchNum && gcode.match(/G\d+/)) {
            var gcodeNum = parseInt(gcode.slice(1));
            if (searchNum === gcodeNum) {
              shouldInclude = true;
              altCode = gcode;
            }
          }
        }
        if (!shouldInclude) continue;

        // Use the matching code for display (user's format preference)
        var displayCode = altCode || gcode;
        var isFullLinePreset = description.startsWith('FULL LINE PRESET');

        // Add completion for valid code

        // Option 1: Just the G/M code (for basic completion)
        completions.push({
          label: "".concat(isFullLinePreset ? '📋 ' : '').concat(displayCode),
          kind: monaco.languages.CompletionItemKind.Property,
          detail: "".concat(isFullLinePreset ? '📑 FULL PRESET: ' : 'Basic: ').concat(displayCode),
          documentation: {
            value: "".concat(isFullLinePreset ? '⭐ **FULL LINE PRESET** ⭐\n\n' : '', "**").concat(description, "**\n\nComplete Syntax: `").concat(usage, "`\n\n").concat(gcode !== displayCode ? "Equivalent to: **".concat(gcode, "**") : '').concat(isFullLinePreset ? '\n\n💡 *This preset includes all standard parameters with smart placeholders!*' : '')
          },
          insertText: displayCode,
          sortText: "".concat(isFullLinePreset ? '000-' : '800').concat(displayCode),
          range: range
        });

        // Option 2: Complete syntax (enhanced smart completion - works even when not exact match)
        var lineTrimmed = linePrefix.trim().toUpperCase();
        var isExactMatch = lineTrimmed === displayCode || lineTrimmed === gcode;
        var hasComplexParameters = usage.split(' ').length > 3; // G36 F I J K X Y Z has 7 params

        // Trigger full completion if:
        // - exact match (original logic)
        // - complex command like G36 (at least 4 parameters)
        // - user just typed the G/M code
        if (isExactMatch || hasComplexParameters || lineTrimmed.match(/^[GM]\d+$/)) {
          var paramsOnly = usage.replace(gcode, '').trim();
          if (paramsOnly) {
            var completionParams = paramsOnly.split(' ').map(function (p) {
              // Try to use external parameter mappings first
              if (_this4.completionData.paramMappings && _this4.completionData.paramMappings.paramMappings) {
                var paramMappings = _this4.completionData.paramMappings.paramMappings;
                return paramMappings[p] ? paramMappings[p] : "[".concat(p.toLowerCase(), "]");
              }

              // Fallback to hardcoded parameter mapping
              var paramMap = {
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
                P: '[dwell]'
              };
              return paramMap[p] ? paramMap[p] : "[".concat(p.toLowerCase(), "]");
            }).join(' ');

            // Generate the sort text - full line presets get absolute top priority
            var fullPresetPriority = isFullLinePreset ? '000' : '010';
            var completionLabel = isFullLinePreset ? "\uD83D\uDE80 FULL LINE: ".concat(displayCode) : "\uD83D\uDE80 ".concat(displayCode, " \u2022 Complete Script");
            completions.push({
              label: completionLabel,
              kind: monaco.languages.CompletionItemKind.Snippet,
              detail: "".concat(isFullLinePreset ? '⭐⭐ FULL LINE PRESET:' : '⭐ FULL PRESET:', " ").concat(displayCode, " ").concat(paramsOnly),
              documentation: {
                value: "\uD83C\uDFAF **".concat(description, "**\n\n\uD83D\uDCCB **Complete Pattern:**\n```gcode\n").concat(displayCode, " ").concat(paramsOnly, "\n```\n\n\u26A1 **Auto-filled Parameters:**\n").concat(completionParams.split(' ').map(function (p) {
                  return "\u2022 **".concat(p.replace(/\[|\]/g, ''), "** - ").concat(p);
                }).join('\n'), "\n\n\uD83D\uDCA1 **Quick Use:** Just press TAB to insert the complete line with smart placeholders!\n\n").concat(isFullLinePreset ? '⭐ **This is a pre-configured preset - recommended for quick use!**' : '📝 *Standard parameter completion pattern*')
              },
              insertText: "".concat(displayCode, " ").concat(completionParams),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              sortText: "".concat(fullPresetPriority).concat(displayCode),
              // FULL LINE PRESETS get absolute highest priority
              range: range
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
  }, {
    key: "_getAxisParametersCompletions",
    value: function _getAxisParametersCompletions(range) {
      if (!this.completionData.paramMappings || !this.completionData.paramMappings.axisParameters) {
        console.warn('⚠️ Axis Parameters JSON not loaded');
        return [];
      }
      var axisParameters = this.completionData.paramMappings.axisParameters;
      return axisParameters.map(function (param) {
        return {
          label: param.param.trim(),
          kind: monaco.languages.CompletionItemKind.Field,
          detail: param.description,
          documentation: {
            value: "**".concat(param.param.trim(), "** - ").concat(param.description)
          },
          insertText: param.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          sortText: "00".concat(param.param),
          range: range
        };
      });
    }

    /**
     * Register hover provider for enhanced documentation
     * @private
     */
  }, {
    key: "_registerHoverProvider",
    value: function _registerHoverProvider() {
      var _this5 = this;
      monaco.languages.registerHoverProvider('ggcode', {
        provideHover: function provideHover(model, position) {
          var word = model.getWordAtPosition(position);
          if (!word) return null;
          var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
          var hoverInfo = _this5._getHoverInfo(word.word);
          if (hoverInfo) {
            return {
              range: range,
              contents: hoverInfo.contents
            };
          }
          return null;
        }
      });
    }

    /**
     * Get hover information for a word (using external JSON data)
     * @private
     */
  }, {
    key: "_getHoverInfo",
    value: function _getHoverInfo(word) {
      var _window$applicationMa7, _window$applicationMa8;
      // Check mill dictionary data first (official G/M-code definitions)
      var helpSystem = (_window$applicationMa7 = window.applicationManager) === null || _window$applicationMa7 === void 0 || (_window$applicationMa8 = _window$applicationMa7.getHelpSystem) === null || _window$applicationMa8 === void 0 ? void 0 : _window$applicationMa8.call(_window$applicationMa7);
      var dictionary = helpSystem === null || helpSystem === void 0 ? void 0 : helpSystem.dictionaryCache;
      if (dictionary) {
        // Check for exact match first
        if (dictionary[word]) {
          var definition = dictionary[word];
          var description = definition.desc || 'G/M-code command';
          var parameters = '';

          // Build parameter documentation
          if (definition.sub && Object.keys(definition.sub).length > 0) {
            var paramList = Object.entries(definition.sub).map(function (_ref1) {
              var _ref10 = _slicedToArray(_ref1, 2),
                param = _ref10[0],
                desc = _ref10[1];
              return "".concat(param, ": ").concat(desc);
            }).join('\n');
            parameters = "\n\n**Parameters:**\n".concat(paramList);
          }
          return {
            contents: [{
              value: "**".concat(word, "** - ").concat(description).concat(parameters)
            }]
          };
        }

        // For G/M codes, also check the alternate format (G1 <-> G01)
        if (word.match(/^[GM]\d+$/)) {
          var altWord = word;
          if (word.length === 2 && word[1] !== '0') {
            // G1 -> G01
            altWord = word[0] + '0' + word[1];
          } else if (word.length === 3 && word[1] === '0' && word[2] !== '0') {
            // G01 -> G1 (but only if not G00)
            altWord = word[0] + word[2];
          }
          if (altWord !== word && dictionary[altWord]) {
            var _definition = dictionary[altWord];
            var _description = _definition.desc || 'G/M-code command';
            var _parameters = '';

            // Build parameter documentation
            if (_definition.sub && Object.keys(_definition.sub).length > 0) {
              var _paramList = Object.entries(_definition.sub).map(function (_ref11) {
                var _ref12 = _slicedToArray(_ref11, 2),
                  param = _ref12[0],
                  desc = _ref12[1];
                return "".concat(param, ": ").concat(desc);
              }).join('\n');
              _parameters = "\n\n**Parameters:**\n".concat(_paramList);
            }
            return {
              contents: [{
                value: "**".concat(altWord, " / ").concat(word, "** - ").concat(_description).concat(_parameters)
              }]
            };
          }
        }
      }

      // Use JSON-based hover data instead of hardcoded values

      // Check constants from JSON
      if (this.completionData.hoverConstants && this.completionData.hoverConstants[word]) {
        var constant = this.completionData.hoverConstants[word];
        return {
          contents: [{
            value: "**".concat(constant.title, "**\n\n").concat(constant.description, "\n\nValue: ").concat(constant.value).concat(constant.usage ? '\n\n' + constant.usage : '')
          }]
        };
      }

      // Check mill dictionary data (single source of truth)
      if (this.completionData.millDictionary && this.completionData.millDictionary[word]) {
        var entry = this.completionData.millDictionary[word];
        var _description2 = entry.desc || 'G/M-code command';
        var subParams = entry.sub ? Object.keys(entry.sub) : [];
        var paramInfo = subParams.length > 0 ? '\n\n**Parameters:**\n' + subParams.map(function (param) {
          return "\u2022 **".concat(param, "**: ").concat(entry.sub[param]);
        }).join('\n') : '';
        return {
          contents: [{
            value: "**".concat(word, "** - ").concat(_description2).concat(paramInfo)
          }]
        };
      }

      // Check functions from JSON
      if (this.completionData.hoverFunctions && this.completionData.hoverFunctions[word]) {
        var func = this.completionData.hoverFunctions[word];
        return {
          contents: [{
            value: "**".concat(func.syntax, "** - ").concat(func.description).concat(func.parameters && func.parameters.length > 0 ? '\n\nParameters:\n' + func.parameters.map(function (p) {
              return "\u2022 ".concat(p);
            }).join('\n') : '\n\nParameters: none').concat(func.returns ? '\n\nReturns: ' + func.returns : '')
          }]
        };
      }

      // Check keywords from JSON
      if (this.completionData.hoverKeywords && this.completionData.hoverKeywords[word]) {
        var keyword = this.completionData.hoverKeywords[word];
        return {
          contents: [{
            value: "**".concat(word, "** - ").concat(keyword.description, "\n\n").concat(keyword.example).concat(keyword.usage ? '\n\n' + keyword.usage : '')
          }]
        };
      }

      // Check for user-defined functions (kept for backward compatibility)
      if (this.userFunctionCache[word]) {
        var userFunc = this.userFunctionCache[word];
        var signature = "".concat(userFunc.name, "(").concat(userFunc.parameters.join(', '), ")");
        var documentation = userFunc.documentation || 'User-defined function';
        return {
          contents: [{
            value: "**".concat(signature, "**\n\n").concat(documentation).concat(userFunc.documentation ? '' : '\n\nParameters: ' + (userFunc.parameters.length > 0 ? userFunc.parameters.join(', ') : 'none'))
          }]
        };
      }
      return null;
    }

    /**
     * Register signature help for function parameters
     * @private
     */
  }, {
    key: "_registerSignatureHelpProvider",
    value: function _registerSignatureHelpProvider() {
      var _this6 = this;
      monaco.languages.registerSignatureHelpProvider('ggcode', {
        signatureHelpTriggerCharacters: ['(', ','],
        provideSignatureHelp: function provideSignatureHelp(model, position, _token, _context) {
          var lineContent = model.getLineContent(position.lineNumber);
          var beforeCursor = lineContent.substring(0, position.column - 1);

          // Find the function call
          var functionMatch = beforeCursor.match(/(\w+)\s*\(\s*([^)]*)$/);
          if (!functionMatch) return null;
          var functionName = functionMatch[1];
          var parametersText = functionMatch[2] || '';
          var signatureInfo = _this6._getFunctionSignature(functionName);
          if (!signatureInfo) return null;

          // Count parameters
          var commaCount = (parametersText.match(/,/g) || []).length;
          var parameterIndex = Math.min(commaCount, signatureInfo.parameters.length - 1);
          return {
            signatures: [signatureInfo],
            activeSignature: 0,
            activeParameter: parameterIndex
          };
        }
      });
    }

    /**
     * Get function signature information (using external JSON data)
     * @private
     */
  }, {
    key: "_getFunctionSignature",
    value: function _getFunctionSignature(functionName) {
      // Check signatures from JSON data first
      if (this.completionData.signatures && this.completionData.signatures.functions) {
        var signatures = this.completionData.signatures.functions;
        if (signatures[functionName]) {
          return signatures[functionName];
        }
      }

      // Check for user-defined functions
      if (this.userFunctionCache[functionName]) {
        var userFunc = this.userFunctionCache[functionName];
        return {
          label: "".concat(userFunc.name, "(").concat(userFunc.parameters.join(', '), ")"),
          documentation: "User-defined function".concat(userFunc.documentation ? "\n\n".concat(userFunc.documentation) : ''),
          parameters: userFunc.parameters.map(function (param) {
            return {
              label: param,
              documentation: "Parameter: ".concat(param)
            };
          })
        };
      }
      return null;
    }

    /**
     * Legacy method for backward compatibility - replaced by _registerCompletionProvider
     * @private
     * @deprecated
     */
  }, {
    key: "_registerBracketPairCompletionProvider",
    value: function _registerBracketPairCompletionProvider() {
      return this._registerCompletionProvider();
    }

    /**
     * Parse user-defined functions from the current editor content
     * @private
     */
  }, {
    key: "_parseUserFunctions",
    value: function _parseUserFunctions() {
      var _this7 = this;
      var model = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      try {
        // Use current model if not provided
        if (!model && this.editor) {
          model = this.editor.getModel();
        }
        if (!model) return;
        var content = model.getValue();
        this.userFunctions.clear();

        // Regex pattern to match function definitions: function name(parameters) { ... }
        var functionRegex = /function\s+(\w+)\s*\(\s*([^)]*)\s*\)\s*\{[^}]*\}/g;
        var match;
        while ((match = functionRegex.exec(content)) !== null) {
          var functionName = match[1];
          var parameters = match[2].trim();

          // Parse parameters
          var paramList = parameters === '' ? [] : parameters.split(',').map(function (param) {
            return param.trim();
          }).filter(function (param) {
            return param.length > 0;
          });

          // Extract function documentation from comments
          var functionStart = match.index;
          var linesBefore = content.substring(0, functionStart).split('\n');
          var functionLineIndex = linesBefore.length;
          var documentation = '';

          // Look for note { ... } comments above the function
          for (var i = linesBefore.length - 1; i >= 0; i--) {
            var line = linesBefore[i].trim();
            if (line.startsWith('note')) {
              var noteMatch = line.match(/note\s*\{\s*(.+?)\s*\}/);
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
            lineNumber: functionLineIndex + 1
          });
        }

        // Cache for performance
        this.userFunctionCache = {};
        this.userFunctions.forEach(function (func, name) {
          _this7.userFunctionCache[name] = func;
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
  }, {
    key: "_getUserFunctionCompletions",
    value: function _getUserFunctionCompletions(range) {
      var suggestions = [];
      this.userFunctions.forEach(function (func) {
        var docString = "**".concat(func.name, "**(").concat(func.parameters.join(', '), ")\n\nUser-defined function").concat(func.documentation ? "\n\n".concat(func.documentation) : '');
        var snippet = "".concat(func.name, "(").concat(func.parameters.map(function (param, i) {
          return "${".concat(i + 1, ":").concat(param, "}");
        }).join(', '), ")");
        suggestions.push({
          label: func.name,
          kind: monaco.languages.CompletionItemKind.Function,
          detail: "".concat(func.name, "(").concat(func.parameters.join(', '), ")"),
          documentation: {
            value: docString
          },
          insertText: snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          sortText: "05".concat(func.name),
          // Sort after built-ins but before other items
          range: range
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
  }, {
    key: "_createEditors",
    value: function _createEditors(inputContainerId, outputContainerId, initialInput, initialOutput) {
      var _this8 = this;
      // Load saved content from StorageManager
      var savedInput = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getInputContent();
      var savedOutput = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getOutputContent();
      var inputContent = savedInput && savedInput.trim() !== '' ? savedInput : initialInput;
      var outputContent = savedOutput && savedOutput.trim() !== '' ? savedOutput : initialOutput;

      // Hide loading indicators and show editor containers
      var inputLoading = document.getElementById(inputContainerId + '-loading');
      var outputLoading = document.getElementById(outputContainerId + '-loading');
      var inputContainer = document.getElementById(inputContainerId);
      var outputContainer = document.getElementById(outputContainerId);
      if (inputLoading) inputLoading.style.display = 'none';
      if (outputLoading) outputLoading.style.display = 'none';
      if (inputContainer) inputContainer.style.display = 'block';
      if (outputContainer) outputContainer.style.display = 'block';

      // Get initial settings from settings manager
      var initialSettings = _settings_js__WEBPACK_IMPORTED_MODULE_2__["default"] ? _settings_js__WEBPACK_IMPORTED_MODULE_2__["default"].getSettings() : {};

      // Create input editor with proper initial settings
      this.editor = monaco.editor.create(inputContainer, {
        value: inputContent,
        language: 'ggcode',
        theme: 'vs-dark',
        // Start with safe default theme
        automaticLayout: true,
        minimap: initialSettings.minimap === 'disabled' ? {
          enabled: false
        } : {
          enabled: true
        },
        fontSize: initialSettings.fontSize || 14,
        fontFamily: initialSettings.fontFamily || 'Consolas, "Courier New", monospace',
        wordWrap: initialSettings.wordWrap || 'off',
        lineNumbers: initialSettings.lineNumbers || 'on',
        renderWhitespace: initialSettings.renderWhitespace || 'none',
        renderIndentGuides: initialSettings.renderIndentGuides !== undefined ? initialSettings.renderIndentGuides : true,
        bracketMatching: initialSettings.bracketMatching !== undefined ? initialSettings.bracketMatching : true,
        autoClosingBrackets: initialSettings.autoClosingBrackets || 'always',
        autoClosingQuotes: initialSettings.autoClosingQuotes || 'always',
        autoClosingDelete: initialSettings.autoClosingDelete || 'always',
        autoClosingOvertype: initialSettings.autoClosingOvertype || 'always',
        surroudWithBrackets: initialSettings.surroudWithBrackets !== undefined ? initialSettings.surroudWithBrackets : true,
        tabSize: initialSettings.tabSize || 2,
        insertSpaces: initialSettings.insertSpaces !== undefined ? initialSettings.insertSpaces : true,
        // Bracket pair colorization settings
        bracketPairColorization: {
          enabled: true
        },
        // Semantic highlighting settings
        'semanticHighlighting.enabled': true
      });

      // Create output editor with proper initial settings
      this.outputEditor = monaco.editor.create(outputContainer, {
        value: outputContent,
        language: 'ggcode',
        theme: 'vs-dark',
        // Start with safe default theme
        automaticLayout: true,
        minimap: initialSettings.minimap === 'disabled' ? {
          enabled: false
        } : {
          enabled: true
        },
        fontSize: initialSettings.fontSize || 14,
        fontFamily: initialSettings.fontFamily || 'Consolas, "Courier New", monospace',
        wordWrap: initialSettings.wordWrap || 'off',
        lineNumbers: initialSettings.lineNumbers || 'on',
        renderWhitespace: initialSettings.renderWhitespace || 'none',
        renderIndentGuides: initialSettings.renderIndentGuides !== undefined ? initialSettings.renderIndentGuides : true,
        bracketMatching: initialSettings.bracketMatching !== undefined ? initialSettings.bracketMatching : true,
        autoClosingBrackets: initialSettings.autoClosingBrackets || 'always',
        autoClosingQuotes: initialSettings.autoClosingQuotes || 'always',
        autoClosingDelete: initialSettings.autoClosingDelete || 'always',
        autoClosingOvertype: initialSettings.autoClosingOvertype || 'always',
        surroudWithBrackets: initialSettings.surroudWithBrackets !== undefined ? initialSettings.surroudWithBrackets : true,
        tabSize: initialSettings.tabSize || 2,
        insertSpaces: initialSettings.insertSpaces !== undefined ? initialSettings.insertSpaces : true,
        // Bracket pair colorization settings
        bracketPairColorization: {
          enabled: true
        }
      });

      // Make output editor globally accessible for backward compatibility
      window.outputEditor = this.outputEditor;

      // Apply current settings to both editors
      if (_settings_js__WEBPACK_IMPORTED_MODULE_2__["default"]) {
        _settings_js__WEBPACK_IMPORTED_MODULE_2__["default"].applyAllSettingsToEditor(this.editor);
        _settings_js__WEBPACK_IMPORTED_MODULE_2__["default"].applyAllSettingsToEditor(this.outputEditor);
      }

      // Apply the actual GGCode theme after editors are created
      setTimeout(function () {
        if (_this8.editor) {
          _themes_js__WEBPACK_IMPORTED_MODULE_1__["default"].applyThemeToSpecificEditor(_this8.editor);
        }
        if (_this8.outputEditor) {
          _themes_js__WEBPACK_IMPORTED_MODULE_1__["default"].applyThemeToSpecificEditor(_this8.outputEditor);
        }
      }, 100); // Small delay to ensure editors are fully initialized

      //console.log('MonacoEditorManager: Editors created and configured successfully');
    }

    /**
     * Setup event handlers for editors
     * @private
     */
  }, {
    key: "_setupEventHandlers",
    value: function _setupEventHandlers(onCompile, onAnnotationUpdate) {
      var _this9 = this;
      // Auto-compile logic for input editor
      this.editor.onDidChangeModelContent(function () {
        // Parse user functions with debouncing
        if (_this9.functionParseTimeout) clearTimeout(_this9.functionParseTimeout);
        _this9.functionParseTimeout = setTimeout(function () {
          _this9._parseUserFunctions();
        }, 300); // Debounce parsing by 300ms

        if (_this9.autoCompile && !_this9.skipAutoCompile) {
          if (_this9.autoCompileTimeout) clearTimeout(_this9.autoCompileTimeout);
          _this9.autoCompileTimeout = setTimeout(function () {
            if (onCompile) onCompile(new Event('submit'));
          }, 1000);
        }
        _this9.skipAutoCompile = false;
      });

      // Annotation updates for output editor
      this.outputEditor.onDidChangeCursorPosition(function (e) {
        var lineNumber = e.position.lineNumber;
        var lineContent = _this9.outputEditor.getModel().getLineContent(lineNumber);
        if (onAnnotationUpdate) {
          onAnnotationUpdate(lineNumber, lineContent);
        }
      });
    }

    /**
     * Setup drag and drop functionality
     * @private
     */
  }, {
    key: "_setupDragAndDrop",
    value: function _setupDragAndDrop() {
      var _this0 = this;
      var editorDom = this.editor.getDomNode();
      if (!editorDom) return;
      editorDom.addEventListener('dragover', function (e) {
        e.preventDefault();
        editorDom.style.background = '#222a';
      });
      editorDom.addEventListener('dragleave', function (e) {
        e.preventDefault();
        editorDom.style.background = '';
      });
      editorDom.addEventListener('drop', function (e) {
        e.preventDefault();
        editorDom.style.background = '';
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          var file = e.dataTransfer.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            if (file.name.endsWith('.gcode') || file.name.endsWith('.ggcode')) {
              if (_this0.outputEditor) {
                _this0.outputEditor.setValue(evt.target.result);
              }
            }
            _this0.setLastOpenedFilename(file.name || '');
          };
          reader.readAsText(file);
        }
      });
    }

    /**
     * Get input editor content
     * @returns {string} Editor content
     */
  }, {
    key: "getInputValue",
    value: function getInputValue() {
      return this.editor ? this.editor.getValue() : '';
    }

    /**
     * Set input editor content
     * @param {string} content - Content to set
     */
  }, {
    key: "setInputValue",
    value: function setInputValue(content) {
      if (this.editor) {
        this.skipAutoCompile = true;
        this.editor.setValue(content);
      }
    }

    /**
     * Get output editor content
     * @returns {string} Editor content
     */
  }, {
    key: "getOutputValue",
    value: function getOutputValue() {
      return this.outputEditor ? this.outputEditor.getValue() : '';
    }

    /**
     * Set output editor content
     * @param {string} content - Content to set
     */
  }, {
    key: "setOutputValue",
    value: function setOutputValue(content) {
      if (this.outputEditor) {
        this.outputEditor.setValue(content);
      }
    }

    /**
     * Enable or disable auto-compile
     * @param {boolean} enabled - Whether auto-compile should be enabled
     */
  }, {
    key: "setAutoCompile",
    value: function setAutoCompile(enabled) {
      this.autoCompile = enabled;
      _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].setAutoCompileState(enabled);
    }

    /**
     * Get auto-compile state
     * @returns {boolean} Auto-compile state
     */
  }, {
    key: "getAutoCompile",
    value: function getAutoCompile() {
      return this.autoCompile;
    }

    /**
     * Load auto-compile state from localStorage
     */
  }, {
    key: "loadAutoCompileState",
    value: function loadAutoCompileState() {
      this.autoCompile = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAutoCompileState();
      return this.autoCompile;
    }

    /**
     * Set last opened filename
     * @param {string} filename - Filename to remember
     */
  }, {
    key: "setLastOpenedFilename",
    value: function setLastOpenedFilename(filename) {
      this.lastOpenedFilename = filename;
      _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].setLastFilename(filename);
    }

    /**
     * Get last opened filename
     * @returns {string} Last opened filename
     */
  }, {
    key: "getLastOpenedFilename",
    value: function getLastOpenedFilename() {
      return this.lastOpenedFilename;
    }

    /**
     * Load last opened filename from localStorage
     */
  }, {
    key: "loadLastOpenedFilename",
    value: function loadLastOpenedFilename() {
      this.lastOpenedFilename = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getLastFilename();
      return this.lastOpenedFilename;
    }

    /**
     * Save editor content to localStorage
     */
  }, {
    key: "saveContent",
    value: function saveContent() {
      try {
        if (this.editor) {
          _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].setInputContent(this.editor.getValue());
        }
        if (this.outputEditor) {
          _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].setOutputContent(this.outputEditor.getValue());
        }
      } catch (e) {
        console.warn('Failed to save content to storage:', e);
      }
    }

    /**
     * Setup auto-save functionality
     */
  }, {
    key: "setupAutoSave",
    value: function setupAutoSave() {
      var _this1 = this;
      // Auto-save content every 30 seconds
      setInterval(function () {
        return _this1.saveContent();
      }, 30000);

      // Save content when page is about to unload
      window.addEventListener('beforeunload', function () {
        return _this1.saveContent();
      });
    }

    /**
     * Check if Monaco is ready
     * @returns {boolean} Monaco ready state
     */
  }, {
    key: "isReady",
    value: function isReady() {
      return this.monacoReady;
    }

    /**
     * Force parsing of user-defined functions
     * Useful for initial setup or manual refresh
     */
  }, {
    key: "refreshUserFunctions",
    value: function refreshUserFunctions() {
      this._parseUserFunctions();
    }

    /**
     * Get all current user-defined functions
     * @returns {Array} Array of user function objects
     */
  }, {
    key: "getUserFunctions",
    value: function getUserFunctions() {
      return Array.from(this.userFunctions.values());
    }

    /**
     * Get editor instances
     * @returns {Object} Object containing editor instances
     */
  }, {
    key: "getEditors",
    value: function getEditors() {
      return {
        input: this.editor,
        output: this.outputEditor
      };
    }
  }]);
}(); // Export for use in other modules
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MonacoEditorManager);

/***/ }),

/***/ "./src/client/js/ui/aiManager.js":
/*!***************************************!*\
  !*** ./src/client/js/ui/aiManager.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/storageManager.js */ "./src/client/js/utils/storageManager.js");
/* harmony import */ var _aiCommands_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./aiCommands.js */ "./src/client/js/ui/aiCommands.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * AI Manager - Centralized AI chat functionality
 * Handles AI chat interactions, command processing, and UI management
 */



var AIManager = /*#__PURE__*/function () {
  function AIManager() {
    _classCallCheck(this, AIManager);
    this.currentMode = 'assistant';
    this.isAutoApprove = false;
    this.pendingCommandData = null;
    this.isStreaming = false;
    this.messageQueue = [];

    // Session and context management
    this.sessionId = this.generateSessionId();
    this.conversationHistory = [];
    this.userContext = {
      currentTask: null,
      lastCommand: null,
      codeContext: {
        lastAnalyzed: null,
        selectedText: null,
        cursorPosition: null,
        recentSearches: []
      },
      preferences: {
        autoExecute: false,
        verboseMode: false,
        language: 'en'
      }
    };
    this.maxHistoryLength = 20; // Keep last 20 messages for context
  }

  /**
   * Generate a unique session ID
   * @returns {string} Session ID
   */
  return _createClass(AIManager, [{
    key: "generateSessionId",
    value: function generateSessionId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Add message to conversation history
     * @param {string} role - Message role (user/ai/system)
     * @param {string} content - Message content
     */
  }, {
    key: "addToConversationHistory",
    value: function addToConversationHistory(role, content) {
      var message = {
        role: role,
        content: content,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId
      };
      this.conversationHistory.push(message);

      // Keep only the last maxHistoryLength messages
      if (this.conversationHistory.length > this.maxHistoryLength) {
        this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
      }
      console.log("\uD83D\uDCDD Added ".concat(role, " message to conversation history (").concat(this.conversationHistory.length, " total)"));
    }

    /**
     * Get conversation context for AI requests
     * @param {number} maxMessages - Maximum number of recent messages to include
     * @returns {Array} Conversation history
     */
  }, {
    key: "getConversationContext",
    value: function getConversationContext() {
      var maxMessages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
      return this.conversationHistory.slice(-maxMessages);
    }

    /**
     * Update user context
     * @param {Object} contextUpdate - Context updates
     */
  }, {
    key: "updateUserContext",
    value: function updateUserContext(contextUpdate) {
      this.userContext = _objectSpread(_objectSpread({}, this.userContext), contextUpdate);
      console.log('🔄 Updated user context:', this.userContext);
    }

    /**
     * Clear conversation history
     */
  }, {
    key: "clearConversationHistory",
    value: function clearConversationHistory() {
      this.conversationHistory = [];
      this.sessionId = this.generateSessionId();
      console.log('🗑️ Conversation history cleared, new session:', this.sessionId);
    }

    /**
     * Switch AI mode
     * @param {string} mode - New mode (assistant, editor, optimizer, teacher)
     */
  }, {
    key: "switchMode",
    value: function switchMode(mode) {
      this.currentMode = mode;
      _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].setAiMode(mode);
      this.updateModeSelector();
      console.log('AI Mode switched to:', mode);
    }

    /**
     * Toggle auto-approve setting
     */
  }, {
    key: "toggleAutoApprove",
    value: function toggleAutoApprove() {
      var toggle = document.getElementById('autoApproveToggle');
      var status = document.getElementById('autoApproveStatus');
      if (!toggle || !status) return;
      this.isAutoApprove = toggle.checked;
      status.textContent = this.isAutoApprove ? 'ON' : 'OFF';
      status.style.color = this.isAutoApprove ? '#10a37f' : '#888';
      _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].setAiAutoApprove(this.isAutoApprove);
      console.log('Auto-approve toggled:', this.isAutoApprove);
    }

    /**
     * Handle chat input keydown events
     * @param {Event} event - Keydown event
     */
  }, {
    key: "handleChatKeydown",
    value: function handleChatKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    }

    /**
     * Send AI message
     */
  }, {
    key: "sendMessage",
    value: (function () {
      var _sendMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var input, messagesContainer, userMessage, typingIndicator, context, response, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              input = document.getElementById('aiChatInput');
              messagesContainer = document.getElementById('aiChatMessages');
              if (!(!input || !messagesContainer || !input.value.trim())) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              userMessage = input.value.trim(); // Check if this is a confirmation of a pending command
              if (!this.handleUserConfirmation(userMessage, messagesContainer)) {
                _context.n = 2;
                break;
              }
              input.value = '';
              return _context.a(2);
            case 2:
              // Add user message to chat
              this.addMessage('user', "<strong>You:</strong> ".concat(userMessage));
              input.value = '';

              // Show typing indicator
              typingIndicator = this.createTypingIndicator();
              messagesContainer.appendChild(typingIndicator);
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
              _context.p = 3;
              // Get context for AI
              context = this.buildAIContext(userMessage); // Send to AI service
              _context.n = 4;
              return fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  message: userMessage,
                  context: context,
                  provider: 'local',
                  stream: true
                })
              });
            case 4:
              response = _context.v;
              if (response.ok) {
                _context.n = 5;
                break;
              }
              throw new Error("Server responded with ".concat(response.status));
            case 5:
              _context.n = 6;
              return this.handleStreamingResponse(response, messagesContainer, typingIndicator);
            case 6:
              _context.n = 8;
              break;
            case 7:
              _context.p = 7;
              _t = _context.v;
              console.error('Error getting AI response:', _t);
              this.removeTypingIndicator(typingIndicator);
              this.addMessage('ai', "<strong>\uD83E\uDD16 :</strong> <span style=\"color: #ff6b6b;\">Sorry, I encountered an error: ".concat(_t.message, "</span>"));
            case 8:
              return _context.a(2);
          }
        }, _callee, this, [[3, 7]]);
      }));
      function sendMessage() {
        return _sendMessage.apply(this, arguments);
      }
      return sendMessage;
    }()
    /**
     * Build context for AI request
     * @param {string} userMessage - User's message
     * @returns {Object} Context object
     */
    )
  }, {
    key: "buildAIContext",
    value: function buildAIContext(userMessage) {
      // This would integrate with the editor to get context
      // For now, return basic context
      return {
        currentGcode: '',
        selectedText: '',
        cursorPosition: null,
        userConfirmation: userMessage.toLowerCase().match(/\b(do it|yes|confirm|proceed|execute|go ahead)\b/) ? true : false,
        pendingCommand: null,
        timestamp: new Date().toISOString()
      };
    }

    /**
     * Handle streaming AI response
     * @param {Response} response - Fetch response
     * @param {Element} messagesContainer - Messages container element
     * @param {Element} typingIndicator - Typing indicator element
     */
  }, {
    key: "handleStreamingResponse",
    value: (function () {
      var _handleStreamingResponse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(response, messagesContainer, typingIndicator) {
        var _response$headers$get;
        var reader, decoder, buffer, responseText, aiResponseContainer, aiResponseContent, done, _yield$reader$read, value, readerDone, lines, _iterator, _step, line, data, commandMatch, command, params, _data, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              if ((_response$headers$get = response.headers.get('Content-Type')) !== null && _response$headers$get !== void 0 && _response$headers$get.includes('text/event-stream')) {
                _context2.n = 1;
                break;
              }
              // Handle non-streaming response
              this.handleNonStreamingResponse(response, messagesContainer, typingIndicator);
              return _context2.a(2);
            case 1:
              // Handle streaming response
              reader = response.body.getReader();
              decoder = new TextDecoder();
              buffer = '';
              responseText = '';
              aiResponseContainer = this.createAIMessageContainer();
              messagesContainer.removeChild(typingIndicator);
              messagesContainer.appendChild(aiResponseContainer);
              aiResponseContent = aiResponseContainer.querySelector('.ai-message-content');
              aiResponseContent.innerHTML = '<strong>🤖 :</strong> ';
              _context2.p = 2;
              done = false;
            case 3:
              if (done) {
                _context2.n = 6;
                break;
              }
              _context2.n = 4;
              return reader.read();
            case 4:
              _yield$reader$read = _context2.v;
              value = _yield$reader$read.value;
              readerDone = _yield$reader$read.done;
              done = readerDone;
              if (!done) {
                _context2.n = 5;
                break;
              }
              return _context2.a(3, 6);
            case 5:
              buffer += decoder.decode(value, {
                stream: true
              });
              lines = buffer.split('\n');
              buffer = lines.pop();
              _iterator = _createForOfIteratorHelper(lines);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  line = _step.value;
                  if (line.startsWith('data: ')) {
                    try {
                      data = JSON.parse(line.slice(6));
                      if (data.content) {
                        responseText += data.content;
                        aiResponseContent.innerHTML = "<strong>\uD83E\uDD16 :</strong> ".concat(responseText);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;

                        // Check for AI commands
                        commandMatch = responseText.match(/\/ai:(\w+)\s*\[([^\]]+)\]/);
                        if (commandMatch) {
                          command = commandMatch[1];
                          params = commandMatch[2];
                          this.showCommandActions(command, params);
                        }
                      }
                    } catch (parseError) {
                      console.warn('Failed to parse streaming data:', line, parseError);
                    }
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              _context2.n = 3;
              break;
            case 6:
              // Process remaining buffer
              if (buffer.startsWith('data: ')) {
                try {
                  _data = JSON.parse(buffer.slice(6));
                  if (_data.content) {
                    responseText += _data.content;
                    aiResponseContent.innerHTML = "<strong>\uD83E\uDD16 :</strong> ".concat(this.parseAICommands(responseText));
                  }
                } catch (parseError) {
                  console.warn('Failed to parse final streaming data:', buffer);
                }
              }
              _context2.n = 8;
              break;
            case 7:
              _context2.p = 7;
              _t2 = _context2.v;
              console.error('Error reading streaming response:', _t2);
              aiResponseContent.innerHTML = "<strong>\uD83E\uDD16 :</strong> <span style=\"color: #ff6b6b;\">Sorry, I encountered an error: ".concat(_t2.message, "</span>");
            case 8:
              return _context2.a(2);
          }
        }, _callee2, this, [[2, 7]]);
      }));
      function handleStreamingResponse(_x, _x2, _x3) {
        return _handleStreamingResponse.apply(this, arguments);
      }
      return handleStreamingResponse;
    }()
    /**
     * Handle non-streaming AI response
     * @param {Response} response - Fetch response
     * @param {Element} messagesContainer - Messages container element
     * @param {Element} typingIndicator - Typing indicator element
     */
    )
  }, {
    key: "handleNonStreamingResponse",
    value: (function () {
      var _handleNonStreamingResponse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(response, messagesContainer, typingIndicator) {
        var data, cleanResponse, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _context3.n = 1;
              return response.json();
            case 1:
              data = _context3.v;
              messagesContainer.removeChild(typingIndicator);
              if (data.success) {
                cleanResponse = this.parseAICommands(data.response);
                this.addMessage('ai', "<strong>\uD83E\uDD16 :</strong> ".concat(cleanResponse));
              } else {
                this.addMessage('ai', "<strong>\uD83E\uDD16 :</strong> <span style=\"color: #ff6b6b;\">".concat(data.error || 'Sorry, I encountered an error.', "</span>"));
              }
              _context3.n = 3;
              break;
            case 2:
              _context3.p = 2;
              _t3 = _context3.v;
              console.error('Error parsing non-streaming response:', _t3);
              messagesContainer.removeChild(typingIndicator);
              this.addMessage('ai', "<strong>\uD83E\uDD16 :</strong> <span style=\"color: #ff6b6b;\">Sorry, I encountered an error: ".concat(_t3.message, "</span>"));
            case 3:
              return _context3.a(2);
          }
        }, _callee3, this, [[0, 2]]);
      }));
      function handleNonStreamingResponse(_x4, _x5, _x6) {
        return _handleNonStreamingResponse.apply(this, arguments);
      }
      return handleNonStreamingResponse;
    }()
    /**
     * Parse and execute AI commands from response
     * @param {string} response - AI response text
     * @returns {string} Clean response with commands removed
     */
    )
  }, {
    key: "parseAICommands",
    value: function parseAICommands(response) {
      var _this = this;
      console.log('🔍 Parsing AI commands from response:', response);

      // More comprehensive command regex patterns
      var commandPatterns = [/\/ai:(\w+)\s*\[([^\]]*)\]/g,
      // /ai:command[params]
      /\/ai:(\w+)\s*(\w*)/g,
      // /ai:command params
      /\/ai:(\w+)/g // /ai:command
      ];
      var commands = [];
      var cleanResponse = response;

      // Try each pattern
      for (var _i = 0, _commandPatterns = commandPatterns; _i < _commandPatterns.length; _i++) {
        var pattern = _commandPatterns[_i];
        var match = void 0;
        while ((match = pattern.exec(response)) !== null) {
          var command = match[1];
          var params = match[2] || match[3] || '';
          commands.push({
            command: command,
            params: params,
            original: match[0]
          });
          console.log('🎯 Found AI command:', {
            command: command,
            params: params,
            original: match[0]
          });
        }
      }
      console.log('📋 Total commands found:', commands.length);

      // Execute commands using the AI Commands module
      commands.forEach(function (cmd, index) {
        console.log("\uD83D\uDD27 Executing command ".concat(index + 1, ":"), cmd.command, 'with params:', cmd.params);

        // Handle commands that are implemented in aiCommands.js
        var implementedCommands = ['insertat', 'insert', 'replace', 'replacerange', 'analyze', 'help', 'capabilities', 'status', 'find', 'getline', 'getlines', 'getcontent', 'getselection', 'getcursor'];
        if (implementedCommands.includes(cmd.command)) {
          try {
            console.log('🚀 Executing AI command:', cmd.command);
            _aiCommands_js__WEBPACK_IMPORTED_MODULE_1__["default"].executePendingCommand(cmd.command, cmd.params);

            // Add success feedback
            _this.addSystemMessage("<strong>\uD83E\uDD16 :</strong> \u2705 Executed command: <code>".concat(cmd.original, "</code>"));
            console.log('✅ AI command executed successfully:', cmd.command);
          } catch (error) {
            console.error('❌ Error executing AI command:', cmd.command, error);
            _this.addSystemMessage("<strong>\uD83E\uDD16 :</strong> <span style=\"color: #ff6b6b;\">\u274C Error executing command ".concat(cmd.command, ": ").concat(error.message, "</span>"));
          }
        } else {
          console.warn('⚠️ Unknown command:', cmd.command);
          _this.addSystemMessage("<strong>\uD83E\uDD16 :</strong> <span style=\"color: #ffa500;\">\u26A0\uFE0F Unknown command: ".concat(cmd.command, "</span>"));
        }

        // Remove the command from the response text
        cleanResponse = cleanResponse.replace(cmd.original, '').trim();
      });
      console.log('📝 Clean response after command removal:', cleanResponse);
      return cleanResponse;
    }

    /**
     * Add message to chat
     * @param {string} sender - Message sender (user/ai)
     * @param {string} content - Message content
     */
  }, {
    key: "addMessage",
    value: function addMessage(sender, content) {
      var messagesContainer = document.getElementById('aiChatMessages');
      if (!messagesContainer) return;
      var messageDiv = document.createElement('div');
      messageDiv.className = "ai-message ai-".concat(sender);
      messageDiv.innerHTML = "<div class=\"ai-message-content\">".concat(content, "</div>");
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
     * Create typing indicator element
     * @returns {Element} Typing indicator element
     */
  }, {
    key: "createTypingIndicator",
    value: function createTypingIndicator() {
      var typingIndicator = document.createElement('div');
      typingIndicator.className = 'ai-message ai-typing';
      typingIndicator.innerHTML = '<div class="ai-message-content"><strong>🤖 :</strong> <em>Thinking...</em></div>';
      return typingIndicator;
    }

    /**
     * Create AI message container
     * @returns {Element} AI message container element
     */
  }, {
    key: "createAIMessageContainer",
    value: function createAIMessageContainer() {
      var container = document.createElement('div');
      container.className = 'ai-message ai-ai';
      var content = document.createElement('div');
      content.className = 'ai-message-content';
      container.appendChild(content);
      return container;
    }

    /**
     * Remove typing indicator
     * @param {Element} typingIndicator - Typing indicator element
     */
  }, {
    key: "removeTypingIndicator",
    value: function removeTypingIndicator(typingIndicator) {
      if (typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
      }
    }

    /**
     * Show command actions UI
     * @param {string} command - AI command
     * @param {string} params - Command parameters
     */
  }, {
    key: "showCommandActions",
    value: function showCommandActions(command, params) {
      console.log('Showing command actions for:', command, params);
      this.pendingCommandData = {
        command: command,
        params: params
      };
      var actionsDiv = document.getElementById('aiCommandActions');
      var previewDiv = document.getElementById('commandPreview');
      var executeBtn = document.getElementById('executeAiCommandBtn');
      if (!actionsDiv || !previewDiv || !executeBtn) {
        console.error('Command actions UI elements not found');
        return;
      }

      // Set command preview
      var previewText = "/".concat(command);
      if (params) {
        previewText += " [".concat(params, "]");
      }
      previewDiv.textContent = previewText;

      // Update button text based on command type
      var commandNames = {
        insertat: 'Insert at Position',
        insert: 'Insert at Cursor',
        replace: 'Replace Selection',
        analyze: 'Analyze Code'
      };
      executeBtn.innerHTML = "\n      <svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"currentColor\">\n        <path d=\"M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 5.5L7.25 10.75 4.5 8l1.5-1.5 1.25 1.25L10 4l1.5 1.5z\"/>\n      </svg>\n      ".concat(commandNames[command] || 'Execute Command', "\n    ");

      // Show the actions UI
      actionsDiv.style.display = 'block';
      actionsDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }

    /**
     * Hide command actions UI
     */
  }, {
    key: "hideCommandActions",
    value: function hideCommandActions() {
      var actionsDiv = document.getElementById('aiCommandActions');
      if (actionsDiv) {
        actionsDiv.style.display = 'none';
      }
      this.pendingCommandData = null;
      console.log('Command actions UI hidden');
    }

    /**
     * Execute pending command from UI
     */
  }, {
    key: "executePendingCommandFromUI",
    value: function executePendingCommandFromUI() {
      if (!this.pendingCommandData) {
        console.error('No pending command data');
        return;
      }
      var _this$pendingCommandD = this.pendingCommandData,
        command = _this$pendingCommandD.command,
        params = _this$pendingCommandD.params;
      console.log('Executing pending command from UI:', command, params);
      try {
        _aiCommands_js__WEBPACK_IMPORTED_MODULE_1__["default"].executePendingCommand(command, params);
        console.log('✅ AI command executed successfully from UI:', command);
        this.hideCommandActions();
      } catch (error) {
        console.error('❌ Error executing AI command from UI:', command, error);
        this.addSystemMessage("<strong>System:</strong> Error executing command ".concat(command, ": ").concat(error.message));
        this.hideCommandActions();
      }
    }

    /**
     * Handle user confirmation for pending commands
     * @param {string} userMessage - User's message
     * @param {Element} messagesContainer - Messages container
     * @returns {boolean} Whether a confirmation was handled
     */
  }, {
    key: "handleUserConfirmation",
    value: function handleUserConfirmation(userMessage, messagesContainer) {
      var confirmationWords = /\b(do it|yes|confirm|proceed|execute|go ahead|please|sure|ok)\b/i;
      if (!confirmationWords.test(userMessage)) {
        return false;
      }
      var lastAiMessage = Array.from(messagesContainer.querySelectorAll('.ai-message.ai-ai')).pop();
      if (!lastAiMessage) return false;
      var aiMessageText = lastAiMessage.textContent;
      console.log('Checking for pending commands in:', aiMessageText);
      var commandMatch = aiMessageText.match(/\/ai:(\w+)\s*\[([^\]]+)\]/);
      if (commandMatch) {
        var command = commandMatch[1];
        var params = commandMatch[2];
        console.log('Found pending command:', command, 'with params:', params);

        // Execute the confirmed command
        try {
          _aiCommands_js__WEBPACK_IMPORTED_MODULE_1__["default"].executePendingCommand(command, params);
          console.log('✅ Confirmed command executed successfully:', command);

          // Add success message
          this.addMessage('ai', "<strong>\uD83E\uDD16 :</strong> Command executed successfully! ".concat(command, " with parameters: ").concat(params));
        } catch (error) {
          console.error('❌ Error executing confirmed command:', command, error);
          this.addMessage('ai', "<strong>\uD83E\uDD16 :</strong> <span style=\"color: #ff6b6b;\">Error executing confirmed command: ".concat(error.message, "</span>"));
        }
        return true;
      }
      return false;
    }

    /**
     * Update mode selector UI
     */
  }, {
    key: "updateModeSelector",
    value: function updateModeSelector() {
      var modeSelector = document.getElementById('aiMode');
      if (modeSelector) {
        modeSelector.value = this.currentMode;
      }
    }

    /**
     * Update auto-approve toggle UI
     */
  }, {
    key: "updateAutoApproveToggle",
    value: function updateAutoApproveToggle() {
      var toggle = document.getElementById('autoApproveToggle');
      var status = document.getElementById('autoApproveStatus');
      if (toggle) toggle.checked = this.isAutoApprove;
      if (status) {
        status.textContent = this.isAutoApprove ? 'ON' : 'OFF';
        status.style.color = this.isAutoApprove ? '#10a37f' : '#888';
      }
    }

    /**
     * Show AI chat modal
     */
  }, {
    key: "showAiChat",
    value: function showAiChat() {
      //console.log('================================================================showAiChat called');
      var modal = document.getElementById('aiChatModal');
      //console.log('Modal element:', modal);

      if (modal) {
        modal.style.display = 'block';
        //console.log('Modal opened');

        // Load settings when modal opens
        this.loadSettings();

        // Dropdown state is now managed by DropdownManager

        // Focus the input after a short delay
        setTimeout(function () {
          var input = document.getElementById('aiChatInput');
          console.log('Input element:', input);
          if (input) {
            input.focus();
            console.log('Input focused');
          }
        }, 100);
      } else {
        console.error('aiChatModal not found!');
      }
    }

    /**
     * Close AI chat modal
     */
  }, {
    key: "closeAiChat",
    value: function closeAiChat() {
      var modal = document.getElementById('aiChatModal');
      if (modal) {
        modal.style.display = 'none';
      }

      // Dropdown closing is now handled by the centralized dropdown system
    }

    /**
     * Send AI message (alias for sendMessage)
     */
  }, {
    key: "sendAiMessage",
    value: function sendAiMessage() {
      return this.sendMessage();
    }

    /**
     * Handle AI chat keydown events (alias for handleChatKeydown)
     * @param {Event} event - Keydown event
     */
  }, {
    key: "handleAiChatKeydown",
    value: function handleAiChatKeydown(event) {
      return this.handleChatKeydown(event);
    }

    /**
     * Change AI mode
     * @param {string} mode - New mode to switch to
     */
  }, {
    key: "changeAiMode",
    value: function changeAiMode(mode) {
      this.switchMode(mode);
      this.showAiChat();
    }

    /**
     * Switch AI mode (alias for switchMode for global access)
     * @param {string} mode - New mode to switch to
     */
  }, {
    key: "switchAiMode",
    value: function switchAiMode(mode) {
      this.switchMode(mode);
      // Dropdown closing is now handled by the centralized dropdown system
    }

    /**
     * AI Quick Actions Handler
     * @param {string} action - Quick action type
     */
  }, {
    key: "aiQuickAction",
    value: function aiQuickAction(action) {
      var _this2 = this;
      // Dropdown closing is now handled by the centralized dropdown system

      // Show the AI chat modal
      this.showAiChat();

      // Get the AI chat input element
      var aiInput = document.getElementById('aiChatInput');
      if (!aiInput) return;

      // Get current editor content and selection
      var editorContent = this.getCurrentEditorContent();
      var selectedText = this.getSelectedText();
      var cursorPos = this.getCursorPosition();

      // Set the appropriate prompt based on the action
      var prompt = '';
      switch (action) {
        case 'review':
          prompt = 'Please review my G-code for best practices, potential issues, and optimization opportunities. Use the /ai:analyze command to examine the code.';
          break;
        case 'optimize':
          prompt = 'Please optimize my G-code to improve efficiency, reduce machining time, and maintain accuracy. Use the /ai:analyze command first, then suggest optimizations with /ai:write if needed.';
          break;
        case 'explain':
          if (selectedText) {
            prompt = "Please explain the following G-code section:\n\n".concat(selectedText, "\n\nUse the /ai:getlines command to retrieve more context if needed.");
          } else {
            prompt = 'Please explain how my G-code works and what each section does. Use the /ai:getlines command to examine specific parts of the code.';
          }
          break;
        case 'analyze':
          prompt = 'Please analyze my G-code and provide detailed statistics about its structure and complexity. Use the /ai:analyze command to perform the analysis.';
          break;
        case 'debug':
          prompt = 'Please help me debug my G-code. Look for potential issues, syntax errors, or logical problems. Use the /ai:analyze command to examine the code thoroughly.';
          break;
        case 'convert':
          prompt = 'Please help me convert or modify my G-code format. Use the /ai:analyze command first to understand the current format, then suggest conversions.';
          break;
        case 'simulate':
          prompt = 'Please help me understand how this G-code will execute. Use the /ai:analyze command to examine the toolpath and movements.';
          break;
        default:
          prompt = 'Please help me with my G-code. Feel free to use any of your available commands to interact with the code.';
      }

      // Add context to the prompt
      if (editorContent) {
        prompt += "\n\nCurrent G-code content (first 500 characters):\n".concat(editorContent.substring(0, 500)).concat(editorContent.length > 500 ? '...' : '');
      }
      if (cursorPos) {
        prompt += "\n\nCursor position: Line ".concat(cursorPos.lineNumber, ", Column ").concat(cursorPos.column);
      }

      // Set the prompt in the AI chat input
      aiInput.value = prompt;

      // Focus the input
      aiInput.focus();

      // Send the message automatically after a short delay to allow the modal to fully open
      setTimeout(function () {
        _this2.sendMessage();
      }, 300);
    }

    /**
     * Get current editor content
     * @returns {string} Current editor content
     */
  }, {
    key: "getCurrentEditorContent",
    value: function getCurrentEditorContent() {
      if (window.editorManager) {
        return window.editorManager.getInputValue();
      }
      if (window.editor) {
        return window.editor.getValue();
      }
      return '';
    }

    /**
     * Get selected text from editor
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
     * Get cursor position from editor
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
     * Test function for AI commands
     */
  }, {
    key: "testAICommands",
    value: function testAICommands() {
      console.log('=== TESTING AI COMMANDS EXECUTION ===');

      // Test 1: Basic command parsing
      console.log('\n1. Testing AI command parsing...');
      var testResponse = 'I will analyze your code now. /ai:analyze';
      console.log('Test response:', testResponse);
      var result = this.parseAICommands(testResponse);
      console.log('Parse result:', result);

      // Test 2: Multiple commands
      console.log('\n2. Testing multiple AI commands...');
      var multiCommandResponse = 'Let me help you. /ai:analyze and then /ai:insert["Hello World"]';
      console.log('Multi-command response:', multiCommandResponse);
      var multiResult = this.parseAICommands(multiCommandResponse);
      console.log('Multi-command parse result:', multiResult);

      // Test 3: Direct command execution
      console.log('\n3. Testing direct command execution...');
      try {
        console.log('Executing /ai:analyze command directly...');
        _aiCommands_js__WEBPACK_IMPORTED_MODULE_1__["default"].executePendingCommand('analyze', '');
        console.log('✅ Direct command execution successful');
      } catch (error) {
        console.error('❌ Direct command execution failed:', error);
      }
      console.log('\n=== AI COMMANDS TEST COMPLETE ===');
    }

    /**
     * Test editor functionality
     */
  }, {
    key: "testEditor",
    value: function testEditor() {
      console.log('=== EDITOR DEBUG TEST ===');
      console.log('window.editor exists:', !!window.editor);
      console.log('window.editorManager exists:', !!window.editorManager);
      if (window.editor) {
        console.log('Editor value (first 200 chars):', window.editor.getValue().substring(0, 200));
        console.log('Editor position:', window.editor.getPosition());
        console.log('Editor model exists:', !!window.editor.getModel());

        // Test inserting text at cursor
        try {
          var pos = window.editor.getPosition();
          console.log('Testing insert at cursor position:', pos);
          var result = window.editor.executeEdits('test', [{
            range: {
              startLineNumber: pos.lineNumber,
              startColumn: pos.column,
              endLineNumber: pos.lineNumber,
              endColumn: pos.column
            },
            text: '// EDITOR TEST - This should appear!'
          }]);
          console.log('Test insert result:', result);
          console.log('New editor content (first 200 chars):', window.editor.getValue().substring(0, 200));
        } catch (error) {
          console.error('Test insert failed:', error);
        }
      } else {
        console.error('Editor not available for testing');
      }
      console.log('=== END EDITOR DEBUG TEST ===');
    }

    /**
     * Test function to verify AI agent integration
     */
  }, {
    key: "testAIIntegration",
    value: function testAIIntegration() {
      console.log('Testing AI Agent Integration...');

      // Test getting GGcode content
      var content = this.getCurrentEditorContent();
      console.log('Current GGcode content:', content.substring(0, 100) + '...');

      // Test getting cursor position
      var cursorPos = this.getCursorPosition();
      console.log('Cursor position:', cursorPos);

      // Test getting selected text
      var selectedText = this.getSelectedText();
      console.log('Selected text:', selectedText);

      // Test analysis
      var analysis = this.analyzeCode ? this.analyzeCode() : {};
      console.log('GGcode analysis:', analysis);
      console.log('AI Agent integration test completed successfully.');
    }

    /**
     * Test AI command parsing and execution
     */
  }, {
    key: "testAICommandParsing",
    value: function testAICommandParsing() {
      var _this3 = this;
      console.log('=== TESTING AI COMMAND PARSING ===');
      var testCases = ['I will analyze your code now. /ai:analyze', 'Let me help you with /ai:analyze[]', 'Please use /ai:find["variable"] to search', 'Try this command: /ai:getlines[1,10]', 'Multiple commands: /ai:analyze and /ai:find["test"]', 'No commands here, just regular text.', '/ai:unknowncommand should be unknown', '/ai:analyze["some param"] with parameters'];
      testCases.forEach(function (testCase, index) {
        console.log("\n\uD83D\uDCDD Test Case ".concat(index + 1, ": \"").concat(testCase, "\""));
        console.log('🔍 Parsing result:');
        var result = _this3.parseAICommands(testCase);
        console.log('📝 Clean result:', "\"".concat(result, "\""));
      });
      console.log('\n=== AI COMMAND PARSING TEST COMPLETE ===');
    }

    /**
     * Direct test of command execution
     */
  }, {
    key: "testDirectCommandExecution",
    value: function testDirectCommandExecution() {
      console.log('=== TESTING DIRECT COMMAND EXECUTION ===');
      var testCommands = [{
        command: 'analyze',
        params: ''
      }, {
        command: 'help',
        params: ''
      }, {
        command: 'status',
        params: ''
      }, {
        command: 'find',
        params: '"variable"'
      }, {
        command: 'getlines',
        params: '1,5'
      }];
      testCommands.forEach(function (cmd, index) {
        console.log("\n\uD83D\uDD27 Test Command ".concat(index + 1, ": /ai:").concat(cmd.command, "[").concat(cmd.params, "]"));
        try {
          console.log('🚀 Executing command...');
          _aiCommands_js__WEBPACK_IMPORTED_MODULE_1__["default"].executePendingCommand(cmd.command, cmd.params);
          console.log('✅ Command executed successfully');

          // Add a small delay between commands
          if (index < testCommands.length - 1) {
            setTimeout(function () {}, 100);
          }
        } catch (error) {
          console.error('❌ Command execution failed:', error);
        }
      });
      console.log('\n=== DIRECT COMMAND EXECUTION TEST COMPLETE ===');
    }

    /**
     * Initialize the AI Manager
     * Called when the application starts
     */
  }, {
    key: "initialize",
    value: function initialize() {
      //console.log('🤖 AI Manager initializing...');

      try {
        // Load saved settings
        this.loadSettings();

        // Setup event listeners
        this.setupEventListeners();

        //console.log('✅ AI Manager initialized successfully');
        return true;
      } catch (error) {
        console.error('❌ AI Manager initialization failed:', error);
        return false;
      }
    }

    /**
     * Load saved settings from storage
     */
  }, {
    key: "loadSettings",
    value: function loadSettings() {
      try {
        // Load AI mode
        var savedMode = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAiMode();
        if (savedMode) {
          this.currentMode = savedMode;
        }

        // Load auto-approve setting
        var savedAutoApprove = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAiAutoApprove();
        if (savedAutoApprove !== null) {
          this.isAutoApprove = savedAutoApprove;
        }

        // Update UI elements
        this.updateModeSelector();
        this.updateAutoApproveToggle();

        // Button state is now managed by DropdownManager

        // console.log('⚙️ AI settings loaded:', {
        //     mode: this.currentMode,
        //     autoApprove: this.isAutoApprove
        // });
      } catch (error) {
        console.warn('⚠️ Failed to load AI settings:', error);
      }
    }

    /**
     * Setup event listeners
     */
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this4 = this;
      // AI chat input keydown

      var aiChatInput = document.getElementById('aiChatInput');
      if (aiChatInput) {
        aiChatInput.addEventListener('keydown', function (event) {
          _this4.handleChatKeydown(event);
        });
      }

      // Auto-approve toggle
      var autoApproveToggle = document.getElementById('autoApproveToggle');
      if (autoApproveToggle) {
        autoApproveToggle.addEventListener('change', function () {
          _this4.toggleAutoApprove();
        });
      }

      // Execute AI command button
      var executeAiCommandBtn = document.getElementById('executeAiCommandBtn');
      if (executeAiCommandBtn) {
        executeAiCommandBtn.addEventListener('click', function () {
          _this4.executePendingCommandFromUI();
        });
      }

      //console.log('🎧 AI event listeners setup complete');
    }
  }]);
}(); // Create and export singleton instance
var aiManager = new AIManager();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (aiManager);

/***/ }),

/***/ "./src/client/js/ui/exampleManager.js":
/*!********************************************!*\
  !*** ./src/client/js/ui/exampleManager.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/storageManager.js */ "./src/client/js/utils/storageManager.js");
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
 * Example Manager Module
 * Handles loading and managing example files
 */


var ExampleManager = /*#__PURE__*/function () {
  function ExampleManager(apiManager, editorManager) {
    _classCallCheck(this, ExampleManager);
    this.apiManager = apiManager;
    this.editorManager = editorManager;
    this.lastOpenedFilename = '';

    // Ensure loadExample is globally available
    this.ensureGlobalFunction();
  }

  /**
   * Show examples modal
   */
  return _createClass(ExampleManager, [{
    key: "showExamples",
    value: function showExamples() {
      var _this = this;
      if (window.showModal) {
        window.showModal('examplesModal');
      }
      this.loadExamples();
      // Setup examples search after examples are loaded
      setTimeout(function () {
        return _this.setupExamplesSearch();
      }, 100);
      // Focus search input
      setTimeout(function () {
        var searchInput = document.getElementById('examplesSearchInput');
        if (searchInput) {
          searchInput.focus();
        }
      }, 200);
    }

    /**
     * Load examples list
     */
  }, {
    key: "loadExamples",
    value: (function () {
      var _loadExamples = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var examplesList, examples, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              examplesList = document.getElementById('examplesList');
              if (examplesList) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              _context.p = 1;
              _context.n = 2;
              return this.apiManager.examples.getList();
            case 2:
              examples = _context.v;
              if (examples && examples.length > 0) {
                examplesList.innerHTML = examples.map(function (file) {
                  return "\n                    <div class=\"example-item\" onclick=\"loadExample('".concat(file.name, "')\">\n                        <div class=\"example-title\">").concat(file.name, "</div>\n                        <div class=\"example-description\">").concat(file.description || 'Click to load this example', "</div>\n                        <div class=\"example-preview\">").concat(file.preview || '', "</div>\n                    </div>\n                ");
                }).join('');
              } else {
                examplesList.innerHTML = '<p style="color: #cccccc;">Failed to load examples</p>';
              }
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              examplesList.innerHTML = '<p style="color: #cccccc;">Error loading examples: ' + _t.message + '</p>';
            case 4:
              return _context.a(2);
          }
        }, _callee, this, [[1, 3]]);
      }));
      function loadExamples() {
        return _loadExamples.apply(this, arguments);
      }
      return loadExamples;
    }()
    /**
     * Load specific example
     */
    )
  }, {
    key: "loadExample",
    value: (function () {
      var _loadExample = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(filename) {
        var result, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return this.apiManager.examples.getContent(filename);
            case 1:
              result = _context2.v;
              if (result && result.content) {
                // Set the correct editor based on file type
                if (filename.endsWith('.ggcode')) {
                  if (this.editorManager) {
                    this.editorManager.setInputValue(result.content);
                    this.editorManager.setLastOpenedFilename(filename);
                  }
                } else if (filename.endsWith('.gcode')) {
                  if (this.editorManager) {
                    this.editorManager.setOutputValue(result.content);
                  }
                }
                // Remember filename
                this.lastOpenedFilename = filename;
                _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].setLastFilename(this.lastOpenedFilename);
                // Direct compilation after file load
                if (window.submitGGcode) {
                  window.submitGGcode(new Event('submit'));
                }
                if (window.closeModal) {
                  window.closeModal('examplesModal');
                }
              } else {
                alert('Failed to load example: No content available');
              }
              _context2.n = 3;
              break;
            case 2:
              _context2.p = 2;
              _t2 = _context2.v;
              alert('Error loading example: ' + _t2.message);
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 2]]);
      }));
      function loadExample(_x) {
        return _loadExample.apply(this, arguments);
      }
      return loadExample;
    }()
    /**
     * Setup examples search
     */
    )
  }, {
    key: "setupExamplesSearch",
    value: function setupExamplesSearch() {
      // TODO: Implement examples search functionality
      console.log('Examples search setup - TODO');
    }

    /**
     * Fallback loadExample function for direct HTML onclick calls
     * This ensures loadExample is always available globally
     */
  }, {
    key: "ensureGlobalFunction",
    value: function ensureGlobalFunction() {
      if (typeof window !== 'undefined') {
        window.loadExample = window.loadExample || function (filename) {
          if (window.applicationManager) {
            window.applicationManager.getExampleManager().loadExample(filename);
          }
        };
      }
    }

    /**
     * Get last opened filename
     */
  }, {
    key: "getLastOpenedFilename",
    value: function getLastOpenedFilename() {
      return this.lastOpenedFilename;
    }

    /**
     * Set last opened filename
     */
  }, {
    key: "setLastOpenedFilename",
    value: function setLastOpenedFilename(filename) {
      this.lastOpenedFilename = filename;
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ExampleManager);

/***/ }),

/***/ "./src/client/js/ui/fileOperations.js":
/*!********************************************!*\
  !*** ./src/client/js/ui/fileOperations.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _fileOps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fileOps.js */ "./src/client/js/ui/fileOps.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * File Operations Module
 * Handles file-related operations like copy, save, clear
 */


var FileOperationsManager = /*#__PURE__*/function () {
  function FileOperationsManager(editorManager) {
    _classCallCheck(this, FileOperationsManager);
    this.editorManager = editorManager;
    this.fileOperations = new _fileOps_js__WEBPACK_IMPORTED_MODULE_0__.FileOperations();
  }

  /**
   * Copy output to clipboard
   */
  return _createClass(FileOperationsManager, [{
    key: "copyOutput",
    value: function copyOutput() {
      if (this.fileOperations) {
        this.fileOperations.copyOutput();
      } else {
        console.error('FileOperations module not available');
      }
    }

    /**
     * Save output to file
     */
  }, {
    key: "saveOutput",
    value: function saveOutput() {
      if (this.fileOperations) {
        this.fileOperations.saveOutput();
      } else {
        console.error('FileOperations module not available');
      }
    }

    /**
     * Save GGcode to file
     */
  }, {
    key: "saveGGcode",
    value: function saveGGcode() {
      if (this.fileOperations) {
        this.fileOperations.saveGGcode();
      } else {
        console.error('FileOperations module not available');
      }
    }

    /**
     * Clear saved content and settings
     */
  }, {
    key: "clearMemory",
    value: function clearMemory() {
      if (this.fileOperations) {
        this.fileOperations.clearMemory();
      } else {
        console.error('FileOperations module not available');
      }
    }

    /**
     * Save current content (legacy function for backward compatibility)
     */
  }, {
    key: "saveContent",
    value: function saveContent() {
      if (this.editorManager) {
        this.editorManager.saveContent();
      }
    }

    /**
     * Sync editors (legacy function for backward compatibility)
     */
  }, {
    key: "syncEditors",
    value: function syncEditors() {
      if (this.editorManager) {
        var ggcodeElement = document.getElementById('ggcode');
        if (ggcodeElement) {
          ggcodeElement.value = this.editorManager.getInputValue();
        }
      }
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FileOperationsManager);

/***/ }),

/***/ "./src/client/js/ui/fileOps.js":
/*!*************************************!*\
  !*** ./src/client/js/ui/fileOps.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileOperations: () => (/* binding */ FileOperations),
/* harmony export */   fileOperations: () => (/* binding */ fileOperations)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * File Operations Module
 *
 * Provides advanced file handling capabilities including:
 * - File validation and type detection
 * - Content processing and transformation
 * - Error handling and recovery
 * - File format conversion utilities
 */
var FileOperations = /*#__PURE__*/function () {
  function FileOperations() {
    _classCallCheck(this, FileOperations);
    this.supportedExtensions = {
      input: ['.ggcode', '.txt'],
      output: ['.gcode', '.nc', '.cnc'],
      all: ['.ggcode', '.txt', '.gcode', '.nc', '.cnc']
    };
    this.maxFileSize = 10 * 1024 * 1024; // 10MB limit
  }

  /**
   * Validate file before processing
   * @param {File} file - The file to validate
   * @returns {Object} Validation result with success flag and message
   */
  return _createClass(FileOperations, [{
    key: "validateFile",
    value: function validateFile(file) {
      if (!file) {
        return {
          success: false,
          message: 'No file provided'
        };
      }

      // Check file size
      if (file.size > this.maxFileSize) {
        return {
          success: false,
          message: "File too large. Maximum size is ".concat(this.maxFileSize / (1024 * 1024), "MB")
        };
      }

      // Check if file is empty
      if (file.size === 0) {
        return {
          success: false,
          message: 'File is empty'
        };
      }

      // Check file extension
      var extension = this.getFileExtension(file.name);
      if (!this.supportedExtensions.all.includes(extension)) {
        return {
          success: false,
          message: "Unsupported file type. Supported: ".concat(this.supportedExtensions.all.join(', '))
        };
      }
      return {
        success: true,
        message: 'File is valid'
      };
    }

    /**
     * Get file extension from filename
     * @param {string} filename - The filename
     * @returns {string} The file extension (including dot)
     */
  }, {
    key: "getFileExtension",
    value: function getFileExtension(filename) {
      var lastDot = filename.lastIndexOf('.');
      return lastDot > 0 ? filename.slice(lastDot).toLowerCase() : '';
    }

    /**
     * Determine file type based on extension and content
     * @param {string} filename - The filename
     * @param {string} content - The file content
     * @returns {string} File type ('ggcode', 'gcode', 'unknown')
     */
  }, {
    key: "determineFileType",
    value: function determineFileType(filename, content) {
      var extension = this.getFileExtension(filename);

      // Check by extension first
      if (this.supportedExtensions.input.includes(extension)) {
        return 'ggcode';
      }
      if (this.supportedExtensions.output.includes(extension)) {
        return 'gcode';
      }

      // Check by content patterns
      if (this.isGGcodeContent(content)) {
        return 'ggcode';
      }
      if (this.isGcodeContent(content)) {
        return 'gcode';
      }
      return 'unknown';
    }

    /**
     * Check if content appears to be GGcode
     * @param {string} content - The file content
     * @returns {boolean} True if content appears to be GGcode
     */
  }, {
    key: "isGGcodeContent",
    value: function isGGcodeContent(content) {
      // Look for GGcode-specific patterns
      var ggcodePatterns = [/\blet\s+\w+\s*=/,
      // Variable declarations
      /\bfor\s*\(/,
      // For loops
      /\bif\s*\(/,
      // If statements
      /\bfunction\s+\w+/,
      // Function definitions
      /\/\/\/\s*@/,
      // Configurator comments
      /\b(sin|cos|tan|sqrt|abs)\s*\(/ // Math functions
      ];
      return ggcodePatterns.some(function (pattern) {
        return pattern.test(content);
      });
    }

    /**
     * Check if content appears to be G-code
     * @param {string} content - The file content
     * @returns {boolean} True if content appears to be G-code
     */
  }, {
    key: "isGcodeContent",
    value: function isGcodeContent(content) {
      // Look for G-code patterns
      var gcodePatterns = [/^[GM]\d+/m,
      // G or M commands at line start
      /[XYZ]-?\d+\.?\d*/,
      // Coordinate values
      /^N\d+/m,
      // Line numbers
      /F\d+/,
      // Feed rates
      /S\d+/ // Spindle speeds
      ];
      return gcodePatterns.some(function (pattern) {
        return pattern.test(content);
      });
    }

    /**
     * Process file content based on type
     * @param {string} content - The file content
     * @param {string} type - The file type
     * @returns {Object} Processed content with metadata
     */
  }, {
    key: "processContent",
    value: function processContent(content, type) {
      var result = {
        content: content,
        type: type,
        lineCount: 0,
        hasErrors: false,
        errors: [],
        warnings: []
      };

      // Count lines
      result.lineCount = content.split('\n').length;

      // Type-specific processing
      if (type === 'ggcode') {
        this.processGGcodeContent(result);
      } else if (type === 'gcode') {
        this.processGcodeContent(result);
      }
      return result;
    }

    /**
     * Process GGcode content for validation and analysis
     * @param {Object} result - The result object to update
     */
  }, {
    key: "processGGcodeContent",
    value: function processGGcodeContent(result) {
      var lines = result.content.split('\n');
      lines.forEach(function (line, index) {
        var lineNum = index + 1;
        var trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//')) return;

        // Check for common syntax issues
        if (trimmed.includes('let ') && !trimmed.includes('=')) {
          result.warnings.push("Line ".concat(lineNum, ": Variable declaration without assignment"));
        }

        // Check for unmatched brackets
        var openBrackets = (trimmed.match(/\(/g) || []).length;
        var closeBrackets = (trimmed.match(/\)/g) || []).length;
        if (openBrackets !== closeBrackets) {
          result.warnings.push("Line ".concat(lineNum, ": Unmatched parentheses"));
        }
      });
    }

    /**
     * Process G-code content for validation and analysis
     * @param {Object} result - The result object to update
     */
  }, {
    key: "processGcodeContent",
    value: function processGcodeContent(result) {
      var lines = result.content.split('\n');
      var hasMotionCommands = false;
      lines.forEach(function (line) {
        var trimmed = line.trim().toUpperCase();
        if (!trimmed || trimmed.startsWith('(') || trimmed.startsWith(';')) return;

        // Check for motion commands
        if (/G[0123]/.test(trimmed)) {
          hasMotionCommands = true;
        }

        // Check for coordinates without motion commands
        if (/[XYZ]-?\d/.test(trimmed) && !/G[0123]/.test(trimmed)) {
          // This might be modal G-code, which is normal
        }
      });
      if (!hasMotionCommands) {
        result.warnings.push('No motion commands (G0, G1, G2, G3) found');
      }
    }

    /**
     * Read file with progress tracking
     * @param {File} file - The file to read
     * @param {Function} onProgress - Progress callback (optional)
     * @returns {Promise<Object>} Promise resolving to file data
     */
  }, {
    key: "readFileWithProgress",
    value: (function () {
      var _readFileWithProgress = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(file) {
        var _this = this;
        var onProgress,
          _args = arguments;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              onProgress = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
              return _context.a(2, new Promise(function (resolve, reject) {
                var validation = _this.validateFile(file);
                if (!validation.success) {
                  reject(new Error(validation.message));
                  return;
                }
                var reader = new FileReader();
                reader.onprogress = function (e) {
                  if (onProgress && e.lengthComputable) {
                    var progress = e.loaded / e.total * 100;
                    onProgress(progress);
                  }
                };
                reader.onload = function (e) {
                  try {
                    var content = e.target.result;
                    var type = _this.determineFileType(file.name, content);
                    var processed = _this.processContent(content, type);
                    resolve(_objectSpread({
                      filename: file.name,
                      size: file.size,
                      lastModified: new Date(file.lastModified)
                    }, processed));
                  } catch (error) {
                    reject(error);
                  }
                };
                reader.onerror = function () {
                  reject(new Error('Failed to read file'));
                };
                reader.readAsText(file);
              }));
          }
        }, _callee);
      }));
      function readFileWithProgress(_x) {
        return _readFileWithProgress.apply(this, arguments);
      }
      return readFileWithProgress;
    }()
    /**
     * Create a downloadable file from content
     * @param {string} content - The file content
     * @param {string} filename - The filename
     * @param {string} mimeType - The MIME type (optional)
     * @returns {Object} Download information
     */
    )
  }, {
    key: "createDownload",
    value: function createDownload(content, filename) {
      var mimeType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'text/plain';
      try {
        var blob = new Blob([content], {
          type: mimeType
        });
        var url = URL.createObjectURL(blob);
        return {
          success: true,
          blob: blob,
          url: url,
          filename: filename,
          size: blob.size
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }

    /**
     * Convert content between formats
     * @param {string} content - The content to convert
     * @param {string} fromType - Source format
     * @param {string} toType - Target format
     * @returns {Object} Conversion result
     */
  }, {
    key: "convertFormat",
    value: function convertFormat(content, fromType, toType) {
      if (fromType === toType) {
        return {
          success: true,
          content: content
        };
      }

      // Currently no format conversion is implemented
      // This is a placeholder for future format conversion features
      return {
        success: false,
        error: "Conversion from ".concat(fromType, " to ").concat(toType, " not supported")
      };
    }

    /**
     * Get file statistics
     * @param {string} content - The file content
     * @param {string} type - The file type
     * @returns {Object} File statistics
     */
  }, {
    key: "getFileStats",
    value: function getFileStats(content, type) {
      var lines = content.split('\n');
      var stats = {
        totalLines: lines.length,
        nonEmptyLines: lines.filter(function (line) {
          return line.trim();
        }).length,
        commentLines: 0,
        codeLines: 0,
        size: new Blob([content]).size
      };
      if (type === 'ggcode') {
        stats.commentLines = lines.filter(function (line) {
          return line.trim().startsWith('//');
        }).length;
        stats.codeLines = stats.nonEmptyLines - stats.commentLines;
      } else if (type === 'gcode') {
        stats.commentLines = lines.filter(function (line) {
          var trimmed = line.trim();
          return trimmed.startsWith('(') || trimmed.startsWith(';');
        }).length;
        stats.codeLines = stats.nonEmptyLines - stats.commentLines;
      }
      return stats;
    }

    /**
     * Copy output G-code to clipboard
     */
  }, {
    key: "copyOutput",
    value: function copyOutput() {
      // Find the copy button for visual feedback
      var copyButton = document.querySelector('button[onclick*="copyOutput"], button[title*="Copy output"]');
      if (!window.outputEditor || typeof window.outputEditor.getValue !== 'function') {
        alert('No output content available to copy');
        return;
      }
      var content = window.outputEditor.getValue();
      if (!content.trim()) {
        alert('No output content to copy');
        return;
      }
      navigator.clipboard.writeText(content).then(function () {
        //console.log('Output copied to clipboard');

        // Show success feedback on the button
        if (copyButton) {
          copyButton.classList.add('copy-success');
          setTimeout(function () {
            copyButton.classList.remove('copy-success');
          }, 800);
        }
      })["catch"](function (err) {
        console.error('Failed to copy output:', err);
        alert('Failed to copy: ' + err.message);
      });
    }

    /**
     * Save output G-code to file
     */
  }, {
    key: "saveOutput",
    value: function saveOutput() {
      // Find the export/save button to show loading on it
      var exportButton = document.querySelector('button[onclick*="saveOutput"], button[title*="Save output"]');
      if (!window.outputEditor || typeof window.outputEditor.getValue !== 'function') {
        alert('No output content available to save');
        return;
      }
      var text = window.outputEditor.getValue();
      if (!text.trim()) {
        alert('No output content to save');
        return;
      }

      // Show loading on the export button
      var restoreButton = null;
      if (exportButton && window.navigationManager) {
        restoreButton = window.navigationManager.showButtonLoading(exportButton, 'Exporting...');
      }

      // Get last opened filename for suggestion
      var lastFilename = '';
      try {
        lastFilename = localStorage.getItem('ggcode_last_filename') || '';
      } catch (error) {
        console.warn('Failed to get filename from storage:', error);
      }

      // Generate suggested filename
      var suggestedFilename = '';
      if (lastFilename) {
        var base = lastFilename;
        if (base.endsWith('.gcode') || base.endsWith('.ggcode')) {
          base = base.replace(/\.(gcode|ggcode)$/i, '');
        } else if (base.lastIndexOf('.') > 0) {
          base = base.slice(0, base.lastIndexOf('.'));
        }
        suggestedFilename = base + '.g.gcode';
      }
      if (!suggestedFilename) suggestedFilename = 'output.g.gcode';

      // Prompt user for filename
      var userFilename = window.prompt('Save G-code as:', suggestedFilename);
      if (!userFilename) {
        if (restoreButton) restoreButton();
        return; // User cancelled
      }
      try {
        // Create and download file
        var utf8Bytes = new TextEncoder().encode(text);
        var blob = new Blob([utf8Bytes], {
          type: 'application/octet-stream'
        });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = userFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        console.log('Output saved as:', userFilename);
      } catch (error) {
        console.error('Failed to save output:', error);
        alert('Failed to save file: ' + error.message);
      } finally {
        // Always restore the button state
        if (restoreButton) restoreButton();
      }
    }

    /**
     * Save GGcode input to file
     */
  }, {
    key: "saveGGcode",
    value: function saveGGcode() {
      // Find the save button to show loading on it
      var saveButton = document.querySelector('button[onclick*="saveGGcode"], button[title*="Save GGcode input"]');
      if (!window.editor || typeof window.editor.getValue !== 'function') {
        alert('No input content available to save');
        return;
      }
      var content = window.editor.getValue();
      if (!content.trim()) {
        alert('No input content to save');
        return;
      }

      // Show loading on the save button
      var restoreButton = null;
      if (saveButton && window.navigationManager) {
        restoreButton = window.navigationManager.showButtonLoading(saveButton, 'Saving...');
      }
      try {
        // Get last opened filename for suggestion
        var lastFilename = '';
        try {
          lastFilename = localStorage.getItem('ggcode_last_filename') || '';
        } catch (error) {
          console.warn('Failed to get filename from storage:', error);
        }

        // Generate suggested filename
        var suggestedFilename = lastFilename && lastFilename.endsWith('.ggcode') ? lastFilename : '';
        if (!suggestedFilename && lastFilename) {
          var dot = lastFilename.lastIndexOf('.');
          suggestedFilename = (dot > 0 ? lastFilename.slice(0, dot) : lastFilename) + '.ggcode';
        }
        if (!suggestedFilename) suggestedFilename = 'input.ggcode';

        // Prompt user for filename
        var userFilename = window.prompt('Save GGcode as:', suggestedFilename);
        if (!userFilename) {
          if (restoreButton) restoreButton();
          return; // User cancelled
        }

        // Create and download file
        var blob = new Blob([content], {
          type: 'text/plain'
        });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = userFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        console.log('GGcode saved as:', userFilename);
      } catch (error) {
        console.error('Failed to save GGcode:', error);
        alert('Failed to save file: ' + error.message);
      } finally {
        // Always restore the button state
        if (restoreButton) restoreButton();
      }
    }

    /**
     * Clear all saved content and settings
     */
  }, {
    key: "clearMemory",
    value: function clearMemory() {
      if (!confirm('This will clear all saved content and settings. Are you sure?')) {
        return;
      }
      try {
        // Clear localStorage
        localStorage.removeItem('ggcode_input_content');
        localStorage.removeItem('ggcode_output_content');
        localStorage.removeItem('ggcode_last_filename');
        localStorage.removeItem('ggcode_auto_compile');

        // Reset editors if available
        if (window.editor && typeof window.editor.setValue === 'function') {
          window.editor.setValue('');
        }
        if (window.outputEditor && typeof window.outputEditor.setValue === 'function') {
          window.outputEditor.setValue('');
        }

        // Reset auto-compile checkbox
        var autoCheckbox = document.getElementById('autoCompileCheckbox');
        if (autoCheckbox) {
          autoCheckbox.checked = false;
        }
        console.log('Memory cleared successfully');
        alert('Memory cleared successfully!');
      } catch (error) {
        console.error('Failed to clear memory:', error);
        alert('Failed to clear memory: ' + error.message);
      }
    }
  }]);
}(); // Create global instance
var fileOperations = new FileOperations();

// Export for module use


// Export global instance
window.fileOperations = fileOperations;

/***/ }),

/***/ "./src/client/js/ui/fileTreeViewer.js":
/*!********************************************!*\
  !*** ./src/client/js/ui/fileTreeViewer.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
 * FileTreeViewer - GitHub-style file tree for MD documents
 * Integrates with the GGcode help system to show markdown files in a tree structure
 */
var FileTreeViewer = /*#__PURE__*/function () {
  function FileTreeViewer(container) {
    _classCallCheck(this, FileTreeViewer);
    this.container = container;
    this.currentFile = null;
    this.treeData = {};
    this.markdownContent = {};
    this.initializeAsync();
  }

  /**
   * Initialize asynchronously to avoid timing issues
   */
  return _createClass(FileTreeViewer, [{
    key: "initializeAsync",
    value: (function () {
      var _initializeAsync = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.initialize();
            case 1:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function initializeAsync() {
        return _initializeAsync.apply(this, arguments);
      }
      return initializeAsync;
    }()
    /**
     * Initialize the file tree viewer
     */
    )
  }, {
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              console.log('FileTreeViewer: Starting initialization');
              _context2.n = 1;
              return this.scanMarkdownFiles();
            case 1:
              this.createTreeStructure();
              this.render();
              this.bindEvents();
              console.log('FileTreeViewer: Initialization complete');
            case 2:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * Scan for available Markdown files
     */
    )
  }, {
    key: "scanMarkdownFiles",
    value: (function () {
      var _scanMarkdownFiles = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var response, data, _t;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _context3.n = 1;
              return fetch('/api/help/markdown-files');
            case 1:
              response = _context3.v;
              _context3.n = 2;
              return response.json();
            case 2:
              data = _context3.v;
              if (!(data.success && data.files)) {
                _context3.n = 3;
                break;
              }
              this.markdownFiles = data.files;
              _context3.n = 3;
              return this.loadMarkdownContent();
            case 3:
              _context3.n = 5;
              break;
            case 4:
              _context3.p = 4;
              _t = _context3.v;
              console.error('Error scanning for markdown files:', _t);
              // Fallback: use static file list
              this.markdownFiles = [{
                path: 'README.md',
                name: 'README.md',
                type: 'file'
              }, {
                path: 'MULTILANGUAGE_GUIDE.md',
                name: 'MULTILANGUAGE_GUIDE.md',
                type: 'file'
              }];
              _context3.n = 5;
              return this.loadMarkdownContent();
            case 5:
              return _context3.a(2);
          }
        }, _callee3, this, [[0, 4]]);
      }));
      function scanMarkdownFiles() {
        return _scanMarkdownFiles.apply(this, arguments);
      }
      return scanMarkdownFiles;
    }()
    /**
     * Load markdown content for all files
     */
    )
  }, {
    key: "loadMarkdownContent",
    value: (function () {
      var _loadMarkdownContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var _iterator, _step, file, response, data, _t2, _t3;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _iterator = _createForOfIteratorHelper(this.markdownFiles);
              _context4.p = 1;
              _iterator.s();
            case 2:
              if ((_step = _iterator.n()).done) {
                _context4.n = 8;
                break;
              }
              file = _step.value;
              if (!(file.type === 'file')) {
                _context4.n = 7;
                break;
              }
              _context4.p = 3;
              _context4.n = 4;
              return fetch("/api/help/markdown-content?file=".concat(encodeURIComponent(file.path)));
            case 4:
              response = _context4.v;
              _context4.n = 5;
              return response.json();
            case 5:
              data = _context4.v;
              if (data.success) {
                this.markdownContent[file.path] = data.content;
              }
              _context4.n = 7;
              break;
            case 6:
              _context4.p = 6;
              _t2 = _context4.v;
              console.error("Error loading content for ".concat(file.path, ":"), _t2);
            case 7:
              _context4.n = 2;
              break;
            case 8:
              _context4.n = 10;
              break;
            case 9:
              _context4.p = 9;
              _t3 = _context4.v;
              _iterator.e(_t3);
            case 10:
              _context4.p = 10;
              _iterator.f();
              return _context4.f(10);
            case 11:
              return _context4.a(2);
          }
        }, _callee4, this, [[3, 6], [1, 9, 10, 11]]);
      }));
      function loadMarkdownContent() {
        return _loadMarkdownContent.apply(this, arguments);
      }
      return loadMarkdownContent;
    }()
    /**
     * Create file tree data structure
     */
    )
  }, {
    key: "createTreeStructure",
    value: function createTreeStructure() {
      var tree = {};
      this.markdownFiles.forEach(function (file) {
        if (file.type === 'file') {
          var pathParts = file.path.split('/');
          var current = tree;
          pathParts.forEach(function (part, index) {
            if (!current[part]) {
              current[part] = {
                type: index === pathParts.length - 1 ? 'file' : 'folder',
                path: pathParts.slice(0, index + 1).join('/'),
                children: index === pathParts.length - 1 ? null : {}
              };
            }
            if (current[part].type === 'folder') {
              current = current[part].children;
            }
          });
        }
      });
      this.treeData = tree;
    }

    /**
     * Render the file tree
     */
  }, {
    key: "render",
    value: function render() {
      var html = "\n        <div class=\"file-tree-content\">\n          ".concat(this.renderTreeNode(this.treeData, '', 0), "\n        </div>\n      </div>\n    ");
      this.container.innerHTML = html;
    }

    /**
     * Render a single tree node recursively
     */
  }, {
    key: "renderTreeNode",
    value: function renderTreeNode(node, path, level) {
      var _this = this;
      if (!node || _typeof(node) !== 'object') return '';
      var html = '<ul class="tree-node-list">';
      Object.keys(node).forEach(function (key) {
        var item = node[key];
        var itemPath = path ? "".concat(path, "/").concat(key) : key;
        var indentation = level * 16;
        if (item.type === 'file') {
          html += "\n          <li class=\"tree-node file-node ".concat(_this.currentFile === itemPath ? 'active' : '', "\"\n              data-path=\"").concat(itemPath, "\"\n              data-type=\"file\"\n              style=\"padding-left: ").concat(indentation, "px;\">\n            <div class=\"node-content\">\n              <span class=\"file-icon\">\uD83D\uDCC4</span>\n              <span class=\"file-name\">").concat(key, "</span>\n            </div>\n          </li>\n        ");
        } else if (item.type === 'folder') {
          var isExpanded = _this.isExpanded(itemPath);
          html += "\n          <li class=\"tree-node folder-node\"\n              data-path=\"".concat(itemPath, "\"\n              data-type=\"folder\"\n              style=\"padding-left: ").concat(indentation, "px;\">\n            <div class=\"node-content\">\n              <span class=\"expand-icon ").concat(isExpanded ? 'expanded' : '', "\">\n                ").concat(isExpanded ? '📂' : '📁', "\n              </span>\n              <span class=\"folder-name\">").concat(key, "</span>\n            </div>\n            ").concat(isExpanded ? _this.renderTreeNode(item.children, itemPath, level + 1) : '', "\n          </li>\n        ");
        }
      });
      html += '</ul>';
      return html;
    }

    /**
     * Check if a folder is expanded
     */
  }, {
    key: "isExpanded",
    value: function isExpanded(path) {
      return this.expandedFolders && this.expandedFolders.has(path);
    }

    /**
     * Toggle folder expansion
     */
  }, {
    key: "toggleFolder",
    value: function toggleFolder(path) {
      if (!this.expandedFolders) {
        this.expandedFolders = new Set();
      }
      if (this.expandedFolders.has(path)) {
        this.expandedFolders["delete"](path);
      } else {
        this.expandedFolders.add(path);
      }
      this.render();
    }

    /**
     * Select a file for viewing
     */
  }, {
    key: "selectFile",
    value: function selectFile(path) {
      this.currentFile = path;

      // Update the displayed file
      this.updateDisplayedFile(path);

      // Update the UI
      this.render();
    }

    /**
     * Bind event listeners
     */
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      this.container.addEventListener('click', function (e) {
        var node = e.target.closest('.tree-node');
        if (!node) return;
        var path = node.dataset.path;
        var type = node.dataset.type;
        if (type === 'folder') {
          _this2.toggleFolder(path);
        } else if (type === 'file') {
          _this2.selectFile(path);
        }
      });

      // Refresh button
      this.container.addEventListener('click', function (e) {
        if (e.target.closest('.refresh-btn')) {
          _this2.refresh();
        }
      });
    }

    /**
     * Copy file content to clipboard
     */
  }, {
    key: "copyFileContent",
    value: (function () {
      var _copyFileContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var _t4;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              if (!(!this.currentFile || !this.markdownContent[this.currentFile])) {
                _context5.n = 1;
                break;
              }
              return _context5.a(2);
            case 1:
              _context5.p = 1;
              _context5.n = 2;
              return navigator.clipboard.writeText(this.markdownContent[this.currentFile]);
            case 2:
              _context5.n = 4;
              break;
            case 3:
              _context5.p = 3;
              _t4 = _context5.v;
              console.error('Error copying content:', _t4);
            case 4:
              return _context5.a(2);
          }
        }, _callee5, this, [[1, 3]]);
      }));
      function copyFileContent() {
        return _copyFileContent.apply(this, arguments);
      }
      return copyFileContent;
    }()
    /**
     * Refresh the file tree
     */
    )
  }, {
    key: "refresh",
    value: (function () {
      var _refresh = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              this.treeData = {};
              this.markdownContent = {};
              this.currentFile = null;
              _context6.n = 1;
              return this.scanMarkdownFiles();
            case 1:
              this.createTreeStructure();
              this.render();
            case 2:
              return _context6.a(2);
          }
        }, _callee6, this);
      }));
      function refresh() {
        return _refresh.apply(this, arguments);
      }
      return refresh;
    }()
    /**
     * Load a file and display it in the content area
     */
    )
  }, {
    key: "loadAndDisplayFile",
    value: (function () {
      var _loadAndDisplayFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(filePath) {
        var response, data, _t5;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              console.log('FileTreeViewer: Loading file:', filePath);

              // Fetch file content from API
              _context7.n = 1;
              return fetch("/api/help/markdown-content?file=".concat(encodeURIComponent(filePath)));
            case 1:
              response = _context7.v;
              _context7.n = 2;
              return response.json();
            case 2:
              data = _context7.v;
              if (data.success && data.content) {
                // Display the file content
                this.displayFileContent(filePath, data.content);

                // Switch to MD file view mode
                this.triggerViewModeChange('file');
              } else {
                console.error('Failed to load file content:', data.error);
                this.displayFileContent(filePath, 'Failed to load file content.');
              }
              _context7.n = 4;
              break;
            case 3:
              _context7.p = 3;
              _t5 = _context7.v;
              console.error('Error loading file:', _t5);
              this.displayFileContent(filePath, 'Error loading file.');
            case 4:
              return _context7.a(2);
          }
        }, _callee7, this, [[0, 3]]);
      }));
      function loadAndDisplayFile(_x) {
        return _loadAndDisplayFile.apply(this, arguments);
      }
      return loadAndDisplayFile;
    }()
    /**
     * Display file content in the appropriate area
     */
    )
  }, {
    key: "displayFileContent",
    value: function displayFileContent(filePath, content) {
      var titleElement = document.getElementById('currentFileTitle');
      var contentElement = document.getElementById('mdContentBody');
      if (titleElement) {
        // Extract just the filename from the path
        var fileName = filePath.split('/').pop();
        titleElement.textContent = fileName;
      }
      if (contentElement) {
        // Simple markdown-like rendering (basic)
        var renderedHtml = this.renderMarkdownContent(content);
        contentElement.innerHTML = renderedHtml;
      } else {
        console.warn('FileTreeViewer: mdContentBody not found');
      }
    }

    /**
     * Basic markdown rendering
     */
  }, {
    key: "renderMarkdownContent",
    value: function renderMarkdownContent(content) {
      if (!content) return '<p>No content available.</p>';
      return content.split('\n').map(function (line) {
        // Headers
        if (line.startsWith('# ')) {
          return "<h1>".concat(line.substring(2), "</h1>");
        } else if (line.startsWith('## ')) {
          return "<h2>".concat(line.substring(3), "</h2>");
        } else if (line.startsWith('### ')) {
          return "<h3>".concat(line.substring(4), "</h3>");
        }
        // Empty lines
        else if (line.trim() === '') {
          return '<br>';
        }
        // Regular paragraphs
        else {
          return "<p>".concat(line, "</p>");
        }
      }).join('');
    }

    /**
     * Update displayed file in the content area
     */
  }, {
    key: "updateDisplayedFile",
    value: (function () {
      var _updateDisplayedFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(filePath) {
        var response, data, mdContentBody, fileNameSpan, _t6;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              _context8.n = 1;
              return fetch("/api/help/markdown-content?file=".concat(encodeURIComponent(filePath)));
            case 1:
              response = _context8.v;
              _context8.n = 2;
              return response.json();
            case 2:
              data = _context8.v;
              if (data.success && data.content) {
                // Use HelpSystem to update the display
                if (window.applicationManager && window.applicationManager.helpSystem) {
                  window.applicationManager.helpSystem.showMarkdownFile(filePath, data.content);
                } else {
                  // Fallback: update directly
                  mdContentBody = document.getElementById('mdContentBody');
                  fileNameSpan = document.getElementById('fileName');
                  if (fileNameSpan) {
                    fileNameSpan.textContent = filePath.split('/').pop();
                  }
                  if (mdContentBody) {
                    mdContentBody.textContent = data.content;
                  }
                }
              } else {
                console.error('Failed to load file:', filePath);
              }
              _context8.n = 4;
              break;
            case 3:
              _context8.p = 3;
              _t6 = _context8.v;
              console.error('Error loading file:', _t6);
            case 4:
              return _context8.a(2);
          }
        }, _callee8, null, [[0, 3]]);
      }));
      function updateDisplayedFile(_x2) {
        return _updateDisplayedFile.apply(this, arguments);
      }
      return updateDisplayedFile;
    }())
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FileTreeViewer);

/***/ }),

/***/ "./src/client/js/ui/helpSystem.js":
/*!****************************************!*\
  !*** ./src/client/js/ui/helpSystem.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/storageManager.js */ "./src/client/js/utils/storageManager.js");
/* harmony import */ var _fileTreeViewer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fileTreeViewer.js */ "./src/client/js/ui/fileTreeViewer.js");
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
 * Help System Module
 * Manages help content, search, and language selection
 */



var HelpSystem = /*#__PURE__*/function () {
  function HelpSystem(apiManager) {
    _classCallCheck(this, HelpSystem);
    this.apiManager = apiManager;
    this.dictionaryCache = null;
    this.annotationsCache = null;
    this.fileTreeViewer = null;
  }

  /**
   * Show help modal
   */
  return _createClass(HelpSystem, [{
    key: "showHelp",
    value: (function () {
      var _showHelp = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this = this;
        var savedLanguage;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (window.showModal) {
                window.showModal('helpModal');
              }

              // Get saved language preference or default to English
              savedLanguage = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getSelectedLanguage(); // Load help content when modal opens
              this.loadHelpContent(savedLanguage);
              // Setup language selector
              _context.n = 1;
              return this.setupLanguageSelector();
            case 1:
              // Initialize language dropdown display from saved preference
              this.initializeLanguageSelectorDisplay();

              // Add copy buttons after modal is shown
              setTimeout(function () {
                return _this.addCopyButtons();
              }, 200);
              // Setup help search
              this.setupHelpSearch();

              // Load dictionary data for integration
              this.loadMillDictionaryData();

              // Initialize file tree viewer
              this.initializeFileTreeViewer();

              // Initialize documentation controls
              this.initializeDocumentationControls();

              // Focus search input
              setTimeout(function () {
                var searchInput = document.getElementById('helpSearchInput');
                if (searchInput) {
                  searchInput.focus();
                }
              }, 200);
            case 2:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function showHelp() {
        return _showHelp.apply(this, arguments);
      }
      return showHelp;
    }()
    /**
     * Load help content
     */
    )
  }, {
    key: "loadHelpContent",
    value: (function () {
      var _loadHelpContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var language,
          helpContent,
          result,
          _args2 = arguments,
          _t;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              language = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 'en';
              helpContent = document.getElementById('helpContent');
              if (helpContent) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2);
            case 1:
              _context2.p = 1;
              // Show loading indicator
              helpContent.innerHTML = '<div class="loading-indicator"><p>Loading help content...</p></div>';
              _context2.n = 2;
              return this.apiManager.help.getContent(language);
            case 2:
              result = _context2.v;
              if (result && result.data) {
                this.renderHelpContent(result.data);
              } else {
                helpContent.innerHTML = '<div class="error-message"><p>Failed to load help content</p></div>';
              }
              _context2.n = 4;
              break;
            case 3:
              _context2.p = 3;
              _t = _context2.v;
              helpContent.innerHTML = '<div class="error-message"><p>Error loading help content: ' + _t.message + '</p></div>';
            case 4:
              return _context2.a(2);
          }
        }, _callee2, this, [[1, 3]]);
      }));
      function loadHelpContent() {
        return _loadHelpContent.apply(this, arguments);
      }
      return loadHelpContent;
    }()
    /**
     * Render help content
     */
    )
  }, {
    key: "renderHelpContent",
    value: function renderHelpContent(data) {
      var _this2 = this;
      var helpContent = document.getElementById('helpContent');
      if (!helpContent || !data || !data.sections) {
        console.error('Invalid help content data or missing container');
        return;
      }
      var html = '';

      // Render each section
      Object.values(data.sections).forEach(function (section) {
        html += "<div class=\"help-section-card\" data-section=\"".concat(section.id, "\">");
        html += "<h3 class=\"help-section-title\">".concat(section.title, "</h3>");
        html += "<div class=\"help-section-content\">";

        // Render section content
        if (section.content && Array.isArray(section.content)) {
          section.content.forEach(function (item) {
            switch (item.type) {
              case 'paragraph':
                html += "<p>".concat(item.text, "</p>");
                break;
              case 'subsection':
                html += "<h4>".concat(item.title, "</h4>");
                if (item.description) {
                  html += "<p>".concat(item.description, "</p>");
                }
                if (item.additionalInfo) {
                  html += "<p>".concat(item.additionalInfo, "</p>");
                }
                if (item.code) {
                  html += "<pre><code>".concat(item.code, "</code></pre>");
                }
                if (item.list) {
                  html += "<ul>";
                  item.list.forEach(function (listItem) {
                    html += "<li>".concat(listItem, "</li>");
                  });
                  html += "</ul>";
                }
                break;
              case 'list':
                if (item.title) {
                  html += "<h4>".concat(item.title, "</h4>");
                }
                if (item.description) {
                  html += "<p>".concat(item.description, "</p>");
                }
                html += "<ul>";
                item.items.forEach(function (listItem) {
                  html += "<li>".concat(listItem, "</li>");
                });
                html += "</ul>";
                break;
              case 'code':
                html += "<pre><code>".concat(item.code, "</code></pre>");
                break;
              default:
                console.warn('Unknown help content type:', item.type);
            }
          });
        }
        html += "</div>";
        html += "</div>";
      });
      helpContent.innerHTML = html;

      // Add copy buttons to code blocks after rendering
      setTimeout(function () {
        return _this2.addCopyButtons();
      }, 100);
    }

    /**
     * Setup language selector - dropdown logic handled by main dropdown system
     */
  }, {
    key: "setupLanguageSelector",
    value: (function () {
      var _setupLanguageSelector = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              // Language dropdown is handled by the centralized dropdown system in main.js
              // This method is kept for backward compatibility
              console.log('Language selector setup delegated to centralized dropdown system');
            case 1:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      function setupLanguageSelector() {
        return _setupLanguageSelector.apply(this, arguments);
      }
      return setupLanguageSelector;
    }()
    /**
     * Initialize language selector display with saved preference
     */
    )
  }, {
    key: "initializeLanguageSelectorDisplay",
    value: function initializeLanguageSelectorDisplay() {
      var savedLanguage = _utils_storageManager_js__WEBPACK_IMPORTED_MODULE_0__["default"].getSelectedLanguage();
      var selectSelected = document.getElementById('selectSelected');
      if (!selectSelected || !savedLanguage || savedLanguage === 'en') {
        return; // Already shows English (default)
      }

      // Find the corresponding language option to get its display information
      var languageMap = {
        es: {
          flag: '🇪🇸',
          name: 'Español'
        },
        fr: {
          flag: '🇫🇷',
          name: 'Français'
        },
        de: {
          flag: '🇩🇪',
          name: 'Deutsch'
        },
        it: {
          flag: '🇮🇹',
          name: 'Italiano'
        },
        pt: {
          flag: '🇵🇹',
          name: 'Português'
        },
        ru: {
          flag: '🇷🇺',
          name: 'Русский'
        },
        zh: {
          flag: '🇨🇳',
          name: '中文'
        },
        ja: {
          flag: '🇯🇵',
          name: '日本語'
        },
        ko: {
          flag: '🇰🇷',
          name: '한국어'
        },
        ar: {
          flag: '🇸🇦',
          name: 'العربية'
        },
        he: {
          flag: '🇮🇱',
          name: 'עברית'
        },
        tr: {
          flag: '🇹🇷',
          name: 'Türkçe'
        },
        pl: {
          flag: '🇵🇱',
          name: 'Polski'
        },
        nl: {
          flag: '🇳🇱',
          name: 'Nederlands'
        }
      };
      var selectedLanguageInfo = languageMap[savedLanguage];
      if (selectedLanguageInfo) {
        selectSelected.innerHTML = "\n                <span class=\"flag-icon flag-".concat(savedLanguage, "\">").concat(selectedLanguageInfo.flag, "</span>\n                <span class=\"language-name\">").concat(selectedLanguageInfo.name, "</span>\n                <svg width=\"12\" height=\"12\" viewBox=\"0 0 16 16\" fill=\"#10a37f\">\n                    <path d=\"M4.427 6.427L8 10l3.573-3.573L10.354 5 8 7.354 5.646 5z\" />\n                </svg>\n            ");
        console.log("HelpSystem: Language selector updated to show ".concat(selectedLanguageInfo.name, " (").concat(savedLanguage, ")"));
      }
    }

    /**
     * Load mill dictionary and annotations data for enhanced G-code completion
     */
  }, {
    key: "loadMillDictionaryData",
    value: (function () {
      var _loadMillDictionaryData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var dictionaryResponse, annotationsResponse, annotationsJson, _t2;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              if (this.dictionaryCache) {
                _context4.n = 4;
                break;
              }
              _context4.n = 1;
              return fetch('/mill-dictionary.json');
            case 1:
              dictionaryResponse = _context4.v;
              if (!dictionaryResponse.ok) {
                _context4.n = 3;
                break;
              }
              _context4.n = 2;
              return dictionaryResponse.json();
            case 2:
              this.dictionaryCache = _context4.v;
              console.log('HelpSystem: Mill dictionary loaded with', Object.keys(this.dictionaryCache).length, 'commands');
              _context4.n = 4;
              break;
            case 3:
              console.warn('HelpSystem: Could not load mill-dictionary.json');
            case 4:
              if (this.annotationsCache) {
                _context4.n = 8;
                break;
              }
              _context4.n = 5;
              return fetch('/mill-annotations.json');
            case 5:
              annotationsResponse = _context4.v;
              if (!annotationsResponse.ok) {
                _context4.n = 7;
                break;
              }
              _context4.n = 6;
              return annotationsResponse.json();
            case 6:
              annotationsJson = _context4.v;
              this.annotationsCache = annotationsJson;
              console.log('HelpSystem: Mill annotations loaded with', Object.keys(this.annotationsCache).length, 'entries');
              _context4.n = 8;
              break;
            case 7:
              console.warn('HelpSystem: Could not load mill-annotations.json');
            case 8:
              // Integrate dictionary data with Monaco completion
              this.integrateMillDictionaryWithMonaco();
              _context4.n = 10;
              break;
            case 9:
              _context4.p = 9;
              _t2 = _context4.v;
              console.warn('HelpSystem: Failed to load mill dictionary data:', _t2.message);
            case 10:
              return _context4.a(2);
          }
        }, _callee4, this, [[0, 9]]);
      }));
      function loadMillDictionaryData() {
        return _loadMillDictionaryData.apply(this, arguments);
      }
      return loadMillDictionaryData;
    }()
    /**
     * Integrate mill dictionary data with Monaco auto-completion
     */
    )
  }, {
    key: "integrateMillDictionaryWithMonaco",
    value: function integrateMillDictionaryWithMonaco() {
      var _window$editorManager, _window$editorManager2;
      if (!this.dictionaryCache) {
        console.warn('HelpSystem: No dictionary cache available for Monaco integration');
        return;
      }

      // Get Monaco editor instance
      var editor = (_window$editorManager = window.editorManager) === null || _window$editorManager === void 0 || (_window$editorManager2 = _window$editorManager.getEditors) === null || _window$editorManager2 === void 0 || (_window$editorManager2 = _window$editorManager2.call(_window$editorManager)) === null || _window$editorManager2 === void 0 ? void 0 : _window$editorManager2.input;
      if (!editor) {
        console.warn('HelpSystem: Monaco editor not available for dictionary integration');
        return;
      }

      // Create comprehensive G-code completions from dictionary data
      var millCompletions = this.convertDictionaryToCompletions(this.dictionaryCache);

      // Update existing completion provider with mill data
      console.log("HelpSystem: Enhanced Monaco completion with ".concat(millCompletions.length, " official G-code definitions"));

      // Note: The actual integration happens in MonacoEditorManager,
      // we can signal it to refresh its completions or use the existing system
      this.signalCompletionRefresh();
    }

    /**
     * Convert dictionary JSON to Monaco completion items
     */
  }, {
    key: "convertDictionaryToCompletions",
    value: function convertDictionaryToCompletions(dictionary) {
      var completions = [];
      for (var _i = 0, _Object$entries = Object.entries(dictionary); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          gcode = _Object$entries$_i[0],
          definition = _Object$entries$_i[1];
        var description = definition.desc || 'G-code command';
        var detail = gcode;
        var usage = '';

        // Handle different dictionary formats
        if (definition.sub) {
          // Create usage string from parameters
          var params = Object.keys(definition.sub).join(' ');
          usage = "".concat(gcode, " ").concat(params);
          detail = usage;
        } else if (typeof definition === 'string') {
          description = definition;
        }
        completions.push({
          label: gcode,
          kind: monaco.languages.CompletionItemKind.Keyword,
          detail: detail,
          documentation: {
            value: "**".concat(gcode, "** - ").concat(description, "\n\nUsage: `").concat(usage || gcode, "`")
          },
          insertText: gcode,
          sortText: gcode.startsWith('G') ? "01".concat(gcode) : "02".concat(gcode)
        });
      }
      return completions;
    }

    /**
     * Signal that completions should be refreshed with mill dictionary data
     */
  }, {
    key: "signalCompletionRefresh",
    value: function signalCompletionRefresh() {
      console.log('HelpSystem: Signaling completion refresh with mill dictionary integration');

      // The MonacoEditorManager completion provider will automatically use the dictionary data
      // since it checks for this.helpSystem?.dictionaryCache and this.helpSystem?.annotationsCache
      // in _getMillDictionaryCompletions and _getMillAnnotationsCompletions methods
      console.log('HelpSystem: Mill dictionary data loaded and available for completion provider');
      console.log("Dictionary entries: ".concat(Object.keys(this.dictionaryCache || {}).length));
      console.log("Annotations entries: ".concat(Object.keys(this.annotationsCache || {}).length));
    }

    /**
     * Add copy buttons to code blocks
     */
  }, {
    key: "addCopyButtons",
    value: function addCopyButtons() {
      var preElements = document.querySelectorAll('.help-content pre, #helpContent pre');
      preElements.forEach(function (pre) {
        // Check if copy button already exists
        if (pre.querySelector('.copy-button')) return;
        var copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.style.cssText = "\n                position: absolute;\n                top: 8px;\n                right: 8px;\n                background: #007acc;\n                color: white;\n                border: none;\n                padding: 4px 8px;\n                border-radius: 3px;\n                font-size: 12px;\n                cursor: pointer;\n                z-index: 1;\n            ";

        // Make pre element relative for absolute positioning
        pre.style.position = 'relative';
        copyButton.onclick = function () {
          var code = pre.textContent.replace('Copy', '').trim();
          navigator.clipboard.writeText(code).then(function () {
            copyButton.textContent = 'Copied!';
            copyButton.style.background = '#28a745';
            setTimeout(function () {
              copyButton.textContent = 'Copy';
              copyButton.style.background = '#007acc';
            }, 2000);
          })["catch"](function (err) {
            console.error('Failed to copy: ', err);
            copyButton.textContent = 'Error';
            copyButton.style.background = '#dc3545';
            setTimeout(function () {
              copyButton.textContent = 'Copy';
              copyButton.style.background = '#007acc';
            }, 2000);
          });
        };
        pre.appendChild(copyButton);
      });
    }

    /**
     * Setup help search
     */
  }, {
    key: "setupHelpSearch",
    value: function setupHelpSearch() {
      var _this3 = this;
      var searchInput = document.getElementById('helpSearchInput');
      if (!searchInput) {
        console.warn('Help search input not found');
        return;
      }

      // Store original content for search reset
      this.originalSections = this.originalSections || Array.from(document.querySelectorAll('.help-section-card'));
      searchInput.addEventListener('input', function (e) {
        var searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm === '') {
          // Reset to show all sections
          _this3.showAllSections();
          _this3.removeAllHighlights();
        } else {
          // Perform search
          _this3.performSearch(searchTerm);
        }
      });
      console.log('Help search functionality initialized');

      // Add clear search button
      this.addClearSearchButton(searchInput);

      // Add CSS for search highlights
      this.addSearchHighlightStyles();
    }

    /**
     * Add clear search button
     */
  }, {
    key: "addClearSearchButton",
    value: function addClearSearchButton(searchInput) {
      // Create clear button
      var clearButton = document.createElement('button');
      clearButton.type = 'button';
      clearButton.textContent = '✕';
      clearButton.title = 'Clear search';
      clearButton.style.cssText = "\n            position: absolute;\n            right: 10px;\n            top: 50%;\n            transform: translateY(-50%);\n            background: none;\n            border: none;\n            color: #666;\n            cursor: pointer;\n            font-size: 14px;\n            padding: 2px;\n            display: none;\n        ";

      // Style on hover
      clearButton.addEventListener('mouseenter', function () {
        clearButton.style.color = '#ff4444';
      });
      clearButton.addEventListener('mouseleave', function () {
        clearButton.style.color = '#666';
      });

      // Add click handler
      clearButton.addEventListener('click', function () {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
      });

      // Position the search input as relative for absolute positioning
      searchInput.style.position = 'relative';
      searchInput.parentNode.appendChild(clearButton);

      // Show/hide clear button based on input value
      searchInput.addEventListener('input', function () {
        clearButton.style.display = searchInput.value.trim() ? 'block' : 'none';
      });
    }

    /**
     * Add CSS styles for search highlights
     */
  }, {
    key: "addSearchHighlightStyles",
    value: function addSearchHighlightStyles() {
      if (document.getElementById('help-search-styles')) return;
      var style = document.createElement('style');
      style.id = 'help-search-styles';
      style.textContent = "\n            .search-highlight {\n                background-color: #ffeb3b !important;\n                color: #000 !important;\n                padding: 2px 1px;\n                border-radius: 2px;\n                font-weight: bold;\n                box-shadow: 0 0 0 1px rgba(255, 193, 7, 0.3);\n            }\n\n            #help-no-results {\n                background: #f8f9fa;\n                border: 1px solid #dee2e6;\n                border-radius: 4px;\n                margin: 20px 0;\n            }\n\n            .help-section-card {\n                transition: opacity 0.3s ease;\n            }\n\n            .help-section-card[style*=\"display: none\"] {\n                opacity: 0.3;\n            }\n        ";
      document.head.appendChild(style);
    }

    /**
     * Perform search across help sections with intelligent matching
     */
  }, {
    key: "performSearch",
    value: function performSearch(searchTerm) {
      var _this4 = this;
      var helpSections = document.querySelectorAll('.help-section-card');
      var hasVisibleResults = false;

      // Split search term into keywords for better matching
      var keywords = searchTerm.toLowerCase().trim().split(/\s+/).filter(function (k) {
        return k.length > 0;
      });
      var originalSearchTerm = searchTerm.toLowerCase().trim();
      console.log('Searching for:', originalSearchTerm, 'Keywords:', keywords);
      helpSections.forEach(function (section) {
        var sectionText = section.textContent.toLowerCase();
        var titleElement = section.querySelector('.help-section-title');
        var title = titleElement ? titleElement.textContent.toLowerCase() : '';

        // Calculate relevance score
        var relevanceScore = 0;
        var matchesAnyKeyword = false;

        // Check each keyword - highlight ALL characters including single ones
        keywords.forEach(function (keyword) {
          // Exact matches get higher score
          if (title.includes(keyword)) {
            relevanceScore += 10; // Title matches are very important
            matchesAnyKeyword = true;
            console.log('Title match for:', keyword);
          }
          if (sectionText.includes(keyword)) {
            relevanceScore += 5; // Content matches
            matchesAnyKeyword = true;
            console.log('Content match for:', keyword);
          }

          // Word boundary matches (whole words) for all terms
          var wordBoundaryRegex = new RegExp('\\b' + _this4.escapeRegExp(keyword) + '\\b', 'gi');
          if (wordBoundaryRegex.test(title)) {
            relevanceScore += 8; // Whole word in title
            matchesAnyKeyword = true;
            console.log('Word boundary title match for:', keyword);
          }
          if (wordBoundaryRegex.test(sectionText)) {
            relevanceScore += 4; // Whole word in content
            matchesAnyKeyword = true;
            console.log('Word boundary content match for:', keyword);
          }

          // Partial matching for all keywords
          var partialRegex = new RegExp(_this4.escapeRegExp(keyword), 'gi');
          if (partialRegex.test(title)) {
            relevanceScore += 6;
            matchesAnyKeyword = true;
            console.log('Partial title match for:', keyword);
          }
          if (partialRegex.test(sectionText)) {
            relevanceScore += 3;
            matchesAnyKeyword = true;
            console.log('Partial content match for:', keyword);
          }
        });

        // Check for exact phrase match (highest priority)
        if (originalSearchTerm.length >= 2) {
          if (title.includes(originalSearchTerm)) {
            relevanceScore += 20;
            matchesAnyKeyword = true;
            console.log('Exact phrase title match for:', originalSearchTerm);
          }
          if (sectionText.includes(originalSearchTerm)) {
            relevanceScore += 15;
            matchesAnyKeyword = true;
            console.log('Exact phrase content match for:', originalSearchTerm);
          }
        }
        console.log('Section:', title, 'Relevance:', relevanceScore, 'Matches:', matchesAnyKeyword);
        if (matchesAnyKeyword && relevanceScore > 0) {
          section.style.display = 'block';
          hasVisibleResults = true;

          // Store relevance score for potential sorting
          section.dataset.relevanceScore = relevanceScore;

          // Clear existing highlights first
          _this4.removeHighlights(section);

          // Highlight ALL keywords including single characters
          keywords.forEach(function (keyword) {
            console.log('Highlighting keyword:', keyword);
            _this4.highlightSearchTerm(section, keyword);
          });

          // Also highlight the original search term if it's different
          if (originalSearchTerm !== keywords.join(' ')) {
            console.log('Highlighting original term:', originalSearchTerm);
            _this4.highlightSearchTerm(section, originalSearchTerm);
          }
        } else {
          section.style.display = 'none';
          delete section.dataset.relevanceScore;
        }
      });
      console.log('Search complete. Has results:', hasVisibleResults);

      // Show "no results" message if needed
      this.showNoResultsMessage(!hasVisibleResults && searchTerm.trim().length > 0);
    }

    /**
     * Show all help sections
     */
  }, {
    key: "showAllSections",
    value: function showAllSections() {
      var helpSections = document.querySelectorAll('.help-section-card');
      helpSections.forEach(function (section) {
        section.style.display = 'block';
      });
    }

    /**
     * Show or hide "no results" message
     */
  }, {
    key: "showNoResultsMessage",
    value: function showNoResultsMessage(show) {
      var noResultsMsg = document.getElementById('help-no-results');
      if (show && !noResultsMsg) {
        // Create no results message
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'help-no-results';
        noResultsMsg.style.cssText = "\n                text-align: center;\n                padding: 20px;\n                color: #666;\n                font-style: italic;\n            ";
        noResultsMsg.textContent = 'No matching help topics found. Try different keywords.';
        var helpContent = document.getElementById('helpContent');
        if (helpContent) {
          helpContent.appendChild(noResultsMsg);
        }
      } else if (!show && noResultsMsg) {
        // Remove no results message
        if (noResultsMsg.parentNode) {
          noResultsMsg.parentNode.removeChild(noResultsMsg);
        }
      }
    }

    /**
     * Remove all highlights from all sections
     */
  }, {
    key: "removeAllHighlights",
    value: function removeAllHighlights() {
      var _this5 = this;
      var helpSections = document.querySelectorAll('.help-section-card');
      helpSections.forEach(function (section) {
        _this5.removeHighlights(section);
      });
    }

    /**
     * Highlight search terms with better handling for multi-character keywords
     */
  }, {
    key: "highlightSearchTerm",
    value: function highlightSearchTerm(element, term) {
      var _this6 = this;
      // Remove existing highlights first
      this.removeHighlights(element);
      if (!term || term.trim().length === 0) return;
      var searchTerm = term.toLowerCase().trim();

      // Use TreeWalker for better text node traversal
      var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
      var textNodes = [];
      var node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
      textNodes.forEach(function (textNode) {
        var text = textNode.textContent;
        var lowerText = text.toLowerCase();

        // Find all matches in this text node
        var matches = [];
        var searchIndex = 0;
        while ((searchIndex = lowerText.indexOf(searchTerm, searchIndex)) !== -1) {
          matches.push({
            start: searchIndex,
            end: searchIndex + searchTerm.length
          });
          searchIndex += searchTerm.length;
        }

        // Look for word boundary matches for ALL search terms
        var wordBoundaryRegex = new RegExp('\\b' + _this6.escapeRegExp(searchTerm) + '\\b', 'gi');
        var match;
        var _loop = function _loop() {
          var matchStart = match.index;
          var matchEnd = matchStart + match[0].length;
          // Only add if it doesn't overlap with existing matches
          var overlaps = matches.some(function (m) {
            return matchStart < m.end && matchEnd > m.start;
          });
          if (!overlaps) {
            matches.push({
              start: matchStart,
              end: matchEnd
            });
          }
        };
        while ((match = wordBoundaryRegex.exec(lowerText)) !== null) {
          _loop();
        }
        if (matches.length > 0) {
          // Sort matches by position and remove overlaps
          matches.sort(function (a, b) {
            return a.start - b.start;
          });

          // Build new content with highlights
          var result = '';
          var lastIndex = 0;
          matches.forEach(function (match) {
            result += text.substring(lastIndex, match.start);
            var highlightedText = text.substring(match.start, match.end);
            result += "<mark class=\"search-highlight\">".concat(highlightedText, "</mark>");
            lastIndex = match.end;
          });
          result += text.substring(lastIndex);

          // Replace the text node with highlighted version
          var tempDiv = document.createElement('div');
          tempDiv.innerHTML = result;
          var fragment = document.createDocumentFragment();
          while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
          }
          textNode.parentNode.replaceChild(fragment, textNode);
        }
      });
    }

    /**
     * Escape special regex characters
     */
  }, {
    key: "escapeRegExp",
    value: function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Remove highlights
     */
  }, {
    key: "removeHighlights",
    value: function removeHighlights(element) {
      var marks = element.querySelectorAll('mark');
      marks.forEach(function (mark) {
        mark.outerHTML = mark.innerHTML;
      });
    }

    /**
     * Initialize file tree viewer for markdown documents
     */
  }, {
    key: "initializeFileTreeViewer",
    value: (function () {
      var _initializeFileTreeViewer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var treePanel, _t3;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              // Get the file tree panel container
              treePanel = document.getElementById('helpFileTreePanel');
              if (treePanel) {
                _context5.n = 1;
                break;
              }
              console.warn('HelpSystem: File tree panel not found in DOM');
              return _context5.a(2);
            case 1:
              // Clean up existing viewer if present
              if (this.fileTreeViewer) {
                // Reset the container
                treePanel.innerHTML = '';
              }

              // Create new file tree viewer
              this.fileTreeViewer = new _fileTreeViewer_js__WEBPACK_IMPORTED_MODULE_1__["default"](treePanel);
              console.log('HelpSystem: File tree viewer initialized successfully');
              _context5.n = 3;
              break;
            case 2:
              _context5.p = 2;
              _t3 = _context5.v;
              console.error('HelpSystem: Failed to initialize file tree viewer:', _t3.message);
            case 3:
              return _context5.a(2);
          }
        }, _callee5, this, [[0, 2]]);
      }));
      function initializeFileTreeViewer() {
        return _initializeFileTreeViewer.apply(this, arguments);
      }
      return initializeFileTreeViewer;
    }()
    /**
     * Initialize documentation controls
     */
    )
  }, {
    key: "initializeDocumentationControls",
    value: function initializeDocumentationControls() {
      var _this7 = this;
      var toggleTreeBtn = document.getElementById('toggleTreeBtn');
      var backToHelpBtn = document.getElementById('backToHelpBtn');
      var panel = document.getElementById('fileTreeOverlay');
      var closeTreeBtn = document.getElementById('closeTreeBtn');

      // Toggle tree panel
      if (toggleTreeBtn && panel) {
        toggleTreeBtn.addEventListener('click', function () {
          if (panel.classList.contains('open')) {
            _this7.hideTreeView();
          } else {
            _this7.showTreeView();
          }
        });
      }

      // Close tree panel
      if (closeTreeBtn && panel) {
        closeTreeBtn.addEventListener('click', function () {
          var _document$getElementB;
          var contentPanel = (_document$getElementB = document.getElementById('helpModal')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.querySelector('.help-content-panel');
          if (contentPanel !== null && contentPanel !== void 0 && contentPanel.classList.contains('md-mode')) {
            _this7.showHelpView();
          } else {
            _this7.hideTreeView();
          }
        });
      }

      // Back to help button
      if (backToHelpBtn) {
        backToHelpBtn.addEventListener('click', function () {
          _this7.showHelpView();
        });
      }

      // Copy button
      var copyBtn = document.getElementById('mdCopyBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          _this7.copyMarkdownContent();
        });
      }

      // Hide tree button (new - keep file displayed)
      var hideTreeBtn = document.getElementById('hideTreeBtn');
      if (hideTreeBtn) {
        hideTreeBtn.addEventListener('click', function () {
          _this7.hideTreeView();
        });
      }
      console.log('HelpSystem: Documentation controls initialized');
    }

    /**
     * Show tree overlay and MD content
     */
  }, {
    key: "showTreeView",
    value: function showTreeView() {
      var _document$getElementB2;
      var overlay = document.getElementById('fileTreeOverlay');
      var contentPanel = (_document$getElementB2 = document.getElementById('helpModal')) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.querySelector('.help-content-panel');
      var toggleBtn = document.getElementById('toggleTreeBtn');
      var backBtn = document.getElementById('backToHelpBtn');

      // Show tree overlay with animation
      if (overlay) {
        overlay.classList.add('open');
      }

      // Switch to MD mode
      if (contentPanel) {
        contentPanel.classList.add('md-mode');
      }

      // Update buttons
      if (toggleBtn) {
        toggleBtn.textContent = '📁 Hide Files';
      }
      if (backBtn) {
        backBtn.style.display = 'inline-block';
      }
    }

    /**
     * Hide tree panel only (keep current file displayed)
     */
  }, {
    key: "hideTreeView",
    value: function hideTreeView() {
      var panel = document.getElementById('fileTreeOverlay');
      var toggleBtn = document.getElementById('toggleTreeBtn');

      // Hide tree panel
      if (panel) {
        panel.classList.remove('open');
      }

      // Update button
      if (toggleBtn) {
        toggleBtn.textContent = '📁 Show Files';
      }
    }

    /**
     * Show help content view
     */
  }, {
    key: "showHelpView",
    value: function showHelpView() {
      var _document$getElementB3;
      var contentPanel = (_document$getElementB3 = document.getElementById('helpModal')) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.querySelector('.help-content-panel');
      var overlay = document.getElementById('fileTreeOverlay');
      var backBtn = document.getElementById('backToHelpBtn');
      var toggleBtn = document.getElementById('toggleTreeBtn');

      // Switch to help content (remove MD mode)
      if (contentPanel) {
        contentPanel.classList.remove('md-mode');
      }

      // Keep tree visible but remove MD mode
      if (overlay && overlay.classList.contains('open')) {
        overlay.classList.remove('open');
      }

      // Update buttons
      if (backBtn) {
        backBtn.style.display = 'none';
      }
      if (toggleBtn) {
        toggleBtn.textContent = '📁 Show Files';
      }

      // Clear current file title
      var fileNameSpan = document.getElementById('fileName');
      if (fileNameSpan) {
        fileNameSpan.textContent = 'None Selected';
      }
    }

    /**
     * Update MD file display
     */
  }, {
    key: "showMarkdownFile",
    value: (function () {
      var _showMarkdownFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(filePath, fileContent) {
        var _document$getElementB4;
        var fileNameSpan, mdContentBody, contentPanel, fileName, renderedContent;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              fileNameSpan = document.getElementById('fileName');
              mdContentBody = document.getElementById('mdContentBody');
              contentPanel = (_document$getElementB4 = document.getElementById('helpModal')) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.querySelector('.help-content-panel'); // Update file name
              if (fileNameSpan) {
                fileName = filePath.split('/').pop();
                fileNameSpan.textContent = fileName;
              }

              // Switch to MD viewer mode
              if (contentPanel && !contentPanel.classList.contains('md-mode')) {
                contentPanel.classList.add('md-mode');
              }

              // Update content
              if (mdContentBody && fileContent) {
                // Simple markdown-like rendering
                renderedContent = this.renderMarkdownText(fileContent);
                mdContentBody.innerHTML = renderedContent;
              }
            case 1:
              return _context6.a(2);
          }
        }, _callee6, this);
      }));
      function showMarkdownFile(_x, _x2) {
        return _showMarkdownFile.apply(this, arguments);
      }
      return showMarkdownFile;
    }()
    /**
     * Simple markdown rendering
     */
    )
  }, {
    key: "renderMarkdownText",
    value: function renderMarkdownText(content) {
      if (!content) return '<p>No content available</p>';
      return content.split('\n').map(function (line) {
        if (line.startsWith('# ')) {
          return "<h2 style=\"color: #007acc; margin-top: 20px; margin-bottom: 10px;\">".concat(line.substring(2), "</h2>");
        } else if (line.startsWith('## ')) {
          return "<h3 style=\"color: #258ed4; margin-top: 16px; margin-bottom: 8px;\">".concat(line.substring(3), "</h3>");
        } else if (line.trim() === '') {
          return '<br>';
        } else {
          return "<p style=\"margin-bottom: 8px;\">".concat(line, "</p>");
        }
      }).join('');
    }

    /**
     * Copy markdown content to clipboard
     */
  }, {
    key: "copyMarkdownContent",
    value: (function () {
      var _copyMarkdownContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        var mdContentBody, copyBtn, originalText, _t4;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              mdContentBody = document.getElementById('mdContentBody');
              if (!(mdContentBody && mdContentBody.textContent.trim())) {
                _context7.n = 4;
                break;
              }
              _context7.p = 1;
              _context7.n = 2;
              return navigator.clipboard.writeText(mdContentBody.textContent);
            case 2:
              // Provide visual feedback
              copyBtn = document.getElementById('mdCopyBtn');
              if (copyBtn) {
                originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                copyBtn.style.background = '#28a745';
                setTimeout(function () {
                  copyBtn.textContent = originalText;
                  copyBtn.style.background = '#007acc';
                }, 1500);
              }
              _context7.n = 4;
              break;
            case 3:
              _context7.p = 3;
              _t4 = _context7.v;
              console.error('Failed to copy:', _t4);
            case 4:
              return _context7.a(2);
          }
        }, _callee7, null, [[1, 3]]);
      }));
      function copyMarkdownContent() {
        return _copyMarkdownContent.apply(this, arguments);
      }
      return copyMarkdownContent;
    }())
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HelpSystem);

/***/ }),

/***/ "./src/client/js/ui/modalManager.js":
/*!******************************************!*\
  !*** ./src/client/js/ui/modalManager.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modals.js */ "./src/client/js/ui/modals.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Modal Manager Module
 * Handles modal dialogs and overlays
 */


var ModalManagerWrapper = /*#__PURE__*/function () {
  function ModalManagerWrapper() {
    _classCallCheck(this, ModalManagerWrapper);
    this.modalManager = new _modals_js__WEBPACK_IMPORTED_MODULE_0__.ModalManager();
  }

  /**
   * Show modal by ID
   */
  return _createClass(ModalManagerWrapper, [{
    key: "showModal",
    value: function showModal(modalId) {
      if (this.modalManager) {
        this.modalManager.showModal(modalId);
      } else {
        console.error('ModalManager module not available');
      }
    }

    /**
     * Close modal by ID
     */
  }, {
    key: "closeModal",
    value: function closeModal(modalId) {
      if (this.modalManager) {
        this.modalManager.closeModal(modalId);
      } else {
        console.error('ModalManager module not available');
      }
    }

    /**
     * Close configurator modal
     */
  }, {
    key: "closeConfigurator",
    value: function closeConfigurator() {
      var modal = document.getElementById('configuratorModal');
      if (modal) {
        modal.style.display = 'none';
      }
      // Additional configurator cleanup would go here
    }

    /**
     * Close G-code viewer modal
     */
  }, {
    key: "closeGcodeViewer",
    value: function closeGcodeViewer() {
      var modal = document.getElementById('gcodeViewerModal');
      if (modal) {
        modal.style.display = 'none';
      }

      // Clean up Three.js renderer
      try {
        var gcode3d = document.getElementById('gcode3d');
        if (gcode3d) {
          gcode3d.innerHTML = '';
        }

        // Stop any running animation
        if (window.gcodeSimAnimationId) {
          clearTimeout(window.gcodeSimAnimationId);
          window.gcodeSimAnimationId = null;
        }

        // Reset global variables to prevent memory leaks
        window.gcodeToolpathPoints = null;
        window.gcodeToolpathSegments = null;
        window.gcodeToolpathModes = null;
        window.gcodeLineMap = null;
        window.gcodeLines = null;
        window.gcodeSegmentCounts = null;
        window.gcodeScene = null;
        window.gcodeCamera = null;
        window.gcodeToolMesh = null;
        window.gcodeRender = null;
      } catch (error) {
        console.error('Error closing G-code viewer:', error);
      }
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModalManagerWrapper);

/***/ }),

/***/ "./src/client/js/ui/modals.js":
/*!************************************!*\
  !*** ./src/client/js/ui/modals.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModalManager: () => (/* binding */ ModalManager),
/* harmony export */   modalManager: () => (/* binding */ modalManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Modal Management Module
 *
 * Provides a centralized system for managing modal dialogs with:
 * - Show/hide functionality
 * - Backdrop click handling
 * - Keyboard navigation (ESC key)
 * - Event management
 * - Reusable modal component system
 */
var ModalManager = /*#__PURE__*/function () {
  function ModalManager() {
    _classCallCheck(this, ModalManager);
    this.activeModals = new Set();
    this.eventListeners = new Map();
    this.setupGlobalEventListeners();
  }

  /**
   * Setup global event listeners for keyboard navigation
   */
  return _createClass(ModalManager, [{
    key: "setupGlobalEventListeners",
    value: function setupGlobalEventListeners() {
      var _this = this;
      // ESC key to close topmost modal
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && _this.activeModals.size > 0) {
          var modals = Array.from(_this.activeModals);
          var topModal = modals[modals.length - 1];
          _this.closeModal(topModal);
        }
      });
    }

    /**
     * Show a modal by ID
     * @param {string} modalId - The ID of the modal element
     * @param {Object} options - Configuration options
     * @param {boolean} options.closeOnBackdrop - Whether to close on backdrop click (default: true)
     * @param {Function} options.onShow - Callback when modal is shown
     * @param {Function} options.onClose - Callback when modal is closed
     */
  }, {
    key: "showModal",
    value: function showModal(modalId) {
      var _this2 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var modal = document.getElementById(modalId);
      if (!modal) {
        console.error("Modal with ID '".concat(modalId, "' not found"));
        return false;
      }
      var config = _objectSpread({
        closeOnBackdrop: true,
        onShow: null,
        onClose: null
      }, options);

      // Store configuration for this modal
      this.eventListeners.set(modalId, config);

      // Show the modal
      modal.style.display = 'flex';
      this.activeModals.add(modalId);

      // Setup backdrop click handler
      if (config.closeOnBackdrop) {
        var backdropHandler = function backdropHandler(e) {
          if (e.target === modal) {
            _this2.closeModal(modalId);
          }
        };
        modal.addEventListener('click', backdropHandler);

        // Store handler for cleanup
        if (!modal._modalBackdropHandler) {
          modal._modalBackdropHandler = backdropHandler;
        }
      }

      // Focus management - focus first focusable element
      this.focusFirstElement(modal);

      // Call onShow callback
      if (config.onShow && typeof config.onShow === 'function') {
        config.onShow(modalId);
      }
      return true;
    }

    /**
     * Close a modal by ID
     * @param {string} modalId - The ID of the modal element
     */
  }, {
    key: "closeModal",
    value: function closeModal(modalId) {
      var modal = document.getElementById(modalId);
      if (!modal) {
        console.error("Modal with ID '".concat(modalId, "' not found"));
        return false;
      }

      // Hide the modal
      modal.style.display = 'none';
      this.activeModals["delete"](modalId);

      // Get configuration
      var config = this.eventListeners.get(modalId);

      // Cleanup backdrop handler
      if (modal._modalBackdropHandler) {
        modal.removeEventListener('click', modal._modalBackdropHandler);
        delete modal._modalBackdropHandler;
      }

      // Call onClose callback
      if (config && config.onClose && typeof config.onClose === 'function') {
        config.onClose(modalId);
      }

      // Clean up configuration
      this.eventListeners["delete"](modalId);
      return true;
    }

    /**
     * Check if a modal is currently open
     * @param {string} modalId - The ID of the modal element
     * @returns {boolean}
     */
  }, {
    key: "isModalOpen",
    value: function isModalOpen(modalId) {
      return this.activeModals.has(modalId);
    }

    /**
     * Close all open modals
     */
  }, {
    key: "closeAllModals",
    value: function closeAllModals() {
      var _this3 = this;
      var modals = Array.from(this.activeModals);
      modals.forEach(function (modalId) {
        return _this3.closeModal(modalId);
      });
    }

    /**
     * Focus the first focusable element in the modal
     * @param {HTMLElement} modal - The modal element
     */
  }, {
    key: "focusFirstElement",
    value: function focusFirstElement(modal) {
      var focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        // Skip close button, focus first interactive element
        var firstElement = Array.from(focusableElements).find(function (el) {
          return !el.classList.contains('modal-close');
        }) || focusableElements[0];
        setTimeout(function () {
          return firstElement.focus();
        }, 100);
      }
    }

    /**
     * Create a reusable modal component
     * @param {Object} config - Modal configuration
     * @param {string} config.id - Modal ID
     * @param {string} config.title - Modal title
     * @param {string} config.content - Modal content HTML
     * @param {Array} config.buttons - Array of button configurations
     * @param {string} config.size - Modal size ('small', 'medium', 'large')
     * @returns {HTMLElement} The created modal element
     */
  }, {
    key: "createModal",
    value: function createModal(config) {
      var _this4 = this;
      var id = config.id,
        _config$title = config.title,
        title = _config$title === void 0 ? '' : _config$title,
        _config$content = config.content,
        content = _config$content === void 0 ? '' : _config$content,
        _config$buttons = config.buttons,
        buttons = _config$buttons === void 0 ? [] : _config$buttons,
        _config$size = config.size,
        size = _config$size === void 0 ? 'medium' : _config$size;

      // Create modal structure
      var modal = document.createElement('div');
      modal.id = id;
      modal.className = "modal-overlay modal-".concat(size);
      modal.style.display = 'none';
      var modalContent = document.createElement('div');
      modalContent.className = 'modal-content';

      // Header
      var header = document.createElement('div');
      header.className = 'modal-header';
      var titleElement = document.createElement('h2');
      titleElement.className = 'modal-title';
      titleElement.textContent = title;
      var closeButton = document.createElement('button');
      closeButton.className = 'modal-close';
      closeButton.innerHTML = '&times;';
      closeButton.onclick = function () {
        return _this4.closeModal(id);
      };
      header.appendChild(titleElement);
      header.appendChild(closeButton);

      // Body
      var body = document.createElement('div');
      body.className = 'modal-body';
      body.innerHTML = content;

      // Footer (if buttons provided)
      var footer = null;
      if (buttons.length > 0) {
        footer = document.createElement('div');
        footer.className = 'modal-footer';
        buttons.forEach(function (buttonConfig) {
          var button = document.createElement('button');
          button.textContent = buttonConfig.text || 'Button';
          button.className = buttonConfig.className || 'modal-button';
          if (buttonConfig.onClick) {
            button.onclick = function (e) {
              return buttonConfig.onClick(e, id);
            };
          }
          footer.appendChild(button);
        });
      }

      // Assemble modal
      modalContent.appendChild(header);
      modalContent.appendChild(body);
      if (footer) {
        modalContent.appendChild(footer);
      }
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      return modal;
    }

    /**
     * Update modal content
     * @param {string} modalId - The ID of the modal element
     * @param {string} content - New content HTML
     */
  }, {
    key: "updateModalContent",
    value: function updateModalContent(modalId, content) {
      var modal = document.getElementById(modalId);
      if (!modal) {
        console.error("Modal with ID '".concat(modalId, "' not found"));
        return false;
      }
      var body = modal.querySelector('.modal-body');
      if (body) {
        body.innerHTML = content;
        return true;
      }
      return false;
    }

    /**
     * Update modal title
     * @param {string} modalId - The ID of the modal element
     * @param {string} title - New title text
     */
  }, {
    key: "updateModalTitle",
    value: function updateModalTitle(modalId, title) {
      var modal = document.getElementById(modalId);
      if (!modal) {
        console.error("Modal with ID '".concat(modalId, "' not found"));
        return false;
      }
      var titleElement = modal.querySelector('.modal-title');
      if (titleElement) {
        titleElement.textContent = title;
        return true;
      }
      return false;
    }
  }]);
}(); // Create global instance
var modalManager = new ModalManager();

// Export for module use


// Global functions for backward compatibility
window.showModal = function (modalId, options) {
  return modalManager.showModal(modalId, options);
};
window.closeModal = function (modalId) {
  return modalManager.closeModal(modalId);
};

// Export global functions for legacy code
window.modalManager = modalManager;

/***/ }),

/***/ "./src/client/js/ui/navigation.js":
/*!****************************************!*\
  !*** ./src/client/js/ui/navigation.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Navigation Loading States Manager
 * Handles loading indicators for page navigation and actions
 * Uses pre-existing HTML elements for better performance and maintainability
 */
var NavigationManager = /*#__PURE__*/function () {
  function NavigationManager() {
    _classCallCheck(this, NavigationManager);
    this.loadingStates = new Map();
    this.globalLoader = null;
    this.init();
  }
  return _createClass(NavigationManager, [{
    key: "init",
    value: function init() {
      this.setupElements();
      this.setupEventListeners();
    }
  }, {
    key: "setupElements",
    value: function setupElements() {
      // Get existing HTML elements instead of creating them dynamically
      this.globalLoader = document.getElementById('globalLoader');
      if (!this.globalLoader) {
        console.warn('Global loader element not found. Navigation loading may not work properly.');
      }
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;
      // Intercept all link clicks for SPA-like loading
      document.addEventListener('click', function (_e) {
        var link = _e.target.closest('a[href]');
        if (link && !link.hasAttribute('data-no-loading')) {
          // Don't intercept blob URLs (file downloads) or external links
          var href = link.href;
          if (href.startsWith('blob:') || href.startsWith('http://') || href.startsWith('https://')) {
            return; // Let the browser handle these normally
          }
          _e.preventDefault();
          _this.navigateTo(href, link.textContent);
        }
      });

      // Handle browser back/forward buttons
      window.addEventListener('popstate', function (_e) {
        _this.showLoading('Loading page...');
        setTimeout(function () {
          return _this.hideLoading();
        }, 1000);
      });

      // Handle form submissions
      document.addEventListener('submit', function (e) {
        var form = e.target;
        if (!form.hasAttribute('data-no-loading')) {
          _this.showLoading('Processing...');
        }
      });
    }
  }, {
    key: "showLoading",
    value: function showLoading() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Loading...';
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (element) {
        // Show loading on specific element
        this.showElementLoader(element, message);
      } else {
        // Show global loader
        this.showGlobalLoader(message);
      }
    }
  }, {
    key: "hideLoading",
    value: function hideLoading() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (element) {
        this.hideElementLoader(element);
      } else {
        this.hideGlobalLoader();
      }
    }
  }, {
    key: "showGlobalLoader",
    value: function showGlobalLoader(message) {
      if (this.globalLoader) {
        var textElement = this.globalLoader.querySelector('.navigation-text');
        if (textElement) {
          textElement.textContent = message;
        }
        this.globalLoader.style.display = 'flex';
      }
    }
  }, {
    key: "hideGlobalLoader",
    value: function hideGlobalLoader() {
      if (this.globalLoader) {
        this.globalLoader.style.display = 'none';
      }
    }
  }, {
    key: "showElementLoader",
    value: function showElementLoader(element, message) {
      var rect = element.getBoundingClientRect();
      var loader = document.createElement('div');
      loader.className = 'element-loader';

      // Set position and size using CSS classes and inline positioning only
      Object.assign(loader.style, {
        top: "".concat(rect.top, "px"),
        left: "".concat(rect.left, "px"),
        width: "".concat(rect.width, "px"),
        height: "".concat(rect.height, "px")
      });
      loader.innerHTML = "\n      <div class=\"navigation-spinner\"></div>\n      <span>".concat(message, "</span>\n    ");
      document.body.appendChild(loader);
      this.loadingStates.set(element, loader);
    }
  }, {
    key: "hideElementLoader",
    value: function hideElementLoader(element) {
      var loader = this.loadingStates.get(element);
      if (loader) {
        loader.remove();
        this.loadingStates["delete"](element);
      }
    }
  }, {
    key: "navigateTo",
    value: function navigateTo(url) {
      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      this.showLoading("Loading ".concat(title, "..."));

      // Simulate navigation delay
      setTimeout(function () {
        window.location.href = url;
      }, 500);
    }

    // Utility methods for common actions
  }, {
    key: "showButtonLoading",
    value: function showButtonLoading(button) {
      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Loading...';
      var originalHTML = button.innerHTML;
      button.disabled = true;
      button.classList.add('button-loading');
      button.innerHTML = "\n      <span class=\"navigation-spinner\"></span>\n      ".concat(message, "\n    ");
      return function () {
        button.disabled = false;
        button.classList.remove('button-loading');
        button.innerHTML = originalHTML;
      };
    }
  }, {
    key: "showFormLoading",
    value: function showFormLoading(form) {
      var _this2 = this;
      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Submitting...';
      var submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
      var restoreFunctions = [];
      submitButtons.forEach(function (button) {
        restoreFunctions.push(_this2.showButtonLoading(button, message));
      });

      // Disable all form inputs
      var inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(function (input) {
        input.disabled = true;
      });
      return function () {
        restoreFunctions.forEach(function (restore) {
          return restore();
        });
        inputs.forEach(function (input) {
          input.disabled = false;
        });
      };
    }
  }]);
}(); // Initialize navigation manager
var navigationManager = new NavigationManager();

// Export for global access
window.NavigationManager = NavigationManager;
window.navigationManager = navigationManager;

// Convenience functions
window.showLoading = function (message, element) {
  return navigationManager.showLoading(message, element);
};
window.hideLoading = function (element) {
  return navigationManager.hideLoading(element);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NavigationManager);

/***/ })

}]);
//# sourceMappingURL=src_client_js_core_applicationManager_js.js.map