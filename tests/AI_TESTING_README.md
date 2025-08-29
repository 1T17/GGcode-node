# 🤖 AI Commands Integration Testing System

This directory contains a complete automated testing system for the AI Commands feature. The system can programmatically test the AI's ability to understand and execute commands without any manual interaction.

## 📋 System Overview

The testing system consists of 4 main components:

1. **`ai-integration-test.js`** - Core testing framework that starts the server and sends HTTP requests
2. **`ai-test-cases.json`** - Comprehensive test cases (commands, natural language, sequences)
3. **`run-ai-tests.js`** - Easy-to-use command-line runner script
4. **`ai-commands-test.js`** - Pure Node.js console testing (no server required)

## 🚀 Quick Start

### Run Default Tests
```bash
# Run the comprehensive test suite
node tests/run-ai-tests.js

# Run with a specific test file
node tests/run-ai-tests.js tests/ai-test-cases.json

# Get help
node tests/run-ai-tests.js --help
```

### Create Custom Test Files
```bash
# Create quick tests for development
node tests/run-ai-tests.js --create-quick-tests

# Create smoke tests for critical path
node tests/run-ai-tests.js --create-smoke-tests
```

## 📊 Test Types

### 🔧 Command Tests
Test direct AI command execution:
```json
{
  "type": "command",
  "name": "Help Command",
  "command": "help",
  "params": "",
  "expected": "Available commands"
}
```

### 💬 Natural Language Tests
Test AI understanding of natural language:
```json
{
  "type": "natural_language",
  "name": "Show File Content",
  "input": "Show me the content of the file",
  "expectedCommands": ["getcontent"]
}
```

### 🔄 Sequence Tests
Test multi-step workflows:
```json
{
  "type": "sequence",
  "name": "Edit Workflow",
  "commands": [
    {
      "command": "getcontent",
      "params": "",
      "expected": "content"
    },
    {
      "command": "insertat",
      "params": "1,1,\"// Comment\"",
      "expected": "inserted"
    }
  ]
}
```

## 📁 File Structure

```
tests/
├── AI_TESTING_README.md           # This documentation
├── run-ai-tests.js                # Main runner script
├── ai-integration-test.js         # Server integration testing
├── ai-commands-test.js            # Console-only testing
├── ai-test-cases.json             # Comprehensive test suite
├── quick-tests.json               # Fast development tests
├── smoke-tests.json               # Critical path tests
└── ai-integration-results.json    # Test results (generated)
```

## 🎯 How It Works

### 1. Server Startup
- Tests start the GGcode server programmatically
- Waits for server to be ready (timeout: 30s)
- Uses `NODE_ENV=test` for testing configuration

### 2. HTTP Request Testing
- Sends POST requests to `/api/ai/chat` endpoint
- Tests both direct commands (`/ai:command[params]`) and natural language
- Verifies response status codes and content

### 3. Response Validation
- Checks if server responds (status 200)
- Validates AI responses contain expected content
- Tracks command execution and state changes

### 4. Results Reporting
- Detailed console output with emojis and colors
- Pass/fail statistics and performance metrics
- JSON results saved to `ai-integration-results.json`

## 📊 Example Output

```
🚀 Starting AI Integration Tests
📄 Test file: tests/ai-test-cases.json
⏰ Started at: 2025-08-22T19:03:34.567Z

🧪 Testing AI Command: /ai:help[]
✅ Command test passed
   Status: 200
   Response: "Available commands: help, getcontent, analyze..."

🤖 Testing Natural Language: "Show me the content of the file"
✅ Natural language test passed
   Status: 200
   AI Response: "I'll show you the file content using /ai:getcontent[]"

📊 AI INTEGRATION TEST SUITE SUMMARY
════════════════════════════════════════════════════════════
Total Tests: 17
✅ Passed: 15
❌ Failed: 2
📈 Success Rate: 88.2%
⏱️  Duration: 45.2s

❌ FAILED TESTS:
1. /ai:analyze[] - Expected 'analysis' but got 'command not implemented'
2. "Optimize this G-code" - AI didn't suggest /ai:optimize

💾 Results saved to: tests/ai-integration-results.json
🎯 AI Integration Test Suite Complete!
```

