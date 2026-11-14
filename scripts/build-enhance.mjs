// Bundles lib/client/enhance.ts (+ Motion's inView) into public/enhance.js,
// the only script the published pages load. Runs before `dev` and `build`.
import { build } from "esbuild";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
await build({
  entryPoints: [join(root, "lib", "client", "enhance.ts")],
  outfile: join(root, "public", "enhance.js"),
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  legalComments: "none",
  logLevel: "warning",
});
process.stdout.write("[enhance] built public/enhance.js\n");
