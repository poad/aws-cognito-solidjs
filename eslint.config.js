// @ts-check
import solid from 'eslint-plugin-solid';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      '**/*.js'
    ],
  },
  {
    rules: {
      semi: ["error", "always"],
    },
  },
  {
    plugins: {
      tseslint: tseslint.plugin,
      solid,
    },
    languageOptions: {
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      },
      parser: tseslint.parser,
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
  },
  ...tseslint.configs.recommended,
  // @ts-ignore
  eslintConfigPrettier,
);
