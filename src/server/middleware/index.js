const express = require('express');
const bodyParser = require('body-parser');
const {
  validateInput,
  apiRateLimit,
  compileRateLimit,
  securityHeaders,
  corsHandler,
  requestLogger,
} = require('./security');
const {
  getErrorHandler,
  notFoundHandler,
  asyncErrorHandler,
} = require('./errorHandler');

/**
 * Configure and register all middleware with the Express app
 * @param {express.Application} app - Express application instance
 * @param {Object} config - Configuration object
 */
function configureMiddleware(app, config = {}) {
  const env = config.environment || process.env.NODE_ENV || 'development';

  // Request logging (in development)
  if (env === 'development') {
    app.use(requestLogger);
  }

  // Security headers
  app.use(securityHeaders);

  // CORS handling for API routes
  app.use('/api', corsHandler);

  // Body parsing middleware
  app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
  app.use(express.json({ limit: '1mb' }));

  // Input validation and sanitization
  app.use(validateInput);

  // Rate limiting
  app.use('/api', apiRateLimit);
  app.use('/api/compile', compileRateLimit);
  app.use('/compile', compileRateLimit);

  // Static file serving
  app.use(
    express.static('public', {
      maxAge: env === 'production' ? '1d' : 0, // Cache static files in production
      etag: true,
    })
  );

  // View engine setup
  app.set('view engine', 'ejs');
  app.set('views', config.viewsPath || 'views');

  // Trust proxy if behind reverse proxy (for rate limiting)
  if (config.trustProxy) {
    app.set('trust proxy', config.trustProxy);
  }
}

/**
 * Configure error handling middleware (should be called after routes)
 * @param {express.Application} app - Express application instance
 * @param {Object} config - Configuration object
 */
function configureErrorHandling(app, config = {}) {
  const env = config.environment || process.env.NODE_ENV || 'development';

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(getErrorHandler(env));
}

/**
 * Wrap async route handlers to catch errors
 * @param {Function} fn - Async route handler function
 * @returns {Function} - Wrapped function
 */
function wrapAsync(fn) {
  return asyncErrorHandler(fn);
}

module.exports = {
  configureMiddleware,
  configureErrorHandling,
  wrapAsync,
  // Export individual middleware for selective use
  security: require('./security'),
  errorHandler: require('./errorHandler'),
};
