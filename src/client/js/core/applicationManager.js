/**
 * Application Manager Module
 * Coordinates all application modules and provides the main entry point
 */

import MonacoEditorManager from '../editor/monaco.js';
import GcodeAnnotationSystem from '../editor/annotations.js';
import ConfiguratorManager from '../configurator/index.js';
import * as VisualizerModules from '../visualizer/index.js';
import NavigationManager from '../ui/navigation.js';
import aiManager from '../ui/aiManager.js';
import aiCommands from '../ui/aiCommands.js';
import HelpSystem from '../ui/helpSystem.js';
import ExampleManager from '../ui/exampleManager.js';
import FileOperationsManager from '../ui/fileOperations.js';
import CompilationSystem from './compilationSystem.js';
import ModalManagerWrapper from '../ui/modalManager.js';
import ConfiguratorSystem from '../config/configuratorSystem.js';
import storageManager from '../utils/storageManager.js';

class ApplicationManager {
  constructor() {
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
  async initializeApplication() {
    // Initialize managers
    this.editorManager = new MonacoEditorManager();
    this.annotationSystem = new GcodeAnnotationSystem();
    this.configuratorManager = new ConfiguratorManager();
    this.visualizerModules = VisualizerModules;
    this.navigationManager = new NavigationManager();

    // Initialize UI managers
    this.modalManager = new ModalManagerWrapper();
    this.helpSystem = null; // Will be initialized when API manager is set
    this.exampleManager = null; // Will be initialized when API manager is set
    this.fileOperationsManager = new FileOperationsManager();
    this.compilationSystem = null; // Will be initialized when API manager is set
    this.configuratorSystem = new ConfiguratorSystem(
      this.configuratorManager,
      this.editorManager
    );

    // Initialize AI modules
    aiManager.initialize();

    // Make managers globally available for the functions
    this.makeManagersGloballyAvailable();

    // Load saved filename
    this.lastOpenedFilename = storageManager.getLastFilename();

    // Initialize annotation system
    await this.annotationSystem.initialize();

    // Initialize configurator
    this.configuratorSystem.initialize({
      modalId: 'configuratorModal',
      contentId: 'configuratorContent',
    });

    // Initialize Monaco editor
    await this.initializeMonacoEditor();

    // Setup auto-compile checkbox
    this.setupAutoCompileCheckbox();

    // Setup file operations
    this.setupFileOperations();
  }

  /**
   * Initialize Monaco editor with modular approach
   */
  async initializeMonacoEditor() {
    // Load saved content
    const initialInput = storageManager.getInputContent();
    const initialOutput = storageManager.getOutputContent();

    await this.editorManager.initialize({
      inputContainerId: 'editor',
      outputContainerId: 'output',
      initialInput: initialInput,
      initialOutput: initialOutput,
      onCompile: (event, customCode) => {
        if (this.compilationSystem) {
          return this.compilationSystem.submitGGcode(event, customCode);
        } else {
          console.warn('CompilationSystem not available for compile callback');
          return false;
        }
      },
      onAnnotationUpdate: (lineNumber, lineContent) =>
        this.updateAnnotations(lineNumber, lineContent),
    });

    // Set up backward compatibility
    const editors = this.editorManager.getEditors();
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
  }

  /**
   * Setup auto-compile checkbox functionality
   */
  setupAutoCompileCheckbox() {
    const autoCheckbox = document.getElementById('autoCompileCheckbox');
    if (autoCheckbox) {
      autoCheckbox.checked = this.editorManager
        ? this.editorManager.loadAutoCompileState()
        : false;

      autoCheckbox.addEventListener('change', (e) => {
        if (this.editorManager) {
          this.editorManager.setAutoCompile(e.target.checked);
        }
      });
    }
  }

  /**
   * Setup file operations
   */
  setupFileOperations() {
    const openBtn = document.getElementById('openGGcodeBtn');
    const fileInput = document.getElementById('ggcodeFileInput');

    if (openBtn && fileInput) {
      openBtn.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          if (this.editorManager) {
            this.editorManager.setInputValue(evt.target.result);
            this.editorManager.setLastOpenedFilename(file.name || '');
            this.lastOpenedFilename = file.name || '';
            if (this.compilationSystem) {
              this.compilationSystem.submitGGcode(new Event('submit'));
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
  updateAnnotations(lineNumber, lineContent) {
    if (this.annotationSystem) {
      const editors = this.editorManager
        ? this.editorManager.getEditors()
        : { output: window.outputEditor };
      this.annotationSystem.updateAnnotations(
        lineNumber,
        lineContent,
        editors.output
      );
    }
  }

  /**
   * Make managers globally available for backward compatibility
   */
  makeManagersGloballyAvailable() {
    window.editorManager = this.editorManager;
    window.apiManager = {}; // This should be passed from main.js
    window.configuratorManager = this.configuratorManager;
    window.visualizerModules = this.visualizerModules;
    window.navigationManager = this.navigationManager;
    window.aiManager = aiManager;
    window.aiCommands = aiCommands;
  }

  /**
   * Set API manager reference
   */
  setApiManager(apiManager) {
    this.apiManager = apiManager;

    // Initialize modules that depend on API manager
    this.helpSystem = new HelpSystem(apiManager);
    this.exampleManager = new ExampleManager(apiManager, this.editorManager);
    this.compilationSystem = new CompilationSystem(
      apiManager,
      this.editorManager,
      this.annotationSystem
    );
    this.configuratorSystem = new ConfiguratorSystem(
      this.configuratorManager,
      this.editorManager
    );

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
  getEditorManager() {
    return this.editorManager;
  }
  getAnnotationSystem() {
    return this.annotationSystem;
  }
  getConfiguratorManager() {
    return this.configuratorManager;
  }
  getHelpSystem() {
    if (!this.helpSystem && this.apiManager) {
      this.helpSystem = new HelpSystem(this.apiManager);
    }
    return this.helpSystem;
  }
  getExampleManager() {
    if (!this.exampleManager && this.apiManager && this.editorManager) {
      this.exampleManager = new ExampleManager(
        this.apiManager,
        this.editorManager
      );
    }
    return this.exampleManager;
  }
  getFileOperationsManager() {
    return this.fileOperationsManager;
  }
  getCompilationSystem() {
    if (
      !this.compilationSystem &&
      this.apiManager &&
      this.editorManager &&
      this.annotationSystem
    ) {
      this.compilationSystem = new CompilationSystem(
        this.apiManager,
        this.editorManager,
        this.annotationSystem
      );
    }
    return this.compilationSystem;
  }
  getModalManager() {
    return this.modalManager;
  }
  getConfiguratorSystem() {
    return this.configuratorSystem;
  }
}

export default ApplicationManager;
