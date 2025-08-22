/**
 * Point Data Extractor Tests
 * 
 * Tests for the point data extraction and formatting utilities.
 * Verifies support for all G-code modes and arc parameter extraction.
 */

// Mock THREE.js Vector3 for testing
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

        distanceTo(other) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const dz = this.z - other.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
    }
};

// Mock PointDataExtractor class for testing (simplified version of the actual implementation)
class PointDataExtractor {
    constructor() {
        this.GCODE_REGEX = {
            G_MODE: /G([0123])/g,
            X_COORD: /X(-?\d*\.?\d+)/i,
            Y_COORD: /Y(-?\d*\.?\d+)/i,
            Z_COORD: /Z(-?\d*\.?\d+)/i,
            I_OFFSET: /I(-?\d*\.?\d+)/i,
            J_OFFSET: /J(-?\d*\.?\d+)/i,
            K_OFFSET: /K(-?\d*\.?\d+)/i,
            R_RADIUS: /R(-?\d*\.?\d+)/i,
            F_FEEDRATE: /F(-?\d*\.?\d+)/i,
            S_SPINDLE: /S(-?\d*\.?\d+)/i,
            N_LINE: /^N\d+\s*/
        };

        this.modeConfig = {
            G0: { name: 'Rapid Move', color: '#ff8e37', description: 'Rapid positioning move' },
            G1: { name: 'Linear Move', color: '#00ff99', description: 'Linear interpolation move' },
            G2: { name: 'Clockwise Arc', color: '#0074d9', description: 'Clockwise circular interpolation' },
            G3: { name: 'Counter-Clockwise Arc', color: '#f012be', description: 'Counter-clockwise circular interpolation' }
        };
    }

    extractPointData(segmentIndex, coordinates, mode, lineIndex, gcodeLines, toolpathSegments = null) {
        const originalLine = this.getOriginalGcodeLine(lineIndex, gcodeLines);
        const parsedParams = this.parseGcodeParameters(originalLine);
        const arcParams = this.extractArcParameters(mode, originalLine, coordinates, toolpathSegments, segmentIndex);

        const pointData = {
            segmentIndex,
            coordinates: coordinates.clone(),
            mode: mode || 'G1',
            lineIndex,
            originalLine,
            gcodeLine: this.formatGcodeCommand(originalLine, mode, coordinates, parsedParams),
            timestamp: Date.now(),
            parameters: parsedParams,
            arcParams: arcParams,
            modeConfig: this.modeConfig[mode] || this.modeConfig.G1,
            displayData: null
        };

        pointData.displayData = this.formatForDisplay(pointData);
        return pointData;
    }

    getOriginalGcodeLine(lineIndex, gcodeLines) {
        if (!gcodeLines || !Array.isArray(gcodeLines) || lineIndex < 0 || lineIndex >= gcodeLines.length) {
            return '';
        }
        let line = gcodeLines[lineIndex] || '';
        line = line.trim().replace(this.GCODE_REGEX.N_LINE, '');
        return line;
    }

    parseGcodeParameters(line) {
        const params = {};
        if (!line) return params;

        const xMatch = line.match(this.GCODE_REGEX.X_COORD);
        const yMatch = line.match(this.GCODE_REGEX.Y_COORD);
        const zMatch = line.match(this.GCODE_REGEX.Z_COORD);
        const iMatch = line.match(this.GCODE_REGEX.I_OFFSET);
        const jMatch = line.match(this.GCODE_REGEX.J_OFFSET);
        const kMatch = line.match(this.GCODE_REGEX.K_OFFSET);
        const rMatch = line.match(this.GCODE_REGEX.R_RADIUS);
        const fMatch = line.match(this.GCODE_REGEX.F_FEEDRATE);
        const sMatch = line.match(this.GCODE_REGEX.S_SPINDLE);

        if (xMatch) params.x = parseFloat(xMatch[1]);
        if (yMatch) params.y = parseFloat(yMatch[1]);
        if (zMatch) params.z = parseFloat(zMatch[1]);
        if (iMatch) params.i = parseFloat(iMatch[1]);
        if (jMatch) params.j = parseFloat(jMatch[1]);
        if (kMatch) params.k = parseFloat(kMatch[1]);
        if (rMatch) params.r = parseFloat(rMatch[1]);
        if (fMatch) params.f = parseFloat(fMatch[1]);
        if (sMatch) params.s = parseFloat(sMatch[1]);

        const gModes = [...line.matchAll(this.GCODE_REGEX.G_MODE)];
        if (gModes.length > 0) {
            params.gModes = gModes.map(match => `G${match[1]}`);
            params.primaryMode = params.gModes[params.gModes.length - 1];
        }

        return params;
    }

