/**
 * Main Application Entry Point
 * Coordinates all application modules using the new modular architecture with lazy loading
 */

// Core modules - keep these eager
import { APIManager } from './api/index.js';
import './ui/dropdownManager.js'; // Import to initialize global dropdownManager
import storageManager from './utils/storageManager.js';

// Lazy-loaded modules - loaded on-demand for better performance
let ApplicationManager;
let initializeMockEditor;
let settingsManager;
let themeLoader;

// Application instance
let applicationManager;
let apiManager;

// Set up critical global functions immediately for HTML button access
setupImmediateGlobalFunctions();

// Load and initialize testing framework
loadAiCommands();

// Load and initialize AI commands
async function loadAiCommands() {
  try {
    const aiModule = await import('./ui/aiCommands.js');
    initializeMockEditor = aiModule.initializeMockEditor;
    initializeMockEditor();
  } catch (error) {
    console.warn('Failed to load AI commands module:', error);
  }
}

// Load Application Manager on demand
async function loadApplicationManager() {
  if (!ApplicationManager) {
    const appModule = await import('./core/applicationManager.js');
    ApplicationManager = appModule.default;
  }
  return ApplicationManager;
}

// Load theme loader on demand
async function loadThemeLoader() {
  if (!themeLoader) {
    const themeModule = await import('./editor/theme-loader.js');
    themeLoader = themeModule.default;
  }
  return themeLoader;
}

// Load settings manager on demand
async function loadSettingsManager() {
  if (!settingsManager) {
    const settingsModule = await import('./editor/settings.js');
    settingsManager = settingsModule.default;
  }
  return settingsManager;
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Initialize API manager first
    apiManager = new APIManager();

    // Load and initialize Application Manager
    const AppManagerClass = await loadApplicationManager();
    applicationManager = new AppManagerClass();

    // Load AI commands (critical for initialization)
    await loadAiCommands();

    // Initialize application manager
    applicationManager.setApiManager(apiManager);
    await applicationManager.initializeApplication();

    // Initialize theme loader for JSON-based themes
    const themeLoaderModule = await loadThemeLoader();
    const themeLoaderInitialized = await themeLoaderModule.initialize();
    if (!themeLoaderInitialized) {
      console.warn(
        'Theme Loader failed to initialize, falling back to default themes'
      );
    }

    // Initialize settings manager
    const settingsModule = await loadSettingsManager();
    const settingsInitialized = settingsModule.initialize({
      modalId: 'settingsModal',
      contentId: 'settingsContent',
    });

    if (!settingsInitialized) {
      console.error('Settings Manager failed to initialize');
    }

    // Set up all global function delegations after initialization
    setupGlobalFunctions();

    // Initialize annotation toggle state from storage
    initializeAnnotationToggleState();

    // Initialize language dropdown with saved preference
    initializeLanguageDropdown();

    // Debug: Check if AI chat modal exists
    // setTimeout(() => {
    //   const modal = document.getElementById('aiChatModal');
    //   const button = document.getElementById('aiChatBtn');
    //   console.log('AI Chat Debug:', {
    //     modal: modal,
    //     button: button,
    //     modalExists: !!modal,
    //     buttonExists: !!button,
    //   });
    // }, 1000);
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
});

// All functionality is now handled by the modular system

