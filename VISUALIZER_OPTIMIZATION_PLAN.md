# CNC Visualizer Performance Optimization Plan

## Overview
This document outlines the comprehensive optimization strategy for reducing lag in the CNC visualizer. Each optimization includes implementation details, testing procedures, and expected performance improvements.

## 🎯 Optimization Tasks

### Phase 1: Quick Wins (Immediate Impact)

#### Task 1.1: Adaptive Rendering System
**Goal**: Reduce CPU usage by implementing intelligent frame rate limiting

**Implementation**:
- Add adaptive rendering toggle to GcodeVisualizer class
- Implement frame skipping based on camera movement
- Add target FPS configuration option
- Skip rendering when no changes detected

**Files to Modify**:
- `src/client/js/visualizer/core.js` - Add adaptive rendering logic
- `src/client/js/visualizer/index.js` - Add configuration options

**Code Changes**:
```javascript
// In GcodeVisualizer class
setAdaptiveRendering(enabled, targetFPS = 30) {
    this.adaptiveRendering = enabled;
    this.targetFPS = targetFPS;
    this.frameInterval = 1000 / targetFPS;
    this.lastFrameTime = 0;
    this.lastCameraPosition = new THREE.Vector3();
    this.cameraMoveThreshold = 0.1;
}

render() {
    const now = performance.now();
    const shouldRender = this.shouldRenderFrame(now);

    if (!shouldRender) return;

    this.lastFrameTime = now;
    this.lastCameraPosition.copy(this.camera.position);
    // ... existing render code
}
```

**Testing**:
1. Load medium-sized G-code file (5-10MB)
2. Monitor CPU usage with Chrome DevTools Performance tab
3. Compare CPU usage with/without adaptive rendering enabled
4. Test camera movement responsiveness
5. Verify 30fps target vs 60fps baseline
6. Check memory usage doesn't increase

**Expected Results**:
- 30-50% reduction in CPU usage
- Maintained visual quality
- Responsive camera controls

---

#### Task 1.2: Frustum Culling Implementation
**Goal**: Only render objects visible in camera view

**Implementation**:
- Add frustum calculation to render loop
- Hide/show objects based on camera visibility
- Implement bounding box testing
- Add debug visualization option

**Files to Modify**:
- `src/client/js/visualizer/core.js` - Add frustum culling logic

**Code Changes**:
```javascript
initializeFrustumCulling() {
    this.frustum = new THREE.Frustum();
    this.frustumMatrix = new THREE.Matrix4();
    this.culledObjects = new Set();
}

updateFrustum() {
    this.frustumMatrix.multiplyMatrices(
        this.camera.projectionMatrix,
        this.camera.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(this.frustumMatrix);
}

isObjectVisible(object) {
    if (!object.geometry) return true;

    // Calculate object bounds
    const box = new THREE.Box3().setFromObject(object);
    return this.frustum.intersectsBox(box);
}

render() {
    this.updateFrustum();

    // Apply culling to scene objects
    this.scene.traverse((child) => {
        if (child.isMesh && child.geometry) {
            const wasVisible = child.visible;
            child.visible = this.isObjectVisible(child);

            if (wasVisible !== child.visible) {
                if (child.visible) {
                    this.culledObjects.delete(child);
                } else {
                    this.culledObjects.add(child);
                }
            }
        }
    });

    this.renderer.render(this.scene, this.camera);
}
```

**Testing**:
1. Load large G-code file with many segments
2. Zoom out to see overall model
3. Monitor frame rate and draw calls
4. Move camera to different angles
5. Compare with/without frustum culling
6. Verify no visual artifacts
7. Test with different model sizes

**Expected Results**:
- 40-60% performance improvement for large models
- Reduced GPU memory usage
- Maintained visual quality when objects are visible

---

#### Task 1.3: Renderer Optimization
**Goal**: Optimize Three.js renderer settings for performance

**Implementation**:
- Configure optimal pixel ratio
- Disable unnecessary features
- Enable hardware acceleration
- Optimize shadow and lighting settings

