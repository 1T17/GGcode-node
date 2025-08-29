/**
 * AI Integration Testing Framework
 * Tests the complete AI command system by sending HTTP requests to the server
 * Run with: node tests/ai-integration-test.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

class AIServerTester {
    constructor() {
        this.serverProcess = null;
        this.baseUrl = null; // Will be determined from server output
        this.testResults = [];
        this.startTime = null;
        this.serverPort = process.env.TEST_PORT || 3001; // Use test port
    }

    async startServer() {
        console.log('🚀 Starting GGcode server for testing...');

        return new Promise((resolve, reject) => {
            // Start server in background
            const { spawn } = require('child_process');
            this.serverProcess = spawn('node', ['src/server/index.js'], {
                stdio: 'pipe',
                env: { ...process.env, NODE_ENV: 'test' }
            });

            // Wait for server to start
            let serverStarted = false;
            const timeout = setTimeout(() => {
                if (!serverStarted) {
                    reject(new Error('Server failed to start within 30 seconds'));
                }
            }, 30000);

            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log('📄 Server:', output.trim());

                // Parse server output to find actual port
                const portMatch = output.match(/Server running at http:\/\/[^:]+:(\d+)/);
                if (portMatch) {
                    this.serverPort = parseInt(portMatch[1]);
                    this.baseUrl = `http://localhost:${this.serverPort}`;
                    console.log(`🔌 Detected server port: ${this.serverPort}`);
                }

                if (output.includes('Server running at') && !serverStarted) {
                    serverStarted = true;
                    clearTimeout(timeout);
                    console.log('✅ Server started successfully');
                    setTimeout(resolve, 1000); // Give server time to fully initialize
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                console.error('❌ Server Error:', data.toString());
            });

            this.serverProcess.on('error', (error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }

    async stopServer() {
        console.log('🛑 Stopping server...');
        if (this.serverProcess) {
            this.serverProcess.kill('SIGTERM');
        }
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const url = new URL(endpoint, this.baseUrl);
            const options = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            const req = http.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    try {
                        const response = {
                            statusCode: res.statusCode,
                            headers: res.headers,
                            body: body ? JSON.parse(body) : null
                        };
                        resolve(response);
                    } catch (error) {
                        resolve({
                            statusCode: res.statusCode,
                            headers: res.headers,
                            body: body
                        });
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    async testAICommand(command, params, expectedResponse = null) {
        console.log(`\n🧪 Testing AI Command: /ai:${command}[${params}]`);

        const testData = {
            message: `/ai:${command}[${params}]`,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await this.makeRequest('/api/ai/chat', 'POST', testData);

            const success = response.statusCode === 200 &&
                (expectedResponse === null || response.body?.response?.includes(expectedResponse));

            const testResult = {
                type: 'command',
                command,
                params,
                success,
                statusCode: response.statusCode,
                response: response.body?.response || response.body,
                expected: expectedResponse,
                timestamp: new Date().toISOString()
            };

            this.testResults.push(testResult);
            console.log(`${success ? '✅' : '❌'} Command test ${success ? 'passed' : 'failed'}`);
            console.log(`   Status: ${response.statusCode}`);
            console.log(`   Response: ${JSON.stringify(response.body?.response || response.body).substring(0, 100)}...`);

            return testResult;

        } catch (error) {
            console.error(`❌ Command test failed: ${error.message}`);
            const testResult = {
                type: 'command',
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

    async testNaturalLanguageInput(userInput, expectedCommands = []) {
        console.log(`\n🤖 Testing Natural Language: "${userInput}"`);

        const testData = {
            message: userInput,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await this.makeRequest('/api/ai/chat', 'POST', testData);

            const success = response.statusCode === 200 &&
                expectedCommands.length === 0 ||
                expectedCommands.some(cmd => response.body?.response?.includes(`/ai:${cmd}`));

            const testResult = {
                type: 'natural_language',
                input: userInput,
                success,
                statusCode: response.statusCode,
                response: response.body?.response || response.body,
                expectedCommands,
                timestamp: new Date().toISOString()
            };

            this.testResults.push(testResult);
            console.log(`${success ? '✅' : '❌'} Natural language test ${success ? 'passed' : 'failed'}`);
            console.log(`   Status: ${response.statusCode}`);
            console.log(`   AI Response: ${JSON.stringify(response.body?.response || response.body).substring(0, 150)}...`);

            return testResult;

        } catch (error) {
            console.error(`❌ Natural language test failed: ${error.message}`);
            const testResult = {
                type: 'natural_language',
                input: userInput,
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
            this.testResults.push(testResult);
            return testResult;
        }
    }

    async testCommandSequence(testName, commands) {
        console.log(`\n🔄 Testing Command Sequence: ${testName}`);

        const results = [];
        for (const [index, command] of commands.entries()) {
            console.log(`   Step ${index + 1}: /ai:${command.command}[${command.params}]`);
            const result = await this.testAICommand(command.command, command.params, command.expected);
            results.push(result);
        }

        const success = results.every(r => r.success);
        const sequenceResult = {
            type: 'sequence',
            name: testName,
            success,
            steps: results,
            timestamp: new Date().toISOString()
        };

        this.testResults.push(sequenceResult);
        console.log(`${success ? '✅' : '❌'} Command sequence ${success ? 'passed' : 'failed'}`);

        return sequenceResult;
    }

    async runTestSuite(testFile = null) {
        this.startTime = Date.now();
        console.log('🚀 STARTING AI INTEGRATION TEST SUITE...\n');

        try {
            // Start server
            await this.startServer();

            // Load test cases
            const testCases = testFile ? this.loadTestFile(testFile) : this.getDefaultTestCases();

            // Run all tests
            for (const testCase of testCases) {
                switch (testCase.type) {
                    case 'command':
                        await this.testAICommand(testCase.command, testCase.params, testCase.expected);
                        break;
                    case 'natural_language':
                        await this.testNaturalLanguageInput(testCase.input, testCase.expectedCommands);
                        break;
                    case 'sequence':
                        await this.testCommandSequence(testCase.name, testCase.commands);
                        break;
                }
            }

            this.printSummary();

        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
        } finally {
            await this.stopServer();
        }
    }

    getDefaultTestCases() {
        return [
            // Basic command tests
            { type: 'command', command: 'help', params: '', expected: 'Available commands' },
            { type: 'command', command: 'getcontent', params: '', expected: 'content' },
            { type: 'command', command: 'analyze', params: '', expected: 'analysis' },

            // Natural language tests
            { type: 'natural_language', input: 'Show me the content of the file', expectedCommands: ['getcontent'] },
            { type: 'natural_language', input: 'Add a comment at the top', expectedCommands: ['insertat'] },
            { type: 'natural_language', input: 'Analyze this G-code', expectedCommands: ['analyze'] },
            { type: 'natural_language', input: 'Go to line 5', expectedCommands: ['gotoline'] },

            // Command sequences
            {
                type: 'sequence',
                name: 'Edit Workflow',
                commands: [
                    { command: 'getcontent', params: '', expected: 'content' },
                    { command: 'insertat', params: '1,1,"// Added by AI"', expected: 'inserted' },
                    { command: 'getlines', params: '1,3', expected: 'lines' }
                ]
            }
        ];
    }

    loadTestFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(content);

            // Handle different test file formats
            if (parsed.testCases && Array.isArray(parsed.testCases)) {
                return parsed.testCases;
            } else if (Array.isArray(parsed)) {
                return parsed;
            } else {
                console.error(`❌ Invalid test file format in ${filePath}`);
                return this.getDefaultTestCases();
            }
        } catch (error) {
            console.error(`❌ Failed to load test file ${filePath}:`, error.message);
            return this.getDefaultTestCases();
        }
    }

    printSummary() {
        const duration = Date.now() - this.startTime;
        console.log('\n' + '='.repeat(60));
        console.log('📊 AI INTEGRATION TEST SUITE SUMMARY');
        console.log('='.repeat(60));

        const passed = this.testResults.filter(r => r.success).length;
        const failed = this.testResults.filter(r => !r.success).length;
        const total = this.testResults.length;

        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
        console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);

        if (failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults.filter(r => !r.success).forEach((result, index) => {
                if (result.type === 'command') {
                    console.log(`${index + 1}. /ai:${result.command}[${result.params}] - ${result.error || 'Expectation failed'}`);
                } else if (result.type === 'natural_language') {
                    console.log(`${index + 1}. "${result.input}" - ${result.error || 'Expectation failed'}`);
                }
            });
        }

        // Save results to file
        this.saveResults();

        console.log('\n🎯 AI Integration Test Suite Complete!');
    }

    saveResults() {
        const resultsPath = path.join(__dirname, 'ai-integration-results.json');
        const summary = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            totalTests: this.testResults.length,
            passed: this.testResults.filter(r => r.success).length,
            failed: this.testResults.filter(r => !r.success).length,
            results: this.testResults
        };

        try {
            fs.writeFileSync(resultsPath, JSON.stringify(summary, null, 2));
            console.log(`💾 Results saved to: ${resultsPath}`);
        } catch (error) {
            console.error('❌ Failed to save results:', error.message);
        }
    }

    // Utility functions for external use
    async testCommand(command, params) {
        return await this.testAICommand(command, params);
    }

    async testNaturalLanguage(input) {
        return await this.testNaturalLanguageInput(input);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIServerTester };
}

// Auto-run if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    const tester = new AIServerTester();

    // Get test file from command line argument
    const testFile = process.argv[2];

    console.log('🎯 AI Integration Testing Framework initialized!');
    console.log(`Test file: ${testFile || 'Using default test cases'}`);
    console.log('Starting tests...\n');

    tester.runTestSuite(testFile).catch(console.error);
}
