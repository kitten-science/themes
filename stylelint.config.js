import propertyGroups from "stylelint-config-recess-order/groups";

/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  plugins: ["stylelint-order"],
  rules: {
    // Handled through order plugin.
    "declaration-empty-line-before": null,
    "order/properties-order": propertyGroups.map(group => ({
      ...group,
      emptyLineBefore: "always",
      noEmptyLineBetween: true,
    })),
    "selector-class-pattern": null,
  },
};