**Files to Modify**:
- `src/client/js/visualizer/core.js` - Update renderer initialization

**Code Changes**:
```javascript
initializeOptimizedRenderer() {
    // Calculate optimal pixel ratio
    const optimalPixelRatio = Math.min(window.devicePixelRatio, 1.5);

    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        precision: 'mediump' // Use medium precision for better performance
    });

    this.renderer.setPixelRatio(optimalPixelRatio);
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

    // Optimize renderer settings
    this.renderer.shadowMap.enabled = false; // Disable shadows for CNC visualization
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Enable GPU optimizations if available
    if (this.renderer.capabilities.isWebGL2) {
        console.log('WebGL2 detected - enabling advanced features');
    }

    // Set clear color
    this.renderer.setClearColor(0x000000, 0);
}
```

**Testing**:
1. Compare rendering quality at different pixel ratios
2. Monitor GPU memory usage
3. Test on different hardware configurations
4. Verify visual quality is maintained
5. Check frame rate improvements
6. Test with different browsers

**Expected Results**:
- 20-30% rendering performance improvement
- Reduced GPU memory usage
- Better cross-browser compatibility

---

### Phase 2: Medium Impact Optimizations

#### Task 2.1: Geometry Instancing System
**Goal**: Reduce draw calls by using instanced rendering

**Implementation**:
- Create InstancedMesh for repeated geometries
- Group line segments by type (G0, G1, G2, G3)
- Use matrix transformations for positioning
- Implement batching system

**Files to Modify**:
- `src/client/js/visualizer/core.js` - Add instancing logic
- Create `src/client/js/visualizer/geometry-manager.js`

**Code Changes**:
```javascript
// In geometry-manager.js
createInstancedLineSystem(segments, mode) {
    const lineCount = segments.length;
    if (lineCount === 0) return null;

    // Create base geometry (cylinder for lines)
    const radius = 0.05;
    const geometry = new THREE.CylinderGeometry(radius, radius, 1, 6);

    // Create material based on mode
    const material = new THREE.MeshBasicMaterial({
        color: this.getModeColor(mode),
        transparent: true,
        opacity: this.getModeOpacity(mode)
    });

    // Create instanced mesh
    const instancedMesh = new THREE.InstancedMesh(geometry, material, lineCount);

    // Calculate matrices for each segment
    segments.forEach((segment, index) => {
        const matrix = this.calculateCylinderMatrix(segment[0], segment[1]);
        instancedMesh.setMatrixAt(index, matrix);
    });

    instancedMesh.instanceMatrix.needsUpdate = true;
    return instancedMesh;
}

calculateCylinderMatrix(start, end) {
    const matrix = new THREE.Matrix4();

    // Calculate direction and length
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();

    // Scale cylinder to correct length
    matrix.makeScale(1, length, 1);

    // Position at midpoint
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    matrix.setPosition(midpoint);

    // Rotate to align with direction
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    matrix.makeRotationFromQuaternion(quaternion);

    return matrix;
}
```

**Testing**:
1. Load G-code with many line segments
2. Compare draw call count with/without instancing
3. Monitor frame rate improvements
4. Test different segment counts (1000, 10000, 100000)
5. Verify visual accuracy
6. Check memory usage
7. Test interaction performance

**Expected Results**:
- 60-80% reduction in draw calls
- Significant performance improvement for large models
- Maintained visual quality

---

#### Task 2.2: Spatial Partitioning for Raycasting
**Goal**: Optimize mouse interaction detection

**Implementation**:
- Implement spatial hash grid system
- Divide 3D space into cells
- Only test intersections in relevant cells
- Add dynamic cell sizing

**Files to Modify**:
- `src/client/js/visualizer/pointDetector.js` - Add spatial partitioning

