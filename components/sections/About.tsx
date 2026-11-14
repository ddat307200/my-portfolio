import { SectionHeading } from "@/components/SectionHeading";
import { SocialLinks } from "@/components/SocialLinks";
import { copy, ids } from "@/content/copy";
import { profile } from "@/content/site";
import { asset } from "@/lib/base";
import type { Locale } from "@/lib/i18n";

export function About({ locale }: { locale: Locale }) {
  const t = copy[locale].about;
  return (
    <section id={ids.about} aria-labelledby="about-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading id="about-title" index="06" slug="about" title={t.title} />
      <div className="mt-10 grid gap-8 md:grid-cols-[180px_1fr] md:gap-10" data-reveal>
        {/* Not the LCP image: lazy, fixed size so it causes no layout shift. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/avatar-400.webp")}
          srcSet={`${asset("/avatar-400.webp")} 1x, ${asset("/avatar-800.webp")} 2x`}
          width={180}
          height={180}
          loading="lazy"
          decoding="async"
          alt={t.avatarAlt}
          className="size-[180px] rounded-2xl border border-line object-cover"
        />
        <div>
          <p className="font-medium text-fg">{profile.role[locale]}</p>
          <p className="mt-1 font-mono text-sm text-muted">{profile.specialty[locale]}</p>
          <p className="mt-5 max-w-2xl">{profile.bio[locale]}</p>
          <div className="mt-6">
            <SocialLinks label={t.linksLabel} />
          </div>
        </div>
      </div>

      <div className="mt-14" data-reveal>
        <h3 className="text-xl font-semibold">{t.stackTitle}</h3>
        <ul className="mt-5 flex flex-wrap gap-2">
          {profile.stack.map((item) => {
            const label = typeof item === "string" ? item : item[locale];
            return (
              <li key={label} className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[13px] text-fg">
                {label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
