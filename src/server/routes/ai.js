const express = require('express');
const router = express.Router();
const fetch = require('node-fetch').default; // node-fetch v2 syntax

// In-memory conversation storage (in production, use a database)
const conversations = new Map();

/**
 * AI Chat API Route
 * Proxies requests to local AI service to avoid CORS issues
 */
router.post('/api/ai/chat', async (req, res) => {
  try {
    const {
      message,
      context,
      conversationHistory,
      provider,
      stream = false,
    } = req.body;

    // Generate session ID for conversation tracking
    const sessionId = req.ip + '-' + (new Date().getTime() % 86400000); // Simple session ID

    console.log('AI Chat Request:', {
      sessionId,
      message: message?.substring(0, 100) + '...',
      provider,
      hasContext: !!context,
      historyLength: conversationHistory?.length || 0,
      stream,
    });

    // Get or create conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    const userHistory = conversations.get(sessionId);

    // Add user message to history
    userHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      context: context,
    });

    // Keep only last 20 messages to avoid memory issues
    if (userHistory.length > 20) {
      userHistory.splice(0, userHistory.length - 20);
    }

    // If streaming is requested, use the streaming response
    if (stream) {
      try {
        // Set headers for streaming response
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        });

        // Stream response from Ollama
        await streamOllamaResponse(res, message, context, userHistory);

        // Add AI response to history (we'll reconstruct it from the stream)
        // For simplicity in this implementation, we'll skip adding streamed response to history
        // In a production implementation, you might want to capture the full response

        console.log('AI Stream Response completed:', {
          sessionId,
          historyLength: userHistory.length,
        });

        // End the response
        res.end();
        return;
      } catch (streamError) {
        console.warn(
          'Ollama streaming failed, using fallback responses:',
          streamError.message
        );
        // Fall through to regular response
      }
    }

    let aiResponse = '';

    // Try to get response from Ollama first
    try {
      aiResponse = await getOllamaResponse(message, context, userHistory);
    } catch (ollamaError) {
      console.warn(
        'Ollama not available, using fallback responses:',
        ollamaError.message
      );
      aiResponse = generateGcodeSpecificResponse(message, context);
    }

    // Add AI response to history
    userHistory.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    });

    console.log('AI Response generated:', {
      sessionId,
      responseLength: aiResponse.length,
      historyLength: userHistory.length,
    });

    // Return the AI response to the client
    res.json({
      success: true,
      response: aiResponse,
      metadata: {
        sessionId,
        provider: provider || 'local',
        timestamp: new Date().toISOString(),
        conversationLength: userHistory.length,
      },
    });
  } catch (error) {
    console.error('AI Service Error:', error);

    // Check if headers have already been sent
    if (res.headersSent) {
      console.warn('Headers already sent, cannot send error response');
      return;
    }

    res.status(500).json({
      success: false,
      error: 'AI service encountered an error. Please try again.',
      errorType: 'server_error',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString(),
    });
  }
});

