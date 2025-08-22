/**
 * Global Variable Initialization
 * Centralized initialization of all global variables used across the application
 */

class GlobalInitializer {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize all global variables
   */
  initialize() {
    if (this.initialized) {
      console.warn('Global variables already initialized');
      return;
    }

    this.initializeGCodeGlobals();
    this.initializePerformanceGlobals();
    this.initializeBatchedRenderingGlobals();
    this.initializeToolpathGlobals();
    this.initializeSimulationGlobals();

    this.initialized = true;
    console.log('All global variables initialized successfully');
  }

  /**
   * Initialize G-code related global variables
   */
  initializeGCodeGlobals() {
    if (!window.gcodeCurrentLineIdx) {
      window.gcodeCurrentLineIdx = 0;
    }

    if (!window.gcodeLines) {
      window.gcodeLines = null;
    }

    if (!window.gcodeLineMap) {
      window.gcodeLineMap = null;
    }

    if (!window.gcodeSegmentCounts) {
      window.gcodeSegmentCounts = null;
    }
  }

  /**
   * Initialize performance monitoring globals
   */
  initializePerformanceGlobals() {
    if (!window.performanceStats) {
      window.performanceStats = {
        parseTime: 0,
        renderTime: 0,
        lineCount: 0,
        segmentCount: 0,
      };
    }
  }

  /**
   * Initialize batched rendering globals for optimized G-code visualization
   */
  initializeBatchedRenderingGlobals() {
    if (!window.gcodeBatchedLines) {
      window.gcodeBatchedLines = { G0: null, G1: null, G2: null, G3: null };
    }

    if (!window.gcodeBatchedGeometries) {
      window.gcodeBatchedGeometries = {
        G0: null,
        G1: null,
        G2: null,
        G3: null,
      };
    }

    if (!window.gcodeBatchedCounts) {
      window.gcodeBatchedCounts = { G0: 0, G1: 0, G2: 0, G3: 0 };
    }
  }

  /**
   * Initialize toolpath data globals
   */
  initializeToolpathGlobals() {
    if (!window.gcodeToolpathPoints) {
      window.gcodeToolpathPoints = null;
    }

    if (!window.gcodeToolpathSegments) {
      window.gcodeToolpathSegments = null;
    }

    if (!window.gcodeToolpathModes) {
      window.gcodeToolpathModes = null;
    }
  }

  /**
   * Initialize simulation-related globals
   */
  initializeSimulationGlobals() {
    if (!window.gcodeSimAnimationId) {
      window.gcodeSimAnimationId = null;
    }

    if (!window.gcodeScene) {
      window.gcodeScene = null;
    }

    if (!window.gcodeCamera) {
      window.gcodeCamera = null;
    }

    if (!window.gcodeToolMesh) {
      window.gcodeToolMesh = null;
    }

    if (!window.gcodeRender) {
      window.gcodeRender = null;
    }
  }

  /**
   * Reset all global variables to their initial state
   */
  reset() {
    // Reset G-code globals
    window.gcodeCurrentLineIdx = 0;
    window.gcodeLines = null;
    window.gcodeLineMap = null;
    window.gcodeSegmentCounts = null;

    // Reset performance stats
    window.performanceStats = {
      parseTime: 0,
      renderTime: 0,
      lineCount: 0,
      segmentCount: 0,
    };

    // Reset batched rendering (keep structure but clear data)
    if (window.gcodeBatchedLines) {
      Object.keys(window.gcodeBatchedLines).forEach((key) => {
        window.gcodeBatchedLines[key] = null;
      });
    }

    if (window.gcodeBatchedGeometries) {
      Object.keys(window.gcodeBatchedGeometries).forEach((key) => {
        window.gcodeBatchedGeometries[key] = null;
      });
    }

    if (window.gcodeBatchedCounts) {
      Object.keys(window.gcodeBatchedCounts).forEach((key) => {
        window.gcodeBatchedCounts[key] = 0;
      });
    }

    // Reset toolpath data
    window.gcodeToolpathPoints = null;
    window.gcodeToolpathSegments = null;
    window.gcodeToolpathModes = null;

    // Reset simulation globals
    if (window.gcodeSimAnimationId) {
      clearTimeout(window.gcodeSimAnimationId);
      window.gcodeSimAnimationId = null;
    }
    window.gcodeScene = null;
    window.gcodeCamera = null;
    window.gcodeToolMesh = null;
    window.gcodeRender = null;

    console.log('All global variables reset to initial state');
  }

  /**
   * Clean up global variables and event listeners
   */
  dispose() {
    // Stop any running animations
    if (window.gcodeSimAnimationId) {
      clearTimeout(window.gcodeSimAnimationId);
      window.gcodeSimAnimationId = null;
    }

    // Clean up Three.js objects if they exist
    if (window.gcodeScene) {
      // Dispose geometry and materials
      window.gcodeScene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      window.gcodeScene = null;
    }

    if (window.gcodeCamera) {
      window.gcodeCamera = null;
    }

    if (window.gcodeToolMesh) {
      window.gcodeToolMesh = null;
    }

    if (window.gcodeRender) {
      if (window.gcodeRender.domElement) {
        window.gcodeRender.dispose();
      }
      window.gcodeRender = null;
    }

    console.log('Global variables cleaned up successfully');
  }
}

// Create and export singleton instance
const globalInitializer = new GlobalInitializer();
export default globalInitializer;
