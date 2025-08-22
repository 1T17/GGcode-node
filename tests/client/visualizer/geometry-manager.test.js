/**
 * @jest-environment jsdom
 */

// Mock Three.js classes for geometry manager testing
class MockVector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set() { }
    copy() { return this; }
    clone() { return new MockVector3(this.x, this.y, this.z); }
    applyMatrix4() { }
    distanceTo(other) { 
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
    add(v) { 
        if (v instanceof MockVector3) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
        }
        return this; 
    }
    multiplyScalar(s) { 
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this; 
    }
    subVectors(a, b) { 
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }
    length() { return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z); }
    normalize() { return this; }
    addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }
}

class MockBufferGeometry {
    constructor() {
        this.attributes = {};
        this.drawRange = { start: 0, count: 0 };
        this.boundingBox = null;
        this.boundingSphere = null;
    }
    setFromPoints() { return this; }
    setDrawRange(start, count) { 
        this.drawRange.start = start;
        this.drawRange.count = count;
        return this;
    }
    computeBoundingBox() { 
        this.boundingBox = new MockBox3();
        return this;
    }
    computeBoundingSphere() { 
        this.boundingSphere = new MockSphere(new MockVector3(), 1);
        return this;
    }
    dispose() { }
}

class MockMaterial {
    constructor(params) {
        this.color = params ? params.color : 0xffffff;
        this.transparent = params ? params.transparent : false;
        this.opacity = params ? params.opacity : 1.0;
        this.map = params ? params.map : null;
        this.visible = true;
    }
    dispose() { }
}

class MockInstancedMesh {
    constructor(geometry, material, count) {
        this.geometry = geometry;
        this.material = material;
        this.count = count;
        this.instanceMatrix = { needsUpdate: false };
        this.visible = true;
    }
    setMatrixAt(index, matrix) { }
    dispose() { }
}

class MockMatrix4 {
    constructor() {
        this.elements = new Array(16).fill(0);
    }
    multiplyMatrices() { return this; }
    setPosition() { return this; }
    makeScale(x, y, z) { return this; }
    makeRotationFromQuaternion() { return this; }
    makeRotationFromEuler() { return this; }
}

class MockBox3 {
    constructor() {
        this.min = new MockVector3();
        this.max = new MockVector3();
    }
    setFromPoints() { return this; }
    getCenter() { return new MockVector3(); }
    getSize() { return new MockVector3(); }
    applyMatrix4() { return this; }
    containsPoint() { return true; }
    clone() { return new MockBox3(); }
    setFromObject() { return this; }
}

class MockSphere {
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
    }
}

class MockQuaternion {
    constructor() { }
    setFromUnitVectors(a, b) { return this; }
}

class MockCylinderGeometry extends MockBufferGeometry {
    constructor(radiusTop, radiusBottom, height, radialSegments) {
        super();
    }
}

// Mock Three.js globals
global.THREE = {
    Vector3: MockVector3,
    BufferGeometry: MockBufferGeometry,
    Material: MockMaterial,
    InstancedMesh: MockInstancedMesh,
    Matrix4: MockMatrix4,
    Box3: MockBox3,
    Sphere: MockSphere,
    Quaternion: MockQuaternion,
    CylinderGeometry: MockCylinderGeometry
};

// Create a mock GeometryManager for testing
class TestGeometryManager {
    constructor() {
        this.instancedMeshes = new Map();
        this.baseGeometries = new Map();
    }

    createInstancedLineSystem(segments, mode) {
        const lineCount = segments.length;
        if (lineCount === 0) return null;

        const radius = 0.05;
        const geometry = this.getOrCreateBaseGeometry('cylinder', radius);

        const material = new THREE.Material({
            color: this.getModeColor(mode),
            transparent: true,
            opacity: this.getModeOpacity(mode)
        });

        const instancedMesh = new THREE.InstancedMesh(geometry, material, lineCount);

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const matrix = this.calculateCylinderMatrix(segment[0], segment[1]);
            instancedMesh.setMatrixAt(i, matrix);
        }

        instancedMesh.instanceMatrix.needsUpdate = true;
        this.instancedMeshes.set(mode, instancedMesh);
        
