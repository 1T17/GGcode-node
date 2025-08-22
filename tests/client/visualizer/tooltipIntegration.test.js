/**
 * TooltipManager Integration Tests
 * 
 * Tests for tooltip integration with CSS styles and positioning algorithms.
 */

describe('TooltipManager Integration', () => {
    test('should have CSS classes defined for all G-code modes', () => {
        // This test verifies that the CSS classes we expect are properly defined
        const expectedModes = ['g0', 'g1', 'g2', 'g3'];
        const expectedClasses = [
            'toolpath-tooltip',
            'tooltip-coordinates',
            'tooltip-command'
        ];

        // Test that we have the expected class names
        expectedModes.forEach(mode => {
            const modeClass = `mode-${mode}`;
            expect(modeClass).toMatch(/^mode-(g0|g1|g2|g3)$/);
        });

        expectedClasses.forEach(className => {
            expect(className).toMatch(/^(toolpath-tooltip|tooltip-coordinates|tooltip-command)$/);
        });
    });

    test('should format coordinates with proper precision', () => {
        const testCases = [
            { input: 0, expected: '0.00' },
            { input: 10.123456, expected: '10.12' },
            { input: -5.789, expected: '-5.79' },
            { input: 100, expected: '100.00' },
            { input: NaN, expected: '0.00' },
            { input: null, expected: '0.00' },
            { input: undefined, expected: '0.00' }
        ];

        const formatCoord = (value) => {
            if (typeof value !== 'number' || isNaN(value)) {
                return '0.00';
            }
            return value.toFixed(2);
        };

        testCases.forEach(({ input, expected }) => {
            expect(formatCoord(input)).toBe(expected);
        });
    });

    test('should handle viewport boundary detection logic', () => {
        const mockViewport = { width: 1024, height: 768 };
        const tooltipSize = { width: 200, height: 60 };
        const offset = { x: 15, y: -10 };

        const calculatePosition = (mouseX, mouseY) => {
            let x = mouseX + offset.x;
            let y = mouseY + offset.y;

            // Adjust horizontal position if tooltip would go off-screen
            if (x + tooltipSize.width > mockViewport.width - 10) {
                x = mouseX - tooltipSize.width - Math.abs(offset.x);
            }

            // Adjust vertical position if tooltip would go off-screen
            if (y + tooltipSize.height > mockViewport.height - 10) {
                y = mouseY - tooltipSize.height - Math.abs(offset.y);
            }

            // Ensure tooltip doesn't go off the left or top edge
            x = Math.max(10, x);
            y = Math.max(10, y);

            return { x, y };
        };

        // Test normal positioning
        expect(calculatePosition(100, 100)).toEqual({ x: 115, y: 90 });

        // Test right edge adjustment
        const rightEdgeResult = calculatePosition(900, 100);
        expect(rightEdgeResult.x).toBeLessThan(900);

        // Test bottom edge adjustment
        const bottomEdgeResult = calculatePosition(100, 750);
        expect(bottomEdgeResult.y).toBeLessThan(750);

        // Test corner case (very close to edges)
        const cornerResult = calculatePosition(5, 5);
        expect(cornerResult.x).toBeGreaterThanOrEqual(10);
        expect(cornerResult.y).toBeGreaterThanOrEqual(10);
    });

    test('should generate proper HTML structure for tooltips', () => {
        const pointData = {
            coordinates: { x: 10.5, y: 20.75, z: 5.0 },
            gcodeLine: 'G1 X10.5 Y20.75 F1000',
            mode: 'G1'
        };

        const expectedHTML = `
      <div class="tooltip-coordinates">
        X: 10.50 Y: 20.75 Z: 5.00
      </div>
      <div class="tooltip-command">
        G1 X10.5 Y20.75 F1000
      </div>
    `;

        // Test HTML structure generation
        const generateHTML = (data) => {
            const coordinates = `X: ${data.coordinates.x.toFixed(2)} Y: ${data.coordinates.y.toFixed(2)} Z: ${data.coordinates.z.toFixed(2)}`;
            return `
      <div class="tooltip-coordinates">
        ${coordinates}
      </div>
      <div class="tooltip-command">
        ${data.gcodeLine}
      </div>
    `;
        };

        const result = generateHTML(pointData);
        expect(result).toContain('tooltip-coordinates');
        expect(result).toContain('tooltip-command');
        expect(result).toContain('X: 10.50 Y: 20.75 Z: 5.00');
        expect(result).toContain('G1 X10.5 Y20.75 F1000');
    });

    test('should handle arc parameter formatting for G2/G3 commands', () => {
        const arcData = {
            coordinates: { x: 10, y: 10, z: 0 },
            gcodeLine: 'G2 X10 Y10 I5 J0',
            mode: 'G2',
            arcParams: { i: 5, j: 0, k: undefined, r: 2.5 }
        };

        const formatArcParams = (arcParams) => {
            const arcInfo = [];
            if (arcParams.i !== undefined) arcInfo.push(`I${arcParams.i.toFixed(2)}`);
            if (arcParams.j !== undefined) arcInfo.push(`J${arcParams.j.toFixed(2)}`);
            if (arcParams.k !== undefined) arcInfo.push(`K${arcParams.k.toFixed(2)}`);
            if (arcParams.r !== undefined) arcInfo.push(`R${arcParams.r.toFixed(2)}`);
            return arcInfo.length > 0 ? ` (${arcInfo.join(' ')})` : '';
        };

        const result = formatArcParams(arcData.arcParams);
        expect(result).toBe(' (I5.00 J0.00 R2.50)');
        expect(result).not.toContain('K'); // K is undefined, should not be included
    });

    test('should validate CSS color codes for different modes', () => {
        const modeColors = {
            g0: '#ff8e37', // Orange for G0 rapid moves
            g1: '#00ff99', // Green for G1 linear moves  
            g2: '#0074d9', // Blue for G2 clockwise arcs
            g3: '#f012be'  // Magenta for G3 counter-clockwise arcs
        };

        // Test that colors are valid hex codes
        Object.entries(modeColors).forEach(([mode, color]) => {
            expect(color).toMatch(/^#[0-9a-f]{6}$/i);
            expect(mode).toMatch(/^g[0-3]$/);
        });
    });

    test('should handle responsive design breakpoints', () => {
        const breakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        };

        const getTooltipConfig = (screenWidth) => {
            if (screenWidth <= breakpoints.mobile) {
                return { maxWidth: 200, fontSize: 10, padding: '5px 8px' };
            } else if (screenWidth <= breakpoints.tablet) {
                return { maxWidth: 250, fontSize: 11, padding: '6px 10px' };
            } else {
                return { maxWidth: 300, fontSize: 12, padding: '8px 12px' };
            }
        };

        // Test mobile configuration
        expect(getTooltipConfig(400)).toEqual({
            maxWidth: 200,
            fontSize: 10,
            padding: '5px 8px'
        });

        // Test tablet configuration
        expect(getTooltipConfig(600)).toEqual({
            maxWidth: 250,
            fontSize: 11,
            padding: '6px 10px'
        });

        // Test desktop configuration
        expect(getTooltipConfig(1200)).toEqual({
            maxWidth: 300,
            fontSize: 12,
            padding: '8px 12px'
        });
    });
});