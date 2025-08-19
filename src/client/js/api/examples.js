/**
 * Examples API Client
 * Handles requests for example files and content
 */

import { APIClient, APIError } from './client.js';

class ExamplesAPI extends APIClient {
  constructor() {
    super();
  }

  /**
   * Get list of available example files
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of example files
   */
  async getList(options = {}) {
    try {
      const queryParams = this._buildQueryParams(options);
      const endpoint = queryParams
        ? `/api/examples?${queryParams}`
        : '/api/examples';

      const result = await this.get(endpoint);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to load examples');
      }

      return this._processExamplesList(result.files || []);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get examples list: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get content of a specific example file
   * @param {string} filename - Name of the example file
   * @returns {Promise<Object>} Example file content and metadata
   */
  async getContent(filename) {
    if (!filename || typeof filename !== 'string') {
      throw new APIError('Filename is required and must be a string');
    }

    try {
      const encodedFilename = encodeURIComponent(filename);
      const result = await this.get(`/api/examples/${encodedFilename}`);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to load example content');
      }

      return {
        filename: filename,
        content: result.content || '',
        description: result.description || '',
        category: result.category || 'general',
        tags: result.tags || [],
        metadata: result.metadata || {},
        lastModified: result.lastModified || null,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get example content: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Search examples by query
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Matching examples
   */
  async search(query, options = {}) {
    if (!query || typeof query !== 'string') {
      throw new APIError('Search query is required and must be a string');
    }

    try {
      const searchParams = {
        q: query,
        ...options,
      };

      const queryParams = this._buildQueryParams(searchParams);
      const result = await this.get(`/api/examples/search?${queryParams}`);

      if (!result.success) {
        throw new APIError(result.error || 'Search failed');
      }

      return {
        query: query,
        results: this._processExamplesList(result.results || []),
        totalCount: result.totalCount || 0,
        searchTime: result.searchTime || 0,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Example search failed: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get examples by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} Examples in the category
   */
  async getByCategory(category) {
    if (!category || typeof category !== 'string') {
      throw new APIError('Category is required and must be a string');
    }

    try {
      const result = await this.get(
        `/api/examples/category/${encodeURIComponent(category)}`
      );

      if (!result.success) {
        throw new APIError(
          result.error || 'Failed to get examples by category'
        );
      }

      return {
        category: category,
        examples: this._processExamplesList(result.examples || []),
        count: result.count || 0,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get examples by category: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get available categories
   * @returns {Promise<Array>} List of categories
   */
  async getCategories() {
    try {
      const result = await this.get('/api/examples/categories');

      if (!result.success) {
        throw new APIError(result.error || 'Failed to get categories');
      }

      return result.categories || [];
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get categories: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get example metadata without content
   * @param {string} filename - Name of the example file
   * @returns {Promise<Object>} Example metadata
   */
  async getMetadata(filename) {
    if (!filename || typeof filename !== 'string') {
      throw new APIError('Filename is required and must be a string');
    }

    try {
      const encodedFilename = encodeURIComponent(filename);
      const result = await this.get(
        `/api/examples/${encodedFilename}/metadata`
      );

      if (!result.success) {
        throw new APIError(result.error || 'Failed to get example metadata');
      }

      return {
        filename: filename,
        name: result.name || filename,
        description: result.description || '',
        category: result.category || 'general',
        tags: result.tags || [],
        size: result.size || 0,
        lastModified: result.lastModified || null,
        difficulty: result.difficulty || 'beginner',
        estimatedTime: result.estimatedTime || null,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get example metadata: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get featured or recommended examples
   * @param {number} limit - Maximum number of examples to return
   * @returns {Promise<Array>} Featured examples
   */
  async getFeatured(limit = 5) {
    try {
      const result = await this.get(`/api/examples/featured?limit=${limit}`);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to get featured examples');
      }

      return this._processExamplesList(result.examples || []);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get featured examples: ${error.message}`,
        0,
        null,
        error
      );
    }
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
   * Process and normalize examples list
   * @param {Array} examples - Raw examples list
   * @returns {Array} Processed examples list
   * @private
   */
  _processExamplesList(examples) {
    return examples.map((example) => ({
      name: example.name || example.filename || 'Untitled',
      filename: example.filename || example.name || '',
      description: example.description || 'No description available',
      preview: example.preview || '',
      category: example.category || 'general',
      tags: example.tags || [],
      difficulty: example.difficulty || 'beginner',
      size: example.size || 0,
      lastModified: example.lastModified || null,
      featured: example.featured || false,
    }));
  }
}

export default ExamplesAPI;
