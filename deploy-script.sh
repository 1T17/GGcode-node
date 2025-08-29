#!/bin/bash

# 🚀 Deployment Script for GGcode Web App
echo "🚀 Deploying GGcode Web App..."

# Step 1: Ensure public/js directory exists
echo "📁 Creating public/js directory..."
mkdir -p public/js

# Step 2: Copy main.js from source to public
echo "📄 Copying main.js to public location..."
cp src/client/js/main.js public/js/main.js

# Step 3: Copy navigation.js (we'll assume it exists or create basic version)
echo "📄 Creating navigation.js..."
cat > public/js/navigation.js << 'EOF'
// Navigation helper functions for GGcode Web Application
window.navigationState = { isLoading: false, currentView: 'editor' };

function showNavigationLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'flex';
    window.navigationState.isLoading = true;
}

function hideNavigationLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'none';
    window.navigationState.isLoading = false;
}

function navigateWithLoading(transitionFn) {
    showNavigationLoader();
    try { transitionFn(); } finally {
        setTimeout(hideNavigationLoader, 300);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    hideNavigationLoader();
    console.log('Navigation system initialized');
});

window.showNavigationLoader = showNavigationLoader;
window.hideNavigationLoader = hideNavigationLoader;
window.navigateWithLoading = navigateWithLoading;
EOF

echo "✅ Deployment complete!"
echo "🔍 File structure:"
ls -la public/js/

echo "🔄 Your GGcode app is ready to deploy!"