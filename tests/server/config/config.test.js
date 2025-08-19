const config = require('../../../src/server/config');

describe('Configuration Manager', () => {
  test('should load configuration successfully', () => {
    expect(config).toBeDefined();
    expect(typeof config.get).toBe('function');
  });

  test('should get server port configuration', () => {
    const port = config.get('server.port');
    expect(port).toBeDefined();
    expect(typeof port).toBe('number');
  });

  test('should get environment', () => {
    const env = config.getEnvironment();
    expect(env).toBeDefined();
    expect(typeof env).toBe('string');
  });

  test('should return default value for non-existent config', () => {
    const value = config.get('non.existent.config', 'default');
    expect(value).toBe('default');
  });

  test('should validate required configuration', () => {
    expect(() => config.validate()).not.toThrow();
  });
});