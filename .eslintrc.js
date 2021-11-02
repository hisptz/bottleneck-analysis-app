const { config } = require("@dhis2/cli-style");

module.exports = {
  extends: [config.eslintReact, "plugin:prettier/recommended"],
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
};
