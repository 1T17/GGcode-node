/**
 * G-code Parser Module
 *
 * Handles parsing G-code into toolpath data for visualization
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
  N_LINE: /^N\d+\s*/,
  COMMENT: /\([^)]*\)/g, // Match G-code comments in parentheses
};

/**
 * Interpolate arc points for G2/G3 commands
 */
function interpolateArc(start, end, center, isClockwise, segments = 32) {
  const points = [];
  const radius = Math.sqrt(
    (start.x - center.x) ** 2 + (start.y - center.y) ** 2
  );
  const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
  const endAngle = Math.atan2(end.y - center.y, end.x - center.x);
  let deltaAngle = endAngle - startAngle;

  if (isClockwise && deltaAngle > 0) deltaAngle -= Math.PI * 2;
  if (!isClockwise && deltaAngle < 0) deltaAngle += Math.PI * 2;

  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (deltaAngle * i) / segments;
    const zVal =
      start.z === end.z
        ? start.z
        : start.z + ((end.z - start.z) * i) / segments;
    points.push(
      new THREE.Vector3(
        center.x + radius * Math.cos(angle),
        center.y + radius * Math.sin(angle),
        zVal
      )
    );
  }
  return points;
}

/**
 * Optimized G-code parser
 * @param {string} gcode - G-code content
 * @param {Object} initialState - Initial state for parsing (optional)
 * @returns {Object} Parsed toolpath data
 */
