/**
 * [01] status/ — live numbers about this page (lazy chunk).
 * Everything is measured here with standard browser APIs (no library):
 * requestAnimationFrame (FPS), PerformanceObserver (LCP, CLS, INP, resources).
 * Unsupported metrics say so; build values come from /build-info.json.
 */
import { consoleCopy } from "../../content/console";
import { buildInfo, currentRoute, loadBuildInfo } from "./buildinfo";

type PO = typeof PerformanceObserver & { supportedEntryTypes?: readonly string[] };
const supports = (type: string) => ((PerformanceObserver as PO).supportedEntryTypes ?? []).includes(type);

export function mountTelemetry(root: HTMLElement) {
  const locale = document.documentElement.lang === "en" ? "en" : "vi";
  const t = consoleCopy[locale].telemetry;
  const set = (key: string, value: string, muted = false) => {
    const el = root.querySelector<HTMLElement>(`[data-tm="${key}"]`);
    if (!el) return;
    el.textContent = value;
    el.classList.toggle("text-muted", muted);
  };

  /* ---- FPS (rAF frames per 500ms) + sparkline ---- */
  const spark = root.querySelector<SVGSVGElement>("[data-tm-spark]");
  const samples: number[] = [];
  let frames = 0;
  let last = performance.now();
  let onScreen = true;
  let looping = false;
  // Only count frames while the panel is visible (no work when nobody is looking).
  new IntersectionObserver((e) => {
    onScreen = e.some((x) => x.isIntersecting);
    if (onScreen && !looping) {
      looping = true;
      frames = 0;
      last = performance.now();
      requestAnimationFrame(loop);
    }
  }).observe(root);
  const loop = (now: number) => {
    if (!onScreen) {
      looping = false;
      return;
    }
    frames++;
    if (now - last >= 500) {
      const fps = Math.round((frames * 1000) / (now - last));
      frames = 0;
      last = now;
      set("fps", String(fps));
      samples.push(fps);
      if (samples.length > 48) samples.shift();
      if (spark) {
        const pts = samples.map((v, i) => `${i * 2},${20 - Math.min(20, (v / 120) * 20)}`).join(" ");
        spark.innerHTML = `<polyline fill="none" stroke="currentColor" stroke-width="1.2" points="${pts}"/>`;
      }
      tick();
    }
    requestAnimationFrame(loop);
  };
  looping = true;
  requestAnimationFrame(loop);

  /* ---- environment ---- */
  const env = () => {
    set("viewport", `${window.innerWidth}×${window.innerHeight}`);
    set("dpr", String(Math.round(window.devicePixelRatio * 100) / 100));
  };
  env();
  window.addEventListener("resize", env, { passive: true });
  const cores = navigator.hardwareConcurrency;
  set("cores", cores ? String(cores) : t.unsupported, !cores);

  /* ---- LCP ---- */
  if (supports("largest-contentful-paint")) {
    new PerformanceObserver((list) => {
      const e = list.getEntries().at(-1);
      if (e) set("lcp", `${(e.startTime / 1000).toFixed(2)} s`);
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } else set("lcp", t.unsupported, true);

  /* ---- CLS (session windows: gap < 1s, window ≤ 5s; report the largest) ---- */
  if (supports("layout-shift")) {
    let cls = 0;
    let win = 0;
    let first = 0;
    let prev = 0;
    set("cls", "0.000");
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
        if (e.hadRecentInput) continue;
        if (win && e.startTime - prev < 1000 && e.startTime - first < 5000) win += e.value;
        else {
          win = e.value;
          first = e.startTime;
        }
        prev = e.startTime;
        cls = Math.max(cls, win);
      }
      set("cls", cls.toFixed(3));
    }).observe({ type: "layout-shift", buffered: true });
  } else set("cls", t.unsupported, true);

  /* ---- INP (worst interaction; 98th percentile once there are ≥ 50) ---- */
  if (supports("event")) {
    const worst = new Map<number, number>();
    set("inp", t.noInteraction, true);
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEntry & { interactionId?: number })[]) {
        if (!e.interactionId) continue;
        worst.set(e.interactionId, Math.max(worst.get(e.interactionId) ?? 0, e.duration));
      }
      const all = [...worst.values()].sort((a, b) => b - a);
      if (!all.length) return;
      const inp = all[Math.min(all.length - 1, Math.floor(all.length / 50))] ?? 0;
      set("inp", `${Math.round(inp)} ms`);
    }).observe({ type: "event", buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
  } else set("inp", t.unsupported, true);

  /* ---- JS loaded (Resource Timing; encodedBodySize = bytes over the wire, compressed) ---- */
  const js = () => {
    const entries = (performance.getEntriesByType("resource") as PerformanceResourceTiming[]).filter((r) =>
      /\.js(\?|$)/.test(r.name),
    );
    const bytes = entries.reduce((n, r) => n + (r.encodedBodySize || 0), 0);
    if (!entries.length || !bytes) set("js", "n/a", true);
    else set("js", `${(bytes / 1024).toFixed(1)} KB · ${entries.length} ${locale === "vi" ? "tệp" : "files"}`);
  };
  js();
  if (supports("resource")) new PerformanceObserver(js).observe({ type: "resource" });

  /* ---- canvas state (written by core.ts / canvas.ts on <html data-canvas>) ---- */
  const tick = () => {
    const s = document.documentElement.dataset.canvas ?? "";
    const reason = s.startsWith("off:") ? (s.slice(4) as keyof typeof t.canvasOff) : null;
    set("canvas", s === "on" ? t.canvasOn : reason && t.canvasOff[reason] ? t.canvasOff[reason] : "—", s !== "on");
  };
  tick();

  /* ---- build values ---- */
  const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
  void loadBuildInfo().then(() => {
    const b = buildInfo();
    if (!b) {
      for (const k of ["commit", "builtAt", "jsInitial", "jsTotal", "lighthouse"]) set(k, t.notMeasured, true);
      return;
    }
    set("commit", b.commit + (b.dirty ? "+dirty" : ""));
    set("builtAt", new Date(b.builtAt).toLocaleString(locale === "vi" ? "vi-VN" : "en-GB"));
    const r = b.routes.find((x) => x.route === currentRoute());
    if (r) {
      set("jsInitial", kb(r.initialGzip));
      set("jsTotal", kb(r.totalGzip));
    } else {
      set("jsInitial", t.notMeasured, true);
      set("jsTotal", t.notMeasured, true);
    }
    const lh = b.lighthouse;
    const score = lh.measured ? lh.routes[currentRoute()] : undefined;
    if (lh.measured && score) {
      set(
        "lighthouse",
        `P ${score.performance} · A ${score.accessibility} · BP ${score.bestPractices} · SEO ${score.seo}  (${t.lhNote}: ${lh.date.slice(0, 10)}, ${lh.commit})`,
      );
    } else set("lighthouse", t.notMeasured, true);
  });
}
