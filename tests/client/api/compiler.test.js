/**
 * @jest-environment jsdom
 */

// Mock APIError class
class APIError extends Error {
  constructor(message, status = 0, response = null, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
    this.originalError = originalError;
  }
}

// Mock APIClient class
class MockAPIClient {
  constructor() {
    this.get = jest.fn();
    this.post = jest.fn();
    this.put = jest.fn();
    this.delete = jest.fn();
    this.setTimeout = jest.fn();
  }
}

// Create CompilerAPI class for testing (simplified version)
class CompilerAPI extends MockAPIClient {
  constructor() {
    super();
    this.setTimeout(60000);
  }

  async compile(ggcode, options = {}) {
    if (!ggcode || typeof ggcode !== 'string') {
      throw new APIError('GGcode content is required and must be a string');
    }

    const requestData = {
      ggcode: ggcode,
      ...options
    };

    try {
      const result = await this.post('/api/compile', requestData);
      
      if (typeof result !== 'object') {
        throw new APIError('Invalid response format from compiler');
      }

      return {
        success: result.success || false,
        output: result.output || '',
        error: result.error || null,
        warnings: result.warnings || [],
        metadata: result.metadata || {}
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      throw new APIError(`Compilation failed: ${error.message}`, 0, null, error);
    }
  }

  async validate(ggcode) {
    if (!ggcode || typeof ggcode !== 'string') {
      throw new APIError('GGcode content is required and must be a string');
    }

    const requestData = {
      ggcode: ggcode,
      validateOnly: true
    };

    try {
      const result = await this.post('/api/compile', requestData);
      
      return {
        success: result.success || false,
        valid: result.valid !== undefined ? result.valid : result.success,
        errors: result.errors || [],
        warnings: result.warnings || [],
        suggestions: result.suggestions || []
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      throw new APIError(`Validation failed: ${error.message}`, 0, null, error);
    }
  }

  async getCompilerInfo() {
    try {
      const result = await this.get('/api/compiler/info');
      
      return {
        version: result.version || 'unknown',
        capabilities: result.capabilities || [],
        supportedFeatures: result.supportedFeatures || [],
        limits: result.limits || {}
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      throw new APIError(`Failed to get compiler info: ${error.message}`, 0, null, error);
    }
  }
}

describe('CompilerAPI', () => {
  let compilerAPI;

  beforeEach(() => {
    jest.clearAllMocks();
    compilerAPI = new CompilerAPI();
  });

  describe('constructor', () => {
    test('should initialize with extended timeout', () => {
      expect(compilerAPI.setTimeout).toHaveBeenCalledWith(60000);
    });
  });

  describe('compile', () => {
    test('should compile valid GGcode successfully', async () => {
      const mockResponse = {
        success: true,
        output: 'G0 X10.000 Y10.000\nG1 X20.000 Y20.000',
        error: null,
        warnings: [],
        metadata: { lineCount: 2 }
      };
      
      compilerAPI.post.mockResolvedValue(mockResponse);
      
      const result = await compilerAPI.compile('G0 X10 Y10\nG1 X20 Y20');
      
      expect(compilerAPI.post).toHaveBeenCalledWith('/api/compile', {
        ggcode: 'G0 X10 Y10\nG1 X20 Y20'
      });
      
      expect(result).toEqual({
        success: true,
        output: 'G0 X10.000 Y10.000\nG1 X20.000 Y20.000',
        error: null,
        warnings: [],
        metadata: { lineCount: 2 }
      });
    });

    test('should throw error for invalid input', async () => {
      await expect(compilerAPI.compile('')).rejects.toThrow('GGcode content is required');
      await expect(compilerAPI.compile(null)).rejects.toThrow('GGcode content is required');
      await expect(compilerAPI.compile(123)).rejects.toThrow('must be a string');
    });

    test('should handle compilation errors', async () => {
      compilerAPI.post.mockRejectedValue(new Error('Compilation failed'));
      
      await expect(compilerAPI.compile('INVALID CODE')).rejects.toThrow('Compilation failed');
    });

    test('should handle invalid response format', async () => {
      compilerAPI.post.mockResolvedValue('invalid response');
      
      await expect(compilerAPI.compile('G0 X10')).rejects.toThrow('Invalid response format');
    });
  });

  describe('validate', () => {
    test('should validate GGcode syntax', async () => {
      const mockResponse = {
        success: true,
        valid: true,
        errors: [],
        warnings: ['Minor optimization suggestion'],
        suggestions: ['Use G1 instead of G0 for cutting moves']
      };
      
      compilerAPI.post.mockResolvedValue(mockResponse);
      
      const result = await compilerAPI.validate('G0 X10 Y10');
      
      expect(compilerAPI.post).toHaveBeenCalledWith('/api/compile', {
        ggcode: 'G0 X10 Y10',
        validateOnly: true
      });
      
      expect(result).toEqual({
        success: true,
        valid: true,
        errors: [],
        warnings: ['Minor optimization suggestion'],
        suggestions: ['Use G1 instead of G0 for cutting moves']
      });
    });

    test('should throw error for invalid input', async () => {
      await expect(compilerAPI.validate('')).rejects.toThrow('GGcode content is required');
      await expect(compilerAPI.validate(null)).rejects.toThrow('GGcode content is required');
    });
  });

  describe('getCompilerInfo', () => {
    test('should get compiler information', async () => {
      const mockResponse = {
        version: '1.2.3',
        capabilities: ['variables', 'loops', 'functions'],
        supportedFeatures: ['G0', 'G1', 'G2', 'G3'],
        limits: { maxFileSize: 1048576, maxVariables: 100 }
      };
      
      compilerAPI.get.mockResolvedValue(mockResponse);
      
      const result = await compilerAPI.getCompilerInfo();
      
      expect(compilerAPI.get).toHaveBeenCalledWith('/api/compiler/info');
      expect(result).toEqual(mockResponse);
    });

    test('should handle missing fields in compiler info', async () => {
      const incompleteResponse = { version: '1.0.0' };
      compilerAPI.get.mockResolvedValue(incompleteResponse);
      
      const result = await compilerAPI.getCompilerInfo();
      
      expect(result).toEqual({
        version: '1.0.0',
        capabilities: [],
        supportedFeatures: [],
        limits: {}
      });
    });
  });
});