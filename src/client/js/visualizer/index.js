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

// Import existing modern modules
import { ToolpathPointDetector } from './pointDetector.js';
import { TooltipManager } from './tooltipManager.js';
import { PointDataExtractor } from './pointDataExtractor.js';

// Export all modules for modern usage
export {
  GcodeVisualizer,
  parseGcodeOptimized,
  showGcodeViewer,
  closeGcodeViewer,
  setupSimulationControls,
  ViewerControls,
  ToolpathPointDetector,
  TooltipManager,
  PointDataExtractor,
};

// Create a combined hover system that uses the existing modules
export class ToolpathHoverSystem {
  constructor() {
    this.pointDetector = new ToolpathPointDetector();
    this.tooltipManager = new TooltipManager();
    this.isEnabled = true;
    this.container = null;
    this.lastMouseMove = 0;
    this.debounceDelay = 100; // Increased debounce delay for large toolpaths
    this.lastMouseX = null;
    this.lastMouseY = null;
    this.mouseMoveThreshold = 4; // Only run detection if mouse moves >4px
    this.lastHoveredPosition = null;
    this.isMouseDown = false;
    this.controls = null;
    this.scene = null;
    this.pointIndicator = null; // Visual point indicator
  }

  initialize(scene, camera, container, controls = null) {
    this.container = container;
    this.controls = controls;
    this.scene = scene;
    this.camera = camera;

    const detectorSuccess = this.pointDetector.initialize(
      scene,
      camera,
      container
    );
    if (!detectorSuccess) return false;

    this.tooltipManager.initialize(container);
    this.createPointIndicator();
    this.setupEventListeners();
    return true;
  }

  setupEventListeners() {
    if (!this.container) return;

    // Track mouse down/up to disable hover during dragging
    this.container.addEventListener('mousedown', () => {
      this.isMouseDown = true;
      this.tooltipManager.hideTooltip();
      this.hidePointIndicator();
    });

    this.container.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    // Debounced mouse move handler
    this.container.addEventListener('mousemove', (event) => {
      if (!this.isEnabled || this.isMouseDown) return;

      // Throttle by mouse movement threshold
      if (this.lastMouseX !== null && this.lastMouseY !== null) {
        const dx = Math.abs(event.clientX - this.lastMouseX);
        const dy = Math.abs(event.clientY - this.lastMouseY);
        if (dx < this.mouseMoveThreshold && dy < this.mouseMoveThreshold)
          return;
      }
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;

      const now = Date.now();
      if (now - this.lastMouseMove < this.debounceDelay) return;
      this.lastMouseMove = now;

      requestAnimationFrame(() => {
        if (this.isMouseDown) return;
        const pointData = this.pointDetector.detectPointAtMouse(
          event.clientX,
          event.clientY
        );
        let position = null;
        if (pointData) {
          position =
            pointData.position ||
            (pointData.coordinates
              ? new THREE.Vector3(
                  pointData.coordinates.x || 0,
                  pointData.coordinates.y || 0,
                  pointData.coordinates.z || 0
                )
              : null);
        }
        // Only update indicator if hovered point changes
        const posChanged =
          position &&
          (!this.lastHoveredPosition ||
            !position.equals(this.lastHoveredPosition));
        if (posChanged) {
          this.showPointIndicator(position);
          this.lastHoveredPosition = position ? position.clone() : null;
        } else if (!position) {
          this.hidePointIndicator();
          this.lastHoveredPosition = null;
        }
        // Tooltip logic unchanged
        if (pointData) {
          setTimeout(() => {
            if (!this.isMouseDown) {
              this.tooltipManager.showTooltip(
                pointData,
                event.clientX,
                event.clientY
              );
            }
          }, 100);
        } else {
          this.tooltipManager.hideTooltip();
        }
      });
    });

    this.container.addEventListener('mouseleave', () => {
      this.tooltipManager.hideTooltip();
      this.hidePointIndicator();
      this.isMouseDown = false;
    });
  }

