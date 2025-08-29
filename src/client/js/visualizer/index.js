/**
 * Visualizer Module Index
 *
 * Exports all visualizer modules and provides backward compatibility
 */

// Import core modules
import { GcodeVisualizer } from './core.js';
import { parseGcodeOptimized } from './parser.js';
import { showGcodeViewer, closeGcodeViewer } from './modal.js';
import { setupSimulationControls, ViewerControls } from './controls.js';

// Export all modules for modern usage
export {
  GcodeVisualizer,
  parseGcodeOptimized,
  showGcodeViewer,
  closeGcodeViewer,
  setupSimulationControls,
  ViewerControls,
};

// Export modern modules to window for debugging/testing

// --- Enhanced G-code Stats Box Update with Live Performance Data ---
window.updateGcodeStats = function () {
  const statsContainer = document.getElementById('gcodeViewerStats');
  if (!statsContainer) {
    console.log('[DEBUG] gcodeViewerStats container not found');
    return;
  }
  console.log(
    '[DEBUG] updateGcodeStats called, container found:',
    statsContainer
  );
  console.log(
    '[DEBUG] Container initial state:',
    getComputedStyle(statsContainer).display,
    getComputedStyle(statsContainer).visibility
  );

  // Force visibility with !important equivalent styles
  statsContainer.style.setProperty('display', 'block', 'important');
  statsContainer.style.setProperty('opacity', '1', 'important');
  statsContainer.style.setProperty('visibility', 'visible', 'important');
  statsContainer.style.setProperty(
    'background',
    'rgba(0, 0, 0, 0.8)',
    'important'
  );
  statsContainer.style.setProperty('color', '#00ff00', 'important');

  // Add positioning and z-index to ensure it's visible
  statsContainer.style.position = 'absolute';

  console.log(
    '[DEBUG] Final container state:',
    getComputedStyle(statsContainer).display,
    getComputedStyle(statsContainer).visibility
  );
  console.log(
    '[DEBUG] Container bounding rect:',
    statsContainer.getBoundingClientRect()
  );

  // Get existing stats
  const perf = window.performanceStats || {};
  const segCounts = window.gcodeSegmentCounts || {};

  // Get live performance data (fallback to visualizer instance if available)
  let performanceData = window.performanceData || {};
  if (window.gcodeVisualizer && window.gcodeVisualizer.getPerformanceStats) {
    try {
      const vizStats = window.gcodeVisualizer.getPerformanceStats();
      performanceData = { ...performanceData, ...vizStats };
    } catch (error) {
      console.warn('Error getting visualizer performance stats:', error);
    }
  }

  // Build enhanced stats display
  let statsHtml = `
    <div class="stats-title">
      <div class="metric-line">Lines: ${perf.lineCount || 0}</div>
      <div class="metric-line">Segments: ${perf.segmentCount || 0}</div>
      <div class="metric-line metric-good">G0: ${segCounts.G0 || 0}</div>
      <div class="metric-line metric-good">G1: ${segCounts.G1 || 0}</div>
      <div class="metric-line metric-info">G2: ${segCounts.G2 || 0}</div>
      <div class="metric-line metric-info">G3: ${segCounts.G3 || 0}</div>`;

  // Add FPS information
  if (
    performanceData.averageFPS !== undefined &&
    performanceData.averageFPS > 0
  ) {
    const fpsClass =
      performanceData.averageFPS >= 30
        ? 'metric-good'
        : performanceData.averageFPS >= 15
          ? 'metric-warning'
          : 'metric-error';
    statsHtml += `<div class="metric-line ${fpsClass}">FPS: ${performanceData.averageFPS}</div>`;
  } else {
    statsHtml += `<div class="metric-line metric-info">FPS: Not active</div>`;
  }

  // Add file render time (show file render time instead of frame render time)
  if (
    performanceData.fileRenderTime !== undefined &&
    performanceData.fileRenderTime > 0
  ) {
    const fileRenderTime =
      typeof performanceData.fileRenderTime === 'number'
        ? performanceData.fileRenderTime
        : 0;
    const renderClass =
      fileRenderTime <= 1000
        ? 'metric-good'
        : fileRenderTime <= 3000
          ? 'metric-warning'
          : 'metric-error';
    statsHtml += `<div class="metric-line ${renderClass}">File Render: ${fileRenderTime.toFixed(1)}ms</div>`;
  } else if (perf.fileRenderTime !== undefined && perf.fileRenderTime > 0) {
    const fileRenderTime =
      typeof perf.fileRenderTime === 'number' ? perf.fileRenderTime : 0;
    const renderClass =
      fileRenderTime <= 1000
        ? 'metric-good'
        : fileRenderTime <= 3000
          ? 'metric-warning'
          : 'metric-error';
    statsHtml += `<div class="metric-line ${renderClass}">File Render: ${fileRenderTime.toFixed(1)}ms</div>`;
  } else {
    statsHtml += `<div class="metric-line metric-info">File Render: No file loaded</div>`;
  }

  // Add object counts
  if (performanceData.totalObjects !== undefined) {
    statsHtml += `<div class="metric-line metric-info">Objects: ${performanceData.totalObjects}</div>`;
  }
  if (
    performanceData.culledObjects !== undefined &&
    performanceData.culledObjects > 0
  ) {
    statsHtml += `<div class="metric-line metric-info">Culled: ${performanceData.culledObjects}</div>`;
  }

  // Add canvas size
  if (performanceData.canvasSize) {
    statsHtml += `<div class="metric-line metric-info">Canvas: ${performanceData.canvasSize.width}×${performanceData.canvasSize.height}</div>`;
  }

  // Add memory information
  if (performanceData.memoryInfo) {
    const memUsage =
      (performanceData.memoryInfo.used / performanceData.memoryInfo.total) *
      100;
    const memClass =
      memUsage < 70
        ? 'metric-good'
        : memUsage < 85
          ? 'metric-warning'
          : 'metric-error';
    statsHtml += `<div class="metric-line ${memClass}">Memory: ${performanceData.memoryInfo.used}/${performanceData.memoryInfo.total}MB</div>`;
  }

  // Add adaptive rendering status
  if (performanceData.adaptiveRendering !== undefined) {
    const adaptClass = performanceData.adaptiveRendering
      ? 'metric-good'
      : 'metric-info';
    statsHtml += `<div class="metric-line ${adaptClass}">Adaptive: ${performanceData.adaptiveRendering ? 'ON' : 'OFF'}</div>`;
  }

  // Add last update time
  if (performanceData.lastUpdate) {
    statsHtml += `<div class="timestamp">Updated: ${performanceData.lastUpdate}</div>`;
  }

  // Add some debugging info at the top if no data
  if (
    !perf.lineCount &&
    (!window.gcodeLines || window.gcodeLines.length === 0)
  ) {
    statsHtml =
      '<div class="metric-line metric-info">[DEBUG] G-code data not loaded or empty</div>' +
      statsHtml;
  }

  statsHtml += `</div>`;

  statsContainer.innerHTML = statsHtml;
  console.log(
    '[DEBUG] Stats HTML updated:',
    statsContainer.innerHTML ? 'HTML present' : 'Empty HTML'
  );
};

