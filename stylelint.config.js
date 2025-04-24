import propertyGroups from "stylelint-config-recess-order/groups";

/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ["node_modules", "source/theme-reset.css"],
  extends: ["stylelint-config-standard-scss", "@stylistic/stylelint-config"],
  plugins: ["@stylistic/stylelint-plugin", "stylelint-order"],
  rules: {
    // Handled through order plugin.
    "declaration-empty-line-before": null,
    "order/properties-order": propertyGroups.map(group => ({
      ...group,
      emptyLineBefore: "always",
      noEmptyLineBetween: true,
    })),
    "selector-class-pattern": null,
    "selector-id-pattern": null,
  },
};
