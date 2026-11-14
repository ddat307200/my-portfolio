import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import { SectionHeading } from "@/components/SectionHeading";
import { copy, ids } from "@/content/copy";
import { projects } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

export function Projects({ locale }: { locale: Locale }) {
  const t = copy[locale].projects;
  return (
    <section id={ids.projects} aria-labelledby="projects-title" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <SectionHeading id="projects-title" index="02" eyebrow={t.eyebrow} title={t.title} />
      <p className="mt-4 max-w-2xl text-muted" data-reveal>
        {t.intro}
      </p>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {projects.map((p, i) => {
          const num = String(i + 1).padStart(2, "0");
          if (p.status === "soon") {
            // Placeholder: dashed border, no link, no description of results.
            return (
              <li key={p.slug} data-reveal className="rounded-2xl border border-dashed border-line p-6">
                <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-widest">
                  <span className="text-muted">
                    <span aria-hidden="true">{num} · </span>
                    {p.label}
                  </span>
                  <span className="rounded-full border border-line px-2 py-0.5 tracking-normal text-muted">{t.soon}</span>
                </div>
                <h3 className="mt-8 text-lg font-semibold text-fg">{p.title[locale]}</h3>
              </li>
            );
          }
          return (
            <li key={p.slug} data-reveal>
              <Link
                href={`/${locale}/projects/${p.slug}/`}
                className="spotlight group block h-full rounded-2xl border border-line bg-surface p-6 transition-colors duration-200 hover:bg-surface-2"
              >
                <span className="font-mono text-[11px] tracking-widest text-muted">
                  <span aria-hidden="true">{num} · </span>
                  {p.label}
                </span>
                <h3 className="mt-8 text-lg font-semibold">{p.title[locale]}</h3>
                <p className="mt-2 line-clamp-2 text-[15px] text-muted">{p.summary[locale]}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent">
                  {t.readMore}
                  <ArrowRight />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
