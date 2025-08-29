#!/bin/bash

# Quick Fix: MIME Type Error for /js/main.js
# Just run: ./fix-mime-error.sh

echo "🔧 Fixing MIME Type Error..."
echo "Creating required directories..."
mkdir -p public/js

echo "Copying main.js from src to public..."
cp src/client/js/main.js public/js/main.js

if [ ! -f "public/js/navigation.js" ]; then
    echo "Creating navigation.js..."
    cat > public/js/navigation.js << 'EOF'
// Basic navigation utils
window.showNavigationLoader = function() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'flex';
};
window.hideNavigationLoader = function() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'none';
};
console.log('Navigation loaded');
EOF
fi

echo "✅ JavaScript files are now in the correct location!"
echo "📁 Contents of public/js/:"
ls -la public/js/
echo ""
echo "🚀 Test your app now - the MIME type error should be gone!"