/**
 * Mock implementations for external dependencies
 */

/**
 * Mock FFI-NAPI library
 */
const mockFFI = {
  Library: jest.fn((libPath, functions) => {
    const mockLib = {};
    Object.keys(functions).forEach(funcName => {
      mockLib[funcName] = jest.fn();
    });
    return mockLib;
  }),
  types: {
    CString: 'string',
    int: 'int32',
    void: 'void',
  },
};

/**
 * Mock ref-napi library
 */
const mockRef = {
  alloc: jest.fn(),
  deref: jest.fn(),
  types: {
    CString: 'string',
    int: 'int32',
  },
};

/**
 * Mock fs/promises module
 */
const mockFsPromises = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn(),
  access: jest.fn(),
  mkdir: jest.fn(),
};

/**
 * Mock path module
 */
const mockPath = {
  join: jest.fn((...args) => args.join('/')),
  resolve: jest.fn((...args) => '/' + args.join('/')),
  dirname: jest.fn((path) => path.split('/').slice(0, -1).join('/')),
  basename: jest.fn((path) => path.split('/').pop()),
  extname: jest.fn((path) => {
    const parts = path.split('.');
    return parts.length > 1 ? '.' + parts.pop() : '';
  }),
};

/**
 * Mock Express application
 */
const createMockApp = () => ({
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  listen: jest.fn((port, callback) => {
    if (callback) callback();
    return { close: jest.fn() };
  }),
  set: jest.fn(),
});

/**
 * Mock Express router
 */
const createMockRouter = () => ({
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
});

module.exports = {
  mockFFI,
  mockRef,
  mockFsPromises,
  mockPath,
  createMockApp,
  createMockRouter,
};