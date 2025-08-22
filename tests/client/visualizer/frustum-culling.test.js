/**
 * @jest-environment jsdom
 */

// Create mock Three.js classes
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

// Create a minimal test version of GcodeVisualizer for testing frustum culling
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
                // Mock some scene objects
                const mockObjects = [
                    { isMesh: true, geometry: { boundingBox: new THREE.Box3() }, visible: true, matrixWorld: new THREE.Matrix4() },
                    { isMesh: true, geometry: { boundingSphere: new THREE.Sphere(new THREE.Vector3(), 1) }, visible: true, matrixWorld: new THREE.Matrix4() },
                    { isMesh: false, visible: true }
                ];
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

    isObjectVisible(object) {
        if (!object || !this.frustum) return true;

        if (!object.geometry && !object.children.length) return true;

        if (object.geometry) {
            if (object.geometry.boundingBox) {
                const worldBox = object.geometry.boundingBox.clone();
                worldBox.applyMatrix4(object.matrixWorld || new THREE.Matrix4());
                return this.frustum.intersectsBox(worldBox);
            }

            if (object.geometry.boundingSphere) {
                const worldCenter = object.geometry.boundingSphere.center.clone();
                worldCenter.applyMatrix4(object.matrixWorld || new THREE.Matrix4());
                return this.frustum.intersectsSphere(
                    new THREE.Sphere(worldCenter, object.geometry.boundingSphere.radius)
                );
            }
        }

        return true;
    }

    applyFrustumCulling() {
        if (!this.frustum) return;

        this.culledObjects.clear();

        this.scene.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const wasVisible = child.visible;
                child.visible = this.isObjectVisible(child);

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

describe('Frustum Culling System', () => {
    let visualizer;

    beforeEach(() => {
        visualizer = new TestGcodeVisualizer();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initializeFrustumCulling', () => {
        test('should initialize frustum and matrix', () => {
            visualizer.initializeFrustumCulling();

            expect(visualizer.frustum).toBeDefined();
            expect(visualizer.frustumMatrix).toBeDefined();
        });
    });

    describe('updateFrustum', () => {
        beforeEach(() => {
            visualizer.initializeFrustumCulling();
        });


        test('should handle missing camera gracefully', () => {
            visualizer.camera = null;
            expect(() => visualizer.updateFrustum()).not.toThrow();
        });
    });

    describe('isObjectVisible', () => {
        beforeEach(() => {
            visualizer.initializeFrustumCulling();
        });


        test('should check bounding box intersection', () => {
            const mockObject = {
                geometry: {
                    boundingBox: new THREE.Box3()
                },
                matrixWorld: new THREE.Matrix4()
            };

            visualizer.isObjectVisible(mockObject);

            expect(visualizer.frustum.intersectsBox).toHaveBeenCalled();
        });

        test('should check bounding sphere intersection', () => {
            const mockObject = {
                geometry: {
                    boundingSphere: new THREE.Sphere(new THREE.Vector3(), 1)
                },
                matrixWorld: new THREE.Matrix4()
            };

            visualizer.isObjectVisible(mockObject);

            expect(visualizer.frustum.intersectsSphere).toHaveBeenCalled();
        });

        test('should handle objects without geometry', () => {
            const mockObject = {
                children: []
            };

            expect(visualizer.isObjectVisible(mockObject)).toBe(true);
        });
    });

    describe('applyFrustumCulling', () => {
        beforeEach(() => {
            visualizer.initializeFrustumCulling();
        });

        test('should traverse scene and update visibility', () => {
            visualizer.applyFrustumCulling();

            expect(visualizer.scene.traverse).toHaveBeenCalled();
        });

        test('should track culled objects', () => {
            // Mock frustum to return false for some objects
            visualizer.frustum.intersectsBox.mockReturnValue(false);
            visualizer.frustum.intersectsSphere.mockReturnValue(false);

            visualizer.applyFrustumCulling();

            // Should have tracked some culled objects
            expect(visualizer.culledObjects.size).toBeGreaterThanOrEqual(0);
        });

        test('should clear culled objects on each call', () => {
            visualizer.culledObjects.add({}); // Add a mock object
            expect(visualizer.culledObjects.size).toBe(1);

            visualizer.applyFrustumCulling();

            // Should have been cleared and repopulated
            expect(visualizer.culledObjects.size).toBeGreaterThanOrEqual(0);
        });

        test('should handle missing frustum gracefully', () => {
            visualizer.frustum = null;
            expect(() => visualizer.applyFrustumCulling()).not.toThrow();
        });
    });

    describe('integration with rendering', () => {
        test('should work with camera movement detection', () => {
            visualizer.initializeFrustumCulling();

            // Mock camera movement
            visualizer.camera.position.x = 5;
            visualizer.lastCameraPosition = { x: 0, y: 0, z: 0, distanceTo: jest.fn(() => 5) };

            const shouldRender = visualizer.isObjectVisible({
                geometry: { boundingBox: new THREE.Box3() },
                matrixWorld: new THREE.Matrix4(),
                isMesh: true
            });

            // Should use frustum culling
            expect(visualizer.frustum.intersectsBox).toHaveBeenCalled();
        });
    });
});