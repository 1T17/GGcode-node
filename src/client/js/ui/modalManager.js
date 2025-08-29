/**
 * Modal Manager Module
 * Handles modal dialogs and overlays
 */

import { ModalManager } from './modals.js';

class ModalManagerWrapper {
  constructor() {
    this.modalManager = new ModalManager();
  }

  /**
   * Show modal by ID
   */
  showModal(modalId) {
    if (this.modalManager) {
      this.modalManager.showModal(modalId);
    } else {
      console.error('ModalManager module not available');
    }
  }

  /**
   * Close modal by ID
   */
  closeModal(modalId) {
    if (this.modalManager) {
      this.modalManager.closeModal(modalId);
    } else {
      console.error('ModalManager module not available');
    }
  }

  /**
   * Close configurator modal
   */
  closeConfigurator() {
    const modal = document.getElementById('configuratorModal');
    if (modal) {
      modal.style.display = 'none';
    }
    // Additional configurator cleanup would go here
  }

  /**
   * Close G-code viewer modal
   */
  closeGcodeViewer() {
    const modal = document.getElementById('gcodeViewerModal');
    if (modal) {
      modal.style.display = 'none';
    }

    // Clean up Three.js renderer
    try {
      const gcode3d = document.getElementById('gcode3d');
      if (gcode3d) {
        gcode3d.innerHTML = '';
      }

      // Stop any running animation
      if (window.gcodeSimAnimationId) {
        clearTimeout(window.gcodeSimAnimationId);
        window.gcodeSimAnimationId = null;
      }

      // Reset global variables to prevent memory leaks
      window.gcodeToolpathPoints = null;
      window.gcodeToolpathSegments = null;
      window.gcodeToolpathModes = null;
      window.gcodeLineMap = null;
      window.gcodeLines = null;
      window.gcodeSegmentCounts = null;
      window.gcodeScene = null;
      window.gcodeCamera = null;
      window.gcodeToolMesh = null;
      window.gcodeRender = null;
    } catch (error) {
      console.error('Error closing G-code viewer:', error);
    }
  }
}

export default ModalManagerWrapper;
