/**
 * Base API Client
 * Provides common functionality for API requests with error handling and request management
 */

class APIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.timeout = 30000; // 30 seconds default timeout
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, options = {}) {
    return this._makeRequest('GET', endpoint, null, options);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, data = null, options = {}) {
    return this._makeRequest('POST', endpoint, data, options);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async put(endpoint, data = null, options = {}) {
    return this._makeRequest('PUT', endpoint, data, options);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint, options = {}) {
    return this._makeRequest('DELETE', endpoint, null, options);
  }

  /**
   * Make a request with timeout and error handling
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   * @private
   */
  async _makeRequest(method, endpoint, data = null, options = {}) {
    const url = this._buildURL(endpoint);
    const config = this._buildRequestConfig(method, data, options);

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      // Add abort signal to config
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      return await this._handleResponse(response);
    } catch (error) {
      return this._handleError(error, endpoint);
    }
  }

  /**
   * Build full URL from endpoint
   * @param {string} endpoint - API endpoint
   * @returns {string} Full URL
   * @private
   */
  _buildURL(endpoint) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${cleanEndpoint}`;
  }

  /**
   * Build request configuration
   * @param {string} method - HTTP method
   * @param {Object} data - Request body data
   * @param {Object} options - Additional options
   * @returns {Object} Request configuration
   * @private
   */
  _buildRequestConfig(method, data, options) {
    const config = {
      method: method.toUpperCase(),
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    // Add body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
      if (typeof data === 'object') {
        config.body = JSON.stringify(data);
      } else {
        config.body = data;
      }
    }

    return config;
  }

  /**
   * Handle response and parse JSON
   * @param {Response} response - Fetch response
   * @returns {Promise<Object>} Parsed response data
   * @private
   */
  async _handleResponse(response) {
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      // Try to get error details from response body
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        }
      } catch (parseError) {
        // Ignore parse errors, use default message
      }

      throw new APIError(errorMessage, response.status, response);
    }

    // Parse JSON response
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    // Return text for non-JSON responses
    return await response.text();
  }

  /**
   * Handle request errors
   * @param {Error} error - Request error
   * @param {string} endpoint - API endpoint
   * @returns {Object} Error response
   * @private
   */
  _handleError(error, endpoint) {
    console.error(`API request failed for ${endpoint}:`, error);

    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', 408);
    }

    if (error instanceof APIError) {
      throw error;
    }

    // Network or other errors
    throw new APIError(`Network error: ${error.message}`, 0, null, error);
  }

  /**
   * Set default headers
   * @param {Object} headers - Headers to set
   */
  setDefaultHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Set request timeout
   * @param {number} timeout - Timeout in milliseconds
   */
  setTimeout(timeout) {
    this.timeout = timeout;
  }

  /**
   * Get current timeout
   * @returns {number} Current timeout in milliseconds
   */
  getTimeout() {
    return this.timeout;
  }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, status = 0, response = null, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
    this.originalError = originalError;
  }

  /**
   * Check if error is a network error
   * @returns {boolean} True if network error
   */
  isNetworkError() {
    return this.status === 0;
  }

  /**
   * Check if error is a timeout error
   * @returns {boolean} True if timeout error
   */
  isTimeoutError() {
    return this.status === 408;
  }

  /**
   * Check if error is a client error (4xx)
   * @returns {boolean} True if client error
   */
  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if error is a server error (5xx)
   * @returns {boolean} True if server error
   */
  isServerError() {
    return this.status >= 500 && this.status < 600;
  }
}

export { APIClient, APIError };
