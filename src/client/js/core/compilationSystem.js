/**
 * Compilation System Module
 * Handles GGcode compilation and loading indicators
 */

class CompilationSystem {
  constructor(apiManager, editorManager, annotationSystem) {
    this.apiManager = apiManager;
    this.editorManager = editorManager;
    this.annotationSystem = annotationSystem;
    this.monacoReady = false;
  }

  /**
   * Set Monaco ready state
   */
  setMonacoReady(ready) {
    this.monacoReady = ready;
    console.log('CompilationSystem: Monaco ready state set to:', ready);
  }

  /**
   * Submit GGcode for compilation
   */
  async submitGGcode(event, customCode = null) {
    if (event) event.preventDefault();

    this.syncEditors();
    const code = customCode || this.editorManager.getInputValue();

    if (this.editorManager) {
      this.editorManager.setOutputValue('Compiling...');
    }

    try {
      const result = await this.apiManager.compiler.compile(code);

      if (result.success) {
        if (this.editorManager) {
          this.editorManager.setOutputValue(result.output);

          // Reset annotation modal state when new G-code is loaded
          if (this.annotationSystem) {
            this.annotationSystem.resetModalState();
          }

          // Trigger annotation for first line if content exists
          if (result.output.trim()) {
            const editors = this.editorManager.getEditors();
            if (editors.output) {
              const firstLineContent = editors.output
                .getModel()
                .getLineContent(1);
              if (window.updateAnnotations) {
                window.updateAnnotations(1, firstLineContent);
              }
            }
          }
        }
        if (window.saveContent) {
          window.saveContent();
        }
      } else {
        if (this.editorManager) {
          this.editorManager.setOutputValue(result.error);
        }
      }
    } catch (err) {
      if (this.editorManager) {
        this.editorManager.setOutputValue('Network error: ' + err.message);
      }
    }
    return false;
  }

  /**
   * Sync editors (legacy function for backward compatibility)
   */
  syncEditors() {
    if (this.editorManager) {
      const ggcodeElement = document.getElementById('ggcode');
      if (ggcodeElement) {
        ggcodeElement.value = this.editorManager.getInputValue();
      }
    }
  }

  /**
   * Show/hide compile loading indicator
   */
  showCompileLoadingIndicator(show) {
    // Create or find compile loading indicator element
    let compileIndicator = document.getElementById('compileLoadingIndicator');

    if (show) {
      if (!compileIndicator) {
        // Create compile loading indicator if it doesn't exist
        compileIndicator = document.createElement('div');
        compileIndicator.id = 'compileLoadingIndicator';
        compileIndicator.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 20px 30px;
                    border-radius: 10px;
                    font-family: monospace;
                    font-size: 14px;
                    text-align: center;
                    z-index: 1000;
                    border: 2px solid #007acc;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                    min-width: 200px;
                `;

        // Add loading animation
        compileIndicator.innerHTML = `
                    <div style="margin-bottom: 10px; font-weight: bold;">Compiling GGcode...</div>
                    <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #ffffff; border-radius: 50%; border-top-color: #007acc; animation: spin 1s ease-in-out infinite; margin: 0 auto;"></div>
                    <div id="compileStatus" style="margin-top: 10px; font-size: 12px; color: #ccc;">Processing...</div>
                    <style>
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    </style>
                `;

        document.body.appendChild(compileIndicator);
      }
      compileIndicator.style.display = 'block';
      //console.log('Showing compile loading indicator');
    } else {
      if (compileIndicator) {
        compileIndicator.style.display = 'none';
        // Remove after fade out
        setTimeout(() => {
          if (compileIndicator.parentNode) {
            compileIndicator.parentNode.removeChild(compileIndicator);
          }
        }, 300);
      }
      //console.log('Hiding compile loading indicator');
    }
  }
}

export default CompilationSystem;
