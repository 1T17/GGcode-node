#!/usr/bin/env node

/**
 * AI Tests Runner Script
 * Easily run AI integration tests from command line
 *
 * Usage:
 *   node tests/run-ai-tests.js                    # Run with default test cases
 *   node tests/run-ai-tests.js custom-tests.json  # Run with custom test file
 *   node tests/run-ai-tests.js --help             # Show help
 */

const path = require('path');
const fs = require('fs');

class AITestRunner {
    constructor() {
        this.showHelp();
    }

    showHelp() {
        const args = process.argv.slice(2);

        if (args.includes('--help') || args.includes('-h')) {
            console.log(`
🤖 AI Commands Integration Test Runner

Usage:
  node tests/run-ai-tests.js                    # Run default tests
  node tests/run-ai-tests.js <test-file.json>   # Run custom test file
  node tests/run-ai-tests.js --help             # Show this help

Examples:
  node tests/run-ai-tests.js                    # Uses tests/ai-test-cases.json
  node tests/run-ai-tests.js my-tests.json      # Uses custom test file
  node tests/run-ai-tests.js quick-tests.json   # Uses specific test file

Available Test Files:
  📁 tests/ai-test-cases.json        - Comprehensive test suite
  📁 tests/quick-tests.json          - Fast subset for development
  📁 tests/smoke-tests.json          - Critical path tests only

Test Types:
  🔧 command        - Direct AI command execution (/ai:command[params])
  💬 natural_language - Natural language input to AI
  🔄 sequence       - Multi-step command workflows

Output:
  📊 Detailed console output with pass/fail status
  💾 Results saved to tests/ai-integration-results.json
  📈 Success rate and performance metrics

Exit Codes:
  0 - All tests passed
  1 - Some tests failed
  2 - System error (server couldn't start, etc.)
`);
            process.exit(0);
        }
    }

    async run() {
        const args = process.argv.slice(2);
        let testFile = null;

        // Parse command line arguments
        for (const arg of args) {
            if (arg.endsWith('.json') && !arg.startsWith('--')) {
                testFile = arg;
            }
        }

        // If no test file specified, use default
        if (!testFile) {
            testFile = 'tests/ai-test-cases.json';
        }

        // Check if test file exists
        if (!fs.existsSync(testFile)) {
            console.error(`❌ Test file not found: ${testFile}`);
            console.log('\nAvailable test files:');
            const testDir = path.dirname(testFile);
            if (fs.existsSync(testDir)) {
                const files = fs.readdirSync(testDir).filter(f => f.endsWith('.json'));
                files.forEach(file => console.log(`  📄 ${testDir}/${file}`));
            }
            process.exit(1);
        }

        console.log(`🚀 Starting AI Integration Tests`);
        console.log(`📄 Test file: ${testFile}`);
        console.log(`⏰ Started at: ${new Date().toISOString()}`);
        console.log('');

        try {
            // Import and run the integration test
            const { AIServerTester } = require('./ai-integration-test.js');
            const tester = new AIServerTester();

            // Set specific test port to avoid random port issues
            process.env.TEST_PORT = '3001';

            await tester.runTestSuite(testFile);

            // Check results and exit with appropriate code
            const resultsPath = path.join(__dirname, 'ai-integration-results.json');
            if (fs.existsSync(resultsPath)) {
                const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
                const failed = results.failed || 0;

                if (failed > 0) {
                    console.log(`\n❌ Tests completed with ${failed} failures`);
                    process.exit(1);
                } else {
                    console.log(`\n✅ All tests passed!`);
                    process.exit(0);
                }
            } else {
                console.log(`\n⚠️  Tests completed but no results file found`);
                process.exit(2);
            }

        } catch (error) {
            console.error(`\n💥 Test runner failed:`, error.message);
            process.exit(2);
        }
    }

    // Utility function to create a quick test file
    createQuickTests() {
        const quickTests = {
            testSuite: "Quick AI Tests",
            description: "Fast subset for development testing",
            version: "1.0.0",
            testCases: [
                {
                    type: "command",
                    name: "Help Command",
                    command: "help",
                    params: "",
                    expected: "Available commands"
                },
                {
                    type: "natural_language",
                    name: "Simple Content Request",
                    input: "Show me the file content",
                    expectedCommands: ["getcontent"]
                },
                {
                    type: "command",
                    name: "Analyze Command",
                    command: "analyze",
                    params: "",
                    expected: "analysis"
                }
            ]
        };

        fs.writeFileSync('tests/quick-tests.json', JSON.stringify(quickTests, null, 2));
        console.log('📄 Created tests/quick-tests.json');
    }

    // Utility function to create smoke tests (critical path only)
    createSmokeTests() {
        const smokeTests = {
            testSuite: "Smoke Tests",
            description: "Critical path tests only",
            version: "1.0.0",
            testCases: [
                {
                    type: "command",
                    name: "Server Health Check",
                    command: "help",
                    params: "",
                    expected: "commands"
                }
            ]
        };

        fs.writeFileSync('tests/smoke-tests.json', JSON.stringify(smokeTests, null, 2));
        console.log('📄 Created tests/smoke-tests.json');
    }
}

// Handle special commands
const args = process.argv.slice(2);
if (args.includes('--create-quick-tests')) {
    const runner = new AITestRunner();
    runner.createQuickTests();
    process.exit(0);
} else if (args.includes('--create-smoke-tests')) {
    const runner = new AITestRunner();
    runner.createSmokeTests();
    process.exit(0);
} else {
    // Run the tests
    const runner = new AITestRunner();
    runner.run().catch(error => {
        console.error('💥 Fatal error:', error);
        process.exit(2);
    });
}