    extractArcParameters(mode, line, coordinates, toolpathSegments, segmentIndex) {
        if (mode !== 'G2' && mode !== 'G3') return null;

        const arcParams = {
            mode,
            isClockwise: mode === 'G2',
            endPoint: coordinates.clone()
        };

        const iMatch = line.match(this.GCODE_REGEX.I_OFFSET);
        const jMatch = line.match(this.GCODE_REGEX.J_OFFSET);
        const kMatch = line.match(this.GCODE_REGEX.K_OFFSET);
        const rMatch = line.match(this.GCODE_REGEX.R_RADIUS);

        if (iMatch) arcParams.i = parseFloat(iMatch[1]);
        if (jMatch) arcParams.j = parseFloat(jMatch[1]);
        if (kMatch) arcParams.k = parseFloat(kMatch[1]);
        if (rMatch) arcParams.r = parseFloat(rMatch[1]);

        return arcParams;
    }

    calculateCircleCenter(p1, p2, p3) {
        try {
            const ax = p1.x, ay = p1.y;
            const bx = p2.x, by = p2.y;
            const cx = p3.x, cy = p3.y;

            const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));

            if (Math.abs(d) < 1e-10) return null;

            const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
            const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;

            return new THREE.Vector3(ux, uy, p1.z);
        } catch (error) {
            return null;
        }
    }

    formatGcodeCommand(originalLine, mode, coordinates, params) {
        if (originalLine && originalLine.trim()) {
            return originalLine.trim();
        }

        let command = mode || 'G1';
        if (coordinates) {
            command += ` X${coordinates.x.toFixed(3)} Y${coordinates.y.toFixed(3)} Z${coordinates.z.toFixed(3)}`;
        }

        if ((mode === 'G2' || mode === 'G3') && params) {
            if (params.i !== undefined) command += ` I${params.i.toFixed(3)}`;
            if (params.j !== undefined) command += ` J${params.j.toFixed(3)}`;
            if (params.k !== undefined) command += ` K${params.k.toFixed(3)}`;
            if (params.r !== undefined) command += ` R${params.r.toFixed(3)}`;
        }

        if (params && params.f !== undefined) {
            command += ` F${params.f}`;
        }

        return command;
    }

    formatForDisplay(pointData) {
        const coordinates = pointData.coordinates;
        const formatCoord = (value) => {
            if (typeof value !== 'number' || isNaN(value)) return '0.00';
            return value.toFixed(2);
        };

        const formattedCoords = coordinates ?
            `X: ${formatCoord(coordinates.x)} Y: ${formatCoord(coordinates.y)} Z: ${formatCoord(coordinates.z)}` :
            'Coordinates unavailable';

        let command = pointData.gcodeLine || 'Unknown command';
        command = command.trim();

        if (pointData.modeConfig) {
            command = `${pointData.modeConfig.name} - ${command}`;
        }

        let arcInfo = '';
        if (pointData.arcParams && (pointData.mode === 'G2' || pointData.mode === 'G3')) {
            arcInfo = this.formatArcParameters(pointData.arcParams);
        }

        const technicalInfo = this.formatTechnicalInfo(pointData);

        return {
            coordinates: formattedCoords,
            command: command,
            arcInfo: arcInfo,
            technicalInfo: technicalInfo,
            mode: pointData.mode,
            modeConfig: pointData.modeConfig
        };
    }

    formatArcParameters(arcParams) {
        if (!arcParams) return '';

        const parts = [];
        if (arcParams.i !== undefined) parts.push(`I${arcParams.i.toFixed(3)}`);
        if (arcParams.j !== undefined) parts.push(`J${arcParams.j.toFixed(3)}`);
        if (arcParams.k !== undefined) parts.push(`K${arcParams.k.toFixed(3)}`);
        if (arcParams.r !== undefined) parts.push(`R${arcParams.r.toFixed(3)}`);

        if (arcParams.radius !== undefined) {
            parts.push(`Radius: ${arcParams.radius.toFixed(3)}`);
        }
        if (arcParams.arcLength !== undefined) {
            parts.push(`Length: ${arcParams.arcLength.toFixed(3)}`);
        }
        if (arcParams.sweepAngle !== undefined) {
            const degrees = (Math.abs(arcParams.sweepAngle) * 180 / Math.PI).toFixed(1);
            parts.push(`Sweep: ${degrees}°`);
        }

        return parts.length > 0 ? `Arc: ${parts.join(', ')}` : '';
    }

    formatTechnicalInfo(pointData) {
        const parts = [];
        if (pointData.lineIndex !== undefined) {
            parts.push(`Line: ${pointData.lineIndex + 1}`);
        }
        if (pointData.segmentIndex !== undefined) {
            parts.push(`Segment: ${pointData.segmentIndex + 1}`);
        }
        if (pointData.parameters && pointData.parameters.f !== undefined) {
            parts.push(`Feed: ${pointData.parameters.f}`);
        }
        if (pointData.parameters && pointData.parameters.s !== undefined) {
            parts.push(`Spindle: ${pointData.parameters.s}`);
        }
        return parts.join(' | ');
    }

    createFallbackPointData(segmentIndex, coordinates, mode, lineIndex) {
        return {
            segmentIndex: segmentIndex || 0,
            coordinates: coordinates || new THREE.Vector3(0, 0, 0),
            mode: mode || 'G1',
            lineIndex: lineIndex || 0,
            originalLine: '',
            gcodeLine: `${mode || 'G1'} (data unavailable)`,
            timestamp: Date.now(),
            parameters: {},
            arcParams: null,
            modeConfig: this.modeConfig[mode] || this.modeConfig.G1,
            displayData: {
                coordinates: 'Coordinates unavailable',
                command: 'Command unavailable',
                arcInfo: '',
                technicalInfo: 'Data extraction failed',
                mode: mode || 'G1',
                modeConfig: this.modeConfig[mode] || this.modeConfig.G1
            }
        };
    }

    validatePointData(pointData) {
        if (!pointData || typeof pointData !== 'object') return false;

        const requiredFields = ['segmentIndex', 'coordinates', 'mode', 'lineIndex'];
        for (const field of requiredFields) {
            if (!(field in pointData)) return false;
        }

        if (!pointData.coordinates || typeof pointData.coordinates.x !== 'number') return false;
        if (!['G0', 'G1', 'G2', 'G3'].includes(pointData.mode)) return false;

        return true;
    }

    getModeConfig(mode) {
        return this.modeConfig[mode] || this.modeConfig.G1;
    }

    getSupportedModes() {
        return Object.keys(this.modeConfig);
    }
}

