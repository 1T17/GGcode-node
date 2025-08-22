/**
 * Visualizer Core Module
 *
 * Core 3D rendering functionality for G-code visualization
 */

import { setupSimulationControls } from './controls.js';
import { parseGcodeOptimized } from './parser.js';
import { ToolpathHoverSystem } from './index.js';
import { GeometryManager } from './geometry-manager.js';
import { ChunkLoader } from './chunk-loader.js';

/**
 * Core 3D visualizer class
 */
export class GcodeVisualizer {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.container = null;
    this.parseResult = null;
    this.hoverSystem = null;
    this.geometryManager = new GeometryManager();
    this.chunkLoader = new ChunkLoader(this);

    // Performance monitoring
    this.performanceMonitor = {
      enabled: true,
      frameCount: 0,
      lastTime: 0,
      averageFPS: 0,
      renderTimeHistory: [],
      maxHistoryLength: 60,
      lastLogTime: 0,
      logInterval: 5000, // Log every 5 seconds
    };

    // Adaptive rendering properties
    this.adaptiveRendering = false;
    this.targetFPS = 30;
    this.frameInterval = 1000 / 30; // Will be updated when targetFPS changes
    this.lastFrameTime = 0;
    this.lastCameraPosition = new THREE.Vector3();
    this.cameraMoveThreshold = 0.1;

    // Frustum culling properties
    this.frustum = null;
    this.frustumMatrix = new THREE.Matrix4();
    this.culledObjects = new Set();

    // Instancing properties
    this.useInstancing = true; // Enable instancing by default for better performance
    this.instancedMeshes = new Map(); // Store instanced meshes by mode

