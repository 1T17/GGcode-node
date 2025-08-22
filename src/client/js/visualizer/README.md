# Visualizer Module

## Status: ✅ **ORGANIZED AND MODERNIZED**

### Architecture Overview

The visualizer has been reorganized into a clean, modular structure:

## Core Components

- `core.js` - Main 3D visualizer class with Three.js scene management
- `parser.js` - G-code parsing logic for toolpath generation  
- `modal.js` - Modal management for the G-code viewer
- `controls.js` - Simulation controls (play/pause/speed/progress)

## Feature Components

- `pointDetector.js` - Detects toolpath points under mouse cursor
- `tooltipManager.js` - Manages tooltip display for toolpath points
- `pointDataExtractor.js` - Extracts data from toolpath points

## Main Module

- `index.js` - Module exports and backward compatibility

## Usage

```javascript
// Modern usage
import { showGcodeViewer } from './visualizer/index.js';
showGcodeViewer(gcodeContent);

// Legacy usage (still supported)
window.showGcodeViewer(gcodeContent);
```

## Architecture Benefits

The new modular architecture provides:

1. **Separation of Concerns** - Each module has a single responsibility
2. **Maintainability** - Easier to debug and extend individual components
3. **Testability** - Components can be tested in isolation
4. **Backward Compatibility** - Existing code continues to work
5. **Performance** - Cleaner code with less duplication

## Migration Status

- ✅ **Core rendering** - Moved to `core.js`
- ✅ **G-code parsing** - Moved to `parser.js`
- ✅ **Modal management** - Moved to `modal.js`
- ✅ **Simulation controls** - Organized in `controls.js`
- ✅ **Hover system** - Existing modules preserved
- ✅ **Backward compatibility** - All legacy functions still work

## Dependencies

- Three.js r128
- OrbitControls.js