// Reports the initial JavaScript per exported route: every <script src> in the
// route's HTML, gzip-compressed (level 9). Usage: node scripts/js-size.mjs
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { gzipSync } from "node:zlib";

const out = join(import.meta.dirname, "..", "out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const pages = [];
(function walk(dir) {
  for (const n of readdirSync(dir)) {
    const f = join(dir, n);
    if (statSync(f).isDirectory()) { if (n !== "_next") walk(f); }
    else if (n === "index.html") pages.push(f);
  }
})(out);

for (const page of pages.sort()) {
  const html = readFileSync(page, "utf8");
  // noModule scripts (legacy polyfills) are skipped: modern browsers never download them.
  const tags = [...html.matchAll(/<script[^>]+src="([^"]+)"[^>]*>/g)].filter((m) => !/nomodule/i.test(m[0]));
  const srcs = [...new Set(tags.map((m) => m[1]))];
  let gz = 0;
  for (const src of srcs) {
    const file = join(out, src.replace(base, "").split("?")[0]);
    if (existsSync(file)) gz += gzipSync(readFileSync(file), { level: 9 }).length;
  }
  const route = "/" + relative(out, page).split(sep).join("/").replace(/index\.html$/, "");
  process.stdout.write(`${route.padEnd(24)} ${String(srcs.length).padStart(2)} scripts  ${(gz / 1024).toFixed(1)} KB gzip` + "\n");
}
