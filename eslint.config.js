import globals from "globals";
import js from "@eslint/js";
import css from "@eslint/css";
import html from "@html-eslint/eslint-plugin";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    ...js.configs.recommended,
  },
  {
    files: ["**/*.css"],
    language: "css/css",
    ...css.configs.recommended,
  },

  {
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
  },
  eslintPluginPrettierRecommended,
];
