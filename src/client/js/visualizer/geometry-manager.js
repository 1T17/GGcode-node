/**
 * Geometry Manager Module
 *
 * Manages optimized geometry creation and instancing for G-code visualization
 */

/**
 * Geometry manager class for creating optimized geometry representations
 */
export class GeometryManager {
  constructor() {
    this.instancedMeshes = new Map(); // Store instanced meshes by mode
    this.baseGeometries = new Map(); // Store base geometries
  }

  /**
   * Create an instanced line system for efficient rendering
   * @param {Array} segments - Array of line segments [[start, end], ...]
   * @param {string} mode - G-code mode (G0, G1, G2, G3)
   * @returns {THREE.InstancedMesh|null} Instanced mesh or null if no segments
   */
  createInstancedLineSystem(segments, mode) {
    try {
      const lineCount = segments.length;
      if (lineCount === 0) return null;

      console.log(
        `Creating instanced line system for ${lineCount} ${mode} segments`
      );

      // Create base geometry (cylinder for lines)
      const radius = 0.05; // Reduced for better visibility
      const geometry = this.getOrCreateBaseGeometry('cylinder', radius);

      // Create material based on mode
      const material = new THREE.MeshBasicMaterial({
        color: this.getModeColor(mode),
        transparent: true,
        opacity: this.getModeOpacity(mode),
      });
      console.log(
        `Created material for ${mode} with color ${this.getModeColor(mode).toString(16)} and opacity ${this.getModeOpacity(mode)}`
      );

      // Create instanced mesh
      const instancedMesh = new THREE.InstancedMesh(
        geometry,
        material,
        lineCount
      );
      console.log(
        `Created instanced mesh with capacity for ${lineCount} instances`
      );

      // Calculate matrices for each segment
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const matrix = this.calculateCylinderMatrix(segment[0], segment[1]);
        instancedMesh.setMatrixAt(i, matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;

      // Store reference for later updates
      this.instancedMeshes.set(mode, instancedMesh);

      console.log(`Instanced line system created successfully for ${mode}`, {
        visible: instancedMesh.visible,
        count: instancedMesh.count,
        materialColor: material.color,
        materialOpacity: material.opacity,
      });
      return instancedMesh;
    } catch (error) {
      console.error(`Error creating instanced line system for ${mode}:`, error);
      return null;
    }
  }

  /**
   * Get or create a base geometry to reuse
   * @param {string} type - Geometry type
   * @param {number} radius - Radius for cylinder geometry
   * @returns {THREE.BufferGeometry} Base geometry
   */
  getOrCreateBaseGeometry(type, radius = 0.05) {
    const key = `${type}-${radius}`;

    if (this.baseGeometries.has(key)) {
      return this.baseGeometries.get(key);
    }

    let geometry;
    switch (type) {
      case 'cylinder':
        // Create a cylinder along Y axis (height = 1, radiusTop = radius, radiusBottom = radius)
        // Using 8 radial segments for better appearance
        geometry = new THREE.CylinderGeometry(radius, radius, 1, 8);
        console.log(
          `Created cylinder geometry with radius ${radius}, height 1`
        );
        break;
      default:
        // Fallback to simple box
        geometry = new THREE.BoxGeometry(radius * 2, 1, radius * 2);
        console.log(`Created box geometry`);
    }

    this.baseGeometries.set(key, geometry);
    return geometry;
  }

  /**
   * Calculate transformation matrix for a cylinder between two points
   * @param {Array|THREE.Vector3} start - Start point [x, y, z]
   * @param {Array|THREE.Vector3} end - End point [x, y, z]
   * @returns {THREE.Matrix4} Transformation matrix
   */
  calculateCylinderMatrix(start, end) {
    // Convert array points to Vector3 if needed
    const startPoint = Array.isArray(start)
      ? new THREE.Vector3(start[0], start[1], start[2])
      : start;
    const endPoint = Array.isArray(end)
      ? new THREE.Vector3(end[0], end[1], end[2])
      : end;

    const matrix = new THREE.Matrix4();

    // Calculate direction and length
    const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
    const length = direction.length();

    // Handle zero-length segments
    if (length === 0) {
      // Create a zero-length segment (just a point)
      matrix.setPosition(startPoint);
      // Scale to zero to hide it
      matrix.scale(new THREE.Vector3(0.001, 0.001, 0.001));
      console.log(
        `Zero-length segment at ${startPoint.x}, ${startPoint.y}, ${startPoint.z}`
      );
      return matrix;
    }

    // Position at midpoint
    const midpoint = new THREE.Vector3()
      .addVectors(startPoint, endPoint)
      .multiplyScalar(0.5);

    // Create a quaternion to rotate the cylinder to align with the direction
    const quaternion = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0); // Default cylinder orientation
    quaternion.setFromUnitVectors(up, direction.clone().normalize());

    // Scale to correct length (cylinder is 1 unit tall, so we scale Y to length)
    const scale = new THREE.Vector3(1, length, 1);

    // Compose all transformations into one matrix
    matrix.compose(midpoint, quaternion, scale);

    console.log(
      `Cylinder: length=${length}, position=(${midpoint.x}, ${midpoint.y}, ${midpoint.z})`
    );

    return matrix;
  }

  /**
   * Get color for a specific G-code mode
   * @param {string} mode - G-code mode
   * @returns {number} Color as hex value
   */
  getModeColor(mode) {
    const colors = {
      G0: 0xff8e37, // Orange (rapid)
      G1: 0x00ff99, // Green (linear)
      G2: 0x0074d9, // Blue (CW arc)
      G3: 0xf012be, // Magenta (CCW arc)
    };
    return colors[mode] || 0xffffff;
  }

  /**
   * Get opacity for a specific G-code mode
   * @param {string} mode - G-code mode
   * @returns {number} Opacity value (0-1)
   */
  getModeOpacity(mode) {
    const opacities = {
      G0: 0.6, // Rapid moves are less prominent
      G1: 0.9,
      G2: 0.9,
      G3: 0.9,
    };
    return opacities[mode] || 0.9;
  }

  /**
   * Update an existing instanced mesh with new segments
   * @param {Array} segments - Array of line segments
   * @param {string} mode - G-code mode
   * @returns {boolean} True if updated successfully
   */
  updateInstancedLineSystem(segments, mode) {
    const instancedMesh = this.instancedMeshes.get(mode);
    if (!instancedMesh) return false;

    // If we need more instances, we have to recreate the mesh
    if (segments.length > instancedMesh.count) {
      return false; // Need to recreate
    }

    // Update existing instances
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const matrix = this.calculateCylinderMatrix(segment[0], segment[1]);
      instancedMesh.setMatrixAt(i, matrix);
    }

    // Hide unused instances
    for (let i = segments.length; i < instancedMesh.count; i++) {
      const matrix = new THREE.Matrix4();
      matrix.makeScale(0, 0, 0); // Scale to zero to hide
      instancedMesh.setMatrixAt(i, matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    return true;
  }

  /**
   * Dispose of all geometries and meshes to prevent memory leaks
   */
  dispose() {
    // Dispose base geometries
    for (const geometry of this.baseGeometries.values()) {
      if (geometry.dispose) geometry.dispose();
    }
    this.baseGeometries.clear();

    // Clear instanced mesh references
    this.instancedMeshes.clear();
  }
}

// Export for global access
window.GeometryManager = GeometryManager;
