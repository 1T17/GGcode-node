const express = require('express');

const router = express.Router();

/**
 * GET /api/help - Get help content for specified language
 */
router.get('/api/help', async (req, res) => {
  try {
    const helpContentService =
      req.services.helpContent || new (require('../services/helpContent'))();
    const language = req.query.lang || 'en'; // Default to English
    const helpData = await helpContentService.getHelpContent(language);

    res.json({
      success: true,
      data: helpData,
      language: language,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Failed to load help content',
    });
  }
});

/**
 * GET /api/help/languages - Get list of supported languages
 */
router.get('/api/help/languages', async (req, res) => {
  try {
    const helpContentService =
      req.services.helpContent || new (require('../services/helpContent'))();
    const languageData = await helpContentService.getSupportedLanguages();

    res.json({
      success: true,
      languages: languageData.languages,
      defaultLanguage: languageData.defaultLanguage,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Failed to load languages',
    });
  }
});

/**
 * GET /help - Render help page with specified language
 */
router.get('/help', async (req, res) => {
  try {
    const helpContentService =
      req.services.helpContent || new (require('../services/helpContent'))();
    const language = req.query.lang || 'en';
    const helpData = await helpContentService.getHelpContent(language);

    res.render('help-template', {
      sections: helpData.sections,
      language: language,
    });
  } catch (error) {
    res.status(500).send(`Failed to load help content: ${error.message}`);
  }
});

/**
 * GET /api/help/section/:sectionId - Get specific help section
 */
router.get('/api/help/section/:sectionId', async (req, res) => {
  try {
    const helpContentService =
      req.services.helpContent || new (require('../services/helpContent'))();
    const language = req.query.lang || 'en';
    const sectionId = req.params.sectionId;

    const section = await helpContentService.getHelpSection(
      language,
      sectionId
    );

    res.json({
      success: true,
      section: section,
      language: language,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Failed to load help section',
    });
  }
});

/**
 * GET /api/help/markdown-files - Get list of available markdown files
 */
router.get('/api/help/markdown-files', async (req, res) => {
  try {
    const helpContentService =
      req.services.helpContent || new (require('../services/helpContent'))();

    // Get list of markdown files from the help content directory
    const markdownFiles = await helpContentService.getMarkdownFiles();

    res.json({
      success: true,
      files: markdownFiles,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Failed to get markdown files',
    });
  }
});

/**
 * GET /api/help/markdown-content - Get content of a specific markdown file
 */
router.get('/api/help/markdown-content', async (req, res) => {
  try {
    const helpContentService =
      req.services.helpContent || new (require('../services/helpContent'))();
    const filePath = req.query.file;

    if (!filePath) {
      return res.json({
        success: false,
        error: 'File parameter is required',
      });
    }

    const content = await helpContentService.getMarkdownContent(filePath);

    res.json({
      success: true,
      content: content,
      file: filePath,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Failed to load markdown content',
    });
  }
});

module.exports = router;
