import { publishedProjects } from "@/content/projects";
import { getNotes } from "./notes";

/** Sub-paths that exist in both languages (used by the language switch). */
export function sharedPaths(): string[] {
  const paths = publishedProjects.map((p) => `/projects/${p.slug}/`);
  const vi = new Set(getNotes("vi").map((n) => n.slug));
  for (const n of getNotes("en")) if (vi.has(n.slug)) paths.push(`/notes/${n.slug}/`);
  return paths;
}
