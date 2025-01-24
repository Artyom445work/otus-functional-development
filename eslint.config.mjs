// @ts-check
import globals from "globals";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
      languageOptions: {
        globals: { ...globals.browser, ...globals.jest, ...globals.node },
      },
      // languageOptions: { globals: globals.jest  },
      rules: {
          // "no-unused-vars": "error",
          "@typescript-eslint/no-unused-vars": "error",
          "no-undef": "error",
      },
    }
);