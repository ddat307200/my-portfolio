/**
 * Entry module of the published site (bundled by scripts/build-client.mjs into
 * public/js/core.js, ES module with code splitting). Keep it small: heavy parts
 * (terminal, canvas, telemetry, demos, diagram) are loaded later via ./lazy.
 * Every page is complete HTML without it; this script only adds behaviour:
 * - hero chat animation (scripted simulation, not a real AI),
 * - reveal on scroll (Motion `inView`) and pointer light,
 * - "copy email" button,
 * - language switch keeps the current sub-page when it exists in both languages.
 */
import { inView } from "motion";
import { decode } from "./decode";
import { prefersReducedMotion, whenIdle, whenNear } from "./lazy";


/* ---------- Reveal on scroll + pointer light ---------- */

function motionFx() {
  const reduced = prefersReducedMotion();
  inView(
    "[data-reveal]",
    (el) => {
      el.classList.add("is-in");
      if (!reduced) el.querySelectorAll<HTMLElement>("[data-decode]").forEach((d) => decode(d));
    },
    { amount: 0.15 },
  );

  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!finePointer || reduced) return;

  let frame = 0;
  let x = 0;
  let y = 0;
  let target: Element | null = null;

  const apply = () => {
    frame = 0;
    document.querySelectorAll<HTMLElement>("[data-glow]").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (y < r.top || y > r.bottom) return;
      el.style.setProperty("--mx", `${x - r.left}px`);
      el.style.setProperty("--my", `${y - r.top}px`);
    });
    const card = target?.closest<HTMLElement>(".spotlight");
    if (card) {
      // Leaf overlay: setting the variables here restyles one element, not the card subtree.
      let spot = card.querySelector<HTMLElement>(":scope > .spot");
      if (!spot) {
        spot = document.createElement("span");
        spot.className = "spot";
        spot.setAttribute("aria-hidden", "true");
        card.prepend(spot);
      }
      const r = card.getBoundingClientRect();
      spot.style.setProperty("--sx", `${x - r.left}px`);
      spot.style.setProperty("--sy", `${y - r.top}px`);
    }
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      target = e.target instanceof Element ? e.target : null;
      if (!frame) frame = requestAnimationFrame(apply);
    },
    { passive: true },
  );
}

/* ---------- Copy email ---------- */

function copyEmail() {
  document.querySelectorAll<HTMLButtonElement>("[data-copy-email]").forEach((btn) => {
    const email = btn.dataset.copyEmail ?? "";
    const label = btn.querySelector<HTMLElement>("[data-copy-label]");
    const status = btn.parentElement?.querySelector<HTMLElement>("[role=status]");
    const idle = label?.textContent ?? "";
    let timer = 0;
    btn.hidden = false;
    btn.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
        await navigator.clipboard.writeText(email);
        btn.dataset.copied = "";
        if (label) label.textContent = btn.dataset.done ?? "";
        if (status) status.textContent = btn.dataset.done ?? "";
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          delete btn.dataset.copied;
          if (label) label.textContent = idle;
          if (status) status.textContent = "";
        }, 2000);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

/* ---------- Language switch ---------- */

function langSwitch() {
  const link = document.querySelector<HTMLAnchorElement>("[data-lang-switch]");
  if (!link) return;
  const base = link.dataset.base ?? "";
  const from = link.dataset.from ?? "";
  const to = link.dataset.to ?? "";
  let shared: string[] = [];
  try {
    shared = JSON.parse(link.dataset.shared ?? "[]") as string[];
  } catch {
    return;
  }
  const path = location.pathname.slice(base.length);
  const rest = path.replace(new RegExp(`^/${from}`), "") || "/";
  const norm = rest.endsWith("/") ? rest : `${rest}/`;
  if (shared.includes(norm)) link.href = `${base}/${to}${norm}`;
}

/* ---------- Lazy parts ---------- */

function terminal() {
  const el = document.querySelector<HTMLElement>("[data-term]");
  if (!el) return;
  const boot = document.documentElement.dataset.boot === "play";
  whenIdle(() => {
    void Promise.all([import("./terminal"), import("./buildinfo")]).then(([m, b]) => {
      void b.loadBuildInfo();
      m.mountTerminal(el, {
        boot,
        build: () => {
          const info = b.buildInfo();
          return info ? { commit: info.commit, builtAt: new Date(info.builtAt).toISOString().slice(0, 16).replace("T", " ") } : undefined;
        },
      });
    });
  }, 1500);
}

function palette() {
  const open = (from?: HTMLElement | null) => void import("./palette").then((m) => m.openPalette(from));
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open();
    }
  });
  document.querySelectorAll<HTMLButtonElement>("[data-palette-open]").forEach((b) => {
    b.addEventListener("click", () => open(b));
  });
}

function telemetry() {
  const el = document.querySelector<HTMLElement>("[data-telemetry]");
  if (!el) return;
  // Loaded when the panel is close to the viewport; LCP/CLS/INP observers use
  // `buffered: true`, so nothing from the page load is missed.
  whenNear(el, () => void import("./telemetry").then((m) => m.mountTelemetry(el)), "200px");
}

/** Decide here (not in the chunk) so the reason is known even when the canvas never loads. */
function canvasBg() {
  const slot = document.querySelector<HTMLElement>("[data-canvas-slot]");
  if (!slot) return;
  const root = document.documentElement;
  if (prefersReducedMotion()) return void (root.dataset.canvas = "off:reduced");
  // The canvas only reacts to a mouse. On touch screens it would just draw the same
  // static dots as the SVG fallback, so it is not started there at all.
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return void (root.dataset.canvas = "off:touch");
  if (!document.createElement("canvas").getContext) return void (root.dataset.canvas = "off:unsupported");
  whenIdle(() => {
    void import("./canvas").then((m) =>
      m.mountCanvas(slot, document.querySelector<HTMLElement>("[data-hero-fallback]")),
    );
  }, 3000);
}

function demos() {
  const el = document.querySelector<HTMLElement>("[data-demos]");
  if (el) whenNear(el, () => void import("./demos").then((m) => m.mountDemos(el)));
  const d = document.querySelector<HTMLElement>("[data-diagram]");
  if (d) whenNear(d, () => void import("./diagram").then((m) => m.mountDiagram(d)));
}

/* ---------- Mobile section menu (<details>, works without JS too) ---------- */

function mobileNav() {
  const d = document.querySelector<HTMLDetailsElement>("[data-mnav]");
  const s = d?.querySelector("summary");
  if (!d || !s) return;
  const sync = () => s.setAttribute("aria-expanded", String(d.open));
  sync();
  d.addEventListener("toggle", sync);
  const close = (refocus: boolean) => {
    if (!d.open) return;
    d.open = false;
    sync(); // the "toggle" event is async; keep aria-expanded exact right away
    // After an anchor jump the browser moves the focus start point to the target, so the
    // focus goes back to the button once that is done (no scroll: the page stays on the target).
    if (refocus) setTimeout(() => s.focus({ preventScroll: true }), 0);
  };
  d.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    }
  });
  // Selecting a section closes the menu; the anchor still scrolls, focus returns to the button.
  d.querySelectorAll("[data-mnav-link]").forEach((a) => a.addEventListener("click", () => close(true)));
  document.addEventListener("pointerdown", (e) => {
    if (d.open && e.target instanceof Node && !d.contains(e.target)) close(false);
  });
}

motionFx();
copyEmail();
mobileNav();
langSwitch();
palette();
terminal();
telemetry();
canvasBg();
demos();
