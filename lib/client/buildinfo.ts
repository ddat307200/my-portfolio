/**
 * Reads /build-info.json, written by scripts/postbuild.mjs at build time:
 * commit, build time, gzip JS sizes per route, and the latest Lighthouse run
 * from content/lighthouse.json (or "not measured"). Nothing here is estimated.
 */
export type RouteSize = { route: string; initialGzip: number; totalGzip: number };
export type LighthouseScores = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  lcpMs: number;
  cls: number;
  tbtMs: number;
  lcpElement?: string | null;
};
export type Lighthouse =
  | { measured: false }
  | {
      measured: true;
      date: string;
      commit: string;
      tool: string;
      formFactor: string;
      routes: Record<string, LighthouseScores>;
    };
export type BuildInfo = {
  commit: string;
  dirty: boolean;
  builtAt: string;
  routes: RouteSize[];
  lighthouse: Lighthouse;
};

let pending: Promise<BuildInfo | null> | null = null;
let cached: BuildInfo | null = null;

/** URL of build-info.json, relative to the core script (works under a basePath). */
function url() {
  const core = document.querySelector<HTMLScriptElement>("script#core");
  return new URL("../build-info.json", core?.src ?? window.location.href);
}

export function loadBuildInfo(): Promise<BuildInfo | null> {
  pending ??= fetch(url(), { cache: "no-cache" })
    .then((r) => (r.ok ? (r.json() as Promise<BuildInfo>) : null))
    .catch(() => null)
    .then((b) => (cached = b));
  return pending;
}

export const buildInfo = () => cached;

/** This page's route as written by js-size.mjs ("/vi/", "/en/", …). */
export function currentRoute() {
  const core = document.querySelector<HTMLScriptElement>("script#core");
  const base = core ? new URL("..", core.src).pathname.replace(/\/$/, "") : "";
  const path = window.location.pathname.slice(base.length) || "/";
  return path.endsWith("/") ? path : `${path}/`;
}
