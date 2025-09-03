const express = require('express');

const router = express.Router();

/**
 * POST /compile - Compile GGcode and render result page
 */
router.post('/compile', async (req, res) => {
  try {
    const compilerService = req.services.compiler;
    const rawInput = req.body.ggcode || '';

    const output = await compilerService.compile(rawInput);
    res.render('index', { output, input: rawInput });
  } catch (error) {
    res.render('index', {
      output: `Error: ${error.message}`,
      input: req.body.ggcode || '',
    });
  }
});

/**
 * POST /api/compile - AJAX API endpoint for compilation
 */
router.post('/api/compile', async (req, res) => {
  try {
    const compilerService = req.services.compiler;

    let code = '';
    if (req.is('application/json')) {
      code = req.body.ggcode || '';
    } else {
      code = req.body.ggcode || '';
    }

    console.log('=== API ROUTE DEBUG ===');
    console.log(
      'Received code for compilation:',
      code.substring(0, 100) + '...'
    );

    const output = await compilerService.compile(code);
    res.json({ success: true, output });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Compilation error',
    });
  }
});

/**
 * POST /api/validate - Validate GGcode syntax
 */
router.post('/api/validate', async (req, res) => {
  try {
    const compilerService = req.services.compiler;
    const code = req.body.ggcode || '';

    const result = await compilerService.validateSyntax(code);
    res.json({ success: true, validation: result });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Validation error',
    });
  }
});

/**
 * GET /api/compiler/status - Get compiler status
 */
router.get('/api/compiler/status', (req, res) => {
  try {
    const compilerService = req.services.compiler;
    const status = compilerService.getStatus();
    res.json({ success: true, status });
  } catch (error) {
    res.json({
      success: false,
      error: error.message || 'Failed to get compiler status',
    });
  }
});

module.exports = router;
