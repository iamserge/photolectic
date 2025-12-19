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
    "public/**",
  ]),
  // Custom Photolectic brand enforcement rules
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Enforce consistent imports
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["@radix-ui/*"],
              message: "Use components from @/components/ui instead of direct Radix imports",
            },
          ],
          paths: [
            {
              name: "next/image",
              importNames: ["default"],
              message: "Consider using Image from next/image with proper sizing attributes",
            },
          ],
        },
      ],
      // Brand color enforcement (warning for inline color usage)
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#(?!0A0A0B|F59E0B|1E293B|FAFAFA|10B981|D97706|B45309|FCD34D)[0-9A-Fa-f]{6}$/]",
          message: "Use brand colors from globals.css (amber, emerald, etc.) instead of arbitrary hex values",
        },
        {
          selector: "VariableDeclarator[id.name=/mock|Mock|dummy|Dummy|fake|Fake/i]",
          message: "Mock/dummy/fake data is not allowed. All data must come from the API.",
        },
        {
          selector: "Identifier[name=/mock|Mock|dummy|Dummy|fake|Fake/i]",
          message: "Mock/dummy/fake identifiers are not allowed. Use real data from APIs.",
        },
        {
          selector: "JSXAttribute[name.name='href'][value.value='#']",
          message: "Empty href='#' links are not allowed. Use a real route or remove the link.",
        },
        {
          selector: "JSXAttribute[name.name='href'][value.value=/^javascript:/]",
          message: "javascript: hrefs are not allowed. Use onClick handlers instead.",
        },
      ],
      // Enforce using cn() for className merging
      "no-template-curly-in-string": "off",
    },
  },
  // Component-specific rules
  {
    files: ["components/**/*.{ts,tsx}"],
    rules: {
      // Ensure components have proper display names
      "react/display-name": "off",
      // Allow any in component props for flexibility
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Stricter rules for API routes
  {
    files: ["app/api/**/*.{ts,tsx}"],
    rules: {
      // Enforce error handling in API routes
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
]);

export default eslintConfig;
