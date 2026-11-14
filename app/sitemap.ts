import type { MetadataRoute } from "next";
import { publishedProjects } from "@/content/projects";
import { siteUrl } from "@/content/site";
import { locales } from "@/lib/i18n";
import { getNotes } from "@/lib/notes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = locales.map((lang) => ({
    url: `${siteUrl}/${lang}/`,
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: { languages: { vi: `${siteUrl}/vi/`, en: `${siteUrl}/en/` } },
  }));
  const projects = locales.flatMap((lang) =>
    publishedProjects.map((p) => ({
      url: `${siteUrl}/${lang}/projects/${p.slug}/`,
      alternates: {
        languages: { vi: `${siteUrl}/vi/projects/${p.slug}/`, en: `${siteUrl}/en/projects/${p.slug}/` },
      },
    })),
  );
  const notes = locales.flatMap((lang) =>
    getNotes(lang).map((n) => ({ url: `${siteUrl}/${lang}/notes/${n.slug}/`, lastModified: n.date })),
  );
  return [...home, ...projects, ...notes];
}
