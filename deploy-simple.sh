#!/bin/bash

echo "Simple GGcode Deploy"
echo "===================="

# Download latest code
echo "Downloading latest..."
if command -v git >/dev/null 2>&1; then
    git clone https://github.com/1T17/GGcode-node.git temp-node --quiet
else
    curl -L -o temp.zip https://github.com/1T17/GGcode-node/archive/main.zip --silent
    unzip temp.zip 2>/dev/null && mv GGcode-node-main temp-node || mv GGcode-node-master temp-node
fi

if [ -d temp-node ]; then
    echo "Downloaded OK"
    # Backup current and copy new
    mkdir -p backup-$(date +%Y%m%d_%H%M%S)
    cp -r src views public backup-$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    cp -r temp-node/* ./
    echo "Files updated"
else
    echo "Download failed"
    exit 1
fi

# Build
echo "Building..."
if [ -f "package.json" ]; then
    npm install --silent
    npm run build 2>/dev/null || echo "Build warnings ignored"
fi

# Ensures JS file
mkdir -p public/js
if [ ! -f "public/js/main.js" ] && [ -f "src/client/js/main.js" ]; then
    cp src/client/js/main.js public/js/main.js
fi

# Cleanup
rm -rf temp-node temp.zip

echo "Deploy complete! Run: node ggcode.js"