import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  // ignores and files are paired properties that merges in a single config object
  {
    ignores: [
      "dist/**",
    ],
  },
  {
    files: [
      "src/**/*.{js,mjs,cjs,ts,mts,cts}",
      "test/**/*.{js,mjs,cjs,ts,mts,cts}"
    ],
  },
]);
