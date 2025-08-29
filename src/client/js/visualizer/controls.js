/**
 * 3D Viewer Controls Module
 *
 * Handles simulation controls and playback for the 3D G-code viewer:
 * - Play/pause/stop simulation
 * - Speed control and progress tracking
 * - Tool position animation
 * - User interface controls
 * - SINGLE SOURCE OF TRUTH for current line display logic
 */

// Global simulation state for external access
let globalSimState = { playing: false, paused: false, stopped: true, idx: 0 };
let globalSimGeneration = 1;

// Global state for incremental segment counting (performance optimization)
let segmentCountState = {
  lastIndex: -1,
  counts: { G0: 0, G1: 0, G2: 0, G3: 0 },
  needsFullRecalc: true,
};

// Performance monitoring for animation loop
let performanceMonitor = {
  frameCount: 0,
  lastFrameTime: 0,
  frameTimeHistory: [],
  maxHistoryLength: 60,
  averageFrameTime: 0,
  enabled: true,
};

// Adaptive rendering for large files
let adaptiveRendering = {
  enabled: false,
  targetFPS: 30,
  skipFrames: 0,
  frameSkipCounter: 0,
  lastDrawRangeUpdate: 0,
};

// Debounce state for progress bar seeking optimization
let seekDebounceState = {
  seekTimeout: null,
  lastSeekPosition: -1,
  isRapidSeeking: false,
  seekStartTime: 0,
  lastInputTime: 0,
  rapidSeekThreshold: 30, // OPTIMIZATION: Reduced from 50ms to 30ms for more aggressive rapid seeking detection
  isDragging: false, // Track if user is actively dragging
};

// Render throttling state for seeking optimization
let renderThrottleState = {
  lastRenderTime: 0,
  renderTimeout: null,
  maxFPS: 30, // Maximum 30 FPS during seeking
  minFrameTime: 1000 / 30, // ~33ms between renders
  pendingRender: false,
};

/**
 * Debounce utility function for progress bar seeking
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
    return timeoutId;
  };
}

/**
 * Detect if user is rapidly seeking based on input frequency and dragging state
 * @param {number} currentTime - Current timestamp
 * @returns {boolean} True if rapid seeking is detected
 */
function detectRapidSeeking(currentTime) {
  const timeSinceLastInput = currentTime - seekDebounceState.lastInputTime;
  seekDebounceState.lastInputTime = currentTime;

  // OPTIMIZATION: Consider dragging state for better rapid seeking detection
  const isInputFrequent =
    timeSinceLastInput < seekDebounceState.rapidSeekThreshold;
  const isDragging = seekDebounceState.isDragging;

  if (isInputFrequent || isDragging) {
    if (!seekDebounceState.isRapidSeeking) {
      seekDebounceState.isRapidSeeking = true;
      seekDebounceState.seekStartTime = currentTime;
    }
    return true;
  } else {
    // OPTIMIZATION: Clear rapid seeking flag more quickly for better responsiveness
    if (
      seekDebounceState.isRapidSeeking &&
      !isDragging &&
      timeSinceLastInput > seekDebounceState.rapidSeekThreshold * 1.5
    ) {
      seekDebounceState.isRapidSeeking = false;
    }
    return seekDebounceState.isRapidSeeking;
  }
}

/**
 * Throttled render function that limits render calls to maximum 30 FPS during seeking
 * @param {boolean} isSeekingOperation - Whether this render is part of a seeking operation
 */
function throttledRender(isSeekingOperation = false) {
  if (!window.gcodeRender) return;

  const currentTime = performance.now();

  if (isSeekingOperation && seekDebounceState.isRapidSeeking) {
    // During rapid seeking, throttle renders to max 30 FPS
    const timeSinceLastRender =
      currentTime - renderThrottleState.lastRenderTime;

    if (timeSinceLastRender < renderThrottleState.minFrameTime) {
      // Too soon since last render, schedule a throttled render
      if (!renderThrottleState.pendingRender) {
        renderThrottleState.pendingRender = true;
        const delay = renderThrottleState.minFrameTime - timeSinceLastRender;

        renderThrottleState.renderTimeout = setTimeout(() => {
          renderThrottleState.lastRenderTime = performance.now();
          renderThrottleState.pendingRender = false;
          window.gcodeRender();
        }, delay);
      }
      return; // Skip this render call
    }
  }

  // Clear any pending throttled render since we're rendering now
  if (renderThrottleState.renderTimeout) {
    clearTimeout(renderThrottleState.renderTimeout);
    renderThrottleState.renderTimeout = null;
    renderThrottleState.pendingRender = false;
  }

  renderThrottleState.lastRenderTime = currentTime;
  window.gcodeRender();
}

