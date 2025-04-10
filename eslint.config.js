// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "psk",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "psk",
          style: "kebab-case",
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          "accessibility": "explicit",
          "overrides": {
            constructors: "no-public",
          }
        }
      ],
      'indent': ['error', 2],
      "semi": ["error", "always"],
      "comma-dangle": ["error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "never",
        "exports": "never",
        "functions": "never"
      }],
      'curly': ['error', 'all'],
      'brace-style': ['error', '1tbs', {allowSingleLine: true}],
      'no-multiple-empty-lines': ['error', {max: 1, maxEOF: 0}],
      'keyword-spacing': ['error', {"before": true, "after": true}],
      'space-before-blocks': ['error', 'always'],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
