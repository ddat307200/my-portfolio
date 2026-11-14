/**
 * Hero background: a dot grid that reacts to the mouse (Canvas 2D, decorative, aria-hidden).
 * - Started after idle by core.ts, only with a real mouse (hover + fine pointer) and
 *   without reduced motion. Touch screens keep the static SVG dots (same look, no cost).
 * - DPR capped at 2. The resting grid is drawn once into an offscreen layer and copied;
 *   each frame only simulates the dots near the pointer or still moving (~100, not ~700).
 * - The loop only runs while dots are moving (a resting mouse costs nothing); paused when the tab is hidden or the
 *   hero is off-screen (IntersectionObserver).
 * - Watches its own frame rate: thins the grid below 50 FPS, switches itself off
 *   (static SVG fallback) when it stays below 30 FPS.
 * Accent is capped at 25% opacity; everything else is grey.
 */
type Pt = { ox: number; oy: number; x: number; y: number; vx: number; vy: number };

const GREY = "rgba(154,154,160,0.38)";
const setState = (s: string) => (document.documentElement.dataset.canvas = s);

export function mountCanvas(slot: HTMLElement, fallback: HTMLElement | null) {
  const area = slot.parentElement;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const layer = document.createElement("canvas");
  const lctx = layer.getContext("2d");
  if (!area || !ctx || !lctx) {
    setState("off:unsupported");
    return;
  }
  canvas.className = "hero-canvas absolute inset-0 h-full w-full";
  slot.append(canvas);

  let spacing = 34;
  const R = 170;
  let pts: Pt[] = [];
  let cols = 0;
  let rows = 0;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let pointer: { x: number; y: number } | null = null;
  const moving = new Set<number>();
  let running = false;
  let visible = true;
  let dead = false;

  // frame-rate watchdog (only while animating)
  let lastT = 0;
  const times: number[] = [];
  let slowSince = 0;
  let thinned = 0;

  const build = (width: number, height: number) => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = width;
    h = height;
    for (const c of [canvas, layer]) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    moving.clear();
    cols = Math.ceil(w / spacing) + 1;
    rows = Math.ceil(h / spacing) + 1;
    lctx.clearRect(0, 0, w, h);
    lctx.fillStyle = GREY;
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const x = i * spacing + spacing / 2;
        const y = j * spacing + spacing / 2;
        pts.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
        lctx.fillRect(x - 1, y - 1, 2, 2);
      }
    draw();
  };

  /** Indices of grid points whose resting position is within R of the pointer. */
  const nearPointer = () => {
    const out: number[] = [];
    if (!pointer) return out;
    const i0 = Math.max(0, Math.floor((pointer.x - R) / spacing));
    const i1 = Math.min(cols - 1, Math.ceil((pointer.x + R) / spacing));
    const j0 = Math.max(0, Math.floor((pointer.y - R) / spacing));
    const j1 = Math.min(rows - 1, Math.ceil((pointer.y + R) / spacing));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) out.push(j * cols + i);
    return out;
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(layer, 0, 0, w, h);
    if (!moving.size) return;
    // remove the resting copies of the dots that are drawn elsewhere this frame
    for (const k of moving) {
      const p = pts[k] as Pt;
      ctx.clearRect(p.ox - 1, p.oy - 1, 2, 2);
    }
    if (pointer) {
      ctx.lineWidth = 1;
      for (const k of moving) {
        const a = pts[k] as Pt;
        const da = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (da > R) continue;
        for (const n of [k + 1, k + cols]) {
          const b = pts[n];
          if (!b || (n === k + 1 && n % cols === 0)) continue;
          const db = Math.hypot(b.x - pointer.x, b.y - pointer.y);
          if (db > R) continue;
          ctx.strokeStyle = `rgba(224,138,95,${(0.25 * (1 - Math.max(da, db) / R)).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const k of moving) {
      const p = pts[k] as Pt;
      const d = pointer ? Math.hypot(p.x - pointer.x, p.y - pointer.y) : Infinity;
      ctx.fillStyle = d < R ? `rgba(224,138,95,${Math.min(0.25, 0.25 * (1 - d / R) + 0.08).toFixed(3)})` : GREY;
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }
  };

  /** Advances the simulation; returns the largest speed (0 = everything settled). */
  const step = () => {
    let maxV = 0;
    for (const k of nearPointer()) moving.add(k);
    for (const k of moving) {
      const p = pts[k] as Pt;
      if (pointer) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < R && d > 0.01) {
          const f = (1 - d / R) * 1.4;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }
      p.vx = (p.vx + (p.ox - p.x) * 0.08) * 0.8;
      p.vy = (p.vy + (p.oy - p.y) * 0.08) * 0.8;
      p.x += p.vx;
      p.y += p.vy;
      maxV = Math.max(maxV, Math.abs(p.vx) + Math.abs(p.vy));
      const resting = Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.x - p.ox) + Math.abs(p.y - p.oy) < 0.05;
      const near = pointer && Math.hypot(p.ox - pointer.x, p.oy - pointer.y) < R;
      if (resting && !near) {
        p.x = p.ox;
        p.y = p.oy;
        p.vx = p.vy = 0;
        moving.delete(k);
      }
    }
    return maxV;
  };

  const kill = (state: string) => {
    dead = true;
    canvas.remove();
    if (fallback) fallback.style.opacity = "";
    setState(state);
  };

  const watchdog = (now: number) => {
    if (lastT) times.push(now - lastT);
    lastT = now;
    if (times.length > 30) times.shift();
    if (times.length < 20) return;
    const fps = 1000 / (times.reduce((a, b) => a + b, 0) / times.length);
    if (fps < 30) {
      slowSince ||= now;
      if (now - slowSince > 2000) kill("off:slow");
    } else slowSince = 0;
    if (!dead && fps < 50 && thinned < 3) {
      thinned++;
      spacing = Math.round(spacing * 1.3);
      times.length = 0;
      build(w, h);
    }
  };

  const frame = (now: number) => {
    if (dead) return;
    watchdog(now);
    if (dead) return;
    const speed = step();
    draw();
    // Keep animating only while dots are still moving; a resting mouse costs nothing.
    if (visible && !document.hidden && speed > 0.02) requestAnimationFrame(frame);
    else {
      running = false;
      lastT = 0;
    }
  };
  const wake = () => {
    if (running || dead || !visible || document.hidden) return;
    running = true;
    requestAnimationFrame(frame);
  };

  // Page coordinates of the hero, measured once per pointer entry (not on every move).
  let origin: { left: number; top: number } | null = null;
  const measure = () => {
    const r = area.getBoundingClientRect();
    origin = { left: r.left + window.scrollX, top: r.top + window.scrollY };
  };
  area.addEventListener("pointerenter", measure, { passive: true });
  area.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      if (!origin) measure(); // pointer was already inside when the canvas started
      if (!origin) return;
      pointer = { x: e.pageX - origin.left, y: e.pageY - origin.top };
      wake();
    },
    { passive: true },
  );
  area.addEventListener("pointerleave", () => {
    pointer = null;
    origin = null;
    wake();
  });

  new IntersectionObserver((entries) => {
    visible = entries.some((x) => x.isIntersecting);
    if (!dead) setState(visible ? "on" : "off:hidden");
    if (visible) wake();
  }).observe(area);
  document.addEventListener("visibilitychange", () => {
    if (dead) return;
    setState(document.hidden ? "off:hidden" : visible ? "on" : "off:hidden");
    if (!document.hidden) wake();
  });
  // ResizeObserver gives the size without forcing a layout; it also does the first build.
  new ResizeObserver((entries) => {
    const box = entries[0]?.contentRect;
    if (!dead && box) build(box.width, box.height);
  }).observe(area);

  if (fallback) fallback.style.opacity = "0";
  setState("on");
}
