# BRIEF V2: bản "kỹ thuật, nặng đô" (nâng cấp trang hiện có)

Dành cho Claude Opus 5.5 (Medium). Đây là **bản nâng cấp** của trang đã chạy được ở `http://localhost:4173/vi/`. Đọc `BRIEF.md` cho bối cảnh, quy tắc cứng và dữ liệu chủ trang; file này **ghi đè** các mục nêu rõ bên dưới. Mục nào không nhắc thì giữ nguyên `BRIEF.md`.

## 0. Vì sao làm V2
Chủ trang nhận xét V1 "nhẹ nhàng, giống landing page". Mục tiêu V2: người xem (khách và nhà tuyển dụng) thấy ngay đây là một **kỹ sư làm ra thứ chạy được**, không phải trang giới thiệu. Nguyên tắc: **cái gì hoành tráng cũng phải là thật hoặc chạy thật**. Không trang trí rỗng, không số liệu giả.

## 1. Việc đầu tiên: giữ bản V1
Thư mục chưa có git. Trước khi sửa: `git init`, commit toàn bộ bản V1 với message "v1 baseline", gắn tag `v1`. Nếu không dùng git được thì sao chép `app/`, `components/`, `content/` sang `_v1-backup/` và loại khỏi build/lint. Không sửa mà không có điểm quay lại.

## 2. Ý tưởng chủ đạo: trang là một bảng điều khiển kỹ thuật
Giữ nền đen, một màu nhấn cam `#E08A5F`, font mono làm chữ chủ đạo cho nhãn, số, lệnh. Thêm: lưới 1px mờ, nhãn tọa độ `[01]`, khung viền kiểu terminal, đường kẻ đo đạc. Thêm màu trạng thái xanh lá **chỉ** cho chấm "ok/online" nhỏ; không thêm màu nhấn thứ hai.

## 3. Các khối cần xây (theo thứ tự ưu tiên)

### 3.1 Terminal tương tác ở hero (thay khung chat mô phỏng)
- Hero chia hai cột (desktop) / xếp dọc (mobile): trái là tiêu đề ngắn + tên + vai trò; phải là **terminal chạy được**.
- Có thể gõ lệnh thật (kịch bản cố định, không phải AI, và ghi rõ trong `help`): `help`, `whoami`, `ls projects`, `cat contact`, `stack`, `status`, `open <section>`, `lang vi|en`, `clear`, `sudo hire me` (in thông tin liên hệ, câu đùa nhẹ).
- Lịch sử lệnh bằng mũi tên lên/xuống, Tab để gợi ý, nhấp vào lệnh gợi ý để chạy (cho người dùng điện thoại).
- Khi mở trang, tự chạy một lần `whoami` rồi `status`, gõ từng ký tự nhanh, bỏ qua được bằng một phím hoặc nút.
- Toàn bộ nội dung lệnh cũng có trong HTML tĩnh ở các phần bên dưới. Terminal chỉ là lớp tương tác thêm; không khóa focus, `Esc` thoát ra khỏi terminal, trình đọc màn hình có nhãn rõ.
- Chuyển nhãn "mô phỏng" thành "kịch bản cố định" ở dòng đầu terminal.

### 3.2 Bảng đo đạc trực tiếp của chính trang này (telemetry)
Hiển thị bằng số **thật**, cập nhật trực tiếp:
- FPS hiện tại (đo bằng `requestAnimationFrame`), kích thước viewport, `devicePixelRatio`, số lõi (`hardwareConcurrency`) nếu có.
- LCP, CLS, INP đo bằng `PerformanceObserver` (tự viết, không thêm thư viện). Chỉ hiện giá trị khi trình duyệt hỗ trợ; nếu không thì ghi "không hỗ trợ".
- Dung lượng JS đã tải (từ Resource Timing, nếu không có thì ghi "n/a").
- Thông tin lúc build, ghi bởi script build: mã băm commit rút gọn, thời điểm build, kích thước JS gzip từng route (từ `scripts/js-size.mjs`), điểm Lighthouse **lần chạy gần nhất** đọc từ `content/lighthouse.json`. Nếu chưa đo thì hiển thị "chưa đo", **không điền số ước lượng**.
- Mỗi giá trị có nhãn nguồn nhỏ (live / build). Không bịa uptime, số lượt truy cập, số request.

