// Bundles the browser code in lib/client/ into public/js/ (ES modules, code splitting).
// core.js is the only script the HTML references; everything else is a chunk that
// core.js loads with dynamic import() when needed. Runs before `dev` and `build`.
import { build } from "esbuild";
import { rmSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const outdir = join(root, "public", "js");
rmSync(outdir, { recursive: true, force: true });
await build({
  entryPoints: { core: join(root, "lib", "client", "core.ts") },
  outdir,
  bundle: true,
  splitting: true,
  format: "esm",
  minify: true,
  target: "es2020",
  entryNames: "[name]",
  chunkNames: "chunks/[name]-[hash]",
  legalComments: "none",
  logLevel: "warning",
});
process.stdout.write("[client] built public/js/\n");
