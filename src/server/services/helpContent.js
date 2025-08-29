const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

/**
 * HelpContentService - Manages multilingual help content
 * Provides proper error handling and caching for help system
 */
class HelpContentService {
  constructor(helpDir = null) {
    // Use provided helpDir or default to public/data/help-content
    this.helpDir = helpDir || path.resolve(__dirname, '../');
    this.metadataPath = path.join(this.helpDir, 'metadata.json');
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get help content for specified language
   * @param {string} language - Language code (e.g., 'en', 'es', 'fr')
   * @returns {Promise<Object>} - Help content object with metadata and sections
   * @throws {Error} - If help content cannot be loaded
   */
  async getHelpContent(language = 'en') {
    try {
      // Validate language parameter
      if (!language || typeof language !== 'string') {
        throw new Error('Invalid language parameter');
      }

      // Check cache first
      const cacheKey = `help_${language}`;
      if (this._isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey).data;
      }

      // Load metadata
      const metadata = await this._loadMetadata();

      // Validate language is supported
      const supportedLanguages = metadata.supportedLanguages.map(
        (lang) => lang.code
      );
      if (!supportedLanguages.includes(language)) {
        throw new Error(
          `Language '${language}' not supported. Available: ${supportedLanguages.join(', ')}`
        );
      }

      // Load language-specific content
      const langData = await this._loadLanguageData(language);

      // Construct response
      const helpData = {
        metadata: {
          version: metadata.version,
          lastUpdated: metadata.lastUpdated,
          supportedLanguages: supportedLanguages,
          defaultLanguage: metadata.defaultLanguage,
        },
        sections: langData.sections,
      };

      // Cache the result
      this._cacheData(cacheKey, helpData);

      return helpData;
    } catch (error) {
      throw new Error(`Failed to load help content: ${error.message}`);
    }
  }

