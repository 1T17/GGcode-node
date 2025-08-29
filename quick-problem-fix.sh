#!/bin/bash

# 🚀 Quick MIME Type Problem Fix for Production
echo "🚀 Quick MIME Type Fix"
echo "======================="

# Force fix regardless of current state
echo "🔧 Force fixing file structure..."

# Create directory
mkdir -p public/js

# Remove any existing files to ensure clean state
rm -f public/js/main.js
rm -f public/js/navigation.js

# Copy fresh files
if [ -f "src/client/js/main.js" ]; then
    cp src/client/js/main.js public/js/main.js
    echo "✅ main.js copied"
else
    echo "❌ main.js source not found!"
    find . -name "*main.js" | head -5
fi

# Create navigation.js
cat > public/js/navigation.js << 'NAV_EOF'
// Navigation loader
window.showNavigationLoader = function() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'flex';
};
window.hideNavigationLoader = function() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'none';
};
window.navigateWithLoading = function(fn) {
    window.showNavigationLoader();
    setTimeout(() => { fn(); window.hideNavigationLoader(); }, 100);
};
NAV_EOF
echo "✅ navigation.js created"

# Set proper permissions
chmod -R 755 public/
chmod 644 public/js/*.js

echo ""
echo "🎯 NEXT STEPS FOR PRODUCTION:"
echo "1. Run this script: ./quick-problem-fix.sh"
echo "2. Restart the server: kill the current Node process"
echo "3. Start server: nohup node ggcode.js &"
echo "4. Wait 10 seconds for server to start"
echo "5. Test the URL: https://gg.doorbase.io"
echo ""
echo "If problem persists:"
echo "- Check server is running: ps aux | grep node"
echo "- Check browser cache: Incognito mode"
echo "- Check server logs for errors"