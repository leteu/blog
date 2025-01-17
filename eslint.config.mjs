import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import _import from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import vue from 'eslint-plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import parser from 'vue-eslint-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['plugins/**/*', '**/.eslintrc.cjs', '**/dist', '**/cache', '**/node_modules', '**/.eslintrc.cjs'],
  },
  ...compat.extends('eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      vue,
      import: fixupPluginRules(_import),
      'unused-imports': unusedImports,
    },

    languageOptions: {
      globals: {
        require: true,
      },

      parser: parser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        parser: '@typescript-eslint/parser',
        tsconfigRootDir: __dirname,
        // project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.vue'],
      },

      'import/resolver': {
        typescript: {},
      },
    },

    rules: {
      'import/no-cycle': 'error',

      'import/order': [
        'error',
        {
          groups: ['type', ['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],

          alphabetize: {
            order: 'asc',
          },

          'newlines-between': 'always',

          pathGroups: [
            {
              pattern: '**/*.+(css|sass|less|scss|pcss|styl)',

              patternOptions: {
                dot: true,
                nocomment: true,
              },

              group: 'type',
              position: 'after',
            },
            {
              pattern: '{.,..}/**/*.+(css|sass|less|scss|pcss|styl)',

              patternOptions: {
                dot: true,
                nocomment: true,
              },

              group: 'type',
              position: 'after',
            },
          ],

          distinctGroup: true,
          warnOnUnassignedImports: true,
        },
      ],

      'import/no-extraneous-dependencies': [
        'off',
        {
          devDependencies: false,
        },
      ],

      'import/no-unresolved': 0,
      'import/no-duplicates': 1,
      'import/prefer-default-export': 'off',
      'prefer-promise-reject-errors': 'off',

      quotes: [
        'warn',
        'single',
        {
          avoidEscape: true,
        },
      ],

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-var-requires': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      'no-debugger': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-floating-promises': 'off',
      semi: 'off',
      '@typescript-eslint/semi': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  },
]
