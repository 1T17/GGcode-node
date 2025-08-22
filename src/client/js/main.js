/**
 * Main Application Entry Point
 * Coordinates all client-side modules and provides backward compatibility
 */

import MonacoEditorManager from './editor/monaco.js';
import GcodeAnnotationSystem from './editor/annotations.js';
import ConfiguratorManager from './configurator/index.js';
import * as VisualizerModules from './visualizer/index.js';
import { ModalManager } from './ui/modals.js';
// import { ToolbarManager } from './ui/toolbar.js'; // TODO: Implement toolbar integration
import { FileOperations } from './ui/fileOps.js';
import { APIManager } from './api/index.js';
import storageManager from './utils/storageManager.js';
import NavigationManager from './ui/navigation.js';

// Application state
let editorManager;
let annotationSystem;
let configuratorManager;
let visualizerModules;
let modalManager;
// let toolbarManager; // TODO: Implement toolbar integration
let fileOperations;
let apiManager;
let navigationManager;

// Legacy global variables for backward compatibility
let editor, outputEditor;
let monacoReady = false;
let autoCompile = false;
// let autoCompileTimeout = null; // TODO: Implement auto-compile timeout
let lastOpenedFilename = '';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async function () {
  //console.log('DOM Content Loaded - Starting application initialization...');
  try {
    await initializeApplication();
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
});

/**
 * Initialize all application modules
 */
async function initializeApplication() {
  //console.log('Initializing application modules...');

  // Initialize managers
  editorManager = new MonacoEditorManager();
  annotationSystem = new GcodeAnnotationSystem();
  configuratorManager = new ConfiguratorManager();
  visualizerModules = VisualizerModules; // Initialize visualizer modules
  modalManager = new ModalManager();
  // toolbarManager = new ToolbarManager(); // TODO: Implement toolbar integration
  fileOperations = new FileOperations();
  apiManager = new APIManager();
  navigationManager = new NavigationManager();

  //console.log('Managers created, initializing Monaco editor...');

  // Make managers globally available for the functions
  window.editorManager = editorManager;
  window.apiManager = apiManager;
  window.configuratorManager = configuratorManager;
  window.visualizerModules = visualizerModules;
  window.navigationManager = navigationManager;

  // Make editor instances globally available for backward compatibility
  const editors = editorManager.getEditors();
  window.outputEditor = editors.output;
  window.editor = editors.input;

  // Load saved filename
  lastOpenedFilename = storageManager.getLastFilename();

  // Initialize annotation system
  await annotationSystem.initialize();

  // Initialize configurator
  configuratorManager.initialize({
    modalId: 'configuratorModal',
    contentId: 'configuratorContent',
    onCompile: handleConfiguratorCompile,
    onSave: handleConfiguratorSave,
  });

  // Initialize Monaco editor
  await initializeMonacoEditor();

  // Setup auto-compile checkbox
  setupAutoCompileCheckbox();

  // Setup file operations
  setupFileOperations();

  //console.log('Application initialized successfully');
}

/**
 * Initialize Monaco editor with modular approach
 */
async function initializeMonacoEditor() {
  // Load saved content
  const initialInput = storageManager.getInputContent();
  const initialOutput = storageManager.getOutputContent();

  await editorManager.initialize({
    inputContainerId: 'editor',
    outputContainerId: 'output',
    initialInput: initialInput,
    initialOutput: initialOutput,
    onCompile: submitGGcode,
    onAnnotationUpdate: updateAnnotations,
  });

  // Set up backward compatibility
  const editors = editorManager.getEditors();
  editor = editors.input;
  outputEditor = editors.output;
  monacoReady = true;

  // Make editors globally available immediately for visualizer compatibility
  window.outputEditor = outputEditor;
  window.editor = editor;

  // Load auto-compile state
  autoCompile = editorManager.loadAutoCompileState();

  // Load last opened filename
  lastOpenedFilename = editorManager.loadLastOpenedFilename();

  // Setup auto-save
  editorManager.setupAutoSave();
}

// Legacy save content function for backward compatibility
function saveContent() {
  if (editorManager) {
    editorManager.saveContent();
  }
}

/**
 * Setup auto-compile checkbox functionality
 */
function setupAutoCompileCheckbox() {
  const autoCheckbox = document.getElementById('autoCompileCheckbox');
  if (autoCheckbox) {
    autoCheckbox.checked = autoCompile;

    autoCheckbox.addEventListener('change', function () {
      autoCompile = autoCheckbox.checked;
      editorManager.setAutoCompile(autoCompile);
    });
  }
}

/**
 * Setup file operations
 */
