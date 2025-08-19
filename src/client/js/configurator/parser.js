/**
 * Configurator Variable Parser
 * Parses GGcode to extract configurator variables and their annotations
 */

class ConfiguratorParser {
  /**
   * Parse GGcode to extract configurator variables
   * @param {string} ggcode - GGcode content to parse
   * @returns {Array} Array of configurator variable objects
   */
  static parseConfiguratorVars(ggcode) {
    const lines = ggcode.split(/\r?\n/);
    const configVars = [];

    for (const line of lines) {
      const match = line.match(
        /^\s*let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^/]+?)\s*\/\/\/\s*(.*)$/
      );
      if (!match) continue;

      const name = match[1];
      const rawValue = match[2].trim();
      let tag = match[3].trim();
      let description = '';

      // Extract description if present (after //)
      const descIdx = tag.indexOf('//');
      if (descIdx !== -1) {
        description = tag.slice(descIdx + 2).trim();
        tag = tag.slice(0, descIdx).trim();
      }

      const variable = this._parseVariableTag(name, rawValue, tag, description);
      if (variable) {
        configVars.push(variable);
      }
    }

    return configVars;
  }

  /**
   * Parse a variable tag to determine type and parameters
   * @param {string} name - Variable name
   * @param {string} rawValue - Raw variable value
   * @param {string} tag - Annotation tag
   * @param {string} description - Variable description
   * @returns {Object|null} Parsed variable object or null if invalid
   * @private
   */
  static _parseVariableTag(name, rawValue, tag, description) {
    let type,
      params = {},
      defaultValue = rawValue;

    if (tag.startsWith('@number')) {
      type = 'number';
      const numMatch = tag.match(
        /@number\s+(-?\d+(?:\.\d+)?)(?:\s+|\s*to\s*)(-?\d+(?:\.\d+)?)/
      );
      if (numMatch) {
        params.min = parseFloat(numMatch[1]);
        params.max = parseFloat(numMatch[2]);
      }
      defaultValue = parseFloat(rawValue);
    } else if (tag.startsWith('@check')) {
      type = 'check';
      defaultValue = rawValue == '1' || rawValue.toLowerCase() == 'true';
    } else if (tag.startsWith('@selction')) {
      type = 'selection';
      const selMatch = tag.match(/@selction\s+([\d, ]+)/);
      if (selMatch) {
        params.options = selMatch[1]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      defaultValue = rawValue;
    } else if (tag.startsWith('@text')) {
      type = 'text';
      const textMatch = tag.match(/@text\s+(\d+)(?:\s+max\s*(\d+))?/);
      if (textMatch) {
        params.rows = parseInt(textMatch[1]);
        if (textMatch[2]) params.max = parseInt(textMatch[2]);
      }
      defaultValue = rawValue;
    } else {
      return null; // skip unknown tags
    }

    return { name, type, defaultValue, params, description };
  }

  /**
   * Update GGcode with new variable values
   * @param {string} ggcode - Original GGcode
   * @param {Object} values - New variable values
   * @returns {Object} Object with updated code and found variables
   */
  static updateGGcodeWithValues(ggcode, values) {
    const lines = ggcode.split(/\r?\n/);
    let foundVars = {};

    const newLines = lines.map((line) => {
      const match = line.match(
        /^\s*let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^/]+)(\/\/\/)/
      );
      if (!match) return line;

      const name = match[1];
      if (Object.prototype.hasOwnProperty.call(values, name)) {
        foundVars[name] = true;
        // Replace value, keep tag and description
        const newLine = line.replace(
          /(let\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*)([^/]+)(\/\/\/)/,
          function (_, p1, p2, p3) {
            return p1 + values[name] + ' ' + p3;
          }
        );
        return newLine;
      }
      return line;
    });

    // Log any variables not found in code
    const notFound = Object.keys(values).filter((name) => !foundVars[name]);

    return {
      code: newLines.join('\n'),
      foundVars,
      notFound,
    };
  }

  /**
   * Validate variable value against its constraints
   * @param {Object} variable - Variable definition
   * @param {*} value - Value to validate
   * @returns {Object} Validation result with isValid and error message
   */
  static validateVariableValue(variable, value) {
    const result = { isValid: true, error: null };

    switch (variable.type) {
      case 'number': {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          result.isValid = false;
          result.error = 'Must be a valid number';
        } else if (
          variable.params.min !== undefined &&
          numValue < variable.params.min
        ) {
          result.isValid = false;
          result.error = `Must be at least ${variable.params.min}`;
        } else if (
          variable.params.max !== undefined &&
          numValue > variable.params.max
        ) {
          result.isValid = false;
          result.error = `Must be at most ${variable.params.max}`;
        }
        break;
      }

      case 'text':
        if (variable.params.max && value.length > variable.params.max) {
          result.isValid = false;
          result.error = `Must be at most ${variable.params.max} characters`;
        }
        break;

      case 'selection':
        if (
          variable.params.options &&
          !variable.params.options.includes(value)
        ) {
          result.isValid = false;
          result.error = 'Must be one of the available options';
        }
        break;

      case 'check':
        // Boolean values are always valid
        break;
    }

    return result;
  }

  /**
   * Get default values for all configurator variables
   * @param {Array} configVars - Array of configurator variables
   * @returns {Object} Object with variable names as keys and default values
   */
  static getDefaultValues(configVars) {
    const defaults = {};
    for (const variable of configVars) {
      defaults[variable.name] = variable.defaultValue;
    }
    return defaults;
  }

  /**
   * Convert form values to appropriate types
   * @param {Object} formValues - Raw form values
   * @param {Array} configVars - Array of configurator variables
   * @returns {Object} Typed values
   */
  static convertFormValues(formValues, configVars) {
    const converted = {};
    const varMap = {};

    // Create a map for quick lookup
    for (const variable of configVars) {
      varMap[variable.name] = variable;
    }

    for (const [name, value] of Object.entries(formValues)) {
      const variable = varMap[name];
      if (!variable) {
        converted[name] = value;
        continue;
      }

      switch (variable.type) {
        case 'number':
          converted[name] = parseFloat(value);
          break;
        case 'check':
          converted[name] = value ? 1 : 0;
          break;
        default:
          converted[name] = value;
      }
    }

    return converted;
  }

  /**
   * Get variable by name
   * @param {Array} configVars - Array of configurator variables
   * @param {string} name - Variable name to find
   * @returns {Object|null} Variable object or null if not found
   */
  static getVariableByName(configVars, name) {
    return configVars.find((variable) => variable.name === name) || null;
  }

  /**
   * Get variables by type
   * @param {Array} configVars - Array of configurator variables
   * @param {string} type - Variable type to filter by
   * @returns {Array} Array of variables of the specified type
   */
  static getVariablesByType(configVars, type) {
    return configVars.filter((variable) => variable.type === type);
  }
}

export default ConfiguratorParser;
