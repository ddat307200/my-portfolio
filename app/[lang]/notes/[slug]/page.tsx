import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/Icons";
import { copy, ids } from "@/content/copy";
import { formatDate } from "@/lib/format";
import { isLocale, locales } from "@/lib/i18n";
import { orSentinel } from "@/lib/static-params";
import { getNote, getNotes, renderMarkdown } from "@/lib/notes";

export const dynamicParams = false;

/** Drafts are excluded by getNotes(), so they never get a page. */
export function generateStaticParams() {
  return orSentinel(
    locales.flatMap((lang) => getNotes(lang).map((n) => ({ lang, slug: n.slug }))),
    locales,
  );
}

export async function generateMetadata({ params }: PageProps<"/[lang]/notes/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const note = getNote(lang, slug);
  if (!note) return {};
  return {
    title: `${note.title} · Dang Tien Dat`,
    description: note.summary,
    alternates: { canonical: `/${lang}/notes/${slug}/` },
    openGraph: { type: "article", title: note.title, description: note.summary },
  };
}

export default async function NotePage({ params }: PageProps<"/[lang]/notes/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const note = getNote(lang, slug);
  if (!note) notFound();
  const t = copy[lang].notes;

  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-2xl px-4 py-16 outline-none sm:px-6">
      <Link
        href={`/${lang}/#${ids.notes}`}
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fg"
      >
        <ArrowLeft /> {t.back}
      </Link>
      <article className="mt-10">
        <p className="flex flex-wrap gap-x-3 font-mono text-[11px] tracking-widest text-muted">
          <span className="text-accent">{note.category}</span>
          <time dateTime={note.date}>{formatDate(note.date, lang)}</time>
          <span>{t.minRead(note.minutes)}</span>
        </p>
        <h1 className="mt-3 text-[clamp(28px,5vw,44px)] leading-tight font-semibold tracking-tight">{note.title}</h1>
        {/* Markdown comes from files in this repository, rendered at build time. */}
        <div className="prose-note mt-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(note.body) }} />
      </article>
    </main>
  );
}
