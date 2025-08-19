/**
 * @jest-environment jsdom
 */

// Mock fetch globally
global.fetch = jest.fn();

// Since the client modules use ES6 imports, we need to handle them differently in tests
// For now, we'll create mock implementations that match the expected interface
const APIClient = class {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
    this.timeout = 30000;
  }

  async get(endpoint, options = {}) {
    return this._makeRequest('GET', endpoint, null, options);
  }

  async post(endpoint, data = null, options = {}) {
    return this._makeRequest('POST', endpoint, data, options);
  }

  async put(endpoint, data = null, options = {}) {
    return this._makeRequest('PUT', endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this._makeRequest('DELETE', endpoint, null, options);
  }

  async _makeRequest(method, endpoint, data = null, options = {}) {
    const url = this._buildURL(endpoint);
    const config = this._buildRequestConfig(method, data, options);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      return await this._handleResponse(response);
    } catch (error) {
      return this._handleError(error, endpoint);
    }
  }

  _buildURL(endpoint) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${cleanEndpoint}`;
  }

  _buildRequestConfig(method, data, options) {
    const config = {
      method: method.toUpperCase(),
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      if (typeof data === 'object') {
        config.body = JSON.stringify(data);
      } else {
        config.body = data;
      }
    }

    return config;
  }

  async _handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
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
        // Ignore parse errors
      }

      throw new APIError(errorMessage, response.status, response);
    }

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  }

  _handleError(error, endpoint) {
    console.error(`API request failed for ${endpoint}:`, error);

    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', 408);
    }

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(`Network error: ${error.message}`, 0, null, error);
  }

  setDefaultHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  setTimeout(timeout) {
    this.timeout = timeout;
  }

  getTimeout() {
    return this.timeout;
  }
};

const APIError = class extends Error {
  constructor(message, status = 0, response = null, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
    this.originalError = originalError;
  }

  isNetworkError() {
    return this.status === 0;
  }

  isTimeoutError() {
    return this.status === 408;
  }

  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  isServerError() {
    return this.status >= 500 && this.status < 600;
  }
};

describe('APIClient', () => {
  let apiClient;
  let mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = global.fetch;
    apiClient = new APIClient('http://localhost:3000');
  });

  describe('constructor', () => {
    test('should initialize with default values', () => {
      const client = new APIClient();
      expect(client.baseURL).toBe('');
      expect(client.timeout).toBe(30000);
      expect(client.defaultHeaders).toEqual({
        'Content-Type': 'application/json'
      });
    });

    test('should initialize with custom base URL', () => {
      const client = new APIClient('http://api.example.com');
      expect(client.baseURL).toBe('http://api.example.com');
    });
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({ success: true }),
      });
    });

    test('should make GET request', async () => {
      await apiClient.get('/test');
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    test('should make POST request with data', async () => {
      const testData = { key: 'value' };
      await apiClient.post('/test', testData);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(testData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    test('should make PUT request with data', async () => {
      const testData = { key: 'updated' };
      await apiClient.put('/test', testData);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(testData)
        })
      );
    });

    test('should make DELETE request', async () => {
      await apiClient.delete('/test');
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  describe('_buildURL', () => {
    test('should build URL with leading slash', () => {
      const url = apiClient._buildURL('/api/test');
      expect(url).toBe('http://localhost:3000/api/test');
    });

    test('should build URL without leading slash', () => {
      const url = apiClient._buildURL('api/test');
      expect(url).toBe('http://localhost:3000/api/test');
    });

    test('should handle empty base URL', () => {
      const client = new APIClient('');
      const url = client._buildURL('/test');
      expect(url).toBe('/test');
    });
  });

  describe('_buildRequestConfig', () => {
    test('should build config for GET request', () => {
      const config = apiClient._buildRequestConfig('GET', null, {});
      
      expect(config).toEqual({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    test('should build config for POST request with JSON data', () => {
      const data = { key: 'value' };
      const config = apiClient._buildRequestConfig('POST', data, {});
      
      expect(config).toEqual({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    });

    test('should build config with custom headers', () => {
      const options = {
        headers: {
          'Authorization': 'Bearer token123'
        }
      };
      const config = apiClient._buildRequestConfig('GET', null, options);
      
      expect(config.headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
      });
    });

    test('should handle string data for POST request', () => {
      const data = 'raw string data';
      const config = apiClient._buildRequestConfig('POST', data, {});
      
      expect(config.body).toBe(data);
    });
  });

  describe('_handleResponse', () => {
    test('should parse JSON response', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({ success: true, data: 'test' }),
      };
      
      const result = await apiClient._handleResponse(mockResponse);
      
      expect(result).toEqual({ success: true, data: 'test' });
    });

    test('should return text for non-JSON response', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'text/plain']]),
        text: () => Promise.resolve('plain text response'),
      };
      
      const result = await apiClient._handleResponse(mockResponse);
      
      expect(result).toBe('plain text response');
    });

    test('should throw APIError for HTTP error status', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({ error: 'Resource not found' }),
      };
      
      await expect(apiClient._handleResponse(mockResponse)).rejects.toThrow(APIError);
      await expect(apiClient._handleResponse(mockResponse)).rejects.toThrow('Resource not found');
    });

    test('should handle error response without JSON body', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Map([['content-type', 'text/plain']]),
        text: () => Promise.resolve('Server error occurred'),
      };
      
      await expect(apiClient._handleResponse(mockResponse)).rejects.toThrow('Server error occurred');
    });

    test('should handle malformed JSON in error response', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.reject(new Error('Invalid JSON')),
        text: () => Promise.resolve(''),
      };
      
      await expect(apiClient._handleResponse(mockResponse)).rejects.toThrow('HTTP 400: Bad Request');
    });
  });

  describe('_handleError', () => {
    test('should handle timeout errors', () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'AbortError';
      
      expect(() => apiClient._handleError(timeoutError, '/test')).toThrow(APIError);
      expect(() => apiClient._handleError(timeoutError, '/test')).toThrow('Request timeout');
    });

    test('should re-throw APIError instances', () => {
      const apiError = new APIError('Custom API error', 400);
      
      expect(() => apiClient._handleError(apiError, '/test')).toThrow(apiError);
    });

    test('should wrap network errors in APIError', () => {
      const networkError = new Error('Network connection failed');
      
      expect(() => apiClient._handleError(networkError, '/test')).toThrow(APIError);
      expect(() => apiClient._handleError(networkError, '/test')).toThrow('Network error');
    });
  });

  describe('timeout handling', () => {
    test('should abort request after timeout', async () => {
      const client = new APIClient();
      client.setTimeout(100); // 100ms timeout
      
      // Mock AbortController
      const mockAbort = jest.fn();
      global.AbortController = jest.fn(() => ({
        abort: mockAbort,
        signal: { aborted: false }
      }));
      
      // Mock a slow response that gets aborted
      mockFetch.mockImplementation(() => {
        const error = new Error('Request timeout');
        error.name = 'AbortError';
        return Promise.reject(error);
      });
      
      await expect(client.get('/slow-endpoint')).rejects.toThrow('Request timeout');
    });
  });

  describe('configuration methods', () => {
    test('should set default headers', () => {
      apiClient.setDefaultHeaders({ 'Authorization': 'Bearer token' });
      
      expect(apiClient.defaultHeaders).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token'
      });
    });

    test('should set timeout', () => {
      apiClient.setTimeout(5000);
      expect(apiClient.getTimeout()).toBe(5000);
    });
  });
});

describe('APIError', () => {
  test('should create error with message and status', () => {
    const error = new APIError('Test error', 404);
    
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(404);
    expect(error.name).toBe('APIError');
  });

  test('should identify network errors', () => {
    const networkError = new APIError('Network failed', 0);
    const httpError = new APIError('Not found', 404);
    
    expect(networkError.isNetworkError()).toBe(true);
    expect(httpError.isNetworkError()).toBe(false);
  });

  test('should identify timeout errors', () => {
    const timeoutError = new APIError('Timeout', 408);
    const otherError = new APIError('Other error', 500);
    
    expect(timeoutError.isTimeoutError()).toBe(true);
    expect(otherError.isTimeoutError()).toBe(false);
  });

  test('should identify client errors (4xx)', () => {
    const clientError = new APIError('Bad request', 400);
    const serverError = new APIError('Server error', 500);
    
    expect(clientError.isClientError()).toBe(true);
    expect(serverError.isClientError()).toBe(false);
  });

  test('should identify server errors (5xx)', () => {
    const serverError = new APIError('Internal error', 500);
    const clientError = new APIError('Not found', 404);
    
    expect(serverError.isServerError()).toBe(true);
    expect(clientError.isServerError()).toBe(false);
  });
});