**Code Changes**:
```javascript
// In ToolpathPointDetector class
initializeSpatialGrid() {
    this.spatialGrid = new Map();
    this.cellSize = 5; // Adjust based on model scale
    this.gridBounds = new THREE.Box3();
}

buildSpatialIndex() {
    this.spatialGrid.clear();
    this.gridBounds.makeEmpty();

    // Calculate bounds
    this.intersectionSpheres.forEach(sphere => {
        this.gridBounds.expandByPoint(sphere.position);
    });

    // Build spatial index
    this.intersectionSpheres.forEach((sphere, index) => {
        const cellKey = this.getCellKey(sphere.position);
        if (!this.spatialGrid.has(cellKey)) {
            this.spatialGrid.set(cellKey, []);
        }
        this.spatialGrid.get(cellKey).push({ sphere, index });
    });
}

getCellKey(position) {
    const x = Math.floor(position.x / this.cellSize);
    const y = Math.floor(position.y / this.cellSize);
    const z = Math.floor(position.z / this.cellSize);
    return `${x},${y},${z}`;
}

getCellsAlongRay(ray, maxDistance = 1000) {
    const cells = new Set();
    const stepSize = this.cellSize * 0.5;
    const direction = ray.direction.clone().normalize();

    for (let t = 0; t < maxDistance; t += stepSize) {
        const point = ray.origin.clone().add(direction.clone().multiplyScalar(t));
        const cellKey = this.getCellKey(point);
        cells.add(cellKey);

        // Early exit if we're outside bounds
        if (!this.gridBounds.containsPoint(point)) {
            break;
        }
    }

    return Array.from(cells);
}

detectPointOptimized(mouseX, mouseY) {
    // Convert mouse to ray
    this.updateMousePosition(mouseX, mouseY);
    const ray = this.getRayFromMouse();

    // Get cells to check
    const cellsToCheck = this.getCellsAlongRay(ray);

    // Check intersections only in relevant cells
    for (const cellKey of cellsToCheck) {
        const cellObjects = this.spatialGrid.get(cellKey);
        if (cellObjects && cellObjects.length > 0) {
            const intersections = this.raycaster.intersectObjects(
                cellObjects.map(obj => obj.sphere)
            );

            if (intersections.length > 0) {
                return this.getPointData(intersections[0]);
            }
        }
    }

    return null;
}
```

**Testing**:
1. Create G-code with 10000+ segments
2. Test mouse interaction performance
3. Monitor raycasting time
4. Compare with original method
5. Test with different cell sizes
6. Verify accuracy of detection
7. Test memory usage

**Expected Results**:
- 90% faster raycasting for large models
- More responsive mouse interactions
- Reduced CPU usage during mouse movement

---

#### Task 2.3: Progressive Loading System
**Goal**: Handle large G-code files efficiently

**Implementation**:
- Split parsing into chunks
- Render progressively
- Show loading progress
- Allow cancellation

**Files to Modify**:
- `src/client/js/visualizer/core.js` - Add progressive loading
- Create `src/client/js/visualizer/chunk-loader.js`

**Code Changes**:
```javascript
// In core.js
async loadGcodeProgressive(gcode, options = {}) {
    const {
        chunkSize = 1000,
        maxChunksPerFrame = 5,
        onProgress = null,
        onChunkRendered = null
    } = options;

    this.isLoading = true;
    this.loadingProgress = 0;

    try {
        // Split G-code into chunks
        const lines = gcode.split(/\r?\n/);
        const totalChunks = Math.ceil(lines.length / chunkSize);
        let processedChunks = 0;

        // Clear existing data
        this.clearScene();

        // Process chunks progressively
        for (let i = 0; i < totalChunks; i += maxChunksPerFrame) {
            const chunkPromises = [];

            for (let j = 0; j < maxChunksPerFrame && i + j < totalChunks; j++) {
                const chunkIndex = i + j;
                const startLine = chunkIndex * chunkSize;
                const endLine = Math.min((chunkIndex + 1) * chunkSize, lines.length);
                const chunk = lines.slice(startLine, endLine);

                const promise = this.processChunk(chunk, chunkIndex, startLine);
                chunkPromises.push(promise);
            }

            // Wait for current batch to complete
            const chunkResults = await Promise.all(chunkPromises);

            // Render accumulated chunks
            this.renderAccumulatedChunks(chunkResults);

            processedChunks += chunkPromises.length;
            this.loadingProgress = (processedChunks / totalChunks) * 100;

            if (onProgress) {
                onProgress({
                    progress: this.loadingProgress,
                    processedChunks,
                    totalChunks
                });
            }

            if (onChunkRendered) {
                onChunkRendered(chunkResults);
            }

            // Yield to main thread to keep UI responsive
            await this.yieldToMainThread();
        }

        // Final setup after all chunks loaded
        this.finalizeProgressiveLoad();

    } finally {
        this.isLoading = false;
        this.loadingProgress = 100;
    }
}

async processChunk(chunkLines, chunkIndex, startLine) {
    return new Promise((resolve) => {
        // Use Web Worker for heavy processing if available
        if (this.useWebWorkers && window.Worker) {
            this.processChunkWithWorker(chunkLines, chunkIndex, startLine, resolve);
        } else {
            // Process in main thread
            const result = this.parseGcodeChunk(chunkLines);
            resolve({
                chunkIndex,
                startLine,
                data: result,
                processed: true
            });
        }
    });
}

yieldToMainThread() {
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    });
}
```

