import { notFound } from "next/navigation";
import { About } from "@/components/sections/About";
import { Architecture } from "@/components/sections/Architecture";
import { Hero } from "@/components/sections/Hero";
import { Contact } from "@/components/sections/Contact";
import { Notes } from "@/components/sections/Notes";
import { Projects } from "@/components/sections/Projects";
import { Run } from "@/components/sections/Run";
import { Services } from "@/components/sections/Services";
import { Telemetry } from "@/components/sections/Telemetry";
import { githubUrl, profile, site, siteUrl } from "@/content/site";
import { isLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
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
      <Hero locale={lang} />
      <Telemetry locale={lang} />
      <Services locale={lang} />
      <Run locale={lang} />
      <Architecture locale={lang} />
      <Projects locale={lang} />
      <About locale={lang} />
      <Notes locale={lang} />
      <Contact locale={lang} />
    </main>
  );
}
