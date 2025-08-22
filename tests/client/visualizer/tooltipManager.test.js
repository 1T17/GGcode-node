/**
 * TooltipManager Tests
 * 
 * Tests for tooltip creation, positioning, content formatting, and lifecycle management.
 */

// Mock DOM environment for testing
const mockElement = {
    style: {},
    className: '',
    innerHTML: '',
    id: '',
    appendChild: jest.fn(),
    remove: jest.fn(),
    getBoundingClientRect: jest.fn(() => ({
        width: 200,
        height: 60,
        top: 0,
        left: 0,
        right: 200,
        bottom: 60
    })),
    offsetHeight: 60
};

const mockDocument = {
    createElement: jest.fn(() => ({ ...mockElement })),
    body: {
        appendChild: jest.fn(),
        contains: jest.fn(() => false)
    },
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => [])
};

const mockWindow = {
    innerWidth: 1024,
    innerHeight: 768,
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout
};

// Mock the TooltipManager class for testing
class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.isVisible = false;
        this.container = null;
        this.lastMousePosition = { x: 0, y: 0 };

        this.config = {
            offset: { x: 15, y: -10 },
            maxWidth: 300,
            fadeDelay: 100,
            hideTimer: null
        };
    }

    initialize(container) {
        this.container = container || mockDocument.body;
        this.createTooltipElement();
    }

    createTooltipElement() {
        if (this.tooltip) {
            this.tooltip.remove();
        }
        this.tooltip = mockDocument.createElement('div');
        this.tooltip.className = 'toolpath-tooltip';
        mockDocument.body.appendChild(this.tooltip);
    }

    showTooltip(pointData, mouseX, mouseY) {
        if (!this.tooltip || !pointData) {
            return;
        }

        if (this.config.hideTimer) {
            clearTimeout(this.config.hideTimer);
            this.config.hideTimer = null;
        }

        this.updateTooltipContent(pointData);
        this.updatePosition(mouseX, mouseY);

        if (!this.isVisible) {
            this.tooltip.style.display = 'block';
            this.tooltip.style.opacity = '1';
            this.isVisible = true;
        }

        this.lastMousePosition = { x: mouseX, y: mouseY };
    }

    hideTooltip(delay = 0) {
        if (!this.tooltip || !this.isVisible) {
            return;
        }

        if (this.config.hideTimer) {
            clearTimeout(this.config.hideTimer);
        }

        if (delay > 0) {
            this.config.hideTimer = setTimeout(() => {
                this.performHide();
            }, delay);
        } else {
            this.performHide();
        }
    }

    performHide() {
        if (this.tooltip && this.isVisible) {
            this.tooltip.style.opacity = '0';
            setTimeout(() => {
                if (this.tooltip) {
                    this.tooltip.style.display = 'none';
                }
            }, 150);
            this.isVisible = false;
        }
        this.config.hideTimer = null;
    }

    updatePosition(mouseX, mouseY) {
        if (!this.tooltip) {
            return;
        }

        let x = mouseX + this.config.offset.x;
        let y = mouseY + this.config.offset.y;

        const tooltipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = mockWindow.innerWidth;
        const viewportHeight = mockWindow.innerHeight;

        if (x + tooltipRect.width > viewportWidth - 10) {
            x = mouseX - tooltipRect.width - Math.abs(this.config.offset.x);
        }

        if (y + tooltipRect.height > viewportHeight - 10) {
            y = mouseY - tooltipRect.height - Math.abs(this.config.offset.y);
        }

        x = Math.max(10, x);
        y = Math.max(10, y);

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    updateTooltipContent(pointData) {
        if (!this.tooltip || !pointData) {
            return;
        }

        const formattedData = this.formatPointData(pointData);

        this.tooltip.className = `toolpath-tooltip mode-${pointData.mode.toLowerCase()}`;

        this.tooltip.innerHTML = `
      <div class="tooltip-coordinates">
        ${formattedData.coordinates}
      </div>
      <div class="tooltip-command">
        ${formattedData.command}
      </div>
    `;
    }

    formatPointData(pointData) {
        const coordinates = pointData.coordinates || pointData.point;

        const formatCoord = (value) => {
            if (typeof value !== 'number' || isNaN(value)) {
                return '0.00';
            }
            return value.toFixed(2);
        };

        const formattedCoords = coordinates ?
            `X: ${formatCoord(coordinates.x)} Y: ${formatCoord(coordinates.y)} Z: ${formatCoord(coordinates.z)}` :
            'Coordinates unavailable';

        let command = pointData.gcodeLine || pointData.command || 'Unknown command';
        command = command.trim();

        if (pointData.mode && !command.toLowerCase().startsWith(pointData.mode.toLowerCase())) {
            command = `${pointData.mode.toUpperCase()}: ${command}`;
        }

        if ((pointData.mode === 'G2' || pointData.mode === 'G3') && pointData.arcParams) {
            const arcInfo = [];
            if (pointData.arcParams.i !== undefined) arcInfo.push(`I${formatCoord(pointData.arcParams.i)}`);
            if (pointData.arcParams.j !== undefined) arcInfo.push(`J${formatCoord(pointData.arcParams.j)}`);
            if (pointData.arcParams.k !== undefined) arcInfo.push(`K${formatCoord(pointData.arcParams.k)}`);
            if (pointData.arcParams.r !== undefined) arcInfo.push(`R${formatCoord(pointData.arcParams.r)}`);

            if (arcInfo.length > 0) {
                command += ` (${arcInfo.join(' ')})`;
            }
        }

        return {
            coordinates: formattedCoords,
            command: command
        };
    }

    isTooltipVisible() {
        return this.isVisible;
    }

    getLastMousePosition() {
        return { ...this.lastMousePosition };
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        if (newConfig.maxWidth && this.tooltip) {
            this.tooltip.style.maxWidth = `${newConfig.maxWidth}px`;
        }
    }

    dispose() {
        if (this.config.hideTimer) {
            clearTimeout(this.config.hideTimer);
            this.config.hideTimer = null;
        }

        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }

        this.isVisible = false;
        this.container = null;
        this.lastMousePosition = { x: 0, y: 0 };
    }
}

