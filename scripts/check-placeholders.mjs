// Fails the production build if any "{{...}}" placeholder is left in content/.
// `npm run build` is always a production build, so the check runs unless
// NODE_ENV is explicitly set to something other than "production".
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const env = process.env.NODE_ENV ?? "production";
if (env !== "production") {
  process.stdout.write(`[placeholders] skipped (NODE_ENV=${env})\n`);
  process.exit(0);
}

const root = join(import.meta.dirname, "..");
const dirs = ["content"];
const hits = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx|md|mdx|json)$/.test(name)) {
      readFileSync(full, "utf8")
        .split(/\r?\n/)
        .forEach((line, i) => {
          if (line.includes("{{")) hits.push(`${relative(root, full)}:${i + 1}  ${line.trim()}`);
        });
    }
  }
}

for (const d of dirs) walk(join(root, d));

if (hits.length) {
  process.stderr.write(`\n[placeholders] Build stopped: ${hits.length} unfilled "{{...}}" value(s):\n`);
  for (const h of hits) process.stderr.write(`  - ${h}\n`);
  process.stderr.write("\nFill them in content/ before publishing.\n\n");
  process.exit(1);
}
process.stdout.write("[placeholders] ok, none left in content/\n");
