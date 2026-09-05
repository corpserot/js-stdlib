import { defineConfig } from 'oxlint';

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },
  ignorePatterns: [
    'dist/**',
  ],
  env: {
    builtin: true,
  },
  plugins: [
    'promise',
    'import',
    'typescript',
    'node',
  ],
  categories: {
    correctness: 'error',
    suspicious: 'error',
    perf: 'error',
  },
  overrides: [
    {
      files: ['test/**'],
      rules: {
        "typescript/no-floating-promises": "off",
      }
    }
  ],
});
