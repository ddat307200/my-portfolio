import type { Locale } from "@/lib/i18n";

/**
 * V2 strings (terminal, command palette, hero). Both languages, same structure.
 * Terminal command *output* is built in lib/terminal/commands.ts from content/site.ts,
 * content/projects.ts and these strings, so nothing is duplicated.
 */
type ConsoleCopy = {
  hero: {
    label: string;
    title: string;
    nameRole: string;
    lead: string;
    ctaRun: string;
    ctaContact: string;
  };
  term: {
    region: string;
    title: string;
    scripted: string;
    banner: string;
    inputLabel: string;
    placeholder: string;
    suggestions: string;
    skipBoot: string;
    booting: string;
    exitHint: string;
    notFound: (cmd: string) => string;
    helpIntro: string;
    help: { cmd: string; desc: string }[];
    whoami: string[];
    statusTitle: string;
    status: { key: string; value: string; ok?: boolean }[];
    statusBuild: string;
    lsHeader: string;
    soon: string;
    demo: string;
    stackHeader: string;
    contactHeader: string;
    sudo: string[];
    openUsage: string;
    opened: (s: string) => string;
    langUsage: string;
    langSwitching: string;
  };
  palette: {
    open: string;
    title: string;
    placeholder: string;
    empty: string;
    groupJump: string;
    groupActions: string;
    switchLang: string;
    copyEmail: string;
    copied: string;
    hint: string;
  };
};

