/**
 * Error handling middleware for the GGcode application
 * Provides centralized error handling with proper logging and user-friendly responses
 */

/**
 * Development error handler - includes stack traces
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function developmentErrorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;

  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // API requests get JSON response
  if (req.path.startsWith('/api/')) {
    return res.status(status).json({
      success: false,
      error: err.message,
      stack: err.stack, // Include stack in development
      timestamp: new Date().toISOString(),
    });
  }

  // Regular requests get error page
  res.status(status).render('error', {
    message: err.message,
    error: err, // Include full error in development
    status: status,
  });
}

/**
 * Production error handler - sanitized responses
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function productionErrorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;

  // Log error details (but don't expose to client)
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // Sanitize error message for production
  let message = 'Internal Server Error';
  if (status < 500) {
    message = err.message; // Client errors can show original message
  }

  // API requests get JSON response
  if (req.path.startsWith('/api/')) {
    return res.status(status).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    });
  }

  // Regular requests get error page
  res.status(status).render('error', {
    message: message,
    error: {}, // Don't expose error details in production
    status: status,
  });
}

/**
 * 404 Not Found handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function notFoundHandler(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

/**
 * Async error wrapper - catches async errors and passes to error handler
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
function asyncErrorHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Get appropriate error handler based on environment
 * @param {string} env - Environment (development, production, etc.)
 * @returns {Function} - Error handler function
 */
function getErrorHandler(env = 'development') {
  return env === 'production'
    ? productionErrorHandler
    : developmentErrorHandler;
}

module.exports = {
  developmentErrorHandler,
  productionErrorHandler,
  notFoundHandler,
  asyncErrorHandler,
  getErrorHandler,
};
