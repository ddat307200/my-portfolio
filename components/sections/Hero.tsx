import { Terminal } from "@/components/Terminal";
import { consoleCopy } from "@/content/console";
import { ids } from "@/content/ids";
import type { Locale } from "@/lib/i18n";

/** Hero: left = short title + name + role (the LCP element is the h1), right = working terminal. */
export function Hero({ locale }: { locale: Locale }) {
  const t = consoleCopy[locale].hero;
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="hero-dots pointer-events-none absolute inset-0" data-hero-fallback />
      {/* --mx/--my are set on this leaf element only (not the section): a custom property
          change then restyles one element instead of the whole hero subtree. */}
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" data-glow />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        data-canvas-slot
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:pt-20 lg:pb-24">
        <div>
          <p className="font-mono text-sm text-muted">
            <span className="text-accent">[00]</span> {t.label}
          </p>
          <h1 id="hero-title" className="h1 mt-4 text-balance">
            {t.title}
          </h1>
          <p className="mt-5 font-mono text-sm text-fg">{t.nameRole}</p>
          <p className="mt-3 max-w-xl text-muted">{t.lead}</p>
          <p className="mt-7 flex flex-wrap gap-3">
            <a
              href={`#${ids.run}`}
              className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-bg transition-colors duration-150 hover:bg-accent-hover"
            >
              {t.ctaRun}
            </a>
            <a
              href={`#${ids.contact}`}
              className="inline-flex h-10 items-center rounded-lg border border-line px-4 font-mono text-sm text-fg transition-colors duration-150 hover:border-muted hover:bg-surface-2"
            >
              {t.ctaContact}
            </a>
          </p>
        </div>
        <Terminal locale={locale} />
      </div>
    </section>
  );
}
