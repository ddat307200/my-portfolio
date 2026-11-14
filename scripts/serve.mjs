// Minimal static server for the production export in out/ (gzip on, like most hosts).
// Usage: npm run start  ->  http://localhost:4173
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, relative, sep } from "node:path";
import { gzipSync } from "node:zlib";

const root = join(import.meta.dirname, "..", "out");
const port = Number(process.env.PORT ?? 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function resolve(path) {
  let p = normalize(join(root, decodeURIComponent(path.split("?")[0])));
  if (!p.startsWith(root)) return null;
  try {
    const s = await stat(p);
    if (s.isDirectory()) p = join(p, "index.html");
    await stat(p);
    return p;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const file = await resolve(req.url ?? "/");
  const target = file ?? join(root, "404.html");
  let body;
  try {
    body = await readFile(target);
  } catch {
    res.writeHead(404).end("Not found");
    return;
  }
  const type = types[extname(target)] ?? "application/octet-stream";
  const headers = { "Content-Type": type };
  // Only hashed build assets under /_next/static/ are immutable (not the "__next.*.txt" RSC files).
  const hashed = relative(root, target).split(sep).slice(0, 2).join("/") === "_next/static";
  headers["Cache-Control"] = hashed ? "public, max-age=31536000, immutable" : "no-cache";
  if (/text|javascript|json|xml|svg/.test(type) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
    body = gzipSync(body);
    headers["Content-Encoding"] = "gzip";
  }
  res.writeHead(file ? 200 : 404, headers).end(body);
}).listen(port, () => process.stdout.write(`Serving out/ on http://localhost:${port}\n`));
