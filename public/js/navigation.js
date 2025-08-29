/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!****************************************!*\
  !*** ./src/client/js/ui/navigation.js ***!
  \****************************************/
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
/******/ })()
;
//# sourceMappingURL=navigation.js.map