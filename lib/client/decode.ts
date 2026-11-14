/**
 * "Decode" text effect: random glyphs settle into the real text over ~500ms.
 * Only touches [data-decode] elements, which sit inside aria-hidden wrappers
 * (the accessible text is separate). Runs once per element; skipped with reduced motion.
 */
const GLYPHS = "!<>-_\\/[]{}=+*^?#0123456789abcdef";

export function decode(el: HTMLElement, duration = 520) {
  const final = el.dataset.decodeText ?? el.textContent ?? "";
  el.dataset.decodeText = final;
  const start = performance.now();
  let lastDraw = 0;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    // ~25 updates/s is enough for the effect and keeps style/layout work low on slow CPUs.
    if (p < 1 && now - lastDraw < 40) return void requestAnimationFrame(tick);
    lastDraw = now;
    const settled = Math.floor(final.length * p);
    let out = final.slice(0, settled);
    for (let i = settled; i < final.length; i++) {
      out += final[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  };
  requestAnimationFrame(tick);
}
