/**
 * Modal Management Module
 *
 * Handles the G-code viewer modal display and lifecycle
 */

import { GcodeVisualizer } from './core.js';

/**
 * Modal manager for G-code viewer
 */
export class GcodeViewerModal {
  constructor() {
    this.modal = null;
    this.container = null;
    this.visualizer = null;
    this.isVisible = false;
  }

  /**
   * Initialize the modal
   */
  initialize() {
    this.modal = document.getElementById('gcodeViewerModal');
    this.container = document.getElementById('gcode3d');

    if (!this.modal || !this.container) {
      console.error('Modal elements not found');
      return false;
    }

    this.visualizer = new GcodeVisualizer();
    // Make visualizer globally accessible for button handlers
    window.gcodeVisualizer = this.visualizer;
    return true;
  }

  /**
   * Show the modal with G-code content
   */
  show(gcode) {
    if (!this.modal || !this.container) {
      console.error('Modal not initialized');
      return;
    }

    // Get G-code content if not provided
    let gcodeContent = gcode;
    if (
      !gcodeContent &&
      window.outputEditor &&
      typeof window.outputEditor.getValue === 'function'
    ) {
      gcodeContent = window.outputEditor.getValue();
    }

    if (!gcodeContent || !gcodeContent.trim()) {
      this.showError('No G-code content to display');
      return;
    }

    // Show modal
    this.modal.style.display = 'flex';
    this.isVisible = true;

    // Wait for modal to be visible, then render
    setTimeout(() => {
      this.renderGcode(gcodeContent);
    }, 100);
  }

  /**
   * Hide the modal
   */
  hide() {
    // Stop any running simulation before closing
    this.stopSimulation();

    if (this.modal) {
      this.modal.style.display = 'none';
      this.isVisible = false;
    }

    // Clean up visualizer
    if (this.visualizer) {
      this.visualizer.dispose();
    }

    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Stop any running simulation
   */
  stopSimulation() {
    // Use the global stopSimulation function from controls.js
    if (window.stopSimulation && typeof window.stopSimulation === 'function') {
      window.stopSimulation();
    }
  }

  /**
   * Render G-code in the modal
   */
  async renderGcode(gcode) {
    if (!this.container) return;

    // Check container dimensions
    if (this.container.offsetWidth === 0 || this.container.offsetHeight === 0) {
      //console.log('Container not ready, retrying...');
      this.renderGcode(gcode);
      return;
    }

    //console.log('Starting G-code rendering...');

    // Initialize visualizer directly - no loading screen
    try {
      if (!this.visualizer.initialize(this.container)) {
        this.showError('Failed to initialize 3D visualizer');
        return;
      }

      //console.log('Visualizer initialized, rendering G-code...');

      const result = await this.visualizer.renderGcode(gcode);

      if (!result.success) {
        this.showError(result.error || 'Failed to render G-code');
        return;
      }

      //console.log('G-code rendering completed successfully');

      // Update stats and info boxes after successful render

      if (window.updateGcodeStats) {
        //console.log('[modal.js] Calling updateGcodeStats after render (delayed)');
        window.updateGcodeStats();
      }
      //else {
      //   console.log('[modal.js] updateGcodeStats not found (delayed)');
      // }
      if (window.updateCurrentLineDisplay) {
        //  console.log('[modal.js] Calling updateCurrentLineDisplay after render (delayed)');
        window.updateCurrentLineDisplay(0);
      }
      //else {
      //console.log('[modal.js] updateGcodeLineInfo not found (delayed)');
      //}

      // console.log(`3D Visualizer: Rendered ${result.parseResult.toolpathPoints?.length || 0} points, ${result.parseResult.toolpathSegments?.length || 0} segments`);
    } catch (error) {
      console.error('Error rendering G-code:', error);
      this.showError(`Failed to render G-code: ${error.message}`);
    }
  }

  /**
   * Show loading message
   */
  showLoading() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #fff;
        font-family: Arial, sans-serif;
        text-align: center;
        flex-direction: column;
        background: transparent;
      ">
        <h2>Loading 3D Visualizer...</h2>
        <p>Parsing G-code and creating 3D scene...</p>
      </div>
    `;
  }

  /**
   * Show error message
   */
  showError(message) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #fff;
        font-family: Arial, sans-serif;
        text-align: center;
        flex-direction: column;
        background: #1a1a1a;
      ">
        <h2>3D Visualizer Error</h2>
        <p>${message}</p>
        <button onclick="closeGcodeViewer()" style="
          margin-top: 20px;
          padding: 10px 20px;
          background: #007acc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">Close</button>
      </div>
    `;
  }
}

// Global modal instance
let modalInstance = null;

/**
 * Show the G-code viewer modal
 */
export function showGcodeViewer(gcode) {
  if (!modalInstance) {
    modalInstance = new GcodeViewerModal();
    if (!modalInstance.initialize()) {
      console.error('Failed to initialize modal');
      return;
    }
  }

  modalInstance.show(gcode);
}

/**
 * Close the G-code viewer modal
 */
export function closeGcodeViewer() {
  if (modalInstance) {
    modalInstance.hide();
  }
}

// Make functions globally available
window.showGcodeViewer = showGcodeViewer;
window.closeGcodeViewer = closeGcodeViewer;
window.showGcodeViewer = showGcodeViewer;
window.closeGcodeViewer = closeGcodeViewer;
