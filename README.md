# GGcode Compiler

A modern web-based compiler for GGcode to G-code conversion with 3D visualization, real-time editing, and comprehensive tooling support.

## 🚀 Features

- **Real-time GGcode Compilation**: Convert GGcode to standard G-code with live feedback
- **Monaco Editor Integration**: Advanced code editing with syntax highlighting and IntelliSense
- **3D G-code Visualization**: Interactive 3D preview of toolpaths with simulation controls
- **Configurator System**: Dynamic form generation for parameterized GGcode files
- **Examples Library**: Built-in collection of GGcode examples and templates
- **Help System**: Comprehensive documentation with multi-language support
- **File Operations**: Import/export GGcode and G-code files with drag-and-drop support
- **Annotation System**: Real-time G-code analysis with modal state tracking

## 📁 Project Structure

```
├── .githooks/
│   ├── commit-msg
│   ├── post-commit
│   └── pre-commit
├── .github/ # GitHub workflows
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── documentation.yml
│   │   └── release.yml
│   └── markdown-link-check-config.json
├── docs/ # Documentation
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── PROJECT_STRUCTURE.md
├── GGCODE/ # Example files
│   ├── advanced patterns.ggcode
│   ├── advanced_control.ggcode
│   ├── Arc Spiral Pattern.ggcode
│   ├── array_example.ggcode
│   ├── array_literals.ggcode
│   ├── Basic Arc Commands.ggcode
│   ├── Basic Square Pocket.ggcode
│   ├── basic_circle.ggcode
│   ├── complete_features.ggcode
│   ├── complete_math.ggcode
│   ├── configurator_demo.ggcode
│   ├── Crop Circle Pattern.ggcode
│   ├── Flower of Life.ggcode
│   ├── Flower Pattern with Arcs.ggcode
│   ├── function_example.ggcode
│   ├── Gear Teeth 2.ggcode
│   ├── Gear Teeth.ggcode
│   ├── Inverted Spiral - Downward.ggcode
│   ├── math_functions.ggcode
│   ├── Mind-Blowing Gear Generator.ggcode
│   ├── operators_and_logic.ggcode
│   ├── Rose Pattern.ggcode
│   ├── Simple Gear Generator.ggcode
│   ├── simple_spiral.ggcode
│   ├── Spiral Function Circle Grid.ggcode
│   ├── Spiral Function Grid.ggcode
│   ├── Spiral Function Multi-Ring Circular Grid.ggcode
│   ├── spiral.ggcode
│   ├── Spiral.ggcode
│   ├── square.ggcode
│   ├── Stair Stringer.ggcode
│   ├── star.ggcode
│   ├── start spiral.ggcode
│   └── True Spiral with Arcs.ggcode
├── public/ # Static assets (legacy)
│   ├── css/
│   │   ├── components.css
│   │   ├── editor.css
│   │   ├── main.css
│   │   └── modals.css
│   ├── data/
│   │   └── help-content/
│   │       ├── ar.json
│   │       ├── de.json
│   │       ├── en.json
│   │       ├── es.json
│   │       ├── fr.json
│   │       ├── he.json
│   │       ├── it.json
│   │       ├── ja.json
│   │       ├── ko.json
│   │       ├── metadata.json
│   │       ├── MULTILANGUAGE_GUIDE.md
│   │       ├── nl.json
│   │       ├── pl.json
│   │       ├── pt.json
│   │       ├── README.md
│   │       ├── ru.json
│   │       ├── tr.json
│   │       └── zh.json
│   ├── js/
│   │   ├── annotations.js
│   │   ├── configurator.js
│   │   ├── main.js
│   │   └── visualizer.js
│   ├── flags.css
│   ├── logo.png
│   ├── mill-annotations.json
│   ├── mill-dictionary.json
│   ├── OrbitControls.js
│   └── style.css
├── scripts/ # Build and utility scripts
│   ├── check-project-health.sh
│   ├── generate-docs.sh
│   ├── setup-hooks.sh
│   ├── smart-commit.sh
│   ├── update-changelog.js
│   ├── update-dependencies.sh
│   ├── update-readme-structure.js
│   └── verify-setup.sh
├── src/ # Source code
│   ├── client/ # Client-side code (ES6 modules)
│   │   ├── css/
│   │   │   ├── components.css
│   │   │   ├── editor.css
│   │   │   ├── main.css
│   │   │   └── modals.css
│   │   └── js/
│   │       ├── api/
│   │       ├── configurator/
│   │       ├── editor/
│   │       ├── ui/
│   │       ├── visualizer/
│   │       └── main.js
│   └── server/ # Server-side code (CommonJS)
│       ├── config/
│       │   ├── environment.js
│       │   └── index.js
│       ├── middleware/
│       │   ├── errorHandler.js
│       │   ├── index.js
│       │   └── security.js
│       ├── routes/
│       │   ├── compiler.js
│       │   ├── examples.js
│       │   ├── help.js
│       │   └── index.js
│       ├── services/
│       │   ├── compiler.js
│       │   ├── fileManager.js
│       │   └── helpContent.js
│       ├── utils/
│       ├── app.js
│       └── index.js
├── tests/ # Test suite
│   ├── client/
│   │   ├── api/
│   │   │   ├── client.test.js
│   │   │   └── compiler.test.js
│   │   ├── configurator/
│   │   ├── editor/
│   │   ├── ui/
│   │   └── visualizer/
│   ├── config/
│   │   └── testConfig.js
│   ├── fixtures/
│   │   ├── examples/
│   │   │   ├── simple_square.ggcode
│   │   │   └── with_variables.ggcode
│   │   └── help/
│   │       └── test_help.json
│   ├── server/
│   │   ├── config/
│   │   │   └── config.test.js
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   │       ├── compiler.test.js
│   │       └── fileManager.test.js
│   ├── utils/
│   │   ├── mocks.js
│   │   ├── testHelpers.js
│   │   └── testRunner.js
│   └── setup.js
├── views/ # EJS templates
│   ├── layouts/
│   │   └── main.ejs
│   ├── pages/
│   │   └── index.ejs
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── modals.ejs
│   │   ├── scripts.ejs
│   │   └── viewer.ejs
│   ├── app.ejs
│   ├── help-template.ejs
│   ├── helpExamples.ejs
│   ├── index.ejs
│   └── view.ejs
├── .eslintrc.js
├── .gitignore
├── .jsdoc.json
├── .prettierrc
├── CHANGELOG.md
├── CONTRIBUTING.md
├── ggcode.js
├── libggcode.so
├── MAINTENANCE.md
├── nodemon.json
├── package-lock.json
├── package.json
├── PROJECT_ORGANIZATION_SUMMARY.md
├── README.md
├── server.log
└── update.sh
```


