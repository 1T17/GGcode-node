/**
 * Configurator System Module
 * Handles configurator-related operations
 */

class ConfiguratorSystem {
  constructor(configuratorManager, editorManager) {
    this.configuratorManager = configuratorManager;
    this.editorManager = editorManager;
  }

  /**
   * Initialize configurator
   */
  initialize(options) {
    if (this.configuratorManager) {
      this.configuratorManager.initialize(options);
    }
  }

  /**
   * Show configurator
   */
  showConfigurator() {
    if (this.configuratorManager) {
      const ggcode = this.editorManager
        ? this.editorManager.getInputValue()
        : '';
      this.configuratorManager.showConfigurator(ggcode);
    } else {
      console.error('ConfiguratorManager module not available');
    }
  }

  /**
   * Handle configurator compile action
   */
  handleConfiguratorCompile(result) {
    console.log('Configurator compile completed:', result);
  }

  /**
   * Handle configurator save action
   */
  handleConfiguratorSave(result) {
    console.log('Configurator save completed:', result);
  }

  /**
   * Configurator save and compile
   */
  configuratorSaveAndCompile() {
    if (this.configuratorManager) {
      const ggcode = this.editorManager
        ? this.editorManager.getInputValue()
        : '';
      this.configuratorManager.handleSaveAndCompile(
        ggcode,
        (code) => this.editorManager?.setInputValue(code),
        () => {
          if (window.submitGGcode) {
            window.submitGGcode(new Event('submit'));
          }
        }
      );
    } else {
      console.error('ConfiguratorManager module not available');
    }
  }

  /**
   * Configurator compile only
   */
  configuratorCompileOnly() {
    if (this.configuratorManager) {
      const ggcode = this.editorManager
        ? this.editorManager.getInputValue()
        : '';
      this.configuratorManager.handleCompileOnly(ggcode, (code) => {
        if (window.submitGGcode) {
          window.submitGGcode(new Event('submit'), code);
        }
      });
    } else {
      console.error('ConfiguratorManager module not available');
    }
  }

  /**
   * Close configurator
   */
  closeConfigurator() {
    if (this.configuratorManager) {
      this.configuratorManager.closeConfigurator();
    }
    const modal = document.getElementById('configuratorModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}

export default ConfiguratorSystem;