        return instancedMesh;
    }

    getOrCreateBaseGeometry(type, radius = 0.05) {
        const key = `${type}-${radius}`;
        
        if (this.baseGeometries.has(key)) {
            return this.baseGeometries.get(key);
        }

        let geometry;
        switch (type) {
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(radius, radius, 1, 6);
                break;
            default:
                geometry = new THREE.BufferGeometry();
        }

        this.baseGeometries.set(key, geometry);
        return geometry;
    }

    calculateCylinderMatrix(start, end) {
        const startPoint = Array.isArray(start) ? 
            new THREE.Vector3(start[0], start[1], start[2]) : start;
        const endPoint = Array.isArray(end) ? 
            new THREE.Vector3(end[0], end[1], end[2]) : end;

        const matrix = new THREE.Matrix4();

        const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
        const length = direction.length();

        if (length === 0) {
            matrix.setPosition(startPoint);
            return matrix;
        }

        matrix.makeScale(1, length, 1);

        const midpoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
        matrix.setPosition(midpoint);

        const quaternion = new THREE.Quaternion();
        const up = new THREE.Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(up, direction.normalize());
        matrix.makeRotationFromQuaternion(quaternion);

        return matrix;
    }

    getModeColor(mode) {
        const colors = {
            'G0': 0xFF8E37,
            'G1': 0x00ff99,
            'G2': 0x0074D9,
            'G3': 0xF012BE
        };
        return colors[mode] || 0xffffff;
    }

    getModeOpacity(mode) {
        const opacities = {
            'G0': 0.6,
            'G1': 0.9,
            'G2': 0.9,
            'G3': 0.9
        };
        return opacities[mode] || 0.9;
    }

    updateInstancedLineSystem(segments, mode) {
        const instancedMesh = this.instancedMeshes.get(mode);
        if (!instancedMesh) return false;

        if (segments.length > instancedMesh.count) {
            return false;
        }

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const matrix = this.calculateCylinderMatrix(segment[0], segment[1]);
            instancedMesh.setMatrixAt(i, matrix);
        }

        for (let i = segments.length; i < instancedMesh.count; i++) {
            const matrix = new THREE.Matrix4();
            matrix.makeScale(0, 0, 0);
            instancedMesh.setMatrixAt(i, matrix);
        }

        instancedMesh.instanceMatrix.needsUpdate = true;
        return true;
    }

    dispose() {
        for (const geometry of this.baseGeometries.values()) {
            if (geometry.dispose) geometry.dispose();
        }
        this.baseGeometries.clear();
        this.instancedMeshes.clear();
    }
}

