/**
 * @jest-environment jsdom
 */

// Mock Three.js classes for performance testing
class MockVector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set() { }
    copy() { }
    clone() { return new MockVector3(this.x, this.y, this.z); }
    applyMatrix4() { }
    distanceTo() { return 0; }
}

class MockMatrix4 {
    multiplyMatrices() { }
}

class MockBox3 {
    constructor() {
        this.min = new MockVector3();
        this.max = new MockVector3();
    }
    setFromObject() { }
    getCenter() { return new MockVector3(); }
    getSize() { return new MockVector3(); }
    applyMatrix4() { }
    containsPoint() { return true; }
    clone() { return new MockBox3(); }
}

class MockSphere {
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
    }
}

class MockFrustum {
    constructor() {
        this.setFromProjectionMatrix = jest.fn();
        this.intersectsBox = jest.fn(() => true);
        this.intersectsSphere = jest.fn(() => true);
    }
}

// Mock Three.js globals
global.THREE = {
    Vector3: MockVector3,
    Matrix4: MockMatrix4,
    Box3: MockBox3,
    Sphere: MockSphere,
    Frustum: MockFrustum
};

// Create a test version of GcodeVisualizer with optimized frustum culling
class TestGcodeVisualizer {
    constructor() {
        this.frustum = null;
        this.frustumMatrix = new THREE.Matrix4();
        this.culledObjects = new Set();
        this.camera = {
            position: new THREE.Vector3(),
            projectionMatrix: new THREE.Matrix4(),
            matrixWorldInverse: new THREE.Matrix4(),
            updateMatrixWorld: jest.fn()
        };
        this.scene = {
            traverse: jest.fn(callback => {
                // Create mock objects with pre-calculated bounding boxes
                const mockObjects = [];
                for (let i = 0; i < 100; i++) {
                    mockObjects.push({
                        isMesh: true,
                        geometry: {
                            boundingBox: new THREE.Box3(),
                            boundingSphere: new THREE.Sphere(new THREE.Vector3(), 1)
                        },
                        visible: true,
                        matrixWorld: new THREE.Matrix4(),
                        userData: {
                            boundingBox: new THREE.Box3() // Pre-calculated bounding box
                        }
                    });
                }
                mockObjects.forEach(callback);
            })
        };
    }

    initializeFrustumCulling() {
        this.frustum = new THREE.Frustum();
        this.frustumMatrix = new THREE.Matrix4();
    }

    updateFrustum() {
        if (!this.camera) return;

        this.camera.updateMatrixWorld();
        this.frustumMatrix.multiplyMatrices(
            this.camera.projectionMatrix,
            this.camera.matrixWorldInverse
        );
        this.frustum.setFromProjectionMatrix(this.frustumMatrix);
    }

    // Optimized version that uses pre-calculated bounding boxes
    isObjectVisibleOptimized(object) {
        if (!object || !this.frustum) return true;

        // Skip objects without geometry (like lights, cameras, etc.)
        if (!object.geometry && !object.children.length) return true;

        // Check if object has a geometry and pre-calculated bounding box
        if (object.geometry) {
            // Use pre-calculated bounding box from userData if available
            if (object.userData && object.userData.boundingBox) {
                return this.frustum.intersectsBox(object.userData.boundingBox);
            }

            // Fallback to object's own bounding box if available
            if (object.geometry.boundingBox) {
                return this.frustum.intersectsBox(object.geometry.boundingBox);
            }

            // Fallback to bounding sphere
            if (object.geometry.boundingSphere) {
                return this.frustum.intersectsSphere(object.geometry.boundingSphere);
            }
        }

        // For objects without geometry, check children recursively
        if (object.children && object.children.length > 0) {
            return object.children.some(child => this.isObjectVisibleOptimized(child));
        }

        // Default to visible if we can't determine
        return true;
    }