  /**
   * Get list of supported languages
   * @returns {Promise<Object>} - Object with languages array and default language
   * @throws {Error} - If metadata cannot be loaded
   */
  async getSupportedLanguages() {
    try {
      const cacheKey = 'languages';
      if (this._isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey).data;
      }

      const metadata = await this._loadMetadata();

      const result = {
        languages: metadata.supportedLanguages,
        defaultLanguage: metadata.defaultLanguage,
      };

      this._cacheData(cacheKey, result);
      return result;
    } catch (error) {
      throw new Error(`Failed to load languages: ${error.message}`);
    }
  }

  /**
   * Get specific help section for a language
   * @param {string} language - Language code
   * @param {string} sectionId - Section identifier
   * @returns {Promise<Object>} - Section content
   * @throws {Error} - If section cannot be found
   */
  async getHelpSection(language, sectionId) {
    try {
      const helpData = await this.getHelpContent(language);

      if (!helpData.sections[sectionId]) {
        throw new Error(`Section '${sectionId}' not found`);
      }

      return helpData.sections[sectionId];
    } catch (error) {
      throw new Error(`Failed to load help section: ${error.message}`);
    }
  }

  /**
   * Load metadata.json file
   * @returns {Promise<Object>} - Parsed metadata
   * @throws {Error} - If metadata cannot be loaded
   * @private
   */
  async _loadMetadata() {
    try {
      if (!fsSync.existsSync(this.metadataPath)) {
        throw new Error('Help metadata not found');
      }

      const metadataContent = await fs.readFile(this.metadataPath, 'utf8');
      return JSON.parse(metadataContent);
    } catch (error) {
      if (error.message.includes('Help metadata not found')) {
        throw error;
      }
      throw new Error(`Failed to parse metadata: ${error.message}`);
    }
  }

  /**
   * Load language-specific help data
   * @param {string} language - Language code
   * @returns {Promise<Object>} - Parsed language data
   * @throws {Error} - If language file cannot be loaded
   * @private
   */
  async _loadLanguageData(language) {
    try {
      const langFilePath = path.join(this.helpDir, `${language}.json`);

      if (!fsSync.existsSync(langFilePath)) {
        throw new Error(`Language file for '${language}' not found`);
      }

      const langContent = await fs.readFile(langFilePath, 'utf8');
      return JSON.parse(langContent);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw error;
      }
      throw new Error(
        `Failed to parse language data for '${language}': ${error.message}`
      );
    }
  }

  /**
   * Check if cached data is still valid
   * @param {string} key - Cache key
   * @returns {boolean} - True if cache is valid
   * @private
   */
  _isCacheValid(key) {
    if (!this.cache.has(key)) {
      return false;
    }

    const cached = this.cache.get(key);
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  /**
   * Cache data with timestamp
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   * @private
   */
  _cacheData(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timeout: this.cacheTimeout,
    };
  }

  /**
   * Get list of markdown files in the entire project (excluding node_modules)
   * @returns {Promise<Array>} - Array of markdown file objects
   * @throws {Error} - If directory cannot be read
   */
  async getMarkdownFiles() {
    try {
      // Check cache first
      const cacheKey = 'markdown_files';
      if (this._isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey).data;
      }

      // Scan from the project root (go up from __dirname to get the actual project root)
      const helpContentDir = __dirname; // /src/server/services/
      const servicesDir = path.dirname(helpContentDir); // /src/server/
      const serverDir = path.dirname(servicesDir); // /src/
      const projectRoot = path.dirname(serverDir); // project root
      const markdownFiles = [];

      // Recursive function to scan directories
      const scanDirectory = async (dir, prefix = '') => {
        try {
          const files = await fs.readdir(dir);

          for (const file of files) {
            // Skip node_modules and other unwanted directories
            if (
              file === 'node_modules' ||
              file.startsWith('.') ||
              file === 'coverage'
            ) {
              continue;
            }

            const fullPath = path.join(dir, file);
            const relativePath = prefix ? prefix + '/' + file : file;

            try {
              const stats = await fs.stat(fullPath);

              if (stats.isDirectory()) {
                // Recursively scan subdirectory
                await scanDirectory(fullPath, relativePath);
              } else if (file.endsWith('.md')) {
                markdownFiles.push({
                  path: relativePath,
                  name: file,
                  type: 'file',
                  size: stats.size,
                  modified: stats.mtime.toISOString(),
                  directory: prefix,
                });
              }
            } catch (error) {
              // Skip files we can't access
              console.warn(`Skipping ${fullPath}: ${error.message}`);
            }
          }
        } catch (error) {
          console.warn(`Error scanning ${dir}: ${error.message}`);
        }
      };

      await scanDirectory(projectRoot);

      // Sort files by path for better organization
      markdownFiles.sort((a, b) => a.path.localeCompare(b.path));

      // Cache the result
      this._cacheData(cacheKey, markdownFiles);

      return markdownFiles;
    } catch (error) {
      throw new Error(`Failed to read markdown files: ${error.message}`);
    }
  }

  /**
   * Get content of a specific markdown file
   * @param {string} fileName - Name of the markdown file (relative path from project root)
   * @returns {Promise<string>} - File content
   * @throws {Error} - If file cannot be read or doesn't exist
   */
  async getMarkdownContent(fileName) {
    try {
      // Validate file name to prevent directory traversal
      if (!fileName || !fileName.endsWith('.md')) {
        throw new Error('Invalid file name');
      }

      // Prevent directory traversal attacks
      const normalizedPath = path.normalize(fileName);
      if (normalizedPath.startsWith('..') || normalizedPath.includes('../')) {
        throw new Error('Invalid file path: directory traversal not allowed');
      }

      // Check cache first
      const cacheKey = `markdown_${fileName}`;
      if (this._isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey).data;
      }

      // Calculate the correct project root path (same logic as getMarkdownFiles)
      const helpContentDir = __dirname; // /src/server/services/
      const servicesDir = path.dirname(helpContentDir); // /src/server/
      const serverDir = path.dirname(servicesDir); // /src/
      const projectRoot = path.dirname(serverDir); // project root

      const filePath = path.join(projectRoot, normalizedPath);

      // Verify file exists
      if (!fsSync.existsSync(filePath)) {
        throw new Error(`File '${fileName}' not found`);
      }

      // Read file content
      const content = await fs.readFile(filePath, 'utf8');

      // Cache the result
      this._cacheData(cacheKey, content);

      return content;
    } catch (error) {
      if (
        error.message.includes('not found') ||
        error.message.includes('Invalid file name') ||
        error.message.includes('directory traversal')
      ) {
        throw error;
      }
      throw new Error(`Failed to read markdown content: ${error.message}`);
    }
  }
}

module.exports = HelpContentService;
