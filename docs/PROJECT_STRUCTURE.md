# Project Structure Documentation

This document provides a comprehensive overview of the GGcode Compiler project structure, explaining the purpose and organization of each directory and file.

## 📁 Root Directory Structure

```
ggcode-compiler/
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore patterns
├── CHANGELOG.md              # Version history and changes
├── CONTRIBUTING.md           # Contribution guidelines
├── README.md                 # Project documentation
├── package.json              # Node.js dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── libggcode.so             # Native GGcode compiler library
├── src/                     # Source code
├── tests/                   # Test suite
├── views/                   # EJS templates
├── public/                  # Static assets (legacy)
├── GGCODE/                  # Example GGcode files
└── docs/                    # Documentation
```

## 🏗️ Source Code Structure (`src/`)

### Client-Side Code (`src/client/`)

The client-side code uses ES6 modules and follows a modular architecture pattern.

```
src/client/
├── js/                      # JavaScript modules
│   ├── api/                 # API client modules
│   ├── configurator/        # Configurator system
│   ├── editor/              # Editor components
│   ├── ui/                  # User interface components
│   ├── visualizer/          # 3D visualization
│   └── main.js              # Application entry point
└── css/                     # Stylesheets
    ├── components.css       # Component-specific styles
    └── modals.css           # Modal dialog styles
```

#### API Modules (`src/client/js/api/`)

Centralized API communication layer with error handling and timeout management.

```
api/
├── client.js                # Base API client with fetch wrapper
├── compiler.js              # GGcode compilation endpoints
├── examples.js              # Examples management API
├── help.js                  # Help content retrieval API
└── index.js                 # API manager and orchestration
```

**Key Features:**
- Unified error handling
- Request timeout management
- Response caching
- Retry logic for failed requests

#### Configurator System (`src/client/js/configurator/`)

Dynamic form generation system for parameterized GGcode files.

```
configurator/
├── index.js                 # Main configurator manager
├── parser.js                # Variable parsing from GGcode comments
├── renderer.js              # Dynamic form rendering
└── validator.js             # Real-time form validation
```

**Functionality:**
- Parses `/// @type` comments in GGcode
- Generates dynamic forms for variables
- Real-time validation and error handling
- Supports number, text, checkbox, and selection inputs

#### Editor Components (`src/client/js/editor/`)

Advanced code editing capabilities with Monaco Editor integration.

```
editor/
├── annotations.js           # G-code analysis and modal state tracking
├── monaco.js                # Monaco editor manager and configuration
└── syntax.js                # GGcode syntax highlighting definitions
```

**Features:**
- Monaco Editor integration
- Custom GGcode syntax highlighting
- Real-time G-code annotations
- Modal state tracking for G-code commands
- IntelliSense and auto-completion

#### UI Components (`src/client/js/ui/`)

Modular user interface components for various application features.

```
ui/
├── fileOps.js               # File import/export operations
├── modals.js                # Modal dialog management
└── toolbar.js               # Toolbar controls and actions
```

**Components:**
- File drag-and-drop support
- Modal dialog system
- Toolbar button management
- Clipboard operations

#### 3D Visualization (`src/client/js/visualizer/`)

Advanced G-code visualization with Three.js integration.

```
visualizer/
├── controls.js              # Interactive simulation controls
├── index.js                 # Main visualizer orchestration
└── viewer3d.js              # Three.js-based 3D rendering engine
```

**Capabilities:**
- Real-time 3D G-code visualization
- Interactive simulation controls
- Toolpath animation
- Multiple view modes (wireframe, solid, etc.)

### Server-Side Code (`src/server/`)

The server-side code uses CommonJS modules and follows a layered architecture pattern.

```
src/server/
├── config/                  # Configuration management
├── middleware/              # Express middleware
├── routes/                  # API route handlers
├── services/                # Business logic services
├── app.js                   # Express application setup
└── index.js                 # Server entry point
```

#### Configuration (`src/server/config/`)

Environment-specific configuration management system.

```
config/
├── environment.js           # Environment-specific settings
└── index.js                 # Configuration manager and validation
```

**Features:**
- Environment-based configuration
- Configuration validation
- Default value management
- Type checking and conversion

#### Middleware (`src/server/middleware/`)

Express middleware for request processing, security, and error handling.

```
middleware/
├── errorHandler.js          # Centralized error handling
├── index.js                 # Middleware registration and setup
└── security.js              # Security middleware (CSRF, rate limiting, etc.)
```

**Security Features:**
- Input validation and sanitization
- Rate limiting protection
- CSRF protection
- Security headers (XSS, clickjacking, etc.)
- Request logging and monitoring

#### Routes (`src/server/routes/`)

API route handlers organized by functionality.

```
routes/
├── compiler.js              # GGcode compilation endpoints
├── examples.js              # Example file management
├── help.js                  # Help content endpoints
└── index.js                 # Route registration and setup
```

**API Endpoints:**
- `POST /api/compile` - Compile GGcode to G-code
- `GET /api/examples` - List available examples
- `GET /api/help` - Retrieve help content
- `GET /api/health` - Health check endpoint

#### Services (`src/server/services/`)

Business logic services for core application functionality.

```
services/
├── compiler.js              # GGcode compilation with FFI integration
├── fileManager.js           # File operations and validation
└── helpContent.js           # Help content management
```

**Service Responsibilities:**
- GGcode compilation through native library
- File validation and processing
- Help content parsing and formatting
- Error handling and logging

