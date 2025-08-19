#!/bin/bash

# Setup script for Git hooks and development environment
# Run this after cloning the repository

set -e

echo "🔧 Setting up GGcode Compiler development environment..."

# 1. Install Git hooks
echo "📎 Installing Git hooks..."
if [ -d ".git" ]; then
    # Configure Git to use our hooks directory
    git config core.hooksPath .githooks
    echo "✅ Git hooks configured to use .githooks directory"
else
    echo "⚠️  Not in a Git repository - hooks will be available but not active"
fi

# 2. Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
if command -v npm >/dev/null 2>&1; then
    npm install
    echo "✅ Dependencies installed"
else
    echo "❌ npm not found. Please install Node.js and npm first."
    exit 1
fi

# 3. Verify development tools
echo "🔍 Verifying development tools..."

# Check ESLint
if npm run lint --silent >/dev/null 2>&1; then
    echo "✅ ESLint is working"
else
    echo "⚠️  ESLint check failed - please review configuration"
fi

# Check Prettier
if npm run format:check --silent >/dev/null 2>&1; then
    echo "✅ Prettier is working"
else
    echo "⚠️  Prettier check failed - please review configuration"
fi

# Check tests
echo "🧪 Running initial test suite..."
if npm test; then
    echo "✅ All tests passing"
else
    echo "❌ Some tests are failing - please review"
    exit 1
fi

# 4. Create local development directories
echo "📁 Creating development directories..."
mkdir -p logs
mkdir -p temp
mkdir -p .vscode
echo "✅ Development directories created"

# 5. Setup VS Code configuration (if VS Code is being used)
if [ ! -f ".vscode/settings.json" ]; then
    echo "⚙️  Creating VS Code settings..."
    cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.workingDirectories": ["src"],
  "files.exclude": {
    "**/node_modules": true,
    "**/logs": true,
    "**/temp": true,
    "**/.nyc_output": true,
    "**/coverage": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/logs": true,
    "**/temp": true,
    "**/.nyc_output": true,
    "**/coverage": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "javascript.preferences.includePackageJsonAutoImports": "off"
}
EOF
    echo "✅ VS Code settings created"
fi

# 6. Setup launch configuration for debugging
if [ ! -f ".vscode/launch.json" ]; then
    echo "🐛 Creating VS Code debug configuration..."
    cat > .vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/server/index.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeArgs": ["--inspect"]
    },
    {
      "name": "Run Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "env": {
        "NODE_ENV": "test"
      },
      "console": "integratedTerminal"
    }
  ]
}
EOF
    echo "✅ VS Code debug configuration created"
fi

# 7. Create development environment file
if [ ! -f ".env" ]; then
    echo "🔐 Creating development environment file..."
    cat > .env << 'EOF'
# Development Environment Configuration
NODE_ENV=development
PORT=6990
HOST=localhost

# Compiler Configuration
COMPILER_LIB_PATH=./libggcode.so
COMPILER_TIMEOUT=30000

# Development Settings
LOG_LEVEL=debug
LOG_FORMAT=dev

# Security (development only)
TRUST_PROXY=false
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000
EOF
    echo "✅ Development .env file created"
    echo "⚠️  Please review and update .env with your specific configuration"
fi

# 8. Setup npm scripts shortcuts
echo "📜 Available npm scripts:"
echo "  npm run dev        - Start development server with hot reload"
echo "  npm run dev:watch  - Start with file watching"
echo "  npm test           - Run test suite"
echo "  npm run test:watch - Run tests in watch mode"
echo "  npm run lint       - Check code quality"
echo "  npm run lint:fix   - Fix linting issues"
echo "  npm run format     - Format code"
echo "  npm run build      - Full build (lint + test)"

# 9. Final verification
echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and update .env file with your configuration"
echo "2. Ensure libggcode.so is in the project root (or update COMPILER_LIB_PATH)"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:6990 in your browser"
echo ""
echo "Git hooks are now active and will:"
echo "- Run linting and tests before each commit"
echo "- Validate commit message format"
echo "- Perform maintenance tasks after commits"
echo ""
echo "Happy coding! 🚀"