/**
 * TooltipManager Class
 *
 * Manages DOM tooltip creation, positioning, and lifecycle for toolpath point display.
 * Handles tooltip appearance with mode-specific color coding and viewport boundary detection.
 */

export class TooltipManager {
  constructor() {
    this.tooltip = null;
    this.isVisible = false;
    this.container = null;
    this.lastMousePosition = { x: 0, y: 0 };

    // Tooltip configuration
    this.config = {
      offset: { x: 15, y: -10 }, // Offset from mouse cursor
      maxWidth: 300,
      fadeDelay: 100, // ms delay before hiding
      hideTimer: null,
    };
  }

  /**
   * Initialize the tooltip manager
   * @param {HTMLElement} container - Container element for positioning context
   */
  initialize(container) {
    //console.log('💬 TooltipManager: Initializing...');
    this.container = container || document.body;
    this.createTooltipElement();
  }

  /**
   * Create the tooltip DOM element with base styling
   */
  createTooltipElement() {
    if (this.tooltip) {
      this.tooltip.remove();
    }

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'toolpath-tooltip';
    this.tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: #ffffff;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: ${this.config.maxWidth}px;
            word-wrap: break-word;
            opacity: 0;
            transition: opacity 0.15s ease-in-out;
            display: none;
        `;

    document.body.appendChild(this.tooltip);
    //console.log('✅ TooltipManager: Tooltip element created');
  }

  /**
   * Show tooltip with point information
   * @param {Object} pointData - Point data containing coordinates and G-code info
   * @param {number} mouseX - Mouse X coordinate
   * @param {number} mouseY - Mouse Y coordinate
   */
  showTooltip(pointData, mouseX, mouseY) {
    //console.log('💬 TooltipManager.showTooltip: Called', {
    //     hasTooltip: !!this.tooltip,
    //     hasPointData: !!pointData,
    //     isVisible: this.isVisible,
    //     mousePos: { x: mouseX, y: mouseY }
    // });

    if (!this.tooltip || !pointData) {
      console.log('❌ TooltipManager: Missing tooltip element or point data');
      return;
    }

    // Clear any pending hide timer
    if (this.config.hideTimer) {
      clearTimeout(this.config.hideTimer);
      this.config.hideTimer = null;
    }

    // Update tooltip content
    this.updateTooltipContent(pointData);

    // Update tooltip position
    this.updatePosition(mouseX, mouseY);

    // Show tooltip
    if (!this.isVisible) {
      //console.log('👁️ TooltipManager: Making tooltip visible...');
      this.tooltip.style.display = 'block';
      // Force reflow before setting opacity for smooth transition
      this.tooltip.offsetHeight;
      this.tooltip.style.opacity = '1';
      this.isVisible = true;
      //console.log('✅ TooltipManager: Tooltip is now visible');
    }

    // Store mouse position
    this.lastMousePosition = { x: mouseX, y: mouseY };
  }

  /**
   * Hide the tooltip with optional delay
   * @param {number} delay - Delay in milliseconds before hiding
   */
  hideTooltip(delay = 0) {
    if (!this.tooltip || !this.isVisible) {
      return;
    }

    // Clear any existing timer
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

  /**
   * Actually hide the tooltip
   */
  performHide() {
    if (this.tooltip && this.isVisible) {
      this.tooltip.style.opacity = '0';
      setTimeout(() => {
        if (this.tooltip) {
          this.tooltip.style.display = 'none';
        }
      }, 150); // Match CSS transition duration
      this.isVisible = false;
    }
    this.config.hideTimer = null;
  }

  /**
   * Update tooltip position relative to mouse coordinates
   * @param {number} mouseX - Mouse X coordinate
   * @param {number} mouseY - Mouse Y coordinate
   */
  updatePosition(mouseX, mouseY) {
    if (!this.tooltip) {
      return;
    }

    // Calculate initial position with offset
    let x = mouseX + this.config.offset.x;
    let y = mouseY + this.config.offset.y;

    // Get tooltip dimensions
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position if tooltip would go off-screen
    if (x + tooltipRect.width > viewportWidth - 10) {
      x = mouseX - tooltipRect.width - Math.abs(this.config.offset.x);
    }

    // Adjust vertical position if tooltip would go off-screen
    if (y + tooltipRect.height > viewportHeight - 10) {
      y = mouseY - tooltipRect.height - Math.abs(this.config.offset.y);
    }

    // Ensure tooltip doesn't go off the left or top edge
    x = Math.max(10, x);
    y = Math.max(10, y);

    // Apply position
    this.tooltip.style.left = `${x}px`;
    this.tooltip.style.top = `${y}px`;
  }

  /**
   * Update tooltip content based on point data
   * @param {Object} pointData - Point data object
   */
  updateTooltipContent(pointData) {
    if (!this.tooltip || !pointData) {
      return;
    }

    const formattedData = this.formatPointData(pointData);

    // Apply mode-specific styling
    this.tooltip.className = `toolpath-tooltip mode-${(pointData.mode || 'g1').toLowerCase()}`;

    // Build tooltip content with enhanced information
    let content = `
            <div class="tooltip-coordinates">
                ${formattedData.coordinates}
            </div>
            <div class="tooltip-command">
                ${formattedData.command}
            </div>
        `;

    // Add arc information for G2/G3 commands
    if (formattedData.arcInfo && formattedData.arcInfo.trim()) {
      content += `
                <div class="tooltip-arc-info">
                    ${formattedData.arcInfo}
                </div>
            `;
    }

    // Add technical information
    if (formattedData.technicalInfo && formattedData.technicalInfo.trim()) {
      content += `
                <div class="tooltip-technical">
                    ${formattedData.technicalInfo}
                </div>
            `;
    }

    this.tooltip.innerHTML = content;
  }

  /**
   * Format point data for display
   * @param {Object} pointData - Raw point data
   * @returns {Object} Formatted display data
   */
  formatPointData(pointData) {
    // Check if point data already has formatted display data from the data extractor
    if (pointData.displayData) {
      return {
        coordinates: pointData.displayData.coordinates,
        command: pointData.displayData.command,
        arcInfo: pointData.displayData.arcInfo || '',
        technicalInfo: pointData.displayData.technicalInfo || '',
        mode: pointData.displayData.mode || pointData.mode,
        modeConfig: pointData.displayData.modeConfig,
      };
    }

    // Fallback to legacy formatting for backward compatibility
    const coordinates = pointData.coordinates || pointData.point;

    // Format coordinates with appropriate precision
    const formatCoord = (value) => {
      if (typeof value !== 'number' || isNaN(value)) {
        return '0.00';
      }
      return value.toFixed(2);
    };

    const formattedCoords = coordinates
      ? `X: ${formatCoord(coordinates.x)} Y: ${formatCoord(coordinates.y)} Z: ${formatCoord(coordinates.z)}`
      : 'Coordinates unavailable';

    // Format G-code command
    let command = pointData.gcodeLine || pointData.command || 'Unknown command';

    // Clean up command string
    command = command.trim();

    // Add mode prefix if not present
    if (
      pointData.mode &&
      !command.toLowerCase().startsWith(pointData.mode.toLowerCase())
    ) {
      command = `${pointData.mode.toUpperCase()}: ${command}`;
    }

    return {
      coordinates: formattedCoords,
      command: command,
      arcInfo: '',
      technicalInfo: '',
      mode: pointData.mode,
    };
  }

  /**
   * Check if tooltip is currently visible
   * @returns {boolean} Visibility state
   */
  isTooltipVisible() {
    return this.isVisible;
  }

  /**
   * Get current mouse position
   * @returns {Object} Mouse position {x, y}
   */
  getLastMousePosition() {
    return { ...this.lastMousePosition };
  }

  /**
   * Update configuration
   * @param {Object} newConfig - Configuration updates
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };

    // Update tooltip max-width if changed
    if (newConfig.maxWidth && this.tooltip) {
      this.tooltip.style.maxWidth = `${newConfig.maxWidth}px`;
    }
  }

  /**
   * Dispose of the tooltip manager and clean up resources
   */
  dispose() {
    // Clear any pending timers
    if (this.config.hideTimer) {
      clearTimeout(this.config.hideTimer);
      this.config.hideTimer = null;
    }

    // Remove tooltip element
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }

    // Reset state
    this.isVisible = false;
    this.container = null;
    this.lastMousePosition = { x: 0, y: 0 };
  }
}

export default TooltipManager;
