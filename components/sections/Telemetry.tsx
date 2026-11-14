import { Frame } from "@/components/Frame";
import { SectionHeading } from "@/components/SectionHeading";
import { consoleCopy } from "@/content/console";
import { ids } from "@/content/ids";
import type { Locale } from "@/lib/i18n";

type Cell = { key: string; label: string; source: "live" | "build"; wide?: boolean };

/**
 * [01] status/: real numbers about this page. Values are filled by lib/client/telemetry.ts
 * (lazy). The HTML only holds labels; without JS a short note explains why it is empty.
 */
export function Telemetry({ locale }: { locale: Locale }) {
  const t = consoleCopy[locale].telemetry;
  const live: Cell[] = [
    { key: "fps", label: t.fps, source: "live" },
    { key: "lcp", label: t.lcp, source: "live" },
    { key: "cls", label: t.cls, source: "live" },
    { key: "inp", label: t.inp, source: "live" },
    { key: "viewport", label: t.viewport, source: "live" },
    { key: "dpr", label: t.dpr, source: "live" },
    { key: "cores", label: t.cores, source: "live" },
    { key: "js", label: t.jsLoaded, source: "live" },
    { key: "canvas", label: t.canvas, source: "live", wide: true },
  ];
  const build: Cell[] = [
    { key: "commit", label: t.commit, source: "build" },
    { key: "builtAt", label: t.builtAt, source: "build" },
    { key: "jsInitial", label: t.jsInitial, source: "build" },
    { key: "jsTotal", label: t.jsTotal, source: "build" },
    { key: "lighthouse", label: t.lighthouse, source: "build", wide: true },
  ];
  const cell = (wide: string) =>
    function renderCell(c: Cell) {
      return (
    <div key={c.key} className={`bg-bg px-4 py-3 ${c.wide ? wide : ""}`}>
      <dt className="flex items-center justify-between gap-2 font-mono text-[12px] text-muted">
        <span>{c.label}</span>
        <span className="flex items-center gap-1.5">
          {c.source === "live" ? <span className="dot-ok" aria-hidden="true" /> : null}
          <span>{c.source === "live" ? t.live : t.build}</span>
        </span>
      </dt>
      <dd className="mt-1 font-mono text-[17px] text-fg tabular-nums" data-tm={c.key}>
        <span className="text-muted">{t.loading}</span>
      </dd>
    </div>
      );
    };
  return (
    <section id={ids.status} aria-labelledby="status-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading id="status-title" index="01" slug="status" title={t.title} />
      <p className="mt-4 max-w-2xl text-muted" data-reveal>
        {t.lead}
      </p>
      <p className="nojs-only mt-6 rounded-[10px] border border-dashed border-line p-4 font-mono text-sm text-muted">{t.nojs}</p>
      <div className="js-only mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]" data-reveal data-telemetry>
        <Frame label={`${t.frame} · ${t.live}`} right={<svg data-tm-spark width="96" height="20" aria-hidden="true" className="text-accent" />}>
          <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">{live.map(cell("col-span-2 sm:col-span-4"))}</dl>
        </Frame>
        <Frame label={`build-info.json · ${t.build}`}>
          <dl className="grid grid-cols-2 gap-px bg-line">{build.map(cell("col-span-2"))}</dl>
        </Frame>
      </div>
      <p className="mt-4 font-mono text-[12px] text-muted" data-reveal>
        {t.honesty}
      </p>
    </section>
  );
}
