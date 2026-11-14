import type { Locale } from "@/lib/i18n";

/** UI strings for [03] run/ (demos) and [04] architecture/ (diagram), both languages. */
type DemoCopy = {
  run: {
    title: string;
    lead: string;
    privacy: string;
    nojs: string;
    sample: string;
    clear: string;
    errors: {
      empty: string;
      csv: (line: number, code: "unclosed-quote" | "stray-quote" | "column-count") => string;
      noKey: string;
      emptyCsv: string;
    };
    extract: {
      frame: string;
      title: string;
      desc: string;
      rules: string;
      inputLabel: string;
      action: string;
      cols: { line: string; name: string; phone: string; qty: string; unit: string; product: string };
      noName: string;
      ordersTitle: (n: number) => string;
      unreadTitle: (n: number) => string;
      reasons: { "no-phone": string; "bad-phone": string; "no-item": string };
      json: string;
    };
    reconcile: {
      frame: string;
      title: string;
      desc: string;
      labelA: string;
      labelB: string;
      file: string;
      action: string;
      download: string;
      summary: (r: { matched: number; mismatched: number; onlyA: number; onlyB: number; key: string }) => string;
      matched: string;
      mismatched: string;
      onlyA: string;
      onlyB: string;
      duplicates: string;
      field: string;
    };
  };
  arch: {
    title: string;
    lead: string;
    caption: string;
    detailLabel: string;
    tools: string;
    risk: string;
    check: string;
    nodes: { id: string; title: string; sub: string; tools: string; risk: string; check: string }[];
  };
};

