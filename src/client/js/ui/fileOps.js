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
}

// Create global instance
const fileOperations = new FileOperations();

// Export for module use
export { FileOperations, fileOperations };

// Export global instance
window.fileOperations = fileOperations;