function setupFileOperations() {
  const openBtn = document.getElementById('openGGcodeBtn');
  const fileInput = document.getElementById('ggcodeFileInput');

  if (openBtn && fileInput) {
    openBtn.addEventListener('click', function () {
      fileInput.value = '';
      fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        if (editorManager) {
          editorManager.setInputValue(evt.target.result);
          editorManager.setLastOpenedFilename(file.name || '');
          lastOpenedFilename = file.name || '';
          submitGGcode(new Event('submit'));
        }
      };
      reader.readAsText(file);
    });
  }
}

/**
 * Handle configurator compile action
 */
function handleConfiguratorCompile(result) {
  console.log('Configurator compile completed:', result);
}

/**
 * Handle configurator save action
 */
function handleConfiguratorSave(result) {
  console.log('Configurator save completed:', result);
}

// Sync editors - legacy function for backward compatibility
function syncEditors() {
  if (editorManager) {
    const ggcodeElement = document.getElementById('ggcode');
    if (ggcodeElement) {
      ggcodeElement.value = editorManager.getInputValue();
    }
  }
}

// Submit GGcode for compilation
async function submitGGcode(event, customCode = null) {
  if (event) event.preventDefault();

  if (!monacoReady || !editorManager) {
    alert('Editor is still loading. Please wait a moment and try again.');
    return false;
  }

  syncEditors();
  const code = customCode || editorManager.getInputValue();

  if (editorManager) {
    editorManager.setOutputValue('Compiling...');
  }

  try {
    const result = await apiManager.compiler.compile(code);

    if (result.success) {
      if (editorManager) {
        editorManager.setOutputValue(result.output);

        // Reset annotation modal state when new G-code is loaded
        if (annotationSystem) {
          annotationSystem.resetModalState();
        }

        // Trigger annotation for first line if content exists
        if (result.output.trim()) {
          const editors = editorManager.getEditors();
          if (editors.output) {
            const firstLineContent = editors.output
              .getModel()
              .getLineContent(1);
            updateAnnotations(1, firstLineContent);
          }
        }
      }
      saveContent();
    } else {
      if (editorManager) {
        editorManager.setOutputValue('Error: ' + result.error);
      }
    }
  } catch (err) {
    if (editorManager) {
      editorManager.setOutputValue('Network error: ' + err.message);
    }
  }
  return false;
}

// File operations - using modular approach
function copyOutput() {
  if (fileOperations) {
    fileOperations.copyOutput();
  } else {
    console.error('FileOperations module not available');
  }
}

function saveOutput() {
  if (fileOperations) {
    fileOperations.saveOutput();
  } else {
    console.error('FileOperations module not available');
  }
}

function saveGGcode() {
  if (fileOperations) {
    fileOperations.saveGGcode();
  } else {
    console.error('FileOperations module not available');
  }
}

function clearMemory() {
  if (fileOperations) {
    fileOperations.clearMemory();
  } else {
    console.error('FileOperations module not available');
  }
}

// Modal functions - using modular approach
function showModal(modalId) {
  if (modalManager) {
    modalManager.showModal(modalId);
  } else {
    console.error('ModalManager module not available');
  }
}

function closeModal(modalId) {
  if (modalManager) {
    modalManager.closeModal(modalId);
  } else {
    console.error('ModalManager module not available');
  }
}

// Annotation system integration
function updateAnnotations(lineNumber, lineContent) {
  if (annotationSystem) {
    const editors = editorManager
      ? editorManager.getEditors()
      : { output: outputEditor };
    annotationSystem.updateAnnotations(lineNumber, lineContent, editors.output);
  }
}

// Note: showGcodeViewer is provided by the visualizer module

async function showExamples() {
  showModal('examplesModal');
  await loadExamples();
  // Setup examples search after examples are loaded
  setTimeout(setupExamplesSearch, 100);
  // Focus search input
  setTimeout(() => {
    const searchInput = document.getElementById('examplesSearchInput');
    if (searchInput) {
      searchInput.focus();
    }
  }, 200);
}

async function loadExamples() {
  const examplesList = document.getElementById('examplesList');
  if (!examplesList) return;

  try {
    const examples = await apiManager.examples.getList();

    if (examples && examples.length > 0) {
      examplesList.innerHTML = examples
        .map(
          (file) => `
        <div class="example-item" onclick="loadExample('${file.name}')">
          <div class="example-title">${file.name}</div>
          <div class="example-description">${file.description || 'Click to load this example'}</div>
          <div class="example-preview">${file.preview || ''}</div>
        </div>
      `
        )
        .join('');
    } else {
      examplesList.innerHTML =
        '<p style="color: #cccccc;">Failed to load examples</p>';
    }
  } catch (error) {
    examplesList.innerHTML =
      '<p style="color: #cccccc;">Error loading examples: ' +
      error.message +
      '</p>';
  }
}

