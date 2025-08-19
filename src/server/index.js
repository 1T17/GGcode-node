/**
 * Server entry point
 * Initializes and starts the application with proper error handling
 */

const Application = require('./app');

async function startServer() {
  const app = new Application();

  try {
    // Initialize the application
    await app.initialize();

    // Start the server
    await app.start();

    // Setup graceful shutdown handlers
    setupGracefulShutdown(app);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Setup graceful shutdown handlers
 * @param {Application} app - Application instance
 */
function setupGracefulShutdown(app) {
  const shutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

    try {
      await app.stop();
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  // Handle various shutdown signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    shutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
  });
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer };
