import type { L, Locale } from "@/lib/i18n";

/** Section anchors, shared by both languages. */
export const ids = {
  services: "services",
  process: "process",
  projects: "projects",
  about: "about",
  notes: "notes",
  contact: "contact",
} as const;

type Copy = {
  meta: { title: string; description: string };
  skip: string;
  nav: { label: string; items: { id: string; label: string }[]; contact: string; home: string };
  langSwitch: { label: string; short: string };
  hero: {
    eyebrow: string;
    windowTitle: string;
    simulated: string;
    simulatedHint: string;
    userLabel: string;
    assistantLabel: string;
    question: string;
    thinking: string;
    answer: string;
    skip: string;
    chips: { id: string; label: string }[];
    chipsLabel: string;
    inputPlaceholder: string;
  };
  services: {
    eyebrow: string;
    title: string;
    items: { tag: string; title: string; body: string }[];
    processTitle: string;
    steps: { title: string; body: string }[];
  };
  projects: {
    eyebrow: string;
    title: string;
    intro: string;
    soon: string;
    readMore: string;
  };
  about: {
    eyebrow: string;
    title: string;
    avatarAlt: string;
    stackTitle: string;
    linksLabel: string;
  };
  notes: {
    eyebrow: string;
    title: string;
    empty: string;
    minRead: (n: number) => string;
    back: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    email: string;
    copy: string;
    copied: string;
    zalo: string;
    facebook: string;
    note: string;
  };
  footer: { source: string };
  project: {
    back: string;
    problem: string;
    approach: string;
    result: string;
    tech: string;
    links: string;
    source: string;
    demo: string;
    noLinks: string;
  };
};

