#!/bin/bash

# Smart Commit Script for GGcode Compiler
# Interactive commit workflow with documentation automation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Smart Commit Workflow${NC}"
echo "=================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a Git repository${NC}"
    exit 1
fi

# Check for changes
STAGED_FILES=$(git diff --cached --name-only)
MODIFIED_FILES=$(git diff --name-only)
DELETED_FILES=$(git diff --name-only --diff-filter=D)
UNTRACKED_FILES=$(git ls-files --others --exclude-standard)

# Show current status
echo -e "${BLUE}📊 Repository Status${NC}"
if [ -n "$STAGED_FILES" ]; then
    echo -e "${GREEN}Staged files:${NC}"
    echo "$STAGED_FILES" | sed 's/^/  ✓ /'
fi

if [ -n "$MODIFIED_FILES" ]; then
    echo -e "${YELLOW}Modified/Deleted files:${NC}"
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            echo "  ⚠ $file (modified)"
        else
            echo "  🗑 $file (deleted)"
        fi
    done <<< "$MODIFIED_FILES"
fi

if [ -n "$UNTRACKED_FILES" ]; then
    echo -e "${BLUE}New files:${NC}"
    echo "$UNTRACKED_FILES" | sed 's/^/  + /'
fi

# If no staged files, ask what to stage
if [ -z "$STAGED_FILES" ]; then
    echo ""
    echo -e "${BLUE}📁 File Staging Options${NC}"
    echo "What would you like to commit?"
    echo "1) All changes (modified + untracked)"
    echo "2) Only modified files (no new files)"
    echo "3) Select specific files"
    echo "4) Cancel"
    
    read -p "Enter choice (1-4): " STAGING_CHOICE
    
    case $STAGING_CHOICE in
        1)
            echo "Staging all changes..."
            git add .
            ;;
        2)
            echo "Staging only modified files (including deletions)..."
            # Use git add -u to stage all tracked file changes (modifications and deletions)
            git add -u
            echo "  ✓ Staged all tracked file changes"
            ;;
        3)
            echo "Available files to stage:"
            ALL_CHANGES=$(echo -e "$MODIFIED_FILES\n$UNTRACKED_FILES" | grep -v '^$')
            if [ -z "$ALL_CHANGES" ]; then
                echo -e "${RED}❌ No files to stage${NC}"
                exit 1
            fi
            
            echo "$ALL_CHANGES" | nl -w2 -s') '
            echo ""
            read -p "Enter file numbers (space-separated, e.g., '1 3 5'): " FILE_NUMBERS
            
            if [ -z "$FILE_NUMBERS" ]; then
                echo -e "${RED}❌ No files selected${NC}"
                exit 1
            fi
            
            # Stage selected files
            for num in $FILE_NUMBERS; do
                FILE_TO_STAGE=$(echo "$ALL_CHANGES" | sed -n "${num}p")
                if [ -n "$FILE_TO_STAGE" ] && [ -f "$FILE_TO_STAGE" ]; then
                    if git add "$FILE_TO_STAGE"; then
                        echo "  ✓ Staged: $FILE_TO_STAGE"
                    else
                        echo "  ⚠ Failed to stage: $FILE_TO_STAGE"
                    fi
                elif [ -n "$FILE_TO_STAGE" ]; then
                    echo "  ⚠ File not found: $FILE_TO_STAGE"
                fi
            done
            ;;
        4)
            echo -e "${YELLOW}❌ Cancelled${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid choice${NC}"
            exit 1
            ;;
    esac
    
    # Update staged files list
    STAGED_FILES=$(git diff --cached --name-only)
fi

# Final check
if [ -z "$STAGED_FILES" ]; then
    echo -e "${RED}❌ No files staged for commit${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}📁 Files to be committed:${NC}"
echo "$STAGED_FILES" | sed 's/^/  ✓ /'
echo ""

# Ask about documentation updates
echo -e "${BLUE}📚 Documentation Updates${NC}"
echo "Would you like to update documentation before committing?"

# Ask about project structure update
read -p "🏗️  Update project structure in README? (y/N): " UPDATE_STRUCTURE
if [[ $UPDATE_STRUCTURE =~ ^[Yy]$ ]]; then
    echo "Updating project structure..."
    npm run update-structure
    git add README.md
    echo -e "${GREEN}✅ Project structure updated${NC}"
fi

# Ask about changelog update
read -p "📝 Add changelog entry? (y/N): " UPDATE_CHANGELOG
if [[ $UPDATE_CHANGELOG =~ ^[Yy]$ ]]; then
    # Get current version from package.json
    CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "1.0.0")
    
    echo "Current version: $CURRENT_VERSION"
    read -p "Enter version for changelog (or press Enter for '$CURRENT_VERSION'): " CHANGELOG_VERSION
    
    if [ -z "$CHANGELOG_VERSION" ]; then
        CHANGELOG_VERSION=$CURRENT_VERSION
    fi
    
    echo "Adding changelog entry for version $CHANGELOG_VERSION..."
    npm run update-changelog "$CHANGELOG_VERSION"
    git add CHANGELOG.md
    echo -e "${GREEN}✅ Changelog updated${NC}"
fi

echo ""