## 🧪 Test Structure (`tests/`)

Comprehensive test suite covering both client and server-side code.

```
tests/
├── client/                  # Client-side tests
│   └── api/                 # API client tests
├── server/                  # Server-side tests
│   ├── config/              # Configuration tests
│   └── services/            # Service layer tests
└── utils/                   # Test utilities and helpers
    ├── testHelpers.js       # Common test helper functions
    └── testRunner.js        # Test execution utilities
```

### Test Categories

- **Unit Tests**: Individual function and class testing
- **Integration Tests**: API endpoint and service interaction testing
- **Client Tests**: Browser-based component testing
- **Coverage Tests**: Code coverage analysis and reporting

## 🎨 Views and Templates (`views/`)

EJS templates for server-side rendering.

```
views/
├── pages/                   # Main page templates
│   └── index.ejs            # Main application page
└── partials/                # Reusable template components
    ├── modals.ejs           # Modal dialog templates
    ├── scripts.ejs          # JavaScript loading template
    └── viewer.ejs           # 3D viewer template
```

## 📦 Static Assets (`public/`)

Legacy static assets maintained for backward compatibility.

```
public/
├── js/                      # Legacy JavaScript files
├── css/                     # Legacy stylesheets
├── data/                    # Static data files
└── assets/                  # Images and other assets
```

## 📚 Documentation (`docs/`)

Project documentation and guides.

```
docs/
├── PROJECT_STRUCTURE.md     # This file
├── API.md                   # API documentation
├── ARCHITECTURE.md          # Architecture decisions
└── DEPLOYMENT.md            # Deployment guide
```

## 📄 Example Files (`GGCODE/`)

Collection of example GGcode files for testing and demonstration.

```
GGCODE/
├── basic/                   # Basic examples
├── advanced/                # Advanced examples
└── templates/               # Template files
```

## 🔧 Configuration Files

### ESLint Configuration (`.eslintrc.js`)

```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
    browser: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['src/server/**/*.js', 'tests/**/*.js'],
      parserOptions: { sourceType: 'script' },
      env: { node: true, browser: false, jest: true }
    },
    {
      files: ['src/client/**/*.js'],
      parserOptions: { sourceType: 'module' },
      env: { browser: true, node: false, es2021: true },
      globals: { THREE: 'readonly', monaco: 'readonly', require: 'readonly' }
    }
  ],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'off'
  }
};
```

### Package.json Scripts

```json
{
  "scripts": {
    "start": "NODE_ENV=production node src/server/index.js",
    "dev": "NODE_ENV=development node --inspect src/server/index.js",
    "dev:watch": "NODE_ENV=development nodemon --inspect src/server/index.js",
    "test": "NODE_ENV=test jest",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage",
    "lint": "eslint src/ --ext .js",
    "lint:fix": "eslint src/ --ext .js --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "build": "npm run lint && npm run test"
  }
}
```

## 🏛️ Architecture Patterns

### Client-Side Architecture

- **Module Pattern**: ES6 modules with clear separation of concerns
- **Manager Pattern**: Central managers for different application areas
- **Observer Pattern**: Event-driven communication between components
- **Factory Pattern**: Dynamic creation of UI components

### Server-Side Architecture

- **Layered Architecture**: Clear separation of routes, services, and data
- **Dependency Injection**: Services injected into routes through middleware
- **Middleware Pattern**: Request processing pipeline
- **Service Layer Pattern**: Business logic encapsulation

### Cross-Cutting Concerns

- **Error Handling**: Centralized error handling on both client and server
- **Logging**: Structured logging with different levels
- **Configuration**: Environment-based configuration management
- **Security**: Input validation, rate limiting, and security headers

## 🔄 Data Flow

### Request Flow

1. **Client Request**: Browser makes API request
2. **Middleware**: Security, validation, and logging middleware
3. **Route Handler**: Processes request and calls services
4. **Service Layer**: Business logic and data processing
5. **Response**: Formatted response sent back to client

### Module Loading

1. **Entry Point**: `src/client/js/main.js` loads as ES6 module
2. **Dynamic Imports**: Modules loaded as needed
3. **Manager Initialization**: Core managers initialized
4. **Global Exports**: Functions exported for HTML compatibility

## 📊 File Organization Principles

### Naming Conventions

- **Files**: camelCase for JavaScript files
- **Directories**: lowercase with hyphens for multi-word names
- **Classes**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Module Organization

- **Single Responsibility**: Each module has a single, well-defined purpose
- **Dependency Direction**: Dependencies flow inward (UI → Services → Data)
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### File Size Guidelines

- **Small Modules**: Keep modules under 500 lines when possible
- **Single Class**: One main class per file
- **Clear Exports**: Explicit exports with clear naming
- **Documentation**: JSDoc comments for all public APIs

## 🚀 Build and Deployment

### Development Build

```bash
npm run dev          # Start development server
npm run dev:watch    # Start with file watching
npm run lint         # Check code quality
npm run test         # Run test suite
```

### Production Build

```bash
npm run build        # Full build with linting and testing
npm start            # Start production server
```

### Static File Serving

- **Legacy Files**: Served from `/public` directory
- **Modular Files**: Served from `/src` directory for ES6 modules
- **Caching**: Production caching for static assets
- **Compression**: Gzip compression for responses

---

This project structure provides a solid foundation for maintainable, scalable web application development with clear separation of concerns and modern development practices.