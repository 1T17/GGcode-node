module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
    browser: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['src/server/**/*.js', 'tests/**/*.js'],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        node: true,
        browser: false,
        jest: true
      }
    },
    {
      files: ['src/client/**/*.js'],
      parserOptions: {
        sourceType: 'module'
      },
      env: {
        browser: true,
        node: false,
        es2021: true
      },
      globals: {
        THREE: 'readonly',
        monaco: 'readonly',
        require: 'readonly'
      }
    }
  ],
  rules: {
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_'
      }
    ],
    'no-console': 'off'
  }
};