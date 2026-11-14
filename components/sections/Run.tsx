import { Frame } from "@/components/Frame";
import { SectionHeading } from "@/components/SectionHeading";
import { demoCopy } from "@/content/demos";
import { ids } from "@/content/ids";
import type { Locale } from "@/lib/i18n";

const btn =
  "inline-flex h-9 items-center rounded-lg border border-line px-3 font-mono text-[13px] text-fg transition-colors duration-150 hover:border-muted hover:bg-surface-2 disabled:opacity-50 disabled:hover:bg-transparent";
const btnPrimary =
  "inline-flex h-9 items-center rounded-lg bg-accent px-3.5 font-mono text-[13px] font-medium text-bg transition-colors duration-150 hover:bg-accent-hover";
const area =
  "mt-1.5 block h-40 w-full resize-y rounded-lg border border-line bg-bg p-3 font-mono text-[13px] leading-relaxed text-fg placeholder:text-muted focus:border-muted";

/**
 * [03] run/: two real tools that run in the browser (code in lib/demos/, UI in
 * lib/client/demos.ts, loaded with dynamic import when this section gets close).
 */
export function Run({ locale }: { locale: Locale }) {
  const t = demoCopy[locale].run;
  return (
    <section id={ids.run} aria-labelledby="run-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading id="run-title" index="03" slug="run" title={t.title} />
      <p className="mt-4 max-w-2xl text-muted" data-reveal>
        {t.lead}
      </p>
      <p className="mt-3 flex items-center gap-2 font-mono text-[13px] text-fg" data-reveal>
        <span className="dot-ok" aria-hidden="true" />
        {t.privacy}
      </p>
      <p className="nojs-only mt-6 rounded-[10px] border border-dashed border-line p-4 text-muted">{t.nojs}</p>

      <div className="js-only mt-8 grid gap-4 lg:grid-cols-2" data-demos data-locale={locale}>
        {/* Demo 1: extract orders */}
        <Frame label={t.extract.frame} className="min-w-0" data-reveal>
          <div className="p-4 sm:p-5">
            <h3 className="text-lg font-semibold">{t.extract.title}</h3>
            <p className="mt-1 text-[15px] text-muted">{t.extract.desc}</p>
            <p className="mt-2 font-mono text-[12.5px] text-muted">{t.extract.rules}</p>
            <label className="mt-4 block font-mono text-[13px] text-muted" htmlFor={`extract-in-${locale}`}>
              {t.extract.inputLabel}
            </label>
            <textarea id={`extract-in-${locale}`} data-extract-in spellCheck={false} className={area} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className={btnPrimary} data-extract-run>
                {t.extract.action}
              </button>
              <button type="button" className={btn} data-extract-sample>
                {t.sample}
              </button>
              <button type="button" className={btn} data-extract-clear>
                {t.clear}
              </button>
            </div>
            <div data-extract-out aria-live="polite" className="mt-4 min-w-0" />
          </div>
        </Frame>

        {/* Demo 2: reconcile two CSV lists */}
        <Frame label={t.reconcile.frame} className="min-w-0" data-reveal>
          <div className="p-4 sm:p-5">
            <h3 className="text-lg font-semibold">{t.reconcile.title}</h3>
            <p className="mt-1 text-[15px] text-muted">{t.reconcile.desc}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(["a", "b"] as const).map((side) => (
                <div key={side} className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <label className="font-mono text-[13px] text-muted" htmlFor={`csv-${side}-${locale}`}>
                      {side === "a" ? t.reconcile.labelA : t.reconcile.labelB}
                    </label>
                    <label className="cursor-pointer font-mono text-[12.5px] text-accent underline underline-offset-4 focus-within:outline-3 focus-within:outline-accent">
                      {t.reconcile.file}
                      <input type="file" accept=".csv,text/csv" className="sr-only" data-csv-file={side} />
                    </label>
                  </div>
                  <textarea id={`csv-${side}-${locale}`} data-csv-in={side} spellCheck={false} className={area} />
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className={btnPrimary} data-reconcile-run>
                {t.reconcile.action}
              </button>
              <button type="button" className={btn} data-reconcile-sample>
                {t.sample}
              </button>
              <button type="button" className={btn} data-reconcile-clear>
                {t.clear}
              </button>
              <button type="button" className={btn} data-reconcile-download disabled>
                {t.reconcile.download}
              </button>
            </div>
            <div data-reconcile-out aria-live="polite" className="mt-4 min-w-0" />
          </div>
        </Frame>
      </div>
    </section>
  );
}
