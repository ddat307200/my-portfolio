/**
 * Interactive layer for the hero terminal (lazy chunk, loaded after idle by core.ts).
 * Fixed script, not an AI: every command is answered by lib/terminal/commands.ts.
 */
import type { Locale } from "../i18n";
import { bootCommands, completions, run, type Line } from "../terminal/commands";

const TONE: Record<string, string> = { muted: "text-muted", accent: "text-accent", ok: "text-[var(--ok)]" };

function lineEl(line: Line): HTMLElement {
  const div = document.createElement("div");
  div.className = "whitespace-pre-wrap break-words";
  for (const s of line) {
    if (s.href) {
      const a = document.createElement("a");
      a.href = s.href;
      a.textContent = s.t;
      a.className = "text-fg underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent";
      if (s.href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      div.append(a);
    } else {
      const span = document.createElement("span");
      if (s.tone) span.className = TONE[s.tone] ?? "";
      span.textContent = s.t;
      div.append(span);
    }
  }
  if (line.length === 0) div.textContent = " ";
  return div;
}

export type BuildInfo = { commit: string; builtAt: string };

export function mountTerminal(root: HTMLElement, opts: { boot: boolean; build?: () => BuildInfo | undefined }) {
  const locale = (root.dataset.locale === "en" ? "en" : "vi") as Locale;
  const log = root.querySelector<HTMLElement>("[data-term-log]");
  const form = root.querySelector<HTMLFormElement>("[data-term-form]");
  const input = root.querySelector<HTMLInputElement>("[data-term-input]");
  const skip = root.querySelector<HTMLButtonElement>("[data-term-skip]");
  if (!log || !form || !input || !skip) return;

  const staticHTML = log.innerHTML;
  const past: string[] = [];
  let hIndex = -1;
  let booting = false;
  const timers: number[] = [];

  const scroll = () => (log.scrollTop = log.scrollHeight);
  const append = (line: Line) => {
    log.append(lineEl(line));
    scroll();
  };

  const act = (res: ReturnType<typeof run>) => {
    const a = res.action;
    if (!a) return;
    if (a.type === "clear") log.replaceChildren();
    if (a.type === "open") {
      const target = document.getElementById(a.id);
      if (target) {
        target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        window.history.replaceState(null, "", `#${a.id}`);
      }
    }
    if (a.type === "lang") {
      const link = document.querySelector<HTMLAnchorElement>("[data-lang-switch]");
      if (a.to !== locale && link) window.location.href = link.href;
    }
  };

  const exec = (raw: string) => {
    const cmd = raw.trim();
    const block = document.createElement("div");
    block.className = "mt-2";
    block.append(lineEl([{ t: "$ ", tone: "accent" }, { t: cmd }]));
    const res = run(locale, cmd, opts.build?.());
    for (const l of res.lines) block.append(lineEl(l));
    log.append(block);
    act(res);
    scroll();
    if (cmd) {
      past.push(cmd);
      hIndex = past.length;
    }
  };

  /* ---- boot replay: type `whoami` then `status`, skippable ---- */
  const endBoot = () => {
    if (!booting) return;
    booting = false;
    timers.forEach((id) => window.clearTimeout(id));
    window.removeEventListener("keydown", onAnyKey, true);
    log.innerHTML = staticHTML;
    skip.hidden = true;
    log.setAttribute("aria-live", "polite");
    scroll();
    try {
      sessionStorage.setItem("boot-played", "1");
    } catch {
      /* storage blocked */
    }
  };
  const onAnyKey = (e: KeyboardEvent) => {
    if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
    endBoot();
  };

  if (opts.boot) {
    booting = true;
    delete document.documentElement.dataset.boot;
    log.replaceChildren();
    skip.hidden = false;
    skip.addEventListener("click", endBoot);
    window.addEventListener("keydown", onAnyKey, true);
    let time = 150;
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    // Banner first (instant), then each boot command typed character by character.
    const tmp = document.createElement("div");
    tmp.innerHTML = staticHTML;
    const bannerLine = tmp.querySelector("[data-term-static] > div");
    if (bannerLine) log.append(bannerLine.cloneNode(true));
    for (const c of bootCommands) {
      const block = document.createElement("div");
      block.className = "mt-2";
      const prompt = lineEl([{ t: "$ ", tone: "accent" }, { t: "" }]);
      const typed = prompt.lastElementChild as HTMLElement;
      at(time, () => {
        log.append(block);
        block.append(prompt);
      });
      for (let i = 1; i <= c.length; i++) {
        time += 22 + Math.random() * 18;
        at(time, () => (typed.textContent = c.slice(0, i)));
      }
      time += 180;
      for (const l of run(locale, c).lines) {
        time += 45;
        at(time, () => {
          block.append(lineEl(l));
          scroll();
        });
      }
      time += 250;
    }
    at(time, endBoot);
  } else {
    log.setAttribute("aria-live", "polite");
  }

  /* ---- prompt ---- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    endBoot();
    exec(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      if (!past.length) return;
      e.preventDefault();
      hIndex = Math.max(0, hIndex - 1);
      input.value = past[hIndex] ?? "";
    } else if (e.key === "ArrowDown") {
      if (!past.length) return;
      e.preventDefault();
      hIndex = Math.min(past.length, hIndex + 1);
      input.value = past[hIndex] ?? "";
    } else if (e.key === "Tab" && !e.shiftKey) {
      // Complete only when there is something to complete; otherwise Tab moves focus (no trap).
      const v = input.value.trimStart().toLowerCase();
      if (!v) return;
      const matches = completions.filter((c) => c.startsWith(v) && c !== v);
      if (!matches.length) return;
      e.preventDefault();
      if (matches.length === 1) input.value = matches[0] ?? v;
      else {
        let prefix = matches[0] ?? "";
        for (const m of matches) while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
        if (prefix.length > v.length) input.value = prefix;
        else append([{ t: matches.join("   "), tone: "muted" }]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      input.blur();
      root.focus();
    }
  });

  root.querySelectorAll<HTMLButtonElement>("[data-term-run]").forEach((b) =>
    b.addEventListener("click", () => {
      endBoot();
      exec(b.dataset.termRun ?? "");
    }),
  );
}