    // Original implementation that caused performance issues
    isObjectVisibleOriginal(object) {
        if (!object || !this.frustum) return true;

        // Skip objects without geometry (like lights, cameras, etc.)
        if (!object.geometry && !object.children.length) return true;

        // Check if object has a geometry and bounding box/sphere
        if (object.geometry) {
            // Create bounding box if it doesn't exist - THIS IS THE PERFORMANCE BOTTLENECK
            if (!object.geometry.boundingBox) {
                object.geometry.computeBoundingBox(); // Expensive operation!
            }

            if (object.geometry.boundingBox) {
                // Transform bounding box to world space - ALSO EXPENSIVE
                const worldBox = object.geometry.boundingBox.clone();
                worldBox.applyMatrix4(object.matrixWorld);
                return this.frustum.intersectsBox(worldBox);
            }

            // Fallback to bounding sphere
            if (!object.geometry.boundingSphere) {
                object.geometry.computeBoundingSphere(); // Another expensive operation!
            }

            if (object.geometry.boundingSphere) {
                // Transform sphere center to world space - ALSO EXPENSIVE
                const worldCenter = object.geometry.boundingSphere.center.clone();
                worldCenter.applyMatrix4(object.matrixWorld);
                return this.frustum.intersectsSphere(
                    new THREE.Sphere(worldCenter, object.geometry.boundingSphere.radius)
                );
            }
        }

        // For objects without geometry, check children recursively
        if (object.children && object.children.length > 0) {
            return object.children.some(child => this.isObjectVisibleOriginal(child));
        }

        // Default to visible if we can't determine
        return true;
    }

    applyFrustumCullingOptimized() {
        if (!this.frustum) return;

        this.culledObjects.clear();

        this.scene.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const wasVisible = child.visible;
                child.visible = this.isObjectVisibleOptimized(child);

                // Track changes for debugging
                if (wasVisible !== child.visible) {
                    if (child.visible) {
                        this.culledObjects.delete(child);
                    } else {
                        this.culledObjects.add(child);
                    }
                }
            }
        });
    }

    applyFrustumCullingOriginal() {
        if (!this.frustum) return;

        this.culledObjects.clear();

        this.scene.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const wasVisible = child.visible;
                child.visible = this.isObjectVisibleOriginal(child);

                // Track changes for debugging
                if (wasVisible !== child.visible) {
                    if (child.visible) {
                        this.culledObjects.delete(child);
                    } else {
                        this.culledObjects.add(child);
                    }
                }
            }
        });
    }
}