    // Progressive loading properties
    this.progressiveLoading = true; // Always use progressive loading for proper state management
    this.loadingProgress = 0;
    this.isLoading = false;
  }

  /**
   * Set adaptive rendering parameters
   * @param {boolean} enabled - Whether to enable adaptive rendering
   * @param {number} targetFPS - Target frames per second (default: 30)
   */
  setAdaptiveRendering(enabled, targetFPS = 30) {
    this.adaptiveRendering = enabled;
    this.targetFPS = Math.max(1, Math.min(60, targetFPS)); // Clamp between 1-60
    this.frameInterval = 1000 / this.targetFPS;

    // Store initial camera position for movement detection
    if (this.camera) {
      this.lastCameraPosition.copy(this.camera.position);
    }
  }

  /**
   * Check if the scene should be rendered based on adaptive rendering settings
   * @param {number} currentTime - Current timestamp from performance.now()
   * @returns {boolean} True if scene should be rendered
   */
  shouldRenderFrame(currentTime) {
    // Always render if adaptive rendering is disabled
    if (!this.adaptiveRendering) {
      return true;
    }

    // Always render if this is the first frame
    if (this.lastFrameTime === 0) {
      return true;
    }

    // Check if enough time has passed for target FPS
    const timeSinceLastFrame = currentTime - this.lastFrameTime;
    if (timeSinceLastFrame < this.frameInterval) {
      return false;
    }

    // Check if camera has moved significantly
    if (this.camera) {
      const cameraMovement = this.lastCameraPosition.distanceTo(
        this.camera.position
      );
      if (cameraMovement > this.cameraMoveThreshold) {
        return true; // Camera moved, render immediately
      }
    }

    // Check if controls are being used (user interaction)
    if (this.controls && this.controls.isBeingUsed) {
      return true;
    }

    return true; // Default to rendering
  }

  /**
   * Initialize frustum culling system
   */
  initializeFrustumCulling() {
    this.frustum = new THREE.Frustum();
    this.frustumMatrix = new THREE.Matrix4();
  }

  /**
   * Update the viewing frustum based on current camera position
   */
  updateFrustum() {
    if (!this.camera) return;

    // Update the camera's matrix world
    this.camera.updateMatrixWorld();

    // Create frustum matrix from camera's projection and world matrices
    this.frustumMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    );

    // Set frustum from the matrix
    this.frustum.setFromProjectionMatrix(this.frustumMatrix);
  }

  /**
   * Update performance monitoring
   */
  updatePerformanceMonitor(currentTime, renderStartTime) {
    if (!this.performanceMonitor.enabled) return;

    this.performanceMonitor.frameCount++;
    const renderTime = currentTime - renderStartTime;

    // Add render time to history
    this.performanceMonitor.renderTimeHistory.push(renderTime);
    if (
      this.performanceMonitor.renderTimeHistory.length >
      this.performanceMonitor.maxHistoryLength
    ) {
      this.performanceMonitor.renderTimeHistory.shift();
    }

    // Calculate average FPS every second
    if (this.performanceMonitor.lastTime === 0) {
      this.performanceMonitor.lastTime = currentTime;
    } else {
      const timeDiff = currentTime - this.performanceMonitor.lastTime;
      if (timeDiff >= 1000) {
        this.performanceMonitor.averageFPS = Math.round(
          (this.performanceMonitor.frameCount * 1000) / timeDiff
        );
        this.performanceMonitor.frameCount = 0;
        this.performanceMonitor.lastTime = currentTime;
      }
    }

    // Log performance stats periodically
    if (
      currentTime - this.performanceMonitor.lastLogTime >
      this.performanceMonitor.logInterval
    ) {
      const avgRenderTime =
        this.performanceMonitor.renderTimeHistory.reduce((a, b) => a + b, 0) /
        this.performanceMonitor.renderTimeHistory.length;
      console.log('Performance Monitor:', {
        averageFPS: this.performanceMonitor.averageFPS,
        averageRenderTime: `${avgRenderTime.toFixed(2)}ms`,
        culledObjects: this.culledObjects.size,
        totalObjects: this.scene ? this.scene.children.length : 0,
        adaptiveRendering: this.adaptiveRendering,
      });
      this.performanceMonitor.lastLogTime = currentTime;
    }
  }

  /**
   * Check if an object is visible within the viewing frustum
   * @param {THREE.Object3D} object - The object to check
   * @returns {boolean} True if object is visible
   */
  isObjectVisible(object) {
    if (!object || !this.frustum) return true;

    // Skip objects without geometry (like lights, cameras, etc.)
    if (!object.geometry && !object.children.length) return true;

    // Check if object has a geometry and pre-calculated bounding box
    if (object.geometry) {
      // Use pre-calculated bounding box from userData if available (performance optimization)
      if (object.userData && object.userData.boundingBox) {
        const result = this.frustum.intersectsBox(object.userData.boundingBox);
        return result;
      }

      // Fallback to object's own bounding box if available
      if (object.geometry.boundingBox) {
        const result = this.frustum.intersectsBox(object.geometry.boundingBox);
        return result;
      }

      // Fallback to bounding sphere
      if (object.geometry.boundingSphere) {
        const result = this.frustum.intersectsSphere(
          object.geometry.boundingSphere
        );
        return result;
      }
    }

    // For objects without geometry, check children recursively
    if (object.children && object.children.length > 0) {
      const result = object.children.some((child) =>
        this.isObjectVisible(child)
      );
      return result;
    }

    // Default to visible if we can't determine
    return true;
  }

  /**
   * Apply frustum culling to all objects in the scene
   */
  applyFrustumCulling() {
    // Temporarily disable frustum culling to avoid issues
    // TODO: Re-enable once we fix the culling logic
    return;

    /*
        if (!this.frustum) return;

        this.culledObjects.clear();

        // Only apply culling selectively to avoid over-culling
        this.scene.traverse((child) => {
            // Only apply culling to meshes that are likely to be toolpath objects
            if (child.isMesh && child.geometry && child.userData && child.userData.isToolpathObject) {
                const wasVisible = child.visible;
                child.visible = this.isObjectVisible(child);

                // Track changes for debugging
                if (wasVisible !== child.visible) {
                    if (child.visible) {
                        this.culledObjects.delete(child);
                    } else {
                        this.culledObjects.add(child);
                        // Log only occasionally to avoid spam
                    }
                }
            }
        });

        // Log culling stats occasionally
        if (this.culledObjects.size > 0 && Math.random() < 0.001) {
        }
        */
  }

  /**
   * Initialize the 3D visualizer
   */
  initialize(container) {
    this.container = container;

    // Setup Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000); // Black background

    this.camera = new THREE.PerspectiveCamera(
      60,
      container.offsetWidth / container.offsetHeight,
      0.1,
      50000
    );
    this.camera.position.set(0, -100, 80);
    this.camera.up.set(0, 0, 1); // Z is up

    // Create optimized renderer with performance-focused settings
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      precision: 'mediump', // Use medium precision for better performance
      stencil: false, // Disable stencil buffer if not needed
      depth: true,
    });

    // Optimize renderer settings for performance
    this.renderer.setClearColor(0x000000, 1); // Black background
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio for performance
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);

    // Performance optimizations
    this.renderer.shadowMap.enabled = false; // Disable shadows for CNC visualization

    // Output settings
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Disable features not needed for CNC visualization
    this.renderer.localClippingEnabled = false;
    this.renderer.debug.checkShaderErrors = false; // Disable in production

    // GPU optimizations if available
    if (this.renderer.capabilities.isWebGL2) {
      console.log('WebGL2 detected - enabling advanced performance features');
    }

    //console.log('Renderer optimized for CNC visualization performance');

    // Ensure canvas is properly positioned within container
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';

    container.appendChild(this.renderer.domElement);

    //console.log('Renderer canvas added to container, canvas size:', this.renderer.domElement.width, 'x', this.renderer.domElement.height);

    // Add light
    const light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(0, 0, 100);
    this.scene.add(light);
    //console.log('Light added to scene');

    // Add axes helper
    this.scene.add(new THREE.AxesHelper(10));
    //console.log('Axes helper added to scene');

    this.setupControls();
    this.setupEventListeners();
    this.setupHoverSystem();

    // Enable conservative optimizations by default
    // Adaptive rendering can cause perceived lag, so start disabled
    this.setAdaptiveRendering(false, 30);

    // Initialize frustum culling for performance optimization
    this.initializeFrustumCulling();

    //console.log('Initialization complete');
    return true;
  }

  /**
   * Setup orbit controls
   */
  setupControls() {
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
    } else if (typeof window.OrbitControls !== 'undefined') {
      this.controls = new window.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
    }

    if (this.controls) {
      this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.ROTATE,
        RIGHT: THREE.MOUSE.PAN,
      };
      this.controls.enablePan = true;
      this.controls.enableZoom = true;
      this.controls.enableRotate = true;
      this.controls.screenSpacePanning = true;
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const onResize = () => {
      if (!this.container) return;
      const w = this.container.offsetWidth;
      const h = this.container.offsetHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
  }

  /**
   * Setup hover system for point detection and tooltips
   */
  setupHoverSystem() {
    this.hoverSystem = new ToolpathHoverSystem();
    this.hoverSystem.initialize(
      this.scene,
      this.camera,
      this.container,
      this.controls
    );
    window.gcodeHoverSystem = this.hoverSystem;
  }

  /**
   * Render G-code toolpath
   */
  async renderGcode(gcode) {
    if (!gcode || !gcode.trim()) {
      return { success: false, error: 'No G-code content' };
    }

    // Always use progressive loading for consistency and proper state management
    if (this.progressiveLoading) {
      return await this.renderGcodeProgressive(gcode);
    }

    // Fallback to original rendering for small files (if progressive loading is disabled)
    return this.renderGcodeImmediate(gcode);
  }

  /**
   * Render G-code immediately (original method)
   */
  renderGcodeImmediate(gcode) {
    const startTime = performance.now();

    // Parse G-code
    const parseStartTime = performance.now();
    this.parseResult = this.parseGcode(gcode);
    const parseTime = performance.now() - parseStartTime;

    // Set up global variables for stats and info
    if (typeof gcode === 'string') {
      window.gcodeLines = gcode.split(/\r?\n/);
    } else {
      window.gcodeLines = [];
    }

    // Set segment counts for stats display
    window.gcodeSegmentCounts = this.parseResult.segmentCounts || {
      G0: 0,
      G1: 0,
      G2: 0,
      G3: 0,
    };

    // Set performance stats
    window.performanceStats = {
      parseTime: parseTime,
      renderTime: 0, // Will be updated after rendering
      lineCount: window.gcodeLines.length,
      segmentCount: this.parseResult.toolpathSegments
        ? this.parseResult.toolpathSegments.length
        : 0,
    };

    //console.log('[core.js] Performance stats set:', window.performanceStats);
    //console.log('[core.js] Segment counts set:', window.gcodeSegmentCounts);

    // Check if we have data to draw
    if (!this.parseResult.anyDrawn) {
      console.warn('No toolpath found to draw in immediate render');
      return { success: false, error: 'No toolpath found' };
    }

    // Create line objects
    this.createToolpathLines();

    // Set global variables for simulation and other functionality
    window.gcodeToolpathPoints = this.parseResult.toolpathPoints;
    window.gcodeToolpathSegments = this.parseResult.toolpathSegments;
    window.gcodeToolpathModes = this.parseResult.toolpathModes;
    window.gcodeLineMap = this.parseResult.lineMap;

    // Update hover system with toolpath data
    if (this.hoverSystem) {
      this.hoverSystem.updateToolpath({
        toolpathPoints: this.parseResult.toolpathPoints,
        toolpathSegments: this.parseResult.toolpathSegments,
        toolpathModes: this.parseResult.toolpathModes,
        lineMap: this.parseResult.lineMap,
      });
    }

    // Fit camera to show all points
    this.fitCameraToToolpath();

    // Setup simulation controls
    this.setupSimulationControls();

    // Update render time in performance stats
    const renderTime = performance.now() - startTime;
    if (window.performanceStats) {
      window.performanceStats.renderTime = renderTime;
    }

    // Update stats display
    if (window.updateGcodeStats) {
      window.updateGcodeStats();
    }

    // Start animation loop
    this.startAnimationLoop();

    return { success: true, parseResult: this.parseResult };
  }

  /**
   * Render G-code progressively
   */
  async renderGcodeProgressive(gcode) {
    this.isLoading = true;
    this.loadingProgress = 0;

    try {
      // Show loading indicator
      this.showLoadingIndicator(true);

      // Load G-code progressively
      const result = await this.chunkLoader.loadGcodeProgressive(gcode, {
        chunkSize: 10,
        maxChunksPerFrame: 5,
        onProgress: (progress) => {
          this.loadingProgress = progress.progress;
          this.updateLoadingIndicator(progress);
        },
        onChunkProcessed: (data) => {
          // Update visualization with partial data
          this.updatePartialToolpath(data);
        },
      });

      if (!result.success) {
        if (result.cancelled) {
          return { success: false, cancelled: true };
        }
        return { success: false, error: result.error };
      }

      // Store the final result
      this.parseResult = {
        toolpathSegments: result.segments || [],
        toolpathModes: result.modes || [],
        toolpathPoints: result.points || [],
        segmentCounts: this.calculateSegmentCounts(
          result.segments || [],
          result.modes || []
        ),
        lineMap: this.createLineMap(result.segments || [], gcode),
        anyDrawn: (result.segments && result.segments.length > 0) || false,
      };

      // Set up global variables for stats and info
      if (typeof gcode === 'string') {
        window.gcodeLines = gcode.split(/\r?\n/);
      } else {
        window.gcodeLines = [];
      }

      window.gcodeSegmentCounts = this.parseResult.segmentCounts || {
        G0: 0,
        G1: 0,
        G2: 0,
        G3: 0,
      };

      // console.log('[core.js] Global variables set:', {
      //     gcodeLines: Array.isArray(window.gcodeLines) ? window.gcodeLines.length : 'Not an array',
      //     gcodeSegmentCounts: window.gcodeSegmentCounts,
      //     parseResultExists: !!this.parseResult,
      //     anyDrawn: this.parseResult ? this.parseResult.anyDrawn : 'No parseResult'
      // });

      // Set performance stats
      window.performanceStats = {
        parseTime: 0, // Progressive loading handles timing differently
        renderTime: 0,
        lineCount: result.lineCount,
        segmentCount: result.segments.length,
      };

      //console.log('Progressive loading completed, creating toolpath lines');

      // Create final line objects
      this.createToolpathLines();
      //console.log('Toolpath lines created');

      // Set global variables for simulation and other functionality
      window.gcodeToolpathPoints = this.parseResult.toolpathPoints;
      window.gcodeToolpathSegments = this.parseResult.toolpathSegments;
      window.gcodeToolpathModes = this.parseResult.toolpathModes;
      window.gcodeLineMap = this.parseResult.lineMap;

      // Update hover system with toolpath data
      if (this.hoverSystem) {
        this.hoverSystem.updateToolpath({
          toolpathPoints: this.parseResult.toolpathPoints,
          toolpathSegments: this.parseResult.toolpathSegments,
          toolpathModes: this.parseResult.toolpathModes,
          lineMap: this.parseResult.lineMap,
        });
      }

      // Fit camera to show all points
      this.fitCameraToToolpath();

      // Setup simulation controls
      this.setupSimulationControls();

      // Update stats display
      if (window.updateGcodeStats) {
        window.updateGcodeStats();
      }

      // Start animation loop
      this.startAnimationLoop();

      return { success: true, parseResult: this.parseResult };
    } catch (error) {
      console.error('Progressive rendering failed:', error);
      return { success: false, error: error.message };
    } finally {
      this.isLoading = false;
      this.loadingProgress = 100;
      this.showLoadingIndicator(false);
    }
  }

  /**
   * Create line objects for toolpath visualization
   */
  /**
   * Create toolpath lines from parsed data
   */
  createToolpathLines() {
    try {
      //console.log('createToolpathLines called');

      // Check if we have data
      if (!this.parseResult) {
        console.warn('No parseResult available');
        return;
      }

      if (!this.parseResult.toolpathSegments) {
        console.warn('No toolpathSegments in parseResult');
        return;
      }

      //console.log(`Processing ${this.parseResult.toolpathSegments.length} segments`);

      // Group segments by mode for instancing
      const g0Segments = [],
        g1Segments = [],
        g2Segments = [],
        g3Segments = [];
      const segments = this.parseResult.toolpathSegments;
      const modes = this.parseResult.toolpathModes;

      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const mode = modes[i];
        if (mode === 'G0') g0Segments.push(seg);
        else if (mode === 'G1') g1Segments.push(seg);
        else if (mode === 'G2') g2Segments.push(seg);
        else if (mode === 'G3') g3Segments.push(seg);
      }

      //console.log('Creating toolpath lines:', {
      //     G0: g0Segments.length,
      //     G1: g1Segments.length,
      //     G2: g2Segments.length,
      //     G3: g3Segments.length
      // });

      // Clear any existing toolpath lines
      this.clearToolpathLines();

      // Use traditional line rendering for better performance and consistent line thickness
      this.createLineToolpathLines(
        g0Segments,
        g1Segments,
        g2Segments,
        g3Segments
      );

      //console.log('Scene children count:', this.scene.children.length);

      // Debug log to verify meshes were added
    } catch (error) {
      console.error('Error in createToolpathLines:', error);
    }
  }

  /**
   * Create toolpath lines using instanced rendering for better performance
   */
  createInstancedToolpathLines(g0Segments, g1Segments, g2Segments, g3Segments) {
    // console.log('createInstancedToolpathLines called with segments:', {
    //     G0: g0Segments.length,
    //     G1: g1Segments.length,
    //     G2: g2Segments.length,
    //     G3: g3Segments.length
    // });

    // Create instanced meshes for each mode
    if (g0Segments.length > 0) {
      const g0Mesh = this.geometryManager.createInstancedLineSystem(
        g0Segments,
        'G0'
      );
      if (g0Mesh) {
        //console.log(`Created G0 instanced mesh with ${g0Mesh.count} instances`);
        //console.log('Adding G0 mesh to scene');
        this.scene.add(g0Mesh);
        this.instancedMeshes.set('G0', g0Mesh);
        //console.log('G0 mesh added to scene');
        //console.log(`G0 mesh visible: ${g0Mesh.visible}, count: ${g0Mesh.count}`);

        // Calculate and set bounding box for frustum culling
        this.setInstancedMeshBoundingBox(g0Mesh, g0Segments);
      }
    }

    if (g1Segments.length > 0) {
      const g1Mesh = this.geometryManager.createInstancedLineSystem(
        g1Segments,
        'G1'
      );
      if (g1Mesh) {
        //console.log(`Created G1 instanced mesh with ${g1Mesh.count} instances`);
        //console.log('Adding G1 mesh to scene');
        this.scene.add(g1Mesh);
        this.instancedMeshes.set('G1', g1Mesh);
        //console.log('G1 mesh added to scene');
        //console.log(`G1 mesh visible: ${g1Mesh.visible}, count: ${g1Mesh.count}`);

        // Calculate and set bounding box for frustum culling
        this.setInstancedMeshBoundingBox(g1Mesh, g1Segments);
      }
    }

    if (g2Segments.length > 0) {
      const g2Mesh = this.geometryManager.createInstancedLineSystem(
        g2Segments,
        'G2'
      );
      if (g2Mesh) {
        //console.log(`Created G2 instanced mesh with ${g2Mesh.count} instances`);
        //console.log('Adding G2 mesh to scene');
        this.scene.add(g2Mesh);
        this.instancedMeshes.set('G2', g2Mesh);
        //console.log('G2 mesh added to scene');
        //console.log(`G2 mesh visible: ${g2Mesh.visible}, count: ${g2Mesh.count}`);

        // Calculate and set bounding box for frustum culling
        this.setInstancedMeshBoundingBox(g2Mesh, g2Segments);
      }
    }

    if (g3Segments.length > 0) {
      const g3Mesh = this.geometryManager.createInstancedLineSystem(
        g3Segments,
        'G3'
      );
      if (g3Mesh) {
        //console.log(`Created G3 instanced mesh with ${g3Mesh.count} instances`);
        //console.log('Adding G3 mesh to scene');
        this.scene.add(g3Mesh);
        this.instancedMeshes.set('G3', g3Mesh);
        //console.log('G3 mesh added to scene');
        //console.log(`G3 mesh visible: ${g3Mesh.visible}, count: ${g3Mesh.count}`);

        // Calculate and set bounding box for frustum culling
        this.setInstancedMeshBoundingBox(g3Mesh, g3Segments);
      }
    }

    // Store globally for simulation
    window.gcodeInstancedMeshes = this.instancedMeshes;
    console.log('Instanced toolpath lines created');
  }

  /**
   * Calculate and set bounding box for instanced mesh for frustum culling
   * @param {THREE.InstancedMesh} mesh - The instanced mesh
   * @param {Array} segments - Array of line segments
   */
  setInstancedMeshBoundingBox(mesh, segments) {
    if (!mesh || !segments || segments.length === 0) return;

    try {
      // Create a bounding box that encompasses all segments
      const box = new THREE.Box3();
      const points = [];

      // Collect all points from segments
      for (const segment of segments) {
        if (Array.isArray(segment) && segment.length >= 2) {
          // Handle both array and Vector3 formats
          const start = Array.isArray(segment[0])
            ? new THREE.Vector3(segment[0][0], segment[0][1], segment[0][2])
            : segment[0];
          const end = Array.isArray(segment[1])
            ? new THREE.Vector3(segment[1][0], segment[1][1], segment[1][2])
            : segment[1];

          points.push(start, end);
        }
      }

      if (points.length > 0) {
        box.setFromPoints(points);

        // Expand the box slightly to account for cylinder radius
        const radius = 0.05; // Match the radius used in GeometryManager
        box.expandByScalar(radius);

        // Store the bounding box in userData for frustum culling
        if (!mesh.userData) mesh.userData = {};
        mesh.userData.boundingBox = box;
        mesh.userData.isToolpathObject = true; // Mark as toolpath object for selective culling

        // Log occasionally to avoid spam
        if (Math.random() < 0.01) {
          //console.log(`Set bounding box for instanced mesh: points=${points.length}`);
        }
      }
    } catch (error) {
      console.error('Error setting bounding box for instanced mesh:', error);
    }
  }

  /**
   * Create toolpath lines using traditional LineSegments (fallback)
   */
  createLineToolpathLines(g0Segments, g1Segments, g2Segments, g3Segments) {
    // Convert segments to points format for LineSegments
    const g0Points = [];
    g0Segments.forEach((seg) => {
      g0Points.push(seg[0], seg[1]);
    });

    const g1Points = [];
    g1Segments.forEach((seg) => {
      g1Points.push(seg[0], seg[1]);
    });

    const g2Points = [];
    g2Segments.forEach((seg) => {
      g2Points.push(seg[0], seg[1]);
    });

    const g3Points = [];
    g3Segments.forEach((seg) => {
      g3Points.push(seg[0], seg[1]);
    });

    // Create line objects with CNC-standard colors and appropriate thickness
    this.createLineObject(g0Points, 0xff8e37, 0.8, 'G0', 1); // Orange (rapid) - higher opacity
    this.createLineObject(g1Points, 0x00ff99, 1.0, 'G1', 1); // Green (linear) - higher opacity and brightness
    this.createLineObject(g2Points, 0x0074d9, 1.0, 'G2', 1); // Blue (CW arc) - higher opacity
    this.createLineObject(g3Points, 0xf012be, 1.0, 'G3', 1); // Magenta (CCW arc) - higher opacity
  }

  /**
   * Clear existing toolpath lines from the scene
   */
  clearToolpathLines() {
    //console.log('Clearing toolpath lines');
    // Remove instanced meshes
    for (const [, mesh] of this.instancedMeshes) {
      //console.log('Removing mesh from scene');
      this.scene.remove(mesh);
    }
    this.instancedMeshes.clear();

    // Remove traditional line objects if they exist
    if (window.gcodeBatchedLines) {
      for (const mode in window.gcodeBatchedLines) {
        const line = window.gcodeBatchedLines[mode];
        if (line && line.parent) {
          //console.log(`Removing ${mode} line from scene`);
          line.parent.remove(line);
        }
      }
      window.gcodeBatchedLines = {};
      window.gcodeBatchedGeometries = {};
      window.gcodeBatchedCounts = {};
    }
    //console.log('Toolpath lines cleared');
  }

  /**
   * Create a line object for a specific G-code mode
   */
  createLineObject(points, color, opacity, mode, _lineWidth = 1) {
    if (points.length === 0) return null;

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setDrawRange(0, points.length);

    // Compute bounding box for frustum culling optimization
    geometry.computeBoundingBox();

    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      // linewidth is not supported in most WebGL implementations
    });
    const line = new THREE.LineSegments(geometry, material);

    // Store pre-calculated bounding box in userData for performance (fixes frustum culling performance issue)
    if (geometry.boundingBox) {
      line.userData = {
        boundingBox: geometry.boundingBox,
      };
    }

    this.scene.add(line);

    // Store globally for simulation
    if (!window.gcodeBatchedLines) window.gcodeBatchedLines = {};
    if (!window.gcodeBatchedGeometries) window.gcodeBatchedGeometries = {};
    if (!window.gcodeBatchedCounts) window.gcodeBatchedCounts = {};

    window.gcodeBatchedLines[mode] = line;
    window.gcodeBatchedGeometries[mode] = geometry;
    window.gcodeBatchedCounts[mode] = points.length;
    // Only update stats box after all modes are set (after createToolpathLines)

    return line;
  }

  /**
   * Update partial toolpath during progressive loading
   */
  updatePartialToolpath() {
    // For now, we'll just log the progress
    // In a more advanced implementation, we could render partial results
    //console.log(`Partial toolpath update: ${data.segments.length} segments, ${data.progress.toFixed(1)}%`);
  }

  /**
   * Show/hide loading indicator
   */
  showLoadingIndicator(show) {
    // In a real implementation, this would update the UI
    if (show) {
      //console.log('Loading G-code file...');
    } else {
      //console.log('Loading completed');
    }
  }

  /**
   * Update loading indicator with progress
   */
  updateLoadingIndicator(progress) {
    // In a real implementation, this would update a progress bar
    if (Math.floor(progress.progress) % 10 === 0) {
      // Log every 10%
      //console.log(`Loading progress: ${progress.progress.toFixed(1)}% (${progress.processedChunks}/${progress.totalChunks} chunks)`);
    }
  }

  /**
   * Calculate segment counts from segments and modes
   */
  calculateSegmentCounts(segments, modes) {
    const counts = { G0: 0, G1: 0, G2: 0, G3: 0 };
    for (const mode of modes) {
      if (Object.prototype.hasOwnProperty.call(counts, mode)) {
        counts[mode]++;
      }
    }
    return counts;
  }

  /**
   * Create line map from segments and original G-code
   */
  createLineMap(segments, _gcode) {
    // Simplified implementation - in a real scenario, this would map segments to line numbers
    return new Array(segments.length).fill(0).map((_, i) => i);
  }

  /**
   * Fit camera to show entire toolpath
   */
  fitCameraToToolpath() {
    if (
      this.parseResult.toolpathPoints &&
      this.parseResult.toolpathPoints.length > 0
    ) {
      const box = new THREE.Box3().setFromPoints(
        this.parseResult.toolpathPoints
      );
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = this.camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 2.0; // Add more padding for better view

      // Position camera to view the toolpath from a better angle
      this.camera.position.set(
        center.x,
        center.y - cameraZ,
        center.z + cameraZ * 0.3
      );
      this.camera.lookAt(center);

      if (this.controls) {
        this.controls.target.copy(center);
        this.controls.update();
      }

      console.log('Camera fitted to toolpath:', { center, size, cameraZ });
    } else {
      // Default camera position if no points
      this.camera.position.set(0, -100, 80);
      this.camera.lookAt(0, 0, 0);
      if (this.controls) {
        this.controls.target.set(0, 0, 0);
        this.controls.update();
      }
    }
  }

  /**
   * Setup simulation controls
   */
  setupSimulationControls() {
    const domElements = {
      playBtn: document.getElementById('runSimulationBtn'),
      rewindBtn: document.getElementById('rewindSimulationBtn'),
      forwardBtn: document.getElementById('forwardSimulationBtn'),
      runSimulationIcon: document.getElementById('runSimulationIcon'),
      progressBar: document.getElementById('simProgressBar'),
      speedSlider: document.getElementById('simSpeedSlider'),
      speedValue: document.getElementById('simSpeedValue'),
      speedUnit: document.getElementById('simSpeedUnit'),
    };

    if (domElements.playBtn && domElements.progressBar) {
      setupSimulationControls(domElements, this.parseResult);
    }
  }

  /**
   * Start animation loop
   */
  startAnimationLoop() {
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.controls) this.controls.update();
      this.render();
    };

    // Store render function globally for simulation
    window.gcodeRender = () => this.render();

    // Start the animation loop
    animate();

    // Force an initial render to ensure something is displayed
    setTimeout(() => {
      this.render();
      //console.log('Initial render completed');
    }, 100);
  }

  /**
   * Render the scene
   */
  render() {
    try {
      if (this.renderer && this.scene && this.camera) {
        const now = performance.now();
        const shouldRender = this.shouldRenderFrame(now);

        if (!shouldRender) {
          return; // Skip this frame for adaptive rendering
        }

        // Update frustum for culling
        if (this.frustum) {
          this.updateFrustum();
        }

        // Apply frustum culling to improve performance (but not too frequently)
        if (this.frustum && Math.random() < 0.1) {
          // Only update culling 10% of the time
          this.applyFrustumCulling();
        }

        // Update hover system (for point indicator scaling)
        if (this.hoverSystem) {
          this.hoverSystem.update();
        }

        this.renderer.render(this.scene, this.camera);

        // Update performance monitoring
        this.updatePerformanceMonitor(now, now);

        // Update tracking variables
        this.lastFrameTime = now;
        if (this.camera) {
          this.lastCameraPosition.copy(this.camera.position);
        }
      }
    } catch (error) {
      console.error('Error during render:', error);
    }
  }

  /**
   * Parse G-code into toolpath data
   */
  parseGcode(gcode) {
    // Use the existing parser from the legacy code
    return parseGcodeOptimized(gcode);
  }

  /**
   * Toggle optimization features for debugging
   * @param {string} optimization - Name of optimization to toggle
   * @param {boolean} enabled - Whether to enable/disable
   */
  toggleOptimization(optimization, enabled) {
    switch (optimization) {
      case 'adaptiveRendering':
        this.setAdaptiveRendering(enabled, this.targetFPS);
        //console.log(`Adaptive rendering ${enabled ? 'enabled' : 'disabled'}`);
        break;
      case 'frustumCulling':
        if (enabled && !this.frustum) {
          this.initializeFrustumCulling();
        } else if (!enabled && this.frustum) {
          this.frustum = null;
        }
        break;
      default:
        console.warn(`Unknown optimization: ${optimization}`);
    }
  }

  /**
   * Get current performance stats
   */
  getPerformanceStats() {
    return {
      averageFPS: this.performanceMonitor.averageFPS,
      averageRenderTime:
        this.performanceMonitor.renderTimeHistory.length > 0
          ? (
              this.performanceMonitor.renderTimeHistory.reduce(
                (a, b) => a + b,
                0
              ) / this.performanceMonitor.renderTimeHistory.length
            ).toFixed(2) + 'ms'
          : 'N/A',
      culledObjects: this.culledObjects.size,
      totalObjects: this.scene ? this.scene.children.length : 0,
      adaptiveRendering: this.adaptiveRendering,
      optimizations: {
        adaptiveRendering: this.adaptiveRendering,
        frustumCulling: !!this.frustum,
        rendererOptimized: true, // Always optimized
      },
    };
  }

  /**
   * Dispose of resources
   */
  dispose() {
    if (this.hoverSystem) {
      this.hoverSystem.dispose();
      this.hoverSystem = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.container && this.renderer) {
      this.container.removeChild(this.renderer.domElement);
    }

    // Dispose geometry manager
    if (this.geometryManager) {
      this.geometryManager.dispose();
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.container = null;
  }
}

