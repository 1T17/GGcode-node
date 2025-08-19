/**
 * Configuration management system
 * Provides centralized access to all application configuration
 */

const environments = require('./environment');

class ConfigManager {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.config = environments[this.env] || environments.development;

    // Validate required configuration
    this.validate();
  }

  /**
   * Get configuration value by dot notation path
   * @param {string} path - Configuration path (e.g., 'server.port')
   * @param {*} defaultValue - Default value if path not found
   * @returns {*} Configuration value
   */
  get(path, defaultValue = undefined) {
    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  /**
   * Get the current environment
   * @returns {string} Current environment name
   */
  getEnvironment() {
    return this.env;
  }

  /**
   * Check if running in development mode
   * @returns {boolean} True if in development
   */
  isDevelopment() {
    return this.env === 'development';
  }

  /**
   * Check if running in production mode
   * @returns {boolean} True if in production
   */
  isProduction() {
    return this.env === 'production';
  }

  /**
   * Check if running in test mode
   * @returns {boolean} True if in test
   */
  isTest() {
    return this.env === 'test';
  }

  /**
   * Get all configuration for current environment
   * @returns {object} Complete configuration object
   */
  getAll() {
    return { ...this.config };
  }

  /**
   * Validate required configuration values
   * @throws {Error} If required configuration is missing
   */
  validate() {
    const required = [
      'server.port',
      'server.host',
      'compiler.libPath',
      'paths.examples',
      'paths.helpContent',
      'paths.views',
    ];

    for (const path of required) {
      const value = this.get(path);
      if (value === undefined || value === null) {
        throw new Error(`Required configuration missing: ${path}`);
      }
    }
  }
}

// Export singleton instance
module.exports = new ConfigManager();
