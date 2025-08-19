/**
 * 3D Viewer Controls Module
 *
 * Handles simulation controls and playback for the 3D G-code viewer:
 * - Play/pause/stop simulation
 * - Speed control and progress tracking
 * - Tool position animation
 * - User interface controls
 */

class ViewerControls {
  constructor(viewer3d) {
    this.viewer = viewer3d;
    this.simState = {
      playing: false,
      paused: false,
      stopped: true,
      idx: 0,
    };

    this.animationId = null;
    this.generation = 1; // For canceling old animations

    // UI elements cache
    this.domElements = {};

    // UI constants
    this.playIcon = '<polygon points="4,2 14,8 4,14" fill="#fff"/>';
    this.pauseIcon =
      '<rect x="3" y="2" width="3" height="12" fill="#fff"/><rect x="10" y="2" width="3" height="12" fill="#fff"/>';

    this.setupEventListeners();
  }

  /**
   * Cache DOM elements for performance
   */
  cacheDOMElements() {
    this.domElements = {
      playBtn: document.getElementById('runSimulationBtn'),
      rewindBtn: document.getElementById('rewindSimulationBtn'),
      forwardBtn: document.getElementById('forwardSimulationBtn'),
      runSimulationIcon: document.getElementById('runSimulationIcon'),
      progressBar: document.getElementById('simProgressBar'),
      speedSlider: document.getElementById('simSpeedSlider'),
      speedValue: document.getElementById('simSpeedValue'),
      speedUnit: document.getElementById('simSpeedUnit'),
      gcodeLineInfo: document.getElementById('gcodeLineInfo'),
      gcodeViewerModal: document.getElementById('gcodeViewerModal'),
    };
  }

