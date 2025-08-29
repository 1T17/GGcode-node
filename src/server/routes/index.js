// const express = require('express');
const compilerRoutes = require('./compiler');
const examplesRoutes = require('./examples');
const helpRoutes = require('./help');
const aiRoutes = require('./ai');

/**
 * Register all route modules with the Express app
 * @param {express.Application} app - Express application instance
 */
function registerRoutes(app) {
  // Main page route
  app.get('/', (req, res) => {
    res.render('index', { output: '', input: '' });
  });

  // Register route modules
  app.use('/', compilerRoutes);
  app.use('/', examplesRoutes);
  app.use('/', helpRoutes);
  app.use('/', aiRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    });
  });

  // 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'API endpoint not found',
    });
  });
}

module.exports = { registerRoutes };
