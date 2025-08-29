/**
 * AI Manager - Centralized AI chat functionality
 * Handles AI chat interactions, command processing, and UI management
 */

import storageManager from '../utils/storageManager.js';
import aiCommands from './aiCommands.js';

class AIManager {
  constructor() {
    this.currentMode = 'assistant';
    this.isAutoApprove = false;
    this.pendingCommandData = null;
    this.isStreaming = false;
    this.messageQueue = [];

    // Session and context management
    this.sessionId = this.generateSessionId();
    this.conversationHistory = [];
    this.userContext = {
      currentTask: null,
      lastCommand: null,
      codeContext: {
        lastAnalyzed: null,
        selectedText: null,
        cursorPosition: null,
        recentSearches: [],
      },
      preferences: {
        autoExecute: false,
        verboseMode: false,
        language: 'en',
      },
    };
    this.maxHistoryLength = 20; // Keep last 20 messages for context
  }

  /**
   * Generate a unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return (
      'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  /**
   * Add message to conversation history
   * @param {string} role - Message role (user/ai/system)
   * @param {string} content - Message content
   */
  addToConversationHistory(role, content) {
    const message = {
      role: role,
      content: content,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
    };

    this.conversationHistory.push(message);

    // Keep only the last maxHistoryLength messages
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(
        -this.maxHistoryLength
      );
    }