// Patch: Always call updateGcodeStats after parsing/rendering, not just in gcodeRender
document.addEventListener('DOMContentLoaded', function () {
  // Show initial stats when visualizer opens
  window.updateGcodeStats();
});

// Single, unified gcodeRender function with performance optimization
window.gcodeRender = (function (orig) {
  let lastStatsUpdate = 0;
  const statsUpdateInterval = 1000; // Update stats only once per second during animation

  return function () {
    if (typeof orig === 'function') orig();

    // Only update stats if canvas is present and enough time has passed
    const canvas = document.querySelector('#gcodeViewerContainer canvas');
    if (canvas) {
      const now = performance.now();
      if (now - lastStatsUpdate > statsUpdateInterval) {
        window.updateGcodeStats();
        lastStatsUpdate = now;
      }
      // Don't call line display updates here - it's handled by simulation controls
      // This prevents conflicts and spam updates during animation
    }
  };
})(window.gcodeRender);
document.addEventListener('DOMContentLoaded', function () {
  // Show initial line info when visualizer opens
  if (window.updateCurrentLineDisplay) {
    window.updateCurrentLineDisplay(window.gcodeCurrentLineIdx || 0);
  }
});
window.GcodeVisualizer = GcodeVisualizer;
window.ViewerControls = ViewerControls;

