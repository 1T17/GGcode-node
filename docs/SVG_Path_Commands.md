# SVG Path Commands Integration with GGcode

This document outlines SVG Path Commands and their integration into GGcode for CNC machining operations.

## SVG Path Commands Overview

SVG path commands define the geometry of shapes and can be converted to G-code for CNC operations.

### Move Commands

**M → moveto (absolute)**
- Moves the drawing pen to a new position without drawing
- Parameters: x, y coordinates
- Example: `M 100 200`

**m → moveto (relative)**
- Moves the drawing pen relative to the current position
- Parameters: x, y offsets
- Example: `m 10 20` (moves 10 units right, 20 units down)

### Line Commands

**L → lineto (absolute)**
- Draws a straight line to the specified coordinates
- Parameters: x, y coordinates
- Example: `L 150 250`

**l → lineto (relative)**
- Draws a straight line relative to the current position
- Parameters: x, y offsets
- Example: `l 30 40` (line 30 units right, 40 units up)

**H → horizontal lineto (absolute)**
- Draws a horizontal line to the specified x-coordinate
- Parameters: x coordinate (y remains the same)
- Example: `H 300`

**h → horizontal lineto (relative)**
- Draws a horizontal line relative to current x position
- Parameters: x offset
- Example: `h 50` (50 units to the right)

**V → vertical lineto (absolute)**
- Draws a vertical line to the specified y-coordinate
- Parameters: y coordinate (x remains the same)
- Example: `V 400`

**v → vertical lineto (relative)**
- Draws a vertical line relative to current y position
- Parameters: y offset
- Example: `v -20` (20 units down)

### Cubic Bézier Curve Commands

**C → cubic Bézier curve (absolute)**
- Draw cubic Bézier curve using two control points and endpoint
- Parameters: control1_x control1_y control2_x control2_y end_x end_y
- Example: `C 200 300 250 350 300 400`

**c → cubic Bézier curve (relative)**
- Draw cubic Bézier curve relative to current position
- Parameters: control1_dx control1_dy control2_dx control2_dy end_dx end_dy

**S → smooth cubic Bézier curve (absolute)**
- Draw smooth cubic Bézier curve (inferred first control point)
- Parameters: control2_x control2_y end_x end_y (first control point reflected)

**s → smooth cubic Bézier curve (relative)**
- Draw smooth cubic Bézier curve relative to current position

### Quadratic Bézier Curve Commands

**Q → quadratic Bézier curve (absolute)**
- Draw quadratic Bézier curve using one control point and endpoint
- Parameters: control_x control_y end_x end_y
- Example: `Q 200 300 250 350`

**q → quadratic Bézier curve (relative)**
- Draw quadratic Bézier curve relative
- Parameters: control_dx control_dy end_dx end_dy

**T → smooth quadratic Bézier curve (absolute)**
- Draw smooth quadratic Bézier curve (inferred control point)

**t → smooth quadratic Bézier curve (relative)**
- Draw smooth quadratic Bézier curve relative to current position

### Elliptical Arc Commands

**A → arc (absolute)**
- Draw elliptical arc
- Parameters: rx ry rotation large_arc_flag sweep_flag x y
- Example: `A 30 50 0 0 1 200 300`

**a → arc (relative)**
- Draw elliptical arc relative to current position
- Parameters: rx ry rotation large_arc_flag sweep_flag dx dy

### Close Path Commands

**Z → closepath**
- Close the current path by drawing a line back to the start point
- No parameters required
- Example: `Z`

**z → closepath**
- Same as Z, but lowercase (same functionality)
- Example: `z`

## Integration with GGcode

### Step 1: Recreate Functions in GGcode Format

As step 1, we'll recreate the basic SVG path commands as GGcode functions that generate G-code output for CNC operations.

```gcode
// GGcode SVG Path Functions - Step 1 Implementation

// ── G-code File Variables ──
let id = 1000
let nline = 1
let decimalpoint = 3

// Global positioning
let current_x = 0
let current_y = 0
let safe_z = 2
let cut_z = -1

// Move Commands
function svg_moveto(x, y, absolute = true) {
    if absolute {
        current_x = x
        current_y = y
    } else {
        current_x = current_x + x
        current_y = current_y + y
    }
    G0 Z[safe_z]
    G0 X[current_x] Y[current_y]
}

function svg_moveto_rel(dx, dy) {
    svg_moveto(dx, dy, false)
}

// Line Commands
function svg_lineto(x, y, absolute = true) {
    if absolute {
        current_x = x
        current_y = y
    } else {
        current_x = current_x + x
        current_y = current_y + y
    }
    G0 Z[cut_z]
    G1 X[current_x] Y[current_y]
}

function svg_lineto_rel(dx, dy) {
    svg_lineto(dx, dy, false)
}

function svg_horizontal_lineto(x, absolute = true) {
    if absolute {
        current_x = x
    } else {
        current_x = current_x + x
    }
    G0 Z[cut_z]
    G1 X[current_x] Y[current_y]
}

function svg_horizontal_lineto_rel(dx) {
    svg_horizontal_lineto(dx, false)
}

function svg_vertical_lineto(y, absolute = true) {
    if absolute {
        current_y = y
    } else {
        current_y = current_y + y
    }
    G0 Z[cut_z]
    G1 X[current_x] Y[current_y]
}

function svg_vertical_lineto_rel(dy) {
    svg_vertical_lineto(dy, false)
}

// Close Path
function svg_closepath() {
    // This would need to remember the path start point
    // For now, we'll implement a simple return to origin
    G0 Z[safe_z]
    G0 X[0] Y[0]
}

// Basic Example Usage
// M 100 100 L 200 150 H 300 V 200 L 150 250 Z
G0 Z[safe_z]
G0 X[0] Y[0]  // Initialize

svg_moveto(100, 100, true)
svg_lineto(200, 150, true)
svg_horizontal_lineto(300, true)
svg_vertical_lineto(200, true)
svg_lineto(150, 250, true)
svg_closepath()
```

### Future Steps

1. Implement Bézier curve approximations using G2/G3 arcs or line segments
2. Add elliptical arc support using G2/G3 arcs
3. Create SVG path parser that automatically converts path strings to GGcode
4. Optimize generated G-code for CNC efficiency
5. Add interactive visualization for SVG to G-code conversion

### Notes

- All coordinates assume same units (mm or inches) as your machine
- Z-safe heights should be configured based on your material
- Feed rates and tool settings are not included in basic implementation
- Bézier and arc functions will require mathematical approximation for G-code