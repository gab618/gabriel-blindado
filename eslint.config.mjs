import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "app/[lang]/posts/**",
      "app/[lang]/notas/**",
      "app/[lang]/projetos/**",
      "app/[lang]/tags/**",
      "lib/content/**",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/tools/**", "@/tools"],
              message: "Content code must not import tool modules.",
            },
            {
              group: ["@/components/islands/**"],
              message: "Content code must not import interactive client islands.",
            },
            {
              group: ["client-only"],
              message: "Content code is server-rendered and must not import 'client-only'.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "components/islands/**",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/content/**", "@/lib/content"],
              message: "Client tools/islands must not import content compilation modules.",
            },
            {
              group: ["@/lib/i18n/dictionaries/**"],
              message: "Client tools/islands must not import dictionary runtime values directly (pass labels via props).",
              allowTypeImports: true,
            },
            {
              group: ["server-only"],
              message: "Client code must not import 'server-only'.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
