import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/app/app/_components/UserHeader.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: [
      "src/app/app/profile/profile-form.tsx",
      "src/app/login/page.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["src/proxy.ts"],
    rules: {
      "prefer-const": "off",
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
