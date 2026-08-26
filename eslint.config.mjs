import antfu from "@antfu/eslint-config";

import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu(
    {
      type: "app",
      formatters: true,
      vue: true,
      typescript: {
        overrides: {
          "ts/no-redeclare": "off",
          "ts/consistent-type-definitions": ["error", "type"],
        },
      },
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
      unicorn: {
        overrides: {
          "unicorn/filename-case": ["error", {
            case: "kebabCase",
            ignore: ["README.md"],
          }],
        },
      },
    },
    {
      rules: {
        "no-console": ["warn"],
        "antfu/no-top-level-await": ["off"],
        "node/prefer-global/process": ["off"],
        "node/no-process-env": ["error"],
        "perfectionist/sort-imports": ["error", {
          tsconfigRootDir: ".",
        }],
        "camelcase": ["error", {
          properties: "always",
        }],
      },
    },
  ),
);
