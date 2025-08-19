#!/bin/bash

# Documentation generation script
# Automatically generates and updates project documentation

set -e

echo "📚 Generating documentation for GGcode Compiler..."

# 1. Generate API documentation from JSDoc comments
echo "📖 Generating API documentation..."
if command -v jsdoc >/dev/null 2>&1; then
    # Create API docs directory
    mkdir -p docs/api
    
    # Generate JSDoc documentation
    jsdoc -c .jsdoc.json -d docs/api src/server/routes/*.js src/server/services/*.js
    
    echo "✅ API documentation generated in docs/api/"
else
    echo "⚠️  JSDoc not found - installing..."
    npm install -g jsdoc
    
    # Retry generation
    jsdoc -c .jsdoc.json -d docs/api src/server/routes/*.js src/server/services/*.js
    echo "✅ API documentation generated"
fi

# 2. Generate module dependency graph
echo "🔗 Generating module dependency graph..."
if command -v madge >/dev/null 2>&1; then
    # Generate dependency graph for client modules
    madge --image docs/client-dependencies.png src/client/js/
    
    # Generate dependency graph for server modules  
    madge --image docs/server-dependencies.png src/server/
    
    echo "✅ Dependency graphs generated"
else
    echo "ℹ️  Madge not available - skipping dependency graphs"
    echo "   Install with: npm install -g madge"
fi

# 3. Generate test coverage report
echo "📊 Generating test coverage report..."
if npm run test:coverage --silent >/dev/null 2>&1; then
    # Copy coverage report to docs
    if [ -d "coverage" ]; then
        cp -r coverage docs/
        echo "✅ Test coverage report copied to docs/coverage/"
    fi
else
    echo "⚠️  Test coverage generation failed"
fi

# 4. Generate project statistics
echo "📈 Generating project statistics..."
cat > docs/PROJECT_STATS.md << 'EOF'
# Project Statistics

This document contains automatically generated statistics about the GGcode Compiler project.

## Code Statistics

EOF

# Count lines of code
if command -v cloc >/dev/null 2>&1; then
    echo "### Lines of Code" >> docs/PROJECT_STATS.md
    echo "" >> docs/PROJECT_STATS.md
    echo '```' >> docs/PROJECT_STATS.md
    cloc src/ --exclude-dir=node_modules >> docs/PROJECT_STATS.md
    echo '```' >> docs/PROJECT_STATS.md
    echo "" >> docs/PROJECT_STATS.md
else
    # Fallback to basic counting
    echo "### Lines of Code (Basic Count)" >> docs/PROJECT_STATS.md
    echo "" >> docs/PROJECT_STATS.md
    
    js_lines=$(find src -name "*.js" -exec wc -l {} + | tail -1 | awk '{print $1}')
    js_files=$(find src -name "*.js" | wc -l)
    
    echo "- JavaScript files: $js_files" >> docs/PROJECT_STATS.md
    echo "- Total JavaScript lines: $js_lines" >> docs/PROJECT_STATS.md
    echo "" >> docs/PROJECT_STATS.md
fi

# Test statistics
echo "### Test Statistics" >> docs/PROJECT_STATS.md
echo "" >> docs/PROJECT_STATS.md

test_files=$(find tests -name "*.test.js" | wc -l)
echo "- Test files: $test_files" >> docs/PROJECT_STATS.md

# Count test cases (basic grep)
test_cases=$(grep -r "it\|test\|describe" tests/ --include="*.js" | wc -l)
echo "- Test cases (approximate): $test_cases" >> docs/PROJECT_STATS.md
echo "" >> docs/PROJECT_STATS.md

# Documentation statistics
echo "### Documentation Statistics" >> docs/PROJECT_STATS.md
echo "" >> docs/PROJECT_STATS.md

doc_files=$(find . -name "*.md" -not -path "./node_modules/*" | wc -l)
doc_lines=$(find . -name "*.md" -not -path "./node_modules/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")

echo "- Documentation files: $doc_files" >> docs/PROJECT_STATS.md
echo "- Documentation lines: $doc_lines" >> docs/PROJECT_STATS.md
echo "" >> docs/PROJECT_STATS.md

# Dependencies
echo "### Dependencies" >> docs/PROJECT_STATS.md
echo "" >> docs/PROJECT_STATS.md

if [ -f "package.json" ]; then
    prod_deps=$(node -p "Object.keys(require('./package.json').dependencies || {}).length")
    dev_deps=$(node -p "Object.keys(require('./package.json').devDependencies || {}).length")
    
    echo "- Production dependencies: $prod_deps" >> docs/PROJECT_STATS.md
    echo "- Development dependencies: $dev_deps" >> docs/PROJECT_STATS.md
    echo "" >> docs/PROJECT_STATS.md
fi

# Add generation timestamp
echo "---" >> docs/PROJECT_STATS.md
echo "" >> docs/PROJECT_STATS.md
echo "*Generated on: $(date)*" >> docs/PROJECT_STATS.md

echo "✅ Project statistics generated in docs/PROJECT_STATS.md"

# 5. Update README badges (if applicable)
echo "🏷️  Updating README badges..."
if [ -f "README.md" ]; then
    # This is a placeholder - you can customize based on your CI/CD setup
    echo "ℹ️  README.md exists - consider adding status badges for:"
    echo "   - Build status"
    echo "   - Test coverage"
    echo "   - Version"
    echo "   - License"
    echo "   - Dependencies status"
fi

# 6. Generate table of contents for documentation
echo "📑 Generating table of contents..."
cat > docs/README.md << 'EOF'
# Documentation

This directory contains comprehensive documentation for the GGcode Compiler project.

## Table of Contents

### Core Documentation
- [Architecture](ARCHITECTURE.md) - System architecture and design decisions
- [Project Structure](PROJECT_STRUCTURE.md) - File organization and structure
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions

### API Documentation
- [API Reference](api/index.html) - Generated API documentation (JSDoc)

### Development
- [Contributing Guidelines](../CONTRIBUTING.md) - How to contribute to the project
- [Project Statistics](PROJECT_STATS.md) - Automatically generated project metrics

### Visual Documentation
- [Client Dependencies](client-dependencies.png) - Client-side module dependency graph
- [Server Dependencies](server-dependencies.png) - Server-side module dependency graph

### Test Coverage
- [Coverage Report](coverage/index.html) - Detailed test coverage report

## Documentation Maintenance

This documentation is automatically maintained through:
- Git hooks for validation
- GitHub Actions for continuous updates
- Automated generation scripts

To regenerate documentation:
```bash
./scripts/generate-docs.sh
```

To validate documentation:
```bash
./scripts/check-project-health.sh
```

---

*Last updated: $(date)*
EOF

echo "✅ Documentation table of contents generated"

# 7. Validate generated documentation
echo "🔍 Validating generated documentation..."
validation_errors=0

# Check if all referenced files exist
docs_to_check=("ARCHITECTURE.md" "PROJECT_STRUCTURE.md" "DEPLOYMENT.md" "PROJECT_STATS.md")
for doc in "${docs_to_check[@]}"; do
    if [ ! -f "docs/$doc" ]; then
        echo "❌ Missing documentation: docs/$doc"
        ((validation_errors++))
    fi
done

if [ $validation_errors -eq 0 ]; then
    echo "✅ Documentation validation passed"
else
    echo "⚠️  Documentation validation found $validation_errors issue(s)"
fi

echo ""
echo "🎉 Documentation generation completed!"
echo ""
echo "Generated documentation:"
echo "- API documentation in docs/api/"
echo "- Project statistics in docs/PROJECT_STATS.md"
echo "- Documentation index in docs/README.md"
if command -v madge >/dev/null 2>&1; then
    echo "- Dependency graphs in docs/"
fi
if [ -d "docs/coverage" ]; then
    echo "- Test coverage report in docs/coverage/"
fi
echo ""
echo "Next steps:"
echo "1. Review the generated documentation"
echo "2. Commit any updates to version control"
echo "3. Consider setting up automated documentation deployment"