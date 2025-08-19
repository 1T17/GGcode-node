#!/bin/bash

# Project health check script
# Comprehensive check of project status and potential issues

set -e

echo "🏥 Running GGcode Compiler project health check..."
echo ""

# Initialize counters
warnings=0
errors=0

# Helper functions
warn() {
    echo "⚠️  WARNING: $1"
    ((warnings++))
}

error() {
    echo "❌ ERROR: $1"
    ((errors++))
}

success() {
    echo "✅ $1"
}

info() {
    echo "ℹ️  $1"
}

# 1. Check Node.js and npm versions
echo "🔍 Checking Node.js environment..."
if command -v node >/dev/null 2>&1; then
    node_version=$(node --version)
    success "Node.js version: $node_version"
    
    # Check if version meets requirements
    if [[ "$node_version" < "v16.0.0" ]]; then
        error "Node.js version $node_version is below minimum requirement (16.0.0)"
    fi
else
    error "Node.js not found"
fi

if command -v npm >/dev/null 2>&1; then
    npm_version=$(npm --version)
    success "npm version: $npm_version"
else
    error "npm not found"
fi

# 2. Check package.json and dependencies
echo ""
echo "📦 Checking package configuration..."
if [ -f "package.json" ]; then
    success "package.json exists"
    
    # Check for required scripts
    required_scripts=("start" "dev" "test" "lint" "build")
    for script in "${required_scripts[@]}"; do
        if npm run-script --silent "$script" --dry-run >/dev/null 2>&1; then
            success "Script '$script' is defined"
        else
            warn "Script '$script' is missing"
        fi
    done
    
    # Check for security vulnerabilities
    if npm audit --audit-level=high --dry-run >/dev/null 2>&1; then
        success "No high-severity security vulnerabilities"
    else
        warn "Security vulnerabilities found - run 'npm audit' for details"
    fi
else
    error "package.json not found"
fi

if [ -f "package-lock.json" ]; then
    success "package-lock.json exists"
else
    warn "package-lock.json missing - run 'npm install'"
fi

# 3. Check project structure
echo ""
echo "📁 Checking project structure..."
required_dirs=("src" "src/client" "src/server" "tests" "docs")
for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        success "Directory '$dir' exists"
    else
        error "Required directory '$dir' is missing"
    fi
done

required_files=("README.md" "CHANGELOG.md" "CONTRIBUTING.md" ".eslintrc.js")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        success "File '$file' exists"
    else
        warn "Recommended file '$file' is missing"
    fi
done

# 4. Check Git configuration
echo ""
echo "🔧 Checking Git configuration..."
if [ -d ".git" ]; then
    success "Git repository initialized"
    
    # Check if hooks are configured
    if [ -d ".githooks" ]; then
        success "Git hooks directory exists"
        
        hooks_path=$(git config core.hooksPath || echo "")
        if [ "$hooks_path" = ".githooks" ]; then
            success "Git hooks are configured"
        else
            warn "Git hooks not configured - run 'git config core.hooksPath .githooks'"
        fi
    else
        warn "Git hooks directory missing"
    fi
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        info "Uncommitted changes detected"
    else
        success "Working directory is clean"
    fi
else
    warn "Not a Git repository"
fi

# 5. Check code quality
echo ""
echo "🔧 Checking code quality..."
if npm run lint --silent >/dev/null 2>&1; then
    success "ESLint passes"
else
    warn "ESLint issues found - run 'npm run lint' for details"
fi

if npm run format:check --silent >/dev/null 2>&1; then
    success "Code formatting is correct"
else
    warn "Code formatting issues - run 'npm run format' to fix"
fi

# 6. Check tests
echo ""
echo "🧪 Checking test suite..."
if npm test --silent >/dev/null 2>&1; then
    success "All tests pass"
else
    error "Some tests are failing - run 'npm test' for details"
fi

# Check test coverage
if [ -d "coverage" ]; then
    success "Test coverage reports available"
else
    info "No test coverage reports - run 'npm run test:coverage'"
fi

# 7. Check documentation
echo ""
echo "📚 Checking documentation..."
doc_files=("README.md" "CHANGELOG.md" "CONTRIBUTING.md" "docs/ARCHITECTURE.md" "docs/DEPLOYMENT.md")
for doc in "${doc_files[@]}"; do
    if [ -f "$doc" ] && [ -s "$doc" ]; then
        success "Documentation file '$doc' exists and is not empty"
    elif [ -f "$doc" ]; then
        warn "Documentation file '$doc' is empty"
    else
        warn "Documentation file '$doc' is missing"
    fi
done

# 8. Check environment configuration
echo ""
echo "🔐 Checking environment configuration..."
if [ -f ".env" ]; then
    success ".env file exists"
else
    info ".env file not found - create one for local development"
fi

if [ -f ".env.example" ]; then
    success ".env.example template exists"
else
    warn ".env.example template missing"
fi

# 9. Check native dependencies
echo ""
echo "🔗 Checking native dependencies..."
if [ -f "libggcode.so" ]; then
    success "Native library libggcode.so found"
    
    # Check if library is executable
    if [ -x "libggcode.so" ]; then
        success "Native library has execute permissions"
    else
        warn "Native library missing execute permissions"
    fi
else
    error "Native library libggcode.so not found"
fi

# 10. Check disk space and performance
echo ""
echo "💾 Checking system resources..."
if command -v df >/dev/null 2>&1; then
    disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 90 ]; then
        success "Disk space usage: ${disk_usage}%"
    else
        warn "Disk space usage high: ${disk_usage}%"
    fi
fi

if [ -d "node_modules" ]; then
    if command -v du >/dev/null 2>&1; then
        node_modules_size=$(du -sh node_modules 2>/dev/null | cut -f1)
        success "node_modules size: $node_modules_size"
    fi
fi

# 11. Check for common issues
echo ""
echo "🔍 Checking for common issues..."

# Check for large files
large_files=$(find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null || true)
if [ -n "$large_files" ]; then
    warn "Large files found (>10MB):"
    echo "$large_files"
else
    success "No unusually large files found"
fi

# Check for TODO/FIXME comments
todo_count=$(find src -name "*.js" -exec grep -l "TODO\|FIXME" {} \; 2>/dev/null | wc -l || echo "0")
if [ "$todo_count" -gt 0 ]; then
    info "$todo_count file(s) contain TODO/FIXME comments"
else
    success "No TODO/FIXME comments found"
fi

# Summary
echo ""
echo "📊 Health Check Summary"
echo "======================"
success "Checks completed"
if [ $errors -gt 0 ]; then
    echo "❌ Errors: $errors"
fi
if [ $warnings -gt 0 ]; then
    echo "⚠️  Warnings: $warnings"
fi

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo "🎉 Project health is excellent!"
    exit 0
elif [ $errors -eq 0 ]; then
    echo "✅ Project health is good (minor warnings)"
    exit 0
else
    echo "⚠️  Project has issues that need attention"
    exit 1
fi