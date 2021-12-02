const { config } = require("@dhis2/cli-style");

module.exports = {
  plugins: ["@typescript-eslint"],
  extends: [
    config.eslintReact,
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  globals: {
    JSX: true,
  },
  rules: {
    "no-console": "error",
    "import/order": "warn",
  },

  parser: "@typescript-eslint/parser",
};