export function parseGcodeOptimized(gcode, initialState = {}) {
  try {
    const lines = gcode
      .split(/\r?\n/)
      .map((line) => line.trim().replace(GCODE_REGEX.N_LINE, ''))
      .filter((line) => line.length > 0);

    // Use initial state or defaults - G-code maintains state between lines
    let x = initialState.x !== undefined ? initialState.x : 0;
    let y = initialState.y !== undefined ? initialState.y : 0;
    let z = initialState.z !== undefined ? initialState.z : 0;
    let currentMotionMode = initialState.currentMotionMode || null;
    let anyDrawn = initialState.anyDrawn || false;

    const toolpathPoints = [];
    const toolpathSegments = [];
    const toolpathModes = [];
    const lineMap = [];
    const segmentCounts = { G0: 0, G1: 0, G2: 0, G3: 0 };

    lines.forEach((line, idx) => {
      line = line.trim();

      // Remove G-code comments (anything in parentheses) before processing
      // This prevents comments like "(Arc Spiral Pattern Example)" from being processed as G2 commands
      const lineWithoutComments = line.replace(GCODE_REGEX.COMMENT, '').trim();

      // Debug: Log when comments containing G-codes are filtered
      if (line !== lineWithoutComments && /G[0-9]/.test(line)) {
        //console.log(`[PARSER] Filtered G-code comment: "${line}" -> "${lineWithoutComments}"`);
      }

      // Skip empty lines after comment removal
      if (!lineWithoutComments) {
        return;
      }

      // Find motion mode - G-code remembers the last G mode
      // Use the line without comments to avoid false matches
      const allModes = [...lineWithoutComments.matchAll(GCODE_REGEX.G_MODE)];
      if (allModes.length > 0) {
        currentMotionMode = allModes[allModes.length - 1][0];
      }

      const hasCoords = GCODE_REGEX.HAS_COORDS.test(lineWithoutComments);
      if (!currentMotionMode && !hasCoords) {
        // Track lines that don't create segments to maintain proper indexing
        lineMap.push(idx);
        return;
      }
      if (!currentMotionMode) currentMotionMode = 'G1'; // Default to G1 if no mode specified

      // Parse coordinates - G-code maintains previous values if not specified
      // Use the line without comments to avoid parsing coordinates from comments
      const matchX = lineWithoutComments.match(GCODE_REGEX.X_COORD);
      const matchY = lineWithoutComments.match(GCODE_REGEX.Y_COORD);
      const matchZ = lineWithoutComments.match(GCODE_REGEX.Z_COORD);
      const matchI = lineWithoutComments.match(GCODE_REGEX.I_OFFSET);
      const matchJ = lineWithoutComments.match(GCODE_REGEX.J_OFFSET);
      const matchR = lineWithoutComments.match(GCODE_REGEX.R_RADIUS);

      // G-code behavior: if coordinate not specified, use previous value
      const targetX = matchX ? parseFloat(matchX[1]) : x;
      const targetY = matchY ? parseFloat(matchY[1]) : y;
      const targetZ = matchZ ? parseFloat(matchZ[1]) : z;

      if (currentMotionMode === 'G2' || currentMotionMode === 'G3') {
        // Arc processing
        const arcStart = new THREE.Vector3(x, y, z);
        const arcEnd = new THREE.Vector3(targetX, targetY, targetZ);
        const isClockwise = currentMotionMode === 'G2';
        let arcPoints = [];

        if (matchI && matchJ) {
          const center = new THREE.Vector3(
            x + parseFloat(matchI[1]),
            y + parseFloat(matchJ[1]),
            z
          );
          if (!isNaN(center.x) && !isNaN(center.y)) {
            arcPoints = interpolateArc(arcStart, arcEnd, center, isClockwise);
          }
        } else if (matchR) {
          const dx = targetX - x;
          const dy = targetY - y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const r = Math.abs(parseFloat(matchR[1]));

          if (d > 0 && !isNaN(r) && r > 0) {
            const h = Math.sqrt(Math.max(0, r * r - (d / 2) * (d / 2)));
            const mx = (x + targetX) / 2;
            const my = (y + targetY) / 2;
            const sign =
              (isClockwise ? -1 : 1) * (parseFloat(matchR[1]) >= 0 ? 1 : -1);
            const cx = mx + sign * h * (dy / d);
            const cy = my - sign * h * (dx / d);

            if (!isNaN(cx) && !isNaN(cy)) {
              const center = new THREE.Vector3(cx, cy, z);
              arcPoints = interpolateArc(arcStart, arcEnd, center, isClockwise);
            }
          }
        }

        if (arcPoints.length > 1) {
          for (let i = 1; i < arcPoints.length; i++) {
            toolpathSegments.push([
              arcPoints[i - 1].clone(),
              arcPoints[i].clone(),
            ]);
            toolpathModes.push(currentMotionMode);
            // Map all segments of an arc to the same line number
            // This ensures that all segments of a G2/G3 command are associated with the correct G-code line
            lineMap.push(idx);
            segmentCounts[currentMotionMode]++;
            anyDrawn = true;
          }
          const lastPoint = arcPoints[arcPoints.length - 1].clone();
          x = lastPoint.x;
          y = lastPoint.y;
          z = lastPoint.z;
          toolpathPoints.push(lastPoint.clone());
        } else {
          // Track lines that don't create segments to maintain proper indexing
          lineMap.push(idx);
        }
        return; // Important: return early to avoid processing as linear move
      } else {
        // Linear move - for chunk boundary continuity, we need to ensure the first point
        // of a new chunk starts from the initial state position
        const startPoint = new THREE.Vector3(x, y, z);

        // Update coordinates to target position
        if (matchX) x = parseFloat(matchX[1]);
        if (matchY) y = parseFloat(matchY[1]);
        if (matchZ) z = parseFloat(matchZ[1]);

        const endPoint = new THREE.Vector3(x, y, z);

        // Add the start point (this ensures chunk boundary continuity)
        toolpathPoints.push(startPoint.clone());

        // Add the end point
        toolpathPoints.push(endPoint.clone());

        // Create segment between start and end points
        if (toolpathPoints.length >= 2) {
          const newSegment = [startPoint.clone(), endPoint.clone()];
          toolpathSegments.push(newSegment);
          toolpathModes.push(currentMotionMode);
          lineMap.push(idx);
          segmentCounts[currentMotionMode]++;
          anyDrawn = true;
        }
      }
    });

    // Return final state for continuity with next chunks - G-code state preservation
    const finalState = {
      x,
      y,
      z,
      currentMotionMode,
      anyDrawn,
    };

    //console.log(`[DEBUG PARSER] Created ${toolpathSegments.length} segments from ${lines.length} G-code lines`);
    //console.log(`[DEBUG PARSER] LineMap sample:`, lineMap.slice(0, 10), '...');
    //console.log(`[DEBUG PARSER] Segment counts:`, segmentCounts);

    return {
      toolpathPoints,
      toolpathSegments,
      toolpathModes,
      lineMap,
      segmentCounts,
      anyDrawn,
      finalState,
    };
  } catch (error) {
    console.error('G-code parsing error:', error);
    return {
      toolpathPoints: [],
      toolpathSegments: [],
      toolpathModes: [],
      lineMap: [],
      segmentCounts: { G0: 0, G1: 0, G2: 0, G3: 0 },
      anyDrawn: false,
      finalState: {},
      error: error.message,
    };
  }
}

// Make available globally for backward compatibility
window.parseGcodeOptimized = parseGcodeOptimized;
