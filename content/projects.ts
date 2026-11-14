import type { L } from "@/lib/i18n";

/**
 * Projects shown in the "Projects" grid.
 * - status "soon": placeholder card, dashed border, no link, no detail page.
 * - status "published": card links to /[lang]/projects/[slug] with the full case study.
 * Never describe results that did not happen. Only add `links.source` once the repo is public.
 */
type Soon = {
  status: "soon";
  slug: string;
  label: string;
  title: L;
};

type Published = {
  status: "published";
  slug: string;
  label: string;
  title: L;
  summary: L;
  problem: L;
  approach: L;
  result: L;
  tech: string[];
  links: { source?: string; demo?: string };
};

export type Project = Soon | Published;

export const projects: Project[] = [
  {
    status: "soon",
    slug: "website-landing-page",
    label: "WEB",
    title: { vi: "Website & landing page", en: "Website & landing page" },
  },
  {
    status: "soon",
    slug: "ai-automation",
    label: "AUTOMATION",
    title: { vi: "Tự động hóa việc lặp lại bằng AI", en: "AI automation for repetitive work" },
  },
  {
    status: "soon",
    slug: "small-web-tool",
    label: "TOOL",
    title: { vi: "Công cụ web nhỏ", en: "Small web tool" },
  },
];

export const publishedProjects = projects.filter((p): p is Published => p.status === "published");
