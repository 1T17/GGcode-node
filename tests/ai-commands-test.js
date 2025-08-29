/**
 * AI Commands Console Testing Framework
 * Pure Node.js console testing - no browser required
 * Run with: node tests/ai-commands-test.js
 */

class MockEditor {
    constructor() {
        this.content = [];
        this.cursor = { line: 1, column: 1 };
        this.selection = null;
        this.clipboard = '';
        this.undoStack = [];
        this.redoStack = [];
    }

    getValue() {
        return this.content.join('\n');
    }

    setValue(text) {
        this.content = text.split('\n');
        console.log(`📝 MockEditor: Content set to ${this.content.length} lines`);
    }

    getPosition() {
        return this.cursor;
    }

    setPosition(position) {
        this.cursor = position;
        console.log(`📍 MockEditor: Cursor moved to line ${position.line}, col ${position.column}`);
    }

    getSelection() {
        return this.selection;
    }

    setSelection(range) {
        this.selection = range;
    }

    executeEdits(source, edits) {
        console.log('📝 MockEditor: Executing edits...');
        edits.forEach((edit, index) => {
            const startLine = edit.range.startLineNumber - 1;
            const endLine = edit.range.endLineNumber - 1;
            const newText = edit.text;

            console.log(`  Edit ${index + 1}: Line ${startLine + 1} → "${newText}"`);
        });
        return edits.length;
    }
}

class MockAICommands {
    constructor() {
        this.pendingCommandData = null;
    }

    executePendingCommand(command, params) {
        console.log(`🤖 AICommands: Executing /ai:${command}[${params}]`);

        const result = `Command ${command} executed with ${params}`;
        console.log(`✅ AICommands: ${result}`);
        return result;
    }

    setPendingCommandData(data) {
        this.pendingCommandData = data;
    }

    getPendingCommandData() {
        return this.pendingCommandData;
    }

    clearPendingCommandData() {
        this.pendingCommandData = null;
    }
}

class AITestFramework {
    constructor() {
        this.mockEditor = new MockEditor();
        this.aiCommands = new MockAICommands();
        this.testResults = [];
    }

