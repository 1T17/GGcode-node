# GGcode Compiler - Usage Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥16.0.0
- **npm** ≥8.0.0
- **Git** (optional, for cloning)

### Installation
```bash
# Clone or navigate to your project directory
cd /home/t1/GGcode-node_DEV

# Install dependencies
npm install
```

## 🏃‍♂️ Running the Server

### Development Mode
```bash
# Start with debugging support
npm run dev

# Start with auto-restart on file changes
npm run dev:watch
```

### Production Mode
```bash
# Build client assets first
npm run build:client

# Start production server
npm run prod
```

### Other Server Commands
```bash
# Start server (basic)
npm start

# Start with production environment
NODE_ENV=production npm start
```

## 🌐 Accessing the Application

Once running, access the application at:
- **Local**: http://localhost:6990
- **Network**: http://[your-ip]:6990

## 📝 Basic Usage

### 1. **Write GGcode**
- Use the **left editor** to write your GGcode
- Get **real-time syntax highlighting**
- Use **AI Chat** button for assistance

### 2. **Compile to G-code**
- Click the **"Compile"** button
- View **compilation results** in the right panel
- Check **annotations** for errors or warnings

### 3. **Visualize Toolpath**
- Click the **"Visualizer"** button
- View **3D representation** of your G-code
- Use **orbit controls** to navigate (drag to rotate, scroll to zoom)

### 4. **New Visualization Features**
- **Camera Toggle** 🔄: Switch between "flat 3D" (orthographic) and "real 3D" (perspective)
- **Export Image** 📸: Save current 3D view as PNG file

## 🎛️ Visualizer Controls

### 3D Navigation
- **Left Click + Drag**: Rotate view
- **Right Click + Drag**: Pan view
- **Mouse Wheel**: Zoom in/out

### Simulation Controls
- **▶️ Play**: Start toolpath simulation
- **⏸️ Pause**: Pause simulation
- **⏮️ Rewind**: Reset to beginning
- **⏭️ Forward**: Skip forward
- **Speed Slider**: Adjust simulation speed

### New Features
- **📷 Camera**: Toggle between orthographic/perspective views
- **📤 Export**: Download current view as PNG image

## 💾 File Operations

### Save Your Work
```bash
# Save GGcode input
# Click "Save" button in toolbar

# Save G-code output
# Click "Export" button in toolbar
```

### Load Files
```bash
# Click "Open" button to load GGcode or text files
# Drag and drop files onto the editor
```

## 🔧 Development Commands

### Code Quality
```bash
# Check code quality
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building
```bash
# Build client assets only
npm run build:client

# Full build (lint + test + build)
npm run build

# Production build (includes format check)
npm run build:prod
```

## 🛠️ Maintenance Commands

### Project Health
```bash
# Check project health
npm run maintenance:health

# Update dependencies
npm run maintenance:deps

# Generate documentation
npm run maintenance:docs

# Run all maintenance tasks
npm run maintenance:all
```

### Git Operations
```bash
# Smart commit (runs checks first)
npm run commit

# Update project structure
npm run update-structure

# Update changelog
npm run update-changelog
```

## 🧹 Utility Commands

```bash
# Clear saved data
# Click "Clear" button in UI

# Clear build artifacts
npm run clean

# Health check
npm run health-check
```

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```bash
AI_ENDPOINT=http://localhost:11434
OLLAMA_MODEL=deepseek-coder-v2:16b
```

### Ports
- **Default Port**: 6990
- **Debug Port**: 9229 (when using `--inspect`)

## 🚨 Troubleshooting

### Common Issues

#### Server Won't Start
```bash
# Check Node.js version
node --version

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Compilation Errors
- Check **GGcode syntax** in left editor
- Look at **annotations** for specific errors
- Use **AI Chat** for help

#### Visualizer Issues
- Ensure **WebGL support** in browser
- Check **browser console** for errors
- Try **refreshing** the page

### Debug Mode
```bash
# Start with debugging enabled
npm run dev

# Open Chrome DevTools at chrome://inspect
# Or visit http://localhost:9229
```

## 📚 Examples

### Basic GGcode
```ggcode
// Simple square
move(0, 0, 0)
line(10, 0, 0)
line(10, 10, 0)
line(0, 10, 0)
line(0, 0, 0)
```

### Using AI Features
1. Click **"AI Chat"** button
2. Ask questions about GGcode syntax
3. Request code examples or explanations

## 🎯 Features Overview

### Core Features
- ✅ **GGcode Editor** with syntax highlighting
- ✅ **Real-time Compilation** to G-code
- ✅ **3D Visualization** with Three.js
- ✅ **Toolpath Simulation** with controls
- ✅ **File Operations** (open/save/export)
- ✅ **AI Assistant** integration

### New Features (Recently Added)
- ✅ **Camera Mode Switching** (Orthographic ↔ Perspective)
- ✅ **Image Export** functionality
- ✅ **Enhanced Performance** monitoring

## 📞 Support

### Getting Help
- Check **Help** button in the UI
- Use **AI Chat** for coding assistance
- Review **console logs** for technical issues

### Logs Location
- **Server logs**: `server.log`, `nohup.out`
- **Browser console**: F12 → Console tab
- **Build logs**: Terminal output during builds

---

## 🎉 Happy Coding!

Your GGcode Compiler is now ready to use. Start by writing some GGcode and watching it transform into G-code with beautiful 3D visualizations!