export const demoCopy: Record<Locale, DemoCopy> = {
  vi: {
    run: {
      title: "Chạy thử ngay",
      lead: "Hai công cụ nhỏ có thật, chạy hoàn toàn trong trình duyệt của bạn. Có dữ liệu mẫu sẵn; bạn cũng có thể dán dữ liệu của mình.",
      privacy: "Chạy trong trình duyệt, không gửi dữ liệu đi đâu.",
      nojs: "Hai demo này cần JavaScript để chạy. Mô tả: (1) trích xuất đơn hàng từ tin nhắn lộn xộn bằng quy tắc, (2) đối chiếu hai danh sách CSV.",
      sample: "Dùng dữ liệu mẫu",
      clear: "Xóa",
      errors: {
        empty: "Chưa có dữ liệu. Dán vài dòng hoặc bấm “Dùng dữ liệu mẫu”.",
        csv: (line, code) =>
          `CSV không hợp lệ ở dòng ${line}: ${
            { "unclosed-quote": "dấu ngoặc kép chưa đóng", "stray-quote": "dấu ngoặc kép nằm giữa ô", "column-count": "số cột khác dòng tiêu đề" }[code]
          }.`,
        noKey: "Hai file không có cột chung nào để làm khóa (ví dụ: ma_hang).",
        emptyCsv: "Cần cả hai file CSV, mỗi file có dòng tiêu đề.",
      },
      extract: {
        frame: "run/extract-orders",
        title: "Trích xuất đơn hàng từ tin nhắn",
        desc: "Dán tin nhắn đặt hàng (mỗi dòng một tin) → bảng tên, số điện thoại, sản phẩm, số lượng.",
        rules: "Đây là quy tắc (regex), không phải AI. Dòng nào không chắc thì đưa vào “chỗ chưa đọc được”, không đoán.",
        inputLabel: "Tin nhắn đặt hàng, mỗi dòng một tin",
        action: "Trích xuất",
        cols: { line: "Dòng", name: "Tên", phone: "SĐT", qty: "SL", unit: "Đơn vị", product: "Sản phẩm" },
        noName: "(không rõ)",
        ordersTitle: (n) => `Đọc được ${n} đơn`,
        unreadTitle: (n) => `Chỗ chưa đọc được (${n})`,
        reasons: {
          "no-phone": "không có số điện thoại",
          "bad-phone": "số điện thoại không hợp lệ",
          "no-item": "không thấy số lượng + sản phẩm",
        },
        json: "Xem JSON",
      },
      reconcile: {
        frame: "run/reconcile-csv",
        title: "Đối chiếu hai danh sách (CSV)",
        desc: "Dán hoặc chọn hai file CSV → dòng khớp, dòng chỉ có ở một bên, dòng lệch giá trị. Xuất kết quả ra CSV.",
        labelA: "Danh sách A",
        labelB: "Danh sách B",
        file: "Chọn file",
        action: "Đối chiếu",
        download: "Tải kết quả CSV",
        summary: (r) =>
          `Khóa: ${r.key} · khớp ${r.matched} · lệch ${r.mismatched} · chỉ có ở A ${r.onlyA} · chỉ có ở B ${r.onlyB}`,
        matched: "Khớp",
        mismatched: "Lệch giá trị",
        onlyA: "Chỉ có ở A",
        onlyB: "Chỉ có ở B",
        duplicates: "Khóa bị trùng",
        field: "cột",
      },
    },
    arch: {
      title: "Cách mình thiết kế một luồng tự động",
      lead: "Rê chuột hoặc chọn từng khối để xem công cụ có thể dùng, rủi ro và cách kiểm tra.",
      caption: "Ví dụ minh họa cách mình thiết kế, không phải hệ thống của khách nào.",
      detailLabel: "Chi tiết khối đang chọn",
      tools: "Công cụ",
      risk: "Rủi ro",
      check: "Kiểm tra",
      nodes: [
        {
          id: "source",
          title: "Nguồn",
          sub: "form · email · tệp",
          tools: "Form web, hộp thư nhận, thư mục tải lên (CSV, PDF, ảnh).",
          risk: "Dữ liệu vào sai định dạng, trùng lặp, thiếu trường.",
          check: "Kiểm tra định dạng ngay khi nhận; lưu bản gốc để đối chiếu lại.",
        },
        {
          id: "queue",
          title: "Hàng đợi",
          sub: "job queue",
          tools: "Bảng việc trong PostgreSQL hoặc hàng đợi (ví dụ Redis/BullMQ).",
          risk: "Việc bị chạy hai lần hoặc kẹt lại khi lỗi.",
          check: "Mỗi việc có khóa duy nhất; thử lại có giới hạn; cảnh báo khi việc kẹt quá lâu.",
        },
        {
          id: "process",
          title: "Xử lý",
          sub: "quy tắc + gọi API mô hình",
          tools: "Quy tắc/regex cho phần chắc chắn; gọi API mô hình ngôn ngữ cho phần cần đọc hiểu.",
          risk: "Mô hình trả lời sai mà trông như đúng; chi phí gọi API tăng.",
          check: "Kiểm tra đầu ra theo schema; so với bộ ví dụ có đáp án; giới hạn số lần gọi.",
        },
        {
          id: "review",
          title: "Người duyệt",
          sub: "human-in-the-loop",
          tools: "Màn hình duyệt: sửa, chấp nhận hoặc trả lại từng bản ghi.",
          risk: "Duyệt qua loa khi khối lượng lớn.",
          check: "Đánh dấu bản ghi có độ chắc thấp; lấy mẫu ngẫu nhiên để duyệt lại.",
        },
        {
          id: "db",
          title: "Cơ sở dữ liệu",
          sub: "PostgreSQL",
          tools: "PostgreSQL / Supabase, có lịch sử thay đổi.",
          risk: "Ghi đè dữ liệu đúng bằng dữ liệu sai.",
          check: "Ràng buộc trong schema; lưu ai sửa, sửa lúc nào; sao lưu định kỳ.",
        },
        {
          id: "report",
          title: "Báo cáo",
          sub: "bảng · xuất file",
          tools: "Trang tổng hợp, xuất CSV/Excel, gửi email định kỳ.",
          risk: "Số trên báo cáo lệch với số gốc.",
          check: "Đối chiếu tổng với nguồn mỗi lần chạy; ghi rõ thời điểm dữ liệu.",
        },
      ],
    },
  },
  en: {
    run: {
      title: "Try it now",
      lead: "Two small, real tools that run entirely in your browser. Sample data is included; you can also paste your own.",
      privacy: "Runs in your browser. Your data is not sent anywhere.",
      nojs: "These demos need JavaScript. What they do: (1) extract orders from messy messages with rules, (2) reconcile two CSV lists.",
      sample: "Use sample data",
      clear: "Clear",
      errors: {
        empty: "No input yet. Paste a few lines or press “Use sample data”.",
        csv: (line, code) =>
          `Invalid CSV at line ${line}: ${
            { "unclosed-quote": "unclosed quote", "stray-quote": "quote in the middle of a field", "column-count": "column count differs from the header" }[code]
          }.`,
        noKey: "The two files share no column to use as a key (e.g. sku).",
        emptyCsv: "Both CSV files are needed, each with a header row.",
      },
      extract: {
        frame: "run/extract-orders",
        title: "Extract orders from messages",
        desc: "Paste order messages (one per line) → a table of name, phone, product, quantity.",
        rules: "These are rules (regex), not AI. Anything uncertain goes to “couldn't read”, nothing is guessed.",
        inputLabel: "Order messages, one per line",
        action: "Extract",
        cols: { line: "Line", name: "Name", phone: "Phone", qty: "Qty", unit: "Unit", product: "Product" },
        noName: "(unknown)",
        ordersTitle: (n) => `${n} order${n === 1 ? "" : "s"} read`,
        unreadTitle: (n) => `Couldn't read (${n})`,
        reasons: {
          "no-phone": "no phone number",
          "bad-phone": "invalid phone number",
          "no-item": "no quantity + product found",
        },
        json: "View JSON",
      },
      reconcile: {
        frame: "run/reconcile-csv",
        title: "Reconcile two lists (CSV)",
        desc: "Paste or pick two CSV files → matching rows, rows on one side only, rows with different values. Export as CSV.",
        labelA: "List A",
        labelB: "List B",
        file: "Choose file",
        action: "Reconcile",
        download: "Download result CSV",
        summary: (r) =>
          `Key: ${r.key} · match ${r.matched} · differ ${r.mismatched} · only in A ${r.onlyA} · only in B ${r.onlyB}`,
        matched: "Match",
        mismatched: "Different values",
        onlyA: "Only in A",
        onlyB: "Only in B",
        duplicates: "Duplicate keys",
        field: "column",
      },
    },
    arch: {
      title: "How I design an automation pipeline",
      lead: "Hover or select a block to see possible tools, risks and how to check it.",
      caption: "An illustration of how I design, not any client's system.",
      detailLabel: "Selected block details",
      tools: "Tools",
      risk: "Risk",
      check: "Check",
      nodes: [
        {
          id: "source",
          title: "Source",
          sub: "form · email · files",
          tools: "Web forms, an inbox, an upload folder (CSV, PDF, images).",
          risk: "Wrong formats, duplicates, missing fields.",
          check: "Validate on arrival; keep the original for later comparison.",
        },
        {
          id: "queue",
          title: "Queue",
          sub: "job queue",
          tools: "A jobs table in PostgreSQL or a queue (e.g. Redis/BullMQ).",
          risk: "Jobs run twice or get stuck after an error.",
          check: "Unique job keys; bounded retries; alert when a job is stuck too long.",
        },
        {
          id: "process",
          title: "Processing",
          sub: "rules + model API calls",
          tools: "Rules/regex for the certain parts; a language-model API for the parts that need reading.",
          risk: "The model is wrong but looks right; API costs grow.",
          check: "Validate output against a schema; test on examples with known answers; cap calls.",
        },
        {
          id: "review",
          title: "Reviewer",
          sub: "human-in-the-loop",
          tools: "A review screen: edit, accept or send back each record.",
          risk: "Rubber-stamping when volume is high.",
          check: "Flag low-confidence records; re-review a random sample.",
        },
        {
          id: "db",
          title: "Database",
          sub: "PostgreSQL",
          tools: "PostgreSQL / Supabase with change history.",
          risk: "Good data overwritten by bad data.",
          check: "Schema constraints; record who changed what and when; regular backups.",
        },
        {
          id: "report",
          title: "Reports",
          sub: "dashboards · exports",
          tools: "Summary pages, CSV/Excel export, scheduled emails.",
          risk: "Report numbers drift from the source.",
          check: "Reconcile totals with the source on every run; show the data timestamp.",
        },
      ],
    },
  },
};
