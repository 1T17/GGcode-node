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

class ModalManager {
  constructor() {
    this.activeModals = new Set();
    this.eventListeners = new Map();
    this.setupGlobalEventListeners();
  }

  /**
   * Setup global event listeners for keyboard navigation
   */
  setupGlobalEventListeners() {
    // ESC key to close topmost modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModals.size > 0) {
        const modals = Array.from(this.activeModals);
        const topModal = modals[modals.length - 1];
        this.closeModal(topModal);
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
  showModal(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with ID '${modalId}' not found`);
      return false;
    }

    const config = {
      closeOnBackdrop: true,
      onShow: null,
      onClose: null,
      ...options,
    };

    // Store configuration for this modal
    this.eventListeners.set(modalId, config);

    // Show the modal
    modal.style.display = 'flex';
    this.activeModals.add(modalId);

    // Setup backdrop click handler
    if (config.closeOnBackdrop) {
      const backdropHandler = (e) => {
        if (e.target === modal) {
          this.closeModal(modalId);
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
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with ID '${modalId}' not found`);
      return false;
    }

    // Hide the modal
    modal.style.display = 'none';
    this.activeModals.delete(modalId);

    // Get configuration
    const config = this.eventListeners.get(modalId);

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
    this.eventListeners.delete(modalId);

    return true;
  }

  /**
   * Check if a modal is currently open
   * @param {string} modalId - The ID of the modal element
   * @returns {boolean}
   */
  isModalOpen(modalId) {
    return this.activeModals.has(modalId);
  }

  /**
   * Close all open modals
   */
  closeAllModals() {
    const modals = Array.from(this.activeModals);
    modals.forEach((modalId) => this.closeModal(modalId));
  }

  /**
   * Focus the first focusable element in the modal
   * @param {HTMLElement} modal - The modal element
   */
  focusFirstElement(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      // Skip close button, focus first interactive element
      const firstElement =
        Array.from(focusableElements).find(
          (el) => !el.classList.contains('modal-close')
        ) || focusableElements[0];

      setTimeout(() => firstElement.focus(), 100);
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
  createModal(config) {
    const {
      id,
      title = '',
      content = '',
      buttons = [],
      size = 'medium',
    } = config;

    // Create modal structure
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = `modal-overlay modal-${size}`;
    modal.style.display = 'none';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';

    const titleElement = document.createElement('h2');
    titleElement.className = 'modal-title';
    titleElement.textContent = title;

    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => this.closeModal(id);

    header.appendChild(titleElement);
    header.appendChild(closeButton);

    // Body
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = content;

    // Footer (if buttons provided)
    let footer = null;
    if (buttons.length > 0) {
      footer = document.createElement('div');
      footer.className = 'modal-footer';

      buttons.forEach((buttonConfig) => {
        const button = document.createElement('button');
        button.textContent = buttonConfig.text || 'Button';
        button.className = buttonConfig.className || 'modal-button';

        if (buttonConfig.onClick) {
          button.onclick = (e) => buttonConfig.onClick(e, id);
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
  updateModalContent(modalId, content) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with ID '${modalId}' not found`);
      return false;
    }

    const body = modal.querySelector('.modal-body');
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
  updateModalTitle(modalId, title) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with ID '${modalId}' not found`);
      return false;
    }

    const titleElement = modal.querySelector('.modal-title');
    if (titleElement) {
      titleElement.textContent = title;
      return true;
    }

    return false;
  }
}

// Create global instance
const modalManager = new ModalManager();

// Export for module use
export { ModalManager, modalManager };

// Global functions for backward compatibility
window.showModal = (modalId, options) =>
  modalManager.showModal(modalId, options);
window.closeModal = (modalId) => modalManager.closeModal(modalId);

// Export global functions for legacy code
window.modalManager = modalManager;
