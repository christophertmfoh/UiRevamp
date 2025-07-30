import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'reports',
      'OLD_ASSETS',
      '.husky',
    ],
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      'no-console': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
      'prefer-template': 'error',
      'no-duplicate-imports': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.config.{js,ts}'],
    rules: {
      'no-console': 'off',
    },
  },
];