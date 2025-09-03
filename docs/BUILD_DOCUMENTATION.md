# GGcode Compiler Build Documentation

## 📋 Overview
This document provides comprehensive information about the GGcode Compiler build system, development workflow, and deployment processes.

## 🏗️ Build System Architecture

### Technology Stack
- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla JavaScript + Three.js + Monaco Editor
- **Build Tools**: Webpack + Babel + ESLint + Prettier
- **Development**: Nodemon + Jest
- **Deployment**: PM2 (implied) + Docker (optional)

### Directory Structure
```
/home/t1/GGcode-node_DEV/
├── src/                    # Source code
│   ├── client/            # Frontend code
│   │   ├── js/           # Client-side JavaScript
│   │   └── css/          # Stylesheets
│   └── server/           # Backend code
├── public/               # Static assets (built)
├── views/                # EJS templates
├── tests/                # Test files
├── scripts/              # Build and utility scripts
├── docs/                 # Documentation
└── webpack.config.js     # Frontend build configuration
```

## ⚙️ Configuration Files

### package.json
```json
{
  "name": "ggcode-compiler",
  "version": "1.0.0",
  "description": "GGcode Compiler - A web-based compiler for GGcode to G-code conversion",
  "main": "src/server/index.js",
  "scripts": {
    "start": "NODE_ENV=production node src/server/index.js",
    "dev": "NODE_ENV=development node --inspect src/server/index.js",
    "dev:watch": "NODE_ENV=development nodemon --inspect src/server/index.js",
    "prod": "NODE_ENV=production node src/server/index.js",
    "test": "NODE_ENV=test jest",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage",
    "lint": "eslint src/ --ext .js",
    "lint:fix": "eslint src/ --ext .js --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "format:check": "prettier --check \"src/**/*.js\"",
    "build:client": "webpack",
    "build": "npm run lint && npm run test && npm run build:client",
    "build:prod": "npm run lint && npm run test && npm run format:check && npm run build:client",
    "clean": "rm -rf coverage/ .nyc_output/",
    "health-check": "curl -f http://localhost:6990/api/health || exit 1",
    "setup": "./scripts/setup-hooks.sh",
    "maintenance:health": "./scripts/check-project-health.sh",
    "maintenance:deps": "./scripts/update-dependencies.sh",
    "maintenance:docs": "./scripts/generate-docs.sh",
    "maintenance:all": "npm run maintenance:health && npm run maintenance:deps && npm run maintenance:docs",
    "update-structure": "node scripts/update-readme-structure.js",
    "update-changelog": "node scripts/update-changelog.js",
    "commit": "./scripts/smart-commit.sh",
    "com": "./scripts/smart-commit.sh"
  }
}
```

### webpack.config.js
```javascript
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/client/js/main.js',
        navigation: './src/client/js/ui/navigation.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/js'),
        clean: false,
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    resolve: {
        extensions: ['.js'],
        fallback: {
            'vs/editor/editor.main': false
        }
    },
    externals: {
        'monaco-editor': 'monaco',
        'ffi-napi': 'commonjs ffi-napi',
        'ref-napi': 'commonjs ref-napi',
        // ... Node.js native modules
    },
    devtool: 'source-map',
    stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }
};
```

### nodemon.json
```json
{
  "watch": ["src/"],
  "ext": "js,json,ejs",
  "ignore": ["src/**/*.test.js", "node_modules/"],
  "exec": "node --inspect src/server/index.js",
  "env": {
    "NODE_ENV": "development"
  },
  "delay": "1000"
}
```

### .env
```bash
AI_ENDPOINT=http://localhost:11434
OLLAMA_MODEL=deepseek-coder-v2:16b
```

## 🚀 Build Commands

### Development
```bash
# Start development server with debugging
npm run dev

# Start development server with auto-restart
npm run dev:watch

# Build client assets only
npm run build:client
```

