module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'no-plusplus': 'off',
    'new-cap': 'off',
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'max-len': ['error', { code: 150 }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForOfStatement',
        message: 'for...of statements are not allowed.',
      },
    ],
  },
};