export const consoleCopy: Record<Locale, ConsoleCopy> = {
  vi: {
    hero: {
      label: "~/dangtiendat",
      title: "Công cụ web và tự động hóa cho việc lặp đi lặp lại.",
      nameRole: "Dang Tien Dat · lập trình viên full-stack",
      lead: "Mình xây công cụ web và tự động hóa bằng AI cho đội nhóm nhỏ: nhập liệu, soạn thảo, đối chiếu, báo cáo. Bên phải là terminal chạy được, gõ thử help.",
      ctaRun: "Chạy thử demo",
      ctaContact: "Liên hệ",
    },
    term: {
      region: "Terminal tương tác (kịch bản cố định, không phải AI)",
      title: "dat@portfolio: ~",
      scripted: "kịch bản cố định",
      banner: "# Terminal kịch bản cố định, không phải AI. Gõ help để xem lệnh.",
      inputLabel: "Nhập lệnh terminal",
      placeholder: "gõ help…",
      suggestions: "Lệnh gợi ý",
      skipBoot: "Bỏ qua (phím bất kỳ)",
      booting: "đang khởi động…",
      exitHint: "Esc để thoát terminal",
      notFound: (cmd) => `không có lệnh: ${cmd}. Gõ help để xem danh sách.`,
      helpIntro: "Các lệnh có sẵn (kịch bản cố định, chạy trong trình duyệt, không gọi AI):",
      help: [
        { cmd: "help", desc: "danh sách lệnh" },
        { cmd: "whoami", desc: "mình là ai" },
        { cmd: "ls projects", desc: "dự án và bản chạy thử" },
        { cmd: "cat contact", desc: "thông tin liên hệ" },
        { cmd: "stack", desc: "công nghệ mình dùng" },
        { cmd: "status", desc: "trạng thái nhận việc và bản build" },
        { cmd: "open <mục>", desc: "cuộn tới mục: status, services, run, architecture, projects, about, notes, contact" },
        { cmd: "lang vi|en", desc: "đổi ngôn ngữ" },
        { cmd: "clear", desc: "xóa màn hình" },
        { cmd: "sudo hire me", desc: "thử xem" },
      ],
      whoami: [
        "Dang Tien Dat, lập trình viên full-stack.",
        "Xây công cụ web và tự động hóa bằng AI cho những việc lặp đi lặp lại trong đội nhóm nhỏ:",
        "nhập liệu, soạn thảo, đối chiếu, báo cáo.",
      ],
      statusTitle: "trạng thái",
      status: [
        { key: "nhận dự án", value: "có, bắt đầu bằng bản mẫu nhỏ", ok: true },
        { key: "dự án công khai", value: "đang xây (xem ls projects)" },
        { key: "phản hồi", value: "qua email hoặc Zalo (cat contact)" },
      ],
      statusBuild: "bản build",
      lsHeader: "dự án",
      soon: "sắp ra mắt",
      demo: "bản chạy thử",
      stackHeader: "stack",
      contactHeader: "liên hệ",
      sudo: [
        "[sudo] không cần mật khẩu. Chỉ cần một email mô tả việc bạn đang làm tay.",
      ],
      openUsage: "cách dùng: open <mục>, ví dụ: open run",
      opened: (s) => `→ đã cuộn tới ${s}/`,
      langUsage: "cách dùng: lang vi | lang en",
      langSwitching: "đang chuyển ngôn ngữ…",
    },
    palette: {
      open: "Mở bảng lệnh",
      title: "Bảng lệnh",
      placeholder: "Nhảy tới mục, đổi ngôn ngữ, sao chép email…",
      empty: "Không có kết quả",
      groupJump: "Nhảy tới",
      groupActions: "Thao tác",
      switchLang: "Switch to English",
      copyEmail: "Sao chép email",
      copied: "Đã sao chép email",
      hint: "↑↓ chọn · Enter chạy · Esc đóng",
    },
  },
  en: {
    hero: {
      label: "~/dangtiendat",
      title: "Web tools and automation for repetitive work.",
      nameRole: "Dang Tien Dat · full-stack developer",
      lead: "I build web tools and AI automation for small teams: data entry, drafting, reconciling, reporting. On the right is a working terminal. Try typing help.",
      ctaRun: "Try the demos",
      ctaContact: "Contact",
    },
    term: {
      region: "Interactive terminal (fixed script, not an AI)",
      title: "dat@portfolio: ~",
      scripted: "fixed script",
      banner: "# Fixed-script terminal, not an AI. Type help to list commands.",
      inputLabel: "Terminal command",
      placeholder: "type help…",
      suggestions: "Suggested commands",
      skipBoot: "Skip (any key)",
      booting: "booting…",
      exitHint: "Esc to leave the terminal",
      notFound: (cmd) => `command not found: ${cmd}. Type help for the list.`,
      helpIntro: "Available commands (fixed script, runs in your browser, no AI calls):",
      help: [
        { cmd: "help", desc: "list commands" },
        { cmd: "whoami", desc: "who I am" },
        { cmd: "ls projects", desc: "projects and runnable demos" },
        { cmd: "cat contact", desc: "contact details" },
        { cmd: "stack", desc: "what I work with" },
        { cmd: "status", desc: "availability and current build" },
        { cmd: "open <section>", desc: "scroll to: status, services, run, architecture, projects, about, notes, contact" },
        { cmd: "lang vi|en", desc: "switch language" },
        { cmd: "clear", desc: "clear the screen" },
        { cmd: "sudo hire me", desc: "go on, try it" },
      ],
      whoami: [
        "Dang Tien Dat, full-stack developer.",
        "I build web tools and AI automation for repetitive work in small teams:",
        "data entry, drafting, reconciling, reporting.",
      ],
      statusTitle: "status",
      status: [
        { key: "taking projects", value: "yes, starting with a small prototype", ok: true },
        { key: "public projects", value: "in progress (see ls projects)" },
        { key: "reach me", value: "email or Zalo (cat contact)" },
      ],
      statusBuild: "build",
      lsHeader: "projects",
      soon: "coming soon",
      demo: "runnable demo",
      stackHeader: "stack",
      contactHeader: "contact",
      sudo: ["[sudo] no password needed. Just an email about the task you do by hand."],
      openUsage: "usage: open <section>, e.g. open run",
      opened: (s) => `→ scrolled to ${s}/`,
      langUsage: "usage: lang vi | lang en",
      langSwitching: "switching language…",
    },
    palette: {
      open: "Open command palette",
      title: "Command palette",
      placeholder: "Jump to a section, switch language, copy email…",
      empty: "No results",
      groupJump: "Jump to",
      groupActions: "Actions",
      switchLang: "Chuyển sang tiếng Việt",
      copyEmail: "Copy email",
      copied: "Email copied",
      hint: "↑↓ select · Enter run · Esc close",
    },
  },
};