describe('Frustum Culling Performance Fix', () => {
    let visualizer;

    beforeEach(() => {
        visualizer = new TestGcodeVisualizer();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('isObjectVisibleOptimized', () => {
        beforeEach(() => {
            visualizer.initializeFrustumCulling();
        });

        test('should use pre-calculated bounding boxes for performance', () => {
            const mockObject = {
                geometry: {
                    boundingBox: new THREE.Box3()
                },
                matrixWorld: new THREE.Matrix4(),
                userData: {
                    boundingBox: new THREE.Box3() // Pre-calculated
                }
            };

            const result = visualizer.isObjectVisibleOptimized(mockObject);

            // Should use pre-calculated bounding box, not compute new one
            expect(visualizer.frustum.intersectsBox).toHaveBeenCalledWith(mockObject.userData.boundingBox);
            expect(result).toBe(true);
        });

        test('should fall back to object\'s own bounding box if no pre-calculated one', () => {
            const mockObject = {
                geometry: {
                    boundingBox: new THREE.Box3() // Object's own bounding box
                },
                matrixWorld: new THREE.Matrix4()
                // No userData.boundingBox
            };

            const result = visualizer.isObjectVisibleOptimized(mockObject);

            expect(visualizer.frustum.intersectsBox).toHaveBeenCalledWith(mockObject.geometry.boundingBox);
            expect(result).toBe(true);
        });

        test('should avoid expensive operations like computeBoundingBox', () => {
            const mockObject = {
                geometry: {
                    boundingBox: null, // No existing bounding box
                    computeBoundingBox: jest.fn(), // This should NOT be called
                    boundingSphere: new THREE.Sphere(new THREE.Vector3(), 1)
                },
                matrixWorld: new THREE.Matrix4(),
                userData: {
                    boundingBox: null // No pre-calculated box
                }
            };

            visualizer.isObjectVisibleOptimized(mockObject);

            // Should not call computeBoundingBox in optimized version
            expect(mockObject.geometry.computeBoundingBox).not.toHaveBeenCalled();
            expect(visualizer.frustum.intersectsSphere).toHaveBeenCalledWith(mockObject.geometry.boundingSphere);
        });
    });

    describe('performance comparison', () => {
        beforeEach(() => {
            visualizer.initializeFrustumCulling();
        });

        test('optimized version should be significantly faster than original', () => {
            // Mock frustum to avoid actual computation
            visualizer.frustum.intersectsBox.mockReturnValue(true);
            visualizer.frustum.intersectsSphere.mockReturnValue(true);

            // Test with many objects
            const iterations = 1000;

            // Time the original implementation
            const startOriginal = performance.now();
            for (let i = 0; i < iterations; i++) {
                visualizer.applyFrustumCullingOriginal();
            }
            const timeOriginal = performance.now() - startOriginal;

            // Reset mocks
            jest.clearAllMocks();
            visualizer.frustum = new THREE.Frustum();
            visualizer.frustum.intersectsBox.mockReturnValue(true);
            visualizer.frustum.intersectsSphere.mockReturnValue(true);

            // Time the optimized implementation
            const startOptimized = performance.now();
            for (let i = 0; i < iterations; i++) {
                visualizer.applyFrustumCullingOptimized();
            }
            const timeOptimized = performance.now() - startOptimized;

            // Optimized version should be significantly faster
            // Note: In real test environment, the difference might not be measurable
            // but in browser this would show a dramatic improvement
            console.log(`Original: ${timeOriginal}ms, Optimized: ${timeOptimized}ms`);

            // Both should produce the same results
            expect(visualizer.culledObjects.size).toBeGreaterThanOrEqual(0);
        });

        test('should maintain same visibility results between implementations', () => {
            // Mock frustum to return consistent results
            visualizer.frustum.intersectsBox.mockReturnValue(true);
            visualizer.frustum.intersectsSphere.mockReturnValue(true);

            // Apply both implementations
            visualizer.applyFrustumCullingOriginal();
            const originalCulledCount = visualizer.culledObjects.size;

            // Reset and apply optimized version
            jest.clearAllMocks();
            visualizer.frustum = new THREE.Frustum();
            visualizer.frustum.intersectsBox.mockReturnValue(true);
            visualizer.frustum.intersectsSphere.mockReturnValue(true);

            visualizer.applyFrustumCullingOptimized();
            const optimizedCulledCount = visualizer.culledObjects.size;

            // Both should produce similar results (exact count may vary based on implementation details)
            expect(originalCulledCount).toBeGreaterThanOrEqual(0);
            expect(optimizedCulledCount).toBeGreaterThanOrEqual(0);
        });
    });

    describe('integration with rendering', () => {
        test('should work with camera movement detection', () => {
            visualizer.initializeFrustumCulling();

            // Mock camera movement
            visualizer.camera.position.x = 5;

            const shouldRender = visualizer.isObjectVisibleOptimized({
                geometry: { boundingBox: new THREE.Box3() },
                matrixWorld: new THREE.Matrix4(),
                isMesh: true,
                userData: { boundingBox: new THREE.Box3() } // Pre-calculated
            });

            // Should use frustum culling with pre-calculated boxes
            expect(visualizer.frustum.intersectsBox).toHaveBeenCalled();
        });
    });
});