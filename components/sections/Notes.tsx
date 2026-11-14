import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { copy, ids } from "@/content/copy";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { getNotes } from "@/lib/notes";

export function Notes({ locale }: { locale: Locale }) {
  const t = copy[locale].notes;
  const notes = getNotes(locale);
  return (
    <section id={ids.notes} aria-labelledby="notes-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading id="notes-title" index="07" slug="notes" title={t.title} />
      {notes.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-line p-6 text-muted" data-reveal>
          {t.empty}
        </p>
      ) : (
        <ol className="mt-8 divide-y divide-line border-y border-line">
          {notes.map((n, i) => (
            <li key={n.slug} data-reveal>
              <Link
                href={`/${locale}/notes/${n.slug}/`}
                className="group grid gap-1 py-5 sm:grid-cols-[3rem_1fr] sm:gap-4"
              >
                <span className="font-mono text-sm text-muted" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] tracking-widest text-muted">
                    <span className="text-accent">{n.category}</span>
                    <time dateTime={n.date}>{formatDate(n.date, locale)}</time>
                    <span>{t.minRead(n.minutes)}</span>
                  </span>
                  <span className="mt-1.5 block text-lg font-medium transition-colors duration-150 group-hover:text-accent">
                    {n.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[15px] text-muted">{n.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
