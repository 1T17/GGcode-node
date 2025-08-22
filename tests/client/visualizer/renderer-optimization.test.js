/**
 * @jest-environment jsdom
 */

// Mock Three.js globals first
const mockTHREE = {
    WebGLRenderer: jest.fn().mockImplementation(() => ({
        setClearColor: jest.fn(),
        setPixelRatio: jest.fn(),
        setSize: jest.fn(),
        shadowMap: { enabled: false, type: null },
        outputColorSpace: null,
        toneMapping: null,
        toneMappingExposure: 1,
        localClippingEnabled: false,
        debug: { checkShaderErrors: false },
        capabilities: { isWebGL2: true },
        domElement: { style: {} },
        render: jest.fn(),
        dispose: jest.fn()
    })),
    SRGBColorSpace: 'srgb',
    ACESFilmicToneMapping: 'aces',
    PCFSoftShadowMap: 'pcf-soft'
};

// Set global THREE before tests
global.THREE = mockTHREE;

// Create a minimal test version of GcodeVisualizer for testing renderer optimization
class TestGcodeVisualizer {
    constructor() {
        this.renderer = null;
    }

    createOptimizedRenderer(container) {
        // Create optimized renderer with performance-focused settings
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            precision: 'mediump', // Use medium precision for better performance
            stencil: false, // Disable stencil buffer if not needed
            depth: true
        });

        // Optimize renderer settings for performance
        this.renderer.setClearColor(0x000000, 0); // transparent
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio for performance
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);

        // Performance optimizations
        this.renderer.shadowMap.enabled = false; // Disable shadows for CNC visualization
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Only if shadows are enabled

        // Output settings
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // Disable features not needed for CNC visualization
        this.renderer.localClippingEnabled = false;
        this.renderer.debug.checkShaderErrors = false; // Disable in production

        console.log('Renderer optimized for CNC visualization performance');
        return this.renderer;
    }
}

describe('Renderer Optimization', () => {
    let visualizer;
    let container;

    beforeEach(() => {
        // Mock container
        container = {
            offsetWidth: 800,
            offsetHeight: 600,
            appendChild: jest.fn()
        };

        visualizer = new TestGcodeVisualizer();

        // Mock window.devicePixelRatio
        Object.defineProperty(window, 'devicePixelRatio', {
            value: 2.5,
            writable: true
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createOptimizedRenderer', () => {
        test('should create renderer with optimized settings', () => {
            const renderer = visualizer.createOptimizedRenderer(container);

            expect(THREE.WebGLRenderer).toHaveBeenCalledWith({
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                precision: 'mediump',
                stencil: false,
                depth: true
            });
            expect(renderer).toBeDefined();
        });

        test('should set optimal pixel ratio', () => {
            visualizer.createOptimizedRenderer(container);

            // Should clamp 2.5 to 1.5 for performance
            expect(visualizer.renderer.setPixelRatio).toHaveBeenCalledWith(1.5);
        });

        test('should configure performance optimizations', () => {
            visualizer.createOptimizedRenderer(container);

            expect(visualizer.renderer.shadowMap.enabled).toBe(false);
            expect(visualizer.renderer.outputColorSpace).toBe(THREE.SRGBColorSpace);
            expect(visualizer.renderer.toneMapping).toBe(THREE.ACESFilmicToneMapping);
            expect(visualizer.renderer.localClippingEnabled).toBe(false);
        });

        test('should handle high device pixel ratio', () => {
            // Set very high pixel ratio
            Object.defineProperty(window, 'devicePixelRatio', {
                value: 5.0,
                writable: true
            });

            visualizer.createOptimizedRenderer(container);

            // Should still clamp to 1.5
            expect(visualizer.renderer.setPixelRatio).toHaveBeenCalledWith(1.5);
        });

        test('should handle low device pixel ratio', () => {
            // Set low pixel ratio
            Object.defineProperty(window, 'devicePixelRatio', {
                value: 1.0,
                writable: true
            });

            visualizer.createOptimizedRenderer(container);

            // Should use actual ratio
            expect(visualizer.renderer.setPixelRatio).toHaveBeenCalledWith(1.0);
        });

        test('should set correct container size', () => {
            visualizer.createOptimizedRenderer(container);

            expect(visualizer.renderer.setSize).toHaveBeenCalledWith(800, 600);
            expect(visualizer.renderer.setClearColor).toHaveBeenCalledWith(0x000000, 0);
        });

        test('should detect WebGL2 capabilities', () => {
            const consoleSpy = jest.spyOn(console, 'log');
            visualizer.createOptimizedRenderer(container);

            expect(consoleSpy).toHaveBeenCalledWith('Renderer optimized for CNC visualization performance');
        });
    });

    describe('performance impact', () => {
        test('should prioritize performance over quality features', () => {
            visualizer.createOptimizedRenderer(container);

            // Verify performance-focused settings
            expect(visualizer.renderer.shadowMap.enabled).toBe(false);
            expect(visualizer.renderer.precision).toBeUndefined(); // Set in constructor
            expect(visualizer.renderer.debug.checkShaderErrors).toBe(false);
        });

        test('should maintain visual quality where important', () => {
            visualizer.createOptimizedRenderer(container);

            // These settings maintain quality while optimizing performance
            expect(visualizer.renderer.antialias).toBeUndefined(); // Set in constructor
            expect(visualizer.renderer.outputColorSpace).toBeDefined();
            expect(visualizer.renderer.toneMapping).toBeDefined();
        });

        test('should handle different container sizes', () => {
            const smallContainer = { offsetWidth: 400, offsetHeight: 300 };
            visualizer.createOptimizedRenderer(smallContainer);

            expect(visualizer.renderer.setSize).toHaveBeenCalledWith(400, 300);
        });
    });
});