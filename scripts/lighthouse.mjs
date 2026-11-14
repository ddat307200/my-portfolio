// Runs Lighthouse (mobile preset: simulated slow 4G + 4x CPU slowdown) against the
// production build and writes the real scores to content/lighthouse.json, which the
// telemetry panel shows after the next build. Never edit that file by hand.
//
// Performance varies between runs (mostly through TBT), so each route is run N times
// (default 3, `--runs N`) and the median of every metric is recorded, with all runs kept.
//
// Usage: npm run start  (other terminal)  then:
//   CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" node scripts/lighthouse.mjs [baseUrl] [--runs N]
import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LH = "lighthouse@13.6.0";
const args = process.argv.slice(2);
const runsIdx = args.indexOf("--runs");
const RUNS = runsIdx >= 0 ? Math.max(1, Number(args[runsIdx + 1]) || 3) : 3;
const base = (args.find((a, i) => !a.startsWith("--") && i !== runsIdx + 1) ?? "http://localhost:4173").replace(/\/$/, "");
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round(((s[m - 1] + s[m]) / 2) * 1000) / 1000;
};
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
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const out = join(dir, `${route.replaceAll("/", "_")}-${i}.json`);
    execSync(
      `npx -y ${LH} "${base + route}" --quiet "--chrome-flags=--headless=new" --output=json "--output-path=${out}"`,
      { stdio: "inherit" },
    );
    const r = JSON.parse(readFileSync(out, "utf8"));
    const c = r.categories;
    const a = r.audits;
    const run = {
      performance: Math.round(c.performance.score * 100),
      accessibility: Math.round(c.accessibility.score * 100),
      bestPractices: Math.round(c["best-practices"].score * 100),
      seo: Math.round(c.seo.score * 100),
      lcpMs: Math.round(a["largest-contentful-paint"].numericValue),
      cls: Math.round(a["cumulative-layout-shift"].numericValue * 1000) / 1000,
      tbtMs: Math.round(a["total-blocking-time"].numericValue),
      lcpElement: lcpSnippet(a),
    };
    runs.push(run);
    process.stdout.write(`${route} run ${i + 1}/${RUNS} ${JSON.stringify(run)}
`);
  }
  const keys = ["performance", "accessibility", "bestPractices", "seo", "lcpMs", "cls", "tbtMs"];
  scores[route] = {
    ...Object.fromEntries(keys.map((k) => [k, median(runs.map((r) => r[k]))])),
    lcpElement: runs[0].lcpElement,
    runs,
  };
  process.stdout.write(`${route} median ${JSON.stringify(Object.fromEntries(keys.map((k) => [k, scores[route][k]])))}
`);
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
  runsPerRoute: RUNS,
  aggregate: "median",
  routes: scores,
};
writeFileSync(join(root, "content", "lighthouse.json"), JSON.stringify(result, null, 2) + "\n");
process.stdout.write("wrote content/lighthouse.json\n");
