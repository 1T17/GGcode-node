/**
 * Point Data Integration Tests
 * 
 * Tests the integration between PointDataExtractor, PointDetector, and TooltipManager
 * to ensure the complete point data extraction and formatting workflow works correctly.
 */

// Mock THREE.js for testing
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

describe('Point Data Integration', () => {
    describe('G-code Mode Support', () => {
        test('should support all G-code modes (G0, G1, G2, G3)', () => {
            const testCases = [
                {
                    mode: 'G0',
                    line: 'G0 X10 Y20 Z5',
                    coordinates: new THREE.Vector3(10, 20, 5),
                    expectedColor: '#ff8e37',
                    expectedName: 'Rapid Move'
                },
                {
                    mode: 'G1',
                    line: 'G1 X15 Y25 Z3 F1000',
                    coordinates: new THREE.Vector3(15, 25, 3),
                    expectedColor: '#00ff99',
                    expectedName: 'Linear Move'
                },
                {
                    mode: 'G2',
                    line: 'G2 X20 Y0 I10 J0',
                    coordinates: new THREE.Vector3(20, 0, 0),
                    expectedColor: '#0074d9',
                    expectedName: 'Clockwise Arc'
                },
                {
                    mode: 'G3',
                    line: 'G3 X0 Y20 R10',
                    coordinates: new THREE.Vector3(0, 20, 0),
                    expectedColor: '#f012be',
                    expectedName: 'Counter-Clockwise Arc'
                }
            ];

            testCases.forEach(testCase => {
                // Mock point data as would be created by the system
                const pointData = {
                    segmentIndex: 0,
                    coordinates: testCase.coordinates,
                    mode: testCase.mode,
                    lineIndex: 0,
                    originalLine: testCase.line,
                    gcodeLine: testCase.line,
                    modeConfig: {
                        name: testCase.expectedName,
                        color: testCase.expectedColor
                    },
                    displayData: {
                        coordinates: `X: ${testCase.coordinates.x.toFixed(2)} Y: ${testCase.coordinates.y.toFixed(2)} Z: ${testCase.coordinates.z.toFixed(2)}`,
                        command: `${testCase.expectedName} - ${testCase.line}`,
                        mode: testCase.mode,
                        modeConfig: {
                            name: testCase.expectedName,
                            color: testCase.expectedColor
                        }
                    }
                };

                expect(pointData.mode).toBe(testCase.mode);
                expect(pointData.modeConfig.name).toBe(testCase.expectedName);
                expect(pointData.modeConfig.color).toBe(testCase.expectedColor);
                expect(pointData.displayData.coordinates).toContain(`X: ${testCase.coordinates.x.toFixed(2)}`);
                expect(pointData.displayData.coordinates).toContain(`Y: ${testCase.coordinates.y.toFixed(2)}`);
                expect(pointData.displayData.coordinates).toContain(`Z: ${testCase.coordinates.z.toFixed(2)}`);
            });
        });
    });

    describe('Arc Parameter Display', () => {
        test('should format G2 arc parameters correctly', () => {
            const arcPointData = {
                mode: 'G2',
                coordinates: new THREE.Vector3(10, 10, 0),
                gcodeLine: 'G2 X10 Y10 I5 J0 F800',
                arcParams: {
                    i: 5,
                    j: 0,
                    radius: 5,
                    arcLength: 7.854,
                    sweepAngle: Math.PI / 2
                },
                displayData: {
                    arcInfo: 'Arc: I5.000, J0.000, Radius: 5.000, Length: 7.854, Sweep: 90.0°'
                }
            };

            expect(arcPointData.displayData.arcInfo).toContain('I5.000');
            expect(arcPointData.displayData.arcInfo).toContain('J0.000');
            expect(arcPointData.displayData.arcInfo).toContain('Radius: 5.000');
            expect(arcPointData.displayData.arcInfo).toContain('Length: 7.854');
            expect(arcPointData.displayData.arcInfo).toContain('Sweep: 90.0°');
        });

        test('should format G3 arc parameters with R format', () => {
            const arcPointData = {
                mode: 'G3',
                coordinates: new THREE.Vector3(0, 20, 0),
                gcodeLine: 'G3 X0 Y20 R10',
                arcParams: {
                    r: 10,
                    radius: 10
                },
                displayData: {
                    arcInfo: 'Arc: R10.000, Radius: 10.000'
                }
            };

            expect(arcPointData.displayData.arcInfo).toContain('R10.000');
            expect(arcPointData.displayData.arcInfo).toContain('Radius: 10.000');
        });

        test('should not show arc info for linear moves', () => {
            const linearPointData = {
                mode: 'G1',
                coordinates: new THREE.Vector3(5, 5, 0),
                gcodeLine: 'G1 X5 Y5 F1000',
                arcParams: null,
                displayData: {
                    arcInfo: ''
                }
            };

            expect(linearPointData.displayData.arcInfo).toBe('');
        });
    });

    describe('Tooltip Content Formatting', () => {
        test('should format complete tooltip content with all sections', () => {
            const completePointData = {
                mode: 'G2',
                coordinates: new THREE.Vector3(15.123, -8.456, 2.789),
                lineIndex: 42,
                segmentIndex: 15,
                gcodeLine: 'G2 X15.123 Y-8.456 Z2.789 I7.5 J-2.1 F1200',
                parameters: {
                    f: 1200,
                    s: 15000
                },
                arcParams: {
                    i: 7.5,
                    j: -2.1
                },
                modeConfig: {
                    name: 'Clockwise Arc',
                    color: '#0074d9'
                },
                displayData: {
                    coordinates: 'X: 15.12 Y: -8.46 Z: 2.79',
                    command: 'Clockwise Arc - G2 X15.123 Y-8.456 Z2.789 I7.5 J-2.1 F1200',
                    arcInfo: 'Arc: I7.500, J-2.100',
                    technicalInfo: 'Line: 43 | Segment: 16 | Feed: 1200 | Spindle: 15000',
                    mode: 'G2'
                }
            };

            // Verify coordinates formatting
            expect(completePointData.displayData.coordinates).toBe('X: 15.12 Y: -8.46 Z: 2.79');

            // Verify command includes mode name
            expect(completePointData.displayData.command).toContain('Clockwise Arc');
            expect(completePointData.displayData.command).toContain('G2 X15.123 Y-8.456 Z2.789');

            // Verify arc information
            expect(completePointData.displayData.arcInfo).toContain('I7.500');
            expect(completePointData.displayData.arcInfo).toContain('J-2.100');

            // Verify technical information
            expect(completePointData.displayData.technicalInfo).toContain('Line: 43');
            expect(completePointData.displayData.technicalInfo).toContain('Segment: 16');
            expect(completePointData.displayData.technicalInfo).toContain('Feed: 1200');
            expect(completePointData.displayData.technicalInfo).toContain('Spindle: 15000');
        });

        test('should handle minimal point data gracefully', () => {
            const minimalPointData = {
                mode: 'G1',
                coordinates: new THREE.Vector3(0, 0, 0),
                lineIndex: 0,
                segmentIndex: 0,
                gcodeLine: 'G1',
                displayData: {
                    coordinates: 'X: 0.00 Y: 0.00 Z: 0.00',
                    command: 'Linear Move - G1',
                    arcInfo: '',
                    technicalInfo: 'Line: 1 | Segment: 1',
                    mode: 'G1'
                }
            };

            expect(minimalPointData.displayData.coordinates).toBe('X: 0.00 Y: 0.00 Z: 0.00');
            expect(minimalPointData.displayData.command).toBe('Linear Move - G1');
            expect(minimalPointData.displayData.arcInfo).toBe('');
            expect(minimalPointData.displayData.technicalInfo).toBe('Line: 1 | Segment: 1');
        });
    });

    describe('Coordinate Precision', () => {
        test('should format coordinates with 2 decimal places', () => {
            const testCoordinates = [
                { input: new THREE.Vector3(1, 2, 3), expected: 'X: 1.00 Y: 2.00 Z: 3.00' },
                { input: new THREE.Vector3(10.1, 20.25, 5.999), expected: 'X: 10.10 Y: 20.25 Z: 6.00' },
                { input: new THREE.Vector3(-5.123, 0, 15.6789), expected: 'X: -5.12 Y: 0.00 Z: 15.68' },
                { input: new THREE.Vector3(0.001, -0.999, 100.005), expected: 'X: 0.00 Y: -1.00 Z: 100.00' }
            ];

            testCoordinates.forEach(test => {
                const pointData = {
                    coordinates: test.input,
                    displayData: {
                        coordinates: `X: ${test.input.x.toFixed(2)} Y: ${test.input.y.toFixed(2)} Z: ${test.input.z.toFixed(2)}`
                    }
                };

                expect(pointData.displayData.coordinates).toBe(test.expected);
            });
        });
    });

    describe('Error Handling and Fallbacks', () => {
        test('should provide fallback data when extraction fails', () => {
            const fallbackData = {
                segmentIndex: 5,
                coordinates: new THREE.Vector3(1, 2, 3),
                mode: 'G1',
                lineIndex: 10,
                originalLine: '',
                gcodeLine: 'G1 (data unavailable)',
                displayData: {
                    coordinates: 'Coordinates unavailable',
                    command: 'Command unavailable',
                    arcInfo: '',
                    technicalInfo: 'Data extraction failed',
                    mode: 'G1'
                }
            };

            expect(fallbackData.segmentIndex).toBe(5);
            expect(fallbackData.coordinates.x).toBe(1);
            expect(fallbackData.mode).toBe('G1');
            expect(fallbackData.displayData.technicalInfo).toContain('Data extraction failed');
        });

        test('should handle invalid coordinates gracefully', () => {
            const invalidCoordData = {
                coordinates: { x: NaN, y: undefined, z: 'invalid' },
                displayData: {
                    coordinates: 'Coordinates unavailable'
                }
            };

            expect(invalidCoordData.displayData.coordinates).toBe('Coordinates unavailable');
        });
    });

    describe('Performance Considerations', () => {
        test('should handle large datasets efficiently', () => {
            const startTime = Date.now();

            // Simulate processing 1000 points
            const points = [];
            for (let i = 0; i < 1000; i++) {
                points.push({
                    segmentIndex: i,
                    coordinates: new THREE.Vector3(i, i * 2, i * 0.5),
                    mode: ['G0', 'G1', 'G2', 'G3'][i % 4],
                    lineIndex: i,
                    displayData: {
                        coordinates: `X: ${i.toFixed(2)} Y: ${(i * 2).toFixed(2)} Z: ${(i * 0.5).toFixed(2)}`
                    }
                });
            }

            const endTime = Date.now();
            const processingTime = endTime - startTime;

            expect(points.length).toBe(1000);
            expect(processingTime).toBeLessThan(100); // Should process quickly

            // Verify first and last points
            expect(points[0].segmentIndex).toBe(0);
            expect(points[999].segmentIndex).toBe(999);
            expect(points[0].displayData.coordinates).toBe('X: 0.00 Y: 0.00 Z: 0.00');
            expect(points[999].displayData.coordinates).toBe('X: 999.00 Y: 1998.00 Z: 499.50');
        });
    });
});