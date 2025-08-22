/**
 * @jest-environment jsdom
 */

// Mock Three.js classes for render queue testing
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

class MockMaterial {
    constructor(params) {
        this.color = params ? params.color : 0xffffff;
        this.transparent = params ? params.transparent : false;
        this.opacity = params ? params.opacity : 1.0;
        this.map = params ? params.map : null;
    }
    dispose() { }
}

class MockObject3D {
    constructor() {
        this.children = [];
        this.parent = null;
        this.visible = true;
        this.userData = {};
    }
    add(child) {
        this.children.push(child);
        child.parent = this;
    }
    remove(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parent = null;
        }
    }
}

class MockMesh extends MockObject3D {
    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.isMesh = true;
    }
}

class MockLineSegments extends MockObject3D {
    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.isLineSegments = true;
    }
}

class MockScene extends MockObject3D {
    constructor() {
        super();
        this.isScene = true;
    }
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

class MockWebGLRenderer {
    constructor() {
        this.domElement = { style: {} };
    }
    render() { }
    setClearColor() { }
    setPixelRatio() { }
    setSize() { }
    dispose() { }
}

// Mock Three.js globals
global.THREE = {
    Vector3: MockVector3,
    BufferGeometry: MockBufferGeometry,
    Material: MockMaterial,
    Mesh: MockMesh,
    LineSegments: MockLineSegments,
    Scene: MockScene,
    Box3: MockBox3,
    Sphere: MockSphere,
    WebGLRenderer: MockWebGLRenderer
};

// Create a test version of RenderQueue
class TestRenderQueue {
    constructor() {
        this.renderQueue = [];
        this.stateChanges = 0;
        this.drawCalls = 0;
    }

    // Sort objects by material/texture to minimize state changes
    sortRenderQueue(objects) {
        // In a real implementation, we would sort by:
        // 1. Shader program
        // 2. Material properties
        // 3. Textures
        // For testing, we'll just group by material type
        return objects.sort((a, b) => {
            // Simple sorting by material type
            const matA = a.material ? a.material.type || 'default' : 'none';
            const matB = b.material ? b.material.type || 'default' : 'none';
            return matA.localeCompare(matB);
        });
    }

    // Add objects to render queue
    addToQueue(objects) {
        this.renderQueue.push(...objects);
    }

    // Process the render queue to minimize state changes
    processQueue() {
        // Sort the queue to group similar objects
        this.renderQueue = this.sortRenderQueue(this.renderQueue);
        
        // Count state changes (simplified for testing)
        let lastMaterial = null;
        this.stateChanges = 0;
        
        for (const object of this.renderQueue) {
            if (object.material !== lastMaterial) {
                this.stateChanges++;
                lastMaterial = object.material;
            }
        }
        
        this.drawCalls = this.renderQueue.length;
        return this.renderQueue;
    }

    // Clear the render queue
    clear() {
        this.renderQueue = [];
        this.stateChanges = 0;
        this.drawCalls = 0;
    }

    // Get statistics
    getStats() {
        return {
            queueSize: this.renderQueue.length,
            stateChanges: this.stateChanges,
            drawCalls: this.drawCalls
        };
    }
}

// Create a test version of GcodeVisualizer with render queue optimization
class TestGcodeVisualizer {
    constructor() {
        this.scene = new THREE.Scene();
        this.renderQueue = new TestRenderQueue();
        this.optimizationSettings = {
            useRenderQueue: true
        };
    }

    // Original rendering without render queue optimization
    renderWithoutOptimization() {
        const objectsToRender = [];
        let stateChanges = 0;
        let lastMaterial = null;
        
        // Traverse scene without optimization
        this.scene.children.forEach(child => {
            if (child.visible) {
                objectsToRender.push(child);
                // Count state changes (inefficiently)
                if (child.material !== lastMaterial) {
                    stateChanges++;
                    lastMaterial = child.material;
                }
            }
        });
        
        return {
            objects: objectsToRender,
            stateChanges: stateChanges,
            drawCalls: objectsToRender.length
        };
    }

