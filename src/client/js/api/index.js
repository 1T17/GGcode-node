/**
 * API Module Index
 * Exports all API client classes and utilities
 */

import { APIClient, APIError } from './client.js';
import CompilerAPI from './compiler.js';
import ExamplesAPI from './examples.js';
import HelpAPI from './help.js';

/**
 * API Manager class that provides access to all API clients
 */
class APIManager {
  constructor() {
    this.compiler = new CompilerAPI();
    this.examples = new ExamplesAPI();
    this.help = new HelpAPI();
  }

  /**
   * Set default headers for all API clients
   * @param {Object} headers - Headers to set
   */
  setDefaultHeaders(headers) {
    this.compiler.setDefaultHeaders(headers);
    this.examples.setDefaultHeaders(headers);
    this.help.setDefaultHeaders(headers);
  }

  /**
   * Set timeout for all API clients
   * @param {number} timeout - Timeout in milliseconds
   */
  setTimeout(timeout) {
    this.compiler.setTimeout(timeout);
    this.examples.setTimeout(timeout);
    this.help.setTimeout(timeout);
  }

  /**
   * Get all API clients
   * @returns {Object} Object containing all API clients
   */
  getClients() {
    return {
      compiler: this.compiler,
      examples: this.examples,
      help: this.help,
    };
  }
}

// Create default API manager instance
const apiManager = new APIManager();

// Export individual classes and the manager
export {
  APIClient,
  APIError,
  CompilerAPI,
  ExamplesAPI,
  HelpAPI,
  APIManager,
  apiManager as default,
};