## 🛠️ Installation

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- GGcode native library (`libggcode.so`)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ggcode-compiler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build and test**
   ```bash
   npm run build
   ```

## 🚀 Usage

### Development

```bash
# Start development server with hot reload
npm run dev

# Start with debugging
npm run dev:watch
```

### Production

```bash
# Start production server
npm start

# Or with PM2
pm2 start ecosystem.config.js
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Documentation Automation

```bash
# Update project structure in README.md
npm run update-structure

# Add changelog entry from recent commits
npm run update-changelog        # Uses version from package.json
npm run update-changelog 1.0.2  # Uses specific version
```

These simple scripts automate the mechanical parts of documentation maintenance:

- **Project Structure**: Scans directories and updates the `## 📁 Project Structure` section
- **Changelog**: Extracts git commits since last tag and adds formatted entries to CHANGELOG.md

Run these manually when preparing releases or updating documentation. The scripts handle the boring stuff while leaving creative content for manual editing.

## 📚 API Documentation

### Compilation Endpoints

- `POST /api/compile` - Compile GGcode to G-code
- `POST /api/validate` - Validate GGcode syntax
- `GET /api/compiler/status` - Get compiler status

### Examples Endpoints

- `GET /api/examples` - List available examples
- `GET /api/examples/:filename` - Get specific example

### Help Endpoints

- `GET /api/help` - Get help content
- `GET /api/help/:section` - Get specific help section

## 🏗️ Architecture

### Client-Side Architecture

The client uses a modular ES6 architecture with the following key components:

- **Monaco Editor Manager**: Handles code editing with syntax highlighting
- **API Manager**: Centralized API communication
- **Configurator Manager**: Dynamic form generation and validation
- **Annotation System**: Real-time G-code analysis
- **Modal Manager**: UI modal management
- **File Operations**: Import/export functionality

### Server-Side Architecture

The server follows a layered architecture:

- **Routes Layer**: Express route handlers
- **Services Layer**: Business logic and data processing
- **Middleware Layer**: Request processing and security
- **Configuration Layer**: Environment and application settings

### Module System

- **Client**: ES6 modules for modern browser compatibility
- **Server**: CommonJS modules for Node.js compatibility
- **Backward Compatibility**: Global function exports for legacy HTML

## 🔧 Configuration

### Environment Variables

```bash
NODE_ENV=development|production|test
PORT=6990
HOST=localhost
COMPILER_LIB_PATH=/path/to/libggcode.so
```

### Application Configuration

Configuration is managed through environment-specific files in `src/server/config/`:

- `environment.js` - Environment-specific settings
- `index.js` - Configuration manager

## 🧪 Testing Strategy

### Test Structure

- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **Client Tests**: Browser-based component testing
- **Coverage**: Comprehensive code coverage reporting

### Test Commands

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## 📈 Performance

### Optimization Features

- **Lazy Loading**: Dynamic module loading
- **Code Splitting**: Separate bundles for different features
- **Caching**: Static asset caching in production
- **Compression**: Gzip compression for responses
- **Rate Limiting**: API rate limiting for security

### Monitoring

- **Health Checks**: `/api/health` endpoint
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Request timing and resource usage

## 🔒 Security

### Security Features

- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: Protection against abuse
- **Security Headers**: CSRF, XSS, and clickjacking protection
- **Content Security Policy**: Strict CSP implementation
- **Error Handling**: Secure error responses

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes and test**
   ```bash
   npm run build
   npm test
   ```
4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new feature"
   ```
5. **Push and create PR**

### Code Standards

- **ESLint**: Code linting with custom rules
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages
- **Test Coverage**: Maintain >80% coverage

## 📄 License

ISC License - see LICENSE file for details

## 🆘 Support

### Documentation

- **API Docs**: Available at `/api/docs` when running
- **Help System**: Built-in help at `/help`
- **Examples**: Sample files in `/examples`

### Troubleshooting

Common issues and solutions:

1. **Compilation Errors**: Check `libggcode.so` path and permissions
2. **Port Conflicts**: Change PORT in environment variables
3. **Module Errors**: Ensure Node.js version >= 16.0.0

### Getting Help

- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Documentation**: In-app help system

## 🗺️ Roadmap

### Upcoming Features

- [ ] Real-time collaboration
- [ ] Cloud storage integration
- [ ] Advanced 3D visualization
- [ ] Plugin system
- [ ] Mobile responsive design
- [ ] Offline mode support

### Version History

- **v1.0.0**: Initial modular architecture implementation
- **v0.9.x**: Legacy monolithic structure

---

**Built with ❤️ by the GGcode Development Team**