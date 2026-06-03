import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "dist/**",
    "coverage/**",
    "patch.js",
    "TalentFlow-AI-Backend/**",
  ]),
  // Project-level rule overrides.
  {
    rules: {
      // Downgrade to warning: calling setState indirectly via async function inside
      // useEffect is a common and accepted React pattern in this codebase.
      "react-hooks/set-state-in-effect": "warn",
      // Many existing service/utility files use `any` for legacy reasons; warn rather
      // than block builds until those are migrated incrementally.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
