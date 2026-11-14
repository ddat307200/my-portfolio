/**
 * [04] architecture/: show the detail of one node at a time (hover, focus or click).
 * Lazy chunk. Without JS all details stay visible (see globals.css).
 */
export function mountDiagram(root: HTMLElement) {
  const nodes = [...root.querySelectorAll<HTMLButtonElement>("[data-node]")];
  const details = [...root.querySelectorAll<HTMLElement>("[data-node-detail]")];
  const show = (id: string, pin = false) => {
    for (const d of details) d.classList.toggle("is-active", d.dataset.nodeDetail === id);
    if (pin) for (const n of nodes) n.setAttribute("aria-pressed", String(n.dataset.node === id));
  };
  let pinned = nodes.find((n) => n.getAttribute("aria-pressed") === "true")?.dataset.node ?? nodes[0]?.dataset.node ?? "";
  for (const n of nodes) {
    const id = n.dataset.node ?? "";
    n.addEventListener("mouseenter", () => show(id));
    n.addEventListener("focus", () => show(id));
    n.addEventListener("click", () => {
      pinned = id;
      show(id, true);
    });
  }
  root.addEventListener("mouseleave", () => show(pinned));
}
