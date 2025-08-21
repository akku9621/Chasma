import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Custom rule overrides
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // disable 'any' errors
      "@typescript-eslint/ban-ts-comment": "off", // allow ts-expect-error / ts-ignore
      "@next/next/no-img-element": "off",          // optional: allow <img> tags
    },
  },
];

export default eslintConfig;