    console.log(
      `📝 Added ${role} message to conversation history (${this.conversationHistory.length} total)`
    );
  }

  /**
   * Get conversation context for AI requests
   * @param {number} maxMessages - Maximum number of recent messages to include
   * @returns {Array} Conversation history
   */
  getConversationContext(maxMessages = 10) {
    return this.conversationHistory.slice(-maxMessages);
  }

  /**
   * Update user context
   * @param {Object} contextUpdate - Context updates
   */
  updateUserContext(contextUpdate) {
    this.userContext = { ...this.userContext, ...contextUpdate };
    console.log('🔄 Updated user context:', this.userContext);
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory() {
    this.conversationHistory = [];
    this.sessionId = this.generateSessionId();
    console.log(
      '🗑️ Conversation history cleared, new session:',
      this.sessionId
    );
  }

  /**
   * Switch AI mode
   * @param {string} mode - New mode (assistant, editor, optimizer, teacher)
   */
  switchMode(mode) {
    this.currentMode = mode;
    storageManager.setAiMode(mode);

    this.updateModeSelector();
    console.log('AI Mode switched to:', mode);
  }

  /**
   * Toggle auto-approve setting
   */
  toggleAutoApprove() {
    const toggle = document.getElementById('autoApproveToggle');
    const status = document.getElementById('autoApproveStatus');

    if (!toggle || !status) return;

    this.isAutoApprove = toggle.checked;
    status.textContent = this.isAutoApprove ? 'ON' : 'OFF';
    status.style.color = this.isAutoApprove ? '#10a37f' : '#888';

    storageManager.setAiAutoApprove(this.isAutoApprove);
    console.log('Auto-approve toggled:', this.isAutoApprove);
  }

  /**
   * Handle chat input keydown events
   * @param {Event} event - Keydown event
   */
  handleChatKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Send AI message
   */
  async sendMessage() {
    const input = document.getElementById('aiChatInput');
    const messagesContainer = document.getElementById('aiChatMessages');

    if (!input || !messagesContainer || !input.value.trim()) return;

    const userMessage = input.value.trim();

    // Check if this is a confirmation of a pending command
    if (this.handleUserConfirmation(userMessage, messagesContainer)) {
      input.value = '';
      return;
    }

    // Add user message to chat
    this.addMessage('user', `<strong>You:</strong> ${userMessage}`);
    input.value = '';

    // Show typing indicator
    const typingIndicator = this.createTypingIndicator();
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      // Get context for AI
      const context = this.buildAIContext(userMessage);

      // Send to AI service
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: context,
          provider: 'local',
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Handle streaming response
      await this.handleStreamingResponse(
        response,
        messagesContainer,
        typingIndicator
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      this.removeTypingIndicator(typingIndicator);
      this.addMessage(
        'ai',
        `<strong>🤖 :</strong> <span style="color: #ff6b6b;">Sorry, I encountered an error: ${error.message}</span>`
      );
    }
  }

  /**
   * Build context for AI request
   * @param {string} userMessage - User's message
   * @returns {Object} Context object
   */
  buildAIContext(userMessage) {
    // This would integrate with the editor to get context
    // For now, return basic context
    return {
      currentGcode: '',
      selectedText: '',
      cursorPosition: null,
      userConfirmation: userMessage
        .toLowerCase()
        .match(/\b(do it|yes|confirm|proceed|execute|go ahead)\b/)
        ? true
        : false,
      pendingCommand: null,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle streaming AI response
   * @param {Response} response - Fetch response
   * @param {Element} messagesContainer - Messages container element
   * @param {Element} typingIndicator - Typing indicator element
   */
  async handleStreamingResponse(response, messagesContainer, typingIndicator) {
    if (!response.headers.get('Content-Type')?.includes('text/event-stream')) {
      // Handle non-streaming response
      this.handleNonStreamingResponse(
        response,
        messagesContainer,
        typingIndicator
      );
      return;
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let responseText = '';

    const aiResponseContainer = this.createAIMessageContainer();
    messagesContainer.removeChild(typingIndicator);
    messagesContainer.appendChild(aiResponseContainer);
    let aiResponseContent = aiResponseContainer.querySelector(
      '.ai-message-content'
    );
    aiResponseContent.innerHTML = '<strong>🤖 :</strong> ';

    try {
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                responseText += data.content;
                aiResponseContent.innerHTML = `<strong>🤖 :</strong> ${responseText}`;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                // Check for AI commands
                const commandMatch = responseText.match(
                  /\/ai:(\w+)\s*\[([^\]]+)\]/
                );
                if (commandMatch) {
                  const command = commandMatch[1];
                  const params = commandMatch[2];
                  this.showCommandActions(command, params);
                }
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', line, parseError);
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.startsWith('data: ')) {
        try {
          const data = JSON.parse(buffer.slice(6));
          if (data.content) {
            responseText += data.content;
            aiResponseContent.innerHTML = `<strong>🤖 :</strong> ${this.parseAICommands(responseText)}`;
          }
        } catch (parseError) {
          console.warn('Failed to parse final streaming data:', buffer);
        }
      }
    } catch (error) {
      console.error('Error reading streaming response:', error);
      aiResponseContent.innerHTML = `<strong>🤖 :</strong> <span style="color: #ff6b6b;">Sorry, I encountered an error: ${error.message}</span>`;
    }
  }

  /**
   * Handle non-streaming AI response
   * @param {Response} response - Fetch response
   * @param {Element} messagesContainer - Messages container element
   * @param {Element} typingIndicator - Typing indicator element
   */
  async handleNonStreamingResponse(
    response,
    messagesContainer,
    typingIndicator
  ) {
    try {
      const data = await response.json();
      messagesContainer.removeChild(typingIndicator);

      if (data.success) {
        const cleanResponse = this.parseAICommands(data.response);
        this.addMessage('ai', `<strong>🤖 :</strong> ${cleanResponse}`);
      } else {
        this.addMessage(
          'ai',
          `<strong>🤖 :</strong> <span style="color: #ff6b6b;">${data.error || 'Sorry, I encountered an error.'}</span>`
        );
      }
    } catch (error) {
      console.error('Error parsing non-streaming response:', error);
      messagesContainer.removeChild(typingIndicator);
      this.addMessage(
        'ai',
        `<strong>🤖 :</strong> <span style="color: #ff6b6b;">Sorry, I encountered an error: ${error.message}</span>`
      );
    }
  }

  /**
   * Parse and execute AI commands from response
   * @param {string} response - AI response text
   * @returns {string} Clean response with commands removed
   */
  parseAICommands(response) {
    console.log('🔍 Parsing AI commands from response:', response);

    // More comprehensive command regex patterns
    const commandPatterns = [
      /\/ai:(\w+)\s*\[([^\]]*)\]/g, // /ai:command[params]
      /\/ai:(\w+)\s*(\w*)/g, // /ai:command params
      /\/ai:(\w+)/g, // /ai:command
    ];

    let commands = [];
    let cleanResponse = response;

    // Try each pattern
    for (const pattern of commandPatterns) {
      let match;
      while ((match = pattern.exec(response)) !== null) {
        const command = match[1];
        const params = match[2] || match[3] || '';

        commands.push({
          command: command,
          params: params,
          original: match[0],
        });

        console.log('🎯 Found AI command:', {
          command,
          params,
          original: match[0],
        });
      }
    }

    console.log('📋 Total commands found:', commands.length);

    // Execute commands using the AI Commands module
    commands.forEach((cmd, index) => {
      console.log(
        `🔧 Executing command ${index + 1}:`,
        cmd.command,
        'with params:',
        cmd.params
      );

      // Handle commands that are implemented in aiCommands.js
      const implementedCommands = [
        'insertat',
        'insert',
        'replace',
        'replacerange',
        'analyze',
        'help',
        'capabilities',
        'status',
        'find',
        'getline',
        'getlines',
        'getcontent',
        'getselection',
        'getcursor',
      ];

      if (implementedCommands.includes(cmd.command)) {
        try {
          console.log('🚀 Executing AI command:', cmd.command);
          aiCommands.executePendingCommand(cmd.command, cmd.params);

          // Add success feedback
          this.addSystemMessage(
            `<strong>🤖 :</strong> ✅ Executed command: <code>${cmd.original}</code>`
          );
          console.log('✅ AI command executed successfully:', cmd.command);
        } catch (error) {
          console.error('❌ Error executing AI command:', cmd.command, error);
          this.addSystemMessage(
            `<strong>🤖 :</strong> <span style="color: #ff6b6b;">❌ Error executing command ${cmd.command}: ${error.message}</span>`
          );
        }
      } else {
        console.warn('⚠️ Unknown command:', cmd.command);
        this.addSystemMessage(
          `<strong>🤖 :</strong> <span style="color: #ffa500;">⚠️ Unknown command: ${cmd.command}</span>`
        );
      }

      // Remove the command from the response text
      cleanResponse = cleanResponse.replace(cmd.original, '').trim();
    });

    console.log('📝 Clean response after command removal:', cleanResponse);
    return cleanResponse;
  }

  /**
   * Add message to chat
   * @param {string} sender - Message sender (user/ai)
   * @param {string} content - Message content
   */
  addMessage(sender, content) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-${sender}`;
    messageDiv.innerHTML = `<div class="ai-message-content">${content}</div>`;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Add system message to chat
   * @param {string} message - System message to add
   */
  addSystemMessage(message) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message ai-system';
    messageDiv.innerHTML = `<div class="ai-message-content">${message}</div>`;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Create typing indicator element
   * @returns {Element} Typing indicator element
   */
  createTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'ai-message ai-typing';
    typingIndicator.innerHTML =
      '<div class="ai-message-content"><strong>🤖 :</strong> <em>Thinking...</em></div>';
    return typingIndicator;
  }

  /**
   * Create AI message container
   * @returns {Element} AI message container element
   */
  createAIMessageContainer() {
    const container = document.createElement('div');
    container.className = 'ai-message ai-ai';
    const content = document.createElement('div');
    content.className = 'ai-message-content';
    container.appendChild(content);
    return container;
  }

  /**
   * Remove typing indicator
   * @param {Element} typingIndicator - Typing indicator element
   */
  removeTypingIndicator(typingIndicator) {
    if (typingIndicator.parentNode) {
      typingIndicator.parentNode.removeChild(typingIndicator);
    }
  }

  /**
   * Show command actions UI
   * @param {string} command - AI command
   * @param {string} params - Command parameters
   */
  showCommandActions(command, params) {
    console.log('Showing command actions for:', command, params);

    this.pendingCommandData = { command, params };

    const actionsDiv = document.getElementById('aiCommandActions');
    const previewDiv = document.getElementById('commandPreview');
    const executeBtn = document.getElementById('executeAiCommandBtn');

    if (!actionsDiv || !previewDiv || !executeBtn) {
      console.error('Command actions UI elements not found');
      return;
    }

    // Set command preview
    let previewText = `/${command}`;
    if (params) {
      previewText += ` [${params}]`;
    }
    previewDiv.textContent = previewText;

    // Update button text based on command type
    const commandNames = {
      insertat: 'Insert at Position',
      insert: 'Insert at Cursor',
      replace: 'Replace Selection',
      analyze: 'Analyze Code',
    };

    executeBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 5.5L7.25 10.75 4.5 8l1.5-1.5 1.25 1.25L10 4l1.5 1.5z"/>
      </svg>
      ${commandNames[command] || 'Execute Command'}
    `;

    // Show the actions UI
    actionsDiv.style.display = 'block';
    actionsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Hide command actions UI
   */
  hideCommandActions() {
    const actionsDiv = document.getElementById('aiCommandActions');
    if (actionsDiv) {
      actionsDiv.style.display = 'none';
    }
    this.pendingCommandData = null;
    console.log('Command actions UI hidden');
  }

  /**
   * Execute pending command from UI
   */
  executePendingCommandFromUI() {
    if (!this.pendingCommandData) {
      console.error('No pending command data');
      return;
    }

    const { command, params } = this.pendingCommandData;
    console.log('Executing pending command from UI:', command, params);

    try {
      aiCommands.executePendingCommand(command, params);
      console.log('✅ AI command executed successfully from UI:', command);
      this.hideCommandActions();
    } catch (error) {
      console.error('❌ Error executing AI command from UI:', command, error);
      this.addSystemMessage(
        `<strong>System:</strong> Error executing command ${command}: ${error.message}`
      );
      this.hideCommandActions();
    }
  }

  /**
   * Handle user confirmation for pending commands
   * @param {string} userMessage - User's message
   * @param {Element} messagesContainer - Messages container
   * @returns {boolean} Whether a confirmation was handled
   */
  handleUserConfirmation(userMessage, messagesContainer) {
    const confirmationWords =
      /\b(do it|yes|confirm|proceed|execute|go ahead|please|sure|ok)\b/i;
    if (!confirmationWords.test(userMessage)) {
      return false;
    }

    const lastAiMessage = Array.from(
      messagesContainer.querySelectorAll('.ai-message.ai-ai')
    ).pop();
    if (!lastAiMessage) return false;

    const aiMessageText = lastAiMessage.textContent;
    console.log('Checking for pending commands in:', aiMessageText);

    const commandMatch = aiMessageText.match(/\/ai:(\w+)\s*\[([^\]]+)\]/);
    if (commandMatch) {
      const command = commandMatch[1];
      const params = commandMatch[2];
      console.log('Found pending command:', command, 'with params:', params);

      // Execute the confirmed command
      try {
        aiCommands.executePendingCommand(command, params);
        console.log('✅ Confirmed command executed successfully:', command);

        // Add success message
        this.addMessage(
          'ai',
          `<strong>🤖 :</strong> Command executed successfully! ${command} with parameters: ${params}`
        );
      } catch (error) {
        console.error('❌ Error executing confirmed command:', command, error);
        this.addMessage(
          'ai',
          `<strong>🤖 :</strong> <span style="color: #ff6b6b;">Error executing confirmed command: ${error.message}</span>`
        );
      }

      return true;
    }

    return false;
  }

  /**
   * Update mode selector UI
   */
  updateModeSelector() {
    const modeSelector = document.getElementById('aiMode');
    if (modeSelector) {
      modeSelector.value = this.currentMode;
    }
  }

  /**
   * Update auto-approve toggle UI
   */
  updateAutoApproveToggle() {
    const toggle = document.getElementById('autoApproveToggle');
    const status = document.getElementById('autoApproveStatus');

    if (toggle) toggle.checked = this.isAutoApprove;
    if (status) {
      status.textContent = this.isAutoApprove ? 'ON' : 'OFF';
      status.style.color = this.isAutoApprove ? '#10a37f' : '#888';
    }
  }

  /**
   * Show AI chat modal
   */
  showAiChat() {
    //console.log('================================================================showAiChat called');
    const modal = document.getElementById('aiChatModal');
    //console.log('Modal element:', modal);

    if (modal) {
      modal.style.display = 'block';
      //console.log('Modal opened');

      // Load settings when modal opens
      this.loadSettings();

      // Dropdown state is now managed by DropdownManager

      // Focus the input after a short delay
      setTimeout(() => {
        const input = document.getElementById('aiChatInput');
        console.log('Input element:', input);
        if (input) {
          input.focus();
          console.log('Input focused');
        }
      }, 100);
    } else {
      console.error('aiChatModal not found!');
    }
  }

  /**
   * Close AI chat modal
   */
  closeAiChat() {
    const modal = document.getElementById('aiChatModal');
    if (modal) {
      modal.style.display = 'none';
    }

    // Dropdown closing is now handled by the centralized dropdown system
  }

  /**
   * Send AI message (alias for sendMessage)
   */
  sendAiMessage() {
    return this.sendMessage();
  }

  /**
   * Handle AI chat keydown events (alias for handleChatKeydown)
   * @param {Event} event - Keydown event
   */
  handleAiChatKeydown(event) {
    return this.handleChatKeydown(event);
  }

  /**
   * Change AI mode
   * @param {string} mode - New mode to switch to
   */
  changeAiMode(mode) {
    this.switchMode(mode);
    this.showAiChat();
  }

  /**
   * Switch AI mode (alias for switchMode for global access)
   * @param {string} mode - New mode to switch to
   */
  switchAiMode(mode) {
    this.switchMode(mode);
    // Dropdown closing is now handled by the centralized dropdown system
  }

  /**
   * AI Quick Actions Handler
   * @param {string} action - Quick action type
   */
  aiQuickAction(action) {
    // Dropdown closing is now handled by the centralized dropdown system

    // Show the AI chat modal
    this.showAiChat();

    // Get the AI chat input element
    const aiInput = document.getElementById('aiChatInput');
    if (!aiInput) return;

    // Get current editor content and selection
    const editorContent = this.getCurrentEditorContent();
    const selectedText = this.getSelectedText();
    const cursorPos = this.getCursorPosition();

    // Set the appropriate prompt based on the action
    let prompt = '';
    switch (action) {
      case 'review':
        prompt =
          'Please review my G-code for best practices, potential issues, and optimization opportunities. Use the /ai:analyze command to examine the code.';
        break;
      case 'optimize':
        prompt =
          'Please optimize my G-code to improve efficiency, reduce machining time, and maintain accuracy. Use the /ai:analyze command first, then suggest optimizations with /ai:write if needed.';
        break;
      case 'explain':
        if (selectedText) {
          prompt = `Please explain the following G-code section:

${selectedText}

Use the /ai:getlines command to retrieve more context if needed.`;
        } else {
          prompt =
            'Please explain how my G-code works and what each section does. Use the /ai:getlines command to examine specific parts of the code.';
        }
        break;
      case 'analyze':
        prompt =
          'Please analyze my G-code and provide detailed statistics about its structure and complexity. Use the /ai:analyze command to perform the analysis.';
        break;
      case 'debug':
        prompt =
          'Please help me debug my G-code. Look for potential issues, syntax errors, or logical problems. Use the /ai:analyze command to examine the code thoroughly.';
        break;
      case 'convert':
        prompt =
          'Please help me convert or modify my G-code format. Use the /ai:analyze command first to understand the current format, then suggest conversions.';
        break;
      case 'simulate':
        prompt =
          'Please help me understand how this G-code will execute. Use the /ai:analyze command to examine the toolpath and movements.';
        break;
      default:
        prompt =
          'Please help me with my G-code. Feel free to use any of your available commands to interact with the code.';
    }

    // Add context to the prompt
    if (editorContent) {
      prompt += `

Current G-code content (first 500 characters):
${editorContent.substring(0, 500)}${editorContent.length > 500 ? '...' : ''}`;
    }

    if (cursorPos) {
      prompt += `

Cursor position: Line ${cursorPos.lineNumber}, Column ${cursorPos.column}`;
    }

    // Set the prompt in the AI chat input
    aiInput.value = prompt;

    // Focus the input
    aiInput.focus();

    // Send the message automatically after a short delay to allow the modal to fully open
    setTimeout(() => {
      this.sendMessage();
    }, 300);
  }

  /**
   * Get current editor content
   * @returns {string} Current editor content
   */
  getCurrentEditorContent() {
    if (window.editorManager) {
      return window.editorManager.getInputValue();
    }
    if (window.editor) {
      return window.editor.getValue();
    }
    return '';
  }

  /**
   * Get selected text from editor
   * @returns {string} Selected text
   */
  getSelectedText() {
    if (window.editor) {
      const selection = window.editor.getSelection();
      if (selection && !selection.isEmpty()) {
        return window.editor.getModel().getValueInRange(selection);
      }
    }
    return '';
  }

  /**
   * Get cursor position from editor
   * @returns {Object|null} Cursor position
   */
  getCursorPosition() {
    if (window.editor) {
      return window.editor.getPosition();
    }
    return null;
  }

  /**
   * Test function for AI commands
   */
  testAICommands() {
    console.log('=== TESTING AI COMMANDS EXECUTION ===');

    // Test 1: Basic command parsing
    console.log('\n1. Testing AI command parsing...');
    const testResponse = 'I will analyze your code now. /ai:analyze';
    console.log('Test response:', testResponse);
    const result = this.parseAICommands(testResponse);
    console.log('Parse result:', result);

    // Test 2: Multiple commands
    console.log('\n2. Testing multiple AI commands...');
    const multiCommandResponse =
      'Let me help you. /ai:analyze and then /ai:insert["Hello World"]';
    console.log('Multi-command response:', multiCommandResponse);
    const multiResult = this.parseAICommands(multiCommandResponse);
    console.log('Multi-command parse result:', multiResult);

    // Test 3: Direct command execution
    console.log('\n3. Testing direct command execution...');
    try {
      console.log('Executing /ai:analyze command directly...');
      aiCommands.executePendingCommand('analyze', '');
      console.log('✅ Direct command execution successful');
    } catch (error) {
      console.error('❌ Direct command execution failed:', error);
    }

    console.log('\n=== AI COMMANDS TEST COMPLETE ===');
  }

  /**
   * Test editor functionality
   */
  testEditor() {
    console.log('=== EDITOR DEBUG TEST ===');
    console.log('window.editor exists:', !!window.editor);
    console.log('window.editorManager exists:', !!window.editorManager);

    if (window.editor) {
      console.log(
        'Editor value (first 200 chars):',
        window.editor.getValue().substring(0, 200)
      );
      console.log('Editor position:', window.editor.getPosition());
      console.log('Editor model exists:', !!window.editor.getModel());

      // Test inserting text at cursor
      try {
        const pos = window.editor.getPosition();
        console.log('Testing insert at cursor position:', pos);

        const result = window.editor.executeEdits('test', [
          {
            range: {
              startLineNumber: pos.lineNumber,
              startColumn: pos.column,
              endLineNumber: pos.lineNumber,
              endColumn: pos.column,
            },
            text: '// EDITOR TEST - This should appear!',
          },
        ]);

        console.log('Test insert result:', result);
        console.log(
          'New editor content (first 200 chars):',
          window.editor.getValue().substring(0, 200)
        );
      } catch (error) {
        console.error('Test insert failed:', error);
      }
    } else {
      console.error('Editor not available for testing');
    }

    console.log('=== END EDITOR DEBUG TEST ===');
  }

  /**
   * Test function to verify AI agent integration
   */
  testAIIntegration() {
    console.log('Testing AI Agent Integration...');

    // Test getting GGcode content
    const content = this.getCurrentEditorContent();
    console.log('Current GGcode content:', content.substring(0, 100) + '...');

    // Test getting cursor position
    const cursorPos = this.getCursorPosition();
    console.log('Cursor position:', cursorPos);

    // Test getting selected text
    const selectedText = this.getSelectedText();
    console.log('Selected text:', selectedText);

    // Test analysis
    const analysis = this.analyzeCode ? this.analyzeCode() : {};
    console.log('GGcode analysis:', analysis);

    console.log('AI Agent integration test completed successfully.');
  }

  /**
   * Test AI command parsing and execution
   */
  testAICommandParsing() {
    console.log('=== TESTING AI COMMAND PARSING ===');

    const testCases = [
      'I will analyze your code now. /ai:analyze',
      'Let me help you with /ai:analyze[]',
      'Please use /ai:find["variable"] to search',
      'Try this command: /ai:getlines[1,10]',
      'Multiple commands: /ai:analyze and /ai:find["test"]',
      'No commands here, just regular text.',
      '/ai:unknowncommand should be unknown',
      '/ai:analyze["some param"] with parameters',
    ];

    testCases.forEach((testCase, index) => {
      console.log(`\n📝 Test Case ${index + 1}: "${testCase}"`);
      console.log('🔍 Parsing result:');
      const result = this.parseAICommands(testCase);
      console.log('📝 Clean result:', `"${result}"`);
    });

    console.log('\n=== AI COMMAND PARSING TEST COMPLETE ===');
  }

  /**
   * Direct test of command execution
   */
  testDirectCommandExecution() {
    console.log('=== TESTING DIRECT COMMAND EXECUTION ===');

    const testCommands = [
      { command: 'analyze', params: '' },
      { command: 'help', params: '' },
      { command: 'status', params: '' },
      { command: 'find', params: '"variable"' },
      { command: 'getlines', params: '1,5' },
    ];

    testCommands.forEach((cmd, index) => {
      console.log(
        `\n🔧 Test Command ${index + 1}: /ai:${cmd.command}[${cmd.params}]`
      );

      try {
        console.log('🚀 Executing command...');
        aiCommands.executePendingCommand(cmd.command, cmd.params);
        console.log('✅ Command executed successfully');

        // Add a small delay between commands
        if (index < testCommands.length - 1) {
          setTimeout(() => {}, 100);
        }
      } catch (error) {
        console.error('❌ Command execution failed:', error);
      }
    });

    console.log('\n=== DIRECT COMMAND EXECUTION TEST COMPLETE ===');
  }

  /**
   * Initialize the AI Manager
   * Called when the application starts
   */
  initialize() {
    //console.log('🤖 AI Manager initializing...');

    try {
      // Load saved settings
      this.loadSettings();

      // Setup event listeners
      this.setupEventListeners();

      //console.log('✅ AI Manager initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ AI Manager initialization failed:', error);
      return false;
    }
  }

  /**
   * Load saved settings from storage
   */
  loadSettings() {
    try {
      // Load AI mode
      const savedMode = storageManager.getAiMode();
      if (savedMode) {
        this.currentMode = savedMode;
      }

      // Load auto-approve setting
      const savedAutoApprove = storageManager.getAiAutoApprove();
      if (savedAutoApprove !== null) {
        this.isAutoApprove = savedAutoApprove;
      }

      // Update UI elements
      this.updateModeSelector();
      this.updateAutoApproveToggle();

      // Button state is now managed by DropdownManager

      // console.log('⚙️ AI settings loaded:', {
      //     mode: this.currentMode,
      //     autoApprove: this.isAutoApprove
      // });
    } catch (error) {
      console.warn('⚠️ Failed to load AI settings:', error);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // AI chat input keydown

    const aiChatInput = document.getElementById('aiChatInput');
    if (aiChatInput) {
      aiChatInput.addEventListener('keydown', (event) => {
        this.handleChatKeydown(event);
      });
    }

    // Auto-approve toggle
    const autoApproveToggle = document.getElementById('autoApproveToggle');
    if (autoApproveToggle) {
      autoApproveToggle.addEventListener('change', () => {
        this.toggleAutoApprove();
      });
    }

    // Execute AI command button
    const executeAiCommandBtn = document.getElementById('executeAiCommandBtn');
    if (executeAiCommandBtn) {
      executeAiCommandBtn.addEventListener('click', () => {
        this.executePendingCommandFromUI();
      });
    }

    //console.log('🎧 AI event listeners setup complete');
  }
}

// Create and export singleton instance
const aiManager = new AIManager();
export default aiManager;