// Initialize global batched rendering objects for compatibility
if (!window.gcodeBatchedLines) {
  window.gcodeBatchedLines = { G0: null, G1: null, G2: null, G3: null };
}
if (!window.gcodeBatchedGeometries) {
  window.gcodeBatchedGeometries = { G0: null, G1: null, G2: null, G3: null };
}
if (!window.gcodeBatchedCounts) {
  window.gcodeBatchedCounts = { G0: 0, G1: 0, G2: 0, G3: 0 };
}

// Initialize gcodeLines array to prevent errors
if (!window.gcodeLines) {
  window.gcodeLines = [];
}

// Initialize other gcode-related global variables
if (!window.gcodeCurrentLineIdx) {
  window.gcodeCurrentLineIdx = 1; // Line indices should start at 1, not 0
}
if (!window.gcodeSegmentCounts) {
  window.gcodeSegmentCounts = { G0: 0, G1: 0, G2: 0, G3: 0 };
}
if (!window.performanceStats) {
  window.performanceStats = {};
}
if (!window.performanceData) {
  window.performanceData = {};
}

// Test function to verify line mapping works correctly
window.testLineMappingFix = function () {
  //console.log('=== Testing G-code Line Mapping Fix ===');

  if (!window.gcodeLineMap || !window.gcodeLines) {
    //console.log('No G-code data loaded for testing');
    return;
  }

  //console.log(`Total G-code lines: ${window.gcodeLines.length}`);
  //console.log(`Total segments: ${window.gcodeLineMap.length}`);

  // Show mappings for arc commands specifically
  let arcSegments = [];
  for (let i = 0; i < window.gcodeLineMap.length; i++) {
    const lineNum = window.gcodeLineMap[i];
    if (lineNum >= 0 && lineNum < window.gcodeLines.length) {
      const gcodeLine = window.gcodeLines[lineNum];
      if (gcodeLine.includes('G2') || gcodeLine.includes('G3')) {
        arcSegments.push({ segment: i, line: lineNum, gcode: gcodeLine });
      }
    }
  }

  if (arcSegments.length > 0) {
    //console.log('Arc command mappings:');
    arcSegments.forEach((arc) => {
      console.log(
        `  Segment ${arc.segment} -> Line ${arc.line + 1}: ${arc.gcode}`
      );
    });
  } else {
    //console.log('No arc commands found in current G-code');
  }

  //console.log('=== Test Complete ===');
};

// Global handler for camera mode switching
window.switchCameraMode = function () {
  if (
    window.gcodeVisualizer &&
    typeof window.gcodeVisualizer.switchCameraMode === 'function'
  ) {
    const newMode =
      window.gcodeVisualizer.cameraMode === 'perspective'
        ? 'orthographic'
        : 'perspective';
    window.gcodeVisualizer.switchCameraMode(newMode);
  } else {
    console.warn(
      'Visualizer not available or switchCameraMode method not found'
    );
  }
};

// Global handler for exporting visualization image
window.exportVisualizerImage = function () {
  if (
    window.gcodeVisualizer &&
    typeof window.gcodeVisualizer.exportImage === 'function'
  ) {
    window.gcodeVisualizer.exportImage();
  } else {
    console.warn('Visualizer not available or exportImage method not found');
  }
};

// Simple debug function to check current line display
window.debugCurrentLine = function () {
  const currentSeg = window.gcodeCurrentLineIdx || 0;
  const lineNum = window.gcodeLineMap ? window.gcodeLineMap[currentSeg] : -1;
  const gcodeLine =
    lineNum >= 0 && window.gcodeLines ? window.gcodeLines[lineNum] : 'N/A';
  console.log(
    `Current: Segment ${currentSeg} -> Line ${lineNum + 1}: ${gcodeLine}`
  );
};
