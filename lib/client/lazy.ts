/** Helpers to load heavy modules only when they are needed (brief V2 §4). */

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};

/** Run after the page is idle (falls back to a timeout where requestIdleCallback is missing). */
export function whenIdle(fn: () => void, timeout = 2500) {
  const w = window as IdleWindow;
  const start = () => {
    if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout });
    else window.setTimeout(fn, 600);
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}

/** Run once when the element comes within `margin` of the viewport. */
export function whenNear(el: Element, fn: () => void, margin = "600px") {
  if (!("IntersectionObserver" in window)) {
    fn();
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        fn();
      }
    },
    { rootMargin: margin },
  );
  io.observe(el);
}

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
