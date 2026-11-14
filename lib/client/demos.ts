/**
 * UI for [03] run/ (lazy chunk, imported when the section gets close to the viewport).
 * All processing happens here in the browser via lib/demos/*; nothing is sent anywhere.
 */
import { demoCopy } from "../../content/demos";
import { extractOrders, ordersToRows } from "../demos/extract";
import { CsvError, parseCSV, reconcile, resultToCSV, type ReconcileResult } from "../demos/reconcile";
import { csvSamples, orderSamples } from "../demos/samples";

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = "", text?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function table(head: string[], rows: (string | number)[][], caption: string) {
  const wrap = el("div", "mt-2 overflow-x-auto rounded-lg border border-line");
  const t = el("table", "w-full border-collapse font-mono text-[13px]");
  const cap = el("caption", "sr-only", caption);
  const thead = el("thead");
  const tr = el("tr", "bg-surface-2 text-left text-muted");
  for (const h of head) {
    const th = el("th", "px-3 py-1.5 font-normal whitespace-nowrap", h);
    th.scope = "col";
    tr.append(th);
  }
  thead.append(tr);
  const tbody = el("tbody");
  for (const r of rows) {
    const row = el("tr", "border-t border-line");
    for (const c of r) row.append(el("td", "px-3 py-1.5 align-top", String(c)));
    tbody.append(row);
  }
  t.append(cap, thead, tbody);
  wrap.append(t);
  return wrap;
}

const errorBox = (msg: string) => {
  const p = el("p", "rounded-lg border border-accent/60 bg-accent/10 px-3 py-2 text-[14px] text-fg", msg);
  p.setAttribute("role", "alert");
  return p;
};

export function mountDemos(root: HTMLElement) {
  const locale = root.dataset.locale === "en" ? "en" : "vi";
  const t = demoCopy[locale].run;
  const q = <T extends Element>(s: string) => root.querySelector<T>(s);

  /* ---------- Demo 1: extract ---------- */
  const xin = q<HTMLTextAreaElement>("[data-extract-in]");
  const xout = q<HTMLElement>("[data-extract-out]");
  if (xin && xout) {
    const runExtract = () => {
      xout.replaceChildren();
      if (!xin.value.trim()) return void xout.append(errorBox(t.errors.empty));
      const res = extractOrders(xin.value);
      const rows = ordersToRows(res.orders);
      const c = t.extract.cols;
      xout.append(el("h4", "font-mono text-[13px] text-accent", t.extract.ordersTitle(res.orders.length)));
      if (rows.length)
        xout.append(
          table(
            [c.line, c.name, c.phone, c.qty, c.unit, c.product],
            rows.map((r) => [r.line, r.name || t.extract.noName, r.phone, r.qty, r.unit || "—", r.product]),
            t.extract.ordersTitle(res.orders.length),
          ),
        );
      if (res.unread.length) {
        xout.append(el("h4", "mt-4 font-mono text-[13px] text-muted", t.extract.unreadTitle(res.unread.length)));
        const ul = el("ul", "mt-2 space-y-1.5 text-[14px]");
        for (const u of res.unread) {
          const li = el("li", "rounded-md border border-dashed border-line px-3 py-1.5");
          li.append(
            el("span", "font-mono text-[12.5px] text-muted", `#${u.line} · ${t.extract.reasons[u.reason]} — `),
            el("span", "", u.raw),
          );
          ul.append(li);
        }
        xout.append(ul);
      }
      const det = el("details", "mt-4");
      det.append(el("summary", "cursor-pointer font-mono text-[13px] text-muted", t.extract.json));
      det.append(
        el(
          "pre",
          "mt-2 max-h-64 overflow-auto rounded-lg border border-line bg-bg p-3 font-mono text-[12.5px]",
          JSON.stringify(res, null, 2),
        ),
      );
      xout.append(det);
    };
    q("[data-extract-run]")?.addEventListener("click", runExtract);
    q("[data-extract-sample]")?.addEventListener("click", () => {
      xin.value = orderSamples[locale];
      runExtract();
    });
    q("[data-extract-clear]")?.addEventListener("click", () => {
      xin.value = "";
      xout.replaceChildren();
      xin.focus();
    });
    xin.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) runExtract();
    });
  }

  /* ---------- Demo 2: reconcile ---------- */
  const ain = q<HTMLTextAreaElement>('[data-csv-in="a"]');
  const bin = q<HTMLTextAreaElement>('[data-csv-in="b"]');
  const rout = q<HTMLElement>("[data-reconcile-out]");
  const dl = q<HTMLButtonElement>("[data-reconcile-download]");
  if (ain && bin && rout && dl) {
    let last: ReconcileResult | null = null;
    const r = t.reconcile;
    const runReconcile = () => {
      rout.replaceChildren();
      last = null;
      dl.disabled = true;
      let res: ReconcileResult;
      try {
        res = reconcile(parseCSV(ain.value), parseCSV(bin.value));
      } catch (e) {
        const msg =
          e instanceof CsvError
            ? t.errors.csv(e.line, e.code)
            : e instanceof Error && e.message === "no-common-key"
              ? t.errors.noKey
              : t.errors.emptyCsv;
        return void rout.append(errorBox(msg));
      }
      last = res;
      dl.disabled = false;
      rout.append(
        el(
          "p",
          "font-mono text-[13px] text-accent",
          r.summary({
            key: res.key,
            matched: res.matched.length,
            mismatched: res.mismatched.length,
            onlyA: res.onlyA.length,
            onlyB: res.onlyB.length,
          }),
        ),
      );
      const rows: (string | number)[][] = [
        ...res.mismatched.flatMap((m) => m.diffs.map((d) => [r.mismatched, m.key, d.field, d.a, d.b])),
        ...res.onlyA.map((k) => [r.onlyA, k, "", "", ""]),
        ...res.onlyB.map((k) => [r.onlyB, k, "", "", ""]),
        ...res.matched.map((k) => [r.matched, k, "", "", ""]),
      ];
      rout.append(table(["", res.key, r.field, "A", "B"], rows, r.summary({ key: res.key, matched: res.matched.length, mismatched: res.mismatched.length, onlyA: res.onlyA.length, onlyB: res.onlyB.length })));
      if (res.duplicates.length)
        rout.append(
          el("p", "mt-2 font-mono text-[12.5px] text-muted", `${r.duplicates}: ${res.duplicates.map((d) => `${d.side}:${d.key}`).join(", ")}`),
        );
    };
    q("[data-reconcile-run]")?.addEventListener("click", runReconcile);
    q("[data-reconcile-sample]")?.addEventListener("click", () => {
      ain.value = csvSamples[locale].a;
      bin.value = csvSamples[locale].b;
      runReconcile();
    });
    q("[data-reconcile-clear]")?.addEventListener("click", () => {
      ain.value = "";
      bin.value = "";
      rout.replaceChildren();
      last = null;
      dl.disabled = true;
      ain.focus();
    });
    dl.addEventListener("click", () => {
      if (!last) return;
      const blob = new Blob(["﻿" + resultToCSV(last)], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = locale === "vi" ? "doi-chieu.csv" : "reconcile.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    root.querySelectorAll<HTMLInputElement>("[data-csv-file]").forEach((input) =>
      input.addEventListener("change", async () => {
        const f = input.files?.[0];
        if (!f) return;
        const target = input.dataset.csvFile === "a" ? ain : bin;
        target.value = await f.text(); // read locally; never uploaded
      }),
    );
  }
}
