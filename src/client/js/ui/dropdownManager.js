/**
 * Standardized Dropdown Manager
 * Provides consistent dropdown functionality across the application
 * Based on the custom dropdown system from fix drop down.md
 */

class DropdownManager {
  constructor() {
    this.activeDropdowns = new Set();
    this.registeredDropdowns = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the dropdown manager
   */
  init() {
    if (this.initialized) return;

    // Global click handler for closing dropdowns
    document.addEventListener('click', (e) => {
      this.handleGlobalClick(e);
    });

    // Global keyboard handler for accessibility
    document.addEventListener('keydown', (e) => {
      this.handleGlobalKeydown(e);
    });

    this.initialized = true;
    console.log('DropdownManager initialized');
  }

  /**
   * Register an existing dropdown with the manager
   * @param {string} id - Unique identifier for the dropdown
   * @param {HTMLElement} element - The dropdown container element
   * @param {Object} options - Configuration options
   * @returns {Object|null} Registered dropdown object or null if failed
   */
  registerDropdown(id, element, options = {}) {
    // Validate inputs
    if (!id || typeof id !== 'string') {
      console.error('DropdownManager: Invalid dropdown ID provided');
      return null;
    }

    if (!element || !(element instanceof HTMLElement)) {
      console.error(
        'DropdownManager: Invalid element provided for dropdown',
        id
      );
      return null;
    }

    if (this.registeredDropdowns.has(id)) {
      console.warn(
        `DropdownManager: Dropdown with ID '${id}' is already registered`
      );
      return this.registeredDropdowns.get(id);
    }

    // Default configuration options
    const defaultOptions = {
      closeOnOutsideClick: true,
      closeOnEscape: true,
      exclusive: true, // Only one dropdown open at a time
      onOpen: null,
      onClose: null,
      onSelect: null,
      customToggleLogic: null,
      updateButtonText: true, // AI Actions dropdown sets this to false
      persist: false,
      storageKey: null,
    };

    const config = { ...defaultOptions, ...options };

    // Create dropdown object
    const dropdown = {
      id,
      element,
      options: config,
      isOpen: false,
      toggleButton: null,
      contentElement: null,
      items: [],
    };

    // Auto-detect dropdown structure based on common patterns
    this.detectDropdownStructure(dropdown);

    // Validate that we found the necessary elements
    if (!dropdown.toggleButton || !dropdown.contentElement) {
      console.error(
        `DropdownManager: Could not detect dropdown structure for '${id}'`
      );
      return null;
    }

    // Setup event listeners for this dropdown
    this.setupRegisteredDropdownEvents(dropdown);

    // Store the dropdown
    this.registeredDropdowns.set(id, dropdown);
    element._dropdownId = id;

    //console.log(`DropdownManager: Successfully registered dropdown '${id}'`);
    return dropdown;
  }

  /**
   * Auto-detect dropdown structure based on common patterns
   * @param {Object} dropdown - Dropdown object to populate
   */
  detectDropdownStructure(dropdown) {
    const { element } = dropdown;

    // Pattern 1: AI dropdowns with .dropdown-content
    let contentElement = element.querySelector('.dropdown-content');
    let toggleButton = element.querySelector(
      'button[id*="Btn"], button[class*="btn"]'
    );

    // Pattern 2: Language dropdown with .select-items
    if (!contentElement) {
      contentElement = element.querySelector('.select-items');
      toggleButton = element.querySelector('.select-selected');
    }

    // Pattern 3: Generic patterns
    if (!contentElement) {
      contentElement = element.querySelector(
        '[class*="content"], [class*="items"], [class*="menu"]'
      );
    }

    if (!toggleButton) {
      toggleButton = element.querySelector(
        'button, [class*="trigger"], [class*="selected"]'
      );
    }

    dropdown.contentElement = contentElement;
    dropdown.toggleButton = toggleButton;

    // Find dropdown items
    if (contentElement) {
      const items = contentElement.querySelectorAll(
        '.dropdown-option, .select-option, [data-value], [data-action]'
      );
      dropdown.items = Array.from(items);
    }
  }

  /**
   * Setup event listeners for a registered dropdown
   * @param {Object} dropdown - Registered dropdown object
   */
  setupRegisteredDropdownEvents(dropdown) {
    const { toggleButton, items, options } = dropdown;

    // Remove any existing event listeners to prevent duplicates
    if (toggleButton._dropdownClickHandler) {
      toggleButton.removeEventListener(
        'click',
        toggleButton._dropdownClickHandler
      );
    }

    // Create and store the click handler
    const clickHandler = (e) => {
      e.stopPropagation();

      if (options.customToggleLogic) {
        options.customToggleLogic(dropdown, e);
      } else {
        this.toggleRegisteredDropdown(dropdown.id);
      }
    };

    toggleButton._dropdownClickHandler = clickHandler;
    toggleButton.addEventListener('click', clickHandler);

    // Setup item click handlers
    items.forEach((item, _index) => {
      if (item._dropdownItemHandler) {
        item.removeEventListener('click', item._dropdownItemHandler);
      }

      const itemHandler = (e) => {
        e.stopPropagation();
        const value =
          item.getAttribute('data-value') ||
          item.getAttribute('data-action') ||
          item.textContent.trim();
        this.selectRegisteredDropdownItem(dropdown.id, value, item);
      };

      item._dropdownItemHandler = itemHandler;
      item.addEventListener('click', itemHandler);
    });
  }

  /**
   * Create a standardized dropdown
   * @param {Object} options - Dropdown configuration
   */
  createDropdown(options) {
    const {
      containerId,
      triggerSelector,
      contentSelector,
      itemsSelector,
      storageKey,
      defaultValue,
      persist = true,
    } = options;

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Dropdown container ${containerId} not found`);
      return null;
    }

    const trigger = container.querySelector(triggerSelector);
    const content = container.querySelector(contentSelector);
    const items = content ? content.querySelectorAll(itemsSelector) : [];

    if (!trigger || !content) {
      console.warn(`Dropdown elements not found in ${containerId}`);
      return null;
    }

    const dropdown = {
      container,
      trigger,
      content,
      items,
      options,
      isOpen: false,
    };

    // Load persisted value
    if (persist && storageKey) {
      const savedValue = localStorage.getItem(storageKey) || defaultValue;
      this.setSelectedValue(dropdown, savedValue);
    }

    // Setup event listeners
    this.setupDropdownEvents(dropdown);

    // Store reference
    container._dropdown = dropdown;

    return dropdown;
  }

  /**
   * Setup event listeners for a dropdown
   */
  setupDropdownEvents(dropdown) {
    const { trigger, items } = dropdown;

    // Trigger click handler
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown(dropdown);
    });

    // Item click handlers
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const value =
          item.getAttribute('data-value') || item.textContent.trim();
        this.selectItem(dropdown, item, value);
      });
    });
  }

  /**
   * Toggle dropdown open/close state
   */
  toggleDropdown(dropdown) {
    if (dropdown.isOpen) {
      this.closeDropdown(dropdown);
    } else {
      this.openDropdown(dropdown);
    }
  }

  /**
   * Open a dropdown
   */
  openDropdown(dropdown) {
    const { content, options, trigger } = dropdown;

    // Close other dropdowns first
    this.closeAllDropdowns();

    // Open this dropdown
    content.classList.remove('select-hide');
    trigger.classList.add('active');
    dropdown.isOpen = true;
    this.activeDropdowns.add(dropdown);

    // Call onOpen callback
    if (options.onOpen) {
      options.onOpen(dropdown);
    }

    // Ensure dropdown is in viewport
    this.ensureDropdownInViewport(dropdown);
  }

  /**
   * Close a dropdown
   */
  closeDropdown(dropdown) {
    const { content, options, trigger } = dropdown;

    if (!dropdown.isOpen) return;

    content.classList.add('select-hide');
    trigger.classList.remove('active');
    dropdown.isOpen = false;
    this.activeDropdowns.delete(dropdown);

    // Call onClose callback
    if (options.onClose) {
      options.onClose(dropdown);
    }
  }

  /**
   * Close all active dropdowns
   */
  closeAllDropdowns() {
    this.activeDropdowns.forEach((dropdown) => {
      this.closeDropdown(dropdown);
    });
  }

  /**
   * Handle item selection
   */
  selectItem(dropdown, item, value) {
    const { options, trigger } = dropdown;

    // Check if this is the AI Quick Actions dropdown - skip visual update
    if (trigger && trigger.classList.contains('ai-actions-dropdown-btn')) {
      // Only update selected state for items, don't change button text
      const selectedItem = Array.from(dropdown.items).find(
        (i) => (i.getAttribute('data-value') || i.textContent.trim()) === value
      );

      if (selectedItem) {
        dropdown.items.forEach((i) => i.classList.remove('selected'));
        selectedItem.classList.add('selected');
      }
    } else {
      // Update visual selection for other dropdowns
      this.setSelectedValue(dropdown, value);
    }

    // Persist to localStorage
    if (options.persist && options.storageKey) {
      localStorage.setItem(options.storageKey, value);
    }

    // Call onSelect callback
    if (options.onSelect) {
      options.onSelect(value, item, dropdown);
    }

    // Close dropdown
    this.closeDropdown(dropdown);
  }

  /**
   * Set the selected value for a dropdown
   */
  setSelectedValue(dropdown, value) {
    const { trigger, items } = dropdown;

    // Check if this is the AI Quick Actions dropdown - don't update button text
    if (trigger && trigger.classList.contains('ai-actions-dropdown-btn')) {
      // Only update selected state, don't change button text
      const selectedItem = Array.from(items).find(
        (item) =>
          (item.getAttribute('data-value') || item.textContent.trim()) === value
      );

      if (selectedItem) {
        items.forEach((item) => item.classList.remove('selected'));
        selectedItem.classList.add('selected');
      }
      return;
    }

    // Update trigger text/icon for other dropdowns
    const selectedItem = Array.from(items).find(
      (item) =>
        (item.getAttribute('data-value') || item.textContent.trim()) === value
    );

    if (selectedItem) {
      // Update trigger content based on item structure
      const flagIcon = selectedItem.querySelector('.flag-icon');
      const languageName = selectedItem.querySelector('.language-name');

      if (flagIcon && languageName) {
        // Language selector with flag - copy the exact flag icon and text
        const flagClass = flagIcon.className;
        const flagEmoji = flagIcon.textContent;
        const languageText = languageName.textContent;

        trigger.innerHTML = `
                    <span class="${flagClass}">${flagEmoji}</span>
                    <span class="language-name">${languageText}</span>

                    <span class="select-arrow">▼pppppppppppppp</span>
                `;
      } else {
        // Simple text item
        const text = selectedItem.textContent.trim();
        const icon = selectedItem.querySelector('svg, .dropdown-icon');
        if (icon) {
          trigger.innerHTML = `
                        ${icon.outerHTML}
                        <span>${text}</span>
                        <span class="select-arrow"><svg class="errow" width="12" height="12" viewBox="0 0 16 16" fill="#ffffff">
                <path d="M4.427 6.427L8 10l3.573-3.573L10.354 5 8 7.354 5.646 5z" />
              </svg></span>
                    `;
        } else {
          trigger.innerHTML = `
                        <span>${text}</span>
                        <span class="select-arrow">▼pppppppppppppp</span>
                    `;
        }
      }

      // Update selected state
      items.forEach((item) => item.classList.remove('selected'));
      selectedItem.classList.add('selected');
    }
  }

  /**
   * Ensure dropdown stays in viewport
   */
  ensureDropdownInViewport(dropdown) {
    const { content } = dropdown;
    const rect = content.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check if dropdown goes below viewport
    if (rect.bottom > viewportHeight) {
      content.style.top = 'auto';
      content.style.bottom = '100%';
      content.style.borderRadius = '4px 4px 0 0';
    }

    // Check if dropdown goes beyond right edge
    if (rect.right > viewportWidth) {
      content.style.left = 'auto';
      content.style.right = '0';
    }
  }

  /**
   * Handle global click events (close dropdowns when clicking outside)
   */
  handleGlobalClick(e) {
    // Handle legacy dropdowns (existing createDropdown method)
    this.activeDropdowns.forEach((dropdown) => {
      const { container } = dropdown;
      if (!container.contains(e.target)) {
        this.closeDropdown(dropdown);
      }
    });

    // Handle registered dropdowns
    this.registeredDropdowns.forEach((dropdown, id) => {
      if (dropdown.isOpen && dropdown.options.closeOnOutsideClick) {
        if (!dropdown.element.contains(e.target)) {
          this.closeRegisteredDropdown(id);
        }
      }
    });
  }

  /**
   * Handle global keyboard events for accessibility
   */
  handleGlobalKeydown(e) {
    if (e.key === 'Escape') {
      // Close legacy dropdowns
      this.closeAllDropdowns();

      // Close registered dropdowns that have closeOnEscape enabled
      this.registeredDropdowns.forEach((dropdown, id) => {
        if (dropdown.isOpen && dropdown.options.closeOnEscape) {
          this.closeRegisteredDropdown(id);
        }
      });
    }
  }

  /**
   * Get dropdown by container ID
   */
  getDropdown(containerId) {
    const container = document.getElementById(containerId);
    return container ? container._dropdown : null;
  }

  /**
   * Destroy a dropdown and clean up event listeners
   */
  destroyDropdown(containerId) {
    const dropdown = this.getDropdown(containerId);
    if (dropdown) {
      this.closeDropdown(dropdown);
      delete dropdown.container._dropdown;
    }
  }

  /**
   * Toggle a registered dropdown by ID
   * @param {string} id - Dropdown ID
   * @returns {boolean} Success status
   */
  toggleRegisteredDropdown(id) {
    const dropdown = this.registeredDropdowns.get(id);
    if (!dropdown) {
      console.warn(`DropdownManager: Dropdown '${id}' not found`);
      return false;
    }

    if (dropdown.isOpen) {
      this.closeRegisteredDropdown(id);
    } else {
      this.openRegisteredDropdown(id);
    }
    return true;
  }

  /**
   * Open a registered dropdown by ID
   * @param {string} id - Dropdown ID
   * @returns {boolean} Success status
   */
  openRegisteredDropdown(id) {
    const dropdown = this.registeredDropdowns.get(id);
    if (!dropdown) {
      console.warn(`DropdownManager: Dropdown '${id}' not found`);
      return false;
    }

    // Close other dropdowns if exclusive mode is enabled
    if (dropdown.options.exclusive) {
      this.closeAllRegisteredDropdowns();
    }

    // Open this dropdown
    dropdown.contentElement.classList.add('show');
    dropdown.toggleButton.classList.add('active');
    dropdown.isOpen = true;

    // Call onOpen callback
    if (dropdown.options.onOpen) {
      dropdown.options.onOpen(dropdown);
    }

    //console.log(`DropdownManager: Opened dropdown '${id}'`);
    return true;
  }

  /**
   * Close a registered dropdown by ID
   * @param {string} id - Dropdown ID
   * @returns {boolean} Success status
   */
  closeRegisteredDropdown(id) {
    const dropdown = this.registeredDropdowns.get(id);
    if (!dropdown || !dropdown.isOpen) {
      return false;
    }

    dropdown.contentElement.classList.remove('show');
    dropdown.toggleButton.classList.remove('active');
    dropdown.isOpen = false;

    // Call onClose callback
    if (dropdown.options.onClose) {
      dropdown.options.onClose(dropdown);
    }

    //console.log(`DropdownManager: Closed dropdown '${id}'`);
    return true;
  }

  /**
   * Close all registered dropdowns
   */
  closeAllRegisteredDropdowns() {
    this.registeredDropdowns.forEach((dropdown, id) => {
      if (dropdown.isOpen) {
        this.closeRegisteredDropdown(id);
      }
    });
  }

  /**
   * Select an item in a registered dropdown
   * @param {string} id - Dropdown ID
   * @param {string} value - Selected value
   * @param {HTMLElement} item - Selected item element
   * @returns {boolean} Success status
   */
  selectRegisteredDropdownItem(id, value, item) {
    const dropdown = this.registeredDropdowns.get(id);
    if (!dropdown) {
      console.warn(`DropdownManager: Dropdown '${id}' not found`);
      return false;
    }

    // Update selected state on items
    dropdown.items.forEach((i) => i.classList.remove('selected'));
    if (item) {
      item.classList.add('selected');
    }

    // Update button text if enabled
    if (dropdown.options.updateButtonText && dropdown.toggleButton) {
      this.updateDropdownButtonText(dropdown, value, item);
    }

    // Persist to localStorage if enabled
    if (dropdown.options.persist && dropdown.options.storageKey) {
      localStorage.setItem(dropdown.options.storageKey, value);
    }

    // Call onSelect callback
    if (dropdown.options.onSelect) {
      dropdown.options.onSelect(value, item, dropdown);
    }

    // Close dropdown after selection
    this.closeRegisteredDropdown(id);

    //console.log(`DropdownManager: Selected '${value}' in dropdown '${id}'`);
    return true;
  }

  /**
   * Update dropdown button text based on selection
   * @param {Object} dropdown - Dropdown object
   * @param {string} value - Selected value
   * @param {HTMLElement} item - Selected item element
   */
  updateDropdownButtonText(dropdown, value, item) {
    const { toggleButton } = dropdown;

    if (!item) return;

    // Handle language dropdown with flag icons
    const flagIcon = item.querySelector('.flag-icon');
    const languageName = item.querySelector('.language-name');

    if (flagIcon && languageName) {
      // Language selector pattern
      const flagClass = flagIcon.className;
      const flagEmoji = flagIcon.textContent;
      const languageText = languageName.textContent;

      toggleButton.innerHTML = `
                <span class="${flagClass}">${flagEmoji}</span>
                <span class="language-name">${languageText}</span>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="#10a37f">
                    <path d="M4.427 6.427L8 10l3.573-3.573L10.354 5 8 7.354 5.646 5z" />
                </svg>
            `;
    } else {
      // Simple text or AI mode dropdown pattern
      const icon = item.querySelector('svg, .dropdown-icon');
      const text = item.textContent.trim();

      if (icon) {
        toggleButton.innerHTML = `
                    ${icon.outerHTML}
                    <span>${text}</span>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="#10a37f">
                        <path d="M4.427 6.427L8 10l3.573-3.573L10.354 5 8 7.354 5.646 5z" />
                    </svg>
                `;
      } else {
        // For AI mode dropdown, update the mode indicator span
        const modeIndicator = toggleButton.querySelector('#aiModeIndicator');
        if (modeIndicator) {
          modeIndicator.textContent = text;
        } else {
          toggleButton.innerHTML = `
                        <span>${text}6666666666666666666</span>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="#10a37f">
                            <path d="M4.427 6.427L8 10l3.573-3.573L10.354 5 8 7.354 5.646 5z" />
                        </svg>
                    `;
        }
      }
    }
  }

  /**
   * Check if a registered dropdown is open
   * @param {string} id - Dropdown ID
   * @returns {boolean} Open status
   */
  isRegisteredDropdownOpen(id) {
    const dropdown = this.registeredDropdowns.get(id);
    return dropdown ? dropdown.isOpen : false;
  }

  /**
   * Get a registered dropdown by ID
   * @param {string} id - Dropdown ID
   * @returns {Object|null} Dropdown object or null
   */
  getRegisteredDropdown(id) {
    return this.registeredDropdowns.get(id) || null;
  }

  /**
   * Unregister a dropdown
   * @param {string} id - Dropdown ID
   * @returns {boolean} Success status
   */
  unregisterDropdown(id) {
    const dropdown = this.registeredDropdowns.get(id);
    if (!dropdown) {
      return false;
    }

    // Close if open
    if (dropdown.isOpen) {
      this.closeRegisteredDropdown(id);
    }

    // Clean up event listeners
    if (dropdown.toggleButton && dropdown.toggleButton._dropdownClickHandler) {
      dropdown.toggleButton.removeEventListener(
        'click',
        dropdown.toggleButton._dropdownClickHandler
      );
      delete dropdown.toggleButton._dropdownClickHandler;
    }

    dropdown.items.forEach((item) => {
      if (item._dropdownItemHandler) {
        item.removeEventListener('click', item._dropdownItemHandler);
        delete item._dropdownItemHandler;
      }
    });

    // Remove from registry
    this.registeredDropdowns.delete(id);
    delete dropdown.element._dropdownId;

    //console.log(`DropdownManager: Unregistered dropdown '${id}'`);
    return true;
  }
}

// Create global instance
window.dropdownManager = new DropdownManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.dropdownManager.init();
  });
} else {
  window.dropdownManager.init();
}

export default DropdownManager;
