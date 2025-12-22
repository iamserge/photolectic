import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Valid internal routes for the application
// Update this list when adding new pages
const VALID_ROUTES = [
  // Public routes
  "/",
  "/about",
  "/blog",
  "/careers",
  "/contact",
  "/docs/api",
  "/gallery",
  "/license-agreement",
  "/photographers",
  "/pricing",
  "/privacy",
  "/terms",
  // Auth routes
  "/login",
  "/register",
  "/onboarding",
  // Dashboard routes
  "/dashboard",
  "/dashboard/photos",
  "/dashboard/photos/new",
  "/dashboard/purchases",
  "/dashboard/wallet",
  "/settings",
  "/settings/telegram",
  // Admin routes
  "/admin",
  "/admin/photos",
  "/admin/upload",
  "/admin/licenses",
  "/admin/users",
  // API routes (for signout etc)
  "/api/auth/signout",
];

// Dynamic route patterns (regex-like patterns for dynamic segments)
const VALID_DYNAMIC_PATTERNS = [
  "/blog/",           // /blog/[slug]
  "/careers/",        // /careers/[slug]
  "/gallery/",        // /gallery/[id]
  "/photographer/",   // /photographer/[handle]
];

// Custom ESLint rule to validate internal links
const internalLinksRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure internal links point to valid routes",
    },
    messages: {
      invalidRoute: "Invalid internal route '{{route}}'. This page does not exist. Valid routes: check VALID_ROUTES in eslint.config.mjs",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        // Only check href attributes
        if (node.name.name !== "href") return;

        // Get the value
        const value = node.value;
        if (!value) return;

        let href = null;

        // Handle string literals: href="/path"
        if (value.type === "Literal" && typeof value.value === "string") {
          href = value.value;
        }
        // Handle template literals: href={`/path`} (simple case without expressions)
        else if (
          value.type === "JSXExpressionContainer" &&
          value.expression.type === "TemplateLiteral" &&
          value.expression.expressions.length === 0
        ) {
          href = value.expression.quasis[0].value.cooked;
        }

        if (!href) return;

        // Skip external links, anchors, mailto, tel, etc.
        if (
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          href === ""
        ) {
          return;
        }

        // Must be an internal link starting with /
        if (!href.startsWith("/")) return;

        // Remove query strings and hash for validation
        const cleanPath = href.split("?")[0].split("#")[0];

        // Check if it's a valid static route
        if (VALID_ROUTES.includes(cleanPath)) return;

        // Check if it matches a dynamic route pattern
        const matchesDynamic = VALID_DYNAMIC_PATTERNS.some(pattern =>
          cleanPath.startsWith(pattern) && cleanPath.length > pattern.length
        );
        if (matchesDynamic) return;

        // Special case: /api/* routes are generally valid
        if (cleanPath.startsWith("/api/")) return;

        // Report invalid route
        context.report({
          node,
          messageId: "invalidRoute",
          data: { route: cleanPath },
        });
      },
    };
  },
};

// Custom plugin with our internal links rule
const customPlugin = {
  rules: {
    "valid-internal-links": internalLinksRule,
  },
};

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
      // Brand color and typography enforcement
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
  // Typography enforcement for pages and components
  {
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    rules: {
      // Reminder to use font-display for headings (warning only)
      "no-restricted-syntax": [
        "warn",
        {
          selector: "JSXElement[openingElement.name.name='h1']:not(:has(JSXAttribute[name.name='className'][value.value=/font-display/]))",
          message: "Consider using 'font-display' class for h1 headings (Bebas Neue)",
        },
        {
          selector: "JSXElement[openingElement.name.name='h2']:not(:has(JSXAttribute[name.name='className'][value.value=/font-display/]))",
          message: "Consider using 'font-display' class for h2 headings (Bebas Neue)",
        },
      ],
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
  // Custom internal links validation
  {
    files: ["**/*.{tsx,jsx}"],
    plugins: {
      "photolectic": customPlugin,
    },
    rules: {
      "photolectic/valid-internal-links": "error",
    },
  },
]);

export default eslintConfig;
