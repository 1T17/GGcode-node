/**
 * Test utilities and helpers for the GGcode Compiler test suite
 */

/**
 * Mock FFI library for testing compiler service
 */
const createMockFFI = () => ({
  Library: jest.fn(() => ({
    compile_ggcode: jest.fn(),
    validate_syntax: jest.fn(),
    free_result: jest.fn(),
  })),
});

/**
 * Mock file system operations for testing file manager
 */
const createMockFS = () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn(),
  access: jest.fn(),
});

/**
 * Mock HTTP client for testing API modules
 */
const createMockHttpClient = () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
});

/**
 * Create mock Express request object
 */
const createMockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  ...overrides,
});

/**
 * Create mock Express response object
 */
const createMockResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
    end: jest.fn(),
    setHeader: jest.fn(),
  };
  
  // Chain methods for fluent interface
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  res.send.mockReturnValue(res);
  
  return res;
};

/**
 * Create mock Express next function
 */
const createMockNext = () => jest.fn();

/**
 * Sample test data for various modules
 */
const testData = {
  ggcode: {
    simple: 'G0 X10 Y10\nG1 X20 Y20',
    withVariables: 'var speed = 1000\nG1 F{speed} X10 Y10',
    invalid: 'INVALID_COMMAND X10 Y10',
  },
  gcode: {
    simple: 'G0 X10.000 Y10.000\nG1 X20.000 Y20.000',
  },
  examples: [
    {
      name: 'simple_square.ggcode',
      description: 'A simple square pattern',
      content: 'G0 X0 Y0\nG1 X10 Y0\nG1 X10 Y10\nG1 X0 Y10\nG1 X0 Y0',
    },
    {
      name: 'spiral.ggcode', 
      description: 'A spiral pattern',
      content: 'for i in range(10):\n  G1 X{i} Y{i}',
    },
  ],
  helpContent: {
    en: {
      sections: {
        basics: {
          title: 'GGcode Basics',
          content: [
            { type: 'text', value: 'GGcode is a high-level language for CNC programming.' },
          ],
        },
      },
    },
  },
};

/**
 * Async test wrapper for handling promises in tests
 */
const asyncTest = (testFn) => {
  return async () => {
    try {
      await testFn();
    } catch (error) {
      throw error;
    }
  };
};

/**
 * Wait for a specified amount of time (useful for async tests)
 */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  createMockFFI,
  createMockFS,
  createMockHttpClient,
  createMockRequest,
  createMockResponse,
  createMockNext,
  testData,
  asyncTest,
  wait,
};