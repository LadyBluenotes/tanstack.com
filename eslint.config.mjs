// ESLint flat config for TanStack.com (TypeScript-first, with React)
import js from '@eslint/js'
import * as tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ignores = [
  'node_modules',
  'dist',
  'build',
  '.content-collections',
  '.tanstack-start',
  '.netlify',
  'public',
  'convex/.temp',
]

export default [
  { ignores },
  // JS/JSX files: use core JS recommendations
  {
    files: ['**/*.{js,jsx}'],
    ...js.configs.recommended,
  },
  // TS/TSX files: prefer TypeScript ESLint recommendations (non type-checked to reduce noise)
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        // Keep non type-checked config to approximate previous behavior
        // (add project here to enable type-aware rules in a future pass)
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Prefer TS versions of core rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
    },
  },
  // React + Hooks rules applied to both TSX/JSX
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      ...reactHooks.configs.recommended.rules,
    },
  },
]
