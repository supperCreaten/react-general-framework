import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores([
    "dist",
    "node_modules",
    "coverage",
    "public",
    "**/*.min.js",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // 未使用的变量、函数、导入、参数等给出警告（以 _ 开头的可忽略）
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-unused-vars": "off",

      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-debugger": "warn",
      "prefer-const": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
          // 允许 typeof import("...")，如 api/index.ts 的模块类型合并
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },
  // Vite / ESLint 等 Node 侧配置文件
  {
    files: ["*.config.{js,ts}", "vite/**/*.{js,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
