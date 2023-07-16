module.exports = {
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  overrides: [
    {
      env: {
        jest: true,
      },
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
    },
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: [
    'sort-imports-es6-autofix',
    'sort-keys-fix',
  ],
  root: true,
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    // 与 sort-imports-es6-autofix/sort-imports-es6 冲突了
    'import/no-extraneous-dependencies': 'off',
    'import/order': 'off',
    'max-len': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-expressions': ['error', {
      allowShortCircuit: true,
    }],
    'sort-imports-es6-autofix/sort-imports-es6': ['warn', {
      ignoreCase: false,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
    }],
    'sort-keys-fix/sort-keys-fix': 'warn',
  },
};