## 🔧 Advanced Usage

### Custom Test Files
Create your own test files in JSON format:
```bash
# Create a custom test file
cat > my-tests.json << EOF
{
  "testSuite": "My Custom Tests",
  "testCases": [
    {
      "type": "command",
      "name": "My Custom Command",
      "command": "mycommand",
      "params": "param1,param2",
      "expected": "expected result"
    }
  ]
}
EOF

# Run your custom tests
node tests/run-ai-tests.js my-tests.json
```

### Continuous Integration
Add to your CI pipeline:
```bash
#!/bin/bash
# Run AI tests in CI
node tests/run-ai-tests.js tests/smoke-tests.json

# Check exit code
if [ $? -eq 0 ]; then
  echo "✅ AI tests passed"
else
  echo "❌ AI tests failed"
  exit 1
fi
```

### Development Workflow
```bash
# During development, run quick tests frequently
node tests/run-ai-tests.js tests/quick-tests.json

# Before commits, run comprehensive tests
node tests/run-ai-tests.js

# After implementing new commands, test specifically
node tests/run-ai-tests.js tests/new-feature-tests.json
```

## 🐛 Troubleshooting

### Server Won't Start
- Check if port 3000 is available: `lsof -i :3000`
- Kill existing server: `pkill -f "node.*server"`
- Check server logs in test output

### Tests Timeout
- Increase timeout in `ai-integration-test.js`
- Check server responsiveness manually
- Verify AI endpoints are working

### Command Not Recognized
- Verify command is implemented in `aiCommands.js`
- Check command syntax in test cases
- Test manually through browser first

### Unexpected Test Failures
- Check `ai-integration-results.json` for detailed output
- Compare with expected responses in test cases
- Verify AI model behavior changes

## 🎨 Customization

### Environment Variables
```bash
# Set custom server URL
export AI_TEST_SERVER_URL=http://localhost:3001

# Set custom timeout
export AI_TEST_TIMEOUT=60000

# Set custom test environment
export NODE_ENV=staging
```

### Test Configuration
Modify `ai-integration-test.js` to:
- Change server startup parameters
- Modify HTTP request headers
- Adjust response validation logic
- Add custom test types

## 📈 Integration with Development

### Pre-commit Hooks
```bash
# .git/hooks/pre-commit
#!/bin/bash
echo "Running AI tests..."
node tests/run-ai-tests.js tests/smoke-tests.json
if [ $? -ne 0 ]; then
  echo "❌ AI tests failed - fix before committing"
  exit 1
fi
```

### VS Code Integration
Add to `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run AI Tests",
      "type": "shell",
      "command": "node",
      "args": ["tests/run-ai-tests.js"],
      "group": "test"
    }
  ]
}
```

## 🚀 Getting Started Checklist

- [ ] Install dependencies: `npm install`
- [ ] Start server manually first: `node src/server/index.js`
- [ ] Test basic connectivity: `curl http://localhost:3000/api/ai/chat -X POST -d '{"message":"test"}'`
- [ ] Run smoke tests: `node tests/run-ai-tests.js tests/smoke-tests.json`
- [ ] Run full test suite: `node tests/run-ai-tests.js`
- [ ] Review results: `cat tests/ai-integration-results.json`

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the generated `ai-integration-results.json`
3. Test individual endpoints manually
4. Check server logs for errors

## 🎯 Success Criteria

✅ **Automated Testing**: Can run without manual intervention
✅ **Comprehensive Coverage**: Tests all AI command types
✅ **Clear Reporting**: Detailed pass/fail with explanations
✅ **CI/CD Ready**: Proper exit codes for automation
✅ **Developer Friendly**: Easy to extend and customize

**Ready to start automated AI command testing!** 🎉
