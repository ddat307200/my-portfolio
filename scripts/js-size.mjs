// Measures JavaScript in the static export (gzip level 9), per route:
// - initial: scripts referenced by the HTML + their static imports (what the first view needs);
// - total:   initial + every chunk reachable through dynamic import() (everything, once loaded).
// Usage: node scripts/js-size.mjs   (also imported by postbuild.mjs to write build-info.json)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep, dirname, resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { pathToFileURL } from "node:url";

const gz = (file) => gzipSync(readFileSync(file), { level: 9 }).length;

function deps(file) {
  const src = readFileSync(file, "utf8");
  const stat = [...src.matchAll(/(?:from|import)\s*"(\.{1,2}\/[^"]+\.js)"/g)].map((m) => m[1]);
  const dyn = [...src.matchAll(/import\(\s*"(\.{1,2}\/[^"]+\.js)"\s*\)/g)].map((m) => m[1]);
  const abs = (p) => resolve(dirname(file), p);
  return { stat: stat.map(abs), dyn: dyn.map(abs) };
}

function closure(entries, followDynamic) {
  const seen = new Set();
  const stack = [...entries];
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f) || !existsSync(f)) continue;
    seen.add(f);
    const d = deps(f);
    stack.push(...d.stat, ...(followDynamic ? d.dyn : []));
  }
  return seen;
}

export function measure(outDir = join(import.meta.dirname, "..", "out")) {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  const pages = [];
  (function walk(dir) {
    for (const n of readdirSync(dir)) {
      const f = join(dir, n);
      if (statSync(f).isDirectory()) {
        if (n !== "_next" && n !== "js") walk(f);
      } else if (n === "index.html") pages.push(f);
    }
  })(outDir);

  return pages.sort().map((page) => {
    const html = readFileSync(page, "utf8");
    // noModule scripts (legacy polyfills) are never downloaded by modern browsers.
    const tags = [...html.matchAll(/<script[^>]+src="([^"]+)"[^>]*>/g)].filter((m) => !/nomodule/i.test(m[0]));
    const entries = [...new Set(tags.map((m) => join(outDir, m[1].replace(base, "").split("?")[0])))];
    const sum = (set) => [...set].reduce((n, f) => n + gz(f), 0);
    const route = "/" + relative(outDir, page).split(sep).join("/").replace(/index\.html$/, "");
    return {
      route,
      initialGzip: sum(closure(entries, false)),
      totalGzip: sum(closure(entries, true)),
    };
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  for (const r of measure()) {
    process.stdout.write(
      `${r.route.padEnd(18)} initial ${(r.initialGzip / 1024).toFixed(1).padStart(6)} KB   total ${(r.totalGzip / 1024).toFixed(1).padStart(6)} KB  (gzip)` + "\n",
    );
  }
}
