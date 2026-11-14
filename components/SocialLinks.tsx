import { githubUrl, site } from "@/content/site";
import { Chat, Facebook, GitHub, Mail } from "./Icons";

const cls = "inline-flex items-center gap-1.5 rounded-md py-1 text-sm text-muted transition-colors duration-150 hover:text-fg";

/** Compact row of text links with icons (GitHub, Facebook, Zalo, email). */
export function SocialLinks({ label }: { label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-x-5 gap-y-2">
      <li>
        <a className={cls} href={githubUrl} target="_blank" rel="noopener noreferrer">
          <GitHub /> GitHub
        </a>
      </li>
      <li>
        <a className={cls} href={site.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook /> Facebook
        </a>
      </li>
      <li>
        <a className={cls} href={site.zalo} target="_blank" rel="noopener noreferrer">
          <Chat /> Zalo
        </a>
      </li>
      <li>
        <a className={cls} href={`mailto:${site.email}`}>
          <Mail /> Email
        </a>
      </li>
    </ul>
  );
}