async function loadExample(filename) {
  try {
    const result = await apiManager.examples.getContent(filename);

    if (result && result.content) {
      // Set the correct editor based on file type
      if (filename.endsWith('.ggcode')) {
        if (editorManager) {
          editorManager.setInputValue(result.content);
          editorManager.setLastOpenedFilename(filename);
        }
      } else if (filename.endsWith('.gcode')) {
        if (editorManager) {
          editorManager.setOutputValue(result.content);
        }
      }
      // Remember filename
      lastOpenedFilename = filename;
      storageManager.setLastFilename(lastOpenedFilename);
      // Direct compilation after file load
      submitGGcode(new Event('submit'));
      closeModal('examplesModal');
    } else {
      alert('Failed to load example: No content available');
    }
  } catch (error) {
    alert('Error loading example: ' + error.message);
  }
}

function setupExamplesSearch() {
  // TODO: Implement examples search functionality
  console.log('Examples search setup - TODO');
}

function showHelp() {
  showModal('helpModal');

  // Get saved language preference or default to English
  const savedLanguage = storageManager.getSelectedLanguage();

  // Load help content when modal opens
  loadHelpContent(savedLanguage);
  // Setup language selector
  setupLanguageSelector();
  // Add copy buttons after modal is shown
  setTimeout(addCopyButtons, 100);
  // Setup help search
  setupHelpSearch();
  // Focus search input
  setTimeout(() => {
    const searchInput = document.getElementById('helpSearchInput');
    if (searchInput) {
      searchInput.focus();
    }
  }, 200);
}

async function loadHelpContent(language = 'en') {
  const helpContent = document.getElementById('helpContent');
  if (!helpContent) return;

  try {
    // Show loading indicator
    helpContent.innerHTML =
      '<div class="loading-indicator"><p>Loading help content...</p></div>';

    const result = await apiManager.help.getContent(language);

    if (result && result.data) {
      renderHelpContent(result.data);
    } else {
      helpContent.innerHTML =
        '<div class="error-message"><p>Failed to load help content</p></div>';
    }
  } catch (error) {
    helpContent.innerHTML =
      '<div class="error-message"><p>Error loading help content: ' +
      error.message +
      '</p></div>';
  }
}

function renderHelpContent(data) {
  const helpContent = document.getElementById('helpContent');
  if (!helpContent || !data || !data.sections) {
    console.error('Invalid help content data or missing container');
    return;
  }

  let html = '';

  // Render each section
  Object.values(data.sections).forEach((section) => {
    html += `<div class="help-section-card" data-section="${section.id}">`;
    html += `<h3 class="help-section-title">${section.title}</h3>`;
    html += `<div class="help-section-content">`;

    // Render section content
    if (section.content && Array.isArray(section.content)) {
      section.content.forEach((item) => {
        switch (item.type) {
          case 'paragraph':
            html += `<p>${item.text}</p>`;
            break;

          case 'subsection':
            html += `<h4>${item.title}</h4>`;
            if (item.description) {
              html += `<p>${item.description}</p>`;
            }
            if (item.additionalInfo) {
              html += `<p>${item.additionalInfo}</p>`;
            }
            if (item.code) {
              html += `<pre><code>${item.code}</code></pre>`;
            }
            if (item.list) {
              html += `<ul>`;
              item.list.forEach((listItem) => {
                html += `<li>${listItem}</li>`;
              });
              html += `</ul>`;
            }
            break;

          case 'list':
            if (item.title) {
              html += `<h4>${item.title}</h4>`;
            }
            if (item.description) {
              html += `<p>${item.description}</p>`;
            }
            html += `<ul>`;
            item.items.forEach((listItem) => {
              html += `<li>${listItem}</li>`;
            });
            html += `</ul>`;
            break;

          case 'code':
            html += `<pre><code>${item.code}</code></pre>`;
            break;

          default:
            console.warn('Unknown help content type:', item.type);
        }
      });
    }

    html += `</div>`;
    html += `</div>`;
  });

  helpContent.innerHTML = html;

  // Add copy buttons to code blocks after rendering
  setTimeout(addCopyButtons, 100);
}

function setupLanguageSelector() {
  const languageSelector = document.getElementById('helpLanguageSelector');
  if (!languageSelector) return;

  // Set current language
  const currentLanguage = storageManager.getSelectedLanguage();
  languageSelector.value = currentLanguage;

  // Add change event listener
  languageSelector.addEventListener('change', function () {
    const selectedLanguage = this.value;
    storageManager.setSelectedLanguage(selectedLanguage);
    loadHelpContent(selectedLanguage);
  });
}

