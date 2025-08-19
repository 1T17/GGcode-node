/**
 * Compiler API Client
 * Handles compilation requests to the GGcode compiler service
 */

import { APIClient, APIError } from './client.js';

class CompilerAPI extends APIClient {
  constructor() {
    super();
    this.setTimeout(60000); // 60 seconds for compilation requests
  }

  /**
   * Compile GGcode to G-code
   * @param {string} ggcode - GGcode content to compile
   * @param {Object} options - Compilation options
   * @returns {Promise<Object>} Compilation result
   */
  async compile(ggcode, options = {}) {
    if (!ggcode || typeof ggcode !== 'string') {
      throw new APIError('GGcode content is required and must be a string');
    }

    const requestData = {
      ggcode: ggcode,
      ...options,
    };

    try {
      const result = await this.post('/api/compile', requestData);

      // Validate response structure
      if (typeof result !== 'object') {
        throw new APIError('Invalid response format from compiler');
      }

      return {
        success: result.success || false,
        output: result.output || '',
        error: result.error || null,
        warnings: result.warnings || [],
        metadata: result.metadata || {},
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Compilation failed: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Validate GGcode syntax without full compilation
   * @param {string} ggcode - GGcode content to validate
   * @returns {Promise<Object>} Validation result
   */
  async validate(ggcode) {
    if (!ggcode || typeof ggcode !== 'string') {
      throw new APIError('GGcode content is required and must be a string');
    }

    const requestData = {
      ggcode: ggcode,
      validateOnly: true,
    };

    try {
      const result = await this.post('/api/compile', requestData);

      return {
        success: result.success || false,
        valid: result.valid !== undefined ? result.valid : result.success,
        errors: result.errors || [],
        warnings: result.warnings || [],
        suggestions: result.suggestions || [],
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(`Validation failed: ${error.message}`, 0, null, error);
    }
  }

  /**
   * Get compiler information and capabilities
   * @returns {Promise<Object>} Compiler information
   */
  async getCompilerInfo() {
    try {
      const result = await this.get('/api/compiler/info');

      return {
        version: result.version || 'unknown',
        capabilities: result.capabilities || [],
        supportedFeatures: result.supportedFeatures || [],
        limits: result.limits || {},
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get compiler info: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Compile with progress tracking (if supported)
   * @param {string} ggcode - GGcode content to compile
   * @param {Function} onProgress - Progress callback
   * @param {Object} options - Compilation options
   * @returns {Promise<Object>} Compilation result
   */
  async compileWithProgress(ggcode, onProgress = null, options = {}) {
    // For now, just use regular compile since progress tracking isn't implemented
    // This method is prepared for future enhancement

    if (onProgress) {
      onProgress({ stage: 'starting', progress: 0 });
    }

    try {
      const result = await this.compile(ggcode, options);

      if (onProgress) {
        onProgress({ stage: 'completed', progress: 100 });
      }

      return result;
    } catch (error) {
      if (onProgress) {
        onProgress({ stage: 'error', progress: 0, error: error.message });
      }

      throw error;
    }
  }

  /**
   * Cancel ongoing compilation (if supported)
   * @param {string} compilationId - ID of compilation to cancel
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelCompilation(compilationId) {
    if (!compilationId) {
      throw new APIError('Compilation ID is required');
    }

    try {
      const result = await this.post(`/api/compile/${compilationId}/cancel`);

      return {
        success: result.success || false,
        message: result.message || 'Compilation cancelled',
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to cancel compilation: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Get compilation history (if supported)
   * @param {number} limit - Maximum number of entries to return
   * @returns {Promise<Array>} Compilation history
   */
  async getCompilationHistory(limit = 10) {
    try {
      const result = await this.get(`/api/compile/history?limit=${limit}`);

      return result.history || [];
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to get compilation history: ${error.message}`,
        0,
        null,
        error
      );
    }
  }

  /**
   * Estimate compilation time (if supported)
   * @param {string} ggcode - GGcode content to analyze
   * @returns {Promise<Object>} Time estimation
   */
  async estimateCompilationTime(ggcode) {
    if (!ggcode || typeof ggcode !== 'string') {
      throw new APIError('GGcode content is required and must be a string');
    }

    const requestData = {
      ggcode: ggcode,
      estimateOnly: true,
    };

    try {
      const result = await this.post('/api/compile/estimate', requestData);

      return {
        estimatedTime: result.estimatedTime || 0,
        complexity: result.complexity || 'unknown',
        lineCount: result.lineCount || 0,
        factors: result.factors || [],
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        `Failed to estimate compilation time: ${error.message}`,
        0,
        null,
        error
      );
    }
  }
}

export default CompilerAPI;
