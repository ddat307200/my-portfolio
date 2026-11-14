// Post-processes the static export in out/.
//
// 1. Removes the Next.js/React client runtime from every HTML page.
//    All pages are fully rendered at build time and no component needs hydration;
//    behaviour lives in /enhance.js (lib/client/enhance.ts). Dropping the runtime
//    takes the initial JS from ~133KB to a few KB gzip (brief §8: ≤ 120KB).
//    Kept: scripts whose id is listed in KEEP, and JSON-LD.
// 2. Deletes the RSC payload files (__next.*.txt, index.txt): nothing fetches them
//    once the client router is gone.
// 3. Writes .nojekyll (GitHub Pages) and, when no basePath is used, CNAME with the
//    domain from content/site.ts.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const out = join(root, "out");
if (!existsSync(out)) process.exit(0);

const KEEP = ["pre-paint", "enhance", "lang-redirect", "person-jsonld"];
const keepScript = (tag) =>
  KEEP.some((id) => tag.includes(`id="${id}"`)) || tag.includes('type="application/ld+json"');

let pages = 0;
let removedScripts = 0;
let removedFiles = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === "_next") continue;
      // Sentinel routes from lib/static-params.ts exist only to satisfy the build.
      if (name.startsWith("__next.") || name === "__none") {
        rmSync(full, { recursive: true, force: true });
        removedFiles++;
        continue;
      }
      walk(full);
    } else if (name.endsWith(".html")) {
      const html = readFileSync(full, "utf8")
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, (tag) => {
          const open = tag.slice(0, tag.indexOf(">") + 1);
          if (keepScript(open)) return tag;
          removedScripts++;
          return "";
        })
        .replace(/<link\b[^>]*rel="(?:preload|modulepreload)"[^>]*as="script"[^>]*\/?>/g, "")
        .replace(/<link\b[^>]*rel="modulepreload"[^>]*\/?>/g, "");
      writeFileSync(full, html);
      pages++;
    } else if (name.endsWith(".txt") && (name.startsWith("__next.") || name === "index.txt")) {
      rmSync(full);
      removedFiles++;
    }
  }
}
walk(out);
process.stdout.write(
  `[postbuild] ${pages} page(s): removed ${removedScripts} runtime script(s), ${removedFiles} RSC file(s)\n`,
);

writeFileSync(join(out, ".nojekyll"), "");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
if (!basePath) {
  const site = readFileSync(join(root, "content", "site.ts"), "utf8");
  const domain = site.match(/domain:\s*"([^"]+)"/)?.[1];
  if (domain) writeFileSync(join(out, "CNAME"), `${domain}\n`);
}
process.stdout.write("[postbuild] wrote out/.nojekyll" + (basePath ? "" : " and out/CNAME") + "\n");
