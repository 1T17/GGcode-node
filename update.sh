#!/bin/bash

# 🚀 Simple GGcode Update Script
echo "🚀 Simple GGcode Update"
echo "======================="

# Configuration
NODE_REPO_URL="https://github.com/1T17/GGcode-node.git"
NODE_DOWNLOAD_DIR="GGcode-node-temp"

# Step 1: Download
echo "📥 Downloading latest repository..."
if command -v git >/dev/null 2>&1; then
    rm -rf "$NODE_DOWNLOAD_DIR"
    git clone "$NODE_REPO_URL" "$NODE_DOWNLOAD_DIR" --quiet
else
    curl -L -o ggcode-node.zip "$NODE_REPO_URL/archive/main.zip" --silent
    unzip -q ggcode-node.zip 2>/dev/null || unzip -o ggcode-node.zip 2>/dev/null || true
    EXTRACTED_DIR=$(ls -d GGcode-node* 2>/dev/null | grep -v ggcode-node.zip | head -1 || echo "")
    mv "$EXTRACTED_DIR" "$NODE_DOWNLOAD_DIR"
fi

if [ ! -d "$NODE_DOWNLOAD_DIR" ]; then
    echo "❌ Download failed"
    exit 1
fi

# Step 2: Backup GG compiler
if [ -f "libggcode.so" ]; then
    echo "💾 Backing up GG compiler..."
    cp libggcode.so libggcode.so.backup
fi

# Step 3: Simple 1-to-1 copy
echo "📋 Copying entire repository (1-to-1)..."
cp -r "$NODE_DOWNLOAD_DIR"/* "$NODE_DOWNLOAD_DIR"/.* . 2>/dev/null || true
if [ -f "libggcode.so.backup" ]; then
    mv libggcode.so.backup libggcode.so
fi

# Step 4: Build Logic
echo "🔨 Building components..."
if [ -f "Makefile" ]; then
    echo "📋 Found Makefile, building..."
    make
elif [ -f "ggcode.c" ]; then
    echo "🔨 Building GG compiler..."
    gcc -shared -o libggcode.so ggcode.c
elif [ -f "ggcode.cpp" ]; then
    echo "🔨 Building GG compiler..."
    g++ -shared -o libggcode.so ggcode.cpp
fi

if [ -f "package.json" ]; then
    if command -v npm >/dev/null 2>&1; then
        echo "📦 Installing dependencies..."
        npm install --silent
    fi
fi

# Step 5: Cleanup
echo "🧹 Cleaning up..."
rm -rf "$NODE_DOWNLOAD_DIR" GGcode-node* ggcode-node.zip

# Step 6: Verify
echo "🔍 Verification:"
[ -f "package.json" ] && echo "✅ package.json" || echo "❌ package.json missing"
[ -f "ggcode.js" ] && echo "✅ ggcode.js" || echo "❌ ggcode.js missing"
[ -d "src" ] && echo "✅ src/" || echo "❌ src/ missing"
[ -d "views" ] && echo "✅ views/" || echo "❌ views/ missing"
[ -d "public" ] && echo "✅ public/" || echo "❌ public/ missing"
[ -f "libggcode.so" ] && echo "✅ libggcode.so" || echo "❌ libggcode.so missing"

echo "🎉 Update complete! Ready to run: node ggcode.js"