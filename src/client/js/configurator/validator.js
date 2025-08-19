/**
 * Configurator Form Validator
 * Handles validation of configurator form inputs and values
 */

class ConfiguratorValidator {
  /**
   * Validate entire configurator form
   * @param {HTMLFormElement} form - Form element to validate
   * @param {Array} configVars - Array of configurator variables
   * @returns {Object} Validation result with isValid flag and errors
   */
  static validateForm(form, configVars) {
    const result = {
      isValid: true,
      errors: {},
      values: {},
    };

    if (!form || !configVars) {
      result.isValid = false;
      result.errors.general = 'Form or configuration variables not provided';
      return result;
    }

    // Create a map for quick variable lookup
    const varMap = {};
    for (const variable of configVars) {
      varMap[variable.name] = variable;
    }

    // Validate each form element
    for (const element of form.elements) {
      if (!element.name) continue;

      const variable = varMap[element.name];
      if (!variable) continue;

      const value = this._getElementValue(element);
      const validation = this.validateVariableValue(variable, value);

      result.values[element.name] = value;

      if (!validation.isValid) {
        result.isValid = false;
        result.errors[element.name] = validation.error;
        this._markElementAsInvalid(element, validation.error);
      } else {
        this._markElementAsValid(element);
      }
    }

    return result;
  }

  /**
   * Validate a single variable value against its constraints
   * @param {Object} variable - Variable definition
   * @param {*} value - Value to validate
   * @returns {Object} Validation result with isValid and error message
   */
  static validateVariableValue(variable, value) {
    const result = { isValid: true, error: null };

    if (!variable) {
      result.isValid = false;
      result.error = 'Variable definition not found';
      return result;
    }

    switch (variable.type) {
      case 'number':
        return this._validateNumberValue(variable, value);
      case 'text':
        return this._validateTextValue(variable, value);
      case 'selection':
        return this._validateSelectionValue(variable, value);
      case 'check':
        return this._validateCheckValue(variable, value);
      default:
        result.isValid = false;
        result.error = `Unknown variable type: ${variable.type}`;
    }

    return result;
  }

  /**
   * Validate number value
   * @param {Object} variable - Variable definition
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   * @private
   */
  static _validateNumberValue(variable, value) {
    const result = { isValid: true, error: null };

    // Convert to number
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      result.isValid = false;
      result.error = 'Must be a valid number';
      return result;
    }

    // Check minimum value
    if (variable.params.min !== undefined && numValue < variable.params.min) {
      result.isValid = false;
      result.error = `Must be at least ${variable.params.min}`;
      return result;
    }

    // Check maximum value
    if (variable.params.max !== undefined && numValue > variable.params.max) {
      result.isValid = false;
      result.error = `Must be at most ${variable.params.max}`;
      return result;
    }