export const copy: Record<Locale, Copy> = {
  vi: {
    meta: {
      title: "Dang Tien Dat · Công cụ web và tự động hóa bằng AI",
      description:
        "Lập trình viên full-stack xây công cụ web và tự động hóa bằng AI cho những việc lặp đi lặp lại trong đội nhóm nhỏ: nhập liệu, soạn thảo, đối chiếu, báo cáo.",
    },
    skip: "Bỏ qua tới nội dung",
    nav: {
      label: "Điều hướng chính",
      items: [
        { id: ids.services, label: "Dịch vụ" },
        { id: ids.projects, label: "Dự án" },
        { id: ids.about, label: "Về mình" },
        { id: ids.notes, label: "Ghi chú" },
      ],
      contact: "Liên hệ",
      home: "Trang chủ",
    },
    langSwitch: { label: "Switch to English", short: "EN" },
    hero: {
      eyebrow: "Lập trình viên full-stack",
      windowTitle: "Trò chuyện",
      simulated: "mô phỏng",
      simulatedHint: "Đây là hoạt ảnh có kịch bản, không phải AI thật.",
      userLabel: "Bạn",
      assistantLabel: "Dat",
      question: "Bạn làm được gì cho mình?",
      thinking: "Đang suy nghĩ…",
      answer:
        "Mình là Dang Tien Dat, lập trình viên full-stack. Mình xây công cụ web và tự động hóa bằng AI cho những việc lặp đi lặp lại trong đội nhóm nhỏ: nhập liệu, soạn thảo, đối chiếu, báo cáo. Có việc nào bạn đang làm tay mỗi tuần không?",
      skip: "Bỏ qua hoạt ảnh",
      chips: [
        { id: ids.projects, label: "Xem dự án" },
        { id: ids.process, label: "Cách làm việc" },
        { id: ids.contact, label: "Liên hệ" },
      ],
      chipsLabel: "Gợi ý",
      inputPlaceholder: "Kể mình nghe việc bạn đang làm tay…",
    },
    services: {
      eyebrow: "Dịch vụ",
      title: "Mình làm được gì",
      items: [
        {
          tag: "WEB",
          title: "Website & landing page",
          body: "Giao diện nhanh, hiển thị tốt trên điện thoại, nối với form hoặc cơ sở dữ liệu khi cần.",
        },
        {
          tag: "AUTOMATION",
          title: "Tự động hóa bằng AI & code",
          body: "Script, tích hợp API, extension trình duyệt, xử lý biểu mẫu và tài liệu để bớt thao tác thủ công.",
        },
        {
          tag: "BACKEND",
          title: "Hệ thống phía sau",
          body: "API, PostgreSQL, Docker, kiến trúc microservice cho sản phẩm cần chạy ổn định và mở rộng.",
        },
      ],
      processTitle: "Cách làm việc",
      steps: [
        { title: "Bạn kể bài toán", body: "Việc gì đang tốn thời gian, hiện đang làm tay thế nào." },
        { title: "Mình làm bản mẫu nhỏ", body: "Chạy trên đúng dữ liệu hoặc quy trình của bạn." },
        { title: "Bạn dùng thử và kiểm tra", body: "Xem có đúng thứ bạn cần không, chỗ nào chưa ổn." },
        { title: "Ưng mới tiếp tục", body: "Phạm vi và giá thống nhất bằng văn bản trước khi làm phần lớn." },
      ],
    },
    projects: {
      eyebrow: "Dự án",
      title: "Những gì mình đang xây",
      intro:
        "Mình đang xây các dự án công khai đầu tiên. Mỗi dự án sẽ có trang riêng: bài toán, cách làm, kết quả và mã nguồn khi sẵn sàng.",
      soon: "Sắp ra mắt",
      readMore: "Xem chi tiết",
    },
    about: {
      eyebrow: "Về mình",
      title: "Một chút về mình",
      avatarAlt: "Ảnh chân dung Dang Tien Dat",
      stackTitle: "Công nghệ mình dùng",
      linksLabel: "Liên kết",
    },
    notes: {
      eyebrow: "Ghi chú",
      title: "Ghi chú kỹ thuật",
      empty: "Chưa có bài nào được đăng. Bài đầu tiên đang được viết.",
      minRead: (n) => `${n} phút đọc`,
      back: "Về trang chủ",
    },
    contact: {
      eyebrow: "Liên hệ",
      title: "Kể mình nghe việc bạn đang làm tay",
      body: "Gửi mình vài dòng: việc gì, làm bao lâu một lần, đang dùng công cụ gì. Mình sẽ trả lời thẳng là tự động hóa được hay không.",
      email: "Email",
      copy: "Sao chép email",
      copied: "Đã sao chép",
      zalo: "Zalo",
      facebook: "Facebook",
      note: "Không có form, không lưu dữ liệu. Bạn liên hệ trực tiếp với mình.",
    },
    footer: { source: "GitHub" },
    project: {
      back: "Tất cả dự án",
      problem: "Bài toán",
      approach: "Cách làm",
      result: "Kết quả",
      tech: "Công nghệ",
      links: "Liên kết",
      source: "Mã nguồn",
      demo: "Bản demo",
      noLinks: "Chưa có liên kết công khai.",
    },
  },
  en: {
    meta: {
      title: "Dang Tien Dat · Web tools and AI automation",
      description:
        "Full-stack developer building web tools and AI automation for repetitive work in small teams: data entry, drafting, reconciling, reporting.",
    },
    skip: "Skip to content",
    nav: {
      label: "Main navigation",
      items: [
        { id: ids.services, label: "Services" },
        { id: ids.projects, label: "Work" },
        { id: ids.about, label: "About" },
        { id: ids.notes, label: "Notes" },
      ],
      contact: "Contact",
      home: "Home",
    },
    langSwitch: { label: "Chuyển sang tiếng Việt", short: "VI" },
    hero: {
      eyebrow: "Full-stack developer",
      windowTitle: "Chat",
      simulated: "simulated",
      simulatedHint: "This is a scripted animation, not a real AI.",
      userLabel: "You",
      assistantLabel: "Dat",
      question: "What can you do for me?",
      thinking: "Thinking…",
      answer:
        "I'm Dang Tien Dat, a full-stack developer. I build web tools and AI automation for repetitive work in small teams: data entry, drafting, reconciling, reporting. Is there something you do by hand every week?",
      skip: "Skip animation",
      chips: [
        { id: ids.projects, label: "See projects" },
        { id: ids.process, label: "How I work" },
        { id: ids.contact, label: "Contact" },
      ],
      chipsLabel: "Suggestions",
      inputPlaceholder: "Tell me what you do by hand…",
    },
    services: {
      eyebrow: "Services",
      title: "What I can do",
      items: [
        {
          tag: "WEB",
          title: "Websites & landing pages",
          body: "Fast pages that work well on phones, connected to a form or a database when needed.",
        },
        {
          tag: "AUTOMATION",
          title: "AI & code automation",
          body: "Scripts, API integrations, browser extensions, form and document processing to cut manual steps.",
        },
        {
          tag: "BACKEND",
          title: "Back-end systems",
          body: "APIs, PostgreSQL, Docker and microservices for products that need to run reliably and grow.",
        },
      ],
      processTitle: "How I work",
      steps: [
        { title: "You describe the problem", body: "What takes up time, and how it's done by hand today." },
        { title: "I build a small prototype", body: "It runs on your real data or workflow." },
        { title: "You try it and check it", body: "See if it's what you need and what still feels off." },
        { title: "Continue only if you're happy", body: "Scope and price are agreed in writing before the bulk of the work." },
      ],
    },
    projects: {
      eyebrow: "Work",
      title: "What I'm building",
      intro:
        "I'm building my first public projects. Each one will get its own page: the problem, the approach, the result, and the source code when it's ready.",
      soon: "Coming soon",
      readMore: "Read more",
    },
    about: {
      eyebrow: "About",
      title: "A bit about me",
      avatarAlt: "Portrait of Dang Tien Dat",
      stackTitle: "What I work with",
      linksLabel: "Links",
    },
    notes: {
      eyebrow: "Notes",
      title: "Technical notes",
      empty: "Nothing published yet. The first note is being written.",
      minRead: (n) => `${n} min read`,
      back: "Back to home",
    },
    contact: {
      eyebrow: "Contact",
      title: "Tell me what you do by hand",
      body: "Send me a few lines: what the task is, how often you do it, and which tools you use. I'll tell you plainly whether it can be automated.",
      email: "Email",
      copy: "Copy email",
      copied: "Copied",
      zalo: "Zalo",
      facebook: "Facebook",
      note: "No form, nothing stored. You reach me directly.",
    },
    footer: { source: "GitHub" },
    project: {
      back: "All projects",
      problem: "Problem",
      approach: "Approach",
      result: "Result",
      tech: "Tech",
      links: "Links",
      source: "Source code",
      demo: "Demo",
      noLinks: "No public links yet.",
    },
  },
};

export type { Copy };
export const pick = <T,>(value: L<T>, locale: Locale): T => value[locale];
