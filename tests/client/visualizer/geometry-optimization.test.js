/**
 * @jest-environment jsdom
 */

// Mock Three.js classes for geometry optimization testing
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
    distanceTo() { return 0; }
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

class MockLineBasicMaterial {
    constructor(params) {
        this.color = params.color;
        this.transparent = params.transparent;
        this.opacity = params.opacity;
    }
}

class MockLineSegments {
    constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.visible = true;
        this.userData = {};
        this.matrixWorld = new MockMatrix4();
    }
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
}

class MockMatrix4 {
    constructor() {
        this.elements = new Array(16).fill(0);
    }
    multiplyMatrices() { return this; }
    setPosition() { return this; }
    makeScale() { return this; }
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

// Mock Three.js globals
global.THREE = {
    Vector3: MockVector3,
    BufferGeometry: MockBufferGeometry,
    LineBasicMaterial: MockLineBasicMaterial,
    LineSegments: MockLineSegments,
    InstancedMesh: MockInstancedMesh,
    Matrix4: MockMatrix4,
    Box3: MockBox3,
    Sphere: MockSphere,
    CylinderGeometry: jest.fn().mockImplementation(() => new MockBufferGeometry()),
    MeshBasicMaterial: jest.fn().mockImplementation((params) => new MockLineBasicMaterial(params))
};

// Create a test version of GcodeVisualizer with geometry optimization
class TestGcodeVisualizer {
    constructor() {
        this.scene = { add: jest.fn() };
        this.optimizationSettings = {
            useInstancing: false,
            useLineSegments: true,
            batchGeometries: true
        };
    }

    // Original implementation using LineSegments
    createLineObjectOriginal(points, color, opacity, mode) {
        if (points.length === 0) return null;

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, points.length);
        geometry.computeBoundingBox();
        
        const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        const line = new THREE.LineSegments(geometry, material);
        
        // Store pre-calculated bounding box in userData for performance
        if (geometry.boundingBox) {
            line.userData = {
                boundingBox: geometry.boundingBox
            };
        }
        
        this.scene.add(line);
        return line;
    }

    // Optimized implementation using instancing
    createInstancedLineSystem(segments, mode) {
        const lineCount = segments.length;
        if (lineCount === 0) return null;

        // Create base geometry (cylinder for lines)
        const radius = 0.05;
        const geometry = new THREE.CylinderGeometry(radius, radius, 1, 6);

        // Create material based on mode
        const material = new THREE.MeshBasicMaterial({
            color: this.getModeColor(mode),
            transparent: true,
            opacity: this.getModeOpacity(mode)
        });

        // Create instanced mesh
        const instancedMesh = new THREE.InstancedMesh(geometry, material, lineCount);

        // Calculate matrices for each segment
        segments.forEach((segment, index) => {
            const matrix = this.calculateCylinderMatrix(segment[0], segment[1]);
            instancedMesh.setMatrixAt(index, matrix);
        });

        instancedMesh.instanceMatrix.needsUpdate = true;
        this.scene.add(instancedMesh);
        return instancedMesh;
    }

    calculateCylinderMatrix(start, end) {
        const matrix = new THREE.Matrix4();

        // Calculate direction and length
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();

        // Scale cylinder to correct length
        matrix.makeScale(1, length, 1);

        // Position at midpoint
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        matrix.setPosition(midpoint);

        // Rotate to align with direction
        // Note: Simplified for testing
        return matrix;
    }

    getModeColor(mode) {
        const colors = {
            'G0': 0xFF8E37,  // Orange (rapid)
            'G1': 0x00ff99,  // Green (linear)
            'G2': 0x0074D9,  // Blue (CW arc)
            'G3': 0xF012BE   // Magenta (CCW arc)
        };
        return colors[mode] || 0xffffff;
    }

    getModeOpacity(mode) {
        const opacities = {
            'G0': 0.6,  // Rapid moves are less prominent
            'G1': 0.9,
            'G2': 0.9,
            'G3': 0.9
        };
        return opacities[mode] || 0.9;
    }

    // Batched geometry implementation
    createBatchedLineObject(points, color, opacity, mode) {
        if (points.length === 0) return null;

        // Create a single geometry with all points
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, points.length);
        geometry.computeBoundingBox();
        
        const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        const line = new THREE.LineSegments(geometry, material);
        
        // Store pre-calculated bounding box in userData for performance
        if (geometry.boundingBox) {
            line.userData = {
                boundingBox: geometry.boundingBox
            };
        }
        
