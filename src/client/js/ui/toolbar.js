/**
 * Toolbar and File Operations Module
 *
 * Handles all toolbar button functionality including:
 * - File operations (open, save, export)
 * - Clipboard operations
 * - User feedback and notifications
 * - Drag and drop file handling
 */

class ToolbarManager {
  constructor() {
    this.lastOpenedFilename = '';
    this.setupEventListeners();
    this.loadSavedFilename();
  }

  /**
   * Load saved filename from localStorage
   */
  loadSavedFilename() {
    const savedFilename = localStorage.getItem('ggcode_last_filename');
    if (savedFilename) {
      this.lastOpenedFilename = savedFilename;
    }
  }

  /**
   * Setup all toolbar event listeners
   */
  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupFileInput();
      this.setupDragAndDrop();
    });
  }

  /**
   * Setup file input handling for opening files
   */
  setupFileInput() {
    const openBtn = document.getElementById('openGGcodeBtn');
    const fileInput = document.getElementById('ggcodeFileInput');

    if (openBtn && fileInput) {
      openBtn.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        this.handleFileLoad(e.target.files[0]);
      });
    }
  }

  /**
   * Setup drag and drop functionality for the editor
   */
  setupDragAndDrop() {
    const editorDom = document.getElementById('editor');
    if (!editorDom) return;

    editorDom.addEventListener('dragover', (e) => {
      e.preventDefault();
      editorDom.style.background = '#222a';
    });

    editorDom.addEventListener('dragleave', (e) => {
      e.preventDefault();
      editorDom.style.background = '';
    });

    editorDom.addEventListener('drop', (e) => {
      e.preventDefault();
      editorDom.style.background = '';

      if (
        e.dataTransfer &&
        e.dataTransfer.files &&
        e.dataTransfer.files.length > 0
      ) {
        this.handleFileLoad(e.dataTransfer.files[0]);
      }
    });
  }

  /**
   * Handle file loading from input or drag/drop
   * @param {File} file - The file to load
   */
  handleFileLoad(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;

      // Determine which editor to use based on file extension
      if (file.name.endsWith('.gcode')) {
        // Load G-code files into output editor
        if (window.outputEditor) {
          window.outputEditor.setValue(content);
        }
      } else if (file.name.endsWith('.ggcode') || file.name.endsWith('.txt')) {
        // Load GGcode files into input editor
        if (window.editor) {
          window.editor.setValue(content);
        }
        // Auto-compile after loading GGcode
        this.triggerCompilation();
      } else {
        // Default to input editor for unknown extensions
        if (window.editor) {
          window.editor.setValue(content);
        }
      }

      // Remember filename
      this.lastOpenedFilename = file.name || '';
      localStorage.setItem('ggcode_last_filename', this.lastOpenedFilename);

      this.showNotification(`Loaded file: ${file.name}`, 'success');
    };

    reader.onerror = () => {
      this.showNotification('Failed to read file', 'error');
    };

    reader.readAsText(file);
  }

  /**
   * Trigger compilation (calls global submitGGcode function)
   */
  triggerCompilation() {
    if (typeof window.submitGGcode === 'function') {
      window.submitGGcode(new Event('submit'));
    }
  }

  /**
   * Copy output G-code to clipboard
   */
  copyOutput() {
    if (!window.outputEditor) {
      this.showNotification('No output to copy', 'warning');
      return;
    }

    const content = window.outputEditor.getValue();
    if (!content.trim()) {
      this.showNotification('Output is empty', 'warning');
      return;
    }

    navigator.clipboard
      .writeText(content)
      .then(() => {
        this.showNotification('G-code copied to clipboard', 'success');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        this.showNotification('Failed to copy to clipboard', 'error');
      });
  }

  /**
   * Save output G-code to file
   */
  saveOutput() {
    if (!window.outputEditor) {
      this.showNotification('No output to save', 'warning');
      return;
    }

    const text = window.outputEditor.getValue();
    if (!text.trim()) {
      this.showNotification('Output is empty', 'warning');
      return;
    }

    try {
      const utf8Bytes = new TextEncoder().encode(text);
      const blob = new Blob([utf8Bytes], { type: 'application/octet-stream' });

      // Generate suggested filename
      let filename = this.generateOutputFilename();

      // Prompt user for filename
      const userFilename = window.prompt('Save G-code as:', filename);
      if (!userFilename) return; // User cancelled

      this.downloadFile(blob, userFilename);
      this.showNotification(`Saved G-code as: ${userFilename}`, 'success');
    } catch (error) {
      console.error('Failed to save output:', error);
      this.showNotification('Failed to save file', 'error');
    }
  }

  /**
   * Save input GGcode to file
   */
  saveGGcode() {
    if (!window.editor) {
      this.showNotification('No GGcode to save', 'warning');
      return;
    }

    const content = window.editor.getValue();
    if (!content.trim()) {
      this.showNotification('GGcode is empty', 'warning');
      return;
    }

    try {
      const blob = new Blob([content], { type: 'text/plain' });

      // Generate suggested filename
      let filename = this.generateGGcodeFilename();

      // Prompt user for filename
      const userFilename = window.prompt('Save GGcode as:', filename);
      if (!userFilename) return; // User cancelled

      this.downloadFile(blob, userFilename);
      this.showNotification(`Saved GGcode as: ${userFilename}`, 'success');
    } catch (error) {
      console.error('Failed to save GGcode:', error);
      this.showNotification('Failed to save file', 'error');
    }
  }

  /**
   * Generate suggested filename for output G-code
   * @returns {string} Suggested filename
   */
  generateOutputFilename() {
    let filename = '';

    if (this.lastOpenedFilename) {
      let base = this.lastOpenedFilename;

      // Remove existing extensions
      if (base.endsWith('.gcode') || base.endsWith('.ggcode')) {
        base = base.replace(/\.(gcode|ggcode)$/i, '');
      } else if (base.lastIndexOf('.') > 0) {
        base = base.slice(0, base.lastIndexOf('.'));
      }

      filename = base + '.g.gcode';
    }

    if (!filename) {
      filename = 'output.g.gcode';
    }

    return filename;
  }

  /**
   * Generate suggested filename for GGcode
   * @returns {string} Suggested filename
   */
  generateGGcodeFilename() {
    let filename = '';

    if (
      this.lastOpenedFilename &&
      this.lastOpenedFilename.endsWith('.ggcode')
    ) {
      filename = this.lastOpenedFilename;
    } else if (this.lastOpenedFilename) {
      // Use base name with .ggcode extension
      const dot = this.lastOpenedFilename.lastIndexOf('.');
      filename =
        (dot > 0
          ? this.lastOpenedFilename.slice(0, dot)
          : this.lastOpenedFilename) + '.ggcode';
    }

    if (!filename) {
      filename = 'input.ggcode';
    }

    return filename;
  }

  /**
   * Download a file blob
   * @param {Blob} blob - The file blob
   * @param {string} filename - The filename
   */
  downloadFile(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();

    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /**
   * Clear all saved content and settings
   */
  clearMemory() {
    const confirmed = confirm(
      'This will clear all saved content and settings. Are you sure?'
    );
    if (!confirmed) return;

    try {
      // Clear localStorage
      localStorage.removeItem('ggcode_input_content');
      localStorage.removeItem('ggcode_output_content');
      localStorage.removeItem('ggcode_last_filename');
      localStorage.removeItem('ggcode_auto_compile');

      // Reset variables
      this.lastOpenedFilename = '';

      // Reset auto-compile checkbox
      const autoCheckbox = document.getElementById('autoCompileCheckbox');
      if (autoCheckbox) {
        autoCheckbox.checked = false;
      }

      // Clear editors
      if (window.editor) {
        window.editor.setValue('');
      }
      if (window.outputEditor) {
        window.outputEditor.setValue('');
      }

      // Reset global auto-compile variable if it exists
      if (typeof window.autoCompile !== 'undefined') {
        window.autoCompile = false;
      }

      this.showNotification('Memory cleared successfully!', 'success');
    } catch (error) {
      console.error('Failed to clear memory:', error);
      this.showNotification('Failed to clear memory', 'error');
    }
  }

  /**
   * Show user notification
   * @param {string} message - The notification message
   * @param {string} type - The notification type ('success', 'error', 'warning', 'info')
   * @param {number} duration - Duration in milliseconds (default: 3000)
   */
  showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(
      '.toolbar-notification'
    );
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `toolbar-notification toolbar-notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '4px',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: '10000',
      maxWidth: '300px',
      wordWrap: 'break-word',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
    });

    // Set background color based on type
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to document
    document.body.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }
    }, duration);
  }
}

// Create global instance
const toolbarManager = new ToolbarManager();

// Export for module use
export { ToolbarManager, toolbarManager };

// Global functions for backward compatibility
window.copyOutput = () => toolbarManager.copyOutput();
window.saveOutput = () => toolbarManager.saveOutput();
window.saveGGcode = () => toolbarManager.saveGGcode();
window.clearMemory = () => toolbarManager.clearMemory();

// Export global instance
window.toolbarManager = toolbarManager;