    // Optimized rendering with render queue
    renderWithOptimization() {
        // Clear previous queue
        this.renderQueue.clear();
        
        // Add visible objects to queue
        this.scene.children.forEach(child => {
            if (child.visible) {
                this.renderQueue.addToQueue([child]);
            }
        });
        
        // Process queue to minimize state changes
        const sortedObjects = this.renderQueue.processQueue();
        
        return {
            objects: sortedObjects,
            stateChanges: this.renderQueue.stateChanges,
            drawCalls: this.renderQueue.drawCalls,
            stats: this.renderQueue.getStats()
        };
    }
}

describe('Render Queue Optimization', () => {
    let visualizer;
    let renderQueue;

    beforeEach(() => {
        visualizer = new TestGcodeVisualizer();
        renderQueue = new TestRenderQueue();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('RenderQueue class', () => {
        test('should initialize with empty queue', () => {
            expect(renderQueue.renderQueue).toEqual([]);
            expect(renderQueue.stateChanges).toBe(0);
            expect(renderQueue.drawCalls).toBe(0);
        });

        test('should add objects to queue', () => {
            const objects = [
                new THREE.Mesh(new THREE.BufferGeometry(), new THREE.Material()),
                new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.Material())
            ];

            renderQueue.addToQueue(objects);
            expect(renderQueue.renderQueue).toEqual(objects);
            expect(renderQueue.getStats().queueSize).toBe(2);
        });

        test('should sort objects by material type', () => {
            // Create materials with different types
            const mat1 = new THREE.Material();
            mat1.type = 'ShaderMaterial';
            
            const mat2 = new THREE.Material();
            mat2.type = 'MeshBasicMaterial';
            
            const mat3 = new THREE.Material();
            mat3.type = 'ShaderMaterial'; // Same as mat1

            const objects = [
                new THREE.Mesh(new THREE.BufferGeometry(), mat1), // ShaderMaterial
                new THREE.Mesh(new THREE.BufferGeometry(), mat2), // MeshBasicMaterial
                new THREE.Mesh(new THREE.BufferGeometry(), mat3)  // ShaderMaterial
            ];

            const sorted = renderQueue.sortRenderQueue(objects);
            
            // Objects with same material type should be grouped
            expect(sorted[0].material.type).toBe('MeshBasicMaterial');
            expect(sorted[1].material.type).toBe('ShaderMaterial');
            expect(sorted[2].material.type).toBe('ShaderMaterial');
        });

        test('should process queue and count state changes', () => {
            // Create materials
            const mat1 = new THREE.Material();
            mat1.type = 'Material1';
            
            const mat2 = new THREE.Material();
            mat2.type = 'Material2';

            const objects = [
                new THREE.Mesh(new THREE.BufferGeometry(), mat1), // State change 1
                new THREE.Mesh(new THREE.BufferGeometry(), mat1), // No state change
                new THREE.Mesh(new THREE.BufferGeometry(), mat2), // State change 2
                new THREE.Mesh(new THREE.BufferGeometry(), mat1)  // State change 3
            ];

            renderQueue.addToQueue(objects);
            renderQueue.processQueue();

            // After sorting, the objects should be grouped by material:
            // mat1, mat1, mat1, mat2 (3 state changes)
            // OR mat2, mat1, mat1, mat1 (2 state changes)
            // The exact number depends on the sorting algorithm
            expect(renderQueue.stateChanges).toBeGreaterThanOrEqual(2);
            expect(renderQueue.stateChanges).toBeLessThanOrEqual(3);
            expect(renderQueue.drawCalls).toBe(4);
        });

        test('should clear queue', () => {
            const objects = [new THREE.Mesh(new THREE.BufferGeometry(), new THREE.Material())];
            renderQueue.addToQueue(objects);
            
            expect(renderQueue.renderQueue).toHaveLength(1);
            
            renderQueue.clear();
            
            expect(renderQueue.renderQueue).toEqual([]);
            expect(renderQueue.stateChanges).toBe(0);
            expect(renderQueue.drawCalls).toBe(0);
        });
    });

    describe('GcodeVisualizer integration', () => {
        test('should render without optimization', () => {
            // Add some objects to the scene
            const mat1 = new THREE.Material({ color: 0xff0000 });
            const mat2 = new THREE.Material({ color: 0x00ff00 });
            
            const mesh1 = new THREE.Mesh(new THREE.BufferGeometry(), mat1);
            const mesh2 = new THREE.Mesh(new THREE.BufferGeometry(), mat2);
            
            visualizer.scene.add(mesh1);
            visualizer.scene.add(mesh2);

            const result = visualizer.renderWithoutOptimization();
            
            expect(result.objects).toHaveLength(2);
            expect(result.drawCalls).toBe(2);
        });

        test('should render with optimization', () => {
            // Add some objects to the scene
            const mat1 = new THREE.Material({ color: 0xff0000 });
            const mat2 = new THREE.Material({ color: 0x00ff00 });
            
            const mesh1 = new THREE.Mesh(new THREE.BufferGeometry(), mat1);
            const mesh2 = new THREE.Mesh(new THREE.BufferGeometry(), mat2);
            
            visualizer.scene.add(mesh1);
            visualizer.scene.add(mesh2);

            const result = visualizer.renderWithOptimization();
            
            expect(result.objects).toHaveLength(2);
            expect(result.drawCalls).toBe(2);
            expect(result.stats.queueSize).toBe(2);
        });

        test('optimized rendering should reduce state changes', () => {
            // Add objects with different materials
            const mat1 = new THREE.Material({ color: 0xff0000 });
            mat1.type = 'Material1';
            
            const mat2 = new THREE.Material({ color: 0x00ff00 });
            mat2.type = 'Material2';
            
            const mat3 = new THREE.Material({ color: 0x0000ff });
            mat3.type = 'Material1'; // Same as mat1

            // Create objects in inefficient order
            const mesh1 = new THREE.Mesh(new THREE.BufferGeometry(), mat1); // Material1
            const mesh2 = new THREE.Mesh(new THREE.BufferGeometry(), mat2); // Material2
            const mesh3 = new THREE.Mesh(new THREE.BufferGeometry(), mat3); // Material1
            
            visualizer.scene.add(mesh1);
            visualizer.scene.add(mesh2);
            visualizer.scene.add(mesh3);

            // Without optimization - more state changes due to order
            const resultWithout = visualizer.renderWithoutOptimization();
            
            // With optimization - fewer state changes due to sorting
            const resultWith = visualizer.renderWithOptimization();
            
            // Both should render the same number of objects
            expect(resultWithout.drawCalls).toBe(resultWith.drawCalls);
            
            // Optimized version should have equal or fewer state changes
            expect(resultWith.stateChanges).toBeLessThanOrEqual(resultWithout.stateChanges);
        });
    });

    describe('performance comparison', () => {
        test('should show performance improvement with many objects', () => {
            // Create many objects with alternating materials
            const materials = [];
            for (let i = 0; i < 5; i++) {
                const mat = new THREE.Material({ color: i });
                mat.type = `Material${i}`;
                materials.push(mat);
            }
            
            // Add 100 objects with alternating materials (inefficient order)
            for (let i = 0; i < 100; i++) {
                const mat = materials[i % materials.length];
                const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat);
                visualizer.scene.add(mesh);
            }

            // Measure non-optimized rendering
            const startWithout = performance.now();
            const resultWithout = visualizer.renderWithoutOptimization();
            const timeWithout = performance.now() - startWithout;

            // Reset and measure optimized rendering
            const startWith = performance.now();
            const resultWith = visualizer.renderWithOptimization();
            const timeWith = performance.now() - startWith;

            // Both should handle the same number of objects
            expect(resultWithout.drawCalls).toBe(resultWith.drawCalls);
            expect(resultWithout.drawCalls).toBe(100);
            
            // Optimized version should have significantly fewer state changes
            expect(resultWith.stateChanges).toBeLessThan(resultWithout.stateChanges);
            
            // Log performance comparison (for manual verification)
            console.log(`Without optimization: ${resultWithout.stateChanges} state changes in ${timeWithout}ms`);
            console.log(`With optimization: ${resultWith.stateChanges} state changes in ${timeWith}ms`);
        });
    });
});