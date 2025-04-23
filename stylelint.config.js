/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss", "stylelint-config-clean-order"],
  plugins: ["stylelint-order"],
  rules: {
    "selector-class-pattern": null,
  },
};
