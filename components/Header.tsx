import Link from "next/link";
import { consoleCopy } from "@/content/console";
import { copy } from "@/content/copy";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";

export function Header({ locale, sharedPaths }: { locale: Locale; sharedPaths: string[] }) {
  const t = copy[locale];
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={`/${locale}/`}
          className="font-mono text-sm tracking-tight text-fg transition-colors duration-150 hover:text-accent"
        >
          <span className="text-accent" aria-hidden="true">
            ~/
          </span>
          {site.name.toLowerCase().replaceAll(" ", "")}
          <span className="sr-only">, {t.nav.home}</span>
        </Link>
        <nav aria-label={t.nav.label} className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {t.nav.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/${locale}/#${item.id}`}
                  className="rounded-lg px-2.5 py-2 font-mono text-[13px] text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Shown by core.js (needs JS); opens the Ctrl/Cmd+K palette. */}
          <button
            type="button"
            hidden
            data-palette-open
            aria-keyshortcuts="Control+K Meta+K"
            aria-label={consoleCopy[locale].palette.open}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-line px-2.5 font-mono text-xs text-muted transition-colors duration-150 hover:border-muted hover:bg-surface-2 hover:text-fg"
          >
            <span aria-hidden="true">⌘K</span>
          </button>
          <LangSwitch locale={locale} label={t.langSwitch.label} short={t.langSwitch.short} sharedPaths={sharedPaths} />
          <Link
            href={`/${locale}/#contact`}
            className="inline-flex h-9 items-center rounded-lg bg-accent px-3.5 text-sm font-medium text-bg transition-colors duration-150 hover:bg-accent-hover"
          >
            {t.nav.contact}
          </Link>
        </nav>
      </div>
    </header>
  );
}