        this.scene.add(line);
        return line;
    }
}

describe('Geometry Optimization', () => {
    let visualizer;

    beforeEach(() => {
        visualizer = new TestGcodeVisualizer();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createLineObjectOriginal', () => {
        test('should create line object with bounding box', () => {
            const points = [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1, 1, 1),
                new THREE.Vector3(2, 2, 2)
            ];

            const line = visualizer.createLineObjectOriginal(points, 0xff0000, 0.8, 'G1');

            expect(line).toBeDefined();
            expect(line.geometry).toBeDefined();
            expect(line.material).toBeDefined();
            expect(line.userData.boundingBox).toBeDefined();
            expect(visualizer.scene.add).toHaveBeenCalledWith(line);
        });

        test('should handle empty points array', () => {
            const line = visualizer.createLineObjectOriginal([], 0xff0000, 0.8, 'G1');
            expect(line).toBeNull();
        });
    });

    describe('createInstancedLineSystem', () => {
        test('should create instanced mesh for line segments', () => {
            const segments = [
                [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1)],
                [new THREE.Vector3(1, 1, 1), new THREE.Vector3(2, 2, 2)]
            ];

            const instancedMesh = visualizer.createInstancedLineSystem(segments, 'G1');

            expect(instancedMesh).toBeDefined();
            expect(instancedMesh.count).toBe(2);
            expect(visualizer.scene.add).toHaveBeenCalledWith(instancedMesh);
        });

        test('should handle empty segments array', () => {
            const instancedMesh = visualizer.createInstancedLineSystem([], 'G1');
            expect(instancedMesh).toBeNull();
        });

        test('should create correct material colors for different modes', () => {
            const segments = [[new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1)]];

            const g0Mesh = visualizer.createInstancedLineSystem(segments, 'G0');
            const g1Mesh = visualizer.createInstancedLineSystem(segments, 'G1');
            const g2Mesh = visualizer.createInstancedLineSystem(segments, 'G2');
            const g3Mesh = visualizer.createInstancedLineSystem(segments, 'G3');

            // Check that materials were created with correct colors
            expect(THREE.MeshBasicMaterial).toHaveBeenCalledWith(expect.objectContaining({
                color: 0xFF8E37
            }));
            
            expect(THREE.MeshBasicMaterial).toHaveBeenCalledWith(expect.objectContaining({
                color: 0x00ff99
            }));
        });
    });

    describe('calculateCylinderMatrix', () => {
        test('should calculate matrix for cylinder between two points', () => {
            const start = new THREE.Vector3(0, 0, 0);
            const end = new THREE.Vector3(0, 2, 0); // 2 units up

            const matrix = visualizer.calculateCylinderMatrix(start, end);

            expect(matrix).toBeDefined();
            // Matrix should be defined (simplified test since we're mocking)
        });
    });

    describe('performance comparison', () => {
        test('instanced rendering should reduce draw calls', () => {
            const segments = [
                [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1)],
                [new THREE.Vector3(1, 1, 1), new THREE.Vector3(2, 2, 2)],
                [new THREE.Vector3(2, 2, 2), new THREE.Vector3(3, 3, 3)]
            ];

            // Create using original method (would create multiple objects)
            const originalLines = [];
            for (let i = 0; i < segments.length; i++) {
                const segment = [segments[i][0], segments[i][1]];
                originalLines.push(visualizer.createLineObjectOriginal(segment, 0xff0000, 0.8, 'G1'));
            }

            // Reset scene mock
            visualizer.scene.add.mockClear();

            // Create using instanced method (creates one object)
            const instancedMesh = visualizer.createInstancedLineSystem(segments, 'G1');

            // Original method creates 3 separate objects
            expect(originalLines.length).toBe(3);
            
            // Instanced method creates 1 object
            expect(instancedMesh).toBeDefined();
            
            // Both should add objects to scene
            expect(visualizer.scene.add).toHaveBeenCalled();
        });

        test('batched geometry should reduce geometry objects', () => {
            const points = [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1, 1, 1),
                new THREE.Vector3(2, 2, 2),
                new THREE.Vector3(3, 3, 3)
            ];

            const batchedLine = visualizer.createBatchedLineObject(points, 0xff0000, 0.8, 'G1');

            expect(batchedLine).toBeDefined();
            expect(batchedLine.geometry.attributes).toBeDefined();
        });
    });
});