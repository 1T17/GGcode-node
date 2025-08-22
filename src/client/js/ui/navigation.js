/**
 * Navigation Loading States Manager
 * Handles loading indicators for page navigation and actions
 */

class NavigationManager {
  constructor() {
    this.loadingStates = new Map();
    this.globalLoader = null;
    this.init();
  }

  init() {
    this.createGlobalLoader();
    this.setupEventListeners();
  }

  createGlobalLoader() {
    // Create global loading overlay
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-size: 16px;
        `;

    loader.innerHTML = `
            <div style="text-align: center;">
                <div class="loading-spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid #ffffff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <div class="loading-text">Loading...</div>
            </div>
        `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(loader);
    this.globalLoader = loader;
  }

  setupEventListeners() {
    // Intercept all link clicks for SPA-like loading
    document.addEventListener('click', (_e) => {
      const link = _e.target.closest('a[href]');
      if (link && !link.hasAttribute('data-no-loading')) {
        _e.preventDefault();
        this.navigateTo(link.href, link.textContent);
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
      const textElement = this.globalLoader.querySelector('.loading-text');
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
    loader.style.cssText = `
            position: absolute;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            color: white;
            font-size: 14px;
        `;

    loader.innerHTML = `
            <div class="loading-spinner" style="
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid #ffffff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 10px;
            "></div>
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
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = `
            <span class="loading-spinner" style="
                width: 12px;
                height: 12px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-top: 1px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 5px;
                display: inline-block;
            "></span>
            ${message}
        `;

    return () => {
      button.disabled = false;
      button.textContent = originalText;
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