describe('TooltipManager', () => {
    let tooltipManager;
    let mockContainer;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Create mock container
        mockContainer = { ...mockElement };
        mockContainer.id = 'test-container';

        // Create tooltip manager instance
        tooltipManager = new TooltipManager();
    });

    afterEach(() => {
        if (tooltipManager) {
            tooltipManager.dispose();
        }
    });

    describe('Initialization', () => {
        test('should initialize with default configuration', () => {
            expect(tooltipManager.tooltip).toBeNull();
            expect(tooltipManager.isVisible).toBe(false);
            expect(tooltipManager.container).toBeNull();
        });

        test('should create tooltip element on initialization', () => {
            tooltipManager.initialize(mockContainer);

            expect(tooltipManager.tooltip).not.toBeNull();
            expect(tooltipManager.container).toBe(mockContainer);
            expect(mockDocument.createElement).toHaveBeenCalledWith('div');
        });

        test('should replace existing tooltip on re-initialization', () => {
            tooltipManager.initialize(mockContainer);
            const firstTooltip = tooltipManager.tooltip;

            tooltipManager.initialize(mockContainer);
            const secondTooltip = tooltipManager.tooltip;

            expect(firstTooltip).not.toBe(secondTooltip);
            expect(firstTooltip.remove).toHaveBeenCalled();
        });
    });

    describe('Tooltip Display', () => {
        beforeEach(() => {
            tooltipManager.initialize(mockContainer);
        });

        test('should show tooltip with point data', () => {
            const pointData = {
                coordinates: { x: 10.5, y: 20.75, z: 5.0 },
                gcodeLine: 'G1 X10.5 Y20.75 F1000',
                mode: 'G1'
            };

            tooltipManager.showTooltip(pointData, 100, 100);

            expect(tooltipManager.isVisible).toBe(true);
            expect(tooltipManager.tooltip.style.display).toBe('block');
            expect(tooltipManager.tooltip.innerHTML).toContain('X: 10.50 Y: 20.75 Z: 5.00');
            expect(tooltipManager.tooltip.innerHTML).toContain('G1 X10.5 Y20.75 F1000');
        });

        test('should hide tooltip', () => {
            const pointData = {
                coordinates: { x: 10, y: 20, z: 5 },
                gcodeLine: 'G1 X10 Y20',
                mode: 'G1'
            };

            tooltipManager.showTooltip(pointData, 100, 100);
            expect(tooltipManager.isVisible).toBe(true);

            tooltipManager.hideTooltip();
            expect(tooltipManager.tooltip.style.opacity).toBe('0');
        });

        test('should not show tooltip with invalid data', () => {
            tooltipManager.showTooltip(null, 100, 100);
            expect(tooltipManager.isVisible).toBe(false);

            tooltipManager.showTooltip(undefined, 100, 100);
            expect(tooltipManager.isVisible).toBe(false);
        });
    });

    describe('Content Formatting', () => {
        beforeEach(() => {
            tooltipManager.initialize(mockContainer);
        });

        test('should format G0 rapid move data correctly', () => {
            const pointData = {
                coordinates: { x: 0, y: 0, z: 10 },
                gcodeLine: 'G0 Z10',
                mode: 'G0'
            };

            const formatted = tooltipManager.formatPointData(pointData);

            expect(formatted.coordinates).toBe('X: 0.00 Y: 0.00 Z: 10.00');
            expect(formatted.command).toBe('G0 Z10');
        });

        test('should format G1 linear move data correctly', () => {
            const pointData = {
                coordinates: { x: 15.123, y: 25.456, z: 2.789 },
                gcodeLine: 'G1 X15.123 Y25.456 Z2.789 F1500',
                mode: 'G1'
            };

            const formatted = tooltipManager.formatPointData(pointData);

            expect(formatted.coordinates).toBe('X: 15.12 Y: 25.46 Z: 2.79');
            expect(formatted.command).toBe('G1 X15.123 Y25.456 Z2.789 F1500');
        });

        test('should format G2 arc data with arc parameters', () => {
            const pointData = {
                coordinates: { x: 10, y: 10, z: 0 },
                gcodeLine: 'G2 X10 Y10 I5 J0',
                mode: 'G2',
                arcParams: { i: 5, j: 0 }
            };

            const formatted = tooltipManager.formatPointData(pointData);

            expect(formatted.coordinates).toBe('X: 10.00 Y: 10.00 Z: 0.00');
            expect(formatted.command).toContain('G2 X10 Y10 I5 J0');
            expect(formatted.command).toContain('(I5.00 J0.00)');
        });

        test('should handle missing coordinate data gracefully', () => {
            const pointData = {
                gcodeLine: 'G1 X10 Y20',
                mode: 'G1'
            };

            const formatted = tooltipManager.formatPointData(pointData);

            expect(formatted.coordinates).toBe('Coordinates unavailable');
            expect(formatted.command).toBe('G1 X10 Y20');
        });

        test('should handle invalid coordinate values', () => {
            const pointData = {
                coordinates: { x: NaN, y: null, z: undefined },
                gcodeLine: 'G1',
                mode: 'G1'
            };

            const formatted = tooltipManager.formatPointData(pointData);

            expect(formatted.coordinates).toBe('X: 0.00 Y: 0.00 Z: 0.00');
        });
    });

    describe('Positioning', () => {
        beforeEach(() => {
            tooltipManager.initialize(mockContainer);
        });

        test('should position tooltip with default offset', () => {
            tooltipManager.updatePosition(100, 100);

            expect(tooltipManager.tooltip.style.left).toBe('115px'); // 100 + 15 offset
            expect(tooltipManager.tooltip.style.top).toBe('90px');   // 100 - 10 offset
        });

        test('should adjust position when tooltip would go off right edge', () => {
            tooltipManager.updatePosition(900, 100); // Near right edge

            const left = parseInt(tooltipManager.tooltip.style.left);
            expect(left).toBeLessThan(900); // Should be positioned to the left of cursor
        });

        test('should adjust position when tooltip would go off bottom edge', () => {
            tooltipManager.updatePosition(100, 750); // Near bottom edge

            const top = parseInt(tooltipManager.tooltip.style.top);
            expect(top).toBeLessThan(750); // Should be positioned above cursor
        });

        test('should not position tooltip off left or top edges', () => {
            tooltipManager.updatePosition(5, 5); // Very close to edges

            const left = parseInt(tooltipManager.tooltip.style.left);
            const top = parseInt(tooltipManager.tooltip.style.top);

            expect(left).toBeGreaterThanOrEqual(10);
            expect(top).toBeGreaterThanOrEqual(10);
        });
    });

    describe('Mode-Specific Styling', () => {
        beforeEach(() => {
            tooltipManager.initialize(mockContainer);
        });

        test('should apply G0 mode styling', () => {
            const pointData = {
                coordinates: { x: 0, y: 0, z: 0 },
                gcodeLine: 'G0 X0 Y0',
                mode: 'G0'
            };

            tooltipManager.showTooltip(pointData, 100, 100);

            expect(tooltipManager.tooltip.className).toContain('mode-g0');
        });

        test('should apply G1 mode styling', () => {
            const pointData = {
                coordinates: { x: 10, y: 10, z: 0 },
                gcodeLine: 'G1 X10 Y10',
                mode: 'G1'
            };

            tooltipManager.showTooltip(pointData, 100, 100);

            expect(tooltipManager.tooltip.className).toContain('mode-g1');
        });

        test('should apply G2 mode styling', () => {
            const pointData = {
                coordinates: { x: 10, y: 10, z: 0 },
                gcodeLine: 'G2 X10 Y10 I5 J0',
                mode: 'G2'
            };

            tooltipManager.showTooltip(pointData, 100, 100);

            expect(tooltipManager.tooltip.className).toContain('mode-g2');
        });

        test('should apply G3 mode styling', () => {
            const pointData = {
                coordinates: { x: 10, y: 10, z: 0 },
                gcodeLine: 'G3 X10 Y10 I5 J0',
                mode: 'G3'
            };

            tooltipManager.showTooltip(pointData, 100, 100);

            expect(tooltipManager.tooltip.className).toContain('mode-g3');
        });
    });

    describe('Configuration', () => {
        beforeEach(() => {
            tooltipManager.initialize(mockContainer);
        });

        test('should update configuration', () => {
            const newConfig = {
                maxWidth: 400,
                offset: { x: 20, y: -15 }
            };

            tooltipManager.updateConfig(newConfig);

            expect(tooltipManager.config.maxWidth).toBe(400);
            expect(tooltipManager.config.offset.x).toBe(20);
            expect(tooltipManager.config.offset.y).toBe(-15);
            expect(tooltipManager.tooltip.style.maxWidth).toBe('400px');
        });
    });

    describe('Lifecycle Management', () => {
        test('should dispose properly', () => {
            tooltipManager.initialize(mockContainer);
            const tooltip = tooltipManager.tooltip;

            tooltipManager.dispose();

            expect(tooltipManager.tooltip).toBeNull();
            expect(tooltipManager.isVisible).toBe(false);
            expect(tooltipManager.container).toBeNull();
            expect(tooltip.remove).toHaveBeenCalled();
        });

        test('should handle disposal when not initialized', () => {
            expect(() => tooltipManager.dispose()).not.toThrow();
        });

        test('should clear timers on disposal', () => {
            tooltipManager.initialize(mockContainer);

            // Show tooltip first to make it visible
            const pointData = {
                coordinates: { x: 10, y: 10, z: 0 },
                gcodeLine: 'G1 X10 Y10',
                mode: 'G1'
            };
            tooltipManager.showTooltip(pointData, 100, 100);

            // Set up a hide timer
            tooltipManager.hideTooltip(1000);
            expect(tooltipManager.config.hideTimer).not.toBeNull();

            tooltipManager.dispose();
            expect(tooltipManager.config.hideTimer).toBeNull();
        });
    });
});