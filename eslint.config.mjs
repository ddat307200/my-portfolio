import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "out/**", "node_modules/**", "reference/**", "next-env.d.ts", "public/js/**"],
  },
  {
    rules: {
      "no-console": "error",
    },
  },
];
export default config;
