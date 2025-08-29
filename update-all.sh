#!/bin/bash

echo "Deploy GGcode Complete"
echo "======================"

# 1. Download and build GG compiler
echo "Building GG compiler binary..."
if command -v git >/dev/null 2>&1; then
    git clone https://github.com/1T17/GGcode-compiler.git gg-compiler --quiet
else
    curl -L -o compiler.zip https://github.com/1T17/GGcode-compiler/archive/main.zip --silent
    unzip compiler.zip && mv GGcode-compiler-main gg-compiler || mv GGcode-compiler-master gg-compiler
fi

if [ -d "gg-compiler" ]; then
    cd gg-compiler
    if [ -f "Makefile" ]; then
        make
        cp libggcode.so ../
        echo "Binary built and copied"
    elif [ -f "ggcode.c" ]; then
        gcc -shared -o libggcode.so ggcode.c
        cp libggcode.so ../
        echo "Binary built and copied"
    fi
    cd ..
    rm -rf gg-compiler compiler.zip
else
    echo "Could not download compiler repo"
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