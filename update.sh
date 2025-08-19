#!/bin/bash

# Simple GGcode Server Update Script
# Downloads git to same folder, builds locally, copies files to root

echo "🚀 Simple GGcode Server Update"
echo "================================"

# Configuration
DOWNLOAD_URL="https://github.com/1T17/GGcode/archive/main.zip"

# Download and extract to current directory
echo "📥 Downloading repository..."
curl -L -o ggcode.zip "$DOWNLOAD_URL"
unzip -q ggcode.zip

# Go into downloaded directory and build
echo "🔨 Building shared library..."
cd GGcode-main
make node

# Copy all files from node directory to current directory (relative paths)
echo "📋 Copying node files..."
cp -r node/* ../

# Cleanup downloaded files
cd ..
rm -rf GGcode-main ggcode.zip

echo "✅ Update complete!"
echo "🔄 Start server: node ggcode.js" 