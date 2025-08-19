#!/bin/bash

# Verification script for maintenance setup
# Ensures all hooks and automation are properly configured

set -e

echo "🔍 Verifying GGcode Compiler maintenance setup..."
echo ""

# Initialize counters
checks_passed=0
checks_failed=0

# Helper functions
check_pass() {
    echo "✅ $1"
    ((checks_passed++))
}

check_fail() {
    echo "❌ $1"
    ((checks_failed++))
}

check_warn() {
    echo "⚠️  $1"
}

# 1. Verify Git hooks
echo "🪝 Checking Git hooks..."
if [ -d ".githooks" ]; then
    check_pass "Git hooks directory exists"
    
    # Check individual hooks
    hooks=("pre-commit" "commit-msg" "post-commit")
    for hook in "${hooks[@]}"; do
        if [ -f ".githooks/$hook" ] && [ -x ".githooks/$hook" ]; then
            check_pass "Hook $hook is present and executable"
        else
            check_fail "Hook $hook is missing or not executable"
        fi
    done
    
    # Check if hooks are configured
    hooks_path=$(git config core.hooksPath 2>/dev/null || echo "")
    if [ "$hooks_path" = ".githooks" ]; then
        check_pass "Git hooks are properly configured"
    else
        check_fail "Git hooks not configured - run 'git config core.hooksPath .githooks'"
    fi
else
    check_fail "Git hooks directory missing"
fi

# 2. Verify GitHub Actions
echo ""
echo "🤖 Checking GitHub Actions..."
if [ -d ".github/workflows" ]; then
    check_pass "GitHub Actions directory exists"
    
    workflows=("ci.yml" "release.yml" "documentation.yml")
    for workflow in "${workflows[@]}"; do
        if [ -f ".github/workflows/$workflow" ]; then
            check_pass "Workflow $workflow exists"
        else
            check_fail "Workflow $workflow is missing"
        fi
    done
else
    check_fail "GitHub Actions directory missing"
fi

# 3. Verify maintenance scripts
echo ""
echo "📜 Checking maintenance scripts..."
if [ -d "scripts" ]; then
    check_pass "Scripts directory exists"
    
    scripts=("setup-hooks.sh" "check-project-health.sh" "update-dependencies.sh" "generate-docs.sh")
    for script in "${scripts[@]}"; do
        if [ -f "scripts/$script" ] && [ -x "scripts/$script" ]; then
            check_pass "Script $script is present and executable"
        else
            check_fail "Script $script is missing or not executable"
        fi
    done
else
    check_fail "Scripts directory missing"
fi

# 4. Verify package.json scripts
echo ""
echo "📦 Checking npm scripts..."
if [ -f "package.json" ]; then
    check_pass "package.json exists"
    
    # Check for maintenance scripts
    maintenance_scripts=("setup" "maintenance:health" "maintenance:deps" "maintenance:docs")
    for script in "${maintenance_scripts[@]}"; do
        if npm run-script --silent "$script" --dry-run >/dev/null 2>&1; then
            check_pass "npm script '$script' is defined"
        else
            check_fail "npm script '$script' is missing"
        fi
    done
else
    check_fail "package.json missing"
fi

# 5. Verify configuration files
echo ""
echo "⚙️  Checking configuration files..."
config_files=(".eslintrc.js" ".jsdoc.json" ".github/markdown-link-check-config.json")
for config in "${config_files[@]}"; do
    if [ -f "$config" ]; then
        check_pass "Configuration file $config exists"
    else
        check_fail "Configuration file $config is missing"
    fi
done

# 6. Verify documentation
echo ""
echo "📚 Checking documentation..."
doc_files=("MAINTENANCE.md" "README.md" "CHANGELOG.md" "CONTRIBUTING.md")
for doc in "${doc_files[@]}"; do
    if [ -f "$doc" ] && [ -s "$doc" ]; then
        check_pass "Documentation file $doc exists and is not empty"
    elif [ -f "$doc" ]; then
        check_warn "Documentation file $doc exists but is empty"
    else
        check_fail "Documentation file $doc is missing"
    fi
done

# 7. Test Git hooks functionality
echo ""
echo "🧪 Testing Git hooks functionality..."
if [ -d ".git" ]; then
    # Test pre-commit hook (dry run)
    if .githooks/pre-commit >/dev/null 2>&1; then
        check_pass "Pre-commit hook executes successfully"
    else
        check_warn "Pre-commit hook execution failed (may be due to no staged files)"
    fi
    
    # Test commit-msg hook with valid message
    echo "feat: test commit message" > /tmp/test-commit-msg
    if .githooks/commit-msg /tmp/test-commit-msg >/dev/null 2>&1; then
        check_pass "Commit-msg hook validates correctly"
    else
        check_fail "Commit-msg hook validation failed"
    fi
    rm -f /tmp/test-commit-msg
else
    check_warn "Not in a Git repository - cannot test hooks"
fi

# 8. Test maintenance scripts
echo ""
echo "🔧 Testing maintenance scripts..."

# Test health check script
if ./scripts/check-project-health.sh >/dev/null 2>&1; then
    check_pass "Health check script executes successfully"
else
    check_warn "Health check script found issues (this may be expected)"
fi

# Test documentation generation (dry run)
if command -v jsdoc >/dev/null 2>&1; then
    check_pass "JSDoc is available for documentation generation"
else
    check_warn "JSDoc not available - install with 'npm install -g jsdoc'"
fi

# 9. Verify development environment
echo ""
echo "🛠️  Checking development environment..."

# Check Node.js version
if command -v node >/dev/null 2>&1; then
    node_version=$(node --version)
    if [[ "$node_version" > "v16.0.0" ]]; then
        check_pass "Node.js version $node_version meets requirements"
    else
        check_fail "Node.js version $node_version is below minimum (16.0.0)"
    fi
else
    check_fail "Node.js not found"
fi

# Check npm version
if command -v npm >/dev/null 2>&1; then
    npm_version=$(npm --version)
    check_pass "npm version $npm_version is available"
else
    check_fail "npm not found"
fi

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    check_pass "Dependencies are installed"
else
    check_warn "Dependencies not installed - run 'npm install'"
fi

# Summary
echo ""
echo "📊 Verification Summary"
echo "======================"
echo "✅ Checks passed: $checks_passed"
echo "❌ Checks failed: $checks_failed"

if [ $checks_failed -eq 0 ]; then
    echo ""
    echo "🎉 All maintenance setup verification checks passed!"
    echo ""
    echo "Your GGcode Compiler project is fully configured with:"
    echo "- Git hooks for code quality enforcement"
    echo "- GitHub Actions for CI/CD automation"
    echo "- Maintenance scripts for regular upkeep"
    echo "- Comprehensive documentation"
    echo ""
    echo "Next steps:"
    echo "1. Make your first commit to test the hooks"
    echo "2. Push to GitHub to trigger CI/CD workflows"
    echo "3. Set up regular maintenance schedule"
    echo "4. Review MAINTENANCE.md for ongoing procedures"
    echo ""
    exit 0
else
    echo ""
    echo "⚠️  Some verification checks failed!"
    echo "Please address the failed checks before proceeding."
    echo ""
    echo "Common fixes:"
    echo "- Run './scripts/setup-hooks.sh' to configure Git hooks"
    echo "- Run 'npm install' to install dependencies"
    echo "- Ensure all required files are present"
    echo ""
    exit 1
fi