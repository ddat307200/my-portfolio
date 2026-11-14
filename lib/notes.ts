import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Locale } from "./i18n";
import { isLocale } from "./i18n";

export type Note = {
  slug: string;
  lang: Locale;
  title: string;
  date: string;
  category: string;
  summary: string;
  draft: boolean;
  minutes: number;
  body: string;
};

const dir = join(process.cwd(), "content", "notes");

function readAll(): Note[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(readFileSync(join(dir, file), "utf8"));
      const lang = String(data.lang ?? "vi");
      if (!isLocale(lang)) throw new Error(`content/notes/${file}: lang must be "vi" or "en"`);
      const words = content.trim().split(/\s+/).length;
      return {
        slug: file.replace(/\.md$/, ""),
        lang,
        title: String(data.title ?? ""),
        date: String(data.date ?? ""),
        category: String(data.category ?? "NOTE").toUpperCase(),
        summary: String(data.summary ?? ""),
        draft: data.draft !== false,
        minutes: Math.max(1, Math.round(words / 220)),
        body: content,
      };
    });
}

/** Published notes for a language, newest first. Drafts are never returned. */
export function getNotes(locale: Locale): Note[] {
  return readAll()
    .filter((n) => !n.draft && n.lang === locale)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getNote(locale: Locale, slug: string): Note | undefined {
  return getNotes(locale).find((n) => n.slug === slug);
}

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false });
}
