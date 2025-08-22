/**
 * Simple regex test for G-code parsing
 */

// G-code parsing constants
const GCODE_REGEX = {
    G_MODE: /G([0123])/g,
    X_COORD: /X(-?\d*\.?\d+)/i,
    Y_COORD: /Y(-?\d*\.?\d+)/i,
    Z_COORD: /Z(-?\d*\.?\d+)/i,
    I_OFFSET: /I(-?\d*\.?\d+)/i,
    J_OFFSET: /J(-?\d*\.?\d+)/i,
    R_RADIUS: /R(-?\d*\.?\d+)/i,
    HAS_COORDS: /[XYZIJR]/i,
    N_LINE: /^N\d+\s*/
};

// Test with simple G-code
const gcode = `G0 X10 Y10
G1 X20 Y20
G1 X30 Y30`;

console.log('Testing G-code parsing:');
console.log('G-code:', gcode);

const lines = gcode.split(/\r?\n/);
console.log('Lines:', lines);

lines.forEach((line, idx) => {
    line = line.trim().replace(GCODE_REGEX.N_LINE, '');
    console.log(`Line ${idx}: "${line}"`);
    
    // Test G-mode matching
    const gModes = [...line.matchAll(GCODE_REGEX.G_MODE)];
    console.log(`  G-modes:`, gModes.map(m => m[1]));
    
    // Test coordinate extraction
    const xMatch = line.match(GCODE_REGEX.X_COORD);
    const yMatch = line.match(GCODE_REGEX.Y_COORD);
    const zMatch = line.match(GCODE_REGEX.Z_COORD);
    
    console.log(`  Coordinates: X=${xMatch ? xMatch[1] : 'none'}, Y=${yMatch ? yMatch[1] : 'none'}, Z=${zMatch ? zMatch[1] : 'none'}`);
});
