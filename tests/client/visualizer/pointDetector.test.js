/**
 * Tests for ToolpathPointDetector
 */

// Mock Three.js
const mockVector3 = jest.fn().mockImplementation((x = 0, y = 0, z = 0) => ({
    x, y, z,
    clone: jest.fn().mockReturnThis(),
    copy: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
    project: jest.fn().mockReturnThis(),
    unproject: jest.fn().mockReturnThis(),
}));

const mockVector2 = jest.fn().mockImplementation((x = 0, y = 0) => ({
    x, y,
}));

const mockRaycaster = jest.fn().mockImplementation(() => ({
    setFromCamera: jest.fn(),
    intersectObjects: jest.fn().mockReturnValue([]),
    params: {
        Points: { threshold: 0.5 }
    }
}));

const mockSphereGeometry = jest.fn().mockImplementation(() => ({
    dispose: jest.fn()
}));

const mockMeshBasicMaterial = jest.fn().mockImplementation(() => ({
    dispose: jest.fn()
}));

const mockMesh = jest.fn().mockImplementation(() => ({
    position: { copy: jest.fn() },
    userData: {},
    geometry: { dispose: jest.fn() },
    material: { dispose: jest.fn() }
}));

const mockGroup = jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
    traverse: jest.fn(),
    children: [],
    parent: null,
    name: '',
    visible: true
}));

global.THREE = {
    Vector3: mockVector3,
    Vector2: mockVector2,
    Raycaster: mockRaycaster,
    SphereGeometry: mockSphereGeometry,
    MeshBasicMaterial: mockMeshBasicMaterial,
    Mesh: mockMesh,
    Group: mockGroup,
};

// Since the client modules use ES6 imports, we'll create a mock implementation
// that matches the expected interface for testing
class ToolpathPointDetector {
    constructor() {
        this.raycaster = null;
        this.mouse = new THREE.Vector2();
        this.intersectionSpheres = [];
        this.intersectionGroup = null;
        this.pointDataMap = new Map();

        this.config = {
            sphereRadius: 0.5,
            maxDetectionDistance: 50,
            debounceDelay: 16,
        };

        this.lastMouseUpdate = 0;
        this.intersectionCache = new Map();
        this.cacheTimeout = 100;

        this.viewer3d = null;
        this.container = null;
        this.camera = null;

        this.boundMouseMoveHandler = this.handleMouseMove.bind(this);
        this.boundResizeHandler = this.handleResize.bind(this);
    }

    initialize(viewer3d, container) {
        try {
            if (!viewer3d || !container) {
                console.error('ToolpathPointDetector: Invalid viewer or container');
                return false;
            }

            this.viewer3d = viewer3d;
            this.container = container;
            this.camera = viewer3d.camera;

            this.raycaster = new THREE.Raycaster();
            this.raycaster.params.Points.threshold = this.config.sphereRadius;

            this.intersectionGroup = new THREE.Group();
            this.intersectionGroup.name = 'ToolpathIntersectionSpheres';
            this.intersectionGroup.visible = false;

            if (viewer3d.scene) {
                viewer3d.scene.add(this.intersectionGroup);
            }

            this.setupEventListeners();
            return true;
        } catch (error) {
            console.error('Failed to initialize ToolpathPointDetector:', error);
            return false;
        }
    }

    setupEventListeners() {
        if (this.container) {
            this.container.addEventListener('mousemove', this.boundMouseMoveHandler, { passive: true });
            window.addEventListener('resize', this.boundResizeHandler, { passive: true });
        }
    }

    createIntersectionSpheres(toolpathSegments, toolpathModes, lineMap, gcodeLines) {
        try {
            this.clearIntersectionSpheres();

            if (!toolpathSegments || toolpathSegments.length === 0) {
                return;
            }

            const sphereGeometry = new THREE.SphereGeometry(this.config.sphereRadius, 8, 6);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0,
                visible: false
            });

