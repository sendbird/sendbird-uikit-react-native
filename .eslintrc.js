module.exports = {
  'env': {
    'es2021': true,
  },
  'extends': ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': ['@typescript-eslint'],
  'rules': {
    'linebreak-style': [2, 'unix'],
    'no-console': 1,
    'curly': [1, 'multi-line'],
    'semi': [1, 'always'],
    'quotes': [1, 'single'],
    'arrow-parens': [1, 'always'],
    'eol-last': [1, 'always'],
    'multiline-ternary': [1, 'always-multiline'],
    'no-nested-ternary': 1,
    'comma-dangle': [1, 'always-multiline'],
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-var-requires': 0,
  },
};
