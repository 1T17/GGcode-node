/**
 * Point Data Extraction and Formatting Utilities
 *
 * Provides utilities to extract coordinate and G-code command information from toolpath data.
 * Supports all G-code modes (G0, G1, G2, G3) with appropriate formatting including arc parameters.
 */

export class PointDataExtractor {
  constructor() {
    // G-code parsing regex patterns
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
      N_LINE: /^N\d+\s*/,
    };

    // Mode-specific formatting configuration
    this.modeConfig = {
      G0: {
        name: 'Rapid Move',
        color: '#ff8e37',
        description: 'Rapid positioning move',
      },
      G1: {
        name: 'Linear Move',
        color: '#00ff99',
        description: 'Linear interpolation move',
      },
      G2: {
        name: 'Clockwise Arc',
        color: '#0074d9',
        description: 'Clockwise circular interpolation',
      },
      G3: {
        name: 'Counter-Clockwise Arc',
        color: '#f012be',
        description: 'Counter-clockwise circular interpolation',
      },
    };
  }

  /**
   * Extract comprehensive point data from toolpath information
   * @param {number} segmentIndex - Index in toolpath segments
   * @param {THREE.Vector3} coordinates - 3D coordinates
   * @param {string} mode - G-code mode (G0, G1, G2, G3)
   * @param {number} lineIndex - Line number in original G-code
   * @param {Array} gcodeLines - Array of original G-code lines
   * @returns {Object} Comprehensive point data object
   */
  extractPointData(segmentIndex, coordinates, mode, lineIndex, gcodeLines) {
    const originalLine = this.getOriginalGcodeLine(lineIndex, gcodeLines);
    const parsedParams = this.parseGcodeParameters(originalLine);
    const arcParams = this.extractArcParameters(
      mode,
      originalLine,
      coordinates
    );

    const pointData = {
      segmentIndex,
      coordinates: coordinates.clone(),
      mode: mode || 'G1',
      lineIndex,
      originalLine,
      gcodeLine: this.formatGcodeCommand(
        originalLine,
        mode,
        coordinates,
        parsedParams
      ),
      timestamp: Date.now(),
      parameters: parsedParams,
      arcParams: arcParams,
      modeConfig: this.modeConfig[mode] || this.modeConfig.G1,
      displayData: null,
    };

    pointData.displayData = this.formatForDisplay(pointData);
    return pointData;
  }

  /**
   * Get the original G-code line, handling edge cases
   * @param {number} lineIndex - Line index in G-code array
   * @param {Array} gcodeLines - Array of G-code lines
   * @returns {string} Original G-code line
   */
  getOriginalGcodeLine(lineIndex, gcodeLines) {
    if (
      !gcodeLines ||
      !Array.isArray(gcodeLines) ||
      lineIndex < 0 ||
      lineIndex >= gcodeLines.length
    ) {
      return '';
    }
    let line = gcodeLines[lineIndex] || '';
    line = line.trim().replace(this.GCODE_REGEX.N_LINE, '');
    return line;
  }

  /**
   * Parse G-code parameters from a line
   * @param {string} line - G-code line to parse
   * @returns {Object} Parsed parameters
   */
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

    return params;
  }

  /**
   * Extract arc parameters for G2/G3 commands
   * @param {string} mode - G-code mode
   * @param {string} line - Original G-code line
   * @param {THREE.Vector3} coordinates - End point coordinates
   * @returns {Object|null} Arc parameters or null for non-arc moves
   */
  extractArcParameters(mode, line, coordinates) {
    if (mode !== 'G2' && mode !== 'G3') return null;

    const arcParams = {
      mode,
      isClockwise: mode === 'G2',
      endPoint: coordinates.clone(),
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

  /**
   * Format G-code command for display
   * @param {string} originalLine - Original G-code line
   * @param {string} mode - G-code mode
   * @param {THREE.Vector3} coordinates - Coordinates
   * @param {Object} params - Parsed parameters
   * @returns {string} Formatted command
   */
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

  /**
   * Format point data for display in tooltips
   * @param {Object} pointData - Point data object
   * @returns {Object} Formatted display data
   */
  formatForDisplay(pointData) {
    const coordinates = pointData.coordinates;
    const formatCoord = (value) => {
      if (typeof value !== 'number' || isNaN(value)) return '0.00';
      return value.toFixed(2);
    };

    const formattedCoords = coordinates
      ? `X: ${formatCoord(coordinates.x)} Y: ${formatCoord(coordinates.y)} Z: ${formatCoord(coordinates.z)}`
      : 'Coordinates unavailable';

    let command = pointData.gcodeLine || 'Unknown command';
    command = command.trim();

    if (pointData.modeConfig) {
      command = `${pointData.modeConfig.name} - ${command}`;
    }

    let arcInfo = '';
    if (
      pointData.arcParams &&
      (pointData.mode === 'G2' || pointData.mode === 'G3')
    ) {
      arcInfo = this.formatArcParameters(pointData.arcParams);
    }

    const technicalInfo = this.formatTechnicalInfo(pointData);

    return {
      coordinates: formattedCoords,
      command: command,
      arcInfo: arcInfo,
      technicalInfo: technicalInfo,
      mode: pointData.mode,
      modeConfig: pointData.modeConfig,
    };
  }

  /**
   * Format arc parameters for display
   * @param {Object} arcParams - Arc parameters object
   * @returns {string} Formatted arc information
   */
  formatArcParameters(arcParams) {
    if (!arcParams) return '';

    const parts = [];
    if (arcParams.i !== undefined) parts.push(`I${arcParams.i.toFixed(3)}`);
    if (arcParams.j !== undefined) parts.push(`J${arcParams.j.toFixed(3)}`);
    if (arcParams.k !== undefined) parts.push(`K${arcParams.k.toFixed(3)}`);
    if (arcParams.r !== undefined) parts.push(`R${arcParams.r.toFixed(3)}`);

    return parts.length > 0 ? `Arc: ${parts.join(', ')}` : '';
  }

  /**
   * Format technical information for display
   * @param {Object} pointData - Point data object
   * @returns {string} Formatted technical information
   */
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

  /**
   * Get mode configuration for a specific G-code mode
   * @param {string} mode - G-code mode
   * @returns {Object} Mode configuration
   */
  getModeConfig(mode) {
    return this.modeConfig[mode] || this.modeConfig.G1;
  }

  /**
   * Get all supported modes
   * @returns {Array} Array of supported mode strings
   */
  getSupportedModes() {
    return Object.keys(this.modeConfig);
  }
}

export default PointDataExtractor;
