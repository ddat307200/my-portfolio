# BRIEF: Website portfolio cá nhân (giao diện hội thoại AI, nền đen, tối giản)

Dành cho: Claude Opus 5.5 (mức Medium). Brief được viết cụ thể để làm đúng mà không phải đoán; chỉ hỏi lại khi bị chặn thật sự, còn lại dùng mặc định đã ghi và nêu trong báo cáo cuối.

## 0. Cách làm việc
- Làm theo các pha ở mục 9. Cuối mỗi pha: chạy build, mở trang trong trình duyệt, kiểm tra desktop + mobile, rồi báo cáo ngắn (đã làm, chưa làm, điều bất định).
- Thư mục `reference/` (`index.html` + `styles.css`) chỉ là **bản khung tham khảo nội dung** cũ, không dùng giao diện của nó. Dự án mới tạo ở **gốc thư mục này** (`D:/Features/portfolio`), không lồng thêm thư mục `web/`.
- Không bịa gì: không dự án giả, không lời chứng thực giả, không số liệu giả, không logo/khách hàng giả.
- Không đưa dự án **HoneySaaS** hay tên Pancake lên trang.
- Không dùng logo hoặc tên thương hiệu Claude/ChatGPT trong giao diện. Chỉ mượn *kiểu tương tác* (stream chữ, trạng thái đang suy nghĩ), biểu tượng và màu là của riêng trang.

## 1. Mục tiêu & khách hàng
- Chủ trang: lập trình viên full-stack muốn tự kinh doanh (dịch vụ web và tự động hóa bằng AI cho đội nhóm nhỏ), chưa có case study công khai.
- Khách chính: **song ngữ Việt–Anh**. Doanh nghiệp nhỏ Việt Nam và khách quốc tế.
- Hành động mong muốn: khách bấm liên hệ (email hoặc Zalo/Facebook) để kể một việc họ đang làm tay.
- Thông điệp một câu (VI): "Mình xây công cụ web và tự động hóa bằng AI cho những công việc lặp đi lặp lại."
  (EN): "I build web tools and AI automation for repetitive work."

## 2. Hướng thiết kế (đã chốt qua phỏng vấn)
- **Nền đen, technical, tối giản, sạch.** Hero là **giao diện hội thoại AI** (kiểu chat, không dùng thương hiệu có sẵn).
- Motion mức **Tinh tế**: ánh sáng theo chuột, hover mượt, nội dung hiện dần khi cuộn, chữ stream ở hero.
- Giọng điệu: **gần gũi, thẳng thắn**, xưng "mình", câu ngắn, nói rõ làm được gì và chưa làm được gì.

### Màu (design tokens, định nghĩa trong CSS variables)
| Token | Giá trị | Ghi chú |
|---|---|---|
| `--bg` | `#0B0B0C` | nền trang |
| `--surface` | `#141415` | thẻ, khung chat |
| `--surface-2` | `#1C1C1E` | hover, khung nhập |
| `--line` | `#2A2A2D` | viền |
| `--fg` | `#EDEDED` | chữ chính |
| `--muted` | `#9A9AA0` | chữ phụ (phải đạt tương phản ≥ 4.5:1 trên `--bg`) |
| `--accent` | `#E08A5F` | cam đất ấm, màu nhấn duy nhất |
| `--accent-hover` | `#EBA07A` | |
Chỉ dùng **một** màu nhấn. Tương phản mọi chữ ≥ 4.5:1 (WCAG AA).

### Chữ
- Chữ nội dung: Inter hoặc Geist Sans. Chữ mono (nhãn, mã, tag): JetBrains Mono hoặc Geist Mono.
- Dùng `next/font` để tự lưu font (self-host), không nạp font từ CDN lúc chạy.
- Cỡ chữ gợi ý: h1 `clamp(32px, 6vw, 56px)`, thân 16–17px, dòng 1.6.

## 3. Cấu trúc trang
Một trang cuộn (mỗi phần có `id` để neo), điều hướng cố định phía trên, nút đổi ngôn ngữ VI/EN.

