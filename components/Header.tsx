import Link from "next/link";
import { consoleCopy } from "@/content/console";
import { copy } from "@/content/copy";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Menu, Search } from "./Icons";
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
          {/* Command palette button (needs JS: hidden by CSS without it, so no layout shift).
              The pre-paint script sets <html data-kbd="mac|ctrl|touch"> before first paint;
              CSS shows the matching variant. No aria-label: the accessible name is the visible
              text followed by an sr-only description, so it always contains what is shown. */}
          <button
            type="button"
            data-palette-open
            aria-keyshortcuts="Control+K Meta+K"
            className="js-only h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-line px-2 font-mono text-[12px] text-muted transition-colors duration-150 hover:border-muted hover:bg-surface-2 hover:text-fg"
          >
            <span data-kbd-v="ctrl">Ctrl K</span>
            <span data-kbd-v="mac">⌘K</span>
            <span data-kbd-v="touch" aria-hidden="true">
              <Search />
            </span>
            <span className="sr-only">{consoleCopy[locale].palette.open}</span>
          </button>
          <LangSwitch locale={locale} label={t.langSwitch.label} short={t.langSwitch.short} sharedPaths={sharedPaths} />
          <Link
            href={`/${locale}/#contact`}
            className="inline-flex h-9 items-center rounded-lg bg-accent px-3.5 text-sm font-medium text-bg transition-colors duration-150 hover:bg-accent-hover"
          >
            {t.nav.contact}
          </Link>
          {/* Mobile section menu. Native <details>: works without JS (plain anchor links).
              core.js adds aria-expanded, Esc to close, close on select + focus back to the button. */}
          <details data-mnav className="md:hidden">
            <summary
              aria-controls="mnav-list"
              className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg border border-line text-muted transition-colors duration-150 hover:border-muted hover:text-fg [&::-webkit-details-marker]:hidden"
            >
              <Menu />
              <span className="sr-only">{t.nav.menu}</span>
            </summary>
            <ul
              id="mnav-list"
              className="absolute inset-x-0 top-full border-b border-line bg-bg px-4 py-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)]"
            >
              {t.nav.menuItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    data-mnav-link
                    className="flex min-h-11 items-center gap-3 rounded-lg px-2 font-mono text-[15px] text-fg hover:bg-surface-2"
                  >
                    <span className="text-[13px] text-accent" aria-hidden="true">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </nav>
      </div>
    </header>
  );
}
