module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    /**
     * ESLint rules in addition to recommended rules
     * @see https://github.com/eslint/eslint
     */
    'accessor-pairs': 'error',
    camelcase: 'warn',
    curly: 'error',
    'default-case': 'off',
    eqeqeq: 'warn',
    'no-await-in-loop': 'error',
    'no-bitwise': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-eq-null': 'error',
    'no-negated-condition': 'warn',
    'no-param-reassign': 'error',
    'no-useless-rename': 'warn',
    'no-void': 'warn',
    'object-shorthand': 'warn',
    'prefer-destructuring': 'warn',
    'prefer-object-spread': 'warn',
    'prefer-template': 'warn',
    'require-atomic-updates': 'error',
    'spaced-comment': 'warn',
    'consistent-return': 'error',

    /**
     * Prettier
     * @see https://github.com/prettier/eslint-plugin-prettier
     */
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
      },
      settings: {
        'import/resolver': {
          typescript: {},
        },
      },
      plugins: ['unused-imports'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      rules: {
        /**
         * Typescript
         * @see https://github.com/typescript-eslint/typescript-eslint
         */
        '@typescript-eslint/consistent-type-imports': [
          'warn',
          { prefer: 'no-type-imports' },
        ],
        '@typescript-eslint/dot-notation': 'warn',
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/return-await': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-shadow': 'error',
        // Replaced by unused-imports/no-unused-vars-ts
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-unused-expressions': 'warn',

        /**
         * Imports
         * @see https://github.com/benmosher/eslint-plugin-import
         * @see https://github.com/sweepline/eslint-plugin-unused-imports
         * @see https://github.com/alexgorbatchev/eslint-import-resolver-typescript
         */
        'import/named': 'off',
        'import/namespace': 'off',
        'import/newline-after-import': 'warn',
        'import/no-absolute-path': 'warn',
        'import/no-default-export': 'warn',
        'import/no-duplicates': 'warn',
        'import/no-import-module-exports': 'warn',
        'import/no-self-import': 'warn',
        'import/no-useless-path-segments': [
          'warn',
          {
            noUselessIndex: true,
          },
        ],
        'import/no-unresolved': 'off',
        'import/order': [
          'warn',
          {
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'sort-imports': [
          'warn',
          {
            ignoreCase: true,
            ignoreDeclarationSort: true,
          },
        ],
        'unused-imports/no-unused-imports-ts': 'warn',
        'unused-imports/no-unused-vars-ts': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'all',
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-namespace': 'off',
      },
    },
  ],
};
