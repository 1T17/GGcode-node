/**
 * Main Visualizer Module
 *
 * Combines the 3D viewer and controls into a complete G-code visualization system.
 * Provides the main interface for showing and managing the 3D G-code viewer.
 */

import { GcodeViewer3D } from './viewer3d.js';
import { ViewerControls } from './controls.js';

class GcodeVisualizer {
  constructor() {
    this.viewer3d = null;
    this.controls = null;
    this.isInitialized = false;
    this.modalElement = null;
    this.containerElement = null;
  }

  /**
   * Initialize the visualizer
   * @returns {boolean} Success status
   */
  initialize() {
    try {
      // Cache DOM elements
      this.modalElement = document.getElementById('gcodeViewerModal');
      this.containerElement = document.getElementById('gcode3d');

      if (!this.modalElement || !this.containerElement) {
        console.error('Required DOM elements not found for G-code visualizer');
        return false;
      }

      // Create 3D viewer
      this.viewer3d = new GcodeViewer3D();

      // Create controls
      this.controls = new ViewerControls(this.viewer3d);

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize G-code visualizer:', error);
      return false;
    }
  }

  /**
   * Show the G-code viewer modal with the provided G-code
   * @param {string} gcode - The G-code content to visualize
   * @returns {boolean} Success status
   */
  show(gcode = '') {
    if (!this.isInitialized && !this.initialize()) {
      return false;
    }

    try {
      // Show modal
      if (this.modalElement) {
        this.modalElement.style.display = 'flex';
      }

      // Show loading indicator
      this.showLoadingIndicator(true);

      // Get G-code content
      let gcodeContent = gcode;
      if (
        !gcodeContent &&
        window.outputEditor &&
        typeof window.outputEditor.getValue === 'function'
      ) {
        gcodeContent = window.outputEditor.getValue();
      }

      // Initialize 3D viewer if not already done
      if (!this.viewer3d.scene) {
        const success = this.viewer3d.initialize(this.containerElement);
        if (!success) {
          this.showLoadingIndicator(false);
          this.showError('Failed to initialize 3D viewer');
          return false;
        }
      }

      // Render G-code
      const renderSuccess = this.viewer3d.renderGcode(gcodeContent);

      // Hide loading indicator
      this.showLoadingIndicator(false);

      if (renderSuccess) {
        // Reset controls to initial state
        this.controls.reset();

        // Show performance stats
        this.showPerformanceStats();
      }

      return renderSuccess;
    } catch (error) {
      console.error('Error showing G-code viewer:', error);
      this.showLoadingIndicator(false);
      this.showError(`Failed to load G-code viewer: ${error.message}`);
      return false;
    }
  }

  /**
   * Close the G-code viewer modal
   */
  close() {
    try {
      // Hide modal
      if (this.modalElement) {
        this.modalElement.style.display = 'none';
      }

      // Reset controls
      if (this.controls) {
        this.controls.reset();
      }

      // Clean up 3D viewer resources
      if (this.viewer3d) {
        this.viewer3d.dispose();
      }

      // Clear container
      if (this.containerElement) {
        this.containerElement.innerHTML = '';
      }

      // Reset initialization flag to force re-initialization next time
      this.isInitialized = false;
    } catch (error) {
      console.error('Error closing G-code viewer:', error);
    }
  }

  /**
   * Show/hide loading indicator
   * @param {boolean} show - Whether to show the indicator
   */
  showLoadingIndicator(show = true) {
    let loader = document.getElementById('gcodeLoader');

    if (show && !loader) {
      loader = document.createElement('div');
      loader.id = 'gcodeLoader';
      loader.style.cssText = `
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8); 
        color: white; 
        padding: 20px;
        border-radius: 10px; 
        z-index: 10000; 
        font-family: monospace;
        text-align: center;
      `;
      loader.innerHTML = 'Processing G-code...<br><small>Please wait</small>';
      document.body.appendChild(loader);
    } else if (!show && loader) {
      loader.remove();
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message
   * @param {number} duration - Duration in milliseconds
   */
  showError(message, duration = 5000) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed; 
      top: 20px; 
      right: 20px; 
      background: #ff4444; 
      color: white; 
      padding: 10px 15px; 
      border-radius: 5px; 
      z-index: 10000; 
      font-family: monospace;
      max-width: 400px; 
      word-wrap: break-word;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => errorDiv.remove(), duration);
  }

  /**
   * Show performance statistics
   */
  showPerformanceStats() {
    if (!this.viewer3d) return;

    const statsContainer = document.getElementById('gcodeViewerStats');
    if (!statsContainer) return;

    const stats = this.viewer3d.getPerformanceStats();

    statsContainer.innerHTML = `
      <div style="color: #00ff00; padding: 10px 15px; border-radius: 5px; font-family: monospace; font-size: 14px; max-width: 300px;">
        Parse: ${stats.parseTime.toFixed(1)}ms<br>
        Render: ${stats.renderTime.toFixed(1)}ms<br>
        Lines: ${stats.lineCount}<br>
        Segments: ${stats.segmentCount}<br>
        <div style="color: #FF8E37;">G0: ${stats.segmentCounts.G0 || 0}</div>
        <div style="color: #00ff99;">G1: ${stats.segmentCounts.G1 || 0}</div>
        <div style="color: #0074D9;">G2: ${stats.segmentCounts.G2 || 0}</div>
        <div style="color: #F012BE;">G3: ${stats.segmentCounts.G3 || 0}</div>
      </div>
    `;
  }

  /**
   * Get the current 3D viewer instance
   * @returns {GcodeViewer3D|null} The 3D viewer instance
   */
  getViewer3D() {
    return this.viewer3d;
  }

  /**
   * Get the current controls instance
   * @returns {ViewerControls|null} The controls instance
   */
  getControls() {
    return this.controls;
  }

  /**
   * Check if the visualizer is currently open
   * @returns {boolean} True if open
   */
  isOpen() {
    return this.modalElement && this.modalElement.style.display === 'flex';
  }

  /**
   * Render new G-code content without closing/reopening
   * @param {string} gcode - The G-code content
   * @returns {boolean} Success status
   */
  updateGcode(gcode) {
    if (!this.isInitialized || !this.viewer3d) {
      return this.show(gcode);
    }

    try {
      this.showLoadingIndicator(true);

      const success = this.viewer3d.renderGcode(gcode);

      this.showLoadingIndicator(false);

      if (success) {
        this.controls.reset();
        this.showPerformanceStats();
      }

      return success;
    } catch (error) {
      console.error('Error updating G-code:', error);
      this.showLoadingIndicator(false);
      this.showError(`Failed to update G-code: ${error.message}`);
      return false;
    }
  }
}

// Create global instance
const gcodeVisualizer = new GcodeVisualizer();

// Export for module use
export { GcodeVisualizer, gcodeVisualizer };

// Global functions for backward compatibility
window.showGcodeViewer = (gcode) => gcodeVisualizer.show(gcode);
window.closeGcodeViewer = () => gcodeVisualizer.close();

// Legacy function names
window.renderGcode3D = (gcode) => gcodeVisualizer.updateGcode(gcode);

// Export global instance
window.gcodeVisualizer = gcodeVisualizer;