  /**
   * Create visual point indicator (red dot)
   */
  createPointIndicator() {
    if (!this.scene) return;

    // Create a small white sphere that stays clean at all zoom levels
    const geometry = new THREE.SphereGeometry(0.2, 16, 12);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: false,
      opacity: 1.0,
    });

    this.pointIndicator = new THREE.Mesh(geometry, material);
    this.pointIndicator.visible = false; // Hidden by default
    this.scene.add(this.pointIndicator);
  }

  /**
   * Update point indicator scale based on camera distance
   */
  updatePointIndicatorScale() {
    if (!this.pointIndicator || !this.camera || !this.pointIndicator.visible)
      return;

    // Calculate distance from camera to point
    const distance = this.camera.position.distanceTo(
      this.pointIndicator.position
    );

    // Scale factor to keep consistent screen size (adjust 0.02 to change size)
    const scaleFactor = distance * 0.02;

    // Apply scale
    this.pointIndicator.scale.set(scaleFactor, scaleFactor, scaleFactor);
  }

  /**
   * Show point indicator at specific position
   */
  showPointIndicator(position) {
    if (this.pointIndicator && position) {
      this.pointIndicator.position.copy(position);
      this.pointIndicator.visible = true;

      // Update scale based on camera distance
      this.updatePointIndicatorScale();
    }
  }

  /**
   * Hide point indicator
   */
  hidePointIndicator() {
    if (this.pointIndicator) {
      this.pointIndicator.visible = false;
    }
  }

  updateToolpath(toolpathData) {
    this.pointDetector.updateToolpath(toolpathData);
  }

  temporarilyDisable() {
    this.isEnabled = false;
    this.tooltipManager.hideTooltip();
  }

  temporarilyEnable() {
    this.isEnabled = true;
  }

  /**
   * Update method to be called in render loop
   */
  update() {
    // Update point indicator scale if visible
    this.updatePointIndicatorScale();
  }

  dispose() {
    this.pointDetector.dispose();
    this.tooltipManager.dispose();

    // Clean up point indicator
    if (this.pointIndicator && this.scene) {
      this.scene.remove(this.pointIndicator);
      if (this.pointIndicator.geometry) {
        this.pointIndicator.geometry.dispose();
      }
      if (this.pointIndicator.material) {
        this.pointIndicator.material.dispose();
      }
      this.pointIndicator = null;
    }

    this.container = null;
    this.scene = null;
  }
}

// Export modern modules to window for debugging/testing
// --- Point Detector Toggle Button Logic ---
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('togglePointDetectorBtn');
  if (!btn) return;

  // Point detector starts as inactive (false), so button should reflect that
  let pointDetectorEnabled = false;

  // Set initial button appearance to show it's off
  btn.style.background = 'transparent'; // Red background for off state
  btn.title = 'Enable Point Detector';

  btn.onclick = function () {
    pointDetectorEnabled = !pointDetectorEnabled;
    if (window.gcodeHoverSystem && window.gcodeHoverSystem.pointDetector) {
      window.gcodeHoverSystem.pointDetector.setActive(pointDetectorEnabled);
    }
    btn.style.background = pointDetectorEnabled ? '#2ecc4096' : 'transparent';
    btn.title = pointDetectorEnabled
      ? 'Disable Point Detector'
      : 'Enable Point Detector';
  };
});

