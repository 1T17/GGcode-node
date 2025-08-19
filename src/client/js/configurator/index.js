/**
 * Configurator Manager
 * Main configurator module that coordinates parsing, rendering, and validation
 */

import ConfiguratorParser from './parser.js';
import ConfiguratorRenderer from './renderer.js';
import ConfiguratorValidator from './validator.js';

class ConfiguratorManager {
  constructor() {
    this.configVars = [];
    this.currentValues = {};
    this.modalElement = null;
    this.contentElement = null;
    this.formElement = null;
    this.onCompile = null;
    this.onSave = null;
  }

  /**
   * Initialize the configurator manager
   * @param {Object} options - Configuration options
   * @param {string} options.modalId - ID of the modal element
   * @param {string} options.contentId - ID of the content container
   * @param {Function} options.onCompile - Callback for compilation
   * @param {Function} options.onSave - Callback for saving
   */
  initialize(options = {}) {
    const {
      modalId = 'configuratorModal',
      contentId = 'configuratorContent',
      onCompile = null,
      onSave = null,
    } = options;

    this.modalElement = document.getElementById(modalId);
    this.contentElement = document.getElementById(contentId);
    this.onCompile = onCompile;
    this.onSave = onSave;

    if (!this.modalElement || !this.contentElement) {
      console.error('Configurator: Required DOM elements not found');
      return false;
    }

    // Add CSS styles
    this._addStyles();

    return true;
  }

  /**
   * Show configurator modal with GGcode content
   * @param {string} ggcode - GGcode content to parse
   */
  showConfigurator(ggcode) {
    if (!this.modalElement || !this.contentElement) {
      console.error('Configurator not initialized');
      return;
    }

    // Parse configurator variables from GGcode
    this.configVars = ConfiguratorParser.parseConfiguratorVars(ggcode);
    this.currentValues = ConfiguratorParser.getDefaultValues(this.configVars);

    // Render the form
    const formHtml = ConfiguratorRenderer.renderConfiguratorForm(
      this.configVars
    );
    this.contentElement.innerHTML = formHtml;

    // Get form element and setup validation
    this.formElement = document.getElementById('configuratorForm');
    if (this.formElement) {
      ConfiguratorValidator.setupRealTimeValidation(
        this.formElement,
        this.configVars
      );
    }

    // Show modal
    this.modalElement.style.display = 'flex';
    this.modalElement.classList.add('configurator-fade-in');
  }

  /**
   * Close configurator modal
   */
  closeConfigurator() {
    if (this.modalElement) {
      this.modalElement.style.display = 'none';
      this.modalElement.classList.remove('configurator-fade-in');
    }
  }

  /**
   * Get current form values
   * @returns {Object} Current form values
   */
  getFormValues() {
    if (!this.formElement) {
      return {};
    }

    return ConfiguratorValidator.getFormValues(
      this.formElement,
      this.configVars
    );
  }

  /**
   * Validate current form
   * @returns {Object} Validation result
   */
  validateForm() {
    if (!this.formElement) {
      return {
        isValid: false,
        errors: { general: 'Form not available' },
        values: {},
      };
    }

    return ConfiguratorValidator.validateForm(
      this.formElement,
      this.configVars
    );
  }

  /**
   * Save form values and update GGcode
   * @param {string} originalGGcode - Original GGcode content
   * @returns {Object} Result with updated code and status
   */
  saveAndUpdateGGcode(originalGGcode) {
    const validation = this.validateForm();

    if (!validation.isValid) {
      return {
        success: false,
        error: 'Form validation failed',
        errors: validation.errors,
      };
    }

    const values = validation.values;
    const updateResult = ConfiguratorParser.updateGGcodeWithValues(
      originalGGcode,
      values
    );

    // Log any variables not found
    if (updateResult.notFound.length > 0) {
      console.warn(
        '[Configurator] Variables not found in code:',
        updateResult.notFound
      );
    }

    // Update current values
    this.currentValues = values;

    return {
      success: true,
      code: updateResult.code,
      foundVars: updateResult.foundVars,
      notFound: updateResult.notFound,
      values: values,
    };
  }

