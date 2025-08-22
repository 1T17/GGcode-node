/**
 * @jest-environment jsdom
 */

// Mock performance.now
const mockPerformance = {
    now: jest.fn(() => 1000)
};
Object.defineProperty(window, 'performance', {
    value: mockPerformance,
    writable: true
});

// Create a minimal test version of GcodeVisualizer for testing adaptive rendering
class TestGcodeVisualizer {
    constructor() {
        this.adaptiveRendering = false;
        this.targetFPS = 30;
        this.frameInterval = 1000 / 30;
        this.lastFrameTime = 0;
        this.lastCameraPosition = { x: 0, y: 0, z: 0, distanceTo: jest.fn(() => 0) };
        this.cameraMoveThreshold = 0.1;
        this.camera = { position: { x: 0, y: 0, z: 0 } };
        this.controls = null;
    }

    setAdaptiveRendering(enabled, targetFPS = 30) {
        this.adaptiveRendering = enabled;
        this.targetFPS = Math.max(1, Math.min(60, targetFPS));
        this.frameInterval = 1000 / this.targetFPS;

        if (this.camera) {
            this.lastCameraPosition.x = this.camera.position.x;
            this.lastCameraPosition.y = this.camera.position.y;
            this.lastCameraPosition.z = this.camera.position.z;
        }

        console.log(`Adaptive rendering ${enabled ? 'enabled' : 'disabled'}, target: ${this.targetFPS}fps`);
    }

    shouldRenderFrame(currentTime) {
        if (!this.adaptiveRendering) {
            return true;
        }

        if (this.lastFrameTime === 0) {
            return true;
        }

        const timeSinceLastFrame = currentTime - this.lastFrameTime;
        if (timeSinceLastFrame < this.frameInterval) {
            return false;
        }

        // Check if camera has moved significantly
        if (this.camera) {
            const cameraMovement = Math.abs(this.camera.position.x - this.lastCameraPosition.x) +
                Math.abs(this.camera.position.y - this.lastCameraPosition.y) +
                Math.abs(this.camera.position.z - this.lastCameraPosition.z);
            if (cameraMovement > this.cameraMoveThreshold) {
                return true;
            }
        }

        // Check if controls are being used
        if (this.controls && this.controls.isBeingUsed) {
            return true;
        }

        return true;
    }
}

describe('Adaptive Rendering System', () => {
    let visualizer;

    beforeEach(() => {
        visualizer = new TestGcodeVisualizer();
        mockPerformance.now.mockReturnValue(1000);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('setAdaptiveRendering', () => {
        test('should initialize with correct default values', () => {
            expect(visualizer.adaptiveRendering).toBe(false);
            expect(visualizer.targetFPS).toBe(30);
            expect(visualizer.frameInterval).toBe(1000 / 30);
        });

        test('should enable adaptive rendering with custom FPS', () => {
            visualizer.setAdaptiveRendering(true, 45);

            expect(visualizer.adaptiveRendering).toBe(true);
            expect(visualizer.targetFPS).toBe(45);
            expect(visualizer.frameInterval).toBeCloseTo(1000 / 45);
        });

        test('should clamp FPS values between 1 and 60', () => {
            visualizer.setAdaptiveRendering(true, 0);
            expect(visualizer.targetFPS).toBe(1);

            visualizer.setAdaptiveRendering(true, 100);
            expect(visualizer.targetFPS).toBe(60);
        });
    });

    describe('shouldRenderFrame', () => {
        test('should always render when adaptive rendering is disabled', () => {
            visualizer.setAdaptiveRendering(false);
            expect(visualizer.shouldRenderFrame(1000)).toBe(true);
            expect(visualizer.shouldRenderFrame(2000)).toBe(true);
        });

        test('should render first frame regardless of timing', () => {
            visualizer.setAdaptiveRendering(true, 30);
            visualizer.lastFrameTime = 0;

            expect(visualizer.shouldRenderFrame(1000)).toBe(true);
        });

        test('should skip frames when time interval is too small', () => {
            visualizer.setAdaptiveRendering(true, 30);
            visualizer.lastFrameTime = 1000; // 33.3ms ago

            // Only 10ms later - should skip
            mockPerformance.now.mockReturnValue(1010);
            expect(visualizer.shouldRenderFrame(1010)).toBe(false);
        });

        test('should render when enough time has passed', () => {
            visualizer.setAdaptiveRendering(true, 30);
            visualizer.lastFrameTime = 1000; // 33.3ms ago

            // 35ms later - should render (33.3ms interval for 30fps)
            mockPerformance.now.mockReturnValue(1035);
            expect(visualizer.shouldRenderFrame(1035)).toBe(true);
        });


        test('should handle high FPS targets', () => {
            visualizer.setAdaptiveRendering(true, 60); // 16.7ms interval

            expect(visualizer.frameInterval).toBeCloseTo(16.67, 1);
        });

        test('should handle low FPS targets', () => {
            visualizer.setAdaptiveRendering(true, 15); // 66.7ms interval

            expect(visualizer.frameInterval).toBeCloseTo(66.67, 1);
        });
    });
});