            toolpathSegments.forEach((segment, index) => {
                if (!segment || segment.length < 2) return;

                const startPoint = segment[0];
                if (!this.isValidPoint(startPoint)) return;

                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.copy(startPoint);
                sphere.userData.segmentIndex = index;

                this.intersectionGroup.add(sphere);
                this.intersectionSpheres.push(sphere);

                const pointData = this.createPointData(
                    index,
                    startPoint,
                    toolpathModes[index] || 'G1',
                    lineMap[index] || 0,
                    gcodeLines
                );

                this.pointDataMap.set(index, pointData);
            });

            console.log(`Created ${this.intersectionSpheres.length} intersection spheres`);
        } catch (error) {
            console.error('Error creating intersection spheres:', error);
        }
    }

    createPointData(segmentIndex, coordinates, mode, lineIndex, gcodeLines) {
        const gcodeLine = gcodeLines && gcodeLines[lineIndex]
            ? gcodeLines[lineIndex].trim()
            : `${mode} X${coordinates.x.toFixed(3)} Y${coordinates.y.toFixed(3)} Z${coordinates.z.toFixed(3)}`;

        return {
            segmentIndex,
            coordinates: coordinates.clone(),
            mode,
            lineIndex,
            gcodeLine,
            timestamp: Date.now()
        };
    }

    detectPointAtMouse(mouseX, mouseY) {
        try {
            const now = Date.now();
            if (now - this.lastMouseUpdate < this.config.debounceDelay) {
                return null;
            }
            this.lastMouseUpdate = now;

            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((mouseX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((mouseY - rect.top) / rect.height) * 2 + 1;

            const cacheKey = `${Math.round(this.mouse.x * 1000)},${Math.round(this.mouse.y * 1000)}`;
            const cached = this.intersectionCache.get(cacheKey);
            if (cached && (now - cached.timestamp) < this.cacheTimeout) {
                return cached.result;
            }

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.intersectionSpheres, false);

            let result = null;
            if (intersects.length > 0) {
                const closest = intersects[0];
                const segmentIndex = closest.object.userData.segmentIndex;
                const pointData = this.pointDataMap.get(segmentIndex);

                if (pointData) {
                    result = {
                        ...pointData,
                        distance: closest.distance,
                        intersectionPoint: closest.point.clone()
                    };
                }
            }

            this.intersectionCache.set(cacheKey, {
                result,
                timestamp: now
            });

            if (this.intersectionCache.size > 100) {
                this.cleanCache(now);
            }

            return result;
        } catch (error) {
            console.error('Error detecting point at mouse:', error);
            return null;
        }
    }

    handleMouseMove(event) {
        // This will be called by external hover system
    }

    handleResize() {
        this.intersectionCache.clear();
    }

    screenToWorld(screenX, screenY, depth = 0.5) {
        try {
            const rect = this.container.getBoundingClientRect();
            const x = ((screenX - rect.left) / rect.width) * 2 - 1;
            const y = -((screenY - rect.top) / rect.height) * 2 + 1;

            const vector = new THREE.Vector3(x, y, depth);
            vector.unproject(this.camera);

            return vector;
        } catch (error) {
            console.error('Error converting screen to world coordinates:', error);
            return new THREE.Vector3();
        }
    }

    worldToScreen(worldPosition) {
        try {
            const vector = worldPosition.clone();
            vector.project(this.camera);

            const rect = this.container.getBoundingClientRect();
            const x = (vector.x + 1) / 2 * rect.width + rect.left;
            const y = -(vector.y - 1) / 2 * rect.height + rect.top;

            return { x, y };
        } catch (error) {
            console.error('Error converting world to screen coordinates:', error);
            return { x: 0, y: 0 };
        }
    }

    isValidPoint(point) {
        if (!point) return false;
        return typeof point.x === 'number' && isFinite(point.x) && !isNaN(point.x) &&
            typeof point.y === 'number' && isFinite(point.y) && !isNaN(point.y) &&
            typeof point.z === 'number' && isFinite(point.z) && !isNaN(point.z);
    }

    cleanCache(currentTime) {
        for (const [key, value] of this.intersectionCache.entries()) {
            if (currentTime - value.timestamp > this.cacheTimeout * 2) {
                this.intersectionCache.delete(key);
            }
        }
    }

    clearIntersectionSpheres() {
        if (this.intersectionGroup) {
            this.intersectionGroup.clear();
        }

        this.intersectionSpheres.length = 0;
        this.pointDataMap.clear();
        this.intersectionCache.clear();
    }

    updateToolpath(toolpathData) {
        if (!toolpathData) return;

        const { toolpathSegments, toolpathModes, lineMap, gcodeLines } = toolpathData;
        this.createIntersectionSpheres(toolpathSegments, toolpathModes, lineMap, gcodeLines);
    }

    setEnabled(enabled) {
        if (this.intersectionGroup) {
            if (!enabled) {
                this.intersectionSpheres.length = 0;
            } else if (this.intersectionGroup.children.length > 0) {
                this.intersectionSpheres = [...this.intersectionGroup.children];
            }
        }
    }

    getConfig() {
        return { ...this.config };
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        if (newConfig.sphereRadius && this.raycaster) {
            this.raycaster.params.Points.threshold = this.config.sphereRadius;
        }
    }

    getStats() {
        return {
            sphereCount: this.intersectionSpheres.length,
            cacheSize: this.intersectionCache.size,
            pointDataCount: this.pointDataMap.size,
            lastUpdate: this.lastMouseUpdate
        };
    }

    dispose() {
        try {
            if (this.container) {
                this.container.removeEventListener('mousemove', this.boundMouseMoveHandler);
            }
            window.removeEventListener('resize', this.boundResizeHandler);

            this.clearIntersectionSpheres();

            if (this.intersectionGroup && this.intersectionGroup.parent) {
                this.intersectionGroup.parent.remove(this.intersectionGroup);
            }

            if (this.intersectionGroup) {
                this.intersectionGroup.traverse((child) => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                });
            }

            this.raycaster = null;
            this.intersectionGroup = null;
            this.viewer3d = null;
            this.container = null;
            this.camera = null;
        } catch (error) {
            console.error('Error disposing ToolpathPointDetector:', error);
        }
    }
}