// Export for global access
window.GcodeVisualizer = GcodeVisualizer;

// Add global optimization controls for debugging
window.optimizationControls = {
  toggleAdaptiveRendering: (enabled) => {
    if (window.gcodeVisualizer) {
      window.gcodeVisualizer.toggleOptimization('adaptiveRendering', enabled);
    }
  },
  toggleFrustumCulling: (enabled) => {
    if (window.gcodeVisualizer) {
      window.gcodeVisualizer.toggleOptimization('frustumCulling', enabled);
    }
  },
  getPerformanceStats: () => {
    if (window.gcodeVisualizer) {
      return window.gcodeVisualizer.getPerformanceStats();
    }
    return { error: 'Visualizer not initialized' };
  },
  enableAllOptimizations: () => {
    if (window.gcodeVisualizer) {
      window.gcodeVisualizer.toggleOptimization('adaptiveRendering', true);
      window.gcodeVisualizer.toggleOptimization('frustumCulling', true);
      console.log('All optimizations enabled');
    }
  },
  disableAllOptimizations: () => {
    if (window.gcodeVisualizer) {
      window.gcodeVisualizer.toggleOptimization('adaptiveRendering', false);
      // Frustum culling is always applied, but we can log it
    }
  },
};

// Make optimization controls easily accessible
window.opt = window.optimizationControls;