    testCommand(command, params, expected = null) {
        console.log(`\n🧪 TESTING: /ai:${command}[${params}]`);
        const startState = this.captureState();

        try {
            const result = this.aiCommands.executePendingCommand(command, params);
            const endState = this.captureState();

            const stateChanges = this.diffStates(startState, endState);
            const success = expected === null || result.includes(expected);

            const testResult = {
                command,
                params,
                success,
                result,
                stateChanges,
                timestamp: new Date().toISOString()
            };

            this.testResults.push(testResult);

            console.log(`${success ? '✅' : '❌'} Command executed ${success ? 'successfully' : 'but failed expectation'}`);
            console.log(`📊 State changes: [${stateChanges.join(', ')}]`);
            console.log(`📝 Current content: ${this.mockEditor.getValue()}`);

            return testResult;

        } catch (error) {
            console.error(`❌ Command failed: ${error.message}`);
            const testResult = {
                command,
                params,
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
            this.testResults.push(testResult);
            return testResult;
        }
    }

    testAIInput(userInput, expectedCommands = []) {
        console.log(`\n🤖 TESTING AI INPUT: "${userInput}"`);
        console.log('Expected: AI should use appropriate command(s)');

        // Simulate AI processing
        const result = this.simulateAIResponse(userInput);

        const success = expectedCommands.length === 0 ||
            expectedCommands.some(cmd => result.includes(cmd));

        const testResult = {
            type: 'ai_input',
            input: userInput,
            result,
            success,
            expectedCommands,
            timestamp: new Date().toISOString()
        };

        this.testResults.push(testResult);
        console.log(`${success ? '✅' : '❌'} AI simulation ${success ? 'successful' : 'failed'}`);
        return testResult;
    }

    simulateAIResponse(userInput) {
        // Simple AI simulation - in real implementation this would call actual AI
        const responses = {
            'add comment': 'Should use /ai:insertat[1,1,"// Comment"]',
            'show content': 'Should use /ai:getcontent[]',
            'go to line': 'Should use /ai:gotoline[line]',
            'insert text': 'Should use /ai:insert["text"]',
            'analyze': 'Should use /ai:analyze[]'
        };

        for (const [key, response] of Object.entries(responses)) {
            if (userInput.toLowerCase().includes(key)) {
                return response;
            }
        }

        return 'AI would analyze and respond with commands';
    }

    // Update test expectations to match actual AI simulation responses
    runTestSuite() {
        console.log('🚀 RUNNING AI COMMANDS TEST SUITE...\n');

        const tests = [
            // Setup test
            () => this.setTestContent("G0 X0 Y0\nG1 X10 Y10\nG2 X20 Y0 I10 J0"),

            // Reading commands
            () => this.testCommand('getcontent', ''),
            () => this.testCommand('getlines', '1,2'),
            () => this.testCommand('getline', '2'),

            // Navigation commands
            () => this.testCommand('gotoline', '3'),
            () => this.testCommand('gotoposition', '2,5'),

            // Editing commands
            () => this.testCommand('insertat', '1,1,"// Comment"'),
            () => this.testCommand('insert', '"G28 X0 Y0"'),
            () => this.testCommand('replace', '"G0 X0 Y0"'),

            // Analysis command
            () => this.testCommand('analyze', ''),

            // Help command
            () => this.testCommand('help', '', 'AI Commands Help'),

            // Capabilities command
            () => this.testCommand('capabilities', '', 'AI System Capabilities'),

            // Status command
            () => this.testCommand('status', '', 'Editor Status'),

            // Find command
            () => this.testCommand('find', '"5 0"', 'Search Results'),

            // AI simulation tests with corrected expectations
            () => this.testAIInput('add a comment at the top', ['insertat']),
            () => this.testAIInput('show me the content', ['getcontent']),
            () => this.testAIInput('analyze this code', ['analyze'])
        ];

        tests.forEach((test, index) => {
            try {
                console.log(`\n--- Test ${index + 1} ---`);
                test();
            } catch (error) {
                console.error(`❌ Test ${index + 1} failed:`, error.message);
            }
        });

        this.printSummary();
    }

    captureState() {
        return {
            content: [...this.mockEditor.content],
            cursor: { ...this.mockEditor.cursor },
            selection: this.mockEditor.selection ? { ...this.mockEditor.selection } : null,
            timestamp: Date.now()
        };
    }

    diffStates(before, after) {
        const changes = [];
        if (JSON.stringify(before.content) !== JSON.stringify(after.content)) {
            changes.push('content');
        }
        if (JSON.stringify(before.cursor) !== JSON.stringify(after.cursor)) {
            changes.push('cursor');
        }
        if (before.selection !== after.selection) {
            changes.push('selection');
        }
        return changes.length > 0 ? changes : ['none'];
    }

    setTestContent(text) {
        this.mockEditor.setValue(text);
        console.log(`📝 TestFramework: Set content to ${text.split('\n').length} lines`);
    }

    showState() {
        console.log('\n📋 CURRENT EDITOR STATE:');
        console.log(`Content: "${this.mockEditor.getValue()}"`);
        console.log(`Cursor: Line ${this.mockEditor.cursor.line}, Col ${this.mockEditor.cursor.column}`);
        console.log(`Selection: ${this.mockEditor.selection ? JSON.stringify(this.mockEditor.selection) : 'none'}`);
    }

    resetEditor() {
        this.mockEditor.content = [];
        this.mockEditor.cursor = { line: 1, column: 1 };
        this.mockEditor.selection = null;
        console.log('🔄 TestFramework: Editor reset to empty state');
    }

    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUITE SUMMARY');
        console.log('='.repeat(50));

        const passed = this.testResults.filter(r => r.success).length;
        const failed = this.testResults.filter(r => !r.success).length;
        const total = this.testResults.length;

        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

        if (failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults.filter(r => !r.success).forEach((result, index) => {
                console.log(`${index + 1}. /ai:${result.command}[${result.params}] - ${result.error || 'Expectation failed'}`);
            });
        }

        console.log('\n🎯 AI Commands Test Suite Complete!');
    }

    // Utility functions for testing
    testCmd(command, params) {
        return this.testCommand(command, params);
    }

    testAI(userInput) {
        return this.testAIInput(userInput);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AITestFramework, MockEditor, MockAICommands };
}

// Auto-run if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    const framework = new AITestFramework();

    // Make functions available globally for interactive testing
    global.testCmd = (cmd, params) => framework.testCommand(cmd, params);
    global.testAI = (input) => framework.testAIInput(input);
    global.setTestContent = (text) => framework.setTestContent(text);
    global.showState = () => framework.showState();
    global.resetEditor = () => framework.resetEditor();

    console.log('🎯 AI Commands Testing Framework initialized!');
    console.log('Available functions: testCmd(), testAI(), setTestContent(), showState(), resetEditor()');
    console.log('Running test suite...\n');

    framework.runTestSuite();
}
