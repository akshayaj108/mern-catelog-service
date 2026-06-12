import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export default defineConfig([
//   js.configs.recommended,
//   ...tseslint.configs.recommended,
//   ...tseslint.configs.recommendedTypeChecked,
//   { 
//     ignores: [
//       "dist/**",
//       "node_modules/**",
//       "coverage/**",
//       "**/*.spec.ts",
//       "tests/**",
//       "eslint.config.mjs",
//       "jest.config.*", 
//          "scripts/**",    // ← add this
//     "**/*.mjs",      // ← add this
//     "**/*.cjs",
//     ],
//     files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
//     languageOptions: {
//       parser: tseslint.parser,
//       parserOptions: {
//         project: "./tsconfig.json",
//         tsconfigRootDir: __dirname,
//       },
//     },
//      rules: {
//       "no-console": "off",
//       "dot-notation": "error",
//       "@typescript-eslint/require-await": "off",
//       "@typescript-eslint/no-unsafe-assignment": "off",
//     },
//   },
// ]);



export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "**/*.spec.ts",
      "tests/**",
      "eslint.config.mjs",
      "jest.config.*", 
         "scripts/**",    // ← add this
    "**/*.mjs",      // ← add this
    "**/*.cjs",
    ],
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
     rules: {
      "no-console": "off",
      "dot-notation": "error",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/unbound-method": "off"
    },
  },
]);