### Production
```bash
# Start production server
npm run prod

# Full production build (lint + test + format + build)
npm run build:prod

# Quick build (lint + test + build)
npm run build
```

### Code Quality
```bash
# Lint code
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Maintenance
```bash
# Health check
npm run maintenance:health

# Update dependencies
npm run maintenance:deps

# Generate docs
npm run maintenance:docs

# Run all maintenance tasks
npm run maintenance:all

# Update project structure
npm run update-structure

# Update changelog
npm run update-changelog
```

## 🔧 Build Process

### 1. Client Build (Webpack)
- **Entry Points**: `src/client/js/main.js`, `src/client/js/ui/navigation.js`
- **Output**: `public/js/main.js`, `public/js/navigation.js`
- **Features**:
  - ES6+ transpilation with Babel
  - Source maps for debugging
  - External dependencies handling
  - Monaco Editor AMD loading support

### 2. Server Build
- **Entry Point**: `src/server/index.js`
- **Features**:
  - Hot reloading with nodemon
  - Debug mode support
  - Environment-based configuration

### 3. Asset Pipeline
- **Static Files**: Served from `public/` directory
- **Templates**: EJS templates in `views/`
- **CSS**: Custom stylesheets in `public/css/`

## 📦 Dependencies

### Production Dependencies
- **body-parser**: ^2.2.0 - HTTP request body parsing
- **dotenv**: ^17.2.1 - Environment variable loading
- **ejs**: ^3.1.10 - Template engine
- **express**: ^4.21.2 - Web framework
- **express-rate-limit**: ^8.0.1 - API rate limiting
- **ffi-napi**: ^4.0.3 - Foreign function interface for native libraries
- **node-fetch**: ^2.7.0 - HTTP client
- **ref-napi**: ^3.0.3 - Memory management for FFI
- **three**: ^0.178.0 - 3D graphics library

### Development Dependencies
- **@babel/core**: ^7.28.3 - JavaScript transpiler core
- **@babel/preset-env**: ^7.28.3 - JavaScript preset for modern browsers
- **babel-loader**: ^10.0.0 - Webpack loader for Babel
- **eslint**: ^8.57.1 - Code linting
- **jest**: ^29.7.0 - Testing framework
- **jest-environment-jsdom**: ^30.0.5 - Jest DOM environment
- **nodemon**: ^3.1.10 - Development auto-restart
- **prettier**: ^3.6.2 - Code formatting
- **supertest**: ^6.3.4 - HTTP endpoint testing
- **webpack**: ^5.101.3 - Module bundler
- **webpack-cli**: ^6.0.1 - Webpack command line interface

## 🧪 Testing Setup

### Jest Configuration
```json
{
  "testEnvironment": "node",
  "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/index.js"
  ],
  "coverageDirectory": "coverage",
  "coverageReporters": ["text", "lcov", "html"],
  "testMatch": [
    "**/tests/**/*.test.js",
    "**/__tests__/**/*.js"
  ],
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1"
  }
}
```

### Test Structure
```
tests/
├── setup.js              # Test setup and global configurations
├── fixtures/             # Test data and fixtures
│   ├── examples/         # Example data
│   ├── help/             # Help system test data
│   └── performance/      # Performance test data
├── client/               # Client-side tests
├── server/               # Server-side tests
└── utils/                # Test utilities and helpers
```

## 📋 Code Quality Tools

### ESLint Configuration
```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
    browser: true
  },
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['src/server/**/*.js', 'tests/**/*.js'],
      env: { node: true, browser: false }
    },
    {
      files: ['src/client/**/*.js'],
      env: { browser: true, node: false },
      globals: {
        THREE: 'readonly',
        monaco: 'readonly',
        require: 'readonly'
      }
    }
  ],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'off'
  }
};
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 🚀 Deployment

