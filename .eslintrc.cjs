module.exports = {
    env: {
      browser: true,
      node: false,
      jest: true,
    },
    extends: [
      'sanity',
      'sanity/react', // must come before sanity/typescript
      'sanity/typescript',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended',
    ],
    overrides: [
      {
        files: ['*.{ts,tsx}'],
      },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      project: './tsconfig.json',
    },
    plugins: ['prettier'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': 1,
      'no-shadow': 'off',
      'react/display-name': 0,
      'react/jsx-handler-names': 0,
      'react/jsx-no-bind': 0,
      "react/no-unused-prop-types": 0
    },
    settings: {
      'import/ignore': ['\\.css$', '.*node_modules.*', '.*:.*'],
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  }
  