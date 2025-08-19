/**
 * Configurator Form Renderer
 * Handles rendering of configurator forms and UI components
 */

class ConfiguratorRenderer {
  /**
   * Render configurator form HTML
   * @param {Array} configVars - Array of configurator variables
   * @returns {string} HTML string for the form
   */
  static renderConfiguratorForm(configVars) {
    if (!Array.isArray(configVars) || configVars.length === 0) {
      return this._renderEmptyState();
    }

    return this._renderForm(configVars);
  }

  /**
   * Render empty state when no configurator variables are found
   * @returns {string} HTML for empty state
   * @private
   */
  static _renderEmptyState() {
    return `<div style="color:#aaa; padding:2em;">
      <div style="font-size:1.1em; font-weight:600; color:#ff0000; margin-bottom:10px;">No configurable variables found in GGcode.</div>
      <div style="margin-top:10px; color:#ccc; font-size:0.98em;">
        <p>
          <strong>How to add Configurator support:</strong>
        </p>
        <ul style="margin-left:1.2em; padding-left:0;">
          <li>
            Add <code>/// @number min max</code> after a <code>let</code> variable to create a number input.<br>
            Example: <code>let width = 10 /// @number 1 100 // Part width in mm</code>
          </li>
          <li>
            Add <code>/// @check</code> for a checkbox (boolean).<br>
            Example: <code>let enabled = 1 /// @check // Enable feature</code>
          </li>
          <li>
            Add <code>/// @selction 1,2,3</code> for a dropdown with options.<br>
            Example: <code>let mode = 2 /// @selction 1,2,3 // Select mode</code>
          </li>
          <li>
            Add <code>/// @text rows [max N]</code> for a text input or textarea.<br>
            Example: <code>let notes = "" /// @text 3 max 120 // Notes for operator</code>
          </li>
          <li>
            To add a field title/description, append <code>// Title here</code> at the end of the line.
          </li>
        </ul>
        <div style="margin-top:8px; color:#aaa; font-size:0.93em;">
          Example:<br>
          <code>let speed = 1200 /// @number 500 3000 // Spindle speed (RPM)</code>
        </div>
        <div style="margin-top:14px; color:#b0b0b0; font-size:0.97em;">
          <strong>How to use the Configurator:</strong><br>
          When you add variables with configurator tags, they will appear here for easy editing.<br>
        </div>
      </div>
    </div>`;
  }

  /**
   * Render the main configurator form
   * @param {Array} configVars - Array of configurator variables
   * @returns {string} HTML for the form
   * @private
   */
  static _renderForm(configVars) {
    let html = `
      <div style="background:#23272e; box-shadow:0 2px 16px #0002; padding:18px 18px 8px 18px; max-width:38vw; margin:0 auto;">
        <div style="font-size:1.1em; font-weight:600; color:#fff; margin-bottom:10px;">Configurator</div>
        <div style="color:#ccc; font-size:0.98em; margin-bottom:12px;">
          <ul style="margin:0 0 0 1.2em; padding:0; list-style:disc;">
            <li>Edit variables below before compiling.</li>
            <li>Numbers: range-limited. Checks: on/off. Select: preset options. Text: custom input.</li>
          </ul>
          <div style="margin-top:6px; color:#aaa; font-size:0.93em;">
            <div>
              <strong>Press <span style="color:#fff;">Save</span></strong> to save your changes and apply them to the GGcode source.<br>
              Or just press <strong><span style="color:#fff;">Compile</span></strong> to test the results only, without updating your main GGcode.
            </div>
          </div>
        </div>
        <form id="configuratorForm" style="display:flex; flex-direction:column; gap:16px;">`;

    for (const variable of configVars) {
      html += this._renderFormField(variable);
    }

    html += '</form>';
    html +=
      '<hr style="border: none; border-top: 1px solid #333; margin: 18px 0 8px 0;">';
    html += '</div>';

    return html;
  }

  /**
   * Render a single form field based on variable type
   * @param {Object} variable - Variable configuration
   * @returns {string} HTML for the form field
   * @private
   */
  static _renderFormField(variable) {
    let html = `<div style="display:flex; align-items:center; gap:8px; padding:4px 0;">`;
    html += `<label style="color:#e0e0e0; font-weight:500; font-size:0.9em; min-width:80px; text-align:right;">${variable.name}:</label>`;

    switch (variable.type) {
      case 'number':
        html += this._renderNumberField(variable);
        break;
      case 'check':
        html += this._renderCheckboxField(variable);
        break;
      case 'selection':
        html += this._renderSelectionField(variable);
        break;
      case 'text':
        html += this._renderTextField(variable);
        break;
      default:
        html += `<div style="color:#ff6b6b;">Unknown field type: ${variable.type}</div>`;
    }

    html += `</div>`;
    return html;
  }

  /**
   * Render number input field
   * @param {Object} variable - Variable configuration
   * @returns {string} HTML for number field
   * @private
   */
  static _renderNumberField(variable) {
    const inputStyles = `margin-left:0; width:140px; padding:6px 8px; border-radius:4px; border:1px solid #444; background:#181b20; color:#fff; font-size:0.9em; transition:border 0.2s; outline:none;`;
    const focusBlurHandlers = `onfocus="this.style.borderColor='#0074D9'" onblur="this.style.borderColor='#444'; if(this.value !== '' && !isNaN(this.value)) { this.value = Math.max(this.min, Math.min(this.max, this.value)); }"`;

    let numberInputHtml = `<input type="number" title="${variable.description}" name="${variable.name}" value="${variable.defaultValue}" min="${variable.params.min ?? ''}" max="${variable.params.max ?? ''}" style="${inputStyles}" ${focusBlurHandlers}>`;

    let minMaxHtml = '';
    if (
      variable.params.min !== undefined &&
      variable.params.max !== undefined
    ) {
      minMaxHtml = ` <span style="color:#ffb347; font-size:0.85em; margin-left:6px;">[${variable.params.min}-${variable.params.max}]</span>`;
    }

    return `<div style="display:flex; align-items:center; gap:6px; flex:1;">${numberInputHtml}${minMaxHtml}</div>`;
  }

