/**
 * Command palette (Ctrl/Cmd + K). Lazy chunk, created on first open.
 * Native <dialog>: modal, Esc closes, focus returns to the opener.
 * Section entries are read from the page's own headings, so they are always localized.
 */
import { consoleCopy } from "../../content/console";

type Item = { label: string; hint: string; run: () => void };

let dialog: HTMLDialogElement | null = null;
let opener: HTMLElement | null = null;

function items(locale: "vi" | "en"): Item[] {
  const t = consoleCopy[locale].palette;
  const list: Item[] = [];
  document.querySelectorAll<HTMLElement>("main section[id][aria-labelledby]").forEach((sec) => {
    const h = document.getElementById(sec.getAttribute("aria-labelledby") ?? "");
    const label = h?.querySelector(".sr-only")?.textContent?.trim() || h?.textContent?.trim();
    if (!label) return;
    list.push({
      label,
      hint: t.groupJump,
      run: () => {
        sec.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        window.history.replaceState(null, "", `#${sec.id}`);
        const heading = document.getElementById(sec.getAttribute("aria-labelledby") ?? "");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      },
    });
  });
  const lang = document.querySelector<HTMLAnchorElement>("[data-lang-switch]");
  if (lang) list.push({ label: t.switchLang, hint: t.groupActions, run: () => (window.location.href = lang.href) });
  const copyBtn = document.querySelector<HTMLButtonElement>("[data-copy-email]");
  if (copyBtn?.dataset.copyEmail) {
    const email = copyBtn.dataset.copyEmail;
    list.push({
      label: `${t.copyEmail} · ${email}`,
      hint: t.groupActions,
      run: async () => {
        try {
          await navigator.clipboard.writeText(email);
          announce(t.copied);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      },
    });
  }
  return list;
}

let live: HTMLElement | null = null;
function announce(msg: string) {
  if (!live) {
    live = document.createElement("div");
    live.setAttribute("role", "status");
    live.className = "sr-only";
    document.body.append(live);
  }
  live.textContent = msg;
}

function build(locale: "vi" | "en") {
  const t = consoleCopy[locale].palette;
  const d = document.createElement("dialog");
  d.setAttribute("aria-label", t.title);
  d.className =
    "palette m-auto mt-[12vh] w-[min(560px,calc(100vw-2rem))] rounded-[10px] border border-line bg-surface p-0 text-fg backdrop:bg-black/60";
  d.innerHTML = `
    <div class="frame-bar"><span>${t.title}</span><span>${t.hint}</span></div>
    <div class="flex items-center gap-2 border-b border-line px-4 py-3 font-mono">
      <span class="text-accent" aria-hidden="true">›</span>
      <input class="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted" role="combobox"
        aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list" aria-label="${t.placeholder}"
        placeholder="${t.placeholder}" spellcheck="false" autocomplete="off" />
    </div>
    <ul id="palette-list" role="listbox" class="max-h-[50vh] overflow-y-auto p-1.5 font-mono text-[14px]"></ul>`;
  document.body.append(d);
  return d;
}

export function openPalette(from?: HTMLElement | null) {
  const locale = document.documentElement.lang === "en" ? "en" : "vi";
  const t = consoleCopy[locale].palette;
  opener = from ?? (document.activeElement as HTMLElement | null);
  if (!dialog) dialog = build(locale);
  const d = dialog;
  const input = d.querySelector("input") as HTMLInputElement;
  const ul = d.querySelector("ul") as HTMLUListElement;
  const all = items(locale);
  let shown = all;
  let active = 0;

  const render = () => {
    ul.replaceChildren();
    if (!shown.length) {
      const li = document.createElement("li");
      li.className = "px-3 py-2 text-muted";
      li.textContent = t.empty;
      ul.append(li);
      input.removeAttribute("aria-activedescendant");
      return;
    }
    shown.forEach((it, i) => {
      const li = document.createElement("li");
      li.id = `palette-opt-${i}`;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(i === active));
      li.className = `flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 ${
        i === active ? "bg-surface-2 text-fg" : "text-muted"
      }`;
      const a = document.createElement("span");
      a.textContent = it.label;
      const b = document.createElement("span");
      b.className = "shrink-0 text-[12px] text-muted";
      b.textContent = it.hint;
      li.append(a, b);
      li.addEventListener("click", () => choose(i));
      li.addEventListener("mousemove", () => {
        if (active !== i) {
          active = i;
          render();
        }
      });
      ul.append(li);
    });
    input.setAttribute("aria-activedescendant", `palette-opt-${active}`);
    ul.querySelector(`#palette-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  };

  const choose = (i: number) => {
    const it = shown[i];
    d.close();
    it?.run();
  };

  input.value = "";
  input.oninput = () => {
    const q = input.value.trim().toLowerCase();
    shown = all.filter((it) => it.label.toLowerCase().includes(q));
    active = 0;
    render();
  };
  input.onkeydown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      active = Math.min(shown.length - 1, active + 1);
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      active = Math.max(0, active - 1);
      render();
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    }
  };
  d.onclose = () => {
    if (opener && document.contains(opener) && document.activeElement === document.body) opener.focus();
  };
  d.onclick = (e) => {
    if (e.target === d) d.close(); // click on the backdrop
  };
  render();
  d.showModal();
  input.focus();
}
