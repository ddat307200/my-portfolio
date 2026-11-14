/**
 * Hero background: a dot grid that reacts to the pointer (Canvas 2D, decorative, aria-hidden).
 * - Started after idle by core.ts, never on reduced motion / weak touch devices.
 * - DPR capped at 2; the loop only runs while something moves, then stops.
 * - Paused when the tab is hidden or the hero is off-screen (IntersectionObserver).
 * - Measures its own frame rate: thins out the grid below 50 FPS, switches itself off
 *   (static SVG fallback) when it stays below 30 FPS.
 * Accent use is capped at 25% opacity, everything else is grey.
 */
type Pt = { ox: number; oy: number; x: number; y: number; vx: number; vy: number };

const setState = (s: string) => (document.documentElement.dataset.canvas = s);

export function mountCanvas(slot: HTMLElement, fallback: HTMLElement | null) {
  const area = slot.parentElement;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!area || !ctx) {
    setState("off:unsupported");
    return;
  }
  canvas.className = "hero-canvas absolute inset-0 h-full w-full";
  slot.append(canvas);

  let spacing = 34;
  const R = 170;
  let pts: Pt[] = [];
  let cols = 0;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let pointer: { x: number; y: number } | null = null;
  let running = false;
  let visible = true;
  let dead = false;

  // frame-rate watchdog (only while animating)
  let lastT = 0;
  const times: number[] = [];
  let slowSince = 0;
  let thinned = 0;

  const build = () => {
    const r = area.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const x = i * spacing + spacing / 2;
        const y = j * spacing + spacing / 2;
        pts.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
      }
    draw();
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    // edges between neighbours near the pointer (accent, ≤ 25% opacity)
    if (pointer) {
      ctx.lineWidth = 1;
      for (let k = 0; k < pts.length; k++) {
        const a = pts[k] as Pt;
        const da = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (da > R) continue;
        for (const n of [k + 1, k + cols]) {
          const b = pts[n];
          if (!b || (n === k + 1 && n % cols === 0)) continue;
          const db = Math.hypot(b.x - pointer.x, b.y - pointer.y);
          if (db > R) continue;
          const alpha = 0.25 * (1 - Math.max(da, db) / R);
          ctx.strokeStyle = `rgba(224,138,95,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      const d = pointer ? Math.hypot(p.x - pointer.x, p.y - pointer.y) : Infinity;
      ctx.fillStyle = d < R ? `rgba(224,138,95,${Math.min(0.25, 0.25 * (1 - d / R) + 0.08).toFixed(3)})` : "rgba(154,154,160,0.38)";
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }
  };

  const step = () => {
    let energy = 0;
    for (const p of pts) {
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
      energy += Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.x - p.ox) + Math.abs(p.y - p.oy);
    }
    return energy;
  };

  const watchdog = (now: number) => {
    if (lastT) times.push(now - lastT);
    lastT = now;
    if (times.length > 30) times.shift();
    if (times.length < 20) return;
    const fps = 1000 / (times.reduce((a, b) => a + b, 0) / times.length);
    if (fps < 30) {
      slowSince ||= now;
      if (now - slowSince > 2000) return kill("off:slow");
    } else slowSince = 0;
    if (fps < 50 && thinned < 3) {
      thinned++;
      spacing = Math.round(spacing * 1.3);
      times.length = 0;
      build();
    }
  };

  const frame = (now: number) => {
    if (dead) return;
    watchdog(now);
    if (dead) return;
    const e = step();
    draw();
    if (visible && !document.hidden && (pointer || e > pts.length * 0.02)) requestAnimationFrame(frame);
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

  const kill = (state: string) => {
    dead = true;
    canvas.remove();
    if (fallback) fallback.style.opacity = "";
    setState(state);
  };

  const onMove = (e: PointerEvent) => {
    const r = area.getBoundingClientRect();
    pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    wake();
  };
  area.addEventListener("pointermove", onMove, { passive: true });
  area.addEventListener("pointerleave", () => {
    pointer = null;
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
  new ResizeObserver(() => {
    if (!dead) build();
  }).observe(area);

  build();
  if (fallback) fallback.style.opacity = "0";
  setState("on");
}
