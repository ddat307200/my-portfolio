/**
 * The only JavaScript the published site loads (bundled by scripts/build-enhance.mjs).
 * Every page is complete HTML without it; this script only adds behaviour:
 * - hero chat animation (scripted simulation, not a real AI),
 * - reveal on scroll (Motion `inView`) and pointer light,
 * - "copy email" button,
 * - language switch keeps the current sub-page when it exists in both languages.
 */
import { inView } from "motion";

const root = document.documentElement;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Hero chat ---------- */

function hero() {
  const box = document.querySelector<HTMLElement>("[data-chat]");
  if (!box || root.dataset.hero !== "play") return;

  const answer = box.querySelector<HTMLElement>("[data-hero-stream]")?.dataset.text ?? "";
  const streamText = box.querySelector<HTMLElement>("[data-hero-stream-text]");
  const chips = box.querySelector<HTMLElement>("[data-hero-chips]");
  const skip = box.querySelector<HTMLButtonElement>("[data-hero-skip]");
  if (!streamText || !chips || !skip || !answer) {
    delete root.dataset.hero;
    return;
  }

  const words = answer.split(" ");
  const timers: number[] = [];
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  // Hand over from the pre-paint CSS hook to the component state.
  box.dataset.phase = "idle";
  chips.inert = true;
  skip.hidden = false;
  delete root.dataset.hero;

  const finish = (moveFocus: boolean) => {
    timers.forEach((id) => window.clearTimeout(id));
    box.dataset.phase = "done";
    chips.inert = false;
    chips.classList.add("fade-up");
    skip.hidden = true;
    try {
      sessionStorage.setItem("hero-played", "1");
    } catch {
      /* storage blocked: the animation may play again next time */
    }
    if (moveFocus) chips.querySelector("a")?.focus();
  };

  skip.addEventListener("click", () => finish(true));

  let time = 350;
  at(time, () => (box.dataset.phase = "thinking"));
  time += rand(800, 1100);
  at(time, () => {
    streamText.textContent = "";
    box.dataset.phase = "stream";
  });
  for (let i = 1; i <= words.length; i++) {
    time += rand(25, 45);
    at(time, () => (streamText.textContent = words.slice(0, i).join(" ")));
  }
  at(time + 120, () => finish(false));
}

/* ---------- Reveal on scroll + pointer light ---------- */

function motionFx() {
  inView(
    "[data-reveal]",
    (el) => {
      el.classList.add("is-in");
    },
    { amount: 0.15 },
  );

  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!finePointer || reducedMotion) return;

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
      const r = card.getBoundingClientRect();
      card.style.setProperty("--sx", `${x - r.left}px`);
      card.style.setProperty("--sy", `${y - r.top}px`);
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

hero();
motionFx();
copyEmail();
langSwitch();
