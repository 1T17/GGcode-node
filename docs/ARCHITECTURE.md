# Architecture Documentation

This document describes the architectural decisions, patterns, and design principles used in the GGcode Compiler project.

## 🏗️ Overall Architecture

The GGcode Compiler follows a **modular, layered architecture** with clear separation between client and server-side code, designed for maintainability, scalability, and developer experience.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
├─────────────────────────────────────────────────────────────┤
│  Client-Side (ES6 Modules)                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ UI Layer    │ │ API Layer   │ │ Editor      │          │
│  │ - Modals    │ │ - Clients   │ │ - Monaco    │          │
│  │ - Toolbar   │ │ - Managers  │ │ - Syntax    │          │
│  │ - FileOps   │ │ - Error     │ │ - Annotate  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Visualizer  │ │ Configurator│ │ Main App    │          │
│  │ - 3D View   │ │ - Parser    │ │ - Init      │          │
│  │ - Controls  │ │ - Renderer  │ │ - Managers  │          │
│  │ - Engine    │ │ - Validator │ │ - Globals   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/WebSocket
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Express Server                           │
├─────────────────────────────────────────────────────────────┤
│  Server-Side (CommonJS)                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Routes      │ │ Middleware  │ │ Services    │          │
│  │ - Compiler  │ │ - Security  │ │ - Compiler  │          │
│  │ - Examples  │ │ - Error     │ │ - FileManager│         │
│  │ - Help      │ │ - Logging   │ │ - HelpContent│         │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│  ┌─────────────┐ ┌─────────────┐                          │
│  │ Config      │ │ Static      │                          │
│  │ - Env       │ │ - Public    │                          │
│  │ - Manager   │ │ - Src       │                          │
│  └─────────────┘ └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
                              │
                         FFI Interface
                              │
┌─────────────────────────────────────────────────────────────┐
│                 Native Library                              │
│                  libggcode.so                               │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Design Principles

### 1. Separation of Concerns

Each module has a single, well-defined responsibility:

- **UI Components**: Handle user interface interactions
- **API Clients**: Manage server communication
- **Services**: Contain business logic
- **Middleware**: Process requests and responses
- **Configuration**: Manage application settings

### 2. Modular Architecture

The application is built using a modular approach:

```javascript
// Client-side ES6 modules
import EditorManager from './editor/monaco.js';
import APIManager from './api/index.js';

// Server-side CommonJS modules
const CompilerService = require('./services/compiler');
const { configureMiddleware } = require('./middleware');
```

### 3. Dependency Inversion

Higher-level modules don't depend on lower-level modules. Both depend on abstractions:

```javascript
// Service depends on interface, not implementation
class CompilerService {
  constructor(libraryPath) {
    this.library = this.initializeLibrary(libraryPath);
  }
}

// Route depends on service interface
router.post('/compile', async (req, res) => {
  const result = await req.services.compiler.compile(req.body.ggcode);
  res.json(result);
});
```

### 4. Single Responsibility Principle

Each class and module has one reason to change:

```javascript
// Monaco editor management only
class MonacoEditorManager {
  initialize() { /* editor setup */ }
  setTheme() { /* theme management */ }
  registerLanguage() { /* language registration */ }
}

// API communication only
class APIClient {
  get() { /* GET requests */ }
  post() { /* POST requests */ }
  handleError() { /* error handling */ }
}
```

## 🏛️ Architectural Patterns

### 1. Layered Architecture (Server-Side)

```
┌─────────────────┐
│   Routes Layer  │  ← HTTP request handling
├─────────────────┤
│  Services Layer │  ← Business logic
├─────────────────┤
│   Data Layer    │  ← File system, native library
└─────────────────┘
```

**Benefits:**
- Clear separation of concerns
- Easy to test individual layers
- Flexible and maintainable

### 2. Module Pattern (Client-Side)

```javascript
// Self-contained modules with clear interfaces
class ConfiguratorManager {
  constructor() {
    this.parser = new ConfiguratorParser();
    this.renderer = new ConfiguratorRenderer();
    this.validator = new ConfiguratorValidator();
  }

  showConfigurator(ggcode) {
    const variables = this.parser.parse(ggcode);
    const form = this.renderer.render(variables);
    this.validator.setup(form, variables);
  }
}

export default ConfiguratorManager;
```

### 3. Manager Pattern

Central managers coordinate related functionality:

```javascript
// API Manager coordinates all API clients
class APIManager {
  constructor() {
    this.compilerAPI = new CompilerAPI();
    this.examplesAPI = new ExamplesAPI();
    this.helpAPI = new HelpAPI();
  }

  getCompilerAPI() { return this.compilerAPI; }
  getExamplesAPI() { return this.examplesAPI; }
  getHelpAPI() { return this.helpAPI; }
}
```

