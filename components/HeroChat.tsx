import type { Copy } from "@/content/copy";
import { ArrowUp, Sparkle } from "./Icons";

/**
 * Scripted chat animation (not a real AI). Server-rendered in its finished state:
 * the full answer and the suggestion chips are in the HTML. lib/client/enhance.ts
 * plays the animation on top by switching `data-phase` (idle → thinking → stream → done);
 * CSS in globals.css does the rest. (suppressHydrationWarning: in `next dev` React
 * hydrates after enhance.js has changed these attributes; the published site has no React.) With reduced motion, no JS, or on a repeat
 * visit in the same session, the finished state is shown straight away.
 */
export function HeroChat({ t, contactHref }: { t: Copy["hero"]; contactHref: string }) {
  const text = "text-[15px] leading-relaxed sm:text-base";
  return (
    <div
      data-chat
      suppressHydrationWarning
      data-phase="done"
      className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-[15px] border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
          </span>
          <span className="ml-2 text-sm text-muted">{t.windowTitle}</span>
        </div>
        <span
          className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] tracking-wider text-muted uppercase"
          title={t.simulatedHint}
        >
          {t.simulated}
          <span className="sr-only">: {t.simulatedHint}</span>
        </span>
      </div>

      <div className="space-y-6 px-4 py-6 sm:px-6">
        {/* User message */}
        <div className="flex justify-end">
          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-surface-2 px-4 py-2.5 text-[15px]">
            <span className="sr-only">{t.userLabel}: </span>
            {t.question}
          </p>
        </div>

        {/* Assistant message */}
        <div className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-accent"
          >
            <Sparkle data-hero-spark width={14} height={14} />
          </span>
          <div className="relative min-w-0 flex-1">
            {/* The real answer: always in the HTML and the accessibility tree. */}
            <p data-hero-final className={`${text} text-fg`}>
              <span className="sr-only">{t.assistantLabel}: </span>
              {t.answer}
            </p>
            {/* Visual-only layers used while the animation runs. */}
            <p data-hero-thinking aria-hidden="true" className={`absolute top-0 left-0 ${text}`}>
              <span className="shimmer-text">{t.thinking}</span>
            </p>
            <p data-hero-stream data-text={t.answer} aria-hidden="true" className={`absolute inset-0 ${text} text-fg`}>
              <span data-hero-stream-text />
              <span className="caret" />
            </p>
          </div>
        </div>

        {/* Suggestion chips: real anchor links, present from the start */}
        <div className="pl-10">
          <ul data-hero-chips suppressHydrationWarning aria-label={t.chipsLabel} className="flex flex-wrap gap-2">
            {t.chips.map((chip) => (
              <li key={chip.id}>
                <a
                  href={`#${chip.id}`}
                  className="inline-flex items-center rounded-full border border-line bg-bg px-3.5 py-1.5 text-sm text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
                >
                  {chip.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Input row: a shortcut to the contact section, not a real chat input */}
      <div className="border-t border-line p-3">
        <a
          href={contactHref}
          className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 py-2 pr-2 pl-4 text-sm text-muted transition-colors duration-150 hover:border-muted hover:text-fg"
        >
          <span className="truncate">{t.inputPlaceholder}</span>
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-bg transition-colors duration-150 group-hover:bg-accent-hover"
          >
            <ArrowUp />
          </span>
        </a>
      </div>

      <button
        type="button"
        hidden
        data-hero-skip
        suppressHydrationWarning
        className="absolute right-3 bottom-[4.5rem] rounded-md border border-line bg-bg/90 px-2.5 py-1 font-mono text-[11px] text-muted transition-colors duration-150 hover:border-muted hover:text-fg"
      >
        {t.skip}
      </button>
    </div>
  );
}
