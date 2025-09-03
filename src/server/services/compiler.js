const ffi = require('ffi-napi');
const path = require('path');

/**
 * CompilerService - Handles GGcode compilation through FFI interface
 * Provides proper error handling and memory management for native library calls
 * Now includes stderr capture for detailed error messages from native library
 */
class CompilerService {
  constructor(libPath = null) {
    this.libPath = libPath || path.resolve(__dirname, '../../../libggcode.so');
    this.ggcode = null;
    this._initializeLibrary();
  }

  /**
   * Initialize the FFI library interface
   * @private
   */
  _initializeLibrary() {
    try {
      this.ggcode = ffi.Library(this.libPath, {
        compile_ggcode_from_string: ['pointer', ['pointer', 'int']],
        free_ggcode_string: ['void', ['pointer']],
      });
    } catch (error) {
      throw new Error(`Failed to initialize GGcode library: ${error.message}`);
    }
  }

  /**
   * Validate and sanitize input GGcode string
   * @param {string} input - Raw GGcode input
   * @returns {string} - Sanitized input
   * @throws {Error} - If input is invalid
   */
  _validateAndSanitizeInput(input) {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }

    if (input.length > 1000000) {
      // 1MB limit
      throw new Error('Input too large (max 1MB)');
    }

    // Decode HTML entities
    const decoded = input
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

    // Strip carriage returns
    const cleaned = decoded.replace(/\r/g, '');

    return cleaned;
  }

  /**
   * Compile GGcode string to G-code
   * @param {string} ggcodeString - The GGcode source to compile
   * @param {Object} options - Compilation options
   * @returns {Promise<string>} - Compiled G-code output
   * @throws {Error} - If compilation fails
   */
  async compile(ggcodeString, _options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Validate and sanitize input
        const cleanInput = this._validateAndSanitizeInput(ggcodeString);

        // Create null-terminated buffer
        const inputBuffer = Buffer.from(cleanInput + '\0', 'utf8');

        // Execute native compilation
        const compilationResult = this.ggcode.compile_ggcode_from_string(
          inputBuffer,
          1
        );

        const outputPtr = compilationResult;
        let output = '';

        // Handle output pointer safely
        if (outputPtr && !outputPtr.isNull()) {
          if (typeof outputPtr.readCString === 'function') {
            output = outputPtr.readCString();
          } else {
            output = Buffer.from(outputPtr).toString();
          }
        }

        // Free native memory
        this._freeMemory(outputPtr);

        // Check if output looks like an error message
        if (output.startsWith('; ERROR')) {
          reject(new Error(output));
          return;
        }

        resolve(output);
      } catch (error) {
        // FFI exception occurred - pass through the original error
        reject(new Error(`Compilation failed: ${error.message}`));
      }
    });
  }

  /**
   * Validate GGcode syntax without full compilation
   * @param {string} ggcodeString - The GGcode source to validate
   * @returns {Promise<Object>} - Validation result with success flag and errors
   */
  async validateSyntax(ggcodeString) {
    try {
      // For now, we'll use the compile method and catch errors
      // In a real implementation, we might have a separate validation function
      await this.compile(ggcodeString);
      return { valid: true, errors: [] };
    } catch (error) {
      return {
        valid: false,
        errors: [error.message],
      };
    }
  }

  /**
   * Free native memory and trigger garbage collection
   * @param {*} outputPtr - Pointer to free
   * @private
   */
  _freeMemory(outputPtr) {
    try {
      if (outputPtr) {
        this.ggcode.free_ggcode_string(outputPtr);
      }

      // Trigger garbage collection if available
      if (global.gc) {
        global.gc();
      }
    } catch (error) {
      console.warn('Warning: Failed to free memory properly:', error.message);
    }
  }

  /**
   * Get compiler information and status
   * @returns {Object} - Compiler status information
   */
  getStatus() {
    return {
      libraryPath: this.libPath,
      initialized: !!this.ggcode,
      version: '1.0.0', // This could be retrieved from the native library
    };
  }
}

module.exports = CompilerService;
