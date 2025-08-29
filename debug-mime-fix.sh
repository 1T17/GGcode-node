#!/bin/bash

# 🔍 Debug MIME Type Fix for GG.doorbase.io
echo "🔍 Debugging MIME Type Error Fix"
echo "=================================="

# Step 1: Check current file structure
echo "📂 Checking file structure..."
echo "public/js/ contents:"
if [ -d "public/js" ]; then
    ls -la public/js/
else
    echo "❌ public/js/ directory does not exist!"
fi

# Step 2: Check if main.js exists
echo ""
echo "🔍 Checking main.js file:"
if [ -f "public/js/main.js" ]; then
    echo "✅ main.js exists"
    echo "File size: $(wc -c < public/js/main.js) bytes"
    echo "First few lines:"
    head -3 public/js/main.js
    echo ""
    echo "MIME type check:"
    file public/js/main.js
else
    echo "❌ main.js missing!"
    echo "Available files:"
    find . -name "*main.js" 2>/dev/null || echo "No main.js files found"
fi

# Step 3: Check navigation.js
echo ""
echo "🔍 Checking navigation.js:"
if [ -f "public/js/navigation.js" ]; then
    echo "✅ navigation.js exists"
    echo "File size: $(wc -c < public/js/navigation.js) bytes"
else
    echo "❌ navigation.js missing!"
fi

# Step 4: Check server configuration
echo ""
echo "🌐 Checking server configuration:"
if [ -f "ggcode.js" ]; then
    echo "✅ ggcode.js exists"
    if grep -q "express.static" ggcode.js; then
        echo "✅ Static file serving configured"
        grep "static" ggcode.js
    else
        echo "❌ Static file serving not found!"
    fi
else
    echo "❌ ggcode.js missing!"
fi

# Step 5: Create fix if needed
echo ""
echo "🛠️  Creating fix if needed..."
if [ ! -d "public/js" ]; then
    echo "Creating public/js directory..."
    mkdir -p public/js
fi

if [ ! -f "public/js/main.js" ]; then
    echo "Copying main.js from source..."
    if [ -f "src/client/js/main.js" ]; then
        cp src/client/js/main.js public/js/main.js
        echo "✅ main.js copied"
    else
        echo "❌ Source main.js not found"
    fi
fi

if [ ! -f "public/js/navigation.js" ]; then
    echo "Creating navigation.js..."
    cat > public/js/navigation.js << 'EOF'
window.navigationState = { isLoading: false, currentView: 'editor' };
function showNavigationLoader() { const loader = document.getElementById('globalLoader'); if (loader) loader.style.display = 'flex'; }
function hideNavigationLoader() { const loader = document.getElementById('globalLoader'); if (loader) loader.style.display = 'none'; }
window.showNavigationLoader = showNavigationLoader;
window.hideNavigationLoader = hideNavigationLoader;
EOF
    echo "✅ navigation.js created"
fi

# Step 6: Test the fix
echo ""
echo "🧪 Testing fix..."
echo "Current file structure:"
ls -la public/js/

echo ""
echo "🎯 Instructions for production server:"
echo "1. Run this script on your production server: ./debug-mime-fix.sh"
echo "2. Restart your Node.js server"
echo "3. Clear browser cache (Ctrl+F5 or Ctrl+Shift+R)"
echo "4. Test your app"
echo ""
echo "If still problems, check:"
echo "- Server logs for errors"
echo "- Network panel in browser dev tools"
echo "- File permissions: chmod -R 755 public/"
echo "- Server port is accessible"