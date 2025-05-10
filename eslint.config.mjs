import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["ts/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "no-trailing-spaces": "error",
      semi: ["warn", "always"],
      "no-extra-semi": "error",
      "no-extra-parens": ["error", "all"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      indent: ["warn", 2]
    }
  }
];
