/**
 * With `output: "export"`, Next.js refuses an empty generateStaticParams().
 * While there is nothing published yet, emit one sentinel route whose page calls
 * notFound(): no content page is produced, and real pages appear as soon as
 * content/projects.ts or content/notes/ has published entries.
 */
export const EMPTY_SLUG = "__none";

export function orSentinel<T extends { lang: string; slug: string }>(params: T[], langs: readonly string[]) {
  return params.length ? params : langs.map((lang) => ({ lang, slug: EMPTY_SLUG }));
}
