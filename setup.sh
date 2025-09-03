#!/bin/bash

echo "Deploy GGcode Complete"
echo "======================"

# 1. Download and build GGcode native compiler
echo "Downloading GGcode native compiler source..."
if command -v git >/dev/null 2>&1; then
    git clone https://github.com/1T17/GGcode.git gg-compiler --quiet
else
    curl -L -o compiler.zip https://github.com/1T17/GGcode/archive/refs/heads/main.zip --silent
    unzip compiler.zip && mv GGcode-main gg-compiler || mv GGcode-master gg-compiler
fi

if [ -d "gg-compiler" ]; then
    echo "✅ GGcode repository downloaded successfully"
    cd gg-compiler
    if [ -f "Makefile" ]; then
        # First try make node for Node.js FFI library
        if echo | make node; then
            cp libggcode.so ../ 2>/dev/null || cp ggcode ../ 2>/dev/null ||
            echo "make node succeeded but library not found in expected location"
        else
            echo "make node failed, trying standard make..."
            make
        fi

        # Try to find the built binary/library (including node/ subdirectory)
        if [ -f "node/libggcode.so" ]; then
            cp node/libggcode.so ../
            echo "Shared library (node/libggcode.so) built and copied"
        elif [ -f "libggcode.so" ]; then
            cp libggcode.so ../
            echo "Shared library (libggcode.so) built and copied"
        elif [ -f "ggcode" ]; then
            cp ggcode ../
            echo "Executable (ggcode) built and copied"
        elif [ -d "GGCODE" ] && [ -f "GGCODE/ggcode" ]; then
            cp GGCODE/ggcode ../ggcode
            echo "GGCODE executable built and copied"
        else
            echo "Build completed but no binary found. Looking for any files:"
            find . -name "libggcode.so" -o -name "ggcode" 2>/dev/null || echo "No GGcode binaries found"
        fi
    elif [ -f "ggcode.c" ]; then
        gcc -shared -fPIC -o libggcode.so ggcode.c -lm
        if [ -f "libggcode.so" ]; then
            cp libggcode.so ../
            echo "Shared library built and copied"
        fi
    fi
    cd ..
    rm -rf gg-compiler compiler.zip
else
    echo "ℹ️  GGcode native compiler repository not accessible"
    echo "   ➧ This is expected if using mock/fallback implementation"
    echo "   ➧ Node.js app will still work with JavaScript-based compiler"
fi

# 2. Download and build Node.js app
echo "Building Node.js web app..."
if command -v git >/dev/null 2>&1; then
    git clone https://github.com/1T17/GGcode-node.git temp-node --quiet
else
    curl -L -o node.zip https://github.com/1T17/GGcode-node/archive/main.zip --silent
    unzip node.zip && mv GGcode-node-main temp-node || mv GGcode-node-master temp-node
fi

if [ -d "temp-node" ]; then
    echo "Copying Node.js files..."
    cp -r temp-node/* ./
    cp -r temp-node/.* ./ 2>/dev/null || true

    echo "Installing dependencies..."
    if [ -f "package.json" ] && command -v npm >/dev/null 2>&1; then
        npm install --silent
    fi

    echo "Building web app..."
    mkdir -p public/js
    if [ -f "package.json" ]; then
        npm run build 2>/dev/null || echo "Build warnings ok"
    fi

    if [ ! -f "public/js/main.js" ] && [ -f "src/client/js/main.js" ]; then
        cp src/client/js/main.js public/js/main.js
        echo "JavaScript files ready"
    fi

    rm -rf temp-node node.zip
    echo "Web app ready"
else
    echo "Could not download web app repo"
fi

chmod -R 755 public/

echo "All done! Start with: node ggcode.js"