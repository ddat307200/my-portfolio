import { Fragment } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { demoCopy } from "@/content/demos";
import { ids } from "@/content/ids";
import type { Locale } from "@/lib/i18n";

/**
 * Inline-SVG connector. The static line is one SVG; the moving dashes are a second SVG
 * that slides by one dash period with a CSS transform (compositor-only, no repaint per
 * frame). Stopped with reduced motion.
 */
function Connector() {
  return (
    <>
      <span aria-hidden="true" className="flow mx-auto h-8 w-4 lg:hidden">
        <svg className="absolute inset-0 h-full w-full">
          <line x1="8" y1="0" x2="8" y2="100%" className="flow-base" />
        </svg>
        <svg className="flow-move-y">
          <line x1="8" y1="0" x2="8" y2="100%" className="flow-dash" />
        </svg>
      </span>
      <span aria-hidden="true" className="flow hidden h-4 w-full self-center lg:block">
        <svg className="absolute inset-0 h-full w-full">
          <line x1="0" y1="8" x2="100%" y2="8" className="flow-base" />
        </svg>
        <svg className="flow-move-x">
          <line x1="0" y1="8" x2="100%" y2="8" className="flow-dash" />
        </svg>
      </span>
    </>
  );
}

/**
 * [04] architecture/: an illustration (not a client system). Nodes are buttons;
 * lib/client/diagram.ts shows one detail at a time. Without JS every detail is listed.
 */
export function Architecture({ locale }: { locale: Locale }) {
  const t = demoCopy[locale].arch;
  return (
    <section id={ids.architecture} aria-labelledby="arch-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading id="arch-title" index="04" slug="architecture" title={t.title} />
      <p className="mt-4 max-w-2xl text-muted" data-reveal>
        {t.lead}
      </p>
      <figure className="frame mt-8 p-4 sm:p-6" data-reveal data-diagram>
        <ol className="grid grid-cols-1 lg:grid-cols-[1fr_32px_1fr_32px_1fr_32px_1fr_32px_1fr_32px_1fr]">
          {t.nodes.map((n, i) => (
            <Fragment key={n.id}>
              <li className="contents">
                <button
                  type="button"
                  data-node={n.id}
                  aria-controls="arch-detail"
                  aria-pressed={i === 0}
                  className="arch-node rounded-lg border border-line bg-bg px-3 py-3 text-left transition-colors duration-150 hover:border-muted aria-pressed:border-accent aria-pressed:bg-surface-2"
                >
                  <span className="block font-mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block font-semibold">{n.title}</span>
                  <span className="block font-mono text-[12.5px] text-muted">{n.sub}</span>
                </button>
              </li>
              {i < t.nodes.length - 1 ? (
                <li aria-hidden="true" className="flex">
                  <Connector />
                </li>
              ) : null}
            </Fragment>
          ))}
        </ol>
        <div id="arch-detail" aria-label={t.detailLabel} aria-live="polite" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {t.nodes.map((n, i) => (
            <dl
              key={n.id}
              data-node-detail={n.id}
              className={`rounded-lg border border-line bg-bg p-4 text-[14.5px] ${i === 0 ? "is-active" : ""}`}
            >
              <dt className="font-mono text-[12px] text-accent">
                {String(i + 1).padStart(2, "0")} · {n.title}
              </dt>
              <dd className="mt-2">
                <span className="font-mono text-[12.5px] text-muted">{t.tools}: </span>
                {n.tools}
              </dd>
              <dd className="mt-1.5">
                <span className="font-mono text-[12.5px] text-muted">{t.risk}: </span>
                {n.risk}
              </dd>
              <dd className="mt-1.5">
                <span className="font-mono text-[12.5px] text-muted">{t.check}: </span>
                {n.check}
              </dd>
            </dl>
          ))}
        </div>
        <figcaption className="mt-5 font-mono text-[12.5px] text-muted">{t.caption}</figcaption>
      </figure>
    </section>
  );
}
