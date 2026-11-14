import type { L } from "@/lib/i18n";

/**
 * Projects shown in the "Projects" grid.
 * - status "soon": placeholder card, dashed border, no link, no detail page.
 * - status "demo": runs on this page ([03] run/); card links to that anchor.
 * - status "published": card links to /[lang]/projects/[slug] with the full case study.
 * Never describe results that did not happen. Only add `links.source` once the repo is public.
 */
type Soon = {
  status: "soon";
  slug: string;
  label: string;
  title: L;
};

/** A runnable demo on this page (no case study, no results claimed, no source link yet). */
type Demo = {
  status: "demo";
  slug: string;
  label: string;
  title: L;
  summary: L;
  /** Anchor on the home page where it runs. */
  anchor: string;
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

export type Project = Soon | Demo | Published;

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
    status: "demo",
    slug: "small-web-tool",
    label: "TOOL",
    title: { vi: "Công cụ web nhỏ", en: "Small web tool" },
    summary: {
      vi: "Hai công cụ chạy ngay trong trình duyệt: trích xuất đơn hàng từ tin nhắn và đối chiếu hai file CSV.",
      en: "Two tools that run right in the browser: extract orders from messages and reconcile two CSV files.",
    },
    anchor: "run",
  },
];

export const publishedProjects = projects.filter((p): p is Published => p.status === "published");
