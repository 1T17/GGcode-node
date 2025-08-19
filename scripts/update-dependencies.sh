#!/bin/bash

# Automated dependency update script
# Safely updates dependencies and runs tests

set -e

echo "📦 Updating dependencies for GGcode Compiler..."

# 1. Backup current package-lock.json
if [ -f "package-lock.json" ]; then
    cp package-lock.json package-lock.json.backup
    echo "✅ Backed up package-lock.json"
fi

# 2. Check for outdated packages
echo "🔍 Checking for outdated packages..."
npm outdated || true

# 3. Update dependencies
echo "⬆️  Updating dependencies..."

# Update patch and minor versions only (safer)
npm update

# 4. Check for security vulnerabilities
echo "🔒 Running security audit..."
if ! npm audit --audit-level=moderate; then
    echo "⚠️  Security vulnerabilities found!"
    echo "Run 'npm audit fix' to attempt automatic fixes"
    
    # Attempt automatic fixes for non-breaking changes
    npm audit fix --only=prod
    
    echo "🔍 Re-running security audit..."
    npm audit --audit-level=moderate || echo "⚠️  Manual review required for remaining vulnerabilities"
fi

# 5. Run tests to ensure nothing broke
echo "🧪 Running tests to verify updates..."
if npm test; then
    echo "✅ All tests passed after dependency updates"
else
    echo "❌ Tests failed after dependency updates"
    echo "Restoring previous package-lock.json..."
    
    if [ -f "package-lock.json.backup" ]; then
        mv package-lock.json.backup package-lock.json
        npm ci
        echo "✅ Restored previous dependencies"
    fi
    
    exit 1
fi

# 6. Run linting to check for any issues
echo "🔧 Running linting checks..."
if npm run lint; then
    echo "✅ Linting passed"
else
    echo "⚠️  Linting issues found - may need manual fixes"
fi

# 7. Check bundle size impact
echo "📊 Checking bundle size impact..."
if command -v du >/dev/null 2>&1; then
    current_size=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo "Current node_modules size: $current_size"
fi

# 8. Clean up
rm -f package-lock.json.backup

echo ""
echo "🎉 Dependency update completed!"
echo ""
echo "Summary:"
echo "- Dependencies updated to latest compatible versions"
echo "- Security audit completed"
echo "- Tests verified"
echo "- Linting checked"
echo ""
echo "Next steps:"
echo "1. Review the changes: git diff package.json package-lock.json"
echo "2. Test the application manually"
echo "3. Commit the changes if everything looks good"
echo ""