function addCopyButtons() {
  const preElements = document.querySelectorAll(
    '.help-content pre, #helpContent pre'
  );
  preElements.forEach((pre) => {
    // Check if copy button already exists
    if (pre.querySelector('.copy-button')) return;

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';
    copyButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: #007acc;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 12px;
      cursor: pointer;
      z-index: 1;
    `;

    // Make pre element relative for absolute positioning
    pre.style.position = 'relative';

    copyButton.onclick = function () {
      const code = pre.textContent.replace('Copy', '').trim();
      navigator.clipboard
        .writeText(code)
        .then(() => {
          copyButton.textContent = 'Copied!';
          copyButton.style.background = '#28a745';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
            copyButton.style.background = '#007acc';
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
          copyButton.textContent = 'Error';
          copyButton.style.background = '#dc3545';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
            copyButton.style.background = '#007acc';
          }, 2000);
        });
    };

    pre.appendChild(copyButton);
  });
}

function setupHelpSearch() {
  const searchInput = document.getElementById('helpSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase().trim();
    const helpSections = document.querySelectorAll('.help-section-card');

    helpSections.forEach((section) => {
      const sectionText = section.textContent.toLowerCase();
      if (searchTerm === '' || sectionText.includes(searchTerm)) {
        section.style.display = 'block';

        // Highlight search terms
        if (searchTerm !== '') {
          highlightSearchTerm(section, searchTerm);
        } else {
          removeHighlights(section);
        }
      } else {
        section.style.display = 'none';
      }
    });
  });
}

function highlightSearchTerm(element, term) {
  // Simple highlighting - could be improved
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const text = textNode.textContent;
    const regex = new RegExp(`(${term})`, 'gi');
    if (regex.test(text)) {
      const highlightedText = text.replace(regex, '<mark>$1</mark>');
      const span = document.createElement('span');
      span.innerHTML = highlightedText;
      textNode.parentNode.replaceChild(span, textNode);
    }
  });
}

function removeHighlights(element) {
  const marks = element.querySelectorAll('mark');
  marks.forEach((mark) => {
    mark.outerHTML = mark.innerHTML;
  });
}

function showConfigurator() {
  if (configuratorManager) {
    const ggcode = editorManager ? editorManager.getInputValue() : '';
    configuratorManager.showConfigurator(ggcode);
  } else {
    console.error('ConfiguratorManager module not available');
  }
}

// Export functions for global access (backward compatibility)
window.submitGGcode = submitGGcode;
window.copyOutput = copyOutput;
window.saveOutput = saveOutput;
window.saveGGcode = saveGGcode;
window.clearMemory = clearMemory;
window.showModal = showModal;
window.closeModal = closeModal;
window.updateAnnotations = updateAnnotations;
window.saveContent = saveContent;
window.syncEditors = syncEditors;

// Additional close functions
function closeConfigurator() {
  const modal = document.getElementById('configuratorModal');
  if (modal) {
    modal.style.display = 'none';
  }
  if (configuratorManager) {
    configuratorManager.closeConfigurator();
  }
}

function closeGcodeViewer() {
  const modal = document.getElementById('gcodeViewerModal');
  if (modal) {
    modal.style.display = 'none';
  }

  try {
    // Clean up Three.js renderer
    const gcode3d = document.getElementById('gcode3d');
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

// Configurator helper functions
function configuratorSaveAndCompile() {
  if (configuratorManager) {
    const ggcode = editorManager ? editorManager.getInputValue() : '';
    configuratorManager.handleSaveAndCompile(
      ggcode,
      (code) => editorManager?.setInputValue(code),
      () => submitGGcode(new Event('submit'))
    );
  } else {
    console.error('ConfiguratorManager module not available');
  }
}

function configuratorCompileOnly() {
  if (configuratorManager) {
    const ggcode = editorManager ? editorManager.getInputValue() : '';
    configuratorManager.handleCompileOnly(ggcode, (code) =>
      submitGGcode(new Event('submit'), code)
    );
  } else {
    console.error('ConfiguratorManager module not available');
  }
}

// Export the missing global functions (showGcodeViewer is provided by visualizer module)
window.showExamples = showExamples;
window.loadExample = loadExample;
window.showHelp = showHelp;
window.showConfigurator = showConfigurator;
window.closeGcodeViewer = closeGcodeViewer;
window.closeConfigurator = closeConfigurator;
window.configuratorSaveAndCompile = configuratorSaveAndCompile;
window.configuratorCompileOnly = configuratorCompileOnly;

// renderGcode3D is now provided by the visualizer module
