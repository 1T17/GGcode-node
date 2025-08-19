/**
 * Main application entry point
 * Sets up Express server with modular architecture and proper dependency injection
 */

const express = require('express');
const config = require('./config');
// const { configureMiddleware, configureErrorHandling } = require('./middleware');
const { registerRoutes } = require('./routes');
const CompilerService = require('./services/compiler');

class Application {
  constructor() {
    this.app = express();
    this.server = null;
    this.isShuttingDown = false;
    this.services = {};
  }

  /**
   * Initialize the application with proper dependency injection
   */
  async initialize() {
    try {
      console.log('Initializing application...');

      // Initialize services first
      await this.initializeServices();

      // Setup middleware with configuration
      this.setupMiddleware();

      // Setup routes with service dependencies
      this.setupRoutes();

      // Setup error handling (must be last)
      this.setupErrorHandling();

      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw error;
    }
  }

  /**
   * Initialize all application services
   */
  async initializeServices() {
    try {
      // Initialize compiler service
      const compilerLibPath = config.get('compiler.libPath');
      this.services.compiler = new CompilerService(compilerLibPath);

      // Initialize file manager service
      const FileManagerService = require('./services/fileManager');
      this.services.fileManager = new FileManagerService();

      // Initialize help content service
      const HelpContentService = require('./services/helpContent');
      const helpContentPath = config.get('paths.helpContent');
      this.services.helpContent = new HelpContentService(helpContentPath);

      console.log('Services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize services:', error);
      throw error;
    }
  }

  /**
   * Setup Express middleware using modular middleware configuration
   */
  setupMiddleware() {
    // Basic middleware setup for now
    const express = require('express');
    const bodyParser = require('body-parser');

    // Body parsing middleware
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.json());

    // Static file serving
    this.app.use(express.static(config.get('server.staticPath')));

    // Serve src directory for modular client files
    const path = require('path');
    const srcPath = path.resolve(__dirname, '..');
    this.app.use('/src', express.static(srcPath));

    // View engine setup
    this.app.set('view engine', 'ejs');
    this.app.set('views', config.get('paths.views'));

    // Request logging in development
    if (config.isDevelopment()) {
      this.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
      });
    }
  }

  /**
   * Setup application routes with service injection
   */
  setupRoutes() {
    // Inject services into request context for routes to use
    this.app.use((req, res, next) => {
      req.services = this.services;
      next();
    });

    registerRoutes(this.app);
  }

  /**
   * Setup error handling middleware using modular error handlers
   */
  setupErrorHandling() {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`,
      });
    });

    // General error handler
    this.app.use((err, req, res, _next) => {
      console.error('Unhandled error:', err);

      const status = err.status || 500;
      const message = config.isDevelopment()
        ? err.message
        : 'Internal Server Error';

      res.status(status).json({
        error: 'Server Error',
        message: message,
      });
    });
  }

  /**
   * Start the server
   */
  async start() {
    return new Promise((resolve, reject) => {
      const port = config.get('server.port');
      const host = config.get('server.host');

      this.server = this.app.listen(port, host, (err) => {
        if (err) {
          reject(err);
          return;
        }

        console.log(`
 _____ _____           _                  _        __ _____ 
|   __|   __|___ ___ _| |___    ___ ___ _| |___ __|  |   __|
|  |  |  |  |  _| . | . | -_|  |   | . | . | -_|  |  |__   |
|_____|_____|___|___|___|___|  |_|_|___|___|___|_____|_____|                                                                                                  
        `);
        console.log(`Server running at http://${host}:${port}`);
        console.log(`Environment: ${config.getEnvironment()}`);

        resolve();
      });
    });
  }

  /**
   * Stop the server gracefully
   */
  async stop() {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    console.log('Shutting down server...');

    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Get the Express app instance
   */
  getApp() {
    return this.app;
  }
}

module.exports = Application;
