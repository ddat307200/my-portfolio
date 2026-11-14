import { Frame } from "@/components/Frame";
import { SectionHeading } from "@/components/SectionHeading";
import { copy, ids } from "@/content/copy";
import type { Locale } from "@/lib/i18n";

export function Services({ locale }: { locale: Locale }) {
  const t = copy[locale].services;
  return (
    <section id={ids.services} aria-labelledby="services-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading id="services-title" index="02" slug="services" title={t.title} />
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {t.items.map((item, i) => (
          <Frame
            as="li"
            key={item.tag}
            data-reveal
            className="spotlight transition-colors duration-200 hover:bg-surface-2"
            label={
              <>
                <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> {item.tag.toLowerCase()}
              </>
            }
          >
            <div className="p-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-[15px] text-muted">{item.body}</p>
            </div>
          </Frame>
        ))}
      </ul>

      <div id={ids.process} className="mt-16" data-reveal>
        <h3 className="font-mono text-sm text-muted">
          <span className="text-accent">$</span> {t.processTitle}
        </h3>
        <ol className="mt-5 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step, i) => (
            <li key={step.title} className="bg-bg p-5">
              <span className="font-mono text-sm text-accent" aria-hidden="true">
                step.{String(i + 1).padStart(2, "0")}
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
