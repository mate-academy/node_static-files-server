module.exports = {
  extends: '@mate-academy/eslint-config',
  env: {
    jest: true
  },
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    'no-proto': 0,
    'no-console': 0
  },
  plugins: ['jest'],
};