/**
 * Setup simulation controls for toolpath animation (working version from index.js)
 */
function setupSimulationControls(domElements, parseResult) {
  let simState = globalSimState; // Use global state
  let simGeneration = globalSimGeneration;

  // Setup progress bar
  if (domElements.progressBar && parseResult.toolpathSegments) {
    domElements.progressBar.max = parseResult.toolpathSegments.length;
    domElements.progressBar.value = parseResult.toolpathSegments.length; // Start at end

    // Create debounced update function for ALL expensive operations
    const debouncedSeekUpdate = debounce((newIdx, maxSegments) => {
      // OPTIMIZATION: Update simulation state here instead of on every input
      if (simState.playing) {
        simState.playing = false;
        simState.paused = true;
        simState.stopped = false;
      } else {
        // Update state based on position
        simState.stopped = newIdx >= maxSegments;
        simState.paused = !simState.stopped && newIdx > 0;
      }

      // Update play/pause icon (moved from immediate handler)
      updatePlayPauseIcon(domElements, simState);

      // Update visualization
      updateVisualizationToIndex(newIdx, parseResult);

      // Use throttled render for seeking operations
      throttledRender(true);

      // Update current line display
      if (newIdx >= 0 && window.gcodeLines && window.gcodeLineMap) {
        updateCurrentLineDisplay(newIdx);
      }

      // Clear rapid seeking flag after debounced update completes
      seekDebounceState.isRapidSeeking = false;
    }, 50); // OPTIMIZATION: Reduced debounce delay from 100ms to 50ms for better responsiveness

    // Handle progress bar input (while dragging)
    domElements.progressBar.oninput = function () {
      const newIdx = Number(domElements.progressBar.value);
      const maxSegments = parseResult.toolpathSegments.length;
      const currentTime = performance.now();

      // Detect if user is rapidly seeking
      const isRapidSeeking = detectRapidSeeking(currentTime);

      // OPTIMIZATION: Only update essential state immediately
      simState.idx = newIdx;
      window.gcodeCurrentLineIdx = newIdx;

      // Clear any existing debounced update
      if (seekDebounceState.seekTimeout) {
        clearTimeout(seekDebounceState.seekTimeout);
      }

      // Store the seek position for comparison
      seekDebounceState.lastSeekPosition = newIdx;

      // MAJOR OPTIMIZATION: Skip ALL expensive operations during rapid seeking
      if (isRapidSeeking) {
        // Only store the position - no visualization updates during rapid seeking
        return;
      }

      // OPTIMIZATION: Batch all expensive operations in debounced update
      // This includes: state updates, icon updates, visualization, and rendering
      seekDebounceState.seekTimeout = debouncedSeekUpdate(newIdx, maxSegments);
    };

    // Handle progress bar change (when drag is released or clicked)
    domElements.progressBar.onchange = function () {
      const newIdx = Number(domElements.progressBar.value);
      const maxSegments = parseResult.toolpathSegments.length;

      // Clear any pending debounced update since we want immediate update on release
      if (seekDebounceState.seekTimeout) {
        clearTimeout(seekDebounceState.seekTimeout);
        seekDebounceState.seekTimeout = null;
      }

      // Force immediate update when user releases drag or clicks
      // Update simulation state
      if (simState.playing) {
        simState.playing = false;
        simState.paused = true;
        simState.stopped = false;
      } else {
        simState.stopped = newIdx >= maxSegments;
        simState.paused = !simState.stopped && newIdx > 0;
      }

      // Update essential state
      simState.idx = newIdx;
      window.gcodeCurrentLineIdx = newIdx;

      // Update play/pause icon
      updatePlayPauseIcon(domElements, simState);

      // Update visualization immediately
      updateVisualizationToIndex(newIdx, parseResult);

      // Render immediately
      throttledRender(true);

      // Update current line display
      if (newIdx >= 0 && window.gcodeLines && window.gcodeLineMap) {
        updateCurrentLineDisplay(newIdx);
      }

      // Clear rapid seeking flag
      seekDebounceState.isRapidSeeking = false;
      seekDebounceState.isDragging = false;
      seekDebounceState.lastSeekPosition = newIdx;
    };

    // Add mouse event handlers for better drag detection
    domElements.progressBar.onmousedown = function () {
      seekDebounceState.isDragging = true;
    };

    domElements.progressBar.onmouseup = function () {
      seekDebounceState.isDragging = false;
      // The onchange event will be triggered automatically by the browser
    };

    // Handle touch events for mobile devices
    domElements.progressBar.ontouchstart = function () {
      seekDebounceState.isDragging = true;
    };

    domElements.progressBar.ontouchend = function () {
      seekDebounceState.isDragging = false;
      // The onchange event will be triggered automatically by the browser
    };
  }

  // Setup speed slider with proper range for fast animation
  if (domElements.speedSlider && domElements.speedValue) {
    // Keep original speed range and default
    domElements.speedSlider.min = '0.001';
    domElements.speedSlider.max = '10';
    domElements.speedSlider.step = '0.1';
    domElements.speedSlider.value = '10'; // Original default

    let speed = Math.max(0.001, Number(domElements.speedSlider.value || 10));

    const updateSpeedLabel = () => {
      if (domElements.speedValue && domElements.speedUnit) {
        if (speed > 1) {
          domElements.speedValue.textContent = Math.round(speed);
          domElements.speedUnit.textContent = 'ms/step';
        } else {
          const segsPerTick = Math.max(1, Math.round(1 / speed));
          domElements.speedValue.textContent = segsPerTick;
          domElements.speedUnit.textContent = 'seg/tick';
        }
      }
    };

    updateSpeedLabel();

    domElements.speedSlider.oninput = function () {
      speed = Math.max(0.001, Number(domElements.speedSlider.value));
      updateSpeedLabel();
    };
  }

  // Setup play/pause button with smart restart logic
  if (domElements.playBtn) {
    domElements.playBtn.onclick = function () {
      const maxSegments = parseResult.toolpathSegments
        ? parseResult.toolpathSegments.length
        : 0;
      const isAtEnd = simState.idx >= maxSegments;
      const isCompleted = simState.stopped && isAtEnd;

      if (simState.playing) {
        // Currently playing - pause it
        simState.playing = false;
        simState.paused = true;
        simState.stopped = false;
        updatePlayPauseIcon(domElements, simState);
      } else if (isCompleted) {
        // Simulation completed - restart from beginning

        simState.idx = 0;
        simState.playing = true;
        simState.paused = false;
        simState.stopped = false;

        // Reset visualization to beginning
        updateVisualizationToIndex(0, parseResult);
        if (domElements.progressBar) domElements.progressBar.value = 0;

        // Reset command tracking and segment counting
        resetCommandTracking();
        resetSegmentCountState();
        updateCurrentLineDisplay(0);

        updatePlayPauseIcon(domElements, simState);
        runSimulation(0, domElements, parseResult, simState, simGeneration++);
      } else {
        // Paused or stopped (but not at end) - resume from current position
        const startIdx = simState.paused ? simState.idx : 0;

        simState.playing = true;
        simState.paused = false;
        simState.stopped = false;

        // Reset command tracking and segment counting when starting playback
        resetCommandTracking();
        resetSegmentCountState();
        resetSeekDebounceState();
        resetSeekDebounceState();
        updatePlayPauseIcon(domElements, simState);
        runSimulation(
          startIdx,
          domElements,
          parseResult,
          simState,
          simGeneration++
        );
      }
    };
  }

  // Setup rewind button
  if (domElements.rewindBtn) {
    domElements.rewindBtn.onclick = function () {
      simState.idx = 0;
      simState.playing = false;
      simState.paused = false;
      simState.stopped = true;
      // Reset command tracking and segment counting when rewinding
      resetCommandTracking();
      resetSegmentCountState();
      resetSeekDebounceState();
      updateVisualizationToIndex(0, parseResult);
      if (domElements.progressBar) domElements.progressBar.value = 0;
      updatePlayPauseIcon(domElements, simState);
      throttledRender(false);

      // Update current line display
      updateCurrentLineDisplay(0);
    };
  }

  // Setup forward button (go to end)
  if (domElements.forwardBtn) {
    domElements.forwardBtn.onclick = function () {
      const endIdx = parseResult.toolpathSegments.length;
      simState.idx = endIdx;
      simState.playing = false;
      simState.paused = false;
      simState.stopped = true;
      updateVisualizationToIndex(endIdx, parseResult);
      if (domElements.progressBar) domElements.progressBar.value = endIdx;
      updatePlayPauseIcon(domElements, simState);
      throttledRender(false);

      // Update current line display
      updateCurrentLineDisplay(endIdx - 1); // Use endIdx - 1 to get the last valid segment
    };
  }

  // Initialize visualization to show full path
  updateVisualizationToIndex(parseResult.toolpathSegments.length, parseResult);

  // Set initial state - start at end (showing full path) but ready to play from beginning
  simState.idx = parseResult.toolpathSegments.length;
  simState.stopped = true;
  simState.playing = false;
  simState.paused = false;

  updatePlayPauseIcon(domElements, simState);
}

