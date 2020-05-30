module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 11,
    'sourceType': 'module',
  },
  'rules': {
    'capIsNew': 0,
    'max-len': 0,
    'object-curly-spacing': [2, 'always', {}],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'require-jsdoc': 0,
  },
};
