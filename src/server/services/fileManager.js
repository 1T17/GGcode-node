const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

/**
 * FileManagerService - Handles file operations for examples and other content
 * Provides proper error handling and logging for file system operations
 */
class FileManagerService {
  constructor(baseDir = null) {
    this.baseDir = baseDir || path.resolve(__dirname, '../../..');
    this.examplesDir = path.join(this.baseDir, 'GGCODE');
  }

  /**
   * Get list of available example files with metadata
   * @returns {Promise<Array>} - Array of example file objects
   * @throws {Error} - If examples directory cannot be accessed
   */
  async getExamples() {
    try {
      // Check if examples directory exists
      if (!fsSync.existsSync(this.examplesDir)) {
        throw new Error('Examples directory not found');
      }

      const files = await fs.readdir(this.examplesDir);
      const ggcodeFiles = files.filter((file) => file.endsWith('.ggcode'));

      const examples = await Promise.all(
        ggcodeFiles.map(async (file) => {
          try {
            const filePath = path.join(this.examplesDir, file);
            const content = await fs.readFile(filePath, 'utf8');

            return this._parseExampleMetadata(file, content);
          } catch (error) {
            console.warn(
              `Warning: Failed to read example file ${file}:`,
              error.message
            );
            return {
              name: file,
              description: 'Failed to load description',
              preview: 'Error loading preview',
              category: 'unknown',
            };
          }
        })
      );

      return examples;
    } catch (error) {
      throw new Error(`Failed to load examples: ${error.message}`);
    }
  }

  /**
   * Get content of a specific example file
   * @param {string} filename - Name of the example file
   * @returns {Promise<string>} - File content
   * @throws {Error} - If file cannot be read
   */
  async getExampleContent(filename) {
    try {
      // Validate filename
      if (!filename || typeof filename !== 'string') {
        throw new Error('Invalid filename');
      }

      // Security check - prevent directory traversal
      if (
        filename.includes('..') ||
        filename.includes('/') ||
        filename.includes('\\')
      ) {
        throw new Error('Invalid filename: path traversal not allowed');
      }

      const filePath = path.join(this.examplesDir, filename);

      // Check if file exists
      if (!fsSync.existsSync(filePath)) {
        throw new Error('File not found');
      }

      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      throw new Error(`Failed to load example content: ${error.message}`);
    }
  }

  /**
   * Get example categories (extracted from file metadata)
   * @returns {Promise<Array>} - Array of category names
   */
  async getExampleCategories() {
    try {
      const examples = await this.getExamples();
      const categories = [...new Set(examples.map((ex) => ex.category))];
      return categories.filter((cat) => cat && cat !== 'unknown');
    } catch (error) {
      throw new Error(`Failed to load categories: ${error.message}`);
    }
  }

  /**
   * Parse metadata from example file content
   * @param {string} filename - Name of the file
   * @param {string} content - File content
   * @returns {Object} - Parsed metadata object
   * @private
   */
  _parseExampleMetadata(filename, content) {
    const lines = content.split('\n');

    // Find first comment line for description
    const firstComment = lines.find((line) => line.trim().startsWith('//'));
    const description = firstComment
      ? firstComment.replace('//', '').trim()
      : 'No description available';

    // Create preview from first few lines
    const preview = lines.slice(0, 3).join('\n').substring(0, 100);
    const previewText =
      preview.length < content.length ? preview + '...' : preview;

    // Try to extract category from filename or comments
    let category = 'general';
    if (filename.toLowerCase().includes('gear')) {
      category = 'mechanical';
    } else if (filename.toLowerCase().includes('spiral')) {
      category = 'patterns';
    } else if (
      filename.toLowerCase().includes('flower') ||
      filename.toLowerCase().includes('rose')
    ) {
      category = 'artistic';
    } else if (
      filename.toLowerCase().includes('basic') ||
      filename.toLowerCase().includes('simple')
    ) {
      category = 'basic';
    }

    return {
      name: filename,
      description: description,
      preview: previewText,
      category: category,
    };
  }

  /**
   * Check if a file exists in the examples directory
   * @param {string} filename - Name of the file to check
   * @returns {Promise<boolean>} - True if file exists
   */
  async fileExists(filename) {
    try {
      const filePath = path.join(this.examplesDir, filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file statistics for an example file
   * @param {string} filename - Name of the file
   * @returns {Promise<Object>} - File stats object
   */
  async getFileStats(filename) {
    try {
      const filePath = path.join(this.examplesDir, filename);
      const stats = await fs.stat(filePath);

      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
      };
    } catch (error) {
      throw new Error(`Failed to get file stats: ${error.message}`);
    }
  }
}

module.exports = FileManagerService;
