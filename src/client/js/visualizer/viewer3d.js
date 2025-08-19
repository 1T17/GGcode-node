/**
 * 3D G-code Visualizer Module
 *
 * Provides 3D visualization of G-code toolpaths using Three.js:
 * - G-code parsing and path generation
 * - 3D scene setup and rendering
 * - Tool position visualization
 * - Performance optimization for large files
 */

class GcodeViewer3D {
  constructor() {
    // Performance optimization constants
    this.ARROW_LENGTH = 1;
    this.ARROW_HEAD_LENGTH = 0.2;
    this.ARROW_HEAD_WIDTH = 0.1;

    // G-code parsing regex patterns (cached for performance)
    this.GCODE_REGEX = {
      G_MODE: /G([0123])/g,
      X_COORD: /X(-?\d*\.?\d+)/i,
      Y_COORD: /Y(-?\d*\.?\d+)/i,
      Z_COORD: /Z(-?\d*\.?\d+)/i,
      I_OFFSET: /I(-?\d*\.?\d+)/i,
      J_OFFSET: /J(-?\d*\.?\d+)/i,
      R_RADIUS: /R(-?\d*\.?\d+)/i,
      HAS_COORDS: /[XYZIJR]/i,
      N_LINE: /^N\d+\s*/,
    };

    // Batched line rendering for performance
    this.batchedLines = { G0: null, G1: null, G2: null, G3: null };
    this.batchedGeometries = { G0: null, G1: null, G2: null, G3: null };
    this.batchedCounts = { G0: 0, G1: 0, G2: 0, G3: 0 };

    // Performance statistics
    this.performanceStats = {
      parseTime: 0,
      renderTime: 0,
      segmentCount: 0,
      lineCount: 0,
    };

    // Scene objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.toolMesh = null;
    this.renderFunction = null;

    // Toolpath data
    this.toolpathPoints = [];
    this.toolpathSegments = [];
    this.toolpathModes = [];
    this.lineMap = [];
    this.gcodeLines = [];
    this.segmentCounts = { G0: 0, G1: 0, G2: 0, G3: 0 };
  }

  /**
   * Initialize the 3D viewer in the specified container
   * @param {string|HTMLElement} container - Container element or ID
   * @returns {boolean} Success status
   */
  initialize(container) {
    try {
      this.container =
        typeof container === 'string'
          ? document.getElementById(container)
          : container;

      if (!this.container) {
        console.error('3D viewer container not found');
        return false;
      }

      this.setupScene();
      this.setupEventListeners();
      return true;
    } catch (error) {
      console.error('Failed to initialize 3D viewer:', error);
      return false;
    }
  }

