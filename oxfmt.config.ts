import { defineConfig } from 'oxfmt';

export default defineConfig({
  printWidth: 80,
  singleQuote: true,
  sortImports: true,
  jsdoc: {
    commentLineStrategy: 'multiline',
    preferCodeFences: true,
  },
  sortPackageJson: false,
});