### 3.3 Nền canvas phản ứng với chuột
- Canvas 2D (không three.js, không WebGL trừ khi giải trình): lưới điểm hoặc đồ thị nút-cạnh, các điểm gần con trỏ bị hút/đẩy nhẹ và nối cạnh. Rất tiết chế: ánh sáng cam ≤ 25% độ mờ, phần còn lại xám.
- Khởi tạo **sau khi trang rảnh** (`requestIdleCallback`), không làm chậm LCP. Giới hạn DPR ≤ 2, số điểm tự giảm theo FPS đo được, dừng khi tab ẩn hoặc canvas ngoài màn hình (IntersectionObserver).
- Tắt trên cảm ứng yếu, khi `prefers-reduced-motion`, và khi FPS tụt dưới 30 liên tục; thay bằng ảnh tĩnh SVG.
- Chỉ để trang trí, đặt `aria-hidden`.

### 3.4 Chạy thử ngay (2 demo thật, chạy hoàn toàn trong trình duyệt)
Phần mới "Chạy thử". Mỗi demo là một công cụ nhỏ có thật, dữ liệu mẫu có sẵn, **không gửi dữ liệu đi đâu** (ghi rõ trên giao diện), mã nằm trong `lib/demos/` để sau này tách thành repo công khai:
1. **Trích xuất dữ liệu từ văn bản lộn xộn**: dán vài dòng (ví dụ tin nhắn đặt hàng mẫu) → ra bảng/JSON (tên, số điện thoại, sản phẩm, số lượng) bằng quy tắc regex. Ghi rõ đây là quy tắc, không phải AI, và có phần "chỗ chưa đọc được" thay vì đoán.
2. **Đối chiếu hai danh sách (CSV)**: dán hoặc chọn hai CSV mẫu → hiện dòng khớp, dòng chỉ có ở một bên, dòng lệch giá trị. Có xuất kết quả ra CSV.
- Mỗi demo có nút "Dùng dữ liệu mẫu", nút xóa, trạng thái lỗi rõ ràng, thao tác được bằng bàn phím. Tải JS của demo bằng `dynamic import` khi phần này gần vào màn hình.
- Đây **không phải** case study khách hàng. Không viết kết quả, không viết "đã tiết kiệm X giờ". Thẻ dự án chỉ chuyển từ "Sắp ra mắt" sang "Bản chạy thử" khi demo xong; liên kết mã nguồn chỉ thêm khi chủ trang đã đẩy repo công khai.

### 3.5 Sơ đồ kiến trúc động (minh họa)
- SVG nội tuyến có dòng dữ liệu chạy dọc các đường nối: Nguồn (form / email / tệp) → hàng đợi → xử lý (quy tắc + gọi API mô hình) → người duyệt → cơ sở dữ liệu → báo cáo.
- Chú thích rõ **"Ví dụ minh họa cách mình thiết kế, không phải hệ thống của khách nào"**.
- Rê/nhấp vào từng nút hiện một câu giải thích kỹ thuật ngắn (công cụ có thể dùng, rủi ro, cách kiểm tra).
- Tuân thủ `prefers-reduced-motion` (đứng yên, đường nét tĩnh).

### 3.6 Bố cục và chi tiết kỹ thuật
- Điều hướng + **bảng lệnh `Ctrl/Cmd + K`** (nhảy tới phần, đổi ngôn ngữ, sao chép email).
- Tiêu đề mục kiểu `[02] projects/`, số thứ tự mono, đường kẻ ngang đo đạc.
- Hiệu ứng chữ "giải mã" (ký tự ngẫu nhiên → chữ thật, 400–600ms) cho tiêu đề mục khi hiện ra, chạy một lần, tắt khi giảm chuyển động.
- Giữ nguyên các phần V1 (dịch vụ & quy trình, về mình, ghi chú, liên hệ), nhưng làm lại thành khung mono/lưới cho đồng nhất.
- Trang vẫn **song ngữ** `/vi` và `/en`: mọi chuỗi mới (lệnh terminal, nhãn telemetry, demo) đều có đủ hai ngôn ngữ trong `content/`.

