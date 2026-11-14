import { consoleCopy } from "@/content/console";
import type { Locale } from "@/lib/i18n";
import { bootCommands, run, suggested, type Line } from "@/lib/terminal/commands";

const tone = { muted: "text-muted", accent: "text-accent", ok: "text-[var(--ok)]" } as const;

export function TermLine({ line }: { line: Line }) {
  return (
    <div className="whitespace-pre-wrap break-words">
      {line.map((s, i) =>
        s.href ? (
          <a
            key={i}
            href={s.href}
            {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-fg underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent"
          >
            {s.t}
          </a>
        ) : (
          <span key={i} className={s.tone ? tone[s.tone] : undefined}>
            {s.t}
          </span>
        ),
      )}
      {line.length === 0 ? " " : null}
    </div>
  );
}

/**
 * Hero terminal. The HTML contains the full transcript of `whoami` + `status`
 * (readable without JS). lib/client/terminal.ts (lazy) adds the boot replay,
 * the prompt, history, Tab completion and the suggestion chips.
 */
export function Terminal({ locale }: { locale: Locale }) {
  const t = consoleCopy[locale].term;
  return (
    <section
      aria-label={t.region}
      data-term
      data-locale={locale}
      tabIndex={-1}
      className="frame relative flex h-[400px] flex-col overflow-hidden font-mono text-[13.5px] leading-[1.65] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] outline-none sm:h-[440px]"
    >
      <div className="frame-bar">
        <span className="flex items-center gap-2">
          <span className="flex gap-1.5 max-[420px]:hidden" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
          </span>
          <span className="ml-1.5 whitespace-nowrap max-[420px]:ml-0">{t.title}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="dot-ok" aria-hidden="true" />
          <span className="text-[12px] whitespace-nowrap">{t.scripted}</span>
        </span>
      </div>

      <div data-term-log data-booting={t.booting} role="log" aria-live="off" className="relative min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div data-term-static>
          <TermLine line={[{ t: t.banner, tone: "muted" }]} />
          {bootCommands.map((c) => (
            <div key={c} className="mt-2">
              <TermLine line={[{ t: "$ ", tone: "accent" }, { t: c }]} />
              {run(locale, c).lines.map((l, i) => (
                <TermLine key={i} line={l} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="js-only border-t border-line">
        <ul aria-label={t.suggestions} className="flex gap-1.5 overflow-x-auto px-3 pt-2.5 pb-1">
          {suggested.map((c) => (
            <li key={c} className="shrink-0">
              <button
                type="button"
                data-term-run={c}
                className="rounded-md border border-line bg-bg px-2 py-0.5 text-[13px] text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
        <form data-term-form className="flex items-center gap-2 px-4 pt-1 pb-3" autoComplete="off">
          <label htmlFor={`term-input-${locale}`} className="text-accent">
            <span aria-hidden="true">$</span>
            <span className="sr-only">{t.inputLabel}</span>
          </label>
          <input
            id={`term-input-${locale}`}
            data-term-input
            type="text"
            inputMode="text"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={t.placeholder}
            aria-describedby={`term-hint-${locale}`}
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-fg placeholder:text-muted focus:outline-none"
          />
          <span id={`term-hint-${locale}`} className="hidden text-[12px] text-muted sm:inline">
            {t.exitHint}
          </span>
        </form>
      </div>

      <button
        type="button"
        hidden
        data-term-skip
        className="absolute top-11 right-3 rounded-md border border-line bg-bg/90 px-2 py-0.5 text-[12px] text-muted hover:border-muted hover:text-fg"
      >
        {t.skipBoot}
      </button>
    </section>
  );
}