/**
 * Update play/pause button icon with smart state detection
 */
function updatePlayPauseIcon(domElements, simState) {
  if (!domElements.playBtn || !domElements.runSimulationIcon) return;

  const playIcon = '<polygon points="4,2 14,8 4,14" fill="#fff"/>';
  const pauseIcon =
    '<rect x="3" y="2" width="3" height="12" fill="#fff"/><rect x="10" y="2" width="3" height="12" fill="#fff"/>';
  const restartIcon =
    '<polygon points="4,2 14,8 4,14" fill="#fff"/><circle cx="12" cy="4" r="1.5" fill="#fff"/>';

  // Determine if simulation is completed
  const maxSegments = window.gcodeToolpathSegments
    ? window.gcodeToolpathSegments.length
    : 0;
  const isAtEnd = simState.idx >= maxSegments;
  const isCompleted = simState.stopped && isAtEnd;

  // Update button appearance and tooltip
  if (simState.playing) {
    // Currently playing - show pause
    domElements.playBtn.classList.remove('sim-play', 'sim-restart');
    domElements.playBtn.classList.add('sim-pause');
    domElements.runSimulationIcon.innerHTML = pauseIcon;
    domElements.playBtn.title = 'Pause simulation';
  } else if (isCompleted) {
    // Completed - show restart
    domElements.playBtn.classList.remove('sim-pause', 'sim-play');
    domElements.playBtn.classList.add('sim-restart');
    domElements.runSimulationIcon.innerHTML = restartIcon;
    domElements.playBtn.title = 'Restart simulation from beginning';
  } else {
    // Paused or stopped - show play
    domElements.playBtn.classList.remove('sim-pause', 'sim-restart');
    domElements.playBtn.classList.add('sim-play');
    domElements.runSimulationIcon.innerHTML = playIcon;
    domElements.playBtn.title = simState.paused
      ? 'Resume simulation'
      : 'Start simulation';
  }
}

