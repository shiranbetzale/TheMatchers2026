module.exports = [
  {
    ignores: [
      'android/**',
      'ios/**',
      'node_modules/**',
      'coverage/**',
      'backend/node_modules/**',
      '**/*.ts',
      '**/*.tsx',
      'babel.config.js',
      'metro.config.js',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {},
  },
];
