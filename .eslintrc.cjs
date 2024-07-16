module.exports = {
  root: true,
  env: {},
  extends: [
    'plugin:vue/base',
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vue/essential',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['plugins/**/*', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint', 'vue', 'import', 'unused-imports'],
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
            patternOptions: { dot: true, nocomment: true },
            group: 'type',
            position: 'after',
          },
          {
            pattern: '{.,..}/**/*.+(css|sass|less|scss|pcss|styl)',
            patternOptions: { dot: true, nocomment: true },
            group: 'type',
            position: 'after',
          },
        ],
        distinctGroup: true,
        warnOnUnassignedImports: true,
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
      },
    ],
    'import/no-unresolved': 0,
    'import/no-duplicates': 1,
    'import/prefer-default-export': 'off',
    'prefer-promise-reject-errors': 'off',
    quotes: ['warn', 'single', { avoidEscape: true }],
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
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-floating-promises': 'off',
    semi: 'off',
    '@typescript-eslint/semi': 'off',
  },
  globals: {
    require: true,
  },
}
