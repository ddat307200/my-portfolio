import { notFound } from "next/navigation";
import { HeroChat } from "@/components/HeroChat";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Notes } from "@/components/sections/Notes";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { copy, ids } from "@/content/copy";
import { githubUrl, profile, site, siteUrl } from "@/content/site";
import { isLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = copy[lang];
  // Structured data: only values that are filled in content/site.ts.
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: `${siteUrl}/${lang}/`,
    email: `mailto:${site.email}`,
    jobTitle: profile.role[lang],
    description: profile.tagline[lang],
    image: `${siteUrl}/avatar-800.webp`,
    sameAs: [githubUrl, site.facebook],
    knowsLanguage: ["vi", "en"],
  };
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <script
        id="person-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
      <section aria-labelledby="hero-title" className="relative overflow-hidden" data-glow>
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-sm text-accent">{t.hero.eyebrow}</p>
            <h1 id="hero-title" className="h1 mt-4 text-balance">
              {profile.tagline[lang]}
            </h1>
          </div>
          <div className="mt-10 sm:mt-12">
            <HeroChat t={t.hero} contactHref={`#${ids.contact}`} />
          </div>
        </div>
      </section>
      <Services locale={lang} />
      <Projects locale={lang} />
      <About locale={lang} />
      <Notes locale={lang} />
      <Contact locale={lang} />
    </main>
  );
}