### 4. Observer Pattern

Event-driven communication between components:

```javascript
// Editor events trigger annotations
outputEditor.onDidChangeCursorPosition((e) => {
  const lineNumber = e.position.lineNumber;
  const lineContent = outputEditor.getModel().getLineContent(lineNumber);
  annotationSystem.updateAnnotations(lineNumber, lineContent);
});
```

### 5. Factory Pattern

Dynamic creation of components:

```javascript
// Dynamic form field creation
class ConfiguratorRenderer {
  static renderField(variable) {
    switch (variable.type) {
      case 'number': return this.renderNumberField(variable);
      case 'text': return this.renderTextField(variable);
      case 'checkbox': return this.renderCheckboxField(variable);
      default: throw new Error(`Unknown field type: ${variable.type}`);
    }
  }
}
```

## 🔄 Data Flow Architecture

### 1. Request-Response Flow

```
Client Request → Middleware → Route → Service → Response
     ↑                                            ↓
Browser ←─────────── JSON Response ←──────────────┘
```

### 2. Client-Side Data Flow

```
User Action → UI Component → API Client → Server
     ↑                                      ↓
UI Update ←── State Manager ←── Response ←──┘
```

### 3. Module Loading Flow

```
main.js → Manager Initialization → Module Loading → Global Exports
   ↓              ↓                      ↓              ↓
Browser ←── Application Ready ←── Event Setup ←── Compatibility
```

## 🧩 Component Architecture

### Client-Side Components

#### 1. Editor System

```javascript
// Monaco Editor integration with custom language support
class MonacoEditorManager {
  async initialize(options) {
    await this.loadMonaco();
    this.registerGGcodeLanguage();
    this.createEditors(options);
    this.setupEventHandlers();
  }
}

// G-code annotation system
class GcodeAnnotationSystem {
  updateAnnotations(lineNumber, lineContent) {
    const parsed = this.parseGcodeLine(lineContent);
    const annotation = this.generateAnnotation(parsed);
    this.displayAnnotation(annotation);
  }
}
```

#### 2. API System

```javascript
// Base API client with error handling
class APIClient {
  async _makeRequest(method, endpoint, data) {
    try {
      const response = await fetch(this.buildURL(endpoint), {
        method, body: JSON.stringify(data)
      });
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Specialized API clients
class CompilerAPI extends APIClient {
  async compile(ggcode) {
    return this.post('/api/compile', { ggcode });
  }
}
```

#### 3. UI System

```javascript
// Modal management
class ModalManager {
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    this.setupEventHandlers(modal);
  }
}

// File operations
class FileOperations {
  setupDragAndDrop(element) {
    element.addEventListener('drop', this.handleFileDrop.bind(this));
  }
}
```

### Server-Side Components

#### 1. Service Layer

```javascript
// Compiler service with FFI integration
class CompilerService {
  constructor(libPath) {
    this.library = ffi.Library(libPath, {
      compile_ggcode_from_string: ['pointer', ['pointer', 'int']]
    });
  }

  async compile(ggcode) {
    return new Promise((resolve, reject) => {
      try {
        const result = this.library.compile_ggcode_from_string(
          Buffer.from(ggcode), 1
        );
        resolve(this.processResult(result));
      } catch (error) {
        reject(error);
      }
    });
  }
}
```

#### 2. Middleware Layer

```javascript
// Security middleware
function validateInput(req, res, next) {
  // Input sanitization
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;
  
  res.status(status).json({ success: false, error: message });
}
```

#### 3. Route Layer

```javascript
// Compilation routes
router.post('/api/compile', async (req, res) => {
  try {
    const result = await req.services.compiler.compile(req.body.ggcode);
    res.json({ success: true, output: result });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});
```

## 🔐 Security Architecture

### 1. Input Validation

```javascript
// Server-side validation
function validateInput(req, res, next) {
  if (req.get('content-length') > MAX_SIZE) {
    return next(new Error('Request too large'));
  }
  
  // Sanitize inputs
  req.body = sanitizeObject(req.body);
  next();
}

// Client-side validation
class ConfiguratorValidator {
  static validateForm(form, variables) {
    const errors = {};
    for (const element of form.elements) {
      const validation = this.validateField(element);
      if (!validation.isValid) {
        errors[element.name] = validation.error;
      }
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }
}
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests' }
});

app.use('/api', apiRateLimit);
```

### 3. Security Headers

```javascript
function securityHeaders(req, res, next) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'"
  );
  next();
}
```

## 📊 Performance Architecture

### 1. Client-Side Optimization