// Setup critical global functions immediately for HTML button access
function setupImmediateGlobalFunctions() {
  // AI functions - available immediately
  window.showAiChat = () => {
    if (window.aiManager) {
      window.aiManager.showAiChat();
    }
  };

  window.closeAiChat = () => {
    if (window.aiManager) window.aiManager.closeAiChat();
  };
  window.sendAiMessage = () => {
    if (window.aiManager) window.aiManager.sendAiMessage();
  };
  window.handleAiChatKeydown = (event) => {
    if (window.aiManager) window.aiManager.handleAiChatKeydown(event);
  };

  window.closeModal = (modalId) => {
    if (applicationManager) {
      applicationManager.getModalManager().closeModal(modalId);
    } else {
      // Fallback to direct modal access
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'none';
    }
  };

  window.showHelp = () => {
    if (applicationManager) {
      applicationManager.getHelpSystem().showHelp();
    } else {
      window.showModal('helpModal');
    }
  };

  window.showExamples = () => {
    if (applicationManager) {
      applicationManager.getExampleManager().showExamples();
    } else {
      window.showModal('examplesModal');
    }
  };

  window.loadExample = (filename) => {
    if (applicationManager) {
      applicationManager.getExampleManager().loadExample(filename);
    }
  };

  window.showConfigurator = () => {
    if (applicationManager) {
      applicationManager.getConfiguratorSystem().showConfigurator();
    } else {
      // Fallback to direct configurator modal
      const modal = document.getElementById('configuratorModal');
      if (modal) modal.style.display = 'block';
    }
  };

  window.closeConfigurator = () => {
    if (applicationManager) {
      applicationManager.getConfiguratorSystem().closeConfigurator();
    } else {
      // Fallback to direct configurator modal
      const modal = document.getElementById('configuratorModal');
      if (modal) modal.style.display = 'none';
    }
  };

  // Background image test functions
  window.setEditorBackground = (backgroundClass) => {
    import('./editor/theme-loader.js')
      .then((themeLoader) => {
        themeLoader.default.setEditorBackground(backgroundClass);
        console.log(`Set editor background to: ${backgroundClass}`);
      })
      .catch((err) => console.warn('Failed to set editor background:', err));
  };

  window.setOutputBackground = (backgroundClass) => {
    import('./editor/theme-loader.js')
      .then((themeLoader) => {
        themeLoader.default.setOutputBackground(backgroundClass);
        console.log(`Set output background to: ${backgroundClass}`);
      })
      .catch((err) => console.warn('Failed to set output background:', err));
  };

  window.clearAllBackgrounds = () => {
    console.log('Clearing all background images...');
    window.setEditorBackground('none');
    window.setOutputBackground('none');
  };

  window.listBackgroundOptions = () => {
    import('./editor/theme-loader.js')
      .then((themeLoader) => {
        const backgrounds = themeLoader.default.getAvailableBackgrounds();
        console.table(
          backgrounds.map((bg) => ({
            'Class Name': bg.value,
            'Display Name': bg.label,
            Description: bg.description,
          }))
        );
        console.log('Example usage: setEditorBackground("bg-space")');
      })
      .catch((err) => console.warn('Failed to load background options:', err));
  };

  window.configuratorSaveAndCompile = () => {
    if (applicationManager) {
      applicationManager.getConfiguratorSystem().configuratorSaveAndCompile();
    }
  };

  window.configuratorCompileOnly = () => {
    if (applicationManager) {
      applicationManager.getConfiguratorSystem().configuratorCompileOnly();
    }
  };

  // Settings functions
  window.showSettings = async () => {
    if (window.settingsManager) {
      window.settingsManager.showSettings();
    } else {
      // Load settings manager and try again
      try {
        const settingsModule = await loadSettingsManager();
        window.settingsManager = settingsModule.default || settingsModule;
        window.settingsManager.showSettings();
      } catch (error) {
        console.warn('Failed to load settings manager:', error);
        // Fallback to direct settings modal
        const modal = document.getElementById('settingsModal');
        if (modal) modal.style.display = 'flex';
      }
    }
  };

  window.closeSettings = async () => {
    if (window.settingsManager) {
      window.settingsManager.closeSettings();
    } else {
      // Load settings manager and try again
      try {
        const settingsModule = await loadSettingsManager();
        window.settingsManager = settingsModule.default || settingsModule;
        window.settingsManager.closeSettings();
      } catch (error) {
        console.warn('Failed to load settings manager:', error);
        // Fallback to direct settings modal
        const modal = document.getElementById('settingsModal');
        if (modal) modal.style.display = 'none';
      }
    }
  };

  // Annotation toggle functionality
  window.annToggle = () => {
    const annotationsContainer = document.getElementById(
      'annotations-container'
    );
    const annToggle = document.getElementById('ann-toggle');
    const annotations = document.getElementById('annotations');

    if (!annotationsContainer || !annToggle || !annotations) return;

    const isExpanded = annToggle.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      // Collapse annotations
      annotationsContainer.classList.add('collapsed');
      annotations.classList.add('is-collapsed');
      annToggle.setAttribute('aria-expanded', 'false');
      // Save collapsed state (false) to storage
      storageManager.setAnnotationToggleState(false);
    } else {
      // Expand annotations
      annotationsContainer.classList.remove('collapsed');
      annotations.classList.remove('is-collapsed');
      annToggle.setAttribute('aria-expanded', 'true');
      // Save expanded state (true) to storage
      storageManager.setAnnotationToggleState(true);
    }
  };
}

