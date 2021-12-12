const { config } = require("@dhis2/cli-style");

module.exports = {
  plugins: ["@typescript-eslint", "react-hooks", "cypress"],
  extends: [
    config.eslintReact,
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  globals: {
    JSX: true
  },
  rules: {
    "no-console": "error",
    "import/order": "warn",
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(useRecoilCallback|useRecoilTransaction_UNSTABLE)",
      },
    ],
  },
  parser: "@typescript-eslint/parser",
  env: {
    "cypress/globals": true,
  }
};