// --- G-code Stats Box Update ---
function updateGcodeStats() {
  window.updateGcodeStats = updateGcodeStats;
  const statsContainer = document.getElementById('gcodeViewerStats');
  if (!statsContainer) {
    console.log('[updateGcodeStats] gcodeViewerStats element not found');
    return;
  }
  statsContainer.style.display = 'block';
  statsContainer.style.opacity = '1';
  statsContainer.style.visibility = 'visible';
  // Use old stats logic
  const perf = window.performanceStats || {};
  const segCounts = window.gcodeSegmentCounts || {};
  statsContainer.innerHTML = `
    <div style="color: #00ff00; padding: 10px 15px; border-radius: 5px; font-family: monospace; font-size: 14px; max-width: 300px;">
      Parse: ${perf.parseTime?.toFixed(1) || 0}ms<br>
      Render: ${perf.renderTime?.toFixed(1) || 0}ms<br>
      Lines: ${perf.lineCount || 0}<br>
      Segments: ${perf.segmentCount || 0}<br>
      <div style="color: #FF8E37;">G0: ${segCounts.G0 || 0}</div>
      <div style="color: #00ff99;">G1: ${segCounts.G1 || 0}</div>
      <div style="color: #0074D9;">G2: ${segCounts.G2 || 0}</div>
      <div style="color: #F012BE;">G3: ${segCounts.G3 || 0}</div>
    </div>
  `;
}

// Patch: Always call updateGcodeStats after parsing/rendering, not just in gcodeRender
document.addEventListener('DOMContentLoaded', function () {
  // Show initial stats when visualizer opens
  updateGcodeStats();
});

// Also call after each render, regardless of canvas
window.gcodeRender = (function (orig) {
  window.gcodeCurrentLineIdx = window.gcodeCurrentLineIdx || 0;
  return function () {
    if (typeof orig === 'function') orig();
    updateGcodeStats();
    updateGcodeLineInfo(window.gcodeCurrentLineIdx);
    console.log('[gcodeRender] Stats and info updated after render');
  };
})(window.gcodeRender);

// --- G-code Line Info Box Update ---
function updateGcodeLineInfo(currentLineIdx) {
  window.updateGcodeLineInfo = updateGcodeLineInfo;
  const infoContainer = document.getElementById('gcodeLineInfo');
  if (!infoContainer) {
    console.log('[updateGcodeLineInfo] No infoContainer found');
    return;
  }
  let infoHtml = '';
  let lineLog = '';
  if (Array.isArray(window.gcodeLines)) {
    if (
      currentLineIdx != null &&
      currentLineIdx >= 0 &&
      currentLineIdx < window.gcodeLines.length
    ) {
      const line = window.gcodeLines[currentLineIdx];
      infoHtml += `<br><b>Current Line:</b> #${currentLineIdx + 1} ${line}`;
      lineLog = `[updateGcodeLineInfo] Showing line ${currentLineIdx + 1}: ${line}`;
    } else {
      lineLog = `[updateGcodeLineInfo] Invalid line index: ${currentLineIdx}`;
    }
  } else {
    lineLog = '[updateGcodeLineInfo] window.gcodeLines is not an array';
  }
  infoContainer.style.display = 'block';
  infoContainer.innerHTML = infoHtml;
  //console.log(`[updateGcodeLineInfo] Updated info box.`, { currentLineIdx, showStats, infoHtml });
  if (lineLog) console.log(lineLog);
}
// Update stats on load and after each render
window.gcodeRender = (function (orig) {
  // Track current simulation line index globally
  window.gcodeCurrentLineIdx = window.gcodeCurrentLineIdx || 0;
  return function () {
    if (typeof orig === 'function') orig();
    // Only update stats/info if canvas is present
    const canvas = document.querySelector('#gcodeViewerContainer canvas');
    if (canvas) {
      updateGcodeStats();
      updateGcodeLineInfo(window.gcodeCurrentLineIdx);
      console.log('[gcodeRender] Stats and info updated after canvas render');
    } else {
      console.log('[gcodeRender] Canvas not found, skipping stats/info update');
    }
  };
})(window.gcodeRender);
document.addEventListener('DOMContentLoaded', function () {
  // Show initial stats when visualizer opens
  updateGcodeLineInfo(window.gcodeCurrentLineIdx || 0, true);
});
window.GcodeVisualizer = GcodeVisualizer;
window.ToolpathPointDetector = ToolpathPointDetector;
window.TooltipManager = TooltipManager;
window.PointDataExtractor = PointDataExtractor;
window.ViewerControls = ViewerControls;
window.ToolpathHoverSystem = ToolpathHoverSystem;

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
