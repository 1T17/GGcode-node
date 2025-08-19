const rateLimit = require('express-rate-limit');

/**
 * Security middleware for input validation and sanitization
 * Provides protection against common web vulnerabilities
 */

/**
 * Input validation middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateInput(req, res, next) {
  // Validate content length
  const maxSize = 1024 * 1024; // 1MB
  if (
    req.get('content-length') &&
    parseInt(req.get('content-length')) > maxSize
  ) {
    const error = new Error('Request too large');
    error.status = 413;
    return next(error);
  }

  // Sanitize common XSS patterns in query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    }
  }

  next();
}

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Rate limiting middleware for API endpoints
 */
const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  },
});

/**
 * Rate limiting middleware for compilation endpoints (more restrictive)
 */
const compileRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 compilation requests per minute
  message: {
    success: false,
    error: 'Too many compilation requests, please wait before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Security headers middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function securityHeaders(req, res, next) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy (basic)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; " +
      "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
      "img-src 'self' data:; " +
      "font-src 'self' https://cdnjs.cloudflare.com;"
  );

  next();
}

/**
 * CORS middleware for API endpoints
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function corsHandler(req, res, next) {
  // Allow requests from same origin
  res.setHeader('Access-Control-Allow-Origin', req.get('origin') || '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
}

/**
 * Request logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // Log request
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`
  );

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}

module.exports = {
  validateInput,
  sanitizeString,
  apiRateLimit,
  compileRateLimit,
  securityHeaders,
  corsHandler,
  requestLogger,
};
