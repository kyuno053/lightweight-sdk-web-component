import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ["**/*.ts"],
    plugins: {
      jsdoc,
    },
    ignores: [
      "node_modules/*",
      "dist/*",
      "**./*.d.ts"
    ],
    rules: {
      "no-console": "warn",
      'jsdoc/require-description': 'warn'
    }
  },
  ...tseslint.configs.strict,
  jsdoc.configs['flat/recommended-typescript']
);