**Testing**:
1. Test with large G-code files (10MB, 50MB, 100MB)
2. Monitor memory usage during loading
3. Check UI responsiveness
4. Test cancellation functionality
5. Verify progressive rendering
6. Test error handling for corrupted chunks
7. Compare loading times

**Expected Results**:
- Handle files 10x larger than current limit
- UI remains responsive during loading
- Progressive visual feedback
- Graceful error handling

---

### Phase 3: Advanced Optimizations

#### Task 3.1: Web Workers for Parsing
**Goal**: Move heavy computations off main thread

**Implementation**:
- Create Web Worker for G-code parsing
- Implement message passing system
- Handle worker lifecycle
- Add fallback for unsupported browsers

**Files to Create**:
- `src/client/js/workers/gcode-parser-worker.js`
- `src/client/js/visualizer/worker-manager.js`

**Code Changes**:
```javascript
// gcode-parser-worker.js
self.onmessage = function(e) {
    const { gcode, options } = e.data;

    try {
        const result = parseGcodeOptimized(gcode);
        self.postMessage({
            success: true,
            result: result,
            chunkIndex: options.chunkIndex
        });
    } catch (error) {
        self.postMessage({
            success: false,
            error: error.message,
            chunkIndex: options.chunkIndex
        });
    }
};

// In worker-manager.js
createParserWorker() {
    if (!window.Worker) {
        console.warn('Web Workers not supported');
        return null;
    }

    const worker = new Worker('gcode-parser-worker.js');
    worker.onmessage = this.handleWorkerMessage.bind(this);
    worker.onerror = this.handleWorkerError.bind(this);

    return worker;
}

async parseWithWorker(gcode, chunkIndex = 0) {
    return new Promise((resolve, reject) => {
        if (!this.worker) {
            this.worker = this.createParserWorker();
            if (!this.worker) {
                // Fallback to main thread parsing
                resolve(this.parseInMainThread(gcode, chunkIndex));
                return;
            }
        }

        this.pendingResolves.set(chunkIndex, { resolve, reject });

        this.worker.postMessage({
            gcode,
            options: { chunkIndex }
        });
    });
}
```

**Testing**:
1. Compare parsing performance with/without Web Workers
2. Monitor main thread blocking
3. Test with large files
4. Verify error handling
5. Test browser compatibility
6. Check memory usage in worker

**Expected Results**:
- Main thread remains responsive during parsing
- Faster parsing for large files
- Better user experience

---

#### Task 3.2: Level-of-Detail (LOD) System
**Goal**: Reduce detail for distant objects

**Implementation**:
- Implement distance-based detail reduction
- Create multiple detail levels
- Smooth transitions between levels
- Automatic LOD management

**Files to Modify**:
- `src/client/js/visualizer/core.js` - Add LOD system

