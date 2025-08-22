/**
 * Simple test to verify parser works correctly
 */

// Mock Three.js for testing
global.THREE = {
    Vector3: class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        clone() {
            return new Vector3(this.x, this.y, this.z);
        }
    }
};

// Import the parser function
eval(require('fs').readFileSync('/home/t1/GGcode-node_DEV/src/client/js/visualizer/parser.js', 'utf8'));

// Test with simple G-code
const gcode = `G0 X10 Y10
G1 X20 Y20
G1 X30 Y30`;

console.log('Testing parser with simple G-code:');
console.log('G-code:', gcode);

const result = parseGcodeOptimized(gcode);

console.log('Parse result:');
console.log('- anyDrawn:', result.anyDrawn);
console.log('- toolpathSegments length:', result.toolpathSegments.length);
console.log('- toolpathPoints length:', result.toolpathPoints.length);
console.log('- segmentCounts:', result.segmentCounts);

if (result.toolpathSegments.length > 0) {
    console.log('First segment:', result.toolpathSegments[0]);
}

if (result.toolpathPoints.length > 0) {
    console.log('First few points:', result.toolpathPoints.slice(0, 5));
}