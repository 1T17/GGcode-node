/**
 * Chunk Loader Module
 *
 * Handles progressive loading of G-code files to prevent UI blocking
 */

import { parseGcodeOptimized } from './parser.js';

/**
 * Chunk loader class for progressive G-code loading
 */
export class ChunkLoader {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.isCancelled = false;
    this.isRunning = false;
  }

  /**
   * Load G-code progressively
   * @param {string} gcode - G-code content
   * @param {Object} options - Loading options
   * @returns {Promise<Object>} Loading result
   */
  async loadGcodeProgressive(gcode, options = {}) {
    const {
      chunkSize = 10,
      onProgress = null,
      onChunkProcessed = null,
      onCancel = null,
    } = options;

    this.isCancelled = false;
    this.isRunning = true;
    this.loadingProgress = 0;

    try {
      // Split G-code into chunks
      const lines = gcode.split(/\r?\n/);
      const totalChunks = Math.ceil(lines.length / chunkSize);
      let processedChunks = 0;
      let accumulatedSegments = [];
      let accumulatedModes = [];
      let accumulatedPoints = [];

      console.log(
        `[CHUNK] Loading ${lines.length} lines in ${totalChunks} chunks`
      );

      // Process chunks progressively
      // Initialize with proper G-code defaults - this ensures first chunk has valid starting state
      // G-code standard: starts at origin (0,0,0) with G1 (linear interpolation) as default
      let currentState = {
        x: 0,
        y: 0,
        z: 0,
        currentMotionMode: 'G1', // Default to linear interpolation (G-code standard)
        anyDrawn: false,
      };

      let chunkMetaData = []; // Track metadata for debugging

      for (let i = 0; i < totalChunks && !this.isCancelled; i++) {
        const chunkIndex = i;
        const startLine = chunkIndex * chunkSize;
        const endLine = Math.min((chunkIndex + 1) * chunkSize, lines.length);
        const chunkLines = lines.slice(startLine, endLine);

        //console.log(`[CHUNK] Processing chunk ${chunkIndex} with ${chunkLines.length} lines`);

        // Process chunk sequentially to maintain proper state
        const chunkResult = await this.processChunk(
          chunkLines,
          chunkIndex,
          currentState
        );

        // Accumulate result
        if (chunkResult) {
          //console.log(`[CHUNK] Chunk ${chunkResult.chunkIndex} produced ${chunkResult.segments ? chunkResult.segments.length : 0} segments, ends at ${chunkResult.finalState.currentMotionMode} (${chunkResult.finalState.x.toFixed(1)}, ${chunkResult.finalState.y.toFixed(1)}, ${chunkResult.finalState.z.toFixed(1)})`);

          // Debug: Check if last point of previous accumulated segments matches first point of new segments
          // if (chunkResult.segments && chunkResult.segments.length > 0 && accumulatedPoints.length > 0) {
          //     const lastAccumulatedPoint = accumulatedPoints[accumulatedPoints.length - 1];
          //     const firstNewPoint = chunkResult.points && chunkResult.points.length > 0 ? chunkResult.points[0] : null;

          //     // if (firstNewPoint) {
          //     //     const pointMatch = (
          //     //         Math.abs(lastAccumulatedPoint.x - firstNewPoint.x) < 0.001 &&
          //     //         Math.abs(lastAccumulatedPoint.y - firstNewPoint.y) < 0.001 &&
          //     //         Math.abs(lastAccumulatedPoint.z - firstNewPoint.z) < 0.001
          //     //     );
          //     //     //console.log(`[CHUNK] Point continuity: Last point (${lastAccumulatedPoint.x.toFixed(3)}, ${lastAccumulatedPoint.y.toFixed(3)}, ${lastAccumulatedPoint.z.toFixed(3)}) ${pointMatch ? 'MATCHES' : 'DIFFERS FROM'} first new point (${firstNewPoint.x.toFixed(3)}, ${firstNewPoint.y.toFixed(3)}, ${firstNewPoint.z.toFixed(3)})`);
          //     // }
          // }

          // Always add segments if they exist (even if empty array)
          if (chunkResult.segments) {
            accumulatedSegments.push(...chunkResult.segments);
            accumulatedModes.push(...chunkResult.modes);
            accumulatedPoints.push(...chunkResult.points);
          }

          // Track chunk metadata for debugging - always track, even for empty chunks
          chunkMetaData.push({
            chunkIndex: chunkResult.chunkIndex,
            segmentCount: chunkResult.segments
              ? chunkResult.segments.length
              : 0,
            initialState: currentState,
            finalState: chunkResult.finalState || currentState,
          });
        }

        processedChunks++;
        this.loadingProgress = (processedChunks / totalChunks) * 100;

        if (onProgress) {
          onProgress({
            progress: this.loadingProgress,
            processedChunks,
            totalChunks,
            segmentCount: accumulatedSegments.length,
          });
        }

        if (onChunkProcessed) {
          onChunkProcessed({
            segments: accumulatedSegments,
            modes: accumulatedModes,
            points: accumulatedPoints,
            progress: this.loadingProgress,
            // Include metadata for debugging
            chunkMetaData: chunkMetaData,
          });
        }

        // Update state for next chunk (use final state from this chunk)
        if (chunkResult && chunkResult.finalState) {
          currentState = chunkResult.finalState;
          // Only log state changes if they actually change (reduce noise)
          if (processedChunks % totalChunks === 0) {
            // Log only on final batch
            console.log(
              `[CHUNK] Final state: ${currentState.currentMotionMode} at (${currentState.x.toFixed(1)}, ${currentState.y.toFixed(1)}, ${currentState.z.toFixed(1)})`
            );
          }
        } else {
          console.warn(
            `[CHUNK] No final state from chunk ${chunkResult?.chunkIndex || 'unknown'}`
          );
        }

        // Yield to main thread to keep UI responsive
        await this.yieldToMainThread();
      }

      if (this.isCancelled) {
        if (onCancel) onCancel();
        return { success: false, cancelled: true };
      }

      // Final setup after all chunks loaded
      const result = {
        success: true,
        segments: accumulatedSegments,
        modes: accumulatedModes,
        points: accumulatedPoints,
        lineCount: lines.length,
        chunkCount: totalChunks,
      };

      console.log(
        `[CHUNK] Completed: ${accumulatedSegments.length} segments from ${totalChunks} chunks`
      );
      return result;
    } catch (error) {
      console.error('[CHUNK] Loading failed:', error.message);
      return { success: false, error: error.message };
    } finally {
      this.isRunning = false;
      this.loadingProgress = 100;
    }
  }

  /**
   * Process a chunk of G-code lines
   * @param {Array<string>} chunkLines - Lines in this chunk
   * @param {number} chunkIndex - Index of this chunk
   * @param {Object} initialState - Initial state for parsing (optional)
   * @returns {Promise<Object>} Processing result
   */
  async processChunk(chunkLines, chunkIndex, initialState = {}) {
    return new Promise((resolve) => {
      try {
        // Use Web Worker for heavy processing if available
        if (this.visualizer.useWebWorkers && window.Worker) {
          this.processChunkWithWorker(chunkLines, chunkIndex, resolve);
        } else {
          // Process in main thread
          const result = this.parseGcodeChunk(
            chunkLines,
            chunkIndex,
            initialState
          );
          resolve(result);
        }
      } catch (error) {
        resolve({
          success: false,
          error: error.message,
          chunkIndex,
        });
      }
    });
  }

  /**\n     * Process chunk using Web Worker\n     * @param {Array<string>} chunkLines - Lines in this chunk\n     * @param {number} chunkIndex - Index of this chunk\n     * @param {Object} initialState - Initial state for parsing (optional)\n     * @param {Function} resolve - Promise resolve function\n     */
  processChunkWithWorker(chunkLines, chunkIndex, initialState, resolve) {
    // This would be implemented when we add Web Worker support
    // For now, fallback to main thread processing
    const result = this.parseGcodeChunk(chunkLines, chunkIndex, initialState);
    resolve(result);
  }

  /**
   * Parse a chunk of G-code lines
   * @param {Array<string>} chunkLines - Lines in this chunk
   * @param {number} chunkIndex - Index of this chunk
   * @param {Object} initialState - Initial state for parsing (optional)
   * @returns {Object} Parsing result
   */
  parseGcodeChunk(chunkLines, chunkIndex, initialState = {}) {
    // Use the imported parser function directly
    const parser = parseGcodeOptimized;
    // Join lines back together for parsing
    const chunkGcode = chunkLines.join('\n');

    // Parse the chunk with initial state to maintain G-code continuity
    const parseResult = parser(chunkGcode, initialState);

    return {
      success: true,
      chunkIndex,
      segments: parseResult.toolpathSegments || [],
      modes: parseResult.toolpathModes || [],
      points: parseResult.toolpathPoints || [],
      segmentCounts: parseResult.segmentCounts || {
        G0: 0,
        G1: 0,
        G2: 0,
        G3: 0,
      },
      finalState: parseResult.finalState || {},
      // Include metadata for proper chunk connection
      metaData: {
        startIndex: parseResult.lineMap ? Math.min(...parseResult.lineMap) : 0,
        endIndex: parseResult.lineMap ? Math.max(...parseResult.lineMap) : 0,
        initialState: initialState,
        finalState: parseResult.finalState || {},
      },
    };
  }

  /**
   * Yield to main thread to keep UI responsive
   * @returns {Promise<void>}
   */
  yieldToMainThread() {
    return new Promise((resolve) => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        // Additional setTimeout(0) if needed for longer tasks
        setTimeout(resolve, 0);
      });
    });
  }

  /**
   * Cancel the current loading process
   */
  cancel() {
    this.isCancelled = true;
    console.log('[CHUNK] Loading cancelled');
  }

  /**
   * Check if loader is currently running
   * @returns {boolean} True if running
   */
  isRunning() {
    return this.isRunning;
  }

  /**
   * Get current loading progress
   * @returns {number} Progress percentage
   */
  getProgress() {
    return this.loadingProgress;
  }

  /**
   * Validate state continuity between chunks
   * @param {Array} chunkResults - Results from processed chunks
   * @returns {Object} Validation report
   */
  validateStateContinuity(chunkResults) {
    const report = {
      isValid: true,
      issues: [],
      stateTransitions: [],
    };

    for (let i = 0; i < chunkResults.length - 1; i++) {
      const current = chunkResults[i];
      const next = chunkResults[i + 1];

      if (current.finalState && next.metaData) {
        const transition = {
          fromChunk: current.chunkIndex,
          toChunk: next.chunkIndex,
          expectedState: current.finalState,
          actualInitialState: next.metaData.initialState,
        };

        report.stateTransitions.push(transition);

        // Check for state continuity issues
        const positionMismatch =
          Math.abs(current.finalState.x - next.metaData.initialState.x) >
            0.001 ||
          Math.abs(current.finalState.y - next.metaData.initialState.y) >
            0.001 ||
          Math.abs(current.finalState.z - next.metaData.initialState.z) > 0.001;

        const modeMismatch =
          current.finalState.currentMotionMode !==
          next.metaData.initialState.currentMotionMode;

        if (positionMismatch) {
          report.isValid = false;
          report.issues.push({
            type: 'position_mismatch',
            chunk: next.chunkIndex,
            expected: {
              x: current.finalState.x,
              y: current.finalState.y,
              z: current.finalState.z,
            },
            actual: {
              x: next.metaData.initialState.x,
              y: next.metaData.initialState.y,
              z: next.metaData.initialState.z,
            },
          });
        }

        if (modeMismatch) {
          report.isValid = false;
          report.issues.push({
            type: 'mode_mismatch',
            chunk: next.chunkIndex,
            expected: current.finalState.currentMotionMode,
            actual: next.metaData.initialState.currentMotionMode,
          });
        }
      }
    }

    return report;
  }
}