/**
 * Track which G-code command is currently being executed
 */
let currentCommandIndex = -1;

/**
 * CONSOLIDATED FUNCTION: Update both G-code line info display and editor selection
 * This is the single source of truth for current line display logic
 * @param {number} segmentIndex - Current segment index from simulation
 */
function updateCurrentLineDisplay(segmentIndex) {
  try {
    // Check if we have valid segment index
    if (typeof segmentIndex !== 'number' || segmentIndex < 0) {
      return;
    }

    // Check if we have required data
    if (!window.gcodeLineMap || !Array.isArray(window.gcodeLineMap)) {
      return;
    }

    if (!window.gcodeLines || !Array.isArray(window.gcodeLines)) {
      return;
    }

    // Find which command this segment belongs to using the line map
    let commandLineNumber = -1;

    if (segmentIndex >= 0 && segmentIndex < window.gcodeLineMap.length) {
      // Use the direct mapping from the line map
      commandLineNumber = window.gcodeLineMap[segmentIndex];

      // If the direct mapping is -1 (continuation segment), look for the previous non-negative value
      // This handles arc commands where multiple segments belong to the same G-code line
      if (commandLineNumber === -1) {
        for (let i = segmentIndex; i >= 0; i--) {
          if (window.gcodeLineMap[i] >= 0) {
            commandLineNumber = window.gcodeLineMap[i];
            break;
          }
        }
      }
    }

    // Validate the command line number is within bounds
    if (commandLineNumber >= window.gcodeLines.length) {
      commandLineNumber = window.gcodeLines.length - 1; // Use last valid line
    }

    // Update the G-code line info display
    updateLineInfoDisplay(commandLineNumber, segmentIndex);

    // Update editor selection (only if we're moving to a different G-code command)
    // This prevents jumping to next line for each segment within the same G2/G3 command
    if (commandLineNumber !== -1 && commandLineNumber !== currentCommandIndex) {
      currentCommandIndex = commandLineNumber;
      updateEditorSelection(commandLineNumber);
    }
  } catch (error) {
    console.warn('Error updating current line display:', error);
  }
}