1. **Hero hội thoại AI** (chi tiết mục 4).
2. **Dịch vụ & quy trình**: 3 thẻ dịch vụ (Website & landing page; Tự động hóa bằng AI & code; Hệ thống phía sau API/PostgreSQL/Docker) + 4 bước làm việc (Bạn kể bài toán → Mình làm bản mẫu nhỏ trên dữ liệu của bạn → Bạn dùng thử và kiểm tra → Ưng mới tiếp tục, phạm vi và giá thống nhất bằng văn bản).
3. **Dự án / case study**: lưới thẻ. Mỗi dự án có trang chi tiết tĩnh `/projects/[slug]` theo cấu trúc **Bài toán → Cách làm → Kết quả → Công nghệ → Liên kết (mã nguồn, demo)**. Dự án chưa có thì thẻ ghi "Sắp ra mắt" (viền nét đứt), không có liên kết giả.
4. **Về mình & stack**: ảnh đại diện (mục 11.1) + 3 câu giới thiệu (mục 11.3) + danh sách công nghệ (TypeScript, React/Next.js, Node.js, PostgreSQL, Supabase, Docker, Microservice, Tailwind CSS, extension trình duyệt MV3, tích hợp LLM API).
5. **Ghi chú kỹ thuật (blog)**: danh sách bài từ file Markdown trong `content/notes/`. Ban đầu có 1 bài mẫu đặt `draft: true` (không xuất bản).
6. **Liên hệ**: email + Zalo/Facebook (xem mục 6). Chân trang có bản quyền và liên kết GitHub.

## 4. Hero hội thoại AI (phần quan trọng nhất)
Bố cục: một khung "cửa sổ chat" rộng tối đa ~720px, giữa trang, nền `--surface`, viền `--line`, bo góc 14–16px.

Kịch bản (chạy một lần khi tải trang):
1. Tin nhắn người dùng hiện ra (gõ nhanh hoặc hiện ngay): **"Bạn làm được gì cho mình?"** / EN: **"What can you do for me?"**
2. Trạng thái **đang suy nghĩ** khoảng 800–1100ms: biểu tượng tia sáng `✦` màu `--accent` xoay chậm hoặc nhấp nháy nhẹ, kèm chữ "Đang suy nghĩ…" với hiệu ứng ánh sáng lướt qua (shimmer).
3. Câu trả lời **stream ra từng từ** (tốc độ 25–45ms mỗi từ, hơi ngẫu nhiên cho tự nhiên), có con trỏ nhấp nháy ở cuối:
   - VI: "Mình là Dang Tien Dat, lập trình viên full-stack. Mình xây công cụ web và tự động hóa bằng AI cho những việc lặp đi lặp lại trong đội nhóm nhỏ: nhập liệu, soạn thảo, đối chiếu, báo cáo. Có việc nào bạn đang làm tay mỗi tuần không?"
   - EN: "I'm Dang Tien Dat, a full-stack developer. I build web tools and AI automation for repetitive work in small teams: data entry, drafting, reconciling, reporting. Is there something you do by hand every week?"
4. Sau khi stream xong, hiện **chip gợi ý** có thể bấm: "Xem dự án", "Cách làm việc", "Liên hệ" (cuộn mượt tới phần tương ứng).
5. Nút nhỏ "Bỏ qua hoạt ảnh" hiển thị trong lúc chạy.

Quy tắc bắt buộc:
- Đây là hoạt ảnh có kịch bản, **không phải AI thật**. Ghi nhãn nhỏ, ví dụ "mô phỏng" trong thanh tiêu đề khung chat.
- **Toàn bộ văn bản cuối cùng phải có sẵn trong HTML** (cho SEO và trình đọc màn hình). Hoạt ảnh chỉ là lớp hiển thị. Khi tắt JavaScript hoặc người dùng bật `prefers-reduced-motion`, hiển thị ngay trạng thái cuối, không chạy hoạt ảnh.
- Trình đọc màn hình: không để `aria-live` đọc từng từ khi stream; đọc cả đoạn một lần.
- Đổi ngôn ngữ thì chạy lại hoặc hiện ngay trạng thái cuối bằng ngôn ngữ mới (chọn cách đơn giản hơn).

