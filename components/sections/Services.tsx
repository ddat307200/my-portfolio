import { SectionHeading } from "@/components/SectionHeading";
import { copy, ids } from "@/content/copy";
import type { Locale } from "@/lib/i18n";

export function Services({ locale }: { locale: Locale }) {
  const t = copy[locale].services;
  return (
    <section id={ids.services} aria-labelledby="services-title" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <SectionHeading id="services-title" index="01" eyebrow={t.eyebrow} title={t.title} />
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {t.items.map((item) => (
          <li
            key={item.tag}
            data-reveal
            className="spotlight rounded-2xl border border-line bg-surface p-6 transition-colors duration-200 hover:bg-surface-2"
          >
            <p className="font-mono text-[11px] tracking-widest text-accent">{item.tag}</p>
            <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-[15px] text-muted">{item.body}</p>
          </li>
        ))}
      </ul>

      <div id={ids.process} className="mt-16" data-reveal>
        <h3 className="text-xl font-semibold">{t.processTitle}</h3>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step, i) => (
            <li key={step.title} className="bg-bg p-5">
              <span className="font-mono text-sm text-accent" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-medium">{step.title}</p>
              <p className="mt-1 text-[15px] text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
