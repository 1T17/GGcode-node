/**
 * Toolpath Point Detection Module
 *
 * Handles mouse interaction detection and point identification using Three.js raycasting.
 * Creates invisible sphere geometries at toolpath starting points for precise mouse intersection.
 */

import { PointDataExtractor } from './pointDataExtractor.js';

export class ToolpathPointDetector {
  /**
   * Enable or disable point detection
   * @param {boolean} enabled
   */
  setActive(enabled) {
    this.active = !!enabled;
  }
  constructor() {
    // On/off switch for point detection
    this.active = false;
    // Raycasting components
    this.raycaster = null;
    this.mouse = new THREE.Vector2();
    // Intersection geometries and objects
    this.intersectionSpheres = [];
    this.intersectionGroup = null;
    // Point data mapping
    this.pointDataMap = new Map(); // Maps sphere index to point data
    // Point data extraction utility
    this.dataExtractor = new PointDataExtractor();
    // Configuration
    this.config = {
      sphereRadius: 0.25, // Smaller radius for more accurate detection
      maxDetectionDistance: 50, // Maximum distance for point detection
      debounceDelay: 150, // Increased debounce delay for less lag
    };
    // Performance optimization
    this.lastMouseUpdate = 0;
    this.intersectionCache = new Map();
    this.cacheTimeout = 100; // Cache timeout in milliseconds
    // References
    this.scene = null;
    this.container = null;
    this.camera = null;
  }

  /**
   * Initialize the point detector with scene, camera and container
   * @param {THREE.Scene} scene - The Three.js scene
   * @param {THREE.Camera} camera - The Three.js camera
   * @param {HTMLElement} container - The container element
   * @returns {boolean} Success status
   */
  initialize(scene, camera, container) {
    try {
      if (!scene || !camera || !container) {
        console.error(
          '❌ ToolpathPointDetector: Invalid scene, camera, or container'
        );
        return false;
      }

      this.scene = scene;
      this.camera = camera;
      this.container = container;

      // Initialize raycaster
      this.raycaster = new THREE.Raycaster();
      this.raycaster.params.Points.threshold = this.config.sphereRadius;

      // Create intersection group
      this.intersectionGroup = new THREE.Group();
      this.intersectionGroup.name = 'ToolpathIntersectionSpheres';
      this.intersectionGroup.visible = false; // Invisible for interaction only

      // Add to scene
      scene.add(this.intersectionGroup);
      return true;
    } catch (error) {
      console.error('💥 ToolpathPointDetector: Initialization error:', error);
      return false;
    }
  }

  /**
   * Create intersection spheres at toolpath starting points
   * @param {Array} toolpathSegments - Array of toolpath segments
   * @param {Array} toolpathModes - Array of G-code modes for each segment
   * @param {Array} lineMap - Array mapping segments to G-code line numbers
   * @param {Array} gcodeLines - Array of original G-code lines
   */
  createIntersectionSpheres(
    toolpathSegments,
    toolpathModes,
    lineMap,
    gcodeLines
  ) {
    // ...existing code...
    try {
      // Clear existing spheres
      this.clearIntersectionSpheres();

      if (!toolpathSegments || toolpathSegments.length === 0) {
        return;
      }

      // Create sphere geometry (reused for all spheres)
      const sphereGeometry = new THREE.SphereGeometry(
        this.config.sphereRadius,
        6,
        4
      );

      // Create invisible material
      const sphereMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        visible: false,
      });

      // Create spheres at every segment end
      toolpathSegments.forEach((segment, index) => {
        if (!segment || segment.length < 2) return;
        const endPoint = segment[1];
        if (this.isValidPoint(endPoint)) {
          const endSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          endSphere.position.copy(endPoint);
          endSphere.userData.segmentIndex = index;
          endSphere.userData.isStartPoint = false;
          this.intersectionGroup.add(endSphere);
          this.intersectionSpheres.push(endSphere);
          const endPointData = this.createPointData(
            index,
            endPoint,
            toolpathModes[index] || 'G1',
            lineMap[index] || 0,
            gcodeLines
          );
          this.pointDataMap.set(`${index}_end`, endPointData);
        }
      });
      // ...existing code...

