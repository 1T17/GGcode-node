/**
 * 3D Viewer Controls Module
 *
 * Handles simulation controls and playback for the 3D G-code viewer:
 * - Play/pause/stop simulation
 * - Speed control and progress tracking
 * - Tool position animation
 * - User interface controls
 */

/**
 * Setup simulation controls for toolpath animation (working version from index.js)
 */
function setupSimulationControls(domElements, parseResult) {
  let simState = { playing: false, paused: false, stopped: true, idx: 0 };
  let simGeneration = 1;

  // Setup progress bar
  if (domElements.progressBar && parseResult.toolpathSegments) {
    domElements.progressBar.max = parseResult.toolpathSegments.length;
    domElements.progressBar.value = parseResult.toolpathSegments.length; // Start at end

    domElements.progressBar.oninput = function () {
      const newIdx = Number(domElements.progressBar.value);
      simState.idx = newIdx;
      updateVisualizationToIndex(newIdx, parseResult);
      if (window.gcodeRender) window.gcodeRender();
      // Update info box with current line
      window.gcodeCurrentLineIdx = newIdx;
      if (window.updateGcodeLineInfo) window.updateGcodeLineInfo(newIdx);
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

  // Setup play/pause button
  if (domElements.playBtn) {
    domElements.playBtn.onclick = function () {
      if (simState.playing) {
        // Pause
        simState.playing = false;
        simState.paused = true;
        updatePlayPauseIcon(domElements, simState);
      } else {
        // Play
        simState.playing = true;
        simState.paused = false;
        simState.stopped = false;
        updatePlayPauseIcon(domElements, simState);
        runSimulation(
          simState.idx,
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
      updateVisualizationToIndex(0, parseResult);
      if (domElements.progressBar) domElements.progressBar.value = 0;
      updatePlayPauseIcon(domElements, simState);
      if (window.gcodeRender) window.gcodeRender();
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
      if (window.gcodeRender) window.gcodeRender();
    };
  }

  // Initialize visualization to show full path
  updateVisualizationToIndex(parseResult.toolpathSegments.length, parseResult);
  updatePlayPauseIcon(domElements, simState);
}

/**
 * Update play/pause button icon
 */
function updatePlayPauseIcon(domElements, simState) {
  if (!domElements.playBtn || !domElements.runSimulationIcon) return;

  const playIcon = '<polygon points="4,2 14,8 4,14" fill="#fff"/>';
  const pauseIcon =
    '<rect x="3" y="2" width="3" height="12" fill="#fff"/><rect x="10" y="2" width="3" height="12" fill="#fff"/>';

  if (simState.playing) {
    domElements.playBtn.classList.remove('sim-play');
    domElements.playBtn.classList.add('sim-pause');
    domElements.runSimulationIcon.innerHTML = pauseIcon;
  } else {
    domElements.playBtn.classList.remove('sim-pause');
    domElements.playBtn.classList.add('sim-play');
    domElements.runSimulationIcon.innerHTML = playIcon;
  }
}

/**
 * Update visualization to show toolpath up to a specific index
 */
function updateVisualizationToIndex(targetIdx, parseResult) {
  // Count segments by type up to targetIdx
  let g0Count = 0,
    g1Count = 0,
    g2Count = 0,
    g3Count = 0;

  for (
    let i = 0;
    i < Math.min(targetIdx, parseResult.toolpathModes.length);
    i++
  ) {
    const mode = parseResult.toolpathModes[i];
    if (mode === 'G0') g0Count++;
    else if (mode === 'G1') g1Count++;
    else if (mode === 'G2') g2Count++;
    else if (mode === 'G3') g3Count++;
  }

  // Update draw ranges for batched geometries
  if (window.gcodeBatchedGeometries) {
    if (window.gcodeBatchedGeometries.G0)
      window.gcodeBatchedGeometries.G0.setDrawRange(0, g0Count * 2);
    if (window.gcodeBatchedGeometries.G1)
      window.gcodeBatchedGeometries.G1.setDrawRange(0, g1Count * 2);
    if (window.gcodeBatchedGeometries.G2)
      window.gcodeBatchedGeometries.G2.setDrawRange(0, g2Count * 2);
    if (window.gcodeBatchedGeometries.G3)
      window.gcodeBatchedGeometries.G3.setDrawRange(0, g3Count * 2);
  }
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
      simState.playing = false;
      simState.stopped = true;
      updatePlayPauseIcon(domElements, simState);
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

    // Batch update segments per frame
    let processed = 0;
    while (processed < segmentsThisFrame && idx < segments.length) {
      updateVisualizationToIndex(idx, parseResult);
      if (domElements.progressBar) domElements.progressBar.value = idx;
      // Update info box with current line during playback
      window.gcodeCurrentLineIdx = idx;
      if (window.updateGcodeLineInfo) window.updateGcodeLineInfo(idx);
      idx++;
      simState.idx = idx;
      processed++;
    }

    // Render once per frame
    if (window.gcodeRender) window.gcodeRender();

    // Next frame
    requestAnimationFrame(animate);
  }

  animate();
}

// Keep the old class for backward compatibility but make it simple
class ViewerControls {
  constructor(_viewer3d) {
    // Simple wrapper - the real work is done by the functions above
    console.log('ViewerControls initialized (using function-based approach)');
  }
}

// Export functions for use in other modules
export {
  setupSimulationControls,
  updatePlayPauseIcon,
  updateVisualizationToIndex,
  runSimulation,
  ViewerControls,
};

// Make functions globally available
window.setupSimulationControls = setupSimulationControls;
window.updatePlayPauseIcon = updatePlayPauseIcon;
window.updateVisualizationToIndex = updateVisualizationToIndex;
window.runSimulation = runSimulation;
window.ViewerControls = ViewerControls;