```javascript
// Lazy loading of modules
async function loadVisualizerModule() {
  const { GcodeVisualizer } = await import('./visualizer/index.js');
  return new GcodeVisualizer();
}

// Efficient rendering with batching
class GcodeViewer3D {
  updateVisualization(segments) {
    // Batch geometry updates
    this.batchGeometryUpdates(segments);
    // Single render call
    this.renderer.render(this.scene, this.camera);
  }
}
```

### 2. Server-Side Optimization

```javascript
// Response caching
const cache = new Map();

function cacheMiddleware(req, res, next) {
  const key = req.url;
  if (cache.has(key)) {
    return res.json(cache.get(key));
  }
  
  const originalSend = res.json;
  res.json = function(data) {
    cache.set(key, data);
    originalSend.call(this, data);
  };
  
  next();
}
```

### 3. Memory Management

```javascript
// Proper cleanup in compiler service
class CompilerService {
  compile(ggcode) {
    const outputPtr = this.library.compile_ggcode_from_string(input);
    try {
      return this.processOutput(outputPtr);
    } finally {
      // Always free native memory
      this.library.free_ggcode_string(outputPtr);
      if (global.gc) global.gc(); // Trigger GC if available
    }
  }
}
```

## 🧪 Testing Architecture

### 1. Test Structure

```
tests/
├── client/           # Client-side tests
│   └── api/         # API client tests
├── server/          # Server-side tests
│   ├── config/      # Configuration tests
│   └── services/    # Service tests
└── utils/           # Test utilities
```

### 2. Test Patterns

```javascript
// Service testing with mocks
describe('CompilerService', () => {
  let service;
  
  beforeEach(() => {
    service = new CompilerService('/mock/path');
  });
  
  it('should compile ggcode successfully', async () => {
    const result = await service.compile('G1 X10 Y10');
    expect(result).toBeDefined();
  });
});

// API testing with supertest
describe('Compiler API', () => {
  it('should compile ggcode via POST /api/compile', async () => {
    const response = await request(app)
      .post('/api/compile')
      .send({ ggcode: 'G1 X10 Y10' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

## 🔄 Configuration Architecture

### 1. Environment-Based Configuration

```javascript
// Environment-specific settings
const environments = {
  development: {
    server: { port: 6990, host: 'localhost' },
    compiler: { timeout: 30000 },
    logging: { level: 'debug' }
  },
  production: {
    server: { port: process.env.PORT, host: '0.0.0.0' },
    compiler: { timeout: 15000 },
    logging: { level: 'info' }
  }
};

// Configuration manager
class ConfigManager {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.config = environments[this.env];
    this.validate();
  }
  
  get(path, defaultValue) {
    return this.getNestedValue(this.config, path) || defaultValue;
  }
}
```

### 2. Validation and Type Safety

```javascript
// Configuration validation
validate() {
  const required = [
    'server.port',
    'server.host',
    'compiler.libPath'
  ];
  
  for (const path of required) {
    if (this.get(path) === undefined) {
      throw new Error(`Required configuration missing: ${path}`);
    }
  }
}
```

## 🚀 Deployment Architecture

### 1. Build Process

```javascript
// Package.json scripts
{
  "scripts": {
    "build": "npm run lint && npm run test",
    "start": "NODE_ENV=production node src/server/index.js",
    "dev": "NODE_ENV=development nodemon src/server/index.js"
  }
}
```

### 2. Static File Serving

```javascript
// Serve both legacy and modular files
app.use(express.static('public')); // Legacy files
app.use('/src', express.static('src')); // Modular files

// Production caching
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public', { maxAge: '1d' }));
}
```

## 📈 Scalability Considerations

### 1. Horizontal Scaling

- **Stateless Design**: No server-side session state
- **Load Balancing**: Multiple server instances
- **Caching**: Redis for shared caching
- **Database**: Separate database for persistent data

### 2. Vertical Scaling

- **Memory Management**: Efficient memory usage
- **CPU Optimization**: Optimized algorithms
- **I/O Optimization**: Async operations
- **Native Library**: FFI for performance-critical operations

## 🔮 Future Architecture Considerations

### 1. Microservices Migration

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Gateway   │  │  Compiler   │  │   Examples  │
│   Service   │  │   Service   │  │   Service   │
└─────────────┘  └─────────────┘  └─────────────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
              ┌─────────────┐
              │    Help     │
              │   Service   │
              └─────────────┘
```

### 2. Real-time Features

- **WebSocket Integration**: Real-time collaboration
- **Event Sourcing**: Change tracking
- **CQRS**: Command Query Responsibility Segregation

### 3. Cloud Native

- **Containerization**: Docker containers
- **Orchestration**: Kubernetes deployment
- **Service Mesh**: Istio for service communication
- **Observability**: Distributed tracing and monitoring

---

This architecture provides a solid foundation for a maintainable, scalable, and secure web application while maintaining flexibility for future enhancements and requirements.