import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/Icons";
import { copy, ids } from "@/content/copy";
import { publishedProjects } from "@/content/projects";
import { isLocale, locales } from "@/lib/i18n";
import { orSentinel } from "@/lib/static-params";

export const dynamicParams = false;

/** Only published projects get a page; "coming soon" cards have no link and no page. */
export function generateStaticParams() {
  return orSentinel(
    locales.flatMap((lang) => publishedProjects.map((p) => ({ lang, slug: p.slug }))),
    locales,
  );
}

function find(lang: string, slug: string) {
  if (!isLocale(lang)) return undefined;
  return publishedProjects.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = find(lang, slug);
  if (!p || !isLocale(lang)) return {};
  const path = `/projects/${slug}/`;
  return {
    title: `${p.title[lang]} · Dang Tien Dat`,
    description: p.summary[lang],
    alternates: { canonical: `/${lang}${path}`, languages: { vi: `/vi${path}`, en: `/en${path}` } },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  const p = find(lang, slug);
  if (!p || !isLocale(lang)) notFound();
  const t = copy[lang].project;
  const blocks = [
    { title: t.problem, body: p.problem[lang] },
    { title: t.approach, body: p.approach[lang] },
    { title: t.result, body: p.result[lang] },
  ];
  const links = [
    p.links.source && { href: p.links.source, label: t.source },
    p.links.demo && { href: p.links.demo, label: t.demo },
  ].filter((l): l is { href: string; label: string } => Boolean(l));

  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-16 outline-none sm:px-6">
      <Link
        href={`/${lang}/#${ids.projects}`}
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-fg"
      >
        <ArrowLeft /> {t.back}
      </Link>
      <p className="mt-10 font-mono text-[12px] tracking-widest text-accent">{p.label}</p>
      <h1 className="h1 mt-3">{p.title[lang]}</h1>
      <p className="mt-4 text-lg text-muted">{p.summary[lang]}</p>

      {blocks.map((b) => (
        <section key={b.title} className="mt-12">
          <h2 className="text-xl font-semibold">{b.title}</h2>
          <p className="mt-3 whitespace-pre-line">{b.body}</p>
        </section>
      ))}

      <section className="mt-12">
        <h2 className="text-xl font-semibold">{t.tech}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {p.tech.map((x) => (
            <li key={x} className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[13px]">
              {x}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">{t.links}</h2>
        {links.length ? (
          <ul className="mt-4 flex flex-wrap gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center rounded-lg border border-line bg-surface-2 px-4 text-sm transition-colors duration-150 hover:border-accent hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted">{t.noLinks}</p>
        )}
      </section>
    </main>
  );
}
