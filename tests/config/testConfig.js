/**
 * Test configuration for different test environments
 */

const testConfig = {
  // Test server configuration
  server: {
    port: 0, // Use random port for tests
    host: 'localhost',
    timeout: 5000,
  },
  
  // Test compiler configuration
  compiler: {
    libPath: '/mock/path/to/libggcode.so',
    timeout: 3000,
    maxInputSize: 1024 * 1024, // 1MB
  },
  
  // Test file paths
  paths: {
    examples: './tests/fixtures/examples',
    help: './tests/fixtures/help',
    temp: './tests/temp',
  },
  
  // Test database configuration (if needed)
  database: {
    url: ':memory:', // In-memory database for tests
  },
  
  // Test logging configuration
  logging: {
    level: 'error',
    silent: true,
  },
};

module.exports = testConfig;