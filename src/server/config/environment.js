/**
 * Environment-specific configuration settings
 */

const path = require('path');

const environments = {
  development: {
    server: {
      port: process.env.PORT || 6990,
      host: process.env.HOST || 'localhost',
      staticPath: path.resolve(__dirname, '../../../public'),
    },
    compiler: {
      libPath: path.resolve(__dirname, '../../../libggcode.so'),
      timeout: 30000, // 30 seconds
    },
    logging: {
      level: 'debug',
      format: 'combined',
    },
    paths: {
      examples: path.resolve(__dirname, '../../../GGCODE'),
      helpContent: path.resolve(__dirname, '../../../public/data/help-content'),
      views: path.resolve(__dirname, '../../../views'),
    },
    ai: {
      endpoint: process.env.AI_ENDPOINT || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'deepseek-coder-v2:16b',
      timeout: 60000,
    },
  },

  production: {
    server: {
      port: process.env.PORT || 6990,
      host: process.env.HOST || '0.0.0.0',
      staticPath: path.resolve(__dirname, '../../../public'),
    },
    compiler: {
      libPath: path.resolve(__dirname, '../../../libggcode.so'),
      timeout: 15000, // 15 seconds in production
    },
    logging: {
      level: 'info',
      format: 'combined',
    },
    paths: {
      examples: path.resolve(__dirname, '../../../GGCODE'),
      helpContent: path.resolve(__dirname, '../../../public/data/help-content'),
      views: path.resolve(__dirname, '../../../views'),
    },
    ai: {
      endpoint: process.env.AI_ENDPOINT || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'deepseek-coder-v2:16b',
      timeout: 60000,
    },
  },

  test: {
    server: {
      port: process.env.TEST_PORT || 0, // Random port for testing
      host: 'localhost',
      staticPath: path.resolve(__dirname, '../../../public'),
    },
    compiler: {
      libPath: path.resolve(__dirname, '../../../libggcode.so'),
      timeout: 5000, // 5 seconds for tests
    },
    logging: {
      level: 'error',
      format: 'dev',
    },
    paths: {
      examples: path.resolve(__dirname, '../../../GGCODE'),
      helpContent: path.resolve(__dirname, '../../../public/data/help-content'),
      views: path.resolve(__dirname, '../../../views'),
    },
    ai: {
      endpoint: process.env.AI_ENDPOINT || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'deepseek-coder-v2:16b',
      timeout: 60000,
    },
  },
};

module.exports = environments;