// Setup global functions after application initialization
function setupGlobalFunctions() {
  // Register all dropdowns with the DropdownManager
  registerAllDropdowns();

  // AI functions - update to use proper aiManager
  window.showAiChat = () => {
    if (window.aiManager) window.aiManager.showAiChat();
  };
  window.closeAiChat = () => {
    if (window.aiManager) window.aiManager.closeAiChat();
  };
  window.sendAiMessage = () => {
    if (window.aiManager) window.aiManager.sendAiMessage();
  };
  window.handleAiChatKeydown = (event) => {
    if (window.aiManager) window.aiManager.handleAiChatKeydown(event);
  };
  window.switchAiMode = (mode) => {
    if (window.aiManager) window.aiManager.switchAiMode(mode);
  };
  window.executePendingCommandFromUI = () => {
    if (window.aiManager) window.aiManager.executePendingCommandFromUI();
  };
  window.toggleAutoApprove = () => {
    if (window.aiManager) window.aiManager.toggleAutoApprove();
  };

  // Dropdown functions - all handled by DropdownManager now
  window.toggleAiModeDropdown = function (event) {
    if (event) event.stopPropagation();
    window.dropdownManager.toggleRegisteredDropdown('ai-mode-dropdown');
  };

  window.toggleAiQuickActions = function (event) {
    if (event) event.stopPropagation();
    window.dropdownManager.toggleRegisteredDropdown('ai-actions-dropdown');
  };

  window.toggleLanguageDropdown = function (event) {
    if (event) event.stopPropagation();
    window.dropdownManager.toggleRegisteredDropdown('language-dropdown');
  };

  window.closeLanguageDropdown = function () {
    window.dropdownManager.closeRegisteredDropdown('language-dropdown');
  };

  // Language selection handler - kept for backward compatibility with HTML onclick handlers
  window.selectLanguage = function (languageCode) {
    const dropdown =
      window.dropdownManager.getRegisteredDropdown('language-dropdown');
    if (dropdown && dropdown.options.onSelect) {
      const selectedItem = dropdown.items.find(
        (item) => item.getAttribute('data-value') === languageCode
      );
      dropdown.options.onSelect(languageCode, selectedItem, dropdown);
    }
  };

  window.loadHelpContent = function (languageCode) {
    if (applicationManager && applicationManager.getHelpSystem()) {
      applicationManager.getHelpSystem().loadHelpContent(languageCode);
    }
  };

  // Core system functions
  window.submitGGcode = (event, customCode) => {
    if (applicationManager) {
      const compilationSystem = applicationManager.getCompilationSystem();
      if (compilationSystem) {
        return compilationSystem.submitGGcode(event, customCode);
      } else {
        console.warn('CompilationSystem not available, using fallback');
      }
    }

    // Fallback implementation
    if (event) event.preventDefault();
    if (!window.monacoReady || !window.editorManager) {
      alert('Editor is still loading. Please wait a moment and try again.');
      return false;
    }

    return false;
  };

  window.copyOutput = () => {
    if (applicationManager) {
      applicationManager.getFileOperationsManager().copyOutput();
    }
  };

  window.saveOutput = () => {
    if (applicationManager) {
      applicationManager.getFileOperationsManager().saveOutput();
    }
  };

  window.saveGGcode = () => {
    if (applicationManager) {
      applicationManager.getFileOperationsManager().saveGGcode();
    }
  };

  window.clearMemory = () => {
    if (applicationManager) {
      applicationManager.getFileOperationsManager().clearMemory();
    }
  };

  // Modal functions
  window.showModal = (modalId) => {
    if (applicationManager) {
      applicationManager.getModalManager().showModal(modalId);
    } else {
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'block';
    }
  };

  window.closeModal = (modalId) => {
    if (applicationManager) {
      applicationManager.getModalManager().closeModal(modalId);
    } else {
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'none';
    }
  };

  // Additional system functions
  window.updateAnnotations = (lineNumber, lineContent) => {
    if (applicationManager) {
      applicationManager.updateAnnotations(lineNumber, lineContent);
    }
  };

  window.saveContent = () => {
    if (applicationManager) {
      applicationManager.getFileOperationsManager().saveContent();
    }
  };

  window.syncEditors = () => {
    if (applicationManager) {
      applicationManager.getFileOperationsManager().syncEditors();
    }
  };

  window.showCompileLoadingIndicator = (show) => {
    if (applicationManager) {
      applicationManager
        .getCompilationSystem()
        .showCompileLoadingIndicator(show);
    }
  };

  // Export application manager for debugging
  window.applicationManager = applicationManager;
}

/**
 * Register all dropdowns with the centralized DropdownManager
 */