## 5. Motion (mức Tinh tế)
- **Ánh sáng theo chuột**: một vầng sáng radial rất nhẹ (`--accent` độ mờ ≤ 12%) theo vị trí con trỏ ở nền hero; thẻ có viền phát sáng (spotlight border) theo con trỏ khi rê qua. Dùng CSS variables `--mx`, `--my` cập nhật bằng `requestAnimationFrame`, không dùng thư viện nặng.
- **Hiện dần khi cuộn**: mờ → rõ, dịch lên 12px, 300–400ms, chạy một lần mỗi phần tử (IntersectionObserver hoặc `whileInView` của Motion).
- **Hover**: chuyển màu viền và nền 150–200ms. Không nảy, không xoay.
- Hiệu ứng theo chuột **tắt** trên thiết bị cảm ứng và khi `prefers-reduced-motion: reduce`.
- Không dùng three.js, GSAP hay shader trừ khi có lý do và được ghi trong báo cáo.

## 6. Liên hệ
- Hiển thị email và liên kết Zalo hoặc Facebook từ file dữ liệu `content/site.ts` (mục 7). Không có form, không backend.
- Nút "Sao chép email" (Clipboard API) có thông báo nhỏ "Đã sao chép"; nếu thất bại thì rơi về liên kết `mailto:`.
- Mọi liên kết ngoài có `rel="noopener noreferrer"`.

## 7. Kỹ thuật
- **Next.js (App Router) + TypeScript (strict) + Tailwind CSS + Motion** (gói `motion`, trước đây là framer-motion). Dùng bản ổn định mới nhất tại thời điểm làm; ghi phiên bản vào README.
- **Xuất tĩnh**: `output: 'export'`. Cho phép cấu hình `basePath` qua biến môi trường để dùng được trên GitHub Pages dạng `username.github.io/repo`.
- **Song ngữ**: hai route `/vi` và `/en`, mỗi route có `<html lang>` đúng, thẻ `hreflang` + canonical. Trang gốc `/` chuyển hướng phía client: ngôn ngữ trình duyệt bắt đầu bằng `vi` thì tới `/vi`, ngược lại `/en`; có liên kết dự phòng khi không có JS.
- **Dữ liệu nội dung tách khỏi giao diện**: `content/site.ts` (tên, email, liên kết, bio), `content/projects.ts`, `content/notes/*.md`. Văn bản VI/EN nằm trong cùng cấu trúc dữ liệu có kiểu.
- **Chỗ giữ chỗ**: mọi giá trị chưa có ghi dạng `{{...}}`. Thêm script `prebuild` **làm hỏng build** nếu còn `{{` trong dữ liệu khi build production (`NODE_ENV=production`), để không đăng nhầm.
- SEO: metadata theo trang, Open Graph + một ảnh OG tĩnh, `sitemap.xml`, `robots.txt`, JSON-LD kiểu `Person` (chỉ dùng dữ liệu đã được điền).
- Không dùng dịch vụ phân tích, không nạp script bên thứ ba. Không đặt `console.log` còn sót.

## 8. Chuẩn chất lượng (tiêu chí nghiệm thu)
Hiệu năng và truy cập, đo trên bản build production:
- Lighthouse mobile: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Core Web Vitals mục tiêu: LCP ≤ 2,5s, CLS ≤ 0,1, INP ≤ 200ms.
- JavaScript tải ban đầu cho một route ≤ 120KB gzip (ghi số thực tế vào báo cáo).
- WCAG 2.2 mức AA: tương phản, vòng focus nhìn thấy rõ (3px, màu `--accent`), thao tác được bằng bàn phím, có "Bỏ qua tới nội dung", cấu trúc heading đúng thứ tự, nhãn cho mọi nút/biểu tượng.
- Hiển thị đúng ở 360px, 768px, 1280px và 1920px; không tràn ngang.
- `prefers-reduced-motion` được tôn trọng (kiểm tra bằng cách giả lập).
- Hoạt động khi tắt JavaScript (nội dung vẫn đọc được).
- Build production thành công, `npm run lint` và `tsc --noEmit` không lỗi.
- Không còn `{{` trong dữ liệu khi build production.