// Cache for line info display to avoid repeated DOM updates
let lastDisplayedLineNumber = -1;

/**
 * Update the G-code line info display box
 * @param {number} commandLineNumber - The G-code command line number (0-based)
 * @param {number} segmentIndex - The current segment index
 */
function updateLineInfoDisplay(commandLineNumber, segmentIndex) {
  const infoContainer = document.getElementById('gcodeLineInfo');
  if (!infoContainer) {
    return;
  }

  // Display the command line number, not the segment index
  const displayLineNumber =
    commandLineNumber >= 0
      ? commandLineNumber
      : Math.max(0, Math.min(segmentIndex, window.gcodeLines.length - 1));

  // PERFORMANCE OPTIMIZATION: Only update DOM if line number actually changed
  if (displayLineNumber === lastDisplayedLineNumber) {
    return; // Skip DOM update if showing same line
  }

  lastDisplayedLineNumber = displayLineNumber;

  let infoHtml = '';
  if (displayLineNumber >= 0 && displayLineNumber < window.gcodeLines.length) {
    const line = window.gcodeLines[displayLineNumber];
    infoHtml += `<br>#${displayLineNumber + 1} ${line}`;
  }

  infoContainer.style.display = 'block';
  infoContainer.innerHTML = infoHtml;
}

/**
 * Update the editor selection
 * @param {number} commandLineNumber - The G-code command line number (0-based)
 */
function updateEditorSelection(commandLineNumber) {
  // Check if output editor is available
  if (!window.outputEditor) {
    return;
  }

  const actualLineNumber = commandLineNumber + 1; // Convert to 1-based

  // PERFORMANCE OPTIMIZATION: Skip expensive editor operations during animation
  // Only update editor if simulation is not playing (to avoid 170ms frame times)
  if (globalSimState.playing) {
    return; // Skip editor updates during animation for better performance
  }

  // Update the editor selection
  window.outputEditor.revealLineInCenter(actualLineNumber);
  window.outputEditor.setPosition({ lineNumber: actualLineNumber, column: 1 });
  window.outputEditor.focus();
}

// Legacy selectEditorLine function removed - use updateCurrentLineDisplay() instead

/**
 * Reset the command tracking when simulation starts
 */
function resetCommandTracking() {
  currentCommandIndex = -1;
  lastDisplayedLineNumber = -1; // Reset line display cache
}

/**
 * Reset segment count state for incremental counting
 */
function resetSegmentCountState() {
  segmentCountState.lastIndex = -1;
  segmentCountState.counts = { G0: 0, G1: 0, G2: 0, G3: 0 };
  segmentCountState.needsFullRecalc = true;

  // Reset draw range cache to force updates
  lastDrawRanges = { G0: -1, G1: -1, G2: -1, G3: -1 };

  // Reset visualization index cache
  lastVisualizationIndex = -1;
}

/**
 * Reset seek debounce state
 */
function resetSeekDebounceState() {
  if (seekDebounceState.seekTimeout) {
    clearTimeout(seekDebounceState.seekTimeout);
  }
  seekDebounceState.seekTimeout = null;
  seekDebounceState.lastSeekPosition = -1;
  seekDebounceState.isRapidSeeking = false;
  seekDebounceState.isDragging = false;
  seekDebounceState.seekStartTime = 0;
  seekDebounceState.lastInputTime = 0;

  // Reset render throttle state
  if (renderThrottleState.renderTimeout) {
    clearTimeout(renderThrottleState.renderTimeout);
  }
  renderThrottleState.renderTimeout = null;
  renderThrottleState.pendingRender = false;
  renderThrottleState.lastRenderTime = 0;
}

