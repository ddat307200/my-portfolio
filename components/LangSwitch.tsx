import type { Locale } from "@/lib/i18n";
import { otherLocale } from "@/lib/i18n";
import { basePath } from "@/lib/base";

/**
 * Link to the other language. In the HTML it points to the other language's home page;
 * lib/client/enhance.ts retargets it to the same sub-page when that page exists in both
 * languages (listed in data-shared).
 */
export function LangSwitch({
  locale,
  label,
  short,
  sharedPaths,
}: {
  locale: Locale;
  label: string;
  short: string;
  /** Sub-paths (after /vi or /en) that exist in both languages, e.g. "/projects/foo/". */
  sharedPaths: string[];
}) {
  const target = otherLocale(locale);
  return (
    <a
      href={`${basePath}/${target}/`}
      hrefLang={target}
      lang={target}
      data-lang-switch
      data-base={basePath}
      data-from={locale}
      data-to={target}
      data-shared={JSON.stringify(sharedPaths)}
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-line px-2.5 font-mono text-xs tracking-wide text-muted transition-colors duration-150 hover:border-muted hover:bg-surface-2 hover:text-fg"
    >
      {short}
      <span className="sr-only"> · {label}</span>
    </a>
  );
}
