// Runs Lighthouse (mobile preset: simulated slow 4G + 4x CPU slowdown) against the
// production build and writes the real scores to content/lighthouse.json, which the
// telemetry panel shows after the next build. Never edit that file by hand.
//
// Usage: npm run start  (other terminal)  then:
//   CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" node scripts/lighthouse.mjs [baseUrl]
import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LH = "lighthouse@13.6.0";
const base = (process.argv[2] ?? "http://localhost:4173").replace(/\/$/, "");
const routes = ["/vi/", "/en/"];
const root = join(import.meta.dirname, "..");
const dir = mkdtempSync(join(tmpdir(), "lh-"));

// Lighthouse 13 reports the LCP node inside the "lcp-breakdown-insight" audit.
function lcpSnippet(audits) {
  let found = null;
  (function walk(o) {
    if (found || !o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (k === "snippet" && typeof v === "string") return void (found = v);
      walk(v);
    }
  })(audits["lcp-breakdown-insight"]?.details);
  return found;
}

const scores = {};
for (const route of routes) {
  const out = join(dir, `${route.replaceAll("/", "_")}.json`);
  execSync(
    `npx -y ${LH} "${base + route}" --quiet "--chrome-flags=--headless=new" --output=json "--output-path=${out}"`,
    { stdio: "inherit" },
  );
  const r = JSON.parse(readFileSync(out, "utf8"));
  const c = r.categories;
  const a = r.audits;
  scores[route] = {
    performance: Math.round(c.performance.score * 100),
    accessibility: Math.round(c.accessibility.score * 100),
    bestPractices: Math.round(c["best-practices"].score * 100),
    seo: Math.round(c.seo.score * 100),
    lcpMs: Math.round(a["largest-contentful-paint"].numericValue),
    cls: Math.round(a["cumulative-layout-shift"].numericValue * 1000) / 1000,
    tbtMs: Math.round(a["total-blocking-time"].numericValue),
    lcpElement: lcpSnippet(a),
  };
  process.stdout.write(`${route} ${JSON.stringify(scores[route])}\n`);
}

let commit = "unknown";
try {
  commit = execSync("git rev-parse --short HEAD", { cwd: root }).toString().trim();
  if (execSync("git status --porcelain --untracked-files=no", { cwd: root }).toString().trim()) commit += "+dirty";
} catch {
  /* not a git checkout */
}
const result = {
  measured: true,
  date: new Date().toISOString(),
  commit,
  tool: LH,
  formFactor: "mobile",
  routes: scores,
};
writeFileSync(join(root, "content", "lighthouse.json"), JSON.stringify(result, null, 2) + "\n");
process.stdout.write("wrote content/lighthouse.json\n");