// Get response from Ollama
async function getOllamaResponse(message, context, _history) {
  // Import config to get AI settings
  const config = require('../config');

  // Use the AI endpoint from config, which includes test environment settings
  const aiBaseEndpoint = config.get('ai.endpoint');
  const ollamaModel = config.get('ai.model');
  const aiTimeout = config.get('ai.timeout');

  // Construct the full endpoint URL for the generate API
  const aiEndpoint = `${aiBaseEndpoint}/api/generate`;

  // Create prompt for Ollama /api/generate endpoint - using shorter prompt for faster response
  const systemPrompt = `You are a CNC machining and G-code programming assistant that can directly edit GGcode files.

CAPABILITIES:
- Insert text at cursor: /ai:insert [text]
- Replace selected text: /ai:replace [new text]
- Insert at specific position: /ai:insertat [lineNumber,column,text]
- Analyze code: /ai:analyze
- Get lines: /ai:getlines [startLine-endLine]
- Replace range: /ai:replacerange [startLine,startColumn,endLine,endColumn,newText]
- Find text: /ai:find [text to search for]
- Get specific line: /ai:getline [lineNumber]
- Show help: /ai:help
- Show system status: /ai:status
- Show capabilities: /ai:capabilities

INSTRUCTIONS:
- Be direct and concise
- Use commands immediately when requested
- Don't explain unless asked
- For simple requests, just use the command
- User will be prompted to confirm changes

EXAMPLES:
User: "add //test at top"
Assistant: "Adding comment at top. /ai:insertat [1,1,"//test"]"

User: "analyze my code"
Assistant: "Analyzing code structure. /ai:analyze"

User: "insert G90 at cursor"
Assistant: "Adding G90 command. /ai:insert ["G90"]"

User: "find line with @number -50 50"
Assistant: "Searching for line with @number -50 50. /ai:find ["@number -50 50"]"

User: "show line 15"
Assistant: "Showing line 15. /ai:getline [15]"

Keep responses short and include commands immediately.`;

  const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

  const payload = {
    model: ollamaModel,
    prompt: fullPrompt,
    stream: false,
    options: {
      temperature: 0.7,
      top_p: 0.9,
      num_predict: 500,
    },
  };

  console.log(`Contacting Ollama at: ${aiEndpoint}`);
  console.log(
    `Config: AI_ENDPOINT=${aiBaseEndpoint}, OLLAMA_MODEL=${ollamaModel}`
  );
  console.log(`Request payload:`, JSON.stringify(payload, null, 2));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), aiTimeout);

  try {
    const response = await fetch(aiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama responded with ${response.status}`);
    }

    const data = await response.json();
    let aiResponse =
      data.response ||
      data.message?.content ||
      data.content ||
      data.text ||
      'No response from Ollama';

    // Check if response is too verbose or tutorial-like
    if (
      aiResponse.length > 500 &&
      aiResponse.includes('###') &&
      aiResponse.includes('**')
    ) {
      console.log('AI response too verbose, using fallback');
      return generateGcodeSpecificResponse(message, context);
    }

    return aiResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Stream response from Ollama
async function streamOllamaResponse(res, message, _context, _history) {
  // Import config to get AI settings
  const config = require('../config');

  // Use the AI endpoint from config
  const aiBaseEndpoint = config.get('ai.endpoint');
  const ollamaModel = config.get('ai.model');
  const aiTimeout = config.get('ai.timeout');

  // Construct the full endpoint URL for the generate API
  const aiEndpoint = `${aiBaseEndpoint}/api/generate`;

  // Create prompt for Ollama /api/generate endpoint
  const systemPrompt = `You are a CNC machining and G-code programming assistant that can directly edit GGcode files.

CAPABILITIES:
- Insert text at cursor: /ai:insert [text]
- Replace selected text: /ai:replace [new text]
- Insert at specific position: /ai:insertat [lineNumber,column,text]
- Analyze code: /ai:analyze
- Get lines: /ai:getlines [startLine-endLine]
- Replace range: /ai:replacerange [startLine,startColumn,endLine,endColumn,newText]
- Find text: /ai:find [text to search for]
- Get specific line: /ai:getline [lineNumber]
- Show help: /ai:help
- Show system status: /ai:status
- Show capabilities: /ai:capabilities

INSTRUCTIONS:
- Be direct and concise
- Use commands immediately when requested
- Don't explain unless asked
- For simple requests, just use the command
- User will be prompted to confirm changes

EXAMPLES:
User: "add //test at top"
Assistant: "Adding comment at top. /ai:insertat [1,1,"//test"]"

User: "analyze my code"
Assistant: "Analyzing code structure. /ai:analyze"

User: "insert G90 at cursor"
Assistant: "Adding G90 command. /ai:insert ["G90"]"

User: "find line with @number -50 50"
Assistant: "Searching for line with @number -50 50. /ai:find ["@number -50 50"]"

User: "show line 15"
Assistant: "Showing line 15. /ai:getline [15]"

Keep responses short and include commands immediately.`;

  const fullPrompt = `${systemPrompt}

User: ${message}

Assistant:`;

  const payload = {
    model: ollamaModel,
    prompt: fullPrompt,
    stream: true, // Enable streaming
    options: {
      temperature: 0.7,
      top_p: 0.9,
      num_predict: 500,
    },
  };

  console.log(`Streaming from Ollama at: ${aiEndpoint}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), aiTimeout);

  try {
    const response = await fetch(aiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama responded with ${response.status}`);
    }

    // Handle streaming response using node-fetch v2 approach
    // node-fetch v2 doesn't support getReader(), we need to handle the stream differently
    if (!response.body || typeof response.body.on !== 'function') {
      throw new Error('Response body is not a stream');
    }

    // Process the stream
    const decoder = new TextDecoder();

    return new Promise((resolve, reject) => {
      let done = false;

      response.body.on('data', (chunk) => {
        if (done) return;

        const text = decoder.decode(chunk, { stream: true });

        // Split the chunk into lines (Ollama sends NDJSON)
        const lines = text.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.trim() === '') continue;

          try {
            const data = JSON.parse(line);
            if (data.response) {
              // Send the response chunk to the client
              if (!res.destroyed && !done) {
                res.write(
                  `data: ${JSON.stringify({ content: data.response })}\n\n`
                );
              }
            }

            // Check if this is the final message
            if (data.done) {
              done = true;
              if (!res.destroyed) {
                res.end();
              }
              clearTimeout(timeoutId);
              resolve();
              return;
            }
          } catch (parseError) {
            // Skip lines that aren't valid JSON
            console.warn('Failed to parse stream chunk:', line);
          }
        }

        // Flush the response if possible
        if (typeof res.flush === 'function' && !res.destroyed && !done) {
          res.flush();
        }
      });

      response.body.on('end', () => {
        if (!done) {
          done = true;
          if (!res.destroyed) {
            res.end();
          }
          clearTimeout(timeoutId);
          resolve();
        }
      });

      response.body.on('error', (error) => {
        if (!done) {
          done = true;
          clearTimeout(timeoutId);
          reject(error);
        }
      });

      // Handle client disconnect
      res.on('close', () => {
        if (!done) {
          done = true;
          clearTimeout(timeoutId);
          resolve();
        }
      });
    });
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Generate G-code specific responses when Ollama is not available
function generateGcodeSpecificResponse(message, context) {
  const msg = message.toLowerCase();

  // Simple direct command matching for common requests
  if (
    msg.includes('add') &&
    msg.includes('top') &&
    (msg.includes('//') || msg.includes('comment'))
  ) {
    return 'Adding comment to top of file. /ai:insertat [1,1,"//test"]';
  }

  if (msg.includes('insert') && msg.includes('cursor')) {
    const textMatch = message.match(/insert\s+(.+?)\s+at\s+cursor/i);
    if (textMatch) {
      return `Inserting "${textMatch[1]}" at cursor. /ai:insert ["${textMatch[1]}"]`;
    }
  }

  if (msg.includes('analyze') || msg.includes('analysis')) {
    return 'Analyzing G-code structure and optimization opportunities. /ai:analyze';
  }

  // G-code specific responses
  if (msg.includes('optimize') || msg.includes('/optimize')) {
    return `I can help optimize your G-code! Based on your current file:

**Optimization Suggestions:**
• **Feed Rate Analysis**: ${analyzeFeedRates(context?.currentGcode)}
• **Rapid Moves**: ${analyzeRapidMoves(context?.currentGcode)}
• **Tool Path Efficiency**: ${analyzeToolPath(context?.currentGcode)}

**Performance Data:**
• File rendered in: ${context?.performanceData?.fileRenderTime || 'N/A'}ms
• Lines processed: ${context?.gcodeStats?.lines || 'N/A'}

Would you like me to focus on a specific optimization area?`;
  }

  if (
    msg.includes('g0') ||
    msg.includes('g1') ||
    msg.includes('g2') ||
    msg.includes('g3')
  ) {
    return `**G-code Command Reference:**

• **G0** - Rapid positioning (max speed, no cutting)
• **G1** - Linear interpolation (cutting movement)
• **G2** - Clockwise circular interpolation
• **G3** - Counter-clockwise circular interpolation

**Your G-code Analysis:**
• G0 commands: ${context?.gcodeStats?.G0 || 0}
• G1 commands: ${context?.gcodeStats?.G1 || 0}
• G2 commands: ${context?.gcodeStats?.G2 || 0}
• G3 commands: ${context?.gcodeStats?.G3 || 0}

**Recommendations:**
- Use G0 for non-cutting moves to maximize speed
- Optimize G1 feed rates based on material and tool
- Consider G2/G3 for curved cuts instead of short line segments`;
  }

  if (msg.includes('feed') || msg.includes('speed')) {
    return `**Feed Rate & Speed Optimization:**

**General Guidelines by Material:**
• **Aluminum**: 800-3000 mm/min
• **Steel**: 300-800 mm/min
• **Plastic**: 200-1000 mm/min
• **Wood**: 1000-3000 mm/min

**Current Performance:**
• Render time: ${context?.performanceData?.fileRenderTime || 'N/A'}ms
• FPS: ${context?.performanceData?.averageFPS || 'N/A'}

**Optimization Tips:**
1. Start with conservative speeds and increase gradually
2. Use coolant for higher speeds
3. Monitor tool wear and temperature
4. Consider tool diameter and material hardness`;
  }

  // Default response
  return `I'm here to help with your G-code! I can assist with:

• **G-code Optimization** - Improve performance and efficiency
• **Command Explanations** - Understand what G0, G1, G2, G3 do
• **Feed Rate Tuning** - Optimize speeds for your material
• **Troubleshooting** - Debug CNC machining issues
• **Best Practices** - Follow industry standards

**Your Current File:**
• Lines: ${context?.gcodeStats?.lines || 'N/A'}
• Segments: ${context?.gcodeStats?.segments || 'N/A'}
• Render time: ${context?.performanceData?.fileRenderTime || 'N/A'}ms

What would you like to work on? You can also use commands like /optimize, /help, or /explain.`;
}

// Helper functions for G-code analysis
function analyzeFeedRates(gcode) {
  if (!gcode) return 'No G-code available for analysis';

  const feedMatches = gcode.match(/F[\d.]+/g) || [];
  const uniqueFeeds = [...new Set(feedMatches.map((f) => f.substring(1)))];

  if (uniqueFeeds.length === 0) return 'No feed rates found';

  return `${uniqueFeeds.length} unique feed rates detected: ${uniqueFeeds.slice(0, 5).join(', ')}${uniqueFeeds.length > 5 ? '...' : ''}`;
}

function analyzeRapidMoves(gcode) {
  if (!gcode) return 'No G-code available for analysis';

  const g0Matches = (gcode.match(/\bG0\b/g) || []).length;
  const totalMoves = (gcode.match(/\bG[0-3]\b/g) || []).length;

  const rapidPercentage =
    totalMoves > 0 ? ((g0Matches / totalMoves) * 100).toFixed(1) : 0;

  return `${g0Matches} rapid moves (${rapidPercentage}% of total movements)`;
}

function analyzeToolPath(gcode) {
  if (!gcode) return 'No G-code available for analysis';

  const lines = gcode.split('\n');
  const shortMoves = lines.filter((line) => {
    const coords = line.match(/[XYZ][\d.-]+/g) || [];
    return (
      coords.length > 0 &&
      coords.every((coord) => {
        const value = Math.abs(parseFloat(coord.substring(1)));
        return value < 1.0; // Consider moves under 1mm as short
      })
    );
  }).length;

  if (shortMoves > 10) {
    return `${shortMoves} short moves detected - consider optimizing with G2/G3 arcs`;
  }

  return 'Tool path appears well optimized';
}

/**
 * AI Configuration endpoint
 */
router.get('/api/ai/config', (req, res) => {
  res.json({
    success: true,
    config: {
      endpoint: process.env.AI_ENDPOINT || 'http://localhost:3001/api/generate',
      timeout: parseInt(process.env.AI_TIMEOUT) || 60000,
      supportedProviders: ['local', 'openai', 'anthropic'],
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * AI Health check endpoint
 */
router.get('/api/ai/health', async (req, res) => {
  try {
    // Use the base endpoint from AI_ENDPOINT, or default to localhost:11434
    const aiBaseEndpoint = process.env.AI_ENDPOINT || 'http://localhost:11434';
    // Construct the full endpoint URL for the generate API
    const aiEndpoint = `${aiBaseEndpoint}/api/generate`;

    // Quick test to see if Ollama service is reachable by checking if it responds to the tags endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check

    // Check if Ollama is running by accessing the tags endpoint
    const healthCheckEndpoint = `${aiBaseEndpoint}/api/tags`;
    const response = await fetch(healthCheckEndpoint, {
      method: 'GET',
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    res.json({
      success: true,
      aiService: {
        configured: true,
        endpoint: aiEndpoint,
        reachable: !!response?.ok,
        status: response?.ok ? 'healthy' : 'unreachable',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.json({
      success: true,
      aiService: {
        configured: true,
        endpoint: `${process.env.AI_ENDPOINT || 'http://localhost:11434'}/api/generate`,
        reachable: false,
        status: 'error',
        error: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
