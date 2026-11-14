import { CopyEmail } from "@/components/CopyEmail";
import { Chat, Facebook, Mail } from "@/components/Icons";
import { SectionHeading } from "@/components/SectionHeading";
import { copy, ids } from "@/content/copy";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";

const row =
  "spotlight flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition-colors duration-200 hover:bg-surface-2 sm:flex-row sm:items-center sm:justify-between";
const link = "text-fg underline-offset-4 transition-colors duration-150 hover:text-accent hover:underline";

export function Contact({ locale }: { locale: Locale }) {
  const t = copy[locale].contact;
  return (
    <section id={ids.contact} aria-labelledby="contact-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading id="contact-title" index="08" slug="contact" title={t.title} />
      <p className="mt-4 max-w-2xl text-muted" data-reveal>
        {t.body}
      </p>
      <ul className="mt-10 grid max-w-3xl gap-3" data-reveal>
        <li className={row}>
          <div className="flex min-w-0 items-center gap-3">
            <Mail className="shrink-0 text-accent" width={20} height={20} />
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-widest text-muted uppercase">{t.email}</p>
              <a href={`mailto:${site.email}`} className={`block truncate ${link}`}>
                {site.email}
              </a>
            </div>
          </div>
          <CopyEmail email={site.email} label={t.copy} done={t.copied} />
        </li>
        <li className={row}>
          <div className="flex items-center gap-3">
            <Chat className="shrink-0 text-accent" width={20} height={20} />
            <div>
              <p className="font-mono text-[11px] tracking-widest text-muted uppercase">{t.zalo}</p>
              <a href={site.zalo} target="_blank" rel="noopener noreferrer" className={link}>
                {site.zaloPhone}
              </a>
            </div>
          </div>
        </li>
        <li className={row}>
          <div className="flex items-center gap-3">
            <Facebook className="shrink-0 text-accent" width={20} height={20} />
            <div>
              <p className="font-mono text-[11px] tracking-widest text-muted uppercase">{t.facebook}</p>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer" className={link}>
                {site.name}
              </a>
            </div>
          </div>
        </li>
      </ul>
      <p className="mt-6 text-sm text-muted" data-reveal>
        {t.note}
      </p>
    </section>
  );
}
