/**
 * Help API Client
 * Handles requests for help content and documentation
 */

import { APIClient, APIError } from './client.js';

class HelpAPI extends APIClient {
  constructor() {
    super();
    this.supportedLanguages = [
      'en',
      'es',
      'fr',
      'de',
      'it',
      'pt',
      'ru',
      'zh',
      'ja',
      'ko',
      'ar',
      'he',
      'nl',
      'pl',
      'tr',
    ];
    this.defaultLanguage = 'en';
  }

  /**
   * Get help content for a specific language
   * @param {string} language - Language code (e.g., 'en', 'es', 'fr')
   * @returns {Promise<Object>} Help content data
   */
  async getContent(language = this.defaultLanguage) {
    const lang = this._validateLanguage(language);

    try {
      const result = await this.get(`/api/help?lang=${lang}`);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to load help content');
      }

      return {
        language: lang,
        data: result.data || {},
        sections: result.data?.sections || {},
        metadata: result.metadata || {},
        lastUpdated: result.lastUpdated || null,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get help content: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get specific help section
   * @param {string} sectionId - Section identifier
   * @param {string} language - Language code
   * @returns {Promise<Object>} Help section data
   */
  async getSection(sectionId, language = this.defaultLanguage) {
    if (!sectionId || typeof sectionId !== 'string') {
      throw new APIError('Section ID is required and must be a string');
    }

    const lang = this._validateLanguage(language);

    try {
      const result = await this.get(
        `/api/help/section/${sectionId}?lang=${lang}`
      );

      if (!result.success) {
        throw new APIError(result.error || 'Failed to load help section');
      }

      return {
        sectionId: sectionId,
        language: lang,
        title: result.title || '',
        content: result.content || [],
        subsections: result.subsections || [],
        lastUpdated: result.lastUpdated || null,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get help section: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Search help content
   * @param {string} query - Search query
   * @param {string} language - Language code
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async search(query, language = this.defaultLanguage, options = {}) {
    if (!query || typeof query !== 'string') {
      throw new APIError('Search query is required and must be a string');
    }

    const lang = this._validateLanguage(language);

    try {
      const searchParams = {
        q: query,
        lang: lang,
        ...options,
      };

      const queryParams = this._buildQueryParams(searchParams);
      const result = await this.get(`/api/help/search?${queryParams}`);

      if (!result.success) {
        throw new APIError(result.error || 'Search failed');
      }

      return {
        query: query,
        language: lang,
        results: result.results || [],
        totalCount: result.totalCount || 0,
        searchTime: result.searchTime || 0,
        suggestions: result.suggestions || [],
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Help search failed: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get available languages
   * @returns {Promise<Array>} List of supported languages
   */
  async getAvailableLanguages() {
    try {
      const result = await this.get('/api/help/languages');

      if (!result.success) {
        throw new APIError(result.error || 'Failed to get available languages');
      }

      return result.languages || this.supportedLanguages;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get available languages: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get help content metadata
   * @param {string} language - Language code
   * @returns {Promise<Object>} Help metadata
   */
  async getMetadata(language = this.defaultLanguage) {
    const lang = this._validateLanguage(language);

    try {
      const result = await this.get(`/api/help/metadata?lang=${lang}`);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to get help metadata');
      }

      return {
        language: lang,
        version: result.version || '1.0',
        lastUpdated: result.lastUpdated || null,
        sections: result.sections || [],
        totalSections: result.totalSections || 0,
        wordCount: result.wordCount || 0,
        contributors: result.contributors || [],
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get help metadata: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get table of contents
   * @param {string} language - Language code
   * @returns {Promise<Array>} Table of contents
   */
  async getTableOfContents(language = this.defaultLanguage) {
    const lang = this._validateLanguage(language);

    try {
      const result = await this.get(`/api/help/toc?lang=${lang}`);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to get table of contents');
      }

      return result.toc || [];
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get table of contents: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get help content for offline use
   * @param {string} language - Language code
   * @returns {Promise<Object>} Complete help content for offline use
   */
  async getOfflineContent(language = this.defaultLanguage) {
    const lang = this._validateLanguage(language);

    try {
      const result = await this.get(`/api/help/offline?lang=${lang}`);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to get offline content');
      }

      return {
        language: lang,
        content: result.content || {},
        assets: result.assets || [],
        version: result.version || '1.0',
        downloadedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get offline content: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Report help content issue
   * @param {Object} issue - Issue details
   * @returns {Promise<Object>} Report result
   */
  async reportIssue(issue) {
    if (!issue || typeof issue !== 'object') {
      throw new APIError('Issue details are required');
    }

    const requiredFields = ['type', 'description'];
    for (const field of requiredFields) {
      if (!issue[field]) {
        throw new APIError(`Issue ${field} is required`);
      }
    }

    try {
      const result = await this.post('/api/help/report', issue);

      return {
        success: result.success || false,
        issueId: result.issueId || null,
        message: result.message || 'Issue reported successfully',
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to report issue: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Validate language code
   * @param {string} language - Language code to validate
   * @returns {string} Validated language code
   * @private
   */
  _validateLanguage(language) {
    if (!language || typeof language !== 'string') {
      return this.defaultLanguage;
    }

    const lang = language.toLowerCase();
    return this.supportedLanguages.includes(lang) ? lang : this.defaultLanguage;
  }

  /**
   * Build query parameters string
   * @param {Object} params - Parameters object
   * @returns {string} Query parameters string
   * @private
   */
  _buildQueryParams(params) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    }

    return searchParams.toString();
  }

  /**
   * Get supported languages list
   * @returns {Array} List of supported language codes
   */
  getSupportedLanguages() {
    return [...this.supportedLanguages];
  }

  /**
   * Check if language is supported
   * @param {string} language - Language code to check
   * @returns {boolean} True if language is supported
   */
  isLanguageSupported(language) {
    return this.supportedLanguages.includes(language?.toLowerCase());
  }

  /**
   * Get default language
   * @returns {string} Default language code
   */
  getDefaultLanguage() {
    return this.defaultLanguage;
  }

  /**
   * Set default language
   * @param {string} language - Language code to set as default
   */
  setDefaultLanguage(language) {
    if (this.isLanguageSupported(language)) {
      this.defaultLanguage = language.toLowerCase();
    }
  }
}

export default HelpAPI;