  /**
   * Compile with current form values without saving
   * @param {string} originalGGcode - Original GGcode content
   * @returns {Object} Result with temporary code for compilation
   */
  compileWithCurrentValues(originalGGcode) {
    const validation = this.validateForm();

    if (!validation.isValid) {
      return {
        success: false,
        error: 'Form validation failed',
        errors: validation.errors,
      };
    }

    const values = validation.values;
    const updateResult = ConfiguratorParser.updateGGcodeWithValues(
      originalGGcode,
      values
    );

    return {
      success: true,
      code: updateResult.code,
      values: values,
    };
  }

  /**
   * Handle save and compile action
   * @param {string} originalGGcode - Original GGcode content
   * @param {Function} editorSetValue - Function to update editor
   * @param {Function} compileFunction - Function to trigger compilation
   */
  async handleSaveAndCompile(originalGGcode, editorSetValue, compileFunction) {
    const result = this.saveAndUpdateGGcode(originalGGcode);

    if (!result.success) {
      console.error('[Configurator] Save failed:', result.error);
      this._showErrorMessage('Failed to save: ' + result.error);
      return;
    }

    console.log('[Configurator] Saving values from form:', result.values);
    console.log('[Configurator] Updated code:', result.code);

    // Update editor
    if (editorSetValue) {
      editorSetValue(result.code);
      console.log('[Configurator] Editor updated with new values.');
    }

    // Close modal
    this.closeConfigurator();

    // Trigger compilation
    if (compileFunction) {
      try {
        await compileFunction();
      } catch (error) {
        console.error('[Configurator] Compilation failed:', error);
      }
    }

    // Call save callback if provided
    if (this.onSave) {
      this.onSave(result);
    }
  }

  /**
   * Handle compile only action
   * @param {string} originalGGcode - Original GGcode content
   * @param {Function} compileFunction - Function to compile code
   */
  async handleCompileOnly(originalGGcode, compileFunction) {
    const result = this.compileWithCurrentValues(originalGGcode);

    if (!result.success) {
      console.error('[Configurator] Compile preparation failed:', result.error);
      this._showErrorMessage('Failed to prepare compilation: ' + result.error);
      return;
    }

    console.log('[Configurator] Compiling with values:', result.values);

    // Compile with temporary code
    if (compileFunction) {
      try {
        await compileFunction(result.code);
      } catch (error) {
        console.error('[Configurator] Compilation failed:', error);
        this._showErrorMessage('Compilation failed: ' + error.message);
      }
    }

    // Call compile callback if provided
    if (this.onCompile) {
      this.onCompile(result);
    }
  }

  /**
   * Get configurator variables
   * @returns {Array} Array of configurator variables
   */
  getConfigVars() {
    return this.configVars;
  }

  /**
   * Get current values
   * @returns {Object} Current form values
   */
  getCurrentValues() {
    return this.currentValues;
  }

  /**
   * Check if configurator has variables
   * @returns {boolean} True if has variables
   */
  hasVariables() {
    return this.configVars.length > 0;
  }

  /**
   * Reset configurator state
   */
  reset() {
    this.configVars = [];
    this.currentValues = {};
    this.formElement = null;

    if (this.contentElement) {
      this.contentElement.innerHTML = '';
    }
  }

  /**
   * Show error message in the configurator
   * @param {string} message - Error message
   * @private
   */
  _showErrorMessage(message) {
    if (this.contentElement) {
      const errorHtml = ConfiguratorRenderer.renderErrorMessage(message);
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = errorHtml;
      this.contentElement.insertBefore(
        errorDiv,
        this.contentElement.firstChild
      );

      // Remove error after 5 seconds
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 5000);
    }
  }

  /**
   * Add CSS styles for configurator
   * @private
   */
  _addStyles() {
    const styleId = 'configurator-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      ${ConfiguratorRenderer.getValidationStyles()}
      ${ConfiguratorRenderer.getAnimationStyles()}
    `;

    document.head.appendChild(style);
  }
}

export default ConfiguratorManager;
