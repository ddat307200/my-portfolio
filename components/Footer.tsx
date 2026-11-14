import { copy } from "@/content/copy";
import { githubUrl, site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { GitHub } from "./Icons";

export function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition-colors duration-150 hover:text-fg"
        >
          <GitHub />
          {t.footer.source}
          <span className="font-mono text-xs">github.com/{site.github}</span>
        </a>
      </div>
    </footer>
  );
}
