# Contributing to GGcode Compiler

Thank you for your interest in contributing to the GGcode Compiler! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git
- Basic understanding of JavaScript, Node.js, and web development

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/ggcode-compiler.git
   cd ggcode-compiler
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Verify Setup**
   ```bash
   npm run build
   npm test
   ```

## 🏗️ Project Architecture

### Directory Structure

```
src/
├── client/                 # Client-side code (ES6 modules)
│   ├── js/
│   │   ├── api/           # API client modules
│   │   ├── configurator/  # Configurator system
│   │   ├── editor/        # Editor components
│   │   ├── ui/            # UI components
│   │   ├── visualizer/    # 3D visualization
│   │   └── main.js        # Application entry point
│   └── css/               # Stylesheets
├── server/                # Server-side code (CommonJS)
│   ├── config/            # Configuration management
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── app.js             # Express application
│   └── index.js           # Server entry point
tests/                     # Test suite
├── client/                # Client-side tests
├── server/                # Server-side tests
└── utils/                 # Test utilities
```

### Module System

- **Client-side**: ES6 modules (`import`/`export`)
- **Server-side**: CommonJS modules (`require`/`module.exports`)
- **Backward Compatibility**: Global exports for HTML onclick handlers

## 📝 Development Guidelines

### Code Style

We use ESLint and Prettier for consistent code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Coding Standards

#### JavaScript

- **ES6+ Features**: Use modern JavaScript features
- **Async/Await**: Prefer async/await over Promises
- **Error Handling**: Always handle errors appropriately
- **Documentation**: Use JSDoc comments for functions and classes

#### Client-Side Modules

```javascript
/**
 * Example client-side module
 */
class ExampleManager {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the manager
   * @param {Object} options - Configuration options
   */
  async initialize(options = {}) {
    // Implementation
  }
}

export default ExampleManager;
```

#### Server-Side Modules

```javascript
/**
 * Example server-side service
 */
class ExampleService {
  constructor() {
    this.config = require('../config');
  }

  /**
   * Process data
   * @param {Object} data - Input data
   * @returns {Promise<Object>} Processed result
   */
  async processData(data) {
    // Implementation
  }
}

module.exports = ExampleService;
```

### Testing

#### Test Structure

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test API endpoints and service interactions
- **Client Tests**: Test browser-based components

#### Writing Tests

```javascript
describe('ExampleService', () => {
  let service;

  beforeEach(() => {
    service = new ExampleService();
  });

  describe('processData', () => {
    it('should process data correctly', async () => {
      const input = { test: 'data' };
      const result = await service.processData(input);
      
      expect(result).toBeDefined();
      expect(result.processed).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      const invalidInput = null;
      
      await expect(service.processData(invalidInput))
        .rejects.toThrow('Invalid input');
    });
  });
});
```

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=example.test.js
```

## 🔄 Development Workflow

### Branch Strategy

1. **Main Branch**: `main` - Production-ready code
2. **Feature Branches**: `feature/feature-name` - New features
3. **Bug Fixes**: `fix/bug-description` - Bug fixes
4. **Hotfixes**: `hotfix/critical-fix` - Critical production fixes

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples

```bash
feat(api): add new compilation endpoint
fix(editor): resolve syntax highlighting issue
docs(readme): update installation instructions
test(compiler): add unit tests for validation
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following our standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm run build
   npm test
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **PR Requirements**
   - Clear description of changes
   - Tests pass
   - Code review approval
   - Documentation updated

## 🐛 Bug Reports

### Before Reporting

1. **Search Existing Issues**: Check if the bug is already reported
2. **Reproduce the Bug**: Ensure you can consistently reproduce it
3. **Check Latest Version**: Verify the bug exists in the latest version

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 12, Ubuntu 20.04]
- Node.js version: [e.g., 16.14.0]
- Browser: [e.g., Chrome 96, Firefox 95]
- GGcode Compiler version: [e.g., 1.0.0]

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### Before Requesting

1. **Check Existing Requests**: Look for similar feature requests
2. **Consider Scope**: Ensure the feature fits the project's goals
3. **Think About Implementation**: Consider how it might be implemented

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How do you envision this feature working?