  /**
   * Setup event listeners for controls
   */
  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.cacheDOMElements();
      this.setupControlButtons();
      this.setupSpeedControl();
      this.setupProgressBar();
    });
  }

  /**
   * Setup control button event listeners
   */
  setupControlButtons() {
    // Play/Pause button
    if (this.domElements.playBtn) {
      this.domElements.playBtn.addEventListener('click', () => {
        this.togglePlayPause();
      });
    }

    // Rewind button
    if (this.domElements.rewindBtn) {
      this.domElements.rewindBtn.addEventListener('click', () => {
        this.rewind();
      });
    }

    // Forward button
    if (this.domElements.forwardBtn) {
      this.domElements.forwardBtn.addEventListener('click', () => {
        this.fastForward();
      });
    }
  }

  /**
   * Setup speed control slider
   */
  setupSpeedControl() {
    if (this.domElements.speedSlider) {
      this.domElements.speedSlider.addEventListener('input', (e) => {
        this.updateSpeedDisplay(e.target.value);
      });
    }
  }

  /**
   * Setup progress bar for manual seeking
   */
  setupProgressBar() {
    if (this.domElements.progressBar) {
      this.domElements.progressBar.addEventListener('input', (e) => {
        const targetIdx = parseInt(e.target.value);
        this.seekToPosition(targetIdx);
      });
    }
  }

  /**
   * Toggle play/pause state
   */
  togglePlayPause() {
    if (
      !this.viewer.toolpathSegments ||
      this.viewer.toolpathSegments.length === 0
    ) {
      this.showNotification('No toolpath to simulate', 'warning');
      return;
    }

    if (this.simState.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Start or resume playback
   */
  play() {
    const segments = this.viewer.toolpathSegments;
    if (!segments || segments.length === 0) return;

    // If at end, restart from beginning
    if (this.simState.idx >= segments.length) {
      this.simState.idx = 0;
    }

    this.simState.playing = true;
    this.simState.paused = false;
    this.simState.stopped = false;

    this.updatePlayPauseIcon();
    this.runSimulation(this.simState.idx, true);
  }

  /**
   * Pause playback
   */
  pause() {
    this.simState.playing = false;
    this.simState.paused = true;
    this.simState.stopped = false;

    this.updatePlayPauseIcon();
    this.cancelAnimation();
  }

  /**
   * Stop playback and reset to beginning
   */
  stop() {
    this.simState.playing = false;
    this.simState.paused = false;
    this.simState.stopped = true;
    this.simState.idx = 0;

    this.updatePlayPauseIcon();
    this.cancelAnimation();
    this.seekToPosition(0);
  }

  /**
   * Rewind to beginning
   */
  rewind() {
    this.simState.idx = 0;
    this.simState.playing = false;
    this.simState.paused = false;
    this.simState.stopped = true;

    this.updatePlayPauseIcon();
    this.cancelAnimation();
    this.seekToPosition(0);
  }

  /**
   * Fast forward to end
   */
  fastForward() {
    const segments = this.viewer.toolpathSegments;
    if (!segments || segments.length === 0) return;

    this.simState.idx = segments.length;
    this.simState.playing = false;
    this.simState.paused = false;
    this.simState.stopped = true;

    this.updatePlayPauseIcon();
    this.cancelAnimation();
    this.seekToPosition(segments.length);
  }

  /**
   * Seek to a specific position in the toolpath
   * @param {number} targetIdx - Target segment index
   */
  seekToPosition(targetIdx) {
    const segments = this.viewer.toolpathSegments;
    if (!segments || segments.length === 0) return;

    const clampedIdx = Math.max(0, Math.min(targetIdx, segments.length));
    this.simState.idx = clampedIdx;

    // Update visualization
    this.updateVisualization(clampedIdx, false);
    this.updateProgressBar(clampedIdx);
    this.updateLineInfo(clampedIdx);
  }

  /**
   * Run simulation animation
   * @param {number} targetIdx - Target segment index
   * @param {boolean} preserveDrawn - Whether to preserve already drawn segments
   */
  runSimulation(targetIdx, preserveDrawn) {
    // Cancel any existing animation
    this.cancelAnimation();

    // Increment generation to invalidate old animations
    this.generation++;
    const thisGeneration = this.generation;

    const segments = this.viewer.toolpathSegments;
    if (!segments || segments.length === 0) return;

    const clampedTarget = Math.max(0, Math.min(targetIdx, segments.length));

    // If already at target, just update visualization
    if (this.simState.idx === clampedTarget) {
      this.updateVisualization(clampedTarget, preserveDrawn);
      return;
    }

    // Determine animation direction and step
    const step = this.simState.idx < clampedTarget ? 1 : -1;
    const speed = this.getAnimationSpeed();

    const animate = () => {
      // Check if this animation is still valid
      if (thisGeneration !== this.generation || !this.simState.playing) {
        return;
      }

      // Update current position
      this.simState.idx += step;

      // Check bounds
      if (this.simState.idx < 0) this.simState.idx = 0;
      if (this.simState.idx > segments.length)
        this.simState.idx = segments.length;

      // Update visualization
      this.updateVisualization(this.simState.idx, preserveDrawn);
      this.updateProgressBar(this.simState.idx);
      this.updateLineInfo(this.simState.idx);

      // Continue animation if not at target
      if (this.simState.idx !== clampedTarget && this.simState.playing) {
        this.animationId = setTimeout(animate, speed);
      } else {
        // Animation complete
        if (this.simState.idx >= segments.length) {
          // Reached end, stop simulation
          this.simState.playing = false;
          this.simState.stopped = true;
          this.updatePlayPauseIcon();
        }
      }
    };

    // Start animation
    animate();
  }

  /**
   * Update visualization based on current simulation position
   * @param {number} currentIdx - Current segment index
   * @param {boolean} preserveDrawn - Whether to preserve drawn segments
   */
  updateVisualization(currentIdx, _preserveDrawn) {
    if (!this.viewer.batchedGeometries) return;

    // Count segments by type up to current index
    const counts = { G0: 0, G1: 0, G2: 0, G3: 0 };

    for (
      let i = 0;
      i < Math.min(currentIdx, this.viewer.toolpathModes.length);
      i++
    ) {
      const mode = this.viewer.toolpathModes[i];
      if (Object.prototype.hasOwnProperty.call(counts, mode)) {
        counts[mode]++;
      }
    }

    // Update draw ranges for each geometry
    Object.keys(counts).forEach((mode) => {
      const geometry = this.viewer.batchedGeometries[mode];
      if (geometry) {
        geometry.setDrawRange(0, counts[mode] * 2);
      }
    });

    // Update tool position
    if (currentIdx > 0 && currentIdx <= this.viewer.toolpathSegments.length) {
      const segment = this.viewer.toolpathSegments[currentIdx - 1];
      if (segment && this.viewer.toolMesh) {
        const toolPosition = segment[1].clone();
        toolPosition.add(new THREE.Vector3(0, 0, this.viewer.ARROW_LENGTH));
        this.viewer.toolMesh.position.copy(toolPosition);
      }
    }

    // Render the scene
    if (this.viewer.renderFunction) {
      this.viewer.renderFunction();
    }
  }

  /**
   * Update play/pause button icon
   */
  updatePlayPauseIcon() {
    if (!this.domElements.playBtn || !this.domElements.runSimulationIcon)
      return;

    if (this.simState.playing) {
      this.domElements.playBtn.classList.remove('sim-play');
      this.domElements.playBtn.classList.add('sim-pause');
      this.domElements.runSimulationIcon.innerHTML = this.pauseIcon;
      this.domElements.playBtn.title = 'Pause';
    } else {
      this.domElements.playBtn.classList.remove('sim-pause');
      this.domElements.playBtn.classList.add('sim-play');
      this.domElements.runSimulationIcon.innerHTML = this.playIcon;
      this.domElements.playBtn.title = 'Play';
    }
  }

  /**
   * Update progress bar value
   * @param {number} value - Current position
   */
  updateProgressBar(value) {
    if (this.domElements.progressBar) {
      this.domElements.progressBar.value = value;

      // Update max value if needed
      const segments = this.viewer.toolpathSegments;
      if (segments && this.domElements.progressBar.max != segments.length) {
        this.domElements.progressBar.max = segments.length;
      }
    }
  }

  /**
   * Update speed display
   * @param {number} sliderValue - Speed slider value
   */
  updateSpeedDisplay(sliderValue) {
    if (this.domElements.speedValue) {
      const speed = this.calculateSpeedFromSlider(sliderValue);
      this.domElements.speedValue.textContent = speed.toFixed(0);
    }
  }

  /**
   * Update line information display
   * @param {number} segmentIdx - Current segment index
   */
  updateLineInfo(segmentIdx) {
    if (
      !this.domElements.gcodeLineInfo ||
      !this.viewer.lineMap ||
      !this.viewer.gcodeLines
    ) {
      return;
    }

    if (segmentIdx > 0 && segmentIdx <= this.viewer.lineMap.length) {
      const lineIdx = this.viewer.lineMap[segmentIdx - 1];
      const lineContent = this.viewer.gcodeLines[lineIdx];

      if (lineContent) {
        this.domElements.gcodeLineInfo.textContent = `Line ${lineIdx + 1}: ${lineContent}`;
        this.domElements.gcodeLineInfo.style.display = 'block';
      } else {
        this.domElements.gcodeLineInfo.style.display = 'none';
      }
    } else {
      this.domElements.gcodeLineInfo.style.display = 'none';
    }
  }

  /**
   * Get animation speed in milliseconds
   * @returns {number} Animation delay in milliseconds
   */
  getAnimationSpeed() {
    if (this.domElements.speedSlider) {
      const sliderValue = parseFloat(this.domElements.speedSlider.value);
      return this.calculateSpeedFromSlider(sliderValue);
    }
    return 50; // Default speed
  }

  /**
   * Calculate speed from slider value
   * @param {number} sliderValue - Slider value (0.001 to 10)
   * @returns {number} Speed in milliseconds
   */
  calculateSpeedFromSlider(sliderValue) {
    // Convert slider value to milliseconds (inverse relationship)
    // Slider: 0.001 (slowest) to 10 (fastest)
    // Speed: 1000ms (slowest) to 1ms (fastest)
    return Math.max(1, Math.round(1000 / (sliderValue * 100)));
  }

  /**
   * Cancel current animation
   */
  cancelAnimation() {
    if (this.animationId) {
      clearTimeout(this.animationId);
      this.animationId = null;
    }
    this.generation++; // Invalidate any running animations
  }

  /**
   * Show notification message
   * @param {string} message - Message text
   * @param {string} type - Message type ('info', 'warning', 'error')
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `viewer-notification viewer-notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '4px',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: '10001',
      maxWidth: '300px',
      wordWrap: 'break-word',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    });

    // Set background color based on type
    const colors = {
      info: '#17a2b8',
      warning: '#ffc107',
      error: '#dc3545',
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to document
    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  /**
   * Reset simulation state
   */
  reset() {
    this.cancelAnimation();
    this.simState = {
      playing: false,
      paused: false,
      stopped: true,
      idx: 0,
    };
    this.updatePlayPauseIcon();
    this.updateProgressBar(0);
    this.updateLineInfo(0);
  }

  /**
   * Get current simulation state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.simState };
  }

  /**
   * Cleanup and dispose of resources
   */
  dispose() {
    this.cancelAnimation();
    this.domElements = {};
  }
}

// Export for module use
export { ViewerControls };

// Global class for backward compatibility
window.ViewerControls = ViewerControls;