function registerAllDropdowns() {
  // Check if dropdownManager is available
  if (!window.dropdownManager) {
    console.error('DropdownManager not available, cannot register dropdowns');
    return;
  }

  // Register AI Mode Dropdown
  const aiModeButton = document.querySelector('#aiModeDropdownBtn');
  const aiModeContainer = aiModeButton
    ? aiModeButton.closest('.ai-mode-dropdown')
    : null;

  if (aiModeContainer) {
    window.dropdownManager.registerDropdown(
      'ai-mode-dropdown',
      aiModeContainer,
      {
        updateButtonText: true,
        onSelect: (value) => {
          if (window.aiManager && window.aiManager.switchAiMode) {
            window.aiManager.switchAiMode(value);
          }
        },
      }
    );
  } else {
    console.warn('AI Mode dropdown container not found');
  }

  // Register AI Quick Actions Dropdown
  const aiActionsButton = document.querySelector('.ai-actions-dropdown-btn');
  const aiActionsContainer = aiActionsButton
    ? aiActionsButton.closest('.ai-actions-dropdown')
    : null;

  if (aiActionsContainer) {
    window.dropdownManager.registerDropdown(
      'ai-actions-dropdown',
      aiActionsContainer,
      {
        updateButtonText: false,
        onSelect: (value) => {
          if (window.aiManager && window.aiManager.aiQuickAction) {
            window.aiManager.aiQuickAction(value);
          }
        },
      }
    );
  } else {
    console.warn('AI Actions dropdown container not found');
  }

  // Register Language Dropdown
  const languageContainer = document.querySelector('.custom-select');

  if (languageContainer) {
    window.dropdownManager.registerDropdown(
      'language-dropdown',
      languageContainer,
      {
        updateButtonText: true,
        persist: true,
        storageKey: storageManager.STORAGE_KEYS.SELECTED_LANGUAGE,
        onSelect: (languageCode, item) => {
          // Handle language selection
          const flagIcon = item.querySelector('.flag-icon');
          const languageName = item.querySelector('.language-name');

          if (flagIcon && languageName) {
            // Store language code using storageManager (dropdownManager handles persistence)
            try {
              storageManager.setSelectedLanguage(languageCode);
            } catch (error) {
              console.warn('Could not save language preference:', error);
            }

            // Load help content
            if (applicationManager && applicationManager.getHelpSystem()) {
              applicationManager.getHelpSystem().loadHelpContent(languageCode);
            }
          }
        },
      }
    );
  } else {
    console.warn('Language dropdown container not found');
  }

  // Initialize language dropdown with saved language
  initializeLanguageDropdown();
}

/**
 * Initialize annotation toggle state from storage
 */
function initializeAnnotationToggleState() {
  try {
    const annotationsContainer = document.getElementById(
      'annotations-container'
    );
    const annToggle = document.getElementById('ann-toggle');
    const annotations = document.getElementById('annotations');

    if (!annotationsContainer || !annToggle || !annotations) {
      console.warn(
        'Annotation elements not found, skipping state initialization'
      );
      return;
    }

    // Get saved state from storage
    const shouldBeExpanded = storageManager.getAnnotationToggleState();

    if (shouldBeExpanded) {
      // Ensure annotations are expanded (this is the default state)
      annotationsContainer.classList.remove('collapsed');
      annotations.classList.remove('is-collapsed');
      annToggle.setAttribute('aria-expanded', 'true');
    } else {
      // Apply collapsed state
      annotationsContainer.classList.add('collapsed');
      annotations.classList.add('is-collapsed');
      annToggle.setAttribute('aria-expanded', 'false');
    }
  } catch (error) {
    console.warn('Failed to initialize annotation toggle state:', error);
  }
}

/**
 * Initialize language dropdown with saved preference
 */
function initializeLanguageDropdown() {
  try {
    // Get the language dropdown that was registered
    const dropdown =
      window.dropdownManager.getRegisteredDropdown('language-dropdown');
    if (!dropdown) {
      console.warn('Language dropdown not found, skipping initialization');
      return;
    }

    // Get saved language preference
    const savedLanguage = storageManager.getSelectedLanguage();

    if (savedLanguage && savedLanguage !== 'en') {
      // Find the corresponding dropdown item
      const selectedItem = Array.from(dropdown.items).find(
        (item) => item.getAttribute('data-value') === savedLanguage
      );

      if (selectedItem) {
        // Use the DropdownManager's existing update method to set the button text
        window.dropdownManager.selectRegisteredDropdownItem(
          'language-dropdown',
          savedLanguage,
          selectedItem
        );
      } else {
        console.warn(
          '[DEBUG] No dropdown item found for saved language:',
          savedLanguage
        );
      }
    } else {
      // Use default language (English) or no saved preference found
    }
  } catch (error) {
    console.warn('Failed to initialize language dropdown:', error);
  }
}
