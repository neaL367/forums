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
  {
    ignores: [
      // Build / runtime artifacts
      ".next/**/*",
      "out/**/*",
      "dist/**/*",
      "next-env.d.ts", 

      // Dependencies
      "node_modules/**/*",

      // Prisma client + generated code
      "src/app/generated/**/*",
      "**/generated/**/*",
      "**/.prisma/**/*",
      "**/prisma/generated/**/*"
    ],
  },
];

export default eslintConfig;
