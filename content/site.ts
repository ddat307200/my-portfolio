import type { L } from "@/lib/i18n";

/**
 * Single source of truth for personal details and links.
 * Email, Zalo, Facebook, GitHub and the domain must only be defined here.
 * Unknown values: write them as a double-curly-brace placeholder; the production build fails while any remain.
 */
export const site = {
  name: "Dang Tien Dat",
  domain: "dangtiendat.com",
  email: "d.dat307200@gmail.com",
  zalo: "https://zalo.me/0843599995",
  zaloPhone: "0843599995",
  facebook: "https://www.facebook.com/share/1FcWQj55up/?mibextid=wwXIfr",
  github: "ddat307200",
};

export const siteUrl = `https://${site.domain}`;
export const githubUrl = `https://github.com/${site.github}`;

export const profile = {
  role: { vi: "Lập trình viên full-stack", en: "Full-stack developer" } satisfies L,
  /** One-sentence message (brief §1). */
  tagline: {
    vi: "Mình xây công cụ web và tự động hóa bằng AI cho những công việc lặp đi lặp lại.",
    en: "I build web tools and AI automation for repetitive work.",
  } satisfies L,
  specialty: {
    vi: "Website, công cụ nội bộ và tự động hóa cho đội nhóm nhỏ",
    en: "Websites, internal tools and automation for small teams",
  } satisfies L,
  /** Draft bio (brief §11.3), pending the owner's review. */
  bio: {
    vi: "Mình là lập trình viên full-stack, quen làm từ giao diện tới API, microservice và cơ sở dữ liệu PostgreSQL. Mình dùng AI như một công cụ trong quy trình để làm nhanh các việc lặp lại, và luôn tự kiểm tra kết quả trước khi giao. Mình đang xây những dự án công khai đầu tiên, nên mình bắt đầu bằng bản mẫu nhỏ để bạn xem trước rồi mới quyết định.",
    en: "I'm a full-stack developer, comfortable from the UI to APIs, microservices and PostgreSQL. I use AI as a tool in my workflow to speed up repetitive work, and I check the results myself before handing anything over. I'm building my first public projects, so I start with a small prototype you can see before you decide.",
  } satisfies L,
  stack: [
    "TypeScript",
    "React / Next.js",
    "Node.js",
    "PostgreSQL",
    "Supabase",
    "Docker",
    "Microservice",
    "Tailwind CSS",
    { vi: "Extension trình duyệt (MV3)", en: "Browser extension (MV3)" },
    { vi: "Tích hợp LLM API", en: "LLM API integration" },
  ] as const satisfies readonly (string | L)[],
};