# Commit type selection
echo -e "${BLUE}📝 Commit Information${NC}"
echo "Select commit type:"
echo "1) feat     - A new feature"
echo "2) fix      - A bug fix"  
echo "3) docs     - Documentation changes"
echo "4) style    - Code style changes (formatting, etc.)"
echo "5) refactor - Code refactoring"
echo "6) test     - Adding or updating tests"
echo "7) chore    - Maintenance tasks"
echo "8) perf     - Performance improvements"
echo "9) ci       - CI/CD changes"
echo "10) build   - Build system changes"

read -p "Enter choice (1-10): " COMMIT_TYPE_CHOICE

case $COMMIT_TYPE_CHOICE in
    1) COMMIT_TYPE="feat" ;;
    2) COMMIT_TYPE="fix" ;;
    3) COMMIT_TYPE="docs" ;;
    4) COMMIT_TYPE="style" ;;
    5) COMMIT_TYPE="refactor" ;;
    6) COMMIT_TYPE="test" ;;
    7) COMMIT_TYPE="chore" ;;
    8) COMMIT_TYPE="perf" ;;
    9) COMMIT_TYPE="ci" ;;
    10) COMMIT_TYPE="build" ;;
    *) 
        echo -e "${RED}❌ Invalid choice. Using 'chore'${NC}"
        COMMIT_TYPE="chore"
        ;;
esac

# Optional scope
read -p "Enter scope (optional, e.g., 'api', 'editor'): " COMMIT_SCOPE

# Commit message
read -p "Enter commit description: " COMMIT_DESC

if [ -z "$COMMIT_DESC" ]; then
    echo -e "${RED}❌ Commit description is required${NC}"
    exit 1
fi

# Build commit message
if [ -n "$COMMIT_SCOPE" ]; then
    COMMIT_MSG="${COMMIT_TYPE}(${COMMIT_SCOPE}): ${COMMIT_DESC}"
else
    COMMIT_MSG="${COMMIT_TYPE}: ${COMMIT_DESC}"
fi

# Optional commit body
read -p "Enter additional details (optional, press Enter to skip): " COMMIT_BODY

if [ -n "$COMMIT_BODY" ]; then
    COMMIT_MSG="${COMMIT_MSG}

${COMMIT_BODY}"
fi

echo ""
echo -e "${BLUE}📋 Commit Summary${NC}"
echo "Type: $COMMIT_TYPE"
if [ -n "$COMMIT_SCOPE" ]; then
    echo "Scope: $COMMIT_SCOPE"
fi
echo "Message: $COMMIT_DESC"
if [ -n "$COMMIT_BODY" ]; then
    echo "Body: $COMMIT_BODY"
fi
echo ""
echo "Full commit message:"
echo -e "${YELLOW}$COMMIT_MSG${NC}"
echo ""

# Final confirmation
read -p "Proceed with commit? (Y/n): " CONFIRM_COMMIT
if [[ $CONFIRM_COMMIT =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}❌ Commit cancelled${NC}"
    exit 0
fi

# Run pre-commit checks
echo -e "${BLUE}🔍 Running pre-commit checks...${NC}"

# Check if there are any linting issues
if command -v npm >/dev/null 2>&1; then
    echo "Running linter..."
    if ! npm run lint; then
        read -p "Linting failed. Continue anyway? (y/N): " CONTINUE_LINT
        if [[ ! $CONTINUE_LINT =~ ^[Yy]$ ]]; then
            echo -e "${RED}❌ Commit cancelled due to linting issues${NC}"
            exit 1
        fi
    fi
    
    echo "Checking code formatting..."
    if ! npm run format:check; then
        read -p "Formatting issues found. Auto-fix and continue? (Y/n): " FIX_FORMAT
        if [[ ! $FIX_FORMAT =~ ^[Nn]$ ]]; then
            npm run format
            git add .
            echo -e "${GREEN}✅ Code formatted and staged${NC}"
        else
            echo -e "${RED}❌ Commit cancelled due to formatting issues${NC}"
            exit 1
        fi
    fi
    
    echo "Running tests..."
    if ! npm test; then
        read -p "Tests failed. Continue anyway? (y/N): " CONTINUE_TESTS
        if [[ ! $CONTINUE_TESTS =~ ^[Yy]$ ]]; then
            echo -e "${RED}❌ Commit cancelled due to test failures${NC}"
            exit 1
        fi
    fi
fi

# Perform the commit
echo -e "${BLUE}📤 Committing changes...${NC}"
git commit -m "$COMMIT_MSG"

COMMIT_HASH=$(git rev-parse --short HEAD)
echo -e "${GREEN}✅ Commit successful: $COMMIT_HASH${NC}"

# Ask about pushing
CURRENT_BRANCH=$(git branch --show-current)
read -p "Push to origin/$CURRENT_BRANCH? (Y/n): " PUSH_CHANGES

if [[ ! $PUSH_CHANGES =~ ^[Nn]$ ]]; then
    echo "Pushing to origin/$CURRENT_BRANCH..."
    if git push origin "$CURRENT_BRANCH"; then
        echo -e "${GREEN}✅ Push successful${NC}"
    else
        echo -e "${YELLOW}⚠️  Push failed - you may need to pull first${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Smart commit workflow completed!${NC}"
echo "Commit: $COMMIT_HASH"
echo "Branch: $CURRENT_BRANCH"
echo "Message: $COMMIT_MSG"