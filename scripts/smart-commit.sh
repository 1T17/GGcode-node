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

# Auto-version bump
CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "1.0.0")
echo -e "${BLUE}📦 Current version: v$CURRENT_VERSION${NC}"

# Auto-increment patch version (1.0.1 → 1.0.2)
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

echo "Auto-bumping to v$NEW_VERSION..."

# Update package.json version
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = '$NEW_VERSION';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

git add package.json
echo -e "${GREEN}✅ Version: v$CURRENT_VERSION → v$NEW_VERSION${NC}"

# Quick documentation updates (optional)
echo -e "${BLUE}📚 Quick Updates${NC}"
read -p "Update docs? (Y/n): " UPDATE_DOCS
if [[ ! $UPDATE_DOCS =~ ^[Nn]$ ]]; then
    # Update project structure
    if [ -f "scripts/update-readme-structure.js" ]; then
        echo "Updating README structure..."
        npm run update-structure >/dev/null 2>&1
        git add README.md 2>/dev/null || true
        echo -e "${GREEN}✅ README updated${NC}"
    fi
    
    # Update changelog with NEW version
    if [ -f "scripts/update-changelog.js" ]; then
        echo "Adding changelog entry for v$NEW_VERSION..."
        npm run update-changelog "$NEW_VERSION" >/dev/null 2>&1
        git add CHANGELOG.md 2>/dev/null || true
        echo -e "${GREEN}✅ Changelog updated${NC}"
    fi
fi

echo ""

# Simple commit input
echo -e "${BLUE}📝 Commit Message${NC}"
echo "Common types: feat, fix, docs, style, refactor, test, chore"
read -p "Enter commit message (e.g., 'feat: add new feature' or just 'add new feature'): " COMMIT_INPUT

if [ -z "$COMMIT_INPUT" ]; then
    echo -e "${RED}❌ Commit message is required${NC}"
    exit 1
fi

# Auto-format commit message if it doesn't have a type
if [[ "$COMMIT_INPUT" =~ ^(feat|fix|docs|style|refactor|test|chore|perf|ci|build): ]]; then
    COMMIT_MSG="$COMMIT_INPUT (v$NEW_VERSION)"
else
    # Auto-detect type based on files
    if echo "$STAGED_FILES" | grep -q "\.md$\|README\|docs/"; then
        COMMIT_MSG="docs: $COMMIT_INPUT (v$NEW_VERSION)"
    elif echo "$STAGED_FILES" | grep -q "test\|spec"; then
        COMMIT_MSG="test: $COMMIT_INPUT (v$NEW_VERSION)"
    elif echo "$STAGED_FILES" | grep -q "src/"; then
        COMMIT_MSG="feat: $COMMIT_INPUT (v$NEW_VERSION)"
    else
        COMMIT_MSG="chore: $COMMIT_INPUT (v$NEW_VERSION)"
    fi
fi

echo ""
echo -e "${BLUE}📋 Commit Message:${NC} $COMMIT_MSG"

# Quick format check and auto-fix
if command -v npm >/dev/null 2>&1; then
    if ! npm run format:check >/dev/null 2>&1; then
        echo "Auto-fixing format..."
        npm run format >/dev/null 2>&1
        git add .
        echo -e "${GREEN}✅ Code formatted${NC}"
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
# Create version backup zip AFTER everything is committed
echo -e "${BLUE}📦 Creating version backup...${NC}"
VERSIONS_DIR="VERSIONS"
mkdir -p "$VERSIONS_DIR"

# Create zip filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_NAME="ggcode-v${NEW_VERSION}_${TIMESTAMP}.zip"
ZIP_PATH="$VERSIONS_DIR/$ZIP_NAME"

# Create zip excluding unnecessary files
zip -r "$ZIP_PATH" . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x "coverage/*" \
  -x ".nyc_output/*" \
  -x "VERSIONS/*" \
  -x "*.log" \
  -x ".DS_Store" \
  -x "*.tmp" \
  >/dev/null 2>&1

if [ -f "$ZIP_PATH" ]; then
    ZIP_SIZE=$(du -h "$ZIP_PATH" | cut -f1)
    echo -e "${GREEN}✅ Version backup: $ZIP_NAME ($ZIP_SIZE)${NC}"
    
    # Add VERSIONS folder to gitignore if not already there
    if ! grep -q "^VERSIONS/" .gitignore 2>/dev/null; then
        echo "VERSIONS/" >> .gitignore
        echo -e "${GREEN}✅ Added VERSIONS/ to .gitignore${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Failed to create version backup${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Smart commit workflow completed!${NC}"
echo "Commit: $COMMIT_HASH"
echo "Branch: $CURRENT_BRANCH"
echo "Version: v$NEW_VERSION"
echo "Message: $COMMIT_MSG"
echo "Backup: $ZIP_NAME"