## Alternatives Considered
What other approaches have you considered?

## Additional Context
Any other relevant information or mockups
```

## 🔧 Development Tasks

### Adding New API Endpoints

1. **Create Route Handler**
   ```javascript
   // src/server/routes/example.js
   router.get('/api/example', async (req, res) => {
     // Implementation
   });
   ```

2. **Add Service Logic**
   ```javascript
   // src/server/services/exampleService.js
   class ExampleService {
     async processRequest(data) {
       // Business logic
     }
   }
   ```

3. **Create Client API**
   ```javascript
   // src/client/js/api/example.js
   class ExampleAPI extends APIClient {
     async getExample() {
       return this.get('/api/example');
     }
   }
   ```

4. **Add Tests**
   ```javascript
   // tests/server/routes/example.test.js
   // tests/client/api/example.test.js
   ```

### Adding New UI Components

1. **Create Component Module**
   ```javascript
   // src/client/js/ui/example.js
   class ExampleComponent {
     constructor() {
       this.element = null;
     }

     render() {
       // Render logic
     }
   }

   export default ExampleComponent;
   ```

2. **Add Styles**
   ```css
   /* src/client/css/components.css */
   .example-component {
     /* Styles */
   }
   ```

3. **Integrate with Main App**
   ```javascript
   // src/client/js/main.js
   import ExampleComponent from './ui/example.js';
   ```

4. **Add Tests**
   ```javascript
   // tests/client/ui/example.test.js
   ```

## 📚 Documentation

### Code Documentation

- **JSDoc Comments**: Document all public functions and classes
- **README Updates**: Update README for new features
- **API Documentation**: Document new API endpoints
- **Examples**: Provide usage examples

### Documentation Standards

```javascript
/**
 * Process GGcode compilation
 * @param {string} ggcode - The GGcode source to compile
 * @param {Object} options - Compilation options
 * @param {boolean} options.validate - Whether to validate syntax
 * @param {number} options.timeout - Compilation timeout in ms
 * @returns {Promise<Object>} Compilation result
 * @throws {Error} If compilation fails
 * @example
 * const result = await compiler.compile('G1 X10 Y10', { validate: true });
 */
async compile(ggcode, options = {}) {
  // Implementation
}
```

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. **Update Version**: Update version in `package.json`
2. **Update Changelog**: Add new version to `CHANGELOG.md`
3. **Run Tests**: Ensure all tests pass
4. **Build**: Create production build
5. **Tag Release**: Create Git tag
6. **Deploy**: Deploy to production

## 🤝 Community

### Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Pull Requests**: Code contributions

### Code of Conduct

- **Be Respectful**: Treat all contributors with respect
- **Be Constructive**: Provide helpful feedback
- **Be Patient**: Remember that everyone is learning
- **Be Inclusive**: Welcome contributors of all backgrounds

## 📞 Getting Help

### Resources

- **Documentation**: Check the README and inline documentation
- **Examples**: Look at existing code for patterns
- **Tests**: Examine test files for usage examples
- **Issues**: Search existing issues for solutions

### Asking Questions

When asking for help:

1. **Be Specific**: Describe exactly what you're trying to do
2. **Provide Context**: Include relevant code and error messages
3. **Show Effort**: Explain what you've already tried
4. **Be Patient**: Allow time for responses

## 🎯 Areas for Contribution

### High Priority

- **Bug Fixes**: Fix reported issues
- **Test Coverage**: Improve test coverage
- **Documentation**: Enhance documentation
- **Performance**: Optimize performance bottlenecks

### Medium Priority

- **New Features**: Implement requested features
- **UI/UX Improvements**: Enhance user experience
- **Code Quality**: Refactor and improve code quality
- **Accessibility**: Improve accessibility compliance

### Low Priority

- **Examples**: Add more example files
- **Tooling**: Improve development tools
- **Integrations**: Add third-party integrations
- **Localization**: Add multi-language support

## 📄 License

By contributing to GGcode Compiler, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to GGcode Compiler! Your efforts help make this project better for everyone. 🙏