### Environment Variables
- **NODE_ENV**: `development` | `production` | `test`
- **AI_ENDPOINT**: AI service endpoint (default: `http://localhost:11434`)
- **OLLAMA_MODEL**: AI model name (default: `deepseek-coder-v2:16b`)

### Production Deployment
```bash
# 1. Install dependencies
npm ci

# 2. Build client assets
npm run build:client

# 3. Start production server
npm run prod

# 4. Optional: Run health check
npm run health-check
```

### Development Deployment
```bash
# 1. Install dependencies
npm install

# 2. Build client assets
npm run build:client

# 3. Start development server with watch
npm run dev:watch
```

## 🔍 Monitoring & Debugging

### Performance Monitoring
- Built-in performance stats in visualizer
- Memory usage tracking
- Frame rate monitoring
- Render time analysis

### Debugging
- **Source Maps**: Enabled for client-side debugging
- **Chrome DevTools**: Available via `--inspect` flag
- **Console Logging**: Performance and error logging
- **Test Coverage**: HTML and LCOV reports

## 📚 Maintenance Scripts

### Available Scripts
- **`check-project-health.sh`**: Comprehensive project health check
- **`update-dependencies.sh`**: Update and audit dependencies
- **`generate-docs.sh`**: Generate project documentation
- **`update-readme-structure.js`**: Update README structure
- **`update-changelog.js`**: Update changelog
- **`smart-commit.sh`**: Smart commit with validation
- **`setup-hooks.sh`**: Setup Git hooks

### Usage
```bash
# Run individual maintenance tasks
./scripts/check-project-health.sh
./scripts/update-dependencies.sh
./scripts/generate-docs.sh

# Or run all at once
npm run maintenance:all
```

## 🎯 Recent Features Added

### Camera Mode Switching
- **Orthographic Camera**: Flat 3D view, no perspective distortion
- **Perspective Camera**: Real 3D view with depth perception
- **Seamless switching** between modes
- **UI Button**: Camera icon in visualizer controls

### Image Export Functionality
- **PNG Export**: High-quality image export of 3D visualization
- **Automatic naming**: Timestamp + camera mode in filename
- **One-click download**: Direct browser download
- **UI Button**: Export icon in visualizer controls

### Implementation Details
```javascript
// Camera switching in core.js
switchCameraMode(mode) {
  // Preserve current camera state
  // Switch between orthographic/perspective
  // Update controls and aspect ratios
}

// Image export in core.js
exportImage() {
  // Capture canvas as PNG
  // Generate timestamped filename
  // Trigger browser download
}
```

## 🔄 CI/CD Pipeline

### Build Stages
1. **Lint**: ESLint code quality check
2. **Test**: Jest test suite execution
3. **Format**: Prettier code formatting check
4. **Build**: Webpack client asset compilation
5. **Deploy**: Production server startup

### Quality Gates
- **Lint Pass**: No ESLint errors or warnings
- **Test Pass**: All tests passing with minimum coverage
- **Format Pass**: Code matches Prettier standards
- **Build Pass**: Client assets compiled successfully

## 📞 Support & Troubleshooting

### Common Issues
1. **Build Fails**: Check Node.js version (≥16.0.0)
2. **Test Timeouts**: Increase Jest timeout in config
3. **Webpack Errors**: Clear node_modules and reinstall
4. **Monaco Loading**: Ensure CDN availability

### Useful Commands
```bash
# Clear all caches and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build:client

# Run with verbose logging
DEBUG=* npm run dev

# Check bundle size
npm run build:client -- --stats=verbose
```

---

## 📝 Notes

- **Node.js Version**: Requires ≥16.0.0
- **npm Version**: Requires ≥8.0.0
- **Browser Support**: Modern browsers with ES6+ support
- **Three.js**: Latest version (0.178.0) for 3D visualization
- **Monaco Editor**: Loaded via CDN, no local dependency

This build system provides a robust foundation for development, testing, and production deployment of the GGcode Compiler application.