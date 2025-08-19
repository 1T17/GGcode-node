const express = require('express');

const router = express.Router();

/**
 * GET /api/examples - Get list of available example files
 */
router.get('/api/examples', async (req, res) => {
  try {
    const fileManagerService =
      req.services.fileManager || new (require('../services/fileManager'))();
    const examples = await fileManagerService.getExamples();
    res.json({ success: true, files: examples });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Failed to load examples',
    });
  }
});

/**
 * GET /api/examples/:filename - Get content of specific example file
 */
router.get('/api/examples/:filename', async (req, res) => {
  try {
    const fileManagerService =
      req.services.fileManager || new (require('../services/fileManager'))();
    const filename = req.params.filename;

    // Basic validation
    if (!filename || !filename.endsWith('.ggcode')) {
      return res.json({
        success: false,
        error: 'Invalid filename. Must be a .ggcode file',
      });
    }

    const content = await fileManagerService.getExampleContent(filename);
    res.json({ success: true, content });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Failed to load example content',
    });
  }
});

/**
 * GET /api/examples/categories - Get example categories (if implemented)
 */
router.get('/api/examples/categories', async (req, res) => {
  try {
    const fileManagerService =
      req.services.fileManager || new (require('../services/fileManager'))();
    const categories = await fileManagerService.getExampleCategories();
    res.json({ success: true, categories });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Failed to load categories',
    });
  }
});

module.exports = router;
