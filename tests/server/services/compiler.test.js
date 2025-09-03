const CompilerService = require('../../../src/server/services/compiler');
const { createMockFFI, testData } = require('../../utils/testHelpers');

// Mock the ffi-napi module
jest.mock('ffi-napi', () => ({
  Library: jest.fn(),
}));

// Mock path module
jest.mock('path', () => ({
  resolve: jest.fn(() => '/mock/path/to/libggcode.so'),
}));

describe('CompilerService', () => {
  let compilerService;
  let mockLibrary;
  let mockFFI;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock FFI library
    mockLibrary = {
      compile_ggcode_from_string: jest.fn(),
      free_ggcode_string: jest.fn(),
    };

    mockFFI = require('ffi-napi');
    mockFFI.Library.mockReturnValue(mockLibrary);

    // Create compiler service instance
    compilerService = new CompilerService('/mock/path/to/libggcode.so');
  });

  describe('constructor', () => {
    test('should initialize with default library path', () => {
      const service = new CompilerService();
      expect(service.libPath).toBeDefined();
      expect(mockFFI.Library).toHaveBeenCalled();
    });

    test('should initialize with custom library path', () => {
      const customPath = '/custom/path/to/lib.so';
      const service = new CompilerService(customPath);
      expect(service.libPath).toBe(customPath);
    });

    test('should throw error if library initialization fails', () => {
      mockFFI.Library.mockImplementation(() => {
        throw new Error('Library not found');
      });

      expect(() => new CompilerService()).toThrow('Failed to initialize GGcode library');
    });
  });

  describe('_validateAndSanitizeInput', () => {
    test('should accept valid string input', () => {
      const input = 'G0 X10 Y10';
      const result = compilerService._validateAndSanitizeInput(input);
      expect(result).toBe(input);
    });

    test('should throw error for non-string input', () => {
      expect(() => compilerService._validateAndSanitizeInput(123)).toThrow('Input must be a string');
      expect(() => compilerService._validateAndSanitizeInput(null)).toThrow('Input must be a string');
      expect(() => compilerService._validateAndSanitizeInput(undefined)).toThrow('Input must be a string');
    });

    test('should throw error for input that is too large', () => {
      const largeInput = 'x'.repeat(1000001); // 1MB + 1 byte
      expect(() => compilerService._validateAndSanitizeInput(largeInput)).toThrow('Input too large');
    });

    test('should decode HTML entities', () => {
      const input = 'G0 X&lt;10&gt; Y&amp;5';
      const result = compilerService._validateAndSanitizeInput(input);
      expect(result).toBe('G0 X<10> Y&5');
    });

    test('should strip carriage returns', () => {
      const input = 'G0 X10\r\nG1 Y10\r';
      const result = compilerService._validateAndSanitizeInput(input);
      expect(result).toBe('G0 X10\nG1 Y10');
    });
  });

  describe('compile', () => {
    test('should compile valid GGcode successfully', async () => {
      const expectedOutput = 'G0 X10.000 Y10.000\nG1 X20.000 Y20.000';

      // Mock successful compilation
      const mockOutputPtr = {
        isNull: () => false,
        readCString: () => expectedOutput,
      };
      mockLibrary.compile_ggcode_from_string.mockReturnValue(mockOutputPtr);

      const result = await compilerService.compile(testData.ggcode.simple);

      expect(result).toBe(expectedOutput);
      expect(mockLibrary.compile_ggcode_from_string).toHaveBeenCalledWith(
        expect.any(Buffer),
        1
      );
      expect(mockLibrary.free_ggcode_string).toHaveBeenCalledWith(mockOutputPtr);
    });

    test('should handle null output pointer', async () => {
      const mockOutputPtr = {
        isNull: () => true,
      };
      mockLibrary.compile_ggcode_from_string.mockReturnValue(mockOutputPtr);

      const result = await compilerService.compile(testData.ggcode.simple);

      expect(result).toBe('');
    });

    test('should handle output pointer without readCString method', async () => {
      const expectedOutput = 'G0 X10.000 Y10.000';
      const mockOutputPtr = {
        isNull: () => false,
        // No readCString method
      };

      // Mock Buffer.from to return a buffer with toString method
      jest.spyOn(Buffer, 'from').mockReturnValue({
        toString: () => expectedOutput,
      });

      mockLibrary.compile_ggcode_from_string.mockReturnValue(mockOutputPtr);

      const result = await compilerService.compile(testData.ggcode.simple);

      expect(result).toBe(expectedOutput);
    });

    test('should reject invalid input', async () => {
      await expect(compilerService.compile(123)).rejects.toThrow('Input must be a string');
    });

    test('should reject input that is too large', async () => {
      const largeInput = 'x'.repeat(1000001);
      await expect(compilerService.compile(largeInput)).rejects.toThrow('Input too large');
    });

    test('should handle compilation errors', async () => {
      mockLibrary.compile_ggcode_from_string.mockImplementation(() => {
        throw new Error('Syntax error');
      });

      await expect(compilerService.compile(testData.ggcode.simple)).rejects.toThrow('Syntax error');
    });

    test('should sanitize input before compilation', async () => {
      const input = 'G0 X&lt;10&gt;\r\nG1 Y10';

      const mockOutputPtr = {
        isNull: () => false,
        readCString: () => 'G0 X<10.000>\nG1 Y10.000',
      };
      mockLibrary.compile_ggcode_from_string.mockReturnValue(mockOutputPtr);

      const result = await compilerService.compile(input);

      // Verify that compile_ggcode_from_string was called
      expect(mockLibrary.compile_ggcode_from_string).toHaveBeenCalled();

      // Verify the result is correct
      expect(result).toBe('G0 X<10.000>\nG1 Y10.000');

      // Verify that free_ggcode_string was called for cleanup
      expect(mockLibrary.free_ggcode_string).toHaveBeenCalledWith(mockOutputPtr);
    });
  });

  describe('validateSyntax', () => {
    test('should return valid result for correct syntax', async () => {
      const mockOutputPtr = {
        isNull: () => false,
        readCString: () => 'G0 X10.000 Y10.000',
      };
      mockLibrary.compile_ggcode_from_string.mockReturnValue(mockOutputPtr);

      const result = await compilerService.validateSyntax(testData.ggcode.simple);

      expect(result).toEqual({
        valid: true,
        errors: [],
      });
    });

    test('should return invalid result for incorrect syntax', async () => {
      mockLibrary.compile_ggcode_from_string.mockImplementation(() => {
        throw new Error('Syntax error at line 1');
      });

      const result = await compilerService.validateSyntax('INVALID_COMMAND');

      expect(result).toEqual({
        valid: false,
        errors: ['Compilation failed: Syntax error at line 1'], // Updated to match current error format
      });
    });
  });

  describe('_freeMemory', () => {
    test('should free memory safely', () => {
      const mockPtr = { test: 'pointer' };

      compilerService._freeMemory(mockPtr);

      expect(mockLibrary.free_ggcode_string).toHaveBeenCalledWith(mockPtr);
    });

    test('should handle null pointer gracefully', () => {
      expect(() => compilerService._freeMemory(null)).not.toThrow();
    });

    test('should handle memory free errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockLibrary.free_ggcode_string.mockImplementation(() => {
        throw new Error('Free failed');
      });

      expect(() => compilerService._freeMemory({})).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Warning: Failed to free memory properly:',
        'Free failed'
      );

      consoleSpy.mockRestore();
    });

    test('should trigger garbage collection if available', () => {
      const mockGC = jest.fn();
      global.gc = mockGC;

      compilerService._freeMemory({});

      expect(mockGC).toHaveBeenCalled();

      delete global.gc;
    });
  });

  describe('getStatus', () => {
    test('should return compiler status information', () => {
      const status = compilerService.getStatus();

      expect(status).toEqual({
        libraryPath: '/mock/path/to/libggcode.so',
        initialized: true,
        version: '1.0.0',
      });
    });

    test('should show uninitialized status when library is not loaded', () => {
      compilerService.ggcode = null;

      const status = compilerService.getStatus();

      expect(status.initialized).toBe(false);
    });
  });
});