**Code Changes**:
```javascript
// In GcodeVisualizer class
initializeLODSystem() {
    this.lodLevels = [];
    this.lodThresholds = [
        { min: 0, max: 50, detail: 1.0 },      // Close: full detail
        { min: 50, max: 150, detail: 0.7 },    // Medium: 70% detail
        { min: 150, max: 500, detail: 0.3 },   // Far: 30% detail
        { min: 500, max: Infinity, detail: 0.1 } // Very far: 10% detail
    ];

    this.currentLODLevel = 0;
}

createLODLevels(segments) {
    // Create different detail levels
    this.lodLevels = this.lodThresholds.map((threshold, index) => {
        const detail = threshold.detail;
        const step = Math.max(1, Math.floor(1 / detail));

        // Sample segments based on detail level
        const sampledSegments = [];
        for (let i = 0; i < segments.length; i += step) {
            sampledSegments.push(segments[i]);
        }

        return this.createLineObjectForLOD(sampledSegments, `lod_${index}`);
    });
}

updateLOD() {
    if (!this.lodLevels.length) return;

    // Calculate camera distance to model center
    const distance = this.camera.position.distanceTo(this.modelCenter || new THREE.Vector3());

    // Find appropriate LOD level
    let newLODLevel = 0;
    for (let i = 0; i < this.lodThresholds.length; i++) {
        if (distance >= this.lodThresholds[i].min && distance < this.lodThresholds[i].max) {
            newLODLevel = i;
            break;
        }
    }

    // Update visibility if level changed
    if (newLODLevel !== this.currentLODLevel) {
        this.lodLevels.forEach((level, index) => {
            level.visible = index === newLODLevel;
        });
        this.currentLODLevel = newLODLevel;
    }
}
```

**Testing**:
1. Test different camera distances
2. Monitor frame rate improvements
3. Verify smooth transitions
4. Check visual quality at each level
5. Test with different model sizes
6. Monitor memory usage

**Expected Results**:
- 50% performance improvement for zoomed-out views
- Maintained visual quality when close to model
- Smooth LOD transitions

---

#### Task 3.3: Memory Management System
**Goal**: Prevent memory leaks and optimize resource usage

**Implementation**:
- Track all Three.js resources
- Implement automatic cleanup
- Add memory monitoring
- Create resource pooling

**Files to Create**:
- `src/client/js/visualizer/memory-manager.js`

**Code Changes**:
```javascript
// In memory-manager.js
class MemoryManager {
    constructor() {
        this.resources = {
            geometries: new Set(),
            materials: new Set(),
            textures: new Set(),
            objects: new Set()
        };

        this.memoryWarningThreshold = 50 * 1024 * 1024; // 50MB
        this.lastCleanup = 0;
        this.cleanupInterval = 30000; // 30 seconds
    }

    trackObject(object) {
        if (object.geometry) {
            this.resources.geometries.add(object.geometry);
        }
        if (object.material) {
            this.resources.materials.add(object.material);
        }
        if (object.children) {
            object.children.forEach(child => this.trackObject(child));
        }
        this.resources.objects.add(object);
    }

    untrackObject(object) {
        if (object.geometry) {
            this.resources.geometries.delete(object.geometry);
        }
        if (object.material) {
            this.resources.materials.delete(object.material);
        }
        if (object.children) {
            object.children.forEach(child => this.untrackObject(child));
        }
        this.resources.objects.delete(object);
    }

    cleanupUnusedResources() {
        const now = performance.now();

        // Only cleanup periodically
        if (now - this.lastCleanup < this.cleanupInterval) {
            return;
        }

        this.lastCleanup = now;

        // Find unused geometries
        const unusedGeometries = Array.from(this.resources.geometries)
            .filter(geom => geom && !geom.isDisposed && geom._refCount === 0);

        // Find unused materials
        const unusedMaterials = Array.from(this.resources.materials)
            .filter(mat => mat && !mat.isDisposed && mat._refCount === 0);

        // Dispose unused resources
        unusedGeometries.forEach(geom => {
            geom.dispose();
            this.resources.geometries.delete(geom);
        });

        unusedMaterials.forEach(mat => {
            mat.dispose();
            this.resources.materials.delete(mat);
        });

        console.log(`Memory cleanup: disposed ${unusedGeometries.length} geometries, ${unusedMaterials.length} materials`);
    }

    getMemoryStats() {
        return {
            geometries: this.resources.geometries.size,
            materials: this.resources.materials.size,
            textures: this.resources.textures.size,
            objects: this.resources.objects.size
        };
    }

    checkMemoryUsage() {
        if (performance.memory) {
            const usedJSHeapSize = performance.memory.usedJSHeapSize;
            if (usedJSHeapSize > this.memoryWarningThreshold) {
                console.warn(`High memory usage detected: ${Math.round(usedJSHeapSize / 1024 / 1024)}MB`);
                this.cleanupUnusedResources();
            }
        }
    }
}
```

