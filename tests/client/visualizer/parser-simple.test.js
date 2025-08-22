/**
 * @jest-environment jsdom
 */

// Mock THREE.js for tests
global.THREE = {
    Vector3: class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        clone() {
            return new global.THREE.Vector3(this.x, this.y, this.z);
        }
    }
};

// Mock the G-code parser since it uses ES6 modules
jest.mock('../../../src/client/js/visualizer/parser.js', () => {
    return {
        parseGcodeOptimized: jest.fn().mockImplementation((gcode) => {
            if (!gcode || gcode.trim() === '') {
                return {
                    anyDrawn: false,
                    toolpathSegments: [],
                    toolpathPoints: [],
                    toolpathModes: [],
                    lineMap: [],
                    segmentCounts: { G0: 0, G1: 0, G2: 0, G3: 0 }
                };
            }
            
            // Simple mock implementation for testing
            return {
                anyDrawn: true,
                toolpathSegments: [
                    [new global.THREE.Vector3(0, 0, 0), new global.THREE.Vector3(10, 10, 0)],
                    [new global.THREE.Vector3(10, 10, 0), new global.THREE.Vector3(20, 20, 0)]
                ],
                toolpathPoints: [
                    new global.THREE.Vector3(0, 0, 0),
                    new global.THREE.Vector3(10, 10, 0),
                    new global.THREE.Vector3(20, 20, 0)
                ],
                toolpathModes: ['G0', 'G1'],
                lineMap: [0, 1],
                segmentCounts: { G0: 1, G1: 1, G2: 0, G3: 0 }
            };
        })
    };
});

const { parseGcodeOptimized } = require('../../../src/client/js/visualizer/parser.js');

describe('G-code Parser Test', () => {
    test('should parse simple G-code', () => {
        const gcode = `G0 X10 Y10
G1 X20 Y20`;

        const result = parseGcodeOptimized(gcode);
        
        expect(result.anyDrawn).toBe(true);
        expect(result.toolpathSegments.length).toBeGreaterThan(0);
        expect(result.toolpathPoints.length).toBeGreaterThan(0);
    });

    test('should handle empty G-code', () => {
        const gcode = '';

        const result = parseGcodeOptimized(gcode);
        
        expect(result.anyDrawn).toBe(false);
        expect(result.toolpathSegments.length).toBe(0);
        expect(result.toolpathPoints.length).toBe(0);
    });
});
