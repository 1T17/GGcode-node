/**
 * File Operations Module
 *
 * Provides advanced file handling capabilities including:
 * - File validation and type detection
 * - Content processing and transformation
 * - Error handling and recovery
 * - File format conversion utilities
 */

class FileOperations {
  constructor() {
    this.supportedExtensions = {
      input: ['.ggcode', '.txt'],
      output: ['.gcode', '.nc', '.cnc'],
      all: ['.ggcode', '.txt', '.gcode', '.nc', '.cnc'],
    };

    this.maxFileSize = 10 * 1024 * 1024; // 10MB limit
  }

  /**
   * Validate file before processing
   * @param {File} file - The file to validate
   * @returns {Object} Validation result with success flag and message
   */
  validateFile(file) {
    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        success: false,
        message: `File too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`,
      };
    }

    // Check if file is empty
    if (file.size === 0) {
      return { success: false, message: 'File is empty' };
    }

    // Check file extension
    const extension = this.getFileExtension(file.name);
    if (!this.supportedExtensions.all.includes(extension)) {
      return {
        success: false,
        message: `Unsupported file type. Supported: ${this.supportedExtensions.all.join(', ')}`,
      };
    }

    return { success: true, message: 'File is valid' };
  }

  /**
   * Get file extension from filename
   * @param {string} filename - The filename
   * @returns {string} The file extension (including dot)
   */
  getFileExtension(filename) {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.slice(lastDot).toLowerCase() : '';
  }

  /**
   * Determine file type based on extension and content
   * @param {string} filename - The filename
   * @param {string} content - The file content
   * @returns {string} File type ('ggcode', 'gcode', 'unknown')
   */
  determineFileType(filename, content) {
    const extension = this.getFileExtension(filename);

    // Check by extension first
    if (this.supportedExtensions.input.includes(extension)) {
      return 'ggcode';
    }

    if (this.supportedExtensions.output.includes(extension)) {
      return 'gcode';
    }

    // Check by content patterns
    if (this.isGGcodeContent(content)) {
      return 'ggcode';
    }

    if (this.isGcodeContent(content)) {
      return 'gcode';
    }

    return 'unknown';
  }

  /**
   * Check if content appears to be GGcode
   * @param {string} content - The file content
   * @returns {boolean} True if content appears to be GGcode
   */
  isGGcodeContent(content) {
    // Look for GGcode-specific patterns
    const ggcodePatterns = [
      /\blet\s+\w+\s*=/, // Variable declarations
      /\bfor\s*\(/, // For loops
      /\bif\s*\(/, // If statements
      /\bfunction\s+\w+/, // Function definitions
      /\/\/\/\s*@/, // Configurator comments
      /\b(sin|cos|tan|sqrt|abs)\s*\(/, // Math functions
    ];

    return ggcodePatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Check if content appears to be G-code
   * @param {string} content - The file content
   * @returns {boolean} True if content appears to be G-code
   */
  isGcodeContent(content) {
    // Look for G-code patterns
    const gcodePatterns = [
      /^[GM]\d+/m, // G or M commands at line start
      /[XYZ]-?\d+\.?\d*/, // Coordinate values
      /^N\d+/m, // Line numbers
      /F\d+/, // Feed rates
      /S\d+/, // Spindle speeds
    ];

    return gcodePatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Process file content based on type
   * @param {string} content - The file content
   * @param {string} type - The file type
   * @returns {Object} Processed content with metadata
   */
  processContent(content, type) {
    const result = {
      content: content,
      type: type,
      lineCount: 0,
      hasErrors: false,
      errors: [],
      warnings: [],
    };

    // Count lines
    result.lineCount = content.split('\n').length;

    // Type-specific processing
    if (type === 'ggcode') {
      this.processGGcodeContent(result);
    } else if (type === 'gcode') {
      this.processGcodeContent(result);
    }

    return result;
  }

  /**
   * Process GGcode content for validation and analysis
   * @param {Object} result - The result object to update
   */
  processGGcodeContent(result) {
    const lines = result.content.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('//')) return;

      // Check for common syntax issues
      if (trimmed.includes('let ') && !trimmed.includes('=')) {
        result.warnings.push(
          `Line ${lineNum}: Variable declaration without assignment`
        );
      }

      // Check for unmatched brackets
      const openBrackets = (trimmed.match(/\(/g) || []).length;
      const closeBrackets = (trimmed.match(/\)/g) || []).length;
      if (openBrackets !== closeBrackets) {
        result.warnings.push(`Line ${lineNum}: Unmatched parentheses`);
      }
    });
  }

  /**
   * Process G-code content for validation and analysis
   * @param {Object} result - The result object to update
   */
  processGcodeContent(result) {
    const lines = result.content.split('\n');
    let hasMotionCommands = false;

    lines.forEach((line) => {
      const trimmed = line.trim().toUpperCase();

      if (!trimmed || trimmed.startsWith('(') || trimmed.startsWith(';'))
        return;

      // Check for motion commands
      if (/G[0123]/.test(trimmed)) {
        hasMotionCommands = true;
      }

      // Check for coordinates without motion commands
      if (/[XYZ]-?\d/.test(trimmed) && !/G[0123]/.test(trimmed)) {
        // This might be modal G-code, which is normal
      }
    });

    if (!hasMotionCommands) {
      result.warnings.push('No motion commands (G0, G1, G2, G3) found');
    }
  }

  /**
   * Read file with progress tracking
   * @param {File} file - The file to read
   * @param {Function} onProgress - Progress callback (optional)
   * @returns {Promise<Object>} Promise resolving to file data
   */
  async readFileWithProgress(file, onProgress = null) {
    return new Promise((resolve, reject) => {
      const validation = this.validateFile(file);
      if (!validation.success) {
        reject(new Error(validation.message));
        return;
      }

      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (onProgress && e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      };

      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const type = this.determineFileType(file.name, content);
          const processed = this.processContent(content, type);

          resolve({
            filename: file.name,
            size: file.size,
            lastModified: new Date(file.lastModified),
            ...processed,
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Create a downloadable file from content
   * @param {string} content - The file content
   * @param {string} filename - The filename
   * @param {string} mimeType - The MIME type (optional)
   * @returns {Object} Download information
   */
  createDownload(content, filename, mimeType = 'text/plain') {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      return {
        success: true,
        blob: blob,
        url: url,
        filename: filename,
        size: blob.size,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Convert content between formats
   * @param {string} content - The content to convert
   * @param {string} fromType - Source format
   * @param {string} toType - Target format
   * @returns {Object} Conversion result
   */
  convertFormat(content, fromType, toType) {
    if (fromType === toType) {
      return { success: true, content: content };
    }

    // Currently no format conversion is implemented
    // This is a placeholder for future format conversion features
    return {
      success: false,
      error: `Conversion from ${fromType} to ${toType} not supported`,
    };
  }

  /**
   * Get file statistics
   * @param {string} content - The file content
   * @param {string} type - The file type
   * @returns {Object} File statistics
   */
  getFileStats(content, type) {
    const lines = content.split('\n');
    const stats = {
      totalLines: lines.length,
      nonEmptyLines: lines.filter((line) => line.trim()).length,
      commentLines: 0,
      codeLines: 0,
      size: new Blob([content]).size,
    };

    if (type === 'ggcode') {
      stats.commentLines = lines.filter((line) =>
        line.trim().startsWith('//')
      ).length;
      stats.codeLines = stats.nonEmptyLines - stats.commentLines;
    } else if (type === 'gcode') {
      stats.commentLines = lines.filter((line) => {
        const trimmed = line.trim();
        return trimmed.startsWith('(') || trimmed.startsWith(';');
      }).length;
      stats.codeLines = stats.nonEmptyLines - stats.commentLines;
    }

    return stats;
  }

  /**
   * Copy output G-code to clipboard
   */
  copyOutput() {
    // Find the copy button for visual feedback
    const copyButton = document.querySelector(
      'button[onclick*="copyOutput"], button[title*="Copy output"]'
    );

    if (
      !window.outputEditor ||
      typeof window.outputEditor.getValue !== 'function'
    ) {
      alert('No output content available to copy');
      return;
    }

    const content = window.outputEditor.getValue();
    if (!content.trim()) {
      alert('No output content to copy');
      return;
    }

    navigator.clipboard
      .writeText(content)
      .then(() => {
        //console.log('Output copied to clipboard');

        // Show success feedback on the button
        if (copyButton) {
          copyButton.classList.add('copy-success');
          setTimeout(() => {
            copyButton.classList.remove('copy-success');
          }, 800);
        }
      })
      .catch((err) => {
        console.error('Failed to copy output:', err);
        alert('Failed to copy: ' + err.message);
      });
  }

  /**
   * Save output G-code to file
   */
  saveOutput() {
    // Find the export/save button to show loading on it
    const exportButton = document.querySelector(
      'button[onclick*="saveOutput"], button[title*="Save output"]'
    );

    if (
      !window.outputEditor ||
      typeof window.outputEditor.getValue !== 'function'
    ) {
      alert('No output content available to save');
      return;
    }

    const text = window.outputEditor.getValue();
    if (!text.trim()) {
      alert('No output content to save');
      return;
    }

    // Show loading on the export button
    let restoreButton = null;
    if (exportButton && window.navigationManager) {
      restoreButton = window.navigationManager.showButtonLoading(
        exportButton,
        'Exporting...'
      );
    }

    // Get last opened filename for suggestion
    let lastFilename = '';
    try {
      lastFilename = localStorage.getItem('ggcode_last_filename') || '';
    } catch (error) {
      console.warn('Failed to get filename from storage:', error);
    }

    // Generate suggested filename
    let suggestedFilename = '';
    if (lastFilename) {
      let base = lastFilename;
      if (base.endsWith('.gcode') || base.endsWith('.ggcode')) {
        base = base.replace(/\.(gcode|ggcode)$/i, '');
      } else if (base.lastIndexOf('.') > 0) {
        base = base.slice(0, base.lastIndexOf('.'));
      }
      suggestedFilename = base + '.g.gcode';
    }
    if (!suggestedFilename) suggestedFilename = 'output.g.gcode';

    // Prompt user for filename
    const userFilename = window.prompt('Save G-code as:', suggestedFilename);
    if (!userFilename) {
      if (restoreButton) restoreButton();
      return; // User cancelled
    }

    try {
      // Create and download file
      const utf8Bytes = new TextEncoder().encode(text);
      const blob = new Blob([utf8Bytes], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = userFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

      console.log('Output saved as:', userFilename);
    } catch (error) {
      console.error('Failed to save output:', error);
      alert('Failed to save file: ' + error.message);
    } finally {
      // Always restore the button state
      if (restoreButton) restoreButton();
    }
  }

  /**
   * Save GGcode input to file
   */
  saveGGcode() {
    // Find the save button to show loading on it
    const saveButton = document.querySelector(
      'button[onclick*="saveGGcode"], button[title*="Save GGcode input"]'
    );

    if (!window.editor || typeof window.editor.getValue !== 'function') {
      alert('No input content available to save');
      return;
    }

    const content = window.editor.getValue();
    if (!content.trim()) {
      alert('No input content to save');
      return;
    }

    // Show loading on the save button
    let restoreButton = null;
    if (saveButton && window.navigationManager) {
      restoreButton = window.navigationManager.showButtonLoading(
        saveButton,
        'Saving...'
      );
    }

    try {
      // Get last opened filename for suggestion
      let lastFilename = '';
      try {
        lastFilename = localStorage.getItem('ggcode_last_filename') || '';
      } catch (error) {
        console.warn('Failed to get filename from storage:', error);
      }

      // Generate suggested filename
      let suggestedFilename =
        lastFilename && lastFilename.endsWith('.ggcode') ? lastFilename : '';
      if (!suggestedFilename && lastFilename) {
        const dot = lastFilename.lastIndexOf('.');
        suggestedFilename =
          (dot > 0 ? lastFilename.slice(0, dot) : lastFilename) + '.ggcode';
      }
      if (!suggestedFilename) suggestedFilename = 'input.ggcode';

      // Prompt user for filename
      const userFilename = window.prompt('Save GGcode as:', suggestedFilename);
      if (!userFilename) {
        if (restoreButton) restoreButton();
        return; // User cancelled
      }

      // Create and download file
      const blob = new Blob([content], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = userFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

      console.log('GGcode saved as:', userFilename);
    } catch (error) {
      console.error('Failed to save GGcode:', error);
      alert('Failed to save file: ' + error.message);
    } finally {
      // Always restore the button state
      if (restoreButton) restoreButton();
    }
  }

  /**
   * Clear all saved content and settings
   */
  clearMemory() {
    if (
      !confirm('This will clear all saved content and settings. Are you sure?')
    ) {
      return;
    }

    try {
      // Clear localStorage
      localStorage.removeItem('ggcode_input_content');
      localStorage.removeItem('ggcode_output_content');
      localStorage.removeItem('ggcode_last_filename');
      localStorage.removeItem('ggcode_auto_compile');

      // Reset editors if available
      if (window.editor && typeof window.editor.setValue === 'function') {
        window.editor.setValue('');
      }
      if (
        window.outputEditor &&
        typeof window.outputEditor.setValue === 'function'
      ) {
        window.outputEditor.setValue('');
      }

      // Reset auto-compile checkbox
      const autoCheckbox = document.getElementById('autoCompileCheckbox');
      if (autoCheckbox) {
        autoCheckbox.checked = false;
      }

      console.log('Memory cleared successfully');
      alert('Memory cleared successfully!');
    } catch (error) {
      console.error('Failed to clear memory:', error);
      alert('Failed to clear memory: ' + error.message);
    }
  }
}

// Create global instance
const fileOperations = new FileOperations();

// Export for module use
export { FileOperations, fileOperations };

// Export global instance
window.fileOperations = fileOperations;