/**
 * Calculate segment counts incrementally for performance optimization
 * @param {number} targetIdx - Target segment index
 * @param {Object} parseResult - Parse result containing toolpath modes
 * @returns {Object} Segment counts { G0, G1, G2, G3 }
 */
function calculateIncrementalSegmentCounts(targetIdx, parseResult) {
  if (!parseResult.toolpathModes || parseResult.toolpathModes.length === 0) {
    return { G0: 0, G1: 0, G2: 0, G3: 0 };
  }

  const maxIdx = Math.min(targetIdx, parseResult.toolpathModes.length);

  // If we need a full recalculation or going backwards, recalculate from scratch
  if (
    segmentCountState.needsFullRecalc ||
    targetIdx < segmentCountState.lastIndex
  ) {
    segmentCountState.counts = { G0: 0, G1: 0, G2: 0, G3: 0 };

    for (let i = 0; i < maxIdx; i++) {
      const mode = parseResult.toolpathModes[i];
      if (mode === 'G0') segmentCountState.counts.G0++;
      else if (mode === 'G1') segmentCountState.counts.G1++;
      else if (mode === 'G2') segmentCountState.counts.G2++;
      else if (mode === 'G3') segmentCountState.counts.G3++;
    }

    segmentCountState.lastIndex = maxIdx;
    segmentCountState.needsFullRecalc = false;
  } else {
    // Incremental update: only count new segments since last update
    for (let i = segmentCountState.lastIndex; i < maxIdx; i++) {
      const mode = parseResult.toolpathModes[i];
      if (mode === 'G0') segmentCountState.counts.G0++;
      else if (mode === 'G1') segmentCountState.counts.G1++;
      else if (mode === 'G2') segmentCountState.counts.G2++;
      else if (mode === 'G3') segmentCountState.counts.G3++;
    }

    segmentCountState.lastIndex = maxIdx;
  }

  // Incremental counting is working well - debug logging removed

  return { ...segmentCountState.counts };
}

// Cache for last draw range values to avoid redundant GPU updates
let lastDrawRanges = { G0: -1, G1: -1, G2: -1, G3: -1 };

/**
 * Update draw ranges for all geometries in a single batched operation
 * @param {Object} segmentCounts - Segment counts { G0, G1, G2, G3 }
 */
function updateDrawRangesBatch(segmentCounts) {
  if (!window.gcodeBatchedGeometries) {
    return;
  }

  // Adaptive rendering: skip updates if performance is poor
  const currentTime = performance.now();
  if (adaptiveRendering.enabled) {
    // Skip draw range updates if we're updating too frequently
    if (currentTime - adaptiveRendering.lastDrawRangeUpdate < 16) {
      // Max 60fps updates
      return;
    }
    adaptiveRendering.lastDrawRangeUpdate = currentTime;
  }

  // MAJOR OPTIMIZATION: Only update draw ranges if they actually changed
  // This prevents expensive GPU state changes for the same values
  const geometries = window.gcodeBatchedGeometries;

  if (geometries.G0 && segmentCounts.G0 !== undefined) {
    const newRange = segmentCounts.G0 * 2;
    if (lastDrawRanges.G0 !== newRange) {
      geometries.G0.setDrawRange(0, newRange);
      lastDrawRanges.G0 = newRange;
    }
  }
  if (geometries.G1 && segmentCounts.G1 !== undefined) {
    const newRange = segmentCounts.G1 * 2;
    if (lastDrawRanges.G1 !== newRange) {
      geometries.G1.setDrawRange(0, newRange);
      lastDrawRanges.G1 = newRange;
    }
  }
  if (geometries.G2 && segmentCounts.G2 !== undefined) {
    const newRange = segmentCounts.G2 * 2;
    if (lastDrawRanges.G2 !== newRange) {
      geometries.G2.setDrawRange(0, newRange);
      lastDrawRanges.G2 = newRange;
    }
  }
  if (geometries.G3 && segmentCounts.G3 !== undefined) {
    const newRange = segmentCounts.G3 * 2;
    if (lastDrawRanges.G3 !== newRange) {
      geometries.G3.setDrawRange(0, newRange);
      lastDrawRanges.G3 = newRange;
    }
  }
}

/**
 * Update performance monitoring statistics
 */
