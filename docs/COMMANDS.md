# GGcode Compiler - Commands Reference

## 🚀 Server Commands
```bash
npm start                    # Start server (basic)
npm run dev                  # Start development server with debugging
npm run dev:watch           # Start development with auto-restart
npm run prod                # Start production server
NODE_ENV=production npm start # Start with production environment
```

## 🏗️ Build Commands
```bash
npm run build:client        # Build client assets only
npm run build               # Full build (lint + test + build)
npm run build:prod          # Production build (lint + test + format + build)
npm run clean               # Clean build artifacts
```

## 🧪 Testing
```bash
npm run test                # Run test suite
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
```

## 📏 Code Quality
```bash
npm run lint                # Lint code
npm run lint:fix            # Lint and auto-fix issues
npm run format              # Format code with Prettier
npm run format:check        # Check code formatting
```

## 🔧 Maintenance
```bash
npm run maintenance:health  # Check project health
npm run maintenance:deps    # Update dependencies
npm run maintenance:docs    # Generate documentation
npm run maintenance:all     # Run all maintenance tasks
npm run health-check        # Check server health
```

## 📝 Project Management
```bash
npm run setup               # Setup Git hooks
npm run update-structure    # Update project structure
npm run update-changelog    # Update changelog
npm run commit              # Smart commit with validation
npm run com                 # Alias for smart commit
```

## 🎯 All Available Scripts
```bash
# From package.json scripts section:
"start"                     # NODE_ENV=production node src/server/index.js
"dev"                       # NODE_ENV=development node --inspect src/server/index.js
"dev:watch"                 # NODE_ENV=development nodemon --inspect src/server/index.js
"prod"                      # NODE_ENV=production node src/server/index.js
"test"                      # NODE_ENV=test jest
"test:watch"                # NODE_ENV=test jest --watch
"test:coverage"             # NODE_ENV=test jest --coverage
"lint"                      # eslint src/ --ext .js
"lint:fix"                  # eslint src/ --ext .js --fix
"format"                    # prettier --write "src/**/*.js"
"format:check"              # prettier --check "src/**/*.js"
"build:client"              # webpack
"build"                     # npm run lint && npm run test && npm run build:client
"build:prod"                # npm run lint && npm run test && npm run format:check && npm run build:client
"clean"                     # rm -rf coverage/ .nyc_output/
"health-check"              # curl -f http://localhost:6990/api/health || exit 1
"setup"                     # ./scripts/setup-hooks.sh
"maintenance:health"        # ./scripts/check-project-health.sh
"maintenance:deps"          # ./scripts/update-dependencies.sh
"maintenance:docs"          # ./scripts/generate-docs.sh
"maintenance:all"           # npm run maintenance:health && npm run maintenance:deps && npm run maintenance:docs
"update-structure"          # node scripts/update-readme-structure.js
"update-changelog"          # node scripts/update-changelog.js
"commit"                    # ./scripts/smart-commit.sh
"com"                       # ./scripts/smart-commit.sh
```

## 🎮 Visualizer Features (New)
```bash
# In browser - Visualizer modal:
# 🔄 Camera Toggle Button    # Switch between orthographic/perspective views
# 📸 Export Button           # Export current 3D view as PNG image
```

## 🌐 Access URLs
```bash
http://localhost:6990          # Main application
http://localhost:9229          # Debug inspector (when using --inspect)
chrome://inspect               # Chrome DevTools for debugging
```

## 📋 Environment Variables
```bash
NODE_ENV=development|production|test
AI_ENDPOINT=http://localhost:11434
OLLAMA_MODEL=deepseek-coder-v2:16b
```

## 🔍 Quick Reference
```bash
# Start developing
npm run dev:watch

# Full production deploy
npm run build:prod && npm run prod

# Check everything is working
npm run test && npm run lint && npm run health-check

# Clean and rebuild
npm run clean && npm run build:client