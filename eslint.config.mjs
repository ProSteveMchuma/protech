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
    "_backup_protech/**",
    "app/hire/**",
    "app/checkout/**",
    "app/services/**",
    "app/guides/**",
    "app/apply/**",
    "components/CheckoutForm.tsx",
    "components/HireForm.tsx",
    "components/OdometerNumber.tsx",
    "components/Testimonials.tsx",
  ]),
]);

export default eslintConfig;
