import js from '@eslint/js';

export default [
  {
    ignores: [
      'dist',
      'node_modules', 
      'OLD_ASSETS/**',
      '.husky',
      'coverage',
      'reports',
      '*.config.js',
      '*.config.ts'
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      'no-console': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
      'prefer-template': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      'no-console': 'off', // Allow console in tests
    },
  },
];