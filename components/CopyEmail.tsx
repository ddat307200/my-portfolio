import { Check, Copy } from "./Icons";

/**
 * "Copy email" button. Hidden in the HTML (it needs JS); lib/client/enhance.ts shows it,
 * copies with the Clipboard API and falls back to opening mailto: if that fails.
 * The address itself is always shown as a mailto: link next to it.
 */
export function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  return (
    <span>
      <button
        type="button"
        hidden
        suppressHydrationWarning
        data-copy-email={email}
        data-done={done}
        className="group inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-surface-2 px-3.5 text-sm text-fg transition-colors duration-150 hover:border-muted"
      >
        <Copy className="group-data-copied:hidden" />
        <Check className="hidden text-accent group-data-copied:block" />
        <span data-copy-label>{label}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only" />
    </span>
  );
}