## 9. Các pha làm việc
- **Pha A: nền tảng.** Tạo dự án trong gốc `D:/Features/portfolio`, cấu hình TS strict, Tailwind, font, design tokens, layout, điều hướng, đổi ngôn ngữ, route `/vi` `/en`, script `prebuild`. Kiểm tra build.
- **Pha B: hero hội thoại.** Hoạt ảnh theo mục 4, kèm chế độ giảm chuyển động và không-JS. Kiểm tra bằng ảnh chụp ở trạng thái đầu, giữa và cuối.
- **Pha C: các phần còn lại.** Dịch vụ & quy trình, dự án và trang chi tiết, về mình & stack, ghi chú, liên hệ, hiệu ứng ánh sáng theo chuột và hiện dần khi cuộn.
- **Pha D: SEO & triển khai.** Metadata, OG, sitemap, robots, JSON-LD, hướng dẫn và workflow GitHub Actions đăng lên GitHub Pages (hoặc hướng dẫn Cloudflare Pages).
- **Pha E: kiểm thử.** Chạy Lighthouse, kiểm tra bàn phím, giảm chuyển động, không-JS, mobile; sửa đến khi đạt mục 8; viết README.

## 10. Việc KHÔNG làm
- Không bịa dự án, khách hàng, lời chứng thực, số liệu, huy hiệu.
- Chỉ dùng email và số Zalo đã ghi ở mục 11.2, đặt trong `content/site.ts` (một nơi duy nhất), không rải khắp mã nguồn.
- Không dùng logo hoặc tên Claude/ChatGPT/OpenAI/Anthropic trong giao diện.
- Không thêm tính năng ngoài brief (đăng nhập, form, CMS, bảng giá) trừ khi ghi rõ là đề xuất sau.

