import globals from 'globals';
import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import stylisticJs from '@stylistic/eslint-plugin';
import nodePlugin from 'eslint-plugin-n';
import jest from 'eslint-plugin-jest';
import html from 'eslint-plugin-html';

export default defineConfig([
  globalIgnores(['eslint.config.js', 'vite.config.js']),
  eslint.configs.recommended,
  stylisticJs.configs['disable-legacy'],
  nodePlugin.configs['flat/recommended'],
  jest.configs['flat/recommended'],
  jest.configs['flat/style'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/semi': ['error', 'always'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/js/array-bracket-newline': ['error', { 'multiline': true }],
      '@stylistic/js/dot-location': ['error', 'property'],
    },
  },
  {
    files: ['public/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'n/no-unsupported-features/node-builtins': ['off']
    }
  },
  {
    files: ['public/**/*.html'],
    plugins: { html },
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    settings: {
      node: {
        version: '>=20.0.0',
      },
    },
    rules: {
      'n/no-missing-import': ['off'],
      'n/no-unsupported-features/es-builtins': [
        'error', {
          'ignores': [],
        },
      ],
    },
  },
]);