      //console.log(`🎉 CreateIntersectionSpheres: Created ${this.intersectionSpheres.length} intersection spheres`);
      //console.log('📊 CreateIntersectionSpheres: Summary:', {
      //    totalSpheres: this.intersectionSpheres.length,
      //    intersectionGroupChildren: this.intersectionGroup.children.length,
      //    pointDataMapSize: this.pointDataMap.size
      //});
    } catch (error) {
      console.error('💥 CreateIntersectionSpheres: Error:', error);
    }
  }

  /**
   * Create point data object for a toolpath point using the data extractor
   * @param {number} segmentIndex - Index in toolpath segments
   * @param {THREE.Vector3} coordinates - 3D coordinates
   * @param {string} mode - G-code mode (G0, G1, G2, G3)
   * @param {number} lineIndex - Line number in original G-code
   * @param {Array} gcodeLines - Array of G-code lines
   * @returns {Object} Point data object
   */
  createPointData(segmentIndex, coordinates, mode, lineIndex, gcodeLines) {
    try {
      // Use the data extractor for comprehensive point data extraction
      const data = this.dataExtractor.extractPointData(
        segmentIndex,
        coordinates,
        mode,
        lineIndex,
        gcodeLines
      );
      // Always add .position property for hover indicator
      data.position = coordinates.clone();
      return data;
    } catch (error) {
      console.error('Error creating point data:', error);

      // Fallback to basic point data
      const gcodeLine =
        gcodeLines && gcodeLines[lineIndex]
          ? gcodeLines[lineIndex].trim()
          : `${mode} X${coordinates.x.toFixed(3)} Y${coordinates.y.toFixed(3)} Z${coordinates.z.toFixed(3)}`;

      return {
        segmentIndex,
        coordinates: coordinates.clone(),
        position: coordinates.clone(),
        mode,
        lineIndex,
        gcodeLine,
        timestamp: Date.now(),
        displayData: {
          coordinates: `X: ${coordinates.x.toFixed(2)} Y: ${coordinates.y.toFixed(2)} Z: ${coordinates.z.toFixed(2)}`,
          command: gcodeLine,
          arcInfo: '',
          technicalInfo: `Line: ${lineIndex + 1} | Segment: ${segmentIndex + 1}`,
          mode: mode,
          modeConfig: this.dataExtractor.getModeConfig(mode),
        },
      };
    }
  }

  /**
   * Detect point at mouse coordinates
   * @param {number} mouseX - Mouse X coordinate (screen space)
   * @param {number} mouseY - Mouse Y coordinate (screen space)
   * @returns {Object|null} Point data or null if no point found
   */
  detectPointAtMouse(mouseX, mouseY) {
    if (this.active === false) return null;
    // Convert mouse coordinates to normalized device coordinates
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((mouseX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((mouseY - rect.top) / rect.height) * 2 + 1;

    // Dynamically adjust raycaster threshold based on camera distance
    // Use average distance to all spheres (or just first if performance is a concern)
    let avgDist = 0.0;
    if (this.intersectionSpheres.length > 0 && this.camera) {
      let totalDist = 0;
      for (let i = 0; i < Math.min(10, this.intersectionSpheres.length); i++) {
        totalDist += this.camera.position.distanceTo(
          this.intersectionSpheres[i].position
        );
      }
      avgDist = totalDist / Math.min(10, this.intersectionSpheres.length);
    }
    // Set threshold proportional to distance (tweak factor as needed)
    this.raycaster.params.Points.threshold = Math.max(0.15, avgDist * 0.012);

    // Perform raycasting
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.intersectionSpheres,
      false
    );

    if (intersects.length > 0) {
      const closest = intersects[0];
      const segmentIndex = closest.object.userData.segmentIndex;
      const isStartPoint = closest.object.userData.isStartPoint;
      const pointKey =
        isStartPoint !== undefined
          ? `${segmentIndex}_${isStartPoint ? 'start' : 'end'}`
          : segmentIndex;
      const pointData = this.pointDataMap.get(pointKey);
      if (pointData) {
        return {
          ...pointData,
          distance: closest.distance,
          intersectionPoint: closest.point.clone(),
        };
      }
    }
    return null;
  }

  /**
   * Check if a point has valid coordinates
   * @param {THREE.Vector3} point - Point to check
   * @returns {boolean} True if valid
   */
  isValidPoint(point) {
    if (!point) return false;
    return (
      typeof point.x === 'number' &&
      isFinite(point.x) &&
      !isNaN(point.x) &&
      typeof point.y === 'number' &&
      isFinite(point.y) &&
      !isNaN(point.y) &&
      typeof point.z === 'number' &&
      isFinite(point.z) &&
      !isNaN(point.z)
    );
  }

  /**
   * Clean old cache entries
   * @param {number} currentTime - Current timestamp
   */
  cleanCache(currentTime) {
    for (const [key, value] of this.intersectionCache.entries()) {
      if (currentTime - value.timestamp > this.cacheTimeout * 2) {
        this.intersectionCache.delete(key);
      }
    }
  }

  /**
   * Clear all intersection spheres
   */
  clearIntersectionSpheres() {
    // Remove spheres from scene
    if (this.intersectionGroup) {
      this.intersectionGroup.clear();
    }

    // Clear arrays and maps
    this.intersectionSpheres.length = 0;
    this.pointDataMap.clear();
    this.intersectionCache.clear();
  }

  /**
   * Update intersection spheres when toolpath changes
   * @param {Object} toolpathData - Toolpath data from viewer
   */
  updateToolpath(toolpathData) {
    if (!toolpathData) return;

    const { toolpathSegments, toolpathModes, lineMap, gcodeLines } =
      toolpathData;
    this.createIntersectionSpheres(
      toolpathSegments,
      toolpathModes,
      lineMap,
      gcodeLines
    );
  }

  /**
   * Enable/disable point detection
   * @param {boolean} enabled - Whether to enable detection
   */
  setEnabled(enabled) {
    if (this.intersectionGroup) {
      // We don't change visibility since spheres are always invisible
      // But we can disable raycasting by clearing the spheres array temporarily
      if (!enabled) {
        this.intersectionSpheres.length = 0;
      } else if (this.intersectionGroup.children.length > 0) {
        this.intersectionSpheres = [...this.intersectionGroup.children];
      }
    }
  }

  /**
   * Get configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration options
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };

    // Update raycaster threshold if sphere radius changed
    if (newConfig.sphereRadius && this.raycaster) {
      this.raycaster.params.Points.threshold = this.config.sphereRadius;
    }
  }

  /**
   * Get performance statistics
   * @returns {Object} Performance stats
   */
  getStats() {
    return {
      sphereCount: this.intersectionSpheres.length,
      cacheSize: this.intersectionCache.size,
      pointDataCount: this.pointDataMap.size,
      lastUpdate: this.lastMouseUpdate,
    };
  }

  /**
   * Cleanup and dispose of resources
   */
  dispose() {
    try {
      // Clear intersection spheres
      this.clearIntersectionSpheres();

      // Remove intersection group from scene
      if (this.intersectionGroup && this.intersectionGroup.parent) {
        this.intersectionGroup.parent.remove(this.intersectionGroup);
      }

      // Dispose geometries and materials
      if (this.intersectionGroup) {
        this.intersectionGroup.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      }

      // Clear references
      this.raycaster = null;
      this.intersectionGroup = null;
      this.scene = null;
      this.camera = null;
      this.container = null;
    } catch (error) {
      console.error('Error disposing ToolpathPointDetector:', error);
    }
  }
}

export default ToolpathPointDetector;
