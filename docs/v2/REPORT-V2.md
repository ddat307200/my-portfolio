# Báo cáo V2 (mục 8 của BRIEF-V2.md)

Bằng chứng nằm trong git: `git log --oneline --decorate` và `git diff --stat v1 HEAD` (60 file, +4351/−492). Bản V1 giữ ở tag `v1` (`c9a8f87`, tạo **trước** mọi thay đổi code).

## Quy trình và bằng chứng theo pha

BRIEF-V2.md và BRIEF.md được đọc đầy đủ trước khi làm (bước đầu tiên của phiên V2, trước `git init`). Mỗi pha dưới đây đã build, mở bản production (`npm run start`, `localhost:4173`) ở 1280px và 360px, đọc console, rồi mới sang pha sau.

| Pha | Commit | Đã làm | Kiểm tra trong pha |
|---|---|---|---|
| Giữ V1 | `c9a8f87` (tag `v1`) | `git init`, commit "v1 baseline" | `git status` sạch, tag trỏ đúng commit |
| V2-A | `a38da1f` | nạp lười ES module (`core.js` + chunk), tokens lưới/khung/thước đo/chấm trạng thái, tiêu đề mục `[02] services/`, giải mã chữ | 1280/360px, không tràn ngang, console sạch; JS lần đầu 1,8KB |
| V2-B | `31a6184` | terminal chạy được + boot replay, bảng lệnh Ctrl/Cmd+K, hero hai cột | hero ở trạng thái đầu/giữa/cuối; Tab gợi ý, ↑ lịch sử, Esc, không bẫy focus; 360px chữ ≥ 13px; không-JS và giảm chuyển động (ảnh headless) |
| V2-C | `c999405`, `fa4c39d` | bảng telemetry (số thật hoặc "chưa đo"), canvas 2D, `build-info.json`, script đo | số live đọc được ở 1280/360; canvas có pixel cam ≤ 25%; FPS dưới CPU 4x; Lighthouse mobile; sửa nhãn đè chữ ở 360px |
| V2-D | `25ddac3` | hai demo thật (trích xuất đơn hàng, đối chiếu CSV), sơ đồ kiến trúc động, 20 test đơn vị | ảnh demo/sơ đồ 1280 và 360, lỗi CSV hiển thị đúng, bàn phím trên sơ đồ, không-JS liệt kê đủ |
| V2-E | `f33ebf0`, `708014d`, `1325236`, `a013882` | song ngữ, SEO, README V2, workflow chạy test, tối ưu đo cuối | `/en/` không còn tiếng Việt ngoài `lang="vi"`; giảm chuyển động (không boot/canvas/dòng chảy, terminal + demo vẫn chạy); thứ tự Tab; Lighthouse 5 lần |
| Sửa theo đánh giá | `9e28c86` → `904cd7f`, `20a9b28` | nút phím tắt theo hệ điều hành, menu mobile, chữ ≥ 12px, CSS nhúng, đo lại INP | ảnh bên dưới; chi tiết trong README |

Ảnh bản cuối (`docs/v2/`): `v-top-1280.png`, `v-full-1280.png`, `v-top-360.png`, `v-menu-360.png`, `v-nojs-360.png`.

## Lighthouse mobile (13.6.0, trung vị 5 lần, ghi bởi `scripts/lighthouse.mjs`, commit `44adc60`)

| Route | Performance | A11y | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/vi/` | 97 (93–99) | 100 | 100 | 100 | 1036ms | 199ms | 0,001 |
| `/en/` | 100 (99–100) | 100 | 100 | 100 | 995ms | 90ms | 0,03 |

Ngân sách mục 4: Performance ≥ 90, A11y/BP/SEO ≥ 95 → **đạt**. LCP ≤ 2,5s, CLS ≤ 0,1 → **đạt**; phần tử LCP là đoạn chữ hero.

## JS và hiệu năng

| Chỉ tiêu | Ngân sách | Đo được |
|---|---|---|
| JS lần hiển thị đầu (gzip) | ≤ 120KB | 2,6KB |
| JS tổng sau khi nạp hết (gzip) | ≤ 300KB | 22,9KB |
| FPS dưới CPU 4x (rAF) | — | desktop 71,2; mobile 71,7 (canvas tắt trên cảm ứng) |
| INP dưới CPU 4x, Chrome có cửa sổ thật | ≤ 200ms | desktop 80–96ms; mobile 48–72ms |

Ghi chú về INP: đo bằng **headless** cho 344–500ms vì headless trễ dựng khung hình (trace: không có tác vụ nào > 14ms trên bất kỳ luồng nào; cùng lần bấm là 40ms ở Chrome thật). Vì vậy script đo dùng `HEADFUL=1`.

## Chưa đo / chưa kiểm chứng / "Sắp ra mắt"

- **Chưa thử trên thiết bị thật:** điện thoại thật (CPU 4x chỉ là giả lập), Mac thật (nhãn `⌘K` mới giả lập `navigator.userAgentData`), trình đọc màn hình thật.
- **Style & Layout** vẫn khoảng 0,8–1,0 giây trên luồng chính trong Lighthouse (trước khoảng 1,1 giây). Không nằm trong ngân sách mục 4 nhưng chưa giải quyết triệt để.
- **Dự án:** "Website & landing page" và "Tự động hóa việc lặp lại bằng AI" vẫn "Sắp ra mắt". "Công cụ web nhỏ" là "Bản chạy thử" (hai demo), **không** phải case study, không có số liệu kinh doanh, không có liên kết mã nguồn vì chưa có repo công khai.
- **Chưa đăng lên mạng:** cần repo và tên miền của chủ trang.

## Giả định

TypeScript 6.0.3 (công cụ lint chưa hỗ trợ TS 7); mô tả bản thân là bản nháp mục 11.3 chờ chủ trang duyệt; liên kết Facebook là link chia sẻ.

## Đề xuất sau

Đo INP/FPS trên điện thoại thật; tách hai demo thành repo công khai rồi mới thêm liên kết mã nguồn; giảm tiếp Style & Layout.