## 11. Đầu vào của chủ trang (đã điền ngày 2026-11-14)
| Mục | Giá trị |
|---|---|
| Tên hiển thị | Dang Tien Dat (dùng nguyên như vậy ở cả VI và EN; không tự thêm dấu) |
| GitHub username | `ddat307200` (https://github.com/ddat307200). Đã kiểm tra ngày 2026-11-14: tài khoản tồn tại, tên hiển thị "dangtiendat", **chưa có repo công khai nào**. Vì vậy liên kết GitHub trên trang chỉ nên trỏ tới hồ sơ; không ghi "xem mã nguồn" ở thẻ dự án nào cho tới khi repo thật được đẩy lên. Repo hồ sơ (README) và repo trang cá nhân sẽ do chủ trang tạo sau khi dự án xong; hướng dẫn nằm trong README bạn viết ở Pha E. |
| Email công khai | d.dat307200@gmail.com |
| Zalo | 0843599995, liên kết `https://zalo.me/0843599995` |
| Facebook | Dang Tien Dat, `https://www.facebook.com/share/1FcWQj55up/?mibextid=wwXIfr` (liên kết chia sẻ, có thể hết hạn hoặc kèm tham số theo dõi; ghi trong báo cáo, xin chủ trang đường dẫn hồ sơ dạng `facebook.com/<tên>` khi có) |
| Tên miền | `dangtiendat.com` (dùng làm canonical, Open Graph, sitemap; ghi hướng dẫn trỏ DNS vào GitHub Pages hoặc Cloudflare Pages ở Pha D) |
| Giới thiệu bản thân | Chủ trang để Claude soạn; bản nháp bên dưới, chỉ dựa trên điều đã biết, không nêu số năm kinh nghiệm hay tên công ty. Chủ trang duyệt lại trước khi đăng. |
| Dự án cho 3 thẻ | Cả ba để **"Sắp ra mắt"** (viền nét đứt, không liên kết). Thẻ 1: Website & landing page. Thẻ 2: Tự động hóa việc lặp lại bằng AI. Thẻ 3: Công cụ web nhỏ. Chỉ là chỗ giữ chỗ, không mô tả kết quả. |
| Ảnh đại diện | Đã nén sẵn: `assets/avatar-400.webp` (400×400, 16KB) và `avatar-800.webp` (800×800, 42KB), cắt vuông quanh mặt. Chỉ có hai bản này trong thư mục; không có bản gốc lớn. Xem mục 11.1. |
| Trang tham chiếu | https://hovanhoa.net, xem mục 12 |

### 11.1 Dùng ảnh đại diện
- Chỉ dùng trong phần **Về mình** (khung tròn hoặc bo góc, khoảng 160–200px) và làm ảnh OG tĩnh nếu cần. Không đặt trong hero chat.
- Ảnh **đã được nén sẵn**, không cần xử lý lại: copy `avatar-400.webp` (1x) và `avatar-800.webp` (2x) vào thư mục tĩnh của dự án và dùng `srcset`. Không copy `avatar-source.png` vào `public`.
- Có `alt` mô tả ngắn, có `width`/`height` cố định để không gây CLS, tải `loading="lazy"` (không phải ảnh LCP).
- Nền ảnh là xanh lá/vàng ấm; để khung nhìn hợp trên nền đen, dùng viền `--line` mảnh, không thêm hiệu ứng.

### 11.2 Dữ liệu `content/site.ts` (giá trị khởi tạo)
```ts
export const site = {
  name: "Dang Tien Dat",
  domain: "dangtiendat.com",
  email: "d.dat307200@gmail.com",
  zalo: "https://zalo.me/0843599995",
  zaloPhone: "0843599995",
  facebook: "https://www.facebook.com/share/1FcWQj55up/?mibextid=wwXIfr",
  github: "ddat307200",
};
```
Email và số điện thoại sẽ hiển thị công khai trên trang (chủ trang đã đồng ý); ghi nhớ rằng địa chỉ email trên trang tĩnh dễ bị bot thu thập.

### 11.3 Bản nháp giới thiệu (chờ chủ trang duyệt)
- VI: "Mình là lập trình viên full-stack, quen làm từ giao diện tới API, microservice và cơ sở dữ liệu PostgreSQL. Mình dùng AI như một công cụ trong quy trình để làm nhanh các việc lặp lại, và luôn tự kiểm tra kết quả trước khi giao. Mình đang xây những dự án công khai đầu tiên, nên mình bắt đầu bằng bản mẫu nhỏ để bạn xem trước rồi mới quyết định."
- EN: "I'm a full-stack developer, comfortable from the UI to APIs, microservices and PostgreSQL. I use AI as a tool in my workflow to speed up repetitive work, and I check the results myself before handing anything over. I'm building my first public projects, so I start with a small prototype you can see before you decide."

## 12. Trang tham chiếu: hovanhoa.net
Chủ trang thích trang này. Mình đã mở và đọc. Trang đó **sáng, chữ có chân, phong cách tạp chí**, khác hướng nền đen của brief này. Vì vậy **không sao chép giao diện**; chỉ học các điểm sau:
- **Mở đầu cực ngắn:** một dòng vai trò ("Software Engineer"), một dòng chuyên môn, một đoạn tự giới thiệu 1–2 câu có cá tính. Áp dụng cho phần giới thiệu ngoài hero chat.
- **Hàng liên kết mạng xã hội gọn** ngay dưới phần giới thiệu (GitHub, Facebook, Zalo, email) dạng chữ nhỏ có biểu tượng, không dùng nút to.
- **Danh sách đánh số có nhãn loại** (ví dụ "WRITING", "DATA") cho các mục chính. Dùng cùng kiểu cho danh sách dự án và ghi chú: số thứ tự mono, tiêu đề, nhãn nhỏ viết hoa, một dòng mô tả.
- **Mục bài viết gần đây** có đủ chuyên mục, ngày, thời gian đọc ("7 min"), tiêu đề, tóm tắt hai dòng.
- **Điều hướng ngắn, tên mục một từ,** nút chính ở góc phải ("connect"). Ở đây là nút "Liên hệ"/"Contact".
- **Chuyển giao diện sáng/tối** ở góc phải: *tùy chọn đề xuất sau*, mặc định vẫn là nền đen; không làm trong lần đầu nếu làm trễ tiến độ.
- Phần "How it fits together"/trang trạng thái của họ là dành cho hệ thống nhiều site con; **không áp dụng**.
Không lấy chữ, ảnh, tên miền con hay bố cục chính xác của trang đó.

## 13. Báo cáo cuối cần có
- Việc đã làm, việc chưa làm, các giả định đã dùng.
- Kết quả Lighthouse (mobile) và dung lượng JS từng route.
- Cách chạy local, build, và đăng lên mạng.
- Danh sách `{{...}}` còn lại cần chủ trang điền.