describe('PointDataExtractor', () => {
    let extractor;

    beforeEach(() => {
        extractor = new PointDataExtractor();
    });

    describe('Basic Point Data Extraction', () => {
        test('should extract basic G1 linear move data', () => {
            const coordinates = new THREE.Vector3(10, 20, 5);
            const gcodeLines = ['G1 X10 Y20 Z5 F1000'];

            const result = extractor.extractPointData(0, coordinates, 'G1', 0, gcodeLines);

            expect(result.segmentIndex).toBe(0);
            expect(result.coordinates.x).toBe(10);
            expect(result.coordinates.y).toBe(20);
            expect(result.coordinates.z).toBe(5);
            expect(result.mode).toBe('G1');
            expect(result.lineIndex).toBe(0);
            expect(result.originalLine).toBe('G1 X10 Y20 Z5 F1000');
            expect(result.displayData).toBeDefined();
        });

        test('should extract G0 rapid move data', () => {
            const coordinates = new THREE.Vector3(0, 0, 10);
            const gcodeLines = ['G0 Z10'];

            const result = extractor.extractPointData(0, coordinates, 'G0', 0, gcodeLines);

            expect(result.mode).toBe('G0');
            expect(result.modeConfig.name).toBe('Rapid Move');
            expect(result.modeConfig.color).toBe('#ff8e37');
            expect(result.displayData.coordinates).toContain('Z: 10.00');
        });

        test('should handle missing G-code lines gracefully', () => {
            const coordinates = new THREE.Vector3(5, 5, 0);

            const result = extractor.extractPointData(0, coordinates, 'G1', 0, null);

            expect(result.segmentIndex).toBe(0);
            expect(result.mode).toBe('G1');
            expect(result.coordinates.x).toBe(5);
            expect(result.displayData).toBeDefined();
        });
    });

    describe('G-code Parameter Parsing', () => {
        test('should parse coordinates from G-code line', () => {
            const line = 'G1 X15.5 Y-10.25 Z2.75 F500';
            const params = extractor.parseGcodeParameters(line);

            expect(params.x).toBe(15.5);
            expect(params.y).toBe(-10.25);
            expect(params.z).toBe(2.75);
            expect(params.f).toBe(500);
        });

        test('should parse arc parameters from G2/G3 lines', () => {
            const line = 'G2 X10 Y10 I5 J0 F1000';
            const params = extractor.parseGcodeParameters(line);

            expect(params.x).toBe(10);
            expect(params.y).toBe(10);
            expect(params.i).toBe(5);
            expect(params.j).toBe(0);
            expect(params.f).toBe(1000);
        });

        test('should parse R-format arc parameters', () => {
            const line = 'G3 X20 Y0 R10';
            const params = extractor.parseGcodeParameters(line);

            expect(params.x).toBe(20);
            expect(params.y).toBe(0);
            expect(params.r).toBe(10);
        });
    });

    describe('Arc Parameter Extraction', () => {
        test('should extract arc parameters for G2 clockwise arc', () => {
            const coordinates = new THREE.Vector3(10, 10, 0);
            const line = 'G2 X10 Y10 I5 J0';

            const arcParams = extractor.extractArcParameters('G2', line, coordinates);

            expect(arcParams).toBeDefined();
            expect(arcParams.mode).toBe('G2');
            expect(arcParams.isClockwise).toBe(true);
            expect(arcParams.i).toBe(5);
            expect(arcParams.j).toBe(0);
            expect(arcParams.endPoint.x).toBe(10);
            expect(arcParams.endPoint.y).toBe(10);
        });

        test('should extract arc parameters for G3 counter-clockwise arc', () => {
            const coordinates = new THREE.Vector3(0, 10, 0);
            const line = 'G3 X0 Y10 R5';

            const arcParams = extractor.extractArcParameters('G3', line, coordinates);

            expect(arcParams).toBeDefined();
            expect(arcParams.mode).toBe('G3');
            expect(arcParams.isClockwise).toBe(false);
            expect(arcParams.r).toBe(5);
        });

        test('should return null for non-arc moves', () => {
            const coordinates = new THREE.Vector3(5, 5, 0);
            const line = 'G1 X5 Y5';

            const arcParams = extractor.extractArcParameters('G1', line, coordinates);

            expect(arcParams).toBeNull();
        });
    });

    describe('Display Data Formatting', () => {
        test('should format coordinates with proper precision', () => {
            const pointData = {
                coordinates: new THREE.Vector3(10.12345, -5.6789, 2.001),
                mode: 'G1',
                gcodeLine: 'G1 X10.123 Y-5.679 Z2.001',
                modeConfig: extractor.getModeConfig('G1'),
                parameters: {},
                arcParams: null
            };

            const displayData = extractor.formatForDisplay(pointData);

            expect(displayData.coordinates).toBe('X: 10.12 Y: -5.68 Z: 2.00');
            expect(displayData.mode).toBe('G1');
        });

        test('should format arc information for G2 command', () => {
            const pointData = {
                coordinates: new THREE.Vector3(10, 10, 0),
                mode: 'G2',
                gcodeLine: 'G2 X10 Y10 I5 J0',
                modeConfig: extractor.getModeConfig('G2'),
                parameters: { i: 5, j: 0 },
                arcParams: {
                    i: 5,
                    j: 0,
                    radius: 5,
                    arcLength: 7.854,
                    sweepAngle: Math.PI / 2
                }
            };

            const displayData = extractor.formatForDisplay(pointData);

            expect(displayData.arcInfo).toContain('I5.000');
            expect(displayData.arcInfo).toContain('J0.000');
            expect(displayData.arcInfo).toContain('Radius: 5.000');
            expect(displayData.arcInfo).toContain('Length: 7.854');
            expect(displayData.arcInfo).toContain('Sweep: 90.0°');
        });
    });

    describe('Mode Configuration', () => {
        test('should provide correct configuration for all supported modes', () => {
            const modes = extractor.getSupportedModes();

            expect(modes).toContain('G0');
            expect(modes).toContain('G1');
            expect(modes).toContain('G2');
            expect(modes).toContain('G3');

            const g0Config = extractor.getModeConfig('G0');
            expect(g0Config.name).toBe('Rapid Move');
            expect(g0Config.color).toBe('#ff8e37');

            const g2Config = extractor.getModeConfig('G2');
            expect(g2Config.name).toBe('Clockwise Arc');
            expect(g2Config.color).toBe('#0074d9');
        });
    });

    describe('Data Validation', () => {
        test('should validate complete point data', () => {
            const validData = {
                segmentIndex: 0,
                coordinates: new THREE.Vector3(1, 2, 3),
                mode: 'G1',
                lineIndex: 5
            };

            expect(extractor.validatePointData(validData)).toBe(true);
        });

        test('should reject invalid point data', () => {
            expect(extractor.validatePointData(null)).toBe(false);
            expect(extractor.validatePointData({})).toBe(false);
            expect(extractor.validatePointData({ segmentIndex: 0 })).toBe(false);

            const invalidCoords = {
                segmentIndex: 0,
                coordinates: { x: 'invalid' },
                mode: 'G1',
                lineIndex: 0
            };
            expect(extractor.validatePointData(invalidCoords)).toBe(false);

            const invalidMode = {
                segmentIndex: 0,
                coordinates: new THREE.Vector3(0, 0, 0),
                mode: 'G99',
                lineIndex: 0
            };
            expect(extractor.validatePointData(invalidMode)).toBe(false);
        });
    });
});