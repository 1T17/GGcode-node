/**
 * File Operations Module
 * Handles file-related operations like copy, save, clear
 */

import { FileOperations } from './fileOps.js';

class FileOperationsManager {
  constructor(editorManager) {
    this.editorManager = editorManager;
    this.fileOperations = new FileOperations();
  }

  /**
   * Copy output to clipboard
   */
  copyOutput() {
    if (this.fileOperations) {
      this.fileOperations.copyOutput();
    } else {
      console.error('FileOperations module not available');
    }
  }

  /**
   * Save output to file
   */
  saveOutput() {
    if (this.fileOperations) {
      this.fileOperations.saveOutput();
    } else {
      console.error('FileOperations module not available');
    }
  }

  /**
   * Save GGcode to file
   */
  saveGGcode() {
    if (this.fileOperations) {
      this.fileOperations.saveGGcode();
    } else {
      console.error('FileOperations module not available');
    }
  }

  /**
   * Clear saved content and settings
   */
  clearMemory() {
    if (this.fileOperations) {
      this.fileOperations.clearMemory();
    } else {
      console.error('FileOperations module not available');
    }
  }

  /**
   * Save current content (legacy function for backward compatibility)
   */
  saveContent() {
    if (this.editorManager) {
      this.editorManager.saveContent();
    }
  }

  /**
   * Sync editors (legacy function for backward compatibility)
   */
  syncEditors() {
    if (this.editorManager) {
      const ggcodeElement = document.getElementById('ggcode');
      if (ggcodeElement) {
        ggcodeElement.value = this.editorManager.getInputValue();
      }
    }
  }
}

export default FileOperationsManager;