## 4. Ngân sách hiệu năng (thay đổi so với V1, có chủ ý)
V1 nhẹ nên dễ đạt 95. V2 nặng hơn nên **nới có kiểm soát**:
- **JS cần cho lần hiển thị đầu (khung trang + chữ hero)**: giữ ≤ 120KB gzip. Terminal, canvas, telemetry, demo, sơ đồ đều nạp sau (`dynamic import` hoặc sau idle).
- **Tổng JS sau khi tải hết**: ≤ 300KB gzip; vượt thì giải trình trong báo cáo.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Chạy thật và ghi số thật.
- LCP ≤ 2,5s (phần tử LCP là chữ hero, không phải canvas), CLS ≤ 0,1, INP ≤ 200ms.
- Chịu được CPU chậm: thử với giả lập CPU 4x. Nếu canvas làm tụt, giảm hoặc tắt canvas trước.
- Được phép thêm thư viện nhỏ nếu cần (ví dụ OGL, ≤ 15KB gzip) hoặc cân nhắc three.js **chỉ** khi nạp lười và đã đo; mặc định dùng Canvas 2D. Ghi lý do trong báo cáo.

## 5. Truy cập và dự phòng (không thương lượng)
- Không bật JavaScript: vẫn đọc được toàn bộ nội dung (terminal/telemetry/demo ẩn gọn hoặc hiện bản chữ tĩnh).
- `prefers-reduced-motion`: không boot sequence, không canvas, không dòng chảy, không giải mã chữ; vẫn dùng được terminal và demo.
- Bàn phím: mọi thứ thao tác được; thứ tự Tab hợp lý; không bẫy focus; vòng focus 3px màu nhấn.
- Tương phản ≥ 4.5:1 cho mọi chữ. WCAG 2.2 AA.
- Màn hình 360px: terminal chiếm hết chiều rộng, chữ không nhỏ hơn 13px, không tràn ngang.

## 6. Quy tắc trung thực (nhắc lại)
- Số trong telemetry là số đo được, hoặc ghi "chưa đo". Không điền số đẹp.
- Terminal và sơ đồ ghi rõ là kịch bản cố định/ví dụ minh họa; không giả vờ là AI hay hệ thống thật của khách.
- Demo chạy thật trên dữ liệu mẫu; không nêu tác động kinh doanh chưa có.
- Không đưa HoneySaaS/Pancake. Không dùng logo hoặc tên Claude, ChatGPT, OpenAI, Anthropic.
- Dữ liệu liên hệ chỉ lấy từ `content/site.ts`.

## 7. Các pha
- **V2-A: giữ V1 và nền móng.** Git/tag, tách thành phần dùng chung, thêm tokens mới (lưới, nhãn), cơ chế nạp lười.
- **V2-B: terminal + boot + palette `Ctrl/Cmd+K`.** Kiểm tra bàn phím, mobile, không-JS, giảm chuyển động.
- **V2-C: telemetry + canvas nền.** Đo FPS thật, kiểm tra CPU 4x, chạy Lighthouse; điều chỉnh tới khi đạt ngân sách.
- **V2-D: hai demo "Chạy thử" + sơ đồ kiến trúc động.** Có kiểm thử đơn vị cho hàm trích xuất và đối chiếu (ca bình thường, ca lỗi, ca rỗng).
- **V2-E: song ngữ đầy đủ, SEO, README, đo cuối.** Ghi điểm Lighthouse vào `content/lighthouse.json`, cập nhật workflow triển khai nếu cần.

Cuối mỗi pha: build, mở bản chạy thật, chụp desktop 1280px + mobile 360px, đọc console, báo cáo ngắn (đã làm, chưa làm, bất định).

## 8. Báo cáo cuối
- Việc đã làm / chưa làm / giả định.
- Lighthouse mobile thật, JS gzip lần đầu và tổng sau khi tải hết, FPS đo trên CPU 4x.
- Danh sách chỗ phải giữ "chưa đo" hoặc "Sắp ra mắt" vì chưa có dữ liệu thật.
- Đề xuất sau (nếu có), tách riêng khỏi phần đã làm.
