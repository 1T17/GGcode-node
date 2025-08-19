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
    this.helpDir =
      helpDir || path.resolve(__dirname, '../../../public/data/help-content');
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
}

module.exports = HelpContentService;