  /**
   * Setup Three.js scene, camera, and renderer
   */
  setupScene() {
    // Clear existing content
    this.container.innerHTML = '';

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent background

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      50000
    );
    this.camera.position.set(0, -100, 80);
    this.camera.up.set(0, 0, 1); // Z is up

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0); // Transparent
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    );
    this.container.appendChild(this.renderer.domElement);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(0, 0, 100);
    this.scene.add(light);

    // Add axes helper
    this.scene.add(new THREE.AxesHelper(10));

    // Setup controls
    this.setupControls();

    // Create render function
    this.renderFunction = () => {
      this.renderer.render(this.scene, this.camera);
    };

    // Initial render
    this.renderFunction();
  }

  /**
   * Setup orbit controls for camera manipulation
   */
  setupControls() {
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
    } else if (window.OrbitControls) {
      this.controls = new window.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
    } else {
      console.warn('OrbitControls not available');
      return;
    }

    // Configure controls
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.ROTATE,
      RIGHT: THREE.MOUSE.PAN,
    };
    this.controls.enablePan = true;
    this.controls.enableZoom = true;
    this.controls.enableRotate = true;
    this.controls.screenSpacePanning = true;
    this.controls.enableDamping = false;
    this.controls.dampingFactor = 0.05;
    this.controls.addEventListener('change', this.renderFunction);
  }

  /**
   * Setup event listeners for responsive behavior
   */
  setupEventListeners() {
    // Responsive resize
    const onResize = () => {
      const width = this.container.offsetWidth;
      const height = this.container.offsetHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.renderFunction();
    };

    window.addEventListener('resize', onResize);

    // WebGL context loss handler
    this.renderer.domElement.addEventListener(
      'webglcontextlost',
      (e) => {
        alert('WebGL context lost. Please reload the page.');
        e.preventDefault();
      },
      false
    );
  }

  /**
   * Parse G-code and extract toolpath information
   * @param {string} gcode - The G-code content
   * @returns {Object} Parsing results
   */
  parseGcode(gcode) {
    const startTime = performance.now();

    try {
      const lines = gcode
        .split(/\r?\n/)
        .map((line) => line.trim().replace(this.GCODE_REGEX.N_LINE, ''))
        .filter((line) => line.length > 0);

      let x = 0,
        y = 0,
        z = 0;
      let lastPoint = null;
      let anyDrawn = false;
      let currentMotionMode = null;

      const toolpathPoints = [];
      const toolpathSegments = [];
      const toolpathModes = [];
      const lineMap = [];
      const segmentCounts = { G0: 0, G1: 0, G2: 0, G3: 0 };

      lines.forEach((line, idx) => {
        line = line.trim();

        // Find motion modes (G0/G1/G2/G3)
        const allModes = [...line.matchAll(this.GCODE_REGEX.G_MODE)];
        if (allModes.length > 0) {
          currentMotionMode = allModes[allModes.length - 1][0];
        }

        // Skip if no mode and no coordinates
        const hasCoords = this.GCODE_REGEX.HAS_COORDS.test(line);
        if (!currentMotionMode && !hasCoords) {
          return;
        }

        // Default to G1 if no mode specified
        if (!currentMotionMode) {
          currentMotionMode = 'G1';
        }

        // Parse coordinates
        const matchX = line.match(this.GCODE_REGEX.X_COORD);
        const matchY = line.match(this.GCODE_REGEX.Y_COORD);
        const matchZ = line.match(this.GCODE_REGEX.Z_COORD);
        const matchI = line.match(this.GCODE_REGEX.I_OFFSET);
        const matchJ = line.match(this.GCODE_REGEX.J_OFFSET);
        const matchR = line.match(this.GCODE_REGEX.R_RADIUS);

        const targetX = matchX ? parseFloat(matchX[1]) : x;
        const targetY = matchY ? parseFloat(matchY[1]) : y;
        const targetZ = matchZ ? parseFloat(matchZ[1]) : z;

        if (currentMotionMode === 'G2' || currentMotionMode === 'G3') {
          // Arc move processing
          const arcSegments = this.processArcMove(
            { x, y, z },
            { x: targetX, y: targetY, z: targetZ },
            currentMotionMode,
            matchI,
            matchJ,
            matchR,
            line
          );

          if (arcSegments.length > 0) {
            arcSegments.forEach((segment) => {
              toolpathSegments.push(segment);
              toolpathModes.push(currentMotionMode);
              lineMap.push(idx);
              segmentCounts[currentMotionMode]++;
              anyDrawn = true;
            });

            const lastSegment = arcSegments[arcSegments.length - 1];
            lastPoint = lastSegment[1].clone();
            x = lastPoint.x;
            y = lastPoint.y;
            z = lastPoint.z;
            toolpathPoints.push(lastPoint.clone());
          }
        } else {
          // Linear move processing
          if (matchX) x = parseFloat(matchX[1]);
          if (matchY) y = parseFloat(matchY[1]);
          if (matchZ) z = parseFloat(matchZ[1]);

          const pt = new THREE.Vector3(x, y, z);
          toolpathPoints.push(pt.clone());

          if (
            lastPoint &&
            (lastPoint.x !== pt.x ||
              lastPoint.y !== pt.y ||
              lastPoint.z !== pt.z)
          ) {
            toolpathSegments.push([lastPoint.clone(), pt.clone()]);
            toolpathModes.push(currentMotionMode);
            lineMap.push(idx);
            segmentCounts[currentMotionMode]++;
            anyDrawn = true;
          }
          lastPoint = pt;
        }
      });

      // Store results
      this.toolpathPoints = toolpathPoints;
      this.toolpathSegments = toolpathSegments;
      this.toolpathModes = toolpathModes;
      this.lineMap = lineMap;
      this.gcodeLines = gcode.split(/\r?\n/);
      this.segmentCounts = segmentCounts;

      // Update performance stats
      this.performanceStats.parseTime = performance.now() - startTime;
      this.performanceStats.segmentCount = toolpathSegments.length;
      this.performanceStats.lineCount = lines.length;

      return {
        anyDrawn,
        toolpathPoints,
        toolpathSegments,
        toolpathModes,
        lineMap,
        segmentCounts,
      };
    } catch (error) {
      console.error('Error parsing G-code:', error);
      throw new Error(`G-code parsing error: ${error.message}`);
    }
  }

  /**
   * Process arc moves (G2/G3)
   * @param {Object} start - Start position {x, y, z}
   * @param {Object} end - End position {x, y, z}
   * @param {string} mode - Motion mode ('G2' or 'G3')
   * @param {Array} matchI - I offset match
   * @param {Array} matchJ - J offset match
   * @param {Array} matchR - R radius match
   * @param {string} line - Original line for error reporting
   * @returns {Array} Array of line segments
   */
  processArcMove(start, end, mode, matchI, matchJ, matchR, line) {
    const arcStart = new THREE.Vector3(start.x, start.y, start.z);
    const arcEnd = new THREE.Vector3(end.x, end.y, end.z);
    const isClockwise = mode === 'G2';
    let arcPoints = [];

    try {
      if (matchI && matchJ) {
        // I/J mode
        const center = new THREE.Vector3(
          start.x + parseFloat(matchI[1]),
          start.y + parseFloat(matchJ[1]),
          start.z
        );

        if (this.isValidNumber(center.x) && this.isValidNumber(center.y)) {
          arcPoints = this.interpolateArc(
            arcStart,
            arcEnd,
            center,
            isClockwise
          );
        }
      } else if (matchR) {
        // R mode
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const r = Math.abs(parseFloat(matchR[1]));

        if (d > 0 && this.isValidNumber(r) && r > 0) {
          const h = Math.sqrt(Math.max(0, r * r - (d / 2) * (d / 2)));
          const mx = (start.x + end.x) / 2;
          const my = (start.y + end.y) / 2;
          const sign =
            (isClockwise ? -1 : 1) * (parseFloat(matchR[1]) >= 0 ? 1 : -1);
          const cx = mx + sign * h * (dy / d);
          const cy = my - sign * h * (dx / d);

          if (this.isValidNumber(cx) && this.isValidNumber(cy)) {
            const center = new THREE.Vector3(cx, cy, start.z);
            arcPoints = this.interpolateArc(
              arcStart,
              arcEnd,
              center,
              isClockwise
            );
          }
        }
      }
    } catch (error) {
      console.warn('Error processing arc:', line, error);
    }

    // Convert arc points to line segments
    const segments = [];
    for (let i = 1; i < arcPoints.length; i++) {
      if (
        this.isValidPoint(arcPoints[i - 1]) &&
        this.isValidPoint(arcPoints[i])
      ) {
        segments.push([arcPoints[i - 1].clone(), arcPoints[i].clone()]);
      }
    }

    return segments;
  }

  /**
   * Interpolate arc points between start and end
   * @param {THREE.Vector3} start - Start point
   * @param {THREE.Vector3} end - End point
   * @param {THREE.Vector3} center - Arc center
   * @param {boolean} isClockwise - Arc direction
   * @param {number} segments - Number of segments (default: 32)
   * @returns {Array} Array of interpolated points
   */
  interpolateArc(start, end, center, isClockwise, segments = 32) {
    const points = [];
    const radius = Math.sqrt(
      (start.x - center.x) ** 2 + (start.y - center.y) ** 2
    );
    const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
    const endAngle = Math.atan2(end.y - center.y, end.x - center.x);

    let deltaAngle = endAngle - startAngle;
    if (isClockwise && deltaAngle > 0) deltaAngle -= Math.PI * 2;
    if (!isClockwise && deltaAngle < 0) deltaAngle += Math.PI * 2;

    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + (deltaAngle * i) / segments;
      const zVal =
        start.z === end.z
          ? start.z
          : start.z + ((end.z - start.z) * i) / segments;

      points.push(
        new THREE.Vector3(
          center.x + radius * Math.cos(angle),
          center.y + radius * Math.sin(angle),
          zVal
        )
      );
    }

    return points;
  }

  /**
   * Check if a number is valid (not NaN or infinite)
   * @param {number} num - Number to check
   * @returns {boolean} True if valid
   */
  isValidNumber(num) {
    return typeof num === 'number' && isFinite(num) && !isNaN(num);
  }

  /**
   * Check if a point has valid coordinates
   * @param {THREE.Vector3} point - Point to check
   * @returns {boolean} True if valid
   */
  isValidPoint(point) {
    return (
      point &&
      this.isValidNumber(point.x) &&
      this.isValidNumber(point.y) &&
      this.isValidNumber(point.z)
    );
  }

  /**
   * Render G-code in 3D
   * @param {string} gcode - The G-code content
   * @returns {boolean} Success status
   */
  renderGcode(gcode) {
    const startTime = performance.now();

    try {
      if (!this.scene || !this.camera || !this.renderer) {
        throw new Error('3D viewer not initialized');
      }

      // Clear existing geometry
      this.disposeOldGeometries();

      // Parse G-code
      const parseResult = this.parseGcode(gcode);

      if (!parseResult.anyDrawn) {
        this.showMessage('No G0/G1/G2/G3 toolpaths found in G-code!');
        return false;
      }

      // Create line objects for visualization
      this.createLineObjects();

      // Create tool visualization
      this.createToolVisualization();

      // Auto-center camera on toolpath
      this.centerCameraOnToolpath();

      // Update performance stats
      this.performanceStats.renderTime = performance.now() - startTime;

      console.log(
        `G-code rendering completed in ${this.performanceStats.renderTime.toFixed(2)}ms`
      );
      console.log(
        `Parsed ${this.performanceStats.lineCount} lines into ${this.performanceStats.segmentCount} segments`
      );

      // Render the scene
      this.renderFunction();

      return true;
    } catch (error) {
      console.error('Error rendering G-code:', error);
      this.showMessage(`G-code rendering error: ${error.message}`);
      return false;
    }
  }

  /**
   * Create line objects for different G-code modes
   */
  createLineObjects() {
    // Separate points by G-code mode
    const g0Points = [],
      g1Points = [],
      g2Points = [],
      g3Points = [];

    for (let i = 0; i < this.toolpathSegments.length; i++) {
      const segment = this.toolpathSegments[i];
      const mode = this.toolpathModes[i];

      if (mode === 'G0') g0Points.push(segment[0], segment[1]);
      else if (mode === 'G1') g1Points.push(segment[0], segment[1]);
      else if (mode === 'G2') g2Points.push(segment[0], segment[1]);
      else if (mode === 'G3') g3Points.push(segment[0], segment[1]);
    }

    // Create line objects with CNC-standard colors
    this.createModeLines('G0', g0Points, 0xff8e37, 0.6); // Orange (rapid)
    this.createModeLines('G1', g1Points, 0x00ff99, 0.9); // Green (linear)
    this.createModeLines('G2', g2Points, 0x0074d9, 0.9); // Blue (CW arc)
    this.createModeLines('G3', g3Points, 0xf012be, 0.9); // Magenta (CCW arc)
  }

  /**
   * Create line objects for a specific G-code mode
   * @param {string} mode - G-code mode
   * @param {Array} points - Array of points
   * @param {number} color - Line color
   * @param {number} opacity - Line opacity
   */
  createModeLines(mode, points, color, opacity) {
    if (points.length === 0) return;

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
    });
    const line = new THREE.LineSegments(geometry, material);

    this.scene.add(line);
    this.batchedLines[mode] = line;
    this.batchedGeometries[mode] = geometry;
    this.batchedCounts[mode] = points.length;
  }

  /**
   * Create tool visualization (arrow pointing down)
   */
  createToolVisualization() {
    if (this.toolpathSegments.length === 0) return;

    // Position tool at the end of the toolpath
    const lastSegment = this.toolpathSegments[this.toolpathSegments.length - 1];
    const toolPosition = lastSegment[1].clone();

    // Create arrow helper pointing down
    const arrowDirection = new THREE.Vector3(0, 0, -1);
    const arrowPosition = toolPosition
      .clone()
      .add(new THREE.Vector3(0, 0, this.ARROW_LENGTH));

    this.toolMesh = new THREE.ArrowHelper(
      arrowDirection,
      arrowPosition,
      this.ARROW_LENGTH,
      0xffff00, // Yellow
      this.ARROW_HEAD_LENGTH,
      this.ARROW_HEAD_WIDTH
    );

    this.scene.add(this.toolMesh);
  }

  /**
   * Center camera on the toolpath
   */
  centerCameraOnToolpath() {
    if (this.toolpathPoints.length === 0) return;

    const bbox = new THREE.Box3().setFromPoints(this.toolpathPoints);
    const center = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());

    // Position camera to see the whole toolpath
    const maxDim = Math.max(size.x, size.y, size.z);
    this.camera.position.set(
      center.x,
      center.y - maxDim * 1.5,
      center.z + maxDim * 0.8
    );
    this.camera.lookAt(center);

    if (this.controls) {
      this.controls.target.copy(center);
      this.controls.update();
    }
  }

  /**
   * Dispose of old geometries and materials
   */
  disposeOldGeometries() {
    Object.values(this.batchedGeometries).forEach((geometry) => {
      if (geometry) geometry.dispose();
    });

    Object.values(this.batchedLines).forEach((line) => {
      if (line && line.material) line.material.dispose();
      if (line && line.parent) line.parent.remove(line);
    });

    // Reset references
    this.batchedLines = { G0: null, G1: null, G2: null, G3: null };
    this.batchedGeometries = { G0: null, G1: null, G2: null, G3: null };
    this.batchedCounts = { G0: 0, G1: 0, G2: 0, G3: 0 };

    // Remove tool mesh
    if (this.toolMesh && this.toolMesh.parent) {
      this.toolMesh.parent.remove(this.toolMesh);
      this.toolMesh = null;
    }
  }

  /**
   * Show a message in the viewer
   * @param {string} message - Message to display
   */
  showMessage(message) {
    // Remove existing message
    const existingMsg = this.container.querySelector('.viewer-message');
    if (existingMsg) existingMsg.remove();

    // Create message element
    const msgElement = document.createElement('div');
    msgElement.className = 'viewer-message';
    msgElement.textContent = message;

    Object.assign(msgElement.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#fff',
      fontSize: '1.5em',
      fontFamily: 'monospace',
      textAlign: 'center',
      zIndex: '1000',
      padding: '20px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: '8px',
    });

    this.container.appendChild(msgElement);
  }

  /**
   * Get performance statistics
   * @returns {Object} Performance stats
   */
  getPerformanceStats() {
    return {
      ...this.performanceStats,
      segmentCounts: { ...this.segmentCounts },
    };
  }

  /**
   * Cleanup and dispose of resources
   */
  dispose() {
    this.disposeOldGeometries();

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }

    this.scene = null;
    this.camera = null;
    this.renderFunction = null;

    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Export for module use
export { GcodeViewer3D };

// Global instance for backward compatibility
window.GcodeViewer3D = GcodeViewer3D;
