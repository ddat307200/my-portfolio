/**
 * Fixed-script terminal commands (not an AI). Pure functions: used on the server to
 * render the static transcript in the HTML, and in the browser by lib/client/terminal.ts.
 */
import { consoleCopy } from "@/content/console";
import { ids } from "@/content/ids";
import { projects } from "@/content/projects";
import { githubUrl, profile, site } from "@/content/site";
import type { Locale } from "@/lib/i18n";

export type Seg = { t: string; tone?: "muted" | "accent" | "ok"; href?: string };
export type Line = Seg[];
export type Action = { type: "clear" } | { type: "open"; id: string } | { type: "lang"; to: Locale };
export type Result = { lines: Line[]; action?: Action };

export const sections = [
  ids.status,
  ids.services,
  ids.run,
  ids.architecture,
  ids.projects,
  ids.about,
  ids.notes,
  ids.contact,
] as const;

/** Everything Tab can complete to. */
export const completions = [
  "help",
  "whoami",
  "ls projects",
  "cat contact",
  "stack",
  "status",
  ...sections.map((s) => `open ${s}`),
  "lang vi",
  "lang en",
  "clear",
  "sudo hire me",
];

/** Commands offered as tappable chips (useful on phones). */
export const suggested = ["help", "whoami", "ls projects", "cat contact", "status", "sudo hire me"];

const pad = (s: string, n: number) => s + " ".repeat(Math.max(1, n - s.length));
const text = (t: string, tone?: Seg["tone"]): Line => [{ t, tone }];

function contactLines(): Line[] {
  return [
    [{ t: pad("email", 10), tone: "muted" }, { t: site.email, href: `mailto:${site.email}` }],
    [{ t: pad("zalo", 10), tone: "muted" }, { t: site.zaloPhone, href: site.zalo }],
    [{ t: pad("facebook", 10), tone: "muted" }, { t: site.name, href: site.facebook }],
    [{ t: pad("github", 10), tone: "muted" }, { t: `github.com/${site.github}`, href: githubUrl }],
  ];
}

/** `build` is filled by the browser from /build-info.json; on the server it stays undefined. */
export function run(locale: Locale, input: string, build?: { commit: string; builtAt: string }): Result {
  const t = consoleCopy[locale].term;
  const cmd = input.trim().replace(/\s+/g, " ");
  const [head, ...rest] = cmd.split(" ");
  const arg = rest.join(" ").toLowerCase();

  switch (head?.toLowerCase()) {
    case "":
    case undefined:
      return { lines: [] };
    case "help":
      return {
        lines: [
          text(t.helpIntro, "muted"),
          ...t.help.map((h): Line => [{ t: pad(h.cmd, 16), tone: "accent" }, { t: h.desc }]),
        ],
      };
    case "whoami":
      return { lines: t.whoami.map((l) => text(l)) };
    case "status": {
      const lines: Line[] = t.status.map((s): Line => [
        { t: s.ok ? "● " : "  ", tone: "ok" },
        { t: pad(s.key, 18), tone: "muted" },
        { t: s.value },
      ]);
      lines.push([
        { t: "  " },
        { t: pad(t.statusBuild, 18), tone: "muted" },
        { t: build ? `${build.commit} · ${build.builtAt}` : locale === "vi" ? "xem [01] status/" : "see [01] status/" },
      ]);
      return { lines };
    }
    case "ls": {
      if (arg !== "projects") return { lines: [text(t.notFound(cmd), "muted")] };
      return {
        lines: [
          text(`${t.lsHeader}/`, "muted"),
          ...projects.map((p, i): Line => [
            { t: `${String(i + 1).padStart(2, "0")}  `, tone: "accent" },
            { t: pad(p.title[locale], 38) },
            { t: p.status === "soon" ? `[${t.soon}]` : `[${t.demo}]`, tone: "muted" },
          ]),
        ],
      };
    }
    case "cat":
      if (arg !== "contact") return { lines: [text(t.notFound(cmd), "muted")] };
      return { lines: [text(`${t.contactHeader}/`, "muted"), ...contactLines()] };
    case "stack":
      return {
        lines: [
          text(`${t.stackHeader}/`, "muted"),
          ...profile.stack.map((s): Line => [{ t: "- ", tone: "accent" }, { t: typeof s === "string" ? s : s[locale] }]),
        ],
      };
    case "open": {
      const id = sections.find((s) => s === arg);
      if (!id) return { lines: [text(t.openUsage, "muted")] };
      return { lines: [text(t.opened(id), "muted")], action: { type: "open", id } };
    }
    case "lang":
      if (arg !== "vi" && arg !== "en") return { lines: [text(t.langUsage, "muted")] };
      return { lines: [text(t.langSwitching, "muted")], action: { type: "lang", to: arg } };
    case "clear":
      return { lines: [], action: { type: "clear" } };
    case "sudo":
      if (arg !== "hire me") return { lines: [text(t.notFound(cmd), "muted")] };
      return { lines: [...t.sudo.map((l) => text(l, "accent")), ...contactLines()] };
    default:
      return { lines: [text(t.notFound(cmd), "muted")] };
  }
}

/** Static transcript shown in the HTML (and replayed by the boot sequence). */
export const bootCommands = ["whoami", "status"];