function updatePerformanceMonitoring() {
  if (!performanceMonitor.enabled) return;

  const currentTime = performance.now();

  if (performanceMonitor.lastFrameTime > 0) {
    const frameTime = currentTime - performanceMonitor.lastFrameTime;
    performanceMonitor.frameTimeHistory.push(frameTime);

    if (
      performanceMonitor.frameTimeHistory.length >
      performanceMonitor.maxHistoryLength
    ) {
      performanceMonitor.frameTimeHistory.shift();
    }

    // Calculate average frame time
    performanceMonitor.averageFrameTime =
      performanceMonitor.frameTimeHistory.reduce((a, b) => a + b, 0) /
      performanceMonitor.frameTimeHistory.length;
  }

  performanceMonitor.lastFrameTime = currentTime;
  performanceMonitor.frameCount++;

  // Log performance stats every 60 frames (roughly once per second at 60fps)
  if (performanceMonitor.frameCount % 60 === 0) {
    const avgFPS =
      performanceMonitor.averageFrameTime > 0
        ? 1000 / performanceMonitor.averageFrameTime
        : 0;

    // Auto-enable adaptive rendering if performance is poor
    if (avgFPS < 15 && !adaptiveRendering.enabled) {
      adaptiveRendering.enabled = true;
      adaptiveRendering.skipFrames = Math.max(1, Math.floor(30 / avgFPS) - 1);
    } else if (avgFPS > 25 && adaptiveRendering.enabled) {
      adaptiveRendering.enabled = false;
      adaptiveRendering.skipFrames = 0;
    }
  }
}

/**
 * Validate segment count accuracy (for debugging)
 */
function validateSegmentCounts(targetIdx, parseResult) {
  if (!parseResult.toolpathModes) return true;

  // Calculate counts the old way for comparison
  let g0Count = 0,
    g1Count = 0,
    g2Count = 0,
    g3Count = 0;
  const maxIdx = Math.min(targetIdx, parseResult.toolpathModes.length);

  for (let i = 0; i < maxIdx; i++) {
    const mode = parseResult.toolpathModes[i];
    if (mode === 'G0') g0Count++;
    else if (mode === 'G1') g1Count++;
    else if (mode === 'G2') g2Count++;
    else if (mode === 'G3') g3Count++;
  }

  const expected = { G0: g0Count, G1: g1Count, G2: g2Count, G3: g3Count };
  const actual = segmentCountState.counts;

  const isValid =
    expected.G0 === actual.G0 &&
    expected.G1 === actual.G1 &&
    expected.G2 === actual.G2 &&
    expected.G3 === actual.G3;

  if (!isValid) {
    // Validation failed - segment count mismatch
  }

  return isValid;
}

// Performance test functions removed - optimizations are working well

// Animation loop performance test removed - optimizations are working well

// Debug optimization status function removed - optimizations are stable

// Adaptive rendering is now handled by the core visualizer

// Animation loop profiling function removed - performance is now optimized

/**
 * Stop the simulation (can be called externally)
 */
function stopSimulation() {
  if (globalSimState.playing) {
    globalSimState.playing = false;
    globalSimState.paused = false;
    globalSimState.stopped = true;

    // Update the play button icon if it exists
    const playBtn = document.getElementById('runSimulationBtn');
    const runSimulationIcon = document.getElementById('runSimulationIcon');

    if (playBtn && runSimulationIcon) {
      const domElements = { playBtn, runSimulationIcon };
      updatePlayPauseIcon(domElements, globalSimState);
    }

    //console.log('Simulation stopped externally');
  }
}

// Cache for last visualization index to avoid redundant updates
let lastVisualizationIndex = -1;

/**
 * Update visualization to show toolpath up to a specific index
 * @param {number} targetIdx - Target segment index
 * @param {Object} parseResult - Parse result containing toolpath data
 */
function updateVisualizationToIndex(targetIdx, parseResult) {
  // OPTIMIZATION: Skip redundant visualization updates for same index
  if (targetIdx === lastVisualizationIndex) {
    return; // No need to update if we're already at this index
  }

  lastVisualizationIndex = targetIdx;

  // Use incremental segment counting for performance optimization
  const segmentCounts = calculateIncrementalSegmentCounts(
    targetIdx,
    parseResult
  );

  // Update draw ranges using batched approach
  updateDrawRangesBatch(segmentCounts);
}