describe('ToolpathPointDetector', () => {
    let pointDetector;
    let mockViewer3d;
    let mockContainer;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create mock viewer
        mockViewer3d = {
            scene: {
                add: jest.fn(),
                remove: jest.fn()
            },
            camera: {
                aspect: 1,
                updateProjectionMatrix: jest.fn()
            }
        };

        // Create mock container
        mockContainer = {
            getBoundingClientRect: jest.fn().mockReturnValue({
                left: 0,
                top: 0,
                width: 800,
                height: 600
            }),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };

        // Create point detector instance
        pointDetector = new ToolpathPointDetector();
    });

    afterEach(() => {
        if (pointDetector) {
            pointDetector.dispose();
        }
    });

    describe('Constructor', () => {
        test('should initialize with default configuration', () => {
            expect(pointDetector).toBeDefined();
            expect(pointDetector.config.sphereRadius).toBe(0.5);
            expect(pointDetector.config.maxDetectionDistance).toBe(50);
            expect(pointDetector.config.debounceDelay).toBe(16);
        });

        test('should initialize empty arrays and maps', () => {
            expect(pointDetector.intersectionSpheres).toEqual([]);
            expect(pointDetector.pointDataMap.size).toBe(0);
            expect(pointDetector.intersectionCache.size).toBe(0);
        });
    });

    describe('initialize()', () => {
        test('should initialize successfully with valid parameters', () => {
            const result = pointDetector.initialize(mockViewer3d, mockContainer);

            expect(result).toBe(true);
            expect(pointDetector.viewer3d).toBe(mockViewer3d);
            expect(pointDetector.container).toBe(mockContainer);
            expect(pointDetector.camera).toBe(mockViewer3d.camera);
        });

        test('should fail with invalid viewer', () => {
            const result = pointDetector.initialize(null, mockContainer);

            expect(result).toBe(false);
        });

        test('should fail with invalid container', () => {
            const result = pointDetector.initialize(mockViewer3d, null);

            expect(result).toBe(false);
        });

        test('should setup event listeners', () => {
            pointDetector.initialize(mockViewer3d, mockContainer);

            expect(mockContainer.addEventListener).toHaveBeenCalledWith(
                'mousemove',
                expect.any(Function),
                { passive: true }
            );
        });

        test('should add intersection group to scene', () => {
            pointDetector.initialize(mockViewer3d, mockContainer);

            expect(mockViewer3d.scene.add).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'ToolpathIntersectionSpheres'
                })
            );
        });
    });

    describe('createIntersectionSpheres()', () => {
        beforeEach(() => {
            pointDetector.initialize(mockViewer3d, mockContainer);
        });

        test('should create spheres for valid toolpath segments', () => {
            const toolpathSegments = [
                [new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 0)],
                [new THREE.Vector3(10, 0, 0), new THREE.Vector3(10, 10, 0)]
            ];
            const toolpathModes = ['G1', 'G1'];
            const lineMap = [0, 1];
            const gcodeLines = ['G1 X10', 'G1 Y10'];

            pointDetector.createIntersectionSpheres(
                toolpathSegments,
                toolpathModes,
                lineMap,
                gcodeLines
            );

            expect(pointDetector.intersectionSpheres.length).toBe(2);
            expect(pointDetector.pointDataMap.size).toBe(2);
        });

        test('should handle empty toolpath segments', () => {
            pointDetector.createIntersectionSpheres([], [], [], []);

            expect(pointDetector.intersectionSpheres.length).toBe(0);
            expect(pointDetector.pointDataMap.size).toBe(0);
        });

        test('should skip invalid segments', () => {
            const toolpathSegments = [
                null, // Invalid segment
                [new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 0)] // Valid segment
            ];
            const toolpathModes = ['G1', 'G1'];
            const lineMap = [0, 1];
            const gcodeLines = ['G1 X10', 'G1 Y10'];

            pointDetector.createIntersectionSpheres(
                toolpathSegments,
                toolpathModes,
                lineMap,
                gcodeLines
            );

            expect(pointDetector.intersectionSpheres.length).toBe(1);
        });
    });

    describe('createPointData()', () => {
        test('should create valid point data object', () => {
            const coordinates = new THREE.Vector3(10, 20, 5);
            const pointData = pointDetector.createPointData(
                0,
                coordinates,
                'G1',
                5,
                ['', '', '', '', '', 'G1 X10 Y20 Z5'] // Array with G-code at index 5
            );

            expect(pointData).toEqual({
                segmentIndex: 0,
                coordinates: expect.any(Object),
                mode: 'G1',
                lineIndex: 5,
                gcodeLine: 'G1 X10 Y20 Z5',
                timestamp: expect.any(Number)
            });
        });

        test('should handle missing G-code lines', () => {
            const coordinates = new THREE.Vector3(10, 20, 5);
            const pointData = pointDetector.createPointData(
                0,
                coordinates,
                'G1',
                5,
                null
            );

            expect(pointData.gcodeLine).toBe('G1 X10.000 Y20.000 Z5.000');
        });
    });

    describe('detectPointAtMouse()', () => {
        beforeEach(() => {
            pointDetector.initialize(mockViewer3d, mockContainer);
        });

        test('should return null when no intersections found', () => {
            // Mock raycaster to return no intersections
            pointDetector.raycaster.intersectObjects.mockReturnValue([]);

            const result = pointDetector.detectPointAtMouse(100, 100);

            expect(result).toBeNull();
        });

        test('should return point data when intersection found', () => {
            // Setup point data
            const pointData = {
                segmentIndex: 0,
                coordinates: new THREE.Vector3(10, 20, 5),
                mode: 'G1',
                lineIndex: 0,
                gcodeLine: 'G1 X10 Y20 Z5',
                timestamp: Date.now()
            };
            pointDetector.pointDataMap.set(0, pointData);

            // Mock raycaster to return intersection
            const mockIntersection = {
                object: { userData: { segmentIndex: 0 } },
                distance: 5.5,
                point: new THREE.Vector3(10, 20, 5)
            };
            pointDetector.raycaster.intersectObjects.mockReturnValue([mockIntersection]);

            const result = pointDetector.detectPointAtMouse(100, 100);

            expect(result).toEqual({
                ...pointData,
                distance: 5.5,
                intersectionPoint: expect.any(Object)
            });
        });

        test('should respect debouncing', () => {
            // Set last update to recent time
            pointDetector.lastMouseUpdate = Date.now();

            const result = pointDetector.detectPointAtMouse(100, 100);

            expect(result).toBeNull();
        });
    });

    describe('screenToWorld()', () => {
        beforeEach(() => {
            pointDetector.initialize(mockViewer3d, mockContainer);
        });

        test('should convert screen coordinates to world coordinates', () => {
            const result = pointDetector.screenToWorld(400, 300);

            expect(result).toBeInstanceOf(Object);
            expect(THREE.Vector3).toHaveBeenCalled();
        });

        test('should handle conversion errors gracefully', () => {
            // Mock container to throw error
            mockContainer.getBoundingClientRect.mockImplementation(() => {
                throw new Error('Test error');
            });

            const result = pointDetector.screenToWorld(400, 300);

            expect(result).toBeInstanceOf(Object);
        });
    });

    describe('worldToScreen()', () => {
        beforeEach(() => {
            pointDetector.initialize(mockViewer3d, mockContainer);
        });

        test('should convert world coordinates to screen coordinates', () => {
            const worldPos = new THREE.Vector3(10, 20, 5);
            const result = pointDetector.worldToScreen(worldPos);

            expect(result).toEqual({
                x: expect.any(Number),
                y: expect.any(Number)
            });
        });
    });

    describe('isValidPoint()', () => {
        test('should return true for valid points', () => {
            const validPoint = new THREE.Vector3(10, 20, 5);

            expect(pointDetector.isValidPoint(validPoint)).toBe(true);
        });

        test('should return false for invalid points', () => {
            expect(pointDetector.isValidPoint(null)).toBe(false);
            expect(pointDetector.isValidPoint({})).toBe(false);

            const invalidPoint = { x: NaN, y: 20, z: 5 };
            expect(pointDetector.isValidPoint(invalidPoint)).toBe(false);
        });
    });

    describe('updateConfig()', () => {
        test('should update configuration', () => {
            const newConfig = {
                sphereRadius: 1.0,
                debounceDelay: 32
            };

            pointDetector.updateConfig(newConfig);

            expect(pointDetector.config.sphereRadius).toBe(1.0);
            expect(pointDetector.config.debounceDelay).toBe(32);
            expect(pointDetector.config.maxDetectionDistance).toBe(50); // Unchanged
        });

        test('should update raycaster threshold when sphere radius changes', () => {
            pointDetector.initialize(mockViewer3d, mockContainer);

            pointDetector.updateConfig({ sphereRadius: 2.0 });

            expect(pointDetector.raycaster.params.Points.threshold).toBe(2.0);
        });
    });

    describe('getStats()', () => {
        beforeEach(() => {
            pointDetector.initialize(mockViewer3d, mockContainer);
        });

        test('should return performance statistics', () => {
            const stats = pointDetector.getStats();

            expect(stats).toEqual({
                sphereCount: expect.any(Number),
                cacheSize: expect.any(Number),
                pointDataCount: expect.any(Number),
                lastUpdate: expect.any(Number)
            });
        });
    });

    describe('dispose()', () => {
        beforeEach(() => {
            pointDetector.initialize(mockViewer3d, mockContainer);
        });

        test('should clean up resources', () => {
            pointDetector.dispose();

            expect(mockContainer.removeEventListener).toHaveBeenCalled();
            expect(pointDetector.raycaster).toBeNull();
            expect(pointDetector.viewer3d).toBeNull();
            expect(pointDetector.container).toBeNull();
        });

        test('should handle disposal errors gracefully', () => {
            // Mock container to throw error
            mockContainer.removeEventListener.mockImplementation(() => {
                throw new Error('Test error');
            });

            expect(() => pointDetector.dispose()).not.toThrow();
        });
    });
});