**Testing**:
1. Monitor memory usage over time
2. Test with large models and frequent loading
3. Verify no memory leaks
4. Check automatic cleanup functionality
5. Test memory warning system
6. Compare memory usage with/without manager

**Expected Results**:
- No memory leaks
- Stable memory usage over time
- Automatic resource cleanup
- Better long-term performance

---

## Testing Strategy

### Performance Testing
1. **Frame Rate Testing**:
   - Use `requestAnimationFrame` loop with FPS counter
   - Test with different model sizes
   - Monitor frame drops and stuttering

2. **Memory Testing**:
   - Use Chrome DevTools Memory tab
   - Monitor heap size over time
   - Check for memory leaks
   - Test garbage collection behavior

3. **CPU Usage Testing**:
   - Use Chrome DevTools Performance tab
   - Record CPU profiles
   - Identify bottlenecks
   - Compare before/after optimization

### Functional Testing
1. **Visual Quality Testing**:
   - Compare rendered output before/after optimization
   - Check for visual artifacts
   - Verify all features still work
   - Test different camera angles

2. **Interaction Testing**:
   - Test mouse hover detection
   - Verify click interactions
   - Check responsiveness
   - Test with large models

### Load Testing
1. **Large File Testing**:
   - Test with files of different sizes (1MB, 10MB, 100MB)
   - Monitor loading times
   - Check memory usage
   - Test progressive loading

2. **Stress Testing**:
   - Load multiple models simultaneously
   - Test rapid camera movement
   - Check system stability
   - Monitor resource usage

---

## Implementation Timeline

### Week 1: Phase 1 (Quick Wins)
- Day 1: Adaptive rendering system
- Day 2: Frustum culling
- Day 3: Renderer optimization
- Day 4: Testing and bug fixes
- Day 5: Performance measurement

### Week 2: Phase 2 (Medium Impact)
- Day 1-2: Geometry instancing
- Day 3: Spatial partitioning
- Day 4: Progressive loading
- Day 5: Integration testing

### Week 3: Phase 3 (Advanced)
- Day 1-2: Web Workers
- Day 3: LOD system
- Day 4: Memory management
- Day 5: Final testing and optimization

---

## Success Metrics

### Performance Targets
- **CPU Usage**: Reduce by 60-80%
- **Memory Usage**: Stable under 100MB for large models
- **Frame Rate**: Maintain 30fps for large models
- **Load Time**: Handle 100MB files within 30 seconds
- **Interaction Response**: <16ms for mouse interactions

### Quality Targets
- **Visual Accuracy**: No loss of geometric precision
- **Feature Completeness**: All existing features work
- **Browser Compatibility**: Works on Chrome, Firefox, Safari
- **Error Handling**: Graceful degradation on errors

---

## Risk Mitigation

1. **Feature Loss Risk**: Implement all optimizations incrementally with feature flags
2. **Browser Compatibility**: Add fallbacks for unsupported features
3. **Performance Regression**: Continuous performance monitoring
4. **Memory Issues**: Implement comprehensive cleanup systems
5. **User Experience**: Progressive loading with progress indicators

This plan provides a systematic approach to optimizing the CNC visualizer while maintaining all functionality and ensuring a smooth user experience.