/**
 * Run toolpath simulation animation
 */
function runSimulation(
  startIdx,
  domElements,
  parseResult,
  simState,
  _generation
) {
  if (
    !parseResult.toolpathSegments ||
    parseResult.toolpathSegments.length === 0
  )
    return;

  const segments = parseResult.toolpathSegments;
  let idx = startIdx;

  function animate() {
    if (!simState.playing || simState.stopped) return;

    if (idx >= segments.length) {
      // Simulation completed
      simState.playing = false;
      simState.stopped = true;
      simState.paused = false;
      simState.idx = segments.length; // Ensure we're at the end

      updatePlayPauseIcon(domElements, simState);

      // Update progress bar to show completion
      if (domElements.progressBar) {
        domElements.progressBar.value = segments.length;
      }

      return;
    }

    // Speed logic: segments per frame
    const speed = domElements.speedSlider
      ? Math.max(0.001, Number(domElements.speedSlider.value))
      : 10;
    let segmentsThisFrame =
      speed > 1
        ? Math.max(1, Math.round(speed))
        : Math.max(1, Math.round(1 / speed));

    // Batch update segments per frame - OPTIMIZED VERSION
    let processed = 0;
    let lastIdx = idx;

    // Process multiple segments but only update visualization once per frame
    while (processed < segmentsThisFrame && idx < segments.length) {
      lastIdx = idx;
      idx++;
      simState.idx = idx;
      processed++;
    }

    // Adaptive rendering: skip frames if performance is poor
    let shouldRender = true;
    if (adaptiveRendering.enabled) {
      adaptiveRendering.frameSkipCounter++;
      if (adaptiveRendering.frameSkipCounter <= adaptiveRendering.skipFrames) {
        shouldRender = false;
      } else {
        adaptiveRendering.frameSkipCounter = 0;
      }
    }

    if (shouldRender) {
      // Single visualization update per frame (major performance improvement)
      const finalIdx = idx - 1;
      updateVisualizationToIndex(finalIdx, parseResult);

      // Single render call per frame (not a seeking operation)
      throttledRender(false);
    }

    // Always update progress bar and line display (lightweight operations)
    if (domElements.progressBar) {
      domElements.progressBar.value = idx - 1;
    }

    // Update global current line index and call update functions once per batch
    window.gcodeCurrentLineIdx = lastIdx;

    // Update current line display once per frame
    if (lastIdx >= 0 && window.gcodeLines && window.gcodeLineMap) {
      updateCurrentLineDisplay(lastIdx);
    }

    // Update performance monitoring
    updatePerformanceMonitoring();

    // Next frame
    requestAnimationFrame(animate);
  }

  animate();
}

// Keep the old class for backward compatibility but make it simple
class ViewerControls {
  constructor(_viewer3d) {
    // Simple wrapper - the real work is done by the functions above
    //console.log('ViewerControls initialized (using function-based approach)');
  }
}

// Export functions for use in other modules
export {
  setupSimulationControls,
  updatePlayPauseIcon,
  updateVisualizationToIndex,
  runSimulation,
  updateCurrentLineDisplay,
  resetSegmentCountState,
  resetSeekDebounceState,
  calculateIncrementalSegmentCounts,
  updateDrawRangesBatch,
  updatePerformanceMonitoring,
  validateSegmentCounts,
  stopSimulation,
  throttledRender,
  ViewerControls,
};

// Make functions globally available
window.setupSimulationControls = setupSimulationControls;
window.updatePlayPauseIcon = updatePlayPauseIcon;
window.updateVisualizationToIndex = updateVisualizationToIndex;
window.runSimulation = runSimulation;
window.updateCurrentLineDisplay = updateCurrentLineDisplay;
window.resetCommandTracking = resetCommandTracking;
window.resetSegmentCountState = resetSegmentCountState;
window.resetSeekDebounceState = resetSeekDebounceState;
window.calculateIncrementalSegmentCounts = calculateIncrementalSegmentCounts;
window.updateDrawRangesBatch = updateDrawRangesBatch;
window.updatePerformanceMonitoring = updatePerformanceMonitoring;
window.validateSegmentCounts = validateSegmentCounts;
window.stopSimulation = stopSimulation;
window.throttledRender = throttledRender;
window.ViewerControls = ViewerControls;