    return result;
  }

  /**
   * Validate text value
   * @param {Object} variable - Variable definition
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   * @private
   */
  static _validateTextValue(variable, value) {
    const result = { isValid: true, error: null };

    const stringValue = String(value);

    // Check maximum length
    if (variable.params.max && stringValue.length > variable.params.max) {
      result.isValid = false;
      result.error = `Must be at most ${variable.params.max} characters`;
      return result;
    }

    return result;
  }

  /**
   * Validate selection value
   * @param {Object} variable - Variable definition
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   * @private
   */
  static _validateSelectionValue(variable, value) {
    const result = { isValid: true, error: null };

    if (
      variable.params.options &&
      !variable.params.options.includes(String(value))
    ) {
      result.isValid = false;
      result.error = 'Must be one of the available options';
      return result;
    }

    return result;
  }

  /**
   * Validate checkbox value
   * @param {Object} variable - Variable definition
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   * @private
   */
  static _validateCheckValue(_variable, _value) {
    // Boolean values are always valid
    return { isValid: true, error: null };
  }

  /**
   * Get value from form element based on its type
   * @param {HTMLElement} element - Form element
   * @returns {*} Element value
   * @private
   */
  static _getElementValue(element) {
    if (element.type === 'checkbox') {
      return element.checked;
    }
    return element.value;
  }

  /**
   * Mark form element as invalid
   * @param {HTMLElement} element - Form element
   * @param {string} errorMessage - Error message
   * @private
   */
  static _markElementAsInvalid(element, errorMessage) {
    element.classList.remove('configurator-field-valid');
    element.classList.add('configurator-field-error');
    element.style.border = '2px solid #ff6b6b';

    // Add or update error message
    this._updateErrorMessage(element, errorMessage);
  }

  /**
   * Mark form element as valid
   * @param {HTMLElement} element - Form element
   * @private
   */
  static _markElementAsValid(element) {
    element.classList.remove('configurator-field-error');
    element.classList.add('configurator-field-valid');
    element.style.border = '1px solid #444';

    // Remove error message
    this._removeErrorMessage(element);
  }

  /**
   * Update error message for form element
   * @param {HTMLElement} element - Form element
   * @param {string} message - Error message
   * @private
   */
  static _updateErrorMessage(element, message) {
    const errorId = `error-${element.name}`;
    let errorElement = document.getElementById(errorId);

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'configurator-error-message';
      errorElement.style.cssText =
        'color:#ff6b6b; font-size:0.8em; margin-top:2px;';

      // Insert after the element's parent container
      const container = element.closest('div');
      if (container && container.parentNode) {
        container.parentNode.insertBefore(errorElement, container.nextSibling);
      }
    }

    errorElement.textContent = message;
  }

  /**
   * Remove error message for form element
   * @param {HTMLElement} element - Form element
   * @private
   */
  static _removeErrorMessage(element) {
    const errorId = `error-${element.name}`;
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Validate form in real-time as user types
   * @param {HTMLFormElement} form - Form element
   * @param {Array} configVars - Array of configurator variables
   */
  static setupRealTimeValidation(form, configVars) {
    if (!form || !configVars) return;

    // Create a map for quick variable lookup
    const varMap = {};
    for (const variable of configVars) {
      varMap[variable.name] = variable;
    }

    // Add event listeners to form elements
    for (const element of form.elements) {
      if (!element.name) continue;

      const variable = varMap[element.name];
      if (!variable) continue;

      // Add input event listener for real-time validation
      element.addEventListener('input', () => {
        const value = this._getElementValue(element);
        const validation = this.validateVariableValue(variable, value);

        if (!validation.isValid) {
          this._markElementAsInvalid(element, validation.error);
        } else {
          this._markElementAsValid(element);
        }
      });

      // Add blur event listener for final validation
      element.addEventListener('blur', () => {
        const value = this._getElementValue(element);
        const validation = this.validateVariableValue(variable, value);

        if (!validation.isValid) {
          this._markElementAsInvalid(element, validation.error);
        } else {
          this._markElementAsValid(element);
        }
      });

      // Special handling for number inputs
      if (element.type === 'number' && variable.type === 'number') {
        element.addEventListener('blur', () => {
          const value = parseFloat(element.value);
          if (!isNaN(value)) {
            // Clamp value to min/max range
            const min =
              variable.params.min !== undefined
                ? variable.params.min
                : -Infinity;
            const max =
              variable.params.max !== undefined
                ? variable.params.max
                : Infinity;
            const clampedValue = Math.max(min, Math.min(max, value));

            if (clampedValue !== value) {
              element.value = clampedValue;
            }
          }
        });
      }
    }
  }

  /**
   * Clear all validation states from form
   * @param {HTMLFormElement} form - Form element
   */
  static clearValidationStates(form) {
    if (!form) return;

    for (const element of form.elements) {
      if (!element.name) continue;

      element.classList.remove(
        'configurator-field-error',
        'configurator-field-valid'
      );
      element.style.border = '';
      this._removeErrorMessage(element);
    }
  }

  /**
   * Get form values with type conversion
   * @param {HTMLFormElement} form - Form element
   * @param {Array} configVars - Array of configurator variables
   * @returns {Object} Form values with proper types
   */
  static getFormValues(form, configVars) {
    const values = {};

    if (!form || !configVars) return values;

    // Create a map for quick variable lookup
    const varMap = {};
    for (const variable of configVars) {
      varMap[variable.name] = variable;
    }

    for (const element of form.elements) {
      if (!element.name) continue;

      const variable = varMap[element.name];
      const rawValue = this._getElementValue(element);

      if (variable) {
        // Convert value based on variable type
        switch (variable.type) {
          case 'number':
            values[element.name] = parseFloat(rawValue);
            break;
          case 'check':
            values[element.name] = rawValue ? 1 : 0;
            break;
          default:
            values[element.name] = rawValue;
        }
      } else {
        values[element.name] = rawValue;
      }
    }

    return values;
  }
}

export default ConfiguratorValidator;
