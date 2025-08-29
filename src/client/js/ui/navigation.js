/**
 * Navigation Loading States Manager
 * Handles loading indicators for page navigation and actions
 * Uses pre-existing HTML elements for better performance and maintainability
 */

class NavigationManager {
  constructor() {
    this.loadingStates = new Map();
    this.globalLoader = null;
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
  }

  setupElements() {
    // Get existing HTML elements instead of creating them dynamically
    this.globalLoader = document.getElementById('globalLoader');
    if (!this.globalLoader) {
      console.warn(
        'Global loader element not found. Navigation loading may not work properly.'
      );
    }
  }

  setupEventListeners() {
    // Intercept all link clicks for SPA-like loading
    document.addEventListener('click', (_e) => {
      const link = _e.target.closest('a[href]');
      if (link && !link.hasAttribute('data-no-loading')) {
        // Don't intercept blob URLs (file downloads) or external links
        const href = link.href;
        if (
          href.startsWith('blob:') ||
          href.startsWith('http://') ||
          href.startsWith('https://')
        ) {
          return; // Let the browser handle these normally
        }
        _e.preventDefault();
        this.navigateTo(href, link.textContent);
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (_e) => {
      this.showLoading('Loading page...');
      setTimeout(() => this.hideLoading(), 1000);
    });

    // Handle form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (!form.hasAttribute('data-no-loading')) {
        this.showLoading('Processing...');
      }
    });
  }

  showLoading(message = 'Loading...', element = null) {
    if (element) {
      // Show loading on specific element
      this.showElementLoader(element, message);
    } else {
      // Show global loader
      this.showGlobalLoader(message);
    }
  }

  hideLoading(element = null) {
    if (element) {
      this.hideElementLoader(element);
    } else {
      this.hideGlobalLoader();
    }
  }

  showGlobalLoader(message) {
    if (this.globalLoader) {
      const textElement = this.globalLoader.querySelector('.navigation-text');
      if (textElement) {
        textElement.textContent = message;
      }
      this.globalLoader.style.display = 'flex';
    }
  }

  hideGlobalLoader() {
    if (this.globalLoader) {
      this.globalLoader.style.display = 'none';
    }
  }

  showElementLoader(element, message) {
    const rect = element.getBoundingClientRect();
    const loader = document.createElement('div');
    loader.className = 'element-loader';

    // Set position and size using CSS classes and inline positioning only
    Object.assign(loader.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });

    loader.innerHTML = `
      <div class="navigation-spinner"></div>
      <span>${message}</span>
    `;

    document.body.appendChild(loader);
    this.loadingStates.set(element, loader);
  }

  hideElementLoader(element) {
    const loader = this.loadingStates.get(element);
    if (loader) {
      loader.remove();
      this.loadingStates.delete(element);
    }
  }

  navigateTo(url, title = '') {
    this.showLoading(`Loading ${title}...`);

    // Simulate navigation delay
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  }

  // Utility methods for common actions
  showButtonLoading(button, message = 'Loading...') {
    const originalHTML = button.innerHTML;
    button.disabled = true;
    button.classList.add('button-loading');

    button.innerHTML = `
      <span class="navigation-spinner"></span>
      ${message}
    `;

    return () => {
      button.disabled = false;
      button.classList.remove('button-loading');
      button.innerHTML = originalHTML;
    };
  }

  showFormLoading(form, message = 'Submitting...') {
    const submitButtons = form.querySelectorAll(
      'button[type="submit"], input[type="submit"]'
    );
    const restoreFunctions = [];

    submitButtons.forEach((button) => {
      restoreFunctions.push(this.showButtonLoading(button, message));
    });

    // Disable all form inputs
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      input.disabled = true;
    });

    return () => {
      restoreFunctions.forEach((restore) => restore());
      inputs.forEach((input) => {
        input.disabled = false;
      });
    };
  }
}

// Initialize navigation manager
const navigationManager = new NavigationManager();

// Export for global access
window.NavigationManager = NavigationManager;
window.navigationManager = navigationManager;

// Convenience functions
window.showLoading = (message, element) =>
  navigationManager.showLoading(message, element);
window.hideLoading = (element) => navigationManager.hideLoading(element);

export default NavigationManager;
