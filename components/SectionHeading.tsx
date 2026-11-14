export function SectionHeading({ id, index, eyebrow, title }: { id: string; index: string; eyebrow: string; title: string }) {
  return (
    <div data-reveal>
      <p className="font-mono text-xs tracking-widest text-muted uppercase">
        <span className="text-accent">{index}</span>
        <span aria-hidden="true"> / </span>
        <span className="sr-only"> </span>
        {eyebrow}
      </p>
      <h2 id={id} className="mt-3 text-[clamp(26px,4vw,36px)] leading-tight font-semibold tracking-tight">
        {title}
      </h2>
    </div>
  );
}
