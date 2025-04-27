/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ["node_modules", "source/theme-reset.css"],
  extends: [
    "stylelint-config-standard-scss",
    "@stylistic/stylelint-config",
    "stylelint-config-clean-order",
  ],
  plugins: ["@stylistic/stylelint-plugin", "stylelint-use-nesting"],
  rules: {
    "csstools/use-nesting": "always",
    "selector-class-pattern": null,
    "selector-id-pattern": null,
  },
};
