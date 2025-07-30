import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import { fixupPluginRules } from '@eslint/compat';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

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
    plugins: {
      '@typescript-eslint': tseslint,
      'react': fixupPluginRules(reactPlugin),
      'react-hooks': fixupPluginRules(reactHooksPlugin),
      'react-refresh': fixupPluginRules(reactRefreshPlugin),
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        // Browser globals
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // Node globals for build files
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        // TypeScript globals
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLSpanElement: 'readonly',
        HTMLImageElement: 'readonly',
        HTMLAnchorElement: 'readonly',
        Element: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        HTMLElementTagNameMap: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Core ESLint rules
      'no-console': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
      'prefer-template': 'error',
      
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      
      // React rules
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/prop-types': 'off', // Using TypeScript
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      'no-console': 'off', // Allow console in tests
      '@typescript-eslint/no-explicit-any': 'warn', // Allow any in tests
    },
  },
  {
    files: ['**/*.config.{js,ts}', 'vite.config.ts', 'vitest.config.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      'no-console': 'off', // Allow console in config files
    },
  },
];