  /**
   * Render checkbox field
   * @param {Object} variable - Variable configuration
   * @returns {string} HTML for checkbox field
   * @private
   */
  static _renderCheckboxField(variable) {
    const checked = variable.defaultValue ? 'checked' : '';
    return `<div style="display:flex; align-items:center; gap:6px; flex:1;">
      <input title="${variable.description}" type="checkbox" name="${variable.name}" ${checked} style="margin-left:0; width:18px; height:18px; accent-color:#0074D9;">
    </div>`;
  }

  /**
   * Render selection dropdown field
   * @param {Object} variable - Variable configuration
   * @returns {string} HTML for selection field
   * @private
   */
  static _renderSelectionField(variable) {
    const selectStyles = `margin-left:0; width:160px; padding:6px 8px; border-radius:4px; border:1px solid #444; background:#181b20; color:#fff; font-size:0.9em; transition:border 0.2s; outline:none;`;
    const focusBlurHandlers = `onfocus="this.style.borderColor='#0074D9'" onblur="this.style.borderColor='#444'"`;

    let html = `<div style="display:flex; align-items:center; gap:6px; flex:1;">
      <select title="${variable.description}" name="${variable.name}" style="${selectStyles}" ${focusBlurHandlers}>`;

    for (const option of variable.params.options || []) {
      const selected = option == variable.defaultValue ? ' selected' : '';
      html += `<option value="${option}"${selected}>${option}</option>`;
    }

    html += `</select></div>`;
    return html;
  }

  /**
   * Render text input or textarea field
   * @param {Object} variable - Variable configuration
   * @returns {string} HTML for text field
   * @private
   */
  static _renderTextField(variable) {
    const baseStyles = `margin-left:0; padding:6px 8px; border-radius:4px; border:1px solid #444; background:#181b20; color:#fff; font-size:0.9em; transition:border 0.2s; outline:none;`;
    const focusBlurHandlers = `onfocus="this.style.borderColor='#0074D9'" onblur="this.style.borderColor='#444'"`;

    if (variable.params.rows && variable.params.rows > 1) {
      // Textarea for multi-line text
      const textareaStyles = `${baseStyles} width:100%; min-width:160px; max-width:100%; resize:vertical;`;
      return `<div style="display:flex; align-items:flex-start; gap:6px; flex:1;">
        <textarea title="${variable.description}" name="${variable.name}" rows="${variable.params.rows}" maxlength="${variable.params.max ?? ''}" style="${textareaStyles}" ${focusBlurHandlers}>${variable.defaultValue}</textarea>
      </div>`;
    } else {
      // Single-line text input
      const inputStyles = `${baseStyles} width:100%; min-width:160px; max-width:100%;`;
      let html = `<div style="display:flex; align-items:center; gap:6px; flex:1;">
        <input type="text" title="${variable.description}" name="${variable.name}" value="${variable.defaultValue}" maxlength="${variable.params.max ?? ''}" style="${inputStyles}" ${focusBlurHandlers}>`;

      if (variable.params.max) {
        html += ` <span style="color:#888; font-size:0.85em;">[max ${variable.params.max}]</span>`;
      }

      html += `</div>`;
      return html;
    }
  }

  /**
   * Create form validation styles
   * @returns {string} CSS styles for form validation
   */
  static getValidationStyles() {
    return `
      .configurator-field-error {
        border: 2px solid #ff6b6b !important;
      }
      .configurator-field-valid {
        border: 1px solid #444 !important;
      }
      .configurator-error-message {
        color: #ff6b6b;
        font-size: 0.8em;
        margin-top: 2px;
      }
    `;
  }

  /**
   * Render validation error message
   * @param {string} message - Error message
   * @returns {string} HTML for error message
   */
  static renderErrorMessage(message) {
    return `<div class="configurator-error-message">${message}</div>`;
  }

  /**
   * Render success message
   * @param {string} message - Success message
   * @returns {string} HTML for success message
   */
  static renderSuccessMessage(message) {
    return `<div style="color:#51cf66; font-size:0.9em; padding:8px; background:#1a4d3a; border-radius:4px; margin:8px 0;">
      ${message}
    </div>`;
  }

  /**
   * Render loading indicator
   * @param {string} message - Loading message
   * @returns {string} HTML for loading indicator
   */
  static renderLoadingIndicator(message = 'Loading...') {
    return `<div style="color:#aaa; padding:2em; text-align:center;">
      <div style="font-size:1.1em; margin-bottom:10px;">${message}</div>
      <div style="width:20px; height:20px; border:2px solid #444; border-top:2px solid #0074D9; border-radius:50%; animation:spin 1s linear infinite; margin:0 auto;"></div>
    </div>`;
  }

  /**
   * Get CSS animations for the configurator
   * @returns {string} CSS animation styles
   */
  static getAnimationStyles() {
    return `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .configurator-fade-in {
        animation: fadeIn 0.3s ease-in;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
  }
}

export default ConfiguratorRenderer;