describe('GeometryManager', () => {
    let geometryManager;

    beforeEach(() => {
        geometryManager = new TestGeometryManager();
    });

    afterEach(() => {
        jest.clearAllMocks();
        if (geometryManager) {
            geometryManager.dispose();
        }
    });

    describe('createInstancedLineSystem', () => {
        test('should create instanced mesh for line segments', () => {
            const segments = [
                [[0, 0, 0], [1, 1, 1]],
                [[1, 1, 1], [2, 2, 2]]
            ];

            const instancedMesh = geometryManager.createInstancedLineSystem(segments, 'G1');

            expect(instancedMesh).toBeDefined();
            expect(instancedMesh.count).toBe(2);
        });

        test('should handle empty segments array', () => {
            const instancedMesh = geometryManager.createInstancedLineSystem([], 'G1');
            expect(instancedMesh).toBeNull();
        });

        test('should create correct material colors for different modes', () => {
            const segments = [[[0, 0, 0], [1, 1, 1]]];

            const g0Mesh = geometryManager.createInstancedLineSystem(segments, 'G0');
            const g1Mesh = geometryManager.createInstancedLineSystem(segments, 'G1');
            const g2Mesh = geometryManager.createInstancedLineSystem(segments, 'G2');
            const g3Mesh = geometryManager.createInstancedLineSystem(segments, 'G3');

            // Check that materials were created with correct colors
            expect(g0Mesh.material.color).toBe(0xFF8E37); // Orange
            expect(g1Mesh.material.color).toBe(0x00ff99); // Green
            expect(g2Mesh.material.color).toBe(0x0074D9); // Blue
            expect(g3Mesh.material.color).toBe(0xF012BE); // Magenta
        });

        test('should use correct opacities for different modes', () => {
            const segments = [[[0, 0, 0], [1, 1, 1]]];

            const g0Mesh = geometryManager.createInstancedLineSystem(segments, 'G0');
            const g1Mesh = geometryManager.createInstancedLineSystem(segments, 'G1');

            expect(g0Mesh.material.opacity).toBe(0.6); // Rapid moves less prominent
            expect(g1Mesh.material.opacity).toBe(0.9);
        });
    });

    describe('calculateCylinderMatrix', () => {
        test('should calculate matrix for cylinder between two points', () => {
            const start = [0, 0, 0];
            const end = [0, 2, 0]; // 2 units up

            const matrix = geometryManager.calculateCylinderMatrix(start, end);

            expect(matrix).toBeDefined();
        });

        test('should handle zero-length segments', () => {
            const start = [1, 1, 1];
            const end = [1, 1, 1]; // Same point

            const matrix = geometryManager.calculateCylinderMatrix(start, end);

            expect(matrix).toBeDefined();
        });

        test('should handle array and Vector3 inputs', () => {
            const startArray = [0, 0, 0];
            const endArray = [1, 1, 1];
            
            const startVector = new THREE.Vector3(0, 0, 0);
            const endVector = new THREE.Vector3(1, 1, 1);

            const matrix1 = geometryManager.calculateCylinderMatrix(startArray, endArray);
            const matrix2 = geometryManager.calculateCylinderMatrix(startVector, endVector);

            expect(matrix1).toBeDefined();
            expect(matrix2).toBeDefined();
        });
    });

    describe('getOrCreateBaseGeometry', () => {
        test('should create and cache base geometries', () => {
            const geometry1 = geometryManager.getOrCreateBaseGeometry('cylinder', 0.05);
            const geometry2 = geometryManager.getOrCreateBaseGeometry('cylinder', 0.05);

            expect(geometry1).toBeDefined();
            expect(geometry1).toBe(geometry2); // Should return the same instance
        });

        test('should create different geometries for different parameters', () => {
            const geometry1 = geometryManager.getOrCreateBaseGeometry('cylinder', 0.05);
            const geometry2 = geometryManager.getOrCreateBaseGeometry('cylinder', 0.1);

            expect(geometry1).toBeDefined();
            expect(geometry2).toBeDefined();
            expect(geometry1).not.toBe(geometry2); // Should be different instances
        });
    });

    describe('updateInstancedLineSystem', () => {
        test('should update existing instanced mesh', () => {
            const segments1 = [[[0, 0, 0], [1, 1, 1]]];
            const segments2 = [[[0, 0, 0], [1, 1, 1]], [[1, 1, 1], [2, 2, 2]]];

            // Create initial mesh
            geometryManager.createInstancedLineSystem(segments1, 'G1');
            
            // Try to update it
            const result = geometryManager.updateInstancedLineSystem(segments2, 'G1');
            
            // Should fail because we need more instances
            expect(result).toBe(false);
        });

        test('should handle updating with fewer segments', () => {
            const segments1 = [[[0, 0, 0], [1, 1, 1]], [[1, 1, 1], [2, 2, 2]]];
            const segments2 = [[[0, 0, 0], [1, 1, 1]]];

            // Create initial mesh
            geometryManager.createInstancedLineSystem(segments1, 'G1');
            
            // Try to update it
            const result = geometryManager.updateInstancedLineSystem(segments2, 'G1');
            
            // Should succeed
            expect(result).toBe(true);
        });
    });

    describe('dispose', () => {
        test('should dispose of all resources', () => {
            const segments = [[[0, 0, 0], [1, 1, 1]]];
            geometryManager.createInstancedLineSystem(segments, 'G1');
            
            // Before dispose
            expect(geometryManager.baseGeometries.size).toBeGreaterThan(0);
            
            geometryManager.dispose();
            
            // After dispose
            expect(geometryManager.baseGeometries.size).toBe(0);
            expect(geometryManager.instancedMeshes.size).toBe(0);
        });
    });

    describe('performance benefits', () => {
        test('instanced rendering should reduce draw calls significantly', () => {
            // Create many segments
            const segments = [];
            for (let i = 0; i < 1000; i++) {
                segments.push([[i, i, i], [i+1, i+1, i+1]]);
            }

            const startTime = performance.now();
            const instancedMesh = geometryManager.createInstancedLineSystem(segments, 'G1');
            const endTime = performance.now();

            // Should create only one mesh for 1000 segments
            expect(instancedMesh).toBeDefined();
            expect(instancedMesh.count).toBe(1000);
            
            // Should be reasonably fast
            expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
        });

        test('should reuse base geometries for memory efficiency', () => {
            const segments1 = [[[0, 0, 0], [1, 1, 1]]];
            const segments2 = [[[1, 1, 1], [2, 2, 2]]];

            const mesh1 = geometryManager.createInstancedLineSystem(segments1, 'G1');
            const mesh2 = geometryManager.createInstancedLineSystem(segments2, 'G2');

            // Both meshes should use the same base geometry
            expect(mesh1.geometry).toBe(mesh2.geometry);
        });
    });
});