/**
 * Section heading in the V2 console style:
 *   ─┼──────┼──────  (ruler)
 *   [02] projects/          ← h2, mono; the visible text is decoded once by core.ts
 *   Những gì mình đang xây  ← localized title (screen readers get it through the h2)
 */
export function SectionHeading({
  id,
  index,
  slug,
  title,
}: {
  id: string;
  index: string;
  slug: string;
  title: string;
}) {
  const label = `[${index}] ${slug}/`;
  return (
    <div data-reveal>
      <div className="ruler" aria-hidden="true" />
      <h2 id={id} className="mt-4 font-mono text-sm tracking-wide text-muted">
        <span aria-hidden="true">
          <span className="text-accent" data-decode>
            [{index}]
          </span>{" "}
          <span data-decode>{slug}/</span>
        </span>
        <span className="sr-only">
          {label} {title}
        </span>
      </h2>
      <p aria-hidden="true" className="mt-2 text-[clamp(24px,3.6vw,34px)] leading-tight font-semibold tracking-tight text-fg">
        {title}
      </p>
    </div>
  );
}
