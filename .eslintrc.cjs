module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: true,
        printWidth: 140,
        tabWidth: 2,
        singleQuote: true,
        bracketSpacing: true,
        trailingComma: 'all',
        arrowParens: 'always',
      },
    ],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
